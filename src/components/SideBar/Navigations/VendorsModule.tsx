import { RootState } from '@/store';
import { useStyles } from '@/styles/materialCustom';
import { Role } from '@/utils/enum/Role';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import { Collapse, List, ListItem } from '@mui/material';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import styles from '../sidebar.module.scss';

type Props = {
  roles: Role[];
  setActive: (path: string) => void;
};

const VendorModule: React.FC<Props> = ({ roles, setActive }) => {
  const classes = useStyles();
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const vendorApprove = useSelector((state: RootState) => state.vendorProfile.profile.is_approved);

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
      {(roles && roles.includes(Role.Vendor)) || roles.includes(Role.Manager) ? (
        <div>
          <List className={classes.link}>
            <ListItem button key="Vendor" onClick={openSubMenu}>
              <AccountBoxIcon sx={{ marginRight: '10px', color: '#6ed0c3' }} />
              <span className={styles.arrow_margin}>Vendor</span>
              <div className={styles.arrow}>{open ? <ExpandLess /> : <ExpandMore />}</div>
            </ListItem>
            <Collapse className={classes.link} in={open} timeout="auto" unmountOnExit>
              <List className={classes.link} component="div" disablePadding>
                {roles.includes(Role.Vendor) && (
                  <ListItem
                    sx={[{ cursor: 'pointer' }, activeMenu(['/vendor'])]}
                    onClick={() => setActive('/vendor')}
                  >
                    My employees
                  </ListItem>
                )}
                <ListItem
                  sx={[{ cursor: 'pointer' }, activeMenu(['/vendor/profile'])]}
                  onClick={() =>
                    vendorApprove
                      ? setActive('/vendor/profile')
                      : setActive('vendor/create_profile')
                  }
                >
                  Profile
                </ListItem>

                <ListItem
                  sx={[
                    { cursor: 'pointer' },
                    activeMenu(['/vendor/products', '/vendor/create_product']),
                  ]}
                  onClick={() => setActive('/vendor/products')}
                >
                  My products
                </ListItem>
                <ListItem
                  sx={[{ cursor: 'pointer' }, activeMenu(['/vendor_orders'])]}
                  onClick={() => setActive('/vendor_orders')}
                >
                  Orders
                </ListItem>
              </List>
            </Collapse>
          </List>
        </div>
      ) : null}
    </>
  );
};

export default VendorModule;
