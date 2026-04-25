from rest_framework import serializers
from api.models import EstadoCivil

class EstadoCivilSerializer(serializers.ModelSerializer):
    class Meta:
        model = EstadoCivil
        fields = '__all__'