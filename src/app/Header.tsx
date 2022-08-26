import HeaderLogo from '@/components/HeaderLogo';
import type { RootState } from '@/store';
import { actionClearStore, actionLogout } from '@/store/globalAsyncFunc';
import { actionToggleSidebar } from '@/store/slices/ThemeSlice/themeSlice';
import { useStyles } from '@/styles/materialCustom';
import { Role } from '@/utils/enum/Role';
import LogoutIcon from '@mui/icons-material/Logout';
import MenuIcon from '@mui/icons-material/Menu';
import PersonIcon from '@mui/icons-material/Person';
import {
  AppBar,
  CircularProgress,
  FormControlLabel,
  IconButton,
  Switch,
  Toolbar,
} from '@mui/material';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import styles from './MainStyle.module.scss';
import { styled } from '@mui/material/styles';
import {
  actionGetVendorProfile,
  actionStoreOnline,
} from '@/store/slices/VendorProfile/vendorProfileSlice';
import { useAppDispatch } from '@/customHooks/storeHooks';
import { toFormat } from 'dinero.js';
import { currencyTransformer, Kobo } from '@/utils/dinero';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import { NGN } from '@dinero.js/currencies';
import { actionGetUserProfile } from '@/store/slices/Profile/profileSlice';
import { apiUserLogout } from '@/api/loginAPI';
import { createError } from '@/components/Notofications';

const MaterialUISwitch = styled(Switch)(({ theme }) => ({
  '& .MuiSwitch-switchBase': {
    transform: 'translateX(0px)',
    '&.Mui-checked': {
      color: '#6ed0c3',
      transform: 'translateX(22px)',

      '& + .MuiSwitch-track': {
        opacity: 0.7,
        backgroundColor: '#6ed0c3',
      },
    },
  },
}));

const Header: React.FC = () => {
  const classes = useStyles();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const roles = useSelector((state: RootState) => state.auth.user_roles);
  const isSuperAdmin = roles.includes(Role.Superadmin);

  const isOnline = useSelector((state: RootState) => state.vendorProfile.profile.is_online);
  const [checked, setChecked] = React.useState(isOnline);
  const [block, setBlock] = React.useState(false);
  const vendor = useSelector((state: RootState) => state.vendorProfile.profile);

  const balance = useSelector((state: RootState) => state.profile.profile.balance);

  const handleLogout = () => {
    apiUserLogout()
      .then(() => {
        dispatch(actionClearStore());
      })
      .catch(error => {
        createError(error);
      })
      .finally(() => {
        dispatch(actionClearStore());
      });
  };

  const linkToProfile = () => {
    navigate('/profile');
  };

  const handleAccountMenu = () => {
    if (!isSuperAdmin) {
      linkToProfile();
    }
  };

  useEffect(() => {
    if (!roles.includes(Role.Superadmin)) {
      dispatch(actionGetUserProfile());
    }
  }, []);

  useEffect(() => {
    if (roles.includes(Role.Vendor) || roles.includes(Role.Manager)) {
      dispatch(actionGetVendorProfile());
      setChecked(isOnline);
      setBlock(false);
    }
  }, [isOnline]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setChecked(event.target.checked);
    setBlock(true);
    dispatch(actionStoreOnline(!checked));
  };

  return (
    <AppBar sx={{ flexDirection: 'row' }} className={classes.header} position="static">
      <div onClick={() => navigate('/')} className={styles.header_logo}>
        <HeaderLogo />
      </div>
      <Toolbar>
        <div className={styles.left_header}>
          {roles.includes(Role.Superadmin) ||
          roles.includes(Role.Admin) ||
          roles.includes(Role.Manager) ||
          roles.includes(Role.Vendor) ? (
            <IconButton
              onClick={() => dispatch(actionToggleSidebar(true))}
              size="large"
              edge="start"
              color="inherit"
              aria-label="menu"
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
          ) : null}
          {roles.includes(Role.Vendor) && vendor?.is_approved && (
            <div style={{ position: 'relative' }}>
              {block && (
                <CircularProgress
                  sx={{ position: 'absolute', top: '25%', left: '32%' }}
                  size={20}
                />
              )}
              <FormControlLabel
                checked={isOnline}
                onChange={handleChange}
                value="store"
                control={
                  <MaterialUISwitch
                    disabled={block}
                    color="primary"
                    inputProps={{ 'aria-label': 'controlled' }}
                  />
                }
                label={`Store: ${isOnline ? 'on' : 'off'}`}
                labelPlacement="start"
              />
            </div>
          )}
        </div>
        {roles.includes(Role.Vendor) && !balance ? (
          <div className={styles.balance}>
            <span style={{ marginRight: 40, fontWeight: 600 }}>Balance: NGN 0 </span>
            <IconButton
              size="large"
              onClick={() => dispatch(actionGetUserProfile())}
              aria-controls="user-appbar"
              edge="start"
              color="inherit"
              aria-label="menu"
              sx={{ mr: 0 }}
            >
              <RestartAltIcon />
            </IconButton>
          </div>
        ) : roles.includes(Role.Vendor) && balance ? (
          <div className={styles.balance}>
            <span style={{ marginRight: 10, fontWeight: 600 }}>
              Balance: {toFormat(Kobo(balance), currencyTransformer)}
            </span>
            <IconButton
              size="large"
              onClick={() => dispatch(actionGetUserProfile())}
              aria-controls="user-appbar"
              edge="start"
              color="inherit"
              aria-label="menu"
              sx={{ mr: 0 }}
            >
              <RestartAltIcon />
            </IconButton>
          </div>
        ) : null}
        <div className={styles.right_header}>
          <div style={{ cursor: 'pointer' }} onClick={handleAccountMenu}>
            <span style={{ marginRight: 10 }} className={styles.headerRole}>
              {isSuperAdmin ? 'super admin' : 'profile'}
            </span>
            {!roles.includes(Role.Superadmin) && (
              <IconButton
                size="large"
                aria-controls="user-appbar"
                edge="start"
                color="inherit"
                aria-label="menu"
                sx={{ mr: 0 }}
              >
                <PersonIcon />
              </IconButton>
            )}
          </div>
          <IconButton
            size="large"
            aria-controls="user-appbar"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
            onClick={handleLogout}
          >
            <LogoutIcon />
          </IconButton>
        </div>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
