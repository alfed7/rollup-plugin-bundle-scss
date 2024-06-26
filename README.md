# rollup-plugin-bundle-scss-postcss

[![GitHub Action](https://github.com/weizhenye/rollup-plugin-bundle-scss/workflows/Node%20CI/badge.svg)](https://github.com/weizhenye/rollup-plugin-bundle-scss/actions?query=workflow%3A%22Node+CI%22)
[![Node version](https://badgen.net/npm/node/rollup-plugin-bundle-scss?icon=https://simpleicons.now.sh/node-dot-js/fff)](https://nodejs.org)
[![NPM version](https://badgen.net/npm/v/rollup-plugin-bundle-scss?icon=npm)](https://www.npmjs.com/package/rollup-plugin-bundle-scss)
[![License](https://badgen.net/npm/license/rollup-plugin-bundle-scss?icon=https://api.iconify.design/octicon:law.svg?color=white)](https://github.com/weizhenye/rollup-plugin-bundle-scss/blob/master/LICENSE)

Rollup .scss imports into one bundled .scss file.

Maybe you're writing an UI library with SCSS for styles, and you want to bundle all styles in components into one .scss file, so that users can import it and do some custom theming. That's it.

It also compiles the bundled file into .css using node-sass and postcss.

```js
plugins: [
    bundleScss({bundlerOptions: {
      plugins: [
        autoprefixer(),
      ],
      use: [
        ['sass', {
          data: "@import './variables.scss'; ",
          includePaths: [path.join(__dirname, 'src')]
        }]
      ],
    }}),
  ],
```

It dependence on [scss-bundle](https://github.com/reactway/scss-bundle).

## Installation

```bash
npm install -D rollup-plugin-bundle-scss
```

## Usage

```js
import bundleScss from 'rollup-plugin-bundle-scss';

export default {
  input: 'src/index.js',
  output: {
    file: 'dist/index.js',
    format: 'esm',
  },
  plugins: [
    // output to dist/index.scss
    bundleScss(),
    // output to dist/foo.scss
    // bundleScss({ output: 'foo.scss' }),
  ],
};
```

Using with [rollup-plugin-postcss](https://github.com/egoist/rollup-plugin-postcss):

```js
import bundleScss from 'rollup-plugin-bundle-scss';
import postcss from 'rollup-plugin-postcss';

export default {
  input: 'src/index.js',
  output: {
    file: 'dist/index.js',
    format: 'esm',
  },
  plugins: [
    // put it before postcss(), and set exclusive to false
    bundleScss({ exclusive: false }),
    postcss({
      // ...
    }),
  ],
};
```

## API

```js
bundleScss({
  // where to output bundled SCSS file
  output: String,

  // Whether SCSS file is exclusive to rollup-plugin-bundle-scss.
  // Defalut value: true
  // Set it to false when there're other plugin to handle SCSS file after bundleScss()
  exclusive: Boolean,

  // bundlerOptions will be passed into `scss-bundle` package,
  // see document here https://github.com/reactway/scss-bundle
  bundlerOptions: {
    // If tilde import is used, `project` is required for finding `node_modules`
    project: String,
    dedupeGlobs: String[],
    includePaths: String[],
    ignoreImports: String[],
  },
})
```
