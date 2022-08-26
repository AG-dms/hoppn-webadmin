import { Button } from '@mui/material';
import React from 'react';
import { useNavigate } from 'react-router-dom';

const AccessDenid: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <h3>Sorry, you dont have access on this page</h3>
      <Button onClick={() => navigate('/')}>Go home</Button>
    </div>
  );
};

export default AccessDenid;
