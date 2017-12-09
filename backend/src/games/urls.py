from django.conf.urls import include, url

from rest_framework import routers

from . import views

router = routers.DefaultRouter()
router.register(r'me/games', views.OwnGameViewSet)

app_name = 'games'
urlpatterns = [
    url(r'^', include(router.urls)),
    url(r'^games/<int:game_id>/move/?$', views.MakeMoveView.as_view(), name='make_move'),
    url(r'^users/?$', views.CreateUser.as_view(), name='create'),
    url(r'^verify/?$', views.VerifyUser.as_view(), name='verify'),
]