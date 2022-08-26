import { UserListData } from '@/api/dto/UserResponseData';
import TableFiltration from '@/components/Table/TableFiltration';
import type { RootState } from '@/store';
import {
  actionGetUsersList,
  actionSetColumnFilter,
  actionSetFilterShowValue,
  actionSetOperatorFilter,
  actionSetSearchFilter,
  actionResetOffset,
} from '@/store/slices/AdminSlice/adminSlice';
import { SelectChangeEvent } from '@mui/material';
import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styles from '../../components/Table/TableStyles.module.scss';
import UsersTable from './UsersTable';
import { DateTime } from 'luxon';
import { HeaderColumn } from '@/components/Table/TableContentFrame';
import { TableCellStyle } from '@/utils/common';
import { useAppDispatch } from '@/customHooks/storeHooks';

type PropsNames =
  | 'id'
  | 'email'
  | 'phone_number'
  | 'first_name'
  | 'last_name'
  | 'status'
  | 'is_email_verified'
  | 'is_phone_number_verified'
  | 'created_at'
  | 'roles';

type SortedProps =
  | 'email'
  | 'phone_number'
  | 'first_name'
  | 'last_name'
  | 'status'
  | 'created_at'
  | 'roles';

type Filtration = {
  name: string;
  filterName: 'email' | 'phone_number' | 'first_name' | 'last_name' | 'status';
};

const Admin: React.FC = () => {
  const dispatch = useAppDispatch();

  const tableHeadColumns: HeaderColumn<PropsNames, SortedProps, TableCellStyle>[] = [
    { name: '', isShow: true, paramName: null },
    { name: '#', isShow: true, paramName: 'id' },
    {
      name: 'Email',
      isShow: true,
      paramName: 'email',

      sortName: 'email',
      stringify: value => String(value),
    },
    { name: 'Verified', isShow: false, paramName: 'is_email_verified' },
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
    {
      name: 'Roles',
      isShow: true,
      paramName: 'roles',
      stringify: (value: { id: string; name: string }[]) => {
        if (value.length > 1) {
          return value
            .map(item => item.name)
            .filter(item => item !== 'customer')
            .join(', ');
        }

        if (value[0].name === 'customer') return value[0].name;
      },
      sortName: 'roles',
    },
  ];

  const filtration: Filtration[] = [
    { name: 'First name', filterName: 'first_name' },
    { name: 'Last name', filterName: 'last_name' },
    { name: 'Email', filterName: 'email' },
    { name: 'Phone', filterName: 'phone_number' },
  ];

  const [filterSearchText, setFilterSearchText] = useState('');

  const tableData: UserListData[] | null = useSelector((state: RootState) => state.admin.usersList);

  const initOperator = useSelector((state: RootState) => state.admin.queryList.operator);
  const showFilterValue = useSelector((state: RootState) => state.admin.filterShowValue);

  const queryList = useSelector((state: RootState) => state.admin.queryList);
  const paginationState = useSelector((state: RootState) => state.admin.paginationState);
  const handleFiltrationOperatorChange = useCallback(
    (event: SelectChangeEvent) => {
      dispatch(actionSetOperatorFilter(event.target.value));
    },
    [dispatch],
  );

  useEffect(() => {
    dispatch(actionGetUsersList(queryList));
  }, [queryList, paginationState]);

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
              headerTitle="All users table"
            />
          </div>
          <UsersTable headData={tableHeadColumns} dataProps={tableData} />
        </div>
      </div>
    </>
  );
};

export default Admin;
