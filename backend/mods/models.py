from django.db import models
from django.conf import settings


class Mod(models.Model):
    STATUS = [
        ('pending', 'в ожидании'),
        ('approved', 'одобренный'),
        ('rejected', 'отклоненный')
    ]

    CATEGORY = [
        ('core', 'Основные'),
        ('world', 'Мир'),
        ('tech', 'Техника'),
        ('magic', 'Магия'),
        ('utility', 'Утилиты'),
        ('other', 'Другое')
    ]

    author = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name='uploaded_mods',
        verbose_name='Автор'
    )
    title = models.CharField(max_length=200, verbose_name="Название мода")
    description = models.TextField(blank=True, default='', verbose_name='Описание')
    file = models.FileField(upload_to='mods/', verbose_name='Файл мода')
    version = models.CharField(max_length=50, default='1.0', verbose_name='Версия')
    category = models.CharField(max_length=20, choices=CATEGORY, default='other', verbose_name='Категория')
    status = models.CharField(max_length=20, choices=STATUS, default='pending', verbose_name='Статус')
    downloads = models.PositiveIntegerField(default=0, verbose_name='Скачивания')
    uploaded_at = models.DateTimeField(auto_now_add=True, verbose_name='Дата загрузки')

    class Meta:
        verbose_name = 'Мод'
        verbose_name_plural = 'Моды'
        ordering = ['-uploaded_at']

    def __str__(self):
        return self.title