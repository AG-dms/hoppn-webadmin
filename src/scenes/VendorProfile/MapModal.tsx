import { useStyles } from '@/styles/materialCustom';
import { Box, TextField } from '@mui/material';
import React, { Dispatch, SetStateAction } from 'react';
import { GoogleMap } from '@/api/dto/VendorResponseData';

import RenderMap from './GoogleMaps/RenderMap';
import styles from './vendorProfile.module.scss';

interface Props {
  setAddress: Dispatch<SetStateAction<GoogleMap>>;
  address: GoogleMap;
}

const style = {
  position: 'absolute' as const,
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 500,
  height: 400,
  bgcolor: 'background.paper',
  // border: '2px solid #000',
  boxShadow: 10,
  p: '15px',
};

const MapModal: React.FC<Props> = ({ setAddress, address }) => {
  const classes = useStyles();
  return (
    <Box style={{ display: 'flex', flexDirection: 'column' }} sx={style}>
      <div className={styles.input_container}>
        <TextField
          id="address"
          label="Address"
          type="text"
          // helperText={formik.errors.address_line_2}
          className={classes.narrowFormInput}
        />
      </div>
      <div style={{ width: '100%', height: 350, alignSelf: 'center' }}>
        <RenderMap address={address} setAddress={setAddress} />
      </div>
    </Box>
  );
};

export default MapModal;
