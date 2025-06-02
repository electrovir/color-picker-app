import {describe, itCases} from '@augment-vir/test';
import Color from 'colorjs.io';
import {createColorStrings} from './color-formats.js';

describe(createColorStrings.name, () => {
    itCases(createColorStrings, [
        {
            it: 'handles a purple color',
            input: new Color('#da9eff'),
            expect: {
                Hex: '#da9eff',
                RGB: '   218    158    255',
                HSL: '   277    100     81',
                HSV: '   277     38    100',
                HWB: '   277     62      0',
                LAB: '    74     36    -40',
                LCH: '    74     53    312',
                Oklab: ' 79.1%    0.1  -0.11',
                Oklch: ' 79.1%   0.15  311.8',
                Name: '                    ',
            },
        },
        {
            it: 'handles white',
            input: new Color('white'),
            expect: {
                Hex: '#ffffff',
                RGB: '   255    255    255',
                HSL: '  none      0    100',
                HSV: '  none      0    100',
                HWB: '  none    100      0',
                LAB: '   100      0      0',
                LCH: '   100      0   none',
                Oklab: '  100%      0      0',
                Oklch: '  100%      0   none',
                Name: 'white               ',
            },
        },
        {
            it: 'handles black',
            input: new Color('black'),
            expect: {
                Hex: '#000000',
                RGB: '     0      0      0',
                HSL: '  none      0      0',
                HSV: '  none      0      0',
                HWB: '  none      0    100',
                LAB: '     0      0      0',
                LCH: '     0      0   none',
                Oklab: '    0%      0      0',
                Oklch: '    0%      0   none',
                Name: 'black               ',
            },
        },
    ]);
});
