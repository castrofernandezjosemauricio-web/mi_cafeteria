from rest_framework import viewsets
from api.models import Salario
from .serializers import SalarioSerializer

class SalarioViewSet(viewsets.ModelViewSet):
    queryset = Salario.objects.all()
    serializer_class = SalarioSerializer