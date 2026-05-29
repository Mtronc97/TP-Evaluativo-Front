<script setup lang="ts">
import { ref, computed } from 'vue'
import { useProductoStore } from '@/stores/productoStore'
import { usePedidoStore } from '@/stores/pedidoStore'
import type { Producto } from '@/types/producto'
import type { EstadoPedido } from '@/types/pedido'
import { isOutdated } from '@/utils/dateUtils'
import ListofProducts from '@/components/ListofProducts.vue'
import AddProductForm from '@/components/AddProductForm.vue'

const { productos } = useProductoStore()
const { pedidos, updateEstado } = usePedidoStore()

// Toggle para mostrar/ocultar la sección de pedidos
const showPedidos = ref<boolean>(false)

// Pedidos que necesitan atención del admin (Verificando o Confirmado)
const pendingPedidos = computed(() => {
  return pedidos.value.filter((p) => p.estado !== 'Completado')
})

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

// Precios ingresados por el admin para productos de pedidos en verificación
// Estructura: { pedidoId: { codigoProducto: nuevoPrecio } }
const pedidoPrices = ref<Record<number, Record<number, number>>>({})

// Confirma un pedido: actualiza precios desactualizados globalmente y cambia estado
function confirmPedido(pedidoId: number): void {
  const pedido = pedidos.value.find((p) => p.id === pedidoId)
  if (!pedido) return

  const prices: Record<number, number> | undefined = pedidoPrices.value[pedidoId]

  // Actualizar precios globales para cada producto que tenía precio desactualizado
  pedido.productos.forEach((prod) => {
    if (isOutdated(prod.fechaPrecio)) {
      const newPrice: number | undefined = prices?.[prod.codigo]
      if (newPrice && newPrice > 0) {
        // Actualizar en el store global de productos
        const globalProduct: Producto | undefined = productos.value.find((p) => p.codigo === prod.codigo)
        if (globalProduct) {
          globalProduct.precio = newPrice
          globalProduct.fechaPrecio = new Date()
        }
        // Actualizar en el pedido también
        prod.precio = newPrice
        prod.fechaPrecio = new Date()
      }
    }
  })

  // Recalcular total del pedido
  pedido.total = pedido.productos.reduce((acc, p) => acc + p.precio, 0)

  // Cambiar estado a Confirmado
  updateEstado(pedidoId, 'Confirmado')

  // Limpiar precios temporales
  delete pedidoPrices.value[pedidoId]
}

// Marca un pedido confirmado como completado
function completePedido(pedidoId: number): void {
  updateEstado(pedidoId, 'Completado')
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

      <!-- Botón toggle para pedidos -->
      <button
        v-if="pendingPedidos.length > 0"
        @click="showPedidos = !showPedidos"
        class="w-full flex items-center justify-between bg-white rounded-xl shadow-sm border border-gray-200 px-4 md:px-6 py-4 hover:bg-gray-50 transition"
      >
        <span class="text-lg font-semibold text-gray-800">
          Pedidos ({{ pendingPedidos.length }})
        </span>
        <span class="text-sm text-gray-500">
          {{ showPedidos ? '▲ Ocultar' : '▼ Ver pedidos' }}
        </span>
      </button>

      <!-- Sección de pedidos (colapsable) -->
      <section
        v-if="pendingPedidos.length > 0 && showPedidos"
        class="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-6"
      >

        <div class="space-y-4">
          <div
            v-for="pedido in pendingPedidos"
            :key="pedido.id"
            class="border border-gray-200 rounded-xl p-4 md:p-5"
          >
            <!-- Cabecera del pedido -->
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
              <div>
                <p class="text-gray-800 font-semibold">Pedido #{{ pedido.id }}</p>
                <p class="text-gray-500 text-sm">{{ pedido.productos.length }} productos — Total: ${{ pedido.total }}</p>
              </div>
              <span
                class="inline-block px-2 py-0.5 text-xs rounded-full font-medium self-start sm:self-auto"
                :class="{
                  'bg-amber-100 text-amber-700': pedido.estado === 'Verificando',
                  'bg-blue-100 text-blue-700': pedido.estado === 'Confirmado',
                  'bg-gray-100 text-gray-600': pedido.estado === 'Borrador'
                }"
              >
                {{ pedido.estado }}
              </span>
            </div>

            <!-- Tabla de productos del pedido -->
            <div class="overflow-x-auto mb-3">
              <table class="w-full text-sm">
                <thead class="bg-gray-50 text-left">
                  <tr>
                    <th class="px-3 py-2 font-medium text-gray-600">Producto</th>
                    <th class="px-3 py-2 font-medium text-gray-600">Precio actual</th>
                    <th class="px-3 py-2 font-medium text-gray-600">Estado</th>
                    <th v-if="pedido.estado === 'Verificando'" class="px-3 py-2 font-medium text-gray-600">Nuevo precio</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-100">
                  <tr v-for="prod in pedido.productos" :key="prod.codigo">
                    <td class="px-3 py-2 text-gray-700">{{ prod.nombre }}</td>
                    <td class="px-3 py-2 text-gray-700">${{ prod.precio }}</td>
                    <td class="px-3 py-2">
                      <span
                        v-if="isOutdated(prod.fechaPrecio)"
                        class="text-amber-600 font-medium text-xs"
                      >
                        Desactualizado
                      </span>
                      <span v-else class="text-green-600 text-xs">OK</span>
                    </td>
                    <td v-if="pedido.estado === 'Verificando'" class="px-3 py-2">
                      <input
                        v-if="isOutdated(prod.fechaPrecio)"
                        type="number"
                        placeholder="$"
                        :value="pedidoPrices[pedido.id]?.[prod.codigo] ?? ''"
                        @input="(e) => {
                          if (!pedidoPrices[pedido.id]) { pedidoPrices[pedido.id] = {} }
                          const prices = pedidoPrices[pedido.id]!
                          prices[prod.codigo] = Number((e.target as HTMLInputElement).value)
                        }"
                        class="w-24 px-2 py-1 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                      <span v-else class="text-gray-400 text-xs">—</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <!-- Acciones del pedido -->
            <div class="flex gap-2 justify-end">
              <button
                v-if="pedido.estado === 'Verificando'"
                @click="confirmPedido(pedido.id)"
                class="px-4 py-2 text-sm bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition font-medium"
              >
                Confirmar precios
              </button>
              <button
                v-if="pedido.estado === 'Confirmado'"
                @click="completePedido(pedido.id)"
                class="px-4 py-2 text-sm bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition font-medium"
              >
                Marcar como completado
              </button>
            </div>
          </div>
        </div>
      </section>

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
