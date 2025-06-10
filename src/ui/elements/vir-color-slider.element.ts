import {assertWrap} from '@augment-vir/assert';
import {extractEventTarget} from '@augment-vir/web';
import {
    colorFormats,
    type Color,
    type ColorCoordinateName,
    type ColorFormatName,
} from '@electrovir/color';
import {css, defineElement, defineElementEvent, html, listen} from 'element-vir';
import {ViraInput} from 'vira';
import {monospaceFont} from '../styles/font.js';

export const VirColorSlider = defineElement<{
    color: Color;
    colorFormat: ColorFormatName;
    colorCoordinate: ColorCoordinateName;
}>()({
    tagName: 'vir-color-slider',
    styles: css`
        :host {
            display: flex;
            align-items: center;
            gap: 2px;
        }

        ${ViraInput} {
            width: 76px;
        }

        .coordinate {
            font-family: ${monospaceFont};
            font-size: 18px;
            margin-top: -4px;
        }
    `,
    events: {
        valueChange: defineElementEvent<number>(),
    },
    render({inputs, events, dispatch}) {
        const formatDefinition = colorFormats[inputs.colorFormat];
        const coordinateDefinition = formatDefinition.coords[inputs.colorCoordinate];

        if (!coordinateDefinition) {
            throw new Error(
                `Invalid color coordinate '${inputs.colorCoordinate}' for color format '${inputs.colorFormat}'`,
            );
        }
        const coordinateValue = assertWrap.isNumber(
            (
                inputs.color[inputs.colorFormat] as Record<
                    ColorCoordinateName,
                    undefined | string | number
                >
            )[inputs.colorCoordinate],
        );

        return html`
            <span class="coordinate">${inputs.colorCoordinate.toUpperCase()}</span>
            <input
                type="range"
                min=${coordinateDefinition.min}
                max=${coordinateDefinition.max}
                .value=${coordinateValue}
                step=${Math.pow(10, coordinateDefinition.digits ? -coordinateDefinition.digits : 0)}
                ${listen('input', (event) => {
                    const element = extractEventTarget(event, HTMLInputElement);
                    const newValue = Number(element.value);
                    if (isNaN(newValue)) {
                        return;
                    }

                    dispatch(new events.valueChange(newValue));
                })}
            />
            <${ViraInput.assign({
                value: String(coordinateValue),
            })}
                ${listen(ViraInput.events.valueChange, (event) => {
                    const newValue = Number(event.detail);
                    if (isNaN(newValue)) {
                        return;
                    }

                    dispatch(new events.valueChange(newValue));
                })}
            ></${ViraInput}>
        `;
    },
});
