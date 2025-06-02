export enum ColorPickerLayer {
    Background = 'background',
    Foreground = 'foreground',
}

function createKey(layer: ColorPickerLayer): string {
    return `color-picker-store-${layer}`;
}

export function loadColorFromCache(layer: ColorPickerLayer): string | undefined {
    return globalThis.localStorage.getItem(createKey(layer)) || undefined;
}

export function storeColorInCache(layer: ColorPickerLayer, color: string): void {
    return globalThis.localStorage.setItem(createKey(layer), color);
}
