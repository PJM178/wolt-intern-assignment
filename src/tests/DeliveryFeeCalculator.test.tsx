import '@testing-library/jest-dom/extend-expect';
import { render, screen } from '@testing-library/react';
import DeliveryFeeCalculator from '../components/DeliveryFeeCalculator';
import userEvent from '@testing-library/user-event';

describe('component renders the wanted elements on screen', () => {
  test('cart value gets rendered on screen', () => {
    render(<DeliveryFeeCalculator />);
  
    const element = screen.getByLabelText('Cart value');
    expect(element).toBeInTheDocument();
  });
  test('delivery fistance gets rendered on screen', () => {
    render(<DeliveryFeeCalculator />);
  
    const element = screen.getByLabelText('Delivery distance');
    expect(element).toBeInTheDocument();
  });
  test('number of items gets rendered on screen', () => {
    render(<DeliveryFeeCalculator />);
  
    const element = screen.getByLabelText('# of items');
    expect(element).toBeInTheDocument();
  });
  test('delivery time gets rendered on screen', () => {
    render(<DeliveryFeeCalculator />);
  
    const element = screen.getByLabelText('Delivery time');
    expect(element).toBeInTheDocument();
  });
  test('calculate delivery fee gets rendered on screen', () => {
    render(<DeliveryFeeCalculator />);
  
    const element = screen.getByText('Calculate delivery fee');
    expect(element).toBeInTheDocument();
  });
  test('delivery fee gets rendered on screen', () => {
    render(<DeliveryFeeCalculator />);
  
    const element = screen.getByText('Delivery fee: 0€');
    expect(element).toBeInTheDocument();
  });
});

describe('input fields', () => {
  describe('fields accept text', () => {
    test('cart value field accepts text', async () => {
      render(<DeliveryFeeCalculator />);
      const user = userEvent.setup();
      const input = screen.getByRole('textbox', {name: 'Cart value'});
      const button = screen.getByRole('button');
      // const form = screen.getByRole('form');
  
      await user.type(input, 'testing input');
      await user.click(button);
  
      expect(input).toHaveValue('testing input');
    });
    test('delivery distance field accepts text', async () => {
      render(<DeliveryFeeCalculator />);
      const user = userEvent.setup();
      const input = screen.getByRole('textbox', {name: 'Delivery distance'});
      const button = screen.getByRole('button');
      // const form = screen.getByRole('form');
  
      await user.type(input, 'testing input');
      await user.click(button);
  
      expect(input).toHaveValue('testing input');
    });
    test('# of items field accepts text', async () => {
      render(<DeliveryFeeCalculator />);
      const user = userEvent.setup();
      const input = screen.getByRole('textbox', {name: '# of items'});
      const button = screen.getByRole('button');
      // const form = screen.getByRole('form');
  
      await user.type(input, 'testing input');
      await user.click(button);
  
      expect(input).toHaveValue('testing input');
    });
    // test('Delivery time field accepts text', async () => {
    //   render(<DeliveryFeeCalculator />);
    //   const user = userEvent.setup();
    //   const input = screen.getByLabelText('Delivery time');
    //   const button = screen.getByRole('button');
    //   // const form = screen.getByRole('form');
  
    //   await user.type(input, '11{arrowright}11{arrowright}1111{arrowright}11{arrowright}11');
    //   await user.click(button);
  
    //   expect(input).toHaveValue('111111111');
    // });
  });
  test('field error texts when submitting empty form', async () => {
    render(<DeliveryFeeCalculator />);
    const user = userEvent.setup();
    const button =  screen.getByText('Calculate delivery fee');
    await user.click(button);

    const errorCartValue = await screen.findByText('Cart value is required');
    const errorDeliveryDistance = await screen.findByText('Delivery Distance is required');
    const errorItemNumber = await screen.findByText('Amount of items in cart is required');
    const errorDeliveryTime = await screen.findByText('Time and date of order is required');

    expect(errorCartValue).toBeInTheDocument();
    expect(errorDeliveryDistance).toBeInTheDocument();
    expect(errorItemNumber).toBeInTheDocument();
    expect(errorDeliveryTime).toBeInTheDocument();
  });
});
