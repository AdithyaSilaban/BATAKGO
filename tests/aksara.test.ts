import { describe, it } from 'node:test';
import assert from 'node:assert';
import { latinToAksaraBatak, INA_NI_SURAT, ANAK_NI_SURAT } from '../src/utils/aksaraBatak';
import { UNITS } from '../src/utils/batakData';

describe('Aksara Batak Unicode Transliteration Tests', () => {
  it('correctly maps Horas into authentic Batak Unicode (ᯂᯬᯒᯘ᯳)', () => {
    const result = latinToAksaraBatak('horas');
    // Ho: ha (ᯂ U+1BC2) + o (ᯬ U+1BEC)
    // ra: ra (ᯒ U+1BD2)
    // s: sa (ᯘ U+1BD8) + pangolat (᯳ U+1BF3)
    const expected = '\u1BC2\u1BEC\u1BD2\u1BD8\u1BF3';
    assert.strictEqual(result, expected);
  });

  it('correctly maps Batak into authentic Batak Unicode (ᯅᯖᯂ᯳)', () => {
    const result = latinToAksaraBatak('batak');
    // ba: ba (ᯅ U+1BC5)
    // ta: ta (ᯖ U+1BD6)
    // k: ka (ᯂ U+1BC2) + pangolat (᯳ U+1BF3)
    const expected = '\u1BC5\u1BD6\u1BC2\u1BF3';
    assert.strictEqual(result, expected);
  });

  it('correctly maps Toba into authentic Batak Unicode (ᯖᯬᯅ)', () => {
    const result = latinToAksaraBatak('toba');
    // to: ta (ᯖ U+1BD6) + o (ᯬ U+1BEC)
    // ba: ba (ᯅ U+1BC5)
    const expected = '\u1BD6\u1BEC\u1BC5';
    assert.strictEqual(result, expected);
  });

  it('correctly handles punctuation with Bindu symbols', () => {
    const result = latinToAksaraBatak('horas.');
    assert.ok(result.includes(ANAK_NI_SURAT.binduGodang));
  });
});

describe('Curriculum Data Integrity Tests', () => {
  it('all units have canonical kebab-case IDs (unit-X)', () => {
    UNITS.forEach(unit => {
      assert.match(unit.id, /^unit-\d+$/);
    });
  });

  it('all lessons have canonical kebab-case IDs (uX-lY)', () => {
    UNITS.forEach(unit => {
      unit.lessons.forEach(lesson => {
        assert.match(lesson.id, /^u\d+-l\d+$/);
        assert.strictEqual(lesson.unitId, unit.id);
        assert.ok(lesson.xpReward > 0, 'Lesson must have positive XP reward');
        assert.ok(lesson.questions.length > 0, 'Lesson must have questions');
      });
    });
  });
});
