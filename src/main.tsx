import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import CostEstimator from './CostEstimator';
import './index.css';
import { initializeAnalytics } from './analytics';

initializeAnalytics();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {window.location.pathname.replace(/\/+$/, '') === '/cost-estimator' ? <CostEstimator /> : <App />}
  </StrictMode>,
);
