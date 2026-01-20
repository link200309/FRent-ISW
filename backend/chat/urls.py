from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ChatViewSet

router = DefaultRouter()
router.register(r'canal', ChatViewSet)

urlpatterns = [
    path('api/v1/', include(router.urls)),
]
