import '@testing-library/jest-dom/extend-expect';
import { render, screen } from '@testing-library/react';
import DeliveryFeeCalculator from '../components/DeliveryFeeCalculator';

describe('component renders the wanted elements on screen', () => {
  test('cart value gets rendered on screen', () => {
    render(<DeliveryFeeCalculator />);
  
    const element = screen.getByLabelText('Cart value');
    expect(element).toBeDefined();
  });
  test('delivery fistance gets rendered on screen', () => {
    render(<DeliveryFeeCalculator />);
  
    const element = screen.getByLabelText('Delivery distance');
    expect(element).toBeDefined();
  });
  test('number of items gets rendered on screen', () => {
    render(<DeliveryFeeCalculator />);
  
    const element = screen.getByLabelText('# of items');
    expect(element).toBeDefined();
  });
  test('delivery time gets rendered on screen', () => {
    render(<DeliveryFeeCalculator />);
  
    const element = screen.getByLabelText('Delivery time');
    expect(element).toBeDefined();
  });
  test('calculate delivery fee gets rendered on screen', () => {
    render(<DeliveryFeeCalculator />);
  
    const element = screen.getByText('Calculate delivery fee');
    expect(element).toBeDefined();
  });
  test('delivery fee gets rendered on screen', () => {
    render(<DeliveryFeeCalculator />);
  
    const element = screen.findByText('Delivery fee: ');
    expect(element).toBeDefined();
  });
});