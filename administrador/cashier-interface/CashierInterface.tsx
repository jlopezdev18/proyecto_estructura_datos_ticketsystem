"use client"

import { useState } from "react"
import { Badge } from "./components/ui/badge"
import { Button } from "./components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./components/ui/card"
import { Separator } from "./components/ui/separator"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./components/ui/select"
import {
  Play,
  CheckCircle,
  XCircle,
  RotateCcw,
  Pause,
  Settings,
  LogOut,
  Monitor,
  Clock,
  TrendingUp,
  Bell,
  AlertTriangle,
  User,
  Users,
  FileText,
  Download,
  UserPlus,
  UserCheck,
  TicketIcon as Queue,
  Star,
  Heart,
  Accessibility,
} from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./components/ui/alert-dialog"
import { Input } from "./components/ui/input"
import { Label } from "./components/ui/label"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "./components/ui/dropdown-menu"

interface Ticket {
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
  hora?: string;
}

export default function CashierInterface() {
  const [selectedWindow, setSelectedWindow] = useState("03")
  const [windowOperator, setWindowOperator] = useState("María González")
  const [currentTicket, setCurrentTicket] = useState<Ticket | null>({
    ticket: "A-024",
    tipo: "Créditos",
    horaGeneracion: "14:32:15",
    tiempoEspera: "12:34",
    prioridad: null,
    cliente: "Pedro Martínez",
  })
  const [isBlinking, setIsBlinking] = useState(false)

  // Datos de ventanillas y operadores
  const windowOperators = {
    "01": "Ana López",
    "02": "Carlos Ruiz",
    "03": "María González",
    "04": "Luis Morales",
    "05": "Sofia Herrera",
    "06": "Roberto Silva",
  }

  // Estado inicial de tickets en espera
  const [ticketsEnEspera, setTicketsEnEspera] = useState<Ticket[]>([
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
    {
      ticket: "A-027",
      tipo: "Créditos",
      horaGeneracion: "14:38:30",
      tiempoEspera: "5:15",
      prioridad: null,
      cliente: "Laura García",
    },
    {
      ticket: "C-014",
      tipo: "General",
      horaGeneracion: "14:39:45",
      tiempoEspera: "4:00",
      prioridad: "embarazada",
      cliente: "Sofia Herrera",
    },
    {
      ticket: "B-021",
      tipo: "Cuentas",
      horaGeneracion: "14:40:20",
      tiempoEspera: "3:25",
      prioridad: null,
      cliente: "Miguel Torres",
    },
    {
      ticket: "A-028",
      tipo: "Créditos",
      horaGeneracion: "14:41:10",
      tiempoEspera: "2:35",
      prioridad: "discapacitado",
      cliente: "Patricia Morales",
    },
    {
      ticket: "C-015",
      tipo: "General",
      horaGeneracion: "14:42:00",
      tiempoEspera: "1:45",
      prioridad: null,
      cliente: "Diego Ramírez",
    },
  ])

  // Estado del historial
  const [historialTickets, setHistorialTickets] = useState<Ticket[]>([
  {
    ticket: "A-023",
    tipo: "Créditos",
    tiempo: "6:45",
    estado: "Atendido",
    hora: "14:25",
    ventanilla: `V${selectedWindow}`,
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
  {
    ticket: "A-022",
    tipo: "Créditos",
    tiempo: "8:15",
    estado: "Atendido",
    hora: "14:10",
    ventanilla: "V02",
    generado: "14:01:45",
    cerrado: "14:10:00",
    horaGeneracion: "14:01:45",
    tiempoEspera: "00:08:15",
    prioridad: "alta",
    cliente: "Carlos Ramírez",
  },
  {
    ticket: "C-008",
    tipo: "General",
    tiempo: "15:20",
    estado: "Ausente",
    hora: "14:02",
    ventanilla: "V04",
    generado: "13:46:40",
    cerrado: "14:02:00",
    horaGeneracion: "13:46:40",
    tiempoEspera: "00:15:20",
    prioridad: "baja",
    cliente: "Ana Torres",
  },
  {
    ticket: "A-021",
    tipo: "Créditos",
    tiempo: "7:30",
    estado: "Atendido",
    hora: "13:55",
    ventanilla: `V${selectedWindow}`,
    generado: "13:47:30",
    cerrado: "13:55:00",
    horaGeneracion: "13:47:30",
    tiempoEspera: "00:07:30",
    prioridad: "media",
    cliente: "Luis Fernández",
  },
]);

  // Contador para generar nuevos tickets
  const [ticketCounter, setTicketCounter] = useState(29)

  // Función para mostrar toast (simulada para React)
  const showToast = (title: string, description: string, variant?: "default" | "destructive") => {
    // En una aplicación React real, usarías una librería como react-hot-toast o similar
    console.log(`Toast: ${title} - ${description}`)
    alert(`${title}: ${description}`)
  }

  // Función para generar un nuevo ticket
  const generateNewTicket = (): Ticket => {
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

  const handleWindowChange = (value: string) => {
    setSelectedWindow(value)
    setWindowOperator(windowOperators[value as keyof typeof windowOperators])
  }

  const handleSaveClient = () => {
    showToast("Cliente guardado", "El cliente ha sido registrado exitosamente.")
  }

  const handleSaveEmployee = () => {
    showToast("Empleado guardado", "El empleado ha sido registrado y está disponible.")
  }

  const generatePDFReport = () => {
    showToast("Generando reporte...", "El reporte PDF se descargará en unos momentos.")

    setTimeout(() => {
      showToast("Reporte descargado", "El reporte de tickets del día ha sido descargado exitosamente.")
    }, 2000)
  }

  // Función para llamar siguiente ticket
  const handleCallNext = () => {
    if (ticketsEnEspera.length > 0) {
      const nextTicket = ticketsEnEspera[0]
      setCurrentTicket(nextTicket)

      const newQueue = ticketsEnEspera.slice(1)
      const newTicket = generateNewTicket()
      setTicketCounter((prev) => prev + 1)

      setTicketsEnEspera([...newQueue, newTicket])

      showToast(`Llamando ticket ${nextTicket.ticket}`, `Cliente: ${nextTicket.cliente}`)
    } else {
      showToast("No hay tickets en espera", "La cola de tickets está vacía.", "destructive")
    }
  }

  // Función para llamar un ticket específico
  const handleCallTicket = (ticketNumber: string, clientName: string, priority: string | null) => {
    const ticketToCall = ticketsEnEspera.find((t) => t.ticket === ticketNumber)
    if (ticketToCall) {
      setCurrentTicket(ticketToCall)

      const newQueue = ticketsEnEspera.filter((t) => t.ticket !== ticketNumber)
      const newTicket = generateNewTicket()
      setTicketCounter((prev) => prev + 1)

      setTicketsEnEspera([...newQueue, newTicket])

      const priorityText = priority ? ` (Prioridad: ${getPriorityText(priority)})` : ""
      showToast(`Llamando ticket ${ticketNumber}`, `Cliente: ${clientName}${priorityText}`)
    }
  }

  // Función para marcar como atendido
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

  // Función para marcar como ausente
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

  // Función para re-llamar ticket actual
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

  const getPriorityIcon = (priority: string | null) => {
    switch (priority) {
      case "tercera-edad":
        return <User className="w-4 h-4 text-purple-600" />
      case "embarazada":
        return <Heart className="w-4 h-4 text-pink-600" />
      case "discapacitado":
        return <Accessibility className="w-4 h-4 text-blue-600" />
      default:
        return null
    }
  }

  const getPriorityText = (priority: string | null) => {
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

  const getPriorityBadge = (priority: string | null) => {
    switch (priority) {
      case "tercera-edad":
        return (
          <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
            <User className="w-3 h-3 mr-1" />
            Tercera Edad
          </Badge>
        )
      case "embarazada":
        return (
          <Badge variant="outline" className="bg-pink-50 text-pink-700 border-pink-200">
            <Heart className="w-3 h-3 mr-1" />
            Embarazada
          </Badge>
        )
      case "discapacitado":
        return (
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            <Accessibility className="w-3 h-3 mr-1" />
            Discapacitado
          </Badge>
        )
      default:
        return (
          <Badge variant="outline" className="bg-gray-50 text-gray-600">
            Normal
          </Badge>
        )
    }
  }

  // Contar tickets por prioridad
  const priorityCounts = {
    "tercera-edad": ticketsEnEspera.filter((t) => t.prioridad === "tercera-edad").length,
    embarazada: ticketsEnEspera.filter((t) => t.prioridad === "embarazada").length,
    discapacitado: ticketsEnEspera.filter((t) => t.prioridad === "discapacitado").length,
    normal: ticketsEnEspera.filter((t) => t.prioridad === null).length,
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Panel de Administrador</h1>
            <p className="text-gray-600">Operador: {windowOperator}</p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
              Disponible
            </Badge>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <Settings className="w-4 h-4 mr-2" />
                  Otras Gestiones
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem onClick={generatePDFReport}>
                  <FileText className="w-4 h-4 mr-2" />
                  Reportes
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <Dialog>
                  <DialogTrigger asChild>
                    <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                      <UserPlus className="w-4 h-4 mr-2" />
                      Nuevo Cliente
                    </DropdownMenuItem>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>Crear Nuevo Cliente</DialogTitle>
                      <DialogDescription>Ingresa los datos esenciales del nuevo cliente.</DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="cedula" className="text-right">
                          Cédula *
                        </Label>
                        <Input id="cedula" placeholder="1234567890" className="col-span-3" />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="nombre-completo" className="text-right">
                          Nombre Completo *
                        </Label>
                        <Input id="nombre-completo" placeholder="Juan Carlos Pérez García" className="col-span-3" />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="telefono" className="text-right">
                          Teléfono *
                        </Label>
                        <Input id="telefono" placeholder="0987654321" className="col-span-3" />
                      </div>
                    </div>
                    <div className="flex justify-end gap-2">
                      <DialogTrigger asChild>
                        <Button variant="outline">Cancelar</Button>
                      </DialogTrigger>
                      <Button type="submit" onClick={handleSaveClient}>
                        Guardar Cliente
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
                <Dialog>
                  <DialogTrigger asChild>
                    <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                      <UserCheck className="w-4 h-4 mr-2" />
                      Nuevo Empleado
                    </DropdownMenuItem>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>Crear Nuevo Empleado</DialogTitle>
                      <DialogDescription>Registra un nuevo empleado en el sistema.</DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="emp-nombre" className="text-right">
                          Nombre Completo *
                        </Label>
                        <Input id="emp-nombre" placeholder="Ana María González" className="col-span-3" />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="emp-ventanilla" className="text-right">
                          Ventanilla *
                        </Label>
                        <Select>
                          <SelectTrigger className="col-span-3">
                            <SelectValue placeholder="Seleccionar ventanilla" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="01">Ventanilla 01</SelectItem>
                            <SelectItem value="02">Ventanilla 02</SelectItem>
                            <SelectItem value="03">Ventanilla 03</SelectItem>
                            <SelectItem value="04">Ventanilla 04</SelectItem>
                            <SelectItem value="05">Ventanilla 05</SelectItem>
                            <SelectItem value="06">Ventanilla 06</SelectItem>
                            <SelectItem value="07">Ventanilla 07</SelectItem>
                            <SelectItem value="08">Ventanilla 08</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="emp-transacciones" className="text-right">
                          Transacciones *
                        </Label>
                        <Select>
                          <SelectTrigger className="col-span-3">
                            <SelectValue placeholder="Tipo de transacciones" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="creditos">Solo Créditos</SelectItem>
                            <SelectItem value="cuentas">Solo Cuentas</SelectItem>
                            <SelectItem value="general">Atención General</SelectItem>
                            <SelectItem value="todos">Todas las Transacciones</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="flex justify-end gap-2">
                      <DialogTrigger asChild>
                        <Button variant="outline">Cancelar</Button>
                      </DialogTrigger>
                      <Button type="submit" onClick={handleSaveEmployee}>
                        Guardar Empleado
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </DropdownMenuContent>
            </DropdownMenu>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <LogOut className="w-4 h-4 mr-2" />
                  Cerrar Sesión
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>¿Estás seguro que deseas salir?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Se cerrará tu sesión de administrador y perderás el acceso al sistema hasta que vuelvas a iniciar
                    sesión.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                  <AlertDialogAction>Sí, cerrar sesión</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Ticket Actual */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Monitor className="w-5 h-5" />
                  Ticket Actual
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {currentTicket ? (
                  <div className="text-center p-6 bg-blue-50 rounded-lg">
                    <div className={`text-4xl font-bold text-blue-600 mb-2 ${isBlinking ? "animate-pulse" : ""}`}>
                      {currentTicket.ticket}
                    </div>
                    <Badge className={`mb-4 ${isBlinking ? "animate-pulse" : ""}`}>{currentTicket.tipo}</Badge>
                    <div className="text-sm text-gray-700 mb-2">{currentTicket.cliente}</div>
                    <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                      <div>
                        <div className="font-medium">Hora de generación</div>
                        <div>{currentTicket.horaGeneracion}</div>
                      </div>
                      <div>
                        <div className="font-medium">Tiempo de espera</div>
                        <div className="text-orange-600 font-medium">{currentTicket.tiempoEspera}</div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center p-6 bg-gray-50 rounded-lg">
                    <div className="text-4xl font-bold text-gray-400 mb-2">---</div>
                    <Badge variant="outline" className="mb-4">
                      Sin ticket
                    </Badge>
                    <div className="text-sm text-gray-500 mb-2">No hay ticket en atención</div>
                    <div className="text-sm text-gray-400">Presione "Llamar Siguiente" para atender un ticket</div>
                  </div>
                )}

                {/* Botones de Acción */}
                <div className="grid grid-cols-2 gap-3">
                  <Button size="lg" className="h-16" onClick={handleCallNext}>
                    <Play className="w-5 h-5 mr-2" />
                    Llamar Siguiente
                  </Button>
                  <Button size="lg" variant="outline" className="h-16" onClick={handleRecall} disabled={!currentTicket}>
                    <RotateCcw className="w-5 h-5 mr-2" />
                    Re-llamar Actual
                  </Button>
                  <Button
                    size="lg"
                    variant="default"
                    className="h-16 bg-green-600 hover:bg-green-700"
                    onClick={handleMarkAttended}
                    disabled={!currentTicket}
                  >
                    <CheckCircle className="w-5 h-5 mr-2" />
                    Marcar Atendido
                  </Button>
                  <Button
                    size="lg"
                    variant="destructive"
                    className="h-16"
                    onClick={handleMarkAbsent}
                    disabled={!currentTicket}
                  >
                    <XCircle className="w-5 h-5 mr-2" />
                    Marcar Ausente
                  </Button>
                </div>

                <Separator />

                {/* Control de Estado */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Pause className="w-4 h-4" />
                    <span className="text-sm font-medium">Estado de Ventanilla:</span>
                  </div>
                  <Button variant="outline" size="sm">
                    Pausar Atención
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Panel Lateral */}
          <div className="space-y-6">
            {/* Estadísticas del Día */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Estadísticas del Día
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Tickets atendidos</span>
                  <span className="font-bold text-lg">
                    {historialTickets.filter((t) => t.estado === "Atendido").length}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Tiempo promedio</span>
                  <span className="font-bold text-lg">8:32</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Ausentes</span>
                  <span className="font-bold text-lg text-red-600">
                    {historialTickets.filter((t) => t.estado === "Ausente").length}
                  </span>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Eficiencia</span>
                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                    94%
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Configuración Rápida */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="w-5 h-5" />
                  Configuración Rápida
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Tipo de Servicio</label>
                  <Select defaultValue="creditos">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="creditos">Créditos</SelectItem>
                      <SelectItem value="cuentas">Cuentas</SelectItem>
                      <SelectItem value="general">Atención General</SelectItem>
                      <SelectItem value="todos">Todos los Servicios</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Ventanilla</label>
                  <Select value={selectedWindow} onValueChange={handleWindowChange}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="01">Ventanilla 01</SelectItem>
                      <SelectItem value="02">Ventanilla 02</SelectItem>
                      <SelectItem value="03">Ventanilla 03</SelectItem>
                      <SelectItem value="04">Ventanilla 04</SelectItem>
                      <SelectItem value="05">Ventanilla 05</SelectItem>
                      <SelectItem value="06">Ventanilla 06</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Notificaciones */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="w-5 h-5" />
                  Notificaciones
                  <Badge variant="destructive" className="ml-auto">
                    2
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="text-sm font-medium text-yellow-800">Sistema</div>
                  <div className="text-xs text-yellow-700">Mantenimiento programado a las 18:00</div>
                </div>
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="text-sm font-medium text-blue-800">Administrador</div>
                  <div className="text-xs text-blue-700">Nueva política de atención implementada</div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Cola de Tickets en Espera */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Queue className="w-5 h-5" />
              Tickets en Espera
              <Badge variant="outline" className="ml-auto">
                {ticketsEnEspera.length} en Cola
              </Badge>
            </CardTitle>
            <CardDescription>Primeros 10 tickets en espera - Los tickets prioritarios se destacan</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {ticketsEnEspera.map((ticket, index) => (
                <div
                  key={index}
                  className={`flex items-center justify-between p-4 rounded-lg border ${
                    ticket.prioridad ? "border-orange-200 bg-orange-50" : "border-gray-200 bg-white hover:bg-gray-50"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <div className="font-mono font-bold text-lg">{ticket.ticket}</div>
                      {ticket.prioridad && <Star className="w-4 h-4 text-orange-500" />}
                    </div>
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">{ticket.tipo}</Badge>
                        {getPriorityBadge(ticket.prioridad)}
                      </div>
                      <div className="text-sm text-gray-600">{ticket.cliente}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right text-sm">
                      <div className="text-gray-600">Generado: {ticket.horaGeneracion}</div>
                      <div className="font-medium text-orange-600">Esperando: {ticket.tiempoEspera}</div>
                    </div>
                    <Button
                      size="sm"
                      variant={ticket.prioridad ? "default" : "outline"}
                      className={
                        ticket.prioridad
                          ? "bg-orange-600 hover:bg-orange-700 text-white"
                          : "hover:bg-blue-50 hover:text-blue-700"
                      }
                      onClick={() => handleCallTicket(ticket.ticket, ticket.cliente, ticket.prioridad)}
                    >
                      <Play className="w-4 h-4 mr-1" />
                      Llamar
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            <Separator className="my-4" />

            {/* Resumen de prioridades */}
            <div className="grid grid-cols-4 gap-4 text-center">
              <div className="p-3 bg-purple-50 rounded-lg">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <User className="w-4 h-4 text-purple-600" />
                  <span className="text-sm font-medium text-purple-700">Tercera Edad</span>
                </div>
                <div className="text-lg font-bold text-purple-600">{priorityCounts["tercera-edad"]}</div>
              </div>
              <div className="p-3 bg-pink-50 rounded-lg">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <Heart className="w-4 h-4 text-pink-600" />
                  <span className="text-sm font-medium text-pink-700">Embarazadas</span>
                </div>
                <div className="text-lg font-bold text-pink-600">{priorityCounts.embarazada}</div>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <Accessibility className="w-4 h-4 text-blue-600" />
                  <span className="text-sm font-medium text-blue-700">Discapacitados</span>
                </div>
                <div className="text-lg font-bold text-blue-600">{priorityCounts.discapacitado}</div>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <Queue className="w-4 h-4 text-gray-600" />
                  <span className="text-sm font-medium text-gray-700">Normales</span>
                </div>
                <div className="text-lg font-bold text-gray-600">{priorityCounts.normal}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Estado de Ventanillas y Empleados */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Empleados Disponibles */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5 text-green-600" />
                Empleados Disponibles
                <Badge variant="outline" className="ml-auto bg-green-50 text-green-700">
                  4 Activos
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                { numero: "01", cajero: "Ana López", servicio: "Cuentas", estado: "Activa", atendiendo: "B-018" },
                { numero: "02", cajero: "Carlos Ruiz", servicio: "Créditos", estado: "Activa", atendiendo: "A-025" },
                {
                  numero: "03",
                  cajero: "María González",
                  servicio: "Créditos",
                  estado: "Activa",
                  atendiendo: currentTicket?.ticket || "---",
                },
                { numero: "06", cajero: "Roberto Silva", servicio: "Todos", estado: "Activa", atendiendo: "C-012" },
              ].map((ventanilla, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 border border-green-200 bg-green-50 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      <div className="font-mono font-bold text-sm">V{ventanilla.numero}</div>
                      <div className="w-2 h-2 rounded-full bg-green-500"></div>
                    </div>
                    <div className="text-xs">
                      <div className="font-medium flex items-center gap-1">
                        <User className="w-3 h-3" />
                        {ventanilla.cajero}
                      </div>
                      <div className="text-gray-600">{ventanilla.servicio}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge className="text-xs bg-green-100 text-green-800">{ventanilla.estado}</Badge>
                    <div className="text-xs text-gray-600 mt-1 font-mono">{ventanilla.atendiendo}</div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Empleados Ausentes/En Descanso */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-red-600" />
                Empleados Ausentes/En Descanso
                <Badge variant="destructive" className="ml-auto">
                  2 Inactivos
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                { numero: "04", cajero: "Luis Morales", servicio: "General", estado: "Ausente", tiempo: "25 min" },
                { numero: "05", cajero: "Sofia Herrera", servicio: "Cuentas", estado: "En Descanso", tiempo: "8 min" },
              ].map((ventanilla, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 border border-red-200 bg-red-50 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      <div className="font-mono font-bold text-sm">V{ventanilla.numero}</div>
                      <div
                        className={`w-2 h-2 rounded-full ${ventanilla.estado === "Ausente" ? "bg-red-500" : "bg-yellow-500"}`}
                      ></div>
                    </div>
                    <div className="text-xs">
                      <div className="font-medium flex items-center gap-1">
                        <User className="w-3 h-3" />
                        {ventanilla.cajero}
                      </div>
                      <div className="text-gray-600">{ventanilla.servicio}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge
                      variant={ventanilla.estado === "Ausente" ? "destructive" : "secondary"}
                      className={`text-xs ${ventanilla.estado === "En Descanso" ? "bg-yellow-100 text-yellow-800" : ""}`}
                    >
                      {ventanilla.estado}
                    </Badge>
                    <div className="text-xs text-gray-600 mt-1">{ventanilla.tiempo}</div>
                  </div>
                </div>
              ))}

              {/* Alerta general */}
              <div className="p-3 bg-red-100 border border-red-300 rounded-lg flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-red-600" />
                <div className="text-sm text-red-800">
                  <div className="font-medium">Atención: Personal reducido</div>
                  <div className="text-xs">Considerar reasignación de servicios</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Historial Reciente */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Historial de Tickets Recientes
            </CardTitle>
            <CardDescription>Últimos 5 tickets procesados - Datos para reporte PDF</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {historialTickets.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="font-mono font-bold">{item.ticket}</div>
                    <Badge variant="outline">{item.tipo}</Badge>
                    <div className="text-sm text-gray-600">{item.ventanilla}</div>
                    <div className="text-sm text-gray-600">
                      <div className="text-xs">Generado: {item.generado}</div>
                      <div className="text-xs">Cerrado: {item.cerrado}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-sm text-gray-600">Tiempo: {item.tiempo}</div>
                    <Badge
                      variant={item.estado === "Atendido" ? "default" : "destructive"}
                      className={item.estado === "Atendido" ? "bg-green-100 text-green-800" : ""}
                    >
                      {item.estado}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>

            <Separator className="my-4" />

            <div className="flex justify-between items-center">
              <div className="text-sm text-gray-600">
                Total de tickets procesados hoy: <span className="font-bold">{historialTickets.length + 50}</span>
              </div>
              <Button onClick={generatePDFReport} className="flex items-center gap-2">
                <Download className="w-4 h-4" />
                Descargar Reporte PDF
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
