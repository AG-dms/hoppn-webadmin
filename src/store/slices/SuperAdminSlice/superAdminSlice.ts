import {
  AdminListData,
  CreateAdmin,
  PromiseListAdminData,
  PromiseSingleAdmin,
} from '@/api/dto/UserResponseData';
import {
  apiBlockAdmin,
  apiCreateAdmin,
  apiDeleteAdmin,
  apiGetAdmins,
  apiGetSingleAdmin,
} from '@/api/superAdminAPI';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ServerError } from '../Auth/types';
import {
  NewAdmin,
  QueryListType,
  SingleAdminData,
  SuperAdminInitialState,
  SortStateType,
  BlockAdmin,
} from './type';
import { createNotification, createError } from '@/components/Notofications';
import { AxiosError } from 'axios';
import { SingleAdmin } from '../AdminSlice/type';

const initialState: SuperAdminInitialState = {
  adminList: [],
  isLoading: false,
  count: 0,
  filterShowValue: 'email',
  sortState: { sortParam: null, direction: null },
  queryList: {
    offset: 0,
    limit: 20,
    search: null,
    column: 'email',
    operator: 'co',
    sort: 'created_at',
    direction: null,
  },
  paginationState: {
    itemsPerPage: 20,
    currentPage: 1,
  },
  singleAdmin: {
    isLoading: false,
    data: null,
  },
};

export const actionGetAdminsList = createAsyncThunk<PromiseListAdminData, QueryListType>(
  'admins/list',
  async ({ offset, limit, search, column, operator, sort, direction }, thunkAPI) => {
    try {
      const response = await apiGetAdmins(offset, limit, search, column, operator, sort, direction);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error as ServerError);
    }
  },
);

export const actionCreateAdmin = createAsyncThunk<CreateAdmin, NewAdmin>(
  'admins/create',
  async ({ email, password, lastQueryParams }, thunkAPI) => {
    try {
      const response = await apiCreateAdmin(email, password);
      createNotification('success', 'Admin created');
      thunkAPI.dispatch(actionGetAdminsList(lastQueryParams));

      return response;
    } catch (error) {
      createError(error, thunkAPI.dispatch);
      return thunkAPI.rejectWithValue(error as ServerError);
    }
  },
);

export const actionGetSingleAdmin = createAsyncThunk<PromiseSingleAdmin, string>(
  'admin/single_profile',
  async (id, thunkAPI) => {
    try {
      return await apiGetSingleAdmin(id);
    } catch (error) {
      createError(error, thunkAPI.dispatch);
      return thunkAPI.rejectWithValue(error as ServerError);
    }
  },
);

export const actionDeleteAdmin = createAsyncThunk<void, SingleAdmin>(
  'admin/delete',
  async ({ id }, thunkAPI) => {
    try {
      await apiDeleteAdmin(id);
      createNotification('success', 'Admin deleted');
    } catch (error) {
      createError(error, thunkAPI.dispatch);
      return thunkAPI.rejectWithValue(error as ServerError);
    }
  },
);

export const actionBlockAdmin = createAsyncThunk<void, BlockAdmin>(
  'admin/block',
  async ({ id, status }, thunkAPI) => {
    try {
      await apiBlockAdmin(id, status);
      thunkAPI.dispatch(actionGetSingleAdmin(id));
      createNotification('success', 'Admin status changed');
    } catch (error) {
      createError(error, thunkAPI.dispatch);
      return thunkAPI.rejectWithValue(error as ServerError);
    }
  },
);

export const superAdminSlice = createSlice({
  name: 'superAdmin',
  initialState,
  reducers: {
    actionResetOffset: state => {
      state.paginationState.currentPage = 1;
      state.queryList.offset = 0;
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

    actionClearSuperAdminStore: state => {
      return initialState;
    },
    actionClearPaginationData: state => {
      state.queryList.offset = 0;
      state.paginationState.currentPage = 1;
    },
  },
  extraReducers: {
    [actionGetAdminsList.pending.type]: state => {
      state.isLoading = true;
    },
    [actionGetAdminsList.fulfilled.type]: (state, action: PayloadAction<PromiseListAdminData>) => {
      state.count = action.payload.count;
      state.adminList = [...action.payload.rows];
      state.isLoading = false;
    },
    [actionGetAdminsList.rejected.type]: state => {
      state.isLoading = false;
    },
    [actionCreateAdmin.pending.type]: state => {
      state.isLoading = true;
    },
    [actionCreateAdmin.pending.type]: state => {
      state.isLoading = false;
    },
    [actionDeleteAdmin.pending.type]: state => {
      state.singleAdmin.isLoading = true;
    },
    [actionDeleteAdmin.fulfilled.type]: state => {
      state.singleAdmin.isLoading = false;
    },
    [actionGetSingleAdmin.pending.type]: state => {
      state.singleAdmin.isLoading = true;
    },
    [actionGetSingleAdmin.fulfilled.type]: (state, action: PayloadAction<PromiseSingleAdmin>) => {
      state.singleAdmin.data = action.payload;
      state.singleAdmin.isLoading = false;
    },
    [actionGetSingleAdmin.rejected.type]: state => {
      state.singleAdmin.isLoading = false;
    },
  },
});

export const {
  actionResetOffset,
  actionSetOffset,
  actionSetCurrentPage,
  actionSetItemsPerPage,
  actionSetOperatorFilter,
  actionSetColumnFilter,
  actionSetSearchFilter,
  actionSetFilterShowValue,
  actionSetSort,
  actionClearSuperAdminStore,
  actionClearPaginationData,
} = superAdminSlice.actions;

export default superAdminSlice.reducer;
