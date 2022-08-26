import { UserListData } from '@/api/dto/UserResponseData';
import TableFiltration from '@/components/Table/TableFiltration';
import type { RootState } from '@/store';
import {
  actionSetColumnFilter,
  actionSetFilterShowValue,
  actionSetOperatorFilter,
  actionSetSearchFilter,
  actionResetOffset,
  actionAdminGetProductsList,
} from '@/store/slices/AdminProductsSlice/AllProductsSlice';
import { SelectChangeEvent } from '@mui/material';
import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styles from '../../../components/Table/TableStyles.module.scss';
import { DateTime } from 'luxon';
import { HeaderColumn } from '@/components/Table/TableContentFrame';
import { TableCellStyle } from '@/utils/common';
import { useAppDispatch } from '@/customHooks/storeHooks';
import { Product } from '@/store/slices/AdminProductsSlice/types';
import { Link } from 'react-router-dom';
import AllProductsTable from './AllProductsTable';
import { toFormat } from 'dinero.js';
import { currencyTransformer, Kobo } from '@/utils/dinero';

type PropsNames =
  | 'id'
  | 'name'
  | 'price'
  | 'is_draft'
  | 'category'
  | 'vendor_profile.company_name'
  | 'created_at'
  | 'updated_at';

type SortedProps =
  | 'id'
  | 'name'
  | 'price'
  | 'is_draft'
  | 'category'
  // | 'company_name'
  | 'created_at'
  | 'updated_at';

type Filtration = {
  name: string;
  filterName: 'name' | 'price' | 'category' | 'company_name';
};

const AllProducts: React.FC = () => {
  const dispatch = useAppDispatch();

  const tableHeadColumns: HeaderColumn<PropsNames, SortedProps, TableCellStyle>[] = [
    { name: '', isShow: false, paramName: null },
    {
      name: '#',
      isShow: false,
      paramName: 'id',
    },
    {
      name: 'Name',
      isShow: true,
      paramName: 'name',
      sortName: 'name',
      stringify: value => String(value),
    },
    {
      name: 'Price',
      isShow: true,
      paramName: 'price',
      sortName: 'price',
      stringify: value => {
        {
          if (value) {
            return toFormat(Kobo(value), currencyTransformer);
          } else {
            return '-';
          }
        }
      },
    },

    {
      name: 'Draft',
      isShow: true,
      paramName: 'is_draft',
      sortName: 'is_draft',
      stringify: value => String(value),
    },

    {
      name: 'Category',
      isShow: true,
      paramName: 'category',
      sortName: 'category',

      stringify: (value: { id: string; name: string }) => value.name,
    },
    {
      name: 'Company name',
      isShow: true,
      paramName: 'vendor_profile.company_name',
      // sortName: 'company_name',
    },
    {
      name: 'Created at',
      isShow: true,
      paramName: 'created_at',
      sortName: 'created_at',
      stringify: value => DateTime.fromISO(value).toLocaleString(),
    },
    {
      name: 'Updated at',
      isShow: true,
      paramName: 'updated_at',
      sortName: 'updated_at',
      stringify: value => DateTime.fromISO(value).toLocaleString(),
    },
  ];

  const filtration: Filtration[] = [
    { name: 'Name', filterName: 'name' },
    { name: 'Price', filterName: 'price' },
    { name: 'Category', filterName: 'category' },
    { name: 'Company name', filterName: 'company_name' },
  ];

  const [filterSearchText, setFilterSearchText] = useState('');

  const tableData: Product[] | null = useSelector(
    (state: RootState) => state.allProducts.productsList,
  );

  const initOperator = useSelector((state: RootState) => state.allProducts.queryList.operator);
  const showFilterValue = useSelector((state: RootState) => state.allProducts.filterShowValue);

  const queryList = useSelector((state: RootState) => state.allProducts.queryList);
  const paginationState = useSelector((state: RootState) => state.allProducts.paginationState);
  const handleFiltrationOperatorChange = useCallback(
    (event: SelectChangeEvent) => {
      dispatch(actionSetOperatorFilter(event.target.value));
    },
    [dispatch],
  );

  useEffect(() => {
    dispatch(actionAdminGetProductsList(queryList));
  }, [queryList, paginationState, showFilterValue]);

  const handleFiltrationColumnChange = (event: SelectChangeEvent) => {
    dispatch(actionSetFilterShowValue(event.target.value));
    dispatch(actionSetColumnFilter(event.target.value));
  };

  const handleFiltrationChangeSearch = event => {
    setFilterSearchText(event.target.value);

    if (filterSearchText === '') {
      dispatch(actionSetSearchFilter(filterSearchText));
    }
  };

  const handleFiltrationSubmitSearch = useCallback(async () => {
    dispatch(actionSetSearchFilter(filterSearchText));
  }, [dispatch, filterSearchText]);
  return (
    <>
      <div className={styles.table_scene_wrapper}>
        <div className={styles.table_wrapper}>
          <div>
            <TableFiltration
              resetOffset={actionResetOffset}
              showFilterValue={showFilterValue}
              initOperator={initOperator}
              handleFiltrationSubmitSearch={handleFiltrationSubmitSearch}
              handleFiltrationChangeSearch={handleFiltrationChangeSearch}
              handleFiltrationColumnChange={handleFiltrationColumnChange}
              handleFiltrationOperatorChange={handleFiltrationOperatorChange}
              searchInputText={filterSearchText}
              filtrationField={filtration}
              headerTitle="All products table"
            />
          </div>
          <AllProductsTable headData={tableHeadColumns} dataProps={tableData} />
        </div>
      </div>
    </>
  );
};

export default AllProducts;
