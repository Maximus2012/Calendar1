from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CalendarViewSet

router = DefaultRouter()
router.register(r'calendar', CalendarViewSet)

urlpatterns = [
    path('', include(router.urls)),
]