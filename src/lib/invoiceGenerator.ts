/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-explicit-any */
// lib/invoiceGenerator.ts
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { formatCurrency } from './formatCurrency';
import { InvoiceNumberGenerator } from './invoiceNumberGenerator';
import { storeInvoiceRecord, type InvoiceRecord } from './invoiceStorage';

export class InvoiceGenerator {
  static generateInvoice(order: any, currency: string): { pdf: jsPDF, invoiceData: InvoiceRecord } {
    const doc = new jsPDF();
    const invoiceNumber = InvoiceNumberGenerator.generateFromOrder(
      order.id, 
      new Date(Number(order.createdAt))
    );

    // Set default font
    doc.setFont('helvetica');

    // Header with background
    doc.setFillColor(59, 130, 246);
    doc.rect(0, 0, 210, 30, 'F');
    
    doc.setFontSize(24);
    doc.setTextColor(255, 255, 255);
    doc.text('TAX INVOICE', 105, 20, { align: 'center' });

    // Invoice details box
    doc.setFillColor(249, 250, 251);
    doc.rect(120, 40, 80, 45, 'F');
    doc.setDrawColor(229, 231, 235);
    doc.rect(120, 40, 80, 45);

    doc.setFontSize(10);
    doc.setTextColor(75, 85, 99);
    doc.text('INVOICE NUMBER', 125, 47);
    doc.setFontSize(11);
    doc.setTextColor(31, 41, 55);
    doc.text(invoiceNumber, 125, 53);

    doc.setTextColor(75, 85, 99);
    doc.text('INVOICE DATE', 125, 60);
    doc.setTextColor(31, 41, 55);
    doc.text(new Date(Number(order.createdAt)).toLocaleDateString(), 125, 66);

    doc.setTextColor(75, 85, 99);
    doc.text('ORDER NUMBER', 125, 73);
    doc.setTextColor(31, 41, 55);
    doc.text(order.id.slice(-8).toUpperCase(), 125, 79);

    // Company and customer details in two columns
    const seller = order.items[0]?.product?.company;
    const customer = order.user;

    // Seller details
    doc.setFontSize(12);
    doc.setTextColor(31, 41, 55);
    doc.text('FROM:', 15, 45);
    
    doc.setFontSize(11);
    doc.setTextColor(75, 85, 99);
    doc.text(seller?.cname || 'Your Store Name', 15, 52);
    doc.text(seller?.email || 'email@yourstore.com', 15, 59);
    doc.text(seller?.address || seller?.location || '123 Business Street, City, State 12345', 15, 66);
    
    // Handle contact info - convert number to string if needed
    const contactInfo = seller?.contact || seller?.phone;
    let contactText = 'Phone: (555) 123-4567';
    
    if (contactInfo) {
      if (typeof contactInfo === 'number') {
        contactText = `Phone: ${contactInfo.toString()}`;
      } else {
        contactText = `Phone: ${contactInfo}`;
      }
    }
    doc.text(contactText, 15, 73);

    // Customer details
    doc.setFontSize(12);
    doc.setTextColor(31, 41, 55);
    doc.text('BILL TO:', 15, 85);
    
    doc.setFontSize(11);
    doc.setTextColor(75, 85, 99);
    doc.text(customer?.username || customer?.name || 'Customer Name', 15, 92);
    doc.text(customer?.email || 'customer@email.com', 15, 99);
    
    // Customer address if available - handle various address formats
    let addressY = 106;
    if (customer?.addresses?.[0]) {
      const addr = customer.addresses[0];
      const addressLines = [
        addr.streetAddress,
        addr.streetAddress2,
        `${addr.city}, ${addr.state} ${addr.zipcode}`,
        addr.country
      ].filter(Boolean);
      
      addressLines.forEach((line, index) => {
        doc.text(line, 15, addressY + (index * 7));
      });
      addressY += addressLines.length * 7;
    } else if (customer?.address) {
      // Handle direct address field
      doc.text(customer.address, 15, addressY);
      addressY += 7;
    }

    // Order items table - Detailed version
    const startY = addressY > 106 ? addressY + 10 : 110;
    
    autoTable(doc, {
      startY,
      head: [
        [
          'ITEM DESCRIPTION',
          'QUANTITY', 
          'UNIT PRICE',
          'DISCOUNT',
          'TAX',
          'LINE TOTAL'
        ]
      ],
      body: order.items.map((item: any) => {
        const lineTotal = (item.price * item.quantity) - (item.discount || 0) + (item.tax || 0);
        
        return [
          item.product?.name || 'Product',
          item.quantity.toString(),
          formatCurrency(item.price, currency),
          item.discount ? `-${formatCurrency(item.discount, currency)}` : '-',
          item.tax ? formatCurrency(item.tax, currency) : '-',
          formatCurrency(lineTotal, currency)
        ];
      }),
      theme: 'grid',
      headStyles: {
        fillColor: [59, 130, 246],
        textColor: 255,
        fontStyle: 'bold',
        fontSize: 9
      },
      styles: {
        fontSize: 8,
        cellPadding: 2,
        lineColor: [229, 231, 235]
      },
      columnStyles: {
        0: { cellWidth: 60, fontStyle: 'bold' },
        1: { cellWidth: 20, halign: 'center' },
        2: { cellWidth: 25, halign: 'right' },
        3: { cellWidth: 25, halign: 'right' },
        4: { cellWidth: 25, halign: 'right' },
        5: { cellWidth: 25, halign: 'right', fontStyle: 'bold' }
      },
      margin: { top: 10 }
    });

    // Summary section
    const finalY = (doc as any).lastAutoTable.finalY + 15;
    
    doc.setFillColor(249, 250, 251);
    doc.rect(120, finalY, 80, 80, 'F');
    doc.setDrawColor(229, 231, 235);
    doc.rect(120, finalY, 80, 80);

    const subtotal = order.subtotal || order.items.reduce((sum: number, item: any) => sum + (item.price * item.quantity), 0);
    const totalDiscount = order.discount || 0;
    const totalTax = order.tax || order.items.reduce((sum: number, item: any) => sum + (item.tax || 0), 0);
    const shipping = order.shippingCost || 0;

    doc.setFontSize(9);
    doc.setTextColor(75, 85, 99);
    doc.text('SUBTOTAL:', 125, finalY + 10);
    doc.text('DISCOUNT:', 125, finalY + 20);
    doc.text('TAX:', 125, finalY + 30);
    doc.text('SHIPPING:', 125, finalY + 40);
    doc.setFontSize(10);
    doc.setTextColor(31, 41, 55);
    doc.text(formatCurrency(subtotal, currency), 190, finalY + 10, { align: 'right' });
    doc.text(`-${formatCurrency(totalDiscount, currency)}`, 190, finalY + 20, { align: 'right' });
    doc.text(formatCurrency(totalTax, currency), 190, finalY + 30, { align: 'right' });
    doc.text(formatCurrency(shipping, currency), 190, finalY + 40, { align: 'right' });

    // Total separator
    doc.setDrawColor(156, 163, 175);
    doc.line(125, finalY + 45, 190, finalY + 45);

    doc.setFontSize(11);
    doc.setTextColor(31, 41, 55);
    doc.setFont('bold');
    doc.text('TOTAL AMOUNT:', 125, finalY + 55);
    doc.setFontSize(12);
    doc.text(formatCurrency(order.total, currency), 190, finalY + 55, { align: 'right' });

    // Payment terms
    doc.setFontSize(8);
    doc.setTextColor(156, 163, 175);
    doc.text('Payment due within 30 days of invoice date.', 125, finalY + 65);

    // Footer
    doc.setFontSize(7);
    doc.setTextColor(156, 163, 175);
    doc.text('Thank you for your business!', 105, 280, { align: 'center' });
    
    // Company information footer
    const footerY = 285;
    doc.text(seller?.cname || 'Your Store Name', 105, footerY, { align: 'center' });
    
    // Handle contact info in footer
    let footerContactText = `${seller?.email || 'email@yourstore.com'} | ${contactText.replace('Phone: ', '')}`;
    doc.text(footerContactText, 105, footerY + 5, { align: 'center' });
    
    doc.text(seller?.address || seller?.location || '123 Business Street, City, State 12345', 105, footerY + 10, { align: 'center' });
    
    // Terms and conditions
    doc.text('This is computer generated invoice and does not require signature.', 105, footerY + 20, { align: 'center' });
    doc.text(`Generated on: ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}`, 105, footerY + 25, { align: 'center' });

    const invoiceData: InvoiceRecord = {
      invoiceNumber,
      orderId: order.id,
      generatedAt: new Date(),
      orderData: order
    };

    return {
      pdf: doc,
      invoiceData
    };
  }

  static downloadInvoice(order: any, currency: string): string {
    try {
      const { pdf, invoiceData } = this.generateInvoice(order, currency);
      pdf.save(`invoice-${invoiceData.invoiceNumber}.pdf`);
      storeInvoiceRecord(invoiceData);
      return invoiceData.invoiceNumber;
    } catch (error) {
      console.error('Error generating invoice:', error);
      throw new Error('Failed to generate invoice');
    }
  }

  static generateBulkInvoices(orders: any[], currency: string): void {
    orders.forEach((order, index) => {
      setTimeout(() => {
        try {
          this.downloadInvoice(order, currency);
        } catch (error) {
          console.error(`Failed to generate invoice for order ${order.id}:`, error);
        }
      }, index * 1000);
    });
  }

  // Preview function for modal view
  static previewInvoice(order: any, currency: string): string {
    try {
      const { pdf } = this.generateInvoice(order, currency);
      const blob = pdf.output('blob');
      return URL.createObjectURL(blob);
    } catch (error) {
      console.error('Error previewing invoice:', error);
      return '';
    }
  }
}