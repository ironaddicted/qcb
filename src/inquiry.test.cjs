const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const ts = require('typescript');
const context = { exports: {} };
vm.runInNewContext(ts.transpileModule(fs.readFileSync(__dirname + '/inquiry.ts', 'utf8'), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
}).outputText, context);
const { validateInquiry, submitInquiry } = context.exports;
const data = { name: ' Test Visitor ', phone: '+1 (704) 555-0123', zip: '28202', email: '' };
const covered = zip => zip === '28202';

test('contact-only inquiry accepts blank email and no measurements', () => {
  assert.equal(Object.keys(validateInquiry(data, covered)).length, 0);
});
test('invalid contact fields and non-covered ZIP block submission', () => {
  const errors = validateInquiry({ name: '', phone: '123', zip: '99999', email: 'invalid' }, covered);
  assert.deepEqual(Object.keys(errors).sort(), ['email', 'name', 'phone', 'zip']);
});
test('optional email is validated when supplied', () => {
  assert.equal(Object.keys(validateInquiry({ ...data, email: ' person@example.com ' }, covered)).length, 0);
});
test('sends trimmed contact fields without invented project selections', async () => {
  let payload;
  await submitInquiry(data, async (url, options) => {
    assert.equal(options.mode, 'cors');
    assert.equal(options.method, 'POST');
    payload = JSON.parse(options.body);
    return { ok: true, status: 200 };
  });
  assert.deepEqual(payload, { source: 'qcb', name: 'Test Visitor', phone: data.phone, zip: '28202', email: '' });
});
test('HTTP errors, opaque responses, and network errors never resolve as success', async () => {
  for (const response of [{ ok: false, status: 500 }, { ok: false, status: 400 }, { ok: false, status: 0 }]) {
    await assert.rejects(submitInquiry(data, async () => response));
  }
  await assert.rejects(submitInquiry(data, async () => { throw Error('Network failed'); }));
});

test('configured quotes send contact fields and the complete builder details to the existing Lambda', async () => {
  const configuration = {
    version: 1, demolition: true, pattern: 'Running bond', material: 'Glass',
    color: 'sage', colorLabel: 'Sage', previewImage: '/assets/estimator-previews/glass-running-bond-sage.webp',
    measurement: { method: 'cabinets', areaSqFt: 26 * 19 * 4 / 144, lengthFeet: null, cabinetCount: 4, assumedCabinetWidthInches: 26, assumedHeightInches: 19 },
    pricing: { currency: 'USD', installationLabor: 850, demolitionAndDrywallLabor: 350, totalLabor: 1200, materialsAllowance: 400, planningTotal: 1600, materialsAllowanceIsEstimate: true },
  };
  let payload;
  await submitInquiry(data, async (url, options) => {
    assert.equal(url, context.exports.INQUIRY_ENDPOINT);
    assert.equal(options.headers['Content-Type'], 'text/plain');
    payload = JSON.parse(options.body);
    return { ok: true, status: 200 };
  }, configuration);
  assert.equal(payload.source, 'qcb');
  assert.equal(payload.name, 'Test Visitor');
  assert.equal(payload.inquiryType, 'cost_estimator');
  assert.deepEqual(payload.backsplash, configuration);
});

test('quote-only material prices are sent as null rather than zero', async () => {
  const configuration = { pricing: { installationLabor: null, materialsAllowance: null, planningTotal: null } };
  await submitInquiry(data, async (_url, options) => {
    assert.equal(JSON.parse(options.body).backsplash.pricing.planningTotal, null);
    return { ok: true };
  }, configuration);
});
