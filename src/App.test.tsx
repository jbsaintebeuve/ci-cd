import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import App from './App';
/**
 * Test the counter on click me button
 */
describe('App', () => {
  it('check counter on click me button', () => {
    render(<App />);
    const button = screen.getByRole('button', { name: /click me/i });
    const counter = screen.getByTestId('count');

    expect(button).toBeInTheDocument();
    expect(counter).toBeInTheDocument();
    expect(counter).toHaveTextContent('0');

    fireEvent.click(button);
    expect(counter).toHaveTextContent('1');
  });
});
