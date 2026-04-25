import os
import django
import random
from django.utils import timezone
from decimal import Decimal

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from api.models import (
    CategoriaProducto, Producto, Cliente, 
    Pedido, PedidoDetalle, Empleado, Login
)

def load_demo_data():
    print("Iniciando carga de datos demo...")

    # 1. Categorías
    cats_data = [
        ('Cafetería', 'Cafés calientes y especialidades'),
        ('Repostería', 'Pasteles, tortas y postres'),
        ('Bebidas Frías', 'Jugos, sodas y batidos'),
        ('Bocadillos', 'Sándwiches y snacks salados')
    ]
    categories = []
    for nombre, desc in cats_data:
        cat, _ = CategoriaProducto.objects.get_or_create(nombre=nombre, defaults={'descripcion': desc})
        categories.append(cat)
    print(f"- {len(categories)} categorías creadas.")

    # 2. Productos
    prods_data = [
        ('Espresso', 12.00, categories[0], 'Café corto e intenso'),
        ('Latte Machiatto', 18.00, categories[0], 'Café con mucha leche cremosa'),
        ('Capuccino', 18.00, categories[0], 'Equilibrio perfecto de café y espuma'),
        ('Americano', 14.00, categories[0], 'Espresso con agua caliente'),
        ('Croissant de Mantequilla', 12.00, categories[1], 'Clásico francés siempre fresco'),
        ('Tarta de Arándanos', 25.00, categories[1], 'Deliciosa tarta con frutos rojos'),
        ('Brownie de Chocolate', 15.00, categories[1], 'Chocolate intenso con nueces'),
        ('Limonada Imperial', 15.00, categories[2], 'Fresca con menta y jengibre'),
        ('Iced Coffee', 18.00, categories[2], 'Café frío con hielo y vainilla'),
        ('Sándwich Caprese', 22.00, categories[3], 'Mozzarella, tomate y albahaca'),
        ('Empanada de Carne', 10.00, categories[3], 'Clásica horneada al momento')
    ]
    products = []
    for nombre, precio, cat, desc in prods_data:
        prod, _ = Producto.objects.get_or_create(
            nombre=nombre, 
            defaults={'precio': Decimal(str(precio)), 'id_categoria': cat, 'descripcion': desc, 'disponible': True}
        )
        products.append(prod)
    print(f"- {len(products)} productos creados.")

    # 3. Clientes
    clientes_data = [
        ('1234567', 'Juan Perez', '77012345'),
        ('8765432', 'Maria Garcia', '70098765'),
        ('4455667', 'Carlos Rojas', '65011223'),
        ('9900112', 'Ana Belen', '71044556'),
        ('0', 'Cliente Final', None)
    ]
    clientes = []
    for nit, nombre, cel in clientes_data:
        cli, _ = Cliente.objects.get_or_create(
            nombre=nombre, 
            defaults={'ci_o_nit': nit, 'celular': cel, 'fecha_registro': timezone.now()}
        )
        clientes.append(cli)
    print(f"- {len(clientes)} clientes creados.")

    # 4. Empleado (Usar el admin ya creado)
    empleado = Empleado.objects.first()
    if not empleado:
        print("Error: No se encontró un empleado. Ejecuta primero setup_admin.py")
        return

    # 5. Pedidos Simulados
    for i in range(10):
        cliente = random.choice(clientes)
        num_items = random.randint(1, 4)
        selected_prods = random.sample(products, num_items)
        
        total = Decimal('0.00')
        pedido = Pedido.objects.create(
            id_cliente=cliente,
            id_empleado=empleado,
            fecha=timezone.now() - timezone.timedelta(days=random.randint(0, 5), hours=random.randint(0, 23)),
            estado='Completado',
            total=0 # Update later
        )

        for prod in selected_prods:
            cant = random.randint(1, 3)
            subtotal = prod.precio * cant
            PedidoDetalle.objects.create(
                id_pedido=pedido,
                id_producto=prod,
                cantidad=cant,
                precio_unitario=prod.precio,
                subtotal=subtotal
            )
            total += subtotal
        
        pedido.total = total
        pedido.save()
    
    print("- 10 pedidos de prueba generados.")
    print("¡Carga masiva completada con éxito!")

if __name__ == '__main__':
    load_demo_data()
