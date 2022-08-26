import { useStyles } from '@/styles/materialCustom';
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
  dataBody?: object[];
  dataHead?: HeaderColumn<any>[];
  component?: React.FunctionComponent<{ item }>;
};

export interface HeaderColumn<P> {
  name: string;
  isShow: boolean;
  paramName: P;
  stringify?: (value: any) => any;
}

export interface Filtration {
  name: string;
  filterName: string;
}

const SmallTableСontentFrame: React.FC<Props> = ({
  dataBody,
  dataHead,
  children,
  component: Component,
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

  function Row(props: { children; item: any }) {
    const { item } = props;
    const [open, setOpen] = React.useState(false);

    return (
      <React.Fragment>
        <TableRow
          sx={{
            transition: '0.3s',
            '& > *': { borderBottom: 'unset' },
            ':hover': { background: '#6ed0c325' },
          }}
        >
          {dataHead.map(itemColumn => {
            return itemColumn.name === '' && itemColumn.isShow ? (
              <TableCell
                key={itemColumn.name}
                sx={{ height: '35px', padding: '10px', boxSizing: 'border-box' }}
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
            ) : itemColumn.name !== '' ? (
              <TableCell
                sx={{
                  height: '35px',
                  padding: '10px',
                  boxSizing: 'border-box',
                  textAlign: 'center',
                }}
                key={itemColumn.name}
              >
                <span style={{ textAlign: 'center' }}>
                  {itemColumn.stringify
                    ? itemColumn.stringify(
                        itemColumn.paramName.split('.').reduce((a, v) => a[v], item),
                      )
                    : itemColumn.paramName.split('.').reduce((a, v) => a[v], item)}
                </span>
              </TableCell>
            ) : null;
          })}
        </TableRow>
        <TableRow>
          <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={8}>
            <Collapse in={open} timeout="auto" unmountOnExit>
              <Box sx={{ margin: 1, display: 'flex', justifyContent: 'center', width: '100%' }}>
                {Component ? (
                  <Component item={item.hopper_profile ? item.hopper_profile : null} />
                ) : null}
              </Box>
            </Collapse>
          </TableCell>
        </TableRow>
      </React.Fragment>
    );
  }

  return (
    <>
      <TableHead>
        <TableRow sx={{ textAlign: 'center' }}>
          {dataHead.map((item, id) => {
            return (
              <StyledTableCell sx={{ cursor: 'pointer', textAlign: 'center' }} key={item.name}>
                {item.name}
              </StyledTableCell>
            );
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

export default SmallTableСontentFrame;
