import { RootState } from '@/store';
import React from 'react';
import { useSelector } from 'react-redux';
import styles from './RightBlock.module.scss';
const UserInfo = () => {
  const singleProduct = useSelector((state: RootState) => state.vendorOrders.singleOrder);

  return (
    <>
      {singleProduct && (
        <div className={styles.user_info_container}>
          <h3 className={styles.block_title}>Client info:</h3>
          <span className={styles.info_text}>
            <b>First name:</b> {singleProduct.user.first_name}
          </span>
          <span className={styles.info_text}>
            <b>Last name:</b> {singleProduct.user.last_name}
          </span>
          <span className={styles.info_text}>
            <b>Phone:</b> {singleProduct.user.phone_number}
          </span>
          <span className={styles.info_text}>
            <b>Address:</b> {singleProduct?.user_address.address_line_1}
          </span>
        </div>
      )}
    </>
  );
};

export default UserInfo;
