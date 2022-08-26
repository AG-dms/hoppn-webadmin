import { VendorApplicationType } from '@/api/dto/VendorResponseData';
import {
  apiChangeVendorBalance,
  apiGetSingleVendor,
  apiGetSingleVendorFiles,
  downloadFile,
} from '@/api/vendorsAdministrationAPI';
import type { RootState } from '@/store';
import {
  actionApproveVendor,
  actionGetSingleVendorData,
  actionGetSingleVendorFiles,
  actionCleanSingleVendor,
} from '@/store/slices/VendorAdministrationSlice/vendorApplicationSlice';
import { useStyles } from '@/styles/materialCustom';
import FilePresentIcon from '@mui/icons-material/FilePresent';
import { Button, CircularProgress, Modal } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import global from '../../../styles/global.module.scss';
import vendors from '../../VendorProfile/vendorProfile.module.scss';
import styles from './vendorStyles.module.scss';
import collapse from '../../../styles/collapse.module.scss';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import { useAppDispatch } from '@/customHooks/storeHooks';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import IndeterminateCheckBoxIcon from '@mui/icons-material/IndeterminateCheckBox';
import { SingleVendorData } from '@/store/slices/VendorAdministrationSlice/type';
import ChangeBalanceModal from '@/components/Modals/ChangeBalanceModal';
import { toFormat } from 'dinero.js';
import { currencyTransformer, Kobo } from '@/utils/dinero';
import { useNavigate } from 'react-router-dom';
interface Props {
  item: VendorApplicationType;
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

const SingleVendorCollapse: React.FC<Props> = ({ item }) => {
  const [vendorData, setVendorData] = useState<SingleVendorData>(null);
  const [loadLogo, setLoadLogo] = useState(false);
  const isLoading = useSelector((state: RootState) => state.vendorApplication.isLoading);
  const classes = useStyles();
  const dispatch = useAppDispatch();

  useEffect(() => {
    apiGetSingleVendor(item.id).then(response =>
      setVendorData(prevState => {
        return { ...prevState, data: response };
      }),
    );
    // dispatch(actionGetSingleVendorData(item.id));
    apiGetSingleVendorFiles(item.id).then(response =>
      setVendorData(prevState => {
        return { ...prevState, files: response };
      }),
    );
  }, []);

  const [isModalVisible, setModalVisible] = useState<boolean>(false);
  const changeModalVisible = () => {
    setModalVisible(!isModalVisible);
  };

  const navigate = useNavigate();

  const [modalFlag, setModalFlag] = useState(false);
  const [open, setOpen] = React.useState(false);
  const handleOpen = e => {
    if (e.target.getAttribute('data-approve') === 'approve') {
      setModalFlag(true);
    }
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  const changeBalance = (amount: string, id: string) => {
    return apiChangeVendorBalance(amount, id);
  };

  const approveVendor = async (e, id: string) => {
    if (e.target.getAttribute('data-approve') === 'approve' && modalFlag) {
      await dispatch(actionApproveVendor({ id: id, is_approved: true }));
      await apiGetSingleVendor(item.id).then(response =>
        setVendorData(prevState => {
          return { ...prevState, data: response };
        }),
      );
    } else {
      await dispatch(actionApproveVendor({ id: id, is_approved: false }));
      await apiGetSingleVendor(item.id).then(response =>
        setVendorData(prevState => {
          return { ...prevState, data: response };
        }),
      );
    }
    handleClose();
  };

  return (
    <>
      <div className={global.collapse_container}>
        {isLoading && <CircularProgress sx={{ position: 'absolute', top: '40%', left: '50%' }} />}
        {vendorData && (
          <div className={styles.collapse_body}>
            <span
              style={{ fontSize: '18px', display: 'block', marginBottom: '15px', fontWeight: 600 }}
            >
              More details:
            </span>
            <div className={styles.collapse_body_content}>
              <div className={styles.collapse_body_logo}>
                <img style={{ width: 100 }} src={`/${item?.logo}`} alt="" />
              </div>
              <span
                style={{ marginRight: 15, marginBottom: 10, display: 'flex', alignItems: 'center' }}
              >
                {vendorData?.data?.is_online ? (
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
              <span style={{ marginTop: 10 }}>
                <span style={{ fontWeight: 600 }}>Legal information:</span>
              </span>
              {vendorData?.data?.legal_information && (
                <div className={`${styles.collapse_body_content_item} ${styles.wide_text}`}>
                  <p className={`${styles.text} custom_scrollbar_small`}>
                    {vendorData?.data?.legal_information}
                  </p>
                </div>
              )}
              <span>
                <span style={{ fontWeight: 600 }}>Description:</span>
              </span>
              {vendorData?.data?.description && (
                <div className={`${styles.collapse_body_content_item} ${styles.wide_text}`}>
                  <p className={`${styles.text} custom_scrollbar_small`}>
                    {vendorData?.data?.description}
                  </p>
                </div>
              )}
            </div>
            <span
              style={{ fontSize: '18px', display: 'block', marginBottom: '15px', fontWeight: 600 }}
            >
              Owner info:
            </span>
            <div className={styles.collapse_body_content}>
              <span>
                <span style={{ fontWeight: 600 }}>Email:</span> {vendorData?.data?.owner.email}
              </span>
              <span>
                <span style={{ fontWeight: 600 }}>First name:</span>{' '}
                {vendorData?.data?.owner.first_name}
              </span>
              <span>
                <span style={{ fontWeight: 600 }}>Last name:</span>{' '}
                {vendorData?.data?.owner.last_name}
              </span>
              <span>
                <span style={{ fontWeight: 600 }}>Phone number:</span>{' '}
                {vendorData?.data?.owner.phone_number}
              </span>
              <span>
                <span style={{ fontWeight: 600 }}>User balance:</span>{' '}
                {toFormat(Kobo(vendorData?.data?.owner?.balance), currencyTransformer)}
              </span>
            </div>
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span>Documents:</span>
          <div
            className={`${styles.documents_block} ${styles.vendor_document} custom_scrollbar_small`}
          >
            {vendorData?.files?.length ? (
              vendorData?.files?.map(file => {
                return (
                  <div
                    style={{ width: '100%', cursor: 'pointer', justifyContent: 'flex-start' }}
                    key={file.id}
                    className={vendors.file_upload}
                    onClick={() => downloadFile(item.id, file.id)}
                  >
                    <AttachFileIcon fontSize="small" sx={{ marginRight: '15px' }} />
                    <span className={vendors.file_upload_name}>{file.original_name}</span>
                  </div>
                );
              })
            ) : (
              <span>No documents from this vendor</span>
            )}
          </div>
        </div>

        {vendorData?.data && !isLoading ? (
          <div
            style={{
              margin: '20px 0',
              maxWidth: 550,
              display: 'flex',
              flexDirection: 'column',
            }}
            // className={classes.button_out}
          >
            <div className={classes.button_out} style={{ marginBottom: 15 }}>
              <Button
                onClick={() => navigate(`/admin/moderation_vendor/${item.id}`)}
                data-approve="approve"
                disabled={isLoading}
              >
                Moderation
              </Button>
            </div>
            {vendorData.data.is_approved === null ? (
              <>
                <div className={classes.button_out}>
                  <Button
                    data-approve="disable"
                    style={{ width: 210, marginBottom: '15px' }}
                    disabled={isLoading}
                    onClick={handleOpen}
                  >
                    Disable this vendor
                  </Button>
                </div>

                <div className={classes.button_out}>
                  <Button
                    data-approve="approve"
                    style={{ width: 210 }}
                    disabled={isLoading}
                    onClick={handleOpen}
                  >
                    Approve this vendor
                  </Button>
                </div>
              </>
            ) : vendorData?.data?.is_approved ? (
              <div className={classes.button_out}>
                <Button data-approve="disable" disabled={isLoading} onClick={handleOpen}>
                  Disable this vendor
                </Button>
              </div>
            ) : (
              <div className={classes.button_out}>
                <Button data-approve="approve" disabled={isLoading} onClick={handleOpen}>
                  Approve this vendor
                </Button>
              </div>
            )}
            <div className={classes.button_out} style={{ marginTop: 15 }}>
              <Button data-approve="approve" disabled={isLoading} onClick={changeModalVisible}>
                Change balance
              </Button>
            </div>
          </div>
        ) : null}
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
          <Typography id="modal-modal-description" sx={{ mt: 2 }}></Typography>
          <div style={{ alignItems: 'center' }} className={classes.button_out}>
            {vendorData?.data?.is_approved ? (
              <Button
                data-approve="disable"
                disabled={isLoading}
                onClick={e => approveVendor(e, vendorData.data.id)}
              >
                Yes
              </Button>
            ) : (
              <Button
                data-approve="approve"
                disabled={isLoading}
                onClick={e => approveVendor(e, vendorData.data.id)}
              >
                Yes
              </Button>
            )}
            <Button
              sx={{
                margin: '10px',
                width: '200px',
                flex: 0.5,
              }}
              onClick={handleClose}
            >
              Cancel
            </Button>
          </div>
        </Box>
      </Modal>
      <ChangeBalanceModal
        changeBalance={changeBalance}
        id={vendorData?.data?.id}
        balance={vendorData?.data?.owner?.balance}
        message="Withdraw amount"
        open={isModalVisible}
        onClose={changeModalVisible}
      />
    </>
  );
};

export default SingleVendorCollapse;
