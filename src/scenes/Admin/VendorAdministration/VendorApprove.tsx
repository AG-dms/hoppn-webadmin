import { Address, GoogleMap } from '@/api/dto/VendorResponseData';
import { apiChangeVendorBalance, downloadFile } from '@/api/vendorsAdministrationAPI';
import ChangeBalanceModal from '@/components/Modals/ChangeBalanceModal';
import ConfirmModal from '@/components/Modals/ConfirmModal';
import MapModal from '@/components/Modals/MapModal';
import { useAppDispatch } from '@/customHooks/storeHooks';
import { useDidMountEffect } from '@/customHooks/useDidMount';
import { RootState } from '@/store';
import {
  actionApproveVendorRegistration,
  actionDeclineVendor,
  actionUpdateVendorInformation,
} from '@/store/slices/VendorAdministrationSlice/vendorApplicationSlice';
import { useStyles } from '@/styles/materialCustom';
import { getResizedPhotoUrl } from '@/utils/get-resize-photo';
import TextareaAutosize from '@mui/base/TextareaAutosize';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import PhotoSizeSelectActualOutlinedIcon from '@mui/icons-material/PhotoSizeSelectActualOutlined';
import { Button, TextField } from '@mui/material';
import { useFormik } from 'formik';
import { DateTime } from 'luxon';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import styles from './vendorStyles.module.scss';

type ErrorsType = {
  company_name: string;
  company_categories: string;
  address_line_1: string;
  address_line_2: string;
};

export interface Props {
  address: GoogleMap | Address;
  setAddress: React.Dispatch<React.SetStateAction<GoogleMap | Address>>;
}

