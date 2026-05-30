<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useUserStore } from '@/stores/userStore'
import { usePedidoStore } from '@/stores/pedidoStore'
import type { User } from '@/types/user'

const route = useRoute()
const router = useRouter()
const { users } = useUserStore()
const { pedidos } = usePedidoStore()

// Busca el usuario por el parámetro :id de la URL
const user = computed((): User | undefined => {
  const id = Number(route.params.id)
  return users.value.find((u) => u.id === id)
})

// Pedidos del usuario (si es cliente)
const userPedidos = computed(() => {
  if (!user.value) return []
  return pedidos.value.filter((p) => p.clienteId === user.value!.id)
})

// Volver atrás
function goBack(): void {
  router.back()
}
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header simple -->
    <header class="bg-primary-500 shadow-sm sticky top-0 z-10">
      <div class="max-w-4xl mx-auto px-4 md:px-6 py-4 flex items-center gap-4">
        <button
          @click="goBack"
          class="bg-primary-300 px-2 py-0.5 rounded-full border-primary-400 text-white hover:text-primary-100 transition text-sm"
        >
          ← Volver
        </button>
        <h1 class="text-xl font-bold text-white">Detalle de Usuario</h1>
      </div>
    </header>

    <main class="max-w-4xl mx-auto px-4 md:px-6 py-6 md:py-8 space-y-6">

      <!-- Usuario no encontrado -->
      <div v-if="!user" class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-center">
        <p class="text-gray-500">Usuario no encontrado</p>
      </div>

      <!-- Datos del usuario -->
      <section v-else class="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-6">
        <div class="flex items-center gap-4 mb-4">
          <!-- Avatar con iniciales -->
          <div class="w-14 h-14 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center text-lg font-bold">
            {{ user.firstName[0] }}{{ user.lastName[0] }}
          </div>
          <div>
            <h2 class="text-xl font-semibold text-gray-800">{{ user.firstName }} {{ user.lastName }}</h2>
            <span
              class="text-xs px-2 py-0.5 rounded-full"
              :class="user.role === 'admin' ? 'bg-orange-100 text-orange-700' : 'bg-blue-100 text-blue-700'"
            >
              {{ user.role }}
            </span>
          </div>
        </div>

        <!-- Información detallada -->
        <dl class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <dt class="text-xs font-medium text-gray-400 uppercase">ID</dt>
            <dd class="text-gray-800">{{ user.id }}</dd>
          </div>
          <div>
            <dt class="text-xs font-medium text-gray-400 uppercase">Email</dt>
            <dd class="text-gray-800">{{ user.email }}</dd>
          </div>
          <div>
            <dt class="text-xs font-medium text-gray-400 uppercase">DNI</dt>
            <dd class="text-gray-800">{{ user.dni }}</dd>
          </div>
          <div>
            <dt class="text-xs font-medium text-gray-400 uppercase">Rol</dt>
            <dd class="text-gray-800 capitalize">{{ user.role }}</dd>
          </div>
        </dl>
      </section>

      <!-- Pedidos del usuario (solo si es cliente y tiene pedidos) -->
      <section
        v-if="user && userPedidos.length > 0"
        class="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-6"
      >
        <h3 class="text-base font-semibold text-gray-800 mb-3">
          Pedidos ({{ userPedidos.length }})
        </h3>
        <div class="space-y-2">
          <div
            v-for="pedido in userPedidos"
            :key="pedido.id"
            class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border border-gray-100 rounded-lg p-3"
          >
            <div>
              <p class="text-gray-700 text-sm font-medium">
                Pedido #{{ pedido.id }} — {{ pedido.productos.length }} productos
              </p>
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
              {{ pedido.estado }}
            </span>
          </div>
        </div>
      </section>

    </main>
  </div>
</template>
