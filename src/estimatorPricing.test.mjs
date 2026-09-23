import assert from 'node:assert/strict';
import { test } from 'node:test';
import { calculateEstimate, calculateMaterials } from './estimatorPricing.ts';

test('glass example includes materials once, without changing labor minimums', () => {
  const estimate = calculateEstimate(15.8, 'Running bond', 'Glass', true);
  assert.equal(estimate.materials.tileArea, 17.38);
  assert.equal(estimate.materials.tile, 312.84);
  assert.equal(estimate.materials.setting, 45);
  assert.equal(estimate.materials.protection, 50);
  assert.equal(estimate.materials.electrical, 18);
  assert.equal(estimate.materials.total, 425.84);
  assert.equal(estimate.projectTotal, 1625.84);
  assert.equal(estimate.total, 1200);
});

test('tile and pattern selections adjust materials allowance', () => {
  const ceramic = calculateMaterials(40, 'Running bond', 'Ceramic');
  const glass = calculateMaterials(40, 'Running bond', 'Glass');
  const zellige = calculateMaterials(40, 'Running bond', 'Zellige');
  assert.ok(ceramic.total < glass.total && glass.total < zellige.total);
  assert.equal(calculateMaterials(40, 'Herringbone', 'Zellige').tileArea, 50);
  assert.ok(calculateMaterials(40, 'Herringbone', 'Ceramic').total > ceramic.total);
});

test('supplies round up to whole packs and unknown selections stay quote-only', () => {
  assert.equal(calculateMaterials(25, 'Running bond', 'Ceramic').setting, 35);
  assert.equal(calculateMaterials(25.1, 'Running bond', 'Ceramic').setting, 70);
  assert.equal(calculateMaterials(20, 'Running bond', 'Other'), null);
  assert.equal(calculateEstimate(20, 'Running bond', 'Other', true).projectTotal, null);
  assert.throws(() => calculateMaterials(0, 'Running bond', 'Ceramic'));
});

test('small glass project totals $1,200 with demolition and drywall', () => {
  const estimate = calculateEstimate(15.8, 'Running bond', 'Glass', true);
  assert.equal(estimate.installation, 850);
  assert.equal(estimate.preparation, 350);
  assert.equal(estimate.total, 1200);
});

test('each material minimum applies across simple layouts', () => {
  for (const [material, minimum] of [['Ceramic', 700], ['Glass', 850], ['Zellige', 1000]]) {
    for (const pattern of ['Running bond', 'Stacked horizontal', 'Stacked vertical', 'Stacked offset']) {
      assert.equal(calculateEstimate(10, pattern, material, false).total, minimum);
    }
    assert.equal(calculateEstimate(10, 'Herringbone', material, false).total, minimum * 1.35);
  }
});

test('large projects use area rates without adding minimums', () => {
  const estimate = calculateEstimate(100, 'Herringbone', 'Glass', true);
  assert.equal(estimate.installation, 4650);
  assert.equal(estimate.preparation, 1100);
  assert.equal(estimate.total, 5750);
});

test('no demolition means no preparation minimum', () => {
  assert.equal(calculateEstimate(15.8, 'Running bond', 'Glass', false).preparation, 0);
});

test('unknown material stays quote-only with a known preparation subtotal', () => {
  const estimate = calculateEstimate(15.8, 'Running bond', 'Other', true);
  assert.equal(estimate.installation, null);
  assert.equal(estimate.total, null);
  assert.equal(estimate.preparation, 350);
});

test('invalid area is rejected', () => {
  for (const area of [0, -1, NaN, Infinity]) {
    assert.throws(() => calculateEstimate(area, 'Running bond', 'Glass', true));
  }
});
