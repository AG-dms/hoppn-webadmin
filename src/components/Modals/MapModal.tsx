import { Box, Button, IconButton, Link, Modal, TextField } from '@mui/material';
import React, { useEffect } from 'react';
import { Address, GoogleMap } from '@/api/dto/VendorResponseData';
import RenderMap from '@/scenes/VendorProfile/GoogleMaps/RenderMap';
import { useFormik } from 'formik';
import styles from '../../scenes/VendorProfile/vendorProfile.module.scss';
import InfoIcon from '@mui/icons-material/Info';
import { useStyles } from '@/styles/materialCustom';

type MapModalProps = {
  address: GoogleMap | Address;
  setAddress: React.Dispatch<React.SetStateAction<GoogleMap>>;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setCustomAddress: React.Dispatch<React.SetStateAction<string>>;
  setCustomAddress2: React.Dispatch<React.SetStateAction<string>>;
  customAddress2: string;
  setErrorText?: React.Dispatch<React.SetStateAction<string>>;
};

type MapErrorsType = {
  address_line_1: string;
  plus_code: string;
};

const style = {
  position: 'absolute' as const,
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 900,
  height: 520,
  display: 'flex',
  justifyContent: 'flex-start',
  bgcolor: 'background.paper',
  border: 'none',
  outline: 'none',
  boxShadow: 10,
  p: '15px',
  '@media(max-width: 1000px)': {
    width: 700,
  },
  '@media(max-width: 726px)': {
    width: 500,
  },
};

const MapModal: React.FC<MapModalProps> = ({
  open,
  setOpen,
  address,
  setAddress,
  setCustomAddress,
  setCustomAddress2,
  customAddress2,
}) => {
  const classes = useStyles();

  const mapFormik = useFormik({
    initialValues: {
      address_line_1: '',
      plus_code: '',
    },
    onSubmit: () => {
      setAddress(prev => ({ ...prev, address_line_1: mapFormik.values.address_line_1 }));
      setAddress(prev => ({ ...prev, plus_code: mapFormik.values.plus_code }));
      setCustomAddress(mapFormik.values.address_line_1);
      setOpen(false);
    },
    validate: values => {
      const errors = {} as MapErrorsType;
      if (values.address_line_1.length === 0 ?? mapFormik.touched.address_line_1) {
        errors.address_line_1 = 'Require';
      }
      if (values.plus_code.length <= 0) {
        errors.plus_code = 'Require';
      }

      return errors;
    },
  });

  const handleCancel = () => {
    if (address?.address_line_1) {
      mapFormik.setFieldValue('address_line_1', address?.address_line_1);
    } else {
      mapFormik.setFieldValue('address_line_1', '');
    }
    setOpen(false);
  };

  const handleClose = () => {
    if (address?.address_line_1 && !mapFormik.values.address_line_1) {
      mapFormik.setFieldValue('address_line_1', address?.address_line_1);
    }
    setOpen(false);
  };

  useEffect(() => {
    if (address?.address_line_1) {
      mapFormik.setFieldValue('address_line_1', address?.address_line_1, false);
    }
    if (address?.plus_code) {
      mapFormik.setFieldValue('plus_code', address?.plus_code, false);
    }
  }, [address]);

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box style={{ display: 'flex', flexDirection: 'column' }} sx={style}>
        <div style={{ display: 'flex', flex: 1 }}>
          <div
            className={styles.map_inputAndMap_container}
            style={{
              alignSelf: 'center',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <RenderMap address={address} setAddress={setAddress} />
          </div>
          <div className={styles.address_details_container}>
            <TextField
              variant="standard"
              label="Address line 1"
              id="address_line_1"
              name="address_line_1"
              value={mapFormik.values.address_line_1}
              onChange={mapFormik.handleChange}
              style={{ width: '100%' }}
              className={styles.map_input_detail}
              error={mapFormik.errors.address_line_1 ? true : false}
              helperText={mapFormik.errors.address_line_1}
            />
            <TextField
              variant="standard"
              label="Address line 2"
              id="address_line_2"
              name="address_line_2"
              value={customAddress2}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setCustomAddress2(e.currentTarget.value);
              }}
              style={{ width: '100%' }}
              className={styles.map_input_detail}
            />
            <TextField
              variant="standard"
              label="District"
              disabled
              value={address?.district ? address?.district : 'District'}
              style={{ width: '100%' }}
              className={styles.map_input_detail}
            />
            <TextField
              variant="standard"
              label="City"
              disabled
              value={address?.city ? address?.city : 'city'}
              style={{ width: '100%' }}
              className={styles.map_input_detail}
            />
            <TextField
              variant="standard"
              label="Country"
              disabled
              value={address?.country ? address?.country : 'Country'}
              style={{ width: '100%' }}
              className={styles.map_input_detail}
            />
            <TextField
              variant="standard"
              label="Post code"
              disabled
              value={address?.postcode ? address?.postcode : 'Post code'}
              style={{ width: '100%' }}
              className={styles.map_input_detail}
            />
            <div
              style={{
                display: 'flex',
                alignItems: 'baseline',
                justifyContent: 'space-between',
                flexGrow: 1,
              }}
            >
              <TextField
                variant="standard"
                label="Plus code"
                id="plus_code"
                name="plus_code"
                disabled
                error={mapFormik.errors.plus_code ? true : false}
                value={address?.plus_code ? address?.plus_code : 'Plus code'}
                style={{ width: '100%' }}
                className={styles.map_input_detail}
                helperText={mapFormik.errors.plus_code}
              />
              <Link target={'_blank'} href="https://maps.google.com/pluscodes/">
                <IconButton>
                  <InfoIcon />
                </IconButton>
              </Link>
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-evenly', marginTop: '15px' }}>
          <div style={{ width: 200 }} className={classes.button}>
            <Button onClick={handleCancel} className="btn btn-primary">
              Cancel
            </Button>
          </div>
          <div style={{ width: 200 }} className={classes.button}>
            <Button onClick={() => mapFormik.handleSubmit()} className="btn btn-primary">
              OK
            </Button>
          </div>
        </div>
      </Box>
    </Modal>
  );
};

export default MapModal;
