from django.urls import path
from .views import *

urlpatterns = [
    path('server-status/', server_status, name='server_status'),
]