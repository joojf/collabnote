import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { SignInForm } from '../SignInForm';
import { describe, expect, it, vi } from 'vitest';
import { signIn } from 'next-auth/react';

vi.mock('next-auth/react', () => ({
  signIn: vi.fn(),
}));

describe('SignInForm', () => {
  it('submits form with correct credentials', async () => {
    render(<SignInForm />);
    
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'test@example.com' },
    });
    
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'password123' },
    });
    
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));
    
    await waitFor(() => {
      expect(signIn).toHaveBeenCalledWith('credentials', {
        email: 'test@example.com',
        password: 'password123',
        redirect: false,
      });
    });
  });
});
