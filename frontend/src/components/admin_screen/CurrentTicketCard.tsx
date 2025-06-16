"use client"

import {
  Card,
  CardHeader,
  CardContent,
  Typography,
  Box,
  Paper,
  Chip,
  Grid,
  Stack,
  Button,
  Divider,
} from "@mui/material"
import { Monitor, PlayArrow, Refresh, CheckCircle, Cancel, Pause } from "@mui/icons-material"
import type { Ticket } from "../../types/ticket"

interface CurrentTicketCardProps {
  currentTicket: Ticket | null
  isBlinking: boolean
  onCallNext: () => void
  onRecall: () => void
  onMarkAttended: () => void
  onMarkAbsent: () => void
}

export const CurrentTicketCard = ({
  currentTicket,
  isBlinking,
  onCallNext,
  onRecall,
  onMarkAttended,
  onMarkAbsent,
}: CurrentTicketCardProps) => {
  return (
    <Card>
      <CardHeader
        title={
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Monitor />
            <Typography variant="h6">Ticket Actual</Typography>
          </Box>
        }
      />
      <CardContent>
        <Stack spacing={3}>
          {currentTicket ? (
            <Paper
              sx={{
                p: 4,
                textAlign: "center",
                bgcolor: "primary.50",
                border: "1px solid",
                borderColor: "primary.200",
              }}
            >
              <Typography
                variant="h2"
                component="div"
                fontWeight="bold"
                color="primary.main"
                sx={{
                  mb: 2,
                  animation: isBlinking ? "blink 1s infinite" : "none",
                  "@keyframes blink": {
                    "0%, 50%": { opacity: 1 },
                    "51%, 100%": { opacity: 0.3 },
                  },
                }}
              >
                {currentTicket.ticket}
              </Typography>
              <Chip
                label={currentTicket.tipo}
                color="primary"
                sx={{
                  mb: 2,
                  animation: isBlinking ? "blink 1s infinite" : "none",
                }}
              />
              <Typography variant="body1" sx={{ mb: 2 }}>
                {currentTicket.cliente}
              </Typography>
              <Grid container spacing={2}>
                <Grid size={6}>
                  <Typography variant="body2" fontWeight="medium">
                    Hora de generación
                  </Typography>
                  <Typography variant="body2">{currentTicket.horaGeneracion}</Typography>
                </Grid>
                <Grid size={6}>
                  <Typography variant="body2" fontWeight="medium">
                    Tiempo de espera
                  </Typography>
                  <Typography variant="body2" color="warning.main" fontWeight="medium">
                    {currentTicket.tiempoEspera}
                  </Typography>
                </Grid>
              </Grid>
            </Paper>
          ) : (
            <Paper sx={{ p: 4, textAlign: "center", bgcolor: "grey.50" }}>
              <Typography variant="h2" component="div" fontWeight="bold" color="text.disabled" sx={{ mb: 2 }}>
                ---
              </Typography>
              <Chip label="Sin ticket" variant="outlined" sx={{ mb: 2 }} />
              <Typography variant="body1" color="text.secondary" sx={{ mb: 1 }}>
                No hay ticket en atención
              </Typography>
              <Typography variant="body2" color="text.disabled">
                Presione "Llamar Siguiente" para atender un ticket
              </Typography>
            </Paper>
          )}

          {/* Botones de Acción */}
          <Grid container spacing={2}>
            <Grid size={6}>
              <Button
                variant="contained"
                size="large"
                fullWidth
                startIcon={<PlayArrow />}
                onClick={onCallNext}
                sx={{ height: 64 }}
              >
                Llamar Siguiente
              </Button>
            </Grid>
            <Grid size={6}>
              <Button
                variant="outlined"
                size="large"
                fullWidth
                startIcon={<Refresh />}
                onClick={onRecall}
                disabled={!currentTicket}
                sx={{ height: 64 }}
              >
                Re-llamar Actual
              </Button>
            </Grid>
            <Grid size={6}>
              <Button
                variant="contained"
                size="large"
                fullWidth
                startIcon={<CheckCircle />}
                onClick={onMarkAttended}
                disabled={!currentTicket}
                color="success"
                sx={{ height: 64 }}
              >
                Marcar Atendido
              </Button>
            </Grid>
            <Grid size={6}>
              <Button
                variant="contained"
                size="large"
                fullWidth
                startIcon={<Cancel />}
                onClick={onMarkAbsent}
                disabled={!currentTicket}
                color="error"
                sx={{ height: 64 }}
              >
                Marcar Ausente
              </Button>
            </Grid>
          </Grid>

          <Divider />

          {/* Control de Estado */}
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Pause />
              <Typography variant="body2" fontWeight="medium">
                Estado de Ventanilla:
              </Typography>
            </Box>
            <Button variant="outlined" size="small">
              Pausar Atención
            </Button>
          </Box>
        </Stack>
      </CardContent>
    </Card>
  )
}
