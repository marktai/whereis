from rest_framework import serializers

from . import models


class BoardSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Board
        fields = ('id', 'clues', 'cards', 'answer', 'answer_cards', 'suggested_num_cards', 'suggested_possible_cards', 'created_time', 'last_updated_time')
        read_only_fields = ('id', 'answer_cards', 'suggested_possible_cards', 'created_time', 'last_updated_time')

# class GameSerializer(serializers.ModelSerializer):
#     board = BoardSerializer()
#     turn_count = serializers.IntegerField()

#     class Meta:
#         model = models.Game
#         fields = ('id', 'white_player', 'black_player', 'board', 'created_time', 'last_updated_time', 'turn_count')
#         read_only_fields = ('id', 'turn_count')
