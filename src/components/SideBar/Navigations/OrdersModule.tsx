import { useStyles } from '@/styles/materialCustom';
import { Role } from '@/utils/enum/Role';
import DeliveryDiningIcon from '@mui/icons-material/DeliveryDining';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import { Collapse, IconButton, List, ListItem } from '@mui/material';
import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';

type Props = {
  roles: Role[];

  setActive: (path: string) => void;
};
const OrdersModule: React.FC<Props> = ({
  roles,

  setActive,
}) => {
  const classes = useStyles();

  const location = useLocation();

  const activeMenu = (path: string): Record<any, string> => {
    if (location.pathname === path)
      return {
        color: '#9ec654',
        textDecoration: 'underline',
      };
  };

  const currentPage = location.pathname;

  const [open, setOpen] = useState(false);

  const handleClick = path => {
    setActive(path);
    setOpen(!open);
  };
  const openSubMenu = e => {
    e.stopPropagation();
    e.preventDefault();
    setOpen(!open);
  };
  return (
    <>
      {roles && roles.includes(Role.Admin) ? (
        <div>
          <List className={classes.link}>
            <ListItem button key="Orders" onClick={openSubMenu}>
              <DeliveryDiningIcon sx={{ marginRight: '10px', color: '#6ed0c3' }} />
              Orders
              <IconButton onClick={openSubMenu}>
                {open ? <ExpandLess /> : <ExpandMore />}
              </IconButton>
            </ListItem>
            <Collapse className={classes.link} in={open} timeout="auto" unmountOnExit>
              <List className={classes.link} component="div" disablePadding>
                <ListItem
                  sx={[{ cursor: 'pointer' }, activeMenu('/admin/all_orders')]}
                  onClick={() => setActive('/admin/all_orders')}
                >
                  All orders
                </ListItem>
              </List>
            </Collapse>
          </List>
        </div>
      ) : null}
    </>
  );
};

export default OrdersModule;
