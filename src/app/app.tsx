import React from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import type { RootState } from '@/store';
import Router from '@/routes/Routes';
import Scene from './Scene';
import Header from './Header';
import { isUserRole } from '@/utils/type-guards/isUserRole';
import styles from './MainStyle.module.scss';
import NotificationsHandler from '@/components/Notofications';
import Sidebar from '@/components/SideBar/Sidebar';

const App: React.FC = () => {
  const userRole = useSelector((state: RootState) => state.auth.user_roles);
  const location = useLocation();

  const currentPage = location.pathname;

  const routesWithoutNavigation = ['/email', '/password', '/*'];
  const isNavigationVisible =
    isUserRole(userRole) && routesWithoutNavigation.every(route => !currentPage.startsWith(route));

  return (
    <div className={styles.app_container}>
      {isNavigationVisible && <Header />}
      <Sidebar />
      <Scene>
        <Router />
      </Scene>
      <NotificationsHandler />
    </div>
  );
};

export default App;
