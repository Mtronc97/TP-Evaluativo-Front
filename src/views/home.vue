<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../stores/userStore'
import type { User } from '../types/user'

const router = useRouter()
const { users, loggedUser } = useUserStore()

// Alterna entre formulario de login y registro
const isLogin = ref(true)

// Campos del login
const loginEmail = ref('')
const loginPassword = ref('')
const loginError = ref('')

// Campos del registro
const regFirstName = ref('')
const regLastName = ref('')
const regDni = ref('')
const regEmail = ref('')
const regPassword = ref('')
const regError = ref('')
const regSuccess = ref('')

// Busca el usuario en el array y redirige según su rol
function handleLogin(): void {
  loginError.value = ''

  const user: User | undefined = users.value.find(
    (u) => u.email === loginEmail.value && u.password === loginPassword.value
  )

  if (!user) {
    loginError.value = 'Email o contraseña incorrectos'
    return
  }

  loggedUser.value = user

  if (user.role === 'admin') {
    router.push('/admin')
  } else {
    router.push('/client')
  }
}

// Registra un nuevo cliente y vuelve al login
function handleRegister(): void {
  regError.value = ''
  regSuccess.value = ''

  if (!regFirstName.value || !regLastName.value || !regDni.value || !regEmail.value || !regPassword.value) {
    regError.value = 'Completá todos los campos'
    return
  }

  const emailExists: boolean = users.value.some((u) => u.email === regEmail.value)
  if (emailExists) {
    regError.value = 'Ya existe un usuario con ese email'
    return
  }

  const newUser: User = {
    id: Math.max(...users.value.map((u) => u.id)) + 1,
    firstName: regFirstName.value,
    lastName: regLastName.value,
    email: regEmail.value,
    dni: regDni.value,
    password: regPassword.value,
    role: 'client'
  }

  users.value.push(newUser)

  regFirstName.value = ''
  regLastName.value = ''
  regDni.value = ''
  regEmail.value = ''
  regPassword.value = ''
  regSuccess.value = 'Registro exitoso. Ya podés iniciar sesión.'

  setTimeout(() => {
    isLogin.value = true
    regSuccess.value = ''
  }, 2000)
}
</script>

<template>
  <!-- Contenedor centrado con gradiente de fondo -->
  <div class="min-h-screen flex items-center justify-center px-4 bg-linear-to-br from-primary-50 to-gray-100">

    <!-- Card del formulario -->
    <div class="w-full max-w-md bg-white rounded-2xl shadow-lg p-6 md:p-8">

      <!-- Título dinámico -->
      <h1 class="text-2xl font-bold text-center text-gray-800 mb-6">
        {{ isLogin ? 'Iniciar Sesión' : 'Registrarse' }}
      </h1>

      <!-- ========== LOGIN ========== -->
      <form v-if="isLogin" @submit.prevent="handleLogin" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input
            v-model="loginEmail"
            type="email"
            placeholder="tu@email.com"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Contraseña</label>
          <input
            v-model="loginPassword"
            type="password"
            placeholder="••••••••"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition"
          />
        </div>

        <p v-if="loginError" class="text-red-500 text-sm text-center">{{ loginError }}</p>

        <button
          type="submit"
          class="w-full bg-primary-500 text-white py-2 rounded-lg hover:bg-primary-600 transition font-semibold"
        >
          Ingresar
        </button>

        <p class="text-center text-sm text-gray-500 mt-4">
          ¿No tenés cuenta?
          <button
            type="button"
            @click="isLogin = false"
            class="text-primary-500 hover:underline font-medium"
          >
            Registrate
          </button>
        </p>
      </form>

      <!-- ========== REGISTER ========== -->
      <form v-else @submit.prevent="handleRegister" class="space-y-4">
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
            <input
              v-model="regFirstName"
              type="text"
              placeholder="Juan"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Apellido</label>
            <input
              v-model="regLastName"
              type="text"
              placeholder="Pérez"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition"
            />
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">DNI</label>
          <input
            v-model="regDni"
            type="text"
            placeholder="12345678"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input
            v-model="regEmail"
            type="email"
            placeholder="tu@email.com"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Contraseña</label>
          <input
            v-model="regPassword"
            type="password"
            placeholder="••••••••"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition"
          />
        </div>

        <p v-if="regError" class="text-red-500 text-sm text-center">{{ regError }}</p>
        <p v-if="regSuccess" class="text-green-500 text-sm text-center">{{ regSuccess }}</p>

        <button
          type="submit"
          class="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition font-semibold"
        >
          Registrarse
        </button>

        <p class="text-center text-sm text-gray-500 mt-4">
          ¿Ya tenés cuenta?
          <button
            type="button"
            @click="isLogin = true"
            class="text-primary-500 hover:underline font-medium"
          >
            Iniciá sesión
          </button>
        </p>
      </form>

    </div>
  </div>
</template>