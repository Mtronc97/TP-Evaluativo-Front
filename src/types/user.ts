// Roles posibles del usuario
export type Role = 'admin' | 'client'

// Modelo del usuario
export interface User {
  id: number
  firstName: string
  lastName: string
  email: string
  dni: string
  password: string
  role: Role
}
