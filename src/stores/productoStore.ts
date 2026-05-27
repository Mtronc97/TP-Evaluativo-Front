import { ref } from 'vue'
import type { Producto } from '@/types/producto'
import type { Solicitud } from '@/types/solicitud'

//se crea la const productos separado para que este se cree el arraya una sola vez, 
// si lo creamos junto a la función cada vez que lo llame va a crear un nuevo array y saprado al anterior
//<Producto[]> ipo de dato va a guardar adentro: un array de objetos con la forma que definiste en el paso 2.
const productos = ref<Producto[]>([
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
  { codigo: 11, nombre: 'Jugo Cepita 200ml', precio: 600, fechaPrecio: new Date('2026-05-22') },
  { codigo: 12, nombre: 'Garrapiñada', precio: 500, fechaPrecio: new Date('2025-07-12') },
  { codigo: 13, nombre: 'Palito Luccini', precio: 350, fechaPrecio: new Date('2026-05-18') },
  { codigo: 14, nombre: 'Rockstar 473ml', precio: 2100, fechaPrecio: new Date('2025-06-01') },
  { codigo: 15, nombre: 'Oblea Noel', precio: 200, fechaPrecio: new Date('2026-05-25') },
])
const solicitudes = ref<Solicitud[]>([])

export function useProductoStore() {
    return { productos, solicitudes}

}