<script setup lang="ts">
import { ref, computed } from 'vue'
import { useProductoStore } from '../stores/productoStore'
import type { Producto } from '../types/producto'
import type { Solicitud } from '../types/solicitud'

const { productos, solicitudes } = useProductoStore()

const carrito = ref<Producto[]>([])
const respondioWarning = ref(false)

const total = computed(() => {
  return carrito.value.reduce((acumulador, producto) => acumulador + producto.precio, 0)
})

const hayPreciosAntiguos = computed(() => {
  return carrito.value.some(p => precioAntiguo(p.fechaPrecio))
})

function agregarAlCarrito(producto: Producto) {
  const yaEsta = carrito.value.some(p => p.codigo === producto.codigo)
  if (!yaEsta) {
    carrito.value.push(producto)
  }
}

function precioAntiguo(fecha: Date): boolean {
  const hoy = new Date()
  const diferencia = hoy.getTime() - new Date(fecha).getTime()
  const treintaDiasEnMs = 1000 * 60 * 60 * 24 * 30
  return diferencia > treintaDiasEnMs
}

function solicitarActualizacion(codigoProducto: number, nombreProducto: string) {
  const yaExiste = solicitudes.value.some(s => s.codigoProducto === codigoProducto)
  if (!yaExiste) {
    const solicitud: Solicitud = { codigoProducto, nombreProducto }
    solicitudes.value.push(solicitud)
  }
}

function solicitarTodosLosDesactualizados() {
  carrito.value
    .filter(p => precioAntiguo(p.fechaPrecio))
    .forEach(p => solicitarActualizacion(p.codigo, p.nombre))
  respondioWarning.value = true
}

function rechazarActualizacion() {
  carrito.value = []
  respondioWarning.value = false
}

function cancelarPedido() {
  carrito.value = []
  respondioWarning.value = false
}

function confirmarPedido() {
  carrito.value = []
  respondioWarning.value = false
  alert('¡Pedido exitoso!')
}
</script>

<template>
  <h1>Catálogo de Productos</h1>

  <table>
    <thead>
      <tr>
        <th>Código</th>
        <th>Nombre</th>
        <th>Precio</th>
        <th>Estado</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="producto in productos" :key="producto.codigo">
        <td>{{ producto.codigo }}</td>
        <td>{{ producto.nombre }}</td>
        <td>{{ precioAntiguo(producto.fechaPrecio) ? 'Precio desactualizado' : '$' + producto.precio }}</td>
        <td>
          <button
            @click="agregarAlCarrito(producto)"
            :disabled="carrito.some(p => p.codigo === producto.codigo)"
          >
            {{ carrito.some(p => p.codigo === producto.codigo) ? 'Agregado' : 'Agregar al carrito' }}
          </button>
        </td>
      </tr>
    </tbody>
  </table>

  <div v-if="carrito.length > 0">
    <h2>Tu pedido</h2>
    <ul>
      <li v-for="item in carrito" :key="item.codigo">
        {{ item.nombre }} — ${{ precioAntiguo(item.fechaPrecio) ? 'Precio desactualizado' : item.precio }}
      </li>
    </ul>
    <p><strong>Total: ${{ total }}</strong></p>

    <div v-if="hayPreciosAntiguos && !respondioWarning">
      <p>⚠️ Hay precios desactualizados</p>
      <p>¿Deseás pedir que actualicen los precios?</p>
      <button @click="solicitarTodosLosDesactualizados">Sí</button>
      <button @click="rechazarActualizacion">No</button>
    </div>

    <div v-else-if="hayPreciosAntiguos && respondioWarning">
      <p>⏳ Solicitud enviada. Esperá que el admin actualice los precios para confirmar tu pedido.</p>
    </div>

    <div v-else>
      <button @click="cancelarPedido">Cancelar</button>
      <button @click="confirmarPedido">Confirmar</button>
    </div>
  </div>
</template>
