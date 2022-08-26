import { UserListData } from '@/api/dto/UserResponseData';
import useQuery from '@/customHooks/useQuery';
import type { RootState } from '@/store';
import { actionChangeUserStatus } from '@/store/slices/AdminSlice/adminSlice';
import { actionGetInviteToken } from '@/store/slices/Auth/authSlice';
import { useStyles } from '@/styles/materialCustom';
import { Role } from '@/utils/enum/Role';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import IndeterminateCheckBoxIcon from '@mui/icons-material/IndeterminateCheckBox';
import { Button, CircularProgress } from '@mui/material';
import { DateTime } from 'luxon';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useAppDispatch } from '@/customHooks/storeHooks';
// import styles from '../SuperAdmin/SuperAdmin.module.scss';
import styles from '../../styles/collapse.module.scss';
import { apiGetSingleUser } from '@/api/usersAPI';
interface Props {
  item: UserListData;
}

const SingleUserCollapse: React.FC<Props> = ({ item }) => {
  const [SingleUserData, setSingleUserData] = useState<UserListData>(null);
  const [isLoading, setIsLoading] = useState(false);

  const classes = useStyles();
  const dispatch = useAppDispatch();

  useEffect(() => {
    setIsLoading(true);
    apiGetSingleUser(item.id).then(response => setSingleUserData(response));
    setIsLoading(false);
  }, []);

  const handleClick = async (id: string, status: string) => {
    await dispatch(actionChangeUserStatus({ id: id, status: status }));
    await apiGetSingleUser(item.id).then(response => setSingleUserData(response));
  };

  const query = useQuery();
  const token = query.get('token');
  if (token) {
    dispatch(actionGetInviteToken(token));
  }

  return (
    <div className={styles.single_admin_container}>
      {isLoading && <CircularProgress sx={{ position: 'absolute', top: '40%', left: '50%' }} />}
      {SingleUserData && !isLoading ? (
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <div className={styles.admin_info_container}>
            <span style={{ fontSize: '18px', display: 'block', marginBottom: '15px' }}>
              User info:
            </span>
            <div className={styles.admin_info_block}>
              <span
                style={{ marginRight: 15, marginBottom: 10, display: 'flex', alignItems: 'center' }}
              >
                {SingleUserData.status === 'activated' ? (
                  <>
                    <CheckBoxIcon color="success" /> Activated
                  </>
                ) : (
                  <>
                    <IndeterminateCheckBoxIcon color="error" />
                    Deactivated
                  </>
                )}
              </span>
              <span className={styles.admin_info_block_item}>
                <span style={{ fontWeight: 600 }}> First name:</span> {SingleUserData?.first_name}
              </span>
              <span className={styles.admin_info_block_item}>
                <span style={{ fontWeight: 600 }}>Last name:</span> {SingleUserData?.last_name}
              </span>
              <span className={styles.admin_info_block_item}>
                <span style={{ fontWeight: 600 }}>Email:</span> {SingleUserData?.email}
              </span>
              <span className={styles.admin_info_block_item}>
                <span style={{ fontWeight: 600 }}> Phone:</span> {SingleUserData?.phone_number}
              </span>
              <span className={styles.admin_info_block_item}>
                <span style={{ fontWeight: 600 }}>Roles:</span>{' '}
                {SingleUserData?.roles.map(role => role.name).join(' / ')}
              </span>
              <span className={styles.admin_info_block_item}>
                <span style={{ fontWeight: 600 }}>Created at:</span>{' '}
                {DateTime.fromISO(SingleUserData?.created_at).toLocaleString()}
              </span>
              <span className={styles.admin_info_block_item}>
                <span style={{ fontWeight: 600 }}>Email verification:</span>{' '}
                {SingleUserData?.isEmailVerified ? 'Yes' : 'No'}
              </span>
            </div>
          </div>
          {SingleUserData.roles.every(role => {
            return role.name !== 'admin';
          }) && (
            <>
              <div style={{ marginBottom: '15px', width: '200px' }} className={classes.button_out}>
                <Button
                  onClick={() =>
                    handleClick(
                      item.id,
                      SingleUserData.status === 'activated' ? 'deactivated' : 'activated',
                    )
                  }
                >
                  {SingleUserData.status === 'activated' ? 'disable' : 'activate'}
                </Button>
              </div>
            </>
          )}
        </div>
      ) : null}
    </div>
  );
};

export default SingleUserCollapse;
