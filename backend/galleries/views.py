from django.shortcuts import render
from .models import *
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated, AllowAny
from .serializers import *
from rest_framework.response import Response
from rest_framework import status


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