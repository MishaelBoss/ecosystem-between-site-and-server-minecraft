from django.shortcuts import render, get_object_or_404
from .models import Mod
from .serializers import ModSerializer
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated, AllowAny, IsAdminUser
from rest_framework.response import Response
from rest_framework import status
from django.db import transaction
from django.db.models import Q


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