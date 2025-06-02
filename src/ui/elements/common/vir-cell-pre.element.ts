import {css, defineElement, html} from 'element-vir';
import {noNativeSpacing} from 'vira';

export const VirCellPre = defineElement()({
    tagName: 'vir-cell-pre',
    styles: css`
        :host {
            font-size: 1.3em;
        }
        pre {
            ${noNativeSpacing};
        }
    `,
    render() {
        return html`
            <pre><slot></slot></pre>
        `;
    },
});
