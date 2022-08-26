import useQuery from '@/customHooks/useQuery';
import { Role } from '@/utils/enum/Role';
import { CircularProgress } from '@mui/material';
import React, { Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
import PrivateRoute from './PrivateRoute';
import PublicRoute from './PublicRoute';

// import components for lazy loading
const Login = React.lazy(() => import(/* webpackChunkName: "Login" */ '@/scenes/Login/Login'));
const SuperAdmin = React.lazy(
  () => import(/* webpackChunkName: "SuperAdmin" */ '@/scenes/SuperAdmin/SuperAdmin'),
);
const CreateAdmin = React.lazy(
  () => import(/* webpackChunkName: "CreateAdmin" */ '@/scenes/SuperAdmin/CreateAdmin'),
);
const Admin = React.lazy(() => import(/* webpackChunkName: "Admin" */ '@/scenes/Admin/Admin'));
const Profile = React.lazy(
  () => import(/* webpackChunkName: "Profile" */ '@/scenes/Profile/Profile'),
);
const AllOrders = React.lazy(
  () => import(/* webpackChunkName: "AllOrders" */ '@/scenes/Admin/Orders/AllOrders'),
);
const HopperAdministration = React.lazy(
  () =>
    import(
      /* webpackChunkName: "HopperAdministration" */ '@/scenes/Admin/HopperAdministration/HopperAdministration'
    ),
);
const AdminSingleOrder = React.lazy(
  () => import(/* webpackChunkName: "AdminSingleOrder" */ '@/scenes/Admin/Orders/AdminSingleOrder'),
);
const VendorProfile = React.lazy(
  () => import(/* webpackChunkName: "VendorProfile" */ '@/scenes/VendorProfile/VendorProfile'),
);
const EditVendorProfile = React.lazy(
  () =>
    import(/* webpackChunkName: "EditVendorProfile" */ '@/scenes/VendorProfile/EditVendorProfile'),
);
const EmailConfirm = React.lazy(
  () => import(/* webpackChunkName: "EmailConfirm" */ '@/scenes/EmailConfirm/EmailConfirm'),
);
const CreateVendorProfile = React.lazy(
  () => import(/* webpackChunkName: "CreateVendor" */ '@/scenes/VendorProfile/CreateVendor'),
);
const VendorNotApprove = React.lazy(
  () =>
    import(
      /* webpackChunkName: "VendorNotApprove" */ '@/scenes/Admin/VendorAdministration/VendorNotApprove'
    ),
);
const VendorApprove = React.lazy(
  () =>
    import(
      /* webpackChunkName: "VendorApprove" */ '@/scenes/Admin/VendorAdministration/VendorApprove'
    ),
);
const VendorModeration = React.lazy(
  () =>
    import(
      /* webpackChunkName: "VendorApproveWrapper" */ '@/scenes/Admin/VendorAdministration/VendorApproveWrapper'
    ),
);
const Vendor = React.lazy(
  () => import(/* webpackChunkName: "Vendor" */ '@/scenes/Vendor Owner/Vendor'),
);
const VendorAdministration = React.lazy(
  () =>
    import(
      /* webpackChunkName: "VendorAdministration" */ '@/scenes/Admin/VendorAdministration/VendorAdministration'
    ),
);
const Products = React.lazy(
  () => import(/* webpackChunkName: "AllProducts" */ '@/scenes/Admin/Products/AllProducts'),
);
const VendorProducts = React.lazy(
  () => import(/* webpackChunkName: "VendorProducts" */ '@/scenes/VendorProducts/VendorProducts'),
);
const CreateProduct = React.lazy(
  () => import(/* webpackChunkName: "CreateProduct" */ '@/scenes/VendorProducts/CreateProduct'),
);
const VendorOrders = React.lazy(
  () => import(/* webpackChunkName: "VendorOrders" */ '@/scenes/VendorOrders/VendorOrders'),
);
const VendorSingleOrder = React.lazy(
  () =>
    import(/* webpackChunkName: "VendorSingleOrder" */ '@/scenes/VendorOrders/VendorSingleOrder'),
);
const NotFound = React.lazy(
  () => import(/* webpackChunkName: "NotFound" */ '@/scenes/NotFound/NotFound'),
);
const AdminSingleProduct = React.lazy(
  () =>
    import(
      /* webpackChunkName: "AdminSingleProduct" */ '@scenes/Admin/Products/AdminSingleProduct'
    ),
);
// const CreateHProfile = React.lazy(
//   () => import(/* webpackChunkName: "CreateVendor" */ '@/scenes/VendorProfile/CreateVendor'),
// );

const Router: React.FC = () => {
  const query = useQuery();
  return (
    <Suspense
      fallback={
        <CircularProgress
          color="primary"
          sx={{
            position: 'absolute',
            alignSelf: 'center',
          }}
        />
      }
    >
      <Routes>
        <Route element={<PublicRoute />}>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
        </Route>

        <Route element={<PrivateRoute roles={[Role.Admin]} />}>
          <Route path={'/admin'} element={<Admin />} />
          <Route path={'/admin/all_orders'} element={<AllOrders />} />
          <Route path={'/admin/products'} element={<Products />} />
          <Route path={'/admin/order/:id'} element={<AdminSingleOrder />} />
          <Route path={'/vendor/administration'} element={<VendorAdministration />} />
          <Route path={'/hopper/administration'} element={<HopperAdministration />} />
          <Route path={'/admin/product/:id'} element={<AdminSingleProduct />} />
          <Route path={'/admin/moderation_vendor/:id'} element={<VendorModeration />} />
        </Route>

        <Route element={<PrivateRoute roles={[Role.Vendor]} />}>
          <Route path={'/vendor'} element={<Vendor />} />
        </Route>

        <Route element={<PrivateRoute roles={[Role.Superadmin]} />}>
          <Route path="/super_admin" element={<SuperAdmin />} />
          <Route path={'/create_admin'} element={<CreateAdmin />} />
        </Route>

        <Route element={<PrivateRoute roles={[Role.Vendor, Role.Manager]} />}>
          <Route path={'/vendor/profile'} element={<VendorProfile />} />
          <Route path={'/vendor/edit_profile'} element={<EditVendorProfile />} />
          <Route path={'/vendor/products'} element={<VendorProducts />} />
          <Route path={'/vendor/create_product'} element={<CreateProduct />} />
          <Route path={'/vendor/create_product/:id'} element={<CreateProduct />} />
          <Route path={'/vendor_orders'} element={<VendorOrders />} />
          <Route path={'/vendor_orders/:id'} element={<VendorSingleOrder />} />
        </Route>
        <Route
          element={
            <PrivateRoute
              roles={[
                Role.Admin,
                Role.Customer,
                Role.Hopper,
                Role.Vendor,
                Role.Manager,
                Role.Picker,
              ]}
            />
          }
        >
          <Route path={'/profile'} element={<Profile />} />
          <Route path={'/invite'} element={<Profile />} />
        </Route>
        <Route element={<PrivateRoute roles={[Role.Customer, Role.Admin, Role.Hopper]} />}>
          <Route path={'/vendor/create_profile'} element={<CreateVendorProfile />} />
        </Route>
        <Route
          path={'/email/confirm'}
          element={<EmailConfirm token={query.get('token')} />}
        ></Route>
        <Route path={'*'} element={<NotFound />} />
      </Routes>
    </Suspense>
  );
};

export default Router;
