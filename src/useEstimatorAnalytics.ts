import { useEffect, useRef } from 'react';
import { trackEvent } from './analytics';
import { createEstimatorTracker, type EstimatorSnapshot } from './estimatorAnalytics';

export function useEstimatorAnalytics(snapshot: EstimatorSnapshot) {
  const tracker = useRef<ReturnType<typeof createEstimatorTracker> | null>(null);
  if (!tracker.current) tracker.current = createEstimatorTracker(trackEvent);
  useEffect(() => { tracker.current!.update(snapshot); }, [snapshot.step, snapshot.demolition, snapshot.pattern, snapshot.material, snapshot.color, snapshot.method, snapshot.area]);
  useEffect(() => {
    const visibility = () => tracker.current!.visibility(document.visibilityState === 'visible');
    const exit = () => tracker.current!.exit();
    const resume = () => { tracker.current!.resume(); visibility(); };
    visibility();
    document.addEventListener('visibilitychange', visibility);
    window.addEventListener('pagehide', exit);
    window.addEventListener('pageshow', resume);
    return () => {
      document.removeEventListener('visibilitychange', visibility);
      window.removeEventListener('pagehide', exit);
      window.removeEventListener('pageshow', resume);
    };
  }, []);
  return tracker.current;
}
