from rest_framework import viewsets
from api.models import PedidoDetalle
from .serializers import PedidoDetalleSerializer

class PedidoDetalleViewSet(viewsets.ModelViewSet):
    queryset = PedidoDetalle.objects.all()
    serializer_class = PedidoDetalleSerializer