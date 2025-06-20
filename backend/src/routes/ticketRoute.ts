import express from "express";
import {
  getTickets,
  getTicketById,
  createTicket,
  updateTicket,
  deleteTicket,
  getQueueTickets,
  getNextTicket,
  finishTicket,
  callAgain,
  markAsAbsent,
  getServiceStats,
} from "../controllers/ticketController";

const router = express.Router();

router.get("/", getTickets);
router.get("/:id", getTicketById);
router.post("/", createTicket);
router.put("/:id", updateTicket);
router.delete("/:id", deleteTicket);
router.post("/queue", getQueueTickets);
router.post("/next", getNextTicket);
router.post("/call-again", callAgain);
router.post("/mark-as-absent", markAsAbsent);
router.post("/finish", finishTicket);
router.get("/:serviceName/stats", getServiceStats);

export default router;
