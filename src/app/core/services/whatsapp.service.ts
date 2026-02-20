import { Injectable } from '@angular/core';
import { CartItem } from '../models/product.model';
import { CustomerInfo } from '../models/order.model';
import { Shop } from '../models/shop.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class WhatsAppService {
  
  /**
   * Generate WhatsApp Click-to-Chat URL with pre-filled order message
   * Uses wa.me API with E.164 phone format (no +, spaces, or dashes)
   * @param shop Shop information (contains WhatsApp number)
   * @param cartItems Array of cart items
   * @param customerInfo Customer details
   * @param language 'en' or 'ta'
   */
  generateOrderLink(
    shop: Shop,
    cartItems: CartItem[],
    customerInfo: CustomerInfo,
    language: 'en' | 'ta' = 'ta'
  ): string {
    const message = this.buildOrderMessage(shop, cartItems, customerInfo, language);
    const encodedMessage = encodeURIComponent(message);
    return `https://wa.me/${shop.phoneE164}?text=${encodedMessage}`;
  }

  /**
   * Build formatted order message for WhatsApp
   */
  private buildOrderMessage(
    shop: Shop,
    cartItems: CartItem[],
    customerInfo: CustomerInfo,
    language: 'en' | 'ta'
  ): string {
    const greeting = language === 'ta' 
      ? `வணக்கம்! நான் ${shop.name}-இல் ஆர்டர் செய்ய விரும்புகிறேன்:`
      : `Hello! I want to place an order from ${shop.name}:`;
    
    const itemsHeader = language === 'ta' ? '\n\n*பொருட்கள்:*' : '\n\n*Items:*';
    
    let message = greeting + itemsHeader;
    
    // Add each cart item
    cartItems.forEach((item, index) => {
      const itemName = language === 'ta' && item.nameTA ? item.nameTA : item.name;
      const unit = language === 'ta' && item.unitTA ? item.unitTA : item.unit;
      message += `\n${index + 1}. ${item.quantity} ${unit} - ${itemName} - ₹${item.totalPrice}`;
      
      // Add selected options if any
      if (item.selectedOptions && Object.keys(item.selectedOptions).length > 0) {
        Object.entries(item.selectedOptions).forEach(([key, value]) => {
          message += `\n   └ ${key}: ${value}`;
        });
      }
    });
    
    // Add total
    const total = cartItems.reduce((sum, item) => sum + item.totalPrice, 0);
    const totalLabel = language === 'ta' ? '\n\n*மொத்தம்:*' : '\n\n*Total:*';
    message += `${totalLabel} ₹${total}`;
    
    // Add customer details
    const detailsHeader = language === 'ta' ? '\n\n*விவரங்கள்:*' : '\n\n*Details:*';
    message += detailsHeader;
    message += `\n${language === 'ta' ? 'பெயர்' : 'Name'}: ${customerInfo.name}`;
    message += `\n${language === 'ta' ? 'தொலைபேசி' : 'Phone'}: ${customerInfo.phone}`;
    message += `\n${language === 'ta' ? 'முகவரி' : 'Address'}: ${customerInfo.address}`;
    
    if (customerInfo.landmark) {
      message += `\n${language === 'ta' ? 'அடையாளம்' : 'Landmark'}: ${customerInfo.landmark}`;
    }
    
    if (customerInfo.preferredTime) {
      message += `\n${language === 'ta' ? 'விருப்ப நேரம்' : 'Preferred Time'}: ${customerInfo.preferredTime}`;
    }
    
    if (customerInfo.notes) {
      message += `\n${language === 'ta' ? 'குறிப்புகள்' : 'Notes'}: ${customerInfo.notes}`;
    }
    
    const footer = language === 'ta'
      ? '\n\nதயவுசெய்து ஆர்டரை உறுதிப்படுத்தவும்.'
      : '\n\nPlease confirm the order.';
    
    message += footer;
    
    return message;
  }

  /**
   * Open WhatsApp chat in new window
   */
  openWhatsAppChat(url: string): void {
    window.open(url, '_blank', 'noopener,noreferrer');
  }

  /**
   * Validate E.164 phone number format
   */
  validatePhoneNumber(phone: string): boolean {
    // E.164 format: Country code + number (e.g., 918220762702)
    const e164Regex = /^\d{10,15}$/;
    return e164Regex.test(phone);
  }

  /**
   * Format phone number to E.164 (remove +, spaces, dashes)
   */
  formatToE164(phone: string): string {
    return phone.replace(/[\s\-\+\(\)]/g, '');
  }
}
