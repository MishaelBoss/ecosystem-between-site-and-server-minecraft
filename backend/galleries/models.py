from django.db import models
from django.conf import settings
from django.contrib.postgres.fields import ArrayField

# Create your models here.
class Galleries(models.Model):
    STATUS = [
        ('pending', 'в ожидании'),
        ('approved', 'одобренный'),
        ('rejected', 'отклоненный')
    ]

    author = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, null=True, blank=True, related_name='created_gallery', verbose_name='Автор')
    title = models.CharField(max_length=120, verbose_name="Название скрина")
    image = models.ImageField(upload_to='gallery', verbose_name='Картинка')
    status = models.CharField(max_length=20, choices=STATUS, default='pending')
    coins = models.PositiveIntegerField(default=0, verbose_name="Монеты")
    tags = ArrayField(models.CharField(max_length=50), blank=True, default=list, verbose_name="Теги")
    uploaded_at = models.DateTimeField(auto_now_add=True) 