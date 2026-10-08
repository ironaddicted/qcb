import {lazy, StrictMode, Suspense} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { initializeAnalytics } from './analytics';

initializeAnalytics();

const CostEstimator = lazy(() => import('./CostEstimator'));

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {window.location.pathname.replace(/\/+$/, '') === '/cost-estimator' ? <Suspense fallback={<main className="max-w-7xl mx-auto px-4 py-24" role="status">Loading your backsplash cost estimator…</main>}><CostEstimator /></Suspense> : <App />}
  </StrictMode>,
);
