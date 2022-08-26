import Logo from '@/components/Logo';
import { useStyles } from '@/styles/materialCustom';
import { Button } from '@mui/material';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../../styles/global.module.scss';

const NotFound: React.FC = () => {
  const classes = useStyles();
  const navigate = useNavigate();
  return (
    <div style={{ justifyContent: 'flex-start' }} className={styles.container}>
      <div className={styles.header}>
        <div className={styles.wrapper}>
          <Logo />
        </div>
        <div className={styles.header_textWrapper}>
          <h3 className={styles.header_title}>HOPPN DASHBOARD</h3>
        </div>
      </div>
      <div className={styles.body}>
        <h4 style={{ textAlign: 'center' }}>Page not found</h4>
        <div className={classes.button_out}>
          <Button
            onClick={() => {
              navigate('/');
            }}
          >
            Return to home page
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
