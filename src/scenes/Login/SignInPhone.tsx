import React, { useEffect, useState } from 'react';
import styles from './login.module.scss';
import { useStyles } from '@/styles/materialCustom';
import { Button, TextField } from '@mui/material';
import { useFormik } from 'formik';
import { useDispatch, useSelector } from 'react-redux';
import {
  actionClearAuthToken,
  actionConfirmPhone,
  actionLogin,
  actionLoginWithPhone,
} from '@/store/slices/Auth/authSlice';
import { ErrorsType } from 'react-images-uploading';
import { RootState } from '@/store';
import 'react-phone-number-input/style.css';
import PhoneInput, {
  formatPhoneNumber,
  formatPhoneNumberIntl,
  isValidPhoneNumber,
} from 'react-phone-number-input';
import InputMask from 'react-input-mask';
import { useAppDispatch } from '@/customHooks/storeHooks';

type PhoneType = {
  phone: string;
};

const SignInPhone: React.FC = () => {
  const classes = useStyles();
  const dispatch = useAppDispatch();

  const [userPhone, setUserPhone] = React.useState<any>('');
  const token = useSelector((state: RootState) => state.auth.authorization_token);
  const [code, setCode] = React.useState('');
  const [enterPhone, setEnterPhone] = React.useState(false);

  // const handleChangePhone = e => {
  //   setPhone(e.target.value);
  // };
  const handleChangeCode = e => {
    setCode(e.target.value);
  };

  useEffect(() => {
    if (token) {
      setEnterPhone(true);
    }
  }, [token]);

  useEffect(() => {
    return () => {
      setEnterPhone(false);
      setUserPhone('');
      dispatch(actionClearAuthToken());
    };
  }, []);

  return (
    <div className={styles.form_container}>
      <div>
        {!enterPhone && (
          <>
            <div className={`${styles.input_wrapper} `}>
              <PhoneInput
                international
                className={styles.input_phone}
                placeholder="Enter phone number"
                defaultCountry="NG"
                value={userPhone}
                error={
                  userPhone
                    ? isValidPhoneNumber(userPhone)
                      ? undefined
                      : 'Invalid phone number'
                    : 'Phone number required'
                }
                onChange={setUserPhone}
              />
            </div>
            <div style={{ height: '36.5px' }} className={classes.button}>
              <Button onClick={() => dispatch(actionLoginWithPhone(userPhone))} variant="contained">
                Send code
              </Button>
            </div>
          </>
        )}
        {enterPhone && (
          <>
            <div className={styles.input_phone}>
              <InputMask
                style={{ width: '210px', textAlign: 'center', fontSize: 25 }}
                className={classes.formInput}
                mask="999999"
                autoFocus
                value={code}
                onChange={handleChangeCode}
              />
            </div>
            <div className={classes.button}>
              <Button
                sx={{ marginBottom: 0 }}
                onClick={() => dispatch(actionLoginWithPhone(userPhone))}
                variant="contained"
              >
                Send new code
              </Button>
            </div>
            <div style={{ marginTop: 20 }} className={classes.button}>
              <Button
                onClick={() =>
                  dispatch(
                    actionConfirmPhone({ code: code, x_app_type: 'dashboard', token: token }),
                  )
                }
                variant="contained"
              >
                Sign in
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default SignInPhone;
