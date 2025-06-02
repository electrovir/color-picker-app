import {css, defineElement, html, listen} from 'element-vir';
import {ColorPickerLayer, loadColorFromCache, storeColorInCache} from '../../data/cache-store.js';
import {verifyColor} from '../../data/verify-color.js';
import {VirColorOverlay} from './vir-color-overlay.element.js';
import {VirColorPicker} from './vir-color-picker.element.js';

export const VirApp = defineElement()({
    tagName: 'vir-app',
    styles: css`
        :host {
            font-family: sans-serif;
            display: flex;
            justify-content: center;
            padding: 0 16px;
            box-sizing: border-box;
            width: 100%;
            max-width: 100%;
            min-height: 100%;
        }

        main {
            box-sizing: border-box;
            padding: 32px 0;
            display: flex;
            flex-direction: column;
            max-width: 2000px;
            flex-grow: 1;
            max-width: 100%;
        }

        section {
            display: flex;
            justify-content: center;
            gap: 32px;
        }
    `,
    state() {
        return {
            foregroundColor: verifyColor(loadColorFromCache(ColorPickerLayer.Foreground)) || '#000',
            backgroundColor: verifyColor(loadColorFromCache(ColorPickerLayer.Background)) || '#fff',
        };
    },
    render({state, updateState}) {
        return html`
            <main>
                <section class="overlay">
                    <${VirColorOverlay.assign({
                        foregroundColor: state.foregroundColor,
                        backgroundColor: state.backgroundColor,
                    })}></${VirColorOverlay}>
                </section>
                <section class="picker">
                    <div>
                        <h2>Foreground</h2>
                        <${VirColorPicker.assign({
                            color: state.foregroundColor,
                        })}
                            ${listen(VirColorPicker.events.colorChange, (event) => {
                                const newColor = verifyColor(event.detail);
                                if (newColor) {
                                    storeColorInCache(ColorPickerLayer.Foreground, newColor);
                                    updateState({
                                        foregroundColor: newColor,
                                    });
                                }
                            })}
                        ></${VirColorPicker}>
                    </div>
                    <div>
                        <h2>Background</h2>
                        <${VirColorPicker.assign({
                            color: state.backgroundColor,
                        })}
                            ${listen(VirColorPicker.events.colorChange, (event) => {
                                const newColor = verifyColor(event.detail);
                                if (newColor) {
                                    storeColorInCache(ColorPickerLayer.Background, newColor);
                                    updateState({
                                        backgroundColor: newColor,
                                    });
                                }
                            })}
                        ></${VirColorPicker}>
                    </div>
                </section>
            </main>
        `;
    },
});
