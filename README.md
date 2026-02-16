# Pedidos & Clientes - Frontend

Aplicación web desarrollada con Next.js que consume la API de Pedidos & Clientes. Permite visualizar el listado de pedidos de un cliente (con paginación) y crear nuevos pedidos.

## Requisitos

- Node.js 18 o superior
- Backend en ejecución (Order Service en puerto 3002, Customer Service en puerto 3001)

## Instalación

```bash
npm install
```

## Configuración

Copiar el archivo `.env.local.example` a `.env.local` y ajustar las URLs si es necesario:

```
NEXT_PUBLIC_ORDER_SERVICE_URL=http://localhost:3002
NEXT_PUBLIC_CUSTOMER_SERVICE_URL=http://localhost:3001
```

Por defecto apunta a localhost. Si los servicios backend corren en otra máquina o puerto, modificar estas variables.

## Ejecutar en desarrollo

```bash
npm run dev
```

Abrir el navegador en [http://localhost:3000](http://localhost:3000)

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

---

## Arquitectura y buenas prácticas

### Arquitectura

- **Next.js App Router**: Rutas en `src/app/` (page.tsx por ruta). Layout raíz en `layout.tsx` con fuentes y estilos globales.
- **Capas**: `lib/api.ts` (llamadas HTTP), `types/` (TypeScript), `hooks/` (lógica reutilizable), `components/` (UI reutilizable), `app/` (páginas que componen hooks y componentes).
- **Configuración**: Variables de entorno para URLs de los servicios; constantes de negocio en `lib/constants.ts`.

### Gestión de datos (state, storage, caché)

- **Estado de UI**: `useState` en páginas para selección de cliente, página actual, formularios y mensajes de error.
- **Datos del servidor**: Hooks `useCustomers` y `useOrders` encapsulan fetch, estado (lista, loading, error) y evitan duplicar lógica.
- **Caché en memoria**: `useCustomers` usa una caché con TTL (60 s) a nivel de módulo para no refetch en cada montaje; listado y formulario comparten la misma fuente.
- **Sin almacenamiento persistente**: No se usa `localStorage`/`sessionStorage`; los datos vienen del backend en cada carga o al cambiar filtros.

### Componentes

- **Navbar**: Barra de navegación reutilizable con enlace activo (`active`: home | orders | new).
- **AppCard**: Envoltorio de tarjeta con clases de diseño unificadas (`card-app`).
- **AlertError**: Mensaje de error con icono (Font Awesome).
- **LoadingSpinner**: Spinner de carga con mensaje opcional.
- Las páginas componen estos elementos en lugar de repetir markup y estilos.

### Hooks

- **useCustomers()**: Devuelve `{ customers, loading, error }`. Carga la lista de clientes una vez y la reutiliza con caché.
- **useOrders(customerId, page, perPage)**: Devuelve `{ orders, total, loading, error, refetch }`. Carga pedidos según cliente y página.
- **usePriceFormat(maxPrice?)**: Devuelve `priceDisplay`, `formatPrice`, `parsePrice`, `handlePriceChange`, `handlePriceBlur` para input de precio con formato miles (punto) y decimales (coma) en español.

### Estilos (CSS, metodología)

- **Bootstrap 5**: Base de grid, utilidades, formularios, tablas y componentes. Importado en `layout.tsx`.
- **Variables CSS** (`globals.css`): Paleta y tokens (`--app-primary`, `--app-bg`, `--app-radius`, `--navbar-bg`, etc.) para mantener consistencia y facilitar cambios.
- **Clases semánticas**: `.card-app`, `.table-app`, `.form-control-app`, `.btn-app`, `.navbar-app`, `.page-title`, `.empty-state` aplican el diseño del proyecto sobre Bootstrap.
- **Sin preprocesador**: CSS plano; las variables nativas cubren temas y espaciados. Estructura por bloques (navbar, cards, tabla, formularios) con nombres descriptivos.
- **Font Awesome**: Iconos desde `@fortawesome/react-fontawesome` y `free-solid-svg-icons`; uso de `spin` para estados de carga.
