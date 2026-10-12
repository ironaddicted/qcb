import {lazy, StrictMode, Suspense} from 'react';
import {createRoot, hydrateRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { initializeAnalytics } from './analytics';
import { captureLeadContext } from './leadContext';

initializeAnalytics();
captureLeadContext();

const CostEstimator = lazy(() => import('./CostEstimator'));

const content = (
  <StrictMode>
    {window.location.pathname.replace(/\/+$/, '') === '/cost-estimator' ? <Suspense fallback={<main className="max-w-7xl mx-auto px-4 py-24" role="status">Loading your backsplash cost estimator…</main>}><CostEstimator /></Suspense> : <App />}
  </StrictMode>
);
const root = document.getElementById('root')!;
if (root.hasChildNodes()) hydrateRoot(root, content);
else createRoot(root).render(content);