const VendorApprove: React.FC<Props> = ({ address, setAddress }) => {
  const nameRef = useRef(null);
  const addressRef = useRef(null);
  const categoryRef = useRef(null);
  const vendorCategories = useSelector((state: RootState) => state.vendorProfile.vendorCategories);
  const [category, setCategory] = useState([]);
  const vendorData = useSelector(
    (state: RootState) => state.vendorApplication.singleVendorApplication,
  );
  const [open, setOpen] = React.useState(false);
  const [openConfirm, setOpenConfirm] = useState(false);
  const classes = useStyles();
  const dispatch = useAppDispatch();
  const { id } = useParams();
  const [customAddress, setCustomAddress] = useState('');
  const [customAddress2, setCustomAddress2] = useState('');
  const [editVendor, setEditVendor] = useState(true);

  const photoUrl = useMemo(() => {
    return getResizedPhotoUrl({ source: vendorData?.data?.logo, size: 'md', isWebp: true });
  }, [vendorData?.data?.logo]);

  const closeEdit = () => {
    setEditVendor(true);
  };

  const formik = useFormik({
    initialValues: {
      company_name: '',
      company_categories: [],
      address_line_1: address?.address_line_1 || '',
      address_line_2: vendorData?.data?.address?.address_line_2 || '',
      plus_code: '',
    },
    onSubmit: values => {
      const data = {
        company_name: values.company_name,
        company_category_ids: category,
        address_line_1: values.address_line_1,
        address_line_2: customAddress2,
        country: address?.country,
        city: address?.city,
        district: address?.district,
        postcode: address?.postcode,
        latitude: address?.latitude,
        longitude: address?.longitude,
        plus_code: address?.plus_code,
      };
      dispatch(actionUpdateVendorInformation({ id: id, data: data, setEdit: () => closeEdit() }));
    },
    validate: values => {
      const errors = {} as ErrorsType;
      if (values.address_line_1?.length <= 0) {
        errors.address_line_1 = 'Require';
        addressRef.current?.scrollIntoView();
      }
      if (values?.company_categories.length === 0) {
        errors.company_categories = 'Require';
        categoryRef.current.scrollIntoView();
      }

      if (values?.company_categories.length > 2) {
        errors.company_categories = 'No more than 2 categories';
        categoryRef.current.scrollIntoView();
      }

      if (values.company_name?.length <= 0) {
        errors.company_name = 'Require';
        nameRef?.current?.scrollIntoView();
      }
      if (values.company_name?.length > 255) {
        errors.company_name = 'max length 250 symbols';
        nameRef?.current?.scrollIntoView();
      }
      return errors;
    },
    validateOnChange: false,
    validateOnBlur: false,
  });

  useEffect(() => {
    formik.setFieldValue('company_name', vendorData?.data?.company_name);
    formik.setFieldValue('address_line_2', vendorData?.data?.address?.address_line_2);
    setAddress(vendorData?.data?.address);
  }, [vendorData]);

  useEffect(() => {
    formik.setFieldValue('address_line_1', address?.address_line_1);
  }, [address]);

  const handleToggle = c => () => {
    const clickedCategory = category.indexOf(c);
    const all = [...category];

    if (clickedCategory === -1) {
      all.push(c);
    } else {
      all.splice(clickedCategory, 1);
    }

    setCategory(all);
  };

  const openMap = () => {
    if (editVendor) return;
    setOpen(true);
  };

  useDidMountEffect(() => {
    formik.setFieldValue('company_categories', category, false);
  }, [category]);

  useEffect(() => {
    if (vendorData?.data?.company_categories) {
      const arr = vendorData?.data?.company_categories;
      if (arr) {
        setCategory([...arr.map(item => item.id)]);
      }
    }
  }, [vendorData?.data]);

  const changeBalance = (amount: string, idVendor: string) => {
    return apiChangeVendorBalance(amount, idVendor);
  };

  const [isModalVisible, setModalVisible] = useState<boolean>(false);
  const changeModalVisible = () => {
    setModalVisible(!isModalVisible);
  };

  const approveVendor = () => {
    const data = {
      company_name: formik.values.company_name,
      company_category_ids: category,
      address_line_1: address?.address_line_1,
      address_line_2: customAddress2,
      country: address?.country,
      city: address?.city,
      district: address?.district,
      postcode: address?.postcode,
      latitude: address?.latitude,
      longitude: address?.longitude,
      plus_code: address?.plus_code,
    };
    setOpenConfirm(false);
    dispatch(actionApproveVendorRegistration({ id: id, data: data }));
  };

  const declineVendor = () => {
    dispatch(
      actionDeclineVendor({
        id: id,
      }),
    );
    setOpenConfirm(false);
  };

  return (
    <>
      <div className={styles.profile_container_vendor}>
        <div className={styles.user_info}>
          <div style={{ marginBottom: 15 }} className={styles.avatar}>
            {!vendorData?.data?.logo && (
              <div style={{ cursor: 'pointer' }} className={styles.logo_container}>
                <div>
                  <PhotoSizeSelectActualOutlinedIcon sx={{ fontSize: 200 }} />
                </div>
              </div>
            )}
            {vendorData?.data?.logo && (
              <div className={styles.logo_container}>
                <div>
                  <img src={photoUrl} alt="image" width="200" height="200" />
                </div>
              </div>
            )}
          </div>
          <ul className={styles.list}>
            <li style={{ textAlign: 'center' }} className={styles.list_item}>
              Approval:{' '}
              <span className={styles.list_item_span}>
                {vendorData?.data?.is_approved ? 'Yes' : 'No'}
              </span>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  marginBottom: 30,
                  width: 200,
                  margin: '10px auto',
                }}
                className={classes.button}
              >
                <Button
                  sx={{ marginBottom: '10px' }}
                  onClick={() => {
                    setOpenConfirm(true);
                  }}
                >
                  {vendorData?.data?.is_approved ? 'Lock vendor' : 'Approve vendor'}
                </Button>
              </div>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  marginBottom: 30,
                  width: 200,
                  margin: '10px auto',
                }}
                className={classes.button}
              >
                <Button sx={{ marginBottom: '10px' }} onClick={changeModalVisible}>
                  Change balance
                </Button>
              </div>
            </li>
          </ul>
          <div className={styles.input_container}>
            <TextField
              disabled={editVendor}
              id="company_name"
              ref={nameRef}
              label="Store name"
              type="text"
              onChange={formik.handleChange}
              value={formik.values.company_name ? formik.values.company_name : ''}
              helperText={
                formik.touched.company_name &&
                formik.errors.company_name &&
                formik.errors.company_name
              }
              className={`${classes.narrowFormInput} ${
                formik.errors.company_name && formik.touched.company_name ? classes.require : null
              }`}
            />
          </div>

          <div className={styles.input_container}>
            <div style={{ flex: 1 }}>
              <span className={styles.categories}>Category:</span>
              <div
                ref={categoryRef}
                style={{ flexDirection: 'column', paddingLeft: 0, marginBottom: 10 }}
                className={styles.checkBox_container}
              >
                {vendorCategories.map(item => {
                  return (
                    <div style={{ marginBottom: 10 }} key={item.id}>
                      <div>
                        <input
                          disabled={editVendor}
                          onChange={handleToggle(item.id)}
                          name={item.name}
                          checked={category.includes(item.id)}
                          value={item.id ? item.id : '1'}
                          type="checkbox"
                        />
                        <label htmlFor={item.name}>{item.name}</label>
                      </div>
                      <span className={styles.feesCategory}>Platform fees: {item.fees}</span>
                    </div>
                  );
                })}
                {formik.errors.company_categories && (
                  <span className={styles.errorText}>{formik.errors.company_categories}</span>
                )}
              </div>
            </div>
          </div>
          <div className={styles.address_container}>
            <div className={styles.address_left}>
              <div
                style={{ flexDirection: 'column', marginBottom: 20, gap: 10 }}
                className={styles.input_container}
              >
                <TextField
                  onClick={openMap}
                  ref={addressRef}
                  disabled={editVendor}
                  style={{ width: '100%' }}
                  label="Address line 1"
                  type="text"
                  value={
                    customAddress
                      ? customAddress
                      : vendorData?.data?.address?.address_line_1
                      ? vendorData?.data?.address?.address_line_1
                      : ''
                  }
                  helperText={
                    formik.touched.address_line_1 &&
                    formik.errors.address_line_1 &&
                    formik.errors.address_line_1
                  }
                  className={`${classes.narrowFormInput} ${
                    formik.errors.address_line_1 && formik.touched.address_line_1
                      ? classes.require
                      : null
                  }`}
                />
              </div>
              <div style={{ flexDirection: 'column', gap: 10 }} className={styles.input_container}>
                <TextField
                  sx={{ width: '100%' }}
                  id="address_line_2"
                  disabled={editVendor}
                  label="Address line 2"
                  type="text"
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    setCustomAddress2(e.currentTarget.value);
                  }}
                  value={customAddress2 ? customAddress2 : formik.values.address_line_2}
                  className={classes.narrowFormInput}
                />
              </div>
              <div style={{ flexDirection: 'column', gap: 10 }} className={styles.input_container}>
                <TextField
                  id="plus_code"
                  disabled
                  sx={{ width: '100%' }}
                  label="Plus code"
                  type="text"
                  onChange={formik.handleChange}
                  value={address?.plus_code ? address?.plus_code : ''}
                  helperText={
                    formik.touched.address_line_1 &&
                    formik.errors.address_line_1 &&
                    formik.errors.address_line_1
                  }
                  className={`${classes.narrowFormInput} ${
                    formik.errors.address_line_1 && formik.touched.address_line_1
                      ? classes.require
                      : null
                  }`}
                />
              </div>
            </div>
          </div>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              marginBottom: 30,
              width: 200,
              margin: '0 auto',
            }}
            className={classes.button}
          >
            {editVendor && (
              <Button sx={{ marginBottom: '10px' }} onClick={() => setEditVendor(false)}>
                Edit vendor profile
              </Button>
            )}
            {!editVendor && (
              <Button sx={{ marginBottom: '10px' }} onClick={() => formik.handleSubmit()}>
                Save changes
              </Button>
            )}
          </div>

          <div className={styles.users_data}>
            <ul className={styles.list}>
              <li className={styles.list_item}>
                Status{' '}
                <span className={styles.list_item_span}>
                  {vendorData.data?.is_online ? 'Online' : 'Offline'}
                </span>
              </li>
              <li className={styles.list_item}>
                Created at:{' '}
                <span className={styles.list_item_span}>
                  {DateTime.fromISO(vendorData.data.created_at).toLocaleString(
                    DateTime.DATETIME_SHORT,
                  )}
                </span>
              </li>

              {/* <li className={styles.list_item}>
                Legal information:{' '}
                <div
                  style={{ flexDirection: 'column', height: 150 }}
                  className={styles.input_container_underline}
                >
                  <TextareaAutosize
                    maxRows={4}
                    style={{ width: '100%', marginTop: 10 }}
                    aria-label="Legal information"
                    id="legal_information"
                    placeholder="Legal information"
                    value={vendorData.data.legal_information}
                    className={styles.textAria_container}
                  />
                </div>
              </li> */}
              <li className={styles.list_item}>
                Description:{' '}
                <div
                  style={{ flexDirection: 'column', height: 150 }}
                  className={styles.input_container_underline}
                >
                  <TextareaAutosize
                    maxRows={4}
                    style={{ width: '100%', marginTop: 10 }}
                    aria-label="description"
                    id="description"
                    placeholder="Description"
                    value={vendorData.data.description}
                    className={styles.textAria_container}
                  />
                </div>
              </li>
            </ul>

            <span className={styles.list_item}>Documents:</span>

            <div>
              <div className={`${styles.documents_block} custom_scrollbar_small`}>
                {vendorData?.files &&
                  vendorData?.files.map(item => {
                    return (
                      <div
                        style={{ width: '100%', cursor: 'pointer' }}
                        key={item.id}
                        className={styles.file_upload}
                        onClick={() => downloadFile(id, item.id)}
                      >
                        <AttachFileIcon fontSize="small" />
                        <span className={styles.file_upload_name}>{item.original_name}</span>
                      </div>
                    );
                  })}
                {!vendorData?.files?.length && <span>No such documents</span>}
              </div>
            </div>
            {vendorData?.data?.owner && (
              <div>
                <div className={styles.ownerInfo_container}>
                  <h3 className={styles.block_title}>Owner info:</h3>
                  <span className={styles.info_text}>
                    <b>Balance:</b> {vendorData.data.owner.balance}
                  </span>
                  <span className={styles.info_text}>
                    <b>First name:</b> {vendorData.data.owner.first_name}
                  </span>
                  <span className={styles.info_text}>
                    <b>Last name:</b> {vendorData.data.owner.last_name}
                  </span>
                  <span className={styles.info_text}>
                    <b>Email:</b> {vendorData.data.owner.email}
                  </span>
                  <span className={styles.info_text}>
                    <b>Phone:</b> {vendorData.data.owner.phone_number}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <MapModal
        customAddress2={customAddress2}
        setCustomAddress2={setCustomAddress2}
        setCustomAddress={setCustomAddress}
        address={address}
        setAddress={setAddress}
        open={open}
        setOpen={setOpen}
      />
      <ConfirmModal
        open={openConfirm}
        title={'Are you shure?'}
        message={'Do you really want to change vendor status?'}
        handleClose={() => setOpenConfirm(!openConfirm)}
        cancelHandler={() => setOpenConfirm(!openConfirm)}
        confirmHandler={vendorData?.data?.is_approved ? declineVendor : approveVendor}
      />

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

export default VendorApprove;
