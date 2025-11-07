declare global {
  interface Window {
    Razorpay: any;
  }
}

interface PaymentMetadata {
  order_id: string;
  user_id?: string;
  shipping_address?: string;
}

export interface PaymentOptions {
  amount: number;
  metadata: PaymentMetadata;
  onSuccess?: (response: any) => void;
  onError?: (error: any) => void;
}

const loadRazorpay = (): Promise<boolean> => {
  return new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

export async function createPaymentSession({ 
  amount, 
  metadata,
  onSuccess,
  onError
}: PaymentOptions) {
  try {
    // 1. Load Razorpay SDK
    const isLoaded = await loadRazorpay();
    if (!isLoaded) {
      throw new Error('Razorpay SDK failed to load');
    }

    // 2. Create order on server
    // Prefer an explicit VITE_API_URL, otherwise use a relative path so serverless
    // functions (e.g. Vercel /api routes) work without extra config.
    const API_BASE = import.meta.env.VITE_API_URL ?? '';
    const base = API_BASE ? API_BASE.replace(/\/$/, '') : '';
    const createOrderUrl = `${base}/api/create-order`;

    console.log('Creating order via:', createOrderUrl);

    const response = await fetch(createOrderUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount,
        receipt: metadata.order_id,
        notes: metadata
      }),
    });

    if (!response.ok) {
      // Try to extract server error message (if JSON)
      let errMsg = `Create order failed with status ${response.status}`;
      try {
        const body = await response.json();
        if (body?.message) errMsg = body.message;
        else if (body?.error) errMsg = body.error;
        else errMsg = JSON.stringify(body);
      } catch (e) {
        // Could not parse JSON (network error or empty body)
        console.error('Create order non-JSON response or network error', e);
      }
      throw new Error(errMsg);
    }

    const body = await response.json();
    const { orderId, currency } = body;

    // 3. Initialize Razorpay checkout
    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: Math.round(amount * 100), // paise
      currency: currency || 'INR',
      name: 'Life Biotech',
      description: 'Purchase from Life Biotech',
      order_id: orderId,
      handler: async function (resp: any) {
        // Verify payment on success
        const verifyUrl = `${API_BASE.replace(/\/$/, '')}/verify-payment`;
        const verifyResponse = await fetch(verifyUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            razorpay_order_id: resp.razorpay_order_id,
            razorpay_payment_id: resp.razorpay_payment_id,
            razorpay_signature: resp.razorpay_signature,
          }),
        });

        const verifyResult = await verifyResponse.json();
        
        if (verifyResult.verified) {
          onSuccess?.(resp);
        } else {
          onError?.(new Error('Payment verification failed'));
        }
      },
      prefill: {
        name: '',
        email: '',
        contact: ''
      },
      notes: metadata,
      theme: {
        color: '#2563eb'
      }
    };

    const razorpay = new window.Razorpay(options);
    razorpay.open();

    return { error: null };
  } catch (error) {
    console.error('Payment creation failed:', error);
    onError?.(error instanceof Error ? error : new Error('Payment session creation failed'));
    return {
      error: error instanceof Error ? error : new Error('Payment session creation failed')
    };
  }
}