from rest_framework import serializers
from users.serializers import UserSerializer
from .models import Chat

class ChatSerializer(serializers.ModelSerializer):
    class Meta:
        model = Chat
        fields = '__all__'
