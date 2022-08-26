import React, { useState } from 'react';
import { useFormik } from 'formik';
import { Button, CircularProgress, TextField } from '@mui/material';
import { useStyles } from '@/styles/materialCustom';
import styles from './Profile.module.scss';
import { useDispatch, useSelector } from 'react-redux';
import {
  actionCreateUserPassword,
  actionEditUserPassword,
} from '@/store/slices/Profile/profileSlice';
import { RootState } from '@/store';
import { useAppDispatch } from '@/customHooks/storeHooks';

interface ValuePassword {
  newPassword: string;
  repeatPassword: string;
}

const CreatePassword: React.FC = () => {
  const dispatch = useAppDispatch();
  const classes = useStyles();
  const isLoading = useSelector((state: RootState) => state.profile.isLoading);
  const [password, setPassword] = useState('');

  const profileData = useSelector((state: RootState) => state.profile.profile);

  const formik = useFormik({
    initialValues: {
      newPassword: '',
      repeatPassword: '',
    },
    onSubmit: values => {
      dispatch(actionCreateUserPassword(values.newPassword));

      formik.setValues({ newPassword: '', repeatPassword: '' });
    },
    validate: values => {
      const errors = {} as ValuePassword;
      if (values.newPassword === '' && formik.touched.newPassword) {
        errors.newPassword = 'Required';
      }
      if (values.newPassword.length > 100) {
        errors.newPassword = 'Too long';
      }
      if (values.newPassword.length < 6) {
        errors.newPassword = 'Too short';
      }
      if (!values.repeatPassword && formik.touched.repeatPassword) {
        errors.repeatPassword = 'Required';
      }

      if (values.repeatPassword !== formik.values.newPassword) {
        errors.repeatPassword = 'Passwords not equal';
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
            id="newPassword"
            label="New password"
            type="password"
            hidden
            autoComplete="new-password"
            onChange={formik.handleChange}
            value={formik.values.newPassword}
            className={classes.formInput}
            helperText={formik.errors.newPassword}
          />
        </div>
        <div className={styles.input_wrapper}>
          <TextField
            id="repeatPassword"
            label="Repeat password"
            type="password"
            hidden
            autoComplete="new-password"
            name="repeatPassword"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.repeatPassword}
            helperText={formik.errors.repeatPassword}
            className={classes.formInput}
          />
        </div>
        <div style={{ height: 36.5 }} className={classes.button}>
          <Button onClick={() => formik.handleSubmit()} variant="contained">
            {isLoading ? <CircularProgress size={20} /> : 'Create password'}
          </Button>
        </div>
      </div>
    </form>
  );
};

export default CreatePassword;
