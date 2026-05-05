from django.db import models

class News(models.Model):
    CATEGORY_CHOICES = [
        ('Обновление', 'Обновление'),
        ('Событие', 'Событие'),
        ('Техническое', 'Техническое'),
        ('Анонс', 'Анонс'),
        ('Конкурс', 'Конкурс'),
    ]
        
    title = models.CharField(max_length=255)
    content = models.TextField()
    excerpt = models.CharField(max_length=500, blank=True, verbose_name="Краткий анонс")
    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES, default='Обновление', verbose_name="Категория")
    author = models.CharField(max_length=100, default="Администрация", verbose_name="Автор")
    image = models.ImageField(upload_to='news_images/', null=True, blank=True, verbose_name="Изображение")
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Дата создания")

    @property
    def category_color(self):
        colors = {
            'Обновление': '#e0195a',
            'Событие': '#818cf8',
            'Техническое': '#fb923c',
            'Анонс': '#34d399',
            'Конкурс': '#f59e0b',
        }
        return colors.get(self.category, '#ffffff')

    def __str__(self):
        return self.title

    class Meta:
        verbose_name = "Новость"
        verbose_name_plural = "Новости"
        ordering = ['-created_at']