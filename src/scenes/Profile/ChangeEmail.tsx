import React, { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import { Button, CircularProgress, TextField } from '@mui/material';
import { useStyles } from '@/styles/materialCustom';
import styles from './Profile.module.scss';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store';
import { actionEditEmail } from '@/store/slices/Profile/profileSlice';
import { useAppDispatch } from '@/customHooks/storeHooks';
interface ValueEmail {
  email: string;
}

type ErrorsType = {
  email: string;
};

const ChangeEmail: React.FC = () => {
  const dispatch = useAppDispatch();
  const classes = useStyles();
  const isLoading = useSelector((state: RootState) => state.profile.isLoading);

  const profileData = useSelector((state: RootState) => state.profile.profile);

  const formik = useFormik({
    initialValues: {
      email: profileData.email || '',
    },
    onSubmit: values => {
      dispatch(actionEditEmail(values.email));

      formik.setValues({ email: profileData.email });
    },
    validate: values => {
      const errors = {} as ValueEmail;
      if (values.email) {
        if (values.email.length > 100) {
          errors.email = 'Too long';
        }
      }
      return errors;
    },
  });

  useEffect(() => {
    if (profileData.email) {
      formik.setValues({
        email: profileData.email,
      });
    }
  }, [profileData]);

  return (
    <form
      className={styles.form}
      onSubmit={() => {
        formik.handleSubmit(), formik.resetForm();
      }}
    >
      <div>
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
  );
};

export default ChangeEmail;
