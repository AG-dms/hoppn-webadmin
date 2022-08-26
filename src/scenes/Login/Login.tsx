import React from 'react';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import styles from './login.module.scss';
import Logo from '@/components/Logo';
import SignIn from './SignIn';
import SignUp from './SignUp';
import { useStyles } from '@/styles/materialCustom';

interface Props {
  token?: string;
}

const Login: React.FC<Props> = ({ token }) => {
  const [value, setValue] = React.useState('1');
  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };
  const classes = useStyles();

  return (
    <div className={styles.login_container}>
      <div className={styles.login_header}>
        <div className={styles.logo_wrapper}>
          <Logo />
        </div>
        <div className={styles.login_header_textWrapper}>
          <h3 className={styles.login_header_title}>HOPPN DASHBOARD</h3>
        </div>
      </div>
      <TabContext value={value}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <TabList
            className={classes.tabs}
            onChange={handleChange}
            aria-label="lab API tabs example"
          >
            <Tab label="Sign in" value="1" />
            <Tab label="Sign up" value="2" />
          </TabList>
        </Box>
        <div className={styles.signContainer}>
          <TabPanel value="1">
            <SignIn />
          </TabPanel>
          <TabPanel value="2">
            <SignUp />
          </TabPanel>
        </div>
      </TabContext>
    </div>
  );
};

export default Login;
