import { PromiseListUserData, UserListData } from '@/api/dto/UserResponseData';
import { apiGetSingleUser, apiGetUsersList, apiUsersChangeStatus } from '@/api/usersAPI';
import { createNotification } from '@/components/Notofications';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ServerError } from '../Auth/types';
import { QueryListType, SortStateType } from '../SuperAdminSlice/type';
import { AdminInitialState } from './type';

const initialState: AdminInitialState = {
  usersList: null,
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

export const actionGetUsersList = createAsyncThunk<PromiseListUserData, QueryListType>(
  'admins/userList',
  async ({ offset, limit, search, column, operator, sort, direction }, thunkAPI) => {
    try {
      return await apiGetUsersList(offset, limit, search, column, operator, sort, direction);
    } catch (error) {
      return thunkAPI.rejectWithValue(error as ServerError);
    }
  },
);

export const actionChangeUserStatus = createAsyncThunk<void, { id: string; status: string }>(
  'admins/changeUserStatus',
  async ({ id, status }, thunkAPI) => {
    try {
      const response = await apiUsersChangeStatus(id, status);
      createNotification('success', 'User status changed');
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error as ServerError);
    }
  },
);

export const adminSlice = createSlice({
  name: 'Admin',
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
    actionClearAdminStore: state => {
      return initialState;
    },
    actionClearPaginationData: state => {
      state.queryList.offset = 0;
      state.paginationState.currentPage = 1;
    },
  },
  extraReducers: builder => {
    builder.addCase(actionGetUsersList.pending, state => {
      state.isLoading = true;
    });

    builder.addCase(
      actionGetUsersList.fulfilled,
      (state, action: PayloadAction<PromiseListUserData>) => {
        state.count = action.payload.count;
        state.usersList = [...action.payload.rows];
        state.isLoading = false;
      },
    );
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
  actionClearAdminStore,
  actionClearPaginationData,
} = adminSlice.actions;

export default adminSlice.reducer;
