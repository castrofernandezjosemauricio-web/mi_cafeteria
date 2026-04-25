from rest_framework import serializers
from api.models import PedidoDetalle

class PedidoDetalleSerializer(serializers.ModelSerializer):
    class Meta:
        model = PedidoDetalle
        fields = '__all__'