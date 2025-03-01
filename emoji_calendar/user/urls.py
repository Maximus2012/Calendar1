from django.urls import path, include


# Djoser создаст набор необходимых эндпоинтов.
# базовые, для управления пользователями в Django:


urlpatterns = [
    path('auth/', include('djoser.urls')),
    # JWT-эндпоинты, для управления JWT-токенами:
    path('auth/', include('djoser.urls.jwt')),
]