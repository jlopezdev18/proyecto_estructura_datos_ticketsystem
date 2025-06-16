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
  type SelectChangeEvent,
} from "@mui/material"
import Grid from "@mui/material/Grid"
import { Settings, Logout, Description, PersonAdd, PersonAddAlt1 } from "@mui/icons-material"

import { WINDOW_OPERATORS } from "../../constants/mockData"
import { useTicketManagement } from "../../hooks/useTicketManagment"
import { showToast, showInfoToast } from "../../utils/notifications"
import { CurrentTicketCard } from "../admin_screen/CurrentTicketCard"
import { TicketQueueCard } from "../admin_screen/TicketQueueCard"
import { SidebarCards } from "../admin_screen/SidebarCards"

export default function AdminInterface() {
  const [selectedWindow, setSelectedWindow] = useState("03")
  const [windowOperator, setWindowOperator] = useState("María González")
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [clientDialogOpen, setClientDialogOpen] = useState(false)
  const [employeeDialogOpen, setEmployeeDialogOpen] = useState(false)
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false)

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

  const generatePDFReport = () => {
    handleMenuClose()
    showInfoToast("Generando reporte...", "El reporte PDF se descargará en unos momentos.")

    setTimeout(() => {
      showToast("Reporte descargado", "El reporte de tickets del día ha sido descargado exitosamente.")
    }, 2000)
  }

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
                <Description sx={{ mr: 1 }} />
                Reportes
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
                  setEmployeeDialogOpen(true)
                }}
              >
                <PersonAddAlt1 sx={{ mr: 1 }} />
                Nuevo Empleado
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
    </Container>
  )
}
