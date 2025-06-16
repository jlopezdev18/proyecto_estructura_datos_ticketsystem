import type { Ticket } from "../types/ticket"

export const generateNewTicket = (ticketCounter: number): Ticket => {
  const tipos = ["Créditos", "Cuentas", "General"]
  const prioridades = [null, null, null, null, "tercera-edad", "embarazada", "discapacitado"]
  const nombres = [
    "José García",
    "María López",
    "Carlos Ruiz",
    "Ana Martínez",
    "Luis Herrera",
    "Carmen Silva",
    "Roberto Torres",
    "Elena Morales",
    "Francisco Jiménez",
    "Isabel Vargas",
  ]

  const tipo = tipos[Math.floor(Math.random() * tipos.length)]
  const prioridad = prioridades[Math.floor(Math.random() * prioridades.length)]
  const cliente = nombres[Math.floor(Math.random() * nombres.length)]
  const letra = tipo === "Créditos" ? "A" : tipo === "Cuentas" ? "B" : "C"

  const now = new Date()
  const horaGeneracion = now.toLocaleTimeString("es-ES", { hour12: false })
  const tiempoEspera = "0:30"

  return {
    ticket: `${letra}-${String(ticketCounter).padStart(3, "0")}`,
    tipo,
    horaGeneracion,
    tiempoEspera,
    prioridad,
    cliente: prioridad === "tercera-edad" ? `${cliente} (${Math.floor(Math.random() * 20) + 65} años)` : cliente,
  }
}

export const getPriorityText = (priority: string | null): string => {
  switch (priority) {
    case "tercera-edad":
      return "Tercera Edad"
    case "embarazada":
      return "Embarazada"
    case "discapacitado":
      return "Discapacitado"
    default:
      return "Normal"
  }
}

export const calculatePriorityCounts = (tickets: Ticket[]) => {
  return {
    "tercera-edad": tickets.filter((t) => t.prioridad === "tercera-edad").length,
    embarazada: tickets.filter((t) => t.prioridad === "embarazada").length,
    discapacitado: tickets.filter((t) => t.prioridad === "discapacitado").length,
    normal: tickets.filter((t) => t.prioridad === null).length,
  }
}
