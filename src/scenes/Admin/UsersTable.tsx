import { UserListData } from '@/api/dto/UserResponseData';
import TableContentFrame, { HeaderColumn } from '@/components/Table/TableContentFrame';
import TableFrame from '@/components/Table/TableFrame';
import TablePagination from '@/components/Table/TablePagination';
import type { RootState } from '@/store';
import {
  actionClearPaginationData,
  actionGetUsersList,
  actionSetCurrentPage,
  actionSetItemsPerPage,
  actionSetOffset,
  actionSetSort,
} from '@/store/slices/AdminSlice/adminSlice';
import { SelectChangeEvent } from '@mui/material';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styles from '../SuperAdmin/SuperAdmin.module.scss';
// import AdminBodyCollapse from './AdminBodyCollapse';
import SingleUserCollapse from './SingleUserCollapse';
import { useAppDispatch } from '@/customHooks/storeHooks';
interface props {
  dataProps: UserListData[];
  headData: HeaderColumn<any, any, any>[];
}

const UsersTable: React.FC<props> = ({ dataProps, headData }) => {
  const dispatch = useAppDispatch();
  const queryList = useSelector((state: RootState) => state.admin.queryList);
  const paginationState = useSelector((state: RootState) => state.admin.paginationState);
  const count = useSelector((state: RootState) => state.admin.count);

  const isLoading = useSelector((state: RootState) => state.admin.isLoading);

  const limit = useSelector((state: RootState) => state.admin.paginationState.itemsPerPage) || null;

  const offset = useSelector((state: RootState) => state.admin.queryList.offset);

  const sortState = useSelector((state: RootState) => state.admin.sortState);

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
            component={SingleUserCollapse}
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

export default UsersTable;
