from rest_framework import serializers

from . import models

class LocationSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Location
        fields = ('id', 'created_time', 'latitude', 'longitude', 'client_timestamp', 'battery')
        read_only_fields = ('id', 'created_time', 'client_timestamp')
