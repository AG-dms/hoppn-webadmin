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
} from '@/store/slices/SuperAdminSlice/superAdminSlice';
import { CircularProgress, SelectChangeEvent } from '@mui/material';
import { SingleAdminData } from '@store/slices/SuperAdminSlice/type';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import AdminBodyCollapse from './AdminBodyCollapse';
import styles from './SuperAdmin.module.scss';
import { useAppDispatch } from '@/customHooks/storeHooks';
interface props {
  dataProps: SingleAdminData[];
  dataHead: HeaderColumn<any, any, any>[];
}

const AdminTable: React.FC<props> = ({ dataProps, dataHead }) => {
  const isLoading = useSelector((state: RootState) => state.superAdmin.isLoading);

  const dispatch = useAppDispatch();

  const paginationState = useSelector((state: RootState) => state.superAdmin.paginationState);
  const count = useSelector((state: RootState) => state.superAdmin.count);

  const sortState = useSelector((state: RootState) => state.superAdmin.sortState);
  const limit =
    useSelector((state: RootState) => state.superAdmin.paginationState.itemsPerPage) || null;
  const offset = useSelector((state: RootState) => state.superAdmin.queryList.offset);

  const handleClick = (event, page) => {
    dispatch(actionSetCurrentPage(page));
    dispatch(actionSetOffset());
  };

  const handleChange = (event: SelectChangeEvent) => {
    dispatch(actionClearPaginationData());
    dispatch(actionSetItemsPerPage(event.target.value));
  };

  const setSortColumn = (paramName: string, directionArrow) => {
    dispatch(actionSetSort({ sortParam: paramName, direction: directionArrow }));
  };

  return (
    <>
      <div className={styles.table_container}>
        <TableFrame isLoading={isLoading}>
          <TableContentFrame
            sortState={sortState}
            setSortColumn={setSortColumn}
            dataHead={dataHead}
            dataBody={dataProps}
            component={AdminBodyCollapse}
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

export default AdminTable;
