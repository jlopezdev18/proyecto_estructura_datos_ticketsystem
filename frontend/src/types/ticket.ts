export interface Ticket {
  ticket: string
  tipo: string
  horaGeneracion: string
  tiempoEspera: string
  prioridad: string | null
  cliente: string
  estado?: string
  ventanilla?: string
  generado?: string
  cerrado?: string
  tiempo?: string
  hora?: string
}

export interface WindowOperator {
  numero: string
  cajero: string
  servicio: string
  estado: string
  atendiendo: string
  tiempo?: string
}
