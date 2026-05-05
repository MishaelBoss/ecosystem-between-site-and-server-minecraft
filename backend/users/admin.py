from django.contrib import admin
from .models import *

from django.contrib.auth.admin import UserAdmin

class CustomUserAdmin(UserAdmin):
    list_display = ('username', 'email', 'first_name', 'last_name', 'is_staff', 'coins')
    fieldsets = UserAdmin.fieldsets + (
        ('Economy', {'fields': ('coins',)}),
    )

admin.site.register(User, CustomUserAdmin)