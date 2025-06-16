import { Chip } from "@mui/material"
import { Person, Favorite, Accessible } from "@mui/icons-material"

interface PriorityChipProps {
  priority: string | null
}

export const PriorityChip = ({ priority }: PriorityChipProps) => {
  switch (priority) {
    case "tercera-edad":
      return <Chip icon={<Person />} label="Tercera Edad" size="small" sx={{ bgcolor: "#f3e5f5", color: "#7b1fa2" }} />
    case "embarazada":
      return <Chip icon={<Favorite />} label="Embarazada" size="small" sx={{ bgcolor: "#fce4ec", color: "#c2185b" }} />
    case "discapacitado":
      return (
        <Chip icon={<Accessible />} label="Discapacitado" size="small" sx={{ bgcolor: "#e3f2fd", color: "#1976d2" }} />
      )
    default:
      return <Chip label="Normal" size="small" variant="outlined" />
  }
}
