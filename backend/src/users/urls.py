from django.conf.urls import include, url

from rest_framework import routers

from . import views

router = routers.DefaultRouter()
router.register(r'users', views.UserViewSet)

app_name = 'users'
urlpatterns = [
    url(r'^users/me/?$', views.OwnProfileView.as_view(), name='me'),
    url(r'^users/?$', views.CreateUser.as_view(), name='create'),
    url(r'^verify/?$', views.VerifyUser.as_view(), name='verify'),
]