import {Color} from '@electrovir/color';

export function verifyColor(input: string | undefined): string | undefined {
    if (!input) {
        return undefined;
    }

    try {
        new Color(input);
        return input;
    } catch {
        return undefined;
    }
}
