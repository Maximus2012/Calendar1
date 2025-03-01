from rest_framework import serializers
from .models import Calendar
from emoji.models import Emogi
from emoji.serializers import CustomEmogiSerializer

class CalendarSerializer(serializers.ModelSerializer):
    # Для вывода деталей эмодзи при GET
    emoji_details = CustomEmogiSerializer(source='emoji_id', many=True, read_only=True)
    
    # Для обновления/создания записей через POST/PUT
    emoji_id = serializers.PrimaryKeyRelatedField(
        queryset=Emogi.objects.all(), many=True, write_only=True
    )

    class Meta:
        model = Calendar
        fields = '__all__'

   

    def update(self, instance, validated_data):
        emoji_data = validated_data.pop('emoji_id', None)
        if emoji_data is not None:
            instance.emoji_id.set(emoji_data)  # ManyToMany обновляется через .set()

        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        instance.save()
        return instance