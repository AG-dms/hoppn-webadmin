import { actionLogin } from '@/store/slices/Auth/authSlice';
import { useStyles } from '@/styles/materialCustom';
import { TabContext, TabList, TabPanel } from '@mui/lab';
import { Tab, Tabs } from '@mui/material';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { useFormik } from 'formik';
import React from 'react';
import { useDispatch } from 'react-redux';
import styles from './login.module.scss';
import SignInEmail from './SignInEmail';
import SignInPhone from './SignInPhone';
import { useAppDispatch } from '@/customHooks/storeHooks';

type ErrorsType = {
  login: string;
  password: string;
};

const SignIn: React.FC = () => {
  const dispatch = useAppDispatch();
  const classes = useStyles();
  const [value, setValue] = React.useState('1');

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

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
      return errors;
    },
  });
  return (
    <div className={classes.tabs_container}>
      <TabContext value={value}>
        <div>
          <TabList
            centered
            className={classes.tabs}
            onChange={handleChange}
            aria-label="lab API tabs example"
          >
            <Tab
              sx={{
                fontSize: 12,
                color: 'black !important',
                '&:hover': {
                  color: '#1890ff',
                },
              }}
              label="Email"
              value="1"
            />

            <Tab
              sx={{
                fontSize: 12,
                color: 'black !important',
                '&:hover': {
                  color: '#1890ff',
                },
              }}
              label="Phone"
              value="2"
            />
          </TabList>
        </div>
        <TabPanel sx={{ width: 400 }} value="1">
          <SignInEmail />
        </TabPanel>
        <TabPanel value="2">
          <SignInPhone />
        </TabPanel>
      </TabContext>
    </div>
  );
};

export default SignIn;
