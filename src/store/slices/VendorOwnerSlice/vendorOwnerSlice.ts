import {
  PromiseVendorApplicationsList,
  PromiseVendorEmployees,
} from '@/api/dto/VendorResponseData';
import { apiDeleteEmployee, apiGetVendorEmployees } from '@/api/vendorAPI';
import { createNotification } from '@/components/Notofications';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ServerError } from '../Auth/types';
import { QueryListType, SortStateType } from '../SuperAdminSlice/type';
import { VendorOwnerInitialState } from './type';

const initialState: VendorOwnerInitialState = {
  vendorEmployees: null,
  count: 0,
  isLoading: false,
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
};

export const actionGetVendorEmployees = createAsyncThunk<PromiseVendorEmployees, QueryListType>(
  'vendor/employees',
  async ({ offset, limit, search, column, operator, sort, direction }, thunkAPI) => {
    try {
      return await apiGetVendorEmployees(offset, limit, search, column, operator, sort, direction);
    } catch (error) {
      return thunkAPI.rejectWithValue(error as ServerError);
    }
  },
);

export const actionDeleteEmployee = createAsyncThunk<void, string>(
  'vendor/delete_employee',
  async (id, thunkAPI) => {
    try {
      await apiDeleteEmployee(id), createNotification('success', 'Employee deleted');
    } catch (error) {
      return thunkAPI.rejectWithValue(error as ServerError);
    }
  },
);

export const vendorOwnerSlice = createSlice({
  name: 'vendorOwner',
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
    actionCleanVendorOwnerStore: state => {
      return initialState;
    },
    actionClearPaginationData: state => {
      state.queryList.offset = 0;
      state.paginationState.currentPage = 1;
    },
  },
  extraReducers: {
    [actionGetVendorEmployees.pending.type]: state => {
      state.isLoading = true;
    },
    [actionGetVendorEmployees.fulfilled.type]: (
      state,
      action: PayloadAction<PromiseVendorEmployees>,
    ) => {
      state.count = action.payload.count;
      state.vendorEmployees = [...action.payload.rows];
      state.isLoading = false;
    },

    [actionGetVendorEmployees.rejected.type]: state => {
      state.isLoading = false;
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
  actionCleanVendorOwnerStore,
  actionClearPaginationData,
} = vendorOwnerSlice.actions;

export default vendorOwnerSlice.reducer;
