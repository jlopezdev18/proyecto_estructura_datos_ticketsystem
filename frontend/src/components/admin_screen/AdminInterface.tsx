"use client"

import type React from "react"

import { useState } from "react"
import {
  Box,
  Typography,
  Button,
  Chip,
  Divider,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  Stack,
  Container,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Card,
  CardContent,
  Tabs,
  Tab,
  type SelectChangeEvent,
} from "@mui/material"
import Grid from "@mui/material/Grid"
import {
  Settings,
  Logout,
  Description,
  PersonAdd,
  PersonAddAlt1,
  Person,
  Add,
  Edit,
  Delete,
  BarChart,
  Store,
  Assessment,
  CheckCircle,
  Cancel,
  Schedule,
} from "@mui/icons-material"

import { CLIENTS, WINDOW_OPERATORS } from "../../constants/mockData"
import { useTicketManagement } from "../../hooks/useTicketManagment"
import { showToast, showInfoToast } from "../../utils/notifications"
import { CurrentTicketCard } from "../admin_screen/CurrentTicketCard"
import { TicketQueueCard } from "../admin_screen/TicketQueueCard"
import { SidebarCards } from "../admin_screen/SidebarCards"

interface Window {
  id: number
  numero: string
  nombre: string
  operador: string
  servicios: string[]
}

interface PersonaAtendida {
  id: number
  nombre: string
  cedula: string
  ventanilla: string
  tiempoEspera: number
  tiempoServicio: number
  transaccion: string
  estado: "atendida" | "no_atendida"
  horaLlamada: string
  horaAtencion?: string
}

interface TransaccionDemanda {
  transaccion: string
  cantidad: number
  porcentaje: number
}

