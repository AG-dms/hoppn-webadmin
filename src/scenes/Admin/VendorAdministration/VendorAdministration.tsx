import { VendorApplicationType } from '@/api/dto/VendorResponseData';
import TableFiltration from '@/components/Table/TableFiltration';
import type { RootState } from '@/store';
import {
  actionGetVendorApplicationsList,
  actionSetColumnFilter,
  actionSetFilterShowValue,
  actionSetOperatorFilter,
  actionSetSearchFilter,
  actionResetOffset,
} from '@/store/slices/VendorAdministrationSlice/vendorApplicationSlice';
import { SelectChangeEvent } from '@mui/material';
import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import VendorAdministrationTable from './VendorAdministrationTable';
import styles from '../../../components/Table/TableStyles.module.scss';
import { HeaderColumn } from '@/components/Table/TableContentFrame';
import { DateTime } from 'luxon';
import { TableCellStyle } from '@/utils/common';
import { useAppDispatch } from '@/customHooks/storeHooks';
import ChangeBalanceModal from '@/components/Modals/ChangeBalanceModal';

type PropsNames =
  | 'id'
  | 'email'
  | 'phone_number'
  | 'first_name'
  | 'last_name'
  | 'company_name'
  | 'company_categories'
  | 'country'
  | 'city'
  | 'address.address_line_1'
  | 'address.address_line_2'
  | 'is_online'
  | 'is_approved'
  | 'created_at';

type SortedProps =
  | 'email'
  | 'phone_number'
  | 'first_name'
  | 'last_name'
  | 'company_name'
  | 'country'
  | 'city'
  | 'address_line_1'
  | 'address_line_2'
  | 'is_online'
  | 'is_approved'
  | 'created_at';

type Filtration = {
  name: string;
  filterName:
    | 'company_name'
    | 'company_category'
    | 'address_line_1'
    | 'address_line_2'
    | 'is_approved';
};

const VendorAdministration = () => {
  const tableHeadColumns: HeaderColumn<PropsNames, SortedProps, TableCellStyle>[] = [
    { name: '#', isShow: true, paramName: 'id' },
    {
      name: 'Company name',
      isShow: true,
      paramName: 'company_name',
      style: {
        minWidth: 150,
        maxWidth: 250,
      },
      sortName: 'company_name',
    },
    {
      name: 'Company category',
      isShow: true,
      paramName: 'company_categories',
      stringify: (value: { id: string; name: string }[]) => value.map(item => item.name).join(', '),
    },
    {
      name: 'Address\u00A0line\u00A01',
      isShow: true,
      paramName: 'address.address_line_1',
      sortName: 'address_line_1',
      style: {
        minWidth: 190,
        width: 320,
        maxWidth: 350,
      },
    },
    {
      name: 'Address\u00A0line\u00A02',
      isShow: true,
      paramName: 'address.address_line_2',
      sortName: 'address_line_2',
    },
    {
      name: 'Approval',
      isShow: true,
      paramName: 'is_approved',

      sortName: 'is_approved',
      stringify: value => String(value),
    },
    {
      name: 'Created\u00A0at',
      isShow: true,
      paramName: 'created_at',

      sortName: 'created_at',
      stringify: value => DateTime.fromISO(value).toLocaleString(DateTime.DATETIME_SHORT),
    },
  ];

  const filtration: Filtration[] = [
    { name: 'Company name', filterName: 'company_name' },
    { name: 'Company category', filterName: 'company_category' },
    { name: 'Address 1', filterName: 'address_line_1' },
    { name: 'Address 2', filterName: 'address_line_2' },
    { name: 'Approval', filterName: 'is_approved' },
  ];
  const [filterSearchText, setFilterSearchText] = useState('');

  const tableData: VendorApplicationType[] = useSelector(
    (state: RootState) => state.vendorApplication.vendorApplicationsList,
  );

  const queryList = useSelector((state: RootState) => state.vendorApplication.queryList);
  const paginationState = useSelector(
    (state: RootState) => state.vendorApplication.paginationState,
  );
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(actionGetVendorApplicationsList(queryList));
  }, [queryList, paginationState]);

  const handleFiltrationOperatorChange = (event: SelectChangeEvent) => {
    dispatch(actionSetOperatorFilter(event.target.value));
  };

  const initOperator = useSelector(
    (state: RootState) => state.vendorApplication.queryList.operator,
  );
  const showFilterValue = useSelector(
    (state: RootState) => state.vendorApplication.filterShowValue,
  );

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
            headerTitle="Vendors table"
          />
        </div>
        <VendorAdministrationTable dataHead={tableHeadColumns} dataProps={tableData} />
      </div>
    </>
  );
};

export default VendorAdministration;
