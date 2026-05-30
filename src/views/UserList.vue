<script setup lang="ts">
import { ref, computed } from 'vue'
import { useUserStore } from '@/stores/userStore'
import type { User, Role } from '@/types/user'

const { users } = useUserStore()

// Estado del formulario para crear/editar
const showForm = ref<boolean>(false)
const editingId = ref<number | null>(null)
const formError = ref<string>('')

// Campos del formulario
const formFirstName = ref<string>('')
const formLastName = ref<string>('')
const formEmail = ref<string>('')
const formDni = ref<string>('')
const formPassword = ref<string>('')
const formRole = ref<Role>('client')

// Próximo ID auto-generado
const nextId = computed((): number => {
  if (users.value.length === 0) return 1
  return Math.max(...users.value.map((u) => u.id)) + 1
})

// Abre el formulario en modo crear
function openCreate(): void {
  editingId.value = null
  resetForm()
  showForm.value = true
}

// Abre el formulario en modo editar con los datos del usuario
function openEdit(user: User): void {
  editingId.value = user.id
  formFirstName.value = user.firstName
  formLastName.value = user.lastName
  formEmail.value = user.email
  formDni.value = user.dni
  formPassword.value = user.password
  formRole.value = user.role
  formError.value = ''
  showForm.value = true
}

// Limpia los campos del formulario
function resetForm(): void {
  formFirstName.value = ''
  formLastName.value = ''
  formEmail.value = ''
  formDni.value = ''
  formPassword.value = ''
  formRole.value = 'client'
  formError.value = ''
}

// Valida y guarda (crear o editar)
function saveUser(): void {
  // Validaciones
  if (!formFirstName.value || !formLastName.value || !formEmail.value || !formDni.value || !formPassword.value) {
    formError.value = 'Todos los campos son obligatorios'
    return
  }

  // Nombre y apellido sin números
  const nameRegex: RegExp = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/
  if (!nameRegex.test(formFirstName.value) || !nameRegex.test(formLastName.value)) {
    formError.value = 'Nombre y apellido no deben contener números'
    return
  }

  // Email con formato válido
  const emailRegex: RegExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(formEmail.value)) {
    formError.value = 'El email no tiene un formato válido'
    return
  }

  // DNI solo números, entre 7 y 8 dígitos
  const dniRegex: RegExp = /^\d{7,8}$/
  if (!dniRegex.test(formDni.value)) {
    formError.value = 'El DNI debe tener 7 u 8 dígitos numéricos'
    return
  }

  // Contraseña mínimo 4 caracteres
  if (formPassword.value.length < 4) {
    formError.value = 'La contraseña debe tener al menos 4 caracteres'
    return
  }

  // Validar email único (excluyendo el usuario en edición)
  const emailExists: boolean = users.value.some(
    (u) => u.email === formEmail.value && u.id !== editingId.value
  )
  if (emailExists) {
    formError.value = 'Ya existe un usuario con ese email'
    return
  }

  // Validar DNI único
  const dniExists: boolean = users.value.some(
    (u) => u.dni === formDni.value && u.id !== editingId.value
  )
  if (dniExists) {
    formError.value = 'Ya existe un usuario con ese DNI'
    return
  }

  if (editingId.value !== null) {
    // Modo editar: buscar y actualizar
    const user: User | undefined = users.value.find((u) => u.id === editingId.value)
    if (user) {
      user.firstName = formFirstName.value
      user.lastName = formLastName.value
      user.email = formEmail.value
      user.dni = formDni.value
      user.password = formPassword.value
      user.role = formRole.value
    }
  } else {
    // Modo crear: agregar nuevo
    const newUser: User = {
      id: nextId.value,
      firstName: formFirstName.value,
      lastName: formLastName.value,
      email: formEmail.value,
      dni: formDni.value,
      password: formPassword.value,
      role: formRole.value
    }
    users.value.push(newUser)
  }

  showForm.value = false
  resetForm()
}

// Elimina un usuario por ID
function deleteUser(userId: number): void {
  users.value = users.value.filter((u) => u.id !== userId)
}

// Cancela y cierra el formulario
function cancelForm(): void {
  showForm.value = false
  resetForm()
}
</script>

