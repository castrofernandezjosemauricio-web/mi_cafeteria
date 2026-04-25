from rest_framework import viewsets
from api.models import TipoContacto
from .serializers import TipoContactoSerializer

class TipoContactoViewSet(viewsets.ModelViewSet):
    queryset = TipoContacto.objects.all()
    serializer_class = TipoContactoSerializer