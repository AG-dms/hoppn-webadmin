import { CircularProgress, Table, TableContainer } from '@mui/material';
import React from 'react';

interface Props {
  isLoading: boolean;
}

const TableFrame: React.FC<Props> = ({ isLoading, children }) => {
  return (
    <TableContainer
      className="custom_scrollbar"
      sx={{ boxShadow: '1px 0px 5px grey', opacity: isLoading ? 0.5 : 1, position: 'relative' }}
    >
      {isLoading && (
        <CircularProgress sx={{ position: 'absolute', zIndex: 10, top: '50%', left: '50%' }} />
      )}
      <Table
        sx={{ paddingBottom: '10px' }}
        stickyHeader
        aria-label="sticky table"
        className="custom_scrollbar"
      >
        {children}
      </Table>
    </TableContainer>
  );
};

export default TableFrame;