<template>
  <!-- Encabezado + botón crear -->
  <div class="flex items-center justify-between mb-4">
    <h2 class="text-lg font-semibold text-gray-800">Gestión de Usuarios</h2>
    <button
      v-if="!showForm"
      @click="openCreate"
      class="px-4 py-2 text-sm bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition font-medium"
    >
      + Nuevo Usuario
    </button>
  </div>

  <!-- Formulario crear/editar -->
  <section
    v-if="showForm"
    class="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-6 mb-4"
  >
    <h3 class="text-base font-semibold text-gray-700 mb-3">
      {{ editingId !== null ? 'Editar Usuario' : 'Nuevo Usuario' }}
    </h3>

    <p v-if="formError" class="text-red-600 text-sm mb-3 bg-red-50 px-3 py-2 rounded-lg">
      {{ formError }}
    </p>

    <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
      <div>
        <label class="block text-xs font-medium text-gray-500 mb-1">Nombre</label>
        <input
          v-model="formFirstName"
          type="text"
          placeholder="Nombre"
          class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
        />
      </div>
      <div>
        <label class="block text-xs font-medium text-gray-500 mb-1">Apellido</label>
        <input
          v-model="formLastName"
          type="text"
          placeholder="Apellido"
          class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
        />
      </div>
      <div>
        <label class="block text-xs font-medium text-gray-500 mb-1">Email</label>
        <input
          v-model="formEmail"
          type="email"
          placeholder="email@ejemplo.com"
          class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
        />
      </div>
      <div>
        <label class="block text-xs font-medium text-gray-500 mb-1">DNI</label>
        <input
          v-model="formDni"
          type="text"
          placeholder="12345678"
          class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
        />
      </div>
      <div>
        <label class="block text-xs font-medium text-gray-500 mb-1">Contraseña</label>
        <input
          v-model="formPassword"
          type="text"
          placeholder="Contraseña"
          class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
        />
      </div>
      <div>
        <label class="block text-xs font-medium text-gray-500 mb-1">Rol</label>
        <select
          v-model="formRole"
          class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          <option value="client">Cliente</option>
          <option value="admin">Admin</option>
        </select>
      </div>
    </div>

    <div class="flex gap-2 justify-end mt-4">
      <button
        @click="cancelForm"
        class="px-4 py-2 text-sm bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition font-medium"
      >
        Cancelar
      </button>
      <button
        @click="saveUser"
        class="px-4 py-2 text-sm bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition font-medium"
      >
        {{ editingId !== null ? 'Guardar cambios' : 'Crear usuario' }}
      </button>
    </div>
  </section>

  <!-- Tabla de usuarios -->
  <section class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
    <div class="overflow-x-auto">
      <table class="w-full text-sm">
        <thead class="bg-gray-50 text-left">
          <tr>
            <th class="px-4 md:px-6 py-3 font-medium text-gray-600">ID</th>
            <th class="px-4 md:px-6 py-3 font-medium text-gray-600">Nombre</th>
            <th class="px-4 md:px-6 py-3 font-medium text-gray-600">Email</th>
            <th class="px-4 md:px-6 py-3 font-medium text-gray-600">DNI</th>
            <th class="px-4 md:px-6 py-3 font-medium text-gray-600">Rol</th>
            <th class="px-4 md:px-6 py-3 font-medium text-gray-600">Acciones</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-100">
          <tr v-for="user in users" :key="user.id" class="hover:bg-gray-50 transition">
            <td class="px-4 md:px-6 py-3 text-gray-700">{{ user.id }}</td>
            <td class="px-4 md:px-6 py-3 text-gray-700">
              <RouterLink
                :to="`/users/${user.id}`"
                class="text-primary-600 hover:underline font-medium"
              >
                {{ user.firstName }} {{ user.lastName }}
              </RouterLink>
            </td>
            <td class="px-4 md:px-6 py-3 text-gray-700">{{ user.email }}</td>
            <td class="px-4 md:px-6 py-3 text-gray-700">{{ user.dni }}</td>
            <td class="px-4 md:px-6 py-3">
              <span
                class="text-xs px-2 py-0.5 rounded-full font-medium"
                :class="user.role === 'admin' ? 'bg-orange-100 text-orange-700' : 'bg-blue-100 text-blue-700'"
              >
                {{ user.role }}
              </span>
            </td>
            <td class="px-4 md:px-6 py-3">
              <div class="flex items-center gap-2">
                <button
                  @click="openEdit(user)"
                  class="px-3 py-1 text-sm bg-primary-100 text-primary-700 rounded-lg hover:bg-primary-200 transition font-medium"
                >
                  Editar
                </button>
                <button
                  @click="deleteUser(user.id)"
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
</template>
