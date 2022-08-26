import { VendorApproveRegistration } from '@/api/dto/VendorRequestData';
import {
  PromiseSingleVendorApplication,
  PromiseVendorApplicationsList,
  VendorFile,
  VendorRegistrationForm,
} from '@/api/dto/VendorResponseData';
import { apiGetRegistrationForm } from '@/api/vendorAPI';
import {
  apiApproveVendor,
  apiApproveVendorRegistration,
  apiDeclineVendorRegistration,
  apiGetSingleVendor,
  apiGetSingleVendorFiles,
  apiGetVendorsApplicationsList,
  apiUpdateVendorInformation,
} from '@/api/vendorsAdministrationAPI';
import { createNotification } from '@/components/Notofications';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ServerError } from '../Auth/types';
import { QueryListType, SortStateType } from '../SuperAdminSlice/type';
import { VendorsApplicationsInitialState } from './type';

const initialState: VendorsApplicationsInitialState = {
  vendorApplicationsList: null,
  count: 0,
  isLoading: false,
  filterShowValue: 'company_name',
  sortState: { sortParam: null, direction: null },
  queryList: {
    offset: 0,
    limit: 20,
    search: null,
    column: 'company_name',
    operator: 'co',
    sort: 'created_at',
    direction: null,
  },
  paginationState: {
    itemsPerPage: 20,
    currentPage: 1,
  },
  singleVendorApplication: {
    data: null,
    files: null,
    loadingVendor: false,
  },
};

export const actionGetVendorApplicationsList = createAsyncThunk<
  PromiseVendorApplicationsList,
  QueryListType
>(
  'vendor/applications',
  async ({ offset, limit, search, column, operator, sort, direction }, thunkAPI) => {
    try {
      return await apiGetVendorsApplicationsList(
        offset,
        limit,
        search,
        column,
        operator,
        sort,
        direction,
      );
    } catch (error) {
      return thunkAPI.rejectWithValue(error as ServerError);
    }
  },
);

export const actionGetSingleVendorData = createAsyncThunk<PromiseSingleVendorApplication, string>(
  'vendor/singleVendor',
  async (id, thunkAPI) => {
    try {
      return await apiGetSingleVendor(id);
    } catch (error) {
      return thunkAPI.rejectWithValue(error as ServerError);
    }
  },
);

export const actionGetSingleVendorFiles = createAsyncThunk<VendorFile[], string>(
  'vendor/files',
  async (id, thunkAPI) => {
    try {
      return await apiGetSingleVendorFiles(id);
    } catch (error) {
      return thunkAPI.rejectWithValue(error as ServerError);
    }
  },
);

export const actionApproveVendor = createAsyncThunk<void, { id: string; is_approved: boolean }>(
  'vendor/approve',
  async ({ id, is_approved }, thunkAPI) => {
    try {
      const response = await apiApproveVendor(id, is_approved);
      thunkAPI.dispatch(actionGetSingleVendorData(id));

      createNotification('success', 'Vendor status changed');
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error as ServerError);
    }
  },
);

export const actionDeclineVendor = createAsyncThunk<
  void,
  { id: string; navigate?: () => void; update?: () => void }
>('vendor/decline', async ({ id, navigate, update }, thunkAPI) => {
  try {
    const response = await apiDeclineVendorRegistration(id);
    createNotification('success', 'Vendor status changed');
    thunkAPI.dispatch(actionGetSingleVendorData(id));
    navigate();
    update();
    return response;
  } catch (error) {
    return thunkAPI.rejectWithValue(error as ServerError);
  }
});

export const actionApproveVendorRegistration = createAsyncThunk<
  void,
  { id: string; data: VendorApproveRegistration; navigate?: () => void; update?: () => void }
>('vendor/ApproveRegistration', async ({ id, data, navigate, update }, thunkAPI) => {
  try {
    const response = await apiApproveVendorRegistration(id, data);
    thunkAPI.dispatch(actionGetSingleVendorData(id));
    createNotification('success', 'Vendor status changed');
    update();
    navigate();
    return response;
  } catch (error) {
    return thunkAPI.rejectWithValue(error as ServerError);
  }
});

export const actionUpdateVendorInformation = createAsyncThunk<
  void,
  { id: string; data: VendorApproveRegistration; setEdit: () => void }
>('vendor/ApproveRegistration', async ({ id, data, setEdit }, thunkAPI) => {
  try {
    const response = await apiUpdateVendorInformation(id, data);
    thunkAPI.dispatch(actionGetSingleVendorData(id));
    createNotification('success', 'Vendor status changed');
    setEdit();
    return response;
  } catch (error) {
    return thunkAPI.rejectWithValue(error as ServerError);
  }
});

