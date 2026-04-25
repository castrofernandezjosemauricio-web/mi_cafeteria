from rest_framework import viewsets
from api.models import EstadoCivil
from .serializers import EstadoCivilSerializer

class EstadoCivilViewSet(viewsets.ModelViewSet):
    queryset = EstadoCivil.objects.all()
    serializer_class = EstadoCivilSerializer