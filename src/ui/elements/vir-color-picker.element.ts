import {getObjectTypedEntries, getObjectTypedKeys, getObjectTypedValues} from '@augment-vir/common';
import {
    Color,
    colorSpaces,
    type ColorCoordinateDefinition,
    type ColorCoordinateName,
    type ColorFormatDefinition,
    type ColorFormatName,
    type ColorUpdate,
} from '@electrovir/color';
import {css, defineElement, defineElementEvent, html, listen} from 'element-vir';
import {createTable, noNativeSpacing, ViraInput, ViraTable} from 'vira';
import {VirCellPre} from './common/vir-cell-pre.element.js';
import {VirColorSlider} from './vir-color-slider.element.js';
import {VirColorSwatch} from './vir-color-swatch.element.js';

export const VirColorPicker = defineElement<{color: string}>()({
    tagName: 'vir-color-picker',
    styles: css`
        :host {
            display: flex;
            flex-direction: column;
            gap: 16px;
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

        .color-format {
            display: flex;
            flex-direction: column;
        }

        .color-space {
            display: flex;
            flex-wrap: wrap;
            column-gap: 32px;
            row-gap: 8px;
        }

        h3 {
            ${noNativeSpacing};
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
        const colorStrings = color.toFormattedStrings();
        if (state.inputColorString == undefined) {
            updateState({
                inputColorString: inputs.color,
            });
        }

        const colorSpaceTemplates = getObjectTypedValues(colorSpaces).map((colorSpaceFormats) => {
            const formatTemplates = getObjectTypedEntries(
                colorSpaceFormats as Record<ColorFormatName, ColorFormatDefinition>,
            ).map(
                ([
                    colorFormatName,
                    colorFormat,
                ]) => {
                    const coordinateTemplates = getObjectTypedKeys(
                        colorFormat.coords as Record<
                            ColorCoordinateName,
                            ColorCoordinateDefinition
                        >,
                    ).map((colorCoordinate) => {
                        return html`
                            <${VirColorSlider.assign({
                                color,
                                colorCoordinate,
                                colorFormat: colorFormatName,
                            })}
                                ${listen(VirColorSlider.events.valueChange, (event) => {
                                    const newColor = color.clone();

                                    newColor.set({
                                        [colorFormatName]: {
                                            [colorCoordinate]: event.detail,
                                        },
                                    } as ColorUpdate);
                                    const newValue = newColor.toCss()[colorFormatName];
                                    dispatch(new events.colorChange(newValue));
                                })}
                            ></${VirColorSlider}>
                        `;
                    });

                    return html`
                        <div class="color-format">
                            <h3>${colorFormatName}</h3>
                            ${coordinateTemplates}
                        </div>
                    `;
                },
            );

            return html`
                <section class="color-space">${formatTemplates}</section>
            `;
        });

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
                    table: createTable(
                        [
                            {
                                key: 'colorFormat',
                                isHeader: true,
                            },
                            {
                                key: 'formattedString',
                            },
                        ],
                        getObjectTypedEntries(colorStrings).map(
                            ([
                                colorFormat,
                                value,
                            ]) => {
                                return {
                                    cells: {
                                        colorFormat: colorFormat + ':',
                                        formattedString: html`
                                            <${VirCellPre}>${value}</${VirCellPre}>
                                        `,
                                    },
                                };
                            },
                        ),
                    ),
                })}></${ViraTable}>
            </section>
            ${colorSpaceTemplates}
        `;
    },
});
