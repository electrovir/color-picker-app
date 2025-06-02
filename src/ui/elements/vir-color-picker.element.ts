import {getObjectTypedEntries} from '@augment-vir/common';
import {css, defineElement, defineElementEvent, html, listen} from 'element-vir';
import {Color, createTable, ViraInput, ViraTable, type ViraTableColumns} from 'vira';
import {createColorStrings} from '../../data/color-formats.js';
import {VirCellPre} from './common/vir-cell-pre.element.js';
import {VirColorSwatch} from './vir-color-swatch.element.js';

const overlayTableColumns = [
    {
        key: 'header',
        isHeader: true,
    },
    {
        key: 'value',
    },
] as const satisfies ViraTableColumns;

export const VirColorPicker = defineElement<{color: string}>()({
    tagName: 'vir-color-picker',
    styles: css`
        :host {
            display: flex;
            flex-direction: column;
        }

        .color-details {
            display: flex;
            gap: 16px;
        }

        ${VirColorSwatch} {
            height: 200px;
            width: 200px;
        }
        .swatch {
            display: flex;
            flex-direction: column;
            gap: 8px;
            align-items: center;
        }

        ${ViraInput} {
            font-size: 14px;
            font-family: monospace;
            max-width: 200px;
        }
    `,
    events: {
        colorChange: defineElementEvent<string>(),
    },
    state() {
        return {
            inputColorString: undefined as undefined | string,
        };
    },
    render({inputs, dispatch, events, state, updateState}) {
        const color = new Color(inputs.color);
        const colorStrings = createColorStrings(color);
        if (state.inputColorString == undefined) {
            updateState({
                inputColorString: inputs.color,
            });
        }

        return html`
            <section class="color-details">
                <div class="swatch">
                    <${VirColorSwatch.assign({
                        backgroundColor: inputs.color,
                    })}></${VirColorSwatch}>
                    <${ViraInput.assign({
                        value: state.inputColorString || '',
                        fitText: true,
                    })}
                        ${listen(ViraInput.events.valueChange, (event) => {
                            updateState({inputColorString: event.detail});
                            dispatch(new events.colorChange(event.detail));
                        })}
                    ></${ViraInput}>
                </div>
                <${ViraTable.assign({
                    hideHeaderRow: true,
                    stylePassthrough: {
                        th: css`
                            padding: 4px 8px;
                            font-weight: normal;
                            text-align: right;
                        `,
                        td: css`
                            font-weight: bold;
                        `,
                    },
                    preventRowClicks: true,
                    table: createTable(
                        overlayTableColumns,
                        getObjectTypedEntries(colorStrings).map(
                            ([
                                header,
                                value,
                            ]) => {
                                return {
                                    cells: {
                                        header: header + ':',
                                        value: html`
                                            <${VirCellPre}>${value}</${VirCellPre}>
                                        `,
                                    },
                                };
                            },
                        ),
                    ),
                })}></${ViraTable}>
            </section>
        `;
    },
});
