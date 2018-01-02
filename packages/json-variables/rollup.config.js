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
      'lodash.includes',
      'lodash.trim',
      'matcher',
      'object-path',
      'posthtml-ast-is-empty',
      'splice-string',
      'string-convert-indexes',
      'string-find-heads-tails',
      'string-length',
      'string-slice',
      'str-indexes-of-plus',
      'type-detect',
    ],
    plugins: [
      babel(),
    ],
  },

  // util.js needs transpiling as well, there's one unit test which
  // compares, does Detergent export back util's default options:
  {
    input: 'src/utils.js',
    output: [
      { file: 'dist/utils.cjs.js', format: 'cjs' },
    ],
    external: [
      'arrayiffy-if-string',
      'ast-monkey-traverse',
      'lodash.trim',
      'lodash.includes',
      'lodash.clonedeep',
      'str-indexes-of-plus',
      'string-slice',
      'string-length',
      'type-detect',
    ],
    plugins: [
      babel(),
    ],
  },
]
