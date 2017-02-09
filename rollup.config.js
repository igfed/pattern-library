// Rollup plugins
import babel from 'rollup-plugin-babel';

export default {
  entry: 'app/scripts/modules/app.js',
  dest: 'app/scripts/main.js',
  format: 'iife',
  sourceMap: 'inline',
  plugins: [
    babel({
      exclude: 'node_modules/**',
    }),
  ]
}