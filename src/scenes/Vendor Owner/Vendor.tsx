import { UserListData } from '@/api/dto/UserResponseData';
import type { RootState } from '@/store';
import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  actionSetColumnFilter,
  actionSetFilterShowValue,
  actionSetOperatorFilter,
  actionSetSearchFilter,
  actionResetOffset,
} from '@/store/slices/VendorOwnerSlice/vendorOwnerSlice';
import { SelectChangeEvent } from '@mui/material';
import TableFiltration from '@/components/Table/TableFiltration';
import styles from '../../components/Table/TableStyles.module.scss';
import VendorEmployeesTable from './VendorEmployeesTable';
import { SingleUser } from '@/store/slices/Profile/type';
import { DateTime } from 'luxon';
import { HeaderColumn } from '@/components/Table/TableContentFrame';
import { TableCellStyle } from '@/utils/common';
import { useAppDispatch } from '@/customHooks/storeHooks';
import { actionGetVendorProfile } from '@/store/slices/VendorProfile/vendorProfileSlice';

type PropsNames =
  | 'id'
  | 'email'
  | 'is_email_verified'
  | 'is_phone_number_verified'
  | 'phone_number'
  | 'first_name'
  | 'last_name'
  | 'status'
  | 'created_at';

type SortedProps = 'email' | 'phone_number' | 'first_name' | 'last_name' | 'status' | 'created_at';

type Filtration = {
  name: string;
  filterName: 'email' | 'phone_number' | 'first_name' | 'last_name' | 'status';
};

const Vendor: React.FC = () => {
  const dispatch = useAppDispatch();
  // const queryList = useSelector((state: RootState) => state.vendorOwner.queryList);
  // const paginationState = useSelector((state: RootState) => state.vendorOwner.paginationState);
  const initOperator = useSelector((state: RootState) => state.vendorOwner.queryList.operator);
  const showFilterValue = useSelector((state: RootState) => state.vendorOwner.filterShowValue);
  const tableData: SingleUser[] | null = useSelector(
    (state: RootState) => state.vendorOwner.vendorEmployees,
  );
  const [filterSearchText, setFilterSearchText] = useState('');

  const tableHeadColumns: HeaderColumn<PropsNames, SortedProps, TableCellStyle>[] = [
    { name: '', isShow: true, paramName: null },
    { name: '#', isShow: true, paramName: 'id' },
    { name: 'Email', isShow: true, paramName: 'email', sortName: 'email' },
    {
      name: 'Verified',
      isShow: false,
      paramName: 'is_email_verified',
      stringify: value => String(value),
    },
    {
      name: 'Created at',
      isShow: true,
      paramName: 'created_at',

      sortName: 'created_at',
      stringify: value => DateTime.fromISO(value).toLocaleString(),
    },
    {
      name: 'Phone number',
      isShow: true,
      paramName: 'phone_number',

      sortName: 'phone_number',
    },
    {
      name: 'Phone verified',
      isShow: false,
      paramName: 'is_phone_number_verified',
    },
    {
      name: 'First name',
      isShow: true,
      paramName: 'first_name',

      sortName: 'first_name',
    },
    {
      name: 'Last name',
      isShow: true,
      paramName: 'last_name',

      sortName: 'last_name',
    },
    { name: 'Status', isShow: true, paramName: 'status', sortName: 'status' },
  ];

  const filtration: Filtration[] = [
    { name: 'First name', filterName: 'first_name' },
    { name: 'Last name', filterName: 'last_name' },
    { name: 'Email', filterName: 'email' },
    { name: 'Phone', filterName: 'phone_number' },
    { name: 'Status', filterName: 'status' },
  ];

  const handleFiltrationOperatorChange = useCallback(
    (event: SelectChangeEvent) => {
      dispatch(actionSetOperatorFilter(event.target.value));
    },
    [dispatch],
  );

  useEffect(() => {
    dispatch(actionGetVendorProfile());
  }, []);

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
              headerTitle="Employees table"
            />
          </div>
          <VendorEmployeesTable headData={tableHeadColumns} dataProps={tableData} />
        </div>
      </div>
    </>
  );
};

export default Vendor;
