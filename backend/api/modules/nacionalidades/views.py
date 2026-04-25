from rest_framework import viewsets
from api.models import Nacionalidad
from .serializers import NacionalidadSerializer

class NacionalidadViewSet(viewsets.ModelViewSet):
    queryset = Nacionalidad.objects.all()
    serializer_class = NacionalidadSerializer