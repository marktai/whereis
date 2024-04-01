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
from django.shortcuts import redirect
from django.http import Http404


from .serializers import *
from .models import *

import requests

class AddLocationView(APIView):
    def post(self, request, *args, **kwargs):
        new = Location.objects.create(
            latitude=request.data['lat'],
            longitude=request.data['lon'],
            client_timestamp=datetime.utcfromtimestamp(request.data['tst']),
            battery=request.data['batt'],
            raw_json=dict(request.data),
        )

        return Response(LocationSerializer(new).data)

class LaYesterdayMedianLocationView(APIView):
    def get(self, request, *args, **kwargs):
        daily = Location.objects.la_yesterday_median_location()

        return Response(LocationSerializer(daily).data)
