<script setup lang="ts">
import { ref, computed } from 'vue'
import { useProductoStore } from '@/stores/productoStore'
import type { Producto } from '@/types/producto'
import type { Solicitud } from '@/types/solicitud'
import { isOutdated } from '@/utils/dateUtils'
import ListofProducts from '@/components/ListofProducts.vue'
import CartSummary from '@/components/CartSummary.vue'

const { productos, solicitudes } = useProductoStore()

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
        <h1 class="text-xl font-bold text-black">TuDistribuidora</h1>
        <span class="text-sm text-primary-100">Cliente</span>
      </div>
    </header>

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
