import { useStyles } from '@/styles/materialCustom';
import { Box, Button, CircularProgress, Modal, TextField, Typography } from '@mui/material';
import currency from 'currency.js';
import { useFormik } from 'formik';
import React from 'react';
import styles from './modal.module.scss';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store';
import { actionEditEmail } from '@/store/slices/Profile/profileSlice';
import { useAppDispatch } from '@/customHooks/storeHooks';
import * as Yup from 'yup';
type ChangeEmailModalProps = {
  open: boolean;
  onClose: React.Dispatch<React.SetStateAction<boolean>>;
};

type ErrorsType = {
  email: string | currency;
};

const modalStyle = {
  position: 'absolute' as const,
  top: '50%',
  flexDirection: 'column',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  height: 250,
  backgroundColor: 'background.paper',
  boxShadow: 24,
  p: 4,
  alignItems: 'center',
  justifyContent: 'center',
  display: 'flex',
  flex: 1,
};

const ChangeEmailModal: React.FC<ChangeEmailModalProps> = ({ open, onClose }) => {
  const classes = useStyles();
  const dispatch = useAppDispatch();
  const [changeEmail, setChangeEmail] = React.useState(false);
  const isLoading = useSelector((state: RootState) => state.profile.isLoading);
  const profileData = useSelector((state: RootState) => state.profile.profile);

  const formik = useFormik({
    initialValues: {
      email: profileData.email || '',
    },
    onSubmit: values => {
      dispatch(actionEditEmail(values.email));
      formik.setValues({ email: profileData.email });
      setChangeEmail(true);
    },
    validationSchema: Yup.object().shape({
      email: Yup.string().required('Required').email('No valid email'),
    }),
  });

  const handleClose = () => {
    formik.resetForm();
    setChangeEmail(false);
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
              {profileData.email ? 'Change email' : 'Add new email'}
            </Typography>
            <div className={styles.input_wrapper}>
              <TextField
                id="email"
                label="Email"
                type="email"
                onChange={formik.handleChange}
                value={formik.values.email}
                className={classes.formInput}
                helperText={formik.errors.email}
              />
            </div>

            <div className={styles.btnGroup}>
              <div style={{ height: 36.5 }} className={classes.button}>
                <Button onClick={handleClose} variant="contained">
                  Cancel
                </Button>
              </div>

              <div style={{ height: 36.5 }} className={classes.button}>
                <Button onClick={() => formik.handleSubmit()} variant="contained">
                  {isLoading ? (
                    <CircularProgress size={20} />
                  ) : profileData.email ? (
                    'Change email'
                  ) : (
                    'Add email'
                  )}
                </Button>
              </div>
            </div>
          </form>
        )}
      </Box>
    </Modal>
  );
};

export default ChangeEmailModal;
