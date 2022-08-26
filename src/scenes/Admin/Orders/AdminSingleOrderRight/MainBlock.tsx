import { RootState } from '@/store';
import React from 'react';
import { useSelector } from 'react-redux';
import HopperInfo from './HopperInfo';
import OrderInfo from './OrderInfo';
import PaymentInfo from './PaymentInfo';

import style from './RightBlock.module.scss';
import UserInfo from './UserInfo';
import VendorInfo from './VendorInfo';

const MainBlock: React.FC = () => {
  const singleOrder = useSelector((state: RootState) => state.productsAdmin.singleOrder);
  return (
    <>
      <div className={style.container}>
        <OrderInfo />
        <UserInfo />
        <VendorInfo />
        {singleOrder?.hopper_profile?.id && <HopperInfo />}
        {singleOrder?.payment && <PaymentInfo />}
      </div>
    </>
  );
};

export default MainBlock;
