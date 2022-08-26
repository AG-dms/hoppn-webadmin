import {
  CreateVendor,
  EditVendorProfile,
  PromiseInviteMemberRole,
} from '@/api/dto/VendorRequestData';
import {
  PromiseVendorCategory,
  PromiseVendorProfileData,
  VendorFile,
  VendorRegistrationForm,
} from '@/api/dto/VendorResponseData';
import {
  apiAddFiles,
  apiCreateVendor,
  apiDeleteFile,
  apiEditVendorProfile,
  apiEditVendorRegistration,
  apiGetRegistrationForm,
  apiGetVendorCategories,
  apiGetVendorFiles,
  apiGetVendorProfile,
  apiInviteMember,
  apiRegistrationVendor,
  apiSetCompanyLogo,
  apiStoreOnline,
} from '@/api/vendorAPI';
import { createError, createNotification } from '@/components/Notofications';
import type { RootState } from '@/store';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { actionRefreshToken } from '../Auth/authSlice';
import { ServerError } from '../Auth/types';
import { EditVendorRegistration, VendorInitialState, VendorRegistration } from './type';

const initialState: VendorInitialState = {
  registrationForm: null,
  profile: {
    id: null,
    company_name: null,
    company_categories: [],
    legal_information: '',
    description: '',
    address: null,
    is_bargaining: false,
    avg_preparation_time: '0',
    is_approved: null,
    created_at: null,
    files: null,
    is_online: false,
    logo: null,
    apiAddress: null,
  },
  vendorCategories: [],
  isLoading: false,
  isLoadingFile: false,
  isLoadingLogo: false,
  inviteLink: null,
};

export const actionGetVendorRegistrationForm = createAsyncThunk<VendorRegistrationForm, never>(
  'vendor/registrationForm',
  async (_, thunkAPI) => {
    try {
      return await apiGetRegistrationForm();
    } catch (error) {
      return thunkAPI.rejectWithValue(error as ServerError);
    }
  },
);

export const actionRegistrationVendor = createAsyncThunk<
  void,
  { vendor: VendorRegistration; navigate: () => void },
  { state: RootState }
>(
  'vendor/RegistrationPost',
  async (
    {
      vendor: {
        files,
        company_name,
        company_category,
        address,
        description,
        takeaway_food,
        registered_business,
        business_license,
      },
      navigate,
    },
    thunkAPI,
  ) => {
    try {
      const response = await apiRegistrationVendor({
        files,
        company_name,
        company_category,
        address,
        description,
        takeaway_food,
        registered_business,
        business_license,
      });
      const token = thunkAPI.getState().auth.refresh_token;
      await thunkAPI.dispatch(actionRefreshToken(token));
      navigate();
      createNotification('success', 'Vendor profile created');

      return response;
    } catch (error) {
      createError(error, thunkAPI.dispatch);
      return thunkAPI.rejectWithValue(error as ServerError);
    }
  },
);

export const actionCreateVendorProfile = createAsyncThunk<
  void,
  { vendor: CreateVendor; navigate: () => void },
  { state: RootState }
>(
  'vendor/createProfile',
  async (
    {
      vendor: {
        logo,
        company_name,
        company_category,
        address_line_1,
        address_line_2,
        legal_information,
        description,
        country,
        city,
        district,
        postcode,
        latitude,
        longitude,
        plus_code,
      },
      navigate,
    },
    thunkAPI,
  ) => {
    try {
      const response = await apiCreateVendor({
        logo,
        company_name,
        company_category,
        address_line_1,
        address_line_2,
        legal_information,
        description,
        country,
        city,
        district,
        postcode,
        latitude,
        longitude,
        plus_code,
      });
      const token = thunkAPI.getState().auth.refresh_token;
      await thunkAPI.dispatch(actionRefreshToken(token));
      navigate();
      createNotification('success', 'Vendor profile created');

      return response;
    } catch (error) {
      createError(error, thunkAPI.dispatch);
      return thunkAPI.rejectWithValue(error as ServerError);
    }
  },
);

export const actionGetVendorCategories = createAsyncThunk<PromiseVendorCategory[], never>(
  'vendor/get_categories',
  async (_, thunkAPI) => {
    try {
      return await apiGetVendorCategories();
    } catch (error) {
      createError(error, thunkAPI.dispatch);
      return thunkAPI.rejectWithValue(error as ServerError);
    }
  },
);

export const actionGetVendorProfile = createAsyncThunk<PromiseVendorProfileData, never>(
  'vendor/profile',
  async (_, thunkAPI) => {
    try {
      return await apiGetVendorProfile();
    } catch (error) {
      createError(error, thunkAPI.dispatch);
      return thunkAPI.rejectWithValue(error as ServerError);
    }
  },
);

export const actionGetVendorFiles = createAsyncThunk<VendorFile[], never>(
  'vendor/files',
  async (_, thunkAPI) => {
    try {
      return await apiGetVendorFiles();
    } catch (error) {
      createError(error, thunkAPI.dispatch);
      return thunkAPI.rejectWithValue(error as ServerError);
    }
  },
);

export const actionEditVendorProfile = createAsyncThunk<
  void,
  { data: EditVendorProfile; navigate?: () => void }
>('vendor/editProfile', async ({ data, navigate }, thunkAPI) => {
  try {
    const response = await apiEditVendorProfile(data);
    thunkAPI.dispatch(actionGetVendorProfile());
    thunkAPI.dispatch(actionGetVendorFiles());
    navigate();
    createNotification('success', 'Profile data update');

    return response;
  } catch (error) {
    createError(error, thunkAPI.dispatch);
    return thunkAPI.rejectWithValue(error as ServerError);
  }
});

