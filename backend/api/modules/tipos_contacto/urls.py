from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import TipoContactoViewSet

router = DefaultRouter()
router.register(r'', TipoContactoViewSet)

urlpatterns = [
    path('', include(router.urls)),
]