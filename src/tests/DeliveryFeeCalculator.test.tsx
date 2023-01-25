import '@testing-library/jest-dom/extend-expect';
import { render, screen, waitFor } from '@testing-library/react';
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
    test('Delivery time field accepts text', async () => {
      render(<DeliveryFeeCalculator />);
      const user = userEvent.setup();
      const input = screen.getByLabelText('Delivery time');
      const button = screen.getByRole('button');
      // const form = screen.getByRole('form');
  
      // await user.clear(input);
      await user.type(input, '2023-01-25T11:48');
      await user.click(button);
  
      expect(input).toHaveValue('2023-01-25T11:48');
    });
  });
  describe('field errors', () => {
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
});

describe('total delivery fee values based on inputs', () => {
  test('minimum possible delivery fee is correct', async () => {
    render(<DeliveryFeeCalculator />);
    const user = userEvent.setup();
    const button = screen.getByText('Calculate delivery fee');

    const inputCartValue = screen.getByRole('textbox', {name: 'Cart value'});
    const inputDeliveryDistance = screen.getByRole('textbox', {name: 'Delivery distance'});
    const inputItemNumber = screen.getByRole('textbox', {name: '# of items'});
    const inputDeliveryTime = screen.getByLabelText('Delivery time');


    await user.type(inputCartValue, '10');
    await user.type(inputDeliveryDistance, '1');
    await user.type(inputItemNumber, '4');
    await user.type(inputDeliveryTime, '2024-01-25T11:48');
    await user.click(button);

    await waitFor(() => {
      expect(screen.queryByText('Delivery fee: 0€')).not.toBeInTheDocument();
      expect(screen.queryByText('Delivery fee: 2€')).toBeInTheDocument();
    });
  });
  test('delivery fee value is correct with certain parameters', async () => {
    render(<DeliveryFeeCalculator />);
    const user = userEvent.setup();
    const button = screen.getByText('Calculate delivery fee');

    const inputCartValue = screen.getByRole('textbox', {name: 'Cart value'});
    const inputDeliveryDistance = screen.getByRole('textbox', {name: 'Delivery distance'});
    const inputItemNumber = screen.getByRole('textbox', {name: '# of items'});
    const inputDeliveryTime = screen.getByLabelText('Delivery time');


    await user.type(inputCartValue, '10');
    await user.type(inputDeliveryDistance, '1500');
    await user.type(inputItemNumber, '13');
    await user.type(inputDeliveryTime, '2024-01-25T11:48');
    await user.click(button);

    await waitFor(() => {
      expect(screen.queryByText('Delivery fee: 0€')).not.toBeInTheDocument();
      expect(screen.queryByText('Delivery fee: 8.7€')).toBeInTheDocument();
    });
  });
  test('free delivery fee is correct', async () => {
    render(<DeliveryFeeCalculator />);
    const user = userEvent.setup();
    const button = screen.getByText('Calculate delivery fee');

    const inputCartValue = screen.getByRole('textbox', {name: 'Cart value'});
    const inputDeliveryDistance = screen.getByRole('textbox', {name: 'Delivery distance'});
    const inputItemNumber = screen.getByRole('textbox', {name: '# of items'});
    const inputDeliveryTime = screen.getByLabelText('Delivery time');


    await user.type(inputCartValue, '100');
    await user.type(inputDeliveryDistance, '15000000');
    await user.type(inputItemNumber, '13');
    await user.type(inputDeliveryTime, '2024-01-25T11:48');
    await user.click(button);

    await waitFor(() => {
      expect(screen.queryByText('Delivery fee: 0€')).toBeInTheDocument();
      expect(screen.queryByText('Delivery fee: 15€')).not.toBeInTheDocument();
    });
  });
  test('delivery fee cannot be more than 15€', async () => {
    render(<DeliveryFeeCalculator />);
    const user = userEvent.setup();
    const button = screen.getByText('Calculate delivery fee');

    const inputCartValue = screen.getByRole('textbox', {name: 'Cart value'});
    const inputDeliveryDistance = screen.getByRole('textbox', {name: 'Delivery distance'});
    const inputItemNumber = screen.getByRole('textbox', {name: '# of items'});
    const inputDeliveryTime = screen.getByLabelText('Delivery time');


    await user.type(inputCartValue, '10');
    await user.type(inputDeliveryDistance, '15000000');
    await user.type(inputItemNumber, '13');
    await user.type(inputDeliveryTime, '2024-01-25T11:48');
    await user.click(button);

    await waitFor(() => {
      expect(screen.queryByText('Delivery fee: 0€')).not.toBeInTheDocument();
      expect(screen.queryByText('Delivery fee: 15€')).toBeInTheDocument();
    });
  });
});
