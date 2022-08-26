import type { RootState } from '@/store';
import { actionAcceptInvite } from '@/store/globalAsyncFunc';
import { actionEditUserProfile, actionGetUserProfile } from '@/store/slices/Profile/profileSlice';
import { useStyles } from '@/styles/materialCustom';
import { Role } from '@/utils/enum/Role';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import { Button, CircularProgress, TextField } from '@mui/material';
import { useFormik } from 'formik';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useAppDispatch } from '@/customHooks/storeHooks';
import { useNavigate } from 'react-router-dom';
import ChangePassword from './ChangePassword';
import styles from './Profile.module.scss';
import jwt_decode from 'jwt-decode';
import ChangeEmail from './ChangeEmail';
import ChangeEmailModal from '@/components/Modals/ChangeEmailModal';
import ChangePasswordModal from '@/components/Modals/ChangePasswordModal';
import ChangePhoneModal from '@/components/Modals/ChangePhoneModal';
import { apiResendEmailCode } from '@/api/usersAPI';

const Profile: React.FC = () => {
  const dispatch = useAppDispatch();
  const classes = useStyles();
  const token = useSelector((state: RootState) => state.auth.inviteToken);
  const profileData = useSelector((state: RootState) => state.profile.profile);
  const isLoading = useSelector((state: RootState) => state.profile.isLoading);
  const roles = useSelector((state: RootState) => state.auth.user_roles);
  const [tokenData, setTokenData] = useState(null);
  const [editProfile, setEditProfile] = useState(true);
  const [openEmailModal, setOpenEmailModal] = useState(false);
  const [openPasswordModal, setOpenPasswordModal] = useState(false);
  const [opentPhoneModal, setOpenPhoneModal] = useState(false);

  useEffect(() => {
    dispatch(actionGetUserProfile());
    if (token) {
      setTokenData(jwt_decode(token));
    }
  }, [roles]);

  const acceptInvite = () => {
    dispatch(actionAcceptInvite(token));
    dispatch(actionGetUserProfile());
  };

  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      first_name: '',
      last_name: '',
    },
    onSubmit: values => {
      dispatch(
        actionEditUserProfile({ first_name: values.first_name, last_name: values.last_name }),
      );
      setEditProfile(true);
    },
  });

  useEffect(() => {
    formik.setValues({
      first_name: profileData?.first_name,
      last_name: profileData?.last_name,
    });
  }, [profileData]);

  return (
    <>
      {!profileData ? (
        <CircularProgress />
      ) : (
        <div className={styles.profile_container}>
          {token &&
            !roles.includes(Role.Vendor) &&
            !roles.includes(Role.Manager) &&
            !roles.includes(Role.Picker) && (
              <div className={styles.invite_container}>
                <h4 style={{ textDecoration: 'underline' }}>
                  Company: &quot;{tokenData?.company_name}&quot; invite you at work as{' '}
                  {tokenData?.type}
                </h4>
                <div className={styles.accept_block}>
                  <div className={classes.button}>
                    <Button onClick={acceptInvite}>Accept invite</Button>
                  </div>
                </div>
              </div>
            )}
          <div className={styles.content_block}>
            <div className={styles.user_info}>
              <div className={styles.avatar}>
                <PersonOutlineIcon sx={{ fontSize: '150px', fontWeight: 300 }} />
              </div>
              <h1
                className={styles.names}
              >{`${profileData.first_name} ${profileData.last_name}`}</h1>
              <div className={styles.users_data}>
                <span className={styles.roles}>
                  Roles:{' '}
                  {profileData.roles &&
                    profileData.roles.map(role => {
                      return `${role.name}, `;
                    })}
                </span>
                <ul className={styles.list}>
                  <li className={styles.list_item}>
                    Email: <span className={styles.list_item_span}>{profileData?.email}</span>
                  </li>

                  <li className={styles.list_item}>
                    Verification email:{' '}
                    <span className={styles.list_item_span}>
                      {profileData?.is_email_verified ? 'Yes' : 'No'}
                    </span>
                  </li>
                  <li className={styles.list_item}>
                    Phone number:{' '}
                    <span className={styles.list_item_span}>{profileData?.phone_number}</span>
                  </li>
                </ul>
                <div
                  style={{ display: 'flex', justifyContent: 'center' }}
                  className={styles.buttons}
                >
                  {!roles.includes(Role.Vendor) && (
                    <div style={{ flex: 1 }} className={classes.button_out}>
                      <Button onClick={() => navigate('/vendor/create_profile')}>
                        Become vendor
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className={styles.profileInfo}>
              <h4 className={styles.title}>Edit profile:</h4>
              <div className={styles.nameInfo}>
                <form onSubmit={formik.handleSubmit}>
                  <div>
                    <div className={styles.input_wrapper}>
                      <TextField
                        id="first_name"
                        label="First name"
                        disabled={editProfile}
                        type="text"
                        autoComplete="first_name"
                        onChange={formik.handleChange}
                        value={formik.values.first_name}
                        className={classes.formInput}
                      />
                    </div>
                    <div className={styles.input_wrapper}>
                      <TextField
                        id="last_name"
                        label="Last name"
                        disabled={editProfile}
                        type="text"
                        name="last_name"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.last_name}
                        helperText={formik.errors.last_name}
                        className={classes.formInput}
                      />
                    </div>
                    <div style={{ height: 36.5 }} className={classes.button}>
                      {editProfile && (
                        <Button onClick={() => setEditProfile(false)} variant="contained">
                          {isLoading ? <CircularProgress size={20} /> : 'Update profile'}
                        </Button>
                      )}
                      {!editProfile && (
                        <Button type="submit" variant="contained">
                          {isLoading ? <CircularProgress size={20} /> : 'Save changes'}
                        </Button>
                      )}
                    </div>
                  </div>
                </form>
              </div>
              <div className={styles.nameInfo}>
                <div style={{ height: 36.5 }} className={classes.button}>
                  <Button onClick={() => setOpenEmailModal(true)} variant="contained">
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
              <div className={styles.nameInfo}>
                <div style={{ height: 36.5 }} className={classes.button}>
                  <Button onClick={() => setOpenPhoneModal(true)} variant="contained">
                    {isLoading ? (
                      <CircularProgress size={20} />
                    ) : profileData.phone_number ? (
                      'Change phone'
                    ) : (
                      'Add phone'
                    )}
                  </Button>
                </div>
              </div>
              <div className={styles.nameInfo}>
                <div style={{ height: 36.5 }} className={classes.button}>
                  <Button onClick={() => setOpenPasswordModal(true)} variant="contained">
                    {isLoading ? (
                      <CircularProgress size={20} />
                    ) : profileData.is_password_set ? (
                      'Change password'
                    ) : (
                      'Create password'
                    )}
                  </Button>
                </div>
              </div>
              {profileData.email && !profileData.is_email_verified && (
                <div className={styles.nameInfo}>
                  <div style={{ height: 36.5 }} className={classes.button}>
                    <Button onClick={() => apiResendEmailCode()} variant="contained">
                      {isLoading ? <CircularProgress size={20} /> : 'Resend confirmation email'}
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      <ChangeEmailModal open={openEmailModal} onClose={setOpenEmailModal} />
      <ChangePasswordModal open={openPasswordModal} onClose={setOpenPasswordModal} />
      <ChangePhoneModal open={opentPhoneModal} onClose={setOpenPhoneModal} />
    </>
  );
};

export default Profile;
