import { useMutation } from '@apollo/client';
import { CREATE_PAYPAL_CHECKOUT, CREATE_ORDER } from '../graphql/mutations';

export const usePayPalCheckout = () => {
  const [createOrderrwithr] = useMutation(CREATE_ORDER);
  const [createPayPalCheckoutwitht] = useMutation(CREATE_PAYPAL_CHECKOUT);

  const initiatePayPalCheckout = async () => {
    try {
      console.log('Step 1: Creating order...');
      
      // 1. Create order in your system
      const orderResult = await createOrderrwithr();
      const order = orderResult.data?.createOrder;
      
      console.log('Order creation response:', orderResult);
      
      if (!order?.id) {
        console.error('No order ID returned:', order);
        throw new Error('Failed to create order - no order ID returned');
      }

      console.log('Order created successfully:', order);

      // 2. Use subtotal instead of total
      const amount = order.total;
      
      console.log('Using subtotal as amount:', amount);

      // 3. Validate amount
      if (!amount || amount <= 0) {
        throw new Error(`Invalid amount: $${amount}. Order subtotal must be greater than 0.`);
      }

      console.log('Step 2: Creating PayPal checkout with amount:', amount);

      // 4. Get PayPal URL from backend
      const paypalResult = await createPayPalCheckoutwitht({
        variables: { 
          orderId: order.id, 
          amount: Number(amount) // Ensure it's a number
        }
      });

      console.log('PayPal checkout response:', paypalResult);

      const paypalUrl = paypalResult.data?.createPayPalCheckout;
      
      if (!paypalUrl) {
        console.error('No PayPal URL returned:', paypalResult);
        throw new Error('Failed to get PayPal URL from server');
      }

      console.log('Step 3: Redirecting to PayPal URL:', paypalUrl);

      // 5. Redirect to PayPal
      window.location.href = paypalUrl;

    } catch (error) {
      console.error('PayPal checkout error:', error);
      throw error;
    }
  };

  return { initiatePayPalCheckout };
};