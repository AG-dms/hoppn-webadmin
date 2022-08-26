import React, { useEffect, useState } from 'react';
import TableFiltration from '@/components/Table/TableFiltration';
import type { RootState } from '@/store';
import {
  actionGetHopperList,
  actionSetColumnFilter,
  actionSetFilterShowValue,
  actionSetOperatorFilter,
  actionSetSearchFilter,
  actionResetOffset,
} from '@/store/slices/HopperAdministrationSlice/hopperAdministrationSlice';
import { SelectChangeEvent } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { HopperItem } from '@/api/dto/HopperResponseData';
import styles from '../../../components/Table/TableStyles.module.scss';
import HopperAdministrationTable from './HopperAdministrationTable';
import { HeaderColumn } from '@/components/Table/TableContentFrame';
import { DateTime } from 'luxon';
import { TableCellStyle } from '@/utils/common';
import { useAppDispatch } from '@/customHooks/storeHooks';

type PropsNames =
  | 'id'
  | 'user.email'
  | 'user.phone_number'
  | 'user.first_name'
  | 'user.last_name'
  | 'nin'
  | 'bvn'
  | 'is_online'
  | 'is_approved'
  | 'created_at';

type SortedProps =
  | 'email'
  | 'phone_number'
  | 'first_name'
  | 'last_name'
  | 'nin'
  | 'bvn'
  | 'is_online'
  | 'is_approved'
  | 'created_at';

type Filtration = {
  name: string;
  filterName: 'first_name' | 'last_name' | 'email' | 'phone_number' | 'bvn' | 'nin';
};

const HoppetAdministration = () => {
  const tableHeadColumns: HeaderColumn<PropsNames, SortedProps, TableCellStyle>[] = [
    { name: '', isShow: true, paramName: null },
    { name: '#', isShow: true, paramName: 'id' },
    { name: 'Email', isShow: true, paramName: 'user.email', sortName: 'email' },
    {
      name: 'First name',
      isShow: true,
      paramName: 'user.first_name',
      sortName: 'first_name',
    },
    {
      name: 'Last name',
      isShow: true,
      paramName: 'user.last_name',
      sortName: 'last_name',
    },
    {
      name: 'Phone number',
      isShow: true,
      paramName: 'user.phone_number',

      sortName: 'phone_number',
    },
    {
      name: 'Nin',
      isShow: true,
      paramName: 'nin',
      sortName: 'nin',
    },
    {
      name: 'Bvn',
      isShow: true,
      paramName: 'bvn',
      sortName: 'bvn',
    },
    {
      name: 'Online',
      isShow: true,
      paramName: 'is_online',
      sortName: 'is_online',
      stringify: value => String(value),
    },
    {
      name: 'Approval',
      isShow: true,
      paramName: 'is_approved',
      stringify: value => String(value),
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
    { name: 'First name', filterName: 'first_name' },
    { name: 'Last name', filterName: 'last_name' },
    { name: 'Email', filterName: 'email' },
    { name: 'Phone', filterName: 'phone_number' },
    { name: 'Bvn', filterName: 'bvn' },
    { name: 'Nin', filterName: 'nin' },
  ];

  const [filterSearchText, setFilterSearchText] = useState('');

  const tableData: HopperItem[] = useSelector(
    (state: RootState) => state.hopperAdmin.hopperListData,
  );

  const queryList = useSelector((state: RootState) => state.hopperAdmin.queryList);
  const paginationState = useSelector((state: RootState) => state.hopperAdmin.paginationState);
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(actionGetHopperList(queryList));
  }, [queryList, paginationState]);

  const handleFiltrationOperatorChange = (event: SelectChangeEvent) => {
    dispatch(actionSetOperatorFilter(event.target.value));
  };

  const initOperator = useSelector((state: RootState) => state.hopperAdmin.queryList.operator);
  const showFilterValue = useSelector((state: RootState) => state.hopperAdmin.filterShowValue);

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

  const handleFiltrationSubmitSearch = () => {
    dispatch(actionSetSearchFilter(filterSearchText));
  };

  return (
    <>
      <div className={styles.table_scene_wrapper}>
        <div className={styles.table_wrapper}>
          <TableFiltration
            initOperator={initOperator}
            resetOffset={actionResetOffset}
            showFilterValue={showFilterValue}
            handleFiltrationSubmitSearch={handleFiltrationSubmitSearch}
            handleFiltrationChangeSearch={handleFiltrationChangeSearch}
            handleFiltrationColumnChange={handleFiltrationColumnChange}
            handleFiltrationOperatorChange={handleFiltrationOperatorChange}
            searchInputText={filterSearchText}
            filtrationField={filtration}
            headerTitle="Hoppers table"
          />
        </div>
        <HopperAdministrationTable dataHead={tableHeadColumns} dataProps={tableData} />
      </div>
    </>
  );
};

export default HoppetAdministration;
