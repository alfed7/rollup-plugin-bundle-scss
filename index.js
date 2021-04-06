import { promises as fs } from 'fs';
import path from 'path';
import { Bundler } from 'scss-bundle';

let compiler = null;
import('vue-template-compiler')
  .then((module) => { compiler = module; })
  .catch(() => {});

export default function bundleScss({ output, exclusive = true, bundlerOptions = {} } = {}) {
  const files = [];
  const {
    project = null,
    dedupeGlobs = [],
    includePaths = [],
    ignoreImports = [],
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
      if (/\.vue$/.test(id) && compiler) {
        const { styles } = compiler.parseComponent(source);
        files.push(
          ...styles
            .filter((style) => style.lang === 'scss')
            .map((style, index) => ({
              id: `${id}.${index}.scss`,
              content: style.content,
            })),
        );
      }
      return null;
    },
    async generateBundle(opts) {
      const outputPath = path.resolve(
        opts.file ? path.dirname(opts.file) : opts.dir,
        output || `${opts.file ? path.parse(opts.file).name : 'index'}.scss`,
      );
      await fs.mkdir(path.dirname(outputPath), { recursive: true });
      const entryContent = files.map((file) => `@import "${file.id}";`).join('\n');
      await fs.writeFile(outputPath, entryContent);
      const registry = Object.assign({}, ...files.map((file) => ({ [file.id]: file.content })));
      const bundler = new Bundler(registry, project);
      const result = await bundler.bundle(outputPath, dedupeGlobs, includePaths, ignoreImports);
      await fs.writeFile(outputPath, result.bundledContent);
    },
  };
}
