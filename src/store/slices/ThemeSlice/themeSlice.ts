// delete console.log

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ThemeState } from './types';

const initialState: ThemeState = {
  isSidebarOpen: false,
};

export const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    actionToggleSidebar: (state: ThemeState, action: PayloadAction<boolean>) => {
      state.isSidebarOpen = action.payload;
    },
  },
});

const { actions, reducer } = themeSlice;

export const { actionToggleSidebar } = actions;

export default reducer;
