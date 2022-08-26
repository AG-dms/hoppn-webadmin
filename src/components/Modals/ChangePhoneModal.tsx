import { useStyles } from '@/styles/materialCustom';
import { Box, Button, CircularProgress, Modal, TextField, Typography } from '@mui/material';
import currency from 'currency.js';
import { useFormik } from 'formik';
import React from 'react';
import styles from './modal.module.scss';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store';
import {
  actionCreateUserPassword,
  actionEditEmail,
  actionEditUserPassword,
  actionGetUserProfile,
} from '@/store/slices/Profile/profileSlice';
import { useAppDispatch } from '@/customHooks/storeHooks';
import PhoneInput, {
  formatPhoneNumber,
  formatPhoneNumberIntl,
  isValidPhoneNumber,
} from 'react-phone-number-input';
import InputMask from 'react-input-mask';
import { apiAddPhoneNumber, apiConfirmPhone } from '@/api/usersAPI';
import { createError, createErrorThrottler, createNotification } from '../Notofications';
import 'react-phone-number-input/style.css';
import { isAxiosError } from '@/utils/type-guards/isAxiosError';

type ChangePhoneModalProps = {
  open: boolean;
  onClose: React.Dispatch<React.SetStateAction<boolean>>;
};

interface ErrorsType {
  Phone: string;
}

const modalStyle = {
  position: 'absolute' as const,
  top: '50%',
  flexDirection: 'column',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  height: 300,
  backgroundColor: 'background.paper',
  boxShadow: 24,
  p: 4,
  alignItems: 'center',
  justifyContent: 'center',
  display: 'flex',
  flex: 1,
};

const ChangePhoneModal: React.FC<ChangePhoneModalProps> = ({ open, onClose }) => {
  const classes = useStyles();
  const dispatch = useAppDispatch();
  const [enterPhone, setEnterPhone] = React.useState(false);
  const isLoading = useSelector((state: RootState) => state.profile.isLoading);
  const profileData = useSelector((state: RootState) => state.profile.profile);
  const [phone, setPhone] = React.useState('');
  const [code, setCode] = React.useState('');

  const handleClose = () => {
    onClose(false);
    setEnterPhone(false);
    setPhone('');
    setCode('');
  };

  const handleChangeCode = e => {
    setCode(e.target.value);
  };

  const sentPhone = () => {
    apiAddPhoneNumber(phone)
      .then(() => {
        setEnterPhone(true);
      })
      .catch((error: unknown) => {
        if (isAxiosError(error) && error.response.data.statusCode === 429) {
          createErrorThrottler(error);
        } else {
          createError(error);
        }
      });
  };

  const sentCode = () => {
    apiConfirmPhone(phone, code)
      .then(() => {
        handleClose();
        createNotification('success', 'Phone number updated');
        dispatch(actionGetUserProfile());
      })
      .catch(error => {
        createError(error);
      })
      .finally(() => {
        handleClose();
      });
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={modalStyle}>
        <Typography sx={{ marginBottom: 1 }} variant="h6">
          Enter phone number
        </Typography>
        <div
          style={{ display: 'flex', flexDirection: 'column' }}
          className={`${styles.input_wrapper} `}
        >
          <PhoneInput
            international
            className={styles.input_phone}
            placeholder="Enter phone number"
            defaultCountry="NG"
            value={phone}
            error={
              phone
                ? isValidPhoneNumber(phone)
                  ? undefined
                  : 'Invalid phone number'
                : 'Phone number required'
            }
            onChange={setPhone}
          />
          <div style={{ height: '36.5px', marginTop: 20 }} className={classes.button}>
            <Button onClick={sentPhone} variant="contained">
              Enter phone
            </Button>
          </div>
        </div>

        {enterPhone && (
          <div>
            <div className={styles.code_container}>
              <Typography sx={{ marginBottom: 1 }} variant="h6">
                Enter code
              </Typography>
              <div className={styles.input_phone}>
                <InputMask
                  style={{ width: '100%', textAlign: 'center', fontSize: 25 }}
                  className={classes.formInput}
                  mask="999999"
                  autoFocus
                  value={code}
                  onChange={handleChangeCode}
                />
              </div>

              <div style={{ width: 243 }} className={classes.button}>
                <Button onClick={sentCode} variant="contained">
                  Send code
                </Button>
              </div>
            </div>
          </div>
        )}
      </Box>
    </Modal>
  );
};

export default ChangePhoneModal;
