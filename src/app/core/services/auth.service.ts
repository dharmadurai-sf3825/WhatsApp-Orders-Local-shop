import { Injectable, inject } from '@angular/core';
import { Auth, authState, User } from '@angular/fire/auth';
import { Firestore, doc, getDoc, setDoc, collection, query, where, getDocs, updateDoc } from '@angular/fire/firestore';
import { Observable, from, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { SellerUser, ShopOwnership } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private auth = inject(Auth);
  private firestore = inject(Firestore);

  // Observable of current user
  user$ = authState(this.auth);

  constructor() {}

  /**
   * Check if the current authenticated user has access to a specific shop
   */
  async canAccessShop(shopSlug: string): Promise<boolean> {
    const user = this.auth.currentUser;
    
    if (!user) {
      console.log('❌ No authenticated user');
      return false;
    }

    try {
      console.log(`🔍 Checking if user ${user.email} can access shop: ${shopSlug}`);

      const ownershipRef = collection(this.firestore, 'shop_ownership');

      // 1) Primary check: owner record that matches userId + shopSlug
      const byUidQuery = query(
        ownershipRef,
        where('userId', '==', user.uid),
        where('shopSlug', '==', shopSlug)
      );

      const uidSnapshot = await getDocs(byUidQuery);
      if (!uidSnapshot.empty) {
        console.log(`✅ Found ownership by UID for shop: ${shopSlug}`);
        return true;
      }

      // 2) Fallback: look up by email + shopSlug (handles older records created before userId was set)
      if (user.email) {
        console.log(`🔍 Searching shop_ownership by email="${user.email}" and shopSlug="${shopSlug}"`);
        
        const byEmailQuery = query(
          ownershipRef,
          where('email', '==', user.email),
          where('shopSlug', '==', shopSlug)
        );

        const emailSnapshot = await getDocs(byEmailQuery);
        console.log(`📊 Found ${emailSnapshot.size} documents matching email+shopSlug`);
        
        if (!emailSnapshot.empty) {
          console.log(`🔎 Found ownership by email for shop: ${shopSlug}. Will link userId to this document.`);

          // Link the existing doc to the user's UID for future fast checks
          try {
            const docRef = emailSnapshot.docs[0].ref;
            await updateDoc(docRef, { userId: user.uid });
            console.log('🔧 Linked userId to existing shop_ownership doc');
          } catch (updateErr) {
            console.warn('⚠️ Could not update shop_ownership with userId:', updateErr);
          }

          return true;
        } else {
          console.log(`❌ No documents found with email="${user.email}" and shopSlug="${shopSlug}"`);
          
          // Debug: Check if ANY docs exist for this email
          const emailOnlyQuery = query(ownershipRef, where('email', '==', user.email));
          const emailOnlySnapshot = await getDocs(emailOnlyQuery);
          console.log(`📋 Total documents for email "${user.email}": ${emailOnlySnapshot.size}`);
          
          if (!emailOnlySnapshot.empty) {
            emailOnlySnapshot.forEach(doc => {
              const data = doc.data();
              console.log(`  📄 Found shop: "${data['shopSlug']}" (you're trying to access: "${shopSlug}")`);
            });
          }
        }
      }

      // 3) Final fallback: attempt email pattern matching (domain-based)
      const emailShopMatch = this.checkEmailShopMatch(user.email, shopSlug);
      if (emailShopMatch) {
        console.log(`✅ User email matches shop pattern: ${shopSlug}`);
        // Create ownership record for future convenience
        await this.createShopOwnership(user.uid, shopSlug);
        return true;
      }

      console.log(`❌ User does NOT have access to shop: ${shopSlug}`);
      return false;

    } catch (error) {
      console.error('❌ Error checking shop access:', error);
      
      // Fallback to email pattern matching for offline mode
      if (user.email) {
        return this.checkEmailShopMatch(user.email, shopSlug);
      }
      
      return false;
    }
  }

  /**
   * Check if user's email matches the shop slug pattern
   * Example: seller@ganeshbakery.com matches ganesh-bakery
   */
  private checkEmailShopMatch(email: string | null, shopSlug: string): boolean {
    if (!email) return false;

    // Extract domain from email (before @)
    const emailDomain = email.split('@')[1]?.toLowerCase() || '';
    
    // Remove common TLDs and convert to slug format
    const domainPart = emailDomain
      .replace(/\.(com|in|net|org)$/, '')
      .replace(/[^a-z0-9]/g, '-');

    // Convert shop slug to comparable format
    const shopPart = shopSlug.toLowerCase().replace(/[^a-z0-9]/g, '');

    console.log(`📧 Comparing: email domain="${domainPart}" with shop="${shopPart}"`);

    // Check if they match
    return domainPart.includes(shopPart) || shopPart.includes(domainPart);
  }

  /**
   * Create shop ownership record
   */
  private async createShopOwnership(userId: string, shopSlug: string): Promise<void> {
    try {
      const ownershipData: ShopOwnership = {
        shopId: shopSlug, // Using slug as ID for now
        shopSlug: shopSlug,
        userId: userId,
        role: 'owner',
        createdAt: new Date()
      };

      const docRef = doc(this.firestore, 'shop_ownership', `${userId}_${shopSlug}`);
      await setDoc(docRef, ownershipData);
      
      console.log('✅ Created shop ownership record');
    } catch (error) {
      console.error('⚠️ Could not create ownership record:', error);
    }
  }

  /**
   * Get all shops the current user has access to
   */
  async getUserShops(): Promise<string[]> {
    const user = this.auth.currentUser;
    if (!user) return [];

    try {
      const ownershipRef = collection(this.firestore, 'shop_ownership');
      const q = query(ownershipRef, where('userId', '==', user.uid));
      const snapshot = await getDocs(q);

      const shops = snapshot.docs.map(doc => doc.data() as ShopOwnership);
      return shops.map(s => s.shopSlug);
    } catch (error) {
      console.error('Error fetching user shops:', error);
      return [];
    }
  }
}
