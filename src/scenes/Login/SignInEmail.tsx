import { actionLogin } from '@/store/slices/Auth/authSlice';
import { useStyles } from '@/styles/materialCustom';
import { Button, TextField } from '@mui/material';
import { useFormik } from 'formik';
import React from 'react';
import { useAppDispatch } from '@/customHooks/storeHooks';
import styles from './login.module.scss';
type ErrorsType = {
  login: string;
  password: string;
};

const SignInEmail: React.FC = () => {
  const dispatch = useAppDispatch();
  const classes = useStyles();

  const formik = useFormik({
    initialValues: {
      login: '',
      password: '',
    },
    onSubmit: values => {
      dispatch(actionLogin({ userName: values.login, password: values.password }));
    },
    validate: values => {
      const errors = {} as ErrorsType;
      if (values.login === '') {
        errors.login = 'Required';
      }
      if (values.login.length > 100) {
        errors.login = 'Too long';
      }
      if (!values.password) {
        errors.password = 'Required';
      }
      return {} as ErrorsType;
    },
  });
  return (
    <form className={styles.form_container} onSubmit={formik.handleSubmit}>
      <div>
        <div className={styles.input_wrapper}>
          <TextField
            id="login"
            label="login"
            type="text"
            autoComplete="login"
            onChange={formik.handleChange}
            value={formik.values.login}
            helperText={formik.errors.login}
            className={classes.formInput}
          />
        </div>
        <div className={styles.input_wrapper}>
          <TextField
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
        <div style={{ height: '36.5px' }} className={classes.button}>
          <Button type="submit" variant="contained">
            Sign in
          </Button>
        </div>
      </div>
    </form>
  );
};

export default SignInEmail;
