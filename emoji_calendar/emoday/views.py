from rest_framework import viewsets
from .models import Calendar
from .serializers import CalendarSerializer
from rest_framework.permissions import IsAuthenticated

class CalendarViewSet(viewsets.ModelViewSet):
    queryset = Calendar.objects.all()  # Добавили явное указание queryset
    serializer_class = CalendarSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # Фильтруем записи по текущему пользователю
        print(self.request.user)
        return Calendar.objects.filter(user_id=self.request.user)

    def perform_create(self, serializer):
        # При создании новой записи автоматически добавляем user_id текущего пользователя
        serializer.save(user_id=self.request.user)