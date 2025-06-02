const {baseConfig} = require('@virmator/spellcheck/configs/cspell.config.base.cjs');

module.exports = {
    ...baseConfig,
    ignorePaths: [
        ...baseConfig.ignorePaths,
    ],
    words: [
        ...baseConfig.words,
        'cqmin',
        'darkgray',
        'darkgrey',
        'darkslategray',
        'darkslategrey',
        'dimgray',
        'dimgrey',
        'lightgoldenrodyellow',
        'lightgray',
        'lightgrey',
        'lightslategray',
        'lightslategrey',
        'oklab',
        'oklch',
        'slategray',
        'slategrey',
    ],
};
