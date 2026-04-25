from django.db import models

class Bitacora(models.Model):
    id_bitacora = models.AutoField(primary_key=True)
    id_login = models.ForeignKey('Login', models.DO_NOTHING, db_column='id_login')
    id_empleado = models.ForeignKey('Empleado', models.DO_NOTHING, db_column='id_empleado')
    fecha = models.DateTimeField()
    accion = models.TextField()
    detalle = models.TextField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'bitacora'


class CategoriaProducto(models.Model):
    id_categoria = models.AutoField(primary_key=True)
    nombre = models.CharField(max_length=100)
    descripcion = models.TextField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'categoria_producto'


class Cliente(models.Model):
    id_cliente = models.AutoField(primary_key=True)
    ci_o_nit = models.CharField(max_length=20, blank=True, null=True)
    nombre = models.CharField(max_length=200)
    fecha_nacimiento = models.DateField(blank=True, null=True)
    celular = models.CharField(max_length=20, blank=True, null=True)
    email = models.CharField(max_length=200, blank=True, null=True)
    direccion = models.TextField(blank=True, null=True)
    fecha_registro = models.DateTimeField()

    class Meta:
        managed = False
        db_table = 'cliente'


class Empleado(models.Model):
    id_empleado = models.AutoField(primary_key=True)
    nombre_empleado = models.CharField(max_length=200)
    ci = models.CharField(unique=True, max_length=20, blank=True, null=True)
    tel_fijo = models.CharField(max_length=20, blank=True, null=True)
    cel = models.CharField(max_length=20, blank=True, null=True)
    tel_contacto = models.CharField(max_length=20, blank=True, null=True)
    nombre_contacto = models.CharField(max_length=200, blank=True, null=True)
    email = models.CharField(max_length=200, blank=True, null=True)
    direccion = models.TextField(blank=True, null=True)
    fecha_ingreso = models.DateField()
    id_turno = models.ForeignKey('Turno', models.DO_NOTHING, db_column='id_turno')
    id_estado_civil = models.ForeignKey('EstadoCivil', models.DO_NOTHING, db_column='id_estado_civil')
    id_nacionalidad = models.ForeignKey('Nacionalidad', models.DO_NOTHING, db_column='id_nacionalidad')
    id_estado = models.ForeignKey('Estado', models.DO_NOTHING, db_column='id_estado')
    id_tipo_contacto = models.ForeignKey('TipoContacto', models.DO_NOTHING, db_column='id_tipo_contacto')
    id_salario = models.ForeignKey('Salario', models.DO_NOTHING, db_column='id_salario')

    class Meta:
        managed = False
        db_table = 'empleado'


class Estado(models.Model):
    id_estado = models.AutoField(primary_key=True)
    descripcion = models.CharField(max_length=100)

    class Meta:
        managed = False
        db_table = 'estado'


class EstadoCivil(models.Model):
    id_estado_civil = models.AutoField(primary_key=True)
    descripcion = models.CharField(max_length=100)

    class Meta:
        managed = False
        db_table = 'estado_civil'


class Login(models.Model):
    id_login = models.AutoField(primary_key=True)
    id_empleado = models.OneToOneField(Empleado, models.DO_NOTHING, db_column='id_empleado')
    nombre = models.CharField(max_length=100)
    email = models.CharField(unique=True, max_length=200)
    password_hash = models.CharField(max_length=255)
    estado = models.CharField(max_length=20)
    fecha_creacion = models.DateTimeField()
    fecha_login = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'login'


class Nacionalidad(models.Model):
    id_nacionalidad = models.AutoField(primary_key=True)
    descripcion = models.CharField(max_length=100)

    class Meta:
        managed = False
        db_table = 'nacionalidad'


class NotaVenta(models.Model):
    id_nota = models.AutoField(primary_key=True)
    id_pedido = models.OneToOneField('Pedido', models.DO_NOTHING, db_column='id_pedido')
    id_cliente = models.ForeignKey(Cliente, models.DO_NOTHING, db_column='id_cliente')
    id_empleado = models.ForeignKey(Empleado, models.DO_NOTHING, db_column='id_empleado')
    fecha = models.DateField()
    nit = models.CharField(max_length=20, blank=True, null=True)
    razon_social = models.CharField(max_length=300, blank=True, null=True)
    total = models.DecimalField(max_digits=12, decimal_places=2)

    class Meta:
        managed = False
        db_table = 'nota_venta'


class Pedido(models.Model):
    id_pedido = models.AutoField(primary_key=True)
    id_cliente = models.ForeignKey(Cliente, models.DO_NOTHING, db_column='id_cliente')
    id_empleado = models.ForeignKey(Empleado, models.DO_NOTHING, db_column='id_empleado')
    fecha = models.DateTimeField()
    estado = models.CharField(max_length=30)
    total = models.DecimalField(max_digits=12, decimal_places=2)

    class Meta:
        managed = False
        db_table = 'pedido'


class PedidoDetalle(models.Model):
    id_detalle = models.AutoField(primary_key=True)
    id_pedido = models.ForeignKey(Pedido, models.DO_NOTHING, db_column='id_pedido')
    id_producto = models.ForeignKey('Producto', models.DO_NOTHING, db_column='id_producto')
    cantidad = models.IntegerField()
    precio_unitario = models.DecimalField(max_digits=12, decimal_places=2)
    subtotal = models.DecimalField(max_digits=12, decimal_places=2)

    class Meta:
        managed = False
        db_table = 'pedido_detalle'


class Producto(models.Model):
    id_producto = models.AutoField(primary_key=True)
    id_categoria = models.ForeignKey(CategoriaProducto, models.DO_NOTHING, db_column='id_categoria')
    nombre = models.CharField(max_length=200)
    descripcion = models.TextField(blank=True, null=True)
    precio = models.DecimalField(max_digits=12, decimal_places=2)
    disponible = models.BooleanField()

    class Meta:
        managed = False
        db_table = 'producto'


class Salario(models.Model):
    id_salario = models.AutoField(primary_key=True)
    descripcion = models.CharField(max_length=150)
    monto = models.DecimalField(max_digits=12, decimal_places=2)

    class Meta:
        managed = False
        db_table = 'salario'


class TipoContacto(models.Model):
    id_tipo_contacto = models.AutoField(primary_key=True)
    descripcion = models.CharField(max_length=100)

    class Meta:
        managed = False
        db_table = 'tipo_contacto'


class Turno(models.Model):
    id_turno = models.AutoField(primary_key=True)
    descripcion = models.CharField(max_length=100)

    class Meta:
        managed = False
        db_table = 'turno'
