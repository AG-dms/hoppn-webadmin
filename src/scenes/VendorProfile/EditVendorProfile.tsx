import { Address, GoogleMap } from '@/api/dto/VendorResponseData';
import MapModal from '@/components/Modals/MapModal';
import { useAppDispatch } from '@/customHooks/storeHooks';
import { useDidMountEffect } from '@/customHooks/useDidMount';
import { RootState } from '@/store';
import {
  actionEditVendorProfile,
  actionGetVendorCategories,
  actionGetVendorFiles,
  actionGetVendorProfile,
  actionSetCompanyLogo,
} from '@/store/slices/VendorProfile/vendorProfileSlice';
import { useStyles } from '@/styles/materialCustom';
import { Role } from '@/utils/enum/Role';
import { getResizedPhotoUrl } from '@/utils/get-resize-photo';
import DeleteIcon from '@mui/icons-material/Delete';
import PhotoSizeSelectActualOutlinedIcon from '@mui/icons-material/PhotoSizeSelectActualOutlined';
import {
  Box,
  Button,
  CircularProgress,
  FormControlLabel,
  IconButton,
  Link,
  Modal,
  styled,
  Switch,
  TextareaAutosize,
  TextField,
} from '@mui/material';
import Tooltip, { TooltipProps, tooltipClasses } from '@mui/material/Tooltip';
import InfoIcon from '@mui/icons-material/Info';
import { useFormik } from 'formik';
import React, { useEffect, useMemo, useState } from 'react';
import ImageUploading from 'react-images-uploading';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import styles from '../Profile/Profile.module.scss';
import vendors from './vendorProfile.module.scss';

type ErrorsType = {
  company_name: string;
  company_category: string;
  address_line_1: string;
  address_line_2: string;
  legal_information: string;
  description: string;
};

const CustomWidthTooltip = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip {...props} classes={{ popper: className }} />
))({
  [`& .${tooltipClasses.tooltip}`]: {
    maxWidth: 500,
  },
});

