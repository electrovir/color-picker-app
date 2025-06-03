import Color from 'colorjs.io';

export function verifyColor(input: string | undefined): string | undefined {
    if (!input) {
        return undefined;
    }

    try {
        return normalizeColor(input);
    } catch {
        return undefined;
    }
}

export function normalizeColor(color: string): string {
    return String(new Color(color).to('srgb').display({format: 'hex', collapse: false}));
}
