from rest_framework.permissions import AllowAny
from .models import News
from .serializers import NewsSerializer
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404


class AllListNews(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        news = News.objects.all().order_by('-created_at')
        news = News.objects.all()
        data = []

        for n in news:
            data.append({
                'id': n.id,
                'title': n.title,
                'excerpt': n.excerpt,
                'category': n.category,
                'categoryColor': n.category_color,
                'author': n.author,
                'date': n.created_at,
                'image': request.build_absolute_uri(n.image.url) if n.image else None,
                'content': n.content,
                })
        
        return Response(data, status=status.HTTP_200_OK)
    

class NewsDetailView(APIView):
    permission_classes = [AllowAny]

    def get(data, request, id):
        news = get_object_or_404(News, id=id)

        serializer = NewsSerializer(news, context={'request': request})
        
        return Response(serializer.data)