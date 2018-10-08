// Dependencies
// =============================================================================
const browserSync = require('browser-sync').create();
const compression = require('compression');

browserSync.init({
    files: [
        './dist/**/*.*',
        './docs/**/*.*'
    ],
    ghostMode: {
        clicks: false,
        forms : false,
        scroll: false
    },
    open: false,
    notify: false,
    cors: true,
    reloadDebounce: 1000,
    reloadOnRestart: true,
    server: {
        baseDir: [
            './docs/'
        ],
        middleware: [
            compression()
        ]
    },
    serveStatic: [
        './dist/'
    ],
    rewriteRules: [
        {
            // Replace CDN default with local js path
            match  : /"https:\/\/unpkg\.com\/docsify-tabs"/g,
            replace: '"/docsify-tabs.min.js"'
        }
    ]
});
