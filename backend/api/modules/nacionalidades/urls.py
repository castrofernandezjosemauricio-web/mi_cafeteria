from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import NacionalidadViewSet

router = DefaultRouter()
router.register(r'', NacionalidadViewSet)

urlpatterns = [
    path('', include(router.urls)),
]