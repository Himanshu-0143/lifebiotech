import express from "express";
import Razorpay from "razorpay";
import cors from "cors";
import dotenv from "dotenv";
import crypto from "crypto";
import path from "path";

// Load environment variables from server/.env then project root
dotenv.config();
const parentEnv = path.resolve(process.cwd(), "..", ".env");
dotenv.config({ path: parentEnv });

console.log('Starting Razorpay server...');
console.log('Environment:', {
  hasRazorpayKey: !!process.env.RAZORPAY_KEY_ID,
  requestedPort: process.env.SERVER_PORT || 4242
});

const app = express();
app.use(cors());
app.use(express.json());

const port = process.env.SERVER_PORT || 4242;

if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
  console.error("Missing Razorpay credentials in environment. Exiting.");
  process.exit(1);
}

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Simple health check
app.get("/health", (req, res) => res.json({ status: "ok" }));

// Create Razorpay Order
app.post("/create-order", async (req, res) => {
  try {
    const { amount, receipt, notes } = req.body;

    if (!amount || typeof amount !== "number") {
      return res.status(400).json({ error: "Invalid amount" });
    }

    const order = await razorpay.orders.create({
      amount: Math.round(amount * 100), // Convert to paise
      currency: "INR",
      receipt: receipt,
      notes: notes,
    });

    res.json({
      orderId: order.id,
      currency: order.currency,
      amount: order.amount,
    });
  } catch (error) {
    console.error("Order creation failed:", error);
    res.status(500).json({
      error: error instanceof Error ? error.message : "Order creation failed",
    });
  }
});

// Verify Razorpay Payment
app.post("/verify-payment", async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = req.body;

    const text = razorpay_order_id + "|" + razorpay_payment_id;
    const signature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(text)
      .digest("hex");

    const isValid = signature === razorpay_signature;

    if (isValid) {
      res.json({ verified: true });
    } else {
      res.status(400).json({ verified: false, error: "Invalid signature" });
    }
  } catch (error) {
    console.error("Payment verification failed:", error);
    res.status(500).json({
      error: error instanceof Error ? error.message : "Payment verification failed",
    });
  }
});

// Start server
app.listen(port, () => {
  console.log(`Razorpay server listening on http://localhost:${port}`);
});
