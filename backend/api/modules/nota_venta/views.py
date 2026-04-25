from rest_framework import viewsets
from api.models import NotaVenta
from .serializers import NotaVentaSerializer

class NotaVentaViewSet(viewsets.ModelViewSet):
    queryset = NotaVenta.objects.all()
    serializer_class = NotaVentaSerializer