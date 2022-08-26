import { downloadFile } from '@/api/vendorAPI';
import type { RootState } from '@/store';
import {
  actionAddFiles,
  actionClearInviteLink,
  actionDeleteFile,
  actionGetVendorCategories,
  actionGetVendorFiles,
  actionGetVendorProfile,
  actionInviteMember,
} from '@/store/slices/VendorProfile/vendorProfileSlice';
import { useStyles } from '@/styles/materialCustom';
import { Role } from '@/utils/enum/Role';
import { getResizedPhotoUrl } from '@/utils/get-resize-photo';
import AddIcon from '@mui/icons-material/Add';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import PhotoSizeSelectActualOutlinedIcon from '@mui/icons-material/PhotoSizeSelectActualOutlined';
import { Button, CircularProgress, IconButton } from '@mui/material';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import styles from '../Profile/Profile.module.scss';
import vendors from './vendorProfile.module.scss';
import { useAppDispatch } from '@/customHooks/storeHooks';

const VendorProfile: React.FC = () => {
  const isLoading = useSelector((state: RootState) => state.vendorProfile.isLoading);
  const dispatch = useAppDispatch();
  const classes = useStyles();
  const vendorProfile = useSelector((state: RootState) => state.vendorProfile.profile);
  const [copy, setCopy] = useState(false);
  const navigate = useNavigate();
  const roles = useSelector((state: RootState) => state.auth.user_roles);
  const inviteLink = useSelector((state: RootState) => state.vendorProfile.inviteLink);
  const fileLoader = useSelector((state: RootState) => state.vendorProfile.isLoadingFile);
  const inviteMember = (type: string) => {
    dispatch(actionInviteMember({ type: type }));
  };

  const deleteFile = (id: string) => {
    dispatch(actionDeleteFile(id));
  };

  const [loadLogo, setLoadLogo] = useState(false);

  useEffect(() => {
    dispatch(actionGetVendorProfile());
    dispatch(actionGetVendorCategories());
    if (roles.includes(Role.Vendor)) {
      dispatch(actionGetVendorFiles());
    }
  }, []);

  const [file, setFile] = useState<File>(null);

  const ref = useRef<any>();

  const photoUrl = useMemo(() => {
    return getResizedPhotoUrl({ source: vendorProfile.logo, size: 'md', isWebp: true });
  }, [vendorProfile?.logo]);

  const handleDeleteFile = () => {
    ref.current.value = '';
    setFile(null);
  };

  useEffect(() => {
    return () => {
      dispatch(actionClearInviteLink());
    };
  }, []);

  return (
    <>
      {isLoading && <CircularProgress />}
      {vendorProfile && !isLoading && !loadLogo && (
        <div className={styles.profile_container_vendor}>
          <div className={styles.user_info}>
            <div className={styles.avatar}>
              {!vendorProfile.logo && (
                <div style={{ cursor: 'pointer' }} className={styles.logo_container}>
                  <div>
                    <PhotoSizeSelectActualOutlinedIcon sx={{ fontSize: 200 }} />
                  </div>
                </div>
              )}
              {vendorProfile.logo && (
                <div className={styles.logo_container}>
                  <div>
                    <img src={photoUrl} alt="image" width="200" height="200" />
                  </div>
                </div>
              )}
            </div>
            <h1 className={styles.names}>{vendorProfile?.company_name}</h1>

            <div className={styles.users_data}>
              <ul className={styles.list}>
                <li className={styles.list_item}>
                  Category:{' '}
                  {vendorProfile && (
                    <span className={styles.list_item_span}>
                      {vendorProfile?.company_categories.map(item => {
                        return `${item.name} `;
                      })}
                    </span>
                  )}
                </li>
                <li className={styles.list_item}>
                  Bargaining:{' '}
                  <span className={styles.list_item_span}>
                    {vendorProfile?.is_bargaining ? 'Yes' : 'No'}
                  </span>
                </li>
                <li className={styles.list_item}>
                  Address 1:{' '}
                  <span className={styles.list_item_span}>
                    {vendorProfile?.address?.address_line_1}
                  </span>
                </li>
                <li className={styles.list_item}>
                  Address 2:{' '}
                  <span className={styles.list_item_span}>
                    {vendorProfile?.address?.address_line_2}
                  </span>
                </li>
                <li className={styles.list_item}>
                  Approval:{' '}
                  <span className={styles.list_item_span}>
                    {vendorProfile.is_approved ? 'Yes' : 'No'}
                  </span>
                </li>
              </ul>
              <div
                style={{ display: 'flex', flexDirection: 'column', marginBottom: 30 }}
                className={classes.button}
              >
                <Button
                  sx={{ marginBottom: '10px' }}
                  onClick={() =>
                    vendorProfile.is_approved
                      ? navigate('/vendor/edit_profile')
                      : navigate('/vendor/create_profile')
                  }
                >
                  Edit vendor profile
                </Button>
              </div>
              <span className={styles.list_item}>Documents:</span>
              {roles.includes(Role.Vendor) && (
                <>
                  <div className={`${vendors.documents_block} custom_scrollbar_small`}>
                    {fileLoader && <CircularProgress size={20} />}
                    {vendorProfile?.files &&
                      vendorProfile?.files.map(item => {
                        return (
                          <div
                            style={{ width: '100%', cursor: 'pointer' }}
                            key={item.id}
                            className={vendors.file_upload}
                            onClick={() => downloadFile(item.id)}
                          >
                            <AttachFileIcon fontSize="small" />
                            <span className={vendors.file_upload_name}>{item.original_name}</span>
                            <IconButton
                              onClick={e => {
                                e.stopPropagation();
                                deleteFile(item.id);
                              }}
                            >
                              <DeleteForeverIcon fontSize="small" />
                            </IconButton>
                          </div>
                        );
                      })}
                    {!vendorProfile?.files?.length && <span>No such documents</span>}
                  </div>
                  <span className={styles.list_item}>Add new documents:</span>
                  <div style={{ flexDirection: 'column' }} className={vendors.form_group}>
                    <div className={vendors.form_group_head}>
                      <span>Please download .zip file with all documents </span>
                      <label className={vendors.file_btn} htmlFor="file">
                        <AddIcon />
                        ADD FILE
                      </label>
                    </div>
                    {file ? (
                      <div className={vendors.file_upload}>
                        <AttachFileIcon fontSize="small" />
                        <span className={vendors.file_upload_name}>{file.name}</span>
                        <IconButton onClick={handleDeleteFile}>
                          <DeleteForeverIcon fontSize="small" />
                        </IconButton>
                      </div>
                    ) : null}
                    <input
                      id="file"
                      name="file"
                      type="file"
                      ref={ref}
                      onChange={event => {
                        setFile(event.currentTarget.files[0]);
                      }}
                      className="form-control"
                    />

                    <div className={classes.button_out}>
                      <Button
                        disabled={!file}
                        onClick={() => {
                          dispatch(actionAddFiles(file));
                          setFile(null);
                          ref.current.value = '';
                        }}
                        type="button"
                        className="btn btn-primary"
                      >
                        Upload file
                      </Button>
                    </div>
                  </div>
                </>
              )}

              <div className={vendors.btn_group}>
                {inviteLink && (
                  <div className={`${vendors.link_block} ${classes.button}`}>
                    <span className={vendors.inviteLink_title}>
                      Copy and send this link to new user:
                    </span>
                    <span className={vendors.inviteLink}>{inviteLink}</span>
                    <CopyToClipboard onCopy={() => setCopy(true)} text={inviteLink}>
                      <Button startIcon={<ContentCopyIcon />}>Copy link</Button>
                    </CopyToClipboard>
                    {copy && <span className={vendors.inviteLink_title}>Coped!</span>}
                  </div>
                )}
                {roles.includes(Role.Vendor) && (
                  <div
                    style={{ display: 'flex', flexDirection: 'column' }}
                    className={classes.button}
                  >
                    <Button sx={{ marginBottom: '10px' }} onClick={() => inviteMember('manager')}>
                      Invite manager
                    </Button>
                  </div>
                )}
                <div className={classes.button}>
                  <Button sx={{ marginBottom: '10px' }} onClick={() => inviteMember('picker')}>
                    Invite picker
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default VendorProfile;
