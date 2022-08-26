import { HopperItem } from '@/api/dto/HopperResponseData';
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
} from '@/store/slices/HopperAdministrationSlice/hopperAdministrationSlice';
import { SelectChangeEvent } from '@mui/material';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styles from '../../SuperAdmin/SuperAdmin.module.scss';
import SingleHopperCollapse from './SingleHopperCollapse';
import { useAppDispatch } from '@/customHooks/storeHooks';
interface props {
  dataProps: HopperItem[];
  dataHead: HeaderColumn<any, any, any>[];
}

const HopperAdministrationTable: React.FC<props> = ({ dataProps, dataHead }) => {
  const isLoading = useSelector((state: RootState) => state.hopperAdmin.isLoading);

  const dispatch = useAppDispatch();

  const paginationState = useSelector((state: RootState) => state.hopperAdmin.paginationState);
  const count = useSelector((state: RootState) => state.hopperAdmin.count);

  const sortState = useSelector((state: RootState) => state.hopperAdmin.sortState);
  const limit =
    useSelector((state: RootState) => state.hopperAdmin.paginationState.itemsPerPage) || null;
  const offset = useSelector((state: RootState) => state.hopperAdmin.queryList.offset);

  const handleClick = (event, page) => {
    dispatch(actionSetCurrentPage(page));
    dispatch(actionSetOffset());
  };

  const handleChange = (event: SelectChangeEvent) => {
    dispatch(actionClearPaginationData());
    dispatch(actionSetItemsPerPage(event.target.value));
  };

  const setSortColumn = (paramName: string, directionArrow) => {
    dispatch(actionSetSort({ sortParam: paramName, direction: directionArrow }));
  };

  return (
    <>
      <div className={styles.table_container}>
        <TableFrame isLoading={isLoading}>
          <TableContentFrame
            sortState={sortState}
            setSortColumn={setSortColumn}
            dataHead={dataHead}
            dataBody={dataProps}
            component={SingleHopperCollapse}
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

export default HopperAdministrationTable;
