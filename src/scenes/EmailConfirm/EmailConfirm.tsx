import { apiEmailConfirm } from '@/api/loginAPI';
import Logo from '@/components/Logo';
import { createError, createNotification } from '@/components/Notofications';
import { useAppDispatch } from '@/customHooks/storeHooks';
import { actionToggleSidebar } from '@/store/slices/ThemeSlice/themeSlice';
import { useStyles } from '@/styles/materialCustom';
import { Button } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Email.module.scss';
type Props = { token: string };

const EmailConfirm: React.FC<Props> = ({ token }) => {
  const classes = useStyles();
  const [confirm, setConfirm] = useState('');
  const dispatch = useAppDispatch();
  const confirmEmail = () => {
    apiEmailConfirm(token)
      .then(() => {
        createNotification('success', 'Email confirmed');
        setConfirm('success');
      })
      .catch(error => {
        createError(error);
        setConfirm('error');
      });
  };

  useEffect(() => {
    dispatch(actionToggleSidebar(false));
  }, []);

  return (
    <div className={styles.scene_container}>
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.wrapper}>
            <Logo />
          </div>
          <div className={styles.header_textWrapper}>
            <h3 className={styles.header_title}>HOPPN</h3>
          </div>
        </div>
        <h3 style={{ marginTop: 10 }}>Email confirmation</h3>
        <div className={styles.body}>
          {!confirm && (
            <>
              <span>Please kindly confirm your email to continue using the Hoppn app</span>
              <div style={{ width: '100%', marginTop: 15 }} className={classes.button}>
                <Button onClick={confirmEmail}>Confirm</Button>
              </div>
            </>
          )}
          {confirm === 'success' && <span>Success! Your email has been verified</span>}
          {confirm === 'error' && <span>Sorry, something went wrong</span>}
        </div>
      </div>
    </div>
  );
};

export default EmailConfirm;
