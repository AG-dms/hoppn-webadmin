import { HopperItem, PromiseSingleHopper } from '@/api/dto/HopperResponseData';
import { downloadFileHopper } from '@/api/vendorsAdministrationAPI';
import type { RootState } from '@/store';
import styles from '../../../styles/collapse.module.scss';
import {
  actionApproveHopper,
  // actionGetHopperFiles,
  // actionGetSingleHopper,
} from '@/store/slices/HopperAdministrationSlice/hopperAdministrationSlice';
import { useStyles } from '@/styles/materialCustom';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import FilePresentIcon from '@mui/icons-material/FilePresent';
import IndeterminateCheckBoxIcon from '@mui/icons-material/IndeterminateCheckBox';
import { Button, CircularProgress, Modal } from '@mui/material';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { DateTime } from 'luxon';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import globals from '../../../styles/global.module.scss';
import vendors from '../../VendorProfile/vendorProfile.module.scss';
import { useAppDispatch } from '@/customHooks/storeHooks';
import { Hopper } from '@/api/dto/OrdersResponse.dto';
import { HopperData } from '@/store/slices/HopperAdministrationSlice/types';
import {
  apiChangeHopperBalance,
  apiGetHopperFiles,
  apiGetSingleHopper,
} from '@/api/hopperAdministrationsAPI';
import ChangeBalanceModal from '@/components/Modals/ChangeBalanceModal';
import { toFormat } from 'dinero.js';
import { currencyTransformer, Kobo } from '@/utils/dinero';

interface Props {
  item: PromiseSingleHopper;
}

const style = {
  position: 'absolute' as const,
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 500,
  bgcolor: 'background.paper',
  // border: '2px solid #000',
  boxShadow: 10,
  p: 4,
};

const SingleHopperCollapse: React.FC<Props> = ({ item }) => {
  const [singleHopperData, setSingleHopperData] = useState<HopperData>(null);

  const [isLoading, setIsLoading] = useState(false);

  const classes = useStyles();
  const dispatch = useAppDispatch();
  const [isModalVisible, setModalVisible] = useState<boolean>(false);
  const changeModalVisible = () => {
    setModalVisible(!isModalVisible);
  };

  useEffect(() => {
    setIsLoading(true);
    apiGetSingleHopper(item.id).then(response =>
      setSingleHopperData(prevState => {
        return { ...prevState, data: response };
      }),
    );
    apiGetHopperFiles(item.id).then(response =>
      setSingleHopperData(prevState => {
        return { ...prevState, files: response };
      }),
    );

    // dispatch(actionGetSingleHopper(item.id));
    // dispatch(actionGetHopperFiles(item.id));
    setIsLoading(false);
  }, []);

  const handleClick = async (id: string, is_approved: boolean) => {
    await dispatch(actionApproveHopper({ id: id, is_approved: is_approved }));
    await apiGetSingleHopper(item.id).then(response =>
      setSingleHopperData(prevState => {
        return { ...prevState, data: response };
      }),
    );
  };

  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const changeBalance = (amount: string, id: string) => {
    return apiChangeHopperBalance(amount, id);
  };

  return (
    <div className={styles.single_admin_container}>
      {isLoading && <CircularProgress sx={{ position: 'absolute', top: '40%', left: '50%' }} />}
      {singleHopperData?.data && !isLoading ? (
        <>
          <div className={styles.admin_info_container}>
            <span style={{ fontSize: '18px', display: 'block', marginBottom: '15px' }}>
              Hopper info:
            </span>
            <div className={styles.admin_info_block}>
              {singleHopperData.data.user.photo && (
                <div className={styles.collapse_body_logo}>
                  <img
                    style={{ width: 100 }}
                    src={`/${singleHopperData.data.user.photo}`}
                    alt="photo"
                  />
                </div>
              )}
              <span
                style={{ marginRight: 15, marginBottom: 10, display: 'flex', alignItems: 'center' }}
              >
                {singleHopperData?.data?.is_online ? (
                  <>
                    <CheckBoxIcon color="success" /> Online
                  </>
                ) : (
                  <>
                    <IndeterminateCheckBoxIcon color="error" />
                    Offline
                  </>
                )}
              </span>

              <span className={styles.admin_info_block_item}>
                <span style={{ fontWeight: 600 }}>Email:</span>{' '}
                {singleHopperData?.data?.user?.email}
              </span>
              <span className={styles.admin_info_block_item}>
                <span style={{ fontWeight: 600 }}>Created at:</span>{' '}
                {DateTime.fromISO(singleHopperData?.data?.created_at).toLocaleString()}
              </span>
              <span className={styles.admin_info_block_item}>
                <span style={{ fontWeight: 600 }}>Email verification:</span>{' '}
                {singleHopperData?.data?.user?.is_email_verified ? 'Yes' : 'No'}
              </span>
              <span className={styles.admin_info_block_item}>
                <span style={{ fontWeight: 600 }}>User balance:</span>{' '}
                {toFormat(Kobo(singleHopperData?.data?.user?.balance), currencyTransformer)}
              </span>
            </div>
          </div>
          <div className={globals.documents_block}>
            <span style={{ fontSize: '18px', display: 'block', marginBottom: '15px' }}>
              Documents:
            </span>
            <div style={{ display: 'flex' }} className={globals.documents_block_container}>
              {singleHopperData?.files?.length ? (
                singleHopperData?.files?.map(file => {
                  return (
                    <div className={`${vendors.document} ${styles.padding_top}`} key={file.id}>
                      <div
                        className={vendors.document_item}
                        onClick={() => downloadFileHopper(item.id, file.id)}
                      >
                        <FilePresentIcon sx={{ alignSelf: 'center' }} fontSize="large" />
                        <span className={vendors.document_name}>{file.original_name}</span>
                      </div>
                    </div>
                  );
                })
              ) : (
                <span>No documents from this hopper</span>
              )}
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ marginBottom: '15px', width: '200px' }} className={classes.button_out}>
              <Button onClick={() => handleClick(item.id, !singleHopperData.data.is_approved)}>
                {singleHopperData.data.is_approved ? 'decline' : 'approve'}
              </Button>
            </div>
            <div style={{ marginBottom: '15px', width: '200px' }} className={classes.button_out}>
              <Button onClick={() => setModalVisible(true)}>Change balance</Button>
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
              // onClick={() => deleteAdmin(item.id)}
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
      <ChangeBalanceModal
        changeBalance={changeBalance}
        id={singleHopperData?.data?.id}
        balance={singleHopperData?.data?.user?.balance}
        message="Withdraw amount"
        open={isModalVisible}
        onClose={changeModalVisible}
      />
    </div>
  );
};

export default SingleHopperCollapse;
