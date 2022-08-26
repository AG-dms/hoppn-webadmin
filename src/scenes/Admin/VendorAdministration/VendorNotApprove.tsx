import { Address, GoogleMap } from '@/api/dto/VendorResponseData';
import { downloadFile } from '@/api/vendorsAdministrationAPI';
import MapModal from '@/components/Modals/MapModal';
import { useAppDispatch } from '@/customHooks/storeHooks';
import { useDidMountEffect } from '@/customHooks/useDidMount';
import { RootState } from '@/store';
import {
  actionApproveVendorRegistration,
  actionDeclineVendor,
} from '@/store/slices/VendorAdministrationSlice/vendorApplicationSlice';
import { useStyles } from '@/styles/materialCustom';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import { Button, TextField } from '@mui/material';
import { useFormik } from 'formik';
import React, { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import vendors from '../../VendorProfile/vendorProfile.module.scss';
import styles from './vendorStyles.module.scss';

type ErrorsType = {
  company_name: string;
  company_categories: string;
  address_line_1: string;
  address_line_2: string;
  legal_information: string;
  description: string;
};

const VendorNotApprove = () => {
  const isLoading = useSelector((state: RootState) => state.vendorProfile.isLoading);
  const vendorCategories = useSelector((state: RootState) => state.vendorProfile.vendorCategories);
  const [address, setAddress] = useState<GoogleMap | Address>(null);
  const classes = useStyles();
  const dispatch = useAppDispatch();
  const [open, setOpen] = React.useState(false);
  const nameRef = useRef(null);
  const addressRef = useRef(null);
  const categoryRef = useRef(null);
  const [category, setCategory] = useState([]);
  const isLoadingLogo = useSelector((state: RootState) => state.vendorProfile.isLoadingLogo);
  const [customAddress, setCustomAddress] = useState('');
  const [customAddress2, setCustomAddress2] = useState('');
  const { id } = useParams();
  const navigate = useNavigate();
  const vendorData = useSelector(
    (state: RootState) => state.vendorApplication.singleVendorApplication,
  );
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

  useEffect(() => {
    if (vendorData?.data?.registration_form) {
      const arr = vendorData.data.company_categories.map(item => item.id);
      setCategory([...arr]);
    }
  }, []);

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
        address_line_1: address.address_line_1,
        address_line_2: customAddress2,
        country: address.country,
        city: address.city,
        district: address.district,
        postcode: address.postcode,
        latitude: address.latitude,
        longitude: address.longitude,
        plus_code: address.plus_code,
      };
      dispatch(
        actionApproveVendorRegistration({
          id: id,
          data: data,
          navigate: () => navigate('/vendor/administration'),
        }),
      );
    },
    validate: values => {
      const errors = {} as ErrorsType;

      if (values?.address_line_1.length <= 0) {
        errors.address_line_1 = 'Require';
        addressRef.current.scrollIntoView();
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
        nameRef.current.scrollIntoView();
      }
      if (values.company_name?.length > 255) {
        errors.company_name = 'max length 250 symbols';
        nameRef.current.scrollIntoView();
      }
      return errors;
    },
    validateOnChange: false,
    validateOnBlur: false,
  });

  useEffect(() => {
    formik.setFieldValue(
      'company_name',
      vendorData?.data?.registration_form?.company_name || formik.initialValues.company_name,
    );
    formik.setFieldValue(
      'address_line_2',
      vendorData?.data?.address?.address_line_2 || formik.initialValues.address_line_2,
    );
    if (vendorData?.data?.company_categories) {
      const arr = vendorData?.data?.company_categories;
      if (arr) {
        setCategory([...arr.map(item => item.id)]);
      }
    }
  }, [vendorData?.data?.registration_form]);

  useEffect(() => {
    formik.setFieldValue(
      'address_line_1',
      address?.address_line_1 || formik.initialValues.address_line_1,
    );
  }, [address, vendorData.data]);

  useDidMountEffect(() => {
    formik.setFieldValue('company_categories', category, false);
  }, [category]);

  const openMap = () => {
    setOpen(true);
  };

  useEffect(() => {
    setAddress(vendorData?.data?.address);
  }, [vendorData?.data?.address]);

  return (
    <>
      {vendorData?.data?.registration_form && !isLoading && !isLoadingLogo && (
        <div className={styles.moderation_scene_container}>
          <h4 style={{ textAlign: 'center' }}> Moderation vendor</h4>
          <div className={styles.nameInfo}>
            {vendorData?.data?.owner && (
              <div className={styles.ownerInfo_container}>
                <h3 className={styles.block_title}>Owner info:</h3>
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
            )}
            <form className={styles.form} onSubmit={formik.handleSubmit}>
              <h5 style={{ marginTop: 0 }}>Store name</h5>
              <div className={styles.input_container}>
                <TextField
                  ref={nameRef}
                  id="company_name"
                  label="Store name"
                  type="text"
                  onChange={formik.handleChange}
                  value={formik.values.company_name ? formik.values.company_name : ''}
                  helperText={formik.errors.company_name}
                  className={classes.narrowFormInput}
                />
                <div className={styles.vendor_info_right}>
                  <span style={{ fontWeight: 600 }}> Vendor answer: </span>
                  <span> {vendorData.data.registration_form.company_name}</span>
                </div>
              </div>
              <h5>Company categories</h5>
              <div className={styles.input_container}>
                <div style={{ flex: 1 }}>
                  <span className={styles.categories}>Category (no more than 2)</span>
                  <div
                    ref={categoryRef}
                    style={{ flexDirection: 'column', paddingLeft: 0 }}
                    className={styles.checkBox_container}
                  >
                    {vendorCategories.map(item => {
                      return (
                        <div style={{ marginBottom: 10 }} key={item.id}>
                          <div>
                            <input
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
                <div className={styles.vendor_info_right}>
                  <span style={{ fontWeight: 600 }}> Vendor answer: </span>
                  <span>{vendorData.data.company_categories.map(item => item.name).join(' ')}</span>
                </div>
              </div>
              <h5>Company address</h5>
              <div className={styles.address_container}>
                <div className={styles.address_left}>
                  <div
                    style={{ flexDirection: 'column', marginBottom: 20, gap: 10 }}
                    className={styles.input_container}
                  >
                    <TextField
                      ref={addressRef}
                      onClick={openMap}
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
                  <div
                    style={{ flexDirection: 'column', gap: 10 }}
                    className={styles.input_container}
                  >
                    <TextField
                      sx={{ width: '100%' }}
                      id="address_line_2"
                      label="Address line 2"
                      type="text"
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        setCustomAddress2(e.currentTarget.value);
                      }}
                      value={customAddress2 ? customAddress2 : ''}
                      className={classes.narrowFormInput}
                    />
                  </div>
                  <div
                    style={{ flexDirection: 'column', gap: 10 }}
                    className={styles.input_container}
                  >
                    <TextField
                      id="plus_code"
                      disabled
                      sx={{ width: '100%' }}
                      label="Plus code"
                      type="text"
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
                <div className={styles.address_right}>
                  <span style={{ fontWeight: 600 }}> Vendor answer: </span>
                  <span> {vendorData.data.registration_form.address}</span>
                </div>
              </div>

              <h5>Other info</h5>

              <div style={{ flexDirection: 'column', gap: 5 }} className={styles.input_container}>
                <span style={{ fontWeight: 600 }}>Vendor special comments:</span>
                <div style={{ display: 'flex', marginTop: 15 }}>
                  <span style={{ fontWeight: 600, marginRight: 15, fontSize: 14 }}>
                    Do you offer takeaway?
                  </span>
                  <span style={{ fontSize: 14 }}>
                    {vendorData.data.registration_form.takeaway_food}
                  </span>
                </div>
                <div style={{ display: 'flex', marginTop: 10 }}>
                  <span style={{ fontWeight: 600, marginRight: 15, fontSize: 14 }}>
                    Is your business registered?
                  </span>
                  <span style={{ fontSize: 14 }}>
                    {vendorData.data.registration_form.registered_business}
                  </span>
                </div>
                <div style={{ display: 'flex', marginTop: 10 }}>
                  <span style={{ fontWeight: 600, marginRight: 15, fontSize: 14 }}>
                    Do you have a business license?
                  </span>
                  <span style={{ fontSize: 14 }}>
                    {vendorData.data.registration_form.business_license}
                  </span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', marginTop: 10 }}>
                  <span style={{ fontWeight: 600, marginRight: 15, fontSize: 14 }}>
                    Vendor description:
                  </span>
                  <span style={{ fontSize: 14 }}>
                    {vendorData.data.registration_form.description}
                  </span>
                </div>
              </div>

              <div className={styles.input_container}>
                <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                  <span>Documents:</span>
                  <div
                    className={`${styles.documents_block} ${styles.vendor_document} custom_scrollbar_small`}
                  >
                    {vendorData?.files?.length ? (
                      vendorData?.files?.map(file => {
                        return (
                          <div
                            style={{
                              width: '100%',
                              cursor: 'pointer',
                              justifyContent: 'flex-start',
                            }}
                            key={file.id}
                            className={vendors.file_upload}
                            onClick={() => downloadFile(id, file.id)}
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
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-evenly' }}>
                <div className={classes.button_out}>
                  <Button
                    data-approve="disable"
                    style={{ width: 210, marginBottom: '15px' }}
                    disabled={isLoading}
                    onClick={() => {
                      dispatch(
                        actionDeclineVendor({
                          id: id,
                          navigate: () => navigate('/vendor/administration'),
                        }),
                      );
                    }}
                  >
                    Decline this vendor
                  </Button>
                </div>

                <div className={classes.button_out}>
                  <Button
                    data-approve="approve"
                    style={{ width: 210 }}
                    onClick={() => formik.handleSubmit()}
                    disabled={isLoading}
                  >
                    Approve this vendor
                  </Button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
      <MapModal
        customAddress2={customAddress2}
        setCustomAddress2={setCustomAddress2}
        setCustomAddress={setCustomAddress}
        address={address}
        setAddress={setAddress}
        open={open}
        setOpen={setOpen}
      />
    </>
  );
};

export default VendorNotApprove;
