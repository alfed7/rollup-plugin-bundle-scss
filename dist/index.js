'use strict';

var fs = require('fs');
var path = require('path');
var scssBundle = require('scss-bundle');
var postcss = require('postcss');
var sass = require('node-sass');

function renderSass(options) {
  return new Promise((resolve, reject) => {
    sass.render(options, (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result.css.toString());
      }
    });
  });
}

function bundleScss({ output, exclusive = true, bundlerOptions = {} } = {}) {
  const files = [];
  const {
    project = null,
    dedupeGlobs = [],
    includePaths = [],
    ignoreImports = [],
    plugins = [],
    use = [],
  } = bundlerOptions;
  return {
    name: 'bundle-scss',
    transform(source, id) {
      if (/\.scss$/.test(id)) {
        files.push({ id, content: source });
        if (exclusive) {
          return { code: `export default ${JSON.stringify(source)}` };
        }
      }
      return null;
    },
    async generateBundle(opts) {
      const outputPath = path.resolve(
        opts.file ? path.dirname(opts.file) : opts.dir,
        output || `${opts.file ? path.parse(opts.file).name : 'index'}.scss`,
      );
      await fs.promises.mkdir(path.dirname(outputPath), { recursive: true });
      const entryContent = files.map((file) => `@import "${file.id}";`).join('\n');
      await fs.promises.writeFile(outputPath, entryContent);
      const registry = Object.assign({}, ...files.map((file) => ({ [file.id]: file.content })));
      const bundler = new scssBundle.Bundler(registry, project);
      const result = await bundler.bundle(outputPath, dedupeGlobs, includePaths, ignoreImports);
      await fs.promises.writeFile(outputPath, result.bundledContent);

      const sassBlock = use.find((u) => u[0] === 'sass');
      if (sassBlock) {
        const sassOptions = (sassBlock && sassBlock.length > 1) ? sassBlock[1] : {};

        const d = sassOptions.data ? sassOptions.data : '';
        const css = await renderSass({ ...sassOptions, data: d + result.bundledContent });

        const r = await postcss(plugins)
          .process(css);

        const outputPath2 = path.resolve(
          opts.file ? path.dirname(opts.file) : opts.dir,
          output || `${opts.file ? path.parse(opts.file).name : 'index'}.css`,
        );
        await fs.promises.writeFile(outputPath2, r.css);
        // if (r.map) {
        //   fs.writeFile('dest/app.css.map', r.map.toString(), () => true);
        // }
        // , { from: 'src/app.css', to: 'dest/app.css' });
      }
    },
  };
}

module.exports = bundleScss;
