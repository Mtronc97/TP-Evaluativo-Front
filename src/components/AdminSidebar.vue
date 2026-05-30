<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'

// Props: el id del admin para construir las rutas
const props = defineProps<{
  adminId: number
}>()

const route = useRoute()

// Items del menú con ruta y label
const menuItems = computed(() => [
  { label: 'Productos', path: `/admin/${props.adminId}`, icon: '📦' },
  { label: 'Usuarios', path: `/admin/${props.adminId}/users`, icon: '👥' },
])

// Determina si un item está activo comparando con la ruta actual
function isActive(path: string): boolean {
  return route.path === path
}
</script>

<template>
  <aside class="w-full lg:w-56 shrink-0">
    <nav class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <p class="text-xs text-gray-400 font-medium uppercase tracking-wider px-4 py-3 border-b border-gray-100">
        Navegación
      </p>
      <ul class="divide-y divide-gray-100">
        <li v-for="item in menuItems" :key="item.path">
          <RouterLink
            :to="item.path"
            class="flex items-center gap-3 px-4 py-3 text-sm transition"
            :class="isActive(item.path)
              ? 'bg-primary-50 text-primary-700 font-semibold border-l-3 border-primary-500'
              : 'text-gray-700 hover:bg-gray-50'"
          >
            <span>{{ item.icon }}</span>
            <span>{{ item.label }}</span>
          </RouterLink>
        </li>
      </ul>
    </nav>
  </aside>
</template>
