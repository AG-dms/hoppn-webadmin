import { useStyles } from '@/styles/materialCustom';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import MenuItem from '@mui/material/MenuItem';
import Pagination from '@mui/material/Pagination';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import React, { useEffect } from 'react';
import styles from './TableStyles.module.scss';

interface PaginationProps {
  paginationState: {
    itemsPerPage: number;
    currentPage: number;
  };
  count: number;
  handleClick: (event: React.ChangeEvent<unknown>, page: number) => void;
  handleChange: (event: SelectChangeEvent) => void;
  limit: number;
  offset: number;
  resetPagination?: () => void;
}

// TODO change style

const TablePagination: React.FC<PaginationProps> = ({
  paginationState,
  count,
  handleChange,
  handleClick,
  limit,
  offset,
}) => {
  const classes = useStyles();

  const countPages = () => Math.ceil(count / limit);
  return (
    <div className={styles.pagination_container}>
      <div className={classes.select}>
        <FormControl sx={{ m: 1, minWidth: 120 }}>
          <Select
            value={paginationState.itemsPerPage.toString()}
            onChange={handleChange}
            displayEmpty
            inputProps={{ 'aria-label': 'Without label' }}
          >
            <MenuItem value={20}>20</MenuItem>
            <MenuItem value={50}>50</MenuItem>
            <MenuItem value={100}>100</MenuItem>
          </Select>
          <FormHelperText>Items per page</FormHelperText>
        </FormControl>
      </div>
      <div>
        <h5 style={{ fontWeight: 400 }}>{`shows ${offset + 1}-${
          count < offset + limit ? count : offset + limit
        } of ${count}`}</h5>
      </div>
      <Pagination
        count={countPages()}
        page={paginationState.currentPage}
        onChange={handleClick}
        showFirstButton={true}
        siblingCount={0}
        showLastButton={true}
      />
    </div>
  );
};

export default TablePagination;
