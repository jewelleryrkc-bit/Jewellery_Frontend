// components/InvoiceTracker.tsx
import { useState, useEffect } from 'react';
import { getStoredInvoices, clearInvoiceRecords, type InvoiceRecord } from '../../lib/invoiceStorage';
import { formatCurrency } from '../../lib/formatCurrency';
import { useCurrency } from '../../providers/CurrencyContext';
import { Download, Trash2 } from 'lucide-react';

interface InvoiceTrackerProps {
  orderId?: string;
  onInvoiceGenerated?: (invoiceNumber: string) => void;
}

export const InvoiceTracker: React.FC<InvoiceTrackerProps> = ({ 
  orderId}) => {
  const { currency } = useCurrency();
  const [invoices, setInvoices] = useState<InvoiceRecord[]>([]);

  useEffect(() => {
    loadInvoices();
  }, []);

  const loadInvoices = () => {
    const storedInvoices = getStoredInvoices();
    setInvoices(storedInvoices);
  };

  const clearInvoices = () => {
    clearInvoiceRecords();
    setInvoices([]);
  };

  const filteredInvoices = orderId 
    ? invoices.filter(inv => inv.orderId === orderId)
    : invoices;

  if (filteredInvoices.length === 0) {
    return null;
  }

  return (
    <div className="mt-4 p-4 bg-gray-50 rounded-lg border">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-sm font-medium text-gray-900">Generated Invoices</h3>
        <button
          onClick={clearInvoices}
          className="flex items-center text-xs text-red-600 hover:text-red-800"
        >
          <Trash2 className="h-3 w-3 mr-1" />
          Clear All
        </button>
      </div>
      <div className="space-y-2">
        {filteredInvoices.map((invoice, index) => (
          <div key={index} className="flex justify-between items-center text-xs p-2 bg-white rounded border">
            <div className="flex items-center">
              <Download className="h-3 w-3 mr-2 text-gray-400" />
              <div>
                <span className="font-medium text-gray-900">{invoice.invoiceNumber}</span>
                <span className="text-gray-500 ml-2">
                  {new Date(invoice.generatedAt).toLocaleDateString()}
                </span>
              </div>
            </div>
            <span className="text-gray-600 font-medium">
              {formatCurrency(invoice.orderData.total, currency)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};