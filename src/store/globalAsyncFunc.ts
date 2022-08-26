import { apiUserLogout } from '@/api/loginAPI';
import { apiAcceptInvite } from '@/api/usersAPI';
import { createError, createNotification } from '@/components/Notofications';
import { createAction, createAsyncThunk } from '@reduxjs/toolkit';
import { RootState } from '.';
import { actionCleanAdminProductsSlice } from './slices/AdminProductsSlice/AllProductsSlice';
import { actionClearAdminStore } from './slices/AdminSlice/adminSlice';
import {
  actionClearAuthStore,
  actionClearInviteToken,
  actionRefreshToken,
} from './slices/Auth/authSlice';
import { ServerError } from './slices/Auth/types';
import { actionClearHopperAdministrationStore } from './slices/HopperAdministrationSlice/hopperAdministrationSlice';
import { actionCleanVendorAdministrationStore } from './slices/orderAdministrationSlice/productsAdministrationSlice';
import { actionClearProfileStore } from './slices/Profile/profileSlice';
import { actionClearSuperAdminStore } from './slices/SuperAdminSlice/superAdminSlice';
import { actionClearVendorApplicationsStore } from './slices/VendorAdministrationSlice/vendorApplicationSlice';
import { actionCleanVendorOrderSlice } from './slices/VendorOrders/vendorOrderSlice';
import { actionCleanVendorOwnerStore } from './slices/VendorOwnerSlice/vendorOwnerSlice';
import { actionCleanVendorProductsStore } from './slices/VendorProductsSlice/vendorProductsSlice';
import { actionClearVendorStore } from './slices/VendorProfile/vendorProfileSlice';

export const actionLogout = createAsyncThunk('user/logout', async (_, thunkAPI) => {
  try {
    await apiUserLogout();
  } catch (error) {
    createError(error, thunkAPI.dispatch);
    return thunkAPI.rejectWithValue(error as ServerError);
  }
});

export const actionClearStore = createAsyncThunk('user/CleanStore', async (_, thunkAPI) => {
  try {
    thunkAPI.dispatch(actionClearAuthStore());
    thunkAPI.dispatch(actionClearVendorStore());
    thunkAPI.dispatch(actionClearAdminStore());
    thunkAPI.dispatch(actionClearProfileStore());
    thunkAPI.dispatch(actionCleanVendorAdministrationStore());
    thunkAPI.dispatch(actionCleanVendorOwnerStore());
    thunkAPI.dispatch(actionClearSuperAdminStore());
    thunkAPI.dispatch(actionCleanVendorProductsStore());
    thunkAPI.dispatch(actionClearHopperAdministrationStore());
    thunkAPI.dispatch(actionCleanVendorOrderSlice());
    thunkAPI.dispatch(actionClearVendorApplicationsStore());
    thunkAPI.dispatch(actionCleanAdminProductsSlice());
  } catch (error) {
    createError(error, thunkAPI.dispatch);
    return thunkAPI.rejectWithValue(error as ServerError);
  }
});

export const actionAcceptInvite = createAsyncThunk<void, string, { state: RootState }>(
  'user/accept_invite',
  async (token, thunkAPI) => {
    try {
      await apiAcceptInvite(token);
      const refresh_token = thunkAPI.getState().auth.refresh_token;
      thunkAPI.dispatch(actionRefreshToken(refresh_token));
      createNotification('success', 'Invite accepted');
      thunkAPI.dispatch(actionClearInviteToken());
    } catch (error) {
      createError(error, thunkAPI.dispatch);
      return thunkAPI.rejectWithValue(error as ServerError);
    }
  },
);
