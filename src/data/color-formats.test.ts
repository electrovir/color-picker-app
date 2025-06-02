import {describe, itCases} from '@augment-vir/test';
import Color from 'colorjs.io';
import {createColorStrings} from './color-formats.js';

describe(createColorStrings.name, () => {
    itCases(createColorStrings, [
        {
            it: 'handles a purple color',
            input: new Color('#da9eff'),
            expect: {
                RGB: '218 158 255',
                Hex: '#da9eff',
                HSL: ' 277 100  81',
                HSV: ' 277  38 100',
                HWB: '277 62 0',
                LAB: '74 36 -40',
                LCH: '74 53 312',
                Oklab: '79% 0.1 -0.11',
                Oklch: '79% 0.15 312',
                Name: '                    ',
            },
        },
        {
            it: 'handles white',
            input: new Color('white'),
            expect: {
                RGB: '255 255 255',
                Hex: '#ffffff',
                HSL: 'none   0 100',
                HSV: 'none   0 100',
                HWB: 'none 100 0',
                LAB: '100 0 0',
                LCH: '100 0 none',
                Oklab: '100% 0 0',
                Oklch: '100% 0 none',
                Name: 'white               ',
            },
        },
        {
            it: 'handles black',
            input: new Color('black'),
            expect: {
                RGB: '  0   0   0',
                Hex: '#000000',
                HSL: 'none   0   0',
                HSV: 'none   0   0',
                HWB: 'none 0 100',
                LAB: '0 0 0',
                LCH: '0 0 none',
                Oklab: '0% 0 0',
                Oklch: '0% 0 none',
                Name: 'black               ',
            },
        },
    ]);
});
