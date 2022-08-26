import { RootState } from '@/store';
import React from 'react';
import { useSelector } from 'react-redux';
import styles from './RightBlock.module.scss';

const VendorInfo: React.FC = () => {
  const singleProduct = useSelector((state: RootState) => state.productsAdmin.singleOrder);

  return (
    <>
      {singleProduct && (
        <div className={`${styles.user_info_container} custom_scrollbar_small`}>
          <h3 className={styles.block_title}>Vendor info:</h3>
          <span className={styles.info_text}>
            <b>Company name:</b> {singleProduct.vendor.company_name}
          </span>
          <span className={styles.info_text}>
            <b>Address:</b> {singleProduct.vendor_address.address_line_1}
          </span>
        </div>
      )}
    </>
  );
};

export default VendorInfo;
