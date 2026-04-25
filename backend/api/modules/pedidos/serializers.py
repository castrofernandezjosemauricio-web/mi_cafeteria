from rest_framework import serializers
from api.models import Pedido

class PedidoSerializer(serializers.ModelSerializer):
    id_cliente_nombre = serializers.ReadOnlyField(source='id_cliente.nombre')
    id_empleado_nombre = serializers.ReadOnlyField(source='id_empleado.nombre_empleado')

    class Meta:
        model = Pedido
        fields = '__all__'