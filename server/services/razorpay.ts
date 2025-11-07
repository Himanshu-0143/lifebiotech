import Razorpay from 'razorpay';

interface CreateOrderOptions {
  amount: number;
  currency?: string;
  receipt?: string;
  notes?: Record<string, string>;
}

export interface RazorpayOrderResponse {
  id: string;
  entity: string;
  amount: number;
  amount_paid: number;
  amount_due: number;
  currency: string;
  receipt: string;
  status: string;
  created_at: number;
}

const razorpay = new Razorpay({
  key_id: process.env.VITE_RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export async function createOrder(options: CreateOrderOptions): Promise<RazorpayOrderResponse> {
  const order = await razorpay.orders.create({
    amount: Math.round(options.amount * 100), // Convert to paise
    currency: options.currency || 'INR',
    receipt: options.receipt,
    notes: options.notes,
  });

  return order;
}

export async function verifyPayment(
  razorpay_order_id: string,
  razorpay_payment_id: string,
  razorpay_signature: string
): Promise<boolean> {
  const text = razorpay_order_id + '|' + razorpay_payment_id;
  const crypto = require('crypto');
  const signature = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
    .update(text)
    .digest('hex');

  return signature === razorpay_signature;
}