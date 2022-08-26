import { RootState } from '@/store';
import React from 'react';
import { useSelector } from 'react-redux';
import styles from './RightBlock.module.scss';
const HopperInfo = () => {
  const singleProduct = useSelector((state: RootState) => state.productsAdmin.singleOrder);

  return (
    <>
      {singleProduct && (
        <div className={`${styles.user_info_container} custom_scrollbar_small`}>
          <h3 className={styles.block_title}>Hopper info:</h3>
          <span className={styles.info_text}>
            <b>First name:</b> {singleProduct.hopper_profile?.user.first_name}
          </span>
          <span className={styles.info_text}>
            <b>Last name:</b> {singleProduct.hopper_profile?.user.last_name}
          </span>
          <span className={styles.info_text}>
            <b>Email:</b> {singleProduct.hopper_profile?.user.email}
          </span>
          <span className={styles.info_text}>
            <b>Phone:</b> {singleProduct.hopper_profile?.user.phone_number}
          </span>
        </div>
      )}
    </>
  );
};

export default HopperInfo;
