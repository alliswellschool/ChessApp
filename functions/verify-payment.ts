// Cloudflare Worker for Razorpay Payment Verification
// Deploy this as a Cloudflare Worker to verify payments securely

import crypto from 'crypto';

interface Env {
  RAZORPAY_SECRET: string;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    // Only allow POST requests
    if (request.method !== 'POST') {
      return new Response('Method not allowed', { status: 405 });
    }

    try {
      const { paymentId, orderId, signature } = await request.json();

      // Verify signature using Razorpay secret (stored in Cloudflare env vars)
      const expectedSignature = crypto
        .createHmac('sha256', env.RAZORPAY_SECRET)
        .update(`${orderId}|${paymentId}`)
        .digest('hex');

      const isValid = expectedSignature === signature;

      return new Response(
        JSON.stringify({ 
          verified: isValid,
          message: isValid ? 'Payment verified successfully' : 'Invalid signature'
        }),
        {
          headers: { 'Content-Type': 'application/json' },
          status: isValid ? 200 : 400
        }
      );
    } catch (error) {
      return new Response(
        JSON.stringify({ error: 'Verification failed' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }
  }
};
