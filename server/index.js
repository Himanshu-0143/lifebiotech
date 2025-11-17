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

// Send OTP Email via Resend
app.post("/send-otp-email", async (req, res) => {
  try {
    const { email, otp } = req.body;
    console.log('Received OTP request:', { email, otp });

    if (!email || !otp) {
      return res.status(400).json({ error: "Email and OTP are required" });
    }

    const RESEND_API_KEY = process.env.RESEND_API_KEY;
    console.log('API Key status:', { 
      exists: !!RESEND_API_KEY, 
      length: RESEND_API_KEY?.length,
      firstChars: RESEND_API_KEY?.substring(0, 10)
    });
    
    if (!RESEND_API_KEY) {
      console.error('Resend API key not found');
      return res.status(500).json({ error: "Email service not configured" });
    }

    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Life Biotech <noreply@lifebiotech.in>',
        to: email,
        subject: 'Verify Your Email - Life Biotech',
        html: `
          <!DOCTYPE html>
          <html>
            <head>
              <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background: linear-gradient(135deg, #1b7bbf, #36b37e); padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
                .header h1 { color: white; margin: 0; }
                .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
                .otp-box { background: white; border: 2px solid #1b7bbf; border-radius: 10px; padding: 20px; text-align: center; margin: 20px 0; }
                .otp-code { font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #1b7bbf; }
                .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
              </style>
            </head>
            <body>
              <div class="container">
                <div class="header">
                  <h1>🔐 Email Verification</h1>
                </div>
                <div class="content">
                  <h2>Welcome to Life Biotech!</h2>
                  <p>Thank you for signing up. Please use the following OTP to verify your email address:</p>
                  
                  <div class="otp-box">
                    <p style="margin: 0; color: #666;">Your verification code is:</p>
                    <div class="otp-code">${otp}</div>
                  </div>
                  
                  <p><strong>This code will expire in 10 minutes.</strong></p>
                  <p>If you didn't request this code, please ignore this email.</p>
                  
                  <div class="footer">
                    <p>© ${new Date().getFullYear()} Life Biotech. All rights reserved.</p>
                  </div>
                </div>
              </div>
            </body>
          </html>
        `,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Resend API full error:', {
        status: response.status,
        statusText: response.statusText,
        errorData
      });
      return res.status(response.status).json({ 
        error: errorData.message || 'Failed to send email',
        details: errorData 
      });
    }

    const result = await response.json();
    console.log('Email sent successfully:', result);
    res.json({ success: true, messageId: result.id });
  } catch (error) {
    console.error("Email sending failed:", error);
    res.status(500).json({
      error: error instanceof Error ? error.message : "Email sending failed",
    });
  }
});

// Create Razorpay Order
app.post("/api/create-order", async (req, res) => {
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
app.post("/api/verify-payment", async (req, res) => {
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
