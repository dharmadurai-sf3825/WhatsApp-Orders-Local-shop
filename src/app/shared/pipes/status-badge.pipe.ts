import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'statusBadge',
  standalone: true
})
export class StatusBadgePipe implements PipeTransform {
  transform(value: string): string {
    if (!value) return '';
    
    const statusMap: Record<string, string> = {
      'pending': '⏳ Pending',
      'processing': '⚙️ Processing',
      'shipped': '📦 Shipped',
      'delivered': '✅ Delivered',
      'cancelled': '❌ Cancelled',
      'returned': '↩️ Returned',
      'completed': '✅ Completed',
      'active': '🟢 Active',
      'inactive': '⚪ Inactive',
      'suspended': '🔴 Suspended'
    };
    
    return statusMap[value.toLowerCase()] || value;
  }
}
