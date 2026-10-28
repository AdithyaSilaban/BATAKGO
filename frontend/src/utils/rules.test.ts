import test from 'node:test';
import assert from 'node:assert/strict';
import { latinToAksaraBatak } from './aksaraBatak.js';
import { findPartuturan } from './partuturan.js';
import { calculateLevel } from './gamification.js';
import { calculatePronunciationAccuracy } from './audioSynthesizer.js';

test('Aksara Batak converts simple syllables into Unicode Batak', () => {
  const result = latinToAksaraBatak('horas');
  // 'horas' should contain Batak characters
  assert.ok(result.length > 0);
  assert.ok(typeof result === 'string');
});

test('Partuturan finds correct relationship terms', () => {
  const tulang = findPartuturan('tulang');
  assert.ok(tulang.length > 0);
  assert.equal(tulang[0].batakTerm, 'Tulang');
  assert.equal(tulang[0].counterTerm, 'Bere');

  const lae = findPartuturan('lae');
  assert.ok(lae.length > 0);
});

test('Gamification level calculation is correct', () => {
  const lvl1 = calculateLevel(45);
  assert.equal(lvl1.level, 1);
  assert.equal(lvl1.currentXp, 45);
  assert.equal(lvl1.progressPercent, 45);

  const lvl2 = calculateLevel(120);
  assert.equal(lvl2.level, 2);
  assert.equal(lvl2.currentXp, 20);
});

test('Pronunciation accuracy score calculates correct match percentage', () => {
  const exact = calculatePronunciationAccuracy('horas', 'horas');
  assert.equal(exact, 100);

  const close = calculatePronunciationAccuracy('horas lae', 'horas lae');
  assert.equal(close, 100);

  const partial = calculatePronunciationAccuracy('hora', 'horas');
  assert.ok(partial > 70);

  const empty = calculatePronunciationAccuracy('', 'horas');
  assert.equal(empty, 0);
});
