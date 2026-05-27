<script setup lang="ts">
import { ref } from 'vue'
import { useProductoStore } from '../stores/productoStore'
import type { Producto } from '../types/producto'

const { productos, solicitudes } = useProductoStore()
const nuevosPrecio = ref<Record<number, number>>({})

const nuevoProducto = ref<Producto>({
  codigo: 0,
  nombre: '',
  precio: 0,
  fechaPrecio: new Date()
})

function agregarProducto() {
  productos.value.push({ ...nuevoProducto.value })

  nuevoProducto.value = { codigo: 0, nombre: '', precio: 0, fechaPrecio: new Date() }
}

function eliminarProducto(codigo: number) {
  productos.value = productos.value.filter(p => p.codigo !== codigo)
}

function actualizarPrecio (codigo: number, nuevoPrecio: number) {
  const producto = productos.value.find(p => p.codigo === codigo)
  if (producto) {
    producto.precio = nuevoPrecio
    producto.fechaPrecio = new Date()
    solicitudes.value = solicitudes.value.filter(s => s.codigoProducto !== codigo)
  }
}

</script>

<template>

  <div v-if="solicitudes.length > 0">
  <h2>⚠️ Solicitudes de actualización de precio</h2>
  <div v-for="solicitud in solicitudes" :key="solicitud.codigoProducto">
    <p>El cliente solicitó actualizar el precio de: <strong>{{ solicitud.nombreProducto }}</strong></p>
    <input
  type="number"
  placeholder="Nuevo precio"
  v-model="nuevosPrecio[solicitud.codigoProducto]"
/>
<button @click="actualizarPrecio(solicitud.codigoProducto, nuevosPrecio[solicitud.codigoProducto] ?? 0)">
  Confirmar nuevo precio
</button>
  </div>
</div>

  <h1>Panel Admin</h1>

  <!--
  @submit escucha el evento de envío del formulario.
  El .prevent es un modificador que ejecuta event.preventDefault() automáticamente,
  evitando que la página se recargue al hacer submit.
  -->
  <form @submit.prevent="agregarProducto">
    <input v-model="nuevoProducto.codigo" type="number" placeholder="Código" />
    <input v-model="nuevoProducto.nombre" type="text" placeholder="Nombre" />
    <input v-model="nuevoProducto.precio" type="number" placeholder="Precio" />
    <button type="submit">Agregar</button>
  </form>
</template>
