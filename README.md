# Orders & Customers - Frontend

Aplicación web desarrollada con Next.js que consume la API de Orders & Customers. Permite visualizar el listado de pedidos de un cliente (con paginación) y crear nuevos pedidos.

## Requisitos

- Node.js 18 o superior
- Backend en ejecución (Order Service en puerto 3002, Customer Service en puerto 3001)

## Instalación

```bash
npm install
```

## Configuración

Copia el archivo `.env.local.example` a `.env.local` y ajusta las URLs si es necesario:

```
NEXT_PUBLIC_ORDER_SERVICE_URL=http://localhost:3002
NEXT_PUBLIC_CUSTOMER_SERVICE_URL=http://localhost:3001
```

Por defecto apunta a localhost. Si los servicios backend corren en otra máquina o puerto, modifica estas variables.

## Ejecutar en desarrollo

```bash
npm run dev
```

Abre el navegador en [http://localhost:3000](http://localhost:3000)

## Compilar para producción

```bash
npm run build
npm start
```

## Funcionalidades

- **Listado de pedidos**: Vista paginada (20 resultados por página) de los pedidos de un cliente. Primero debes seleccionar un cliente en el desplegable.
- **Crear pedido**: Formulario para crear pedidos indicando cliente, producto, cantidad, precio y estado.

## Rutas

- `/` - Página de inicio con enlaces a las secciones
- `/orders` - Listado de pedidos por cliente (paginado)
- `/orders/new` - Formulario de creación de pedido
