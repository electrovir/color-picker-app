import {round} from '@augment-vir/common';
import {Color} from '@electrovir/color';
import {css, defineElement, html, unsafeCSS} from 'element-vir';
import {calculateContrast} from 'theme-vir';
import {defineTable} from 'vira';
import {monospaceFont} from '../styles/font.js';

export const VirTextWeights = defineElement<{
    foregroundColor: string;
    backgroundColor: string;
}>()({
    tagName: 'vir-text-weights',
    styles: css`
        td {
            padding: 4px;
        }

        .size-display {
            height: 50px;
            width: 100px;
            overflow: hidden;
            display: flex;
            align-items: center;
        }

        .cell-size {
            width: 5em;
        }
    `,
    render({inputs}) {
        const currentContrast = calculateContrast({
            background: new Color(inputs.backgroundColor).toCss().rgb,
            foreground: new Color(inputs.foregroundColor).toCss().rgb,
        });

        const {rows} = defineTable(
            [
                {
                    key: 'weight',
                },
                {
                    key: 'size',
                },
            ],
            Object.entries(currentContrast.fontSizes).map(
                ([
                    weight,
                    size,
                ]) => {
                    return {
                        weight: Number(weight),
                        size,
                    };
                },
            ),
            ({size, weight}) => {
                return {
                    size: `${round(size, {digits: 1})}px`,
                    weight: html`
                        <span
                            style=${css`
                                font-weight: ${weight};
                            `}
                        >
                            ${weight}
                        </span>
                    `,
                };
            },
        );

        return html`
            <table>
                ${rows.map((row) => {
                    const cells = row.cells.map((cell) => {
                        return html`
                            <td
                                class="cell-${cell.key}"
                                style=${css`
                                    ${monospaceFont}
                                `}
                            >
                                ${cell.content}
                            </td>
                        `;
                    });

                    return html`
                        <tr>
                            ${cells}
                            <td>
                                <div
                                    class="size-display"
                                    style=${css`
                                        background-color: ${unsafeCSS(inputs.backgroundColor)};
                                        color: ${unsafeCSS(inputs.foregroundColor)};
                                        font-weight: ${row.data.weight};
                                        font-size: ${row.data.size}px;
                                    `}
                                >
                                    <span>Text</span>
                                </div>
                            </td>
                        </tr>
                    `;
                })}
            </table>
        `;
    },
});
