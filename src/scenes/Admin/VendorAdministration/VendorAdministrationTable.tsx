import { VendorApplicationType } from '@/api/dto/VendorResponseData';
import TableContentFrame, { HeaderColumn } from '@/components/Table/TableContentFrame';
import TableFrame from '@/components/Table/TableFrame';
import TablePagination from '@/components/Table/TablePagination';
import type { RootState } from '@/store';
import {
  actionClearPaginationData,
  actionSetCurrentPage,
  actionSetItemsPerPage,
  actionSetOffset,
  actionSetSort,
} from '@/store/slices/VendorAdministrationSlice/vendorApplicationSlice';
import { SelectChangeEvent } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styles from '../../SuperAdmin/SuperAdmin.module.scss';
import { useAppDispatch } from '@/customHooks/storeHooks';
interface props {
  dataProps: VendorApplicationType[];
  dataHead: HeaderColumn<any, any, any>[];
}

import SingleVendorCollapse from './SingleVendorCollapse';
import ChangeBalanceModal from '@/components/Modals/ChangeBalanceModal';
import { useNavigate } from 'react-router-dom';

const VendorAdministrationTable: React.FC<props> = ({ dataProps, dataHead }) => {
  const isLoading = useSelector((state: RootState) => state.vendorApplication.isLoading);

  const dispatch = useAppDispatch();

  const paginationState = useSelector(
    (state: RootState) => state.vendorApplication.paginationState,
  );

  const count = useSelector((state: RootState) => state.vendorApplication.count);

  const sortState = useSelector((state: RootState) => state.vendorApplication.sortState);
  const limit =
    useSelector((state: RootState) => state.vendorApplication.paginationState.itemsPerPage) || null;
  const offset = useSelector((state: RootState) => state.vendorApplication.queryList.offset);

  const handleClick = (event, page) => {
    dispatch(actionSetCurrentPage(page));
    dispatch(actionSetOffset());
  };

  const navigate = useNavigate();

  const handleChange = (event: SelectChangeEvent) => {
    dispatch(actionClearPaginationData());
    dispatch(actionSetItemsPerPage(event.target.value));
  };

  const clickNavigate = (id: string) => {
    navigate(`/admin/moderation_vendor/${id}`);
  };

  const setSortColumn = (paramName: string, directionArrow) => {
    dispatch(actionSetSort({ sortParam: paramName, direction: directionArrow }));
  };

  return (
    <>
      <div className={styles.table_container}>
        <TableFrame isLoading={isLoading}>
          <TableContentFrame
            clickNavigate={clickNavigate}
            sortState={sortState}
            setSortColumn={setSortColumn}
            dataHead={dataHead}
            dataBody={dataProps}
            component={SingleVendorCollapse}
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

export default VendorAdministrationTable;
