import fs from 'node:fs';
import vm from 'node:vm';
import { describe, expect, it } from 'vitest';
import { LEGACY_SCRIPTS } from '../legacyScripts.js';

const readScript = (name) => fs.readFileSync(new URL(`../../${name}`, import.meta.url), 'utf8');

describe('legacy scripts', () => {
  it.each(LEGACY_SCRIPTS)('%s exists and parses as a classic (non-module) script', (name) => {
    expect(() => new vm.Script(readScript(name), { filename: name })).not.toThrow();
  });

  it('linearAlgebra vectorSpace returns a basis of the span', () => {
    const context = vm.createContext({});
    vm.runInContext(readScript('linearAlgebra.js'), context);
    const basis = vm.runInContext('vectorSpace([[1, 0, 0], [2, 0, 0], [0, 1, 0]])', context);
    expect(JSON.parse(JSON.stringify(basis))).toEqual([[1, 0, 0], [0, 1, 0]]);
  });
});
