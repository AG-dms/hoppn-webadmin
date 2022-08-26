import { SortStateType } from '@/store/slices/SuperAdminSlice/type';
import { useStyles } from '@/styles/materialCustom';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import {
  IconButton,
  TableBody,
  TableCell,
  tableCellClasses,
  TableHead,
  TableRow,
} from '@mui/material';
import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';
import { styled } from '@mui/material/styles';
import React from 'react';

type Props = {
  dataBody?: Array<Record<string, unknown> & { id: string }>;
  dataHead?: HeaderColumn<any, any, any>[];
  setSortColumn: (paramName: string, direction: string) => void;
  sortState: SortStateType;
  component?: React.FunctionComponent<{ item }>;
  clickNavigate?: (id: string) => void;
};

export interface HeaderColumn<P, S, T> {
  name: string;
  isShow: boolean;
  paramName: P;
  sortName?: S;
  style?: T;
  stringify?: (value: any) => any;
}

export interface Filtration {
  name: string;
  filterName: string;
}

const TableСontentFrame: React.FC<Props> = ({
  dataBody,
  dataHead,
  setSortColumn,
  sortState,
  children,
  component: Component,
  clickNavigate,
}) => {
  const classes = useStyles();

  const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: '#6ed0c3',
      lineHeight: 1,
      height: 50,

      boxSizing: 'border-box',
      color: theme.palette.common.white,
      padding: '5px 16px',
    },
    [`&.${tableCellClasses.head}:hover`]: {
      backgroundColor: '#61bbaf',
    },
  }));

  function Row(props: { children; item: Record<string, unknown> & { id: string } }) {
    const { item } = props;
    const [open, setOpen] = React.useState(false);

    return (
      <React.Fragment>
        <TableRow
          onClick={() => {
            if (clickNavigate) {
              return clickNavigate(item.id);
            }
          }}
          sx={{
            transition: '0.3s',
            '& > *': { borderBottom: 'unset' },
            ':hover': { background: '#6ed0c325' },
          }}
        >
          {dataHead.map(itemColumn => {
            return itemColumn.isShow && itemColumn.name === '' ? (
              <TableCell
                key={itemColumn.name}
                sx={{ height: '35px', padding: '10px', boxSizing: 'border-box', maxWidth: 250 }}
              >
                <IconButton
                  aria-label="expand row"
                  size="small"
                  onClick={() => {
                    setOpen(!open);
                  }}
                >
                  {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                </IconButton>
              </TableCell>
            ) : itemColumn.isShow && itemColumn.name !== '' ? (
              <TableCell
                sx={{
                  height: '35px',
                  padding: '10px',
                  boxSizing: 'border-box',
                  textAlign: 'center',
                  maxWidth: 250,
                }}
                key={itemColumn.name}
              >
                <span
                  style={{
                    textAlign: 'center',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    maxWidth: 'inherit',
                    display: 'block',
                    overflow: 'hidden',
                  }}
                >
                  {itemColumn.stringify
                    ? itemColumn.stringify(
                        itemColumn.paramName.split('.').reduce((a, v) => {
                          return a ? a[v] : null;
                        }, item),
                      )
                    : itemColumn.paramName.split('.').reduce((a, v) => {
                        return a ? a[v] : null;
                      }, item)}
                </span>
              </TableCell>
            ) : null;
          })}
        </TableRow>
        {dataHead[0].isShow && (
          <TableRow>
            <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={10}>
              <Collapse in={open} timeout="auto" unmountOnExit>
                <Box sx={{ margin: 1, display: 'flex', justifyContent: 'center', width: '100%' }}>
                  {Component ? <Component item={item} /> : null}
                </Box>
              </Collapse>
            </TableCell>
          </TableRow>
        )}
      </React.Fragment>
    );
  }

  return (
    <>
      <TableHead>
        <TableRow sx={{ textAlign: 'center' }}>
          {dataHead.map((item, id) => {
            if (item.isShow) {
              return (
                <StyledTableCell
                  onClick={() => {
                    if (item.sortName) {
                      setSortColumn(item.sortName, sortState.direction);
                    }
                  }}
                  style={item.style}
                  sx={{ cursor: 'pointer', textAlign: 'center' }}
                  key={item.name}
                >
                  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    {item.name}
                    {item.sortName === sortState.sortParam && sortState.direction === 'desc' ? (
                      <ArrowUpwardIcon fontSize="small" />
                    ) : item.sortName === sortState.sortParam && sortState.direction === 'asc' ? (
                      <ArrowDownwardIcon fontSize="small" />
                    ) : null}
                  </div>
                </StyledTableCell>
              );
            }
          })}
        </TableRow>
      </TableHead>
      <TableBody className={classes.table}>
        {dataBody
          ? dataBody.map((item, id) => {
              return (
                <Row key={id + 1} item={item}>
                  {children}
                </Row>
              );
            })
          : null}
      </TableBody>
    </>
  );
};

export default TableСontentFrame;
