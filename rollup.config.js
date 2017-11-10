// Rollup plugins
import babel from 'rollup-plugin-babel';

export default {
    input: 'app/scripts/modules/app.js',
    output: 'app/scripts/main.js',
    format: 'iife',
    sourcemap: 'inline',
    plugins: [
        babel({
            exclude: 'node_modules/**',
            plugins: ['transform-object-assign']
        }),
    ]
}