# TP Evaluativo - Distribuidora de Productos

## Integrantes

- **Tomas Quintana**
- **Mariano Troncoso**

## Stack Tecnologico

- Vue 3 (Composition API con `<script setup>`)
- TypeScript
- Tailwind CSS 4
- Vue Router 5
- Vite

## Instalacion y ejecucion

```sh
npm install
npm run dev
```

## Credenciales de prueba

| Usuario | Email | Contraseña | Rol |
|---------|-------|------------|-----|
| Carlos Lopez | admin@distribuidora.com | admin123 | Admin |
| Maria Gonzalez | maria@gmail.com | maria123 | Cliente |
| Juan Perez | juan@gmail.com | juan123 | Cliente |
| Ana Martinez | ana@gmail.com | ana123 | Cliente |

## Funcionalidades

### Cliente
- Ver catalogo de productos con indicador de precio desactualizado (>30 dias)
- Crear pedidos agregando productos al carrito
- Si hay precios desactualizados, enviar consulta al admin (pedido en estado "Verificando")
- Si todos los precios estan vigentes, confirmar pedido directamente
- Ver historial de pedidos con sus estados

### Admin
- Gestionar productos (agregar, editar precio, eliminar)
- Atender pedidos en verificacion (ingresar precios actualizados y confirmar)
- Marcar pedidos confirmados como completados
- CRUD de usuarios con validaciones (nombre, email, DNI, contraseña)
- Vista detalle de usuario con sus pedidos asociados

### General
- Login y registro con validaciones
- Navegacion por roles (admin ve dashboard, cliente ve catalogo)
- Sidebar de navegacion en el panel admin
- Datos persistidos en localStorage

## Estructura del proyecto

```
src/
├── components/          # Componentes reutilizables (hijos/nietos)
│   ├── AddProductForm.vue
│   ├── AdminSidebar.vue
│   ├── CartSummary.vue
│   ├── ListofProducts.vue
│   └── ProductRow.vue
├── views/               # Vistas principales (padres)
│   ├── home.vue
│   ├── client.vue
│   ├── AdminLayout.vue
│   ├── AdminDashboard.vue
│   ├── UserList.vue
│   └── UserDetail.vue
├── stores/              # Estado reactivo compartido
│   ├── productoStore.ts
│   ├── pedidoStore.ts
│   └── userStore.ts
├── types/               # Interfaces TypeScript
│   ├── producto.ts
│   ├── pedido.ts
│   └── user.ts
├── utils/               # Funciones utilitarias
│   └── dateUtils.ts
├── routes.ts            # Configuracion de rutas
└── main.ts              # Entry point
```

## Arquitectura de componentes (3 niveles)

```
AdminLayout (Padre)
└── AdminDashboard (Hijo)
    └── ListofProducts (Hijo)
        └── ProductRow (Nieto)
```

```
client.vue (Padre)
├── ListofProducts (Hijo)
│   └── ProductRow (Nieto)
└── CartSummary (Hijo)
```

## Estados de un pedido

1. **Verificando** — El cliente envio un pedido con precios desactualizados, esperando que el admin los actualice
2. **Confirmado** — El admin actualizo los precios o el cliente confirmo con precios vigentes
3. **Completado** — El admin marco el pedido como entregado
