import { RootState } from '@/store';
import React from 'react';
import { useSelector } from 'react-redux';
import styles from './RightBlock.module.scss';
import { DateTime } from 'luxon';
const OrderInfo = () => {
  const singleProduct = useSelector((state: RootState) => state.productsAdmin.singleOrder);
  return (
    <>
      {singleProduct && (
        <div className={`${styles.user_info_container} custom_scrollbar_small`}>
          <h3 className={styles.block_title}>Order info:</h3>
          <span className={styles.info_text}>
            <b>Status:</b> {singleProduct.status}
          </span>
          <span className={styles.info_text}>
            <b>Preparation time:</b> {singleProduct.preparation_time}
          </span>
          {/* <span className={styles.info_text}>
            <b>Payment type:</b> {singleProduct.payment_type}
          </span> */}
          {singleProduct.paid_at && (
            <span className={styles.info_text}>
              <b>Paid at:</b>{' '}
              {DateTime.fromISO(singleProduct.paid_at).toLocaleString(DateTime.DATETIME_SHORT)}
            </span>
          )}
          <span className={styles.info_text}>
            <b>Created:</b>{' '}
            {DateTime.fromISO(singleProduct.created_at).toLocaleString(DateTime.DATETIME_SHORT)}
          </span>
          {singleProduct.accepted_at && (
            <span className={styles.info_text}>
              <b>Accepted at:</b>{' '}
              {DateTime.fromISO(singleProduct.accepted_at).toLocaleString(DateTime.DATETIME_SHORT)}
            </span>
          )}
          {singleProduct.ready_at && (
            <span className={styles.info_text}>
              <b>Ready at:</b>{' '}
              {DateTime.fromISO(singleProduct.ready_at).toLocaleString(DateTime.DATETIME_SHORT)}
            </span>
          )}
        </div>
      )}
    </>
  );
};

export default OrderInfo;
