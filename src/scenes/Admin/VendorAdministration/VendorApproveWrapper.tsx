import { Address, GoogleMap } from '@/api/dto/VendorResponseData';
import { useAppDispatch } from '@/customHooks/storeHooks';
import { RootState } from '@/store';
import {
  actionCleanSingleVendor,
  actionGetSingleVendorData,
  actionGetSingleVendorFiles,
} from '@/store/slices/VendorAdministrationSlice/vendorApplicationSlice';
import { actionGetVendorCategories } from '@/store/slices/VendorProfile/vendorProfileSlice';
import { CircularProgress } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import VendorApprove from './VendorApprove';
import VendorNotApprove from './VendorNotApprove';

const VendorApproveWrapper: React.FC = () => {
  const { id } = useParams();
  const dispatch = useAppDispatch();
  const vendorData = useSelector(
    (state: RootState) => state.vendorApplication.singleVendorApplication,
  );
  const loading = useSelector((state: RootState) => state.vendorApplication.isLoading);
  const [address, setAddress] = useState<GoogleMap | Address>(null);

  useEffect(() => {
    dispatch(actionGetVendorCategories());
    dispatch(actionGetSingleVendorData(id));
    dispatch(actionGetSingleVendorFiles(id));
    setAddress(vendorData?.data?.address);

    return () => {
      dispatch(actionCleanSingleVendor());
    };
  }, []);

  return (
    <>
      {loading && <CircularProgress />}
      {vendorData?.data && !loading && (
        <>
          {vendorData?.data?.is_approved === null && <VendorNotApprove />}
          <VendorApprove address={address} setAddress={setAddress} />
        </>
      )}
    </>
  );
};

export default VendorApproveWrapper;
