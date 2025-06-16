"use client"

import {
  Card,
  CardHeader,
  CardContent,
  Typography,
  Box,
  Stack,
  Chip,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Badge,
  Alert,
} from "@mui/material"
import { TrendingUp, Settings, Notifications } from "@mui/icons-material"
import type { Ticket } from "../../types/ticket"
import type { SelectChangeEvent } from "@mui/material"

interface SidebarCardsProps {
  historialTickets: Ticket[]
  selectedWindow: string
  onWindowChange: (event: SelectChangeEvent) => void
}

export const SidebarCards = ({ historialTickets, selectedWindow, onWindowChange }: SidebarCardsProps) => {
  return (
    <Stack spacing={3}>
      {/* Estadísticas del Día */}
      <Card>
        <CardHeader
          title={
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <TrendingUp />
              <Typography variant="h6">Estadísticas del Día</Typography>
            </Box>
          }
        />
        <CardContent>
          <Stack spacing={2}>
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Typography variant="body2" color="text.secondary">
                Tickets atendidos
              </Typography>
              <Typography variant="h6" fontWeight="bold">
                {historialTickets.filter((t) => t.estado === "Atendido").length}
              </Typography>
            </Box>
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Typography variant="body2" color="text.secondary">
                Tiempo promedio
              </Typography>
              <Typography variant="h6" fontWeight="bold">
                8:32
              </Typography>
            </Box>
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Typography variant="body2" color="text.secondary">
                Ausentes
              </Typography>
              <Typography variant="h6" fontWeight="bold" color="error.main">
                {historialTickets.filter((t) => t.estado === "Ausente").length}
              </Typography>
            </Box>
            <Divider />
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Typography variant="body2" color="text.secondary">
                Eficiencia
              </Typography>
              <Chip label="94%" color="success" size="small" />
            </Box>
          </Stack>
        </CardContent>
      </Card>

      {/* Configuración Rápida */}
      <Card>
        <CardHeader
          title={
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Settings />
              <Typography variant="h6">Configuración Rápida</Typography>
            </Box>
          }
        />
        <CardContent>
          <Stack spacing={3}>
            <FormControl fullWidth>
              <InputLabel>Tipo de Servicio</InputLabel>
              <Select defaultValue="creditos" label="Tipo de Servicio">
                <MenuItem value="creditos">Créditos</MenuItem>
                <MenuItem value="cuentas">Cuentas</MenuItem>
                <MenuItem value="general">Atención General</MenuItem>
                <MenuItem value="todos">Todos los Servicios</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel>Ventanilla</InputLabel>
              <Select value={selectedWindow} onChange={onWindowChange} label="Ventanilla">
                <MenuItem value="01">Ventanilla 01</MenuItem>
                <MenuItem value="02">Ventanilla 02</MenuItem>
                <MenuItem value="03">Ventanilla 03</MenuItem>
                <MenuItem value="04">Ventanilla 04</MenuItem>
                <MenuItem value="05">Ventanilla 05</MenuItem>
                <MenuItem value="06">Ventanilla 06</MenuItem>
              </Select>
            </FormControl>
          </Stack>
        </CardContent>
      </Card>

      {/* Notificaciones */}
      <Card>
        <CardHeader
          title={
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Notifications />
              <Typography variant="h6">Notificaciones</Typography>
              <Badge badgeContent={2} color="error" sx={{ ml: "auto" }} />
            </Box>
          }
        />
        <CardContent>
          <Stack spacing={2}>
            <Alert severity="warning" variant="outlined">
              <Typography variant="body2" fontWeight="medium">
                Sistema
              </Typography>
              <Typography variant="caption">Mantenimiento programado a las 18:00</Typography>
            </Alert>
            <Alert severity="info" variant="outlined">
              <Typography variant="body2" fontWeight="medium">
                Administrador
              </Typography>
              <Typography variant="caption">Nueva política de atención implementada</Typography>
            </Alert>
          </Stack>
        </CardContent>
      </Card>
    </Stack>
  )
}
