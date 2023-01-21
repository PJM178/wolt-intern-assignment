import { useForm } from 'react-hook-form';
import { useState, useEffect } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

import { DeliveryFeeValues } from '../Types';

const DeliveryFeeCalculator = () => {
  const [deliveryFee, setDeliveryFee] = useState<number>(0);

  const validationSchema = yup.object().shape({
    cartValue: yup
      .number()
      .transform((value, originalValue) => {
        return (originalValue === '' ? undefined : value);
      })
      .typeError('Value must be a number')
      .required('Cart value is required'),
    deliveryDistance: yup
      .number()
      .typeError('Value must be a number')
      .required('Delivery Distance is required'),
    items: yup
      .number()
      .typeError('Value must be a number')
      .required('Amount of items in cart is required'),
    orderTime: yup.string().required('Time of order is required'),
  });

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
          <div>{errors.cartValue && <span>{errors.cartValue.message}</span>}</div> 
        </div>
        <div className="delivery-fee-form-field">
          <label>Delivery Distance</label>
          <input {...register('deliveryDistance', { required: true })} type="number" />
          {errors.deliveryDistance && <span>Delivery distance is required</span>}
        </div>
        <div className="delivery-fee-form-field">
          <label>Amount of Items</label>
          <input {...register('items', { required: true })} type="number" />
          {errors.items && <span>Amount of items is required</span>}
        </div>
        <div className="delivery-fee-form-field">
          <label>Time</label>
          <input {...register('orderTime', { required: true })} type="string" />
          {errors.orderTime && <span>Cart Value is required</span>}
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