import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RazorpayService } from '../services/razorpay.service';
import { Auth, user } from '@angular/fire/auth';
import { Firestore, collection, addDoc, Timestamp } from '@angular/fire/firestore';

@Component({
  selector: 'app-donate',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './donate.html',
  styleUrls: ['./donate.css']
})
export class Donate {
  private razorpayService = inject(RazorpayService);
  private auth = inject(Auth);
  private firestore = inject(Firestore);

  user$ = user(this.auth);

  // Predefined amounts
  amounts = [50, 100, 200, 500, 1000];
  customAmount: number | null = null;
  selectedAmount: number | null = null;
  
  loading = false;
  message = '';
  messageType: 'success' | 'error' | '' = '';

  selectAmount(amount: number) {
    this.selectedAmount = amount;
    this.customAmount = null;
  }

  useCustomAmount() {
    if (this.customAmount && this.customAmount > 0) {
      this.selectedAmount = this.customAmount;
    }
  }

  async donate() {
    const amount = this.selectedAmount;
    
    if (!amount || amount <= 0) {
      this.showMessage('Please select or enter an amount', 'error');
      return;
    }

    if (amount < 10) {
      this.showMessage('Minimum donation amount is ₹10', 'error');
      return;
    }

    this.loading = true;
    this.message = '';

    try {
      const currentUser = await new Promise((resolve) => {
        user(this.auth).subscribe(u => resolve(u));
      });

      const result = await this.razorpayService.openDonationModal({
        amount: amount,
        name: (currentUser as any)?.displayName || 'Chess Enthusiast',
        email: (currentUser as any)?.email || '',
        notes: {
          purpose: 'donation',
          userId: (currentUser as any)?.uid || 'anonymous'
        }
      });

      // Payment successful - save to Firestore
      await this.saveDonation({
        userId: (currentUser as any)?.uid || 'anonymous',
        userName: (currentUser as any)?.displayName || 'Anonymous',
        userEmail: (currentUser as any)?.email || '',
        amount: amount,
        paymentId: result.paymentId,
        timestamp: Timestamp.now()
      });

      this.showMessage(`Thank you for your ₹${amount} donation! 🎉`, 'success');
      this.selectedAmount = null;
      this.customAmount = null;
    } catch (error: any) {
      console.error('Donation error:', error);
      if (error.message !== 'Payment cancelled by user') {
        this.showMessage('Payment failed. Please try again.', 'error');
      }
    } finally {
      this.loading = false;
    }
  }

  private async saveDonation(donation: any) {
    try {
      await addDoc(collection(this.firestore, 'donations'), donation);
    } catch (error) {
      console.error('Error saving donation:', error);
    }
  }

  private showMessage(msg: string, type: 'success' | 'error') {
    this.message = msg;
    this.messageType = type;
    setTimeout(() => {
      this.message = '';
      this.messageType = '';
    }, 5000);
  }
}
