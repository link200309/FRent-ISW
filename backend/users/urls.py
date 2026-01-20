from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import UserViewSet, ClientViewSet, FriendViewSet, TasteViewSet, PhotoViewSet, UserLikeViewSet, AvailabilityViewSet
from .views import CustomLoginView, ProfileImageViewSet,FriendDetailView, likes_friend

router = DefaultRouter()
router.register(r'users', UserViewSet)
router.register(r'clients', ClientViewSet)
router.register(r'friends', FriendViewSet)
router.register(r'likes', TasteViewSet)
router.register(r'photos', PhotoViewSet)
router.register(r'user_tastes', UserLikeViewSet)
router.register(r'availability', AvailabilityViewSet)
router.register(r'profile-image', ProfileImageViewSet, basename='profile-image')
urlpatterns = [
    path('api/v1/', include(router.urls)),
    path('login/', CustomLoginView().as_view(), name='login'),
    path('api/v1/friends/country/<str:country>/', FriendViewSet.as_view({
        'get': 'list',
    })),
    path('friends/detail/<int:pk>/', FriendDetailView.as_view(), name='friend-detail'),
    path('likes_friend/<int:pk>/', likes_friend, name='likes_friend'),
]
