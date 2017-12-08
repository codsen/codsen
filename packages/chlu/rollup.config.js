import builtins from 'rollup-plugin-node-builtins'
import resolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
import uglify from 'rollup-plugin-uglify'
import babel from 'rollup-plugin-babel'
import json from 'rollup-plugin-json'
import { minify } from 'uglify-es'
import pkg from './package.json'

export default [
  // browser-friendly UMD build
  {
    input: 'src/main.js',
    output: {
      file: pkg.browser,
      format: 'umd',
      name: 'chlu',
    },
    plugins: [
      builtins(),
      json(),
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
      'dehumanize-date',
      'easy-replace',
      'emoji-regex',
      'get-pkg-repo',
      'is-natural-number',
      'just-insert',
      'lodash.clonedeep',
      'lodash.includes',
      'lodash.min',
      'lodash.reverse',
      'lodash.trim',
      'posthtml-ast-contains-only-empty-space',
      'semver-compare',
      'split-lines',
    ],
    plugins: [
      builtins(),
      json(),
      babel(),
    ],
  },

  // util.js needs transpiling as well, used for testing-only.
  {
    input: 'src/util.js',
    output: [
      { file: 'dist/util.cjs.js', format: 'cjs' },
    ],
    external: [
      'semver-compare',
      'lodash.clonedeep',
      'is-natural-number',
      'lodash.trim',
      'easy-replace',
      'emoji-regex',
    ],
    plugins: [
      builtins(),
      json(),
      babel(),
    ],
  },
]
