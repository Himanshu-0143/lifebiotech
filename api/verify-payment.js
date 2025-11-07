import crypto from 'crypto';

export default async function handler(req, res) {
  try {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body || {};

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ error: 'Missing parameters' });
    }

    if (!process.env.RAZORPAY_KEY_SECRET) {
      console.error('Missing Razorpay secret in environment');
      return res.status(500).json({ error: 'Payment provider not configured' });
    }

    const text = razorpay_order_id + '|' + razorpay_payment_id;
    const signature = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET).update(text).digest('hex');

    const isValid = signature === razorpay_signature;

    if (isValid) {
      return res.status(200).json({ verified: true });
    }

    return res.status(400).json({ verified: false, error: 'Invalid signature' });
  } catch (err) {
    console.error('verify-payment error:', err);
    return res.status(500).json({ error: err instanceof Error ? err.message : 'Payment verification failed' });
  }
}
