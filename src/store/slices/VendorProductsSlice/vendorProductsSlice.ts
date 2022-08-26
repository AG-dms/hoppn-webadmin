import {
  PromiseProductCategory,
  PromiseSingleEditProduct,
  PromiseVendorProducts,
} from '@/api/dto/VendorResponseData';
import {
  apiChangeProductDraft,
  apiCreateProduct,
  apiDeleteProduct,
  apiEditProduct,
  apiGetProductCategory,
  apiGetSingleProduct,
  apiGetVendorProducts,
} from '@/api/vendorProductsAPI';
import { createError, createNotification } from '@/components/Notofications';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ServerError } from '../Auth/types';
import { QueryListType, SortStateType } from '../SuperAdminSlice/type';
import { SingleProductCreate, SingleProductEdit, VendorProductsInitialState } from './type';

const initialState: VendorProductsInitialState = {
  vendorProductsList: null,
  count: 0,
  isLoading: false,
  filterShowValue: 'name',
  sortState: { sortParam: null, direction: null },
  queryList: {
    offset: 0,
    limit: 20,
    search: null,
    column: 'name',
    operator: 'co',
    sort: 'created_at',
    direction: null,
  },
  paginationState: {
    itemsPerPage: 20,
    currentPage: 1,
  },
  singleProduct: null,
  productsCategory: [],
};

export const actionGetVendorProductsList = createAsyncThunk<PromiseVendorProducts, QueryListType>(
  'vendor/products',
  async ({ offset, limit, search, column, operator, sort, direction }, thunkAPI) => {
    try {
      return await apiGetVendorProducts(offset, limit, search, column, operator, sort, direction);
    } catch (error) {
      return thunkAPI.rejectWithValue(error as ServerError);
    }
  },
);

export const actionGetProductCategories = createAsyncThunk<PromiseProductCategory[], string[]>(
  'vendor/productCategory',
  async (vendor_category_ids, thunkAPI) => {
    try {
      return await apiGetProductCategory(vendor_category_ids);
    } catch (error) {
      createError(error, thunkAPI.dispatch);
      return thunkAPI.rejectWithValue(error as ServerError);
    }
  },
);

export const actionCreateNewProduct = createAsyncThunk<void, SingleProductCreate>(
  'vendor/create_product',
  async ({ photos, name, category_id, price, description }, thunkAPI) => {
    try {
      await apiCreateProduct(photos, name, category_id, price, description);
      createNotification('success', 'Product created');
    } catch (error) {
      createError(error, thunkAPI.dispatch);
      return thunkAPI.rejectWithValue(error as ServerError);
    }
  },
);

export const actionGetSingleProduct = createAsyncThunk<PromiseSingleEditProduct, string>(
  'vendor/single_product',
  async (id, thunkAPI) => {
    try {
      return await apiGetSingleProduct(id);
    } catch (error) {
      createError(error, thunkAPI.dispatch);
      return thunkAPI.rejectWithValue(error as ServerError);
    }
  },
);

export const actionDeleteProduct = createAsyncThunk<void, string>(
  'vendor/delete_product',
  async (id, thunkAPI) => {
    try {
      await apiDeleteProduct(id);
      createNotification('success', 'Product deleted');
    } catch (error) {
      createError(error, thunkAPI.dispatch);
      return thunkAPI.rejectWithValue(error as ServerError);
    }
  },
);

export const actionEditProduct = createAsyncThunk<void, SingleProductEdit>(
  'vendor/edit_product',
  async (
    { id, photos, current_photo_ids, name, category_id, price, is_draft, description },
    thunkAPI,
  ) => {
    try {
      await apiEditProduct(
        id,
        photos,
        current_photo_ids,
        name,
        category_id,
        price,
        is_draft,
        description,
      );
      thunkAPI.dispatch(actionGetSingleProduct(id));
      createNotification('success', 'Product changed');
    } catch (error) {
      createError(error, thunkAPI.dispatch);
      return thunkAPI.rejectWithValue(error as ServerError);
    }
  },
);
export const actionChangeProductDraft = createAsyncThunk<
  void,
  { id: string; is_draft: boolean; change: () => void }
>('vendor/changeDraft', async ({ id, is_draft, change }, thunkAPI) => {
  try {
    const response = await apiChangeProductDraft(id, is_draft);
    thunkAPI.dispatch(actionGetSingleProduct(id));
    change();
    createNotification('success', 'Draft changed');
    return response;
  } catch (error) {
    createError(error, thunkAPI.dispatch);
    return thunkAPI.rejectWithValue(error as ServerError);
  }
});

export const vendorProductsSlice = createSlice({
  name: 'vendorProducts',
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
    actionCleanVendorProductsStore: state => {
      return initialState;
    },
    actionDeleteProductPhoto: (state, action) => {
      state.singleProduct.photos = state.singleProduct.photos.filter(item => {
        if (item.id !== action.payload) {
          return item;
        }
      });
    },
    actionClearPaginationData: state => {
      state.queryList.offset = 0;
      state.paginationState.currentPage = 1;
    },
  },
  extraReducers: {
    [actionGetVendorProductsList.pending.type]: state => {
      state.isLoading = true;
    },
    [actionGetVendorProductsList.fulfilled.type]: (
      state,
      action: PayloadAction<PromiseVendorProducts>,
    ) => {
      state.count = action.payload.count;
      state.vendorProductsList = [...action.payload.rows];
      state.isLoading = false;
    },
    [actionGetVendorProductsList.rejected.type]: state => {
      state.isLoading = false;
    },
    [actionGetProductCategories.pending.type]: state => {
      state.isLoading = true;
    },
    [actionGetProductCategories.fulfilled.type]: (
      state,
      action: PayloadAction<PromiseProductCategory[]>,
    ) => {
      state.productsCategory = action.payload;
      state.isLoading = false;
    },
    [actionGetProductCategories.rejected.type]: state => {
      state.isLoading = false;
    },
    [actionCreateNewProduct.pending.type]: state => {
      state.isLoading = true;
    },

    [actionCreateNewProduct.fulfilled.type]: state => {
      state.isLoading = false;
    },
    [actionCreateNewProduct.rejected.type]: state => {
      state.isLoading = false;
    },
    [actionEditProduct.pending.type]: state => {
      state.isLoading = true;
    },
    [actionEditProduct.fulfilled.type]: state => {
      state.isLoading = false;
    },
    [actionEditProduct.rejected.type]: state => {
      state.isLoading = false;
    },

    [actionGetSingleProduct.fulfilled.type]: (
      state,
      action: PayloadAction<PromiseSingleEditProduct>,
    ) => {
      state.singleProduct = action.payload;
      // state.isLoading = false;
    },
    [actionDeleteProduct.fulfilled.type]: state => {
      state.singleProduct = null;
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
  actionCleanVendorProductsStore,
  actionDeleteProductPhoto,
  actionClearPaginationData,
} = vendorProductsSlice.actions;

export default vendorProductsSlice.reducer;
