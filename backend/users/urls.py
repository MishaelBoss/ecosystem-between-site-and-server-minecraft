from django.urls import path
from .views import *

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('is_authenticated/', UserStatusView.as_view(), name='is_authenticated'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('minecraft/', MinecraftAuthView.as_view(), name='minecraft_auth'),
    path('register_mc/', MinecraftRegisterView.as_view(), name='minecraft_register'),
    path('economy/', MinecraftEconomyView.as_view(), name='minecraft_economy'),
]