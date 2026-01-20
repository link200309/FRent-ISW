from django.db import models
from users.models import Friend, Client
from django.core.validators import MinValueValidator


class OutFit(models.Model):
    id_oufit=models.IntegerField(primary_key=True)
    type_outfit = models.CharField(max_length=30)
    def __str__(self):
        return self.type_outfit
    

class Event(models.Model):
    id_event = models.IntegerField(primary_key=True)
    type_event= models.CharField(max_length=30)
    def __str__(self):
        return self.type_event

class Rent(models.Model):
    client = models.ForeignKey(Client, on_delete=models.CASCADE)
    friend = models.ForeignKey(Friend, on_delete=models.CASCADE)
    event = models.ForeignKey(Event, on_delete=models.CASCADE, null=True)
    outfit= models.ForeignKey(OutFit, on_delete=models.CASCADE, null=True)
    fecha_cita = models.DateField()
    time = models.TimeField()
    duration = models.FloatField(validators=[MinValueValidator(0.0)])
    location = models.CharField(max_length=50)
    description = models.CharField(max_length=200, null=True)
    create = models.DateTimeField(auto_now_add=True)
    status = models.CharField(default='pending', max_length=10) #Podria tener los estados de pending, accepted o rejeact

    def get_client_id(self):
        return self.client.id


class ClientComent(models.Model):
    id_comment=models.AutoField(primary_key=True)
    rent=models.ForeignKey(Rent, on_delete=models.CASCADE)
    friend=models.ForeignKey(Friend, on_delete=models.CASCADE)
    client=models.ForeignKey(Client, on_delete=models.CASCADE, null=True)
    comment=models.CharField(max_length=200)