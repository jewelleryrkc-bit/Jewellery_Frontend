import React, { useEffect, useState } from 'react';
// import { useRouter } from 'next/router';
import Link from 'next/link';

const PayPalSuccess: React.FC = () => {
//   const router = useRouter();
  const [loading, setLoading] = useState(true);
//   const [orderId, setOrderId] = useState<string | null>(null);

  useEffect(() => {
    // You can capture the PayPal order ID from URL params if needed
    // For now, just show success
    setLoading(false);
    
    // Optional: Fetch order details or update order status
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Processing your payment...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md w-full bg-white rounded-lg shadow-sm border border-green-200 p-6 text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
          </svg>
        </div>
        
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Payment Successful!</h1>
        <p className="text-gray-600 mb-6">Thank you for your purchase. Your order has been confirmed.</p>
        
        <div className="space-y-3">
          <Link 
            href="/orders"
            className="block w-full bg-gray-800 text-white py-2 px-4 rounded-lg hover:bg-gray-700 transition-colors"
          >
            View Your Orders
          </Link>
          <Link 
            href="/products"
            className="block w-full border border-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PayPalSuccess;