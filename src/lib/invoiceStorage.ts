/* eslint-disable @typescript-eslint/no-explicit-any */
// lib/invoiceStorage.ts
export interface InvoiceRecord {
  invoiceNumber: string;
  orderId: string;
  generatedAt: Date;
  orderData: any;
}

export const storeInvoiceRecord = (invoiceRecord: InvoiceRecord): void => {
  const invoices = getStoredInvoices();
  invoices.push(invoiceRecord);
  localStorage.setItem('invoices', JSON.stringify(invoices));
};

export const getStoredInvoices = (): InvoiceRecord[] => {
  try {
    const stored = localStorage.getItem('invoices');
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

export const getInvoiceForOrder = (orderId: string): InvoiceRecord | undefined => {
  const invoices = getStoredInvoices();
  return invoices.find(inv => inv.orderId === orderId);
};

export const clearInvoiceRecords = (): void => {
  localStorage.removeItem('invoices');
};