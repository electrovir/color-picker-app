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
        Hex: [String(rgb.display({format: 'hex', collapse: false}))],
        RGB: [
            Math.round(rgb.r * 255),
            Math.round(rgb.g * 255),
            Math.round(rgb.b * 255),
        ],
        HSL: [
            /** Pad to 4 because `h` may be `'none'`. */
            wrapNaN(Math.round(hsl.h)),
            Math.round(hsl.s),
            Math.round(hsl.l),
        ],
        HSV: [
            /** Pad to 4 because `h` may be `'none'`. */
            wrapNaN(Math.round(hsv.h)),
            Math.round(hsv.s),
            Math.round(hsv.v),
        ],
        HWB: [
            wrapNaN(Math.round(hwb.h)),
            // 0 - 100
            Math.round(hwb.w),
            // 0 - 100
            Math.round(hwb.b),
        ],
        LAB: [
            // 0 - 100
            Math.round(lab.l),
            // -125 - 125
            Math.round(lab.a),
            // -125 - 125
            Math.round(lab.b),
        ],
        LCH: [
            // 0 - 100
            Math.round(lch.l),
            // 0 - ~230
            Math.round(lch.c),
            // 0 - 360
            wrapNaN(Math.round(lch.h)),
        ],
        Oklab: [
            wrapNaN(round(oklab.l * 100, {digits: 1}), (value) => `${value}%`),
            wrapNaN(round(oklab.a, {digits: 2})),
            wrapNaN(round(oklab.b, {digits: 2})),
        ],
        Oklch: [
            wrapNaN(round(oklch.l * 100, {digits: 1}), (value) => `${value}%`),
            wrapNaN(round(oklch.c, {digits: 2})),
            wrapNaN(round(oklch.h, {digits: 1})),
        ],
        Name: [colorNames.join(', ').padEnd(colorNameLength, ' ')],
    } satisfies Record<string, (string | number)[]>;

    return mapObjectValues(colorCoords, (key, values) => {
        const paddedValues =
            values.length <= 1
                ? values
                : values.map((value) => {
                      return String(value).padStart(6, ' ');
                  });

        return paddedValues.join(' ');
    }) satisfies Record<string, string>;
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
