import { useForm } from 'react-hook-form';
import { useState, useEffect } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Button, TextField } from '@mui/material';

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
  const rushHour = { day: 5, hour: [15, 16, 17, 18, 19] };
  const rushHourFee = 1.2;

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
      .date()
      .min(new Date(), 'Please input upcoming date')
      .typeError('Time and date of order is required')
      .required('Time and date of order is required'),
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

  const orderTime = (time: Date) => {
    const dateTime = new Date(time);
    return { day: dateTime.getDay(), hour: dateTime.getHours() };
  };

  // Final delivery fee before potential rush hour multiplier
  const deliveryFeeHelper = (deliveryFee: number, fieldValues: DeliveryFeeValues) => {
    if (fieldValues.cartValue >= freeDeliveryValue) {
      return 0;
    } else if (deliveryFee < maxDeliveryFee) {
      return deliveryFee;
    } else {
      return maxDeliveryFee;
    }
  };
 
  // Total delivery fee
  const totalDeliveryFee = (fieldValues: DeliveryFeeValues) => {
    const time = orderTime(fieldValues.orderTime);
    const fee = smallOrderSurcharge(fieldValues.cartValue) + deliveryDistanceFee(fieldValues.deliveryDistance) + itemNumberSurcharge(fieldValues.items);
    if (time.day === rushHour.day && rushHour.hour.includes(time.hour)) {
      return deliveryFeeHelper(fee, fieldValues) * rushHourFee;
    } else {
      return deliveryFeeHelper(fee, fieldValues);
    }
  };

  console.log(totalDeliveryFee(fieldValues));
  console.log(orderTime(fieldValues.orderTime));

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
          {/* <label>Delivery Distance</label> */}
          <TextField label="Delivery distance" variant="outlined" {...register('deliveryDistance', { required: true })} type="text"></TextField>
          {/* <input {...register('deliveryDistance', { required: true })} type="text" placeholder="Distance to deliver" /><span>m</span> */}
          {errors.deliveryDistance && <div style={{ color: 'red' }}><span>{errors.deliveryDistance?.message}</span></div>}
        </div>
        <div className="delivery-fee-form-field">
          {/* <label>Amount of Items</label> */}
          <TextField label="# of items" variant="outlined" {...register('items', { required: true })} type="text"></TextField>
          {/* <input {...register('items', { required: true })} type="text" placeholder="Items in the order" /> */}
          {errors.items && <div><span>{errors.items?.message}</span></div>}
        </div>
        <div className="delivery-fee-form-field">
          {/* <label>Time</label> */}
          <TextField label="Delivery time" variant="outlined" {...register('orderTime', { required: true })} type="datetime-local"></TextField>
          {/* <input {...register('orderTime', { required: true })} type="datetime-local" /> */}
          {errors.orderTime && <div><span>{errors.orderTime?.message}</span></div>}
        </div>
        <div className="delivery-fee-form-submit">
          <Button type="submit" variant="contained">Calculate delivery fee</Button>
          {/* <input type="submit" value="Calculate delivery fee" /> */}
        </div>
      </form>
      <div>Delivery fee: {deliveryFee}</div>
    </div>
  );
};

export default DeliveryFeeCalculator;