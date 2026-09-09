const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const ts = require('typescript');

function setup(id = 'G-TEST123') {
  const events = [], timers = new Map(), intersections = [], mutations = [], listeners = {};
  let nextTimer = 0;
  const document = { visibilityState: 'visible',
    addEventListener: (name, fn) => { listeners[name] = fn; },
    removeEventListener: () => {},
  };
  const window = { innerHeight: 800, innerWidth: 400,
    gtag: (...args) => events.push(args), addEventListener: () => {}, removeEventListener: () => {},
  };
  const context = { exports: {}, window, document,
    setTimeout: fn => { timers.set(++nextTimer, fn); return nextTimer; },
    clearTimeout: key => timers.delete(key),
    IntersectionObserver: class {
      constructor(fn) { this.fn = fn; intersections.push(fn); }
      observe() {} disconnect() {}
    },
    MutationObserver: class {
      constructor(fn) { mutations.push(fn); } observe() {} disconnect() {}
    },
  };
  const source = fs.readFileSync(__dirname + '/analytics.ts', 'utf8');
  const compiled = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  }).outputText.replace('import.meta', JSON.stringify({ env: { VITE_GA4_MEASUREMENT_ID: id } }));
  vm.runInNewContext(compiled, context);
  const flush = () => { const pending = [...timers.values()]; timers.clear(); pending.forEach(fn => fn()); };
  const element = (dataset, top = 80) => ({ dataset, top,
    getBoundingClientRect() { return { top: this.top, bottom: this.top + 1000, height: 1000, left: 0, right: 400 }; },
  });
  const elements = [];
  const root = { contains: el => elements.includes(el), querySelectorAll: () => elements };
  return { api: context.exports, events, flush, element, elements, root, intersections, mutations, document, listeners, window };
}

test('routes only to configured GA4 and tolerates unavailable analytics', () => {
  const s = setup();
  s.api.initializeAnalytics();
  s.api.trackEvent('section_view', { section_name: 'introduction' });
  assert.equal(s.events[0][1], 'G-TEST123');
  assert.equal(s.events[1][2].send_to, 'G-TEST123');
  s.window.gtag = () => { throw Error('blocked'); };
  assert.doesNotThrow(() => s.api.trackEvent('generate_lead'));
  const disabled = setup('');
  disabled.api.initializeAnalytics(); disabled.api.trackEvent('section_view');
  assert.equal(disabled.events.length, 0);
});

test('offscreen form is not counted; visible section counts once', () => {
  const s = setup();
  s.elements.push(s.element({ analyticsSection: 'introduction' }), s.element({ analyticsStep: '0' }, 1500));
  const cleanup = s.api.observeJourney(s.root);
  assert.equal(s.events.length, 0);
  s.flush();
  assert.equal(s.events.length, 1);
  assert.equal(s.events[0][2].section_name, 'introduction');
  s.intersections.forEach(fn => fn()); s.flush();
  assert.equal(s.events.length, 1);
  cleanup();
});

test('brief exposure and hidden tabs do not qualify', () => {
  const s = setup();
  const el = s.element({ analyticsStep: '0' }); s.elements.push(el);
  s.api.observeJourney(s.root);
  el.top = 1500; s.intersections[0](); s.flush();
  assert.equal(s.events.length, 0);
  el.top = 80; s.intersections[0]();
  s.document.visibilityState = 'hidden'; s.listeners.visibilitychange(); s.flush();
  assert.equal(s.events.length, 0);
  s.document.visibilityState = 'visible'; s.listeners.visibilitychange(); s.flush();
  assert.equal(s.events[0][2].step_name, 'project_dimensions');
});

test('actual mounted steps preserve skipped steps and backtracking', () => {
  const s = setup();
  s.elements.push(s.element({ analyticsStep: '2' })); s.api.observeJourney(s.root); s.flush();
  for (const step of ['4', '2']) {
    s.elements.splice(0, 1, s.element({ analyticsStep: step }));
    s.mutations[0](); s.flush();
  }
  assert.deepEqual(s.events.map(event => event[2].step_number), [3, 5, 3]);
});

test('effect cleanup cancels pending views', () => {
  const s = setup(); s.elements.push(s.element({ analyticsSection: 'process' }));
  s.api.observeJourney(s.root)(); s.flush(); assert.equal(s.events.length, 0);
});

test('short inquiry uses its own version and screen name', () => {
  const s = setup();
  s.elements.push(s.element({ analyticsInquiry: 'true' }));
  s.api.observeJourney(s.root); s.flush();
  assert.equal(s.events[0][1], 'estimate_step_view');
  assert.equal(s.events[0][2].step_name, 'quick_inquiry');
  assert.equal(s.events[0][2].form_version, 'short_inquiry');
  assert.equal(s.events[0][2].step_number, 1);
});
