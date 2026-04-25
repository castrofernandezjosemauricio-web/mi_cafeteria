# Cafetería Frontend - React + Vite

Este es el frontend moderno para el sistema de gestión de cafetería, construido con React, Vite, Framer Motion y Lucide React.

## Características
- **Diseño Premium**: Estética Glassmorphism (vidrio esmerilado) con animaciones fluidas.
- **Autenticación**: Integrada con el backend de Django.
- **Gestión de Productos**: CRUD completo con estados de carga y modales animados.
- **Dashboard**: Estadísticas visuales y tabla de pedidos recientes.
- **Responsivo**: Adaptable a dispositivos móviles y escritorio.

## Requisitos
- **Backend**: El servidor Django debe estar corriendo en `http://localhost:8000`.
- **Frontend**: Necesitas Node.js o Deno.

## Cómo ejecutar

### Usando Deno (Recomendado ya que lo tienes instalado)
No necesitas instalar nada manualmente, Deno descargará las dependencias necesarias.
```bash
cd frontend
deno task dev
```

### Usando Node.js
Si prefieres usar Node.js:
1. Instala las dependencias:
   ```bash
   npm install
   ```
2. Inicia el servidor de desarrollo:
   ```bash
   npm run dev
   ```

El frontend estará disponible en `http://localhost:5173`.

## Estructura del Proyecto
- `src/services/api.js`: Configuración de Axios para peticiones al backend.
- `src/index.css`: Sistema de diseño basado en variables y Glassmorphism.
- `src/pages/`: Páginas principales (Login, Dashboard, Productos).
