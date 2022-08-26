import { SingleProduct } from '@/api/dto/VendorResponseData';
import { apiDeleteAdmin } from '@/api/superAdminAPI';
import { SingleProductCreate } from '@/store/slices/VendorProductsSlice/type';
import {
  actionDeleteProduct,
  actionGetSingleProduct,
  actionGetVendorProductsList,
} from '@/store/slices/VendorProductsSlice/vendorProductsSlice';
import { useStyles } from '@/styles/materialCustom';
import { Button, Modal } from '@mui/material';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import styles from './vendorProduct.module.scss';
import Box from '@mui/material/Box';
import { useAppDispatch } from '@/customHooks/storeHooks';
import Typography from '@mui/material/Typography';
import { apiDeleteProduct } from '@/api/vendorProductsAPI';
import type { RootState } from '@/store';

type Props = { item: SingleProduct };

const style = {
  position: 'absolute' as const,
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 500,
  bgcolor: 'background.paper',
  // border: '2px solid #000',
  boxShadow: 10,
  p: 4,
};

const VendorProductCollapse: React.FC<Props> = ({ item }) => {
  const dispatch = useAppDispatch();
  const queryList = useSelector((state: RootState) => state.vendorProducts.queryList);
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const deleteProduct = async (id: string) => {
    await dispatch(actionDeleteProduct(id));
    dispatch(actionGetVendorProductsList(queryList));
    handleClose();
  };

  const classes = useStyles();
  const navigate = useNavigate();

  // useEffect(() => {
  //   dispatch(actionGetSingleProduct(item.id));
  // }, []);
  return (
    <>
      <div className={styles.btn_group}>
        <div className={classes.button_out}>
          <Button onClick={() => navigate(`/vendor/create_product/${item.id}`)}>Edit</Button>
        </div>
        <div className={classes.button_out}>
          <Button onClick={handleOpen}>Delete</Button>
        </div>
      </div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Are your sure?
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}></Typography>
          <div style={{ alignItems: 'center' }} className={classes.button_out}>
            <Button onClick={() => deleteProduct(item.id)}>Delete product</Button>
            <Button
              sx={{
                margin: '10px',
                width: '200px',
                flex: 0.5,
              }}
              onClick={handleClose}
            >
              Cancel
            </Button>
          </div>
        </Box>
      </Modal>
    </>
  );
};

export default VendorProductCollapse;
