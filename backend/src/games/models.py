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

        try:
            board = self.board.make_move(uci)
        except ValueError as e: # invalid move
            raise self.MoveError('%s is an invalid move because of %s' % (uci, e))

        return board

    def save(self, *args, **kwargs):
        ret = super().save(*args, **kwargs)

        if self.board is None:
            init_board = Board.bad_board(game=self)
            init_board.save()

        return ret


class Board(models.Model):
    turn_count = models.IntegerField(default=0)
    fen = models.CharField(max_length=100, default='rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w AHah - 0 1')
    game = models.ForeignKey(Game, on_delete=models.CASCADE)
    created_time = models.DateTimeField(auto_now_add=True)
    last_updated_time = models.DateTimeField(auto_now=True)

    # probabilities are normalized later
    correct_distribution = {
        'p': 8,
        'r': 2,
        'n': 2,
        'b': 2,
        'q': 1,
    }

    # distribution is a dictionary of pieces to their proportional frequencies

    @classmethod    
    def generate_bad_fen(cls, distribution=None, piece_bag=False):
        if distribution is None:
            distribution = dict(cls.correct_distribution)

        dist_total = sum(distribution.values())
        norm_dist = {key: val/dist_total for key, val in distribution.items()}

        def weighted_choice(norm_dist):
            r = random.random()
            for k, v in norm_dist.items():
                r -= v
                if r <= 0:
                    return k

        if not piece_bag:
            black_rows, white_rows = [
                [
                    [weighted_choice(norm_dist) for _ in range(8)],
                    [weighted_choice(norm_dist) for _ in range(8)],
                ],
                [
                    [weighted_choice(norm_dist) for _ in range(8)],
                    [weighted_choice(norm_dist) for _ in range(8)],
                ],
            ]

            black_rows[0][random.randrange(8)] = 'k'
            white_rows[0][random.randrange(8)] = 'k'
        else:
            pieces = [weighted_choice(norm_dist) for _ in range(15)] + ['k']

            pieces = list(map(lambda order: list(map(lambda pos: pieces[pos], order)), [ random.sample(list(range(16)), 16), random.sample(list(range(16)), 16)]))
            
            black_rows = [pieces[0][0:8], pieces[0][8:16]]
            white_rows = [pieces[1][0:8], pieces[1][8:16]]

            for rows in (black_rows, white_rows):
                try:
                    k_index = rows[1].index('k')
                    swap = random.randrange(8)
                    rows[0][swap], rows[1][k_index] = rows[1][k_index], rows[0][swap]
                except ValueError as e:
                    # king is not in forward row
                    pass

        # both rows are [0: back row, 1: front row]
        rooks = [[], []]

        for i, rows in enumerate((black_rows, white_rows)):
            for j, piece in reversed(list(enumerate(rows[0]))):
                letter_position = chr(97 + j)
                if piece == 'r':
                    rooks[i].append(letter_position)
                    break
                if piece == 'k':
                    break
            for j, piece in enumerate(rows[0]):
                letter_position = chr(97 + j)
                if piece == 'r' and letter_position not in rooks[i]:
                    rooks[i].append(letter_position)
                    break
                if piece == 'k':
                    break
        
        black_rows, white_rows = map(lambda rows: '/'.join(map(lambda row: ''.join(row), rows)), (black_rows, reversed(white_rows)))

        fen = '%s/8/8/8/8/%s w %s%s - 0 1' % (
            black_rows,
            white_rows.upper(),
            ''.join(rooks[1]).upper(),
            ''.join(rooks[0])
        )

        return fen

    @classmethod
    def bad_board(cls, distribution=None, piece_bag=False, *args, **kwargs):
        if 'fen' in kwargs:
            del kwargs[fen]
        return cls(fen=cls.generate_bad_fen(distribution, piece_bag), *args, **kwargs)


    def __str__(self):
        return '%s for %s' % (self.fen, self.game)

    def chess_board(self):
        if not hasattr(self, '_fen_stale') or self._fen_stale != self.fen:
            self._chess_board = chess.Board(self.fen, chess960=True)
            self._fen_stale = self.fen
        return self._chess_board

    # returns new board or throws exception
    def make_move(self, uci):
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
