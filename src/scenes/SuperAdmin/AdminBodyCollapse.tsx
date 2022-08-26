import type { RootState } from '@/store';
import {
  actionBlockAdmin,
  actionDeleteAdmin,
  actionGetAdminsList,
  actionGetSingleAdmin,
} from '@/store/slices/SuperAdminSlice/superAdminSlice';
import { SingleAdminData } from '@/store/slices/SuperAdminSlice/type';
import { useStyles } from '@/styles/materialCustom';
import { Button, CircularProgress } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useAppDispatch } from '@/customHooks/storeHooks';
import DeleteIcon from '@mui/icons-material/Delete';
import Box from '@mui/material/Box';
import styles from './SuperAdmin.module.scss';
import collapse from '../../styles/collapse.module.scss';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import IndeterminateCheckBoxIcon from '@mui/icons-material/IndeterminateCheckBox';
import { DateTime } from 'luxon';
interface Props {
  item: SingleAdminData;
}

const style = {
  position: 'absolute' as const,
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  // border: '2px solid #000',
  boxShadow: 10,
  p: 4,
};

const AdminBodyCollapse: React.FC<Props> = ({ item }) => {
  const [open, setOpen] = React.useState(false);
  // console.log(item);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const dispatch = useAppDispatch();
  const lastQueryParams = useSelector((state: RootState) => state.superAdmin.queryList);
  const classes = useStyles();

  const singleAdmin = useSelector((state: RootState) => state.superAdmin.singleAdmin);
  useEffect(() => {
    dispatch(actionGetSingleAdmin(item.id));
  }, []);

  const deleteAdmin = (index: string) => {
    dispatch(actionDeleteAdmin({ id: index }));
    setTimeout(() => {
      dispatch(actionGetAdminsList(lastQueryParams));
    }, 0);
  };
  const blockAdmin = (id: string, status: string) => {
    dispatch(actionBlockAdmin({ id: id, status: status }));
  };

  return (
    <div className={collapse.single_admin_container}>
      {singleAdmin?.isLoading && (
        <CircularProgress sx={{ position: 'absolute', top: '40%', left: '50%' }} />
      )}
      {singleAdmin?.data && !singleAdmin.isLoading ? (
        <>
          <div
            style={{ justifyContent: 'space-between' }}
            className={collapse.admin_info_container}
          >
            <span style={{ fontSize: '18px', display: 'block', marginBottom: '15px' }}>
              Admin info:
            </span>
            <div className={collapse.admin_info_block}>
              <span
                style={{ marginRight: 15, marginBottom: 10, display: 'flex', alignItems: 'center' }}
              >
                {singleAdmin?.data?.status === 'activated' ? (
                  <>
                    <CheckBoxIcon color="success" /> Status: Activated
                  </>
                ) : (
                  <>
                    <IndeterminateCheckBoxIcon color="error" />
                    Status: Blocked
                  </>
                )}
              </span>
              <span className={collapse.admin_info_block_item}>
                First name: {singleAdmin.data.first_name}
              </span>
              <span className={collapse.admin_info_block_item}>
                Last name: {singleAdmin.data.last_name}
              </span>
              <span className={collapse.admin_info_block_item}>
                Email: {singleAdmin.data.email}
              </span>
              <span className={collapse.admin_info_block_item}>
                Created at: {DateTime.fromISO(singleAdmin.data.created_at).toLocaleString()}
              </span>
              <span className={collapse.admin_info_block_item}>
                Email verification: {singleAdmin.data.is_email_verified ? 'Yes' : 'No'}
              </span>
            </div>
          </div>
          <div className={styles.btn_group}>
            <div className={`${classes.button_out} ${collapse.single_admin_btn}`}>
              {singleAdmin?.data?.status === 'activated' ? (
                <Button onClick={() => blockAdmin(item.id, 'deactivated')}>Block</Button>
              ) : (
                <Button onClick={() => blockAdmin(item.id, 'activated')}>Activate</Button>
              )}
            </div>
            <div className={classes.button_out}>
              <Button
                sx={{
                  margin: '10px',
                  width: '200px',
                  flex: 0.5,
                }}
                onClick={handleOpen}
                startIcon={<DeleteIcon />}
              >
                Delete
              </Button>
            </div>
          </div>
        </>
      ) : null}
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Are your sure?
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            You are going to delete?
          </Typography>
          <div className={classes.button_out}>
            <Button
              sx={{
                margin: '10px',
                width: '200px',
                flex: 0.5,
              }}
              onClick={() => deleteAdmin(item.id)}
            >
              Yes
            </Button>
            <Button
              sx={{
                margin: '10px',
                width: '200px',
                flex: 0.5,
              }}
              onClick={handleClose}
            >
              No
            </Button>
          </div>
        </Box>
      </Modal>
    </div>
  );
};

export default AdminBodyCollapse;
