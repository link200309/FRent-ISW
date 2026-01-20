from django.db import models
from django.utils import timezone
from django.db import models
from django.contrib.auth.models import PermissionsMixin
from django.contrib.auth.base_user import AbstractBaseUser, BaseUserManager

class UserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError('Es necesario un email electrónico.')
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)

        user.set_password(password)
        
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)

        if extra_fields.get('is_staff') is not True:
            raise ValueError('Superuser must have is_staff=True.')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser must have is_superuser=True.')

        return self.create_user(email, password, **extra_fields)

class User(AbstractBaseUser, PermissionsMixin):
    id_user = models.AutoField(primary_key=True)
    first_name = models.CharField(max_length=30)
    last_name = models.CharField(max_length=30)
    birth_date= models.DateField(null=True, blank=True)
    gender = models.CharField(null=True, max_length=10)
    country = models.CharField(null=True, max_length=30)
    city = models.CharField(null=True, max_length=30)
    email = models.EmailField(unique=True)
    personal_description = models.CharField(max_length=150, null=True)

    # profile_image = models.ImageField(upload_to='profile_images/', null=True, blank=True)

    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=True)
    date_joined = models.DateTimeField(default=timezone.now)
    image = models.TextField(null=True, blank=True)
    objects = UserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['first_name', 'last_name', 'gender']

    def __str__(self):
        return self.email

    def get_full_name(self):
        return f"{self.first_name} {self.last_name}"

    def get_short_name(self):
        return self.first_name

class Client(User):
    pass

class Friend(User):
    price = models.DecimalField(max_digits=5, decimal_places=2)
    like_count = models.PositiveIntegerField(default=0)

class Like(models.Model):
    name = models.CharField(max_length=51)

class Photo(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    image = models.ImageField(upload_to='users/%d/%m/%Y', null=True, blank=True)


class User_like(models.Model):
    like_id = models.ForeignKey(Like, on_delete=models.CASCADE)
    user_id = models.ForeignKey(User, on_delete=models.CASCADE)
    
class Availability(models.Model):
    user_id = models.ForeignKey(User, on_delete=models.CASCADE)
    start = models.TimeField(default=timezone.now)
    end = models.TimeField(default=timezone.now)
    dia_semana = models.CharField(max_length=10, choices=[
        ('Lunes', 'Lunes'),
        ('Martes', 'Martes'),
        ('Miercoles', 'Miercoles'),
        ('Jueves', 'Jueves'),
        ('Viernes', 'Viernes'),
        ('Sabado', 'Sabado'),
        ('Domingo', 'Domingo'),
    ])
    