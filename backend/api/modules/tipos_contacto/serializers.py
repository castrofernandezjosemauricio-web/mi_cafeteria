from rest_framework import serializers
from api.models import TipoContacto

class TipoContactoSerializer(serializers.ModelSerializer):
    class Meta:
        model = TipoContacto
        fields = '__all__'