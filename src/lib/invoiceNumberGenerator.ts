// lib/invoiceNumberGenerator.ts
export class InvoiceNumberGenerator {
  static generateFromOrder(orderId: string, orderDate: Date): string {
    const year = orderDate.getFullYear();
    const month = (orderDate.getMonth() + 1).toString().padStart(2, '0');
    const orderNum = orderId.slice(-6).toUpperCase();
    
    return `INV-${year}${month}-${orderNum}`;
  }

  static generateSequential(): string {
    const now = new Date();
    const timestamp = now.getTime().toString().slice(-4);
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    
    return `INV-${now.getFullYear()}${(now.getMonth() + 1).toString().padStart(2, '0')}-${timestamp}${random}`;
  }
}