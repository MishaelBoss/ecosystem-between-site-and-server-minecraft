from django.urls import path
from .views import *

urlpatterns = [
    path('upload-image/', GalleryCreateView.as_view(), name='upload-image'),
    path('all-list-galleries/', GalleryListView.as_view(), name='all-list-galleries'),
    path('gallery/', GalleryListView.as_view()),
    path('gallery/create/', GalleryCreateView.as_view()),
    path('gallery/<int:pk>/approve/', GalleryApproveView.as_view()),
    path('gallery/<int:pk>/reject/', GalleryRejectView.as_view()),
    path('gallery/<int:pk>/undo/', GalleryUndoView.as_view()),
]