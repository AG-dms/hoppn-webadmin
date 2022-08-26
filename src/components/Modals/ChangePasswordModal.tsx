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
} from '@/store/slices/Profile/profileSlice';
import { useAppDispatch } from '@/customHooks/storeHooks';
import * as Yup from 'yup';

type ChangePasswordModalProps = {
  open: boolean;
  onClose: React.Dispatch<React.SetStateAction<boolean>>;
};

interface ValuePassword {
  currentPassword: string;
  newPassword: string;
  newPasswordRepeat: string;
}

const modalStyle = {
  position: 'absolute' as const,
  top: '50%',
  flexDirection: 'column',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  height: 360,
  backgroundColor: 'background.paper',
  boxShadow: 24,
  p: 4,
  alignItems: 'center',
  justifyContent: 'center',
  display: 'flex',
  flex: 1,
};

const ChangePasswordModal: React.FC<ChangePasswordModalProps> = ({ open, onClose }) => {
  const classes = useStyles();
  const dispatch = useAppDispatch();
  const [changeEmail, setChangeEmail] = React.useState(false);
  const isLoading = useSelector((state: RootState) => state.profile.isLoading);
  const profileData = useSelector((state: RootState) => state.profile.profile);

  const formik = useFormik({
    initialValues: {
      currentPassword: '',
      newPassword: '',
      newPasswordRepeat: '',
    },
    onSubmit: values => {
      if (profileData.is_password_set) {
        dispatch(
          actionEditUserPassword({
            currentPassword: values.currentPassword,
            newPassword: values.newPassword,
          }),
        );
      } else {
        dispatch(actionCreateUserPassword(values.currentPassword));
      }

      formik.resetForm();
      onClose(false);
    },
    validate: values => {
      const errors = {} as ValuePassword;
      if (values.currentPassword === '' && formik.touched.currentPassword) {
        errors.currentPassword = 'Required';
      }
      if (values.newPassword.length > 100 && formik.touched.newPassword) {
        errors.newPassword = 'Too long';
      }
      if (values.newPassword.length < 6 && formik.touched.newPassword) {
        errors.newPassword = 'Too short';
      }
      if (!profileData.is_password_set) {
        if (values.newPassword !== values.currentPassword) {
          errors.newPassword = 'Passwords not equal';
        }
      }
      if (profileData.is_password_set) {
        if (values.newPassword !== values.newPasswordRepeat) {
          errors.newPassword = 'Passwords not equal';
          errors.newPasswordRepeat = 'Passwords not equal';
        }
      }
      if (!values.newPassword && formik.touched.currentPassword) {
        errors.newPassword = 'Required';
      }
      return errors;
    },
  });

  const handleClose = () => {
    formik.resetForm();
    onClose(false);
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={modalStyle}>
        {changeEmail && (
          <Box sx={modalStyle}>
            <Typography id="modal-modal-title" variant="h6" component="h2">
              We have sent an email to you
            </Typography>
            <Typography id="modal-modal-description" sx={{ mt: 2 }}>
              Follow the instructions in the email to confirm the changes.
            </Typography>
            <div className={classes.button_out}>
              <Button
                sx={{
                  margin: '10px',
                  width: '200px',
                  flex: 0.5,
                }}
                onClick={handleClose}
              >
                Ok
              </Button>
            </div>
          </Box>
        )}
        {!changeEmail && (
          <form
            className={styles.form}
            onSubmit={() => {
              formik.handleSubmit(), formik.resetForm();
            }}
          >
            <Typography
              sx={{ marginBottom: 1, textAlign: 'center' }}
              id="modal-modal-title"
              variant="h6"
              component="h2"
            >
              {profileData.is_password_set ? 'Change password' : 'Create password'}
            </Typography>
            <div className={styles.input_wrapper}>
              <TextField
                id="currentPassword"
                label="Password"
                name="currentPassword"
                type="password"
                onChange={formik.handleChange}
                value={formik.values.currentPassword}
                className={classes.formInput}
                helperText={formik.errors.currentPassword}
              />
            </div>
            <div className={styles.input_wrapper}>
              <TextField
                id="newPassword"
                label={profileData.is_password_set ? 'New password' : 'Repeat password'}
                type="password"
                onChange={formik.handleChange}
                value={formik.values.newPassword}
                className={classes.formInput}
                helperText={formik.errors.newPassword}
              />
            </div>
            {profileData.is_password_set && (
              <div className={styles.input_wrapper}>
                <TextField
                  id="newPasswordRepeat"
                  label={'New password repeat'}
                  type="password"
                  onChange={formik.handleChange}
                  value={formik.values.newPasswordRepeat}
                  className={classes.formInput}
                  helperText={formik.errors.newPasswordRepeat}
                />
              </div>
            )}

            <div className={styles.btnGroup}>
              <div style={{ height: 36.5 }} className={classes.button}>
                <Button onClick={handleClose} variant="contained">
                  Cancel
                </Button>
              </div>

              <div style={{ height: 36.5 }} className={classes.button}>
                <Button onClick={() => formik.handleSubmit()} variant="contained">
                  {isLoading ? <CircularProgress size={20} /> : 'Change password'}
                </Button>
              </div>
            </div>
          </form>
        )}
      </Box>
    </Modal>
  );
};

export default ChangePasswordModal;
