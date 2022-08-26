import { PromiseHopperListData, PromiseSingleHopper } from '@/api/dto/HopperResponseData';
import { VendorFile } from '@/api/dto/VendorResponseData';
import {
  apiApproveHopper,
  apiGetHopperAdministrationList,
  apiGetHopperFiles,
  apiGetSingleHopper,
} from '@/api/hopperAdministrationsAPI';
import { createNotification } from '@/components/Notofications';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ServerError } from '../Auth/types';
import { QueryListType, SortStateType } from '../SuperAdminSlice/type';
import { HopperAdministrationInitialState } from './types';

const initialState: HopperAdministrationInitialState = {
  hopperListData: null,
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

export const actionGetHopperList = createAsyncThunk<PromiseHopperListData, QueryListType>(
  'hopper/administration',
  async ({ offset, limit, search, column, operator, sort, direction }, thunkAPI) => {
    try {
      return await apiGetHopperAdministrationList(
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

// export const actionGetSingleHopper = createAsyncThunk<PromiseSingleHopper, string>(
//   'hopper/singleHopper',
//   async (id, thunkAPI) => {
//     try {
//       return await apiGetSingleHopper(id);
//     } catch (error) {
//       return thunkAPI.rejectWithValue(error as ServerError);
//     }
//   },
// );

export const actionApproveHopper = createAsyncThunk<void, { id; is_approved }>(
  'hopper/approve',
  async ({ id, is_approved }, thunkAPI) => {
    try {
      const response = await apiApproveHopper(id, is_approved);
      // thunkAPI.dispatch(actionGetSingleHopper(id));
      createNotification('success', 'Hopper status changed');
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error as ServerError);
    }
  },
);

// export const actionGetHopperFiles = createAsyncThunk<VendorFile[], string>(
//   'hopper/files',
//   async (id, thunkAPI) => {
//     try {
//       return await apiGetHopperFiles(id);
//     } catch (error) {
//       return thunkAPI.rejectWithValue(error as ServerError);
//     }
//   },
// );

export const hopperAdministrationSlice = createSlice({
  name: 'hopperAdministration',
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
    actionClearHopperAdministrationStore: state => {
      return initialState;
    },
    actionClearPaginationData: state => {
      state.queryList.offset = 0;
      state.paginationState.currentPage = 1;
    },
  },
  extraReducers: builder => {
    builder.addCase(actionGetHopperList.pending, state => {
      state.isLoading = true;
    });
    builder.addCase(
      actionGetHopperList.fulfilled,
      (state, action: PayloadAction<PromiseHopperListData>) => {
        state.count = action.payload.count;
        state.hopperListData = action.payload.rows;

        state.isLoading = false;
      },
    );
    builder.addCase(actionGetHopperList.rejected, state => {
      state.isLoading = false;
    });
  },
});

export const {
  actionSetOffset,
  actionResetOffset,
  actionSetCurrentPage,
  actionSetItemsPerPage,
  actionSetOperatorFilter,
  actionSetColumnFilter,
  actionSetSearchFilter,
  actionSetFilterShowValue,
  actionSetSort,
  actionClearHopperAdministrationStore,
  actionClearPaginationData,
} = hopperAdministrationSlice.actions;

export default hopperAdministrationSlice.reducer;