export default function AdminInterface() {
  const [selectedWindow, setSelectedWindow] = useState("03")
  const [windowOperator, setWindowOperator] = useState("María González")
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [clientDialogOpen, setClientDialogOpen] = useState(false)
  const [employeeDialogOpen, setEmployeeDialogOpen] = useState(false)
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false)
  const [clientsViewDialogOpen, setClientsViewDialogOpen] = useState(false)
  const [windowDialogOpen, setWindowDialogOpen] = useState(false)
  const [windowsViewDialogOpen, setWindowsViewDialogOpen] = useState(false)
  const [reportsDialogOpen, setReportsDialogOpen] = useState(false)
  const [editingWindow, setEditingWindow] = useState<Window | null>(null)
  const [tabValue, setTabValue] = useState(0)

  // Datos mock de ventanillas (simplificado)
  const [windows, setWindows] = useState<Window[]>([
    {
      id: 1,
      numero: "01",
      nombre: "Ventanilla Principal",
      operador: "Carlos Rodríguez",
      servicios: ["cuentas", "general"],
    },
    {
      id: 2,
      numero: "02",
      nombre: "Ventanilla Créditos",
      operador: "Ana Martínez",
      servicios: ["creditos"],
    },
    {
      id: 3,
      numero: "03",
      nombre: "Ventanilla Empresarial",
      operador: "María González",
      servicios: ["transferencias", "cuentas"],
    },
    {
      id: 4,
      numero: "04",
      nombre: "Ventanilla Express",
      operador: "Luis Castro",
      servicios: ["general"],
    },
    {
      id: 5,
      numero: "05",
      nombre: "Ventanilla VIP",
      operador: "Patricia Morales",
      servicios: ["todos"],
    },
  ])

  // Datos mock de personas atendidas
  const personasAtendidas: PersonaAtendida[] = [
    {
      id: 1,
      nombre: "Juan Pérez",
      cedula: "1234567890",
      ventanilla: "Ventanilla 01",
      tiempoEspera: 8,
      tiempoServicio: 12,
      transaccion: "Apertura de Cuenta",
      estado: "atendida",
      horaLlamada: "09:15",
      horaAtencion: "09:23",
    },
    {
      id: 2,
      nombre: "María González",
      cedula: "0987654321",
      ventanilla: "Ventanilla 02",
      tiempoEspera: 15,
      tiempoServicio: 25,
      transaccion: "Solicitud de Crédito",
      estado: "atendida",
      horaLlamada: "09:30",
      horaAtencion: "09:45",
    },
    {
      id: 3,
      nombre: "Carlos Rodríguez",
      cedula: "1122334455",
      ventanilla: "Ventanilla 01",
      tiempoEspera: 22,
      tiempoServicio: 0,
      transaccion: "Consulta de Saldo",
      estado: "no_atendida",
      horaLlamada: "10:00",
    },
    {
      id: 4,
      nombre: "Ana Martínez",
      cedula: "5566778899",
      ventanilla: "Ventanilla 03",
      tiempoEspera: 5,
      tiempoServicio: 18,
      transaccion: "Transferencia Internacional",
      estado: "atendida",
      horaLlamada: "10:15",
      horaAtencion: "10:20",
    },
    {
      id: 5,
      nombre: "Luis Castro",
      cedula: "9988776655",
      ventanilla: "Ventanilla 02",
      tiempoEspera: 30,
      tiempoServicio: 0,
      transaccion: "Solicitud de Crédito",
      estado: "no_atendida",
      horaLlamada: "10:30",
    },
    {
      id: 6,
      nombre: "Patricia Morales",
      cedula: "4433221100",
      ventanilla: "Ventanilla 01",
      tiempoEspera: 12,
      tiempoServicio: 8,
      transaccion: "Actualización de Datos",
      estado: "atendida",
      horaLlamada: "10:45",
      horaAtencion: "10:57",
    },
  ]

  // Datos mock de transacciones de mayor demanda
  const transaccionesDemanda: TransaccionDemanda[] = [
    { transaccion: "Apertura de Cuenta", cantidad: 25, porcentaje: 35 },
    { transaccion: "Solicitud de Crédito", cantidad: 18, porcentaje: 25 },
    { transaccion: "Transferencia Internacional", cantidad: 12, porcentaje: 17 },
    { transaccion: "Consulta de Saldo", cantidad: 10, porcentaje: 14 },
    { transaccion: "Actualización de Datos", cantidad: 7, porcentaje: 9 },
  ]

  const {
    currentTicket,
    ticketsEnEspera,
    historialTickets,
    isBlinking,
    handleCallNext,
    handleCallTicket,
    handleMarkAttended,
    handleMarkAbsent,
    handleRecall,
  } = useTicketManagement(selectedWindow)

  const handleWindowChange = (event: SelectChangeEvent) => {
    const value = event.target.value
    setSelectedWindow(value)
    setWindowOperator(WINDOW_OPERATORS[value as keyof typeof WINDOW_OPERATORS])
  }

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
  }

  const handleSaveClient = () => {
    setClientDialogOpen(false)
    showToast("Cliente guardado", "El cliente ha sido registrado exitosamente.")
  }

  const handleSaveEmployee = () => {
    setEmployeeDialogOpen(false)
    showToast("Empleado guardado", "El empleado ha sido registrado y está disponible.")
  }

  const handleSaveWindow = () => {
    if (editingWindow) {
      // Actualizar ventanilla existente
      setWindows((prev) => prev.map((window) => (window.id === editingWindow.id ? editingWindow : window)))
      showToast("Ventanilla actualizada", "La ventanilla ha sido actualizada exitosamente.")
    } else {
      // Crear nueva ventanilla
      const newWindow: Window = {
        id: Date.now(),
        numero: "06",
        nombre: "Nueva Ventanilla",
        operador: "Sin asignar",
        servicios: ["general"],
      }
      setWindows((prev) => [...prev, newWindow])
      showToast("Ventanilla creada", "La nueva ventanilla ha sido creada exitosamente.")
    }
    setWindowDialogOpen(false)
    setEditingWindow(null)
  }

  const handleEditWindow = (window: Window) => {
    setEditingWindow(window)
    setWindowDialogOpen(true)
  }

  const handleDeleteWindow = (windowId: number) => {
    setWindows((prev) => prev.filter((window) => window.id !== windowId))
    showToast("Ventanilla eliminada", "La ventanilla ha sido eliminada exitosamente.")
  }

  const generatePDFReport = () => {
    handleMenuClose()
    setReportsDialogOpen(true)
  }

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue)
  }

  // Cálculos de estadísticas
  const totalPersonasLlamadas = personasAtendidas.length
  const personasAtendidas_count = personasAtendidas.filter((p) => p.estado === "atendida").length
  const personasNoAtendidas = personasAtendidas.filter((p) => p.estado === "no_atendida").length
  const tiempoEsperaPromedio = personasAtendidas.reduce((acc, p) => acc + p.tiempoEspera, 0) / personasAtendidas.length
  const tiempoServicioPromedio =
    personasAtendidas.filter((p) => p.estado === "atendida").reduce((acc, p) => acc + p.tiempoServicio, 0) /
    personasAtendidas_count

  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      <Stack spacing={3}>
        {/* Header */}
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Box>
            <Typography variant="h4" component="h1" fontWeight="bold">
              Panel de Administrador
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Operador: {windowOperator}
            </Typography>
          </Box>
          <Stack direction="row" spacing={2}>
            <Chip
              icon={<Box sx={{ width: 8, height: 8, bgcolor: "success.main", borderRadius: "50%" }} />}
              label="Disponible"
              color="success"
              variant="outlined"
            />

            <Button variant="outlined" startIcon={<Settings />} onClick={handleMenuClick} size="small">
              Otras Gestiones
            </Button>
            <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
              <MenuItem onClick={generatePDFReport}>
                <Assessment sx={{ mr: 1 }} />
                Reportes y Estadísticas
              </MenuItem>
              <Divider />
              <MenuItem
                onClick={() => {
                  handleMenuClose()
                  setClientDialogOpen(true)
                }}
              >
                <PersonAdd sx={{ mr: 1 }} />
                Nuevo Cliente
              </MenuItem>
              <MenuItem
                onClick={() => {
                  handleMenuClose()
                  setClientsViewDialogOpen(true)
                }}
              >
                <Person sx={{ mr: 1 }} />
                Ver Clientes
              </MenuItem>
              <MenuItem
                onClick={() => {
                  handleMenuClose()
                  setEmployeeDialogOpen(true)
                }}
              >
                <PersonAddAlt1 sx={{ mr: 1 }} />
                Nuevo Empleado
              </MenuItem>
              <Divider />
              <MenuItem
                onClick={() => {
                  handleMenuClose()
                  setEditingWindow(null)
                  setWindowDialogOpen(true)
                }}
              >
                <Add sx={{ mr: 1 }} />
                Nueva Ventanilla
              </MenuItem>
              <MenuItem
                onClick={() => {
                  handleMenuClose()
                  setWindowsViewDialogOpen(true)
                }}
              >
                <Store sx={{ mr: 1 }} />
                Ver Ventanillas
              </MenuItem>
            </Menu>

            <Button variant="outlined" startIcon={<Logout />} onClick={() => setLogoutDialogOpen(true)} size="small">
              Cerrar Sesión
            </Button>
          </Stack>
        </Box>

        <Grid container spacing={3}>
          {/* Ticket Actual */}
          <Grid size={8}>
            <CurrentTicketCard
              currentTicket={currentTicket}
              isBlinking={isBlinking}
              onCallNext={handleCallNext}
              onRecall={handleRecall}
              onMarkAttended={handleMarkAttended}
              onMarkAbsent={handleMarkAbsent}
            />
          </Grid>

          {/* Panel Lateral */}
          <Grid size={4}>
            <SidebarCards
              historialTickets={historialTickets}
              selectedWindow={selectedWindow}
              onWindowChange={handleWindowChange}
            />
          </Grid>
        </Grid>

        {/* Cola de Tickets en Espera */}
        <TicketQueueCard tickets={ticketsEnEspera} onCallTicket={handleCallTicket} />
      </Stack>

      {/* Dialogs */}
      <Dialog open={clientDialogOpen} onClose={() => setClientDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Crear Nuevo Cliente</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Ingresa los datos esenciales del nuevo cliente.
          </Typography>
          <Stack spacing={3}>
            <TextField label="Cédula *" placeholder="1234567890" fullWidth />
            <TextField label="Nombre Completo *" placeholder="Juan Carlos Pérez García" fullWidth />
            <TextField label="Teléfono *" placeholder="0987654321" fullWidth />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setClientDialogOpen(false)}>Cancelar</Button>
          <Button variant="contained" onClick={handleSaveClient}>
            Guardar Cliente
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={employeeDialogOpen} onClose={() => setEmployeeDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Crear Nuevo Empleado</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Registra un nuevo empleado en el sistema.
          </Typography>
          <Stack spacing={3}>
            <TextField label="Nombre Completo *" placeholder="Ana María González" fullWidth />
            <FormControl fullWidth>
              <InputLabel>Ventanilla *</InputLabel>
              <Select label="Ventanilla *">
                <MenuItem value="01">Ventanilla 01</MenuItem>
                <MenuItem value="02">Ventanilla 02</MenuItem>
                <MenuItem value="03">Ventanilla 03</MenuItem>
                <MenuItem value="04">Ventanilla 04</MenuItem>
                <MenuItem value="05">Ventanilla 05</MenuItem>
                <MenuItem value="06">Ventanilla 06</MenuItem>
                <MenuItem value="07">Ventanilla 07</MenuItem>
                <MenuItem value="08">Ventanilla 08</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel>Transacciones *</InputLabel>
              <Select label="Transacciones *">
                <MenuItem value="creditos">Solo Créditos</MenuItem>
                <MenuItem value="cuentas">Solo Cuentas</MenuItem>
                <MenuItem value="general">Atención General</MenuItem>
                <MenuItem value="todos">Todas las Transacciones</MenuItem>
              </Select>
            </FormControl>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEmployeeDialogOpen(false)}>Cancelar</Button>
          <Button variant="contained" onClick={handleSaveEmployee}>
            Guardar Empleado
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={logoutDialogOpen} onClose={() => setLogoutDialogOpen(false)}>
        <DialogTitle>¿Estás seguro que deseas salir?</DialogTitle>
        <DialogContent>
          <Typography>
            Se cerrará tu sesión de administrador y perderás el acceso al sistema hasta que vuelvas a iniciar sesión.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setLogoutDialogOpen(false)}>Cancelar</Button>
          <Button variant="contained" color="error">
            Sí, cerrar sesión
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={clientsViewDialogOpen} onClose={() => setClientsViewDialogOpen(false)} maxWidth="lg" fullWidth>
        <DialogTitle>Lista de Clientes</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Todos los clientes registrados en el sistema.
          </Typography>
          <TableContainer component={Paper} sx={{ maxHeight: 400 }}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell>
                    <strong>Cédula</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Nombre Completo</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Teléfono</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Fecha de Registro</strong>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {CLIENTS.map((client) => (
                  <TableRow key={client.id} hover>
                    <TableCell>{client.cedula}</TableCell>
                    <TableCell>{client.nombre}</TableCell>
                    <TableCell>{client.telefono}</TableCell>
                    <TableCell>{client.fechaRegistro}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setClientsViewDialogOpen(false)} variant="contained">
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Modal para Crear/Editar Ventanilla (Simplificado) */}
      <Dialog open={windowDialogOpen} onClose={() => setWindowDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{editingWindow ? "Editar Ventanilla" : "Crear Nueva Ventanilla"}</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            {editingWindow ? "Modifica los datos de la ventanilla." : "Ingresa los datos de la nueva ventanilla."}
          </Typography>
          <Stack spacing={3}>
            <TextField
              label="Número de Ventanilla *"
              placeholder="01"
              fullWidth
              value={editingWindow?.numero || ""}
              onChange={(e) => setEditingWindow((prev) => (prev ? { ...prev, numero: e.target.value } : null))}
            />
            <TextField
              label="Nombre de la Ventanilla *"
              placeholder="Ventanilla Principal"
              fullWidth
              value={editingWindow?.nombre || ""}
              onChange={(e) => setEditingWindow((prev) => (prev ? { ...prev, nombre: e.target.value } : null))}
            />
            <TextField
              label="Operador Asignado *"
              placeholder="Carlos Rodríguez"
              fullWidth
              value={editingWindow?.operador || ""}
              onChange={(e) => setEditingWindow((prev) => (prev ? { ...prev, operador: e.target.value } : null))}
            />
            <FormControl fullWidth>
              <InputLabel>Servicios *</InputLabel>
              <Select
                label="Servicios *"
                multiple
                value={editingWindow?.servicios || []}
                onChange={(e) =>
                  setEditingWindow((prev) => (prev ? { ...prev, servicios: e.target.value as string[] } : null))
                }
              >
                <MenuItem value="cuentas">Cuentas</MenuItem>
                <MenuItem value="creditos">Créditos</MenuItem>
                <MenuItem value="transferencias">Transferencias</MenuItem>
                <MenuItem value="general">General</MenuItem>
                <MenuItem value="todos">Todos los Servicios</MenuItem>
              </Select>
            </FormControl>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setWindowDialogOpen(false)}>Cancelar</Button>
          <Button variant="contained" onClick={handleSaveWindow}>
            {editingWindow ? "Actualizar Ventanilla" : "Guardar Ventanilla"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Modal para Ver Ventanillas (Simplificado) */}
      <Dialog open={windowsViewDialogOpen} onClose={() => setWindowsViewDialogOpen(false)} maxWidth="lg" fullWidth>
        <DialogTitle>Gestión de Ventanillas</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Todas las ventanillas del sistema. Puedes editar o eliminar cada ventanilla.
          </Typography>
          <TableContainer component={Paper} sx={{ maxHeight: 500 }}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell>
                    <strong>Número</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Nombre</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Operador</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Servicios</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Acciones</strong>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {windows.map((window) => (
                  <TableRow key={window.id} hover>
                    <TableCell>
                      <strong>{window.numero}</strong>
                    </TableCell>
                    <TableCell>{window.nombre}</TableCell>
                    <TableCell>{window.operador}</TableCell>
                    <TableCell>
                      <Stack direction="row" spacing={0.5} flexWrap="wrap">
                        {window.servicios.map((servicio) => (
                          <Chip key={servicio} label={servicio} size="small" variant="outlined" />
                        ))}
                      </Stack>
                    </TableCell>
                    <TableCell>
                      <Stack direction="row" spacing={1}>
                        <IconButton size="small" color="primary" onClick={() => handleEditWindow(window)}>
                          <Edit />
                        </IconButton>
                        <IconButton size="small" color="error" onClick={() => handleDeleteWindow(window.id)}>
                          <Delete />
                        </IconButton>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setWindowsViewDialogOpen(false)} variant="contained">
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Modal de Reportes y Estadísticas (Rediseñado) */}
      <Dialog open={reportsDialogOpen} onClose={() => setReportsDialogOpen(false)} maxWidth="xl" fullWidth>
        <DialogTitle>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <BarChart />
            Reportes y Estadísticas del Sistema
          </Box>
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Estadísticas detalladas de atención, transacciones y tiempos de servicio.
          </Typography>

          {/* Resumen General */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid size={3}>
              <Card>
                <CardContent>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Person color="primary" />
                    <Box>
                      <Typography color="text.secondary" variant="body2">
                        Personas Llamadas
                      </Typography>
                      <Typography variant="h4" component="div">
                        {totalPersonasLlamadas}
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            <Grid size={3}>
              <Card>
                <CardContent>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <CheckCircle color="success" />
                    <Box>
                      <Typography color="text.secondary" variant="body2">
                        Personas Atendidas
                      </Typography>
                      <Typography variant="h4" component="div">
                        {personasAtendidas_count}
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            <Grid size={3}>
              <Card>
                <CardContent>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Schedule color="warning" />
                    <Box>
                      <Typography color="text.secondary" variant="body2">
                        Tiempo Espera Promedio
                      </Typography>
                      <Typography variant="h4" component="div">
                        {tiempoEsperaPromedio.toFixed(1)} min
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            <Grid size={3}>
              <Card>
                <CardContent>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Assessment color="info" />
                    <Box>
                      <Typography color="text.secondary" variant="body2">
                        Tiempo Servicio Promedio
                      </Typography>
                      <Typography variant="h4" component="div">
                        {tiempoServicioPromedio.toFixed(1)} min
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* Tabs para diferentes vistas */}
          <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 3 }}>
            <Tabs value={tabValue} onChange={handleTabChange}>
              <Tab label="Personas Atendidas" />
              <Tab label="Transacciones de Mayor Demanda" />
              <Tab label="Personas No Atendidas" />
            </Tabs>
          </Box>

          {/* Tab 1: Personas Atendidas */}
          {tabValue === 0 && (
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>
                      <strong>Nombre</strong>
                    </TableCell>
                    <TableCell>
                      <strong>Cédula</strong>
                    </TableCell>
                    <TableCell>
                      <strong>Ventanilla</strong>
                    </TableCell>
                    <TableCell>
                      <strong>Transacción</strong>
                    </TableCell>
                    <TableCell align="center">
                      <strong>Hora Llamada</strong>
                    </TableCell>
                    <TableCell align="center">
                      <strong>Hora Atención</strong>
                    </TableCell>
                    <TableCell align="center">
                      <strong>Tiempo Espera</strong>
                    </TableCell>
                    <TableCell align="center">
                      <strong>Tiempo Servicio</strong>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {personasAtendidas
                    .filter((p) => p.estado === "atendida")
                    .map((persona) => (
                      <TableRow key={persona.id} hover>
                        <TableCell>{persona.nombre}</TableCell>
                        <TableCell>{persona.cedula}</TableCell>
                        <TableCell>{persona.ventanilla}</TableCell>
                        <TableCell>{persona.transaccion}</TableCell>
                        <TableCell align="center">{persona.horaLlamada}</TableCell>
                        <TableCell align="center">{persona.horaAtencion}</TableCell>
                        <TableCell align="center">
                          <Chip label={`${persona.tiempoEspera} min`} size="small" color="warning" variant="outlined" />
                        </TableCell>
                        <TableCell align="center">
                          <Chip label={`${persona.tiempoServicio} min`} size="small" color="info" variant="outlined" />
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}

          {/* Tab 2: Transacciones de Mayor Demanda */}
          {tabValue === 1 && (
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>
                      <strong>Transacción</strong>
                    </TableCell>
                    <TableCell align="center">
                      <strong>Cantidad</strong>
                    </TableCell>
                    <TableCell align="center">
                      <strong>Porcentaje</strong>
                    </TableCell>
                    <TableCell align="center">
                      <strong>Demanda</strong>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {transaccionesDemanda.map((transaccion, index) => (
                    <TableRow key={transaccion.transaccion} hover>
                      <TableCell>
                        <strong>{transaccion.transaccion}</strong>
                      </TableCell>
                      <TableCell align="center">
                        <Chip label={transaccion.cantidad} color="primary" variant="outlined" />
                      </TableCell>
                      <TableCell align="center">{transaccion.porcentaje}%</TableCell>
                      <TableCell align="center">
                        <Chip
                          label={index === 0 ? "Muy Alta" : index === 1 ? "Alta" : index === 2 ? "Media" : "Baja"}
                          color={index === 0 ? "error" : index === 1 ? "warning" : index === 2 ? "info" : "default"}
                          variant="filled"
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}

          {/* Tab 3: Personas No Atendidas */}
          {tabValue === 2 && (
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>
                      <strong>Nombre</strong>
                    </TableCell>
                    <TableCell>
                      <strong>Cédula</strong>
                    </TableCell>
                    <TableCell>
                      <strong>Ventanilla</strong>
                    </TableCell>
                    <TableCell>
                      <strong>Transacción</strong>
                    </TableCell>
                    <TableCell align="center">
                      <strong>Hora Llamada</strong>
                    </TableCell>
                    <TableCell align="center">
                      <strong>Tiempo Espera</strong>
                    </TableCell>
                    <TableCell align="center">
                      <strong>Estado</strong>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {personasAtendidas
                    .filter((p) => p.estado === "no_atendida")
                    .map((persona) => (
                      <TableRow key={persona.id} hover>
                        <TableCell>{persona.nombre}</TableCell>
                        <TableCell>{persona.cedula}</TableCell>
                        <TableCell>{persona.ventanilla}</TableCell>
                        <TableCell>{persona.transaccion}</TableCell>
                        <TableCell align="center">{persona.horaLlamada}</TableCell>
                        <TableCell align="center">
                          <Chip
                            label={`${persona.tiempoEspera} min`}
                            size="small"
                            color={persona.tiempoEspera > 20 ? "error" : "warning"}
                            variant="outlined"
                          />
                        </TableCell>
                        <TableCell align="center">
                          <Chip label="No Atendida" size="small" color="error" variant="filled" icon={<Cancel />} />
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              showInfoToast("Generando reporte...", "El reporte PDF se descargará en unos momentos.")
              setTimeout(() => {
                showToast("Reporte descargado", "El reporte de estadísticas ha sido descargado exitosamente.")
              }, 2000)
            }}
            variant="outlined"
            startIcon={<Description />}
          >
            Descargar PDF
          </Button>
          <Button onClick={() => setReportsDialogOpen(false)} variant="contained">
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  )
}
