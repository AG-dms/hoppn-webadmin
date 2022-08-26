// delete console.log

import axios, { AxiosError } from 'axios';
import React from 'react';
import { store } from '@store/index';
import { actionSetToken } from '@/store/slices/Auth/authSlice';
import { RefreshedTokens } from '@/store/slices/Auth/types';
import { apiRefresh } from './loginAPI';
import { actionClearStore } from '@store/globalAsyncFunc';
import { useAppDispatch } from '@/customHooks/storeHooks';

export const instance = axios.create({ baseURL: process.env.API_URL || '/' });

export const InterceptorsProvider: React.FC<{ children }> = ({ children }) => {
  instance.interceptors.request.use(config => {
    config.headers['access-token'] = store.getState().auth.access_token;
    return config;
  });

  const dispatch = useAppDispatch();

  let isRefreshing = false;
  let requestQueue: ((data: string) => void)[] = [];

  function addToQueue(callback: (data: string) => void): void {
    requestQueue.push(callback);
  }
  function executeQueue(token: string): void {
    requestQueue.forEach(callback => callback(token));
  }

  instance.interceptors.response.use(
    response => response,

    async (error: AxiosError) => {
      if (error?.config?.url === '/api/v1/auth/refresh') {
        store.dispatch<any>(actionClearStore());
        return;
      }
      if (error.config && error.response?.status === 401) {
        if (!isRefreshing) {
          isRefreshing = true;
          apiRefresh(store.getState().auth.refresh_token)
            .then((response: RefreshedTokens) => {
              store.dispatch(actionSetToken(response));
              executeQueue(response.access_token);
              isRefreshing = false;
              requestQueue = [];
            })
            .catch(() => {
              isRefreshing = false;
              requestQueue = [];
            });
        }
        return new Promise(resolve =>
          addToQueue((token: string) => {
            error.config.headers['access-token'] = token;
            resolve(instance(error.config));
          }),
        );
      }
      return Promise.reject(error);
    },
  );

  return <>{children}</>;
};
