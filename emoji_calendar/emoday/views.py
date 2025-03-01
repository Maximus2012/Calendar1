from rest_framework import viewsets
from .models import Calendar
from .serializers import CalendarSerializer
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status

class CalendarViewSet(viewsets.ModelViewSet):
    queryset = Calendar.objects.all()  # Добавили явное указание queryset
    serializer_class = CalendarSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # Фильтруем записи по текущему пользователю
        return Calendar.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        # При создании новой записи автоматически добавляем user_id текущего пользователя
        data = serializer.validated_data
        user = self.request.user
        date = data.get('data')  # Извлекаем дату из данных

        # Проверяем, существует ли уже запись с такой датой для этого пользователя
        existing_record = Calendar.objects.filter(user=user, data=date).first()

        if existing_record:
            # Если запись существует, обновляем ее, а не создаем новую
            return self.update_or_create(existing_record, serializer)

        # Если записи нет, создаем новую
        serializer.save(user=user)

    def update_or_create(self, existing_record, serializer):
        """
        Обновляем существующую запись.
        """
        data = serializer.validated_data
        emoji_data = data.get('emoji', [])
        
        # Обновляем эмодзи (Many-to-Many связь)
        existing_record.emoji.set(emoji_data)

        # Обновляем остальные поля
        for attr, value in data.items():
            if attr != 'emoji':  # Не изменяем поле emoji напрямую, оно обновляется отдельно
                setattr(existing_record, attr, value)

        existing_record.save()  # Сохраняем обновленную запись
        return existing_record