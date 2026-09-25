export type EstimatorSnapshot = {
  step: number; demolition: boolean | null; pattern: string; material: string;
  color: string; method: string; area: number | null;
};
type Params = Record<string, string | number | boolean>;
const names = ['preparation', 'pattern', 'material', 'measurements', 'results'];

// Explicit allowlist: never pass form values or the quote payload to analytics.
export function estimatorParameters(s: EstimatorSnapshot): Params {
  return {
    form_id: 'cost_estimator', step_number: s.step + 1, step_name: names[s.step],
    tile_pattern: s.pattern || 'not_selected', tile_material: s.material || 'not_selected',
    tile_color: s.color, measurement_method: s.method,
    removal_needed: s.demolition === null ? 'not_selected' : s.demolition ? 'yes' : 'no',
    area_band: s.area === null ? 'not_entered' : s.area < 20 ? 'under_20' : s.area < 40 ? '20_to_39' : s.area < 60 ? '40_to_59' : '60_plus',
  };
}

export function createEstimatorTracker(send: (name: string, params: Params) => void, now = () => Date.now()) {
  let snapshot: EstimatorSnapshot | undefined;
  let started = false, submitted = false, exited = false;
  let activeSince = now(), activeMs = 0, visible = true;
  const duration = () => Math.max(0, Math.round((activeMs + (visible ? now() - activeSince : 0)) / 1000));
  const emit = (name: string, extra: Params = {}) => { if (snapshot) send(name, { ...estimatorParameters(snapshot), ...extra }); };
  return {
    update(next: EstimatorSnapshot) {
      const previous = snapshot;
      snapshot = next;
      if (!previous) {
        emit('estimator_open'); emit('estimator_step_view'); return;
      }
      if (previous.step !== next.step) {
        send(next.step > previous.step ? 'estimator_step_complete' : 'estimator_back', {
          ...estimatorParameters(previous), step_duration_seconds: duration(), destination_step: names[next.step],
        });
        activeMs = 0; activeSince = now();
        emit('estimator_step_view');
        if (next.step === 4) emit('estimator_result_view');
      }
      const fields = ['demolition', 'pattern', 'material', 'color', 'method'] as const;
      for (const field of fields) {
        if (previous[field] === next[field]) continue;
        if (!started) { started = true; emit('estimator_start'); }
        emit('estimator_selection', { selection_type: field, selection_value: String(next[field]) });
      }
    },
    visibility(isVisible: boolean) {
      if (visible === isVisible) return;
      if (visible) activeMs += now() - activeSince;
      visible = isVisible; activeSince = now();
    },
    quote(action: 'start' | 'validation_error' | 'attempt' | 'error' | 'success' | 'view') {
      if (action === 'success') submitted = true;
      emit(`estimator_quote_${action}`);
    },
    exit() {
      if (exited || !snapshot) return;
      exited = true;
      emit('estimator_exit', { quote_submitted: submitted, estimator_started: started, step_duration_seconds: duration(), transport_type: 'beacon' });
    },
    resume() { exited = false; activeSince = now(); },
  };
}
