import type { Ticket, WindowOperator } from "../types/ticket"

export const WINDOW_OPERATORS = {
  "01": "Ana López",
  "02": "Carlos Ruiz",
  "03": "María González",
  "04": "Luis Morales",
  "05": "Sofia Herrera",
  "06": "Roberto Silva",
}

export const INITIAL_TICKETS_EN_ESPERA: Ticket[] = [
  {
    ticket: "A-025",
    tipo: "Créditos",
    horaGeneracion: "14:35:20",
    tiempoEspera: "8:15",
    prioridad: "tercera-edad",
    cliente: "María Rodríguez (78 años)",
  },
  {
    ticket: "B-019",
    tipo: "Cuentas",
    horaGeneracion: "14:33:45",
    tiempoEspera: "10:30",
    prioridad: "embarazada",
    cliente: "Ana Martínez",
  },
  {
    ticket: "C-013",
    tipo: "General",
    horaGeneracion: "14:32:10",
    tiempoEspera: "12:05",
    prioridad: "discapacitado",
    cliente: "Carlos López",
  },
  {
    ticket: "A-026",
    tipo: "Créditos",
    horaGeneracion: "14:36:00",
    tiempoEspera: "7:45",
    prioridad: null,
    cliente: "Juan Pérez",
  },
  {
    ticket: "B-020",
    tipo: "Cuentas",
    horaGeneracion: "14:37:15",
    tiempoEspera: "6:30",
    prioridad: "tercera-edad",
    cliente: "Roberto Silva (82 años)",
  },
]

export const INITIAL_HISTORIAL_TICKETS: Ticket[] = [
  {
    ticket: "A-023",
    tipo: "Créditos",
    tiempo: "6:45",
    estado: "Atendido",
    hora: "14:25",
    ventanilla: "V03",
    generado: "14:18:30",
    cerrado: "14:25:15",
    horaGeneracion: "14:18:30",
    tiempoEspera: "00:06:45",
    prioridad: "alta",
    cliente: "Juan Pérez",
  },
  {
    ticket: "B-015",
    tipo: "Cuentas",
    tiempo: "12:30",
    estado: "Atendido",
    hora: "14:18",
    ventanilla: "V01",
    generado: "14:05:45",
    cerrado: "14:18:15",
    horaGeneracion: "14:05:45",
    tiempoEspera: "00:12:30",
    prioridad: "media",
    cliente: "María López",
  },
]

export const ACTIVE_EMPLOYEES: WindowOperator[] = [
  { numero: "01", cajero: "Ana López", servicio: "Cuentas", estado: "Activa", atendiendo: "B-018" },
  { numero: "02", cajero: "Carlos Ruiz", servicio: "Créditos", estado: "Activa", atendiendo: "A-025" },
  { numero: "03", cajero: "María González", servicio: "Créditos", estado: "Activa", atendiendo: "---" },
  { numero: "06", cajero: "Roberto Silva", servicio: "Todos", estado: "Activa", atendiendo: "C-012" },
]

export const INACTIVE_EMPLOYEES: WindowOperator[] = [
  { numero: "04", cajero: "Luis Morales", servicio: "General", estado: "Ausente", atendiendo: "", tiempo: "25 min" },
  {
    numero: "05",
    cajero: "Sofia Herrera",
    servicio: "Cuentas",
    estado: "En Descanso",
    atendiendo: "",
    tiempo: "8 min",
  },
]
