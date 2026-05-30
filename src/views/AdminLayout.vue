<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useUserStore } from '@/stores/userStore'
import type { User } from '@/types/user'
import AdminSidebar from '@/components/AdminSidebar.vue'

const router = useRouter()
const route = useRoute()
const { users, loggedUser } = useUserStore()

const showUserDropdown = ref<boolean>(false)

// Al montar, identifica el usuario logueado desde la URL
onMounted(() => {
  const id = Number(route.params.id)
  const user: User | undefined = users.value.find((u) => u.id === id)
  if (user) loggedUser.value = user
})

// Cambia de usuario y redirige según el rol
function switchUser(user: User): void {
  loggedUser.value = user
  showUserDropdown.value = false
  router.push(user.role === 'admin' ? `/admin/${user.id}` : `/client/${user.id}`)
}

// ID del admin para pasarle al sidebar
const adminId = Number(route.params.id)
</script>

<template>
  <div class="min-h-screen bg-gray-50">

    <!-- Header -->
    <header class="bg-primary-500 shadow-sm sticky top-0 z-10">
      <div class="max-w-7xl mx-auto px-4 md:px-6 py-4 flex items-center justify-between">
        <h1 class="text-xl font-bold text-white">TuDistribuidora</h1>

        <!-- User switcher -->
        <div class="relative">
          <div v-if="showUserDropdown" class="fixed inset-0 z-0" @click="showUserDropdown = false"></div>
          <button
            @click="showUserDropdown = !showUserDropdown"
            class="flex items-center gap-2 text-sm text-primary-100 hover:text-white transition z-10 relative"
          >
            <span>{{ loggedUser ? `${loggedUser.firstName} ${loggedUser.lastName}` : 'Admin' }}</span>
            <span class="text-xs opacity-70">▼</span>
          </button>
          <div
            v-if="showUserDropdown"
            class="absolute right-0 top-full mt-2 bg-white rounded-xl shadow-lg border border-gray-200 z-20 min-w-52 overflow-hidden"
          >
            <p class="text-xs text-gray-400 px-4 py-2 border-b border-gray-100">Cambiar usuario</p>
            <button
              v-for="user in users"
              :key="user.id"
              @click="switchUser(user)"
              class="w-full flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition text-left"
              :class="{ 'bg-primary-50': loggedUser?.id === user.id }"
            >
              <span class="text-gray-800 text-sm font-medium">{{ user.firstName }} {{ user.lastName }}</span>
              <span
                class="text-xs px-2 py-0.5 rounded-full font-medium"
                :class="user.role === 'admin' ? 'bg-orange-100 text-orange-700' : 'bg-blue-100 text-blue-700'"
              >
                {{ user.role }}
              </span>
            </button>
          </div>
        </div>
      </div>
    </header>

    <!-- Body: Sidebar + Contenido -->
    <div class="max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-8 flex flex-col lg:flex-row gap-6">
      <!-- Hijo: sidebar de navegación -->
      <AdminSidebar :admin-id="adminId" />

      <!-- Contenido de la ruta hija -->
      <main class="flex-1 space-y-6">
        <RouterView />
      </main>
    </div>
  </div>
</template>
