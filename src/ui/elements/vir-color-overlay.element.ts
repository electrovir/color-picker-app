import {capitalizeFirstLetter, getObjectTypedEntries} from '@augment-vir/common';
import {css, defineElement, html, unsafeCSS} from 'element-vir';
import {calculateContrast, ThemeVirContrastIndicator} from 'theme-vir';
import {createTable, ViraTable, type ViraTableColumns} from 'vira';
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
                        overlayTableColumns,
                        getObjectTypedEntries({
                            foreground: inputs.foregroundColor,
                            background: inputs.backgroundColor,
                            contrast: `${contrast.contrast} Lc`,
                        }).map(
                            ([
                                header,
                                value,
                            ]) => {
                                return {
                                    cells: {
                                        header: capitalizeFirstLetter(header) + ':',
                                        value,
                                    },
                                };
                            },
                        ),
                    ),
                    hideHeaderRow: true,
                    preventRowClicks: true,
                    stylePassthrough: {
                        td: css`
                            padding: 4px 8px;
                        `,
                        th: css`
                            padding: 4px 8px;
                            text-align: end;
                        `,
                    },
                })}></${ViraTable}>
                <${ThemeVirContrastIndicator.assign({contrast})}></${ThemeVirContrastIndicator}>
            </div>
        `;
    },
});
