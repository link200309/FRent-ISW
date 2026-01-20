from django.shortcuts import render
from rest_framework import viewsets
from decimal import Decimal
from django.utils import timezone
from django.db.models import F, ExpressionWrapper, fields
from .models import OutFit, Event, Rent,ClientComent
from users.models import Friend, Client
from .serializers import OutFitSerializer, EventSerializer, RentSerializer, RentPriceSerializer
from rest_framework.response import Response
from django.http import JsonResponse,HttpResponseBadRequest
from django.shortcuts import get_object_or_404
from rest_framework.decorators import action
from datetime import datetime, timedelta
from django.utils.timezone import now
from rest_framework.views import APIView, View
from rest_framework import status
from django.utils.timezone import localtime

from django.utils.decorators import method_decorator
import json
from django.views.decorators.csrf import csrf_exempt
from django.shortcuts import get_object_or_404


class OutFitViewSet(viewsets.ModelViewSet):
    queryset = OutFit.objects.all()
    serializer_class = OutFitSerializer

class EventViewSet(viewsets.ModelViewSet):
    queryset = Event.objects.all()
    serializer_class = EventSerializer

class RentViewSet(viewsets.ModelViewSet):
    queryset = Rent.objects.all()
    serializer_class = RentSerializer
    
    def get_queryset(self):
        now = timezone.now()
        return Rent.objects.annotate(
            time_elapsed=ExpressionWrapper(now - F('create'), output_field=fields.DurationField()) 
        ).order_by('-fecha_cita')

    # def create(self, request, *args, **kwargs):
    #   fecha_cita_str = request.data.get('fecha_cita')
    #   time_str = request.data.get('time')
    #   duration = float(request.data.get('duration'))
    #   fecha_cita = date.fromisoformat(fecha_cita_str)
    #   hora = time.fromisoformat(time_str)
    #   datetime_ini = datetime.combine(fecha_cita, hora)
    #   datetime_fin = datetime_ini+timedelta(hours=duration)
    #   rents_superpuesta = Rent.objects.filter(
    #       Q(fecha_cita=fecha_cita) & (Q(time__lte=datetime_fin.time(), time__gte=datetime_ini.time()) |Q(time__lt=datetime_ini.time(), time__gte=(datetime_ini - timedelta(hours=duration)).time())))
    #   if rents_superpuesta.exists():
    #       return Response({'error': 'La renta se superpone con otra renta existente.'},status=status.HTTP_400_BAD_REQUEST)
    #   return super().create(request, *args, **kwargs)
  
  
    @action(detail=True, methods=['GET'])
    def get_pendings_rents(self, request, pk=None):
        rents = Rent.objects.filter(status="pending", friend__id_user=pk)
        rents_serializer = RentSerializer(rents, many=True)
        return Response(rents_serializer.data)
    
    @action(detail=False, methods=['GET'])
    def get_accepted_rents(self, request):
        rents = Rent.objects.filter(status="accepted")
        rents_serializer = RentSerializer(rents, many=True)
        return Response(rents_serializer.data)

        
  
class RentPriceViewSet(viewsets.ModelViewSet):
    queryset = Rent.objects.all().order_by('-create')  
    serializer_class = RentPriceSerializer
    
    
class RentTimeElapsedViewSet(viewsets.ModelViewSet):
    queryset = Rent.objects.all()
    serializer_class = RentSerializer 
    def retrieve(self, request, pk=None):
            
        rent = get_object_or_404(Rent, pk=pk)
        now = timezone.now()
        time_elapsed = now - rent.create
        print(type(time_elapsed))
        total_minutes = int(round(time_elapsed.total_seconds() / 60))
        response_data = {
            'id': rent.id,
            'time_elapsed': total_minutes,
        }
        return Response(response_data)

class GetFriendRentsCalendar(APIView):
    def get(self, request, id_amigo):
        current_date = now().date()
        rents = Rent.objects.filter(friend_id=id_amigo, fecha_cita__gte=current_date, status='accepted')

        data = []
        for rent in rents:
            start_time = datetime.combine(rent.fecha_cita, rent.time)
            end_time = start_time + timedelta(hours=rent.duration)
            data.append({
                'id_amigo': rent.friend.id_user,
                'fecha_alquiler': rent.fecha_cita.strftime('%Y-%m-%d'),
                'hora_inicio': start_time.strftime('%H:%M:%S'),
                'hora_fin': end_time.strftime('%H:%M:%S'),
                'duration': rent.duration,
                'tipo_evento': rent.event.type_event if rent.event else 'No event',
            })

        if not data:
            return Response({'mensaje': 'No hay alquileres para este amigo'})
        return Response(data)
    
