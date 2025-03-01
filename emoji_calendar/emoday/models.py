from django.db import models
from emoji.models import Emogi
from django.contrib.auth import get_user_model
# Create your models here.

User = get_user_model()

class Calendar(models.Model):
    
    data = models.DateField()
    emoji_id = models.ManyToManyField(Emogi)
    user_id = models.ForeignKey(User, on_delete=models.CASCADE)

    
