from django.conf.urls import include, url
from rest_framework import routers, urls as rest_framework_urls
import users.urls as users_urls
import games.urls as games_urls
from oauth2_provider import urls as oauth2_provider_urls

from django.contrib import admin
admin.autodiscover()

from users.urls import router as users_router


router = routers.DefaultRouter()

router.registry.extend(users_router.registry)

urlpatterns = [
    url(r'^admin/', admin.site.urls),
    url(r'^api-auth/', include(rest_framework_urls)),
    url(r'', include(users_urls)),
    url(r'', include(games_urls)),
    url(r'^o/', include(oauth2_provider_urls)),
]
