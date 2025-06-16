import Swal from "sweetalert2"

export const showToast = (title: string, description: string, variant?: "default" | "destructive") => {
  if (variant === "destructive") {
    Swal.fire({
      icon: "error",
      title: title,
      text: description,
      toast: true,
      position: "top-end",
      showConfirmButton: false,
      timer: 4000,
      timerProgressBar: true,
      background: "#fef2f2",
      color: "#dc2626",
      iconColor: "#dc2626",
    })
  } else {
    Swal.fire({
      icon: "success",
      title: title,
      text: description,
      toast: true,
      position: "top-end",
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      background: "#f0fdf4",
      color: "#16a34a",
      iconColor: "#16a34a",
    })
  }
}

export const showInfoToast = (title: string, description: string) => {
  Swal.fire({
    icon: "info",
    title: title,
    text: description,
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 2000,
    timerProgressBar: true,
    background: "#eff6ff",
    color: "#2563eb",
    iconColor: "#2563eb",
  })
}
