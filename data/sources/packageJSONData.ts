export const packageJSONData = {
  "perf-ref": {
    "description": "A mock program to normalise perf scores against it"
  },
  "tsd-extract-noesm": {
    "description": "Extract any definition from TS definitions file"
  },
  "lect": {
    "description": "Maintenance CLI for internal consumption"
  },
  "emlint": {
    "description": "Pluggable email template code linter"
  },
  "remark-conventional-commit-changelog-timeline": {
    "name": "remark-conventional-commit-changelog-timeline",
    "version": "3.1.17",
    "description": "Remark plugin to process Conventional Commits changelogs to be displayed in a timeline.",
    "keywords": [
      "unified",
      "remark",
      "remark-plugin",
      "plugin",
      "mdast",
      "markdown",
      "changelog",
      "conventional",
      "commits"
    ],
    "homepage": "https://codsen.com/os/remark-conventional-commit-changelog-timeline",
    "repository": {
      "type": "git",
      "url": "git+https://github.com/codsen/codsen.git",
      "directory": "packages/remark-conventional-commit-changelog-timeline"
    },
    "license": "MIT",
    "author": {
      "name": "Roy Revelt",
      "email": "roy@codsen.com",
      "url": "https://codsen.com"
    },
    "type": "module",
    "main": "dist/remark-conventional-commit-changelog-timeline.cjs.js",
    "types": "types/index.d.ts",
    "scripts": {
      "build": "node '../../ops/scripts/esbuild.js' && node '../../ops/scripts/fix-cjs.js' && npm run dts",
      "cjs-off": "node '../../ops/scripts/cjs-off.js'",
      "cjs-on": "node '../../ops/scripts/cjs-on.js'",
      "dev": "DEV=true node '../../ops/scripts/esbuild.js' && npm run dts",
      "devtest": "c8 npm run unit && npm run examples && npm run lint",
      "dts": "rollup -c && npm run prettier -- 'types/index.d.ts' --write --log-level 'silent'",
      "examples": "node '../../ops/scripts/run-examples.js'",
      "lect": "node '../../ops/lect/lect.js' && npm run prettier -- 'README.md' '.all-contributorsrc' --write --log-level 'silent'",
      "letspublish": "npm publish || :",
      "lint": "eslint . --fix",
      "perf": "echo 'skip perf'",
      "prep": "echo 'ready'",
      "prettier": "prettier",
      "prettier:format": "npm run prettier -- --write '**/*.{ts,tsx,md}' --no-error-on-unmatched-pattern --log-level 'silent'",
      "pretest": "npm run lect && npm run build",
      "test": "npm run devtest",
      "unit": "uvu test"
    },
    "engines": {
      "node": ">=14.18.0"
    },
    "c8": {
      "check-coverage": true,
      "exclude": [
        "**/test/**/*.*"
      ],
      "lines": 100
    },
    "lect": {
      "licence": {
        "extras": [
          ""
        ]
      },
      "various": {}
    },
    "dependencies": {
      "@types/hast": "^3.0.4",
      "hast-util-raw": "^9.1.0",
      "object-delete-key": "^4.0.30",
      "semver-regex": "^4.0.5",
      "unified": "^11.0.5",
      "unist-builder": "^4.0.0",
      "unist-util-visit": "^5.0.0"
    }
  },
  "array-of-arrays-sort-by-col": {
    "description": "Sort array of arrays by column, rippling the sorting outwards from that column"
  },
  "bitbucket-slug": {
    "description": "Generate BitBucket readme header anchor slug URLs. Unofficial, covers whole ASCII and a bit beyond"
  },
  "codsen-parser": {
    "description": "Parser aiming at broken or mixed code, especially HTML & CSS"
  },
  "codsen-tokenizer": {
    "description": "HTML and CSS lexer aimed at code with fatal errors, accepts mixed coding languages"
  },
  "easy-replace": {
    "description": "Replace strings with optional lookarounds, but without regexes"
  },
  "email-homey": {
    "description": "Generate homepage in the BrowserSync root with links/screenshots to all your email templates"
  },
  "helga": {
    "description": "Your next best friend when editing complex nested code"
  },
  "lerna-link-dep": {
    "description": "Like lerna add but does just the symlinking, works on CLI bins too"
  },
  "line-column-mini": {
    "description": "Convert string index to line-column position"
  },
  "ranges-offset": {
    "description": "Increment or decrement each index in every range"
  },
  "seo-editor": {
    "description": "Copywriting keyword to-do list automation"
  },
  "string-bionic-split": {
    "description": "Calculate a word string split position index for later highlighting"
  },
  "string-overlap-one-on-another": {
    "description": "Lay one string on top of another, with an optional offset"
  },
  "string-truncator": {
    "description": "Over-engineered string truncation for web UI's"
  },
  "stristri": {
    "description": "Extracts or deletes HTML, CSS, text and/or templating tags from string"
  },
  "tap-parse-string-to-object": {
    "description": "Parses raw Tap: string-to-object or stream-to-a-promise-of-an-object"
  },
  "all-named-html-entities": {
    "name": "all-named-html-entities",
    "version": "3.0.11",
    "description": "List of all named HTML entities",
    "keywords": [
      "all",
      "array",
      "encoded",
      "entities",
      "entity",
      "existing",
      "html",
      "list",
      "named",
      "xhtml"
    ],
    "homepage": "https://codsen.com/os/all-named-html-entities",
    "repository": {
      "type": "git",
      "url": "git+https://github.com/codsen/codsen.git",
      "directory": "packages-external/all-named-html-entities"
    },
    "license": "MIT",
    "author": {
      "name": "Roy Revelt",
      "email": "roy@codsen.com",
      "url": "https://codsen.com"
    },
    "type": "module",
    "exports": {
      "types": "./types/index.d.ts",
      "script": "./dist/all-named-html-entities.umd.js",
      "default": "./dist/all-named-html-entities.esm.js"
    },
    "types": "types/index.d.ts",
    "scripts": {
      "build": "node '../../ops/scripts/esbuild.js' && npm run dts",
      "cjs-off": "exit 0",
      "cjs-on": "exit 0",
      "dev": "DEV=true node '../../ops/scripts/esbuild.js' && npm run dts",
      "devtest": "c8 npm run unit && npm run examples && npm run lint",
      "dts": "rollup -c && npm run prettier -- 'types/index.d.ts' --write --log-level 'silent'",
      "examples": "node '../../ops/scripts/run-examples.js'",
      "lect": "node '../../ops/lect/lect.js' && npm run prettier -- 'README.md' '.all-contributorsrc' 'rollup.config.js' --write",
      "letspublish": "npm publish || :",
      "lint": "eslint . --fix",
      "perf": "node perf/check.js",
      "prep": "echo 'ready'",
      "prettier": "prettier",
      "prettier:format": "npm run prettier -- --write '**/*.{ts,tsx,md}' --no-error-on-unmatched-pattern --log-level 'silent'",
      "pretest": "npm run lect && npm run build",
      "test": "npm run devtest",
      "unit": "uvu test"
    },
    "engines": {
      "node": ">=14.18.0"
    },
    "c8": {
      "check-coverage": true,
      "exclude": [
        "**/test/**/*.*"
      ],
      "lines": 100
    },
    "lect": {
      "licence": {
        "extras": [
          ""
        ]
      }
    }
  },
  "array-group-str-omit-num-char": {
    "name": "array-group-str-omit-num-char",
    "version": "6.0.20",
    "description": "Groups array of strings by omitting number characters",
    "keywords": [
      "array",
      "character",
      "column",
      "extract",
      "group",
      "grouping",
      "letter",
      "number",
      "omit",
      "same",
      "similar"
    ],
    "homepage": "https://codsen.com/os/array-group-str-omit-num-char",
    "repository": {
      "type": "git",
      "url": "git+https://github.com/codsen/codsen.git",
      "directory": "packages/array-group-str-omit-num-char"
    },
    "license": "MIT",
    "author": {
      "name": "Roy Revelt",
      "email": "roy@codsen.com",
      "url": "https://codsen.com"
    },
    "type": "module",
    "exports": {
      "types": "./types/index.d.ts",
      "script": "./dist/array-group-str-omit-num-char.umd.js",
      "default": "./dist/array-group-str-omit-num-char.esm.js"
    },
    "types": "types/index.d.ts",
    "scripts": {
      "build": "node '../../ops/scripts/esbuild.js' && npm run dts",
      "cjs-off": "exit 0",
      "cjs-on": "exit 0",
      "dev": "DEV=true node '../../ops/scripts/esbuild.js' && npm run dts",
      "devtest": "c8 npm run unit && npm run examples && npm run lint",
      "dts": "rollup -c && npm run prettier -- 'types/index.d.ts' --write --log-level 'silent'",
      "examples": "node '../../ops/scripts/run-examples.js'",
      "lect": "node '../../ops/lect/lect.js' && npm run prettier -- 'README.md' '.all-contributorsrc' 'rollup.config.js' --write",
      "letspublish": "npm publish || :",
      "lint": "eslint . --fix",
      "perf": "node perf/check.js",
      "prep": "echo 'ready'",
      "prettier": "prettier",
      "prettier:format": "npm run prettier -- --write '**/*.{ts,tsx,md}' --no-error-on-unmatched-pattern --log-level 'silent'",
      "pretest": "npm run lect && npm run build",
      "test": "npm run devtest",
      "unit": "uvu test"
    },
    "engines": {
      "node": ">=14.18.0"
    },
    "c8": {
      "check-coverage": true,
      "exclude": [
        "**/test/**/*.*"
      ],
      "lines": 100
    },
    "lect": {
      "licence": {
        "extras": [
          ""
        ]
      }
    },
    "dependencies": {
      "codsen-utils": "^1.6.8",
      "ranges-apply": "^7.0.20"
    }
  },
  "array-includes-with-glob": {
    "name": "array-includes-with-glob",
    "version": "5.0.13",
    "description": "Like _.includes but with wildcards",
    "keywords": [
      "array",
      "arrays",
      "asterisk",
      "contains",
      "glob",
      "globby",
      "has",
      "include",
      "includes",
      "inclues",
      "instance",
      "pattern",
      "string",
      "wildcard"
    ],
    "homepage": "https://codsen.com/os/array-includes-with-glob",
    "repository": {
      "type": "git",
      "url": "git+https://github.com/codsen/codsen.git",
      "directory": "packages/array-includes-with-glob"
    },
    "license": "MIT",
    "author": {
      "name": "Roy Revelt",
      "email": "roy@codsen.com",
      "url": "https://codsen.com"
    },
    "type": "module",
    "exports": {
      "types": "./types/index.d.ts",
      "script": "./dist/array-includes-with-glob.umd.js",
      "default": "./dist/array-includes-with-glob.esm.js"
    },
    "types": "types/index.d.ts",
    "scripts": {
      "build": "node '../../ops/scripts/esbuild.js' && npm run dts",
      "cjs-off": "exit 0",
      "cjs-on": "exit 0",
      "dev": "DEV=true node '../../ops/scripts/esbuild.js' && npm run dts",
      "devtest": "c8 npm run unit && npm run examples && npm run lint",
      "dts": "rollup -c && npm run prettier -- 'types/index.d.ts' --write --log-level 'silent'",
      "examples": "node '../../ops/scripts/run-examples.js'",
      "lect": "node '../../ops/lect/lect.js' && npm run prettier -- 'README.md' '.all-contributorsrc' 'rollup.config.js' --write",
      "letspublish": "npm publish || :",
      "lint": "eslint . --fix",
      "perf": "node perf/check.js",
      "prep": "echo 'ready'",
      "prettier": "prettier",
      "prettier:format": "npm run prettier -- --write '**/*.{ts,tsx,md}' --no-error-on-unmatched-pattern --log-level 'silent'",
      "pretest": "npm run lect && npm run build",
      "test": "npm run devtest",
      "unit": "uvu test"
    },
    "engines": {
      "node": ">=14.18.0"
    },
    "c8": {
      "check-coverage": true,
      "exclude": [
        "**/test/**/*.*"
      ],
      "lines": 100
    },
    "lect": {
      "licence": {
        "extras": [
          ""
        ]
      }
    },
    "dependencies": {
      "matcher": "^5.0.0"
    }
  },
  "array-of-arrays-into-ast": {
    "name": "array-of-arrays-into-ast",
    "version": "4.0.23",
    "description": "Turns an array of arrays of data into a nested tree of plain objects",
    "keywords": [
      "array",
      "ast",
      "from",
      "generate",
      "into",
      "nested",
      "object",
      "plain",
      "put",
      "turn"
    ],
    "homepage": "https://codsen.com/os/array-of-arrays-into-ast",
    "repository": {
      "type": "git",
      "url": "git+https://github.com/codsen/codsen.git",
      "directory": "packages/array-of-arrays-into-ast"
    },
    "license": "MIT",
    "author": {
      "name": "Roy Revelt",
      "email": "roy@codsen.com",
      "url": "https://codsen.com"
    },
    "type": "module",
    "exports": {
      "types": "./types/index.d.ts",
      "script": "./dist/array-of-arrays-into-ast.umd.js",
      "default": "./dist/array-of-arrays-into-ast.esm.js"
    },
    "types": "types/index.d.ts",
    "scripts": {
      "build": "node '../../ops/scripts/esbuild.js' && npm run dts",
      "cjs-off": "exit 0",
      "cjs-on": "exit 0",
      "dev": "DEV=true node '../../ops/scripts/esbuild.js' && npm run dts",
      "devtest": "c8 npm run unit && npm run examples && npm run lint",
      "dts": "rollup -c && npm run prettier -- 'types/index.d.ts' --write --log-level 'silent'",
      "examples": "node '../../ops/scripts/run-examples.js'",
      "lect": "node '../../ops/lect/lect.js' && npm run prettier -- 'README.md' '.all-contributorsrc' 'rollup.config.js' --write",
      "letspublish": "npm publish || :",
      "lint": "eslint . --fix",
      "perf": "node perf/check.js",
      "prep": "echo 'ready'",
      "prettier": "prettier",
      "prettier:format": "npm run prettier -- --write '**/*.{ts,tsx,md}' --no-error-on-unmatched-pattern --log-level 'silent'",
      "pretest": "npm run lect && npm run build",
      "test": "npm run devtest",
      "unit": "uvu test"
    },
    "engines": {
      "node": ">=14.18.0"
    },
    "c8": {
      "check-coverage": true,
      "exclude": [
        "**/test/**/*.*"
      ],
      "lines": 100
    },
    "lect": {
      "licence": {
        "extras": [
          ""
        ]
      }
    },
    "dependencies": {
      "check-types-mini": "^8.0.23",
      "object-merge-advanced": "^14.0.22"
    }
  },
  "array-pull-all-with-glob": {
    "name": "array-pull-all-with-glob",
    "version": "7.0.13",
    "description": "Like _.pullAll but with globs (wildcards)",
    "keywords": [
      "array",
      "delete",
      "element",
      "from",
      "glob",
      "globby",
      "pattern",
      "pulal",
      "pulall",
      "pull",
      "pullal",
      "pullall",
      "remove",
      "whitelist",
      "matcher"
    ],
    "homepage": "https://codsen.com/os/array-pull-all-with-glob",
    "repository": {
      "type": "git",
      "url": "git+https://github.com/codsen/codsen.git",
      "directory": "packages/array-pull-all-with-glob"
    },
    "license": "MIT",
    "author": {
      "name": "Roy Revelt",
      "email": "roy@codsen.com",
      "url": "https://codsen.com"
    },
    "type": "module",
    "exports": {
      "types": "./types/index.d.ts",
      "script": "./dist/array-pull-all-with-glob.umd.js",
      "default": "./dist/array-pull-all-with-glob.esm.js"
    },
    "types": "types/index.d.ts",
    "scripts": {
      "build": "node '../../ops/scripts/esbuild.js' && npm run dts",
      "cjs-off": "exit 0",
      "cjs-on": "exit 0",
      "dev": "DEV=true node '../../ops/scripts/esbuild.js' && npm run dts",
      "devtest": "c8 npm run unit && npm run examples && npm run lint",
      "dts": "rollup -c && npm run prettier -- 'types/index.d.ts' --write --log-level 'silent'",
      "examples": "node '../../ops/scripts/run-examples.js'",
      "lect": "node '../../ops/lect/lect.js' && npm run prettier -- 'README.md' '.all-contributorsrc' 'rollup.config.js' --write",
      "letspublish": "npm publish || :",
      "lint": "eslint . --fix",
      "perf": "node perf/check.js",
      "prep": "echo 'ready'",
      "prettier": "prettier",
      "prettier:format": "npm run prettier -- --write '**/*.{ts,tsx,md}' --no-error-on-unmatched-pattern --log-level 'silent'",
      "pretest": "npm run lect && npm run build",
      "test": "npm run devtest",
      "unit": "uvu test"
    },
    "engines": {
      "node": ">=14.18.0"
    },
    "c8": {
      "check-coverage": true,
      "exclude": [
        "**/test/**/*.*"
      ],
      "lines": 100
    },
    "lect": {
      "licence": {
        "extras": [
          ""
        ]
      }
    },
    "dependencies": {
      "matcher": "^5.0.0"
    }
  },
  "arrayiffy-if-string": {
    "name": "arrayiffy-if-string",
    "version": "5.0.10",
    "description": "Put non-empty strings into arrays, turn empty-ones into empty arrays. Bypass everything else.",
    "keywords": [
      "api",
      "array",
      "arrayiffy",
      "cast",
      "if",
      "input",
      "into",
      "only",
      "string",
      "stringify",
      "turn",
      "validate",
      "validation"
    ],
    "homepage": "https://codsen.com/os/arrayiffy-if-string",
    "repository": {
      "type": "git",
      "url": "git+https://github.com/codsen/codsen.git",
      "directory": "packages/arrayiffy-if-string"
    },
    "license": "MIT",
    "author": {
      "name": "Roy Revelt",
      "email": "roy@codsen.com",
      "url": "https://codsen.com"
    },
    "type": "module",
    "exports": {
      "types": "./types/index.d.ts",
      "script": "./dist/arrayiffy-if-string.umd.js",
      "default": "./dist/arrayiffy-if-string.esm.js"
    },
    "types": "types/index.d.ts",
    "scripts": {
      "build": "node '../../ops/scripts/esbuild.js' && npm run dts",
      "cjs-off": "exit 0",
      "cjs-on": "exit 0",
      "dev": "DEV=true node '../../ops/scripts/esbuild.js' && npm run dts",
      "devtest": "c8 npm run unit && npm run examples && npm run lint",
      "dts": "rollup -c && npm run prettier -- 'types/index.d.ts' --write --log-level 'silent'",
      "examples": "node '../../ops/scripts/run-examples.js'",
      "lect": "node '../../ops/lect/lect.js' && npm run prettier -- 'README.md' '.all-contributorsrc' 'rollup.config.js' --write",
      "letspublish": "npm publish || :",
      "lint": "eslint . --fix",
      "perf": "node perf/check.js",
      "prep": "echo 'ready'",
      "prettier": "prettier",
      "prettier:format": "npm run prettier -- --write '**/*.{ts,tsx,md}' --no-error-on-unmatched-pattern --log-level 'silent'",
      "pretest": "npm run lect && npm run build",
      "test": "npm run devtest",
      "unit": "uvu test"
    },
    "engines": {
      "node": ">=14.18.0"
    },
    "c8": {
      "check-coverage": true,
      "exclude": [
        "**/test/**/*.*"
      ],
      "lines": 100
    },
    "lect": {
      "licence": {
        "extras": [
          "",
          "Thanks to KRyan for types https://stackoverflow.com/a/71834598/3943954"
        ]
      }
    }
  },
  "ast-compare": {
    "name": "ast-compare",
    "version": "4.0.31",
    "description": "Compare anything: AST, objects, arrays, strings and nested thereof",
    "keywords": [
      "array",
      "ast",
      "compare",
      "equal",
      "html",
      "nested",
      "object",
      "parse",
      "parsed",
      "parser",
      "plain",
      "posthtml",
      "posthtml-tree",
      "posthtmltree",
      "subset",
      "tree",
      "xml"
    ],
    "homepage": "https://codsen.com/os/ast-compare",
    "repository": {
      "type": "git",
      "url": "git+https://github.com/codsen/codsen.git",
      "directory": "packages/ast-compare"
    },
    "license": "MIT",
    "author": {
      "name": "Roy Revelt",
      "email": "roy@codsen.com",
      "url": "https://codsen.com"
    },
    "type": "module",
    "exports": {
      "types": "./types/index.d.ts",
      "script": "./dist/ast-compare.umd.js",
      "default": "./dist/ast-compare.esm.js"
    },
    "types": "types/index.d.ts",
    "scripts": {
      "build": "node '../../ops/scripts/esbuild.js' && npm run dts",
      "cjs-off": "exit 0",
      "cjs-on": "exit 0",
      "dev": "DEV=true node '../../ops/scripts/esbuild.js' && npm run dts",
      "devtest": "c8 npm run unit && npm run examples && npm run lint",
      "dts": "rollup -c && npm run prettier -- 'types/index.d.ts' --write --log-level 'silent'",
      "examples": "node '../../ops/scripts/run-examples.js'",
      "lect": "node '../../ops/lect/lect.js' && npm run prettier -- 'README.md' '.all-contributorsrc' 'rollup.config.js' --write",
      "letspublish": "npm publish || :",
      "lint": "eslint . --fix",
      "perf": "node perf/check.js",
      "prep": "echo 'ready'",
      "prettier": "prettier",
      "prettier:format": "npm run prettier -- --write '**/*.{ts,tsx,md}' --no-error-on-unmatched-pattern --log-level 'silent'",
      "pretest": "npm run lect && npm run build",
      "test": "npm run devtest",
      "unit": "uvu test"
    },
    "engines": {
      "node": ">=14.18.0"
    },
    "c8": {
      "check-coverage": true,
      "exclude": [
        "**/test/**/*.*"
      ],
      "lines": 100
    },
    "lect": {
      "licence": {
        "extras": [
          ""
        ]
      }
    },
    "dependencies": {
      "ast-contains-only-empty-space": "^4.0.20",
      "codsen-utils": "^1.6.8",
      "matcher": "^5.0.0",
      "type-detect": "^4.1.0"
    },
    "devDependencies": {
      "@types/type-detect": "^4.0.3",
      "type-fest": "^4.41.0"
    }
  },
  "ast-contains-only-empty-space": {
    "name": "ast-contains-only-empty-space",
    "version": "4.0.20",
    "description": "Does AST contain only empty space?",
    "keywords": [
      "ast",
      "character",
      "contains",
      "empty",
      "has",
      "includes",
      "length",
      "nothing",
      "parse",
      "space",
      "trimmable",
      "white",
      "whitespace",
      "zero"
    ],
    "homepage": "https://codsen.com/os/ast-contains-only-empty-space",
    "repository": {
      "type": "git",
      "url": "git+https://github.com/codsen/codsen.git",
      "directory": "packages/ast-contains-only-empty-space"
    },
    "license": "MIT",
    "author": {
      "name": "Roy Revelt",
      "email": "roy@codsen.com",
      "url": "https://codsen.com"
    },
    "type": "module",
    "exports": {
      "types": "./types/index.d.ts",
      "script": "./dist/ast-contains-only-empty-space.umd.js",
      "default": "./dist/ast-contains-only-empty-space.esm.js"
    },
    "types": "types/index.d.ts",
    "scripts": {
      "build": "node '../../ops/scripts/esbuild.js' && npm run dts",
      "cjs-off": "exit 0",
      "cjs-on": "exit 0",
      "dev": "DEV=true node '../../ops/scripts/esbuild.js' && npm run dts",
      "devtest": "c8 npm run unit && npm run examples && npm run lint",
      "dts": "rollup -c && npm run prettier -- 'types/index.d.ts' --write --log-level 'silent'",
      "examples": "node '../../ops/scripts/run-examples.js'",
      "lect": "node '../../ops/lect/lect.js' && npm run prettier -- 'README.md' '.all-contributorsrc' 'rollup.config.js' --write",
      "letspublish": "npm publish || :",
      "lint": "eslint . --fix",
      "perf": "node perf/check.js",
      "prep": "echo 'ready'",
      "prettier": "prettier",
      "prettier:format": "npm run prettier -- --write '**/*.{ts,tsx,md}' --no-error-on-unmatched-pattern --log-level 'silent'",
      "pretest": "npm run lect && npm run build",
      "test": "npm run devtest",
      "unit": "uvu test"
    },
    "engines": {
      "node": ">=14.18.0"
    },
    "c8": {
      "check-coverage": true,
      "exclude": [
        "**/test/**/*.*"
      ],
      "lines": 100
    },
    "lect": {
      "licence": {
        "extras": [
          ""
        ]
      }
    },
    "dependencies": {
      "ast-monkey-traverse": "^4.0.20"
    }
  },
  "ast-deep-contains": {
    "name": "ast-deep-contains",
    "version": "5.0.24",
    "description": "Like t.same assert on array of objects, where element order doesn’t matter.",
    "keywords": [
      "array",
      "arrays",
      "assert",
      "assertion",
      "ast",
      "ava",
      "compare",
      "comparison",
      "deep",
      "function",
      "has",
      "helper",
      "nested",
      "node",
      "node-tap",
      "object",
      "objects",
      "shallow",
      "similar",
      "subsets",
      "tap",
      "tape",
      "test",
      "tests",
      "unit"
    ],
    "homepage": "https://codsen.com/os/ast-deep-contains",
    "repository": {
      "type": "git",
      "url": "git+https://github.com/codsen/codsen.git",
      "directory": "packages/ast-deep-contains"
    },
    "license": "MIT",
    "author": {
      "name": "Roy Revelt",
      "email": "roy@codsen.com",
      "url": "https://codsen.com"
    },
    "type": "module",
    "exports": {
      "types": "./types/index.d.ts",
      "script": "./dist/ast-deep-contains.umd.js",
      "default": "./dist/ast-deep-contains.esm.js"
    },
    "types": "types/index.d.ts",
    "scripts": {
      "build": "node '../../ops/scripts/esbuild.js' && npm run dts",
      "cjs-off": "exit 0",
      "cjs-on": "exit 0",
      "dev": "DEV=true node '../../ops/scripts/esbuild.js' && npm run dts",
      "devtest": "c8 npm run unit && npm run examples && npm run lint",
      "dts": "rollup -c && npm run prettier -- 'types/index.d.ts' --write --log-level 'silent'",
      "examples": "node '../../ops/scripts/run-examples.js'",
      "lect": "node '../../ops/lect/lect.js' && npm run prettier -- 'README.md' '.all-contributorsrc' 'rollup.config.js' --write",
      "letspublish": "npm publish || :",
      "lint": "eslint . --fix",
      "perf": "node perf/check.js",
      "prep": "echo 'ready'",
      "prettier": "prettier",
      "prettier:format": "npm run prettier -- --write '**/*.{ts,tsx,md}' --no-error-on-unmatched-pattern --log-level 'silent'",
      "pretest": "npm run lect && npm run build",
      "test": "npm run devtest",
      "unit": "uvu test"
    },
    "engines": {
      "node": ">=14.18.0"
    },
    "c8": {
      "check-coverage": true,
      "exclude": [
        "**/test/**/*.*"
      ],
      "lines": 100
    },
    "lect": {
      "licence": {
        "extras": [
          ""
        ]
      },
      "various": {}
    },
    "dependencies": {
      "@sindresorhus/is": "^7.0.2",
      "ast-monkey-traverse": "^4.0.20",
      "object-path": "^0.11.8"
    },
    "devDependencies": {
      "@types/object-path": "^0.11.4"
    }
  },
  "ast-delete-object": {
    "name": "ast-delete-object",
    "version": "4.0.30",
    "description": "Delete all plain objects in AST if they contain a certain key/value pair",
    "keywords": [
      "ast",
      "delete",
      "from",
      "html",
      "key",
      "object",
      "omit",
      "parse",
      "parsed",
      "parser",
      "plain",
      "posthtml",
      "posthtml-tree",
      "posthtmltree",
      "remove",
      "tree",
      "value",
      "xhtml",
      "xml"
    ],
    "homepage": "https://codsen.com/os/ast-delete-object",
    "repository": {
      "type": "git",
      "url": "git+https://github.com/codsen/codsen.git",
      "directory": "packages/ast-delete-object"
    },
    "license": "MIT",
    "author": {
      "name": "Roy Revelt",
      "email": "roy@codsen.com",
      "url": "https://codsen.com"
    },
    "type": "module",
    "exports": {
      "types": "./types/index.d.ts",
      "script": "./dist/ast-delete-object.umd.js",
      "default": "./dist/ast-delete-object.esm.js"
    },
    "types": "types/index.d.ts",
    "scripts": {
      "build": "node '../../ops/scripts/esbuild.js' && npm run dts",
      "cjs-off": "exit 0",
      "cjs-on": "exit 0",
      "dev": "DEV=true node '../../ops/scripts/esbuild.js' && npm run dts",
      "devtest": "c8 npm run unit && npm run examples && npm run lint",
      "dts": "rollup -c && npm run prettier -- 'types/index.d.ts' --write --log-level 'silent'",
      "examples": "node '../../ops/scripts/run-examples.js'",
      "lect": "node '../../ops/lect/lect.js' && npm run prettier -- 'README.md' '.all-contributorsrc' 'rollup.config.js' --write",
      "letspublish": "npm publish || :",
      "lint": "eslint . --fix",
      "perf": "node perf/check.js",
      "prep": "echo 'ready'",
      "prettier": "prettier",
      "prettier:format": "npm run prettier -- --write '**/*.{ts,tsx,md}' --no-error-on-unmatched-pattern --log-level 'silent'",
      "pretest": "npm run lect && npm run build",
      "test": "npm run devtest",
      "unit": "uvu test"
    },
    "engines": {
      "node": ">=14.18.0"
    },
    "c8": {
      "check-coverage": true,
      "exclude": [
        "**/test/**/*.*"
      ],
      "lines": 100
    },
    "lect": {
      "licence": {
        "extras": [
          ""
        ]
      }
    },
    "dependencies": {
      "ast-compare": "^4.0.31",
      "ast-monkey-traverse": "^4.0.20",
      "codsen-utils": "^1.6.8",
      "rfdc": "^1.4.1"
    }
  },
  "ast-get-object": {
    "name": "ast-get-object",
    "version": "4.0.30",
    "description": "Getter/setter for nested parsed HTML AST’s, querying objects by key/value pairs",
    "keywords": [
      "ast",
      "by",
      "edit",
      "get",
      "html",
      "key",
      "object",
      "parser",
      "plain",
      "posthtml",
      "posthtml-tree",
      "posthtmltree",
      "read",
      "set",
      "tree",
      "value",
      "write",
      "xhtml",
      "xml"
    ],
    "homepage": "https://codsen.com/os/ast-get-object",
    "repository": {
      "type": "git",
      "url": "git+https://github.com/codsen/codsen.git",
      "directory": "packages/ast-get-object"
    },
    "license": "MIT",
    "author": {
      "name": "Roy Revelt",
      "email": "roy@codsen.com",
      "url": "https://codsen.com"
    },
    "type": "module",
    "exports": {
      "types": "./types/index.d.ts",
      "script": "./dist/ast-get-object.umd.js",
      "default": "./dist/ast-get-object.esm.js"
    },
    "types": "types/index.d.ts",
    "scripts": {
      "build": "node '../../ops/scripts/esbuild.js' && npm run dts",
      "cjs-off": "exit 0",
      "cjs-on": "exit 0",
      "dev": "DEV=true node '../../ops/scripts/esbuild.js' && npm run dts",
      "devtest": "c8 npm run unit && npm run examples && npm run lint",
      "dts": "rollup -c && npm run prettier -- 'types/index.d.ts' --write --log-level 'silent'",
      "examples": "node '../../ops/scripts/run-examples.js'",
      "lect": "node '../../ops/lect/lect.js' && npm run prettier -- 'README.md' '.all-contributorsrc' 'rollup.config.js' --write",
      "letspublish": "npm publish || :",
      "lint": "eslint . --fix",
      "perf": "node perf/check.js",
      "prep": "echo 'ready'",
      "prettier": "prettier",
      "prettier:format": "npm run prettier -- --write '**/*.{ts,tsx,md}' --no-error-on-unmatched-pattern --log-level 'silent'",
      "pretest": "npm run lect && npm run build",
      "test": "npm run devtest",
      "unit": "uvu test"
    },
    "engines": {
      "node": ">=14.18.0"
    },
    "c8": {
      "check-coverage": true,
      "exclude": [
        "**/test/**/*.*"
      ],
      "lines": 100
    },
    "lect": {
      "licence": {
        "extras": [
          ""
        ]
      },
      "various": {}
    },
    "dependencies": {
      "ast-compare": "^4.0.31",
      "codsen-utils": "^1.6.8",
      "rfdc": "^1.4.1"
    }
  },
  "ast-get-values-by-key": {
    "name": "ast-get-values-by-key",
    "version": "5.0.22",
    "description": "Extract values and paths from AST by keys OR set them by keys",
    "keywords": [
      "ast",
      "by",
      "edit",
      "get",
      "html",
      "key",
      "object",
      "parse",
      "parsed",
      "parser",
      "posthtml",
      "posthtml-tree",
      "posthtmltree",
      "read",
      "set",
      "tree",
      "value",
      "write",
      "xhtml",
      "xml"
    ],
    "homepage": "https://codsen.com/os/ast-get-values-by-key",
    "repository": {
      "type": "git",
      "url": "git+https://github.com/codsen/codsen.git",
      "directory": "packages/ast-get-values-by-key"
    },
    "license": "MIT",
    "author": {
      "name": "Roy Revelt",
      "email": "roy@codsen.com",
      "url": "https://codsen.com"
    },
    "type": "module",
    "exports": {
      "types": "./types/index.d.ts",
      "script": "./dist/ast-get-values-by-key.umd.js",
      "default": "./dist/ast-get-values-by-key.esm.js"
    },
    "types": "types/index.d.ts",
    "scripts": {
      "build": "node '../../ops/scripts/esbuild.js' && npm run dts",
      "cjs-off": "exit 0",
      "cjs-on": "exit 0",
      "dev": "DEV=true node '../../ops/scripts/esbuild.js' && npm run dts",
      "devtest": "c8 npm run unit && npm run examples && npm run lint",
      "dts": "rollup -c && npm run prettier -- 'types/index.d.ts' --write --log-level 'silent'",
      "examples": "node '../../ops/scripts/run-examples.js'",
      "lect": "node '../../ops/lect/lect.js' && npm run prettier -- 'README.md' '.all-contributorsrc' 'rollup.config.js' --write",
      "letspublish": "npm publish || :",
      "lint": "eslint . --fix",
      "perf": "node perf/check.js",
      "prep": "echo 'ready'",
      "prettier": "prettier",
      "prettier:format": "npm run prettier -- --write '**/*.{ts,tsx,md}' --no-error-on-unmatched-pattern --log-level 'silent'",
      "pretest": "npm run lect && npm run build",
      "test": "npm run devtest",
      "unit": "uvu test"
    },
    "engines": {
      "node": ">=14.18.0"
    },
    "c8": {
      "check-coverage": true,
      "exclude": [
        "**/test/**/*.*"
      ],
      "lines": 100
    },
    "lect": {
      "licence": {
        "extras": [
          ""
        ]
      }
    },
    "dependencies": {
      "ast-monkey-traverse": "^4.0.20",
      "matcher": "^5.0.0",
      "rfdc": "^1.4.1"
    }
  },
  "ast-is-empty": {
    "name": "ast-is-empty",
    "version": "4.0.19",
    "description": "Find out, is nested array/object/string/AST tree is empty",
    "keywords": [
      "array",
      "ast",
      "blank",
      "contains",
      "empty",
      "html",
      "is",
      "nested",
      "no",
      "nothing",
      "object",
      "only",
      "parse",
      "parsed",
      "parser",
      "posthtml",
      "posthtml-tree",
      "posthtmltree",
      "string",
      "tree",
      "xml"
    ],
    "homepage": "https://codsen.com/os/ast-is-empty",
    "repository": {
      "type": "git",
      "url": "git+https://github.com/codsen/codsen.git",
      "directory": "packages/ast-is-empty"
    },
    "license": "MIT",
    "author": {
      "name": "Roy Revelt",
      "email": "roy@codsen.com",
      "url": "https://codsen.com"
    },
    "type": "module",
    "exports": {
      "types": "./types/index.d.ts",
      "script": "./dist/ast-is-empty.umd.js",
      "default": "./dist/ast-is-empty.esm.js"
    },
    "types": "types/index.d.ts",
    "scripts": {
      "build": "node '../../ops/scripts/esbuild.js' && npm run dts",
      "cjs-off": "exit 0",
      "cjs-on": "exit 0",
      "dev": "DEV=true node '../../ops/scripts/esbuild.js' && npm run dts",
      "devtest": "c8 npm run unit && npm run examples && npm run lint",
      "dts": "rollup -c && npm run prettier -- 'types/index.d.ts' --write --log-level 'silent'",
      "examples": "node '../../ops/scripts/run-examples.js'",
      "lect": "node '../../ops/lect/lect.js' && npm run prettier -- 'README.md' '.all-contributorsrc' 'rollup.config.js' --write",
      "letspublish": "npm publish || :",
      "lint": "eslint . --fix",
      "perf": "node perf/check.js",
      "prep": "echo 'ready'",
      "prettier": "prettier",
      "prettier:format": "npm run prettier -- --write '**/*.{ts,tsx,md}' --no-error-on-unmatched-pattern --log-level 'silent'",
      "pretest": "npm run lect && npm run build",
      "test": "npm run devtest",
      "unit": "uvu test"
    },
    "engines": {
      "node": ">=14.18.0"
    },
    "c8": {
      "check-coverage": true,
      "exclude": [
        "**/test/**/*.*"
      ],
      "lines": 100
    },
    "lect": {
      "licence": {
        "extras": [
          ""
        ]
      }
    },
    "dependencies": {
      "codsen-utils": "^1.6.8"
    }
  },
  "ast-loose-compare": {
    "name": "ast-loose-compare",
    "version": "4.0.20",
    "description": "Compare anything: AST, objects, arrays and strings",
    "keywords": [
      "array",
      "ast",
      "compare",
      "comparison",
      "equal",
      "html",
      "loose",
      "loosely",
      "lose",
      "object",
      "parser",
      "plain",
      "posthtml",
      "posthtml-tree",
      "posthtmltree",
      "subset",
      "tree",
      "xhtml",
      "xml"
    ],
    "homepage": "https://codsen.com/os/ast-loose-compare",
    "repository": {
      "type": "git",
      "url": "git+https://github.com/codsen/codsen.git",
      "directory": "packages/ast-loose-compare"
    },
    "license": "MIT",
    "author": {
      "name": "Roy Revelt",
      "email": "roy@codsen.com",
      "url": "https://codsen.com"
    },
    "type": "module",
    "exports": {
      "types": "./types/index.d.ts",
      "script": "./dist/ast-loose-compare.umd.js",
      "default": "./dist/ast-loose-compare.esm.js"
    },
    "types": "types/index.d.ts",
    "scripts": {
      "build": "node '../../ops/scripts/esbuild.js' && npm run dts",
      "cjs-off": "exit 0",
      "cjs-on": "exit 0",
      "dev": "DEV=true node '../../ops/scripts/esbuild.js' && npm run dts",
      "devtest": "c8 npm run unit && npm run examples && npm run lint",
      "dts": "rollup -c && npm run prettier -- 'types/index.d.ts' --write --log-level 'silent'",
      "examples": "node '../../ops/scripts/run-examples.js'",
      "lect": "node '../../ops/lect/lect.js' && npm run prettier -- 'README.md' '.all-contributorsrc' 'rollup.config.js' --write",
      "letspublish": "npm publish || :",
      "lint": "eslint . --fix",
      "perf": "node perf/check.js",
      "prep": "echo 'ready'",
      "prettier": "prettier",
      "prettier:format": "npm run prettier -- --write '**/*.{ts,tsx,md}' --no-error-on-unmatched-pattern --log-level 'silent'",
      "pretest": "npm run lect && npm run build",
      "test": "npm run devtest",
      "unit": "uvu test"
    },
    "engines": {
      "node": ">=14.18.0"
    },
    "c8": {
      "check-coverage": true,
      "exclude": [
        "**/test/**/*.*"
      ],
      "lines": 100
    },
    "lect": {
      "licence": {
        "extras": [
          ""
        ]
      }
    },
    "dependencies": {
      "ast-contains-only-empty-space": "^4.0.20",
      "codsen-utils": "^1.6.8"
    }
  },
  "ast-monkey": {
    "name": "ast-monkey",
    "version": "9.0.30",
    "description": "Traverse and edit AST",
    "keywords": [
      "ast",
      "by",
      "delete",
      "drop",
      "from",
      "helper",
      "html",
      "key",
      "monkey",
      "nested",
      "object",
      "parsed",
      "plain",
      "posthtml",
      "posthtml-tree",
      "posthtmltree",
      "traverse",
      "tree",
      "utility",
      "value",
      "xml"
    ],
    "homepage": "https://codsen.com/os/ast-monkey",
    "repository": {
      "type": "git",
      "url": "git+https://github.com/codsen/codsen.git",
      "directory": "packages/ast-monkey"
    },
    "license": "MIT",
    "author": {
      "name": "Roy Revelt",
      "email": "roy@codsen.com",
      "url": "https://codsen.com"
    },
    "type": "module",
    "exports": {
      "types": "./types/index.d.ts",
      "script": "./dist/ast-monkey.umd.js",
      "default": "./dist/ast-monkey.esm.js"
    },
    "types": "types/index.d.ts",
    "scripts": {
      "build": "node '../../ops/scripts/esbuild.js' && npm run dts",
      "cjs-off": "exit 0",
      "cjs-on": "exit 0",
      "dev": "DEV=true node '../../ops/scripts/esbuild.js' && npm run dts",
      "devtest": "c8 npm run unit && npm run examples && npm run lint",
      "dts": "rollup -c && npm run prettier -- 'types/index.d.ts' --write --log-level 'silent'",
      "examples": "node '../../ops/scripts/run-examples.js'",
      "lect": "node '../../ops/lect/lect.js' && npm run prettier -- 'README.md' '.all-contributorsrc' 'rollup.config.js' --write",
      "letspublish": "npm publish || :",
      "lint": "eslint . --fix",
      "perf": "node perf/check.js",
      "prep": "echo 'ready'",
      "prettier": "prettier",
      "prettier:format": "npm run prettier -- --write '**/*.{ts,tsx,md}' --no-error-on-unmatched-pattern --log-level 'silent'",
      "pretest": "npm run lect && npm run build",
      "test": "npm run devtest",
      "unit": "uvu test"
    },
    "engines": {
      "node": ">=14.18.0"
    },
    "c8": {
      "check-coverage": true,
      "exclude": [
        "**/test/**/*.*"
      ],
      "lines": 100
    },
    "lect": {
      "licence": {
        "extras": [
          ""
        ]
      }
    },
    "dependencies": {
      "ast-compare": "^4.0.31",
      "ast-monkey-traverse": "^4.0.20",
      "check-types-mini": "^8.0.23",
      "codsen-utils": "^1.6.8",
      "util-array-object-or-both": "^5.0.15"
    }
  },
  "ast-monkey-traverse": {
    "name": "ast-monkey-traverse",
    "version": "4.0.20",
    "description": "Utility library to traverse AST",
    "keywords": [
      "ast",
      "by",
      "delete",
      "drop",
      "from",
      "helper",
      "html",
      "key",
      "monkey",
      "nested",
      "object",
      "parsed",
      "plain",
      "posthtml",
      "posthtml-tree",
      "posthtmltree",
      "traverse",
      "tree",
      "utility",
      "value",
      "xml"
    ],
    "homepage": "https://codsen.com/os/ast-monkey-traverse",
    "repository": {
      "type": "git",
      "url": "git+https://github.com/codsen/codsen.git",
      "directory": "packages/ast-monkey-traverse"
    },
    "license": "MIT",
    "author": {
      "name": "Roy Revelt",
      "email": "roy@codsen.com",
      "url": "https://codsen.com"
    },
    "type": "module",
    "exports": {
      "types": "./types/index.d.ts",
      "script": "./dist/ast-monkey-traverse.umd.js",
      "default": "./dist/ast-monkey-traverse.esm.js"
    },
    "types": "types/index.d.ts",
    "scripts": {
      "build": "node '../../ops/scripts/esbuild.js' && npm run dts",
      "cjs-off": "exit 0",
      "cjs-on": "exit 0",
      "dev": "DEV=true node '../../ops/scripts/esbuild.js' && npm run dts",
      "devtest": "c8 npm run unit && npm run examples && npm run lint",
      "dts": "rollup -c && npm run prettier -- 'types/index.d.ts' --write --log-level 'silent'",
      "examples": "node '../../ops/scripts/run-examples.js'",
      "lect": "node '../../ops/lect/lect.js' && npm run prettier -- 'README.md' '.all-contributorsrc' 'rollup.config.js' --write",
      "letspublish": "npm publish || :",
      "lint": "eslint . --fix",
      "perf": "node perf/check.js",
      "prep": "echo 'ready'",
      "prettier": "prettier",
      "prettier:format": "npm run prettier -- --write '**/*.{ts,tsx,md}' --no-error-on-unmatched-pattern --log-level 'silent'",
      "pretest": "npm run lect && npm run build",
      "test": "npm run devtest",
      "unit": "uvu test"
    },
    "engines": {
      "node": ">=14.18.0"
    },
    "c8": {
      "check-coverage": true,
      "exclude": [
        "**/test/**/*.*"
      ],
      "lines": 100
    },
    "lect": {
      "licence": {
        "extras": [
          ""
        ]
      }
    },
    "dependencies": {
      "ast-monkey-util": "^3.0.10",
      "codsen-utils": "^1.6.8",
      "rfdc": "^1.4.1"
    },
    "devDependencies": {
      "deep-equal": "^2.2.3"
    }
  },
  "ast-monkey-traverse-with-lookahead": {
    "name": "ast-monkey-traverse-with-lookahead",
    "version": "4.0.19",
    "description": "Utility library to traverse AST, reports upcoming values",
    "keywords": [
      "ast",
      "by",
      "delete",
      "drop",
      "from",
      "helper",
      "html",
      "key",
      "lookahead",
      "monkey",
      "nested",
      "object",
      "parsed",
      "plain",
      "posthtml",
      "posthtml-tree",
      "posthtmltree",
      "traverse",
      "tree",
      "utility",
      "value",
      "xml"
    ],
    "homepage": "https://codsen.com/os/ast-monkey-traverse-with-lookahead",
    "repository": {
      "type": "git",
      "url": "git+https://github.com/codsen/codsen.git",
      "directory": "packages/ast-monkey-traverse-with-lookahead"
    },
    "license": "MIT",
    "author": {
      "name": "Roy Revelt",
      "email": "roy@codsen.com",
      "url": "codsen.com"
    },
    "type": "module",
    "exports": {
      "types": "./types/index.d.ts",
      "script": "./dist/ast-monkey-traverse-with-lookahead.umd.js",
      "default": "./dist/ast-monkey-traverse-with-lookahead.esm.js"
    },
    "types": "types/index.d.ts",
    "scripts": {
      "build": "node '../../ops/scripts/esbuild.js' && npm run dts",
      "cjs-off": "exit 0",
      "cjs-on": "exit 0",
      "dev": "DEV=true node '../../ops/scripts/esbuild.js' && npm run dts",
      "devtest": "c8 npm run unit && npm run examples && npm run lint",
      "dts": "rollup -c && npm run prettier -- 'types/index.d.ts' --write --log-level 'silent'",
      "examples": "node '../../ops/scripts/run-examples.js'",
      "lect": "node '../../ops/lect/lect.js' && npm run prettier -- 'README.md' '.all-contributorsrc' 'rollup.config.js' --write",
      "letspublish": "npm publish || :",
      "lint": "eslint . --fix",
      "perf": "node perf/check.js",
      "prep": "echo 'ready'",
      "prettier": "prettier",
      "prettier:format": "npm run prettier -- --write '**/*.{ts,tsx,md}' --no-error-on-unmatched-pattern --log-level 'silent'",
      "pretest": "npm run lect && npm run build",
      "test": "npm run devtest",
      "unit": "uvu test"
    },
    "engines": {
      "node": ">=14.18.0"
    },
    "c8": {
      "check-coverage": true,
      "exclude": [
        "**/test/**/*.*"
      ],
      "lines": 100
    },
    "lect": {
      "licence": {
        "extras": [
          ""
        ]
      },
      "various": {}
    },
    "dependencies": {
      "codsen-utils": "^1.6.8",
      "rfdc": "^1.4.1"
    }
  },
  "ast-monkey-util": {
    "name": "ast-monkey-util",
    "version": "3.0.10",
    "description": "Utility library of AST helper functions",
    "keywords": [
      "ast",
      "function",
      "helper",
      "html",
      "key",
      "nested",
      "object",
      "parsed",
      "parser",
      "plain",
      "posthtml",
      "posthtmltree",
      "traverse",
      "tree",
      "util",
      "utility"
    ],
    "homepage": "https://codsen.com/os/ast-monkey-util",
    "repository": {
      "type": "git",
      "url": "git+https://github.com/codsen/codsen.git",
      "directory": "packages/ast-monkey-util"
    },
    "license": "MIT",
    "author": {
      "name": "Roy Revelt",
      "email": "roy@codsen.com",
      "url": "https://codsen.com"
    },
    "type": "module",
    "exports": {
      "types": "./types/index.d.ts",
      "script": "./dist/ast-monkey-util.umd.js",
      "default": "./dist/ast-monkey-util.esm.js"
    },
    "types": "types/index.d.ts",
    "scripts": {
      "build": "node '../../ops/scripts/esbuild.js' && npm run dts",
      "cjs-off": "exit 0",
      "cjs-on": "exit 0",
      "dev": "DEV=true node '../../ops/scripts/esbuild.js' && npm run dts",
      "devtest": "c8 npm run unit && npm run examples && npm run lint",
      "dts": "rollup -c && npm run prettier -- 'types/index.d.ts' --write --log-level 'silent'",
      "examples": "node '../../ops/scripts/run-examples.js'",
      "lect": "node '../../ops/lect/lect.js' && npm run prettier -- 'README.md' '.all-contributorsrc' 'rollup.config.js' --write",
      "letspublish": "npm publish || :",
      "lint": "eslint . --fix",
      "perf": "node perf/check.js",
      "prep": "echo 'ready'",
      "prettier": "prettier",
      "prettier:format": "npm run prettier -- --write '**/*.{ts,tsx,md}' --no-error-on-unmatched-pattern --log-level 'silent'",
      "pretest": "npm run lect && npm run build",
      "test": "npm run devtest",
      "unit": "uvu test"
    },
    "engines": {
      "node": ">=14.18.0"
    },
    "c8": {
      "check-coverage": true,
      "exclude": [
        "**/test/**/*.*"
      ],
      "lines": 100
    },
    "lect": {
      "licence": {
        "extras": [
          ""
        ]
      }
    }
  },
  "charcode-is-valid-xml-name-character": {
    "name": "charcode-is-valid-xml-name-character",
    "version": "3.0.13",
    "description": "Does a given character belong to XML spec’s “Production 4 OR 4a” type (is acceptable for XML element’s name)",
    "keywords": [
      "4",
      "4a",
      "HTML",
      "XHTML",
      "character",
      "element",
      "letter",
      "name",
      "production",
      "regex",
      "requirement",
      "satisfies",
      "spec",
      "valid",
      "xml"
    ],
    "homepage": "https://codsen.com/os/charcode-is-valid-xml-name-character",
    "repository": {
      "type": "git",
      "url": "git+https://github.com/codsen/codsen.git",
      "directory": "packages/charcode-is-valid-xml-name-character"
    },
    "license": "MIT",
    "author": {
      "name": "Roy Revelt",
      "email": "roy@codsen.com",
      "url": "https://codsen.com"
    },
    "type": "module",
    "exports": {
      "types": "./types/index.d.ts",
      "script": "./dist/charcode-is-valid-xml-name-character.umd.js",
      "default": "./dist/charcode-is-valid-xml-name-character.esm.js"
    },
    "types": "types/index.d.ts",
    "scripts": {
      "build": "node '../../ops/scripts/esbuild.js' && npm run dts",
      "cjs-off": "exit 0",
      "cjs-on": "exit 0",
      "dev": "DEV=true node '../../ops/scripts/esbuild.js' && npm run dts",
      "devtest": "c8 npm run unit && npm run examples && npm run lint",
      "dts": "rollup -c && npm run prettier -- 'types/index.d.ts' --write --log-level 'silent'",
      "examples": "node '../../ops/scripts/run-examples.js'",
      "lect": "node '../../ops/lect/lect.js' && npm run prettier -- 'README.md' '.all-contributorsrc' 'rollup.config.js' --write",
      "letspublish": "npm publish || :",
      "lint": "eslint . --fix",
      "perf": "node perf/check.js",
      "prep": "echo 'ready'",
      "prettier": "prettier",
      "prettier:format": "npm run prettier -- --write '**/*.{ts,tsx,md}' --no-error-on-unmatched-pattern --log-level 'silent'",
      "pretest": "npm run lect && npm run build",
      "test": "npm run devtest",
      "unit": "uvu test"
    },
    "engines": {
      "node": ">=14.18.0"
    },
    "c8": {
      "check-coverage": true,
      "exclude": [
        "**/test/**/*.*"
      ],
      "lines": 100
    },
    "lect": {
      "licence": {
        "extras": [
          ""
        ]
      }
    },
    "dependencies": {
      "ranges-is-index-within": "^4.0.13"
    }
  },
  "check-types-mini": {
    "name": "check-types-mini",
    "version": "8.0.23",
    "description": "Validate options object",
    "keywords": [
      "compare",
      "deep",
      "difference",
      "keys",
      "match",
      "new",
      "no",
      "object",
      "plain",
      "schema",
      "unique",
      "validate"
    ],
    "homepage": "https://codsen.com/os/check-types-mini",
    "repository": {
      "type": "git",
      "url": "git+https://github.com/codsen/codsen.git",
      "directory": "packages/check-types-mini"
    },
    "license": "MIT",
    "author": {
      "name": "Roy Revelt",
      "email": "roy@codsen.com",
      "url": "https://codsen.com"
    },
    "type": "module",
    "exports": {
      "types": "./types/index.d.ts",
      "script": "./dist/check-types-mini.umd.js",
      "default": "./dist/check-types-mini.esm.js"
    },
    "types": "types/index.d.ts",
    "scripts": {
      "build": "node '../../ops/scripts/esbuild.js' && npm run dts",
      "cjs-off": "exit 0",
      "cjs-on": "exit 0",
      "dev": "DEV=true node '../../ops/scripts/esbuild.js' && npm run dts",
      "devtest": "c8 npm run unit && npm run examples && npm run lint",
      "dts": "rollup -c && npm run prettier -- 'types/index.d.ts' --write --log-level 'silent'",
      "examples": "node '../../ops/scripts/run-examples.js'",
      "lect": "node '../../ops/lect/lect.js' && npm run prettier -- 'README.md' '.all-contributorsrc' 'rollup.config.js' --write",
      "letspublish": "npm publish || :",
      "lint": "eslint . --fix",
      "perf": "node perf/check.js",
      "prep": "echo 'ready'",
      "prettier": "prettier",
      "prettier:format": "npm run prettier -- --write '**/*.{ts,tsx,md}' --no-error-on-unmatched-pattern --log-level 'silent'",
      "pretest": "npm run lect && npm run build",
      "test": "npm run devtest",
      "unit": "uvu test"
    },
    "engines": {
      "node": ">=14.18.0"
    },
    "c8": {
      "check-coverage": true,
      "exclude": [
        "**/test/**/*.*"
      ],
      "lines": 100
    },
    "lect": {
      "licence": {
        "extras": [
          ""
        ]
      }
    },
    "dependencies": {
      "arrayiffy-if-string": "^5.0.10",
      "ast-monkey-traverse": "^4.0.20",
      "codsen-utils": "^1.6.8",
      "matcher": "^5.0.0",
      "object-path": "^0.11.8",
      "type-detect": "^4.1.0"
    }
  },
  "codsen": {
    "name": "codsen",
    "version": "0.3.4",
    "description": "Codsen CLI",
    "keywords": [
      "codsen",
      "cli"
    ],
    "homepage": "https://codsen.com/os/codsen",
    "repository": {
      "type": "git",
      "url": "git+https://github.com/codsen/codsen.git",
      "directory": "packages/codsen"
    },
    "license": "MIT",
    "author": {
      "name": "Roy Revelt",
      "email": "roy@codsen.com",
      "url": "https://codsen.com"
    },
    "type": "module",
    "bin": {
      "codsen": "cli.js"
    },
    "scripts": {
      "build": "exit 0",
      "cjs-off": "exit 0",
      "cjs-on": "exit 0",
      "dev": "exit 0",
      "devtest": "npm run test",
      "dts": "exit 0",
      "examples": "exit 0",
      "lect": "node '../../ops/lect/lect.js'",
      "letspublish": "npm publish || :",
      "lint": "eslint . --fix",
      "perf": "exit 0",
      "prep": "echo 'ready'",
      "prettier": "prettier",
      "prettier:format": "npm run prettier -- --write '**/*.{js,md}' --no-error-on-unmatched-pattern --log-level 'silent'",
      "pretest": "exit 0",
      "test": "c8 npm run unit && npm run lint",
      "unit": "uvu test"
    },
    "engines": {
      "node": ">=18"
    },
    "c8": {
      "check-coverage": false,
      "exclude": [
        "**/test/**/*.*"
      ]
    },
    "lect": {
      "licence": {
        "extras": [
          ""
        ]
      }
    },
    "dependencies": {
      "meow": "^13.2.0",
      "update-notifier": "^7.3.1"
    }
  },
  "codsen-utils": {
    "name": "codsen-utils",
    "version": "1.6.8",
    "description": "Various utility functions",
    "keywords": [
      "codsen",
      "utility",
      "helpers"
    ],
    "homepage": "https://codsen.com/os/codsen-utils",
    "repository": {
      "type": "git",
      "url": "git+https://github.com/codsen/codsen.git",
      "directory": "packages/codsen-utils"
    },
    "license": "MIT",
    "author": {
      "name": "Roy Revelt",
      "email": "roy@codsen.com",
      "url": "https://codsen.com"
    },
    "type": "module",
    "exports": {
      "types": "./types/index.d.ts",
      "script": "./dist/codsen-utils.umd.js",
      "default": "./dist/codsen-utils.esm.js"
    },
    "types": "types/index.d.ts",
    "scripts": {
      "build": "node '../../ops/scripts/esbuild.js' && npm run dts",
      "cjs-off": "exit 0",
      "cjs-on": "exit 0",
      "dev": "DEV=true node '../../ops/scripts/esbuild.js' && npm run dts",
      "devtest": "c8 npm run unit && npm run examples && npm run lint",
      "dts": "rollup -c && npm run prettier -- 'types/index.d.ts' --write --log-level 'silent'",
      "examples": "node '../../ops/scripts/run-examples.js'",
      "lect": "node '../../ops/lect/lect.js' && npm run prettier -- 'README.md' '.all-contributorsrc' 'rollup.config.js' --write",
      "letspublish": "npm publish || :",
      "lint": "eslint . --fix",
      "perf": "node perf/check.js",
      "prep": "echo 'ready'",
      "prettier": "prettier",
      "prettier:format": "npm run prettier -- --write '**/*.{ts,tsx,md}' --no-error-on-unmatched-pattern --log-level 'silent'",
      "pretest": "npm run lect && npm run build",
      "test": "npm run devtest",
      "unit": "uvu test"
    },
    "engines": {
      "node": ">=14.18.0"
    },
    "c8": {
      "branches": 100,
      "check-coverage": true,
      "exclude": [
        "**/test/**/*.*"
      ],
      "functions": 100,
      "lines": 100
    },
    "lect": {
      "licence": {
        "extras": [
          ""
        ]
      }
    },
    "dependencies": {
      "rfdc": "^1.4.1"
    }
  },
  "color-shorthand-hex-to-six-digit": {
    "name": "color-shorthand-hex-to-six-digit",
    "version": "5.0.20",
    "description": "Convert shorthand hex color codes into full",
    "keywords": [
      "characters",
      "code",
      "codes",
      "color",
      "colour",
      "convert",
      "email",
      "hex",
      "hexadecimal",
      "long",
      "newsletters",
      "shorthand",
      "six"
    ],
    "homepage": "https://codsen.com/os/color-shorthand-hex-to-six-digit",
    "repository": {
      "type": "git",
      "url": "git+https://github.com/codsen/codsen.git",
      "directory": "packages/color-shorthand-hex-to-six-digit"
    },
    "license": "MIT",
    "author": {
      "name": "Roy Revelt",
      "email": "roy@codsen.com",
      "url": "https://codsen.com"
    },
    "type": "module",
    "exports": {
      "types": "./types/index.d.ts",
      "script": "./dist/color-shorthand-hex-to-six-digit.umd.js",
      "default": "./dist/color-shorthand-hex-to-six-digit.esm.js"
    },
    "types": "types/index.d.ts",
    "scripts": {
      "build": "node '../../ops/scripts/esbuild.js' && npm run dts",
      "cjs-off": "exit 0",
      "cjs-on": "exit 0",
      "dev": "DEV=true node '../../ops/scripts/esbuild.js' && npm run dts",
      "devtest": "c8 npm run unit && npm run examples && npm run lint",
      "dts": "rollup -c && npm run prettier -- 'types/index.d.ts' --write --log-level 'silent'",
      "examples": "node '../../ops/scripts/run-examples.js'",
      "lect": "node '../../ops/lect/lect.js' && npm run prettier -- 'README.md' '.all-contributorsrc' 'rollup.config.js' --write",
      "letspublish": "npm publish || :",
      "lint": "eslint . --fix",
      "perf": "node perf/check.js",
      "prep": "echo 'ready'",
      "prettier": "prettier",
      "prettier:format": "npm run prettier -- --write '**/*.{ts,tsx,md}' --no-error-on-unmatched-pattern --log-level 'silent'",
      "pretest": "npm run lect && npm run build",
      "test": "npm run devtest",
      "unit": "uvu test"
    },
    "engines": {
      "node": ">=14.18.0"
    },
    "c8": {
      "check-coverage": true,
      "exclude": [
        "**/test/**/*.*"
      ],
      "lines": 100
    },
    "lect": {
      "licence": {
        "extras": [
          ""
        ]
      }
    },
    "dependencies": {
      "codsen-utils": "^1.6.8",
      "hex-color-regex": "^1.1.0",
      "rfdc": "^1.4.1"
    },
    "devDependencies": {
      "@types/hex-color-regex": "^1.1.3"
    }
  },
  "csv-sort": {
    "name": "csv-sort",
    "version": "7.0.20",
    "description": "Sort double-entry bookkeeping CSV from internet banking",
    "keywords": [
      "accountancy",
      "accounting",
      "bank",
      "columns",
      "crunch",
      "csv",
      "file",
      "files",
      "fix",
      "lloyds",
      "missing",
      "patch",
      "pony",
      "rows",
      "sort"
    ],
    "homepage": "https://codsen.com/os/csv-sort",
    "repository": {
      "type": "git",
      "url": "git+https://github.com/codsen/codsen.git",
      "directory": "packages/csv-sort"
    },
    "license": "MIT",
    "author": {
      "name": "Roy Revelt",
      "email": "roy@codsen.com",
      "url": "https://codsen.com"
    },
    "type": "module",
    "exports": {
      "types": "./types/index.d.ts",
      "script": "./dist/csv-sort.umd.js",
      "default": "./dist/csv-sort.esm.js"
    },
    "types": "types/index.d.ts",
    "scripts": {
      "build": "node '../../ops/scripts/esbuild.js' && npm run dts",
      "cjs-off": "exit 0",
      "cjs-on": "exit 0",
      "dev": "DEV=true node '../../ops/scripts/esbuild.js' && npm run dts",
      "devtest": "c8 npm run unit && npm run examples && npm run lint",
      "dts": "rollup -c && npm run prettier -- 'types/index.d.ts' --write --log-level 'silent'",
      "examples": "node '../../ops/scripts/run-examples.js'",
      "lect": "node '../../ops/lect/lect.js' && npm run prettier -- 'README.md' '.all-contributorsrc' 'rollup.config.js' --write",
      "letspublish": "npm publish || :",
      "lint": "eslint . --fix",
      "perf": "node perf/check.js",
      "prep": "echo 'ready'",
      "prettier": "prettier",
      "prettier:format": "npm run prettier -- --write '**/*.{ts,tsx,md}' --no-error-on-unmatched-pattern --log-level 'silent'",
      "pretest": "npm run lect && npm run build",
      "test": "npm run devtest",
      "unit": "uvu test"
    },
    "engines": {
      "node": ">=14.18.0"
    },
    "c8": {
      "check-coverage": true,
      "exclude": [
        "**/test/**/*.*"
      ],
      "lines": 100
    },
    "lect": {
      "licence": {
        "extras": [
          "",
          "List of [currency signs](https://github.com/bengourley/currency-symbol-map) - Copyright © 2017 Ben Gourley - see its [BSD-2-Clause disclaimer](https://opensource.org/licenses/BSD-2-Clause)"
        ]
      }
    },
    "dependencies": {
      "@types/lodash-es": "^4.17.12",
      "csv-split-easy": "^7.0.20",
      "currency.js": "^2.0.4",
      "lodash-es": "^4.17.21"
    }
  },
  "csv-sort-cli": {
    "name": "csv-sort-cli",
    "version": "4.0.10",
    "description": "Command line app to sort double-entry CSVs coming from internet banking statements",
    "keywords": [
      "accountancy",
      "accounting",
      "bank",
      "columns",
      "crunch",
      "csv",
      "file",
      "files",
      "fix",
      "lloyds",
      "missing",
      "patch",
      "pony",
      "rows",
      "sort"
    ],
    "homepage": "https://codsen.com/os/csv-sort-cli",
    "repository": {
      "type": "git",
      "url": "git+https://github.com/codsen/codsen.git",
      "directory": "packages/csv-sort-cli"
    },
    "license": "MIT",
    "author": {
      "name": "Roy Revelt",
      "email": "roy@codsen.com",
      "url": "https://codsen.com"
    },
    "type": "module",
    "bin": {
      "csvsort": "cli.js",
      "sortcsv": "cli.js"
    },
    "scripts": {
      "build": "exit 0",
      "cjs-off": "exit 0",
      "cjs-on": "exit 0",
      "dev": "exit 0",
      "devtest": "npm run test",
      "dts": "exit 0",
      "examples": "exit 0",
      "lect": "node '../../ops/lect/lect.js'",
      "letspublish": "npm publish || :",
      "lint": "eslint . --fix",
      "perf": "exit 0",
      "prep": "echo 'ready'",
      "prettier": "prettier",
      "prettier:format": "npm run prettier -- --write '**/*.{js,md}' --no-error-on-unmatched-pattern --log-level 'silent'",
      "pretest": "exit 0",
      "test": "c8 npm run unit && npm run lint",
      "unit": "uvu test"
    },
    "engines": {
      "node": ">=18"
    },
    "c8": {
      "check-coverage": false,
      "exclude": [
        "**/test/**/*.*"
      ]
    },
    "lect": {
      "licence": {
        "extras": [
          ""
        ]
      }
    },
    "dependencies": {
      "@inquirer/prompts": "^7.6.0",
      "chalk": "^5.4.1",
      "codsen-utils": "^1.6.8",
      "csv-sort": "^7.0.20",
      "globby": "^14.1.0",
      "meow": "^13.2.0",
      "update-notifier": "^7.3.1"
    }
  },
  "csv-split-easy": {
    "name": "csv-split-easy",
    "version": "7.0.20",
    "description": "Splits the CSV string into array of arrays, each representing a row of columns",
    "keywords": [
      "add",
      "alt",
      "attributes",
      "clean",
      "email",
      "fill",
      "marketing",
      "missing",
      "newsletter",
      "parsing",
      "restore",
      "tags",
      "template",
      "templates"
    ],
    "homepage": "https://codsen.com/os/csv-split-easy",
    "repository": {
      "type": "git",
      "url": "git+https://github.com/codsen/codsen.git",
      "directory": "packages/csv-split-easy"
    },
    "license": "MIT",
    "author": {
      "name": "Roy Revelt",
      "email": "roy@codsen.com",
      "url": "https://codsen.com"
    },
    "type": "module",
    "exports": {
      "types": "./types/index.d.ts",
      "script": "./dist/csv-split-easy.umd.js",
      "default": "./dist/csv-split-easy.esm.js"
    },
    "types": "types/index.d.ts",
    "scripts": {
      "build": "node '../../ops/scripts/esbuild.js' && npm run dts",
      "cjs-off": "exit 0",
      "cjs-on": "exit 0",
      "dev": "DEV=true node '../../ops/scripts/esbuild.js' && npm run dts",
      "devtest": "c8 npm run unit && npm run examples && npm run lint",
      "dts": "rollup -c && npm run prettier -- 'types/index.d.ts' --write --log-level 'silent'",
      "examples": "node '../../ops/scripts/run-examples.js'",
      "lect": "node '../../ops/lect/lect.js' && npm run prettier -- 'README.md' '.all-contributorsrc' 'rollup.config.js' --write",
      "letspublish": "npm publish || :",
      "lint": "eslint . --fix",
      "perf": "node perf/check.js",
      "prep": "echo 'ready'",
      "prettier": "prettier",
      "prettier:format": "npm run prettier -- --write '**/*.{ts,tsx,md}' --no-error-on-unmatched-pattern --log-level 'silent'",
      "pretest": "npm run lect && npm run build",
      "test": "npm run devtest",
      "unit": "uvu test"
    },
    "engines": {
      "node": ">=14.18.0"
    },
    "c8": {
      "check-coverage": true,
      "exclude": [
        "**/test/**/*.*"
      ],
      "lines": 100
    },
    "lect": {
      "licence": {
        "extras": [
          ""
        ]
      }
    },
    "dependencies": {
      "string-remove-thousand-separators": "^7.0.20"
    }
  },
  "detect-is-it-html-or-xhtml": {
    "name": "detect-is-it-html-or-xhtml",
    "version": "6.0.13",
    "description": "Does the string resemble an HTML or XHTML (or neither)?",
    "keywords": [
      "check",
      "code",
      "detect",
      "doctype",
      "elements",
      "format",
      "html",
      "if",
      "is",
      "meta",
      "or",
      "string",
      "tags",
      "xhtml"
    ],
    "homepage": "https://codsen.com/os/detect-is-it-html-or-xhtml",
    "repository": {
      "type": "git",
      "url": "git+https://github.com/codsen/codsen.git",
      "directory": "packages/detect-is-it-html-or-xhtml"
    },
    "license": "MIT",
    "author": {
      "name": "Roy Revelt",
      "email": "roy@codsen.com",
      "url": "https://codsen.com"
    },
    "type": "module",
    "exports": {
      "types": "./types/index.d.ts",
      "script": "./dist/detect-is-it-html-or-xhtml.umd.js",
      "default": "./dist/detect-is-it-html-or-xhtml.esm.js"
    },
    "types": "types/index.d.ts",
    "scripts": {
      "build": "node '../../ops/scripts/esbuild.js' && npm run dts",
      "cjs-off": "exit 0",
      "cjs-on": "exit 0",
      "dev": "DEV=true node '../../ops/scripts/esbuild.js' && npm run dts",
      "devtest": "c8 npm run unit && npm run examples && npm run lint",
      "dts": "rollup -c && npm run prettier -- 'types/index.d.ts' --write --log-level 'silent'",
      "examples": "node '../../ops/scripts/run-examples.js'",
      "lect": "node '../../ops/lect/lect.js' && npm run prettier -- 'README.md' '.all-contributorsrc' 'rollup.config.js' --write",
      "letspublish": "npm publish || :",
      "lint": "eslint . --fix",
      "perf": "node perf/check.js",
      "prep": "echo 'ready'",
      "prettier": "prettier",
      "prettier:format": "npm run prettier -- --write '**/*.{ts,tsx,md}' --no-error-on-unmatched-pattern --log-level 'silent'",
      "pretest": "npm run lect && npm run build",
      "test": "npm run devtest",
      "unit": "uvu test"
    },
    "engines": {
      "node": ">=14.18.0"
    },
    "c8": {
      "check-coverage": true,
      "exclude": [
        "**/test/**/*.*"
      ],
      "lines": 100
    },
    "lect": {
      "licence": {
        "extras": [
          ""
        ]
      }
    }
  },
  "detect-templating-language": {
    "name": "detect-templating-language",
    "version": "4.0.13",
    "description": "Detects various templating languages present in string",
    "keywords": [
      "check",
      "code",
      "detect",
      "language",
      "template",
      "templating"
    ],
    "homepage": "https://codsen.com/os/detect-templating-language",
    "repository": {
      "type": "git",
      "url": "git+https://github.com/codsen/codsen.git",
      "directory": "packages/detect-templating-language"
    },
    "license": "MIT",
    "author": {
      "name": "Roy Revelt",
      "email": "roy@codsen.com",
      "url": "https://codsen.com"
    },
    "type": "module",
    "exports": {
      "types": "./types/index.d.ts",
      "script": "./dist/detect-templating-language.umd.js",
      "default": "./dist/detect-templating-language.esm.js"
    },
    "types": "types/index.d.ts",
    "scripts": {
      "build": "node '../../ops/scripts/esbuild.js' && npm run dts",
      "cjs-off": "exit 0",
      "cjs-on": "exit 0",
      "dev": "DEV=true node '../../ops/scripts/esbuild.js' && npm run dts",
      "devtest": "c8 npm run unit && npm run examples && npm run lint",
      "dts": "rollup -c && npm run prettier -- 'types/index.d.ts' --write --log-level 'silent'",
      "examples": "node '../../ops/scripts/run-examples.js'",
      "lect": "node '../../ops/lect/lect.js' && npm run prettier -- 'README.md' '.all-contributorsrc' 'rollup.config.js' --write",
      "letspublish": "npm publish || :",
      "lint": "eslint . --fix",
      "perf": "node perf/check.js",
      "prep": "echo 'ready'",
      "prettier": "prettier",
      "prettier:format": "npm run prettier -- --write '**/*.{ts,tsx,md}' --no-error-on-unmatched-pattern --log-level 'silent'",
      "pretest": "npm run lect && npm run build",
      "test": "npm run devtest",
      "unit": "uvu test"
    },
    "engines": {
      "node": ">=14.18.0"
    },
    "c8": {
      "check-coverage": true,
      "exclude": [
        "**/test/**/*.*"
      ],
      "lines": 100
    },
    "lect": {
      "licence": {
        "extras": [
          ""
        ]
      }
    },
    "dependencies": {
      "regex-is-jinja-nunjucks": "^4.0.9",
      "regex-is-jsp": "^4.0.9",
      "regex-jinja-specific": "^4.0.9"
    }
  },
  "detergent": {
    "name": "detergent",
    "version": "9.2.15",
    "description": "Extract, clean, encode text and fix English style",
    "keywords": [
      "brief",
      "clean",
      "code",
      "copy",
      "detergent",
      "email",
      "encode",
      "html",
      "send",
      "string",
      "style",
      "text"
    ],
    "homepage": "https://codsen.com/os/detergent",
    "repository": {
      "type": "git",
      "url": "git+https://github.com/codsen/codsen.git",
      "directory": "packages/detergent"
    },
    "license": "MIT",
    "author": {
      "name": "Roy Revelt",
      "email": "roy@codsen.com",
      "url": "https://codsen.com"
    },
    "type": "module",
    "exports": {
      "types": "./types/index.d.ts",
      "script": "./dist/detergent.umd.js",
      "default": "./dist/detergent.esm.js"
    },
    "types": "types/index.d.ts",
    "scripts": {
      "build": "node '../../ops/scripts/esbuild.js' && npm run dts",
      "cjs-off": "exit 0",
      "cjs-on": "exit 0",
      "dev": "DEV=true node '../../ops/scripts/esbuild.js' && npm run dts",
      "devtest": "c8 npm run unit && npm run examples && npm run lint",
      "dts": "rollup -c && npm run prettier -- 'types/index.d.ts' --write --log-level 'silent'",
      "examples": "node '../../ops/scripts/run-examples.js'",
      "lect": "node '../../ops/lect/lect.js' && npm run prettier -- 'README.md' '.all-contributorsrc' 'rollup.config.js' --write",
      "letspublish": "npm publish || :",
      "lint": "eslint . --fix",
      "perf": "node perf/check.js",
      "prep": "echo 'ready'",
      "prettier": "prettier",
      "prettier:format": "npm run prettier -- --write '**/*.{ts,tsx,md}' --no-error-on-unmatched-pattern --log-level 'silent'",
      "pretest": "npm run lect && npm run build",
      "test": "npm run devtest",
      "unit": "uvu test"
    },
    "engines": {
      "node": ">=14.18.0"
    },
    "c8": {
      "check-coverage": true,
      "exclude": [
        "**/test/**/*.*"
      ],
      "lines": 95
    },
    "lect": {
      "licence": {
        "extras": [
          "",
          "Passes unit tests from https://github.com/kemitchell/straight-to-curly-quotes.json, licenced under CC0-1.0"
        ]
      }
    },
    "dependencies": {
      "all-named-html-entities": "^3.0.11",
      "ansi-regex": "^6.1.0",
      "codsen-utils": "^1.6.8",
      "he": "^1.2.0",
      "html-entities-not-email-friendly": "^0.8.11",
      "ranges-apply": "^7.0.20",
      "ranges-invert": "^6.0.20",
      "ranges-process-outside": "^6.0.20",
      "ranges-push": "^7.0.19",
      "string-apostrophes": "^4.0.23",
      "string-collapse-white-space": "^11.0.23",
      "string-dashes": "^1.2.17",
      "string-fix-broken-named-entities": "^7.0.21",
      "string-left-right": "^6.0.21",
      "string-range-expander": "^4.0.18",
      "string-remove-widows": "^4.0.26",
      "string-strip-html": "^13.4.13",
      "string-trim-spaces-only": "^5.0.13"
    },
    "devDependencies": {
      "rfdc": "^1.4.1",
      "test-mixer": "^4.1.18"
    }
  },
  "edit-package-json": {
    "name": "edit-package-json",
    "version": "0.8.27",
    "description": "Edit package.json without parsing, as string, to keep the formatting intact",
    "keywords": [
      "changes",
      "edit",
      "indentation",
      "json",
      "non-parsing",
      "package",
      "package.json",
      "parse",
      "read",
      "respect",
      "write"
    ],
    "homepage": "https://codsen.com/os/edit-package-json",
    "repository": {
      "type": "git",
      "url": "git+https://github.com/codsen/codsen.git",
      "directory": "packages/edit-package-json"
    },
    "license": "MIT",
    "author": {
      "name": "Roy Revelt",
      "email": "roy@codsen.com",
      "url": "https://codsen.com"
    },
    "type": "module",
    "exports": {
      "types": "./types/index.d.ts",
      "script": "./dist/edit-package-json.umd.js",
      "default": "./dist/edit-package-json.esm.js"
    },
    "types": "types/index.d.ts",
    "scripts": {
      "build": "node '../../ops/scripts/esbuild.js' && npm run dts",
      "cjs-off": "exit 0",
      "cjs-on": "exit 0",
      "dev": "DEV=true node '../../ops/scripts/esbuild.js' && npm run dts",
      "devtest": "c8 npm run unit && npm run examples && npm run lint",
      "dts": "rollup -c && npm run prettier -- 'types/index.d.ts' --write --log-level 'silent'",
      "examples": "node '../../ops/scripts/run-examples.js'",
      "lect": "node '../../ops/lect/lect.js' && npm run prettier -- 'README.md' '.all-contributorsrc' 'rollup.config.js' --write",
      "letspublish": "npm publish || :",
      "lint": "eslint . --fix",
      "perf": "node perf/check.js",
      "prep": "echo 'ready'",
      "prettier": "prettier",
      "prettier:format": "npm run prettier -- --write '**/*.{ts,tsx,md}' --no-error-on-unmatched-pattern --log-level 'silent'",
      "pretest": "npm run lect && npm run build",
      "test": "npm run devtest",
      "unit": "uvu test"
    },
    "engines": {
      "node": ">=14.18.0"
    },
    "c8": {
      "check-coverage": true,
      "exclude": [
        "**/test/**/*.*"
      ],
      "lines": 100
    },
    "lect": {
      "licence": {
        "extras": [
          "",
          "Passes adapted .set() unit tests from https://github.com/mariocasciaro/object-path/blob/master/test.js, MIT Licence Copyright (c) 2015 Mario Casciaro"
        ]
      }
    },
    "dependencies": {
      "codsen-utils": "^1.6.8",
      "ranges-apply": "^7.0.20",
      "string-left-right": "^6.0.21"
    },
    "devDependencies": {
      "ast-monkey-traverse": "^4.0.20",
      "globby": "^14.1.0",
      "p-map": "^7.0.3",
      "rfdc": "^1.4.1"
    }
  },
  "email-all-chars-within-ascii": {
    "name": "email-all-chars-within-ascii",
    "version": "5.0.23",
    "description": "Scans all characters within a string and checks are they within ASCII range",
    "keywords": [
      "7bit",
      "ascii",
      "characters",
      "email",
      "encoded",
      "range",
      "template",
      "templates",
      "validate"
    ],
    "homepage": "https://codsen.com/os/email-all-chars-within-ascii",
    "repository": {
      "type": "git",
      "url": "git+https://github.com/codsen/codsen.git",
      "directory": "packages/email-all-chars-within-ascii"
    },
    "license": "MIT",
    "author": {
      "name": "Roy Revelt",
      "email": "roy@codsen.com",
      "url": "https://codsen.com"
    },
    "type": "module",
    "exports": {
      "types": "./types/index.d.ts",
      "script": "./dist/email-all-chars-within-ascii.umd.js",
      "default": "./dist/email-all-chars-within-ascii.esm.js"
    },
    "types": "types/index.d.ts",
    "scripts": {
      "build": "node '../../ops/scripts/esbuild.js' && npm run dts",
      "cjs-off": "exit 0",
      "cjs-on": "exit 0",
      "dev": "DEV=true node '../../ops/scripts/esbuild.js' && npm run dts",
      "devtest": "c8 npm run unit && npm run examples && npm run lint",
      "dts": "rollup -c && npm run prettier -- 'types/index.d.ts' --write --log-level 'silent'",
      "examples": "node '../../ops/scripts/run-examples.js'",
      "lect": "node '../../ops/lect/lect.js' && npm run prettier -- 'README.md' '.all-contributorsrc' 'rollup.config.js' --write",
      "letspublish": "npm publish || :",
      "lint": "eslint . --fix",
      "perf": "node perf/check.js",
      "prep": "echo 'ready'",
      "prettier": "prettier",
      "prettier:format": "npm run prettier -- --write '**/*.{ts,tsx,md}' --no-error-on-unmatched-pattern --log-level 'silent'",
      "pretest": "npm run lect && npm run build",
      "test": "npm run devtest",
      "unit": "uvu test"
    },
    "engines": {
      "node": ">=14.18.0"
    },
    "c8": {
      "check-coverage": true,
      "exclude": [
        "**/test/**/*.*"
      ],
      "lines": 100
    },
    "lect": {
      "licence": {
        "extras": [
          ""
        ]
      }
    },
    "dependencies": {
      "check-types-mini": "^8.0.23"
    }
  },
  "email-all-chars-within-ascii-cli": {
    "name": "email-all-chars-within-ascii-cli",
    "version": "4.0.10",
    "description": "Command line app to scan email templates, are all their characters within ASCII range",
    "keywords": [
      "7bit",
      "ascii",
      "characters",
      "email",
      "encoded",
      "range",
      "template",
      "templates",
      "validate"
    ],
    "homepage": "https://codsen.com/os/email-all-chars-within-ascii-cli",
    "repository": {
      "type": "git",
      "url": "git+https://github.com/codsen/codsen.git",
      "directory": "packages/email-all-chars-within-ascii-cli"
    },
    "license": "MIT",
    "author": {
      "name": "Roy Revelt",
      "email": "roy@codsen.com",
      "url": "https://codsen.com"
    },
    "type": "module",
    "bin": {
      "ascii": "cli.js",
      "tinaturner": "cli.js",
      "withinascii": "cli.js"
    },
    "scripts": {
      "build": "exit 0",
      "cjs-off": "exit 0",
      "cjs-on": "exit 0",
      "dev": "exit 0",
      "devtest": "npm run test",
      "dts": "exit 0",
      "examples": "exit 0",
      "lect": "node '../../ops/lect/lect.js'",
      "letspublish": "npm publish || :",
      "lint": "eslint . --fix",
      "perf": "exit 0",
      "prep": "echo 'ready'",
      "prettier": "prettier",
      "prettier:format": "npm run prettier -- --write '**/*.{js,md}' --no-error-on-unmatched-pattern --log-level 'silent'",
      "pretest": "exit 0",
      "test": "c8 npm run unit && npm run lint",
      "unit": "uvu test"
    },
    "engines": {
      "node": ">=18"
    },
    "c8": {
      "check-coverage": false,
      "exclude": [
        "**/test/**/*.*"
      ]
    },
    "lect": {
      "cliSpecialKeyword": "tinaturner",
      "cliSpecialKeywordInstructions": "",
      "licence": {
        "extras": [
          ""
        ]
      }
    },
    "dependencies": {
      "@inquirer/prompts": "^7.6.0",
      "@ljharb/through": "^2.3.14",
      "chalk": "^5.4.1",
      "codsen-utils": "^1.6.8",
      "email-all-chars-within-ascii": "^5.0.23",
      "globby": "^14.1.0",
      "minimist": "^1.2.8",
      "string-left-right": "^6.0.21",
      "update-notifier": "^7.3.1"
    }
  },
  "email-comb": {
    "name": "email-comb",
    "version": "7.0.26",
    "description": "Remove unused CSS from email templates",
    "keywords": [
      "body",
      "css",
      "email",
      "from",
      "head",
      "inline",
      "remove",
      "styles",
      "uncss",
      "unused"
    ],
    "homepage": "https://codsen.com/os/email-comb",
    "repository": {
      "type": "git",
      "url": "git+https://github.com/codsen/codsen.git",
      "directory": "packages/email-comb"
    },
    "license": "MIT",
    "author": {
      "name": "Roy Revelt",
      "email": "roy@codsen.com",
      "url": "https://codsen.com"
    },
    "type": "module",
    "exports": {
      "types": "./types/index.d.ts",
      "script": "./dist/email-comb.umd.js",
      "default": "./dist/email-comb.esm.js"
    },
    "types": "types/index.d.ts",
    "scripts": {
      "build": "node '../../ops/scripts/esbuild.js' && npm run dts",
      "cjs-off": "exit 0",
      "cjs-on": "exit 0",
      "dev": "DEV=true node '../../ops/scripts/esbuild.js' && npm run dts",
      "devtest": "c8 npm run unit && npm run examples && npm run lint",
      "dts": "rollup -c && npm run prettier -- 'types/index.d.ts' --write --log-level 'silent'",
      "examples": "node '../../ops/scripts/run-examples.js'",
      "lect": "node '../../ops/lect/lect.js' && npm run prettier -- 'README.md' '.all-contributorsrc' 'rollup.config.js' --write",
      "letspublish": "npm publish || :",
      "lint": "eslint . --fix",
      "perf": "node perf/check.js",
      "prep": "echo 'ready'",
      "prettier": "prettier",
      "prettier:format": "npm run prettier -- --write '**/*.{ts,tsx,md}' --no-error-on-unmatched-pattern --log-level 'silent'",
      "pretest": "npm run lect && npm run build",
      "test": "npm run devtest",
      "unit": "uvu test"
    },
    "engines": {
      "node": ">=14.18.0"
    },
    "c8": {
      "check-coverage": true,
      "exclude": [
        "**/test/**/*.*"
      ],
      "lines": 100
    },
    "lect": {
      "licence": {
        "extras": [
          ""
        ]
      }
    },
    "dependencies": {
      "array-pull-all-with-glob": "^7.0.13",
      "codsen-utils": "^1.6.8",
      "html-crush": "^6.0.23",
      "matcher": "^5.0.0",
      "ranges-apply": "^7.0.20",
      "ranges-push": "^7.0.19",
      "regex-empty-conditional-comments": "^3.0.9",
      "string-extract-class-names": "^8.0.22",
      "string-left-right": "^6.0.21",
      "string-match-left-right": "^9.0.23",
      "string-range-expander": "^4.0.18",
      "string-uglify": "^3.0.14"
    }
  },
  "eslint-plugin-row-num": {
    "name": "eslint-plugin-row-num-tbc",
    "version": "4.0.30",
    "description": "ESLint plugin to update row numbers on each console.log",
    "keywords": [
      "console",
      "eslint",
      "eslint-plugin",
      "eslintplugin",
      "js-row-num",
      "log",
      "num",
      "numbers",
      "row",
      "row-num",
      "update"
    ],
    "homepage": "https://codsen.com/os/eslint-plugin-row-num",
    "repository": {
      "type": "git",
      "url": "git+https://github.com/codsen/codsen.git",
      "directory": "packages/eslint-plugin-row-num-tbc"
    },
    "license": "MIT",
    "author": {
      "name": "Roy Revelt",
      "email": "roy@codsen.com",
      "url": "https://codsen.com"
    },
    "type": "module",
    "main": "dist/eslint-plugin-row-num.cjs.js",
    "scripts": {
      "build": "node '../../ops/scripts/esbuild.js' && node '../../ops/scripts/fix-cjs.js' && npm run dts",
      "cjs-off": "node '../../ops/scripts/cjs-off.js'",
      "cjs-on": "node '../../ops/scripts/cjs-on.js'",
      "dev": "DEV=true node '../../ops/scripts/esbuild.js' && npm run dts",
      "devtest": "c8 npm run unit && npm run lint",
      "dts": "rollup -c && npm run prettier -- 'types/index.d.ts' --write --log-level 'silent'",
      "examples": "exit 0",
      "lect": "node '../../ops/lect/lect.js' && npm run prettier -- 'README.md' '.all-contributorsrc' --write --log-level 'silent'",
      "letspublish": "npm publish || :",
      "lint": "eslint . --fix",
      "perf": "echo 'skip perf'",
      "prep": "echo 'ready'",
      "prettier": "prettier",
      "prettier:format": "npm run prettier -- --write '**/*.{ts,tsx,md}' --no-error-on-unmatched-pattern --log-level 'silent'",
      "pretest": "npm run lect && npm run build",
      "test": "npm run devtest",
      "unit": "uvu test"
    },
    "engines": {
      "node": ">=14.18.0"
    },
    "c8": {
      "check-coverage": true,
      "exclude": [
        "**/test/**/*.*",
        "**/*.cjs*"
      ],
      "lines": 100
    },
    "lect": {
      "licence": {
        "extras": [
          ""
        ]
      },
      "various": {}
    },
    "dependencies": {
      "@types/json-stringify-safe": "^5.0.3",
      "js-row-num": "^7.0.20",
      "json-stringify-safe": "^5.0.1",
      "object-delete-key": "^4.0.30"
    }
  },
  "eslint-plugin-test-num": {
    "name": "eslint-plugin-test-num-tbc",
    "version": "3.0.31",
    "description": "ESLint plugin to update unit test numbers automatically",
    "keywords": [
      "automatically",
      "eslint",
      "eslint-plugin",
      "eslintplugin",
      "identifier",
      "js-test-num",
      "num",
      "number",
      "numbers",
      "plugin",
      "test",
      "test-num",
      "update",
      "updater"
    ],
    "homepage": "https://codsen.com/os/eslint-plugin-test-num",
    "repository": {
      "type": "git",
      "url": "git+https://github.com/codsen/codsen.git",
      "directory": "packages/eslint-plugin-test-num-tbc"
    },
    "license": "MIT",
    "author": {
      "name": "Roy Revelt",
      "email": "roy@codsen.com",
      "url": "https://codsen.com"
    },
    "type": "module",
    "main": "dist/eslint-plugin-test-num.cjs.js",
    "scripts": {
      "build": "node '../../ops/scripts/esbuild.js' && node '../../ops/scripts/fix-cjs.js' && npm run dts",
      "cjs-off": "node '../../ops/scripts/cjs-off.js'",
      "cjs-on": "node '../../ops/scripts/cjs-on.js'",
      "dev": "DEV=true node '../../ops/scripts/esbuild.js' && npm run dts",
      "devtest": "c8 npm run unit && npm run lint",
      "dts": "rollup -c && npm run prettier -- 'types/index.d.ts' --write --log-level 'silent'",
      "examples": "exit 0",
      "lect": "node '../../ops/lect/lect.js' && npm run prettier -- 'README.md' '.all-contributorsrc' --write --log-level 'silent'",
      "letspublish": "npm publish || :",
      "lint": "eslint . --fix",
      "perf": "echo 'skip perf'",
      "prep": "echo 'ready'",
      "prettier": "prettier",
      "prettier:format": "npm run prettier -- --write '**/*.{ts,tsx,md}' --no-error-on-unmatched-pattern --log-level 'silent'",
      "pretest": "npm run lect && npm run build",
      "test": "npm run devtest",
      "unit": "uvu test"
    },
    "engines": {
      "node": ">=14.18.0"
    },
    "c8": {
      "check-coverage": true,
      "exclude": [
        "**/test/**/*.*",
        "**/*.cjs*"
      ],
      "lines": 100
    },
    "lect": {
      "licence": {
        "extras": [
          ""
        ]
      },
      "various": {}
    },
    "dependencies": {
      "@types/json-stringify-safe": "^5.0.3",
      "json-stringify-safe": "^5.0.1",
      "object-delete-key": "^4.0.30",
      "object-path": "^0.11.8",
      "string-left-right": "^6.0.21"
    }
  },
  "extract-search-index": {
    "name": "extract-search-index",
    "version": "2.0.27",
    "description": "Extract unique keyword input list string for search",
    "keywords": [
      "string",
      "search",
      "fuse",
      "lunr",
      "solr",
      "fuse.js",
      "index",
      "list",
      "generate",
      "compile",
      "extract"
    ],
    "homepage": "https://codsen.com/os/extract-search-index",
    "repository": {
      "type": "git",
      "url": "git+https://github.com/codsen/codsen.git",
      "directory": "packages/extract-search-index"
    },
    "license": "MIT",
    "author": {
      "name": "Roy Revelt",
      "email": "roy@codsen.com",
      "url": "https://codsen.com"
    },
    "type": "module",
    "exports": {
      "types": "./types/index.d.ts",
      "script": "./dist/extract-search-index.umd.js",
      "default": "./dist/extract-search-index.esm.js"
    },
    "types": "types/index.d.ts",
    "scripts": {
      "build": "node '../../ops/scripts/esbuild.js' && npm run dts",
      "cjs-off": "exit 0",
      "cjs-on": "exit 0",
      "dev": "DEV=true node '../../ops/scripts/esbuild.js' && npm run dts",
      "devtest": "c8 npm run unit && npm run examples && npm run lint",
      "dts": "rollup -c && npm run prettier -- 'types/index.d.ts' --write --log-level 'silent'",
      "examples": "node '../../ops/scripts/run-examples.js'",
      "lect": "node '../../ops/lect/lect.js' && npm run prettier -- 'README.md' '.all-contributorsrc' 'rollup.config.js' --write",
      "letspublish": "npm publish || :",
      "lint": "eslint . --fix",
      "perf": "node perf/check.js",
      "prep": "echo 'ready'",
      "prettier": "prettier",
      "prettier:format": "npm run prettier -- --write '**/*.{ts,tsx,md}' --no-error-on-unmatched-pattern --log-level 'silent'",
      "pretest": "npm run lect && npm run build",
      "test": "npm run devtest",
      "unit": "uvu test"
    },
    "engines": {
      "node": ">=14.18.0"
    },
    "c8": {
      "check-coverage": true,
      "exclude": [
        "**/test/**/*.*"
      ],
      "lines": 100
    },
    "lect": {
      "licence": {
        "extras": [
          ""
        ]
      }
    },
    "dependencies": {
      "string-strip-html": "^13.4.13",
      "string-unfancy": "^6.0.20"
    }
  },
  "generate-atomic-css": {
    "name": "generate-atomic-css",
    "version": "3.0.22",
    "description": "Generate Atomic CSS",
    "keywords": [
      "api",
      "atomic",
      "build",
      "css",
      "email",
      "generate",
      "helper",
      "template",
      "templates",
      "tool"
    ],
    "homepage": "https://codsen.com/os/generate-atomic-css",
    "repository": {
      "type": "git",
      "url": "git+https://github.com/codsen/codsen.git",
      "directory": "packages/generate-atomic-css"
    },
    "license": "MIT",
    "author": {
      "name": "Roy Revelt",
      "email": "roy@codsen.com",
      "url": "https://codsen.com"
    },
    "type": "module",
    "exports": {
      "types": "./types/index.d.ts",
      "script": "./dist/generate-atomic-css.umd.js",
      "default": "./dist/generate-atomic-css.esm.js"
    },
    "types": "types/index.d.ts",
    "scripts": {
      "build": "node '../../ops/scripts/esbuild.js' && npm run dts",
      "cjs-off": "exit 0",
      "cjs-on": "exit 0",
      "dev": "DEV=true node '../../ops/scripts/esbuild.js' && npm run dts",
      "devtest": "c8 npm run unit && npm run examples && npm run lint",
      "dts": "rollup -c && npm run prettier -- 'types/index.d.ts' --write --log-level 'silent'",
      "examples": "node '../../ops/scripts/run-examples.js'",
      "lect": "node '../../ops/lect/lect.js' && npm run prettier -- 'README.md' '.all-contributorsrc' 'rollup.config.js' --write",
      "letspublish": "npm publish || :",
      "lint": "eslint . --fix",
      "perf": "node perf/check.js",
      "prep": "echo 'ready'",
      "prettier": "prettier",
      "prettier:format": "npm run prettier -- --write '**/*.{ts,tsx,md}' --no-error-on-unmatched-pattern --log-level 'silent'",
      "pretest": "npm run lect && npm run build",
      "test": "npm run devtest",
      "unit": "uvu test"
    },
    "engines": {
      "node": ">=14.18.0"
    },
    "c8": {
      "check-coverage": true,
      "exclude": [
        "**/test/**/*.*"
      ],
      "lines": 100
    },
    "lect": {
      "licence": {
        "extras": [
          ""
        ]
      }
    },
    "dependencies": {
      "codsen-utils": "^1.6.8",
      "string-left-right": "^6.0.21"
    }
  },
  "generate-atomic-css-cli": {
    "name": "generate-atomic-css-cli",
    "version": "4.0.8",
    "description": "Generates and updates all HTML templates’ atomic CSS",
    "keywords": [
      "atomic",
      "cli",
      "cli-app",
      "create",
      "css",
      "development",
      "email",
      "generate",
      "mailing",
      "marketing",
      "refresh",
      "render",
      "template",
      "tool",
      "update"
    ],
    "homepage": "https://codsen.com/os/generate-atomic-css-cli",
    "repository": {
      "type": "git",
      "url": "git+https://github.com/codsen/codsen.git",
      "directory": "packages/generate-atomic-css-cli"
    },
    "license": "MIT",
    "author": {
      "name": "Roy Revelt",
      "email": "roy@codsen.com",
      "url": "https://codsen.com"
    },
    "type": "module",
    "bin": {
      "gac": "cli.js"
    },
    "scripts": {
      "build": "exit 0",
      "cjs-off": "exit 0",
      "cjs-on": "exit 0",
      "dev": "exit 0",
      "devtest": "npm run test",
      "dts": "exit 0",
      "examples": "exit 0",
      "lect": "node '../../ops/lect/lect.js'",
      "letspublish": "npm publish || :",
      "lint": "eslint . --fix",
      "perf": "exit 0",
      "prep": "echo 'ready'",
      "prettier": "prettier",
      "prettier:format": "npm run prettier -- --write '**/*.{js,md}' --no-error-on-unmatched-pattern --log-level 'silent'",
      "pretest": "exit 0",
      "test": "c8 npm run unit && npm run lint",
      "unit": "uvu test"
    },
    "engines": {
      "node": ">=18"
    },
    "c8": {
      "check-coverage": false,
      "exclude": [
        "**/test/**/*.*"
      ]
    },
    "lect": {
      "licence": {
        "extras": [
          ""
        ]
      },
      "various": {}
    },
    "dependencies": {
      "generate-atomic-css": "^3.0.22",
      "globby": "^14.1.0",
      "is-d": "^1.0.0",
      "meow": "^13.2.0",
      "p-reduce": "^3.0.0",
      "update-notifier": "^7.3.1",
      "write-file-atomic": "^6.0.0"
    }
  },
  "gulp-email-remove-unused-css": {
    "name": "gulp-email-remove-unused-css",
    "version": "6.0.7",
    "description": "Gulp plugin to remove unused CSS classes/id’s from styles in HTML HEAD and inline within BODY",
    "keywords": [
      "body",
      "css",
      "email",
      "from",
      "gulp",
      "gulpplugin",
      "head",
      "inline",
      "remove",
      "styles",
      "uncss",
      "unused"
    ],
    "homepage": "https://codsen.com/os/gulp-email-remove-unused-css",
    "repository": {
      "type": "git",
      "url": "git+https://github.com/codsen/codsen.git",
      "directory": "packages/gulp-email-remove-unused-css"
    },
    "license": "MIT",
    "author": {
      "name": "Roy Revelt",
      "email": "roy@codsen.com",
      "url": "https://codsen.com"
    },
    "type": "module",
    "exports": "./index.js",
    "scripts": {
      "build": "exit 0",
      "cjs-off": "exit 0",
      "cjs-on": "exit 0",
      "dev": "exit 0",
      "devtest": "npm run test",
      "dts": "exit 0",
      "examples": "exit 0",
      "lect": "node '../../ops/lect/lect.js'",
      "letspublish": "npm publish || :",
      "lint": "eslint . --fix",
      "perf": "exit 0",
      "prep": "echo 'ready'",
      "prettier": "prettier",
      "prettier:format": "npm run prettier -- --write '**/*.{js,md}' --no-error-on-unmatched-pattern --log-level 'silent'",
      "pretest": "exit 0",
      "test": "c8 npm run unit && npm run lint",
      "unit": "uvu test"
    },
    "engines": {
      "node": ">=18"
    },
    "c8": {
      "check-coverage": false,
      "exclude": [
        "**/test/**/*.*"
      ]
    },
    "lect": {
      "licence": {
        "extras": [
          ""
        ]
      }
    },
    "dependencies": {
      "email-comb": "^7.0.26",
      "plugin-error": "^2.0.1"
    },
    "devDependencies": {
      "map-stream": "^0.0.7",
      "vinyl-string": "^1.0.2"
    }
  },
  "html-all-known-attributes": {
    "name": "html-all-known-attributes",
    "version": "6.0.9",
    "description": "All HTML attributes known to the Humanity",
    "keywords": [
      "email",
      "entities",
      "friendly",
      "html",
      "marketing",
      "named",
      "not",
      "template"
    ],
    "homepage": "https://codsen.com/os/html-all-known-attributes",
    "repository": {
      "type": "git",
      "url": "git+https://github.com/codsen/codsen.git",
      "directory": "packages/html-all-known-attributes"
    },
    "license": "MIT",
    "author": {
      "name": "Roy Revelt",
      "email": "roy@codsen.com",
      "url": "https://codsen.com"
    },
    "type": "module",
    "exports": {
      "types": "./types/index.d.ts",
      "script": "./dist/html-all-known-attributes.umd.js",
      "default": "./dist/html-all-known-attributes.esm.js"
    },
    "types": "types/index.d.ts",
    "scripts": {
      "build": "node '../../ops/scripts/esbuild.js' && npm run dts",
      "cjs-off": "exit 0",
      "cjs-on": "exit 0",
      "dev": "DEV=true node '../../ops/scripts/esbuild.js' && npm run dts",
      "devtest": "c8 npm run unit && npm run examples && npm run lint",
      "dts": "rollup -c && npm run prettier -- 'types/index.d.ts' --write --log-level 'silent'",
      "examples": "node '../../ops/scripts/run-examples.js'",
      "lect": "node '../../ops/lect/lect.js' && npm run prettier -- 'README.md' '.all-contributorsrc' 'rollup.config.js' --write",
      "letspublish": "npm publish || :",
      "lint": "eslint . --fix",
      "perf": "node perf/check.js",
      "prep": "echo 'ready'",
      "prettier": "prettier",
      "prettier:format": "npm run prettier -- --write '**/*.{ts,tsx,md}' --no-error-on-unmatched-pattern --log-level 'silent'",
      "pretest": "npm run lect && npm run build",
      "test": "npm run devtest",
      "unit": "uvu test"
    },
    "engines": {
      "node": ">=14.18.0"
    },
    "c8": {
      "check-coverage": true,
      "exclude": [
        "**/test/**/*.*"
      ],
      "lines": 100
    },
    "lect": {
      "licence": {
        "extras": [
          ""
        ]
      }
    }
  },
  "html-crush": {
    "name": "html-crush",
    "version": "6.0.23",
    "description": "Minify email templates",
    "keywords": [
      "breaks",
      "crush",
      "css",
      "email",
      "file",
      "html",
      "line",
      "minification",
      "minifier",
      "minify",
      "no",
      "parse",
      "reduce",
      "remove",
      "size",
      "small",
      "smaller",
      "templates",
      "tool",
      "utility"
    ],
    "homepage": "https://codsen.com/os/html-crush",
    "repository": {
      "type": "git",
      "url": "git+https://github.com/codsen/codsen.git",
      "directory": "packages/html-crush"
    },
    "license": "MIT",
    "author": {
      "name": "Roy Revelt",
      "email": "roy@codsen.com",
      "url": "https://codsen.com"
    },
    "type": "module",
    "exports": {
      "types": "./types/index.d.ts",
      "script": "./dist/html-crush.umd.js",
      "default": "./dist/html-crush.esm.js"
    },
    "types": "types/index.d.ts",
    "scripts": {
      "build": "node '../../ops/scripts/esbuild.js' && npm run dts",
      "cjs-off": "exit 0",
      "cjs-on": "exit 0",
      "dev": "DEV=true node '../../ops/scripts/esbuild.js' && npm run dts",
      "devtest": "c8 npm run unit && npm run examples && npm run lint",
      "dts": "rollup -c && npm run prettier -- 'types/index.d.ts' --write --log-level 'silent'",
      "examples": "node '../../ops/scripts/run-examples.js'",
      "lect": "node '../../ops/lect/lect.js' && npm run prettier -- 'README.md' '.all-contributorsrc' 'rollup.config.js' --write",
      "letspublish": "npm publish || :",
      "lint": "eslint . --fix",
      "perf": "node perf/check.js",
      "prep": "echo 'ready'",
      "prettier": "prettier",
      "prettier:format": "npm run prettier -- --write '**/*.{ts,tsx,md}' --no-error-on-unmatched-pattern --log-level 'silent'",
      "pretest": "npm run lect && npm run build",
      "test": "npm run devtest",
      "unit": "uvu test"
    },
    "engines": {
      "node": ">=14.18.0"
    },
    "c8": {
      "check-coverage": true,
      "exclude": [
        "**/test/**/*.*"
      ],
      "lines": 100
    },
    "lect": {
      "licence": {
        "extras": [
          ""
        ]
      }
    },
    "dependencies": {
      "codsen-utils": "^1.6.8",
      "ranges-apply": "^7.0.20",
      "ranges-push": "^7.0.19",
      "string-left-right": "^6.0.21",
      "string-match-left-right": "^9.0.23",
      "string-range-expander": "^4.0.18",
      "test-mixer": "^4.1.18"
    }
  },
  "html-entities-not-email-friendly": {
    "name": "html-entities-not-email-friendly",
    "version": "0.8.11",
    "description": "All HTML entities which are not email template friendly",
    "keywords": [
      "email",
      "entities",
      "friendly",
      "html",
      "marketing",
      "named",
      "not",
      "template"
    ],
    "homepage": "https://codsen.com/os/html-entities-not-email-friendly",
    "repository": {
      "type": "git",
      "url": "git+https://github.com/codsen/codsen.git",
      "directory": "packages/html-entities-not-email-friendly"
    },
    "license": "MIT",
    "author": {
      "name": "Roy Revelt",
      "email": "roy@codsen.com",
      "url": "https://codsen.com"
    },
    "type": "module",
    "exports": {
      "types": "./types/index.d.ts",
      "script": "./dist/html-entities-not-email-friendly.umd.js",
      "default": "./dist/html-entities-not-email-friendly.esm.js"
    },
    "types": "types/index.d.ts",
    "scripts": {
      "build": "node '../../ops/scripts/esbuild.js' && npm run dts",
      "cjs-off": "exit 0",
      "cjs-on": "exit 0",
      "dev": "DEV=true node '../../ops/scripts/esbuild.js' && npm run dts",
      "devtest": "c8 npm run unit && npm run examples && npm run lint",
      "dts": "rollup -c && npm run prettier -- 'types/index.d.ts' --write --log-level 'silent'",
      "examples": "node '../../ops/scripts/run-examples.js'",
      "lect": "node '../../ops/lect/lect.js' && npm run prettier -- 'README.md' '.all-contributorsrc' 'rollup.config.js' --write",
      "letspublish": "npm publish || :",
      "lint": "eslint . --fix",
      "perf": "node perf/check.js",
      "prep": "echo 'ready'",
      "prettier": "prettier",
      "prettier:format": "npm run prettier -- --write '**/*.{ts,tsx,md}' --no-error-on-unmatched-pattern --log-level 'silent'",
      "pretest": "npm run lect && npm run build",
      "test": "npm run devtest",
      "unit": "uvu test"
    },
    "engines": {
      "node": ">=14.18.0"
    },
    "c8": {
      "check-coverage": true,
      "exclude": [
        "**/test/**/*.*"
      ],
      "lines": 100
    },
    "lect": {
      "licence": {
        "extras": [
          ""
        ]
      }
    }
  },
  "html-img-alt": {
    "name": "html-img-alt",
    "version": "4.0.24",
    "description": "Adds missing alt attributes to img tags. Non-parsing.",
    "keywords": [
      "add",
      "alt",
      "attribute",
      "attributes",
      "clean",
      "email",
      "fill",
      "html",
      "marketing",
      "missing",
      "newsletter",
      "parsing",
      "restore",
      "tags",
      "template",
      "templates"
    ],
    "homepage": "https://codsen.com/os/html-img-alt",
    "repository": {
      "type": "git",
      "url": "git+https://github.com/codsen/codsen.git",
      "directory": "packages/html-img-alt"
    },
    "license": "MIT",
    "author": {
      "name": "Roy Revelt",
      "email": "roy@codsen.com",
      "url": "https://codsen.com"
    },
    "type": "module",
    "exports": {
      "types": "./types/index.d.ts",
      "script": "./dist/html-img-alt.umd.js",
      "default": "./dist/html-img-alt.esm.js"
    },
    "types": "types/index.d.ts",
    "scripts": {
      "build": "node '../../ops/scripts/esbuild.js' && npm run dts",
      "cjs-off": "exit 0",
      "cjs-on": "exit 0",
      "dev": "DEV=true node '../../ops/scripts/esbuild.js' && npm run dts",
      "devtest": "c8 npm run unit && npm run examples && npm run lint",
      "dts": "rollup -c && npm run prettier -- 'types/index.d.ts' --write --log-level 'silent'",
      "examples": "node '../../ops/scripts/run-examples.js'",
      "lect": "node '../../ops/lect/lect.js' && npm run prettier -- 'README.md' '.all-contributorsrc' 'rollup.config.js' --write",
      "letspublish": "npm publish || :",
      "lint": "eslint . --fix",
      "perf": "node perf/check.js",
      "prep": "echo 'ready'",
      "prettier": "prettier",
      "prettier:format": "npm run prettier -- --write '**/*.{ts,tsx,md}' --no-error-on-unmatched-pattern --log-level 'silent'",
      "pretest": "npm run lect && npm run build",
      "test": "npm run devtest",
      "unit": "uvu test"
    },
    "engines": {
      "node": ">=14.18.0"
    },
    "c8": {
      "check-coverage": true,
      "exclude": [
        "**/test/**/*.*"
      ],
      "lines": 100
    },
    "lect": {
      "licence": {
        "extras": [
          ""
        ]
      }
    },
    "dependencies": {
      "check-types-mini": "^8.0.23",
      "ranges-apply": "^7.0.20",
      "ranges-push": "^7.0.19",
      "string-unfancy": "^6.0.20"
    }
  },
  "html-table-patcher": {
    "name": "html-table-patcher",
    "version": "6.0.30",
    "description": "Visual helper to place templating code around table tags into correct places",
    "keywords": [
      "add",
      "alt",
      "attributes",
      "clean",
      "email",
      "fill",
      "marketing",
      "missing",
      "newsletter",
      "parsing",
      "restore",
      "tags",
      "template",
      "templates"
    ],
    "homepage": "https://codsen.com/os/html-table-patcher",
    "repository": {
      "type": "git",
      "url": "git+https://github.com/codsen/codsen.git",
      "directory": "packages/html-table-patcher"
    },
    "license": "MIT",
    "author": {
      "name": "Roy Revelt",
      "email": "roy@codsen.com",
      "url": "https://codsen.com"
    },
    "type": "module",
    "exports": {
      "types": "./types/index.d.ts",
      "script": "./dist/html-table-patcher.umd.js",
      "default": "./dist/html-table-patcher.esm.js"
    },
    "types": "types/index.d.ts",
    "scripts": {
      "build": "node '../../ops/scripts/esbuild.js' && npm run dts",
      "cjs-off": "exit 0",
      "cjs-on": "exit 0",
      "dev": "DEV=true node '../../ops/scripts/esbuild.js' && npm run dts",
      "devtest": "c8 npm run unit && npm run examples && npm run lint",
      "dts": "rollup -c && npm run prettier -- 'types/index.d.ts' --write --log-level 'silent'",
      "examples": "node '../../ops/scripts/run-examples.js'",
      "lect": "node '../../ops/lect/lect.js' && npm run prettier -- 'README.md' '.all-contributorsrc' 'rollup.config.js' --write",
      "letspublish": "npm publish || :",
      "lint": "eslint . --fix",
      "perf": "node perf/check.js",
      "prep": "echo 'ready'",
      "prettier": "prettier",
      "prettier:format": "npm run prettier -- --write '**/*.{ts,tsx,md}' --no-error-on-unmatched-pattern --log-level 'silent'",
      "pretest": "npm run lect && npm run build",
      "test": "npm run devtest",
      "unit": "uvu test"
    },
    "engines": {
      "node": ">=14.18.0"
    },
    "c8": {
      "check-coverage": true,
      "exclude": [
        "**/test/**/*.*"
      ],
      "lines": 100
    },
    "lect": {
      "licence": {
        "extras": [
          ""
        ]
      }
    },
    "dependencies": {
      "ast-monkey-traverse-with-lookahead": "^4.0.19",
      "codsen-parser": "^0.14.25",
      "ranges-apply": "^7.0.20",
      "ranges-push": "^7.0.19"
    }
  },
  "is-char-suitable-for-html-attr-name": {
    "name": "is-char-suitable-for-html-attr-name",
    "version": "4.0.9",
    "description": "Is given character suitable to be in an HTML attribute’s name?",
    "keywords": [
      "attribute",
      "character",
      "codsen",
      "emlint",
      "for",
      "html",
      "is",
      "lexer",
      "name",
      "parsing",
      "suitable",
      "tag",
      "tokeniser",
      "tokenizer",
      "value"
    ],
    "homepage": "https://codsen.com/os/is-char-suitable-for-html-attr-name",
    "repository": {
      "type": "git",
      "url": "git+https://github.com/codsen/codsen.git",
      "directory": "packages/is-char-suitable-for-html-attr-name"
    },
    "license": "MIT",
    "author": {
      "name": "Roy Revelt",
      "email": "roy@codsen.com",
      "url": "https://codsen.com"
    },
    "type": "module",
    "exports": {
      "types": "./types/index.d.ts",
      "script": "./dist/is-char-suitable-for-html-attr-name.umd.js",
      "default": "./dist/is-char-suitable-for-html-attr-name.esm.js"
    },
    "types": "types/index.d.ts",
    "scripts": {
      "build": "node '../../ops/scripts/esbuild.js' && npm run dts",
      "cjs-off": "exit 0",
      "cjs-on": "exit 0",
      "dev": "DEV=true node '../../ops/scripts/esbuild.js' && npm run dts",
      "devtest": "c8 npm run unit && npm run examples && npm run lint",
      "dts": "rollup -c && npm run prettier -- 'types/index.d.ts' --write --log-level 'silent'",
      "examples": "node '../../ops/scripts/run-examples.js'",
      "lect": "node '../../ops/lect/lect.js' && npm run prettier -- 'README.md' '.all-contributorsrc' 'rollup.config.js' --write",
      "letspublish": "npm publish || :",
      "lint": "eslint . --fix",
      "perf": "node perf/check.js",
      "prep": "echo 'ready'",
      "prettier": "prettier",
      "prettier:format": "npm run prettier -- --write '**/*.{ts,tsx,md}' --no-error-on-unmatched-pattern --log-level 'silent'",
      "pretest": "npm run lect && npm run build",
      "test": "npm run devtest",
      "unit": "uvu test"
    },
    "engines": {
      "node": ">=14.18.0"
    },
    "c8": {
      "check-coverage": true,
      "exclude": [
        "**/test/**/*.*"
      ],
      "lines": 100
    },
    "lect": {
      "licence": {
        "extras": [
          ""
        ]
      }
    }
  },
  "is-html-attribute-closing": {
    "name": "is-html-attribute-closing",
    "version": "4.0.23",
    "description": "Is a character on a given index a closing of an HTML attribute?",
    "keywords": [
      "attribute",
      "character",
      "codsen",
      "emlint",
      "end",
      "ending",
      "ends",
      "html",
      "is",
      "lexer",
      "parsing",
      "tag",
      "tokeniser",
      "tokenizer"
    ],
    "homepage": "https://codsen.com/os/is-html-attribute-closing",
    "repository": {
      "type": "git",
      "url": "git+https://github.com/codsen/codsen.git",
      "directory": "packages/is-html-attribute-closing"
    },
    "license": "MIT",
    "author": {
      "name": "Roy Revelt",
      "email": "roy@codsen.com",
      "url": "https://codsen.com"
    },
    "type": "module",
    "exports": {
      "types": "./types/index.d.ts",
      "script": "./dist/is-html-attribute-closing.umd.js",
      "default": "./dist/is-html-attribute-closing.esm.js"
    },
    "types": "types/index.d.ts",
    "scripts": {
      "build": "node '../../ops/scripts/esbuild.js' && npm run dts",
      "cjs-off": "exit 0",
      "cjs-on": "exit 0",
      "dev": "DEV=true node '../../ops/scripts/esbuild.js' && npm run dts",
      "devtest": "c8 npm run unit && npm run examples && npm run lint",
      "dts": "rollup -c && npm run prettier -- 'types/index.d.ts' --write --log-level 'silent'",
      "examples": "node '../../ops/scripts/run-examples.js'",
      "lect": "node '../../ops/lect/lect.js' && npm run prettier -- 'README.md' '.all-contributorsrc' 'rollup.config.js' --write",
      "letspublish": "npm publish || :",
      "lint": "eslint . --fix",
      "perf": "node perf/check.js",
      "prep": "echo 'ready'",
      "prettier": "prettier",
      "prettier:format": "npm run prettier -- --write '**/*.{ts,tsx,md}' --no-error-on-unmatched-pattern --log-level 'silent'",
      "pretest": "npm run lect && npm run build",
      "test": "npm run devtest",
      "unit": "uvu test"
    },
    "engines": {
      "node": ">=14.18.0"
    },
    "c8": {
      "check-coverage": true,
      "exclude": [
        "**/test/**/*.*"
      ],
      "lines": 100
    },
    "lect": {
      "licence": {
        "extras": [
          ""
        ]
      },
      "various": {}
    },
    "dependencies": {
      "html-all-known-attributes": "^6.0.9",
      "is-char-suitable-for-html-attr-name": "^4.0.9",
      "string-left-right": "^6.0.21",
      "string-match-left-right": "^9.0.23"
    }
  },
  "is-html-tag-opening": {
    "name": "is-html-tag-opening",
    "version": "4.0.23",
    "description": "Does an HTML tag start at given position?",
    "keywords": [
      "bracket",
      "brackets",
      "cleaning",
      "code",
      "codsen",
      "html",
      "is",
      "non-parsing",
      "opening",
      "parsing",
      "tag",
      "tokenizer",
      "utility"
    ],
    "homepage": "https://codsen.com/os/is-html-tag-opening",
    "repository": {
      "type": "git",
      "url": "git+https://github.com/codsen/codsen.git",
      "directory": "packages/is-html-tag-opening"
    },
    "license": "MIT",
    "author": {
      "name": "Roy Revelt",
      "email": "roy@codsen.com",
      "url": "https://codsen.com"
    },
    "type": "module",
    "exports": {
      "types": "./types/index.d.ts",
      "script": "./dist/is-html-tag-opening.umd.js",
      "default": "./dist/is-html-tag-opening.esm.js"
    },
    "types": "types/index.d.ts",
    "scripts": {
      "build": "node '../../ops/scripts/esbuild.js' && npm run dts",
      "cjs-off": "exit 0",
      "cjs-on": "exit 0",
      "dev": "DEV=true node '../../ops/scripts/esbuild.js' && npm run dts",
      "devtest": "c8 npm run unit && npm run examples && npm run lint",
      "dts": "rollup -c && npm run prettier -- 'types/index.d.ts' --write --log-level 'silent'",
      "examples": "node '../../ops/scripts/run-examples.js'",
      "lect": "node '../../ops/lect/lect.js' && npm run prettier -- 'README.md' '.all-contributorsrc' 'rollup.config.js' --write",
      "letspublish": "npm publish || :",
      "lint": "eslint . --fix",
      "perf": "node perf/check.js",
      "prep": "echo 'ready'",
      "prettier": "prettier",
      "prettier:format": "npm run prettier -- --write '**/*.{ts,tsx,md}' --no-error-on-unmatched-pattern --log-level 'silent'",
      "pretest": "npm run lect && npm run build",
      "test": "npm run devtest",
      "unit": "uvu test"
    },
    "engines": {
      "node": ">=14.18.0"
    },
    "c8": {
      "check-coverage": true,
      "exclude": [
        "**/test/**/*.*"
      ],
      "lines": 100
    },
    "lect": {
      "licence": {
        "extras": [
          ""
        ]
      }
    },
    "dependencies": {
      "string-left-right": "^6.0.21",
      "string-match-left-right": "^9.0.23"
    },
    "devDependencies": {
      "test-mixer": "^4.1.18"
    }
  },
  "is-language-code": {
    "name": "is-language-code",
    "version": "5.0.16",
    "description": "Is given string a language code (as per IANA)",
    "keywords": [
      "check",
      "code",
      "codes",
      "iana",
      "ietf",
      "is",
      "langref",
      "language",
      "lookup",
      "registry",
      "rfc",
      "rfc 5646",
      "seo",
      "standards",
      "valid",
      "validate"
    ],
    "homepage": "https://codsen.com/os/is-language-code",
    "repository": {
      "type": "git",
      "url": "git+https://github.com/codsen/codsen.git",
      "directory": "packages/is-language-code"
    },
    "license": "MIT",
    "author": {
      "name": "Roy Revelt",
      "email": "roy@codsen.com",
      "url": "https://codsen.com"
    },
    "type": "module",
    "exports": {
      "types": "./types/index.d.ts",
      "script": "./dist/is-language-code.umd.js",
      "default": "./dist/is-language-code.esm.js"
    },
    "types": "types/index.d.ts",
    "scripts": {
      "build": "node '../../ops/scripts/esbuild.js' && npm run dts",
      "cjs-off": "exit 0",
      "cjs-on": "exit 0",
      "dev": "DEV=true node '../../ops/scripts/esbuild.js' && npm run dts",
      "devtest": "c8 npm run unit && npm run examples && npm run lint",
      "dts": "rollup -c && npm run prettier -- 'types/index.d.ts' --write --log-level 'silent'",
      "examples": "node '../../ops/scripts/run-examples.js'",
      "lect": "node '../../ops/lect/lect.js' && npm run prettier -- 'README.md' '.all-contributorsrc' 'rollup.config.js' --write",
      "letspublish": "npm publish || :",
      "lint": "eslint . --fix",
      "perf": "node perf/check.js",
      "prep": "echo 'ready'",
      "prettier": "prettier",
      "prettier:format": "npm run prettier -- --write '**/*.{ts,tsx,md}' --no-error-on-unmatched-pattern --log-level 'silent'",
      "pretest": "npm run lect && npm run build",
      "test": "npm run devtest",
      "unit": "uvu test"
    },
    "engines": {
      "node": ">=14.18.0"
    },
    "c8": {
      "check-coverage": true,
      "exclude": [
        "**/test/**/*.*"
      ],
      "lines": 100
    },
    "lect": {
      "licence": {
        "extras": [
          ""
        ]
      }
    },
    "dependencies": {
      "codsen-utils": "^1.6.8"
    }
  },
  "is-media-descriptor": {
    "name": "is-media-descriptor",
    "version": "5.0.23",
    "description": "Is given string a valid media descriptor (including media query)?",
    "keywords": [
      "attribute",
      "catch",
      "check",
      "css",
      "descriptor",
      "error",
      "errors",
      "evaluate",
      "html",
      "lint",
      "media",
      "query",
      "tag",
      "validate"
    ],
    "homepage": "https://codsen.com/os/is-media-descriptor",
    "repository": {
      "type": "git",
      "url": "git+https://github.com/codsen/codsen.git",
      "directory": "packages/is-media-descriptor"
    },
    "license": "MIT",
    "author": {
      "name": "Roy Revelt",
      "email": "roy@codsen.com",
      "url": "https://codsen.com"
    },
    "type": "module",
    "exports": {
      "types": "./types/index.d.ts",
      "script": "./dist/is-media-descriptor.umd.js",
      "default": "./dist/is-media-descriptor.esm.js"
    },
    "types": "types/index.d.ts",
    "scripts": {
      "build": "node '../../ops/scripts/esbuild.js' && npm run dts",
      "cjs-off": "exit 0",
      "cjs-on": "exit 0",
      "dev": "DEV=true node '../../ops/scripts/esbuild.js' && npm run dts",
      "devtest": "c8 npm run unit && npm run examples && npm run lint",
      "dts": "rollup -c && npm run prettier -- 'types/index.d.ts' --write --log-level 'silent'",
      "examples": "node '../../ops/scripts/run-examples.js'",
      "lect": "node '../../ops/lect/lect.js' && npm run prettier -- 'README.md' '.all-contributorsrc' 'rollup.config.js' --write",
      "letspublish": "npm publish || :",
      "lint": "eslint . --fix",
      "perf": "node perf/check.js",
      "prep": "echo 'ready'",
      "prettier": "prettier",
      "prettier:format": "npm run prettier -- --write '**/*.{ts,tsx,md}' --no-error-on-unmatched-pattern --log-level 'silent'",
      "pretest": "npm run lect && npm run build",
      "test": "npm run devtest",
      "unit": "uvu test"
    },
    "engines": {
      "node": ">=14.18.0"
    },
    "c8": {
      "check-coverage": true,
      "exclude": [
        "**/test/**/*.*"
      ],
      "lines": 100
    },
    "lect": {
      "licence": {
        "extras": []
      }
    },
    "dependencies": {
      "leven": "^4.0.0",
      "string-process-comma-separated": "^4.1.9"
    },
    "devDependencies": {
      "ranges-apply": "^7.0.20"
    }
  },
  "is-relative-uri": {
    "name": "is-relative-uri",
    "version": "5.0.20",
    "description": "Is given string a relative URI?",
    "keywords": [
      "href",
      "is",
      "link",
      "local",
      "reference",
      "relative",
      "string",
      "uri",
      "url",
      "validate"
    ],
    "homepage": "https://codsen.com/os/is-relative-uri",
    "repository": {
      "type": "git",
      "url": "git+https://github.com/codsen/codsen.git",
      "directory": "packages/is-relative-uri"
    },
    "license": "MIT",
    "author": {
      "name": "Roy Revelt",
      "email": "roy@codsen.com",
      "url": "https://codsen.com"
    },
    "type": "module",
    "exports": {
      "types": "./types/index.d.ts",
      "script": "./dist/is-relative-uri.umd.js",
      "default": "./dist/is-relative-uri.esm.js"
    },
    "types": "types/index.d.ts",
    "scripts": {
      "build": "node '../../ops/scripts/esbuild.js' && npm run dts",
      "cjs-off": "exit 0",
      "cjs-on": "exit 0",
      "dev": "DEV=true node '../../ops/scripts/esbuild.js' && npm run dts",
      "devtest": "c8 npm run unit && npm run examples && npm run lint",
      "dts": "rollup -c && npm run prettier -- 'types/index.d.ts' --write --log-level 'silent'",
      "examples": "node '../../ops/scripts/run-examples.js'",
      "lect": "node '../../ops/lect/lect.js' && npm run prettier -- 'README.md' '.all-contributorsrc' 'rollup.config.js' --write",
      "letspublish": "npm publish || :",
      "lint": "eslint . --fix",
      "perf": "node perf/check.js",
      "prep": "echo 'ready'",
      "prettier": "prettier",
      "prettier:format": "npm run prettier -- --write '**/*.{ts,tsx,md}' --no-error-on-unmatched-pattern --log-level 'silent'",
      "pretest": "npm run lect && npm run build",
      "test": "npm run devtest",
      "unit": "uvu test"
    },
    "engines": {
      "node": ">=14.18.0"
    },
    "c8": {
      "check-coverage": true,
      "exclude": [
        "**/test/**/*.*"
      ],
      "lines": 100
    },
    "lect": {
      "licence": {
        "extras": [
          ""
        ]
      }
    },
    "devDependencies": {
      "ranges-apply": "^7.0.20"
    }
  },
  "js-row-num": {
    "name": "js-row-num",
    "version": "7.0.20",
    "description": "Update all row numbers in all console.logs in JS code",
    "keywords": [
      "alt",
      "attributes",
      "characters",
      "dash",
      "email",
      "encoding",
      "fancy",
      "quote",
      "remove",
      "replace",
      "simple",
      "string",
      "tags",
      "templates"
    ],
    "homepage": "https://codsen.com/os/js-row-num",
    "repository": {
      "type": "git",
      "url": "git+https://github.com/codsen/codsen.git",
      "directory": "packages/js-row-num"
    },
    "license": "MIT",
    "author": {
      "name": "Roy Revelt",
      "email": "roy@codsen.com",
      "url": "https://codsen.com"
    },
    "type": "module",
    "exports": {
      "types": "./types/index.d.ts",
      "script": "./dist/js-row-num.umd.js",
      "default": "./dist/js-row-num.esm.js"
    },
    "types": "types/index.d.ts",
    "scripts": {
      "build": "node '../../ops/scripts/esbuild.js' && npm run dts",
      "cjs-off": "exit 0",
      "cjs-on": "exit 0",
      "dev": "DEV=true node '../../ops/scripts/esbuild.js' && npm run dts",
      "devtest": "c8 npm run unit && npm run examples && npm run lint",
      "dts": "rollup -c && npm run prettier -- 'types/index.d.ts' --write --log-level 'silent'",
      "examples": "node '../../ops/scripts/run-examples.js'",
      "lect": "node '../../ops/lect/lect.js' && npm run prettier -- 'README.md' '.all-contributorsrc' 'rollup.config.js' --write",
      "letspublish": "npm publish || :",
      "lint": "eslint . --fix",
      "perf": "node perf/check.js",
      "prep": "echo 'ready'",
      "prettier": "prettier",
      "prettier:format": "npm run prettier -- --write '**/*.{ts,tsx,md}' --no-error-on-unmatched-pattern --log-level 'silent'",
      "pretest": "npm run lect && npm run build",
      "test": "npm run devtest",
      "unit": "uvu test"
    },
    "engines": {
      "node": ">=14.18.0"
    },
    "c8": {
      "check-coverage": true,
      "exclude": [
        "**/test/**/*.*"
      ],
      "lines": 100
    },
    "lect": {
      "licence": {
        "extras": [
          ""
        ]
      }
    },
    "dependencies": {
      "codsen-utils": "^1.6.8",
      "ranges-apply": "^7.0.20",
      "ranges-push": "^7.0.19"
    }
  },
  "js-row-num-cli": {
    "name": "js-row-num-cli",
    "version": "4.0.8",
    "description": "Update all row numbers in all console.logs in given files",
    "keywords": [
      "automated",
      "automatically",
      "cli",
      "cli-app",
      "console",
      "console.log",
      "correct",
      "debug",
      "every",
      "js",
      "log",
      "numbers",
      "row",
      "tool",
      "update"
    ],
    "homepage": "https://codsen.com/os/js-row-num-cli",
    "repository": {
      "type": "git",
      "url": "git+https://github.com/codsen/codsen.git",
      "directory": "packages/js-row-num-cli"
    },
    "license": "MIT",
    "author": {
      "name": "Roy Revelt",
      "email": "roy@codsen.com",
      "url": "https://codsen.com"
    },
    "type": "module",
    "bin": {
      "jrn": "cli.js",
      "jsrownum": "cli.js"
    },
    "scripts": {
      "build": "exit 0",
      "cjs-off": "exit 0",
      "cjs-on": "exit 0",
      "dev": "exit 0",
      "devtest": "npm run test",
      "dts": "exit 0",
      "examples": "exit 0",
      "lect": "node '../../ops/lect/lect.js'",
      "letspublish": "npm publish || :",
      "lint": "eslint . --fix",
      "perf": "exit 0",
      "prep": "echo 'ready'",
      "prettier": "prettier",
      "prettier:format": "npm run prettier -- --write '**/*.{js,md}' --no-error-on-unmatched-pattern --log-level 'silent'",
      "pretest": "exit 0",
      "test": "c8 npm run unit && npm run lint",
      "unit": "uvu test"
    },
    "engines": {
      "node": ">=18"
    },
    "c8": {
      "check-coverage": false,
      "exclude": [
        "**/test/**/*.*"
      ]
    },
    "lect": {
      "licence": {
        "extras": [
          ""
        ]
      }
    },
    "dependencies": {
      "arrayiffy-if-string": "^5.0.10",
      "globby": "^14.1.0",
      "is-d": "^1.0.0",
      "js-row-num": "^7.0.20",
      "meow": "^13.2.0",
      "p-reduce": "^3.0.0",
      "update-notifier": "^7.3.1",
      "write-file-atomic": "^6.0.0"
    }
  },
  "json-comb": {
    "name": "json-comb",
    "version": "0.9.10",
    "description": "Command line app to manage sets of JSON files",
    "keywords": [
      "app",
      "cli",
      "command line",
      "delete",
      "file",
      "files",
      "json",
      "key",
      "manage",
      "normalise",
      "normalize",
      "tool",
      "utility"
    ],
    "homepage": "https://codsen.com/os/json-comb",
    "repository": {
      "type": "git",
      "url": "git+https://github.com/codsen/codsen.git",
      "directory": "packages/json-comb"
    },
    "license": "MIT",
    "author": {
      "name": "Roy Revelt",
      "email": "roy@codsen.com",
      "url": "https://codsen.com"
    },
    "type": "module",
    "bin": {
      "jsoncomb": "cli.js"
    },
    "scripts": {
      "build": "exit 0",
      "cjs-off": "exit 0",
      "cjs-on": "exit 0",
      "dev": "exit 0",
      "devtest": "npm run test",
      "dts": "exit 0",
      "examples": "exit 0",
      "lect": "node '../../ops/lect/lect.js'",
      "letspublish": "npm publish || :",
      "lint": "eslint . --fix",
      "perf": "exit 0",
      "prep": "echo 'ready'",
      "prettier": "prettier",
      "prettier:format": "npm run prettier -- --write '**/*.{js,md}' --no-error-on-unmatched-pattern --log-level 'silent'",
      "pretest": "exit 0",
      "test": "c8 npm run unit && npm run lint",
      "unit": "uvu test"
    },
    "engines": {
      "node": ">=18"
    },
    "c8": {
      "check-coverage": false,
      "exclude": [
        "**/test/**/*.*"
      ]
    },
    "lect": {
      "licence": {
        "extras": [
          ""
        ]
      }
    },
    "dependencies": {
      "fs-extra": "^11.3.0",
      "globby": "^14.1.0",
      "is-d": "^1.0.0",
      "json-comb-core": "^8.0.25",
      "meow": "^13.2.0",
      "p-map": "^7.0.3",
      "p-reduce": "^3.0.0",
      "update-notifier": "^7.3.1"
    }
  },
  "json-comb-core": {
    "name": "json-comb-core",
    "version": "8.0.25",
    "description": "The inner core of json-comb",
    "keywords": [
      "comb",
      "files",
      "fill",
      "json",
      "keys",
      "keyset",
      "normalise",
      "normalize",
      "same",
      "schema"
    ],
    "homepage": "https://codsen.com/os/json-comb-core",
    "repository": {
      "type": "git",
      "url": "git+https://github.com/codsen/codsen.git",
      "directory": "packages/json-comb-core"
    },
    "license": "MIT",
    "author": {
      "name": "Roy Revelt",
      "email": "roy@codsen.com",
      "url": "https://codsen.com"
    },
    "type": "module",
    "exports": {
      "types": "./types/index.d.ts",
      "script": "./dist/json-comb-core.umd.js",
      "default": "./dist/json-comb-core.esm.js"
    },
    "types": "types/index.d.ts",
    "scripts": {
      "build": "node '../../ops/scripts/esbuild.js' && npm run dts",
      "cjs-off": "exit 0",
      "cjs-on": "exit 0",
      "dev": "DEV=true node '../../ops/scripts/esbuild.js' && npm run dts",
      "devtest": "c8 npm run unit && npm run examples && npm run lint",
      "dts": "rollup -c && npm run prettier -- 'types/index.d.ts' --write --log-level 'silent'",
      "examples": "node '../../ops/scripts/run-examples.js'",
      "lect": "node '../../ops/lect/lect.js' && npm run prettier -- 'README.md' '.all-contributorsrc' 'rollup.config.js' --write",
      "letspublish": "npm publish || :",
      "lint": "eslint . --fix",
      "perf": "node perf/check.js",
      "prep": "echo 'ready'",
      "prettier": "prettier",
      "prettier:format": "npm run prettier -- --write '**/*.{ts,tsx,md}' --no-error-on-unmatched-pattern --log-level 'silent'",
      "pretest": "npm run lect && npm run build",
      "test": "npm run devtest",
      "unit": "uvu test"
    },
    "engines": {
      "node": ">=14.18.0"
    },
    "c8": {
      "check-coverage": true,
      "exclude": [
        "**/test/**/*.*"
      ],
      "lines": 100
    },
    "lect": {
      "licence": {
        "extras": [
          ""
        ]
      },
      "various": {}
    },
    "dependencies": {
      "@types/lodash-es": "^4.17.12",
      "@types/semver-compare": "^1.0.3",
      "codsen-utils": "^1.6.8",
      "lodash-es": "^4.17.21",
      "object-fill-missing-keys": "^11.0.22",
      "object-flatten-all-arrays": "^7.0.23",
      "object-merge-advanced": "^14.0.22",
      "object-no-new-keys": "^5.1.9",
      "object-set-all-values-to": "^6.0.20",
      "p-map": "^7.0.3",
      "p-one": "^2.0.0",
      "p-reduce": "^3.0.0",
      "rfdc": "^1.4.1",
      "semver-compare": "^1.0.0",
      "sort-keys": "^5.1.0",
      "type-detect": "^4.1.0"
    }
  },
  "json-sort-cli": {
    "name": "json-sort-cli",
    "version": "4.0.10",
    "description": "Command line app to deep sort JSON files, retains package.json special key order",
    "keywords": [
      "app",
      "cli",
      "command line",
      "file",
      "files",
      "fix",
      "json",
      "sort",
      "tool",
      "utility"
    ],
    "homepage": "https://codsen.com/os/json-sort-cli",
    "repository": {
      "type": "git",
      "url": "git+https://github.com/codsen/codsen.git",
      "directory": "packages/json-sort-cli"
    },
    "license": "MIT",
    "author": {
      "name": "Roy Revelt",
      "email": "roy@codsen.com",
      "url": "https://codsen.com"
    },
    "type": "module",
    "bin": {
      "jsonsort": "cli.js",
      "sortjson": "cli.js"
    },
    "scripts": {
      "build": "exit 0",
      "cjs-off": "exit 0",
      "cjs-on": "exit 0",
      "dev": "exit 0",
      "devtest": "npm run test",
      "dts": "exit 0",
      "examples": "exit 0",
      "lect": "node '../../ops/lect/lect.js'",
      "letspublish": "npm publish || :",
      "lint": "eslint . --fix",
      "perf": "exit 0",
      "prep": "echo 'ready'",
      "prettier": "prettier",
      "prettier:format": "npm run prettier -- --write '**/*.{js,md}' --no-error-on-unmatched-pattern --log-level 'silent'",
      "pretest": "exit 0",
      "test": "c8 npm run unit && npm run lint",
      "unit": "uvu test"
    },
    "engines": {
      "node": ">=18"
    },
    "c8": {
      "check-coverage": false,
      "exclude": [
        "**/test/**/*.*"
      ]
    },
    "lect": {
      "licence": {
        "extras": [
          ""
        ]
      }
    },
    "dependencies": {
      "ast-monkey-traverse": "^4.0.20",
      "chalk": "^5.4.1",
      "codsen-utils": "^1.6.8",
      "fs-extra": "^11.3.0",
      "globby": "^14.1.0",
      "is-d": "^1.0.0",
      "meow": "^13.2.0",
      "p-filter": "^4.1.0",
      "p-reduce": "^3.0.0",
      "sort-package-json": "^3.4.0",
      "update-notifier": "^7.3.1"
    },
    "devDependencies": {
      "p-map": "^7.0.3"
    }
  },
  "json-variables": {
    "name": "json-variables",
    "version": "12.0.23",
    "description": "Resolves custom-marked, cross-referenced paths in parsed JSON",
    "keywords": [
      "comb",
      "files",
      "fill",
      "json",
      "keys",
      "keyset",
      "normalise",
      "normalize",
      "postprocessor",
      "preprocessor",
      "process",
      "processor",
      "same",
      "schema",
      "templating",
      "variable",
      "variables"
    ],
    "homepage": "https://codsen.com/os/json-variables",
    "repository": {
      "type": "git",
      "url": "git+https://github.com/codsen/codsen.git",
      "directory": "packages/json-variables"
    },
    "license": "MIT",
    "author": {
      "name": "Roy Revelt",
      "email": "roy@codsen.com",
      "url": "https://codsen.com"
    },
    "type": "module",
    "exports": {
      "types": "./types/index.d.ts",
      "script": "./dist/json-variables.umd.js",
      "default": "./dist/json-variables.esm.js"
    },
    "types": "types/index.d.ts",
    "scripts": {
      "build": "node '../../ops/scripts/esbuild.js' && npm run dts",
      "cjs-off": "exit 0",
      "cjs-on": "exit 0",
      "dev": "DEV=true node '../../ops/scripts/esbuild.js' && npm run dts",
      "devtest": "c8 npm run unit && npm run examples && npm run lint",
      "dts": "rollup -c && npm run prettier -- 'types/index.d.ts' --write --log-level 'silent'",
      "examples": "node '../../ops/scripts/run-examples.js'",
      "lect": "node '../../ops/lect/lect.js' && npm run prettier -- 'README.md' '.all-contributorsrc' 'rollup.config.js' --write",
      "letspublish": "npm publish || :",
      "lint": "eslint . --fix",
      "perf": "node perf/check.js",
      "prep": "echo 'ready'",
      "prettier": "prettier",
      "prettier:format": "npm run prettier -- --write '**/*.{ts,tsx,md}' --no-error-on-unmatched-pattern --log-level 'silent'",
      "pretest": "npm run lect && npm run build",
      "test": "npm run devtest",
      "unit": "uvu test"
    },
    "engines": {
      "node": ">=14.18.0"
    },
    "c8": {
      "check-coverage": true,
      "exclude": [
        "**/test/**/*.*"
      ],
      "lines": 100
    },
    "lect": {
      "licence": {
        "extras": [
          ""
        ]
      },
      "various": {}
    },
    "dependencies": {
      "arrayiffy-if-string": "^5.0.10",
      "ast-get-values-by-key": "^5.0.22",
      "ast-monkey-traverse": "^4.0.20",
      "codsen-utils": "^1.6.8",
      "matcher": "^5.0.0",
      "object-path": "^0.11.8",
      "ranges-apply": "^7.0.20",
      "ranges-push": "^7.0.19",
      "string-find-heads-tails": "^6.0.23",
      "string-match-left-right": "^9.0.23",
      "string-remove-duplicate-heads-tails": "^7.0.23"
    }
  },
  "lerna-clean-changelogs": {
    "name": "lerna-clean-changelogs",
    "version": "5.0.18",
    "description": "Removes frivolous entries from commitizen generated changelogs",
    "keywords": [
      "changelog",
      "cli",
      "conventional",
      "entries",
      "fix",
      "lerna",
      "manage",
      "manager",
      "monorepo",
      "patch",
      "tool",
      "utility"
    ],
    "homepage": "https://codsen.com/os/lerna-clean-changelogs",
    "repository": {
      "type": "git",
      "url": "git+https://github.com/codsen/codsen.git",
      "directory": "packages/lerna-clean-changelogs"
    },
    "license": "MIT",
    "author": {
      "name": "Roy Revelt",
      "email": "roy@codsen.com",
      "url": "https://codsen.com"
    },
    "type": "module",
    "exports": {
      "types": "./types/index.d.ts",
      "script": "./dist/lerna-clean-changelogs.umd.js",
      "default": "./dist/lerna-clean-changelogs.esm.js"
    },
    "types": "types/index.d.ts",
    "scripts": {
      "build": "node '../../ops/scripts/esbuild.js' && npm run dts",
      "cjs-off": "exit 0",
      "cjs-on": "exit 0",
      "dev": "DEV=true node '../../ops/scripts/esbuild.js' && npm run dts",
      "devtest": "c8 npm run unit && npm run examples && npm run lint",
      "dts": "rollup -c && npm run prettier -- 'types/index.d.ts' --write --log-level 'silent'",
      "examples": "node '../../ops/scripts/run-examples.js'",
      "lect": "node '../../ops/lect/lect.js' && npm run prettier -- 'README.md' '.all-contributorsrc' 'rollup.config.js' --write",
      "letspublish": "npm publish || :",
      "lint": "eslint . --fix",
      "perf": "node perf/check.js",
      "prep": "echo 'ready'",
      "prettier": "prettier",
      "prettier:format": "npm run prettier -- --write '**/*.{ts,tsx,md}' --no-error-on-unmatched-pattern --log-level 'silent'",
      "pretest": "npm run lect && npm run build",
      "test": "npm run devtest",
      "unit": "uvu test"
    },
    "engines": {
      "node": ">=14.18.0"
    },
    "c8": {
      "check-coverage": true,
      "exclude": [
        "**/test/**/*.*"
      ],
      "lines": 100
    },
    "lect": {
      "licence": {
        "extras": [
          ""
        ]
      }
    },
    "dependencies": {
      "codsen-utils": "^1.6.8"
    }
  },
  "lerna-clean-changelogs-cli": {
    "name": "lerna-clean-changelogs-cli",
    "version": "4.0.10",
    "description": "CLI application to cleanse the lerna/commitizen-generated changelogs",
    "keywords": [
      "changelog",
      "cli",
      "conventional",
      "entries",
      "fix",
      "lerna",
      "manage",
      "manager",
      "monorepo",
      "patch",
      "tool",
      "utility"
    ],
    "homepage": "https://codsen.com/os/lerna-clean-changelogs-cli",
    "repository": {
      "type": "git",
      "url": "git+https://github.com/codsen/codsen.git",
      "directory": "packages/lerna-clean-changelogs-cli"
    },
    "license": "MIT",
    "author": {
      "name": "Roy Revelt",
      "email": "roy@codsen.com",
      "url": "https://codsen.com"
    },
    "type": "module",
    "bin": {
      "lcc": "cli.js",
      "lernacleanchangelog": "cli.js"
    },
    "scripts": {
      "build": "exit 0",
      "cjs-off": "exit 0",
      "cjs-on": "exit 0",
      "dev": "exit 0",
      "devtest": "npm run test",
      "dts": "exit 0",
      "examples": "exit 0",
      "lect": "node '../../ops/lect/lect.js'",
      "letspublish": "npm publish || :",
      "lint": "eslint . --fix",
      "perf": "exit 0",
      "prep": "echo 'ready'",
      "prettier": "prettier",
      "prettier:format": "npm run prettier -- --write '**/*.{js,md}' --no-error-on-unmatched-pattern --log-level 'silent'",
      "pretest": "exit 0",
      "test": "c8 npm run unit && npm run lint",
      "unit": "uvu test"
    },
    "engines": {
      "node": ">=18"
    },
    "c8": {
      "check-coverage": false,
      "exclude": [
        "**/test/**/*.*"
      ]
    },
    "lect": {
      "cliSpecialKeyword": "",
      "cliSpecialKeywordInstructions": "",
      "licence": {
        "extras": [
          ""
        ]
      }
    },
    "dependencies": {
      "chalk": "^5.4.1",
      "fs-extra": "^11.3.0",
      "globby": "^14.1.0",
      "lerna-clean-changelogs": "^5.0.18",
      "meow": "^13.2.0",
      "p-filter": "^4.1.0",
      "p-reduce": "^3.0.0",
      "update-notifier": "^7.3.1",
      "write-file-atomic": "^6.0.0"
    },
    "devDependencies": {
      "p-map": "^7.0.3"
    }
  },
  "object-all-values-equal-to": {
    "name": "object-all-values-equal-to",
    "version": "4.0.22",
    "description": "Does the AST/nested-plain-object/array/whatever contain only one kind of value?",
    "keywords": [
      "all",
      "ast",
      "nested",
      "object",
      "plain",
      "posthtml-tree",
      "posthtmltree",
      "set",
      "to",
      "values",
      "write"
    ],
    "homepage": "https://codsen.com/os/object-all-values-equal-to",
    "repository": {
      "type": "git",
      "url": "git+https://github.com/codsen/codsen.git",
      "directory": "packages/object-all-values-equal-to"
    },
    "license": "MIT",
    "author": {
      "name": "Roy Revelt",
      "email": "roy@codsen.com",
      "url": "https://codsen.com"
    },
    "type": "module",
    "exports": {
      "types": "./types/index.d.ts",
      "script": "./dist/object-all-values-equal-to.umd.js",
      "default": "./dist/object-all-values-equal-to.esm.js"
    },
    "types": "types/index.d.ts",
    "scripts": {
      "build": "node '../../ops/scripts/esbuild.js' && npm run dts",
      "cjs-off": "exit 0",
      "cjs-on": "exit 0",
      "dev": "DEV=true node '../../ops/scripts/esbuild.js' && npm run dts",
      "devtest": "c8 npm run unit && npm run examples && npm run lint",
      "dts": "rollup -c && npm run prettier -- 'types/index.d.ts' --write --log-level 'silent'",
      "examples": "node '../../ops/scripts/run-examples.js'",
      "lect": "node '../../ops/lect/lect.js' && npm run prettier -- 'README.md' '.all-contributorsrc' 'rollup.config.js' --write",
      "letspublish": "npm publish || :",
      "lint": "eslint . --fix",
      "perf": "node perf/check.js",
      "prep": "echo 'ready'",
      "prettier": "prettier",
      "prettier:format": "npm run prettier -- --write '**/*.{ts,tsx,md}' --no-error-on-unmatched-pattern --log-level 'silent'",
      "pretest": "npm run lect && npm run build",
      "test": "npm run devtest",
      "unit": "uvu test"
    },
    "engines": {
      "node": ">=14.18.0"
    },
    "c8": {
      "check-coverage": true,
      "exclude": [
        "**/test/**/*.*"
      ],
      "lines": 100
    },
    "lect": {
      "licence": {
        "extras": [
          ""
        ]
      }
    },
    "dependencies": {
      "@types/lodash-es": "^4.17.12",
      "codsen-utils": "^1.6.8",
      "lodash-es": "^4.17.21"
    }
  },
  "object-boolean-combinations": {
    "name": "object-boolean-combinations",
    "version": "6.1.9",
    "description": "Consumes a defaults object with booleans, generates all possible variations of it",
    "keywords": [
      "all",
      "array",
      "boolean",
      "combinations",
      "create",
      "generate",
      "object",
      "permutations",
      "possible",
      "unique",
      "variations"
    ],
    "homepage": "https://codsen.com/os/object-boolean-combinations",
    "repository": {
      "type": "git",
      "url": "git+https://github.com/codsen/codsen.git",
      "directory": "packages/object-boolean-combinations"
    },
    "license": "MIT",
    "author": "Roy Revelt <roy@codsen.com> (http://codsen.com/)",
    "type": "module",
    "exports": {
      "types": "./types/index.d.ts",
      "script": "./dist/object-boolean-combinations.umd.js",
      "default": "./dist/object-boolean-combinations.esm.js"
    },
    "types": "types/index.d.ts",
    "scripts": {
      "build": "node '../../ops/scripts/esbuild.js' && npm run dts",
      "cjs-off": "exit 0",
      "cjs-on": "exit 0",
      "dev": "DEV=true node '../../ops/scripts/esbuild.js' && npm run dts",
      "devtest": "c8 npm run unit && npm run examples && npm run lint",
      "dts": "rollup -c && npm run prettier -- 'types/index.d.ts' --write --log-level 'silent'",
      "examples": "node '../../ops/scripts/run-examples.js'",
      "lect": "node '../../ops/lect/lect.js' && npm run prettier -- 'README.md' '.all-contributorsrc' 'rollup.config.js' --write",
      "letspublish": "npm publish || :",
      "lint": "eslint . --fix",
      "perf": "node perf/check.js",
      "prep": "echo 'ready'",
      "prettier": "prettier",
      "prettier:format": "npm run prettier -- --write '**/*.{ts,tsx,md}' --no-error-on-unmatched-pattern --log-level 'silent'",
      "pretest": "npm run lect && npm run build",
      "test": "npm run devtest",
      "unit": "uvu test"
    },
    "engines": {
      "node": ">=14.18.0"
    },
    "c8": {
      "check-coverage": true,
      "exclude": [
        "**/test/**/*.*"
      ],
      "lines": 100
    },
    "lect": {
      "licence": {
        "extras": [
          ""
        ]
      }
    },
    "dependencies": {
      "codsen-utils": "^1.6.8",
      "rfdc": "^1.4.1"
    }
  },
  "object-delete-key": {
    "name": "object-delete-key",
    "version": "4.0.30",
    "description": "Delete keys from all arrays or plain objects, nested within anything, by key or by value or by both, and clean up afterwards. Accepts wildcards.",
    "keywords": [
      "ast",
      "by",
      "delete",
      "drop",
      "from",
      "html",
      "key",
      "object",
      "parser",
      "plain",
      "posthtml",
      "posthtml-tree",
      "posthtmltree",
      "tree",
      "value",
      "xml"
    ],
    "homepage": "https://codsen.com/os/object-delete-key",
    "repository": {
      "type": "git",
      "url": "git+https://github.com/codsen/codsen.git",
      "directory": "packages/object-delete-key"
    },
    "license": "MIT",
    "author": {
      "name": "Roy Revelt",
      "email": "roy@codsen.com",
      "url": "https://codsen.com"
    },
    "type": "module",
    "exports": {
      "types": "./types/index.d.ts",
      "script": "./dist/object-delete-key.umd.js",
      "default": "./dist/object-delete-key.esm.js"
    },
    "types": "types/index.d.ts",
    "scripts": {
      "build": "node '../../ops/scripts/esbuild.js' && npm run dts",
      "cjs-off": "exit 0",
      "cjs-on": "exit 0",
      "dev": "DEV=true node '../../ops/scripts/esbuild.js' && npm run dts",
      "devtest": "c8 npm run unit && npm run examples && npm run lint",
      "dts": "rollup -c && npm run prettier -- 'types/index.d.ts' --write --log-level 'silent'",
      "examples": "node '../../ops/scripts/run-examples.js'",
      "lect": "node '../../ops/lect/lect.js' && npm run prettier -- 'README.md' '.all-contributorsrc' 'rollup.config.js' --write",
      "letspublish": "npm publish || :",
      "lint": "eslint . --fix",
      "perf": "node perf/check.js",
      "prep": "echo 'ready'",
      "prettier": "prettier",
      "prettier:format": "npm run prettier -- --write '**/*.{ts,tsx,md}' --no-error-on-unmatched-pattern --log-level 'silent'",
      "pretest": "npm run lect && npm run build",
      "test": "npm run devtest",
      "unit": "uvu test"
    },
    "engines": {
      "node": ">=14.18.0"
    },
    "c8": {
      "check-coverage": true,
      "exclude": [
        "**/test/**/*.*"
      ],
      "lines": 100
    },
    "lect": {
      "licence": {
        "extras": [
          ""
        ]
      }
    },
    "dependencies": {
      "ast-is-empty": "^4.0.19",
      "ast-monkey": "^9.0.30",
      "rfdc": "^1.4.1",
      "util-array-object-or-both": "^5.0.15"
    }
  },
  "object-fill-missing-keys": {
    "name": "object-fill-missing-keys",
    "version": "11.0.22",
    "description": "Add missing keys into plain objects, according to a reference object",
    "keywords": [
      "add",
      "ast",
      "fill",
      "json",
      "keys",
      "missing",
      "normalise",
      "normalize",
      "object",
      "plain",
      "posthtml-tree",
      "posthtmltree",
      "schema",
      "unify"
    ],
    "homepage": "https://codsen.com/os/object-fill-missing-keys",
    "repository": {
      "type": "git",
      "url": "git+https://github.com/codsen/codsen.git",
      "directory": "packages/object-fill-missing-keys"
    },
    "license": "MIT",
    "author": {
      "name": "Roy Revelt",
      "email": "roy@codsen.com",
      "url": "https://codsen.com"
    },
    "type": "module",
    "exports": {
      "types": "./types/index.d.ts",
      "script": "./dist/object-fill-missing-keys.umd.js",
      "default": "./dist/object-fill-missing-keys.esm.js"
    },
    "types": "types/index.d.ts",
    "scripts": {
      "build": "node '../../ops/scripts/esbuild.js' && npm run dts",
      "cjs-off": "exit 0",
      "cjs-on": "exit 0",
      "dev": "DEV=true node '../../ops/scripts/esbuild.js' && npm run dts",
      "devtest": "c8 npm run unit && npm run examples && npm run lint",
      "dts": "rollup -c && npm run prettier -- 'types/index.d.ts' --write --log-level 'silent'",
      "examples": "node '../../ops/scripts/run-examples.js'",
      "lect": "node '../../ops/lect/lect.js' && npm run prettier -- 'README.md' '.all-contributorsrc' 'rollup.config.js' --write",
      "letspublish": "npm publish || :",
      "lint": "eslint . --fix",
      "perf": "node perf/check.js",
      "prep": "echo 'ready'",
      "prettier": "prettier",
      "prettier:format": "npm run prettier -- --write '**/*.{ts,tsx,md}' --no-error-on-unmatched-pattern --log-level 'silent'",
      "pretest": "npm run lect && npm run build",
      "test": "npm run devtest",
      "unit": "uvu test"
    },
    "engines": {
      "node": ">=14.18.0"
    },
    "c8": {
      "check-coverage": true,
      "exclude": [
        "**/test/**/*.*"
      ],
      "lines": 100
    },
    "lect": {
      "licence": {
        "extras": [
          ""
        ]
      }
    },
    "dependencies": {
      "arrayiffy-if-string": "^5.0.10",
      "codsen-utils": "^1.6.8",
      "object-all-values-equal-to": "^4.0.22",
      "object-merge-advanced": "^14.0.22",
      "rfdc": "^1.4.1"
    }
  },
  "object-flatten-all-arrays": {
    "name": "object-flatten-all-arrays",
    "version": "7.0.23",
    "description": "Merge and flatten any arrays found in all values within plain objects",
    "keywords": [
      "arrays",
      "ast",
      "flatten",
      "merge",
      "nested",
      "object",
      "plain",
      "posthtml-tree",
      "posthtmltree",
      "values",
      "write"
    ],
    "homepage": "https://codsen.com/os/object-flatten-all-arrays",
    "repository": {
      "type": "git",
      "url": "git+https://github.com/codsen/codsen.git",
      "directory": "packages/object-flatten-all-arrays"
    },
    "license": "MIT",
    "author": {
      "name": "Roy Revelt",
      "email": "roy@codsen.com",
      "url": "https://codsen.com"
    },
    "type": "module",
    "exports": {
      "types": "./types/index.d.ts",
      "script": "./dist/object-flatten-all-arrays.umd.js",
      "default": "./dist/object-flatten-all-arrays.esm.js"
    },
    "types": "types/index.d.ts",
    "scripts": {
      "build": "node '../../ops/scripts/esbuild.js' && npm run dts",
      "cjs-off": "exit 0",
      "cjs-on": "exit 0",
      "dev": "DEV=true node '../../ops/scripts/esbuild.js' && npm run dts",
      "devtest": "c8 npm run unit && npm run examples && npm run lint",
      "dts": "rollup -c && npm run prettier -- 'types/index.d.ts' --write --log-level 'silent'",
      "examples": "node '../../ops/scripts/run-examples.js'",
      "lect": "node '../../ops/lect/lect.js' && npm run prettier -- 'README.md' '.all-contributorsrc' 'rollup.config.js' --write",
      "letspublish": "npm publish || :",
      "lint": "eslint . --fix",
      "perf": "node perf/check.js",
      "prep": "echo 'ready'",
      "prettier": "prettier",
      "prettier:format": "npm run prettier -- --write '**/*.{ts,tsx,md}' --no-error-on-unmatched-pattern --log-level 'silent'",
      "pretest": "npm run lect && npm run build",
      "test": "npm run devtest",
      "unit": "uvu test"
    },
    "engines": {
      "node": ">=14.18.0"
    },
    "c8": {
      "check-coverage": true,
      "exclude": [
        "**/test/**/*.*"
      ],
      "lines": 100
    },
    "lect": {
      "licence": {
        "extras": [
          ""
        ]
      }
    },
    "dependencies": {
      "@types/lodash-es": "^4.17.12",
      "codsen-utils": "^1.6.8",
      "lodash-es": "^4.17.21",
      "rfdc": "^1.4.1"
    }
  },
  "object-flatten-referencing": {
    "name": "object-flatten-referencing",
    "version": "7.0.22",
    "description": "Flatten complex nested objects according to a reference objects",
    "keywords": [
      "advanced",
      "content",
      "email",
      "flat",
      "flatten",
      "mapping",
      "object",
      "objects",
      "plain",
      "wrap"
    ],
    "homepage": "https://codsen.com/os/object-flatten-referencing",
    "repository": {
      "type": "git",
      "url": "git+https://github.com/codsen/codsen.git",
      "directory": "packages/object-flatten-referencing"
    },
    "license": "MIT",
    "author": {
      "name": "Roy Revelt",
      "email": "roy@codsen.com",
      "url": "https://codsen.com"
    },
    "type": "module",
    "exports": {
      "types": "./types/index.d.ts",
      "script": "./dist/object-flatten-referencing.umd.js",
      "default": "./dist/object-flatten-referencing.esm.js"
    },
    "types": "types/index.d.ts",
    "scripts": {
      "build": "node '../../ops/scripts/esbuild.js' && npm run dts",
      "cjs-off": "exit 0",
      "cjs-on": "exit 0",
      "dev": "DEV=true node '../../ops/scripts/esbuild.js' && npm run dts",
      "devtest": "c8 npm run unit && npm run examples && npm run lint",
      "dts": "rollup -c && npm run prettier -- 'types/index.d.ts' --write --log-level 'silent'",
      "examples": "node '../../ops/scripts/run-examples.js'",
      "lect": "node '../../ops/lect/lect.js' && npm run prettier -- 'README.md' '.all-contributorsrc' 'rollup.config.js' --write",
      "letspublish": "npm publish || :",
      "lint": "eslint . --fix",
      "perf": "node perf/check.js",
      "prep": "echo 'ready'",
      "prettier": "prettier",
      "prettier:format": "npm run prettier -- --write '**/*.{ts,tsx,md}' --no-error-on-unmatched-pattern --log-level 'silent'",
      "pretest": "npm run lect && npm run build",
      "test": "npm run devtest",
      "unit": "uvu test"
    },
    "engines": {
      "node": ">=14.18.0"
    },
    "c8": {
      "check-coverage": true,
      "exclude": [
        "**/test/**/*.*"
      ],
      "lines": 100
    },
    "lect": {
      "licence": {
        "extras": [
          ""
        ]
      }
    },
    "dependencies": {
      "arrayiffy-if-string": "^5.0.10",
      "codsen-utils": "^1.6.8",
      "matcher": "^5.0.0",
      "rfdc": "^1.4.1",
      "str-indexes-of-plus": "^5.0.9"
    }
  },
  "object-merge-advanced": {
    "name": "object-merge-advanced",
    "version": "14.0.22",
    "description": "Deeply merge JSON-like data structures",
    "keywords": [
      "advanced",
      "ast",
      "deep",
      "deeply",
      "json",
      "two",
      "merge",
      "data",
      "structure",
      "structures",
      "plain",
      "object",
      "objects"
    ],
    "homepage": "https://codsen.com/os/object-merge-advanced",
    "repository": {
      "type": "git",
      "url": "git+https://github.com/codsen/codsen.git",
      "directory": "packages/object-merge-advanced"
    },
    "license": "MIT",
    "author": {
      "name": "Roy Revelt",
      "email": "roy@codsen.com",
      "url": "https://codsen.com"
    },
    "type": "module",
    "exports": {
      "types": "./types/index.d.ts",
      "script": "./dist/object-merge-advanced.umd.js",
      "default": "./dist/object-merge-advanced.esm.js"
    },
    "types": "types/index.d.ts",
    "scripts": {
      "build": "node '../../ops/scripts/esbuild.js' && npm run dts",
      "cjs-off": "exit 0",
      "cjs-on": "exit 0",
      "dev": "DEV=true node '../../ops/scripts/esbuild.js' && npm run dts",
      "devtest": "c8 npm run unit && npm run examples && npm run lint",
      "dts": "rollup -c && npm run prettier -- 'types/index.d.ts' --write --log-level 'silent'",
      "examples": "node '../../ops/scripts/run-examples.js'",
      "lect": "node '../../ops/lect/lect.js' && npm run prettier -- 'README.md' '.all-contributorsrc' 'rollup.config.js' --write",
      "letspublish": "npm publish || :",
      "lint": "eslint . --fix",
      "perf": "node perf/check.js",
      "prep": "echo 'ready'",
      "prettier": "prettier",
      "prettier:format": "npm run prettier -- --write '**/*.{ts,tsx,md}' --no-error-on-unmatched-pattern --log-level 'silent'",
      "pretest": "npm run lect && npm run build",
      "test": "npm run devtest",
      "unit": "uvu test"
    },
    "engines": {
      "node": ">=14.18.0"
    },
    "c8": {
      "check-coverage": true,
      "exclude": [
        "**/test/**/*.*"
      ],
      "lines": 100
    },
    "lect": {
      "licence": {
        "extras": [
          ""
        ]
      }
    },
    "dependencies": {
      "@types/lodash-es": "^4.17.12",
      "codsen-utils": "^1.6.8",
      "lodash-es": "^4.17.21",
      "matcher": "^5.0.0",
      "rfdc": "^1.4.1",
      "util-nonempty": "^5.0.19"
    },
    "devDependencies": {
      "deep-equal": "^2.2.3"
    }
  },
  "object-no-new-keys": {
    "name": "object-no-new-keys",
    "version": "5.1.9",
    "description": "Check, does a plain object (AST/JSON) has any unique keys, not present in a reference object (another AST/JSON)",
    "keywords": [
      "compare",
      "deep",
      "difference",
      "keys",
      "match",
      "new",
      "no",
      "object",
      "plain",
      "schema",
      "unique",
      "validate"
    ],
    "homepage": "https://codsen.com/os/object-no-new-keys",
    "repository": {
      "type": "git",
      "url": "git+https://github.com/codsen/codsen.git",
      "directory": "packages/object-no-new-keys"
    },
    "license": "MIT",
    "author": {
      "name": "Roy Revelt",
      "email": "roy@codsen.com",
      "url": "https://codsen.com"
    },
    "type": "module",
    "exports": {
      "types": "./types/index.d.ts",
      "script": "./dist/object-no-new-keys.umd.js",
      "default": "./dist/object-no-new-keys.esm.js"
    },
    "types": "types/index.d.ts",
    "scripts": {
      "build": "node '../../ops/scripts/esbuild.js' && npm run dts",
      "cjs-off": "exit 0",
      "cjs-on": "exit 0",
      "dev": "DEV=true node '../../ops/scripts/esbuild.js' && npm run dts",
      "devtest": "c8 npm run unit && npm run examples && npm run lint",
      "dts": "rollup -c && npm run prettier -- 'types/index.d.ts' --write --log-level 'silent'",
      "examples": "node '../../ops/scripts/run-examples.js'",
      "lect": "node '../../ops/lect/lect.js' && npm run prettier -- 'README.md' '.all-contributorsrc' 'rollup.config.js' --write",
      "letspublish": "npm publish || :",
      "lint": "eslint . --fix",
      "perf": "node perf/check.js",
      "prep": "echo 'ready'",
      "prettier": "prettier",
      "prettier:format": "npm run prettier -- --write '**/*.{ts,tsx,md}' --no-error-on-unmatched-pattern --log-level 'silent'",
      "pretest": "npm run lect && npm run build",
      "test": "npm run devtest",
      "unit": "uvu test"
    },
    "engines": {
      "node": ">=14.18.0"
    },
    "c8": {
      "check-coverage": true,
      "exclude": [
        "**/test/**/*.*"
      ],
      "lines": 100
    },
    "lect": {
      "licence": {
        "extras": [
          ""
        ]
      }
    },
    "dependencies": {
      "codsen-utils": "^1.6.8"
    }
  },
  "object-set-all-values-to": {
    "name": "object-set-all-values-to",
    "version": "6.0.20",
    "description": "Recursively walk the input and set all found values in plain objects to something",
    "keywords": [
      "all",
      "ast",
      "nested",
      "object",
      "plain",
      "posthtml-tree",
      "posthtmltree",
      "set",
      "to",
      "values",
      "write"
    ],
    "homepage": "https://codsen.com/os/object-set-all-values-to",
    "repository": {
      "type": "git",
      "url": "git+https://github.com/codsen/codsen.git",
      "directory": "packages/object-set-all-values-to"
    },
    "license": "MIT",
    "author": {
      "name": "Roy Revelt",
      "email": "roy@codsen.com",
      "url": "https://codsen.com"
    },
    "type": "module",
    "exports": {
      "types": "./types/index.d.ts",
      "script": "./dist/object-set-all-values-to.umd.js",
      "default": "./dist/object-set-all-values-to.esm.js"
    },
    "types": "types/index.d.ts",
    "scripts": {
      "build": "node '../../ops/scripts/esbuild.js' && npm run dts",
      "cjs-off": "exit 0",
      "cjs-on": "exit 0",
      "dev": "DEV=true node '../../ops/scripts/esbuild.js' && npm run dts",
      "devtest": "c8 npm run unit && npm run examples && npm run lint",
      "dts": "rollup -c && npm run prettier -- 'types/index.d.ts' --write --log-level 'silent'",
      "examples": "node '../../ops/scripts/run-examples.js'",
      "lect": "node '../../ops/lect/lect.js' && npm run prettier -- 'README.md' '.all-contributorsrc' 'rollup.config.js' --write",
      "letspublish": "npm publish || :",
      "lint": "eslint . --fix",
      "perf": "node perf/check.js",
      "prep": "echo 'ready'",
      "prettier": "prettier",
      "prettier:format": "npm run prettier -- --write '**/*.{ts,tsx,md}' --no-error-on-unmatched-pattern --log-level 'silent'",
      "pretest": "npm run lect && npm run build",
      "test": "npm run devtest",
      "unit": "uvu test"
    },
    "engines": {
      "node": ">=14.18.0"
    },
    "c8": {
      "check-coverage": true,
      "exclude": [
        "**/test/**/*.*"
      ],
      "lines": 100
    },
    "lect": {
      "licence": {
        "extras": [
          ""
        ]
      }
    },
    "dependencies": {
      "codsen-utils": "^1.6.8",
      "rfdc": "^1.4.1"
    }
  },
  "ranges-apply": {
    "name": "ranges-apply",
    "version": "7.0.20",
    "description": "Take an array of string index ranges, delete/replace the string according to them",
    "keywords": [
      "delete",
      "from",
      "many",
      "multiple",
      "ranges",
      "replace",
      "slice",
      "slices",
      "splice",
      "string"
    ],
    "homepage": "https://codsen.com/os/ranges-apply",
    "repository": {
      "type": "git",
      "url": "git+https://github.com/codsen/codsen.git",
      "directory": "packages/ranges-apply"
    },
    "license": "MIT",
    "author": {
      "name": "Roy Revelt",
      "email": "roy@codsen.com",
      "url": "https://codsen.com"
    },
    "type": "module",
    "exports": {
      "types": "./types/index.d.ts",
      "script": "./dist/ranges-apply.umd.js",
      "default": "./dist/ranges-apply.esm.js"
    },
    "types": "types/index.d.ts",
    "scripts": {
      "build": "node '../../ops/scripts/esbuild.js' && npm run dts",
      "cjs-off": "exit 0",
      "cjs-on": "exit 0",
      "dev": "DEV=true node '../../ops/scripts/esbuild.js' && npm run dts",
      "devtest": "c8 npm run unit && npm run examples && npm run lint",
      "dts": "rollup -c && npm run prettier -- 'types/index.d.ts' --write --log-level 'silent'",
      "examples": "node '../../ops/scripts/run-examples.js'",
      "lect": "node '../../ops/lect/lect.js' && npm run prettier -- 'README.md' '.all-contributorsrc' 'rollup.config.js' --write",
      "letspublish": "npm publish || :",
      "lint": "eslint . --fix",
      "perf": "node perf/check.js",
      "prep": "echo 'ready'",
      "prettier": "prettier",
      "prettier:format": "npm run prettier -- --write '**/*.{ts,tsx,md}' --no-error-on-unmatched-pattern --log-level 'silent'",
      "pretest": "npm run lect && npm run build",
      "test": "npm run devtest",
      "unit": "uvu test"
    },
    "engines": {
      "node": ">=14.18.0"
    },
    "c8": {
      "check-coverage": true,
      "exclude": [
        "**/test/**/*.*"
      ],
      "lines": 100
    },
    "lect": {
      "licence": {
        "extras": [
          ""
        ]
      }
    },
    "dependencies": {
      "ranges-merge": "^9.0.19",
      "tiny-invariant": "^1.3.3"
    }
  },
  "ranges-crop": {
    "name": "ranges-crop",
    "version": "6.0.20",
    "description": "Crop array of ranges when they go beyond the reference string’s length",
    "keywords": [
      "array",
      "crop",
      "index",
      "indexes",
      "length",
      "limit",
      "range",
      "ranges",
      "string"
    ],
    "homepage": "https://codsen.com/os/ranges-crop",
    "repository": {
      "type": "git",
      "url": "git+https://github.com/codsen/codsen.git",
      "directory": "packages/ranges-crop"
    },
    "license": "MIT",
    "author": {
      "name": "Roy Revelt",
      "email": "roy@codsen.com",
      "url": "https://codsen.com"
    },
    "type": "module",
    "exports": {
      "types": "./types/index.d.ts",
      "script": "./dist/ranges-crop.umd.js",
      "default": "./dist/ranges-crop.esm.js"
    },
    "types": "types/index.d.ts",
    "scripts": {
      "build": "node '../../ops/scripts/esbuild.js' && npm run dts",
      "cjs-off": "exit 0",
      "cjs-on": "exit 0",
      "dev": "DEV=true node '../../ops/scripts/esbuild.js' && npm run dts",
      "devtest": "c8 npm run unit && npm run examples && npm run lint",
      "dts": "rollup -c && npm run prettier -- 'types/index.d.ts' --write --log-level 'silent'",
      "examples": "node '../../ops/scripts/run-examples.js'",
      "lect": "node '../../ops/lect/lect.js' && npm run prettier -- 'README.md' '.all-contributorsrc' 'rollup.config.js' --write",
      "letspublish": "npm publish || :",
      "lint": "eslint . --fix",
      "perf": "node perf/check.js",
      "prep": "echo 'ready'",
      "prettier": "prettier",
      "prettier:format": "npm run prettier -- --write '**/*.{ts,tsx,md}' --no-error-on-unmatched-pattern --log-level 'silent'",
      "pretest": "npm run lect && npm run build",
      "test": "npm run devtest",
      "unit": "uvu test"
    },
    "engines": {
      "node": ">=14.18.0"
    },
    "c8": {
      "check-coverage": true,
      "exclude": [
        "**/test/**/*.*"
      ],
      "lines": 100
    },
    "lect": {
      "licence": {
        "extras": [
          ""
        ]
      }
    },
    "dependencies": {
      "ranges-merge": "^9.0.19"
    },
    "devDependencies": {
      "ranges-apply": "^7.0.20",
      "rfdc": "^1.4.1"
    }
  },
  "ranges-ent-decode": {
    "name": "ranges-ent-decode",
    "version": "6.0.23",
    "description": "Recursive HTML entity decoding for Ranges workflow",
    "keywords": [
      "astral",
      "decode",
      "decoder",
      "encode",
      "encoder",
      "entities",
      "entity",
      "he",
      "html",
      "ranges",
      "string"
    ],
    "homepage": "https://codsen.com/os/ranges-ent-decode",
    "repository": {
      "type": "git",
      "url": "git+https://github.com/codsen/codsen.git",
      "directory": "packages/ranges-ent-decode"
    },
    "license": "MIT",
    "author": {
      "name": "Roy Revelt",
      "email": "roy@codsen.com",
      "url": "https://codsen.com"
    },
    "type": "module",
    "exports": {
      "types": "./types/index.d.ts",
      "script": "./dist/ranges-ent-decode.umd.js",
      "default": "./dist/ranges-ent-decode.esm.js"
    },
    "types": "types/index.d.ts",
    "scripts": {
      "build": "node '../../ops/scripts/esbuild.js' && npm run dts",
      "cjs-off": "exit 0",
      "cjs-on": "exit 0",
      "dev": "DEV=true node '../../ops/scripts/esbuild.js' && npm run dts",
      "devtest": "c8 npm run unit && npm run examples && npm run lint",
      "dts": "rollup -c && npm run prettier -- 'types/index.d.ts' --write --log-level 'silent'",
      "examples": "node '../../ops/scripts/run-examples.js'",
      "lect": "node '../../ops/lect/lect.js' && npm run prettier -- 'README.md' '.all-contributorsrc' 'rollup.config.js' --write",
      "letspublish": "npm publish || :",
      "lint": "eslint . --fix",
      "perf": "node perf/check.js",
      "prep": "echo 'ready'",
      "prettier": "prettier",
      "prettier:format": "npm run prettier -- --write '**/*.{ts,tsx,md}' --no-error-on-unmatched-pattern --log-level 'silent'",
      "pretest": "npm run lect && npm run build",
      "test": "npm run devtest",
      "unit": "uvu test"
    },
    "engines": {
      "node": ">=14.18.0"
    },
    "c8": {
      "check-coverage": true,
      "exclude": [
        "**/test/**/*.*"
      ],
      "lines": 100
    },
    "lect": {
      "licence": {
        "extras": [
          "",
          "Some tests and some regexes adapted from he.js\nMIT Licence - Copyright © 2013-2018 Mathias Bynens <https://mathiasbynens.be/>\nhttps://github.com/mathiasbynens/he"
        ]
      }
    },
    "dependencies": {
      "codsen-utils": "^1.6.8",
      "he": "^1.2.0",
      "ranges-merge": "^9.0.19"
    },
    "devDependencies": {
      "@types/he": "^1.2.3"
    }
  },
  "ranges-invert": {
    "name": "ranges-invert",
    "version": "6.0.20",
    "description": "Invert string index ranges",
    "keywords": [
      "array",
      "indexes",
      "ranges",
      "sort",
      "string"
    ],
    "homepage": "https://codsen.com/os/ranges-invert",
    "repository": {
      "type": "git",
      "url": "git+https://github.com/codsen/codsen.git",
      "directory": "packages/ranges-invert"
    },
    "license": "MIT",
    "author": {
      "name": "Roy Revelt",
      "email": "roy@codsen.com",
      "url": "https://codsen.com"
    },
    "type": "module",
    "exports": {
      "types": "./types/index.d.ts",
      "script": "./dist/ranges-invert.umd.js",
      "default": "./dist/ranges-invert.esm.js"
    },
    "types": "types/index.d.ts",
    "scripts": {
      "build": "node '../../ops/scripts/esbuild.js' && npm run dts",
      "cjs-off": "exit 0",
      "cjs-on": "exit 0",
      "dev": "DEV=true node '../../ops/scripts/esbuild.js' && npm run dts",
      "devtest": "c8 npm run unit && npm run examples && npm run lint",
      "dts": "rollup -c && npm run prettier -- 'types/index.d.ts' --write --log-level 'silent'",
      "examples": "node '../../ops/scripts/run-examples.js'",
      "lect": "node '../../ops/lect/lect.js' && npm run prettier -- 'README.md' '.all-contributorsrc' 'rollup.config.js' --write",
      "letspublish": "npm publish || :",
      "lint": "eslint . --fix",
      "perf": "node perf/check.js",
      "prep": "echo 'ready'",
      "prettier": "prettier",
      "prettier:format": "npm run prettier -- --write '**/*.{ts,tsx,md}' --no-error-on-unmatched-pattern --log-level 'silent'",
      "pretest": "npm run lect && npm run build",
      "test": "npm run devtest",
      "unit": "uvu test"
    },
    "engines": {
      "node": ">=14.18.0"
    },
    "c8": {
      "check-coverage": true,
      "exclude": [
        "**/test/**/*.*"
      ],
      "lines": 100
    },
    "lect": {
      "licence": {
        "extras": [
          ""
        ]
      }
    },
    "dependencies": {
      "ranges-crop": "^6.0.20",
      "ranges-merge": "^9.0.19"
    }
  },
  "ranges-is-index-within": {
    "name": "ranges-is-index-within",
    "version": "4.0.13",
    "description": "Checks if index is within any of the given string index ranges",
    "keywords": [
      "index",
      "is",
      "ranges",
      "string",
      "within"
    ],
    "homepage": "https://codsen.com/os/ranges-is-index-within",
    "repository": {
      "type": "git",
      "url": "git+https://github.com/codsen/codsen.git",
      "directory": "packages/ranges-is-index-within"
    },
    "license": "MIT",
    "author": {
      "name": "Roy Revelt",
      "email": "roy@codsen.com",
      "url": "https://codsen.com"
    },
    "type": "module",
    "exports": {
      "types": "./types/index.d.ts",
      "script": "./dist/ranges-is-index-within.umd.js",
      "default": "./dist/ranges-is-index-within.esm.js"
    },
    "types": "types/index.d.ts",
    "scripts": {
      "build": "node '../../ops/scripts/esbuild.js' && npm run dts",
      "cjs-off": "exit 0",
      "cjs-on": "exit 0",
      "dev": "DEV=true node '../../ops/scripts/esbuild.js' && npm run dts",
      "devtest": "c8 npm run unit && npm run examples && npm run lint",
      "dts": "rollup -c && npm run prettier -- 'types/index.d.ts' --write --log-level 'silent'",
      "examples": "node '../../ops/scripts/run-examples.js'",
      "lect": "node '../../ops/lect/lect.js' && npm run prettier -- 'README.md' '.all-contributorsrc' 'rollup.config.js' --write",
      "letspublish": "npm publish || :",
      "lint": "eslint . --fix",
      "perf": "node perf/check.js",
      "prep": "echo 'ready'",
      "prettier": "prettier",
      "prettier:format": "npm run prettier -- --write '**/*.{ts,tsx,md}' --no-error-on-unmatched-pattern --log-level 'silent'",
      "pretest": "npm run lect && npm run build",
      "test": "npm run devtest",
      "unit": "uvu test"
    },
    "engines": {
      "node": ">=14.18.0"
    },
    "c8": {
      "check-coverage": true,
      "exclude": [
        "**/test/**/*.*"
      ],
      "lines": 100
    },
    "lect": {
      "licence": {
        "extras": [
          ""
        ]
      }
    }
  },
  "ranges-iterate": {
    "name": "ranges-iterate",
    "version": "4.0.20",
    "description": "Iterate a string and any changes within given string index ranges",
    "keywords": [
      "array",
      "indexes",
      "iterate",
      "loop",
      "manage",
      "operations",
      "perf",
      "ranges",
      "string",
      "through"
    ],
    "homepage": "https://codsen.com/os/ranges-iterate",
    "repository": {
      "type": "git",
      "url": "git+https://github.com/codsen/codsen.git",
      "directory": "packages/ranges-iterate"
    },
    "license": "MIT",
    "author": {
      "name": "Roy Revelt",
      "email": "roy@codsen.com",
      "url": "https://codsen.com"
    },
    "type": "module",
    "exports": {
      "types": "./types/index.d.ts",
      "script": "./dist/ranges-iterate.umd.js",
      "default": "./dist/ranges-iterate.esm.js"
    },
    "types": "types/index.d.ts",
    "scripts": {
      "build": "node '../../ops/scripts/esbuild.js' && npm run dts",
      "cjs-off": "exit 0",
      "cjs-on": "exit 0",
      "dev": "DEV=true node '../../ops/scripts/esbuild.js' && npm run dts",
      "devtest": "c8 npm run unit && npm run examples && npm run lint",
      "dts": "rollup -c && npm run prettier -- 'types/index.d.ts' --write --log-level 'silent'",
      "examples": "node '../../ops/scripts/run-examples.js'",
      "lect": "node '../../ops/lect/lect.js' && npm run prettier -- 'README.md' '.all-contributorsrc' 'rollup.config.js' --write",
      "letspublish": "npm publish || :",
      "lint": "eslint . --fix",
      "perf": "node perf/check.js",
      "prep": "echo 'ready'",
      "prettier": "prettier",
      "prettier:format": "npm run prettier -- --write '**/*.{ts,tsx,md}' --no-error-on-unmatched-pattern --log-level 'silent'",
      "pretest": "npm run lect && npm run build",
      "test": "npm run devtest",
      "unit": "uvu test"
    },
    "engines": {
      "node": ">=14.18.0"
    },
    "c8": {
      "check-coverage": true,
      "exclude": [
        "**/test/**/*.*"
      ],
      "lines": 100
    },
    "lect": {
      "licence": {
        "extras": [
          ""
        ]
      }
    },
    "devDependencies": {
      "ranges-apply": "^7.0.20",
      "ranges-merge": "^9.0.19"
    }
  },
  "ranges-merge": {
    "name": "ranges-merge",
    "version": "9.0.19",
    "description": "Merge and sort string index ranges",
    "keywords": [
      "index",
      "join",
      "manage",
      "merge",
      "multiple",
      "ranges",
      "slices",
      "string",
      "substring",
      "two"
    ],
    "homepage": "https://codsen.com/os/ranges-merge",
    "repository": {
      "type": "git",
      "url": "git+https://github.com/codsen/codsen.git",
      "directory": "packages/ranges-merge"
    },
    "license": "MIT",
    "author": {
      "name": "Roy Revelt",
      "email": "roy@codsen.com",
      "url": "https://codsen.com"
    },
    "type": "module",
    "exports": {
      "types": "./types/index.d.ts",
      "script": "./dist/ranges-merge.umd.js",
      "default": "./dist/ranges-merge.esm.js"
    },
    "types": "types/index.d.ts",
    "scripts": {
      "build": "node '../../ops/scripts/esbuild.js' && npm run dts",
      "cjs-off": "exit 0",
      "cjs-on": "exit 0",
      "dev": "DEV=true node '../../ops/scripts/esbuild.js' && npm run dts",
      "devtest": "c8 npm run unit && npm run examples && npm run lint",
      "dts": "rollup -c && npm run prettier -- 'types/index.d.ts' --write --log-level 'silent'",
      "examples": "node '../../ops/scripts/run-examples.js'",
      "lect": "node '../../ops/lect/lect.js' && npm run prettier -- 'README.md' '.all-contributorsrc' 'rollup.config.js' --write",
      "letspublish": "npm publish || :",
      "lint": "eslint . --fix",
      "perf": "node perf/check.js",
      "prep": "echo 'ready'",
      "prettier": "prettier",
      "prettier:format": "npm run prettier -- --write '**/*.{ts,tsx,md}' --no-error-on-unmatched-pattern --log-level 'silent'",
      "pretest": "npm run lect && npm run build",
      "test": "npm run devtest",
      "unit": "uvu test"
    },
    "engines": {
      "node": ">=14.18.0"
    },
    "c8": {
      "check-coverage": true,
      "exclude": [
        "**/test/**/*.*"
      ],
      "lines": 100
    },
    "lect": {
      "licence": {
        "extras": [
          ""
        ]
      }
    },
    "dependencies": {
      "ranges-push": "^7.0.19",
      "ranges-sort": "^6.0.14"
    },
    "devDependencies": {
      "rfdc": "^1.4.1"
    }
  },
  "ranges-process-outside": {
    "name": "ranges-process-outside",
    "version": "6.0.20",
    "description": "Iterate string considering ranges, as if they were already applied",
    "keywords": [
      "array",
      "indexes",
      "ranges",
      "sort",
      "string"
    ],
    "homepage": "https://codsen.com/os/ranges-process-outside",
    "repository": {
      "type": "git",
      "url": "git+https://github.com/codsen/codsen.git",
      "directory": "packages/ranges-process-outside"
    },
    "license": "MIT",
    "author": {
      "name": "Roy Revelt",
      "email": "roy@codsen.com",
      "url": "https://codsen.com"
    },
    "type": "module",
    "exports": {
      "types": "./types/index.d.ts",
      "script": "./dist/ranges-process-outside.umd.js",
      "default": "./dist/ranges-process-outside.esm.js"
    },
    "types": "types/index.d.ts",
    "scripts": {
      "build": "node '../../ops/scripts/esbuild.js' && npm run dts",
      "cjs-off": "exit 0",
      "cjs-on": "exit 0",
      "dev": "DEV=true node '../../ops/scripts/esbuild.js' && npm run dts",
      "devtest": "c8 npm run unit && npm run examples && npm run lint",
      "dts": "rollup -c && npm run prettier -- 'types/index.d.ts' --write --log-level 'silent'",
      "examples": "node '../../ops/scripts/run-examples.js'",
      "lect": "node '../../ops/lect/lect.js' && npm run prettier -- 'README.md' '.all-contributorsrc' 'rollup.config.js' --write",
      "letspublish": "npm publish || :",
      "lint": "eslint . --fix",
      "perf": "node perf/check.js",
      "prep": "echo 'ready'",
      "prettier": "prettier",
      "prettier:format": "npm run prettier -- --write '**/*.{ts,tsx,md}' --no-error-on-unmatched-pattern --log-level 'silent'",
      "pretest": "npm run lect && npm run build",
      "test": "npm run devtest",
      "unit": "uvu test"
    },
    "engines": {
      "node": ">=14.18.0"
    },
    "c8": {
      "check-coverage": true,
      "exclude": [
        "**/test/**/*.*"
      ],
      "lines": 100
    },
    "lect": {
      "licence": {
        "extras": [
          ""
        ]
      }
    },
    "dependencies": {
      "ranges-crop": "^6.0.20",
      "ranges-invert": "^6.0.20",
      "runes": "^0.4.3"
    },
    "devDependencies": {
      "@types/runes": "^0.4.3"
    }
  },
  "ranges-push": {
    "name": "ranges-push",
    "version": "7.0.19",
    "description": "Gather string index ranges",
    "keywords": [
      "delete",
      "from",
      "many",
      "multiple",
      "ranges",
      "replace",
      "slice",
      "slices",
      "splice",
      "string"
    ],
    "homepage": "https://codsen.com/os/ranges-push",
    "repository": {
      "type": "git",
      "url": "git+https://github.com/codsen/codsen.git",
      "directory": "packages/ranges-push"
    },
    "license": "MIT",
    "author": {
      "name": "Roy Revelt",
      "email": "roy@codsen.com",
      "url": "https://codsen.com"
    },
    "type": "module",
    "exports": {
      "types": "./types/index.d.ts",
      "script": "./dist/ranges-push.umd.js",
      "default": "./dist/ranges-push.esm.js"
    },
    "types": "types/index.d.ts",
    "scripts": {
      "build": "node '../../ops/scripts/esbuild.js' && npm run dts",
      "cjs-off": "exit 0",
      "cjs-on": "exit 0",
      "dev": "DEV=true node '../../ops/scripts/esbuild.js' && npm run dts",
      "devtest": "c8 npm run unit && npm run examples && npm run lint",
      "dts": "rollup -c && npm run prettier -- 'types/index.d.ts' --write --log-level 'silent'",
      "examples": "node '../../ops/scripts/run-examples.js'",
      "lect": "node '../../ops/lect/lect.js' && npm run prettier -- 'README.md' '.all-contributorsrc' 'rollup.config.js' --write",
      "letspublish": "npm publish || :",
      "lint": "eslint . --fix",
      "perf": "node perf/check.js",
      "prep": "echo 'ready'",
      "prettier": "prettier",
      "prettier:format": "npm run prettier -- --write '**/*.{ts,tsx,md}' --no-error-on-unmatched-pattern --log-level 'silent'",
      "pretest": "npm run lect && npm run build",
      "test": "npm run devtest",
      "unit": "uvu test"
    },
    "engines": {
      "node": ">=14.18.0"
    },
    "c8": {
      "check-coverage": true,
      "exclude": [
        "**/test/**/*.*",
        "rMerge.ts"
      ],
      "lines": 0
    },
    "lect": {
      "licence": {
        "extras": [
          ""
        ]
      }
    },
    "dependencies": {
      "codsen-utils": "^1.6.8",
      "ranges-sort": "^6.0.14",
      "string-collapse-leading-whitespace": "^7.0.9",
      "string-trim-spaces-only": "^5.0.13"
    }
  },
  "ranges-regex": {
    "name": "ranges-regex",
    "version": "6.0.20",
    "description": "Integrate regex operations into Ranges workflow",
    "keywords": [
      "array",
      "perform",
      "performance",
      "range",
      "ranges",
      "record",
      "regex",
      "regexp",
      "replace",
      "replacement",
      "search",
      "string"
    ],
    "homepage": "https://codsen.com/os/ranges-regex",
    "repository": {
      "type": "git",
      "url": "git+https://github.com/codsen/codsen.git",
      "directory": "packages/ranges-regex"
    },
    "license": "MIT",
    "author": {
      "name": "Roy Revelt",
      "email": "roy@codsen.com",
      "url": "https://codsen.com"
    },
    "type": "module",
    "exports": {
      "types": "./types/index.d.ts",
      "script": "./dist/ranges-regex.umd.js",
      "default": "./dist/ranges-regex.esm.js"
    },
    "types": "types/index.d.ts",
    "scripts": {
      "build": "node '../../ops/scripts/esbuild.js' && npm run dts",
      "cjs-off": "exit 0",
      "cjs-on": "exit 0",
      "dev": "DEV=true node '../../ops/scripts/esbuild.js' && npm run dts",
      "devtest": "c8 npm run unit && npm run examples && npm run lint",
      "dts": "rollup -c && npm run prettier -- 'types/index.d.ts' --write --log-level 'silent'",
      "examples": "node '../../ops/scripts/run-examples.js'",
      "lect": "node '../../ops/lect/lect.js' && npm run prettier -- 'README.md' '.all-contributorsrc' 'rollup.config.js' --write",
      "letspublish": "npm publish || :",
      "lint": "eslint . --fix",
      "perf": "node perf/check.js",
      "prep": "echo 'ready'",
      "prettier": "prettier",
      "prettier:format": "npm run prettier -- --write '**/*.{ts,tsx,md}' --no-error-on-unmatched-pattern --log-level 'silent'",
      "pretest": "npm run lect && npm run build",
      "test": "npm run devtest",
      "unit": "uvu test"
    },
    "engines": {
      "node": ">=14.18.0"
    },
    "c8": {
      "check-coverage": true,
      "exclude": [
        "**/test/**/*.*"
      ],
      "lines": 100
    },
    "lect": {
      "licence": {
        "extras": [
          ""
        ]
      }
    },
    "dependencies": {
      "@types/lodash-es": "^4.17.12",
      "lodash-es": "^4.17.21",
      "ranges-merge": "^9.0.19"
    },
    "devDependencies": {
      "ranges-apply": "^7.0.20"
    }
  },
  "ranges-sort": {
    "name": "ranges-sort",
    "version": "6.0.14",
    "description": "Sort string index ranges",
    "keywords": [
      "array",
      "indexes",
      "ranges",
      "sort",
      "string"
    ],
    "homepage": "https://codsen.com/os/ranges-sort",
    "repository": {
      "type": "git",
      "url": "git+https://github.com/codsen/codsen.git",
      "directory": "packages/ranges-sort"
    },
    "license": "MIT",
    "author": {
      "name": "Roy Revelt",
      "email": "roy@codsen.com",
      "url": "https://codsen.com"
    },
    "type": "module",
    "exports": {
      "types": "./types/index.d.ts",
      "script": "./dist/ranges-sort.umd.js",
      "default": "./dist/ranges-sort.esm.js"
    },
    "types": "types/index.d.ts",
    "scripts": {
      "build": "node '../../ops/scripts/esbuild.js' && npm run dts",
      "cjs-off": "exit 0",
      "cjs-on": "exit 0",
      "dev": "DEV=true node '../../ops/scripts/esbuild.js' && npm run dts",
      "devtest": "c8 npm run unit && npm run examples && npm run lint",
      "dts": "rollup -c && npm run prettier -- 'types/index.d.ts' --write --log-level 'silent'",
      "examples": "node '../../ops/scripts/run-examples.js'",
      "lect": "node '../../ops/lect/lect.js' && npm run prettier -- 'README.md' '.all-contributorsrc' 'rollup.config.js' --write",
      "letspublish": "npm publish || :",
      "lint": "eslint . --fix",
      "perf": "node perf/check.js",
      "prep": "echo 'ready'",
      "prettier": "prettier",
      "prettier:format": "npm run prettier -- --write '**/*.{ts,tsx,md}' --no-error-on-unmatched-pattern --log-level 'silent'",
      "pretest": "npm run lect && npm run build",
      "test": "npm run devtest",
      "unit": "uvu test"
    },
    "engines": {
      "node": ">=14.18.0"
    },
    "c8": {
      "check-coverage": true,
      "exclude": [
        "**/test/**/*.*"
      ],
      "lines": 100
    },
    "lect": {
      "licence": {
        "extras": [
          ""
        ]
      }
    }
  },
  "regex-empty-conditional-comments": {
    "name": "regex-empty-conditional-comments",
    "version": "3.0.9",
    "description": "Regular expression for matching HTML empty conditional comments",
    "keywords": [
      "code",
      "comments",
      "conditional",
      "development",
      "email",
      "html",
      "if",
      "mso",
      "outlook",
      "regex",
      "remove",
      "strip"
    ],
    "homepage": "https://codsen.com/os/regex-empty-conditional-comments",
    "repository": {
      "type": "git",
      "url": "git+https://github.com/codsen/codsen.git",
      "directory": "packages/regex-empty-conditional-comments"
    },
    "license": "MIT",
    "author": {
      "name": "Roy Revelt",
      "email": "roy@codsen.com",
      "url": "https://codsen.com"
    },
    "type": "module",
    "exports": {
      "types": "./types/index.d.ts",
      "script": "./dist/regex-empty-conditional-comments.umd.js",
      "default": "./dist/regex-empty-conditional-comments.esm.js"
    },
    "types": "types/index.d.ts",
    "scripts": {
      "build": "node '../../ops/scripts/esbuild.js' && npm run dts",
      "cjs-off": "exit 0",
      "cjs-on": "exit 0",
      "dev": "DEV=true node '../../ops/scripts/esbuild.js' && npm run dts",
      "devtest": "c8 npm run unit && npm run examples && npm run lint",
      "dts": "rollup -c && npm run prettier -- 'types/index.d.ts' --write --log-level 'silent'",
      "examples": "node '../../ops/scripts/run-examples.js'",
      "lect": "node '../../ops/lect/lect.js' && npm run prettier -- 'README.md' '.all-contributorsrc' 'rollup.config.js' --write",
      "letspublish": "npm publish || :",
      "lint": "eslint . --fix",
      "perf": "node perf/check.js",
      "prep": "echo 'ready'",
      "prettier": "prettier",
      "prettier:format": "npm run prettier -- --write '**/*.{ts,tsx,md}' --no-error-on-unmatched-pattern --log-level 'silent'",
      "pretest": "npm run lect && npm run build",
      "test": "npm run devtest",
      "unit": "uvu test"
    },
    "engines": {
      "node": ">=14.18.0"
    },
    "c8": {
      "check-coverage": true,
      "exclude": [
        "**/test/**/*.*"
      ],
      "lines": 100
    },
    "lect": {
      "licence": {
        "extras": [
          ""
        ]
      }
    }
  },
  "regex-is-jinja-nunjucks": {
    "name": "regex-is-jinja-nunjucks",
    "version": "4.0.9",
    "description": "Regular expression for detecting Jinja or Nunjucks code",
    "keywords": [
      "code",
      "detect",
      "expression",
      "identify",
      "is",
      "jinja",
      "nunjucks",
      "regex",
      "regexp",
      "regular",
      "source",
      "tell"
    ],
    "homepage": "https://codsen.com/os/regex-is-jinja-nunjucks",
    "repository": {
      "type": "git",
      "url": "git+https://github.com/codsen/codsen.git",
      "directory": "packages/regex-is-jinja-nunjucks"
    },
    "license": "MIT",
    "author": {
      "name": "Roy Revelt",
      "email": "roy@codsen.com",
      "url": "https://codsen.com"
    },
    "type": "module",
    "exports": {
      "types": "./types/index.d.ts",
      "script": "./dist/regex-is-jinja-nunjucks.umd.js",
      "default": "./dist/regex-is-jinja-nunjucks.esm.js"
    },
    "types": "types/index.d.ts",
    "scripts": {
      "build": "node '../../ops/scripts/esbuild.js' && npm run dts",
      "cjs-off": "exit 0",
      "cjs-on": "exit 0",
      "dev": "DEV=true node '../../ops/scripts/esbuild.js' && npm run dts",
      "devtest": "c8 npm run unit && npm run examples && npm run lint",
      "dts": "rollup -c && npm run prettier -- 'types/index.d.ts' --write --log-level 'silent'",
      "examples": "node '../../ops/scripts/run-examples.js'",
      "lect": "node '../../ops/lect/lect.js' && npm run prettier -- 'README.md' '.all-contributorsrc' 'rollup.config.js' --write",
      "letspublish": "npm publish || :",
      "lint": "eslint . --fix",
      "perf": "node perf/check.js",
      "prep": "echo 'ready'",
      "prettier": "prettier",
      "prettier:format": "npm run prettier -- --write '**/*.{ts,tsx,md}' --no-error-on-unmatched-pattern --log-level 'silent'",
      "pretest": "npm run lect && npm run build",
      "test": "npm run devtest",
      "unit": "uvu test"
    },
    "engines": {
      "node": ">=14.18.0"
    },
    "c8": {
      "check-coverage": true,
      "exclude": [
        "**/test/**/*.*"
      ],
      "lines": 100
    },
    "lect": {
      "licence": {
        "extras": [
          ""
        ]
      }
    }
  },
  "regex-is-jsp": {
    "name": "regex-is-jsp",
    "version": "4.0.9",
    "description": "Regular expression for detecting JSP (Java Server Pages) code",
    "keywords": [
      "code",
      "detect",
      "expression",
      "identify",
      "is",
      "java",
      "jsp",
      "pages",
      "regex",
      "regexp",
      "regular",
      "server",
      "source",
      "tell"
    ],
    "homepage": "https://codsen.com/os/regex-is-jsp",
    "repository": {
      "type": "git",
      "url": "git+https://github.com/codsen/codsen.git",
      "directory": "packages/regex-is-jsp"
    },
    "license": "MIT",
    "author": {
      "name": "Roy Revelt",
      "email": "roy@codsen.com",
      "url": "https://codsen.com"
    },
    "type": "module",
    "exports": {
      "types": "./types/index.d.ts",
      "script": "./dist/regex-is-jsp.umd.js",
      "default": "./dist/regex-is-jsp.esm.js"
    },
    "types": "types/index.d.ts",
    "scripts": {
      "build": "node '../../ops/scripts/esbuild.js' && npm run dts",
      "cjs-off": "exit 0",
      "cjs-on": "exit 0",
      "dev": "DEV=true node '../../ops/scripts/esbuild.js' && npm run dts",
      "devtest": "c8 npm run unit && npm run examples && npm run lint",
      "dts": "rollup -c && npm run prettier -- 'types/index.d.ts' --write --log-level 'silent'",
      "examples": "node '../../ops/scripts/run-examples.js'",
      "lect": "node '../../ops/lect/lect.js' && npm run prettier -- 'README.md' '.all-contributorsrc' 'rollup.config.js' --write",
      "letspublish": "npm publish || :",
      "lint": "eslint . --fix",
      "perf": "node perf/check.js",
      "prep": "echo 'ready'",
      "prettier": "prettier",
      "prettier:format": "npm run prettier -- --write '**/*.{ts,tsx,md}' --no-error-on-unmatched-pattern --log-level 'silent'",
      "pretest": "npm run lect && npm run build",
      "test": "npm run devtest",
      "unit": "uvu test"
    },
    "engines": {
      "node": ">=14.18.0"
    },
    "c8": {
      "check-coverage": true,
      "exclude": [
        "**/test/**/*.*"
      ],
      "lines": 100
    },
    "lect": {
      "licence": {
        "extras": [
          ""
        ]
      }
    }
  },
  "regex-jinja-specific": {
    "name": "regex-jinja-specific",
    "version": "4.0.9",
    "description": "Regular expression for detecting Python-specific Jinja code",
    "keywords": [
      "code",
      "detect",
      "expression",
      "identify",
      "is",
      "jinja",
      "python",
      "regex",
      "regexp",
      "regular",
      "source",
      "tell"
    ],
    "homepage": "https://codsen.com/os/regex-jinja-specific",
    "repository": {
      "type": "git",
      "url": "git+https://github.com/codsen/codsen.git",
      "directory": "packages/regex-jinja-specific"
    },
    "license": "MIT",
    "author": {
      "name": "Roy Revelt",
      "email": "roy@codsen.com",
      "url": "https://codsen.com"
    },
    "type": "module",
    "exports": {
      "types": "./types/index.d.ts",
      "script": "./dist/regex-jinja-specific.umd.js",
      "default": "./dist/regex-jinja-specific.esm.js"
    },
    "types": "types/index.d.ts",
    "scripts": {
      "build": "node '../../ops/scripts/esbuild.js' && npm run dts",
      "cjs-off": "exit 0",
      "cjs-on": "exit 0",
      "dev": "DEV=true node '../../ops/scripts/esbuild.js' && npm run dts",
      "devtest": "c8 npm run unit && npm run examples && npm run lint",
      "dts": "rollup -c && npm run prettier -- 'types/index.d.ts' --write --log-level 'silent'",
      "examples": "node '../../ops/scripts/run-examples.js'",
      "lect": "node '../../ops/lect/lect.js' && npm run prettier -- 'README.md' '.all-contributorsrc' 'rollup.config.js' --write",
      "letspublish": "npm publish || :",
      "lint": "eslint . --fix",
      "perf": "node perf/check.js",
      "prep": "echo 'ready'",
      "prettier": "prettier",
      "prettier:format": "npm run prettier -- --write '**/*.{ts,tsx,md}' --no-error-on-unmatched-pattern --log-level 'silent'",
      "pretest": "npm run lect && npm run build",
      "test": "npm run devtest",
      "unit": "uvu test"
    },
    "engines": {
      "node": ">=14.18.0"
    },
    "c8": {
      "check-coverage": true,
      "exclude": [
        "**/test/**/*.*"
      ],
      "lines": 100
    },
    "lect": {
      "licence": {
        "extras": [
          ""
        ]
      }
    }
  },
  "rehype-responsive-tables": {
    "name": "rehype-responsive-tables",
    "version": "2.0.18",
    "description": "Rehype plugin to stack the first column cells above their rows.",
    "keywords": [
      "unified",
      "rehype",
      "rehype-plugin",
      "plugin",
      "mdast",
      "html",
      "markdown"
    ],
    "homepage": "https://codsen.com/os/rehype-responsive-tables",
    "repository": {
      "type": "git",
      "url": "git+https://github.com/codsen/codsen.git",
      "directory": "packages/rehype-responsive-tables"
    },
    "license": "MIT",
    "author": {
      "name": "Roy Revelt",
      "email": "roy@codsen.com",
      "url": "https://codsen.com"
    },
    "type": "module",
    "main": "dist/rehype-responsive-tables.cjs.js",
    "types": "types/index.d.ts",
    "scripts": {
      "build": "node '../../ops/scripts/esbuild.js' && node '../../ops/scripts/fix-cjs.js' && npm run dts",
      "cjs-off": "node '../../ops/scripts/cjs-off.js'",
      "cjs-on": "node '../../ops/scripts/cjs-on.js'",
      "dev": "DEV=true node '../../ops/scripts/esbuild.js' && npm run dts",
      "devtest": "c8 npm run unit && npm run examples && npm run lint",
      "dts": "rollup -c && npm run prettier -- 'types/index.d.ts' --write --log-level 'silent'",
      "examples": "node '../../ops/scripts/run-examples.js'",
      "lect": "node '../../ops/lect/lect.js' && npm run prettier -- 'README.md' '.all-contributorsrc' --write --log-level 'silent'",
      "letspublish": "npm publish || :",
      "lint": "eslint . --fix",
      "perf": "echo 'skip perf'",
      "prep": "echo 'ready'",
      "prettier": "prettier",
      "prettier:format": "npm run prettier -- --write '**/*.{ts,tsx,md}' --no-error-on-unmatched-pattern --log-level 'silent'",
      "pretest": "npm run lect && npm run build",
      "test": "npm run devtest",
      "unit": "uvu test"
    },
    "engines": {
      "node": ">=14.18.0"
    },
    "c8": {
      "check-coverage": true,
      "exclude": [
        "**/test/**/*.*"
      ],
      "lines": 100
    },
    "lect": {
      "licence": {
        "extras": [
          ""
        ]
      },
      "various": {}
    },
    "dependencies": {
      "@types/hast": "^3.0.4",
      "@types/lodash-es": "^4.17.12",
      "lodash-es": "^4.17.21",
      "rehype": "^13.0.2",
      "rehype-parse": "^9.0.1",
      "unified": "^11.0.5",
      "unist-util-visit": "^5.0.0"
    }
  },
  "remark-typography": {
    "name": "remark-typography",
    "version": "0.6.25",
    "description": "Remark plugin to fix typography: quotes, dashes and so on.",
    "keywords": [
      "unified",
      "remark",
      "remark-plugin",
      "plugin",
      "mdast",
      "markdown",
      "text",
      "typography",
      "typographic",
      "typesetting",
      "english"
    ],
    "homepage": "https://codsen.com/os/remark-typography",
    "repository": {
      "type": "git",
      "url": "git+https://github.com/codsen/codsen.git",
      "directory": "packages/remark-typography"
    },
    "license": "MIT",
    "author": {
      "name": "Roy Revelt",
      "email": "roy@codsen.com",
      "url": "https://codsen.com"
    },
    "type": "module",
    "main": "dist/remark-typography.cjs.js",
    "types": "types/index.d.ts",
    "scripts": {
      "build": "node '../../ops/scripts/esbuild.js' && node '../../ops/scripts/fix-cjs.js' && npm run dts",
      "cjs-off": "node '../../ops/scripts/cjs-off.js'",
      "cjs-on": "node '../../ops/scripts/cjs-on.js'",
      "dev": "DEV=true node '../../ops/scripts/esbuild.js' && npm run dts",
      "devtest": "c8 npm run unit && npm run examples && npm run lint",
      "dts": "rollup -c && npm run prettier -- 'types/index.d.ts' --write --log-level 'silent'",
      "examples": "node '../../ops/scripts/run-examples.js'",
      "lect": "node '../../ops/lect/lect.js' && npm run prettier -- 'README.md' '.all-contributorsrc' --write --log-level 'silent'",
      "letspublish": "npm publish || :",
      "lint": "eslint . --fix",
      "perf": "echo 'skip perf'",
      "prep": "echo 'ready'",
      "prettier": "prettier",
      "prettier:format": "npm run prettier -- --write '**/*.{ts,tsx,md}' --no-error-on-unmatched-pattern --log-level 'silent'",
      "pretest": "npm run lect && npm run build",
      "test": "npm run devtest",
      "unit": "uvu test"
    },
    "engines": {
      "node": ">=14.18.0"
    },
    "c8": {
      "check-coverage": true,
      "exclude": [
        "**/test/**/*.*"
      ],
      "lines": 100
    },
    "lect": {
      "licence": {
        "extras": [
          ""
        ]
      },
      "various": {}
    },
    "dependencies": {
      "@types/hast": "^3.0.4",
      "codsen-utils": "^1.6.8",
      "fp-ts": "^2.16.10",
      "string-apostrophes": "^4.0.23",
      "string-dashes": "^1.2.17",
      "string-remove-widows": "^4.0.26",
      "unified": "^11.0.5",
      "unist-util-visit": "^5.0.0"
    }
  },
  "str-indexes-of-plus": {
    "name": "str-indexes-of-plus",
    "version": "5.0.9",
    "description": "Like indexOf but returns array and counts per-grapheme",
    "keywords": [
      "array",
      "astral",
      "emoji",
      "find",
      "in",
      "indexes",
      "plus",
      "search",
      "string",
      "unicode"
    ],
    "homepage": "https://codsen.com/os/str-indexes-of-plus",
    "repository": {
      "type": "git",
      "url": "git+https://github.com/codsen/codsen.git",
      "directory": "packages/str-indexes-of-plus"
    },
    "license": "MIT",
    "author": {
      "name": "Roy Revelt",
      "email": "roy@codsen.com",
      "url": "https://codsen.com"
    },
    "type": "module",
    "exports": {
      "types": "./types/index.d.ts",
      "script": "./dist/str-indexes-of-plus.umd.js",
      "default": "./dist/str-indexes-of-plus.esm.js"
    },
    "types": "types/index.d.ts",
    "scripts": {
      "build": "node '../../ops/scripts/esbuild.js' && npm run dts",
      "cjs-off": "exit 0",
      "cjs-on": "exit 0",
      "dev": "DEV=true node '../../ops/scripts/esbuild.js' && npm run dts",
      "devtest": "c8 npm run unit && npm run examples && npm run lint",
      "dts": "rollup -c && npm run prettier -- 'types/index.d.ts' --write --log-level 'silent'",
      "examples": "node '../../ops/scripts/run-examples.js'",
      "lect": "node '../../ops/lect/lect.js' && npm run prettier -- 'README.md' '.all-contributorsrc' 'rollup.config.js' --write",
      "letspublish": "npm publish || :",
      "lint": "eslint . --fix",
      "perf": "node perf/check.js",
      "prep": "echo 'ready'",
      "prettier": "prettier",
      "prettier:format": "npm run prettier -- --write '**/*.{ts,tsx,md}' --no-error-on-unmatched-pattern --log-level 'silent'",
      "pretest": "npm run lect && npm run build",
      "test": "npm run devtest",
      "unit": "uvu test"
    },
    "engines": {
      "node": ">=14.18.0"
    },
    "c8": {
      "check-coverage": true,
      "exclude": [
        "**/test/**/*.*"
      ],
      "lines": 100
    },
    "lect": {
      "licence": {
        "extras": [
          ""
        ]
      }
    }
  },
  "string-apostrophes": {
    "name": "string-apostrophes",
    "version": "4.0.23",
    "description": "Comprehensive, HTML-entities-aware tool to typographically-correct the apostrophes and single/double quotes",
    "keywords": [
      "apostrophe",
      "apostrophes",
      "convert",
      "correct",
      "fix",
      "string",
      "typographical",
      "typographically",
      "typography"
    ],
    "homepage": "https://codsen.com/os/string-apostrophes",
    "repository": {
      "type": "git",
      "url": "git+https://github.com/codsen/codsen.git",
      "directory": "packages/string-apostrophes"
    },
    "license": "MIT",
    "author": {
      "name": "Roy Revelt",
      "email": "roy@codsen.com",
      "url": "https://codsen.com"
    },
    "type": "module",
    "exports": {
      "types": "./types/index.d.ts",
      "script": "./dist/string-apostrophes.umd.js",
      "default": "./dist/string-apostrophes.esm.js"
    },
    "types": "types/index.d.ts",
    "scripts": {
      "build": "node '../../ops/scripts/esbuild.js' && npm run dts",
      "cjs-off": "exit 0",
      "cjs-on": "exit 0",
      "dev": "DEV=true node '../../ops/scripts/esbuild.js' && npm run dts",
      "devtest": "c8 npm run unit && npm run examples && npm run lint",
      "dts": "rollup -c && npm run prettier -- 'types/index.d.ts' --write --log-level 'silent'",
      "examples": "node '../../ops/scripts/run-examples.js'",
      "lect": "node '../../ops/lect/lect.js' && npm run prettier -- 'README.md' '.all-contributorsrc' 'rollup.config.js' --write",
      "letspublish": "npm publish || :",
      "lint": "eslint . --fix",
      "perf": "node perf/check.js",
      "prep": "echo 'ready'",
      "prettier": "prettier",
      "prettier:format": "npm run prettier -- --write '**/*.{ts,tsx,md}' --no-error-on-unmatched-pattern --log-level 'silent'",
      "pretest": "npm run lect && npm run build",
      "test": "npm run devtest",
      "unit": "uvu test"
    },
    "engines": {
      "node": ">=14.18.0"
    },
    "c8": {
      "check-coverage": true,
      "exclude": [
        "**/test/**/*.*"
      ],
      "lines": 0
    },
    "lect": {
      "licence": {
        "extras": [
          ""
        ]
      }
    },
    "dependencies": {
      "codsen-utils": "^1.6.8",
      "ranges-apply": "^7.0.20"
    }
  },
  "string-character-is-astral-surrogate": {
    "name": "string-character-is-astral-surrogate",
    "version": "3.0.11",
    "description": "Tells, is given character a part of astral character, specifically, a high and low surrogate",
    "keywords": [
      "astral",
      "character",
      "characters",
      "emoji",
      "high",
      "identify",
      "is",
      "low",
      "string",
      "support",
      "surrogate",
      "surrogates",
      "tell",
      "unicode"
    ],
    "homepage": "https://codsen.com/os/string-character-is-astral-surrogate",
    "repository": {
      "type": "git",
      "url": "git+https://github.com/codsen/codsen.git",
      "directory": "packages/string-character-is-astral-surrogate"
    },
    "license": "MIT",
    "author": {
      "name": "Roy Revelt",
      "email": "roy@codsen.com",
      "url": "https://codsen.com"
    },
    "type": "module",
    "exports": {
      "types": "./types/index.d.ts",
      "script": "./dist/string-character-is-astral-surrogate.umd.js",
      "default": "./dist/string-character-is-astral-surrogate.esm.js"
    },
    "types": "types/index.d.ts",
    "scripts": {
      "build": "node '../../ops/scripts/esbuild.js' && npm run dts",
      "cjs-off": "exit 0",
      "cjs-on": "exit 0",
      "dev": "DEV=true node '../../ops/scripts/esbuild.js' && npm run dts",
      "devtest": "c8 npm run unit && npm run examples && npm run lint",
      "dts": "rollup -c && npm run prettier -- 'types/index.d.ts' --write --log-level 'silent'",
      "examples": "node '../../ops/scripts/run-examples.js'",
      "lect": "node '../../ops/lect/lect.js' && npm run prettier -- 'README.md' '.all-contributorsrc' 'rollup.config.js' --write",
      "letspublish": "npm publish || :",
      "lint": "eslint . --fix",
      "perf": "node perf/check.js",
      "prep": "echo 'ready'",
      "prettier": "prettier",
      "prettier:format": "npm run prettier -- --write '**/*.{ts,tsx,md}' --no-error-on-unmatched-pattern --log-level 'silent'",
      "pretest": "npm run lect && npm run build",
      "test": "npm run devtest",
      "unit": "uvu test"
    },
    "engines": {
      "node": ">=14.18.0"
    },
    "c8": {
      "check-coverage": true,
      "exclude": [
        "**/test/**/*.*"
      ],
      "lines": 100
    },
    "lect": {
      "licence": {
        "extras": [
          ""
        ]
      }
    }
  },
  "string-collapse-leading-whitespace": {
    "name": "string-collapse-leading-whitespace",
    "version": "7.0.9",
    "description": "Collapse the leading and trailing whitespace of a string",
    "keywords": [
      "alt",
      "attributes",
      "characters",
      "dash",
      "email",
      "encoding",
      "fancy",
      "quote",
      "remove",
      "replace",
      "simple",
      "string",
      "tags",
      "templates"
    ],
    "homepage": "https://codsen.com/os/string-collapse-leading-whitespace",
    "repository": {
      "type": "git",
      "url": "git+https://github.com/codsen/codsen.git",
      "directory": "packages/string-collapse-leading-whitespace"
    },
    "license": "MIT",
    "author": {
      "name": "Roy Revelt",
      "email": "roy@codsen.com",
      "url": "https://codsen.com"
    },
    "type": "module",
    "exports": {
      "types": "./types/index.d.ts",
      "script": "./dist/string-collapse-leading-whitespace.umd.js",
      "default": "./dist/string-collapse-leading-whitespace.esm.js"
    },
    "types": "types/index.d.ts",
    "scripts": {
      "build": "node '../../ops/scripts/esbuild.js' && npm run dts",
      "cjs-off": "exit 0",
      "cjs-on": "exit 0",
      "dev": "DEV=true node '../../ops/scripts/esbuild.js' && npm run dts",
      "devtest": "c8 npm run unit && npm run examples && npm run lint",
      "dts": "rollup -c && npm run prettier -- 'types/index.d.ts' --write --log-level 'silent'",
      "examples": "node '../../ops/scripts/run-examples.js'",
      "lect": "node '../../ops/lect/lect.js' && npm run prettier -- 'README.md' '.all-contributorsrc' 'rollup.config.js' --write",
      "letspublish": "npm publish || :",
      "lint": "eslint . --fix",
      "perf": "node perf/check.js",
      "prep": "echo 'ready'",
      "prettier": "prettier",
      "prettier:format": "npm run prettier -- --write '**/*.{ts,tsx,md}' --no-error-on-unmatched-pattern --log-level 'silent'",
      "pretest": "npm run lect && npm run build",
      "test": "npm run devtest",
      "unit": "uvu test"
    },
    "engines": {
      "node": ">=14.18.0"
    },
    "c8": {
      "check-coverage": true,
      "exclude": [
        "**/test/**/*.*"
      ],
      "lines": 100
    },
    "lect": {
      "licence": {
        "extras": [
          ""
        ]
      }
    }
  },
  "string-collapse-white-space": {
    "name": "string-collapse-white-space",
    "version": "11.0.23",
    "description": "Replace chunks of whitespace with a single spaces",
    "keywords": [
      "chunk",
      "collapse",
      "empty",
      "replace",
      "space",
      "string",
      "string-utility",
      "white",
      "whitespace"
    ],
    "homepage": "https://codsen.com/os/string-collapse-white-space",
    "repository": {
      "type": "git",
      "url": "git+https://github.com/codsen/codsen.git",
      "directory": "packages/string-collapse-white-space"
    },
    "license": "MIT",
    "author": {
      "name": "Roy Revelt",
      "email": "roy@codsen.com",
      "url": "https://codsen.com"
    },
    "type": "module",
    "exports": {
      "types": "./types/index.d.ts",
      "script": "./dist/string-collapse-white-space.umd.js",
      "default": "./dist/string-collapse-white-space.esm.js"
    },
    "types": "types/index.d.ts",
    "scripts": {
      "build": "node '../../ops/scripts/esbuild.js' && npm run dts",
      "cjs-off": "exit 0",
      "cjs-on": "exit 0",
      "dev": "DEV=true node '../../ops/scripts/esbuild.js' && npm run dts",
      "devtest": "c8 npm run unit && npm run examples && npm run lint",
      "dts": "rollup -c && npm run prettier -- 'types/index.d.ts' --write --log-level 'silent'",
      "examples": "node '../../ops/scripts/run-examples.js'",
      "lect": "node '../../ops/lect/lect.js' && npm run prettier -- 'README.md' '.all-contributorsrc' 'rollup.config.js' --write",
      "letspublish": "npm publish || :",
      "lint": "eslint . --fix",
      "perf": "node perf/check.js",
      "prep": "echo 'ready'",
      "prettier": "prettier",
      "prettier:format": "npm run prettier -- --write '**/*.{ts,tsx,md}' --no-error-on-unmatched-pattern --log-level 'silent'",
      "pretest": "npm run lect && npm run build",
      "test": "npm run devtest",
      "unit": "uvu test"
    },
    "engines": {
      "node": ">=14.18.0"
    },
    "c8": {
      "check-coverage": true,
      "exclude": [
        "**/test/**/*.*"
      ],
      "lines": 100
    },
    "lect": {
      "licence": {
        "extras": [
          ""
        ]
      }
    },
    "dependencies": {
      "ranges-apply": "^7.0.20",
      "ranges-push": "^7.0.19",
      "string-left-right": "^6.0.21"
    },
    "devDependencies": {
      "test-mixer": "^4.1.18"
    }
  },
  "string-convert-indexes": {
    "name": "string-convert-indexes",
    "version": "6.0.22",
    "description": "Convert between native JS string character indexes and grapheme-count-based indexes",
    "keywords": [
      "astral",
      "based",
      "character",
      "convert",
      "count",
      "emoji",
      "indexes",
      "string",
      "unicode"
    ],
    "homepage": "https://codsen.com/os/string-convert-indexes",
    "repository": {
      "type": "git",
      "url": "git+https://github.com/codsen/codsen.git",
      "directory": "packages/string-convert-indexes"
    },
    "license": "MIT",
    "author": {
      "name": "Roy Revelt",
      "email": "roy@codsen.com",
      "url": "https://codsen.com"
    },
    "type": "module",
    "exports": {
      "types": "./types/index.d.ts",
      "script": "./dist/string-convert-indexes.umd.js",
      "default": "./dist/string-convert-indexes.esm.js"
    },
    "types": "types/index.d.ts",
    "scripts": {
      "build": "node '../../ops/scripts/esbuild.js' && npm run dts",
      "cjs-off": "exit 0",
      "cjs-on": "exit 0",
      "dev": "DEV=true node '../../ops/scripts/esbuild.js' && npm run dts",
      "devtest": "c8 npm run unit && npm run examples && npm run lint",
      "dts": "rollup -c && npm run prettier -- 'types/index.d.ts' --write --log-level 'silent'",
      "examples": "node '../../ops/scripts/run-examples.js'",
      "lect": "node '../../ops/lect/lect.js' && npm run prettier -- 'README.md' '.all-contributorsrc' 'rollup.config.js' --write",
      "letspublish": "npm publish || :",
      "lint": "eslint . --fix",
      "perf": "node perf/check.js",
      "prep": "echo 'ready'",
      "prettier": "prettier",
      "prettier:format": "npm run prettier -- --write '**/*.{ts,tsx,md}' --no-error-on-unmatched-pattern --log-level 'silent'",
      "pretest": "npm run lect && npm run build",
      "test": "npm run devtest",
      "unit": "uvu test"
    },
    "engines": {
      "node": ">=14.18.0"
    },
    "c8": {
      "check-coverage": true,
      "exclude": [
        "**/test/**/*.*"
      ],
      "lines": 100
    },
    "lect": {
      "licence": {
        "extras": [
          ""
        ]
      },
      "various": {}
    },
    "dependencies": {
      "ast-monkey-traverse": "^4.0.20",
      "grapheme-splitter": "^1.0.4"
    }
  },
  "string-dashes": {
    "name": "string-dashes",
    "version": "1.2.17",
    "description": "Comprehensive, HTML-entities-aware tool to typographically-correct the dashes and hyphens",
    "keywords": [
      "dash",
      "dashes",
      "hyphen",
      "hyphens",
      "convert",
      "correct",
      "fix",
      "string",
      "typographical",
      "typographically",
      "typography"
    ],
    "homepage": "https://codsen.com/os/string-dashes",
    "repository": {
      "type": "git",
      "url": "git+https://github.com/codsen/codsen.git",
      "directory": "packages/string-dashes"
    },
    "license": "MIT",
    "author": {
      "name": "Roy Revelt",
      "email": "roy@codsen.com",
      "url": "https://codsen.com"
    },
    "type": "module",
    "exports": {
      "types": "./types/index.d.ts",
      "script": "./dist/string-dashes.umd.js",
      "default": "./dist/string-dashes.esm.js"
    },
    "types": "types/index.d.ts",
    "scripts": {
      "build": "node '../../ops/scripts/esbuild.js' && npm run dts",
      "cjs-off": "exit 0",
      "cjs-on": "exit 0",
      "dev": "DEV=true node '../../ops/scripts/esbuild.js' && npm run dts",
      "devtest": "c8 npm run unit && npm run examples && npm run lint",
      "dts": "rollup -c && npm run prettier -- 'types/index.d.ts' --write --log-level 'silent'",
      "examples": "node '../../ops/scripts/run-examples.js'",
      "lect": "node '../../ops/lect/lect.js' && npm run prettier -- 'README.md' '.all-contributorsrc' 'rollup.config.js' --write",
      "letspublish": "npm publish || :",
      "lint": "eslint . --fix",
      "perf": "node perf/check.js",
      "prep": "echo 'ready'",
      "prettier": "prettier",
      "prettier:format": "npm run prettier -- --write '**/*.{ts,tsx,md}' --no-error-on-unmatched-pattern --log-level 'silent'",
      "pretest": "npm run lect && npm run build",
      "test": "npm run devtest",
      "unit": "uvu test"
    },
    "engines": {
      "node": ">=14.18.0"
    },
    "c8": {
      "check-coverage": true,
      "exclude": [
        "**/test/**/*.*"
      ],
      "lines": 0
    },
    "lect": {
      "licence": {
        "extras": [
          ""
        ]
      }
    },
    "dependencies": {
      "codsen-utils": "^1.6.8",
      "ranges-apply": "^7.0.20",
      "string-left-right": "^6.0.21"
    },
    "devDependencies": {
      "test-mixer": "^4.1.18"
    }
  },
  "string-extract-class-names": {
    "name": "string-extract-class-names",
    "version": "8.0.22",
    "description": "Extracts CSS class/id names from a string",
    "keywords": [
      "class",
      "css",
      "extract",
      "id",
      "selector",
      "string"
    ],
    "homepage": "https://codsen.com/os/string-extract-class-names",
    "repository": {
      "type": "git",
      "url": "git+https://github.com/codsen/codsen.git",
      "directory": "packages/string-extract-class-names"
    },
    "license": "MIT",
    "author": {
      "name": "Roy Revelt",
      "email": "roy@codsen.com",
      "url": "https://codsen.com"
    },
    "type": "module",
    "exports": {
      "types": "./types/index.d.ts",
      "script": "./dist/string-extract-class-names.umd.js",
      "default": "./dist/string-extract-class-names.esm.js"
    },
    "types": "types/index.d.ts",
    "scripts": {
      "build": "node '../../ops/scripts/esbuild.js' && npm run dts",
      "cjs-off": "exit 0",
      "cjs-on": "exit 0",
      "dev": "DEV=true node '../../ops/scripts/esbuild.js' && npm run dts",
      "devtest": "c8 npm run unit && npm run examples && npm run lint",
      "dts": "rollup -c && npm run prettier -- 'types/index.d.ts' --write --log-level 'silent'",
      "examples": "node '../../ops/scripts/run-examples.js'",
      "lect": "node '../../ops/lect/lect.js' && npm run prettier -- 'README.md' '.all-contributorsrc' 'rollup.config.js' --write",
      "letspublish": "npm publish || :",
      "lint": "eslint . --fix",
      "perf": "node perf/check.js",
      "prep": "echo 'ready'",
      "prettier": "prettier",
      "prettier:format": "npm run prettier -- --write '**/*.{ts,tsx,md}' --no-error-on-unmatched-pattern --log-level 'silent'",
      "pretest": "npm run lect && npm run build",
      "test": "npm run devtest",
      "unit": "uvu test"
    },
    "engines": {
      "node": ">=14.18.0"
    },
    "c8": {
      "check-coverage": true,
      "exclude": [
        "**/test/**/*.*"
      ],
      "lines": 100
    },
    "lect": {
      "licence": {
        "extras": [
          ""
        ]
      }
    },
    "dependencies": {
      "string-left-right": "^6.0.21"
    }
  },
  "string-extract-sass-vars": {
    "name": "string-extract-sass-vars",
    "version": "4.0.22",
    "description": "Parse SASS variables file into a plain object of CSS key-value pairs",
    "keywords": [
      "css",
      "extract",
      "from",
      "name",
      "names",
      "parse",
      "parser",
      "sass",
      "scss",
      "string",
      "variable",
      "variables"
    ],
    "homepage": "https://codsen.com/os/string-extract-sass-vars",
    "repository": {
      "type": "git",
      "url": "git+https://github.com/codsen/codsen.git",
      "directory": "packages/string-extract-sass-vars"
    },
    "license": "MIT",
    "author": {
      "name": "Roy Revelt",
      "email": "roy@codsen.com",
      "url": "https://codsen.com"
    },
    "type": "module",
    "exports": {
      "types": "./types/index.d.ts",
      "script": "./dist/string-extract-sass-vars.umd.js",
      "default": "./dist/string-extract-sass-vars.esm.js"
    },
    "types": "types/index.d.ts",
    "scripts": {
      "build": "node '../../ops/scripts/esbuild.js' && npm run dts",
      "cjs-off": "exit 0",
      "cjs-on": "exit 0",
      "dev": "DEV=true node '../../ops/scripts/esbuild.js' && npm run dts",
      "devtest": "c8 npm run unit && npm run examples && npm run lint",
      "dts": "rollup -c && npm run prettier -- 'types/index.d.ts' --write --log-level 'silent'",
      "examples": "node '../../ops/scripts/run-examples.js'",
      "lect": "node '../../ops/lect/lect.js' && npm run prettier -- 'README.md' '.all-contributorsrc' 'rollup.config.js' --write",
      "letspublish": "npm publish || :",
      "lint": "eslint . --fix",
      "perf": "node perf/check.js",
      "prep": "echo 'ready'",
      "prettier": "prettier",
      "prettier:format": "npm run prettier -- --write '**/*.{ts,tsx,md}' --no-error-on-unmatched-pattern --log-level 'silent'",
      "pretest": "npm run lect && npm run build",
      "test": "npm run devtest",
      "unit": "uvu test"
    },
    "engines": {
      "node": ">=14.18.0"
    },
    "c8": {
      "check-coverage": true,
      "exclude": [
        "**/test/**/*.*"
      ],
      "lines": 100
    },
    "lect": {
      "licence": {
        "extras": [
          ""
        ]
      },
      "various": {}
    },
    "devDependencies": {
      "color-shorthand-hex-to-six-digit": "^5.0.20"
    }
  },
  "string-find-heads-tails": {
    "name": "string-find-heads-tails",
    "version": "6.0.23",
    "description": "Finds where are arbitrary templating marker heads and tails located",
    "keywords": [
      "array",
      "astral",
      "emoji",
      "find",
      "in",
      "indexes",
      "plus",
      "search",
      "string",
      "templating",
      "unicode"
    ],
    "homepage": "https://codsen.com/os/string-find-heads-tails",
    "repository": {
      "type": "git",
      "url": "git+https://github.com/codsen/codsen.git",
      "directory": "packages/string-find-heads-tails"
    },
    "license": "MIT",
    "author": {
      "name": "Roy Revelt",
      "email": "roy@codsen.com",
      "url": "https://codsen.com"
    },
    "type": "module",
    "exports": {
      "types": "./types/index.d.ts",
      "script": "./dist/string-find-heads-tails.umd.js",
      "default": "./dist/string-find-heads-tails.esm.js"
    },
    "types": "types/index.d.ts",
    "scripts": {
      "build": "node '../../ops/scripts/esbuild.js' && npm run dts",
      "cjs-off": "exit 0",
      "cjs-on": "exit 0",
      "dev": "DEV=true node '../../ops/scripts/esbuild.js' && npm run dts",
      "devtest": "c8 npm run unit && npm run examples && npm run lint",
      "dts": "rollup -c && npm run prettier -- 'types/index.d.ts' --write --log-level 'silent'",
      "examples": "node '../../ops/scripts/run-examples.js'",
      "lect": "node '../../ops/lect/lect.js' && npm run prettier -- 'README.md' '.all-contributorsrc' 'rollup.config.js' --write",
      "letspublish": "npm publish || :",
      "lint": "eslint . --fix",
      "perf": "node perf/check.js",
      "prep": "echo 'ready'",
      "prettier": "prettier",
      "prettier:format": "npm run prettier -- --write '**/*.{ts,tsx,md}' --no-error-on-unmatched-pattern --log-level 'silent'",
      "pretest": "npm run lect && npm run build",
      "test": "npm run devtest",
      "unit": "uvu test"
    },
    "engines": {
      "node": ">=14.18.0"
    },
    "c8": {
      "check-coverage": true,
      "exclude": [
        "**/test/**/*.*"
      ],
      "lines": 100
    },
    "lect": {
      "licence": {
        "extras": [
          ""
        ]
      }
    },
    "dependencies": {
      "arrayiffy-if-string": "^5.0.10",
      "codsen-utils": "^1.6.8",
      "string-match-left-right": "^9.0.23"
    }
  },
  "string-find-malformed": {
    "name": "string-find-malformed",
    "version": "4.0.21",
    "description": "Search for a malformed string. Think of Levenshtein distance but in search.",
    "keywords": [
      "character",
      "find",
      "fuzzy",
      "levenshtein",
      "lint",
      "look",
      "match",
      "matches",
      "search",
      "similar",
      "string",
      "text",
      "validate"
    ],
    "homepage": "https://codsen.com/os/string-find-malformed",
    "repository": {
      "type": "git",
      "url": "git+https://github.com/codsen/codsen.git",
      "directory": "packages/string-find-malformed"
    },
    "license": "MIT",
    "author": {
      "name": "Roy Revelt",
      "email": "roy@codsen.com",
      "url": "https://codsen.com"
    },
    "type": "module",
    "exports": {
      "types": "./types/index.d.ts",
      "script": "./dist/string-find-malformed.umd.js",
      "default": "./dist/string-find-malformed.esm.js"
    },
    "types": "types/index.d.ts",
    "scripts": {
      "build": "node '../../ops/scripts/esbuild.js' && npm run dts",
      "cjs-off": "exit 0",
      "cjs-on": "exit 0",
      "dev": "DEV=true node '../../ops/scripts/esbuild.js' && npm run dts",
      "devtest": "c8 npm run unit && npm run examples && npm run lint",
      "dts": "rollup -c && npm run prettier -- 'types/index.d.ts' --write --log-level 'silent'",
      "examples": "node '../../ops/scripts/run-examples.js'",
      "lect": "node '../../ops/lect/lect.js' && npm run prettier -- 'README.md' '.all-contributorsrc' 'rollup.config.js' --write",
      "letspublish": "npm publish || :",
      "lint": "eslint . --fix",
      "perf": "node perf/check.js",
      "prep": "echo 'ready'",
      "prettier": "prettier",
      "prettier:format": "npm run prettier -- --write '**/*.{ts,tsx,md}' --no-error-on-unmatched-pattern --log-level 'silent'",
      "pretest": "npm run lect && npm run build",
      "test": "npm run devtest",
      "unit": "uvu test"
    },
    "engines": {
      "node": ">=14.18.0"
    },
    "c8": {
      "check-coverage": true,
      "exclude": [
        "**/test/**/*.*"
      ],
      "lines": 100
    },
    "lect": {
      "licence": {
        "extras": [
          ""
        ]
      }
    },
    "dependencies": {
      "codsen-utils": "^1.6.8",
      "string-left-right": "^6.0.21"
    }
  },
  "string-fix-broken-named-entities": {
    "name": "string-fix-broken-named-entities",
    "version": "7.0.21",
    "description": "Finds and fixes common and not so common broken named HTML entities, returns ranges array of fixes",
    "keywords": [
      "broken",
      "encoding",
      "entities",
      "erroneous",
      "error",
      "fix",
      "fixer",
      "html",
      "levenshtein",
      "named",
      "range",
      "ranges",
      "return",
      "string"
    ],
    "homepage": "https://codsen.com/os/string-fix-broken-named-entities",
    "repository": {
      "type": "git",
      "url": "git+https://github.com/codsen/codsen.git",
      "directory": "packages/string-fix-broken-named-entities"
    },
    "license": "MIT",
    "author": {
      "name": "Roy Revelt",
      "email": "roy@codsen.com",
      "url": "https://codsen.com"
    },
    "type": "module",
    "exports": {
      "types": "./types/index.d.ts",
      "script": "./dist/string-fix-broken-named-entities.umd.js",
      "default": "./dist/string-fix-broken-named-entities.esm.js"
    },
    "types": "types/index.d.ts",
    "scripts": {
      "build": "node '../../ops/scripts/esbuild.js' && npm run dts",
      "cjs-off": "exit 0",
      "cjs-on": "exit 0",
      "dev": "DEV=true node '../../ops/scripts/esbuild.js' && npm run dts",
      "devtest": "c8 npm run unit && npm run examples && npm run lint",
      "dts": "rollup -c && npm run prettier -- 'types/index.d.ts' --write --log-level 'silent'",
      "examples": "node '../../ops/scripts/run-examples.js'",
      "lect": "node '../../ops/lect/lect.js' && npm run prettier -- 'README.md' '.all-contributorsrc' 'rollup.config.js' --write",
      "letspublish": "npm publish || :",
      "lint": "eslint . --fix",
      "perf": "node perf/check.js",
      "prep": "echo 'ready'",
      "prettier": "prettier",
      "prettier:format": "npm run prettier -- --write '**/*.{ts,tsx,md}' --no-error-on-unmatched-pattern --log-level 'silent'",
      "pretest": "npm run lect && npm run build",
      "test": "npm run devtest",
      "unit": "uvu test"
    },
    "engines": {
      "node": ">=14.18.0"
    },
    "c8": {
      "check-coverage": true,
      "exclude": [
        "**/test/**/*.*"
      ],
      "lines": 100
    },
    "lect": {
      "licence": {
        "extras": [
          ""
        ]
      },
      "various": {}
    },
    "dependencies": {
      "all-named-html-entities": "^3.0.11",
      "codsen-utils": "^1.6.8",
      "leven": "^4.0.0",
      "rfdc": "^1.4.1",
      "string-left-right": "^6.0.21"
    }
  },
  "string-left-right": {
    "name": "string-left-right",
    "version": "6.0.21",
    "description": "Looks up the first non-whitespace character to the left/right of a given index",
    "keywords": [
      "check",
      "left",
      "look",
      "lookup",
      "loop",
      "right",
      "see",
      "string",
      "text",
      "the",
      "to",
      "traversal",
      "traverse"
    ],
    "homepage": "https://codsen.com/os/string-left-right",
    "repository": {
      "type": "git",
      "url": "git+https://github.com/codsen/codsen.git",
      "directory": "packages/string-left-right"
    },
    "license": "MIT",
    "author": {
      "name": "Roy Revelt",
      "email": "roy@codsen.com",
      "url": "https://codsen.com"
    },
    "type": "module",
    "exports": {
      "types": "./types/index.d.ts",
      "script": "./dist/string-left-right.umd.js",
      "default": "./dist/string-left-right.esm.js"
    },
    "types": "types/index.d.ts",
    "scripts": {
      "build": "node '../../ops/scripts/esbuild.js' && npm run dts",
      "cjs-off": "exit 0",
      "cjs-on": "exit 0",
      "dev": "DEV=true node '../../ops/scripts/esbuild.js' && npm run dts",
      "devtest": "c8 npm run unit && npm run examples && npm run lint",
      "dts": "rollup -c && npm run prettier -- 'types/index.d.ts' --write --log-level 'silent'",
      "examples": "node '../../ops/scripts/run-examples.js'",
      "lect": "node '../../ops/lect/lect.js' && npm run prettier -- 'README.md' '.all-contributorsrc' 'rollup.config.js' --write",
      "letspublish": "npm publish || :",
      "lint": "eslint . --fix",
      "perf": "node perf/check.js",
      "prep": "echo 'ready'",
      "prettier": "prettier",
      "prettier:format": "npm run prettier -- --write '**/*.{ts,tsx,md}' --no-error-on-unmatched-pattern --log-level 'silent'",
      "pretest": "npm run lect && npm run build",
      "test": "npm run devtest",
      "unit": "uvu test"
    },
    "engines": {
      "node": ">=14.18.0"
    },
    "c8": {
      "check-coverage": true,
      "exclude": [
        "**/test/**/*.*"
      ],
      "lines": 100
    },
    "lect": {
      "licence": {
        "extras": [
          ""
        ]
      }
    },
    "dependencies": {
      "codsen-utils": "^1.6.8",
      "rfdc": "^1.4.1"
    }
  },
  "string-match-left-right": {
    "name": "string-match-left-right",
    "version": "9.0.23",
    "description": "Match substrings on the left or right of a given index, ignoring whitespace",
    "keywords": [
      "left",
      "march",
      "match",
      "no-parsing",
      "right",
      "string",
      "traverse",
      "utility"
    ],
    "homepage": "https://codsen.com/os/string-match-left-right",
    "repository": {
      "type": "git",
      "url": "git+https://github.com/codsen/codsen.git",
      "directory": "packages/string-match-left-right"
    },
    "license": "MIT",
    "author": {
      "name": "Roy Revelt",
      "email": "roy@codsen.com",
      "url": "https://codsen.com"
    },
    "type": "module",
    "exports": {
      "types": "./types/index.d.ts",
      "script": "./dist/string-match-left-right.umd.js",
      "default": "./dist/string-match-left-right.esm.js"
    },
    "types": "types/index.d.ts",
    "scripts": {
      "build": "node '../../ops/scripts/esbuild.js' && npm run dts",
      "cjs-off": "exit 0",
      "cjs-on": "exit 0",
      "dev": "DEV=true node '../../ops/scripts/esbuild.js' && npm run dts",
      "devtest": "c8 npm run unit && npm run examples && npm run lint",
      "dts": "rollup -c && npm run prettier -- 'types/index.d.ts' --write --log-level 'silent'",
      "examples": "node '../../ops/scripts/run-examples.js'",
      "lect": "node '../../ops/lect/lect.js' && npm run prettier -- 'README.md' '.all-contributorsrc' 'rollup.config.js' --write",
      "letspublish": "npm publish || :",
      "lint": "eslint . --fix",
      "perf": "node perf/check.js",
      "prep": "echo 'ready'",
      "prettier": "prettier",
      "prettier:format": "npm run prettier -- --write '**/*.{ts,tsx,md}' --no-error-on-unmatched-pattern --log-level 'silent'",
      "pretest": "npm run lect && npm run build",
      "test": "npm run devtest",
      "unit": "uvu test"
    },
    "engines": {
      "node": ">=14.18.0"
    },
    "c8": {
      "check-coverage": true,
      "exclude": [
        "**/test/**/*.*"
      ],
      "lines": 100
    },
    "lect": {
      "licence": {
        "extras": [
          ""
        ]
      }
    },
    "dependencies": {
      "arrayiffy-if-string": "^5.0.10",
      "codsen-utils": "^1.6.8",
      "string-character-is-astral-surrogate": "^3.0.11"
    }
  },
  "string-process-comma-separated": {
    "name": "string-process-comma-separated",
    "version": "4.1.9",
    "description": "Extracts chunks from possibly comma or whatever-separated string",
    "keywords": [
      "characters",
      "end",
      "front",
      "just",
      "only",
      "space",
      "spaces",
      "string",
      "text",
      "trim"
    ],
    "homepage": "https://codsen.com/os/string-process-comma-separated",
    "repository": {
      "type": "git",
      "url": "git+https://github.com/codsen/codsen.git",
      "directory": "packages/string-process-comma-separated"
    },
    "license": "MIT",
    "author": {
      "name": "Roy Revelt",
      "email": "roy@codsen.com",
      "url": "https://codsen.com"
    },
    "type": "module",
    "exports": {
      "types": "./types/index.d.ts",
      "script": "./dist/string-process-comma-separated.umd.js",
      "default": "./dist/string-process-comma-separated.esm.js"
    },
    "types": "types/index.d.ts",
    "scripts": {
      "build": "node '../../ops/scripts/esbuild.js' && npm run dts",
      "cjs-off": "exit 0",
      "cjs-on": "exit 0",
      "dev": "DEV=true node '../../ops/scripts/esbuild.js' && npm run dts",
      "devtest": "c8 npm run unit && npm run examples && npm run lint",
      "dts": "rollup -c && npm run prettier -- 'types/index.d.ts' --write --log-level 'silent'",
      "examples": "node '../../ops/scripts/run-examples.js'",
      "lect": "node '../../ops/lect/lect.js' && npm run prettier -- 'README.md' '.all-contributorsrc' 'rollup.config.js' --write",
      "letspublish": "npm publish || :",
      "lint": "eslint . --fix",
      "perf": "node perf/check.js",
      "prep": "echo 'ready'",
      "prettier": "prettier",
      "prettier:format": "npm run prettier -- --write '**/*.{ts,tsx,md}' --no-error-on-unmatched-pattern --log-level 'silent'",
      "pretest": "npm run lect && npm run build",
      "test": "npm run devtest",
      "unit": "uvu test"
    },
    "engines": {
      "node": ">=14.18.0"
    },
    "c8": {
      "check-coverage": true,
      "exclude": [
        "**/test/**/*.*"
      ],
      "lines": 100
    },
    "lect": {
      "licence": {
        "extras": [
          ""
        ]
      }
    },
    "dependencies": {
      "codsen-utils": "^1.6.8"
    }
  },
  "string-range-expander": {
    "name": "string-range-expander",
    "version": "4.0.18",
    "description": "Expands string index ranges within whitespace boundaries until letters are met",
    "keywords": [
      "expand",
      "expander",
      "indexes",
      "of",
      "outwards",
      "range",
      "string",
      "text",
      "within"
    ],
    "homepage": "https://codsen.com/os/string-range-expander",
    "repository": {
      "type": "git",
      "url": "git+https://github.com/codsen/codsen.git",
      "directory": "packages/string-range-expander"
    },
    "license": "MIT",
    "author": {
      "name": "Roy Revelt",
      "email": "roy@codsen.com",
      "url": "https://codsen.com"
    },
    "type": "module",
    "exports": {
      "types": "./types/index.d.ts",
      "script": "./dist/string-range-expander.umd.js",
      "default": "./dist/string-range-expander.esm.js"
    },
    "types": "types/index.d.ts",
    "scripts": {
      "build": "node '../../ops/scripts/esbuild.js' && npm run dts",
      "cjs-off": "exit 0",
      "cjs-on": "exit 0",
      "dev": "DEV=true node '../../ops/scripts/esbuild.js' && npm run dts",
      "devtest": "c8 npm run unit && npm run examples && npm run lint",
      "dts": "rollup -c && npm run prettier -- 'types/index.d.ts' --write --log-level 'silent'",
      "examples": "node '../../ops/scripts/run-examples.js'",
      "lect": "node '../../ops/lect/lect.js' && npm run prettier -- 'README.md' '.all-contributorsrc' 'rollup.config.js' --write",
      "letspublish": "npm publish || :",
      "lint": "eslint . --fix",
      "perf": "node perf/check.js",
      "prep": "echo 'ready'",
      "prettier": "prettier",
      "prettier:format": "npm run prettier -- --write '**/*.{ts,tsx,md}' --no-error-on-unmatched-pattern --log-level 'silent'",
      "pretest": "npm run lect && npm run build",
      "test": "npm run devtest",
      "unit": "uvu test"
    },
    "engines": {
      "node": ">=14.18.0"
    },
    "c8": {
      "branches": 100,
      "check-coverage": true,
      "exclude": [
        "**/test/**/*.*"
      ],
      "lines": 100
    },
    "lect": {
      "licence": {
        "extras": [
          ""
        ]
      }
    },
    "dependencies": {
      "codsen-utils": "^1.6.8"
    }
  },
  "string-remove-duplicate-heads-tails": {
    "name": "string-remove-duplicate-heads-tails",
    "version": "7.0.23",
    "description": "Detect and (recursively) remove head and tail wrappings around the input string",
    "keywords": [
      "alt",
      "attributes",
      "characters",
      "dash",
      "email",
      "encoding",
      "fancy",
      "quote",
      "remove",
      "replace",
      "simple",
      "string",
      "tags",
      "templates"
    ],
    "homepage": "https://codsen.com/os/string-remove-duplicate-heads-tails",
    "repository": {
      "type": "git",
      "url": "git+https://github.com/codsen/codsen.git",
      "directory": "packages/string-remove-duplicate-heads-tails"
    },
    "license": "MIT",
    "author": {
      "name": "Roy Revelt",
      "email": "roy@codsen.com",
      "url": "https://codsen.com"
    },
    "type": "module",
    "exports": {
      "types": "./types/index.d.ts",
      "script": "./dist/string-remove-duplicate-heads-tails.umd.js",
      "default": "./dist/string-remove-duplicate-heads-tails.esm.js"
    },
    "types": "types/index.d.ts",
    "scripts": {
      "build": "node '../../ops/scripts/esbuild.js' && npm run dts",
      "cjs-off": "exit 0",
      "cjs-on": "exit 0",
      "dev": "DEV=true node '../../ops/scripts/esbuild.js' && npm run dts",
      "devtest": "c8 npm run unit && npm run examples && npm run lint",
      "dts": "rollup -c && npm run prettier -- 'types/index.d.ts' --write --log-level 'silent'",
      "examples": "node '../../ops/scripts/run-examples.js'",
      "lect": "node '../../ops/lect/lect.js' && npm run prettier -- 'README.md' '.all-contributorsrc' 'rollup.config.js' --write",
      "letspublish": "npm publish || :",
      "lint": "eslint . --fix",
      "perf": "node perf/check.js",
      "prep": "echo 'ready'",
      "prettier": "prettier",
      "prettier:format": "npm run prettier -- --write '**/*.{ts,tsx,md}' --no-error-on-unmatched-pattern --log-level 'silent'",
      "pretest": "npm run lect && npm run build",
      "test": "npm run devtest",
      "unit": "uvu test"
    },
    "engines": {
      "node": ">=14.18.0"
    },
    "c8": {
      "check-coverage": true,
      "exclude": [
        "**/test/**/*.*"
      ],
      "lines": 100
    },
    "lect": {
      "licence": {
        "extras": [
          ""
        ]
      }
    },
    "dependencies": {
      "arrayiffy-if-string": "^5.0.10",
      "codsen-utils": "^1.6.8",
      "ranges-apply": "^7.0.20",
      "ranges-push": "^7.0.19",
      "string-match-left-right": "^9.0.23",
      "string-trim-spaces-only": "^5.0.13"
    }
  },
  "string-remove-thousand-separators": {
    "name": "string-remove-thousand-separators",
    "version": "7.0.20",
    "description": "Detects and removes thousand separators (dot/comma/quote/space) from string-type digits",
    "keywords": [
      "amount",
      "currency",
      "digits",
      "from",
      "numbers",
      "remove",
      "separator",
      "separators",
      "string",
      "thousand",
      "thousands"
    ],
    "homepage": "https://codsen.com/os/string-remove-thousand-separators",
    "repository": {
      "type": "git",
      "url": "git+https://github.com/codsen/codsen.git",
      "directory": "packages/string-remove-thousand-separators"
    },
    "license": "MIT",
    "author": {
      "name": "Roy Revelt",
      "email": "roy@codsen.com",
      "url": "https://codsen.com"
    },
    "type": "module",
    "exports": {
      "types": "./types/index.d.ts",
      "script": "./dist/string-remove-thousand-separators.umd.js",
      "default": "./dist/string-remove-thousand-separators.esm.js"
    },
    "types": "types/index.d.ts",
    "scripts": {
      "build": "node '../../ops/scripts/esbuild.js' && npm run dts",
      "cjs-off": "exit 0",
      "cjs-on": "exit 0",
      "dev": "DEV=true node '../../ops/scripts/esbuild.js' && npm run dts",
      "devtest": "c8 npm run unit && npm run examples && npm run lint",
      "dts": "rollup -c && npm run prettier -- 'types/index.d.ts' --write --log-level 'silent'",
      "examples": "node '../../ops/scripts/run-examples.js'",
      "lect": "node '../../ops/lect/lect.js' && npm run prettier -- 'README.md' '.all-contributorsrc' 'rollup.config.js' --write",
      "letspublish": "npm publish || :",
      "lint": "eslint . --fix",
      "perf": "node perf/check.js",
      "prep": "echo 'ready'",
      "prettier": "prettier",
      "prettier:format": "npm run prettier -- --write '**/*.{ts,tsx,md}' --no-error-on-unmatched-pattern --log-level 'silent'",
      "pretest": "npm run lect && npm run build",
      "test": "npm run devtest",
      "unit": "uvu test"
    },
    "engines": {
      "node": ">=14.18.0"
    },
    "c8": {
      "check-coverage": true,
      "exclude": [
        "**/test/**/*.*"
      ],
      "lines": 100
    },
    "lect": {
      "licence": {
        "extras": [
          ""
        ]
      }
    },
    "dependencies": {
      "@types/lodash-es": "^4.17.12",
      "lodash-es": "^4.17.21",
      "ranges-apply": "^7.0.20",
      "ranges-push": "^7.0.19"
    }
  },
  "string-remove-widows": {
    "name": "string-remove-widows",
    "version": "4.0.26",
    "description": "Helps to prevent widow words in a text",
    "keywords": [
      "against",
      "copy",
      "copywriting",
      "email",
      "paragraph",
      "prevent",
      "process",
      "remove",
      "sentence",
      "string",
      "template",
      "text",
      "tool",
      "widow",
      "word"
    ],
    "homepage": "https://codsen.com/os/string-remove-widows",
    "repository": {
      "type": "git",
      "url": "git+https://github.com/codsen/codsen.git",
      "directory": "packages/string-remove-widows"
    },
    "license": "MIT",
    "author": {
      "name": "Roy Revelt",
      "email": "roy@codsen.com",
      "url": "https://codsen.com"
    },
    "type": "module",
    "exports": {
      "types": "./types/index.d.ts",
      "script": "./dist/string-remove-widows.umd.js",
      "default": "./dist/string-remove-widows.esm.js"
    },
    "types": "types/index.d.ts",
    "scripts": {
      "build": "node '../../ops/scripts/esbuild.js' && npm run dts",
      "cjs-off": "exit 0",
      "cjs-on": "exit 0",
      "dev": "DEV=true node '../../ops/scripts/esbuild.js' && npm run dts",
      "devtest": "c8 npm run unit && npm run examples && npm run lint",
      "dts": "rollup -c && npm run prettier -- 'types/index.d.ts' --write --log-level 'silent'",
      "examples": "node '../../ops/scripts/run-examples.js'",
      "lect": "node '../../ops/lect/lect.js' && npm run prettier -- 'README.md' '.all-contributorsrc' 'rollup.config.js' --write",
      "letspublish": "npm publish || :",
      "lint": "eslint . --fix",
      "perf": "node perf/check.js",
      "prep": "echo 'ready'",
      "prettier": "prettier",
      "prettier:format": "npm run prettier -- --write '**/*.{ts,tsx,md}' --no-error-on-unmatched-pattern --log-level 'silent'",
      "pretest": "npm run lect && npm run build",
      "test": "npm run devtest",
      "unit": "uvu test"
    },
    "engines": {
      "node": ">=14.18.0"
    },
    "c8": {
      "check-coverage": true,
      "exclude": [
        "**/test/**/*.*"
      ],
      "lines": 100
    },
    "lect": {
      "licence": {
        "extras": [
          ""
        ]
      }
    },
    "dependencies": {
      "codsen-utils": "^1.6.8",
      "ranges-apply": "^7.0.20",
      "ranges-push": "^7.0.19",
      "string-left-right": "^6.0.21",
      "string-match-left-right": "^9.0.23"
    },
    "devDependencies": {
      "string-strip-html": "^13.4.13"
    }
  },
  "string-split-by-whitespace": {
    "name": "string-split-by-whitespace",
    "version": "4.0.23",
    "description": "Split string into array by chunks of whitespace",
    "keywords": [
      "alt",
      "attributes",
      "characters",
      "dash",
      "email",
      "encoding",
      "fancy",
      "quote",
      "remove",
      "replace",
      "simple",
      "string",
      "tags",
      "templates"
    ],
    "homepage": "https://codsen.com/os/string-split-by-whitespace",
    "repository": {
      "type": "git",
      "url": "git+https://github.com/codsen/codsen.git",
      "directory": "packages/string-split-by-whitespace"
    },
    "license": "MIT",
    "author": {
      "name": "Roy Revelt",
      "email": "roy@codsen.com",
      "url": "https://codsen.com"
    },
    "type": "module",
    "exports": {
      "types": "./types/index.d.ts",
      "script": "./dist/string-split-by-whitespace.umd.js",
      "default": "./dist/string-split-by-whitespace.esm.js"
    },
    "types": "types/index.d.ts",
    "scripts": {
      "build": "node '../../ops/scripts/esbuild.js' && npm run dts",
      "cjs-off": "exit 0",
      "cjs-on": "exit 0",
      "dev": "DEV=true node '../../ops/scripts/esbuild.js' && npm run dts",
      "devtest": "c8 npm run unit && npm run examples && npm run lint",
      "dts": "rollup -c && npm run prettier -- 'types/index.d.ts' --write --log-level 'silent'",
      "examples": "node '../../ops/scripts/run-examples.js'",
      "lect": "node '../../ops/lect/lect.js' && npm run prettier -- 'README.md' '.all-contributorsrc' 'rollup.config.js' --write",
      "letspublish": "npm publish || :",
      "lint": "eslint . --fix",
      "perf": "node perf/check.js",
      "prep": "echo 'ready'",
      "prettier": "prettier",
      "prettier:format": "npm run prettier -- --write '**/*.{ts,tsx,md}' --no-error-on-unmatched-pattern --log-level 'silent'",
      "pretest": "npm run lect && npm run build",
      "test": "npm run devtest",
      "unit": "uvu test"
    },
    "engines": {
      "node": ">=14.18.0"
    },
    "c8": {
      "check-coverage": true,
      "exclude": [
        "**/test/**/*.*"
      ],
      "lines": 100
    },
    "lect": {
      "licence": {
        "extras": [
          ""
        ]
      }
    },
    "dependencies": {
      "ranges-is-index-within": "^4.0.13"
    },
    "devDependencies": {
      "string-find-heads-tails": "^6.0.23"
    }
  },
  "string-strip-html": {
    "name": "string-strip-html",
    "version": "13.4.13",
    "description": "Strip HTML tags from strings. No parser, accepts mixed sources.",
    "keywords": [
      "code",
      "extract",
      "from",
      "html",
      "jsp",
      "mixed",
      "remove",
      "separate",
      "stri",
      "string",
      "strip",
      "tags",
      "templating",
      "text",
      "xhtml"
    ],
    "homepage": "https://codsen.com/os/string-strip-html",
    "repository": {
      "type": "git",
      "url": "git+https://github.com/codsen/codsen.git",
      "directory": "packages/string-strip-html"
    },
    "license": "MIT",
    "author": {
      "name": "Roy Revelt",
      "email": "roy@codsen.com",
      "url": "https://codsen.com"
    },
    "type": "module",
    "exports": {
      "types": "./types/index.d.ts",
      "script": "./dist/string-strip-html.umd.js",
      "default": "./dist/string-strip-html.esm.js"
    },
    "types": "types/index.d.ts",
    "scripts": {
      "build": "node '../../ops/scripts/esbuild.js' && npm run dts",
      "cjs-off": "exit 0",
      "cjs-on": "exit 0",
      "dev": "DEV=true node '../../ops/scripts/esbuild.js' && npm run dts",
      "devtest": "c8 npm run unit && npm run examples && npm run lint",
      "dts": "rollup -c && npm run prettier -- 'types/index.d.ts' --write --log-level 'silent'",
      "examples": "node '../../ops/scripts/run-examples.js'",
      "lect": "node '../../ops/lect/lect.js' && npm run prettier -- 'README.md' '.all-contributorsrc' 'rollup.config.js' --write",
      "letspublish": "npm publish || :",
      "lint": "eslint . --fix",
      "perf": "node perf/check.js",
      "prep": "echo 'ready'",
      "prettier": "prettier",
      "prettier:format": "npm run prettier -- --write '**/*.{ts,tsx,md}' --no-error-on-unmatched-pattern --log-level 'silent'",
      "pretest": "npm run lect && npm run build",
      "test": "npm run devtest",
      "unit": "uvu test"
    },
    "engines": {
      "node": ">=14.18.0"
    },
    "c8": {
      "check-coverage": true,
      "exclude": [
        "**/test/**/*.*"
      ],
      "lines": 100
    },
    "lect": {
      "licence": {
        "extras": [
          ""
        ]
      }
    },
    "dependencies": {
      "@types/lodash-es": "^4.17.12",
      "codsen-utils": "^1.6.8",
      "html-entities": "^2.6.0",
      "lodash-es": "^4.17.21",
      "ranges-apply": "^7.0.20",
      "ranges-push": "^7.0.19",
      "string-left-right": "^6.0.21"
    },
    "devDependencies": {
      "ast-monkey-traverse": "^4.0.20",
      "ranges-invert": "^6.0.20",
      "title": "^4.0.1"
    }
  },
  "string-trim-spaces-only": {
    "name": "string-trim-spaces-only",
    "version": "5.0.13",
    "description": "Like String.trim() but you can choose granularly what to trim",
    "keywords": [
      "characters",
      "end",
      "front",
      "just",
      "only",
      "space",
      "spaces",
      "string",
      "text",
      "trim"
    ],
    "homepage": "https://codsen.com/os/string-trim-spaces-only",
    "repository": {
      "type": "git",
      "url": "git+https://github.com/codsen/codsen.git",
      "directory": "packages/string-trim-spaces-only"
    },
    "license": "MIT",
    "author": {
      "name": "Roy Revelt",
      "email": "roy@codsen.com",
      "url": "https://codsen.com"
    },
    "type": "module",
    "exports": {
      "types": "./types/index.d.ts",
      "script": "./dist/string-trim-spaces-only.umd.js",
      "default": "./dist/string-trim-spaces-only.esm.js"
    },
    "types": "types/index.d.ts",
    "scripts": {
      "build": "node '../../ops/scripts/esbuild.js' && npm run dts",
      "cjs-off": "exit 0",
      "cjs-on": "exit 0",
      "dev": "DEV=true node '../../ops/scripts/esbuild.js' && npm run dts",
      "devtest": "c8 npm run unit && npm run examples && npm run lint",
      "dts": "rollup -c && npm run prettier -- 'types/index.d.ts' --write --log-level 'silent'",
      "examples": "node '../../ops/scripts/run-examples.js'",
      "lect": "node '../../ops/lect/lect.js' && npm run prettier -- 'README.md' '.all-contributorsrc' 'rollup.config.js' --write",
      "letspublish": "npm publish || :",
      "lint": "eslint . --fix",
      "perf": "node perf/check.js",
      "prep": "echo 'ready'",
      "prettier": "prettier",
      "prettier:format": "npm run prettier -- --write '**/*.{ts,tsx,md}' --no-error-on-unmatched-pattern --log-level 'silent'",
      "pretest": "npm run lect && npm run build",
      "test": "npm run devtest",
      "unit": "uvu test"
    },
    "engines": {
      "node": ">=14.18.0"
    },
    "c8": {
      "check-coverage": true,
      "exclude": [
        "**/test/**/*.*"
      ],
      "lines": 100
    },
    "lect": {
      "licence": {
        "extras": [
          ""
        ]
      }
    }
  },
  "string-uglify": {
    "name": "string-uglify",
    "version": "3.0.14",
    "description": "Shorten sets of strings deterministically, to be git-friendly",
    "keywords": [
      "class",
      "classes",
      "css",
      "generate",
      "generator",
      "id",
      "minify",
      "name",
      "names",
      "reference",
      "selector",
      "short",
      "string",
      "style",
      "uglify",
      "values"
    ],
    "homepage": "https://codsen.com/os/string-uglify",
    "repository": {
      "type": "git",
      "url": "git+https://github.com/codsen/codsen.git",
      "directory": "packages/string-uglify"
    },
    "license": "MIT",
    "author": {
      "name": "Roy Revelt",
      "email": "roy@codsen.com",
      "url": "https://codsen.com"
    },
    "type": "module",
    "exports": {
      "types": "./types/index.d.ts",
      "script": "./dist/string-uglify.umd.js",
      "default": "./dist/string-uglify.esm.js"
    },
    "types": "types/index.d.ts",
    "scripts": {
      "build": "node '../../ops/scripts/esbuild.js' && npm run dts",
      "cjs-off": "exit 0",
      "cjs-on": "exit 0",
      "dev": "DEV=true node '../../ops/scripts/esbuild.js' && npm run dts",
      "devtest": "c8 npm run unit && npm run examples && npm run lint",
      "dts": "rollup -c && npm run prettier -- 'types/index.d.ts' --write --log-level 'silent'",
      "examples": "node '../../ops/scripts/run-examples.js'",
      "lect": "node '../../ops/lect/lect.js' && npm run prettier -- 'README.md' '.all-contributorsrc' 'rollup.config.js' --write",
      "letspublish": "npm publish || :",
      "lint": "eslint . --fix",
      "perf": "node perf/check.js",
      "prep": "echo 'ready'",
      "prettier": "prettier",
      "prettier:format": "npm run prettier -- --write '**/*.{ts,tsx,md}' --no-error-on-unmatched-pattern --log-level 'silent'",
      "pretest": "npm run lect && npm run build",
      "test": "npm run devtest",
      "unit": "uvu test"
    },
    "engines": {
      "node": ">=14.18.0"
    },
    "c8": {
      "check-coverage": true,
      "exclude": [
        "**/test/**/*.*"
      ],
      "lines": 100
    },
    "lect": {
      "licence": {
        "extras": [
          ""
        ]
      },
      "various": {}
    }
  },
  "string-unfancy": {
    "name": "string-unfancy",
    "version": "6.0.20",
    "description": "Replace all n/m dashes, curly quotes with their simpler equivalents",
    "keywords": [
      "alt",
      "attributes",
      "characters",
      "dash",
      "email",
      "encoding",
      "fancy",
      "quote",
      "remove",
      "replace",
      "simple",
      "string",
      "tags",
      "templates"
    ],
    "homepage": "https://codsen.com/os/string-unfancy",
    "repository": {
      "type": "git",
      "url": "git+https://github.com/codsen/codsen.git",
      "directory": "packages/string-unfancy"
    },
    "license": "MIT",
    "author": {
      "name": "Roy Revelt",
      "email": "roy@codsen.com",
      "url": "https://codsen.com"
    },
    "type": "module",
    "exports": {
      "types": "./types/index.d.ts",
      "script": "./dist/string-unfancy.umd.js",
      "default": "./dist/string-unfancy.esm.js"
    },
    "types": "types/index.d.ts",
    "scripts": {
      "build": "node '../../ops/scripts/esbuild.js' && npm run dts",
      "cjs-off": "exit 0",
      "cjs-on": "exit 0",
      "dev": "DEV=true node '../../ops/scripts/esbuild.js' && npm run dts",
      "devtest": "c8 npm run unit && npm run examples && npm run lint",
      "dts": "rollup -c && npm run prettier -- 'types/index.d.ts' --write --log-level 'silent'",
      "examples": "node '../../ops/scripts/run-examples.js'",
      "lect": "node '../../ops/lect/lect.js' && npm run prettier -- 'README.md' '.all-contributorsrc' 'rollup.config.js' --write",
      "letspublish": "npm publish || :",
      "lint": "eslint . --fix",
      "perf": "node perf/check.js",
      "prep": "echo 'ready'",
      "prettier": "prettier",
      "prettier:format": "npm run prettier -- --write '**/*.{ts,tsx,md}' --no-error-on-unmatched-pattern --log-level 'silent'",
      "pretest": "npm run lect && npm run build",
      "test": "npm run devtest",
      "unit": "uvu test"
    },
    "engines": {
      "node": ">=14.18.0"
    },
    "c8": {
      "check-coverage": true,
      "exclude": [
        "**/test/**/*.*"
      ],
      "lines": 100
    },
    "lect": {
      "licence": {
        "extras": [
          ""
        ]
      }
    },
    "dependencies": {
      "codsen-utils": "^1.6.8",
      "he": "^1.2.0"
    },
    "devDependencies": {
      "@types/he": "^1.2.3"
    }
  },
  "test-mixer": {
    "name": "test-mixer",
    "version": "4.1.18",
    "description": "Test helper to generate function opts object variations",
    "keywords": [
      "combinations",
      "helper",
      "mixer",
      "object",
      "options",
      "opts",
      "test",
      "variations"
    ],
    "homepage": "https://codsen.com/os/test-mixer",
    "repository": {
      "type": "git",
      "url": "git+https://github.com/codsen/codsen.git",
      "directory": "packages/test-mixer"
    },
    "license": "MIT",
    "author": {
      "name": "Roy Revelt",
      "email": "roy@codsen.com",
      "url": "https://codsen.com"
    },
    "type": "module",
    "exports": {
      "types": "./types/index.d.ts",
      "script": "./dist/test-mixer.umd.js",
      "default": "./dist/test-mixer.esm.js"
    },
    "types": "types/index.d.ts",
    "scripts": {
      "build": "node '../../ops/scripts/esbuild.js' && npm run dts",
      "cjs-off": "exit 0",
      "cjs-on": "exit 0",
      "dev": "DEV=true node '../../ops/scripts/esbuild.js' && npm run dts",
      "devtest": "c8 npm run unit && npm run examples && npm run lint",
      "dts": "rollup -c && npm run prettier -- 'types/index.d.ts' --write --log-level 'silent'",
      "examples": "node '../../ops/scripts/run-examples.js'",
      "lect": "node '../../ops/lect/lect.js' && npm run prettier -- 'README.md' '.all-contributorsrc' 'rollup.config.js' --write",
      "letspublish": "npm publish || :",
      "lint": "eslint . --fix",
      "perf": "node perf/check.js",
      "prep": "echo 'ready'",
      "prettier": "prettier",
      "prettier:format": "npm run prettier -- --write '**/*.{ts,tsx,md}' --no-error-on-unmatched-pattern --log-level 'silent'",
      "pretest": "npm run lect && npm run build",
      "test": "npm run devtest",
      "unit": "uvu test"
    },
    "engines": {
      "node": ">=14.18.0"
    },
    "c8": {
      "check-coverage": true,
      "exclude": [
        "**/test/**/*.*"
      ],
      "lines": 100
    },
    "lect": {
      "licence": {
        "extras": [
          ""
        ]
      }
    },
    "dependencies": {
      "object-boolean-combinations": "^6.1.9",
      "rfdc": "^1.4.1"
    }
  },
  "tsd-extract": {
    "name": "tsd-extract",
    "version": "0.8.21",
    "description": "Extract any definition from TS definitions file string",
    "keywords": [
      "ts",
      "typescript",
      "dts",
      "type",
      "definitions",
      "extract",
      "get",
      "interface",
      "name",
      "value",
      "function",
      "tsx",
      "tsd",
      "declare",
      "export"
    ],
    "homepage": "https://codsen.com/os/tsd-extract",
    "repository": {
      "type": "git",
      "url": "git+https://github.com/codsen/codsen.git",
      "directory": "packages/tsd-extract"
    },
    "license": "MIT",
    "author": {
      "name": "Roy Revelt",
      "email": "roy@codsen.com",
      "url": "https://codsen.com"
    },
    "type": "module",
    "exports": {
      "types": "./types/index.d.ts",
      "script": "./dist/tsd-extract.umd.js",
      "default": "./dist/tsd-extract.esm.js"
    },
    "types": "types/index.d.ts",
    "scripts": {
      "build": "node '../../ops/scripts/esbuild.js' && npm run dts",
      "cjs-off": "exit 0",
      "cjs-on": "exit 0",
      "dev": "DEV=true node '../../ops/scripts/esbuild.js' && npm run dts",
      "devtest": "c8 npm run unit && npm run examples && npm run lint",
      "dts": "rollup -c && npm run prettier -- 'types/index.d.ts' --write --log-level 'silent'",
      "examples": "node '../../ops/scripts/run-examples.js'",
      "lect": "node '../../ops/lect/lect.js' && npm run prettier -- 'README.md' '.all-contributorsrc' 'rollup.config.js' --write",
      "letspublish": "npm publish || :",
      "lint": "eslint . --fix",
      "perf": "node perf/check.js",
      "prep": "echo 'ready'",
      "prettier": "prettier",
      "prettier:format": "npm run prettier -- --write '**/*.{ts,tsx,md}' --no-error-on-unmatched-pattern --log-level 'silent'",
      "pretest": "npm run lect && npm run build",
      "test": "npm run devtest",
      "unit": "uvu test"
    },
    "engines": {
      "node": ">=14.18.0"
    },
    "c8": {
      "check-coverage": true,
      "exclude": [
        "**/test/**/*.*"
      ],
      "lines": 100
    },
    "lect": {
      "licence": {
        "extras": [
          ""
        ]
      }
    },
    "dependencies": {
      "string-left-right": "^6.0.21"
    }
  },
  "update-versions": {
    "name": "update-versions",
    "version": "7.0.10",
    "description": "Like npm-check-updates but supports Lerna monorepos and enforces strict semver values",
    "keywords": [
      "app",
      "automates",
      "check",
      "cli",
      "dependencies",
      "friendly",
      "json",
      "lerna",
      "monorepo",
      "npm",
      "package",
      "package.json",
      "tool",
      "update",
      "updates",
      "upgrade",
      "utility",
      "version",
      "versions"
    ],
    "homepage": "https://codsen.com/os/update-versions",
    "repository": {
      "type": "git",
      "url": "git+https://github.com/codsen/codsen.git",
      "directory": "packages/update-versions"
    },
    "license": "MIT",
    "author": {
      "name": "Roy Revelt",
      "email": "roy@codsen.com",
      "url": "https://codsen.com"
    },
    "type": "module",
    "bin": {
      "upd": "cli.js"
    },
    "scripts": {
      "build": "exit 0",
      "cjs-off": "exit 0",
      "cjs-on": "exit 0",
      "dev": "exit 0",
      "devtest": "npm run test",
      "dts": "exit 0",
      "examples": "exit 0",
      "lect": "node '../../ops/lect/lect.js'",
      "letspublish": "npm publish || :",
      "lint": "eslint . --fix",
      "perf": "exit 0",
      "prep": "echo 'ready'",
      "prettier": "prettier",
      "prettier:format": "npm run prettier -- --write '**/*.{js,md}' --no-error-on-unmatched-pattern --log-level 'silent'",
      "pretest": "exit 0",
      "test": "c8 npm run unit && npm run lint",
      "unit": "uvu test"
    },
    "engines": {
      "node": ">=18"
    },
    "c8": {
      "check-coverage": false,
      "exclude": [
        "**/test/**/*.*"
      ]
    },
    "lect": {
      "licence": {
        "extras": [
          ""
        ]
      }
    },
    "dependencies": {
      "ansi-diff-stream": "^1.2.1",
      "codsen-utils": "^1.6.8",
      "edit-package-json": "^0.8.27",
      "globby": "^14.1.0",
      "is-online": "^11.0.0",
      "log-update": "^6.1.0",
      "meow": "^13.2.0",
      "object-path": "^0.11.8",
      "p-map": "^7.0.3",
      "p-progress": "^1.0.0",
      "p-reduce": "^3.0.0",
      "pacote": "^21.0.0",
      "update-notifier": "^7.3.1",
      "write-file-atomic": "^6.0.0"
    },
    "devDependencies": {
      "fs-extra": "^11.3.0",
      "rfdc": "^1.4.1"
    }
  },
  "util-array-object-or-both": {
    "name": "util-array-object-or-both",
    "version": "5.0.15",
    "description": "Validate and normalise user choice: array, object or both?",
    "keywords": [
      "array",
      "both",
      "choice",
      "normalise",
      "object",
      "plain",
      "user",
      "util",
      "validate"
    ],
    "homepage": "https://codsen.com/os/util-array-object-or-both",
    "repository": {
      "type": "git",
      "url": "git+https://github.com/codsen/codsen.git",
      "directory": "packages/util-array-object-or-both"
    },
    "license": "MIT",
    "author": {
      "name": "Roy Revelt",
      "email": "roy@codsen.com",
      "url": "https://codsen.com"
    },
    "type": "module",
    "exports": {
      "types": "./types/index.d.ts",
      "script": "./dist/util-array-object-or-both.umd.js",
      "default": "./dist/util-array-object-or-both.esm.js"
    },
    "types": "types/index.d.ts",
    "scripts": {
      "build": "node '../../ops/scripts/esbuild.js' && npm run dts",
      "cjs-off": "exit 0",
      "cjs-on": "exit 0",
      "dev": "DEV=true node '../../ops/scripts/esbuild.js' && npm run dts",
      "devtest": "c8 npm run unit && npm run examples && npm run lint",
      "dts": "rollup -c && npm run prettier -- 'types/index.d.ts' --write --log-level 'silent'",
      "examples": "node '../../ops/scripts/run-examples.js'",
      "lect": "node '../../ops/lect/lect.js' && npm run prettier -- 'README.md' '.all-contributorsrc' 'rollup.config.js' --write",
      "letspublish": "npm publish || :",
      "lint": "eslint . --fix",
      "perf": "node perf/check.js",
      "prep": "echo 'ready'",
      "prettier": "prettier",
      "prettier:format": "npm run prettier -- --write '**/*.{ts,tsx,md}' --no-error-on-unmatched-pattern --log-level 'silent'",
      "pretest": "npm run lect && npm run build",
      "test": "npm run devtest",
      "unit": "uvu test"
    },
    "engines": {
      "node": ">=14.18.0"
    },
    "c8": {
      "check-coverage": true,
      "exclude": [
        "**/test/**/*.*"
      ],
      "lines": 100
    },
    "lect": {
      "licence": {
        "extras": [
          ""
        ]
      },
      "various": {}
    },
    "dependencies": {
      "@types/lodash-es": "^4.17.12",
      "lodash-es": "^4.17.21"
    }
  },
  "util-nonempty": {
    "name": "util-nonempty",
    "version": "5.0.19",
    "description": "Is the input (plain object, array, string or whatever) not empty?",
    "keywords": [
      "array",
      "empty",
      "is",
      "not",
      "object",
      "string",
      "util"
    ],
    "homepage": "https://codsen.com/os/util-nonempty",
    "repository": {
      "type": "git",
      "url": "git+https://github.com/codsen/codsen.git",
      "directory": "packages/util-nonempty"
    },
    "license": "MIT",
    "author": {
      "name": "Roy Revelt",
      "email": "roy@codsen.com",
      "url": "https://codsen.com"
    },
    "type": "module",
    "exports": {
      "types": "./types/index.d.ts",
      "script": "./dist/util-nonempty.umd.js",
      "default": "./dist/util-nonempty.esm.js"
    },
    "types": "types/index.d.ts",
    "scripts": {
      "build": "node '../../ops/scripts/esbuild.js' && npm run dts",
      "cjs-off": "exit 0",
      "cjs-on": "exit 0",
      "dev": "DEV=true node '../../ops/scripts/esbuild.js' && npm run dts",
      "devtest": "c8 npm run unit && npm run examples && npm run lint",
      "dts": "rollup -c && npm run prettier -- 'types/index.d.ts' --write --log-level 'silent'",
      "examples": "node '../../ops/scripts/run-examples.js'",
      "lect": "node '../../ops/lect/lect.js' && npm run prettier -- 'README.md' '.all-contributorsrc' 'rollup.config.js' --write",
      "letspublish": "npm publish || :",
      "lint": "eslint . --fix",
      "perf": "node perf/check.js",
      "prep": "echo 'ready'",
      "prettier": "prettier",
      "prettier:format": "npm run prettier -- --write '**/*.{ts,tsx,md}' --no-error-on-unmatched-pattern --log-level 'silent'",
      "pretest": "npm run lect && npm run build",
      "test": "npm run devtest",
      "unit": "uvu test"
    },
    "engines": {
      "node": ">=14.18.0"
    },
    "c8": {
      "check-coverage": true,
      "exclude": [
        "**/test/**/*.*"
      ],
      "lines": 100
    },
    "lect": {
      "licence": {
        "extras": [
          ""
        ]
      }
    },
    "dependencies": {
      "codsen-utils": "^1.6.8"
    }
  }
};
