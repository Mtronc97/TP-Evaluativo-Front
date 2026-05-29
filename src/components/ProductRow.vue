<script setup lang="ts">
import { ref } from 'vue'
import type { Producto } from '@/types/producto'
import { isOutdated, formatDate } from '@/utils/dateUtils'

// Props tipadas: el producto + qué acciones están habilitadas
const props = defineProps<{
  product: Producto
  editable: boolean
  deletable: boolean
  addable: boolean
  isInCart: boolean
  showDate: boolean
}>()

// Emits tipados: eventos hacia el padre
const emit = defineEmits<{
  (e: 'add-to-cart', product: Producto): void
  (e: 'delete', code: number): void
  (e: 'save-edit', code: number, price: number): void
}>()

// Estado local de edición (solo se usa si editable = true)
const isEditing = ref<boolean>(false)
const editPrice = ref<number>(0)

// Activa el modo edición copiando el precio actual
function startEditing(): void {
  isEditing.value = true
  editPrice.value = props.product.precio
}

// Guarda y emite el nuevo precio al padre
function saveEdit(): void {
  emit('save-edit', props.product.codigo, editPrice.value)
  isEditing.value = false
}

// Cancela la edición sin guardar
function cancelEdit(): void {
  isEditing.value = false
}
</script>

<template>
  <tr class="hover:bg-gray-50 transition">
    <!-- Código -->
    <td class="px-4 md:px-6 py-3 text-gray-700">{{ product.codigo }}</td>

    <!-- Nombre -->
    <td class="px-4 md:px-6 py-3 text-gray-700">{{ product.nombre }}</td>

    <!-- Precio: modo edición o modo lectura -->
    <td class="px-4 md:px-6 py-3">
      <!-- Edición inline -->
      <div v-if="isEditing" class="flex items-center gap-2">
        <input
          v-model="editPrice"
          type="number"
          class="w-24 px-2 py-1 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
        />
        <button
          @click="saveEdit"
          class="px-2 py-1 text-xs bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition font-medium"
        >
          Guardar
        </button>
        <button
          @click="cancelEdit"
          class="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition font-medium"
        >
          Cancelar
        </button>
      </div>
      <!-- Precio desactualizado -->
      <span v-else-if="isOutdated(product.fechaPrecio)" class="text-amber-600 bg-amber-100 font-medium rounded-md px-1.5 py-0.5">
        ${{ product.precio }} "Precio desactualizado"     </span>
      <!-- Precio normal -->
      <span v-else class="text-green-800 bg-green-300 font-medium rounded-md px-1.5 py-0.5">${{ product.precio }}</span>
    </td>

    <!-- Fecha (solo si showDate es true, usado en admin) -->
    <td v-if="showDate" class="px-4 md:px-6 py-3">
      <span :class="isOutdated(product.fechaPrecio) ? 'text-amber-600' : 'text-gray-500'">
        {{ formatDate(product.fechaPrecio) }}
      </span>
    </td>

    <!-- Acciones -->
    <td class="px-4 md:px-6 py-3">
      <div class="flex items-center gap-2">
        <!-- Botón agregar al carrito (cliente) -->
        <button
          v-if="addable"
          @click="emit('add-to-cart', product)"
          :disabled="isInCart"
          class="px-3 py-1 text-sm rounded-lg transition"
          :class="isInCart
            ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
            : 'bg-primary-500 text-white hover:bg-primary-600'"
        >
          {{ isInCart ? 'Agregado' : 'Agregar' }}
        </button>

        <!-- Botón editar precio (admin) -->
        <button
          v-if="editable && !isEditing"
          @click="startEditing"
          class="px-3 py-1 text-sm bg-primary-100 text-primary-700 rounded-lg hover:bg-primary-200 transition font-medium"
        >
          Editar
        </button>

        <!-- Botón eliminar (admin) -->
        <button
          v-if="deletable"
          @click="emit('delete', product.codigo)"
          class="px-3 py-1 text-sm bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition font-medium"
        >
          Eliminar
        </button>
      </div>
    </td>
  </tr>
</template>
