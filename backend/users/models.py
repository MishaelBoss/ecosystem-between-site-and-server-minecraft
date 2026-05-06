from django.db import models
from django.contrib.auth.models import AbstractUser

# Create your models here.
class User(AbstractUser):
    coins = models.PositiveIntegerField(default=0)
    mc_uuid = models.CharField(max_length=36, null=True, blank=True, unique=True)