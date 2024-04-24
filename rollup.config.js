import { babel } from '@rollup/plugin-babel';
import commonjs from '@rollup/plugin-commonjs';
import fs from 'node:fs';
import json from '@rollup/plugin-json';
import { mergician } from 'mergician';
import path from 'node:path';
import postcss from 'rollup-plugin-postcss';
import nodeResolve from '@rollup/plugin-node-resolve';
import terser from '@rollup/plugin-terser';

const pkg = JSON.parse(
  fs.readFileSync(new URL('./package.json', import.meta.url), 'utf8') // prettier-ignore
);

// Settings
// =============================================================================
// Copyright
const currentYear = new Date().getFullYear();
const releaseYear = 2018;

// Output
const entryFile = path.resolve('.', 'src', 'js', 'index.js');
const outputFile = path.resolve('.', 'dist', `${pkg.name}.js`);

// Banner
const bannerData = [
  `${pkg.name}`,
  `v${pkg.version}`,
  `${pkg.homepage}`,
  `(c) ${releaseYear}${currentYear === releaseYear ? '' : '-' + currentYear} ${pkg.author}`,
  `${pkg.license} license`
];

// Plugins
const pluginSettings = {
  babel: {
    babelrc: false,
    exclude: ['node_modules/**'],
    babelHelpers: 'bundled',
    presets: [
      [
        '@babel/preset-env',
        {
          modules: false,
          targets: {
            browsers: ['ie >= 11']
          }
        }
      ]
    ]
  },
  postcss: {
    inject: {
      insertAt: 'top'
    },
    minimize: true
  },
  terser: {
    beautify: {
      compress: false,
      mangle: false,
      output: {
        beautify: true,
        comments: /(?:^!|@(?:license|preserve))/
      }
    },
    minify: {
      compress: true,
      mangle: true,
      output: {
        comments: new RegExp(pkg.name)
      }
    }
  }
};

// Config
// =============================================================================
// Base
const config = {
  input: entryFile,
  output: {
    banner: `/*!\n * ${bannerData.join('\n * ')}\n */`,
    file: outputFile,
    sourcemap: true
  },
  plugins: [
    nodeResolve(),
    commonjs(),
    json(),
    postcss(pluginSettings.postcss),
    babel(pluginSettings.babel)
  ],
  watch: {
    clearScreen: false
  }
};

// Formats
// -----------------------------------------------------------------------------
// IIFE
const iife = mergician({}, config, {
  output: {
    format: 'iife'
  },
  plugins: config.plugins.concat([terser(pluginSettings.terser.beautify)])
});

// IIFE (Minified)
const iifeMinified = mergician({}, config, {
  output: {
    file: iife.output.file.replace(/\.js$/, '.min.js'),
    format: iife.output.format
  },
  plugins: config.plugins.concat([terser(pluginSettings.terser.minify)])
});

// Exports
// =============================================================================
export default [iife, iifeMinified];
