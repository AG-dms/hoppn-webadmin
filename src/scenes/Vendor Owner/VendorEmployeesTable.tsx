import TableContentFrame, { HeaderColumn } from '@/components/Table/TableContentFrame';
import TableFrame from '@/components/Table/TableFrame';
import TablePagination from '@/components/Table/TablePagination';
import type { RootState } from '@/store';
import { SingleUser } from '@/store/slices/Profile/type';
import {
  actionClearPaginationData,
  actionGetVendorEmployees,
  actionSetCurrentPage,
  actionSetItemsPerPage,
  actionSetOffset,
  actionSetSort,
} from '@/store/slices/VendorOwnerSlice/vendorOwnerSlice';
import { SelectChangeEvent } from '@mui/material';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
// import AdminBodyCollapse from './AdminBodyCollapse';
import styles from '../SuperAdmin/SuperAdmin.module.scss';
import VendorEmployeesCollapse from './VendorEmployeesCollapse';
import { useAppDispatch } from '@/customHooks/storeHooks';

interface props {
  dataProps: SingleUser[];
  headData: HeaderColumn<any, any, any>[];
}

const VendorEmployeesTable: React.FC<props> = ({ dataProps, headData }) => {
  const dispatch = useAppDispatch();
  const queryList = useSelector((state: RootState) => state.vendorOwner.queryList);
  const paginationState = useSelector((state: RootState) => state.vendorOwner.paginationState);
  const count = useSelector((state: RootState) => state.vendorOwner.count);

  useEffect(() => {
    dispatch(actionGetVendorEmployees(queryList));
  }, [queryList, paginationState]);

  const isLoading = useSelector((state: RootState) => state.vendorOwner.isLoading);

  const limit =
    useSelector((state: RootState) => state.vendorOwner.paginationState.itemsPerPage) || null;

  const offset = useSelector((state: RootState) => state.vendorOwner.queryList.offset);

  const sortState = useSelector((state: RootState) => state.vendorOwner.sortState);

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
            component={VendorEmployeesCollapse}
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

export default VendorEmployeesTable;
