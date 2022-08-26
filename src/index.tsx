import React from 'react';
import ReactDOM from 'react-dom';
import { store, persistor } from './store';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import App from './app/app';
import { InterceptorsProvider } from '@/api/interceptors';
import { PersistGate } from 'redux-persist/integration/react';
import { ErrorBoundary } from 'react-error-boundary';
import '@styles/style.scss';
import ErrorFallback from './scenes/ErrorBoundary/ErrorFallback';

ReactDOM.render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <InterceptorsProvider>
        <BrowserRouter>
          <ErrorBoundary FallbackComponent={ErrorFallback}>
            <App />
          </ErrorBoundary>
        </BrowserRouter>
      </InterceptorsProvider>
    </PersistGate>
  </Provider>,
  document.querySelector('#root'),
);
