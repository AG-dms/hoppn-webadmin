import React from 'react';
import { useFormik } from 'formik';
import styles from './SuperAdmin.module.scss';
import TextField from '@mui/material/TextField';
import { useStyles } from '@/styles/materialCustom';
import Button from '@mui/material/Button';
import { useDispatch, useSelector } from 'react-redux';
import { actionCreateAdmin } from '@/store/slices/SuperAdminSlice/superAdminSlice';
import type { RootState } from '@/store';

import { useAppDispatch } from '@/customHooks/storeHooks';
type ErrorsType = {
  login: string;
  password: string;
};

const CreateAdmin = () => {
  const classes = useStyles();

  const dispatch = useAppDispatch();
  const lastQueryParams = useSelector((state: RootState) => state.superAdmin.queryList);

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    onSubmit: values => {
      dispatch(
        actionCreateAdmin({ email: values.email, password: values.password, lastQueryParams }),
      );
      formik.resetForm();
    },
    validate: values => {
      const errors = {} as ErrorsType;
      if (values.email === '') {
        errors.login = 'Required';
      }
      if (values.email.length > 100) {
        errors.login = 'Too long';
      }
      if (!values.password) {
        errors.password = 'Required';
      }
      if (values.password.length < 6) {
        errors.password = 'Password must be contains minimum 6 symbols';
      }
      return errors;
    },
  });

  return (
    <>
      <div className={styles.create_wrapper}>
        <h3 className={styles.page_title}>Create new admin</h3>
        <div className={styles.container}>
          <form className={styles.form_container} onSubmit={formik.handleSubmit}>
            <div className={styles.input_wrapper}>
              <span className={styles.input_title}>Email</span>
              <TextField
                sx={{
                  marginBottom: '15px',
                }}
                id="email"
                label="email"
                type="text"
                autoComplete="email"
                onChange={formik.handleChange}
                value={formik.values.email}
                helperText={formik.errors.email}
                className={classes.formInput}
              />
            </div>
            <div className={styles.input_wrapper}>
              <span className={styles.input_title}>Password</span>
              <TextField
                sx={{
                  marginBottom: '15px',
                }}
                id="password"
                label="password"
                type="password"
                name="password"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                autoComplete="new-password"
                value={formik.values.password}
                helperText={formik.errors.password}
                className={classes.formInput}
              />
            </div>
            <div className={classes.button}>
              <Button type="submit" variant="contained">
                Create admin
              </Button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default CreateAdmin;
