import { LoginPhoneType } from '@/api/dto/LoginRequest';
import {
  apiConfirmPhone,
  apiRefresh,
  apiUserLogin,
  apiUserLoginPhone,
  apiUserRegistration,
} from '@/api/loginAPI';
import { createError, createNotification } from '@/components/Notofications';
import { isAxiosError } from '@/utils/type-guards/isAxiosError';

import { AnyAction, createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import jwt_decode from 'jwt-decode';
import { toast } from 'react-toastify';
import {
  LoginInitialStateType,
  loginType,
  PhoneLogin,
  RefreshedTokens,
  RefreshResponse,
  ResponseLogin,
  ServerError,
  UserTypePhone,
} from './types';

const initialState: LoginInitialStateType = {
  access_token: null,
  refresh_token: null,
  user_id: null,
  authorization_token: null,
  user_roles: null,
  isLoading: false,
  passwordRestored: false,
  inviteToken: null,
};

export const actionLogin = createAsyncThunk<ResponseLogin, loginType>(
  'user/login',
  async ({ userName, password }, thunkAPI) => {
    try {
      const response = await apiUserLogin(userName, password);
      let decode = null;
      if (response.access_token) {
        decode = jwt_decode(response.access_token);
      }

      return { response: response, decode };
    } catch (error) {
      if (isAxiosError(error)) {
        if (error.response.status === 400) {
          toast.error('Wrong login details');
        }
      } else {
        createError(error);
      }

      return thunkAPI.rejectWithValue(error as ServerError);
    } finally {
    }
  },
);

export const actionLoginWithPhone = createAsyncThunk<string, string>(
  'user/loginPhone',
  async (code, thunkAPI) => {
    try {
      return await apiUserLoginPhone(code);
    } catch (error) {
      createError(error, thunkAPI.dispatch);
      return thunkAPI.rejectWithValue(error as ServerError);
    }
  },
);

export const actionConfirmPhone = createAsyncThunk<
  UserTypePhone,
  LoginPhoneType,
  { rejectValue: ServerError }
>('auth/UserConfirmEmail', async ({ code, x_app_type, token }, thunkAPI) => {
  try {
    const response = await apiConfirmPhone(code, x_app_type, token);
    let decode = null;
    if (response) {
      decode = jwt_decode(response.access_token);
    }
    return { response, decode };
  } catch (error) {
    createError(error, thunkAPI.dispatch);
  }
});

export const actionRegistration = createAsyncThunk<
  ResponseLogin,
  loginType,
  { rejectValue: ServerError }
>('user/registration', async ({ userName, password }, thunkAPI) => {
  try {
    const response = await apiUserRegistration(userName, password);
    let decode = null;
    if (response.access_token) {
      decode = jwt_decode(response.access_token);
    }

    createNotification('success', 'Confirm your email');
    return { response: response, decode };
  } catch (error) {
    createError(error, thunkAPI.dispatch);
    return thunkAPI.rejectWithValue(error as ServerError);
  }
});

export const actionRefreshToken = createAsyncThunk<RefreshResponse, string>(
  'login/refresh',
  async (refreshToken, thunkAPI) => {
    try {
      const response = await apiRefresh(refreshToken);
      let decode = null;
      if (response.access_token) {
        decode = jwt_decode(response.access_token);
      }
      return { tokens: response, decode };
    } catch (error) {
      createError(error, thunkAPI.dispatch);
      return thunkAPI.rejectWithValue(error as ServerError);
    }
  },
);

export const authSlice = createSlice({
  name: 'Login',
  initialState,
  reducers: {
    actionSetToken: (state, action: PayloadAction<RefreshedTokens>) => {
      state.access_token = action.payload.access_token;
      state.refresh_token = action.payload.refresh_token;
    },
    actionLoginLoading: state => {
      state.isLoading = true;
    },
    actionLoginLoadingDone: state => {
      state.isLoading = false;
    },
    actionGetInviteToken: (state, action) => {
      state.inviteToken = action.payload;
    },
    actionClearInviteToken: state => {
      state.inviteToken = null;
    },
    actionClearAuthToken: state => {
      state.authorization_token = null;
    },
    actionClearAuthStore: state => {
      return initialState;
    },
  },
  extraReducers: {
    //Login actions
    [actionLogin.pending.type]: state => {
      state.isLoading = true;
    },
    [actionLogin.fulfilled.type]: (state, action: PayloadAction<ResponseLogin>) => {
      state.access_token = action.payload.response.access_token;
      state.user_id = action.payload.decode.id;
      state.user_roles = action.payload.decode.roles;
      state.refresh_token = action.payload.response.refresh_token;
      state.isLoading = false;
    },

    [actionRegistration.pending.type]: state => {
      state.isLoading = true;
    },
    [actionRegistration.fulfilled.type]: (state, action: PayloadAction<ResponseLogin>) => {
      state.access_token = action.payload.response.access_token;
      state.user_id = action.payload.decode.id;
      state.user_roles = action.payload.decode.roles;
      state.refresh_token = action.payload.response.refresh_token;
    },

    [actionConfirmPhone.fulfilled.type]: (state, action: PayloadAction<UserTypePhone>) => {
      state.access_token = action.payload.response.access_token;
      state.user_id = action.payload.decode.id;
      state.user_roles = action.payload.decode.roles;
      state.refresh_token = action.payload.response.refresh_token;
    },

    [actionRefreshToken.fulfilled.type]: (state, action: PayloadAction<RefreshResponse>) => {
      state.access_token = action.payload.tokens.access_token;
      state.refresh_token = action.payload.tokens.refresh_token;
      state.user_roles = action.payload.decode.roles;
    },
    [actionRefreshToken.fulfilled.type]: (state, action: PayloadAction<RefreshResponse>) => {
      state.access_token = action.payload.tokens.access_token;
      state.refresh_token = action.payload.tokens.refresh_token;
      state.user_roles = action.payload.decode.roles;
    },
    [actionLoginWithPhone.fulfilled.type]: (state, action: PayloadAction<PhoneLogin>) => {
      state.authorization_token = action.payload.authorization_token;
    },
  },
});

export const {
  actionSetToken,
  actionGetInviteToken,
  actionClearInviteToken,
  actionClearAuthStore,
  actionClearAuthToken,
} = authSlice.actions;

export default authSlice.reducer;
