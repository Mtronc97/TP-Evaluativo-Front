<script setup lang="ts">
import { computed } from 'vue'
import { useProductoStore } from '@/stores/productoStore'
import type { Producto } from '@/types/producto'
import ListofProducts from '@/components/ListofProducts.vue'
import RequestList from '@/components/RequestList.vue'
import AddProductForm from '@/components/AddProductForm.vue'

const { productos, solicitudes } = useProductoStore()

// Código auto-generado: toma el máximo existente + 1
const nextCode = computed((): number => {
  if (productos.value.length === 0) return 1
  return Math.max(...productos.value.map((p) => p.codigo)) + 1
})

// Agrega un producto nuevo con código auto-generado (recibe datos del hijo)
function addProduct(nombre: string, precio: number): void {
  const product: Producto = {
    codigo: nextCode.value,
    nombre,
    precio,
    fechaPrecio: new Date()
  }
  productos.value.push(product)
}

// Elimina un producto por su código (evento del nieto → hijo → padre)
function deleteProduct(code: number): void {
  productos.value = productos.value.filter((p) => p.codigo !== code)
}

// Guarda el nuevo precio editado (evento del nieto → hijo → padre)
function saveEdit(code: number, price: number): void {
  const product: Producto | undefined = productos.value.find((p) => p.codigo === code)
  if (product) {
    product.precio = price
    product.fechaPrecio = new Date()
  }
}

// Actualiza el precio desde una solicitud y la elimina
function updatePrice(code: number, price: number): void {
  const product: Producto | undefined = productos.value.find((p) => p.codigo === code)
  if (product) {
    product.precio = price
    product.fechaPrecio = new Date()
    solicitudes.value = solicitudes.value.filter((s) => s.codigoProducto !== code)
  }
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

      <!-- Hijo: lista de solicitudes de precio -->
      <RequestList
        :requests="solicitudes"
        @update-price="updatePrice"
      />

      <!-- Hijo: formulario para agregar producto -->
      <AddProductForm @add-product="addProduct" />

      <!-- Hijo: tabla de productos (con ProductRow como nieto) -->
      <ListofProducts
        :products="productos"
        title="Productos"
        :editable="true"
        :deletable="true"
        :addable="false"
        :show-date="true"
        :cart-codes="[]"
        @delete="deleteProduct"
        @save-edit="saveEdit"
      />

    </main>
  </div>
</template>
