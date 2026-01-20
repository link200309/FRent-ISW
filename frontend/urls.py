
from django.contrib import admin
from django.urls import include, path
from rest_framework.documentation import include_docs_urls
from django.conf.urls.static import static
from django.conf import settings

urlpatterns = [
    path('admin/', admin.site.urls),
    #ruta de api rent
    path('rents/', include('rent.urls')),
    #ruta de api users
    path('users/', include('users.urls')),
    #ruta de notificaciones y email
    path('notificaciones/', include('notificaciones_api.urls')),
    #ruta de la documentacion de la API
    path('notificacionesInterno/', include('notificacionesInterno.urls')),
    path('chat/', include('chat.urls')),
    #ruta de la documentacion de la API
    path('documentation/', include_docs_urls(title=" Documentacion API FRENT")),
    path('auth/', include('djoser.urls')),
    path('auth/', include('djoser.urls.authtoken')),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)