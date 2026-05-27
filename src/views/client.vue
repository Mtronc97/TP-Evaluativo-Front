<script setup lang="ts">
import { ref, computed } from 'vue'
import { useProductoStore } from '../stores/productoStore'
import type { Producto } from '../types/producto'
import type { Solicitud } from '../types/solicitud'

const { productos, solicitudes } = useProductoStore()

// Carrito de productos seleccionados
const cart = ref<Producto[]>([])
// Indica si el usuario ya respondió al warning de precios desactualizados
const answeredWarning = ref(false)

// Total calculado con computed (no muta el array original)
const total = computed((): number => {
  return cart.value.reduce((acc, product) => acc + product.precio, 0)
})

// Verifica si hay al menos un producto con precio desactualizado en el carrito
const hasOutdatedPrices = computed((): boolean => {
  return cart.value.some((p) => isOutdated(p.fechaPrecio))
})

// Agrega un producto al carrito si no está ya incluido
function addToCart(product: Producto): void {
  const alreadyInCart: boolean = cart.value.some((p) => p.codigo === product.codigo)
  if (!alreadyInCart) {
    cart.value.push(product)
  }
}

// Devuelve true si la fecha tiene más de 30 días de antigüedad
function isOutdated(date: Date): boolean {
  const now: Date = new Date()
  const diff: number = now.getTime() - new Date(date).getTime()
  const thirtyDaysMs: number = 1000 * 60 * 60 * 24 * 30
  return diff > thirtyDaysMs
}

// Envía una solicitud de actualización al admin para un producto
function requestPriceUpdate(productCode: number, productName: string): void {
  const alreadyRequested: boolean = solicitudes.value.some((s) => s.codigoProducto === productCode)
  if (!alreadyRequested) {
    const request: Solicitud = { codigoProducto: productCode, nombreProducto: productName }
    solicitudes.value.push(request)
  }
}

// Solicita actualización para todos los productos desactualizados del carrito
function requestAllOutdated(): void {
  cart.value
    .filter((p) => isOutdated(p.fechaPrecio))
    .forEach((p) => requestPriceUpdate(p.codigo, p.nombre))
  answeredWarning.value = true
}

// Rechaza la actualización y vacía el carrito
function rejectUpdate(): void {
  cart.value = []
  answeredWarning.value = false
}

// Cancela el pedido y reinicia el estado
function cancelOrder(): void {
  cart.value = []
  answeredWarning.value = false
}

// Confirma el pedido y reinicia el estado
function confirmOrder(): void {
  cart.value = []
  answeredWarning.value = false
  alert('¡Pedido exitoso!')
}
</script>

