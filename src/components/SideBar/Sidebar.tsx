import type { RootState } from '@/store';
import React, { useEffect, useState } from 'react';
import Drawer from '@mui/material/Drawer';
import { actionToggleSidebar } from '@/store/slices/ThemeSlice/themeSlice';
import Box from '@mui/material/Box';
import { useStyles } from '@/styles/materialCustom';
import { useDispatch, useSelector } from 'react-redux';
import { Role } from '@/utils/enum/Role';
import { Collapse, List, ListItem } from '@mui/material';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import { useLocation, useNavigate } from 'react-router-dom';
import PeopleIcon from '@mui/icons-material/People';
import DeliveryDiningIcon from '@mui/icons-material/DeliveryDining';
import AdminsModule from './Navigations/AdminsModule';
import AllusersModule from './Navigations/AllusersModule';
import OrdersModule from './Navigations/OrdersModule';
import VendorModule from './Navigations/VendorsModule';
import ProductsModule from './Navigations/ProductsAdminsModule';
import { useAppDispatch } from '@/customHooks/storeHooks';

const Sidebar: React.FC = ({ children }) => {
  const classes = useStyles();
  const isSidebarOpen = useSelector((state: RootState) => state.theme.isSidebarOpen);
  const dispath = useAppDispatch();
  const roles = useSelector((state: RootState) => state.auth.user_roles);

  const location = useLocation();
  const navigate = useNavigate();
  const currentPage = location.pathname;
  const [activeLink, setActiveLink] = useState<string>(currentPage);
  const [open, setOpen] = useState(false);

  const toggleDrawer = (openDrawer: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
    if (
      event.type === 'keydown' &&
      ((event as React.KeyboardEvent).key === 'Tab' ||
        (event as React.KeyboardEvent).key === 'Shift')
    ) {
      return;
    }
    dispath(actionToggleSidebar(openDrawer));
  };

  const setActive = (path: string) => {
    if (currentPage !== path) {
      setActiveLink(path);
      dispath(actionToggleSidebar(false));
      navigate(path);
    }
  };

  useEffect(() => {
    return () => {
      dispath(actionToggleSidebar(false));
    };
  }, []);

  return (
    <Drawer
      className={classes.leftDrawer}
      anchor="left"
      open={isSidebarOpen}
      onClose={toggleDrawer(false)}
    >
      <Box sx={{ width: 250 }}>
        <AdminsModule roles={roles} setActive={setActive} />
        <AllusersModule roles={roles} setActive={setActive} />
        <VendorModule roles={roles} setActive={setActive} />
        <OrdersModule roles={roles} setActive={setActive} />
        <ProductsModule roles={roles} setActive={setActive} />
      </Box>
    </Drawer>
  );
};

export default Sidebar;
