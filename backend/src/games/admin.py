from django.contrib import admin
from django.utils.html import mark_safe
from . import models

# Register your models here.

@admin.register(models.Location)
class LocationAdmin(admin.ModelAdmin):
    pass
