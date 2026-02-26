import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'permissionBadge',
  standalone: true
})
export class PermissionBadgePipe implements PipeTransform {
  transform(value: string | string[]): string {
    if (!value) return '';
    
    if (Array.isArray(value)) {
      value = value.join(', ');
    }
    
    const permissionMap: Record<string, string> = {
      'manage_products': '📦 Manage Products',
      'manage_orders': '📋 Manage Orders',
      'manage_sellers': '👥 Manage Sellers',
      'manage_shops': '🏪 Manage Shops',
      'view_analytics': '📊 View Analytics',
      'manage_payments': '💳 Manage Payments',
      'manage_disputes': '⚖️ Manage Disputes',
      'manage_users': '👤 Manage Users'
    };
    
    return permissionMap[value.toLowerCase()] || value;
  }
}
