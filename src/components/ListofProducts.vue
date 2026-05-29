<script setup lang="ts">
import type { Producto } from '@/types/producto'
import ProductRow from '@/components/ProductRow.vue'

// Props: lista de productos + flags de comportamiento
defineProps<{
  products: Producto[]
  title: string
  editable: boolean
  deletable: boolean
  addable: boolean
  showDate: boolean
  cartCodes: number[]
}>()

// Emits: reenvía eventos del nieto (ProductRow) al padre (vista)
defineEmits<{
  (e: 'add-to-cart', product: Producto): void
  (e: 'delete', code: number): void
  (e: 'save-edit', code: number, price: number): void
}>()
</script>

<template>
  <section class="flex-1 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
    <!-- Título de la sección -->
    <div class="px-4 md:px-6 py-4 border-b border-gray-200">
      <h2 class="text-lg font-semibold text-gray-800">{{ title }}</h2>
    </div>

    <div class="overflow-x-auto">
      <table class="w-full text-sm">
        <thead class="bg-gray-50 text-left">
          <tr>
            <th class="px-4 md:px-6 py-3 font-medium text-gray-600">Código</th>
            <th class="px-4 md:px-6 py-3 font-medium text-gray-600">Producto</th>
            <th class="px-4 md:px-6 py-3 font-medium text-gray-600">Precio</th>
            <th v-if="showDate" class="px-4 md:px-6 py-3 font-medium text-gray-600">Últ. Actualización</th>
            <th class="px-4 md:px-6 py-3 font-medium text-gray-600">Acciones</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-100">
          <!-- Cada fila es un ProductRow (nieto) -->
          <ProductRow
            v-for="product in products"
            :key="product.codigo"
            :product="product"
            :editable="editable"
            :deletable="deletable"
            :addable="addable"
            :show-date="showDate"
            :is-in-cart="cartCodes.includes(product.codigo)"
            @add-to-cart="$emit('add-to-cart', $event)"
            @delete="$emit('delete', $event)"
            @save-edit="(code, price) => $emit('save-edit', code, price)"
          />
        </tbody>
      </table>
    </div>
  </section>
</template>