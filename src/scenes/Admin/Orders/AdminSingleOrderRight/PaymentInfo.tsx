import { RootState } from '@/store';
import React from 'react';
import { useSelector } from 'react-redux';
import styles from './RightBlock.module.scss';
import { DateTime } from 'luxon';
import { toFormat } from 'dinero.js';
import { currencyTransformer, Kobo } from '@/utils/dinero';
const PaymentInfo = () => {
  const singleProduct = useSelector((state: RootState) => state.productsAdmin.singleOrder);
  return (
    <>
      {singleProduct && (
        <div className={`${styles.user_info_container} custom_scrollbar_small`}>
          <h3 className={styles.block_title}>Payment info:</h3>
          <span className={styles.info_text}>
            <b>Action:</b> {singleProduct.payment.action}
          </span>
          <span className={styles.info_text}>
            <b>Amount:</b> {toFormat(Kobo(singleProduct.payment.amount), currencyTransformer)}
          </span>
          <span className={styles.info_text}>
            <b>Payment type:</b> {singleProduct.payment_type}
          </span>
          {singleProduct.paid_at && (
            <span className={styles.info_text}>
              <b>Created at:</b>{' '}
              {DateTime.fromISO(singleProduct.payment.created_at).toLocaleString(
                DateTime.DATETIME_SHORT,
              )}
            </span>
          )}
        </div>
      )}
    </>
  );
};

export default PaymentInfo;
