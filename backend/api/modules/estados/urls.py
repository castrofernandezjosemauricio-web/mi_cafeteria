from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import EstadoViewSet

router = DefaultRouter()
router.register(r'', EstadoViewSet)

urlpatterns = [
    path('', include(router.urls)),
]