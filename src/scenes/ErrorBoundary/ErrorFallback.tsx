import Logo from '@/components/Logo';
import { useAppDispatch } from '@/customHooks/storeHooks';
import { actionClearStore, actionLogout } from '@/store/globalAsyncFunc';
import { useStyles } from '@/styles/materialCustom';
import { Button } from '@mui/material';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../../styles/global.module.scss';
import { FallbackProps } from 'react-error-boundary';
const ErrorFallback: React.FC<FallbackProps> = ({ resetErrorBoundary }) => {
  const classes = useStyles();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  return (
    <div
      style={{
        justifyContent: 'flex-start',
        height: '100vh',
        width: '100vw',
        alignItems: 'center',
      }}
      className={styles.container}
    >
      <div className={styles.header}>
        <div className={styles.wrapper}>
          <Logo />
        </div>
        <div className={styles.header_textWrapper}>
          <h3 className={styles.header_title}>HOPPN DASHBOARD</h3>
        </div>
      </div>
      <div className={styles.body}>
        <h4 style={{ textAlign: 'center' }}>
          Oops... something went wrong, try to update this page or go to home page
        </h4>
        <div className={classes.button_out}>
          <Button
            onClick={async () => {
              await dispatch(actionClearStore());
              setTimeout(() => {
                window.location.reload();
              }, 500);
              resetErrorBoundary();
            }}
          >
            Return to home page
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ErrorFallback;
