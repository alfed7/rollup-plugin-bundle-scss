import path from 'path';
import bundleScss from '../../../index.js';
import { fileURLToPath } from 'url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default {
  input: path.resolve(__dirname, 'index.js'),
  output: {
    file: path.resolve(__dirname, 'dist/index.js'),
    format: 'esm',
  },
  plugins: [
    bundleScss({
      bundlerOptions: {
        project: path.resolve(__dirname),
      },
    }),
  ],
};
