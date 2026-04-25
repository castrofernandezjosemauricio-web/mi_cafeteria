from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth.hashers import check_password, make_password
from django.utils import timezone

from api.models import Login, Empleado
from .serializers import LoginRequestSerializer, RegistroRequestSerializer


@api_view(['POST'])
def registrar_usuario(request):
    serializer = RegistroRequestSerializer(data=request.data)

    if not serializer.is_valid():
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    data = serializer.validated_data

    if Login.objects.filter(email=data['email']).exists():
        return Response({'mensaje': 'El email ya está registrado'}, status=status.HTTP_400_BAD_REQUEST)

    empleado = Empleado.objects.create(
        nombre_empleado=data['nombre_empleado'],
        ci=data.get('ci', ''),
        email=data['email'],
        fecha_ingreso=timezone.now().date(),
        id_turno_id=data['id_turno'],
        id_estado_civil_id=data['id_estado_civil'],
        id_nacionalidad_id=data['id_nacionalidad'],
        id_estado_id=data['id_estado'],
        id_tipo_contacto_id=data['id_tipo_contacto'],
        id_salario_id=data['id_salario']
    )

    usuario = Login.objects.create(
        id_empleado=empleado,
        nombre=data['nombre_empleado'],
        email=data['email'],
        password_hash=make_password(data['password']),
        estado='Activo',
        fecha_creacion=timezone.now()
    )

    return Response({
        'mensaje': 'Usuario registrado correctamente',
        'usuario': {
            'id_login': usuario.id_login,
            'id_empleado': empleado.id_empleado,
            'nombre': usuario.nombre,
            'email': usuario.email,
            'estado': usuario.estado
        }
    }, status=status.HTTP_201_CREATED)


@api_view(['POST'])
def login_usuario(request):
    serializer = LoginRequestSerializer(data=request.data)

    if not serializer.is_valid():
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    email = serializer.validated_data['email']
    password = serializer.validated_data['password']

    try:
        usuario = Login.objects.get(email=email)
    except Login.DoesNotExist:
        return Response({'mensaje': 'Usuario no encontrado'}, status=status.HTTP_404_NOT_FOUND)

    if usuario.estado != 'Activo':
        return Response({'mensaje': 'Usuario inactivo'}, status=status.HTTP_403_FORBIDDEN)

    if not check_password(password, usuario.password_hash):
        return Response({'mensaje': 'Contraseña incorrecta'}, status=status.HTTP_401_UNAUTHORIZED)

    usuario.fecha_login = timezone.now()
    usuario.save()

    return Response({
        'mensaje': 'Login correcto',
        'usuario': {
            'id_login': usuario.id_login,
            'id_empleado': usuario.id_empleado.id_empleado,
            'nombre': usuario.nombre,
            'email': usuario.email,
            'estado': usuario.estado,
        }
    }, status=status.HTTP_200_OK)


@api_view(['POST'])
def logout_usuario(request):
    return Response({'mensaje': 'Logout correcto'}, status=status.HTTP_200_OK)