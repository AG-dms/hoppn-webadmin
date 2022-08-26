import { useStyles } from '@/styles/materialCustom';
import { Role } from '@/utils/enum/Role';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import PeopleIcon from '@mui/icons-material/People';
import { Collapse, List, ListItem } from '@mui/material';
import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import styles from '../sidebar.module.scss';
type Props = {
  roles: Role[];
  setActive: (path: string) => void;
};

const AllusersModule: React.FC<Props> = ({
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

  const [open, setOpen] = useState(false);

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
            <ListItem button key="Users" onClick={openSubMenu}>
              <PeopleIcon sx={{ marginRight: '10px', color: '#6ed0c3' }} />
              <span className={styles.arrow_margin}>Administrator</span>
              <div className={styles.arrow}>{open ? <ExpandLess /> : <ExpandMore />}</div>
            </ListItem>
            <Collapse className={classes.link} in={open} timeout="auto" unmountOnExit>
              <List className={classes.link} component="div" disablePadding>
                <ListItem
                  sx={[{ cursor: 'pointer' }, activeMenu('/admin')]}
                  onClick={() => setActive('/admin')}
                >
                  All users
                </ListItem>
                <ListItem
                  sx={[{ cursor: 'pointer' }, activeMenu('/vendor/administration')]}
                  onClick={() => setActive('/vendor/administration')}
                >
                  Vendors
                </ListItem>
                <ListItem
                  sx={[{ cursor: 'pointer' }, activeMenu('/hopper/administration')]}
                  onClick={() => setActive('/hopper/administration')}
                >
                  Hoppers
                </ListItem>
              </List>
            </Collapse>
          </List>
        </div>
      ) : null}
    </>
  );
};

export default AllusersModule;
