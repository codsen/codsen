import resolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
import uglify from 'rollup-plugin-uglify'
import babel from 'rollup-plugin-babel'
import { minify } from 'uglify-es'
import pkg from './package.json'

export default [
  // browser-friendly UMD build
  {
    input: 'src/main.js',
    output: {
      file: pkg.browser,
      format: 'umd',
      name: 'jsonCombCore',
    },
    plugins: [
      resolve(), // so Rollup can find deps
      commonjs(), // so Rollup can convert deps to ES modules
      babel(),
      uglify({}, minify),
    ],
  },

  // Builds: CommonJS (for Node) and ES module (for bundlers)
  {
    input: 'src/main.js',
    output: [
      { file: pkg.main, format: 'cjs' },
      { file: pkg.module, format: 'es' },
    ],
    external: [
      'object-flatten-all-arrays',
      'object-fill-missing-keys',
      'object-set-all-values-to',
      'object-merge-advanced',
      'object-no-new-keys',
      'check-types-mini',
      'lodash.clonedeep',
      'lodash.includes',
      'type-detect',
      'sort-keys',
      'p-reduce',
      'p-one',
    ],
    plugins: [
      babel(),
    ],
  },

]
