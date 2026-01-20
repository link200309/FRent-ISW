from rest_framework.response import Response
from rest_framework import status
from rest_framework import viewsets
from rest_framework.decorators import action
from .Serializer import ChatSerializer
from .models import Chat
from django.db.models import Q

class ChatViewSet(viewsets.ModelViewSet):
    queryset = Chat.objects.all()
    serializer_class = ChatSerializer
    
    @action(detail=False, methods=['GET', 'POST'])
    def get_chats_user(self, request):
        sender_id = request.data.get('sender', None)
        receiver_id = request.data.get('receiver', None)
        
        print(sender_id)
        print(receiver_id)
        
        if sender_id is not None and receiver_id is not None:
            queryset = self.queryset.filter(Q(sender=sender_id, receiver=receiver_id) | Q(sender=receiver_id, receiver=sender_id))
            serializer = ChatSerializer(queryset, many=True)
            return Response(serializer.data)
        else:
            return Response({"error": "ID de usuario no proporcionado"}, status=status.HTTP_400_BAD_REQUEST)
