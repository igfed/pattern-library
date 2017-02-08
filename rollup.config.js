// Rollup plugins
import babel from 'rollup-plugin-babel';

export default {
  entry: 'app/index.js',
  dest: './scripts/main.js',
  format: 'es',
  sourceMap: 'inline',
  plugins: [
    babel({
      exclude: 'node_modules/**',
    }),
  ]
};