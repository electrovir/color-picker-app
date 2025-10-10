import {assertWrap} from '@augment-vir/assert';
import {Color} from '@electrovir/color';
import {classMap, css, defineElement, html} from 'element-vir';
import {calculateContrast, calculateFontSizes, contrastLevelLabel, contrastLevels} from 'theme-vir';
import {defineTable, ViraBoldText} from 'vira';

export const VirContrastLevels = defineElement<{
    foregroundColor: string;
    backgroundColor: string;
}>()({
    tagName: 'vir-contrast-levels',
    styles: css`
        td {
            padding: 4px;
        }

        tr {
            opacity: 0.4;
        }

        .selected-row {
            opacity: 1;
            font-weight: bold;
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
                    key: 'boundaryLc',
                },
                {
                    key: 'levelName',
                },
            ],
            contrastLevels,
            (contrastLevel) => {
                return {
                    boundaryLc: `${contrastLevel.min} Lc`,
                    levelName: contrastLevelLabel[contrastLevel.name],
                };
            },
        );

        return html`
            <table>
                ${rows.map((row) => {
                    const isSelectedRow = currentContrast.contrastLevel.name === row.data.name;

                    const cells = row.cells.map((cell) => {
                        return html`
                            <td><${ViraBoldText.assign({
                                bold: isSelectedRow,
                                text: assertWrap.isString(cell.content),
                            })}><${ViraBoldText}></td>
                        `;
                    });

                    const title = [
                        row.data.description,
                        '\nFont weights to font sizes:',
                        JSON.stringify(calculateFontSizes(row.data.min), null, 4),
                    ].join('\n');

                    return html`
                        <tr
                            title=${title}
                            class=${classMap({
                                'selected-row': isSelectedRow,
                            })}
                        >
                            ${cells}
                        </tr>
                    `;
                })}
            </table>
        `;
    },
});
