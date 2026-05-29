import { ref, watch } from 'vue'
import type { Pedido, EstadoPedido } from '@/types/pedido'

// Clave usada en localStorage
const STORAGE_KEY = 'pedidos'

// Lee pedidos guardados en localStorage (si existen)
function loadFromStorage(): Pedido[] {
  const stored: string | null = localStorage.getItem(STORAGE_KEY)
  if (stored) {
    return JSON.parse(stored) as Pedido[]
  }
  return []
}

// Guarda los pedidos actuales en localStorage
function saveToStorage(pedidos: Pedido[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(pedidos))
}

// Array reactivo de pedidos, inicializado desde localStorage
const pedidos = ref<Pedido[]>(loadFromStorage())

// Observa cambios y sincroniza con localStorage automáticamente
watch(pedidos, (newValue: Pedido[]) => {
  saveToStorage(newValue)
}, { deep: true })

// Genera el siguiente ID disponible
function getNextId(): number {
  if (pedidos.value.length === 0) return 1
  return Math.max(...pedidos.value.map((p) => p.id)) + 1
}

// Exporta el store como función composable
export function usePedidoStore() {
  return {
    pedidos,

    // Crea un nuevo pedido y lo guarda
    createPedido(pedido: Omit<Pedido, 'id'>): Pedido {
      const newPedido: Pedido = {
        id: getNextId(),
        ...pedido
      }
      pedidos.value.push(newPedido)
      return newPedido
    },

    // Cambia el estado de un pedido por su ID
    updateEstado(pedidoId: number, estado: EstadoPedido): void {
      const pedido: Pedido | undefined = pedidos.value.find((p) => p.id === pedidoId)
      if (pedido) {
        pedido.estado = estado
      }
    }
  }
}
