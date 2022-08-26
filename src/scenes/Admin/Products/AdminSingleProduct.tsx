import { useAppDispatch } from '@/customHooks/storeHooks';
import { RootState } from '@/store';
import { actionGetSingleAdminProduct } from '@/store/slices/AdminProductsSlice/AllProductsSlice';
import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import styles from './styles.module.scss';
import 'react-responsive-carousel/lib/styles/carousel.min.css'; // requires a loader
import { Carousel } from 'react-responsive-carousel';
import Slider from 'react-slick';
import { DateTime } from 'luxon';
import { toFormat } from 'dinero.js';
import { currencyTransformer, Kobo } from '@/utils/dinero';
import { NGN } from '@dinero.js/currencies';
import { getResizedPhotoUrl } from '@/utils/get-resize-photo';

const settings = {
  dots: true,
  infinite: true,
  speed: 500,
  slidesToShow: 1,
  slidesToScroll: 1,
};

const AdminSingleProduct = () => {
  const { id } = useParams();
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(actionGetSingleAdminProduct(id));
  }, []);

  const singleProduct = useSelector((state: RootState) => state.allProducts.singleProduct);

  return (
    <div className={styles.container}>
      {singleProduct?.photos.length > 0 && (
        <div className={styles.left_block}>
          <div className={styles.slider}>
            <Carousel
              infiniteLoop={true}
              showArrows={true}
              showStatus={false}
              thumbWidth={50}
              showThumbs={false}
              width={'100%'}
              centerMode={false}
              axis="horizontal"
              autoPlay={true}
              className={styles.carouselRoot}
            >
              {singleProduct?.photos.map(item => {
                return (
                  <div className={styles.slider_item} key={`item_${item.id}`}>
                    <img
                      src={`${getResizedPhotoUrl({
                        source: item.name,
                        size: 'lg',
                        isWebp: true,
                      })}`}
                    />
                  </div>
                );
              })}
            </Carousel>
          </div>
        </div>
      )}
      <div className={styles.right_block}>
        <div className={styles.right_container}>
          <h2 className={styles.right_title}>{singleProduct?.name}</h2>
          <div className={styles.block_container}>
            <span className={styles.block_title}>Category:</span>
            <span className={styles.block_title}>{singleProduct?.category?.name}</span>
          </div>
          <div className={styles.block_container}>
            <span className={styles.block_title}>Price:</span>
            <span className={styles.block_title}>
              {toFormat(Kobo(singleProduct?.price), currencyTransformer)} ₦
            </span>
          </div>
          <div className={styles.block_container}>
            <span className={styles.block_title}>Draft:</span>
            <span className={styles.block_title}>{singleProduct?.is_draft ? 'Yes' : 'No'} </span>
          </div>
          {singleProduct?.description && (
            <div className={styles.description_container}>
              <span className={styles.block_title}>Description:</span>
              <div className={`${styles.description} custom_scrollbar_small`}>
                {singleProduct?.description}
              </div>
            </div>
          )}
          <div className={styles.block_container}>
            <span className={styles.block_title}>Vendor:</span>
            <span className={styles.block_title}>
              {singleProduct?.vendor_profile?.company_name}
            </span>
          </div>
          <div className={styles.block_container}>
            <span className={styles.block_title}>Created at:</span>
            <span className={styles.block_title}>
              {DateTime.fromISO(singleProduct?.created_at).toLocaleString()}
            </span>
          </div>
          <div className={styles.block_container}>
            <span className={styles.block_title}>Updated at:</span>
            <span className={styles.block_title}>
              {DateTime.fromISO(singleProduct?.updated_at).toLocaleString()}
            </span>
          </div>

          <h2 style={{ marginTop: 15 }} className={styles.right_title}>
            Owner info:
          </h2>
          {singleProduct?.vendor_profile?.owner?.first_name && (
            <div className={styles.block_container}>
              <span className={styles.block_title}>First name:</span>
              <span className={styles.block_title}>
                {singleProduct?.vendor_profile?.owner?.first_name}
              </span>
            </div>
          )}
          {singleProduct?.vendor_profile?.owner?.last_name && (
            <div className={styles.block_container}>
              <span className={styles.block_title}>Last name:</span>
              <span className={styles.block_title}>
                {singleProduct.vendor_profile.owner.last_name}
              </span>
            </div>
          )}
          {singleProduct?.vendor_profile?.owner?.email && (
            <div className={styles.block_container}>
              <span className={styles.block_title}>Email:</span>
              <span className={styles.block_title}>
                {singleProduct?.vendor_profile?.owner?.email}
              </span>
            </div>
          )}
          {singleProduct?.vendor_profile?.owner.phone_number && (
            <div className={styles.block_container}>
              <span className={styles.block_title}>Phone:</span>
              <span className={styles.block_title}>
                {singleProduct?.vendor_profile?.owner?.phone_number}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminSingleProduct;