export const vendorApplicationsSlice = createSlice({
  name: 'vendorApplicationsSlice',
  initialState,
  reducers: {
    actionResetOffset: state => {
      state.paginationState.currentPage = 1;
      state.queryList.offset = 0;
    },
    actionSetSingleVendor: (state, action: PayloadAction<PromiseSingleVendorApplication>) => {
      state.singleVendorApplication.data = action.payload;
    },
    actionSetOffset: state => {
      state.queryList.offset =
        (state.paginationState.currentPage - 1) * state.paginationState.itemsPerPage;
    },

    actionSetCurrentPage: (state, action) => {
      state.paginationState.currentPage = action.payload;
    },
    actionSetItemsPerPage: (state, action) => {
      state.paginationState.itemsPerPage = action.payload;
      state.queryList.limit = action.payload;
    },
    actionSetColumnFilter: (state, action) => {
      state.queryList.column = action.payload;
    },
    actionSetOperatorFilter: (state, action) => {
      state.queryList.operator = action.payload;
    },
    actionSetSearchFilter: (state, action) => {
      state.queryList.search = action.payload;
    },
    actionSetFilterShowValue: (state, action) => {
      state.filterShowValue = action.payload;
    },
    actionSetSort: (state, action: PayloadAction<SortStateType>) => {
      state.queryList.sort = action.payload.sortParam;
      state.sortState.sortParam = action.payload.sortParam;

      if (state.queryList.direction === null) {
        state.queryList.direction = 'asc';
        state.sortState.direction = 'asc';
      } else if (state.queryList.direction === 'asc') {
        state.queryList.direction = 'desc';
        state.sortState.direction = 'desc';
      } else if (state.queryList.direction === 'desc') {
        state.queryList.direction = null;
        state.sortState.direction = null;
      } else state.queryList.direction = null;
    },
    actionClearVendorApplicationsStore: state => {
      return initialState;
    },
    actionCleanSingleVendor: state => {
      state.singleVendorApplication.data = null;
      state.singleVendorApplication.files = null;
      state.singleVendorApplication.loadingVendor = false;
    },
    actionClearPaginationData: state => {
      state.queryList.offset = 0;
      state.paginationState.currentPage = 1;
    },
  },
  extraReducers: {
    [actionGetVendorApplicationsList.pending.type]: state => {
      state.isLoading = true;
    },
    [actionGetVendorApplicationsList.fulfilled.type]: (
      state,
      action: PayloadAction<PromiseVendorApplicationsList>,
    ) => {
      state.count = action.payload.count;
      state.vendorApplicationsList = [...action.payload.rows];
      state.isLoading = false;
    },

    [actionGetVendorApplicationsList.rejected.type]: state => {
      state.isLoading = false;
    },
    [actionGetSingleVendorData.pending.type]: state => {
      state.singleVendorApplication.loadingVendor = true;
    },
    [actionGetSingleVendorData.fulfilled.type]: (state, action) => {
      state.singleVendorApplication.data = action.payload;
      // state.singleVendorApplication.loadingVendor = false;
    },

    [actionGetSingleVendorData.rejected.type]: (state, action) => {
      state.singleVendorApplication.loadingVendor = false;
    },
    [actionGetSingleVendorFiles.pending.type]: state => {
      state.singleVendorApplication.loadingVendor = true;
    },

    [actionGetSingleVendorFiles.fulfilled.type]: (state, action: PayloadAction<VendorFile[]>) => {
      state.singleVendorApplication.files = action.payload;
      state.singleVendorApplication.loadingVendor = false;
    },

    [actionGetSingleVendorFiles.rejected.type]: state => {
      state.singleVendorApplication.loadingVendor = false;
    },
    [actionApproveVendorRegistration.pending.type]: state => {
      state.isLoading = true;
    },
    [actionApproveVendorRegistration.fulfilled.type]: state => {
      state.isLoading = false;
    },
    [actionApproveVendorRegistration.rejected.type]: state => {
      state.isLoading = false;
    },
    [actionDeclineVendor.pending.type]: state => {
      state.isLoading = true;
    },
    [actionDeclineVendor.fulfilled.type]: state => {
      state.isLoading = false;
    },
    [actionDeclineVendor.rejected.type]: state => {
      state.isLoading = false;
    },
  },
});

export const {
  actionSetOffset,
  actionSetCurrentPage,
  actionSetItemsPerPage,
  actionSetOperatorFilter,
  actionSetColumnFilter,
  actionSetSearchFilter,
  actionSetFilterShowValue,
  actionSetSort,
  actionResetOffset,
  actionClearVendorApplicationsStore,
  actionCleanSingleVendor,
  actionClearPaginationData,
  actionSetSingleVendor,
} = vendorApplicationsSlice.actions;

export default vendorApplicationsSlice.reducer;
