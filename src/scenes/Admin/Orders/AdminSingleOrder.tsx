import TableFrame from '@/components/Table/TableFrame';
import SmallTableContentFrame, {
  HeaderColumn,
} from '@/components/SmallTable/SmallTableContentFrame';
import style from './adminSingleOrder.module.scss';
import SingleHopperCollapse from '../HopperAdministration/SingleHopperCollapse';
import { RootState } from '@/store';
import {
  actionClearSingleOrder,
  actionGetAdminSingleOrder,
} from '@/store/slices/orderAdministrationSlice/productsAdministrationSlice';
import { currencyFormat } from '@/utils/common';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import { CircularProgress, List, ListItem, ListItemIcon } from '@mui/material';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import MainBlock from './AdminSingleOrderRight/MainBlock';
import { DateTime } from 'luxon';
import SingleUserCollapse from '../SingleUserCollapse';
import { useAppDispatch } from '@/customHooks/storeHooks';
import { toFormat } from 'dinero.js';

import { currencyTransformer, Kobo } from '@/utils/dinero';

type PropsNamesHoppers =
  | 'hopper_profile.id'
  | 'accepted_at'
  | 'delivered_at'
  | 'received_at'
  | 'rejected_at'
  | 'rejected_reason'
  | 'hopper_profile.user.email'
  | 'hopper_profile.user.first_name'
  | 'hopper_profile.user.last_name'
  | 'hopper_profile.user.phone_number';

type PropsNamesPayment = 'id' | 'user_id' | 'type' | 'amount' | 'created_at';

const tableHeadColumnsHopper: HeaderColumn<PropsNamesHoppers>[] = [
  { name: '', isShow: true, paramName: null },
  { name: '#', isShow: true, paramName: 'hopper_profile.id' },
  {
    name: 'Accepted\u00A0at',
    isShow: true,
    paramName: 'accepted_at',
    stringify: value =>
      value ? DateTime.fromISO(value).toLocaleString(DateTime.DATETIME_SHORT) : '-',
  },

  {
    name: 'Received\u00A0at',
    isShow: true,
    paramName: 'received_at',
    stringify: value =>
      value ? DateTime.fromISO(value).toLocaleString(DateTime.DATETIME_SHORT) : '-',
  },
  {
    name: 'Delivered\u00A0at',
    isShow: true,
    paramName: 'delivered_at',
    stringify: value =>
      value ? DateTime.fromISO(value).toLocaleString(DateTime.DATETIME_SHORT) : '-',
  },
  {
    name: 'Rejected\u00A0at',
    isShow: true,
    paramName: 'rejected_at',
    stringify: value =>
      value ? DateTime.fromISO(value).toLocaleString(DateTime.DATETIME_SHORT) : '-',
  },
  {
    name: 'Rejected reason',
    isShow: true,
    paramName: 'rejected_reason',
  },
];

const tableHeadColumnsPayment: HeaderColumn<PropsNamesPayment>[] = [
  { name: '', isShow: false, paramName: null },
  { name: '#', isShow: true, paramName: 'id' },
  { name: 'User id', isShow: true, paramName: 'user_id' },
  {
    name: 'Type',
    isShow: true,
    paramName: 'type',
  },
  {
    name: 'Amount',
    isShow: true,
    paramName: 'amount',
    stringify: value => {
      {
        if (value) {
          return toFormat(Kobo(value), currencyTransformer);
        } else {
          return '-';
        }
      }
    },
  },

  {
    name: 'Created\u00A0at',
    isShow: true,
    paramName: 'created_at',
    stringify: value =>
      value ? DateTime.fromISO(value).toLocaleString(DateTime.DATETIME_SHORT) : '-',
  },
];

const AdminSingleOrder: React.FC = () => {
  const { id } = useParams();
  const dispatch = useAppDispatch();
  const loading = useSelector((state: RootState) => state.productsAdmin.isLoading);
  const singleOrder = useSelector((state: RootState) => state.productsAdmin.singleOrder);

  const tableBodyDataHopper = singleOrder?.hopper_metadata;
  const tableBodyDataPayment = singleOrder?.payment?.transactions;

  useEffect(() => {
    dispatch(actionGetAdminSingleOrder(id));
    return () => {
      dispatch(actionClearSingleOrder());
    };
  }, []);

  return (
    <>
      {loading && <CircularProgress />}
      {singleOrder && !loading ? (
        <div className={style.order_container}>
          <MainBlock />
          <div className={`custom_scrollbar ${style.cart_container}`}>
            {tableBodyDataHopper && tableBodyDataHopper.length > 0 && (
              <>
                <h3 className={style.block_title}>Hoppers metadata:</h3>
                <div className={style.table_container}>
                  <TableFrame isLoading={false}>
                    <SmallTableContentFrame
                      dataHead={tableHeadColumnsHopper}
                      dataBody={tableBodyDataHopper}
                      component={SingleHopperCollapse}
                    ></SmallTableContentFrame>
                  </TableFrame>
                </div>
              </>
            )}

            {tableBodyDataPayment && tableBodyDataPayment.length > 0 && (
              <>
                <h3 className={style.block_title}>Transactions:</h3>
                <div className={style.table_container}>
                  <TableFrame isLoading={false}>
                    <SmallTableContentFrame
                      dataHead={tableHeadColumnsPayment}
                      dataBody={tableBodyDataPayment}
                      //todo check collapse component
                      // component={SingleUserCollapse}
                    ></SmallTableContentFrame>
                  </TableFrame>
                </div>
              </>
            )}

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

export default AdminSingleOrder;
