
# POBLAR LA TABLA TASTE
# CORRER CON  python populate_data.py
import os
import django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'frent.settings')
django.setup()

from users.models import Like
from rent.models import OutFit, Event

def populate_data():
    gustos = [
        'Jugar videojuegos',
        'Pasear',
        'Cocinar',
        'Ver películas',
        "Leer",
        "Cantar",
        "Bailar",
        "Karaoke",
        "Football",
        "Anime",
        "Dibujar",
        "Tocar Guitarra",
        "Arte",
        "Animales",
        "Natacion",
        "Hacer ejercicio",
        "Programar",
        "Viajar",
        "Escuchar música",
        "Escribir",
        "Fotografía",
        "Jardinería",
        "Meditar",
        "Ciclismo",
        "Voluntariado",
        "Aprender idiomas",
    ]

    for gusto in gustos:
        instancia_gusto = Like(name=gusto)
        instancia_gusto.save()
        

    outfits = [
        'Casual',
        'Formal',
        'Deportivo',
        'Elegante',
        'Playero',
        'Fiesta',
        'Trabajo',
        'Cómodo',
        'Clásico',
        'Retro',
    ]

    events = [
        'Boda',
        'Cumpleaños',
        'Graduación',
        'Concierto',
        'Fiesta de empresa',
        'Cita romántica',
        'Cena formal',
        'Picnic',
        'Bautizo',
        'Fiesta de Navidad',
        'Desfile de moda',
        'Evento deportivo',
        'Cóctel',
        'Entrevista de trabajo',
        'Despedida de soltero/soltera',
        'Festival',
        'Reunión familiar',
        'Cena casual',
        'Reunión de amigos',
        'Viaje',
    ]
    
    outfit_id_counter = 1

    for outfit_name in outfits:
        outfit_instance = OutFit(id_oufit=outfit_id_counter, type_outfit=outfit_name)
        outfit_id_counter += 1
        outfit_instance.save()

    event_id_counter = 1
    
    for event_name in events:
        event_instance = Event(id_event = event_id_counter, type_event=event_name)
        event_id_counter += 1
        event_instance.save()

if __name__ == '__main__':
    print("Poblando la base de datos con datos iniciales...")
    populate_data()
    print("¡Datos iniciales poblados exitosamente!")
    