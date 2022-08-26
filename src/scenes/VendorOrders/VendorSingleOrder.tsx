import { RootState } from '@/store';
import { actionGetSingleOrder } from '@/store/slices/VendorOrders/vendorOrderSlice';
import { CircularProgress, List, ListItem, ListItemIcon } from '@mui/material';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import style from './VendorOrder.module.scss';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import { currencyFormat } from '@/utils/common';
import MainBlock from './VendorSingleOrderRight/MainBlock';
import { useAppDispatch } from '@/customHooks/storeHooks';
import { currencyTransformer, Kobo } from '@/utils/dinero';
import { toFormat } from 'dinero.js';
import { NGN } from '@dinero.js/currencies';

const VendorSingleOrder: React.FC = () => {
  const { id } = useParams();
  const dispatch = useAppDispatch();
  const loading = useSelector((state: RootState) => state.vendorOrders.isLoading);
  const singleOrder = useSelector((state: RootState) => state.vendorOrders.singleOrder);

  useEffect(() => {
    dispatch(actionGetSingleOrder(id));
  }, []);
  return (
    <>
      {loading && <CircularProgress />}
      {singleOrder && !loading ? (
        <div className={style.order_container}>
          <MainBlock />
          <div className={`custom_scrollbar ${style.cart_container}`}>
            <div style={{ paddingBottom: 10, boxSizing: 'border-box' }}>
              <div className={style.cart_header}>
                <h2 className={style.order_title}>Order: {singleOrder?.id}</h2>
              </div>
              <div className={style.cart_list}>
                <div className={style.list_container}>
                  <span>Order list:</span>
                  <List className="custom_scrollbar" sx={{ maxHeight: '250px', overflow: 'auto' }}>
                    {singleOrder?.cart &&
                      singleOrder.cart.map(cartItem => {
                        return (
                          <ListItem
                            sx={{ borderBottom: '1px solid lightgray' }}
                            key={cartItem.product_snapshot.id}
                          >
                            <ListItemIcon sx={{ minWidth: 30 }}>
                              <FiberManualRecordIcon
                                sx={{ marginRight: '15px' }}
                                fontSize="small"
                              />
                            </ListItemIcon>
                            <div className={style.list_item_block}>
                              <span className={style.list_item_span}>{cartItem.quantity} x</span>
                              <span className={style.list_item_span}>
                                {cartItem.product_snapshot.name}
                              </span>
                              <span className={style.list_item_span}>
                                {toFormat(
                                  Kobo(cartItem.product_snapshot.price),
                                  currencyTransformer,
                                )}
                              </span>
                            </div>
                          </ListItem>
                        );
                      })}
                  </List>
                </div>
                <div className={style.order_detail_right}>
                  <div className={style.customer_comment}>
                    <span className={style.customer_comment_title}>Client comment:</span>
                    <p className={`custom_scrollbar_small ${style.customer_comment_text}`}>
                      {singleOrder.user_comment ? singleOrder.user_comment : 'No comment'}
                    </p>
                  </div>
                  <div className={style.picker_comment}>
                    <span className={style.customer_comment_title}>Picker comment for client:</span>
                    <textarea
                      disabled
                      className={`${style.picker_comment_text} custom_scrollbar_small`}
                      value={singleOrder.vendor_comment ? singleOrder.vendor_comment : 'No comment'}
                    />
                  </div>
                </div>
              </div>
              <div className={style.cart_footer}>
                {singleOrder.status === 'created' ? (
                  <>
                    <div
                      className={`${singleOrder.offer_price && style.cart_footer_title_line} ${
                        style.cart_footer_base
                      }`}
                    >
                      <p className={style.order_title_footer}>Price:</p>
                      <p className={style.order_title_footer}>
                        {toFormat(Kobo(singleOrder.price), currencyTransformer)}
                      </p>
                    </div>
                    {singleOrder?.offer_price && (
                      <div
                        className={`${
                          singleOrder.counteroffer_price && style.cart_footer_title_line
                        } ${style.cart_footer_base}`}
                      >
                        <p className={style.order_title_footer}>Client offer price:</p>
                        <p className={style.order_title_footer}>
                          {toFormat(Kobo(singleOrder.offer_price), currencyTransformer)}
                        </p>
                      </div>
                    )}
                    {singleOrder?.counteroffer_price && (
                      <div className={style.cart_footer_base}>
                        <p className={style.order_title_footer}>Your offer price:</p>
                        <p className={style.order_title_footer}>
                          {toFormat(Kobo(singleOrder.counteroffer_price), currencyTransformer)}
                        </p>
                      </div>
                    )}
                  </>
                ) : (
                  <div className={style.cart_footer_base}>
                    <p className={style.order_title_footer}>Total price:</p>
                    <p className={style.order_title_footer}>
                      {toFormat(Kobo(singleOrder.total_price), currencyTransformer)}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
};

export default VendorSingleOrder;
