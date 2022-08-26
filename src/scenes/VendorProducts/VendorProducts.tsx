import { SingleProduct } from '@/api/dto/VendorResponseData';
import TableFiltration from '@/components/Table/TableFiltration';
import type { RootState } from '@/store';
import {
  actionSetColumnFilter,
  actionSetFilterShowValue,
  actionSetOperatorFilter,
  actionSetSearchFilter,
  actionResetOffset,
} from '@/store/slices/VendorProductsSlice/vendorProductsSlice';
import { useStyles } from '@/styles/materialCustom';
import AddIcon from '@mui/icons-material/Add';
import { Button, SelectChangeEvent } from '@mui/material';
import React, { useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import styles from '../../components/Table/TableStyles.module.scss';
import VendorProductsTable from './VendorProductsTable';
import { DateTime } from 'luxon';
import { HeaderColumn } from '@/components/Table/TableContentFrame';
import { TableCellStyle } from '@/utils/common';
import { maxWidth } from '@mui/system';
import { useAppDispatch } from '@/customHooks/storeHooks';
import { NGN } from '@dinero.js/currencies';
import { toFormat } from 'dinero.js';
import { currencyTransformer, Kobo } from '@/utils/dinero';
const VendorProducts: React.FC = () => {
  const dispatch = useAppDispatch();
  const classes = useStyles();
  const navigate = useNavigate();
  const queryList = useSelector((state: RootState) => state.vendorProducts.queryList);
  const paginationState = useSelector((state: RootState) => state.vendorProducts.paginationState);
  const initOperator = useSelector((state: RootState) => state.vendorProducts.queryList.operator);
  const showFilterValue = useSelector((state: RootState) => state.vendorProducts.filterShowValue);

  const tableData: SingleProduct[] | null = useSelector(
    (state: RootState) => state.vendorProducts.vendorProductsList,
  );

  const [filterSearchText, setFilterSearchText] = useState('');

  type PropsNames =
    | 'id'
    | 'name'
    | 'price'
    | 'is_draft'
    | 'category.name'
    | 'created_at'
    | 'updated_at';
  type SortedProps = 'name' | 'price' | 'is_draft' | 'category' | 'created_at' | 'updated_at';

  type Filtration = {
    name: string;
    filterName: 'name' | 'price' | 'is_draft' | 'category';
  };

  const tableHeadColumns: HeaderColumn<PropsNames, SortedProps, TableCellStyle>[] = [
    { name: '', isShow: true, paramName: null },
    { name: '#', isShow: true, paramName: 'id' },
    {
      name: 'Name',
      isShow: true,
      paramName: 'name',
      sortName: 'name',
      style: {
        width: 200,
        maxWidth: 200,
      },
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

      style: {
        minWidth: 60,
        maxWidth: 100,
      },
      stringify: value => String(value),
    },
    {
      name: 'Category',
      isShow: true,
      paramName: 'category.name',
      sortName: 'category',
    },
    {
      name: 'Created at',
      isShow: true,
      paramName: 'created_at',
      sortName: 'created_at',

      stringify: value => DateTime.fromISO(value).toLocaleString(),
    },
  ];

  const filtration: Filtration[] = [
    { name: 'Name', filterName: 'name' },
    { name: 'Price', filterName: 'price' },
    { name: 'Draft', filterName: 'is_draft' },
    { name: 'Category', filterName: 'category' },
  ];

  const handleFiltrationOperatorChange = useCallback(
    (event: SelectChangeEvent) => {
      dispatch(actionSetOperatorFilter(event.target.value));
    },
    [dispatch],
  );

  const handleFiltrationColumnChange = useCallback(
    (event: SelectChangeEvent) => {
      dispatch(actionSetFilterShowValue(event.target.value));
      dispatch(actionSetColumnFilter(event.target.value));
    },
    [dispatch],
  );

  const handleFiltrationChangeSearch = useCallback(
    event => {
      setFilterSearchText(event.target.value);

      if (filterSearchText === '') {
        dispatch(actionSetSearchFilter(filterSearchText));
      }
    },
    [filterSearchText, dispatch],
  );

  const handleFiltrationSubmitSearch = useCallback(async () => {
    dispatch(actionSetSearchFilter(filterSearchText));
  }, [dispatch, filterSearchText]);

  return (
    <>
      <div className={styles.table_scene_wrapper}>
        <div className={styles.table_wrapper}>
          <div>
            <div style={{ width: '250px', paddingLeft: 10 }} className={classes.button_out}>
              <Button onClick={() => navigate('/vendor/create_product')} startIcon={<AddIcon />}>
                {' '}
                Create new product
              </Button>
            </div>
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
              headerTitle="Products table"
            />
          </div>
          <VendorProductsTable headData={tableHeadColumns} dataProps={tableData} />
        </div>
      </div>
    </>
  );
};

export default VendorProducts;
