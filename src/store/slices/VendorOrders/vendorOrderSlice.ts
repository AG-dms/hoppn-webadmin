import { PromiseSingleOrder } from '@/api/dto/OrdersResponse.dto';
import { PromiseVendorOrdersList } from '@/api/dto/VendorResponseData';
import { apiGetSingleOrder } from '@/api/ordersAPI';
import { apiGetVendorOrdersList } from '@/api/vendorOrderAPI';
import { createError } from '@/components/Notofications';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ServerError } from '../Auth/types';
import { QueryListType, SortStateType } from '../SuperAdminSlice/type';
import { VendorOrdersInitialState } from './types';

export const actionVendorGetOrdersList = createAsyncThunk<PromiseVendorOrdersList, QueryListType>(
  'vendor/ordersList',
  async ({ offset, limit, search, column, operator, sort, direction }, thunkAPI) => {
    try {
      return await apiGetVendorOrdersList(offset, limit, search, column, operator, sort, direction);
    } catch (error) {
      return thunkAPI.rejectWithValue(error as ServerError);
    }
  },
);

export const actionGetSingleOrder = createAsyncThunk<PromiseSingleOrder, string>(
  'orders/SingleOrder',
  async (id, thunkAPI) => {
    try {
      return await apiGetSingleOrder(id);
    } catch (error) {
      createError(error, thunkAPI.dispatch);
      return thunkAPI.rejectWithValue(error as ServerError);
    }
  },
);

const initialState: VendorOrdersInitialState = {
  vendorOrdersList: null,
  count: 0,
  singleOrder: null,
  isLoading: false,
  filterShowValue: 'price',
  sortState: { sortParam: null, direction: null },
  queryList: {
    offset: 0,
    limit: 20,
    search: null,
    column: 'price',
    operator: 'co',
    sort: 'created_at',
    direction: null,
  },
  paginationState: {
    itemsPerPage: 20,
    currentPage: 1,
  },
};

export const vendorOrdersSlice = createSlice({
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
    actionCleanVendorOrderSlice: state => {
      return initialState;
    },
    actionClearPaginationData: state => {
      state.queryList.offset = 0;
      state.paginationState.currentPage = 1;
    },
  },
  extraReducers: builder => {
    builder.addCase(actionVendorGetOrdersList.pending, state => {
      state.isLoading = true;
    });
    builder.addCase(
      actionVendorGetOrdersList.fulfilled,
      (state, action: PayloadAction<PromiseVendorOrdersList>) => {
        state.count = action.payload.count;
        state.vendorOrdersList = action.payload.rows;
        state.isLoading = false;
      },
    );
    builder.addCase(actionVendorGetOrdersList.rejected, state => {
      state.isLoading = false;
    });

    builder.addCase(actionGetSingleOrder.pending, state => {
      state.isLoading = true;
    });

    builder.addCase(
      actionGetSingleOrder.fulfilled,
      (state, action: PayloadAction<PromiseSingleOrder>) => {
        state.singleOrder = action.payload;
        state.isLoading = false;
      },
    );
    builder.addCase(actionGetSingleOrder.rejected, state => {
      state.isLoading = false;
    });
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
  actionCleanVendorOrderSlice,
  actionClearPaginationData,
} = vendorOrdersSlice.actions;

export default vendorOrdersSlice.reducer;
