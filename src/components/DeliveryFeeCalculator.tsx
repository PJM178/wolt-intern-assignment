import { useForm } from 'react-hook-form';
import { useState, useEffect } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

import { DeliveryFeeValues } from '../Types';

const DeliveryFeeCalculator = () => {
  const [deliveryFee, setDeliveryFee] = useState<number>(0);

  // Delivery fee parameters
  const orderSurcharge = 10;
  const minimumDistance = 1000;
  const itemNumber = 4;
  const itemNumberCost = 0.5;
  const bulkOrder = 13;
  const bulkFee = 1.2;
  const maxDeliveryFee = 15;
  const freeDeliveryValue = 100;

  // Validation schema for the form
  const validationSchema = yup.object().shape({
    cartValue: yup
      .number()
      .min(0, 'Value must be positive')
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
      .integer('Value must be an integer')
      .min(0, 'Value must be positive')
      .transform((value, originalValue) => {
        if (originalValue === '') {
          return undefined;
        } else if (String(originalValue).includes(',')) {
          return Number(originalValue.replace(/,/g, '.'));
        } else {
          return value;
        }
      })
      .typeError('Value must be a number')
      .required('Delivery Distance is required'),
    items: yup
      .number()
      .integer('Value must be an integer')
      .min(0, 'Value must be positive')
      .transform((value, originalValue) => {
        if (originalValue === '') {
          return undefined;
        } else if (String(originalValue).includes(',')) {
          return Number(originalValue.replace(/,/g, '.'));
        } else {
          return value;
        }
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
    watch, 
    formState, 
    formState: { errors, isSubmitSuccessful } 
  } = useForm<DeliveryFeeValues>({ resolver: yupResolver(validationSchema) });

  const onSubmit = (data: DeliveryFeeValues) => {
    setDeliveryFee(totalDeliveryFee(data));
    console.log(data);
  };

  const fieldValues: DeliveryFeeValues = watch();
  console.log(fieldValues);
  console.log(watch());

  const convertCommas = (value: number) => {
    return Number(String(value).replace(',','.'));
  };

  // Helper functions to calculate the delivery fee
  const smallOrderSurcharge = (cartValue: number) => {
    if (cartValue < orderSurcharge) {
      return orderSurcharge - cartValue;
    } else {
      return 0;
    }
  };

  const deliveryDistanceFee = (distance: number) => {
    if (distance <= minimumDistance) {
      return 2;
    } else {
      return 2 + Math.ceil((distance - minimumDistance)/500);
    }
  };

  const itemNumberSurcharge = (items: number) => {
    if (items <= itemNumber) {
      return 0;
    } else if (items < bulkOrder) {
      return (items - itemNumber) * itemNumberCost;
    } else {
      return (items - itemNumber) * itemNumberCost + bulkFee;
    }
  };

  // Total delivery fee - TBD fee multiplier based on order time
  const totalDeliveryFee = (fieldValues: DeliveryFeeValues) => {
    const fee = smallOrderSurcharge(fieldValues.cartValue) + deliveryDistanceFee(fieldValues.deliveryDistance) + itemNumberSurcharge(fieldValues.items);
    if (fieldValues.cartValue >= freeDeliveryValue) {
      return 0;
    } else if (fee < maxDeliveryFee) {
      return fee;
    } else {
      return maxDeliveryFee;
    }
  };

  console.log(totalDeliveryFee(fieldValues));

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
          <input {...register('cartValue')} type="text" min="0" placeholder="Order value"/><span>€</span>
          {errors.cartValue && <div><span>{errors.cartValue?.message}</span></div>}
          {convertCommas(fieldValues.cartValue) < orderSurcharge && convertCommas(fieldValues.cartValue) >= 0 && fieldValues.cartValue
            ? <div>
                Order total less than {orderSurcharge.toFixed(2)}€ - small order surcharge: {smallOrderSurcharge(convertCommas(fieldValues.cartValue)).toFixed(2)}€
              </div> 
            : null}
        </div>
        <div className="delivery-fee-form-field">
          <label>Delivery Distance</label>
          <input {...register('deliveryDistance', { required: true })} type="text" placeholder="Distance to deliver" /><span>m</span>
          {errors.deliveryDistance && <div style={{ color: 'red' }}><span>{errors.deliveryDistance?.message}</span></div>}
        </div>
        <div className="delivery-fee-form-field">
          <label>Amount of Items</label>
          <input {...register('items', { required: true })} type="text" placeholder="Items in the order" />
          {errors.items && <div><span>{errors.items?.message}</span></div>}
        </div>
        <div className="delivery-fee-form-field">
          <label>Time</label>
          <input {...register('orderTime', { required: true })} type="datetime-local" />
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