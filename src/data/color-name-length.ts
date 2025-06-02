import {check} from '@augment-vir/assert';
import {filterMap, filterObject, mapObjectValues} from '@augment-vir/common';
import colorNames from 'color-name';

export const longestColorName = Object.keys(colorNames).reduce((longest, current) => {
    if (current.length > longest.length) {
        return current;
    } else {
        return longest;
    }
});

export const identicalColorNames = filterObject(
    mapObjectValues(colorNames, (colorName, rgbValues) => {
        const matches = filterMap(
            Object.entries(colorNames),
            ([colorName]) => colorName,
            (
                innerColorName,
                [
                    ,
                    innerRgbValues,
                ],
            ) => {
                if (innerColorName === colorName) {
                    return false;
                }

                return check.deepEquals(innerRgbValues, rgbValues);
            },
        );

        return matches;
    }),
    (colorName, matches) => !!matches.length,
);

export const longestColorPair = Object.entries(identicalColorNames)
    .reduce((longest, current): [string, string[]] => {
        const longestString = [
            longest[0],
            ...longest[1],
        ].join(', ');
        const currentString = [
            current[0],
            ...current[1],
        ].join(', ');

        if (currentString.length > longestString.length) {
            return current;
        } else {
            return longest;
        }
    })
    .reduce((combined: string[], current): string[] => {
        if (check.isArray(current)) {
            return [
                ...combined,
                ...current,
            ];
        } else {
            return [
                ...combined,
                current,
            ];
        }
    }, [] as string[]);

export const colorNameLength = Math.max(
    longestColorName.length,
    longestColorPair.length + (longestColorPair.length - 1) * ', '.length,
);
