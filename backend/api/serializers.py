from rest_framework import serializers
from .models import CategoriaProducto, Producto, Cliente, Empleado, Pedido, PedidoDetalle

class LoginSerializer(serializers.ModelSerializer):
    class Meta:
        model = Login
        fields = [
            'id_login',
            'id_empleado',
            'nombre',
            'email',
            'estado',
            'fecha_creacion',
            'fecha_login'
        ]
        
class CategoriaProductoSerializer(serializers.ModelSerializer):
    class Meta:
        model = CategoriaProducto
        fields = '__all__'


class ProductoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Producto
        fields = '__all__'


class ClienteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Cliente
        fields = '__all__'


class EmpleadoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Empleado
        fields = '__all__'


class PedidoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Pedido
        fields = '__all__'


class PedidoDetalleSerializer(serializers.ModelSerializer):
    class Meta:
        model = PedidoDetalle
        fields = '__all__'