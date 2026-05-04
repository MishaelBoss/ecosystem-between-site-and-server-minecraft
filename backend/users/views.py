from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializers import *
from rest_framework_simplejwt.tokens import RefreshToken
from django.conf import settings
from .models import *
from rest_framework.permissions import IsAuthenticated, AllowAny
from .authentication import CookieJWTAuthentication
from django.contrib.auth import logout


class RegisterView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            serializer = LoginSerializer(data=request.data)
            serializer.is_valid(raise_exception=True)

            user = serializer.validated_data['user']
            refresh = RefreshToken.for_user(user)

            access_token = str(refresh.access_token)
            refresh_token = str(refresh)

            response = Response({"message": "Успех"}, status=status.HTTP_201_CREATED)

            response.set_cookie(
                key='access_token',
                value=access_token,
                httponly=True,
                secure=not settings.DEBUG,
                samesite='Lax',
                max_age=3600
            )

            response.set_cookie(
                key='refresh_token',
                value=refresh_token,
                httponly=True,
                secure=not settings.DEBUG,
                samesite='Lax',
                max_age=3600 * 24 * 7
            )
            return response
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    

class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        user = serializer.validated_data['user']
        refresh = RefreshToken.for_user(user)

        access_token = str(refresh.access_token)
        refresh_token = str(refresh)

        response = Response({
            "message": "Вход выполнен успешно",
            "email": user.email
        }, status=status.HTTP_200_OK)

        response.set_cookie(
            key='access_token',
            value=access_token,
            httponly=True,
            secure=not settings.DEBUG,
            samesite='Lax',
            max_age=3600
        )

        response.set_cookie(
            key='refresh_token',
            value=refresh_token,
            httponly=True,
            secure=not settings.DEBUG,
            samesite='Lax',
            max_age=3600 * 24 * 7
        )

        return response
    


class UserStatusView(APIView):
    authentication_classes = [CookieJWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user

        return Response({
                "is_authenticated": True,
                "username": user.username,
                "email": user.email,
            })
    

class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        logout(request) 

        response = Response({"message": "Успешный выход"}, status=status.HTTP_200_OK)

        response.delete_cookie('access_token', path='/')
        response.delete_cookie('refresh_token', path='/')
        response.delete_cookie('csrftoken', path='/')

        return response