<template>
  <div class="min-h-screen bg-gray-50">

    <!-- Header -->
    <header class="bg-primary-500 shadow-sm">
      <div class="max-w-7xl mx-auto px-4 md:px-6 py-4 flex items-center justify-between">
        <h1 class="text-xl font-bold text-white">TuDistribuidora</h1>
        <span class="text-sm text-primary-100">Cliente</span>
      </div>
    </header>

    <main class="max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-8 flex flex-col lg:flex-row gap-6 lg:gap-8">

      <!-- Tabla de productos (izquierda) -->
      <section class="flex-1 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div class="px-6 py-4 border-b border-gray-200">
          <h2 class="text-lg font-semibold text-gray-800">Catálogo de Productos</h2>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full text-sm">
            <thead class="bg-gray-50 text-left">
              <tr>
                <th class="px-6 py-3 font-medium text-gray-600">Código</th>
                <th class="px-6 py-3 font-medium text-gray-600">Producto</th>
                <th class="px-6 py-3 font-medium text-gray-600">Precio</th>
                <th class="px-6 py-3 font-medium text-gray-600">Acción</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100">
              <tr
                v-for="product in productos"
                :key="product.codigo"
                class="hover:bg-gray-50 transition"
              >
                <td class="px-6 py-3 text-gray-700">{{ product.codigo }}</td>
                <td class="px-6 py-3 text-gray-700">{{ product.nombre }}</td>
                <td class="px-6 py-3">
                  <span
                    v-if="isOutdated(product.fechaPrecio)"
                    class="text-amber-600 font-medium"
                  >
                    Precio desactualizado
                  </span>
                  <span v-else class="text-gray-700">${{ product.precio }}</span>
                </td>
                <td class="px-6 py-3">
                  <button
                    @click="addToCart(product)"
                    :disabled="cart.some((p) => p.codigo === product.codigo)"
                    class="px-3 py-1 text-sm rounded-lg transition"
                    :class="cart.some((p) => p.codigo === product.codigo)
                      ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                      : 'bg-primary-500 text-white hover:bg-primary-600'"
                  >
                    {{ cart.some((p) => p.codigo === product.codigo) ? 'Agregado' : 'Agregar' }}
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <!-- Sección del carrito / pedido (derecha, siempre visible) -->
      <aside
        class="w-full lg:w-80 bg-white rounded-xl shadow-sm border border-gray-200 p-6 self-start lg:sticky lg:top-8"
      >
        <h2 class="text-lg font-semibold text-gray-800 mb-4">Tu Pedido</h2>

        <!-- Carrito vacío -->
        <p v-if="cart.length === 0" class="text-gray-400 text-sm text-center py-4">
          Agregá productos desde el catálogo
        </p>

        <!-- Carrito con items -->
        <template v-else>
          <!-- Lista de items en el carrito -->
          <ul class="divide-y divide-gray-100 mb-4">
            <li
              v-for="item in cart"
              :key="item.codigo"
              class="py-3 flex justify-between items-center"
            >
              <span class="text-gray-700">{{ item.nombre }}</span>
              <span v-if="isOutdated(item.fechaPrecio)" class="text-amber-600 text-sm font-medium">
                Precio desactualizado
              </span>
              <span v-else class="text-gray-800 font-medium">${{ item.precio }}</span>
            </li>
          </ul>

          <!-- Total -->
          <div class="border-t border-gray-200 pt-4 flex justify-between items-center">
            <span class="text-lg font-bold text-gray-800">Total:</span>
            <span class="text-lg font-bold text-primary-500">${{ total }}</span>
          </div>

          <!-- Warning: hay precios desactualizados y no respondió aún -->
          <div
            v-if="hasOutdatedPrices && !answeredWarning"
            class="mt-6 bg-amber-50 border border-amber-200 rounded-lg p-4"
          >
            <p class="text-amber-800 font-medium">⚠️ Hay precios desactualizados en tu pedido</p>
            <p class="text-amber-700 text-sm mt-1">¿Deseás consultar los precios actualizados?</p>
            <div class="mt-3 flex gap-3">
              <button
                @click="requestAllOutdated"
                class="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition text-sm font-medium"
              >
                Sí, solicitar
              </button>
              <button
                @click="rejectUpdate"
                class="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition text-sm font-medium"
              >
                No, cancelar pedido
              </button>
            </div>
          </div>

          <!-- Solicitud enviada, esperando al admin -->
          <div
            v-else-if="hasOutdatedPrices && answeredWarning"
            class="mt-6 bg-primary-50 border border-primary-200 rounded-lg p-4"
          >
            <p class="text-primary-800 font-medium">⏳ Solicitud enviada</p>
            <p class="text-primary-700 text-sm mt-1">Esperá que el distribuidor actualice los precios para confirmar tu pedido.</p>
          </div>

          <!-- Todo ok: puede confirmar o cancelar -->
          <div v-else class="mt-6 flex gap-3 justify-end">
            <button
              @click="cancelOrder"
              class="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition font-medium"
            >
              Cancelar
            </button>
            <button
              @click="confirmOrder"
              class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-medium"
            >
              Confirmar Pedido
            </button>
          </div>
        </template>
      </aside>

    </main>
  </div>
</template>
