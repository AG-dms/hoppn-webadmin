import { RootState } from '@/store';
import React from 'react';
import { useSelector } from 'react-redux';
import styles from './RightBlock.module.scss';
import { DateTime } from 'luxon';
const OrderInfo = () => {
  const singleProduct = useSelector((state: RootState) => state.vendorOrders.singleOrder);
  return (
    <>
      {singleProduct && (
        <div className={styles.user_info_container}>
          <h3 className={styles.block_title}>Order info:</h3>
          <span className={styles.info_text}>
            <b>Status:</b> {singleProduct.status}
          </span>
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

          {singleProduct.fulfilled_at && (
            <span className={styles.info_text}>
              <b>Fulfilled at:</b>{' '}
              {DateTime.fromISO(singleProduct.fulfilled_at).toLocaleString(DateTime.DATETIME_SHORT)}
            </span>
          )}
        </div>
      )}
    </>
  );
};

export default OrderInfo;
