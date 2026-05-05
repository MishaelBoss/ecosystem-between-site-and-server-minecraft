from django.shortcuts import render
from .models import *
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated, AllowAny, IsAdminUser
from .serializers import *
from rest_framework.response import Response
from rest_framework import status
from django.db import transaction
from django.shortcuts import get_object_or_404


class GalleryCreateView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializers = GallerySerializer(data=request.data)
        if serializers.is_valid():
            serializers.save(author=request.user)
            return Response(
                {"message": "Картинка успешно загружена", "data": serializers.data},
                status=status.HTTP_201_CREATED
            )
        return Response(serializers.errors, status=status.HTTP_400_BAD_REQUEST)
    

class GalleryListView(APIView):
    permission_classes = [AllowAny]
    authentication_classes = []

    def get(self, request):
        galleries = Galleries.objects.select_related('author').all()
        data = []

        for g in galleries:
            if isinstance(g.tags, str):
                g.tags = [tag.strip() for tag in g.tags.split(',') if tag.strip()]
                g.save(update_fields=['tags'])

            data.append({
                'id': g.id,
                'name': g.title,
                'image': request.build_absolute_uri(g.image.url) if g.image else None,
                'status': g.status,
                'coins': g.coins,
                'tags': g.tags,
                'uploaded_at': g.uploaded_at,
                'author': g.author.username if g.author else None,
            })

        return Response(data)
    

class GalleryApproveView(APIView):
    permission_classes = [IsAdminUser]

    def post(self, request, pk):
        gallery = get_object_or_404(Galleries, pk=pk)

        if gallery.status == 'approved':
            return Response(
                {"message": "Работа уже одобрена"},
                status=status.HTTP_400_BAD_REQUEST
            )

        coins_to_award = request.data.get('coins', gallery.coins or 100)

        try:
            coins_to_award = int(coins_to_award)
            if coins_to_award < 0:
                raise ValueError
        except (ValueError, TypeError):
            return Response(
                {"message": "Некорректное количество монет"},
                status=status.HTTP_400_BAD_REQUEST
            )

        with transaction.atomic():
            gallery.status = 'approved'
            gallery.coins = coins_to_award
            gallery.save(update_fields=['status', 'coins'])

            if gallery.author:
                gallery.author.coins += coins_to_award
                gallery.author.save(update_fields=['coins'])

        return Response({
            "message": f"Работа одобрена. Игроку {gallery.author.username if gallery.author else '?'} начислено {coins_to_award} монет.",
            "gallery_id": gallery.id,
            "coins_awarded": coins_to_award,
            "author_total_coins": gallery.author.coins if gallery.author else None,
        })


class GalleryRejectView(APIView):
    permission_classes = [IsAdminUser]

    def post(self, request, pk):
        gallery = get_object_or_404(Galleries, pk=pk)

        if gallery.status == 'rejected':
            return Response(
                {"message": "Работа уже отклонена"},
                status=status.HTTP_400_BAD_REQUEST
            )

        with transaction.atomic():
            if gallery.status == 'approved' and gallery.author and gallery.coins > 0:
                gallery.author.coins = max(0, gallery.author.coins - gallery.coins)
                gallery.author.save(update_fields=['coins'])

            gallery.status = 'rejected'
            gallery.save(update_fields=['status'])

        return Response({
            "message": "Работа отклонена.",
            "gallery_id": gallery.id,
        })


class GalleryUndoView(APIView):
    permission_classes = [IsAdminUser]

    def post(self, request, pk):
        gallery = get_object_or_404(Galleries, pk=pk)

        if gallery.status == 'pending':
            return Response(
                {"message": "Работа уже на проверке"},
                status=status.HTTP_400_BAD_REQUEST
            )

        with transaction.atomic():
            if gallery.status == 'approved' and gallery.author and gallery.coins > 0:
                gallery.author.coins = max(0, gallery.author.coins - gallery.coins)
                gallery.author.save(update_fields=['coins'])

            gallery.status = 'pending'
            gallery.save(update_fields=['status'])

        return Response({
            "message": "Работа возвращена на проверку.",
            "gallery_id": gallery.id,
        })