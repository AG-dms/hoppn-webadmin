import { useStyles } from '@/styles/materialCustom';
import { Role } from '@/utils/enum/Role';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import { Collapse, List, ListItem } from '@mui/material';
import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import styles from '../sidebar.module.scss';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
type Props = {
  roles: Role[];
  setActive: (path: string) => void;
};

const ProductsModule: React.FC<Props> = ({ roles, setActive }) => {
  const classes = useStyles();
  const location = useLocation();
  const [open, setOpen] = useState(false);

  const activeMenu = (path: string[]): Record<any, string> => {
    if (path.includes(location.pathname))
      return {
        color: '#9ec654',
        textDecoration: 'underline',
      };
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
            <ListItem button key="Admin_Products" onClick={openSubMenu}>
              <ShoppingCartIcon sx={{ marginRight: '10px', color: '#6ed0c3' }} />
              <span className={styles.arrow_margin}>Products</span>
              <div className={styles.arrow}>{open ? <ExpandLess /> : <ExpandMore />}</div>
            </ListItem>
            <Collapse className={classes.link} in={open} timeout="auto" unmountOnExit>
              <List className={classes.link} component="div" disablePadding>
                <ListItem
                  sx={[{ cursor: 'pointer' }, activeMenu(['/admin/products'])]}
                  onClick={() => setActive('/admin/products')}
                >
                  All products
                </ListItem>
              </List>
            </Collapse>
          </List>
        </div>
      ) : null}
    </>
  );
};

export default ProductsModule;
