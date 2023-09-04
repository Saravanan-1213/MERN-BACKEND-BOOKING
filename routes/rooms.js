import express from "express";
import {
  createRoom,
  deleteRoom,
  getRoom,
  getRooms,
  updateRoom,
  updateRoomAvailability,
} from "../controllers/room.js";
import { verifyToken } from "../utils/verifyToken.js";

const router = express.Router();

// CREATE
router.post("/:hotelid", verifyToken, createRoom);

//UPDATE
router.put("/:id", verifyToken, updateRoom);
router.put("/availability/:id", verifyToken, updateRoomAvailability);

//DELETE
router.delete("/:id/:hotelid", verifyToken, deleteRoom);

//GET
router.get("/:id", verifyToken, getRoom);

//GET ALL
router.get("/", verifyToken, getRooms);

export default router;
