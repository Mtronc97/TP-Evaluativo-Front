import type { Producto } from './producto'

// Estados posibles de un pedido
export type EstadoPedido = 'Borrador' | 'Verificando' | 'Confirmado' | 'Completado'

// Representa un pedido completo del cliente
export interface Pedido {
  id: number
  clienteId: number
  productos: Producto[]
  total: number
  estado: EstadoPedido
  fecha: string
}
