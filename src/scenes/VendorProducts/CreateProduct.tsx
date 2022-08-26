import { useAppDispatch } from '@/customHooks/storeHooks';
import type { RootState } from '@/store';
import {
  actionChangeProductDraft,
  actionCleanVendorProductsStore,
  actionCreateNewProduct,
  actionDeleteProductPhoto,
  actionEditProduct,
  actionGetProductCategories,
  actionGetSingleProduct,
} from '@/store/slices/VendorProductsSlice/vendorProductsSlice';
import global from '@/styles/global.module.scss';
import { useStyles } from '@/styles/materialCustom';
import { decimalStringTransformer, Kobo } from '@/utils/dinero';
import { getResizedPhotoUrl } from '@/utils/get-resize-photo';
import DeleteIcon from '@mui/icons-material/Delete';
import { Button, CircularProgress, FormControlLabel, IconButton, Switch } from '@mui/material';
import currency from 'currency.js';
import { toFormat } from 'dinero.js';
import { useFormik } from 'formik';
import React, { useEffect, useState } from 'react';
import ImageUploading from 'react-images-uploading';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import validator from 'validator';
import styles from './vendorProduct.module.scss';
import WarningIcon from '@mui/icons-material/Warning';

type ErrorsType = {
  name: string;
  category: string;
  price: string | currency;
  description: string;

  file: [];
};

