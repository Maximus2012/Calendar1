from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import EmogiViewSet, CategoryViewSet

router = DefaultRouter()
router.register(r'emogis', EmogiViewSet)
router.register(r'categories', CategoryViewSet)

urlpatterns = [
    path('', include(router.urls)),
]