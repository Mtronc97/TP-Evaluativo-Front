<script setup lang="ts">
import { ref } from 'vue'
import type { Solicitud } from '@/types/solicitud'

// Props: lista de solicitudes pendientes
defineProps<{
  requests: Solicitud[]
}>()

// Emit: confirmar nuevo precio para una solicitud
const emit = defineEmits<{
  (e: 'update-price', code: number, price: number): void
}>()

// Precios ingresados por el admin (uno por solicitud)
const newPrices = ref<Record<number, number>>({})

// Confirma el precio y emite al padre
function confirmPrice(code: number): void {
  const price: number = newPrices.value[code] ?? 0
  emit('update-price', code, price)
}
</script>

<template>
  <section
    v-if="requests.length > 0"
    class="bg-amber-50 border border-amber-200 rounded-xl p-4 md:p-6"
  >
    <h2 class="text-lg font-semibold text-amber-800 mb-4">
      ⚠️ Solicitudes de precio ({{ requests.length }})
    </h2>

    <div class="space-y-4">
      <div
        v-for="request in requests"
        :key="request.codigoProducto"
        class="bg-white rounded-lg p-4 border border-amber-100 flex flex-col sm:flex-row sm:items-center gap-3"
      >
        <p class="text-gray-700 flex-1">
          El cliente solicita precio actualizado de: <strong>{{ request.nombreProducto }}</strong>
        </p>
        <div class="flex items-center gap-2">
          <input
            type="number"
            placeholder="Nuevo precio"
            v-model="newPrices[request.codigoProducto]"
            class="w-32 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
          <button
            @click="confirmPrice(request.codigoProducto)"
            class="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition text-sm font-medium whitespace-nowrap"
          >
            Confirmar
          </button>
        </div>
      </div>
    </div>
  </section>
</template>
