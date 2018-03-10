import builtins from 'rollup-plugin-node-builtins'
import babel from 'rollup-plugin-babel'
import json from 'rollup-plugin-json'
import pkg from './package.json'

export default [
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
      'ast-contains-only-empty-space',
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
