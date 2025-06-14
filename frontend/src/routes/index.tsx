import { createFileRoute } from "@tanstack/react-router";
import { io } from "socket.io-client";
import { Button } from "@mui/material";

export const Route = createFileRoute("/")({
  component: RouteComponent,
});

function RouteComponent() {
  const socket = io("http://localhost:3000", {
    transports: ["websocket"],
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
  });
  socket.on("connect", () => {
    console.log("Connected to socket server with ID:", socket.id);
  });

  return (
    <div>
      <h1>Welcome to the Ticketing System</h1>
      <Button variant="contained">Hello world</Button>
    </div>
  );
}
