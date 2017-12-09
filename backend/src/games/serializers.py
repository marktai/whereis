from rest_framework import serializers

from users.serializers import ProfileSerializer

from . import models


class BoardSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Board
        fields = ('id', 'turn_count', 'fen', 'created_time')
        read_only_fields = fields

class GameSerializer(serializers.ModelSerializer):
    board = BoardSerializer()
    white_player = ProfileSerializer()
    black_player = ProfileSerializer()

    class Meta:
        model = models.Game
        fields = ('id', 'white_player', 'black_player', 'board', 'created_time', 'last_updated_time')
