// Rollup plugins
import babel from 'rollup-plugin-babel';

export default {
  entry: 'app/index.js',
  dest: './scripts/app.js',
  format: 'es',
  sourceMap: 'inline',
  plugins: [
    babel({
      exclude: 'node_modules/**',
    }),
  ]
};