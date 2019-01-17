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
        // Replace CDN URLs with local paths
        {
            match  : /https:\/\/cdn\.jsdelivr\.net\/npm\/docsify-tabs@1\/dist\//g,
            replace: '/'
        },
        {
            match  : /https:\/\/cdn\.jsdelivr\.net\/npm\/docsify-tabs@1/g,
            replace: '/docsify-tabs.min.js'
        }
    ]
});