export const actionEditVendorRegistration = createAsyncThunk<
  void,
  { vendor: EditVendorRegistration; navigate: () => void }
>('vendor/EditRegistration', async ({ vendor, navigate }, thunkAPI) => {
  try {
    const response = await apiEditVendorRegistration(vendor);
    thunkAPI.dispatch(actionGetVendorProfile());
    thunkAPI.dispatch(actionGetVendorFiles());
    navigate();
    createNotification('success', 'Profile data update');
    return response;
  } catch (error) {
    createError(error, thunkAPI.dispatch);
    return thunkAPI.rejectWithValue(error as ServerError);
  }
});

export const actionSetCompanyLogo = createAsyncThunk<void, { logo: File; navigate?: () => void }>(
  'vendor/SetLogo',
  async ({ logo, navigate }, thunkAPI) => {
    try {
      await apiSetCompanyLogo(logo);
      await thunkAPI.dispatch(actionGetVendorProfile());
      if (navigate) {
        navigate();
      }
    } catch (error) {
      createError(error, thunkAPI.dispatch);
      return thunkAPI.rejectWithValue(error as ServerError);
    }
  },
);

export const actionInviteMember = createAsyncThunk<string, PromiseInviteMemberRole>(
  'vendor/invite',
  async ({ type }, thunkAPI) => {
    try {
      return await apiInviteMember(type);
    } catch (error) {
      createError(error, thunkAPI.dispatch);
      return thunkAPI.rejectWithValue(error as ServerError);
    }
  },
);

export const actionDeleteFile = createAsyncThunk<void, string>(
  'vendor/deleteFile',
  async (id, thunkAPI) => {
    try {
      await apiDeleteFile(id);
      // thunkAPI.dispatch(actionGetVendorProfile());
      thunkAPI.dispatch(actionGetVendorFiles());
    } catch (error) {
      createError(error, thunkAPI.dispatch);
      return thunkAPI.rejectWithValue(error as ServerError);
    }
  },
);

export const actionAddFiles = createAsyncThunk<void, File>(
  'vendor/addFile',
  async (file, thunkAPI) => {
    try {
      const response = await apiAddFiles(file);
      thunkAPI.dispatch(actionGetVendorFiles());
      // thunkAPI.dispatch(actionGetVendorProfile());
      createNotification('success', 'File upload');
      return response;
    } catch (error) {
      createError(error, thunkAPI.dispatch);
      return thunkAPI.rejectWithValue(error as ServerError);
    }
  },
);

export const actionStoreOnline = createAsyncThunk<void, boolean>(
  'vendor/online',
  async (is_online, thunkAPI) => {
    try {
      return await apiStoreOnline(is_online);
    } catch (error) {
      createError(error, thunkAPI.dispatch);
      return thunkAPI.rejectWithValue(error as ServerError);
    }
  },
);

export const vendorProfileSlice = createSlice({
  name: 'VendorProfile',
  initialState,
  reducers: {
    actionClearVendorStore: state => {
      return initialState;
    },
    actionClearInviteLink: state => {
      state.inviteLink = null;
    },
    actionSetAddress: (state, action) => {
      state.profile.apiAddress = action.payload;
    },
  },
  extraReducers: {
    // [actionGetVendorCategories.pending.type]: (state, action) => {
    //   state.isLoading = true;
    // },
    [actionStoreOnline.fulfilled.type]: (state, action) => {
      state.profile.is_online = !state.profile.is_online;
    },
    [actionGetVendorCategories.fulfilled.type]: (state, action) => {
      state.vendorCategories = action.payload;
      // state.isLoading = false;
    },
    [actionGetVendorProfile.pending.type]: state => {
      state.isLoading = true;
    },

    [actionGetVendorProfile.rejected.type]: state => {
      state.isLoading = false;
    },

    [actionGetVendorProfile.fulfilled.type]: (
      state,
      action: PayloadAction<PromiseVendorProfileData>,
    ) => {
      state.profile = action.payload;
      state.isLoading = false;
    },
    [actionGetVendorFiles.pending.type]: state => {
      state.isLoadingFile = true;
    },
    [actionGetVendorFiles.fulfilled.type]: (state, action: PayloadAction<VendorFile[]>) => {
      state.profile.files = action.payload;
      state.isLoadingFile = false;
    },

    [actionGetVendorFiles.rejected.type]: (state, action: PayloadAction<VendorFile[]>) => {
      state.profile.files = action.payload;
      state.isLoading = false;
    },
    [actionEditVendorProfile.pending.type]: state => {
      state.isLoading = true;
    },
    [actionEditVendorProfile.fulfilled.type]: state => {
      state.isLoading = false;
    },
    [actionEditVendorProfile.rejected.type]: state => {
      state.isLoading = false;
    },
    [actionInviteMember.fulfilled.type]: (state, action) => {
      state.inviteLink = action.payload;
    },

    [actionSetCompanyLogo.pending.type]: state => {
      state.isLoadingLogo = true;
    },
    [actionSetCompanyLogo.fulfilled.type]: state => {
      state.isLoadingLogo = false;
    },
    [actionSetCompanyLogo.rejected.type]: state => {
      state.isLoadingLogo = false;
    },

    [actionGetVendorRegistrationForm.fulfilled.type]: state => {
      state.isLoading = true;
    },

    [actionGetVendorRegistrationForm.fulfilled.type]: (
      state,
      action: PayloadAction<VendorRegistrationForm>,
    ) => {
      state.registrationForm = action.payload;
      state.isLoading = false;
    },

    [actionGetVendorRegistrationForm.rejected.type]: state => {
      state.isLoading = false;
    },
  },
});

export const { actionClearVendorStore, actionClearInviteLink, actionSetAddress } =
  vendorProfileSlice.actions;

export default vendorProfileSlice.reducer;
