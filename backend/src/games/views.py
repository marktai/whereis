# -*- coding: utf-8 -*-
from __future__ import unicode_literals
import random, string, re

from django.shortcuts import render, get_object_or_404

# Create your views here.

from rest_framework import viewsets, generics
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.exceptions import ValidationError
from rest_framework.parsers import MultiPartParser

from django.contrib.auth.models import User, Group
from django.db import transaction
from django.conf import settings
from django.db.models import Q

from .models import Game
from .serializers import (
    GameSerializer, BoardSerializer,
)

import sendgrid
from sendgrid.helpers.mail import Email, Content, Substitution, Mail

class OwnGameViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows a user's games to be viewed or edited.
    """
    serializer_class = GameSerializer

    def get_queryset(self):
        return self.request.user.profile.games


class MakeMoveView(APIView):
    def post(self, request, *args, **kwargs):
        game = get_object_or_404(Game, id=kwargs['game_id'])
        game.make_move(request.user.profile, request.data['uci'])

        return Response(GameSerializer(game).data)





