import _import from "eslint-plugin-import";
import n from "eslint-plugin-n";
import preferLet from "eslint-plugin-prefer-let";
import jsxA11Y from "eslint-plugin-jsx-a11y";
import jest from "eslint-plugin-jest";
import rowNum from "eslint-plugin-row-num";
import testNum from "eslint-plugin-test-num";
import prettier from "eslint-plugin-prettier";
import { fixupPluginRules } from "@eslint/compat";
import globals from "globals";
import typescriptEslint from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
import path from "node:path";
import { fileURLToPath } from "node:url";
import js from "@eslint/js";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname2 = path.dirname(__filename);
const compat = new FlatCompat({
  baseDirectory: __dirname2,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
});

const files = ["**/*.ts", "**/*.js"];

export default [
  {
    ignores: [
      "**/eslint-plugin-row-num/rules/utils/**/*",
      "**/dist/**/*",
      "**/tap/**/*",
      "**/types/**/*",
      "**/perf-ref.umd.js",
      "**/perf-ref.esm.js",
    ],
  },
  ...compat.extends(
    "eslint:recommended",
    "plugin:n/recommended",
    "plugin:jsx-a11y/recommended",
    "plugin:prettier/recommended",
  ),
  {
    plugins: {
      import: fixupPluginRules(_import),
      n,
      "prefer-let": preferLet,
      "jsx-a11y": jsxA11Y,
      jest,
      "row-num": rowNum,
      "test-num": testNum,
      prettier,
    },

    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },

      ecmaVersion: "latest",
      sourceType: "module",
    },

    settings: {
      "import/parsers": {
        "@typescript-eslint/parser": [".ts", ".tsx"],
      },

      "import/resolver": {
        typescript: {
          alwaysTryTypes: true,
          project: ["packages/*/tsconfig.json", "data/tsconfig.json"],
        },
      },
    },

    rules: {
      quotes: [
        "error",
        "double",
        {
          avoidEscape: true,
        },
      ],

      "n/no-unsupported-features/node-builtins": [
        "error",
        {
          ignores: ["worker_threads"],
        },
      ],

      "n/no-unsupported-features/es-builtins": "error",

      "n/no-unsupported-features/es-syntax": [
        "error",
        {
          ignores: ["modules", "dynamicImport"],
        },
      ],

      "n/no-unpublished-import": "off",
      "n/no-unpublished-require": "error",
      "n/no-extraneous-require": "error",
      "n/no-missing-require": "error",
      "n/global-require": "error",
      "prefer-let/prefer-let": "error",
      "import/newline-after-import": "error",
      "import/order": "off",
      "array-callback-return": "off",
      "consistent-return": "off",
      "no-console": "off",
      "prefer-const": "off",
      "no-nested-ternary": "off",
      "row-num/correct-row-num": "error",
      "test-num/correct-test-num": "error",
      "import/extensions": "off",
      "no-shadow": "off",
      "@typescript-eslint/no-shadow": ["error"],
      "@typescript-eslint/prefer-optional-chain": "off",
      "@typescript-eslint/no-redeclare": "off",
      "@typescript-eslint/require-array-sort-compare": "off",
      "n/shebang": "off",
      "n/no-missing-import": "off",
      "import/no-unresolved": "error",
    },
  },
  ...compat
    .extends(
      "plugin:@typescript-eslint/recommended",
      "plugin:prettier/recommended",
    )
    .map((config) => ({
      ...config,
      files,
    })),
  {
    files,

    plugins: {
      "@typescript-eslint": typescriptEslint,
    },

    languageOptions: {
      parser: tsParser,
      ecmaVersion: 5,
      sourceType: "script",

      parserOptions: {
        tsconfigRootDir: "/Users/royrevelt/Documents/__PROJECTS/_____mono",
        project: ["./tsconfig.base.json", "./packages/*/tsconfig.json"],
      },
    },

    rules: {
      "@typescript-eslint/no-unnecessary-boolean-literal-compare": "error",
      "@typescript-eslint/no-non-null-asserted-optional-chain": "error",
      "@typescript-eslint/no-unnecessary-type-assertion": "error",
      "@typescript-eslint/adjacent-overload-signatures": "error",
      "@typescript-eslint/no-confusing-void-expression": "error",
      "@typescript-eslint/require-array-sort-compare": "off",
      "@typescript-eslint/prefer-namespace-keyword": "error",
      "@typescript-eslint/restrict-plus-operands": "error",
      "@typescript-eslint/no-useless-constructor": "error",
      "@typescript-eslint/no-dupe-class-members": "error",

      "@typescript-eslint/no-use-before-define": [
        "error",
        {
          functions: false,
          classes: false,
          variables: false,
        },
      ],

      "@typescript-eslint/no-empty-interface": "error",
      "@typescript-eslint/unified-signatures": "error",
      "@typescript-eslint/no-invalid-this": "error",
      "@typescript-eslint/no-for-in-array": "error",
      "@typescript-eslint/no-var-requires": "error",
      "@typescript-eslint/await-thenable": "error",
      "@typescript-eslint/no-unused-vars": "error",
      "@typescript-eslint/no-redeclare": "error",
      "@typescript-eslint/no-redeclare": "off",
      "@typescript-eslint/no-shadow": "error",

      "@typescript-eslint/dot-notation": [
        "error",
        {
          allowKeywords: true,
        },
      ],

      "@typescript-eslint/no-unused-expressions": [
        "error",
        {
          allowShortCircuit: true,
          allowTernary: true,
          allowTaggedTemplates: true,
        },
      ],

      "@typescript-eslint/array-type": "error",
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/prefer-optional-chain": "error",
      "@typescript-eslint/require-array-sort-compare": "error",
      "@typescript-eslint/no-unnecessary-condition": "off",
      "@typescript-eslint/explicit-function-return-type": "off",
      "@typescript-eslint/restrict-template-expressions": "off",
      "no-useless-constructor": "off",
      "no-unused-expressions": "off",
      "no-dupe-class-members": "off",
      "no-use-before-define": "off",
      "object-curly-spacing": "off",
      "func-callspacing": "off",
      "no-invalid-this": "off",
      "no-unused-vars": "off",
      "prefer-const": "off",
      "no-redeclare": "off",
      "dot-notation": "off",
      "no-shadow": "off",
      "no-undef": "off",
    },
  },
  {
    files: ["**/test/**/*.+(js|ts)?(x)", "**/*.{spec,test}.+(js|ts)?(x)"],

    rules: {
      "jest/consistent-test-it": "off",
      "jest/expect-expect": "off",
      "jest/lowercase-name": "off",
      "jest/max-nested-describe": "error",
      "jest/no-alias-methods": "off",
      "jest/no-commented-out-tests": "warn",
      "jest/no-conditional-expect": "error",
      "jest/no-deprecated-functions": "error",
      "jest/no-disabled-tests": "warn",
      "jest/no-done-callback": "error",
      "jest/no-duplicate-hooks": "off",
      "jest/no-export": "error",
      "jest/no-focused-tests": "error",
      "jest/no-hooks": "off",
      "jest/no-identical-title": "error",
      "jest/no-if": "off",
      "jest/no-interpolation-in-snapshots": "error",
      "jest/no-jasmine-globals": "off",

      "jest/no-large-snapshots": [
        "warn",
        {
          maxSize: 300,
        },
      ],

      "jest/no-mocks-import": "error",
      "jest/no-restricted-matchers": "off",
      "jest/no-standalone-expect": "off",
      "jest/no-test-prefixes": "error",
      "jest/no-test-return-statement": "off",
      "jest/no-truthy-falsy": "off",
      "jest/prefer-called-with": "error",
      "jest/prefer-expect-assertions": "off",
      "jest/prefer-hooks-on-top": "error",
      "jest/prefer-inline-snapshots": "off",
      "jest/prefer-spy-on": "off",
      "jest/prefer-strict-equal": "off",
      "jest/prefer-to-be-null": "off",
      "jest/prefer-to-be-undefined": "off",
      "jest/prefer-to-contain": "warn",
      "jest/prefer-to-have-length": "warn",
      "jest/prefer-todo": "warn",
      "jest/require-to-throw-message": "off",
      "jest/require-top-level-describe": "off",
      "jest/unbound-method": "off",
      "jest/valid-expect": "error",
      "jest/valid-expect-in-promise": "error",
      "jest/valid-title": "warn",
      "n/no-extraneous-import": "off",
      "@typescript-eslint/no-confusing-void-expression": "off",
      "@typescript-eslint/require-array-sort-compare": "off",
    },
  },
  {
    files: ["**/test/**/*.ts?(x)", "**/*.{spec,test}.ts?(x)"],

    rules: {
      "@typescript-eslint/unbound-method": "off",
      "jest/unbound-method": "error",
    },
  },
  {
    files: ["**/examples/**/*.*", "**/test_alt/**/*.*", "**/rollup.config.js"],

    rules: {
      "@typescript-eslint/no-confusing-void-expression": "off",
      "@typescript-eslint/no-unused-vars": "off",
      "@typescript-eslint/no-redeclare": "off",
      "n/no-extraneous-import": "off",
    },
  },
  {
    files: ["**/cli.*", "ops/**/*.js"],

    rules: {
      "@typescript-eslint/require-array-sort-compare": "off",
      "n/no-process-exit": "off",
    },
  },
];
