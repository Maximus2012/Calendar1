from django.db import models
from django.db.models.signals import post_delete
from django.dispatch import receiver
from django.contrib.auth.models import User
import os
from django.conf import settings

# Create your models here.


class Category(models.Model):
    name = models.CharField(max_length=50, unique=False, blank=False)
    image = models.ImageField(upload_to='category/', null=False, unique=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE)

    def __str__(self):
        return self.name


class Emogi(models.Model):
    name = models.CharField(max_length=50, blank=False, unique=False)
    category = models.ForeignKey(Category, on_delete=models.CASCADE, null=True)
    image = models.ImageField(upload_to='emoji/', null=False, unique=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE)

    def __str__(self):
        return self.name


@receiver(post_delete, sender=Category)
def delete_emojis_of_category(sender, instance, **kwargs):
    # Удаляем все эмодзи, связанные с этой категорией
    emojis = Emogi.objects.filter(category=instance)
    
    for emoji in emojis:
        # Удаляем изображения эмодзи с файловой системы
        if emoji.image:
            try:
                # Убедимся, что файл существует, перед тем как удалять
                if os.path.isfile(emoji.image.path):
                    os.remove(emoji.image.path)
            except Exception as e:
                print(f"Ошибка при удалении изображения эмодзи {emoji.name}: {e}")
        # Удаляем эмодзи из базы данных
        emoji.delete()

    # Также удаляем изображение категории, если оно существует
    if instance.image:
        try:
            # Убедимся, что файл существует, перед тем как удалять
            if os.path.isfile(instance.image.path):
                os.remove(instance.image.path)
        except Exception as e:
            print(f"Ошибка при удалении изображения категории {instance.name}: {e}")