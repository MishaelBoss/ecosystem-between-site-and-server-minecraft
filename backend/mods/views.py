from django.shortcuts import get_object_or_404
from .models import Mod
from .serializers import ModSerializer
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated, AllowAny, IsAdminUser
from rest_framework.response import Response
from rest_framework import status
from rest_framework.parsers import MultiPartParser, FormParser
from django.db import transaction
from django.db.models import Q
import os
import zipfile
import tempfile
import shutil
import threading
import logging
from django.conf import settings
from django.core.files.base import ContentFile
from django.core.files import File

logger = logging.getLogger(__name__)


class ModListView(APIView):
    """Получение списка всех одобренных модов (для игроков)"""
    permission_classes = [AllowAny]
    authentication_classes = []

    def get(self, request):
        category = request.query_params.get('category')
        search = request.query_params.get('search')
        
        mods = Mod.objects.filter(status='approved').select_related('author')
        
        if category:
            mods = mods.filter(category=category)
        
        if search:
            mods = mods.filter(
                Q(title__icontains=search) | Q(description__icontains=search)
            )
        
        serializer = ModSerializer(mods, many=True, context={'request': request})
        return Response(serializer.data)


class ModAdminListView(APIView):
    """Получение списка всех модов (для администраторов)"""
    permission_classes = [IsAdminUser]

    def get(self, request):
        status_filter = request.query_params.get('status')
        mods = Mod.objects.select_related('author').all()
        
        if status_filter:
            mods = mods.filter(status=status_filter)
        
        serializer = ModSerializer(mods, many=True, context={'request': request})
        return Response(serializer.data)


class ModCreateView(APIView):
    """Загрузка нового мода (только администраторы)"""
    permission_classes = [IsAdminUser]
    parser_classes = [MultiPartParser, FormParser]

    def post(self, request):
        serializer = ModSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            serializer.save(author=request.user, status='approved')
            return Response(
                {"message": "Мод успешно загружен", "data": serializer.data},
                status=status.HTTP_201_CREATED
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ModDetailView(APIView):
    """Получение деталей конкретного мода"""
    permission_classes = [AllowAny]
    authentication_classes = []

    def get(self, request, pk):
        mod = get_object_or_404(Mod, pk=pk)
        serializer = ModSerializer(mod, context={'request': request})
        return Response(serializer.data)


class ModUpdateView(APIView):
    """Обновление мода (только администраторы)"""
    permission_classes = [IsAdminUser]

    def patch(self, request, pk):
        mod = get_object_or_404(Mod, pk=pk)
        serializer = ModSerializer(mod, data=request.data, partial=True, context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "Мод успешно обновлен", "data": serializer.data})
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        mod = get_object_or_404(Mod, pk=pk)
        mod.delete()
        return Response({"message": "Мод успешно удален"}, status=status.HTTP_200_OK)


class ModApproveView(APIView):
    """Одобрение мода (только администраторы)"""
    permission_classes = [IsAdminUser]

    def post(self, request, pk):
        mod = get_object_or_404(Mod, pk=pk)

        if mod.status == 'approved':
            return Response(
                {"message": "Мод уже одобрен"},
                status=status.HTTP_400_BAD_REQUEST
            )

        with transaction.atomic():
            mod.status = 'approved'
            mod.save(update_fields=['status'])

        return Response({
            "message": f"Мод '{mod.title}' одобрен.",
            "mod_id": mod.id,
        })


class ModRejectView(APIView):
    """Отклонение мода (только администраторы)"""
    permission_classes = [IsAdminUser]

    def post(self, request, pk):
        mod = get_object_or_404(Mod, pk=pk)

        if mod.status == 'rejected':
            return Response(
                {"message": "Мод уже отклонен"},
                status=status.HTTP_400_BAD_REQUEST
            )

        with transaction.atomic():
            mod.status = 'rejected'
            mod.save(update_fields=['status'])

        return Response({
            "message": f"Мод '{mod.title}' отклонен.",
            "mod_id": mod.id,
        })