const EditVendorProfile: React.FC = () => {
  const vendorProfile = useSelector((state: RootState) => state.vendorProfile.profile);
  const isLoading = useSelector((state: RootState) => state.vendorProfile.isLoading);
  const vendorCategories = useSelector((state: RootState) => state.vendorProfile.vendorCategories);
  const [address, setAddress] = useState<GoogleMap | Address>(vendorProfile.address);
  const classes = useStyles();
  const dispatch = useAppDispatch();
  const roles = useSelector((state: RootState) => state.auth.user_roles);
  const [open, setOpen] = React.useState(false);
  const [isBargaining, setIsBargaining] = useState(vendorProfile?.is_bargaining);
  const [category, setCategory] = useState([]);
  const [images, setImages] = React.useState([]);
  const [logo, setLogo] = useState(null);
  const navigate = useNavigate();
  const [changeLogo, setChangeLogo] = useState(false);
  const isLoadingLogo = useSelector((state: RootState) => state.vendorProfile.isLoadingLogo);
  const [maxFees, setMaxFees] = useState(null);
  const [customAddress, setCustomAddress] = useState(address?.address_line_1);
  const [customAddress2, setCustomAddress2] = useState('');
  const [errorText, setErrorText] = useState('');

  const photoUrl = useMemo(() => {
    return getResizedPhotoUrl({ source: vendorProfile.logo, size: 'md', isWebp: true });
  }, [vendorProfile?.logo]);

  const deleteLogo = () => {
    setChangeLogo(true);
    setLogo(null);
    dispatch(actionSetCompanyLogo({ logo: null }));
  };

  useEffect(() => {
    dispatch(actionGetVendorProfile());
    dispatch(actionGetVendorCategories());
    if (roles.includes(Role.Vendor)) {
      dispatch(actionGetVendorFiles());
    }
  }, []);

  useEffect(() => {
    setIsBargaining(vendorProfile.is_bargaining);
  }, [vendorProfile.is_bargaining]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsBargaining(event.target.checked);
  };

  const handleToggle = c => () => {
    // return the first index or -1
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
    const arr = vendorProfile.company_categories.map(item => item.id);
    setCategory([...arr]);
  }, []);

  useDidMountEffect(() => {
    setMaxFees(
      Math.max(
        ...vendorCategories
          .filter(item => {
            if (category.includes(item.id)) return item;
          })
          .map(item => Number(item.fees.slice(0, -1))),
      ),
    );
  }, [category]);

  const formik = useFormik({
    initialValues: {
      company_name: '',
      address_line_1: '',
      country: '',
      city: '',
      district: '',
      postCode: '',
      avg_preparation_time: '',
      legal_information: '',
      description: '',
    },

    onSubmit: values => {
      const data = {
        is_bargaining: isBargaining,
        avg_preparation_time: values.avg_preparation_time,
        company_name: values.company_name,
        company_category_ids: category,
        address_line_1: address.address_line_1,
        address_line_2: customAddress2,
        legal_information: values.legal_information,
        description: values.description,
        country: address.country,
        city: address.city,
        district: address.district,
        postcode: address.postcode,
        latitude: address === null ? vendorProfile.address.latitude : address.latitude,
        longitude: address === null ? vendorProfile.address.longitude : address.longitude,
        plus_code: address.plus_code,
      };
      dispatch(
        actionEditVendorProfile({
          data: data,
          navigate: () => navigate('/vendor/profile'),
        }),
      );
      if (changeLogo) {
        dispatch(actionSetCompanyLogo({ logo: logo, navigate: () => navigate('/vendor/profile') }));
      }
      setCategory([]);
    },
    validate: values => {
      const errors = {} as ErrorsType;
      if (values.company_name?.length > 255) {
        errors.company_name = 'max length 250 symbols';
      }

      if (values.address_line_1?.length > 255) {
        errors.address_line_1 = 'max length 250 symbols';
      }
      if (values.legal_information?.length > 5000) {
        errors.legal_information = 'max length 5000 symbols';
      }
      if (values.description?.length > 5000) {
        errors.description = 'max length 5000 symbols';
      }

      return errors;
    },
  });

  useEffect(() => {
    formik.setValues(
      {
        company_name: vendorProfile?.company_name,
        address_line_1: '',
        description: vendorProfile?.description,
        legal_information: vendorProfile?.legal_information,
        avg_preparation_time: vendorProfile?.avg_preparation_time,
        country: vendorProfile?.address?.country,
        city: vendorProfile?.address?.city,
        postCode: vendorProfile?.address?.postcode,
        district: vendorProfile?.address?.district,
      },
      true,
    );

    setCustomAddress2(vendorProfile?.address?.address_line_2);
  }, [vendorProfile]);

  const addImage = imageList => {
    setImages(imageList);
    if (imageList.length === 1) {
      setLogo(imageList[0].file);
    }
  };

  const openMap = () => {
    setOpen(true);
  };

  return (
    <>
      {isLoadingLogo && <CircularProgress />}
      {vendorProfile && !isLoading && !isLoadingLogo && (
        <ImageUploading value={images} onChange={addImage} maxNumber={1} dataURLKey="data_url">
          {({ imageList, onImageUpload, onImageUpdate, onImageRemoveAll }) => (
            <div className={styles.profile_container_vendor}>
              <div className={styles.profileInfo}>
                <div className={styles.avatar}>
                  <div
                    className={styles.delete_btn}
                    onClick={() => {
                      onImageRemoveAll();
                      deleteLogo();
                    }}
                  >
                    <IconButton
                      sx={{
                        color: 'fff',
                      }}
                      type="button"
                      aria-label="delete"
                    >
                      <DeleteIcon
                        sx={{
                          color: 'fff',
                        }}
                      />
                    </IconButton>
                  </div>

                  {!vendorProfile.logo && (
                    // write your building UI
                    <div
                      className={styles.logo_container}
                      onClick={() => {
                        if (imageList.length > 0) {
                          onImageUpdate(0);
                        } else {
                          onImageUpload();
                        }
                        setChangeLogo(true);
                      }}
                    >
                      <div className={styles.photo_container}>
                        {imageList.length === 0 ? (
                          <PhotoSizeSelectActualOutlinedIcon sx={{ fontSize: 200 }} />
                        ) : (
                          <img src={imageList[0]?.data_url} alt="image" width="200" height="200" />
                        )}
                      </div>
                    </div>
                  )}
                  {vendorProfile.logo && (
                    <div
                      className={styles.logo_container}
                      onClick={() => {
                        setChangeLogo(true);
                        if (imageList.length > 0) {
                          onImageUpdate(0);
                        } else {
                          onImageUpload();
                        }
                      }}
                    >
                      {imageList.length > 0 && (
                        <div className={styles.photo_container}>
                          <img src={imageList[0]?.data_url} alt="image" width="200" height="200" />
                        </div>
                      )}
                      {imageList.length === 0 && (
                        <div className={styles.photo_container}>
                          <img
                            style={{ width: 200 }}
                            src={photoUrl}
                            alt="image"
                            width="200"
                            height="200"
                          />
                        </div>
                      )}
                    </div>
                  )}
                </div>
                <div className={vendors.nameInfo}>
                  <h4 className={vendors.title}>Edit vendor profile:</h4>
                  <form className={styles.form} onSubmit={formik.handleSubmit}>
                    <FormControlLabel
                      sx={{
                        marginBottom: 2,
                        '& span': {
                          fontFamily: 'Montserrat',
                        },
                      }}
                      value={isBargaining}
                      onChange={handleChange}
                      checked={isBargaining}
                      control={<Switch color="primary" />}
                      label={`Bargaining: ${isBargaining ? 'On' : 'Off'}`}
                      labelPlacement="start"
                    />
                    <div className={vendors.input_container}>
                      <TextField
                        id="company_name"
                        label="Store name"
                        type="text"
                        onChange={formik.handleChange}
                        value={formik.values.company_name ? formik.values.company_name : ''}
                        helperText={formik.errors.company_name}
                        className={classes.narrowFormInput}
                      />

                      {/* <CustomWidthTooltip
                        title={'you cant change company name after profile approve'}
                      >
                        <IconButton>
                          <InfoIcon />
                        </IconButton>
                      </CustomWidthTooltip> */}
                    </div>

                    <div className={vendors.input_container}>
                      <TextField
                        id="avg_preparation_time"
                        label="Average cooking time (min)"
                        type="text"
                        onChange={formik.handleChange}
                        value={
                          formik.values.avg_preparation_time
                            ? formik.values.avg_preparation_time
                            : ''
                        }
                        className={classes.narrowFormInput}
                      />
                    </div>

                    <div>
                      <div style={{ display: 'flex', alignItems: 'end' }}>
                        <span className={vendors.categories}>Category (no more than 2)</span>
                        {/* <CustomWidthTooltip
                          title={'you cant change categories after profile approve'}
                        >
                          <IconButton>
                            <InfoIcon />
                          </IconButton>
                        </CustomWidthTooltip> */}
                      </div>
                      <div
                        style={{ flexDirection: 'column', paddingLeft: 0 }}
                        className={vendors.checkBox_container}
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
                              <span className={vendors.feesCategory}>
                                Platform fees: {item.fees}
                              </span>
                            </div>
                          );
                        })}
                        {maxFees && isFinite(maxFees) && (
                          <div style={{ marginTop: 10, display: 'flex', flexDirection: 'column' }}>
                            <span className={vendors.feesTitle}>
                              Your platform fees will be {maxFees}%*
                            </span>{' '}
                            <span className={vendors.feesDescription}>
                              *The final platform fees is equal to the maximum fees from the
                              categories you have chosen
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className={vendors.input_container}>
                      <TextField
                        onClick={openMap}
                        style={{ width: '100%' }}
                        id="address_line_1"
                        label="Address line 1"
                        type="text"
                        value={address?.address_line_1 ? customAddress : 'Address line 1'}
                        helperText={errorText}
                        className={classes.narrowFormInput}
                      />
                      {/* <CustomWidthTooltip
                        title={'You cant change address line 1 after profile approve'}
                      >
                        <IconButton>
                          <InfoIcon />
                        </IconButton>
                      </CustomWidthTooltip> */}
                    </div>
                    <div className={vendors.input_container}>
                      <TextField
                        id="address_line_2"
                        label="Address line 2"
                        type="text"
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                          setCustomAddress2(e.currentTarget.value);
                        }}
                        value={customAddress2}
                        className={classes.narrowFormInput}
                      />
                    </div>

                    {/* <div
                      style={{ flexDirection: 'column', height: 150 }}
                      className={vendors.input_container}
                    >
                      <span className={vendors.categories}>Legal information</span>
                      <TextareaAutosize
                        maxRows={4}
                        aria-label="legal_information"
                        placeholder="Legal information"
                        id="legal_information"
                        value={
                          formik.values.legal_information ? formik.values.legal_information : ''
                        }
                        onChange={formik.handleChange}
                        style={{ width: '100%' }}
                        className={vendors.textAria_container}
                      />
                    </div> */}

                    <div
                      style={{ flexDirection: 'column', height: 150 }}
                      className={vendors.input_container}
                    >
                      <span className={vendors.categories}>Description</span>
                      <TextareaAutosize
                        maxRows={4}
                        style={{ width: '100%' }}
                        aria-label="description"
                        id="description"
                        placeholder="Description"
                        value={formik.values.description ? formik.values.description : ''}
                        onChange={formik.handleChange}
                        className={vendors.textAria_container}
                      />
                    </div>
                    <div className={classes.button}>
                      <Button type="submit" className="btn btn-primary">
                        {isLoading ? <CircularProgress size={20} /> : 'Update profile information'}
                      </Button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          )}
        </ImageUploading>
      )}
      <MapModal
        customAddress2={customAddress2}
        setCustomAddress2={setCustomAddress2}
        setCustomAddress={setCustomAddress}
        setErrorText={setErrorText}
        address={address}
        setAddress={setAddress}
        open={open}
        setOpen={setOpen}
      />
    </>
  );
};

export default EditVendorProfile;
