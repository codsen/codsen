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
      name: 'astCompare',
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
      'check-types-mini',
      'matcher',
      'lodash.clonedeep',
      'lodash.pullall',
      'posthtml-ast-contains-only-empty-space',
      'type-detect',
    ],
    plugins: [
      babel(),
    ],
  },


  // util.js needs transpiling as well:
  {
    input: 'src/util.js',
    output: [
      { file: 'dist/util.cjs.js', format: 'cjs' },
    ],
    external: [
      'type-detect',
    ],
    plugins: [
      babel(),
    ],
  },

]
