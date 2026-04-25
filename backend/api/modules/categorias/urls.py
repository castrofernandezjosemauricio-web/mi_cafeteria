from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CategoriaProductoViewSet

router = DefaultRouter()
router.register(r'', CategoriaProductoViewSet)

urlpatterns = [
    path('', include(router.urls)),
]