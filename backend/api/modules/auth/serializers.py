from rest_framework import serializers


class LoginRequestSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)


class RegistroRequestSerializer(serializers.Serializer):
    nombre_empleado = serializers.CharField(max_length=200)
    ci = serializers.CharField(max_length=20, required=False, allow_blank=True)
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

    id_turno = serializers.IntegerField()
    id_estado_civil = serializers.IntegerField()
    id_nacionalidad = serializers.IntegerField()
    id_estado = serializers.IntegerField()
    id_tipo_contacto = serializers.IntegerField()
    id_salario = serializers.IntegerField()


class LogoutRequestSerializer(serializers.Serializer):
    id_login = serializers.IntegerField(required=False)