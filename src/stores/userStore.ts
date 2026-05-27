import { ref } from 'vue'
import type { User } from '@/types/user'

// Ref fuera de la función para que todos los componentes compartan el mismo estado
const users = ref<User[]>([
  {
    id: 1,
    firstName: 'Carlos',
    lastName: 'López',
    email: 'admin@distribuidora.com',
    dni: '30111222',
    password: 'admin123',
    role: 'admin'
  },
  {
    id: 2,
    firstName: 'María',
    lastName: 'González',
    email: 'maria@gmail.com',
    dni: '35222333',
    password: 'maria123',
    role: 'client'
  },
  {
    id: 3,
    firstName: 'Juan',
    lastName: 'Pérez',
    email: 'juan@gmail.com',
    dni: '38333444',
    password: 'juan123',
    role: 'client'
  },
  {
    id: 4,
    firstName: 'Ana',
    lastName: 'Martínez',
    email: 'ana@gmail.com',
    dni: '40444555',
    password: 'ana123',
    role: 'client'
  }
])

// Usuario logueado: null si nadie inició sesión
const loggedUser = ref<User | null>(null)

export function useUserStore() {
  return { users, loggedUser }
}
