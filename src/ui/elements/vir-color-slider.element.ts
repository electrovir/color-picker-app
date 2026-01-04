import {assertWrap} from '@augment-vir/assert';
import {createArray} from '@augment-vir/common';
import {extractEventTarget} from '@augment-vir/web';
import {
    Color,
    colorFormats,
    type ColorCoordinateName,
    type ColorFormatName,
    type ColorUpdate,
} from '@electrovir/color';
import {css, defineElement, defineElementEvent, html, listen, unsafeCSS} from 'element-vir';
import {ViraInput} from 'vira';
import {monospaceFont} from '../styles/font.js';

export const VirColorSlider = defineElement<{
    color: Color;
    colorFormat: ColorFormatName;
    colorCoordinate: ColorCoordinateName;
}>()({
    tagName: 'vir-color-slider',
    cssVars: {
        'vir-color-slider-gradient': 'black',
    },
    styles: ({cssVars}) => css`
        :host {
            display: flex;
            align-items: center;
            gap: 2px;
        }

        input[type='range'] {
            flex-grow: 1;
            appearance: none;
            background: ${cssVars['vir-color-slider-gradient'].value};
            height: 9px;
            border-radius: 4px;
            cursor: pointer;
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
    render({inputs, events, dispatch, cssVars}) {
        const formatDefinition = colorFormats[inputs.colorFormat];
        const coordinateDefinition = formatDefinition.coords[inputs.colorCoordinate];

        if (!coordinateDefinition) {
            throw new Error(
                `Invalid color coordinate '${inputs.colorCoordinate}' for color format '${inputs.colorFormat}'`,
            );
        }

        const totalStops = 10;
        const colorStops: string[] = createArray(totalStops, (index) => {
            const value =
                coordinateDefinition.min +
                (coordinateDefinition.max - coordinateDefinition.min) * (index / totalStops);

            const stopColor = new Color({
                [inputs.colorFormat]: {
                    ...inputs.color[inputs.colorFormat],
                    [inputs.colorCoordinate]: value,
                },
            } as ColorUpdate);

            return stopColor.toCss()[inputs.colorFormat];
        });

        const gradient = css`linear-gradient(to right, ${unsafeCSS(colorStops.join(','))})`;

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
                style=${css`
                    ${cssVars['vir-color-slider-gradient'].name}: ${gradient};
                `}
                min=${coordinateDefinition.min}
                max=${coordinateDefinition.max}
                .value=${String(coordinateValue)}
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