const CreateProduct: React.FC = () => {
  // main data
  const dispatch = useAppDispatch();
  const { id } = useParams();
  const [wrongCategory, setWrongCategory] = useState(false);
  const classes = useStyles();
  const vendorsCategory = useSelector(
    (state: RootState) => state.vendorProfile.profile.company_categories,
  );
  const isLoading = useSelector((state: RootState) => state.vendorProducts.isLoading);
  const productsCategory = useSelector((state: RootState) => state.vendorProducts.productsCategory);
  const singleProduct = useSelector((state: RootState) => state.vendorProducts.singleProduct);
  const [category, setCategory] = useState(
    parseInt(singleProduct?.category?.id) || parseInt(productsCategory[0]?.id),
  );

  const [currentPhotoIds, setCurrentPhotoIds] = useState([]);

  const vendorProfile = useSelector((state: RootState) => state.vendorProfile.profile);

  // set draft
  const [draft, setDraft] = useState<boolean>(singleProduct?.is_draft || false);
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(
      actionChangeProductDraft({
        id: singleProduct.id,
        is_draft: !draft,
        change: () => setDraft(event.target.checked),
      }),
    );
  };

  // for upload photo
  const [images, setImages] = React.useState([]);
  const maxNumber = 10;

  // get categories
  useEffect(() => {
    const ids = vendorsCategory.map(item => item.id);
    dispatch(actionGetProductCategories(ids));
    if (id) {
      dispatch(actionGetSingleProduct(id));
      setDraft(singleProduct?.is_draft);
    }

    // clean page when unmount
    return () => {
      dispatch(actionCleanVendorProductsStore());
    };
  }, []);

  useEffect(() => {
    if (!productsCategory.map(item => Number(item.id)).includes(category)) {
      setWrongCategory(true);
    } else setWrongCategory(false);
  }, [category]);

  useEffect(() => {
    setDraft(singleProduct?.is_draft);
  }, [singleProduct?.is_draft]);

  useEffect(() => {
    if (singleProduct) {
      const photoIds = singleProduct?.photos.map(photo => {
        return photo.id;
      });
      setCurrentPhotoIds([...photoIds]);
    }
  }, [singleProduct]);

  const deletePhoto = (photoId: string) => {
    dispatch(actionDeleteProductPhoto(photoId));
    // if (currentPhotoIds.length - 1 === 0) setCurrentPhotoIds(null);
  };

  // formik logik
  const formik = useFormik({
    initialValues: {
      name: '',
      price: '',
      description: '',
      images: null,
    },
    onSubmit: () => {
      if (!singleProduct) {
        dispatch(
          actionCreateNewProduct({
            name: formik.values.name,
            category_id: category,
            price: currency(formik.values.price),
            description: formik.values.description,
            photos: formik.values.images,
          }),
        );

        formik.resetForm();
        setCategory(Number(productsCategory[0].id));
        setImages([]);
      } else {
        dispatch(
          actionEditProduct({
            id: singleProduct.id,
            photos: formik.values.images,
            current_photo_ids: currentPhotoIds,
            name: formik.values.name,
            category_id: category.toString(),
            description: formik.values.description,
            price: formik.values.price,
          }),
        );
        setImages([]);
      }
    },
    validate: values => {
      const errors = {} as ErrorsType;
      if (!values?.name.length) {
        errors.name = 'Require';
      }
      if (values?.name.length > 255) {
        errors.name = 'Max length 255 symbols';
      }
      if (values?.description.length > 5000) {
        errors.description = 'Max length 5000 symbols';
      }

      if (values?.price === '0') {
        errors.price = 'Price cant be 0';
      }

      if (
        !validator.isCurrency(values?.price, {
          allow_negatives: false,
          digits_after_decimal: [1, 2],
          allow_space_after_symbol: true,
          symbol: '₦',
        })
      ) {
        errors.price = 'price must be a currency format - 100.50';
      }
      return errors;
    },
  });

  const handleChangeSelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setCategory(parseInt(event.target.value));
  };

  useEffect(() => {
    setCategory(Number(productsCategory[0]?.id));
    if (singleProduct) {
      const number = Number(singleProduct.category.id);
      setCategory(number);
      formik.setValues({
        name: singleProduct.name,
        price: toFormat(Kobo(singleProduct.price), decimalStringTransformer),
        description: singleProduct.description,
        images: null,
      });
    }
  }, [singleProduct, productsCategory]);

  // upload photos
  const addImage = imageList => {
    setImages(imageList);
    formik.values.images = imageList.map(image => {
      return image.file;
    });
  };

  return (
    <>
      {isLoading && <CircularProgress />}

      {!isLoading && productsCategory.length > 0 && (
        <div className={styles.container}>
          <h2 className={styles.title_form}>{id ? 'Edit product' : 'Create product'}</h2>
          {singleProduct && !isLoading ? (
            <div style={{ display: 'flex', alignItems: 'center', marginTop: 15 }}>
              <FormControlLabel
                sx={{
                  marginBottom: 0,
                  '& span': {
                    fontFamily: 'Montserrat',
                  },
                }}
                value={!!draft}
                onChange={handleChange}
                disabled={wrongCategory}
                checked={!!draft}
                control={<Switch color="primary" />}
                label={`Draft: ${draft ? 'On' : 'Off'}`}
                labelPlacement="start"
              />
              {!singleProduct.is_draft ? (
                <div className={styles.scene_warning}>
                  <WarningIcon sx={{ color: 'red' }} />
                  <span className={styles.scene_warning_text}>
                    Editing is only available in draft mode
                  </span>
                </div>
              ) : null}
            </div>
          ) : null}
          <form onSubmit={formik.handleSubmit} className={styles.form_container}>
            <div
              style={{ display: 'flex', justifyContent: 'space-between', flexDirection: 'column' }}
            >
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <div className={styles.left_edit}>
                    <div className={global.input_container}>
                      <label htmlFor="name">
                        Name <span className={global.require}>*</span>
                      </label>
                      <input
                        disabled={singleProduct && !draft}
                        value={formik.values.name}
                        onChange={formik.handleChange}
                        id="name"
                        className={global.input}
                        placeholder="name of product"
                      />
                      {formik.errors.name && (
                        <span className={global.require_text}>{formik.errors.name}</span>
                      )}
                    </div>

                    <div style={{ marginBottom: 25 }} className={global.select_container}>
                      <label htmlFor="category">
                        Category <span className={global.require}>*</span>
                      </label>
                      <select
                        disabled={singleProduct && !draft}
                        value={category}
                        id="category"
                        placeholder={
                          singleProduct?.category?.name ? singleProduct?.category?.name : 'choose'
                        }
                        onChange={handleChangeSelect}
                        className={`${global.select} ${
                          wrongCategory && singleProduct?.category && global.wrongSelect
                        }`}
                      >
                        {singleProduct?.category && (
                          <option hidden key={category} value={singleProduct?.category?.name}>
                            {singleProduct.category.name}
                          </option>
                        )}
                        {productsCategory &&
                          productsCategory.map(item => {
                            return (
                              <option key={item.id} value={item.id}>
                                {item.name}
                              </option>
                            );
                          })}
                      </select>
                      {wrongCategory && singleProduct?.category && (
                        <span className={global.require_text}>This category is not available </span>
                      )}
                    </div>
                    <div className={global.input_container}>
                      <label htmlFor="price">
                        Price <span className={global.require}>*</span>
                      </label>
                      <div style={{ display: 'flex', alignItems: 'end' }}>
                        <input
                          disabled={singleProduct && !draft}
                          className={`${global.input} ${global.price}`}
                          onChange={formik.handleChange}
                          type="text"
                          value={formik.values.price}
                          id="price"
                        />
                        <span style={{ marginLeft: '10px', fontSize: '30px', alignSelf: 'end' }}>
                          ₦
                        </span>
                      </div>
                      {formik.errors.price && (
                        <span className={global.require_text}>{formik.errors.price}</span>
                      )}
                    </div>
                  </div>
                  <div className={styles.right_edit}>
                    <div className={global.textArea_container}>
                      <label htmlFor="description">Description</label>
                      <textarea
                        disabled={singleProduct && !draft}
                        value={formik.values.description}
                        onChange={formik.handleChange}
                        id="description"
                        className={global.textarea}
                        placeholder="Description"
                      />
                    </div>
                    {formik.errors.description && (
                      <span className={global.require_text}>{formik.errors.description}</span>
                    )}
                  </div>
                </div>
                {singleProduct?.photos && (
                  <div className={styles.product_photos}>
                    {singleProduct?.photos.map(photo => {
                      return (
                        <div className={styles.product_photos_item} key={photo.id}>
                          <img
                            style={{ width: 'inherit' }}
                            src={`${getResizedPhotoUrl({
                              source: photo.name,
                              size: 'md',
                              isWebp: true,
                            })}`}
                            alt="photo"
                          />
                          <div className={styles.delete_btn}>
                            <IconButton
                              sx={{
                                color: 'fff',
                              }}
                              disabled={singleProduct && !draft}
                              onClick={() => deletePhoto(photo.id)}
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
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
              <div className={global.file_input}>
                <div className={styles.file_input_load}>
                  <div className={global.file_input_head}>
                    <label htmlFor="file">Image upload. </label>
                    <span style={{ fontSize: 16 }}>
                      Please upload images in .JPG or .PNG format. Maximum 10 photos
                    </span>
                  </div>
                  <ImageUploading
                    multiple
                    value={images}
                    onChange={addImage}
                    maxNumber={maxNumber}
                    dataURLKey="data_url"
                  >
                    {({
                      imageList,
                      onImageUpload,
                      onImageRemoveAll,
                      onImageUpdate,
                      onImageRemove,
                      isDragging,
                      dragProps,
                    }) => (
                      // write your building UI
                      <div className={styles.upload__image_wrapper}>
                        <div className={styles.btn_group}>
                          <div className={classes.button_out}>
                            <Button
                              disabled={singleProduct && !draft}
                              type="button"
                              style={isDragging ? { color: 'red' } : undefined}
                              onClick={onImageUpload}
                              {...dragProps}
                            >
                              Click or Drop here
                            </Button>
                          </div>
                          &nbsp;
                          {images.length >= 1 && (
                            <div className={classes.button_out}>
                              <Button type="button" onClick={onImageRemoveAll}>
                                Remove all images
                              </Button>
                            </div>
                          )}
                        </div>
                        <div className={styles.preload_Image}>
                          {imageList.map((image, index) => (
                            <div key={index} className={styles.image_item}>
                              <div className={styles.image}>
                                <img src={image['data_url']} alt="image" width="200" />
                              </div>
                              <div className="image-item__btn-wrapper">
                                <div className={classes.button_out}>
                                  <Button type="button" onClick={() => onImageUpdate(index)}>
                                    Reload
                                  </Button>
                                </div>

                                <div className={styles.delete_btn}>
                                  <IconButton
                                    onClick={() => onImageRemove(index)}
                                    disabled={singleProduct && !draft}
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
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </ImageUploading>
                </div>
              </div>
            </div>
            <div className={`${classes.button} ${styles.button_submit}`}>
              <Button disabled={singleProduct && (!draft || wrongCategory)} type="submit">
                {singleProduct ? 'Save change' : 'Create product'}
              </Button>
            </div>
          </form>
        </div>
      )}
    </>
  );
};

export default CreateProduct;
