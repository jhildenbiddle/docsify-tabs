module.exports = {
    map    : false,
    plugins: [
        require('postcss-import')(),
        require('autoprefixer')(),
        require('postcss-custom-properties')(),
        require('postcss-flexbugs-fixes')()
    ]
};
