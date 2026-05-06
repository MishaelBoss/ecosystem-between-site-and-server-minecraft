from django.contrib import admin
from .models import *
from django.contrib.auth.admin import UserAdmin

class CustomUserAdmin(UserAdmin):
    list_display = ('username', 'email', 'coins', 'mc_uuid', 'is_staff')
    
    fieldsets = UserAdmin.fieldsets + (
        ('Minecraft Data', {'fields': ('coins', 'mc_uuid')}),
    )
    
    add_fieldsets = UserAdmin.add_fieldsets + (
        ('Minecraft Data', {'fields': ('coins', 'mc_uuid')}),
    )

admin.site.register(User, CustomUserAdmin)