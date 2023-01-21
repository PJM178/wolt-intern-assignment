import { useForm } from 'react-hook-form';
import { useState, useEffect } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

import { DeliveryFeeValues } from '../Types';

const DeliveryFeeCalculator = () => {
  const [deliveryFee, setDeliveryFee] = useState<number>(0);

  // Validation schema for the form
  const validationSchema = yup.object().shape({
    cartValue: yup
      .number()
      .transform((value, originalValue) => {
        if (originalValue === '') {
          return undefined;
        } else if (String(originalValue).includes(',')) {
          return Number(originalValue.replace(/,/g, '.'));
        } else {
          return value;
        }
        // return (originalValue === '' ? undefined : value);
      })
      .typeError('Value must be a number')
      .required('Cart value is required'),
    deliveryDistance: yup
      .number()
      .transform((v, o) => {
        return (o === '' ? undefined : v);
      })
      .typeError('Value must be a number')
      .required('Delivery Distance is required'),
    items: yup
      .number()
      .transform((v, o) => {
        return (o === '' ? undefined : v);
      })
      .typeError('Value must be a number')
      .required('Amount of items in cart is required'),
    orderTime: yup
      .string()
      .required('Time of order is required'),
  });

  // React Hook Form components
  const { 
    register, 
    handleSubmit, 
    reset, 
    formState, 
    formState: { errors, isSubmitSuccessful } 
  } = useForm<DeliveryFeeValues>({ resolver: yupResolver(validationSchema) });

  const onSubmit = (data: DeliveryFeeValues) => {
    setDeliveryFee(data.items);
    console.log(data);
  };

  useEffect(() => {
    if (isSubmitSuccessful) {
      reset ();
    }
  }, [formState, reset]);

  return (
    <div className="delivery-fee-form-container">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="delivery-fee-form-field">
          <label>Cart Value</label>
          <input {...register('cartValue')} type="text" />
          {errors.cartValue && <div><span>{errors.cartValue?.message}</span></div>}
        </div>
        <div className="delivery-fee-form-field">
          <label>Delivery Distance</label>
          <input {...register('deliveryDistance', { required: true })} type="number" />
          {errors.deliveryDistance && <div style={{ color: 'red' }}><span>{errors.deliveryDistance?.message}</span></div>}
        </div>
        <div className="delivery-fee-form-field">
          <label>Amount of Items</label>
          <input {...register('items', { required: true })} type="number" />
          {errors.items && <div><span>{errors.items?.message}</span></div>}
        </div>
        <div className="delivery-fee-form-field">
          <label>Time</label>
          <input {...register('orderTime', { required: true })} type="string" />
          {errors.orderTime && <div><span>{errors.orderTime?.message}</span></div>}
        </div>
        <div className="delivery-fee-form-submit">
          <input type="submit" />
        </div>
      </form>
      <div>Delivery fee: {deliveryFee}</div>
    </div>
  );
};

export default DeliveryFeeCalculator;