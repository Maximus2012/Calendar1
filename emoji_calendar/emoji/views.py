from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from .models import Emogi, Category
from .serializers import EmogiSerializer, CategorySerializer

class EmogiViewSet(viewsets.ModelViewSet):
    queryset = Emogi.objects.all()
    serializer_class = EmogiSerializer
    permission_classes = [IsAuthenticated]  # Требуется авторизация

    def get_queryset(self):
        # Фильтруем записи по текущему пользователю
        return Emogi.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        # Получаем текущего аутентифицированного пользователя
        user = self.request.user
        # Сохраняем эмодзи с привязкой к текущему пользователю
        serializer.save(user=user)

    @action(detail=False, methods=['get'], url_path='by-category/(?P<category_id>\d+)')
    def by_category(self, request, category_id=None):
        """ Получение списка эмодзи по category_id """
        emojis = Emogi.objects.filter(category_id=category_id)  # Не фильтруем по пользователю, так как это делается в сериализаторе
        serializer = self.get_serializer(emojis, many=True)
        return Response(serializer.data)


class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [IsAuthenticated]  # Требуется авторизация

    def get_queryset(self):
        # Фильтруем записи по текущему пользователю
        return Category.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        # Получаем текущего аутентифицированного пользователя
        user = self.request.user
        # Сохраняем категорию с привязкой к текущему пользователю
        serializer.save(user=user)