// Devuelve true si la fecha tiene más de 30 días de antigüedad
export function isOutdated(date: Date): boolean {
  const diff: number = new Date().getTime() - new Date(date).getTime()
  const thirtyDaysMs: number = 1000 * 60 * 60 * 24 * 30
  return diff > thirtyDaysMs
}

// Formatea una fecha en formato argentino (dd/mm/aaaa)
export function formatDate(date: Date): string {
  return new Date(date).toLocaleDateString('es-AR')
}
