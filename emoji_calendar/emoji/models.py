from django.db import models
from django.db.models.signals import post_delete
from django.dispatch import receiver

# Create your models here.


class Category(models.Model):
    name = models.CharField(max_length=50, unique=True, blank=False)
    image = models.ImageField(upload_to='category/', null=False, unique=True)

    def __str__(self):
        return self.name


class Emogi(models.Model):
    name = models.CharField(max_length=50, blank=False, unique=True)
    category = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True)
    image = models.ImageField(upload_to='emoji/', null=False, unique=True)

    def __str__(self):
        return self.name


@receiver(post_delete, sender=Emogi)
def delete_category_if_no_emogi(sender, instance, **kwargs):
    # Удаляем изображение из файловой системы
    if instance.image:
        instance.image.delete(save=False)
    
    if instance.category and not Emogi.objects.filter(category=instance.category).exists():
        instance.category.delete()

