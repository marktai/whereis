from rest_framework import serializers

import .models


class BoardSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Board
        fields = ('turn_count', 'fen', 'created_time')
        read_only_fields = fields

class GameSerializer(serializers.ModelSerializer):
    board = BoardSerializer(source='board')

    class Meta:
        model = models.Game
        fields = ('white_player', 'black_player', 'created_time', 'last_updated_time')
