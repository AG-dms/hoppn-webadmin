import { useInviteToken } from '@/customHooks/useInviteToken';
import useQuery from '@/customHooks/useQuery';
import React, { useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import styles from './MainStyle.module.scss';

const Scene: React.FC = ({ children }) => {
  useInviteToken();
  return <div className={styles.scene_container}>{children}</div>;
};

export default Scene;
