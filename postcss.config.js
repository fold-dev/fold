
module.exports = {
    plugins: [
        require('autoprefixer'),
        require('postcss-preset-env'),
        require('postcss-import'),
        ...(process.env.NODE_ENV === 'production' ? [require('cssnano')] : []),
    ],
}
