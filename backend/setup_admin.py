import os
import django
from django.utils import timezone
from django.contrib.auth.hashers import make_password

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from api.models import (
    Turno, EstadoCivil, Nacionalidad, Estado, 
    TipoContacto, Salario, Empleado, Login
)

def setup_initial_data():
    # 1. Create auxiliary data if not exists
    turno, _ = Turno.objects.get_or_create(id_turno=1, defaults={'descripcion': 'Mañana'})
    estado_civil, _ = EstadoCivil.objects.get_or_create(id_estado_civil=1, defaults={'descripcion': 'Soltero'})
    nacionalidad, _ = Nacionalidad.objects.get_or_create(id_nacionalidad=1, defaults={'descripcion': 'Boliviana'})
    estado_activo, _ = Estado.objects.get_or_create(id_estado=1, defaults={'descripcion': 'Activo'})
    tipo_contacto, _ = TipoContacto.objects.get_or_create(id_tipo_contacto=1, defaults={'descripcion': 'Personal'})
    salario, _ = Salario.objects.get_or_create(id_salario=1, defaults={'descripcion': 'Básico', 'monto': 2500})

    # 2. Create an employee
    empleado, created = Empleado.objects.get_or_create(
        id_empleado=1,
        defaults={
            'nombre_empleado': 'Administrador',
            'ci': '1234567',
            'email': 'admin@cafeteria.com',
            'fecha_ingreso': timezone.now().date(),
            'id_turno': turno,
            'id_estado_civil': estado_civil,
            'id_nacionalidad': nacionalidad,
            'id_estado': estado_activo,
            'id_tipo_contacto': tipo_contacto,
            'id_salario': salario
        }
    )

    # 3. Create Login
    login_user, created = Login.objects.get_or_create(
        email='admin@cafeteria.com',
        defaults={
            'id_empleado': empleado,
            'nombre': 'Admin',
            'password_hash': make_password('admin123'),
            'estado': 'Activo',
            'fecha_creacion': timezone.now()
        }
    )

    if created:
        print(f"Usuario creado con éxito: admin@cafeteria.com / admin123")
    else:
        print("El usuario ya existía.")

if __name__ == '__main__':
    setup_initial_data()
