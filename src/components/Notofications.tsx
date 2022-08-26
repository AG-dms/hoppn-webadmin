import { isAxiosError } from '@utils/type-guards/isAxiosError';
import React, { ReactElement, ReactText } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const createError = (error: unknown, dispatch?: (action: any) => void): ReactText => {
  if (isAxiosError(error)) {
    if (error.response.data.message === 'Unauthorized') {
      // dispatch(actionSetUnauthorized());
    } else {
      if (error.response.data.message) {
        if (Array.isArray(error.response.data.message)) {
          return toast.error(error.response.data.message.join(','));
        }

        return toast.error(error.response.data.message);
      } else {
        return toast.error(error.message);
      }
    }
  } else if (error instanceof Error) {
    return toast.error(error.message);
  }

  return null;
};

export const createErrorThrottler = (error: unknown): ReactText => {
  if (isAxiosError(error)) {
    return toast.error(
      `Too many requests, please try again ${error.response.headers['retry-after']} seconds`,
    );
  }
};

export const createNotification = (
  type: 'info' | 'success' | 'error' | 'dark' | 'warning',
  text: string,
): ReactText => {
  if (type === 'info') {
    return toast.info(text, {});
  }
  if (type === 'success') {
    return toast.success(text);
  }
  if (type === 'warning') {
    return toast.warning(text);
  }
  if (type === 'dark') {
    return toast.dark(text);
  }
  return null;
};

const NotificationsHandler: React.FC = (): ReactElement => {
  return (
    <ToastContainer
      position="bottom-left"
      autoClose={4000}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
    />
  );
};

export default NotificationsHandler;
