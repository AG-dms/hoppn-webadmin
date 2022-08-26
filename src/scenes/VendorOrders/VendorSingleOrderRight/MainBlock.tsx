import { RootState } from '@/store';
import React from 'react';
import { useSelector } from 'react-redux';
import HopperInfo from './HopperInfo';
import OrderInfo from './OrderInfo';

import style from './RightBlock.module.scss';
import UserInfo from './UserInfo';

const MainBlock: React.FC = () => {
  const singleOrder = useSelector((state: RootState) => state.vendorOrders.singleOrder);
  return (
    <>
      <div className={style.container}>
        <OrderInfo />
        <UserInfo />
        {singleOrder?.hopper_profile?.id && <HopperInfo />}
      </div>
    </>
  );
};

export default MainBlock;
