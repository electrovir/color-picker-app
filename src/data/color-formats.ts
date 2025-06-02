import {check} from '@augment-vir/assert';
import {filterMap, getObjectTypedEntries, mapObjectValues, round} from '@augment-vir/common';
import colorNames from 'color-name';
import type Color from 'colorjs.io';
import {colorNameLength} from './color-name-length.js';

function wrapNaN(value: number, callbackIfNumber?: (value: number) => string | number) {
    if (isNaN(value)) {
        return 'none';
    } else if (callbackIfNumber) {
        return callbackIfNumber(value);
    } else {
        return value;
    }
}

export function createColorStrings(color: Color) {
    const rgb = color.to('srgb');
    const hsl = color.to('hsl');
    const hwb = color.to('hwb');
    const lab = color.to('lab');
    const lch = color.to('lch');
    const hsv = color.to('hsv');
    const oklab = color.to('oklab');
    const oklch = color.to('oklch');

    const colorNames = findMatchingColorNames([
        Math.round(rgb.r * 255),
        Math.round(rgb.g * 255),
        Math.round(rgb.b * 255),
    ]);

    const colorCoords = {
        RGB: [
            String(Math.round(rgb.r * 255)).padStart(3, ' '),
            String(Math.round(rgb.g * 255)).padStart(3, ' '),
            String(Math.round(rgb.b * 255)).padStart(3, ' '),
        ],
        Hex: [String(color.display({format: 'hex', collapse: false}))],
        HSL: [
            /** Pad to 4 because `h` may be `'none'`. */
            String(wrapNaN(Math.round(hsl.h))).padStart(4, ' '),
            String(Math.round(hsl.s)).padStart(3, ' '),
            String(Math.round(hsl.l)).padStart(3, ' '),
        ],
        HSV: [
            /** Pad to 4 because `h` may be `'none'`. */
            String(wrapNaN(Math.round(hsv.h))).padStart(4, ' '),
            String(Math.round(hsv.s)).padStart(3, ' '),
            String(Math.round(hsv.v)).padStart(3, ' '),
        ],
        HWB: [
            wrapNaN(Math.round(hwb.h)),
            Math.round(hwb.w),
            Math.round(hwb.b),
        ],
        LAB: [
            Math.round(lab.l),
            Math.round(lab.a),
            Math.round(lab.b),
        ],
        LCH: [
            Math.round(lch.l),
            Math.round(lch.c),
            wrapNaN(Math.round(lch.h)),
        ],
        Oklab: [
            wrapNaN(Math.round(oklab.l * 100), (value) => `${value}%`),
            wrapNaN(round(oklab.a, {digits: 2})),
            wrapNaN(round(oklab.b, {digits: 2})),
        ],
        Oklch: [
            wrapNaN(Math.round(oklch.l * 100), (value) => `${value}%`),
            wrapNaN(round(oklch.c, {digits: 2})),
            wrapNaN(Math.round(oklch.h)),
        ],
        Name: [colorNames.join(', ').padEnd(colorNameLength, ' ')],
    } satisfies Record<string, (string | number)[]>;

    return mapObjectValues(colorCoords, (key, value) => value.join(' ')) satisfies Record<
        string,
        string
    >;
}

export function findMatchingColorNames(rgb: [r: number, g: number, b: number]): string[] {
    return filterMap(
        getObjectTypedEntries(colorNames),
        ([
            colorName,
        ]) => {
            return colorName;
        },
        (
            colorName,
            [
                ,
                colorValues,
            ],
        ) => {
            return check.deepEquals(colorValues, rgb);
        },
    );
}
