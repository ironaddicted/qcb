import { StrictMode, Suspense } from 'react';
import { renderToString } from 'react-dom/server';
import App from './App';
import CostEstimator from './CostEstimator';

export function render(path: string) {
  return renderToString(<StrictMode>{path === '/cost-estimator/'
    ? <Suspense><CostEstimator /></Suspense> : <App />}</StrictMode>);
}
