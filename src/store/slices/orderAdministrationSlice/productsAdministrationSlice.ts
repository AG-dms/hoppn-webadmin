import { apiGetAdminSingleOrder } from '@/api/adminOrdersAPI';
import { PromiseAllOrders, PromiseSingleOrder } from '@/api/dto/OrdersResponse.dto';
import {
  PromiseVendorApplicationsList,
  PromiseVendorEmployees,
} from '@/api/dto/VendorResponseData';
import { apiGetAllOrders } from '@/api/ordersAPI';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ServerError } from '../Auth/types';
import { QueryListType, SortStateType } from '../SuperAdminSlice/type';
import { ProductsAdministrationInitialState } from './type';

const initialState: ProductsAdministrationInitialState = {
  productsList: null,
  count: 0,
  isLoading: false,
  filterShowValue: 'price',
  singleOrder: null,
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

export const actionGetAllProducts = createAsyncThunk<PromiseAllOrders, QueryListType>(
  'admin/AllOrders',
  async ({ offset, limit, search, column, operator, sort, direction }, thunkAPI) => {
    try {
      return await apiGetAllOrders(offset, limit, search, column, operator, sort, direction);
    } catch (error) {
      return thunkAPI.rejectWithValue(error as ServerError);
    }
  },
);

export const actionGetAdminSingleOrder = createAsyncThunk<PromiseSingleOrder, string>(
  'admin/singleOrder',
  async (id, thunkAPI) => {
    try {
      return await apiGetAdminSingleOrder(id);
    } catch (error) {
      return thunkAPI.rejectWithValue(error as ServerError);
    }
  },
);

export const productsAdministrationSlice = createSlice({
  name: 'productsAdmin',
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
    actionClearSingleOrder: state => {
      state.singleOrder = null;
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
    actionCleanVendorAdministrationStore: state => {
      return initialState;
    },
    actionClearPaginationData: state => {
      state.queryList.offset = 0;
      state.paginationState.currentPage = 1;
    },
  },
  extraReducers: builder => {
    builder.addCase(actionGetAllProducts.pending, state => {
      state.isLoading = true;
    });
    builder.addCase(
      actionGetAllProducts.fulfilled,
      (state, action: PayloadAction<PromiseAllOrders>) => {
        state.count = action.payload.count;
        state.productsList = [...action.payload.rows];
        state.isLoading = false;
      },
    );
    builder.addCase(actionGetAllProducts.rejected, state => {
      state.isLoading = false;
    });

    builder.addCase(actionGetAdminSingleOrder.pending, state => {
      state.isLoading = true;
    });
    builder.addCase(
      actionGetAdminSingleOrder.fulfilled,
      (state, action: PayloadAction<PromiseSingleOrder>) => {
        state.singleOrder = action.payload;
        state.isLoading = false;
      },
    );
    builder.addCase(actionGetAdminSingleOrder.rejected, state => {
      state.isLoading = false;
    });
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
  actionClearSingleOrder,
  actionCleanVendorAdministrationStore,
  actionClearPaginationData,
} = productsAdministrationSlice.actions;

export default productsAdministrationSlice.reducer;
