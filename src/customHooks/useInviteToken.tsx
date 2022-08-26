import { actionGetInviteToken } from '@/store/slices/Auth/authSlice';
import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useLocation } from 'react-router-dom';
import useQuery from './useQuery';
import { useAppDispatch } from '@/customHooks/storeHooks';

export const useInviteToken = () => {
  const location = useLocation();
  const dispatch = useAppDispatch();
  const query = useQuery();
  const inviteToken = query.get('token');
  useEffect(() => {
    if (location.pathname === '/invite' && inviteToken) {
      dispatch(actionGetInviteToken(inviteToken));
    }
  }, []);
};
