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
      name: 'jsonVariables',
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
      'arrayiffy-if-string',
      'ast-monkey-traverse',
      'check-types-mini',
      'lodash.clonedeep',
      'lodash.isplainobject',
      'matcher',
      'object-path',
      'posthtml-ast-get-values-by-key',
      'string-find-heads-tails',
      'string-match-left-right',
      'string-remove-duplicate-heads-tails',
      'string-replace-slices-array',
      'string-slices-array-push',
    ],
    plugins: [
      babel(),
    ],
  },
]
