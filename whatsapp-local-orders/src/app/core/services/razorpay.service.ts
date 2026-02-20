import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { environment } from '../../../environments/environment';
import { RazorpayPaymentLink } from '../models/payment.model';
import { Order } from '../models/order.model';

@Injectable({
  providedIn: 'root'
})
export class RazorpayService {
  private readonly API_URL = 'https://api.razorpay.com/v1';

  constructor(private http: HttpClient) {}

  /**
   * Create a Razorpay Payment Link
   * Note: This should be called from a backend Cloud Function for security
   * The key_secret should NEVER be exposed in frontend code
   */
  createPaymentLink(order: Order): Observable<RazorpayPaymentLink> {
    // TODO: Implement this via Firebase Cloud Function
    // This is a mock implementation
    console.log('Creating payment link for order:', order);
    
    const mockLink: RazorpayPaymentLink = {
      id: 'plink_' + Date.now(),
      amount: order.total * 100, // Amount in paise
      currency: 'INR',
      accept_partial: false,
      description: `Order #${order.orderNumber || order.id}`,
      customer: {
        name: order.customerName,
        contact: order.phone
      },
      notify: {
        sms: true,
        email: false,
        whatsapp: true
      },
      reminder_enable: true,
      callback_url: `${window.location.origin}/payment-callback`,
      callback_method: 'get',
      created_at: Date.now() / 1000,
      short_url: `https://rzp.io/l/${Date.now()}`,
      status: 'created',
      user_id: environment.razorpay.keyId
    };

    return of(mockLink);
  }

  /**
   * Fetch payment link details
   * Note: Should be called from backend
   */
  getPaymentLinkDetails(linkId: string): Observable<RazorpayPaymentLink> {
    // TODO: Implement via Cloud Function
    console.log('Fetching payment link:', linkId);
    return of({} as RazorpayPaymentLink);
  }

  /**
   * Cancel a payment link
   * Note: Should be called from backend
   */
  cancelPaymentLink(linkId: string): Observable<any> {
    // TODO: Implement via Cloud Function
    console.log('Cancelling payment link:', linkId);
    return of({ success: true });
  }

  /**
   * Send payment link via WhatsApp
   * Razorpay automatically sends if notify.whatsapp is true
   */
  sendPaymentLinkViaWhatsApp(paymentLink: RazorpayPaymentLink): void {
    console.log('Payment link will be sent via WhatsApp:', paymentLink.short_url);
  }

  /**
   * Generate invoice for paid order
   */
  generateInvoice(order: Order): Observable<Blob> {
    // TODO: Implement invoice generation (PDF)
    console.log('Generating invoice for order:', order);
    return of(new Blob());
  }

  /**
   * Verify payment signature (webhook)
   * Note: Must be done on backend for security
   */
  verifyPaymentSignature(paymentId: string, signature: string): boolean {
    // TODO: Implement on backend
    console.log('Verifying payment signature:', paymentId);
    return true;
  }
}

// Backend Cloud Function Example (for reference)
/*
import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import Razorpay from 'razorpay';

const razorpay = new Razorpay({
  key_id: functions.config().razorpay.key_id,
  key_secret: functions.config().razorpay.key_secret
});

export const createPaymentLink = functions.https.onCall(async (data, context) => {
  // Verify authentication
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
  }

  const { orderId, amount, customerName, customerPhone } = data;

  try {
    const paymentLink = await razorpay.paymentLink.create({
      amount: amount * 100, // Amount in paise
      currency: 'INR',
      accept_partial: false,
      description: `Order #${orderId}`,
      customer: {
        name: customerName,
        contact: customerPhone
      },
      notify: {
        sms: true,
        email: false,
        whatsapp: true
      },
      reminder_enable: true,
      callback_url: `https://yourdomain.com/payment-callback`,
      callback_method: 'get'
    });

    // Save to Firestore
    await admin.firestore().collection('payments').doc(paymentLink.id).set({
      orderId,
      linkId: paymentLink.id,
      amount,
      status: 'created',
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    });

    return paymentLink;
  } catch (error) {
    throw new functions.https.HttpsError('internal', 'Failed to create payment link');
  }
});

// Webhook handler
export const razorpayWebhook = functions.https.onRequest(async (req, res) => {
  const signature = req.headers['x-razorpay-signature'];
  const body = JSON.stringify(req.body);

  // Verify signature
  const crypto = require('crypto');
  const expectedSignature = crypto
    .createHmac('sha256', functions.config().razorpay.webhook_secret)
    .update(body)
    .digest('hex');

  if (signature !== expectedSignature) {
    res.status(400).send('Invalid signature');
    return;
  }

  const event = req.body.event;
  const paymentLink = req.body.payload.payment_link.entity;

  if (event === 'payment_link.paid') {
    // Update order status
    const paymentsSnapshot = await admin.firestore()
      .collection('payments')
      .where('linkId', '==', paymentLink.id)
      .get();

    if (!paymentsSnapshot.empty) {
      const paymentDoc = paymentsSnapshot.docs[0];
      const orderId = paymentDoc.data().orderId;

      await admin.firestore().collection('orders').doc(orderId).update({
        paymentStatus: 'paid',
        paidAt: admin.firestore.FieldValue.serverTimestamp()
      });

      await paymentDoc.ref.update({
        status: 'paid',
        paidAt: admin.firestore.FieldValue.serverTimestamp(),
        webhookPayload: req.body
      });
    }
  }

  res.status(200).send('OK');
});
*/
