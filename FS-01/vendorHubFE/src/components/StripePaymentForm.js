import React, { useState } from 'react';
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';

const StripePaymentForm = ({ clientSecret, onPaymentSuccess }) => {
    const stripe = useStripe();
    const elements = useElements();
    const [isPaying, setIsPaying] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        if (!stripe || !elements) return; // Stripe has not loaded yet

        setIsPaying(true);
        setErrorMessage('');

        // Trigger secure token authentication parameters validation directly to Stripe cloud servers
        const result = await stripe.confirmCardPayment(clientSecret, {
            payment_method: {
                card: elements.getElement(CardElement),
            }
        });

        setIsPaying(false);

        if (result.error) {
            setErrorMessage(result.error.message);
        } else {
            if (result.paymentIntent.status === 'succeeded') {
                onPaymentSuccess();
            }
        }
    };

    return (
        <form onSubmit={handleFormSubmit} style={{ marginTop: '20px', padding: '16px', border: '1px solid #e5e7eb', borderRadius: '12px', backgroundColor: '#f9fafb' }}>
            <h4 style={{ margin: '0 0 16px 0', fontSize: '14px', fontWeight: '700', color: '#374151' }}>💳 Credit or Debit Card Security Details</h4>
            
            <div style={{ backgroundColor: '#ffffff', padding: '12px', borderRadius: '8px', border: '1px solid #d1d5db', marginBottom: '16px' }}>
                <CardElement options={{ style: { base: { fontSize: '16px', color: '#1f2937', '::placeholder': { color: '#a1a1aa' } } } }} />
            </div>

            {errorMessage && <p style={{ color: '#ef4444', fontSize: '13px', margin: '0 0 12px 0', fontWeight: '500' }}>❌ {errorMessage}</p>}

            <button 
                type="submit" 
                disabled={!stripe || isPaying}
                style={{ width: '100%', border: 'none', backgroundColor: isPaying ? '#9ca3af' : '#16a34a', color: '#ffffff', fontWeight: '700', padding: '12px', borderRadius: '8px', cursor: isPaying ? 'not-allowed' : 'pointer', fontSize: '15px' }}
            >
                {isPaying ? "Authorizing Funds..." : "Confirm & Pay Transaction"}
            </button>
        </form>
    );
};

export default StripePaymentForm;