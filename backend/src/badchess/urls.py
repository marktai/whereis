from django.conf.urls import include, url
from rest_framework import routers
from users import views as users_views

from django.contrib import admin
admin.autodiscover()

from users.urls import router as users_router


router = routers.DefaultRouter()

router.registry.extend(users_router.registry)

urlpatterns = [
    url(r'^drf/', include(router.urls)),
    url(r'^admin/', include(admin.site.urls)),
    url(r'^api-auth/', include('rest_framework.urls', namespace='rest_framework')),
    url(r'', include('users.urls', namespace='users')),
    url(r'^o/', include('oauth2_provider.urls', namespace='oauth2_provider')),
]
