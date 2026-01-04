import {getObjectTypedEntries} from '@augment-vir/common';
import {calculateContrast, Color, fontWeightByName, VirContrastIndicator} from '@electrovir/color';
import {css, defineElement, html, unsafeCSS} from 'element-vir';
import {defineTable} from 'vira';
import {VirCellPre} from './common/vir-cell-pre.element.js';
import {VirColorSwatch} from './vir-color-swatch.element.js';

export const VirColorOverlay = defineElement<{
    foregroundColor: string;
    backgroundColor: string;
}>()({
    tagName: 'vir-color-overlay',
    styles: css`
        :host {
            display: flex;
            align-items: center;
            max-width: 100%;
            gap: 8px;
        }

        .constant-size-wrapper {
            display: flex;
            align-items: baseline;
            gap: 5cqmin;
            font-size: 20cqmin;
        }
        .square {
            margin: 12px 0;
            width: 20cqmin;
            height: 20cqmin;
            background-color: currentColor;
        }

        .foreground-content {
            display: flex;
            flex-direction: column;
            position: relative;
        }

        .needed-size {
            display: flex;
            justify-content: center;
            top: 100%;
            left: 0;
            text-align: center;
            position: absolute;
            width: 100%;
        }

        ${VirContrastIndicator} {
            width: 100%;
        }

        td {
            padding: 4px 8px;
            font-weight: bold;
        }

        th {
            padding: 4px 8px;
            text-align: end;
            font-weight: normal;
        }
    `,
    render({inputs}) {
        const contrast = calculateContrast({
            background: new Color(inputs.backgroundColor).toCss().rgb,
            foreground: new Color(inputs.foregroundColor).toCss().rgb,
        });

        const {rows} = defineTable(
            [
                {
                    key: 'colorLayer',
                },
                {
                    key: 'colorValue',
                },
            ],
            getObjectTypedEntries({
                'Foreground:': new Color(inputs.foregroundColor).toCss().hex,
                'Background:': new Color(inputs.backgroundColor).toCss().hex,
                'Contrast:': `${contrast.contrast} Lc`.padEnd(9, ' '),
            }),
            ([
                colorLayer,
                value,
            ]) => {
                return {
                    colorLayer,
                    colorValue: html`
                        <${VirCellPre}>${value}</${VirCellPre}>
                    `,
                };
            },
        );

        return html`
            <${VirColorSwatch.assign({
                backgroundColor: inputs.backgroundColor,
                foregroundColor: inputs.foregroundColor,
            })}>
                <div class="foreground-content">
                    <div class="constant-size-wrapper">
                        <div class="square"></div>
                        <b>Aa</b>
                    </div>
                    <div class="needed-size">
                        <span
                            style=${css`
                                font-size: ${contrast.fontSizes[fontWeightByName.Normal]}px;
                                line-height: ${contrast.fontSizes[fontWeightByName.Normal] *
                                0.77}px;
                                visibility: ${unsafeCSS(
                                    contrast.fontSizes[fontWeightByName.Normal] > 900
                                        ? 'hidden'
                                        : 'visible',
                                )};
                            `}
                        >
                            Min Size
                        </span>
                    </div>
                </div>
            </${VirColorSwatch}>
            <div class="details">
                <table>
                    <tbody>
                        ${rows.map((row) => {
                            const cells = row.cells.map((cell, index) => {
                                const element = index ? 'td' : 'th';

                                return html`
                                    <${element}>${cell.content}</${element}>
                                `;
                            });

                            return html`
                                <tr>${cells}</tr>
                            `;
                        })}
                    </tbody>
                </table>

                <${VirContrastIndicator.assign({
                    contrast,
                    fontWeight: fontWeightByName.Normal,
                })}></${VirContrastIndicator}>
            </div>
        `;
    },
});
