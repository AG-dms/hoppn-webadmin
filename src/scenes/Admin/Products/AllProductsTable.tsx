import { UserListData } from '@/api/dto/UserResponseData';
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
} from '@/store/slices/AdminProductsSlice/AllProductsSlice';
import { SelectChangeEvent } from '@mui/material';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styles from '../../SuperAdmin/SuperAdmin.module.scss';

import { useAppDispatch } from '@/customHooks/storeHooks';
import { Product } from '@/store/slices/AdminProductsSlice/types';
import { useNavigate } from 'react-router-dom';
interface props {
  dataProps: Product[];
  headData: HeaderColumn<any, any, any>[];
}

const AllProductsTable: React.FC<props> = ({ dataProps, headData }) => {
  const dispatch = useAppDispatch();
  const paginationState = useSelector((state: RootState) => state.allProducts.paginationState);
  const count = useSelector((state: RootState) => state.allProducts.count);
  const navigate = useNavigate();
  const clickNavigate = (id: string) => {
    navigate(`/admin/product/${id}`);
  };
  const isLoading = useSelector((state: RootState) => state.allProducts.isLoading);

  const limit =
    useSelector((state: RootState) => state.allProducts.paginationState.itemsPerPage) || null;

  const offset = useSelector((state: RootState) => state.allProducts.queryList.offset);

  const sortState = useSelector((state: RootState) => state.allProducts.sortState);

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
            clickNavigate={clickNavigate}
            sortState={sortState}
            setSortColumn={setSortColumn}
            dataHead={headData}
            dataBody={dataProps}
            // component={SingleUserCollapse}
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

export default AllProductsTable;
