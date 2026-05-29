import { ref, watch } from 'vue'
import type { Producto } from '@/types/producto'

// Datos iniciales (se usan si no hay nada en localStorage)
const DEFAULT_PRODUCTS: Producto[] = [
  { codigo: 1, nombre: 'Coca Cola 500ml', precio: 1200, fechaPrecio: new Date('2026-05-10') },
  { codigo: 2, nombre: 'Alfajor Oreo', precio: 850, fechaPrecio: new Date('2025-12-01') },
  { codigo: 3, nombre: 'Agua Mineral 500ml', precio: 900, fechaPrecio: new Date('2026-05-20') },
  { codigo: 4, nombre: 'Papas Fritas Lays', precio: 1500, fechaPrecio: new Date('2025-11-15') },
  { codigo: 5, nombre: 'Sprite 500ml', precio: 1200, fechaPrecio: new Date('2026-04-30') },
  { codigo: 6, nombre: 'Chicles Beldent', precio: 400, fechaPrecio: new Date('2025-10-20') },
  { codigo: 7, nombre: 'Chocolatín Jack', precio: 650, fechaPrecio: new Date('2026-05-15') },
  { codigo: 8, nombre: 'Caramelos Menthoplus', precio: 300, fechaPrecio: new Date('2025-09-05') },
  { codigo: 9, nombre: 'Fanta Naranja 500ml', precio: 1200, fechaPrecio: new Date('2026-05-01') },
  { codigo: 10, nombre: 'Maní con Chocolate', precio: 750, fechaPrecio: new Date('2025-08-30') },
  { codigo: 11, nombre: 'Jugo Cepita 200ml', precio: 600, fechaPrecio: new Date('2025-05-22') },
  { codigo: 12, nombre: 'Garrapiñada', precio: 500, fechaPrecio: new Date('2025-07-12') },
  { codigo: 13, nombre: 'Palito Luccini', precio: 350, fechaPrecio: new Date('2026-05-18') },
  { codigo: 14, nombre: 'Rockstar 473ml', precio: 2100, fechaPrecio: new Date('2025-06-01') },
  { codigo: 15, nombre: 'Oblea Noel', precio: 200, fechaPrecio: new Date('2025-05-25') },
]

const STORAGE_KEY = 'productos'

// Lee productos desde localStorage; si no hay, usa los por defecto
function loadProducts(): Producto[] {
  const stored: string | null = localStorage.getItem(STORAGE_KEY)
  if (stored) {
    // Las fechas vienen como string en JSON, hay que convertirlas a Date
    const parsed = JSON.parse(stored) as Producto[]
    return parsed.map((p) => ({ ...p, fechaPrecio: new Date(p.fechaPrecio) }))
  }
  return DEFAULT_PRODUCTS
}

// Guarda productos en localStorage
function saveProducts(products: Producto[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(products))
}

// Ref singleton: se carga una vez desde localStorage
const productos = ref<Producto[]>(loadProducts())

// Watch profundo: cada cambio se persiste automáticamente
watch(productos, (newValue: Producto[]) => {
  saveProducts(newValue)
}, { deep: true })

export function useProductoStore() {
  return { productos }
}