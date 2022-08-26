import { useStyles } from '@/styles/materialCustom';
import { isNairaCurrency, NAIRA } from '@/utils/common';
import { currencyTransformer, Kobo } from '@/utils/dinero';
import { Box, Button, Modal, Typography } from '@mui/material';
import { AxiosResponse } from 'axios';
import currency from 'currency.js';
import { toFormat } from 'dinero.js';
import { useFormik } from 'formik';
import React, { useEffect } from 'react';
import CurrencyInput from 'react-currency-input-field';
import isCurrency from 'validator/lib/isCurrency';
import { createError, createNotification } from '../Notofications';
import styles from './modal.module.scss';

type ChangeBalanceModalProps = {
  open: boolean;
  onClose: () => void;
  message: string;
  balance: string;
  id: string;
  changeBalance: (amount: string, id: string) => Promise<AxiosResponse<any, any>>;
};

type ErrorsType = {
  amount: string | currency;
};

const modalStyle = {
  position: 'absolute' as const,
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  backgroundColor: 'background.paper',
  boxShadow: 24,
  p: 4,
};

const ChangeBalanceModal: React.FC<ChangeBalanceModalProps> = ({
  open,
  onClose,
  message,
  balance,
  id,
  changeBalance,
}) => {
  const classes = useStyles();

  const formik = useFormik({
    initialValues: {
      value: 0,
      amount: '0',
    },
    onSubmit: () => {
      // VARIANT 1
      // try {
      //   let x: (amount: string, id: string) => Promise<AxiosResponse<any, any>> | undefined =
      //     undefined;
      //   if (type === 'hopper') {
      //     x = apiChangeHopperBalance;
      //   }
      //   if (type === 'vendor') {
      //     x = apiChangeVendorBalance;
      //   }

      //   x(formik.values.amount, id).then(() => {
      //     createNotification('success', 'Balance changed');
      //   });
      // } catch (error) {
      //   createError(error);
      // }

      // VARIANT 2
      // const changeHopperBalance = () => {
      //   if (type === 'hopper') return apiChangeHopperBalance(formik.values.amount, id);
      // };
      // const changeVendorBalance = () => {
      //   if (type === 'vendor') return apiChangeVendorBalance(formik.values.amount, id);
      // };
      // Promise.all([changeHopperBalance(), changeVendorBalance()])
      //   .then(() => {
      //     createNotification('success', 'Balance changed');
      //   })
      //   .catch(error => {
      //     createError(error);
      //   });

      changeBalance(formik.values.amount, id)
        .then(() => {
          createNotification('success', 'Balance changed');
        })
        .catch(error => {
          createError(error);
        })
        .finally(() => {
          formik.resetForm();
          onClose();
        });
    },

    validate: values => {
      const error = {} as ErrorsType;
      if (!isCurrency(values.amount, isNairaCurrency)) {
        error.amount = 'Value is not currency';
      }

      if (values.value === 0) {
        error.amount = 'Value can not be zero';
      }
      if (values.value > 90071992547409.92) {
        error.amount = `Max amount ${toFormat(Kobo('9007199254740991'), currencyTransformer)}`;
      }
      return error;
    },
  });

  const handleClose = () => {
    formik.resetForm();
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={modalStyle}>
        <Typography id="modal-modal-title" variant="h6" component="h2">
          Actual balance: {toFormat(Kobo(balance), currencyTransformer)}
        </Typography>
        <Typography id="modal-modal-description" sx={{ mt: 2 }}>
          {message}
        </Typography>
        <div
          className={styles.currencyInputContainer}
          style={{ marginBottom: 20, flex: 1, display: 'flex' }}
        >
          <CurrencyInput
            className={`${styles.balancemodal} ${
              formik.errors.amount ? styles.errorBalanceModal : null
            }`}
            prefix={`${NAIRA.symbol} `}
            groupSeparator={NAIRA.thousands_separator}
            decimalSeparator={NAIRA.decimal_separator}
            id="amount"
            name="amount"
            placeholder="Please enter a number"
            maxLength={9007199254740992}
            decimalsLimit={2}
            onValueChange={(value, _, values) => {
              formik.setValues(
                {
                  amount: values.formatted,
                  value: values.float,
                },
                true,
              );
            }}
          />
          <div className={styles.errorContainer}>
            <span className={styles.errorText}>{formik.errors.amount}</span>
          </div>
        </div>

        <div className={global.offer_btns}>
          <div style={{ flex: 1, marginBottom: 15 }} className={classes.button_out}>
            <Button onClick={formik.submitForm}>Confirm</Button>
          </div>
          <div style={{ flex: 1 }} className={classes.button_out}>
            <Button onClick={handleClose}>Cancel</Button>
          </div>
        </div>
      </Box>
    </Modal>
  );
};

export default ChangeBalanceModal;
