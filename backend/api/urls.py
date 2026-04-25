from django.urls import path, include

urlpatterns = [
    path('auth/', include('api.modules.auth.urls')),

    path('turnos/', include('api.modules.turnos.urls')),
    path('estados-civiles/', include('api.modules.estado_civil.urls')),
    path('nacionalidades/', include('api.modules.nacionalidades.urls')),
    path('estados/', include('api.modules.estados.urls')),
    path('tipos-contacto/', include('api.modules.tipos_contacto.urls')),
    path('salarios/', include('api.modules.salarios.urls')),

    path('categorias/', include('api.modules.categorias.urls')),
    path('productos/', include('api.modules.productos.urls')),
    path('clientes/', include('api.modules.clientes.urls')),
    path('empleados/', include('api.modules.empleados.urls')),
    path('pedidos/', include('api.modules.pedidos.urls')),
    path('pedido-detalles/', include('api.modules.pedido_detalles.urls')),
    path('nota-venta/', include('api.modules.nota_venta.urls')),
    path('bitacora/', include('api.modules.bitacora.urls')),
]