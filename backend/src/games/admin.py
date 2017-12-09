# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.contrib import admin
from . import models

# Register your models here.


@admin.register(models.Game)
class GameAdmin(admin.ModelAdmin):
    pass

@admin.register(models.Board)
class GameAdmin(admin.ModelAdmin):
    pass