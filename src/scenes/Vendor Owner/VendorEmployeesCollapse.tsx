import type { RootState } from '@/store';
import { SingleAdminData } from '@/store/slices/SuperAdminSlice/type';
import {
  actionDeleteEmployee,
  actionGetVendorEmployees,
} from '@/store/slices/VendorOwnerSlice/vendorOwnerSlice';
import { useStyles } from '@/styles/materialCustom';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import DeleteIcon from '@mui/icons-material/Delete';
import IndeterminateCheckBoxIcon from '@mui/icons-material/IndeterminateCheckBox';
import { Button } from '@mui/material';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Typography from '@mui/material/Typography';
import { DateTime } from 'luxon';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styles from '../SuperAdmin/SuperAdmin.module.scss';
import { useAppDispatch } from '@/customHooks/storeHooks';

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

const VendorEmployeesCollapse: React.FC<Props> = ({ item }) => {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const dispatch = useAppDispatch();
  const lastQueryParams = useSelector((state: RootState) => state.vendorOwner.queryList);
  const classes = useStyles();

  const userId = useSelector((state: RootState) => state.auth.user_id);

  const deleteEmployee = (index: string) => {
    dispatch(actionDeleteEmployee(index));
    setTimeout(() => {
      dispatch(actionGetVendorEmployees(lastQueryParams));
    }, 0);
  };

  return (
    <>
      <div style={{ width: 'inherit', display: 'flex', justifyContent: 'space-between' }}>
        <div className={styles.single_admin_container}>
          <div className={styles.admin_info_container}>
            <span style={{ fontSize: '18px', display: 'block', marginBottom: '15px' }}>
              Employee info:
            </span>
            <div className={styles.admin_info_block}>
              <span
                style={{ marginRight: 15, marginBottom: 10, display: 'flex', alignItems: 'center' }}
              >
                {item.status === 'activated' ? (
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
              <span className={styles.admin_info_block_item}>
                <span style={{ fontWeight: 600 }}>First name:</span> {item.first_name}
              </span>
              <span className={styles.admin_info_block_item}>
                <span style={{ fontWeight: 600 }}>Last name:</span> {item.last_name}
              </span>
              <span className={styles.admin_info_block_item}>
                <span style={{ fontWeight: 600 }}>Email:</span> {item.email}
              </span>
              <span className={styles.admin_info_block_item}>
                <span style={{ fontWeight: 600 }}>Created at:</span>{' '}
                {DateTime.fromISO(item.created_at).toLocaleString()}
              </span>
              {/* <span className={styles.vendor_info_block_item}>
            Email verification: {item.is_email_verified ? 'Yes' : 'No'}
          </span> */}
            </div>
          </div>
        </div>
        {item.id !== userId && (
          <div style={{ width: 220 }} className={classes.button_out}>
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
        )}
      </div>
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
            You are going to delete employee?
          </Typography>
          <div className={classes.button_out}>
            <Button
              sx={{
                margin: '10px',
                width: '200px',
                flex: 0.5,
              }}
              onClick={() => deleteEmployee(item.id)}
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
    </>
  );
};

export default VendorEmployeesCollapse;
