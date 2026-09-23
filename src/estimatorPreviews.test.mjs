import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { PREVIEW_COLORS, PREVIEW_PATTERNS, previewImagePath } from './estimatorPreviews.ts';

test('every material, pattern, and color has its own saved preview', () => {
  const paths = new Set();
  for (const material of ['Ceramic', 'Glass', 'Zellige']) {
    for (const pattern of Object.keys(PREVIEW_PATTERNS)) {
      for (const color of PREVIEW_COLORS) {
        const image = previewImagePath(material, pattern, color.id);
        assert.ok(fs.existsSync(`public${image}`), `Missing preview: ${image}`);
        paths.add(image);
      }
    }
  }
  assert.equal(paths.size, 90);
});

test('unselected and other materials use the labeled ceramic reference', () => {
  assert.equal(previewImagePath('', '', ''), '/assets/estimator-previews/ceramic-running-bond-warm-white.webp');
  assert.equal(previewImagePath('Other', 'Herringbone', 'sage'), '/assets/estimator-previews/ceramic-herringbone-sage.webp');
});
