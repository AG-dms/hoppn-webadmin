import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import thunk, { ThunkMiddleware } from 'redux-thunk';
import allProductsSlice from './slices/AdminProductsSlice/AllProductsSlice';
import adminSlice from './slices/AdminSlice/adminSlice';
import hopperAdministrationSlice from './slices/HopperAdministrationSlice/hopperAdministrationSlice';
import productsAdministrationSlice from './slices/orderAdministrationSlice/productsAdministrationSlice';
import profileSlice from './slices/Profile/profileSlice';
import superAdminSlice from './slices/SuperAdminSlice/superAdminSlice';
import themeSlice from './slices/ThemeSlice/themeSlice';
import vendorApplicationsSlice from './slices/VendorAdministrationSlice/vendorApplicationSlice';
import vendorOrderSlice from './slices/VendorOrders/vendorOrderSlice';
import vendorOwnerSlice from './slices/VendorOwnerSlice/vendorOwnerSlice';
import vendorProductsSlice from './slices/VendorProductsSlice/vendorProductsSlice';
import authSlice from './slices/Auth/authSlice';
import vendorProfileSlice from './slices/VendorProfile/vendorProfileSlice';
import thunkMiddleware from 'redux-thunk';

const rootReducer = combineReducers({
  theme: themeSlice,
  auth: authSlice,
  superAdmin: superAdminSlice,
  admin: adminSlice,
  profile: profileSlice,
  vendorApplication: vendorApplicationsSlice,
  vendorProfile: vendorProfileSlice,
  vendorOwner: vendorOwnerSlice,
  productsAdmin: productsAdministrationSlice,
  vendorProducts: vendorProductsSlice,
  hopperAdmin: hopperAdministrationSlice,
  vendorOrders: vendorOrderSlice,
  allProducts: allProductsSlice,
});

const persistConfig = {
  key: 'root',
  storage,
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  devTools: process.env.NODE_ENV !== 'production',
  middleware: getDefaultMiddleware => getDefaultMiddleware({ serializableCheck: false }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;

// type StoreType = typeof store;
// export type AppDispatch = StoreType['dispatch'];

export type AppDispatch = typeof store.dispatch;
