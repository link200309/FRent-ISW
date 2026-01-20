from django.urls import re_path
from . import consumers

websocket_urlpatterns = [
    re_path(r'ws/chat/(?P<user_id1>\d+)/(?P<user_id2>\d+)/$', consumers.ChatConsumer.as_asgi()),
]
