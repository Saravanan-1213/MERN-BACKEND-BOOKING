import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import hotelsRoute from "./routes/hotels.js";
import roomsRoute from "./routes/rooms.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import authRoute from "./routes/auth.js";
import usersRoute from "./routes/users.js";
import Stripe from "stripe";
import { uuid } from "uuidv4";
const app = express();
dotenv.config();
const PORT = process.env.PORT;

// Middlewares

app.use(cors());
app.use(cookieParser());
app.use(express.json());

app.use("/auth/api", authRoute);
app.use("/api/users", usersRoute);
app.use("/api/hotels", hotelsRoute);
app.use("/api/rooms", roomsRoute);

// Payment gateway
const stripe = new Stripe(process.env.STRIPE_KEY);

app.post("/payments", async (request, response) => {
  const { token, subtotal, currentUser, cartItems } = request.body;

  try {
    const customer = await stripe.customers.create({
      email: token.email,
      source: token.id,
    });

    const payment = await stripe.charges.create(
      {
        amount: subtotal * 100,
        currency: "inr",
        customer: customer.id,
        receipt_email: token.email,
      },
      {
        idempotencyKey: uuid(),
      }
    );

    if (payment) {
      response.send("payment Done");
    } else {
      response.send("payment Failed");
    }
  } catch (error) {
    return response.status(400).json({ message: "something went wrong" });
  }
});

const connect = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("Connected to mongoDB.");
  } catch (error) {
    throw error;
  }
};
app.listen(PORT, () => {
  connect();
  console.log("Connected to backend.", PORT);
});
