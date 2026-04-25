from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import EstadoCivilViewSet

router = DefaultRouter()
router.register(r'', EstadoCivilViewSet)

urlpatterns = [
    path('', include(router.urls)),
]