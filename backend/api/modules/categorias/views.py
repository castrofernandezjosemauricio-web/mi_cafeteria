from rest_framework import viewsets
from api.models import CategoriaProducto
from .serializers import CategoriaProductoSerializer

class CategoriaProductoViewSet(viewsets.ModelViewSet):
    queryset = CategoriaProducto.objects.all()
    serializer_class = CategoriaProductoSerializer