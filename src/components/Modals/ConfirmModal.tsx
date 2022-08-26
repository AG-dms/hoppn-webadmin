import { useStyles } from '@/styles/materialCustom';
import { Box, Button, Modal, Typography } from '@mui/material';
import React from 'react';

type Props = {
  open: boolean;
  title: string;
  message: string;
  handleClose: () => void;
  confirmHandler: () => void;
  cancelHandler: () => void;
};

const style = {
  position: 'absolute' as const,
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  // border: '2px solid #000',
  boxShadow: 10,
  p: 4,
};

const ConfirmModal: React.FC<Props> = ({
  open,
  handleClose,
  cancelHandler,
  confirmHandler,
  title,
  message,
}) => {
  const classes = useStyles();
  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        <Typography id="modal-modal-title" variant="h6" component="h2">
          {title}
        </Typography>
        <Typography id="modal-modal-description" sx={{ mt: 2 }}>
          {message}
        </Typography>
        <div className={classes.button_out}>
          <Button
            sx={{
              margin: '10px',
              width: '200px',
              flex: 0.5,
            }}
            onClick={confirmHandler}
          >
            Yes
          </Button>
          <Button
            sx={{
              margin: '10px',
              width: '200px',
              flex: 0.5,
            }}
            onClick={cancelHandler}
          >
            No
          </Button>
        </div>
      </Box>
    </Modal>
  );
};

export default ConfirmModal;
