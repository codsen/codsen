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
      'type-detect',
      'lodash.clonedeep',
      'lodash.includes',
      'ast-monkey',
      'str-indexes-of-plus',
      'string-length',
      'splice-string',
      'lodash.trim',
      'string-slice',
      'matcher',
      'num-sort',
      'object-path',
      'check-types-mini',
      'arrayiffy-if-string',
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
      'type-detect',
      'str-indexes-of-plus',
      'string-slice',
      'string-length',
      'lodash.trim',
      'lodash.includes',
      'lodash.clonedeep',
      'num-sort',
      'ast-monkey',
      'arrayiffy-if-string',
    ],
    plugins: [
      babel(),
    ],
  },
]
