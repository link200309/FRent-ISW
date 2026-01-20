from rest_framework import serializers
from .models import OutFit, Event, Rent
from users.models import Friend
from decimal import Decimal

class OutFitSerializer(serializers.ModelSerializer):
    class Meta:
        model = OutFit
        fields = '__all__'

class EventSerializer(serializers.ModelSerializer):
    class Meta:
        model = Event
        fields = ['id_event', 'type_event']


class RentSerializer(serializers.ModelSerializer):
    #outfit = OutFitSerializer(read_only=True)
    #event = EventSerializer(read_only=True)
    class Meta:
        model = Rent
        fields = "__all__"
       # fields = ['id','client', 'friend', 'event', 'outfit', 'fecha_cita', 'time', 'duration', 'location', 'description']
       
        
class RentPriceSerializer(serializers.ModelSerializer):
    total_price = serializers.SerializerMethodField()
    class Meta:
        model = Rent
        fields = ['id', 'friend', 'duration', 'total_price']
    def get_total_price(self, obj):
        duration_decimal = Decimal(str(obj.duration))
        total_price = obj.friend.price * duration_decimal
        return total_price
      