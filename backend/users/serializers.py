from rest_framework import serializers
from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from .models import *


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    username = serializers.CharField(write_only=True)
    email = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['username', 'password', 'email']

    def validate_email(self, value):
        if User.objects.filter(email__iexact=value).exists():
            raise serializers.ValidationError("Пользователь с таким email уже существует")
        return value

    def validate_username(self, value):
        if User.objects.filter(username__iexact=value).exists():
            raise serializers.ValidationError("Пользователь с таким именем уже существует")
        return value


    def create(self, validated_data):
        password = validated_data.pop('password')

        user = User.objects.create_user(
            username=validated_data['username'],
            password=password,
            email=validated_data.get('email', ''),
        )

        return user
    

class LoginSerializer(serializers.Serializer):
    email = serializers.CharField()
    password = serializers.CharField(write_only=True)

    def validate(self, data):
        email = data.get('email')
        password = data.get('password')

        users = User.objects.filter(email=email)
        if not users.exists():
            raise serializers.ValidationError("Неверные учетные данные")

        user = None
        for u in users:
            if u.check_password(password):
                user = u
                break

        if not user:
            raise serializers.ValidationError("Неверные учетные данные")

        if not user.is_active:
            raise serializers.ValidationError("Пользователь деактивирован")

        data['user'] = user
        return data