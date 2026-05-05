from django.urls import path
from .views import *

urlpatterns = [
    path('all-list-news/', AllListNews.as_view(), name='all-list-news'),
    path('news/<int:id>/', NewsDetailView.as_view(), name='news-detail'),
]