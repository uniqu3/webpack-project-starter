module.exports = {
    plugins: [
        require('stylelint'),
        //require('tailwindcss')('./tailwind.config.js'),
        require('postcss-preset-env')({
            autoprefixer: { grid: true },
            features: {
                'nesting-rules': true,
            },
        }),
    ],
};
