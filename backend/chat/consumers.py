import json
from channels.generic.websocket import AsyncJsonWebsocketConsumer

from django.core.wsgi import get_wsgi_application
application = get_wsgi_application()

from . models import Chat
from users.models import User  # Importa el modelo Chat
from asgiref.sync import sync_to_async

class ChatConsumer(AsyncJsonWebsocketConsumer):
    async def connect(self):
        self.room_name = self.scope['url_route']['kwargs']['user_id1'] + '_' + self.scope['url_route']['kwargs']['user_id2']
        self.room_group_name = 'chat_%s' % self.room_name

        # Join room group
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )

        await self.accept()

    async def disconnect(self, close_code):
        # Leave room group
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

    # Receive message from WebSocket
    async def receive(self, text_data):
        try:
            text_data_json = json.loads(text_data)
            sender_id = text_data_json['sender']
            recipient_id = text_data_json['recipient']
            message = text_data_json['message']
            recipient_Name = text_data_json['recipientName']
            sender_Name = text_data_json['senderName']
            print("llego", text_data_json)
        except KeyError as ex:
            # Manejar la excepción cuando falta una clave en el JSON
            print(f"Error: Falta la clave {ex} en el JSON recibido.")
            return  # Retorna para evitar enviar un mensaje con datos faltantes

        # Save message in database or perform other operations as needed
        
        # Verificar si el destinatario es diferente del remitente actual
        # Send message to room group
        
        try:
            sender = await sync_to_async(User.objects.get)(id_user=sender_id)
            receiver = await sync_to_async(User.objects.get)(id_user=recipient_id)
        except User.DoesNotExist:
            print("Error: Usuario no encontrado.")
            return

        # Crear y guardar el mensaje en la base de datos
        chat_message = await sync_to_async(Chat.objects.create)(
            user=sender, 
            sender=sender, 
            receiver=receiver, 
            message=message
        )
        
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'chat_message',
                'message': message,
                'sender': sender_id,
                'recipient': recipient_id,
                'recipient_Name': recipient_Name,
                'sender_Name': sender_Name
            }
        )
    # Receive message from room group
    async def chat_message(self, event):
        message = event['message']
        sender_id = event['sender']
        recipient_id = event['recipient'],
        recipient_Name = event['recipient_Name'],
        sender_Name = event['sender_Name']

        # Verificar si el destinatario es diferente del remitente actual
        if recipient_id != sender_id:
            # Send message to WebSocket
            await self.send(text_data=json.dumps({
                'message': message,
                'sender': sender_id,
                'recipient': recipient_id,
                'recipient_Name': recipient_Name,
                'sender_Name': sender_Name
            }))