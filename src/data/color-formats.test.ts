import {describe, snapshotCases} from '@augment-vir/test';
import Color from 'colorjs.io';
import {createColorStrings} from './color-formats.js';

describe(createColorStrings.name, () => {
    snapshotCases(createColorStrings, [
        {
            it: 'handles a purple color',
            input: new Color('#da9eff'),
        },
        {
            it: 'handles white',
            input: new Color('white'),
        },
        {
            it: 'handles black',
            input: new Color('black'),
        },
    ]);
});
