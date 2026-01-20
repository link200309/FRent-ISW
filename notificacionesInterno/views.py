from rest_framework import viewsets
from rest_framework.response import Response
from .serializer import NotiInSerializer
from .models import NotificacionInterno


class NotiInViewSet(viewsets.ModelViewSet):
    queryset = NotificacionInterno.objects.all()
    serializer_class = NotiInSerializer
    
    def retrieve(self, request, pk=None):
        try:
            notificationsFriend = NotificacionInterno.objects.filter(to_user=pk).select_related('from_user')
            notificationsResponse = []
            
            for notification in notificationsFriend:
                friend_name = f"{notification.from_user.first_name} {notification.from_user.last_name}"
                message = notification.message
                created = notification.created
                is_reading = notification.is_reading
                
                respuesta = {
                    "friend_name": friend_name,
                    "message": message,
                    "created": created,
                    "is_reading": is_reading,
                    "image": notification.from_user.image
                }
                
                notificationsResponse.append(respuesta)
            
            return Response(notificationsResponse)
            
        except NotificacionInterno.DoesNotExist:
            return Response({'detail': 'Notificaciones no encontradas'}, status=404)
        
    
    def update(self, request, pk=None, *args, **kwargs):
        NotificacionInterno.objects.filter(to_user=pk).update(is_reading = True)
        return Response({'detail': 'Actualización exitosa'})
    
    def destroy(self, request, pk=None, *args, **kwargs):
        notificationsFriend = NotificacionInterno.objects.filter(to_user=pk).delete()
        return Response(status=204)
      #REPONSE a partir de un post
