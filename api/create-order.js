const Razorpay = require('razorpay');

module.exports = async (req, res) => {
  try {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

    const { amount, receipt, notes } = req.body || {};

    if (!amount || typeof amount !== 'number') {
      return res.status(400).json({ error: 'Invalid amount' });
    }

    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
      console.error('Missing Razorpay credentials in environment');
      return res.status(500).json({ error: 'Payment provider not configured' });
    }

    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    const order = await razorpay.orders.create({
      amount: Math.round(amount * 100),
      currency: 'INR',
      receipt: receipt,
      notes: notes,
    });

    return res.status(200).json({ orderId: order.id, currency: order.currency, amount: order.amount });
  } catch (err) {
    console.error('create-order error:', err);
    return res.status(500).json({ error: err instanceof Error ? err.message : 'Order creation failed' });
  }
};
