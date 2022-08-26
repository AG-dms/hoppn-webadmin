import { useStyles } from '@/styles/materialCustom';
import { Role } from '@/utils/enum/Role';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import { Collapse, IconButton, List, ListItem } from '@mui/material';
import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import styles from '../sidebar.module.scss';
interface Props {
  roles: Role[];

  setActive: (path: string) => void;
}

const AdminsModule: React.FC<Props> = ({ roles, setActive }) => {
  const classes = useStyles();
  const location = useLocation();
  const [open, setOpen] = useState(false);

  const activeMenu = (path: string): Record<any, string> => {
    if (location.pathname === path)
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
      {roles && roles.includes(Role.Superadmin) ? (
        <div>
          <List className={classes.link}>
            <ListItem button key="Admin" onClick={openSubMenu}>
              <AccountBoxIcon sx={{ marginRight: '10px', color: '#6ed0c3' }} />
              Admins
              <IconButton onClick={openSubMenu}>
                {open ? <ExpandLess /> : <ExpandMore />}
              </IconButton>
            </ListItem>
            <Collapse className={classes.link} in={open} timeout="auto" unmountOnExit>
              <List className={classes.link} component="div" disablePadding>
                <ListItem
                  sx={[{ cursor: 'pointer' }, activeMenu('/Admins')]}
                  className={styles.link_item}
                  onClick={() => setActive('/super_admin')}
                >
                  Admins
                </ListItem>
                <ListItem
                  sx={[{ cursor: 'pointer' }, activeMenu('/create_admin')]}
                  className={styles.link_item}
                  onClick={() => setActive('/create_admin')}
                >
                  Create new admin
                </ListItem>
              </List>
            </Collapse>
          </List>
        </div>
      ) : null}
    </>
  );
};

export default AdminsModule;
