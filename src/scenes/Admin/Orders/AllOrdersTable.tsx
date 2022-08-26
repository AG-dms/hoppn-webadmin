import { AllOrdersItem } from '@/api/dto/OrdersResponse.dto';
import { UserListData } from '@/api/dto/UserResponseData';
import { SingleProduct, VendorOrderList } from '@/api/dto/VendorResponseData';
import TableContentFrame, { HeaderColumn } from '@/components/Table/TableContentFrame';
import TableFrame from '@/components/Table/TableFrame';
import TablePagination from '@/components/Table/TablePagination';
import type { RootState } from '@/store';
import {
  actionClearPaginationData,
  actionGetAllProducts,
  actionSetCurrentPage,
  actionSetItemsPerPage,
  actionSetOffset,
  actionSetSort,
} from '@/store/slices/orderAdministrationSlice/productsAdministrationSlice';
import { SelectChangeEvent } from '@mui/material';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
// import AdminBodyCollapse from './AdminBodyCollapse';
import styles from '../../SuperAdmin/SuperAdmin.module.scss';
import { useAppDispatch } from '@/customHooks/storeHooks';
import { useNavigate } from 'react-router-dom';
// import VendorProductCollapse from './VendorProductCollapse';
interface props {
  dataProps: AllOrdersItem[];
  headData: HeaderColumn<any, any, any>[];
}

const AllOrdersTable: React.FC<props> = ({ dataProps, headData }) => {
  const dispatch = useAppDispatch();
  const queryList = useSelector((state: RootState) => state.productsAdmin.queryList);
  const paginationState = useSelector((state: RootState) => state.productsAdmin.paginationState);
  const count = useSelector((state: RootState) => state.productsAdmin.count);
  useEffect(() => {
    dispatch(actionGetAllProducts(queryList));
  }, [queryList]);

  const isLoading = useSelector((state: RootState) => state.productsAdmin.isLoading);
  const navigate = useNavigate();

  const limit =
    useSelector((state: RootState) => state.productsAdmin.paginationState.itemsPerPage) || null;

  const offset = useSelector((state: RootState) => state.productsAdmin.queryList.offset);

  const sortState = useSelector((state: RootState) => state.productsAdmin.sortState);

  const handleClick = (event, page) => {
    dispatch(actionSetCurrentPage(page));
    dispatch(actionSetOffset());
  };

  const handleChange = (event: SelectChangeEvent) => {
    dispatch(actionClearPaginationData());
    dispatch(actionSetItemsPerPage(event.target.value));
  };

  const clickNavigate = (id: string) => {
    navigate(`/admin/order/${id}`);
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
          />
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

export default AllOrdersTable;
