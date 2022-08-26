import React from 'react';
import styles from './login.module.scss';
import Logo from '@/components/Logo';
import { useFormik } from 'formik';
import { actionLogin, actionRegistration } from '@/store/slices/Auth/authSlice';
import { useDispatch } from 'react-redux';
import TextField from '@mui/material/TextField';
import { makeStyles } from '@mui/styles';
import { useStyles } from '@/styles/materialCustom';
import Button from '@mui/material/Button';
import { useAppDispatch } from '@/customHooks/storeHooks';

type ErrorsType = {
  email: string;
  password: string;
  confirmPassword: string;
};

const SignUp: React.FC = () => {
  const dispatch = useAppDispatch();
  const classes = useStyles();

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
      confirmPassword: '',
    },
    onSubmit: values => {
      dispatch(actionRegistration({ userName: values.email, password: values.password }));
    },
    validate: values => {
      const errors = {} as ErrorsType;
      const reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
      if (values.email === '') {
        errors.email = 'Required';
      }
      if (values.email.length > 100) {
        errors.email = 'Too long';
      }
      if (!values.password) {
        errors.password = 'Required';
      }
      if (values.confirmPassword !== values.password) {
        errors.confirmPassword = 'Password mismatch';
      }
      return errors;
    },
  });
  return (
    <>
      <form className={styles.form_container} onSubmit={formik.handleSubmit}>
        <div>
          <div className={styles.input_wrapper}>
            <TextField
              id="email"
              label="Email"
              type="email"
              autoComplete="email"
              onChange={formik.handleChange}
              value={formik.values.email}
              helperText={formik.errors.email}
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
          <div className={styles.input_wrapper}>
            <TextField
              id="confirmPassword"
              label="repeat password"
              type="password"
              name="confirmPassword"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              autoComplete="new-password"
              value={formik.values.confirmPassword}
              helperText={formik.errors.confirmPassword}
              className={classes.formInput}
            />
          </div>
          <div className={classes.button}>
            <Button type="submit" variant="contained">
              Sign up
            </Button>
          </div>
        </div>
      </form>
    </>
  );
};

export default SignUp;
