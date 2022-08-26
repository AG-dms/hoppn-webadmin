import { UserListData } from '@/api/dto/UserResponseData';
import { SingleProduct, VendorOrderList } from '@/api/dto/VendorResponseData';
import TableContentFrame, { HeaderColumn } from '@/components/Table/TableContentFrame';
import TableFrame from '@/components/Table/TableFrame';
import TablePagination from '@/components/Table/TablePagination';
import type { RootState } from '@/store';
import {
  actionVendorGetOrdersList,
  actionSetCurrentPage,
  actionSetItemsPerPage,
  actionSetOffset,
  actionSetSort,
  actionClearPaginationData,
} from '@/store/slices/VendorOrders/vendorOrderSlice';
import { SelectChangeEvent } from '@mui/material';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useAppDispatch } from '@/customHooks/storeHooks';
// import AdminBodyCollapse from './AdminBodyCollapse';
import styles from '../SuperAdmin/SuperAdmin.module.scss';
// import VendorProductCollapse from './VendorProductCollapse';
interface props {
  dataProps: VendorOrderList[];
  headData: HeaderColumn<any, any, any>[];
}

const VendorOrdersTable: React.FC<props> = ({ dataProps, headData }) => {
  const dispatch = useAppDispatch();
  const queryList = useSelector((state: RootState) => state.vendorOrders.queryList);
  const paginationState = useSelector((state: RootState) => state.vendorOrders.paginationState);
  const count = useSelector((state: RootState) => state.vendorOrders.count);
  useEffect(() => {
    dispatch(actionVendorGetOrdersList(queryList));
  }, [queryList]);

  const isLoading = useSelector((state: RootState) => state.vendorOrders.isLoading);

  const limit =
    useSelector((state: RootState) => state.vendorOrders.paginationState.itemsPerPage) || null;

  const offset = useSelector((state: RootState) => state.vendorOrders.queryList.offset);

  const sortState = useSelector((state: RootState) => state.vendorOrders.sortState);

  const handleClick = (event, page) => {
    dispatch(actionSetCurrentPage(page));
    dispatch(actionSetOffset());
  };

  const handleChange = (event: SelectChangeEvent) => {
    dispatch(actionClearPaginationData());
    dispatch(actionSetItemsPerPage(event.target.value));
  };

  const setSortColumn = (paramName, directionArrow) => {
    dispatch(actionSetSort({ sortParam: paramName, direction: directionArrow }));
  };

  return (
    <>
      <div className={styles.table_container}>
        <TableFrame isLoading={isLoading}>
          <TableContentFrame
            sortState={sortState}
            setSortColumn={setSortColumn}
            dataHead={headData}
            dataBody={dataProps}
            // component={VendorProductCollapse}
          ></TableContentFrame>
        </TableFrame>
      </div>
      <TablePagination
        handleClick={handleClick}
        handleChange={handleChange}
        count={count}
        limit={limit}
        offset={offset}
        paginationState={paginationState}
      />
    </>
  );
};

export default VendorOrdersTable;
