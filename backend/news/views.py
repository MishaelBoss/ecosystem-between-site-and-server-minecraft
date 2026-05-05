from rest_framework.permissions import AllowAny, IsAdminUser
from .models import News
from .serializers import NewsSerializer
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404
from users.authentication import CookieJWTAuthentication


class AllListNews(APIView):
    def get_permissions(self):
        if self.request.method == 'GET':
            return [AllowAny()]
        return [IsAdminUser()]

    authentication_classes = [CookieJWTAuthentication]

    def get(self, request):
        news = News.objects.all().order_by('-created_at')
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

    def post(self, request):
        serializer = NewsSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    

class NewsDetailView(APIView):
    def get_permissions(self):
        if self.request.method == 'GET':
            return [AllowAny()]
        return [IsAdminUser()]

    authentication_classes = [CookieJWTAuthentication]

    def get(self, request, id):
        news = get_object_or_404(News, id=id)
        serializer = NewsSerializer(news, context={'request': request})
        return Response(serializer.data)

    def patch(self, request, id):
        news = get_object_or_404(News, id=id)
        serializer = NewsSerializer(news, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, id):
        news = get_object_or_404(News, id=id)
        news.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)