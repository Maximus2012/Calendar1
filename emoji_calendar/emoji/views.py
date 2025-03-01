from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework.decorators import action
from .models import Emogi, Category
from .serializers import EmogiSerializer, CategorySerializer

class EmogiViewSet(viewsets.ModelViewSet):
    queryset = Emogi.objects.all()
    serializer_class = EmogiSerializer

    # Добавляем кастомный endpoint для фильтрации по category_id
    @action(detail=False, methods=['get'], url_path='by-category/(?P<category_id>\d+)')
    def by_category(self, request, category_id=None):
        """ Получение списка эмодзи по category_id """
        emojis = Emogi.objects.filter(category_id=category_id)
        serializer = self.get_serializer(emojis, many=True)
        return Response(serializer.data)

class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer