from rest_framework import serializers
from .models import Emogi, Category

class EmogiSerializer(serializers.ModelSerializer):
    class Meta:
        model = Emogi
        fields = ['id', 'name', 'category', 'image']


class CustomEmogiSerializer(serializers.ModelSerializer):
    class Meta:
        model = Emogi  # Предполагается, что модель называется Emogi
        fields = ('id', 'name', 'image')  # Укажите нужные поля

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = '__all__'