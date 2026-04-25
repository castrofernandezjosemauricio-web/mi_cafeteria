from rest_framework import viewsets
from api.models import Bitacora
from .serializers import BitacoraSerializer

class BitacoraViewSet(viewsets.ModelViewSet):
    queryset = Bitacora.objects.all()
    serializer_class = BitacoraSerializer