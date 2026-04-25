from django.urls import path
from .views import registrar_usuario, login_usuario, logout_usuario

urlpatterns = [
    path('registro/', registrar_usuario),
    path('login/', login_usuario),
    path('logout/', logout_usuario),
]