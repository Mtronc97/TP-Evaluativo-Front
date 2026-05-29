<script setup lang="ts">
import { ref, computed } from 'vue'
import { useProductoStore } from '@/stores/productoStore'
import { usePedidoStore } from '@/stores/pedidoStore'
import type { Producto } from '@/types/producto'
import { isOutdated } from '@/utils/dateUtils'
import ListofProducts from '@/components/ListofProducts.vue'
import CartSummary from '@/components/CartSummary.vue'

const { productos } = useProductoStore()
const { pedidos, createPedido } = usePedidoStore()

// Pedidos del cliente actual (filtrados por clienteId)
const myPedidos = computed(() => {
  return pedidos.value.filter((p) => p.clienteId === 1)
})

// Toggle para mostrar/ocultar la sección de pedidos
const showPedidos = ref<boolean>(false)

// Carrito de productos seleccionados
const cart = ref<Producto[]>([])
// Indica si el usuario ya respondió al warning de precios desactualizados
const answeredWarning = ref<boolean>(false)

// Códigos de productos en el carrito (para pasar como prop)
const cartCodes = computed((): number[] => {
  return cart.value.map((p) => p.codigo)
})

// Total calculado con computed
const total = computed((): number => {
  return cart.value.reduce((acc, product) => acc + product.precio, 0)
})

// Verifica si hay al menos un producto con precio desactualizado
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

// Solicita actualización de precios: crea pedido en estado 'Verificando'
function requestAllOutdated(): void {
  createPedido({
    clienteId: 1,
    productos: [...cart.value],
    total: total.value,
    estado: 'Verificando',
    fecha: new Date().toISOString()
  })
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

// Confirma el pedido, lo guarda en localStorage y reinicia el estado
function confirmOrder(): void {
  createPedido({
    clienteId: 1,
    productos: [...cart.value],
    total: total.value,
    estado: 'Confirmado',
    fecha: new Date().toISOString()
  })

  cart.value = []
  answeredWarning.value = false
  alert('¡Pedido guardado exitosamente!')
}
</script>

<template>
  <div class="min-h-screen bg-gray-50">

    <!-- Header -->
    <header class="bg-primary-500 shadow-sm">
      <div class="max-w-7xl mx-auto px-4 md:px-6 py-4 flex items-center justify-between">
        <h1 class="text-xl font-bold text-black">TuDistribuidora</h1>
        <span class="text-sm text-primary-100">Cliente</span>
      </div>
    </header>

    <!-- Botón toggle para Mis Pedidos -->
    <div v-if="myPedidos.length > 0" class="max-w-7xl mx-auto px-4 md:px-6 pt-6">
      <button
        @click="showPedidos = !showPedidos"
        class="w-full flex items-center justify-between bg-white rounded-xl shadow-sm border border-gray-200 px-4 md:px-6 py-4 hover:bg-gray-50 transition"
      >
        <span class="text-lg font-semibold text-gray-800">
          Mis Pedidos ({{ myPedidos.length }})
        </span>
        <span class="text-sm text-gray-500">
          {{ showPedidos ? '▲ Ocultar' : '▼ Ver pedidos' }}
        </span>
      </button>

      <!-- Contenido colapsable -->
      <div
        v-if="showPedidos"
        class="mt-3 bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-6"
      >
        <div class="space-y-2">
          <div
            v-for="pedido in myPedidos"
            :key="pedido.id"
            class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border border-gray-100 rounded-lg p-3"
          >
            <div>
              <p class="text-gray-700 text-sm font-medium">Pedido #{{ pedido.id }} — {{ pedido.productos.length }} productos</p>
              <p class="text-gray-500 text-xs">Total: ${{ pedido.total }}</p>
            </div>
            <span
              class="inline-block px-2 py-0.5 text-xs rounded-full font-medium"
              :class="{
                'bg-amber-100 text-amber-700': pedido.estado === 'Verificando',
                'bg-blue-100 text-blue-700': pedido.estado === 'Confirmado',
                'bg-green-100 text-green-700': pedido.estado === 'Completado',
                'bg-gray-100 text-gray-600': pedido.estado === 'Borrador'
              }"
            >
              {{ pedido.estado === 'Confirmado' ? '✅ Precios actualizados' : pedido.estado }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <main class="max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-8 flex flex-col lg:flex-row gap-6 lg:gap-8">

      <!-- Hijo: tabla de productos (dentro tiene ProductRow como nieto) -->
      <ListofProducts
        :products="productos"
        title="Catálogo de Productos"
        :editable="false"
        :deletable="false"
        :addable="true"
        :show-date="false"
        :cart-codes="cartCodes"
        @add-to-cart="addToCart"
      />

      <!-- Hijo: resumen del carrito -->
      <CartSummary
        :cart="cart"
        :total="total"
        :has-outdated-prices="hasOutdatedPrices"
        :answered-warning="answeredWarning"
        @request-outdated="requestAllOutdated"
        @reject-update="rejectUpdate"
        @cancel-order="cancelOrder"
        @confirm-order="confirmOrder"
      />

    </main>
  </div>
</template>
