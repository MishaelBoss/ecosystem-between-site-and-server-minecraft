from django.urls import path
from .views import *

urlpatterns = [
    path('upload-image/', GalleryCreateView.as_view(), name='upload-image'),
    path('all-list-galleries/', GalleryListView.as_view(), name='all-list-galleries'),
]