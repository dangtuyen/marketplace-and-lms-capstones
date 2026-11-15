import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import CheckoutModal from '../src/features/courses/CheckoutModal';

describe('src/features/courses/CheckoutModal.jsx', () => {
  it('Auto-formats 16-digit card numbers and MM/YY expiry dates', () => {
    render(<CheckoutModal course={{ _id: '1', title: 'Test', price: 10 }} onClose={vi.fn()} onPaymentSuccess={vi.fn()} />);
    const card = screen.getByPlaceholderText(/4000/i);
    fireEvent.change(card, { target: { value: '4000123456789010' } });
    expect(card.value).toBe('4000 1234 5678 9010');
  });
});
