import { PromiseSingleUser } from '@/api/dto/UserResponseData';
import { EditPasswordProfile, EditProfile } from '@/api/dto/UsersRequestData';
import {
  apiChangeEmail,
  apiCreatePassword,
  apiGetUserProfile,
  apiUpdatePassword,
  apiUpdateProfile,
} from '@/api/usersAPI';
import { createError, createNotification } from '@/components/Notofications';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ServerError } from '../Auth/types';
import { ProfileInitialState } from './type';

const initialState: ProfileInitialState = {
  isLoading: true,
  profile: {
    id: '',
    email: null,
    first_name: '',
    last_name: '',
    balance: null,
    vendor_profile: null,
  },
};

export const actionGetUserProfile = createAsyncThunk<PromiseSingleUser, never>(
  'user/profile',
  async (_, thunkAPI) => {
    try {
      return await apiGetUserProfile();
    } catch (error) {
      createError(error, thunkAPI.dispatch);
      return thunkAPI.rejectWithValue(error as ServerError);
    }
  },
);

export const actionEditUserProfile = createAsyncThunk<void, EditProfile>(
  'user/updateProfile',
  async ({ first_name, last_name }, thunkAPI) => {
    try {
      const response = await apiUpdateProfile(first_name, last_name);
      thunkAPI.dispatch(actionGetUserProfile());
      createNotification('success', 'Profile data update');
      return response;
    } catch (error) {
      createError(error, thunkAPI.dispatch);
      return thunkAPI.rejectWithValue(error as ServerError);
    }
  },
);

export const actionEditUserPassword = createAsyncThunk<void, EditPasswordProfile>(
  'user/updateProfile',
  async ({ currentPassword, newPassword }, thunkAPI) => {
    try {
      const response = await apiUpdatePassword(currentPassword, newPassword);
      thunkAPI.dispatch(actionGetUserProfile());
      createNotification('success', 'Profile password update');
      return response;
    } catch (error) {
      createError(error, thunkAPI.dispatch);
      return thunkAPI.rejectWithValue(error as ServerError);
    }
  },
);

export const actionCreateUserPassword = createAsyncThunk<void, string>(
  'user/createPassword',
  async (password, thunkAPI) => {
    try {
      const response = await apiCreatePassword(password);
      thunkAPI.dispatch(actionGetUserProfile());
      createNotification('success', 'Profile password update');
      return response;
    } catch (error) {
      createError(error, thunkAPI.dispatch);
      return thunkAPI.rejectWithValue(error as ServerError);
    }
  },
);

export const actionEditEmail = createAsyncThunk<void, string>(
  'user/changeEmail',
  async (email, thunkAPI) => {
    try {
      const response = await apiChangeEmail(email);
      thunkAPI.dispatch(actionGetUserProfile());
      createNotification('success', 'Confirm changes in your new email');
      return response;
    } catch (error) {
      createError(error, thunkAPI.dispatch);
      return thunkAPI.rejectWithValue(error as ServerError);
    }
  },
);

export const profileSlice = createSlice({
  name: 'Profile',
  initialState,
  reducers: {
    actionClearProfileStore: state => {
      return initialState;
    },
  },
  extraReducers: {
    [actionGetUserProfile.pending.type]: state => {
      state.isLoading = true;
    },
    [actionGetUserProfile.fulfilled.type]: (state, action: PayloadAction<PromiseSingleUser>) => {
      state.profile = action.payload;
      state.isLoading = false;
    },
    [actionGetUserProfile.rejected.type]: state => {
      state.isLoading = false;
    },
    [actionEditUserProfile.pending.type]: state => {
      state.isLoading = true;
    },
    [actionEditUserProfile.fulfilled.type]: state => {
      state.isLoading = false;
    },
    [actionEditUserProfile.rejected.type]: state => {
      state.isLoading = false;
    },
  },
});

export const { actionClearProfileStore } = profileSlice.actions;

export default profileSlice.reducer;
