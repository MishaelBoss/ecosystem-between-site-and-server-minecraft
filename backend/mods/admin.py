from django.contrib import admin
from .models import Mod


@admin.register(Mod)
class ModAdmin(admin.ModelAdmin):
    list_display = ('title', 'version', 'category', 'status', 'author', 'downloads', 'uploaded_at')
    list_filter = ('status', 'category', 'uploaded_at')
    search_fields = ('title', 'description', 'author__username')
    readonly_fields = ('uploaded_at', 'downloads')
    list_editable = ('status',)
    
    fieldsets = (
        ('Основная информация', {
            'fields': ('title', 'description', 'author', 'file', 'version')
        }),
        ('Классификация', {
            'fields': ('category', 'status')
        }),
        ('Статистика', {
            'fields': ('downloads', 'uploaded_at'),
            'classes': ('readonly',)
        }),
    )