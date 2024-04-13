import path from 'path';
import bundleScss from '../../../index.js';
import autoprefixer from 'autoprefixer';
import { fileURLToPath } from 'url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default {
  input: path.resolve(__dirname, 'index.js'),
  output: {
    file: path.resolve(__dirname, 'dist/index.js'),
    format: 'esm',
  },
  plugins: [
    bundleScss({bundlerOptions: {
      plugins: [
        autoprefixer(),
      ],
      use: [
        ['sass', {
          data: "@import './variables.scss'; ",
          includePaths: [path.join(__dirname, '.')]
        }]
      ],
    }}),
  ],
};
