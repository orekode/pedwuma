import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';

import Aos from 'aos';

import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Provider } from 'react-redux';
import { persistor, store } from "./config/store";

import { PersistGate } from 'redux-persist/integration/react';

import { Loading } from "components";

import './styles/index.css';
import 'aos/dist/aos.css';

Aos.init();

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Provider store={store}>
          <PersistGate loading={<Loading load={true} />} persistor={persistor}>
            <App />
          </PersistGate>
        </Provider>
      </BrowserRouter>
    </QueryClientProvider>
  </React.StrictMode>,
)
