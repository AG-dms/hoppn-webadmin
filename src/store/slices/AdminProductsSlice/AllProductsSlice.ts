import {
  PromiseProductsData,
  PromiseSingleAdminProduct,
} from '../../../api/dto/ProductsResponseData';
import { PromiseSingleOrder } from '@/api/dto/OrdersResponse.dto';
import { PromiseVendorOrdersList } from '@/api/dto/VendorResponseData';
import { apiGetSingleOrder } from '@/api/ordersAPI';
import { apiGetVendorOrdersList } from '@/api/vendorOrderAPI';
import { createError } from '@/components/Notofications';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ServerError } from '../Auth/types';
import { QueryListType, SortStateType } from '../SuperAdminSlice/type';
import { ProductsListInitialState } from './types';
import { apiGetAdminSingleProduct, apiGetProductsList } from '@/api/productAPI';

export const actionAdminGetProductsList = createAsyncThunk<PromiseProductsData, QueryListType>(
  'admin/AllProducts',
  async ({ offset, limit, search, column, operator, sort, direction }, thunkAPI) => {
    try {
      return await apiGetProductsList(offset, limit, search, column, operator, sort, direction);
    } catch (error) {
      return thunkAPI.rejectWithValue(error as ServerError);
    }
  },
);

export const actionGetSingleAdminProduct = createAsyncThunk<PromiseSingleAdminProduct, string>(
  'orders/AdminSingleProduct',
  async (id, thunkAPI) => {
    try {
      return await apiGetAdminSingleProduct(id);
    } catch (error) {
      createError(error, thunkAPI.dispatch);
      return thunkAPI.rejectWithValue(error as ServerError);
    }
  },
);

const initialState: ProductsListInitialState = {
  count: 0,
  isLoading: false,
  filterShowValue: 'price',
  productsList: null,
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
  singleProduct: null,
  paginationState: {
    itemsPerPage: 20,
    currentPage: 1,
  },
};

export const allProductsSlice = createSlice({
  name: 'allProducts',
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
    actionCleanAdminProductsSlice: state => {
      return initialState;
    },
    actionClearPaginationData: state => {
      state.queryList.offset = 0;
      state.paginationState.currentPage = 1;
    },
  },
  extraReducers: builder => {
    builder.addCase(actionAdminGetProductsList.pending, state => {
      state.isLoading = true;
    });
    builder.addCase(
      actionAdminGetProductsList.fulfilled,
      (state, action: PayloadAction<PromiseProductsData>) => {
        state.count = action.payload.count;
        state.productsList = action.payload.rows;
        state.isLoading = false;
      },
    );
    builder.addCase(actionAdminGetProductsList.rejected, state => {
      state.isLoading = false;
    });

    builder.addCase(actionGetSingleAdminProduct.pending, state => {
      state.isLoading = true;
    });

    builder.addCase(
      actionGetSingleAdminProduct.fulfilled,
      (state, action: PayloadAction<PromiseSingleAdminProduct>) => {
        state.singleProduct = action.payload;
        state.isLoading = false;
      },
    );
    builder.addCase(actionGetSingleAdminProduct.rejected, state => {
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
  actionCleanAdminProductsSlice,
  actionClearPaginationData,
} = allProductsSlice.actions;

export default allProductsSlice.reducer;
