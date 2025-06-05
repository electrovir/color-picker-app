import {check} from '@augment-vir/assert';
import {
    type AnyObject,
    filterMap,
    getObjectTypedEntries,
    mapObjectValues,
    type PartialWithUndefined,
    round,
    typedObjectFromEntries,
    type UnionToIntersection,
    type Values,
} from '@augment-vir/common';
import colorNames from 'color-name';
import type Color from 'colorjs.io';
import {colorNameLength} from './color-name-length.js';

function wrapNaN(value: number): number | string {
    if (isNaN(value)) {
        return 'none';
    } else {
        return value;
    }
}

export type ColorFormatDefinition = {
    coords: Record<
        string,
        {
            min: number;
            max: number;
        } & PartialWithUndefined<{
            canBeNone?: boolean | undefined;
            /**
             * The number of digits to round this coordinate to.
             *
             * @default 0
             */
            digits?: number | undefined;
            /**
             * A factor to multiple the values in the `Color` class by.
             *
             * @default 1
             */
            factor?: number | undefined;
        }>
    >;
    /** If the format's name isn't exactly the input for `Color.to()`, then specify it here. */
    convertTo?: string | undefined;
};

type BaseColorFormatDefinitions = {
    [ColorSpaceName in string]: {[CoordFormatName in string]: ColorFormatDefinition};
};

export const colorFormats = (<const Definitions extends BaseColorFormatDefinitions>(
    input: Definitions,
): Readonly<{
    [ColorSpaceName in keyof Definitions]: {
        [ColorFormatName in keyof Definitions[ColorSpaceName]]: ColorFormatDefinition;
    };
}> => {
    return input;
})({
    srgb: {
        RGB: {
            coords: {
                r: {
                    min: 0,
                    max: 255,
                    factor: 255,
                },
                g: {
                    min: 0,
                    max: 255,
                    factor: 255,
                },
                b: {
                    min: 0,
                    max: 255,
                    factor: 255,
                },
            },
            convertTo: 'srgb',
        },
        HSL: {
            coords: {
                h: {
                    min: 0,
                    max: 360,
                    canBeNone: true,
                },
                s: {
                    min: 0,
                    max: 100,
                },
                l: {
                    min: 0,
                    max: 100,
                },
            },
        },
        HSV: {
            coords: {
                h: {
                    min: 0,
                    max: 360,
                    canBeNone: true,
                },
                s: {
                    min: 0,
                    max: 100,
                },
                v: {
                    min: 0,
                    max: 100,
                },
            },
        },
        HWB: {
            coords: {
                h: {
                    min: 0,
                    max: 360,
                    canBeNone: true,
                },
                w: {
                    min: 0,
                    max: 100,
                },
                b: {
                    min: 0,
                    max: 100,
                },
            },
        },
    },
    CIELAB: {
        LAB: {
            coords: {
                l: {
                    min: 0,
                    max: 100,
                    canBeNone: true,
                },
                a: {
                    min: -128,
                    max: 127,
                    canBeNone: true,
                },
                b: {
                    min: -128,
                    max: 127,
                    canBeNone: true,
                },
            },
        },
        LCH: {
            coords: {
                l: {
                    min: 0,
                    max: 100,
                    canBeNone: true,
                },
                c: {
                    min: 0,
                    max: 230,
                    canBeNone: true,
                },
                h: {
                    min: 0,
                    max: 360,
                    canBeNone: true,
                },
            },
        },
    },
    Oklab: {
        Oklab: {
            coords: {
                l: {
                    min: 0,
                    max: 1,
                    canBeNone: true,
                    digits: 2,
                },
                a: {
                    min: -0.5,
                    max: 0.5,
                    canBeNone: true,
                    digits: 2,
                },
                b: {
                    min: -0.5,
                    max: 0.5,
                    canBeNone: true,
                    digits: 2,
                },
            },
        },
        Oklch: {
            coords: {
                l: {
                    min: 0,
                    max: 1,
                    canBeNone: true,
                    digits: 2,
                },
                c: {
                    min: 0,
                    max: 0.4,
                    canBeNone: true,
                    digits: 2,
                },
                h: {
                    min: 0,
                    max: 360,
                    canBeNone: true,
                    digits: 2,
                },
            },
        },
    },
});

export type ColorFormatName = keyof UnionToIntersection<Values<typeof colorFormats>>;
export type ColorCoordinate = keyof UnionToIntersection<
    Values<UnionToIntersection<Values<typeof colorFormats>>>
>;

export function createColorStrings(color: Color) {
    const rgb = color.to('srgb');

    const colorNames = findMatchingColorNames([
        Math.round(rgb.r * 255),
        Math.round(rgb.g * 255),
        Math.round(rgb.b * 255),
    ]);

    const formattedColorFormats = typedObjectFromEntries(
        Object.values(colorFormats).flatMap((colorSpace) => {
            return Object.entries(colorSpace).map(
                ([
                    colorFormatName,
                    colorFormat,
                ]) => {
                    const converted = color.to(colorFormat.convertTo || colorFormatName);

                    const coordValues = getObjectTypedEntries(colorFormat.coords).map(
                        ([
                            coordKey,
                            coord,
                        ]) => {
                            const coordValue = round(
                                (converted as AnyObject)[coordKey] * (coord.factor || 1),
                                {digits: coord.digits || 0},
                            );

                            if (coord.canBeNone) {
                                return wrapNaN(coordValue);
                            } else {
                                return coordValue;
                            }
                        },
                    );

                    return [
                        colorFormatName as ColorFormatName,
                        coordValues,
                    ];
                },
            );
        }),
    );

    const colorCoords = {
        Hex: [
            String(rgb.display({format: 'hex', collapse: false})),
        ],
        ...formattedColorFormats,
        Name: [colorNames.join(', ').padEnd(colorNameLength, ' ')],
    } satisfies Record<ColorFormatName | 'Hex' | 'Name', (string | number)[]>;

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
