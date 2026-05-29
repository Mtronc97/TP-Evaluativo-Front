<script setup lang="ts">
import type { Producto } from '@/types/producto'
import { isOutdated } from '@/utils/dateUtils'

// Props tipadas desde el padre (client.vue)
defineProps<{
  cart: Producto[]
  total: number
  hasOutdatedPrices: boolean
  answeredWarning: boolean
}>()

// Emits tipados: acciones del carrito hacia el padre
defineEmits<{
  (e: 'request-outdated'): void
  (e: 'reject-update'): void
  (e: 'cancel-order'): void
  (e: 'confirm-order'): void
}>()
</script>

<template>
  <aside class="w-full lg:w-80 bg-white rounded-xl shadow-sm border border-gray-200 p-6 self-start lg:sticky lg:top-8">
    <h2 class="text-lg font-semibold text-gray-800 mb-4">Tu Pedido</h2>

    <!-- Carrito vacío -->
    <p v-if="cart.length === 0" class="text-gray-400 text-sm text-center py-4">
      Agregá productos desde el catálogo
    </p>

    <!-- Carrito con items -->
    <template v-else>
      <!-- Lista de items -->
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

      <!-- Warning: precios desactualizados sin responder -->
      <div
        v-if="hasOutdatedPrices && !answeredWarning"
        class="mt-6 bg-amber-50 border border-amber-200 rounded-lg p-4"
      >
        <p class="text-amber-800 font-medium">⚠️ Hay precios desactualizados en tu pedido</p>
        <p class="text-amber-700 text-sm mt-1">¿Deseás consultar los precios actualizados?</p>
        <div class="mt-3 flex gap-3">
          <button
            @click="$emit('request-outdated')"
            class="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition text-sm font-medium"
          >
            Sí, solicitar
          </button>
          <button
            @click="$emit('reject-update')"
            class="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition text-sm font-medium"
          >
            No, cancelar pedido
          </button>
        </div>
      </div>

      <!-- Solicitud enviada -->
      <div
        v-else-if="hasOutdatedPrices && answeredWarning"
        class="mt-6 bg-primary-50 border border-primary-200 rounded-lg p-4"
      >
        <p class="text-primary-800 font-medium">⏳ Solicitud enviada</p>
        <p class="text-primary-700 text-sm mt-1">Esperá que el distribuidor actualice los precios para confirmar tu pedido.</p>
      </div>

      <!-- Todo ok: confirmar o cancelar -->
      <div v-else class="mt-6 flex gap-3 justify-end">
        <button
          @click="$emit('cancel-order')"
          class="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition font-medium"
        >
          Cancelar
        </button>
        <button
          @click="$emit('confirm-order')"
          class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-medium"
        >
          Confirmar Pedido
        </button>
      </div>
    </template>
  </aside>
</template>
