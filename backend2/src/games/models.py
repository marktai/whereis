from django.db import models
import json, random, string, os

from django.db import models, transaction
from django.contrib.postgres.fields import ArrayField

from rest_framework import exceptions as drf_exceptions

dirname, filename = os.path.split(os.path.abspath(__file__))
words_path = os.path.join(dirname, 'words.json')
with open(words_path) as f:
    words = json.load(f)

def chunks(lst, n):
    """Yield successive n-sized chunks from lst."""
    for i in range(0, len(lst), n):
        yield lst[i:i + n]

# Create your models here.


# # Create your models here.
# class Game(models.Model):
#     class PlayerError(drf_exceptions.ValidationError):
#         """Exception thrown when incorrect player tries to move"""
#         pass
#     class MoveError(drf_exceptions.ValidationError):
#         """Exception thrown when move is illegal"""
#         pass

#     created_time = models.DateTimeField(auto_now_add=True)
#     last_updated_time = models.DateTimeField(auto_now=True)

#     def __str__(self):
#         return 'Game between %s and %s' % (self.white_player, self.black_player)

#     @property
#     def board(self):
#         return self.board_set.last()

#     @property
#     def turn_count(self):
#         return self.board.turn_count

#     @transaction.atomic
#     def make_move(self, player, uci):
#         if self.turn_count % 2 == 0 and player != self.white_player:
#             raise self.PlayerError('It is white\'s turn (%s)' % self.white_player)
#         if self.turn_count % 2 == 1 and player != self.black_player:
#             raise self.PlayerError('It is black\'s turn (%s)' % self.black_player)

#         try:
#             board = self.board.make_move(uci)
#         except ValueError as e: # invalid move
#             raise self.MoveError('%s is an invalid move because of %s' % (uci, e))

#         return board

#     def save(self, *args, **kwargs):
#         ret = super().save(*args, **kwargs)

#         if self.board is None:
#             init_board = Board.bad_board(game=self)
#             init_board.save()

#         return ret

class BoardManager(models.Manager):
    def create_board(self, *args, **kwargs):
        cards = list(chunks(random.choices(words, k=Board.CARDS_GENERATED * Board.WORDS_PER_CARD), Board.WORDS_PER_CARD))
        answer = tuple((
            (
                card_index,
                random.randint(0, Board.WORDS_PER_CARD),
            )
            for card_index in random.sample(range(Board.CARDS_IN_ANSWER), k=Board.CARDS_IN_ANSWER)
        ))
        board = self.create(cards=cards, answer=answer, *args, **kwargs)

        return board

class Board(models.Model):
    WORDS_PER_CARD = 4
    CARDS_IN_ANSWER = 4
    CARDS_GENERATED = 20

    objects = BoardManager()

    # game = models.ForeignKey(Game, on_delete=models.CASCADE)
    created_time = models.DateTimeField(auto_now_add=True)
    last_updated_time = models.DateTimeField(auto_now=True)
    clues = ArrayField(
        models.CharField(max_length=20, blank=True),
        size=CARDS_IN_ANSWER,
        null=True,
    )
    cards = ArrayField(
        ArrayField(
            models.CharField(max_length=20),
            size=WORDS_PER_CARD,
        ),
        size=CARDS_GENERATED,
    )

    # ( (card_index, word_rotation_offset), ... )
    # eg ((5, 2), (2, 1), (0, 1), (3, 0))
    answer = ArrayField(
        ArrayField(
            models.IntegerField(),
            size=2,
        ),
        size=CARDS_IN_ANSWER,
    )

    suggested_num_cards = models.IntegerField(null=True)

    @property
    def answer_cards(self):
        return tuple((
            self.cards[card_index][-word_rotation_offset:] + self.cards[card_index][:-word_rotation_offset]
            for (card_index, word_rotation_offset) in self.answer
        ))

    @property
    def suggested_possible_cards(self):
        if self.suggested_num_cards is None:
            return None
        return self.possible_cards(self.suggested_num_cards)

    def possible_cards(self, n):
        answer_cards = tuple((
            tuple(self.cards[card_index]) for (card_index, _) in self.answer
        ))
        answer_cards_set = set(answer_cards)
        non_answer_cards = tuple((
            x for x in self.cards if tuple(x) not in answer_cards
        ))

        num_non_answer_cards = min(
            max(
                n - len(answer_cards),
                0,
            ),
            len(self.cards) - len(answer_cards),
        )

        return tuple(sorted(
            tuple(answer_cards + non_answer_cards[0:num_non_answer_cards]),
            key = lambda x: hash(tuple(x)),
        ))

    def __str__(self):
        return 'board with clues: %s and answer: %s' % (str(self.clues), str(self.answer_cards))
