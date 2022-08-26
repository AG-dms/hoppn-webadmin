import { VendorOrderList } from '@/api/dto/VendorResponseData';
import { HeaderColumn } from '@/components/Table/TableContentFrame';
import TableFiltration from '@/components/Table/TableFiltration';
import type { RootState } from '@/store';
import {
  actionSetColumnFilter,
  actionSetFilterShowValue,
  actionSetOperatorFilter,
  actionSetSearchFilter,
  actionResetOffset,
} from '@/store/slices/VendorOrders/vendorOrderSlice';
import { TableCellStyle } from '@/utils/common';
import { SelectChangeEvent } from '@mui/material';
import { DateTime } from 'luxon';
import React, { useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import styles from '../../components/Table/TableStyles.module.scss';
import VendorOrdersTable from './VendorOrdersTable';
import { useAppDispatch } from '@/customHooks/storeHooks';
import { toFormat } from 'dinero.js';
import { currencyTransformer, Kobo } from '@/utils/dinero';
import { NGN } from '@dinero.js/currencies';
type PropsNames =
  | 'id'
  | 'price'
  | 'total_price'
  | 'status'
  | 'payment_type'
  | 'offer_price'
  | 'counteroffer_price'
  | 'preparation_time'
  | 'created_at'
  | 'updated_at'
  | 'accepted_at'
  | 'ready_at'
  | 'approved_at'
  | 'paid_at'
  | 'shipped_at'
  | 'delivered_at'
  | 'fulfilled_at'
  | 'canceled_at';

type SortedProps =
  | 'id'
  | 'price'
  | 'total_price'
  | 'status'
  | 'payment_type'
  | 'offer_price'
  | 'counteroffer_price'
  | 'preparation_time'
  | 'created_at'
  | 'updated_at'
  | 'accepted_at'
  | 'ready_at'
  | 'approved_at'
  | 'paid_at'
  | 'shipped_at'
  | 'delivered_at'
  | 'fulfilled_at'
  | 'canceled_at';

type Filtration = {
  name: string;
  filterName:
    | 'price'
    | 'total_price'
    | 'status'
    | 'payment_type'
    | 'offer_price'
    | 'counteroffer_price'
    | 'preparation_time';
};

const Vendor: React.FC = () => {
  const dispatch = useAppDispatch();
  // const queryList = useSelector((state: RootState) => state.vendorOwner.queryList);
  // const paginationState = useSelector((state: RootState) => state.vendorOwner.paginationState);
  const initOperator = useSelector((state: RootState) => state.vendorOrders.queryList.operator);
  const showFilterValue = useSelector((state: RootState) => state.vendorOrders.filterShowValue);

  const tableData: VendorOrderList[] | null = useSelector(
    (state: RootState) => state.vendorOrders.vendorOrdersList,
  );
  const [filterSearchText, setFilterSearchText] = useState('');

  const tableHeadColumns: HeaderColumn<PropsNames, SortedProps, TableCellStyle>[] = [
    { name: '', isShow: false, paramName: null },
    {
      name: '#',
      isShow: true,
      paramName: 'id',
      stringify: value => {
        return <Link to={`/vendor_orders/${value}`}>{value}</Link>;
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
      name: 'Total price',
      isShow: true,
      paramName: 'total_price',
      sortName: 'total_price',
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
      name: 'Status',
      isShow: true,
      paramName: 'status',
      sortName: 'status',
    },
    {
      name: 'Payment type',
      isShow: true,
      paramName: 'payment_type',
      sortName: 'payment_type',
    },
    {
      name: 'Offer price',
      isShow: true,
      paramName: 'offer_price',
      sortName: 'offer_price',
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
      name: 'Counter offer price',
      isShow: true,
      paramName: 'counteroffer_price',
      sortName: 'counteroffer_price',
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
      name: 'Preparation time',
      isShow: true,
      paramName: 'preparation_time',
      sortName: 'preparation_time',
      stringify: value => String(value),
    },

    {
      name: 'Created at',
      isShow: true,
      paramName: 'created_at',
      sortName: 'created_at',
      stringify: value => DateTime.fromISO(value).toLocaleString(DateTime.DATETIME_SHORT),
    },
    {
      name: 'Updated at',
      isShow: false,
      paramName: 'updated_at',
      sortName: 'updated_at',
      stringify: value => DateTime.fromISO(value).toLocaleString(DateTime.DATETIME_SHORT),
    },
    {
      name: 'Accepted at',
      isShow: true,
      paramName: 'accepted_at',
      sortName: 'accepted_at',
      stringify: value => {
        if (value) {
          return DateTime.fromISO(value).toLocaleString(DateTime.DATETIME_SHORT);
        }
        return '-';
      },
    },
    {
      name: 'Ready at',
      isShow: true,
      paramName: 'ready_at',
      sortName: 'ready_at',
      stringify: value => {
        if (value) {
          return DateTime.fromISO(value).toLocaleString(DateTime.DATETIME_SHORT);
        }
        return '-';
      },
    },
    {
      name: 'Paid at',
      isShow: true,
      paramName: 'paid_at',
      sortName: 'paid_at',
      stringify: value => {
        if (value) {
          return DateTime.fromISO(value).toLocaleString(DateTime.DATETIME_SHORT);
        }
        return '-';
      },
    },
    {
      name: 'Shipped at',
      isShow: true,
      paramName: 'shipped_at',
      sortName: 'shipped_at',
      stringify: value => {
        if (value) {
          return DateTime.fromISO(value).toLocaleString(DateTime.DATETIME_SHORT);
        }
        return '-';
      },
    },
    {
      name: 'Approved at',
      isShow: true,
      paramName: 'approved_at',
      sortName: 'approved_at',
      stringify: value => {
        if (value) {
          return DateTime.fromISO(value).toLocaleString(DateTime.DATETIME_SHORT);
        }
        return '-';
      },
    },
    {
      name: 'Fulfilled at',
      isShow: true,
      paramName: 'fulfilled_at',
      sortName: 'fulfilled_at',
      stringify: value => {
        if (value) {
          return DateTime.fromISO(value).toLocaleString(DateTime.DATETIME_SHORT);
        }
        return '-';
      },
    },
    {
      name: 'Canceled at',
      isShow: true,
      paramName: 'canceled_at',
      sortName: 'canceled_at',
      stringify: value => {
        if (value) {
          return DateTime.fromISO(value).toLocaleString(DateTime.DATETIME_SHORT);
        }
        return '-';
      },
    },
  ];

  const filtration: Filtration[] = [
    { name: 'Price', filterName: 'price' },
    { name: 'Total price', filterName: 'total_price' },
    { name: 'Payment type', filterName: 'payment_type' },
    { name: 'Offer price', filterName: 'offer_price' },
    { name: 'Counter offer price', filterName: 'counteroffer_price' },
    { name: 'Preparation time', filterName: 'preparation_time' },
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
              headerTitle="Orders table"
            />
          </div>
          <VendorOrdersTable headData={tableHeadColumns} dataProps={tableData} />
        </div>
      </div>
    </>
  );
};

export default Vendor;
