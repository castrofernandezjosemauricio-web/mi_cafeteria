from rest_framework import serializers
from api.models import Salario

class SalarioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Salario
        fields = '__all__'