class ModDownloadView(APIView):
    """Увеличение счетчика скачиваний"""
    permission_classes = [AllowAny]
    authentication_classes = []

    def post(self, request, pk):
        mod = get_object_or_404(Mod, pk=pk, status='approved')
        
        with transaction.atomic():
            mod.downloads += 1
            mod.save(update_fields=['downloads'])
        
        return Response({
            "message": "Скачивание зафиксировано",
            "downloads": mod.downloads
        })


# ===== НОВОЕ: массовая загрузка модов =====

# Хранилище прогресса в памяти (для демонстрации)
# В продакшене лучше использовать Redis
batch_progress_store = {}


class ModBatchUploadView(APIView):
    """Массовая загрузка модов (только администраторы)
    Обрабатывает файлы синхронно и возвращает результат сразу.
    """
    permission_classes = [IsAdminUser]
    parser_classes = [MultiPartParser, FormParser]

    def post(self, request):
        files = request.FILES.getlist('files')
        archive = request.FILES.get('archive')

        if not files and not archive:
            return Response(
                {"error": "Не загружено ни одного файла. Отправьте .jar файлы или .zip архив."},
                status=status.HTTP_400_BAD_REQUEST
            )

        temp_dir = tempfile.mkdtemp()
        jar_files = []
        results = []

        try:
            # Если есть архив - распаковываем
            if archive:
                archive_path = os.path.join(temp_dir, archive.name)
                with open(archive_path, 'wb+') as f:
                    for chunk in archive.chunks():
                        f.write(chunk)
                
                with zipfile.ZipFile(archive_path, 'r') as zf:
                    for name in zf.namelist():
                        if name.endswith('.jar'):
                            zf.extract(name, temp_dir)
                            jar_files.append(os.path.join(temp_dir, name))

            # Если есть отдельные файлы
            for f in files:
                if f.name.endswith('.jar'):
                    file_path = os.path.join(temp_dir, f.name)
                    with open(file_path, 'wb+') as fh:
                        for chunk in f.chunks():
                            fh.write(chunk)
                    jar_files.append(file_path)

            for jar_path in jar_files:
                try:
                    file_name = os.path.basename(jar_path)
                    mod_name = os.path.splitext(file_name)[0]
                    
                    # Пробуем извлечь версию из имени файла
                    version = '1.0'
                    import re
                    version_match = re.search(r'[\d]+\.[\d]+(\.[\d]+)?', file_name)
                    if version_match:
                        version = version_match.group()

                    # Создаём запись мода
                    mod = Mod(
                        author=request.user,
                        title=mod_name,
                        version=version,
                        status='approved',
                    )
                    
                    # Сохраняем файл через File с файловым дескриптором (без загрузки в память)
                    with open(jar_path, 'rb') as jf:
                        mod.file.save(file_name, File(jf))
                    
                    mod.save()

                    results.append({
                        'name': file_name,
                        'title': mod_name,
                        'status': 'success',
                    })

                except Exception as e:
                    results.append({
                        'name': os.path.basename(jar_path),
                        'title': os.path.splitext(os.path.basename(jar_path))[0],
                        'status': 'error',
                        'error': str(e),
                    })

        except Exception as e:
            logger.error(f"Batch upload error: {e}", exc_info=True)
            return Response({
                "status": "error",
                "error": str(e),
                "items": results,
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        finally:
            shutil.rmtree(temp_dir, ignore_errors=True)

        total = len(jar_files)
        completed = sum(1 for r in results if r['status'] == 'success')
        failed = sum(1 for r in results if r['status'] == 'error')

        return Response({
            "status": "done",
            "total": total,
            "completed": completed,
            "failed": failed,
            "items": results,
        })


class ModBatchProgressView(APIView):
    """Получение прогресса массовой загрузки"""
    permission_classes = [IsAdminUser]

    def get(self, request, batch_id):
        progress = batch_progress_store.get(batch_id)
        if not progress:
            return Response(
                {"error": "Загрузка не найдена"},
                status=status.HTTP_404_NOT_FOUND
            )
        return Response(progress)