"use client";

import React, { useState } from 'react';
import { usePayPalCheckout } from '../../hooks/usePaypalCheckout';

const CheckoutPayPal: React.FC = () => {
  const { initiatePayPalCheckout } = usePayPalCheckout();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handlePayPalCheckout = async () => {
    setLoading(true);
    setError(null);
    
    try {
      await initiatePayPalCheckout();
      // User gets redirected to PayPal automatically
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Checkout failed');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Checkout with PayPal</h1>
        
        <button
          onClick={handlePayPalCheckout}
          disabled={loading}
          className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
        >
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
              Processing...
            </>
          ) : (
            'Pay with PayPal'
          )}
        </button>

        {error && (
          <div className="mt-4 bg-red-50 border border-red-200 rounded-md p-4">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        <p className="mt-4 text-sm text-gray-600 text-center">
          You&apos;ll be redirected to PayPal to complete your payment
        </p>
      </div>
    </div>
  );
};

export default CheckoutPayPal;