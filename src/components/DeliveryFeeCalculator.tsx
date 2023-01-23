import { useForm } from 'react-hook-form';
import { useState, useEffect } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Button, TextField } from '@mui/material';
import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined';

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
        <div className="delivery-fee-form-field-container">
          {errors.cartValue 
            ? <TextField 
                InputProps={{ endAdornment: (<ErrorOutlineOutlinedIcon color="error" />) }} 
                className="delivery-fee-form-field" 
                error 
                helperText={errors.cartValue?.message} 
                label="Cart value" 
                {...register('cartValue')} 
                type="text"
              />
            : convertCommas(fieldValues.cartValue) < orderSurcharge && convertCommas(fieldValues.cartValue) >= 0 && fieldValues.cartValue 
                ? <TextField 
                    className="delivery-fee-form-field" 
                    helperText={` Order total less than ${orderSurcharge.toFixed(2)}€ - small order surcharge: ${smallOrderSurcharge(convertCommas(fieldValues.cartValue)).toFixed(2)}€`} 
                    label="Cart value" 
                    {...register('cartValue')} 
                    type="text"
                  />
                : <TextField 
                    className="delivery-fee-form-field" 
                    label="Cart value" 
                    {...register('cartValue')} 
                    type="text"
                  />
          }
        </div>
        <div className="delivery-fee-form-field-container">
          {errors.deliveryDistance 
            ? <TextField 
                InputProps={{ endAdornment: (<ErrorOutlineOutlinedIcon color="error" />) }} 
                className="delivery-fee-form-field" 
                error 
                helperText={errors.deliveryDistance?.message} 
                label="Delivery distance" 
                variant="outlined" 
                {...register('deliveryDistance', { required: true })} 
                type="text" 
              /> 
            : <TextField 
                className="delivery-fee-form-field" 
                label="Delivery distance" 
                variant="outlined" 
                {...register('deliveryDistance', { required: true })} 
                type="text" 
              />
          }
        </div>
        <div className="delivery-fee-form-field-container">
          {errors.items
            ? <TextField 
                InputProps={{ endAdornment: (<ErrorOutlineOutlinedIcon color="error" />) }} 
                className="delivery-fee-form-field" 
                error 
                helperText={errors.items?.message} 
                label="# of items" 
                variant="outlined" 
                {...register('items', { required: true })} 
                type="text" 
              /> 
            : <TextField 
                className="delivery-fee-form-field" 
                label="# of items" 
                variant="outlined" 
                {...register('items', { required: true })} 
                type="text" 
              />
          }
        </div>
        <div className="delivery-fee-form-field-container">
          {errors.orderTime
            ? <TextField 
                InputProps={{ endAdornment: (<ErrorOutlineOutlinedIcon color="error" />) }} 
                className="delivery-fee-form-field" 
                error 
                helperText={errors.orderTime?.message} 
                InputLabelProps={{ shrink: true }} 
                label="Delivery time" 
                variant="outlined" 
                {...register('orderTime', { required: true })} 
                type="datetime-local" 
              /> 
            : <TextField 
                className="delivery-fee-form-field" 
                InputLabelProps={{ shrink: true }} 
                label="Delivery time" 
                variant="outlined" {...register('orderTime', { required: true })} 
                type="datetime-local" 
              />
          }
        </div>
        <div className="delivery-fee-form-field-container" style={{ display: 'flex', justifyContent: 'center' }}>
            <Button type="submit" variant="contained">Calculate delivery fee</Button>
        </div>
      </form>
      <div>Delivery fee: {deliveryFee}€</div>
    </div>
  );
};

export default DeliveryFeeCalculator;