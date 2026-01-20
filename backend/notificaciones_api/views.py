from .models import *
from rest_framework import viewsets
from .forms import *
from django.shortcuts import render
from .serializer import NotificacionSerializer
# create yours views
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.core.mail import send_mail



# def inicio(request):
#     notificaciones = Notificacion.objects.all()
#     context = {'notificaciones': notificaciones, }
#     return render(request, "notificaciones_api/inicio.html", context)


class NotificacionesView(viewsets.ModelViewSet):
    serializer_class = NotificacionSerializer
    queryset = Notificacion.objects.all()


class EmailAPIView(APIView):
    def post(self, request):
        try:
            print(request.data)
            email = request.data.get('email')
            subject = "Notificacion de Alquiler-Amigo"
            estado_solicitud = request.data.get('estado_solicitud')
            first_name = request.data.get('first_name')
            last_name = request.data.get('last_name')
            message = (
                f"<html>"
                f"<body>"
                f"<strong>{first_name} {last_name}</strong> {estado_solicitud} tu solicitud de alquiler."
                f"</body>"
                f"</html>"
            )
            print(message)

            send_mail(subject, "", None, [email], html_message=message)

            return Response({'message': 'Correo enviado con éxito'}, status=status.HTTP_200_OK)
        except Exception as e:
            error_message = str(e)
            return Response({'message': error_message}, status=status.HTTP_400_BAD_REQUEST)
