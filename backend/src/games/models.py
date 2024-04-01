from django.db import models
import json, random, string, os, statistics

from django.db import models, transaction
from django_jsonform.models.fields import ArrayField

from rest_framework import exceptions as drf_exceptions
from datetime import datetime, timedelta
from dateutil import parser
import pytz
from django.db.models import Q


class LocationManager(models.Manager):
    def la_day_before_range(self, utc_now=None):
        la_tz = pytz.timezone('America/Los_Angeles')
        if utc_now is None:
            utc_now = datetime.utcnow()
        la_now = utc_now.replace(tzinfo=pytz.utc).astimezone(la_tz)
        la_day_begin = datetime(la_now.year, la_now.month, la_now.day,  hour=0, minute=0, second=0, microsecond=0).astimezone(la_tz)
        return (la_day_begin - timedelta(days=1), la_day_begin)

    def la_yesterday_median_location(self, utc_now=None):
        start, end = self.la_day_before_range(utc_now)

        yesterday_locations = self.filter(
            created_time__gte=start,
            created_time__lte=end,
        )

        if not yesterday_locations:
            return None

        median_location = yesterday_locations[0]

        median_location.latitude = statistics.median([x.latitude for x in yesterday_locations])
        median_location.longitude = statistics.median([x.longitude for x in yesterday_locations])

        return median_location

class Location(models.Model):
    objects = LocationManager()

    created_time = models.DateTimeField(auto_now_add=True)

    # example: 1.0130890038410445
    latitude = models.DecimalField( 
        max_digits = 20, 
        decimal_places = 17,
    ) 

    # example: 127.47032064231337
    longitude = models.DecimalField( 
        max_digits = 20, 
        decimal_places = 17,
    ) 
    client_timestamp = models.DateTimeField()
    battery = models.FloatField(null=True, blank=True) # battery percentage
    raw_json = models.JSONField()