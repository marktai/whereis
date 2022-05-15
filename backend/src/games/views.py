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

from .serializers import *
from .models import *

import requests

class BoardViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows games to be viewed or edited
    """
    serializer_class = BoardSerializer
    queryset = Board.objects.all()

    def create(self, request, *args, **kwargs):
        new_board = Board.objects.create_board()
        return Response(BoardSerializer(new_board).data)
