<script setup lang="ts">
import { ref, computed } from 'vue'
import { useProductoStore } from '../stores/productoStore'
import type { Producto } from '../types/producto'

const { productos, solicitudes } = useProductoStore()

// Precios nuevos ingresados por el admin para cada solicitud
const newPrices = ref<Record<number, number>>({})

// Código auto-generado: toma el máximo existente + 1
const nextCode = computed((): number => {
  if (productos.value.length === 0) return 1
  return Math.max(...productos.value.map((p) => p.codigo)) + 1
})

// Formulario para agregar un producto nuevo (sin código, se asigna solo)
const newProduct = ref<{ nombre: string; precio: number }>({
  nombre: '',
  precio: 0
})

// Código del producto que se está editando (null = ninguno)
const editingCode = ref<number | null>(null)
// Precio temporal mientras se edita
const editPrice = ref<number>(0)

// Cantidad de solicitudes pendientes (computed)
const pendingRequestsCount = computed((): number => {
  return solicitudes.value.length
})

// Agrega un producto nuevo al array con código auto-generado
function addProduct(): void {
  const product: Producto = {
    codigo: nextCode.value,
    nombre: newProduct.value.nombre,
    precio: newProduct.value.precio,
    fechaPrecio: new Date()
  }
  productos.value.push(product)
  newProduct.value = { nombre: '', precio: 0 }
}

// Elimina un producto por su código
function deleteProduct(code: number): void {
  productos.value = productos.value.filter((p) => p.codigo !== code)
}

// Actualiza el precio de un producto y elimina la solicitud correspondiente
function updatePrice(code: number, price: number): void {
  const product: Producto | undefined = productos.value.find((p) => p.codigo === code)
  if (product) {
    product.precio = price
    product.fechaPrecio = new Date()
    solicitudes.value = solicitudes.value.filter((s) => s.codigoProducto !== code)
  }
}

// Formatea una fecha para mostrarla en la tabla
function formatDate(date: Date): string {
  return new Date(date).toLocaleDateString('es-AR')
}

// Devuelve true si el precio tiene más de 30 días
function isOutdated(date: Date): boolean {
  const diff: number = new Date().getTime() - new Date(date).getTime()
  const thirtyDaysMs: number = 1000 * 60 * 60 * 24 * 30
  return diff > thirtyDaysMs
}

// Activa el modo edición para un producto
function startEditing(product: Producto): void {
  editingCode.value = product.codigo
  editPrice.value = product.precio
}

// Guarda el precio editado y sale del modo edición
function saveEdit(code: number): void {
  const product: Producto | undefined = productos.value.find((p) => p.codigo === code)
  if (product) {
    product.precio = editPrice.value
    product.fechaPrecio = new Date()
  }
  editingCode.value = null
}

// Cancela la edición sin guardar
function cancelEdit(): void {
  editingCode.value = null
}
</script>

<template>
  <div class="min-h-screen bg-gray-50">

    <!-- Header -->
    <header class="bg-primary-500 shadow-sm">
      <div class="max-w-7xl mx-auto px-4 md:px-6 py-4 flex items-center justify-between">
        <h1 class="text-xl font-bold text-white">TuDistribuidora</h1>
        <span class="text-sm text-primary-100">Admin</span>
      </div>
    </header>

    <main class="max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-8 space-y-6">

      <!-- Notificaciones de solicitudes -->
      <section
        v-if="pendingRequestsCount > 0"
        class="bg-amber-50 border border-amber-200 rounded-xl p-4 md:p-6"
      >
        <h2 class="text-lg font-semibold text-amber-800 mb-4">
          ⚠️ Solicitudes de precio ({{ pendingRequestsCount }})
        </h2>

        <div class="space-y-4">
          <div
            v-for="request in solicitudes"
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
                @click="updatePrice(request.codigoProducto, newPrices[request.codigoProducto] ?? 0)"
                class="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition text-sm font-medium whitespace-nowrap"
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      </section>

      <!-- Formulario para agregar producto -->
      <section class="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-6">
        <h2 class="text-lg font-semibold text-gray-800 mb-4">Agregar Producto</h2>
        <form @submit.prevent="addProduct" class="flex flex-col sm:flex-row gap-3">
          <input
            v-model="newProduct.nombre"
            type="text"
            placeholder="Nombre"
            class="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition"
          />
          <input
            v-model="newProduct.precio"
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

      <!-- Tabla de productos -->
      <section class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div class="px-4 md:px-6 py-4 border-b border-gray-200">
          <h2 class="text-lg font-semibold text-gray-800">Productos</h2>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full text-sm">
            <thead class="bg-gray-50 text-left">
              <tr>
                <th class="px-4 md:px-6 py-3 font-medium text-gray-600">Código</th>
                <th class="px-4 md:px-6 py-3 font-medium text-gray-600">Producto</th>
                <th class="px-4 md:px-6 py-3 font-medium text-gray-600">Precio</th>
                <th class="px-4 md:px-6 py-3 font-medium text-gray-600">Últ. Actualización</th>
                <th class="px-4 md:px-6 py-3 font-medium text-gray-600">Acciones</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100">
              <tr
                v-for="product in productos"
                :key="product.codigo"
                class="hover:bg-gray-50 transition"
              >
                <td class="px-4 md:px-6 py-3 text-gray-700">{{ product.codigo }}</td>
                <td class="px-4 md:px-6 py-3 text-gray-700">{{ product.nombre }}</td>
                <td class="px-4 md:px-6 py-3">
                  <!-- Modo edición: input + guardar/cancelar -->
                  <div v-if="editingCode === product.codigo" class="flex items-center gap-2">
                    <input
                      v-model="editPrice"
                      type="number"
                      class="w-24 px-2 py-1 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                    <button
                      @click="saveEdit(product.codigo)"
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
                  <!-- Modo normal: solo muestra el precio -->
                  <span v-else class="text-gray-700">${{ product.precio }}</span>
                </td>
                <td class="px-4 md:px-6 py-3">
                  <span
                    :class="isOutdated(product.fechaPrecio) ? 'text-amber-600' : 'text-gray-500'"
                  >
                    {{ formatDate(product.fechaPrecio) }}
                  </span>
                </td>
                <td class="px-4 md:px-6 py-3">
                  <div class="flex items-center gap-2">
                    <button
                      v-if="editingCode !== product.codigo"
                      @click="startEditing(product)"
                      class="px-3 py-1 text-sm bg-primary-100 text-primary-700 rounded-lg hover:bg-primary-200 transition font-medium"
                    >
                      Editar
                    </button>
                    <button
                      @click="deleteProduct(product.codigo)"
                      class="px-3 py-1 text-sm bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition font-medium"
                    >
                      Eliminar
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

    </main>
  </div>
</template>
