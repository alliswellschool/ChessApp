import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

declare var Razorpay: any;

export interface DonationOptions {
  amount: number; // in rupees (will convert to paise)
  name?: string;
  email?: string;
  phone?: string;
  notes?: any;
}

@Injectable({
  providedIn: 'root'
})
export class RazorpayService {
  private razorpayKey = environment.razorpay.keyId;

  constructor() {
    this.loadRazorpayScript();
  }

  private loadRazorpayScript(): Promise<void> {
    return new Promise((resolve) => {
      if (typeof Razorpay !== 'undefined') {
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve();
      document.body.appendChild(script);
    });
  }

  async openDonationModal(options: DonationOptions): Promise<any> {
    await this.loadRazorpayScript();

    return new Promise((resolve, reject) => {
      const razorpayOptions = {
        key: this.razorpayKey,
        amount: options.amount * 100, // Convert rupees to paise
        currency: 'INR',
        name: 'Chess Activities',
        description: 'Support our chess training platform',
        image: '/assets/logo.png', // Your logo
        prefill: {
          name: options.name || '',
          email: options.email || '',
          contact: options.phone || ''
        },
        notes: options.notes || {},
        theme: {
          color: '#667eea' // Your brand color
        },
        handler: (response: any) => {
          // Payment successful
          resolve({
            success: true,
            paymentId: response.razorpay_payment_id,
            orderId: response.razorpay_order_id,
            signature: response.razorpay_signature
          });
        },
        modal: {
          ondismiss: () => {
            // User closed the payment modal
            reject(new Error('Payment cancelled by user'));
          },
          escape: true,
          backdropclose: true
        }
      };

      const razorpay = new Razorpay(razorpayOptions);
      
      // Handle payment failure
      razorpay.on('payment.failed', function (response: any) {
        reject(new Error('Payment failed: ' + response.error.description));
      });
      
      razorpay.open();
    });
  }

  // Optional: Verify payment on backend (recommended for production)
  async verifyPayment(paymentId: string, orderId: string, signature: string): Promise<boolean> {
    // TODO: Call your Firebase Function to verify signature
    // This prevents payment fraud
    return true;
  }
}