class RentDetailView(APIView):
    def get(self, request, friend_id):
        get_object_or_404(Friend, id_user=friend_id)
        #rents = Rent.objects.filter(friend__id_user=friend_id,status='pending').select_related('event', 'outfit')
        rents = Rent.objects.filter(friend__id_user=friend_id).select_related('event', 'outfit')
        rent_details = []
        for rent in rents:
            if rent.outfit is not None and rent.event is not None:
                type_outfit = rent.outfit.type_outfit
                type_event = rent.event.type_event
            else:
                type_outfit = 'No especificado'  
                type_event = 'No especificado'  
            
            if rent.status == 'pending':
                status_str = 'Pendiente'
            elif rent.status == 'accepted':
                status_str = 'Aceptado'
            else:
                status_str = 'Rechazado'

            price = rent.duration * float(rent.friend.price)

            rent_details.append({
                'rent_id': rent.id,
                'friend_id': rent.friend.id_user,
                'client_id': rent.client.id_user,
                'fecha_cita': rent.fecha_cita,
                'nombre_cliente': rent.client.get_full_name(),
                'time': rent.time,
                'duration': rent.duration,
                'location': rent.location,
                'description': rent.description,
                'created': self.format_datetime_with_colon(localtime(rent.create)),
                'type_outfit': type_outfit,
                'type_event': type_event,
                'status': status_str,
                'price': price,
                'image': rent.client.image
            })
                
        if not rent_details:
            return Response({'mensaje': 'No hay alquileres encontrados para este amigo.'})
            
        return Response(rent_details)
            
    def format_datetime_with_colon(self, datetime_obj):
        datetime_str = datetime_obj.strftime('%Y-%m-%dT%H:%M:%S.%f%z')
        return datetime_str[:-2] + ':' + datetime_str[-2:]
    


class AcceptedRentsView(APIView):
    def get(self, request, client_id):
        rents = Rent.objects.filter(client_id=client_id, status='accepted')
        data = []

        for rent in rents:
            rent_end_time = self.calculate_rent_end_time(rent)
            now = datetime.now()

            if now >= rent_end_time:
                friend = get_object_or_404(Friend, id_user=rent.friend.id_user)
                rent_done_duration = self.calculate_duration(rent_end_time, now)
                data.append({
                    'friend_id': friend.id_user,
                    'client_id': client_id,
                    'rent_id': rent.id,
                    'friend_full_name': friend.get_full_name(),
                    'friend_description': friend.personal_description,
                    'friend_photo': friend.image,
                    'rent_done': rent_done_duration,
                })

        return JsonResponse(data, safe=False)

    def calculate_rent_end_time(self, rent):
        rent_start_time = datetime.combine(rent.fecha_cita, rent.time)
        rent_duration = timedelta(hours=rent.duration)
        return rent_start_time + rent_duration

    def calculate_duration(self, rent_end_time, now):
        duration = now - rent_end_time
        days = duration.days
        seconds = duration.seconds
        hours = seconds // 3600
        minutes = (seconds % 3600) // 60

        if days > 0:
            return f"{days} dias"
        elif hours > 0:
            return f"{hours} horas"
        else:
            return f"{minutes} minutos"
    

class SaveCommentView(APIView):
    def post(self, request):
        try:
            data = json.loads(request.body)
            rent_id = data['rent_id']
            friend_id = data['friend_id']
            client_id = data['client_id']
            comment = data['comment']

            rent = get_object_or_404(Rent, id=rent_id)
            friend = get_object_or_404(Friend, id_user=friend_id)
            client = get_object_or_404(Client, id_user=client_id)

            client_comment = ClientComent(
                rent=rent,
                friend=friend,
                client=client,
                comment=comment
            )
            client_comment.save()

            response = {
                'id_comment': client_comment.id_comment,
                'rent_id': rent_id,
                'friend_id': friend_id,
                'client_id': client_id,
                'comment': comment,
            }
            return JsonResponse({'mensaje': 'Comentario guardado correctamente'}, status=201)

        except KeyError:
            return HttpResponseBadRequest('Faltan datos requeridos.')
        except json.JSONDecodeError:
            return HttpResponseBadRequest('Formato de JSON inválido.')
        

class GetFriendCommentsView(APIView):
    def get(self, request, friend_id):
        friend = get_object_or_404(Friend, id_user=friend_id)
        comments = ClientComent.objects.filter(friend=friend)
        data = []

        for comment in comments:
            client = comment.client
            data.append({
                'comment': comment.comment,
                'client_full_name': client.get_full_name()
            })

        return JsonResponse(data, safe=False)