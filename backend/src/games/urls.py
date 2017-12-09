from django.conf.urls import include, url

from rest_framework import routers

from . import views

router = routers.DefaultRouter()
router.register(r'me/games', views.OwnGameViewSet, base_name='game_query_set')

app_name = 'games'
urlpatterns = [
    url(r'^', include(router.urls)),
    url(r'^games/(?P<game_id>[0-9]+)/move/?$', views.MakeMoveView.as_view(), name='make_move'),
]