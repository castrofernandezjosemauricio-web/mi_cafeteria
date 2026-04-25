from rest_framework import serializers
from api.models import NotaVenta

class NotaVentaSerializer(serializers.ModelSerializer):
    class Meta:
        model = NotaVenta
        fields = '__all__'