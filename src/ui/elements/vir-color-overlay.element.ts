import {getObjectTypedEntries} from '@augment-vir/common';
import {Color} from '@electrovir/color';
import {css, defineElement, html, unsafeCSS} from 'element-vir';
import {calculateContrast, ThemeVirContrastIndicator} from 'theme-vir';
import {createTable, ViraTable} from 'vira';
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

        ${ThemeVirContrastIndicator} {
            width: 100%;
        }
    `,
    render({inputs}) {
        const contrast = calculateContrast({
            background: inputs.backgroundColor,
            foreground: inputs.foregroundColor,
        });

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
                                font-size: ${contrast.fontSizes[400]}px;
                                line-height: ${contrast.fontSizes[400] * 0.77}px;
                                visibility: ${unsafeCSS(
                                    contrast.fontSizes[400] > 900 ? 'hidden' : 'visible',
                                )};
                            `}
                        >
                            Min Size
                        </span>
                    </div>
                </div>
            </${VirColorSwatch}>
            <div class="details">
                <${ViraTable.assign({
                    table: createTable(
                        [
                            {
                                key: 'colorLayer',
                                isHeader: true,
                            },
                            {
                                key: 'colorValue',
                            },
                        ],
                        getObjectTypedEntries({
                            'Foreground:': new Color(inputs.foregroundColor).toCss().hex,
                            'Background:': new Color(inputs.backgroundColor).toCss().hex,
                            'Contrast:': `${contrast.contrast} Lc`.padEnd(9, ' '),
                        }).map(
                            ([
                                colorLayer,
                                value,
                            ]) => {
                                return {
                                    cells: {
                                        colorLayer,
                                        colorValue: html`
                                            <${VirCellPre}>${value}</${VirCellPre}>
                                        `,
                                    },
                                };
                            },
                        ),
                    ),
                    stylePassthrough: {
                        td: css`
                            padding: 4px 8px;
                            font-weight: bold;
                        `,
                        th: css`
                            padding: 4px 8px;
                            text-align: end;
                            font-weight: normal;
                        `,
                    },
                })}></${ViraTable}>
                <${ThemeVirContrastIndicator.assign({contrast})}></${ThemeVirContrastIndicator}>
            </div>
        `;
    },
});
