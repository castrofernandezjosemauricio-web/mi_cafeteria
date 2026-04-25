from rest_framework import serializers
from api.models import Nacionalidad

class NacionalidadSerializer(serializers.ModelSerializer):
    class Meta:
        model = Nacionalidad
        fields = '__all__'