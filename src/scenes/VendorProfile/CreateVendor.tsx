import { downloadFile } from '@/api/vendorAPI';
import { useAppDispatch } from '@/customHooks/storeHooks';
import { useDidMountEffect } from '@/customHooks/useDidMount';
import type { RootState } from '@/store';
import {
  actionAddFiles,
  actionDeleteFile,
  actionEditVendorRegistration,
  actionGetVendorCategories,
  actionGetVendorFiles,
  actionGetVendorRegistrationForm,
  actionRegistrationVendor,
} from '@/store/slices/VendorProfile/vendorProfileSlice';
import { useStyles } from '@/styles/materialCustom';
import { Role } from '@/utils/enum/Role';
import AddIcon from '@mui/icons-material/Add';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import { Button, CircularProgress, IconButton } from '@mui/material';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import TextareaAutosize from '@mui/material/TextareaAutosize';
import TextField from '@mui/material/TextField';
import { useFormik } from 'formik';
import React, { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import styles from './vendorProfile.module.scss';

type ErrorsType = {
  company_name: string;
  company_categories: string;
  address: string;
  description: string;
  file: string;
};

const CreateVendor: React.FC = () => {
  const dispatch = useAppDispatch();
  const registrationForm = useSelector((state: RootState) => state.vendorProfile.registrationForm);
  const [category, setCategory] = useState([]);
  const classes = useStyles();
  const vendorsCategories = useSelector((state: RootState) => state.vendorProfile.vendorCategories);
  const vendorDocuments = useSelector((state: RootState) => state.vendorProfile.profile.files);
  const vendorDocumentsLoading = useSelector(
    (state: RootState) => state.vendorProfile.isLoadingFile,
  );

  const [maxFees, setMaxFees] = useState(null);
  const loading = useSelector((state: RootState) => state.vendorProfile.isLoading);
  const roles = useSelector((state: RootState) => state.auth.user_roles);
  const navigate = useNavigate();
  const companyNameRef = useRef(null);
  const addressRef = useRef(null);
  const categoryRef = useRef(null);

  const ref = useRef<any>();
  const [file, setFile] = useState<File>(null);
  const handleDeleteFile = () => {
    ref.current.value = '';
    setFile(null);
  };

  const deleteFile = (id: string) => {
    dispatch(actionDeleteFile(id));
  };

  useEffect(() => {
    if (roles.includes(Role.Vendor)) {
      dispatch(actionGetVendorRegistrationForm());
      dispatch(actionGetVendorFiles());
    }
    dispatch(actionGetVendorCategories());
  }, []);

  useDidMountEffect(() => {
    setMaxFees(
      Math.max(
        ...vendorsCategories
          .filter(item => {
            if (category.includes(item.id)) return item;
          })
          .map(item => Number(item.fees.slice(0, -1))),
      ),
    );
  }, [category]);

  const formik = useFormik({
    initialValues: {
      files: null,
      company_name: '',
      company_categories: [],
      address: '',
      description: '',
      takeaway_food: '',
      registered_business: '',
      business_license: '',
    },
    onSubmit: values => {
      if (roles.includes(Role.Vendor)) {
        dispatch(
          actionEditVendorRegistration({
            vendor: {
              address: values.address,
              business_license: values.business_license,
              company_category_ids: category,
              company_name: values.company_name,
              description: values.description,
              registered_business: values.registered_business,
              takeaway_food: values.takeaway_food,
            },
            navigate: () => navigate('/vendor'),
          }),
        );
      } else {
        dispatch(
          actionRegistrationVendor({
            vendor: {
              company_name: values.company_name,
              files: values.files,
              address: values.address,
              company_category: category,
              description: values.description,
              business_license: values.business_license,
              registered_business: values.registered_business,
              takeaway_food: values.takeaway_food,
            },
            navigate: () => navigate('/vendor'),
          }),
        );
      }
    },
    validate: values => {
      const errors = {} as ErrorsType;

      if (values?.company_categories.length === 0) {
        errors.company_categories = 'Require';
        categoryRef.current.scrollIntoView();
      }

      if (values?.company_categories.length > 2) {
        errors.company_categories = 'No more than 2 categories';
        categoryRef.current.scrollIntoView();
      }

      if (values?.address.length <= 0) {
        errors.address = 'Require';
        addressRef.current.scrollIntoView();
      }

      if (values?.company_name.length > 255) {
        errors.company_name = 'max length 250 symbols';
        companyNameRef.current.scrollIntoView();
      }
      if (values?.company_name.length <= 0) {
        errors.company_name = 'Require';
        companyNameRef.current.scrollIntoView();
      }

      if (values?.description.length > 5000) {
        errors.description = 'max length 5000 symbols';
      }
      return errors;
    },
    validateOnChange: false,
    validateOnBlur: false,
  });

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
    formik.setFieldValue('files', file, false);
  }, [file]);

  useDidMountEffect(() => {
    formik.setFieldValue('company_categories', category, false);
  }, [category]);

  useEffect(() => {
    if (registrationForm) {
      formik.setValues(
        {
          files: null,
          company_categories: category,
          address: registrationForm.address,
          company_name: registrationForm.company_name,
          description: registrationForm.description,
          takeaway_food: registrationForm.takeaway_food,
          registered_business: registrationForm.registered_business,
          business_license: registrationForm.business_license,
        },
        false,
      );
    }
  }, [registrationForm]);

  useEffect(() => {
    if (registrationForm) {
      const arr = registrationForm.company_categories.map(item => item.id);
      setCategory([...arr]);
    }
  }, [registrationForm]);

  return (
    <>
      {loading && <CircularProgress />}
      {!loading && (
        <>
          <div className={styles.container}>
            <div className={styles.form_container}>
              <h2>Create Vendor profile</h2>
              <form className={styles.form} onSubmit={formik.handleSubmit}>
                <div style={{ height: 66 }} className={styles.input_container}>
                  <span className={styles.input_title}>Store name</span>
                  <TextField
                    id="company_name"
                    name="company_name"
                    ref={companyNameRef}
                    label="Store name"
                    type="text"
                    onFocus={() => formik.setTouched({ company_name: true })}
                    onChange={formik.handleChange}
                    value={formik.values.company_name}
                    helperText={
                      formik.touched.company_name &&
                      formik.errors.company_name &&
                      formik.errors.company_name
                    }
                    className={`${classes.narrowFormInput} ${
                      formik.errors.company_name && formik.touched.company_name
                        ? classes.require
                        : null
                    }`}
                  />
                </div>

                <div className={styles.input_container}>
                  <span className={styles.input_title}>Address</span>
                  <TextField
                    style={{ width: '100%' }}
                    id="address"
                    ref={addressRef}
                    name="address"
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    onFocus={() => formik.setTouched({ address: true })}
                    label="Address line"
                    type="text"
                    value={formik.values.address}
                    className={`${classes.narrowFormInput} ${
                      formik.errors.address && formik.touched.address ? classes.require : null
                    }`}
                    helperText={
                      formik.touched.address && formik.errors.address && formik.errors.address
                    }
                  />
                </div>

                <div style={{ flexDirection: 'column' }} className={styles.input_container}>
                  <span style={{ width: '100%', marginBottom: 15 }} className={styles.input_title}>
                    Category
                  </span>
                  <span
                    style={{ width: '100%', marginBottom: 15, fontSize: '14px' }}
                    className={styles.input_title}
                  >
                    Select the category that best describes your business
                  </span>
                  <div style={{ marginBottom: '15px' }} className={styles.checkBox_container}>
                    {vendorsCategories.map(item => {
                      return (
                        <div
                          style={{ display: 'flex', flexDirection: 'column', marginBottom: 10 }}
                          key={item.id}
                        >
                          <div ref={categoryRef} className={styles.checkBox_item}>
                            <input
                              onChange={handleToggle(item.id)}
                              name={item.name}
                              checked={category.includes(item.id)}
                              value={item.id}
                              type="checkbox"
                            />
                            <label htmlFor={item.name}>{item.name}</label>
                          </div>
                          <span className={styles.feesCategory}>Platform fees: {item.fees}</span>
                        </div>
                      );
                    })}
                  </div>
                  {formik.errors.company_categories && (
                    <span className={styles.error_msg}>{formik.errors.company_categories}</span>
                  )}
                  {maxFees && isFinite(maxFees) && (
                    <>
                      <span className={styles.feesTitle}>
                        Your platform fees will be {maxFees}%*
                      </span>{' '}
                      <span className={styles.feesDescription}>
                        *The final platform fees is equal to the maximum fees from the categories
                        you have chosen
                      </span>
                    </>
                  )}
                </div>

                <div className={styles.input_container}>
                  <span className={styles.input_title_wide}>Do you offer takeaway?</span>
                  <FormControl>
                    <RadioGroup
                      row
                      value={formik.values.takeaway_food ? formik.values.takeaway_food : ''}
                      aria-labelledby="one"
                      onChange={formik.handleChange}
                      name="takeaway_food"
                      id="takeaway_food"
                    >
                      <FormControlLabel value="Yes" control={<Radio />} label="Yes" />
                      <FormControlLabel value="No" control={<Radio />} label="No" />
                    </RadioGroup>
                  </FormControl>
                </div>
                <div className={styles.input_container}>
                  <span className={styles.input_title_wide}>Is your business registered?</span>
                  <FormControl>
                    <RadioGroup
                      value={
                        formik.values.registered_business ? formik.values.registered_business : ''
                      }
                      row
                      aria-labelledby="two"
                      onChange={formik.handleChange}
                      name="registered_business"
                      id="registered_business"
                    >
                      <FormControlLabel value="Yes" control={<Radio />} label="Yes" />
                      <FormControlLabel value="No" control={<Radio />} label="No" />
                    </RadioGroup>
                  </FormControl>
                </div>
                <div className={styles.input_container}>
                  <span className={styles.input_title_wide}>Do you have a business license?</span>
                  <FormControl>
                    <RadioGroup
                      row
                      value={formik.values.business_license ? formik.values.business_license : ''}
                      aria-labelledby="three"
                      onChange={formik.handleChange}
                      name="business_license"
                      id="business_license"
                    >
                      <FormControlLabel value="Yes" control={<Radio />} label="Yes" />
                      <FormControlLabel value="No" control={<Radio />} label="No" />
                    </RadioGroup>
                  </FormControl>
                </div>

                <div className={styles.input_container}>
                  <span className={styles.input_title}>Description for admin</span>
                  <TextareaAutosize
                    maxRows={6}
                    aria-label="description"
                    id="description"
                    placeholder="Description"
                    value={formik.values.description}
                    onChange={formik.handleChange}
                    className={styles.textAria_container}
                  />
                </div>
                <div className={styles.form_group}>
                  {vendorDocuments &&
                    !vendorDocumentsLoading &&
                    vendorDocuments?.map(item => {
                      return (
                        <div
                          style={{ width: '100%', cursor: 'pointer' }}
                          key={item.id}
                          className={styles.file_upload}
                          onClick={() => downloadFile(item.id)}
                        >
                          <AttachFileIcon fontSize="small" />
                          <span className={styles.file_upload_name}>{item.original_name}</span>
                          <IconButton
                            onClick={e => {
                              e.stopPropagation();
                              deleteFile(item.id);
                            }}
                          >
                            <DeleteForeverIcon fontSize="small" />
                          </IconButton>
                        </div>
                      );
                    })}

                  <span style={{ marginTop: 10, marginBottom: 10 }} className={styles.input_title}>
                    Add documents
                  </span>
                  <div style={{ flexDirection: 'column' }} className={styles.form_group}>
                    <div className={styles.form_group_head}>
                      <span>Please download .zip file with all documents </span>
                      <label className={styles.file_btn} htmlFor="file">
                        <AddIcon />
                        ADD FILE
                      </label>
                    </div>
                    {file ? (
                      <div className={styles.file_upload}>
                        <AttachFileIcon fontSize="small" />
                        <span className={styles.file_upload_name}>{file.name}</span>
                        <IconButton onClick={handleDeleteFile}>
                          <DeleteForeverIcon fontSize="small" />
                        </IconButton>
                      </div>
                    ) : null}
                    <input
                      id="file"
                      name="file"
                      type="file"
                      ref={ref}
                      onChange={event => {
                        setFile(event.currentTarget.files[0]);
                      }}
                      className="form-control"
                    />
                    {roles.includes(Role.Vendor) && (
                      <div style={{ width: 200 }} className={classes.button_out}>
                        <Button
                          onClick={() => {
                            dispatch(actionAddFiles(file));
                            setFile(null);
                            ref.current.value = '';
                          }}
                          type="button"
                          className="btn btn-primary"
                        >
                          Upload file
                        </Button>
                      </div>
                    )}
                  </div>
                </div>

                <div style={{ width: 250 }} className={classes.button}>
                  <Button type="submit" className="btn btn-primary">
                    {roles.includes(Role.Vendor) ? 'Save changes' : 'Create Vendor profile'}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </>
      )}
    </>
  );
};
export default CreateVendor;
