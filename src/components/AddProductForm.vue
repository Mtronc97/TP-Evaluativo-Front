<script setup lang="ts">
import { ref } from 'vue'

// Emit: envía nombre y precio al padre para crear el producto
const emit = defineEmits<{
  (e: 'add-product', nombre: string, precio: number): void
}>()

// Estado local del formulario
const productName = ref<string>('')
const productPrice = ref<number>(0)

// Envía los datos y limpia el formulario
function submitForm(): void {
  emit('add-product', productName.value, productPrice.value)
  productName.value = ''
  productPrice.value = 0
}
</script>

<template>
  <section class="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-6">
    <h2 class="text-lg font-semibold text-gray-800 mb-4">Agregar Producto</h2>
    <form @submit.prevent="submitForm" class="flex flex-col sm:flex-row gap-3">
      <input
        v-model="productName"
        type="text"
        placeholder="Nombre"
        class="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition"
      />
      <input
        v-model="productPrice"
        type="number"
        placeholder="Precio"
        class="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition"
      />
      <button
        type="submit"
        class="px-6 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition font-medium whitespace-nowrap"
      >
        Agregar
      </button>
    </form>
  </section>
</template>
