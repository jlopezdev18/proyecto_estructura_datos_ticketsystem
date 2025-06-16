"use client"

import { useState } from "react"
import type { Ticket } from "../types/ticket"
import { generateNewTicket, getPriorityText } from "../utils/ticketUtils"
import { showToast } from "../utils/notifications"
import { INITIAL_TICKETS_EN_ESPERA, INITIAL_HISTORIAL_TICKETS } from "../constants/mockData"

export const useTicketManagement = (selectedWindow: string) => {
  const [currentTicket, setCurrentTicket] = useState<Ticket | null>({
    ticket: "A-024",
    tipo: "Créditos",
    horaGeneracion: "14:32:15",
    tiempoEspera: "12:34",
    prioridad: null,
    cliente: "Pedro Martínez",
  })

  const [ticketsEnEspera, setTicketsEnEspera] = useState<Ticket[]>(INITIAL_TICKETS_EN_ESPERA)
  const [historialTickets, setHistorialTickets] = useState<Ticket[]>(INITIAL_HISTORIAL_TICKETS)
  const [ticketCounter, setTicketCounter] = useState(29)
  const [isBlinking, setIsBlinking] = useState(false)

  const handleCallNext = () => {
    if (ticketsEnEspera.length > 0) {
      const nextTicket = ticketsEnEspera[0]
      setCurrentTicket(nextTicket)

      const newQueue = ticketsEnEspera.slice(1)
      const newTicket = generateNewTicket(ticketCounter)
      setTicketCounter((prev) => prev + 1)

      setTicketsEnEspera([...newQueue, newTicket])
      showToast(`Llamando ticket ${nextTicket.ticket}`, `Cliente: ${nextTicket.cliente}`)
    } else {
      showToast("No hay tickets en espera", "La cola de tickets está vacía.", "destructive")
    }
  }

  const handleCallTicket = (ticketNumber: string, clientName: string, priority: string | null) => {
    const ticketToCall = ticketsEnEspera.find((t) => t.ticket === ticketNumber)
    if (ticketToCall) {
      setCurrentTicket(ticketToCall)

      const newQueue = ticketsEnEspera.filter((t) => t.ticket !== ticketNumber)
      const newTicket = generateNewTicket(ticketCounter)
      setTicketCounter((prev) => prev + 1)

      setTicketsEnEspera([...newQueue, newTicket])

      const priorityText = priority ? ` (Prioridad: ${getPriorityText(priority)})` : ""
      showToast(`Llamando ticket ${ticketNumber}`, `Cliente: ${clientName}${priorityText}`)
    }
  }

  const handleMarkAttended = () => {
    if (!currentTicket) return

    const now = new Date()
    const closedTime = now.toLocaleTimeString("es-ES", { hour12: false })
    const attendedTicket: Ticket = {
      ...currentTicket,
      estado: "Atendido",
      hora: closedTime,
      ventanilla: `V${selectedWindow}`,
      generado: currentTicket.horaGeneracion,
      cerrado: closedTime,
      tiempo: currentTicket.tiempoEspera,
    }

    setHistorialTickets((prev) => [attendedTicket, ...prev.slice(0, 4)])
    setCurrentTicket(null)
    showToast("Ticket marcado como atendido", `${currentTicket.ticket} - ${currentTicket.cliente}`)
  }

  const handleMarkAbsent = () => {
    if (!currentTicket) return

    const now = new Date()
    const closedTime = now.toLocaleTimeString("es-ES", { hour12: false })
    const absentTicket: Ticket = {
      ...currentTicket,
      estado: "Ausente",
      hora: closedTime,
      ventanilla: `V${selectedWindow}`,
      generado: currentTicket.horaGeneracion,
      cerrado: closedTime,
      tiempo: currentTicket.tiempoEspera,
    }

    setHistorialTickets((prev) => [absentTicket, ...prev.slice(0, 4)])
    setCurrentTicket(null)
    showToast("Ticket marcado como ausente", `${currentTicket.ticket} - ${currentTicket.cliente}`)
  }

  const handleRecall = () => {
    if (!currentTicket) {
      showToast("No hay ticket actual", "Debe llamar un ticket primero.", "destructive")
      return
    }

    setIsBlinking(true)
    showToast(`Re-llamando ticket ${currentTicket.ticket}`, `${currentTicket.tipo} - ${currentTicket.cliente}`)

    setTimeout(() => {
      setIsBlinking(false)
    }, 3000)
  }

  return {
    currentTicket,
    ticketsEnEspera,
    historialTickets,
    isBlinking,
    handleCallNext,
    handleCallTicket,
    handleMarkAttended,
    handleMarkAbsent,
    handleRecall,
  }
}
