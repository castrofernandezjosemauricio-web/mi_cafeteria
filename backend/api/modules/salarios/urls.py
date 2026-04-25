from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import SalarioViewSet

router = DefaultRouter()
router.register(r'', SalarioViewSet)

urlpatterns = [
    path('', include(router.urls)),
]