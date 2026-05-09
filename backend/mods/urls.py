from django.urls import path
from .views import *

urlpatterns = [
    # Публичные endpoints
    path('mods/', ModListView.as_view(), name='mod-list'),
    path('mods/<int:pk>/', ModDetailView.as_view(), name='mod-detail'),
    path('mods/<int:pk>/download/', ModDownloadView.as_view(), name='mod-download'),
    path('mods/download-all/', ModDownloadAllView.as_view(), name='mod-download-all'),
    
    # Админские endpoints
    path('admin/mods/', ModAdminListView.as_view(), name='admin-mod-list'),
    path('admin/mods/create/', ModCreateView.as_view(), name='admin-mod-create'),
    path('admin/mods/<int:pk>/', ModUpdateView.as_view(), name='admin-mod-update'),
    path('admin/mods/<int:pk>/approve/', ModApproveView.as_view(), name='admin-mod-approve'),
    path('admin/mods/<int:pk>/reject/', ModRejectView.as_view(), name='admin-mod-reject'),
    
    # Массовая загрузка модов
    path('admin/mods/batch-upload/', ModBatchUploadView.as_view(), name='admin-mod-batch-upload'),
    path('admin/mods/batch-upload/<str:batch_id>/', ModBatchProgressView.as_view(), name='admin-mod-batch-progress'),
]