# -*- coding: utf-8 -*-
from __future__ import unicode_literals
import random, string

from django.db import models, transaction
from django.contrib.postgres.fields import ArrayField

from django.contrib.auth.models import User

from rest_framework import exceptions as drf_exceptions

import chess

# Create your models here.
class Game(models.Model):
    class PlayerError(drf_exceptions.ValidationError):
        """Exception thrown when incorrect player tries to move"""
        pass
    class MoveError(drf_exceptions.ValidationError):
        """Exception thrown when move is illegal"""
        pass

    white_player = models.ForeignKey('users.Profile', on_delete=models.SET_NULL, null=True, related_name='white_games')
    black_player = models.ForeignKey('users.Profile', on_delete=models.SET_NULL, null=True, related_name='black_games')
    created_time = models.DateTimeField(auto_now_add=True)
    last_updated_time = models.DateTimeField(auto_now=True)

    def __str__(self):
        return 'Game between %s and %s' % (self.white_player, self.black_player)

    @property
    def board(self):
        return self.board_set.last()

    @property
    def turn_count(self):
        return self.board.turn_count
    
    @transaction.atomic
    def make_move(self, player, uci):
        if self.turn_count % 2 == 0 and player != self.white_player:
            raise self.PlayerError('It is white\'s turn (%s)' % self.white_player)
        if self.turn_count % 2 == 1 and player != self.black_player:
            raise self.PlayerError('It is black\'s turn (%s)' % self.black_player)

        board = self.board.make_move(uci)
        if board is None:
            raise self.MoveError('%s is an invalid move' % uci)

        return board

    def save(self, *args, **kwargs):
        ret = super().save(*args, **kwargs)

        if self.board is None:
            init_board = Board(game=self)
            init_board.save()

        return ret


class Board(models.Model):
    turn_count = models.IntegerField(default=0)
    fen = models.CharField(max_length=100, default='rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w AHah - 0 1')
    game = models.ForeignKey(Game, on_delete=models.CASCADE)
    created_time = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return '%s for %s' % (self.fen, self.game)

    def chess_board(self):
        if not hasattr(self, '_fen_stale') or self._fen_stale != self.fen:
            self._chess_board = chess.Board(self.fen, chess960=True)
            self._fen_stale = self.fen
        return self._chess_board

    # returns new board or None
    def make_move(self, uci):
        try:
            move = self.chess_board().parse_uci(uci)

            new_chess_board = chess.Board(self.fen, chess960=True)
            new_chess_board.push(move)

            new_board = Board(
                turn_count=self.turn_count+1, 
                fen=new_chess_board.fen(shredder=True),
                game=self.game,
            )

            new_board.save()
            return new_board

        except ValueError as e: # invalid move
            return None
