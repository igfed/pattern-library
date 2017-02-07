// Rollup plugins
import babel from 'rollup-plugin-babel';

export default {
  entry: 'app/scripts/main.js',
  dest: 'app/scripts/app.js',
  format: 'iife',
  sourceMap: 'inline',
  plugins: [
    babel({
      exclude: 'node_modules/**',
    }),
  ]
};