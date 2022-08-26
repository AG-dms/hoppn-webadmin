import TableFiltration from '@/components/Table/TableFiltration';
import type { RootState } from '@/store';
import {
  actionGetAdminsList,
  actionSetColumnFilter,
  actionSetFilterShowValue,
  actionSetOperatorFilter,
  actionSetSearchFilter,
  actionResetOffset,
} from '@/store/slices/SuperAdminSlice/superAdminSlice';
import { SingleAdminData } from '@/store/slices/SuperAdminSlice/type';
import { SelectChangeEvent } from '@mui/material';
import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styles from '../../components/Table/TableStyles.module.scss';
import AdminTable from './AdminTable';
import { DateTime } from 'luxon';
import { HeaderColumn } from '@/components/Table/TableContentFrame';
import { TableCellStyle } from '@/utils/common';
import { useAppDispatch } from '@/customHooks/storeHooks';

type PropsNames =
  | 'id'
  | 'email'
  | 'is_email_verified'
  | 'first_name'
  | 'last_name'
  | 'status'
  | 'created_at';

type SortedProps = 'email' | 'first_name' | 'last_name' | 'status' | 'created_at';

type Filtration = {
  name: string;
  filterName: 'email' | 'first_name' | 'last_name' | 'status';
};

const Admin: React.FC = () => {
  const tableHeadColumns: HeaderColumn<PropsNames, SortedProps, TableCellStyle>[] = [
    { name: '', isShow: true, paramName: null },
    { name: '#', isShow: true, paramName: 'id' },
    { name: 'Email', isShow: true, paramName: 'email', sortName: 'email' },
    {
      name: 'Created at',
      isShow: true,
      paramName: 'created_at',
      sortName: 'created_at',
      stringify: value => DateTime.fromISO(value).toLocaleString(),
    },
    { name: 'Verified', isShow: false, paramName: 'is_email_verified' },
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
    { name: 'Status', filterName: 'status' },
  ];

  const [filterSearchText, setFilterSearchText] = useState('');

  const queryList = useSelector((state: RootState) => state.superAdmin.queryList);
  const paginationState = useSelector((state: RootState) => state.superAdmin.paginationState);
  const dispatch = useAppDispatch();
  const tableData: SingleAdminData[] = useSelector(
    (state: RootState) => state.superAdmin.adminList,
  );

  const user_id = useSelector((state: RootState) => state.auth.user_id);

  //first request to data table
  useEffect(() => {
    if (user_id) {
      dispatch(actionGetAdminsList(queryList));
    }
  }, [queryList, paginationState, user_id]);

  const initOperator = useSelector((state: RootState) => state.superAdmin.queryList.operator);
  const showFilterValue = useSelector((state: RootState) => state.superAdmin.filterShowValue);

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
              initOperator={initOperator}
              showFilterValue={showFilterValue}
              handleFiltrationSubmitSearch={handleFiltrationSubmitSearch}
              handleFiltrationChangeSearch={handleFiltrationChangeSearch}
              handleFiltrationColumnChange={handleFiltrationColumnChange}
              handleFiltrationOperatorChange={handleFiltrationOperatorChange}
              searchInputText={filterSearchText}
              filtrationField={filtration}
              headerTitle="Admins table"
            />
          </div>
          <AdminTable dataHead={tableHeadColumns} dataProps={tableData} />
        </div>
      </div>
    </>
  );
};

export default Admin;
