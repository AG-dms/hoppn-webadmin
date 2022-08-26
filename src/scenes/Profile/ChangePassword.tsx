import React, { useState } from 'react';
import { useFormik } from 'formik';
import { Button, CircularProgress, TextField } from '@mui/material';
import { useStyles } from '@/styles/materialCustom';
import styles from './Profile.module.scss';
import { useDispatch, useSelector } from 'react-redux';
import { actionEditUserPassword } from '@/store/slices/Profile/profileSlice';
import { RootState } from '@/store';
import { useAppDispatch } from '@/customHooks/storeHooks';
interface ValuePassword {
  currentPassword: string;
  newPassword: string;
}

const ChangePassword: React.FC = () => {
  const dispatch = useAppDispatch();
  const classes = useStyles();
  const isLoading = useSelector((state: RootState) => state.profile.isLoading);
  const [password, setPassword] = useState('');

  const formik = useFormik({
    initialValues: {
      currentPassword: password || '',
      newPassword: '',
    },
    onSubmit: values => {
      dispatch(
        actionEditUserPassword({
          currentPassword: values.currentPassword,
          newPassword: values.newPassword,
        }),
      );

      formik.setValues({ currentPassword: '', newPassword: '' });
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
      if (!values.newPassword && formik.touched.currentPassword) {
        errors.newPassword = 'Required';
      }
      return errors;
    },
  });
  return (
    <form
      onSubmit={() => {
        formik.handleSubmit(), formik.resetForm();
      }}
    >
      <div>
        <div className={styles.input_wrapper}>
          <TextField
            id="currentPassword"
            label="Current password"
            type="password"
            hidden={true}
            autoComplete="new-password"
            onChange={formik.handleChange}
            value={formik.values.currentPassword}
            className={classes.formInput}
            helperText={formik.errors.currentPassword}
          />
        </div>
        <div className={styles.input_wrapper}>
          <TextField
            id="newPassword"
            label="New password"
            type="password"
            hidden={true}
            autoComplete="new-password"
            name="newPassword"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.newPassword}
            helperText={formik.touched.newPassword ? formik.errors.newPassword : null}
            className={classes.formInput}
          />
        </div>
        <div style={{ height: 36.5 }} className={classes.button}>
          <Button onClick={() => formik.handleSubmit()} variant="contained">
            {isLoading ? <CircularProgress size={20} /> : 'Change password'}
          </Button>
        </div>
      </div>
    </form>
  );
};

export default ChangePassword;
