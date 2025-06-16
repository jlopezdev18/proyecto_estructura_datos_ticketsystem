"use client"

import {
  Card,
  CardHeader,
  CardContent,
  Typography,
  Box,
  Paper,
  Chip,
  Stack,
  Button,
  Divider,
  Grid,
} from "@mui/material"
import { Queue as QueueIcon, PlayArrow, Star, Person, Favorite, Accessible } from "@mui/icons-material"
import type { Ticket } from "../../types/ticket"
import { PriorityChip } from "./PriorityChip"
import { calculatePriorityCounts } from "../../utils/ticketUtils"

interface TicketQueueCardProps {
  tickets: Ticket[]
  onCallTicket: (ticketNumber: string, clientName: string, priority: string | null) => void
}

export const TicketQueueCard = ({ tickets, onCallTicket }: TicketQueueCardProps) => {
  const priorityCounts = calculatePriorityCounts(tickets)

  return (
    <Card>
      <CardHeader
        title={
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <QueueIcon />
            <Typography variant="h6">Tickets en Espera</Typography>
            <Chip label={`${tickets.length} en Cola`} variant="outlined" sx={{ ml: "auto" }} />
          </Box>
        }
        subheader="Primeros 10 tickets en espera - Los tickets prioritarios se destacan"
      />
      <CardContent>
        <Stack spacing={2}>
          {tickets.map((ticket, index) => (
            <Paper
              key={index}
              sx={{
                p: 2,
                border: "1px solid",
                borderColor: ticket.prioridad ? "warning.main" : "grey.300",
                bgcolor: ticket.prioridad ? "warning.50" : "background.paper",
              }}
            >
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Typography variant="h6" component="span" fontFamily="monospace" fontWeight="bold">
                      {ticket.ticket}
                    </Typography>
                    {ticket.prioridad && <Star color="warning" />}
                  </Box>
                  <Box>
                    <Stack direction="row" spacing={1} sx={{ mb: 1 }}>
                      <Chip label={ticket.tipo} variant="outlined" size="small" />
                      <PriorityChip priority={ticket.prioridad} />
                    </Stack>
                    <Typography variant="body2" color="text.secondary">
                      {ticket.cliente}
                    </Typography>
                  </Box>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <Box sx={{ textAlign: "right" }}>
                    <Typography variant="caption" color="text.secondary">
                      Generado: {ticket.horaGeneracion}
                    </Typography>
                    <Typography variant="body2" fontWeight="medium" color="warning.main">
                      Esperando: {ticket.tiempoEspera}
                    </Typography>
                  </Box>
                  <Button
                    variant={ticket.prioridad ? "contained" : "outlined"}
                    size="small"
                    startIcon={<PlayArrow />}
                    color={ticket.prioridad ? "warning" : "primary"}
                    onClick={() => onCallTicket(ticket.ticket, ticket.cliente, ticket.prioridad)}
                  >
                    Llamar
                  </Button>
                </Box>
              </Box>
            </Paper>
          ))}
        </Stack>

        <Divider sx={{ my: 3 }} />

        {/* Resumen de prioridades */}
        <Grid container spacing={2}>
          <Grid size={3}>
            <Paper sx={{ p: 2, textAlign: "center", bgcolor: "purple.50" }}>
              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 0.5, mb: 1 }}>
                <Person sx={{ color: "purple.600" }} />
                <Typography variant="caption" fontWeight="medium" sx={{ color: "purple.700" }}>
                  Tercera Edad
                </Typography>
              </Box>
              <Typography variant="h5" fontWeight="bold" sx={{ color: "purple.600" }}>
                {priorityCounts["tercera-edad"]}
              </Typography>
            </Paper>
          </Grid>
          <Grid size={3}>
            <Paper sx={{ p: 2, textAlign: "center", bgcolor: "pink.50" }}>
              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 0.5, mb: 1 }}>
                <Favorite sx={{ color: "pink.600" }} />
                <Typography variant="caption" fontWeight="medium" sx={{ color: "pink.700" }}>
                  Embarazadas
                </Typography>
              </Box>
              <Typography variant="h5" fontWeight="bold" sx={{ color: "pink.600" }}>
                {priorityCounts.embarazada}
              </Typography>
            </Paper>
          </Grid>
          <Grid size={3}>
            <Paper sx={{ p: 2, textAlign: "center", bgcolor: "blue.50" }}>
              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 0.5, mb: 1 }}>
                <Accessible sx={{ color: "blue.600" }} />
                <Typography variant="caption" fontWeight="medium" sx={{ color: "blue.700" }}>
                  Discapacitados
                </Typography>
              </Box>
              <Typography variant="h5" fontWeight="bold" sx={{ color: "blue.600" }}>
                {priorityCounts.discapacitado}
              </Typography>
            </Paper>
          </Grid>
          <Grid size={3}>
            <Paper sx={{ p: 2, textAlign: "center", bgcolor: "grey.50" }}>
              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 0.5, mb: 1 }}>
                <QueueIcon sx={{ color: "grey.600" }} />
                <Typography variant="caption" fontWeight="medium" sx={{ color: "grey.700" }}>
                  Normales
                </Typography>
              </Box>
              <Typography variant="h5" fontWeight="bold" sx={{ color: "grey.600" }}>
                {priorityCounts.normal}
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  )
}
