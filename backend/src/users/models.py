# -*- coding: utf-8 -*-
from __future__ import unicode_literals
import random, string

from django.db import models
from django.contrib.postgres.fields import ArrayField

from django.contrib.auth.models import User

# Create your models here.
class Profile(models.Model):

    VERIFICATION_CHAR_NUM = 10
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    verified = models.BooleanField(default=False)
    verification_code = models.CharField(max_length=VERIFICATION_CHAR_NUM, null=True, default=None, blank=True)
    picture = models.ImageField(upload_to='profile_pictures/', null=True, blank=True, default='profile_pictures/default_pic.jpg')

    @staticmethod
    def generate_verification_code():
        return ''.join(random.choices(string.ascii_uppercase+string.digits, k=Profile.VERIFICATION_CHAR_NUM))

    @property
    def games(self):
        from games.models import Game
        return Game.objects.filter(Q(white_player=self) | Q(black_player=self))

    def __str__(self):
        return str(self.user)
