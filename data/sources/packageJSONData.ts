export const packageJSONData = {
    "eslint-plugin-row-num": {
        "description": "ESLint plugin to update row numbers on each console.log"
    },
    "eslint-plugin-test-num": {
        "description": "ESLint plugin to update unit test numbers automatically"
    },
    "perf-ref": {
        "description": "A mock program to normalise perf scores against it"
    },
    "tsd-extract-noesm": {
        "description": "Extract any definition from TS definitions file"
    },
    "lect": {
        "description": "Maintenance CLI for internal consumption"
    },
    "all-named-html-entities": {
        "name": "all-named-html-entities",
        "version": "2.1.13",
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
            "url": "https://github.com/codsen/codsen.git",
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
            "build": "node '../../ops/scripts/esbuild.js' && yarn run dts",
            "dev": "DEV=true node '../../ops/scripts/esbuild.js' && yarn run dts",
            "devtest": "c8 yarn run unit && yarn run examples && yarn run lint",
            "dts": "rollup -c && yarn run prettier 'types/index.d.ts' --write",
            "examples": "node '../../ops/scripts/run-examples.js'",
            "lect": "node '../../ops/lect/lect.js' && yarn run prettier 'README.md' '.all-contributorsrc' 'rollup.config.js' --write",
            "letspublish": "yarn publish || :",
            "lint": "eslint . --fix",
            "perf": "node perf/check.js",
            "prepare": "echo 'ready'",
            "prettier": "prettier",
            "prettier:format": "prettier --write '**/*.{ts,tsx,md}' --no-error-on-unmatched-pattern",
            "pretest": "yarn run lect && yarn run build",
            "test": "yarn run devtest",
            "unit": "uvu test"
        },
        "engines": {
            "node": "^12.20.0 || ^14.13.1 || >=16.0.0"
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
            "type-fest": "^3.1.0"
        }
    },
    "array-group-str-omit-num-char": {
        "name": "array-group-str-omit-num-char",
        "version": "5.2.9",
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
            "url": "https://github.com/codsen/codsen.git",
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
            "build": "node '../../ops/scripts/esbuild.js' && yarn run dts",
            "dev": "DEV=true node '../../ops/scripts/esbuild.js' && yarn run dts",
            "devtest": "c8 yarn run unit && yarn run examples && yarn run lint",
            "dts": "rollup -c && yarn run prettier 'types/index.d.ts' --write",
            "examples": "node '../../ops/scripts/run-examples.js'",
            "lect": "node '../../ops/lect/lect.js' && yarn run prettier 'README.md' '.all-contributorsrc' 'rollup.config.js' --write",
            "letspublish": "yarn publish || :",
            "lint": "eslint . --fix",
            "perf": "node perf/check.js",
            "prepare": "echo 'ready'",
            "prettier": "prettier",
            "prettier:format": "prettier --write '**/*.{ts,tsx,md}' --no-error-on-unmatched-pattern",
            "pretest": "yarn run lect && yarn run build",
            "test": "yarn run devtest",
            "unit": "uvu test"
        },
        "engines": {
            "node": "^12.20.0 || ^14.13.1 || >=16.0.0"
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
            "lodash.uniq": "^4.5.0",
            "ranges-apply": "^6.2.9"
        },
        "devDependencies": {
            "@types/lodash.uniq": "^4.5.7"
        }
    },
    "array-includes-with-glob": {
        "name": "array-includes-with-glob",
        "version": "4.1.3",
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
            "url": "https://github.com/codsen/codsen.git",
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
            "build": "node '../../ops/scripts/esbuild.js' && yarn run dts",
            "dev": "DEV=true node '../../ops/scripts/esbuild.js' && yarn run dts",
            "devtest": "c8 yarn run unit && yarn run examples && yarn run lint",
            "dts": "rollup -c && yarn run prettier 'types/index.d.ts' --write",
            "examples": "node '../../ops/scripts/run-examples.js'",
            "lect": "node '../../ops/lect/lect.js' && yarn run prettier 'README.md' '.all-contributorsrc' 'rollup.config.js' --write",
            "letspublish": "yarn publish || :",
            "lint": "eslint . --fix",
            "perf": "node perf/check.js",
            "prepare": "echo 'ready'",
            "prettier": "prettier",
            "prettier:format": "prettier --write '**/*.{ts,tsx,md}' --no-error-on-unmatched-pattern",
            "pretest": "yarn run lect && yarn run build",
            "test": "yarn run devtest",
            "unit": "uvu test"
        },
        "engines": {
            "node": "^12.20.0 || ^14.13.1 || >=16.0.0"
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
    "array-of-arrays-into-ast": {
        "name": "array-of-arrays-into-ast",
        "version": "3.1.3",
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
            "url": "https://github.com/codsen/codsen.git",
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
            "build": "node '../../ops/scripts/esbuild.js' && yarn run dts",
            "dev": "DEV=true node '../../ops/scripts/esbuild.js' && yarn run dts",
            "devtest": "c8 yarn run unit && yarn run examples && yarn run lint",
            "dts": "rollup -c && yarn run prettier 'types/index.d.ts' --write",
            "examples": "node '../../ops/scripts/run-examples.js'",
            "lect": "node '../../ops/lect/lect.js' && yarn run prettier 'README.md' '.all-contributorsrc' 'rollup.config.js' --write",
            "letspublish": "yarn publish || :",
            "lint": "eslint . --fix",
            "perf": "node perf/check.js",
            "prepare": "echo 'ready'",
            "prettier": "prettier",
            "prettier:format": "prettier --write '**/*.{ts,tsx,md}' --no-error-on-unmatched-pattern",
            "pretest": "yarn run lect && yarn run build",
            "test": "yarn run devtest",
            "unit": "uvu test"
        },
        "engines": {
            "node": "^12.20.0 || ^14.13.1 || >=16.0.0"
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
            "check-types-mini": "^7.2.3",
            "object-merge-advanced": "^13.2.3"
        }
    },
    "array-of-arrays-sort-by-col": {
        "name": "array-of-arrays-sort-by-col",
        "version": "4.1.3",
        "description": "Sort array of arrays by column, rippling the sorting outwards from that column",
        "keywords": [
            "array",
            "arrays",
            "ascending",
            "by",
            "column",
            "descending",
            "nested",
            "order",
            "sort",
            "sorting"
        ],
        "homepage": "https://codsen.com/os/array-of-arrays-sort-by-col",
        "repository": {
            "type": "git",
            "url": "https://github.com/codsen/codsen.git",
            "directory": "packages/array-of-arrays-sort-by-col"
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
            "script": "./dist/array-of-arrays-sort-by-col.umd.js",
            "default": "./dist/array-of-arrays-sort-by-col.esm.js"
        },
        "types": "types/index.d.ts",
        "scripts": {
            "build": "node '../../ops/scripts/esbuild.js' && yarn run dts",
            "dev": "DEV=true node '../../ops/scripts/esbuild.js' && yarn run dts",
            "devtest": "c8 yarn run unit && yarn run examples && yarn run lint",
            "dts": "rollup -c && yarn run prettier 'types/index.d.ts' --write",
            "examples": "node '../../ops/scripts/run-examples.js'",
            "lect": "node '../../ops/lect/lect.js' && yarn run prettier 'README.md' '.all-contributorsrc' 'rollup.config.js' --write",
            "letspublish": "yarn publish || :",
            "lint": "eslint . --fix",
            "perf": "node perf/check.js",
            "prepare": "echo 'ready'",
            "prettier": "prettier",
            "prettier:format": "prettier --write '**/*.{ts,tsx,md}' --no-error-on-unmatched-pattern",
            "pretest": "yarn run lect && yarn run build",
            "test": "yarn run devtest",
            "unit": "uvu test"
        },
        "engines": {
            "node": "^12.20.0 || ^14.13.1 || >=16.0.0"
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
            "array-shuffle": "^3.0.0"
        }
    },
    "array-pull-all-with-glob": {
        "name": "array-pull-all-with-glob",
        "version": "6.2.3",
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
            "url": "https://github.com/codsen/codsen.git",
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
            "build": "node '../../ops/scripts/esbuild.js' && yarn run dts",
            "dev": "DEV=true node '../../ops/scripts/esbuild.js' && yarn run dts",
            "devtest": "c8 yarn run unit && yarn run examples && yarn run lint",
            "dts": "rollup -c && yarn run prettier 'types/index.d.ts' --write",
            "examples": "node '../../ops/scripts/run-examples.js'",
            "lect": "node '../../ops/lect/lect.js' && yarn run prettier 'README.md' '.all-contributorsrc' 'rollup.config.js' --write",
            "letspublish": "yarn publish || :",
            "lint": "eslint . --fix",
            "perf": "node perf/check.js",
            "prepare": "echo 'ready'",
            "prettier": "prettier",
            "prettier:format": "prettier --write '**/*.{ts,tsx,md}' --no-error-on-unmatched-pattern",
            "pretest": "yarn run lect && yarn run build",
            "test": "yarn run devtest",
            "unit": "uvu test"
        },
        "engines": {
            "node": "^12.20.0 || ^14.13.1 || >=16.0.0"
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
        "version": "4.1.3",
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
            "url": "https://github.com/codsen/codsen.git",
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
            "build": "node '../../ops/scripts/esbuild.js' && yarn run dts",
            "dev": "DEV=true node '../../ops/scripts/esbuild.js' && yarn run dts",
            "devtest": "c8 yarn run unit && yarn run examples && yarn run lint",
            "dts": "rollup -c && yarn run prettier 'types/index.d.ts' --write",
            "examples": "node '../../ops/scripts/run-examples.js'",
            "lect": "node '../../ops/lect/lect.js' && yarn run prettier 'README.md' '.all-contributorsrc' 'rollup.config.js' --write",
            "letspublish": "yarn publish || :",
            "lint": "eslint . --fix",
            "perf": "node perf/check.js",
            "prepare": "echo 'ready'",
            "prettier": "prettier",
            "prettier:format": "prettier --write '**/*.{ts,tsx,md}' --no-error-on-unmatched-pattern",
            "pretest": "yarn run lect && yarn run build",
            "test": "yarn run devtest",
            "unit": "uvu test"
        },
        "engines": {
            "node": "^12.20.0 || ^14.13.1 || >=16.0.0"
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
        "version": "3.2.13",
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
            "url": "https://github.com/codsen/codsen.git",
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
            "build": "node '../../ops/scripts/esbuild.js' && yarn run dts",
            "dev": "DEV=true node '../../ops/scripts/esbuild.js' && yarn run dts",
            "devtest": "c8 yarn run unit && yarn run examples && yarn run lint",
            "dts": "rollup -c && yarn run prettier 'types/index.d.ts' --write",
            "examples": "node '../../ops/scripts/run-examples.js'",
            "lect": "node '../../ops/lect/lect.js' && yarn run prettier 'README.md' '.all-contributorsrc' 'rollup.config.js' --write",
            "letspublish": "yarn publish || :",
            "lint": "eslint . --fix",
            "perf": "node perf/check.js",
            "prepare": "echo 'ready'",
            "prettier": "prettier",
            "prettier:format": "prettier --write '**/*.{ts,tsx,md}' --no-error-on-unmatched-pattern",
            "pretest": "yarn run lect && yarn run build",
            "test": "yarn run devtest",
            "unit": "uvu test"
        },
        "engines": {
            "node": "^12.20.0 || ^14.13.1 || >=16.0.0"
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
            "ast-contains-only-empty-space": "^3.2.3",
            "lodash.isplainobject": "^4.0.6",
            "matcher": "^5.0.0",
            "type-detect": "^4.0.8"
        },
        "devDependencies": {
            "@types/lodash.isplainobject": "^4.0.7",
            "@types/type-detect": "^4.0.1",
            "type-fest": "^3.1.0"
        }
    },
    "ast-contains-only-empty-space": {
        "name": "ast-contains-only-empty-space",
        "version": "3.2.3",
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
            "url": "https://github.com/codsen/codsen.git",
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
            "build": "node '../../ops/scripts/esbuild.js' && yarn run dts",
            "dev": "DEV=true node '../../ops/scripts/esbuild.js' && yarn run dts",
            "devtest": "c8 yarn run unit && yarn run examples && yarn run lint",
            "dts": "rollup -c && yarn run prettier 'types/index.d.ts' --write",
            "examples": "node '../../ops/scripts/run-examples.js'",
            "lect": "node '../../ops/lect/lect.js' && yarn run prettier 'README.md' '.all-contributorsrc' 'rollup.config.js' --write",
            "letspublish": "yarn publish || :",
            "lint": "eslint . --fix",
            "perf": "node perf/check.js",
            "prepare": "echo 'ready'",
            "prettier": "prettier",
            "prettier:format": "prettier --write '**/*.{ts,tsx,md}' --no-error-on-unmatched-pattern",
            "pretest": "yarn run lect && yarn run build",
            "test": "yarn run devtest",
            "unit": "uvu test"
        },
        "engines": {
            "node": "^12.20.0 || ^14.13.1 || >=16.0.0"
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
            "ast-monkey-traverse": "^3.1.3"
        }
    },
    "ast-deep-contains": {
        "name": "ast-deep-contains",
        "version": "4.2.3",
        "description": "Like t.same assert on array of objects, where element order doesn't matter.",
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
            "url": "https://github.com/codsen/codsen.git",
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
            "build": "node '../../ops/scripts/esbuild.js' && yarn run dts",
            "dev": "DEV=true node '../../ops/scripts/esbuild.js' && yarn run dts",
            "devtest": "c8 yarn run unit && yarn run examples && yarn run lint",
            "dts": "rollup -c && yarn run prettier 'types/index.d.ts' --write",
            "examples": "node '../../ops/scripts/run-examples.js'",
            "lect": "node '../../ops/lect/lect.js' && yarn run prettier 'README.md' '.all-contributorsrc' 'rollup.config.js' --write",
            "letspublish": "yarn publish || :",
            "lint": "eslint . --fix",
            "perf": "node perf/check.js",
            "prepare": "echo 'ready'",
            "prettier": "prettier",
            "prettier:format": "prettier --write '**/*.{ts,tsx,md}' --no-error-on-unmatched-pattern",
            "pretest": "yarn run lect && yarn run build",
            "test": "yarn run devtest",
            "unit": "uvu test"
        },
        "engines": {
            "node": "^12.20.0 || ^14.13.1 || >=16.0.0"
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
            "@sindresorhus/is": "^5.3.0",
            "ast-monkey-traverse": "^3.1.3",
            "object-path": "^0.11.8"
        },
        "devDependencies": {
            "@types/lodash.isplainobject": "^4.0.7",
            "@types/object-path": "^0.11.1"
        }
    },
    "ast-delete-object": {
        "name": "ast-delete-object",
        "version": "3.1.13",
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
            "url": "https://github.com/codsen/codsen.git",
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
            "build": "node '../../ops/scripts/esbuild.js' && yarn run dts",
            "dev": "DEV=true node '../../ops/scripts/esbuild.js' && yarn run dts",
            "devtest": "c8 yarn run unit && yarn run examples && yarn run lint",
            "dts": "rollup -c && yarn run prettier 'types/index.d.ts' --write",
            "examples": "node '../../ops/scripts/run-examples.js'",
            "lect": "node '../../ops/lect/lect.js' && yarn run prettier 'README.md' '.all-contributorsrc' 'rollup.config.js' --write",
            "letspublish": "yarn publish || :",
            "lint": "eslint . --fix",
            "perf": "node perf/check.js",
            "prepare": "echo 'ready'",
            "prettier": "prettier",
            "prettier:format": "prettier --write '**/*.{ts,tsx,md}' --no-error-on-unmatched-pattern",
            "pretest": "yarn run lect && yarn run build",
            "test": "yarn run devtest",
            "unit": "uvu test"
        },
        "engines": {
            "node": "^12.20.0 || ^14.13.1 || >=16.0.0"
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
            "ast-compare": "^3.2.13",
            "ast-monkey-traverse": "^3.1.3",
            "lodash.clonedeep": "^4.5.0",
            "lodash.isplainobject": "^4.0.6"
        },
        "devDependencies": {
            "@types/lodash.clonedeep": "^4.5.7",
            "@types/lodash.isplainobject": "^4.0.7"
        }
    },
    "ast-get-object": {
        "name": "ast-get-object",
        "version": "3.1.13",
        "description": "Getter/setter for nested parsed HTML AST's, querying objects by key/value pairs",
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
            "url": "https://github.com/codsen/codsen.git",
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
            "build": "node '../../ops/scripts/esbuild.js' && yarn run dts",
            "dev": "DEV=true node '../../ops/scripts/esbuild.js' && yarn run dts",
            "devtest": "c8 yarn run unit && yarn run examples && yarn run lint",
            "dts": "rollup -c && yarn run prettier 'types/index.d.ts' --write",
            "examples": "node '../../ops/scripts/run-examples.js'",
            "lect": "node '../../ops/lect/lect.js' && yarn run prettier 'README.md' '.all-contributorsrc' 'rollup.config.js' --write",
            "letspublish": "yarn publish || :",
            "lint": "eslint . --fix",
            "perf": "node perf/check.js",
            "prepare": "echo 'ready'",
            "prettier": "prettier",
            "prettier:format": "prettier --write '**/*.{ts,tsx,md}' --no-error-on-unmatched-pattern",
            "pretest": "yarn run lect && yarn run build",
            "test": "yarn run devtest",
            "unit": "uvu test"
        },
        "engines": {
            "node": "^12.20.0 || ^14.13.1 || >=16.0.0"
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
            "ast-compare": "^3.2.13",
            "lodash.clonedeep": "^4.5.0",
            "lodash.isplainobject": "^4.0.6"
        },
        "devDependencies": {
            "@types/lodash.clonedeep": "^4.5.7",
            "@types/lodash.isplainobject": "^4.0.7"
        }
    },
    "ast-get-values-by-key": {
        "name": "ast-get-values-by-key",
        "version": "4.1.3",
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
            "url": "https://github.com/codsen/codsen.git",
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
            "build": "node '../../ops/scripts/esbuild.js' && yarn run dts",
            "dev": "DEV=true node '../../ops/scripts/esbuild.js' && yarn run dts",
            "devtest": "c8 yarn run unit && yarn run examples && yarn run lint",
            "dts": "rollup -c && yarn run prettier 'types/index.d.ts' --write",
            "examples": "node '../../ops/scripts/run-examples.js'",
            "lect": "node '../../ops/lect/lect.js' && yarn run prettier 'README.md' '.all-contributorsrc' 'rollup.config.js' --write",
            "letspublish": "yarn publish || :",
            "lint": "eslint . --fix",
            "perf": "node perf/check.js",
            "prepare": "echo 'ready'",
            "prettier": "prettier",
            "prettier:format": "prettier --write '**/*.{ts,tsx,md}' --no-error-on-unmatched-pattern",
            "pretest": "yarn run lect && yarn run build",
            "test": "yarn run devtest",
            "unit": "uvu test"
        },
        "engines": {
            "node": "^12.20.0 || ^14.13.1 || >=16.0.0"
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
            "ast-monkey-traverse": "^3.1.3",
            "lodash.clonedeep": "^4.5.0",
            "matcher": "^5.0.0"
        },
        "devDependencies": {
            "@types/lodash.clonedeep": "^4.5.7"
        }
    },
    "ast-is-empty": {
        "name": "ast-is-empty",
        "version": "3.1.3",
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
            "url": "https://github.com/codsen/codsen.git",
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
            "build": "node '../../ops/scripts/esbuild.js' && yarn run dts",
            "dev": "DEV=true node '../../ops/scripts/esbuild.js' && yarn run dts",
            "devtest": "c8 yarn run unit && yarn run examples && yarn run lint",
            "dts": "rollup -c && yarn run prettier 'types/index.d.ts' --write",
            "examples": "node '../../ops/scripts/run-examples.js'",
            "lect": "node '../../ops/lect/lect.js' && yarn run prettier 'README.md' '.all-contributorsrc' 'rollup.config.js' --write",
            "letspublish": "yarn publish || :",
            "lint": "eslint . --fix",
            "perf": "node perf/check.js",
            "prepare": "echo 'ready'",
            "prettier": "prettier",
            "prettier:format": "prettier --write '**/*.{ts,tsx,md}' --no-error-on-unmatched-pattern",
            "pretest": "yarn run lect && yarn run build",
            "test": "yarn run devtest",
            "unit": "uvu test"
        },
        "engines": {
            "node": "^12.20.0 || ^14.13.1 || >=16.0.0"
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
            "lodash.isplainobject": "^4.0.6"
        },
        "devDependencies": {
            "@types/lodash.isplainobject": "^4.0.7"
        }
    },
    "ast-loose-compare": {
        "name": "ast-loose-compare",
        "version": "3.1.3",
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
            "url": "https://github.com/codsen/codsen.git",
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
            "build": "node '../../ops/scripts/esbuild.js' && yarn run dts",
            "dev": "DEV=true node '../../ops/scripts/esbuild.js' && yarn run dts",
            "devtest": "c8 yarn run unit && yarn run examples && yarn run lint",
            "dts": "rollup -c && yarn run prettier 'types/index.d.ts' --write",
            "examples": "node '../../ops/scripts/run-examples.js'",
            "lect": "node '../../ops/lect/lect.js' && yarn run prettier 'README.md' '.all-contributorsrc' 'rollup.config.js' --write",
            "letspublish": "yarn publish || :",
            "lint": "eslint . --fix",
            "perf": "node perf/check.js",
            "prepare": "echo 'ready'",
            "prettier": "prettier",
            "prettier:format": "prettier --write '**/*.{ts,tsx,md}' --no-error-on-unmatched-pattern",
            "pretest": "yarn run lect && yarn run build",
            "test": "yarn run devtest",
            "unit": "uvu test"
        },
        "engines": {
            "node": "^12.20.0 || ^14.13.1 || >=16.0.0"
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
            "ast-contains-only-empty-space": "^3.2.3",
            "lodash.isplainobject": "^4.0.6"
        },
        "devDependencies": {
            "@types/lodash.isplainobject": "^4.0.7"
        }
    },
    "ast-monkey": {
        "name": "ast-monkey",
        "version": "8.1.13",
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
            "url": "https://github.com/codsen/codsen.git",
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
            "build": "node '../../ops/scripts/esbuild.js' && yarn run dts",
            "dev": "DEV=true node '../../ops/scripts/esbuild.js' && yarn run dts",
            "devtest": "c8 yarn run unit && yarn run examples && yarn run lint",
            "dts": "rollup -c && yarn run prettier 'types/index.d.ts' --write",
            "examples": "node '../../ops/scripts/run-examples.js'",
            "lect": "node '../../ops/lect/lect.js' && yarn run prettier 'README.md' '.all-contributorsrc' 'rollup.config.js' --write",
            "letspublish": "yarn publish || :",
            "lint": "eslint . --fix",
            "perf": "node perf/check.js",
            "prepare": "echo 'ready'",
            "prettier": "prettier",
            "prettier:format": "prettier --write '**/*.{ts,tsx,md}' --no-error-on-unmatched-pattern",
            "pretest": "yarn run lect && yarn run build",
            "test": "yarn run devtest",
            "unit": "uvu test"
        },
        "engines": {
            "node": "^12.20.0 || ^14.13.1 || >=16.0.0"
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
            "ast-compare": "^3.2.13",
            "ast-monkey-traverse": "^3.1.3",
            "check-types-mini": "^7.2.3",
            "util-array-object-or-both": "^4.2.3"
        }
    },
    "ast-monkey-traverse": {
        "name": "ast-monkey-traverse",
        "version": "3.1.3",
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
            "url": "https://github.com/codsen/codsen.git",
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
            "build": "node '../../ops/scripts/esbuild.js' && yarn run dts",
            "dev": "DEV=true node '../../ops/scripts/esbuild.js' && yarn run dts",
            "devtest": "c8 yarn run unit && yarn run examples && yarn run lint",
            "dts": "rollup -c && yarn run prettier 'types/index.d.ts' --write",
            "examples": "node '../../ops/scripts/run-examples.js'",
            "lect": "node '../../ops/lect/lect.js' && yarn run prettier 'README.md' '.all-contributorsrc' 'rollup.config.js' --write",
            "letspublish": "yarn publish || :",
            "lint": "eslint . --fix",
            "perf": "node perf/check.js",
            "prepare": "echo 'ready'",
            "prettier": "prettier",
            "prettier:format": "prettier --write '**/*.{ts,tsx,md}' --no-error-on-unmatched-pattern",
            "pretest": "yarn run lect && yarn run build",
            "test": "yarn run devtest",
            "unit": "uvu test"
        },
        "engines": {
            "node": "^12.20.0 || ^14.13.1 || >=16.0.0"
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
            "ast-monkey-util": "^2.1.3",
            "lodash.clonedeep": "^4.5.0",
            "lodash.isplainobject": "^4.0.6"
        },
        "devDependencies": {
            "@types/lodash.clonedeep": "^4.5.7",
            "@types/lodash.isplainobject": "^4.0.7",
            "lodash.isequal": "^4.5.0"
        }
    },
    "ast-monkey-traverse-with-lookahead": {
        "name": "ast-monkey-traverse-with-lookahead",
        "version": "3.1.3",
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
            "url": "https://github.com/codsen/codsen.git",
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
            "build": "node '../../ops/scripts/esbuild.js' && yarn run dts",
            "dev": "DEV=true node '../../ops/scripts/esbuild.js' && yarn run dts",
            "devtest": "c8 yarn run unit && yarn run examples && yarn run lint",
            "dts": "rollup -c && yarn run prettier 'types/index.d.ts' --write",
            "examples": "node '../../ops/scripts/run-examples.js'",
            "lect": "node '../../ops/lect/lect.js' && yarn run prettier 'README.md' '.all-contributorsrc' 'rollup.config.js' --write",
            "letspublish": "yarn publish || :",
            "lint": "eslint . --fix",
            "perf": "node perf/check.js",
            "prepare": "echo 'ready'",
            "prettier": "prettier",
            "prettier:format": "prettier --write '**/*.{ts,tsx,md}' --no-error-on-unmatched-pattern",
            "pretest": "yarn run lect && yarn run build",
            "test": "yarn run devtest",
            "unit": "uvu test"
        },
        "engines": {
            "node": "^12.20.0 || ^14.13.1 || >=16.0.0"
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
            "lodash.clonedeep": "^4.5.0",
            "lodash.isplainobject": "^4.0.6"
        },
        "devDependencies": {
            "@types/lodash.clonedeep": "^4.5.7",
            "@types/lodash.isplainobject": "^4.0.7",
            "lodash.isequal": "^4.5.0"
        }
    },
    "ast-monkey-util": {
        "name": "ast-monkey-util",
        "version": "2.1.3",
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
            "url": "https://github.com/codsen/codsen.git",
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
            "build": "node '../../ops/scripts/esbuild.js' && yarn run dts",
            "dev": "DEV=true node '../../ops/scripts/esbuild.js' && yarn run dts",
            "devtest": "c8 yarn run unit && yarn run examples && yarn run lint",
            "dts": "rollup -c && yarn run prettier 'types/index.d.ts' --write",
            "examples": "node '../../ops/scripts/run-examples.js'",
            "lect": "node '../../ops/lect/lect.js' && yarn run prettier 'README.md' '.all-contributorsrc' 'rollup.config.js' --write",
            "letspublish": "yarn publish || :",
            "lint": "eslint . --fix",
            "perf": "node perf/check.js",
            "prepare": "echo 'ready'",
            "prettier": "prettier",
            "prettier:format": "prettier --write '**/*.{ts,tsx,md}' --no-error-on-unmatched-pattern",
            "pretest": "yarn run lect && yarn run build",
            "test": "yarn run devtest",
            "unit": "uvu test"
        },
        "engines": {
            "node": "^12.20.0 || ^14.13.1 || >=16.0.0"
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
            "lodash.isequal": "^4.5.0"
        }
    },
    "bitbucket-slug": {
        "name": "bitbucket-slug",
        "version": "3.2.3",
        "description": "Generate BitBucket readme header anchor slug URLs. Unofficial, covers whole ASCII and a bit beyond.",
        "keywords": [
            "anchor",
            "bitbucket",
            "create",
            "generate",
            "generator",
            "h1",
            "h2",
            "h3",
            "h4",
            "h5",
            "h6",
            "header",
            "heading",
            "link",
            "linked",
            "readme",
            "slug",
            "string",
            "title",
            "url"
        ],
        "homepage": "https://codsen.com/os/bitbucket-slug",
        "repository": {
            "type": "git",
            "url": "https://github.com/codsen/codsen.git",
            "directory": "packages/bitbucket-slug"
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
            "script": "./dist/bitbucket-slug.umd.js",
            "default": "./dist/bitbucket-slug.esm.js"
        },
        "types": "types/index.d.ts",
        "scripts": {
            "build": "node '../../ops/scripts/esbuild.js' && yarn run dts",
            "dev": "DEV=true node '../../ops/scripts/esbuild.js' && yarn run dts",
            "devtest": "c8 yarn run unit && yarn run examples && yarn run lint",
            "dts": "rollup -c && yarn run prettier 'types/index.d.ts' --write",
            "examples": "node '../../ops/scripts/run-examples.js'",
            "lect": "node '../../ops/lect/lect.js' && yarn run prettier 'README.md' '.all-contributorsrc' 'rollup.config.js' --write",
            "letspublish": "yarn publish || :",
            "lint": "eslint . --fix",
            "perf": "node perf/check.js",
            "prepare": "echo 'ready'",
            "prettier": "prettier",
            "prettier:format": "prettier --write '**/*.{ts,tsx,md}' --no-error-on-unmatched-pattern",
            "pretest": "yarn run lect && yarn run build",
            "test": "yarn run devtest",
            "unit": "uvu test"
        },
        "engines": {
            "node": "^12.20.0 || ^14.13.1 || >=16.0.0"
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
            "lodash.deburr": "^4.1.0"
        },
        "devDependencies": {
            "@types/lodash.deburr": "^4.1.7"
        }
    },
    "charcode-is-valid-xml-name-character": {
        "name": "charcode-is-valid-xml-name-character",
        "version": "2.2.3",
        "description": "Does a given character belong to XML spec's \"Production 4 OR 4a\" type (is acceptable for XML element's name)",
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
            "url": "https://github.com/codsen/codsen.git",
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
            "build": "node '../../ops/scripts/esbuild.js' && yarn run dts",
            "dev": "DEV=true node '../../ops/scripts/esbuild.js' && yarn run dts",
            "devtest": "c8 yarn run unit && yarn run examples && yarn run lint",
            "dts": "rollup -c && yarn run prettier 'types/index.d.ts' --write",
            "examples": "node '../../ops/scripts/run-examples.js'",
            "lect": "node '../../ops/lect/lect.js' && yarn run prettier 'README.md' '.all-contributorsrc' 'rollup.config.js' --write",
            "letspublish": "yarn publish || :",
            "lint": "eslint . --fix",
            "perf": "node perf/check.js",
            "prepare": "echo 'ready'",
            "prettier": "prettier",
            "prettier:format": "prettier --write '**/*.{ts,tsx,md}' --no-error-on-unmatched-pattern",
            "pretest": "yarn run lect && yarn run build",
            "test": "yarn run devtest",
            "unit": "uvu test"
        },
        "engines": {
            "node": "^12.20.0 || ^14.13.1 || >=16.0.0"
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
            "ranges-is-index-within": "^3.2.3"
        }
    },
    "check-types-mini": {
        "name": "check-types-mini",
        "version": "7.2.3",
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
            "url": "https://github.com/codsen/codsen.git",
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
            "build": "node '../../ops/scripts/esbuild.js' && yarn run dts",
            "dev": "DEV=true node '../../ops/scripts/esbuild.js' && yarn run dts",
            "devtest": "c8 yarn run unit && yarn run examples && yarn run lint",
            "dts": "rollup -c && yarn run prettier 'types/index.d.ts' --write",
            "examples": "node '../../ops/scripts/run-examples.js'",
            "lect": "node '../../ops/lect/lect.js' && yarn run prettier 'README.md' '.all-contributorsrc' 'rollup.config.js' --write",
            "letspublish": "yarn publish || :",
            "lint": "eslint . --fix",
            "perf": "node perf/check.js",
            "prepare": "echo 'ready'",
            "prettier": "prettier",
            "prettier:format": "prettier --write '**/*.{ts,tsx,md}' --no-error-on-unmatched-pattern",
            "pretest": "yarn run lect && yarn run build",
            "test": "yarn run devtest",
            "unit": "uvu test"
        },
        "engines": {
            "node": "^12.20.0 || ^14.13.1 || >=16.0.0"
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
            "arrayiffy-if-string": "^4.1.3",
            "ast-monkey-traverse": "^3.1.3",
            "lodash.intersection": "^4.4.0",
            "lodash.pullall": "^4.2.0",
            "matcher": "^5.0.0",
            "object-path": "^0.11.8",
            "type-detect": "^4.0.8"
        },
        "devDependencies": {
            "@types/lodash.intersection": "^4.4.7",
            "@types/lodash.pullall": "^4.2.7"
        }
    },
    "codsen": {
        "name": "codsen",
        "version": "0.1.8",
        "description": "Codsen CLI",
        "keywords": [
            "codsen",
            "cli"
        ],
        "homepage": "https://codsen.com/os/codsen",
        "repository": {
            "type": "git",
            "url": "https://github.com/codsen/codsen.git",
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
            "build": "echo 'no build needed'",
            "dev": "echo 'no build needed'",
            "lect": "node '../../ops/lect/lect.js'",
            "letspublish": "yarn publish || :",
            "lint": "eslint . --fix",
            "prepare": "echo 'ready'",
            "prettier:format": "prettier --write '**/*.{js,md}' --no-error-on-unmatched-pattern",
            "test": "c8 yarn run unit && yarn run lint",
            "unit": "uvu test"
        },
        "engines": {
            "node": "^12.20.0 || ^14.13.1 || >=16.0.0"
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
            "meow": "^11.0.0",
            "update-notifier": "^6.0.2"
        }
    },
    "codsen-parser": {
        "name": "codsen-parser",
        "version": "0.13.14",
        "description": "Parser aiming at broken or mixed code, especially HTML & CSS",
        "keywords": [
            "ast",
            "css",
            "html",
            "parse",
            "parsing",
            "processing",
            "tokenizer"
        ],
        "homepage": "https://codsen.com/os/codsen-parser",
        "repository": {
            "type": "git",
            "url": "https://github.com/codsen/codsen.git",
            "directory": "packages/codsen-parser"
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
            "script": "./dist/codsen-parser.umd.js",
            "default": "./dist/codsen-parser.esm.js"
        },
        "types": "types/index.d.ts",
        "scripts": {
            "build": "node '../../ops/scripts/esbuild.js' && yarn run dts",
            "dev": "DEV=true node '../../ops/scripts/esbuild.js' && yarn run dts",
            "devtest": "c8 yarn run unit && yarn run examples && yarn run lint",
            "dts": "rollup -c && yarn run prettier 'types/index.d.ts' --write",
            "examples": "node '../../ops/scripts/run-examples.js'",
            "lect": "node '../../ops/lect/lect.js' && yarn run prettier 'README.md' '.all-contributorsrc' 'rollup.config.js' --write",
            "letspublish": "yarn publish || :",
            "lint": "eslint . --fix",
            "perf": "node perf/check.js",
            "prepare": "echo 'ready'",
            "prettier": "prettier",
            "prettier:format": "prettier --write '**/*.{ts,tsx,md}' --no-error-on-unmatched-pattern",
            "pretest": "yarn run lect && yarn run build",
            "test": "yarn run devtest",
            "unit": "uvu test"
        },
        "engines": {
            "node": "^12.20.0 || ^14.13.1 || >=16.0.0"
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
            "ast-monkey-util": "^2.1.3",
            "codsen-tokenizer": "^6.1.14",
            "object-path": "^0.11.8",
            "string-find-malformed": "^3.2.4",
            "string-left-right": "^5.1.4"
        }
    },
    "codsen-tokenizer": {
        "name": "codsen-tokenizer",
        "version": "6.1.14",
        "description": "HTML and CSS lexer aimed at code with fatal errors, accepts mixed coding languages",
        "keywords": [
            "ast",
            "codsen",
            "css",
            "html",
            "lexer",
            "lint",
            "parse",
            "parsing",
            "processing",
            "token",
            "tokeniser",
            "tokenizer"
        ],
        "homepage": "https://codsen.com/os/codsen-tokenizer",
        "repository": {
            "type": "git",
            "url": "https://github.com/codsen/codsen.git",
            "directory": "packages/codsen-tokenizer"
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
            "script": "./dist/codsen-tokenizer.umd.js",
            "default": "./dist/codsen-tokenizer.esm.js"
        },
        "types": "types/index.d.ts",
        "scripts": {
            "build": "node '../../ops/scripts/esbuild.js' && yarn run dts",
            "dev": "DEV=true node '../../ops/scripts/esbuild.js' && yarn run dts",
            "devtest": "c8 yarn run unit && yarn run examples && yarn run lint",
            "dts": "rollup -c && yarn run prettier 'types/index.d.ts' --write",
            "examples": "node '../../ops/scripts/run-examples.js'",
            "lect": "node '../../ops/lect/lect.js' && yarn run prettier 'README.md' '.all-contributorsrc' 'rollup.config.js' --write",
            "letspublish": "yarn publish || :",
            "lint": "eslint . --fix",
            "perf": "node perf/check.js",
            "prepare": "echo 'ready'",
            "prettier": "prettier",
            "prettier:format": "prettier --write '**/*.{ts,tsx,md}' --no-error-on-unmatched-pattern",
            "pretest": "yarn run lect && yarn run build",
            "test": "yarn run devtest",
            "unit": "uvu test"
        },
        "engines": {
            "node": "^12.20.0 || ^14.13.1 || >=16.0.0"
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
            "html-all-known-attributes": "^5.1.3",
            "is-char-suitable-for-html-attr-name": "^3.2.2",
            "is-html-attribute-closing": "^3.1.4",
            "is-html-tag-opening": "^3.1.4",
            "lodash.clonedeep": "^4.5.0",
            "lodash.isplainobject": "^4.0.6",
            "string-left-right": "^5.1.4",
            "string-match-left-right": "^8.2.4"
        },
        "devDependencies": {
            "@types/lodash.clonedeep": "^4.5.7",
            "@types/lodash.isplainobject": "^4.0.7",
            "ast-compare": "^3.2.13"
        }
    },
    "color-shorthand-hex-to-six-digit": {
        "name": "color-shorthand-hex-to-six-digit",
        "version": "4.1.3",
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
            "url": "https://github.com/codsen/codsen.git",
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
            "build": "node '../../ops/scripts/esbuild.js' && yarn run dts",
            "dev": "DEV=true node '../../ops/scripts/esbuild.js' && yarn run dts",
            "devtest": "c8 yarn run unit && yarn run examples && yarn run lint",
            "dts": "rollup -c && yarn run prettier 'types/index.d.ts' --write",
            "examples": "node '../../ops/scripts/run-examples.js'",
            "lect": "node '../../ops/lect/lect.js' && yarn run prettier 'README.md' '.all-contributorsrc' 'rollup.config.js' --write",
            "letspublish": "yarn publish || :",
            "lint": "eslint . --fix",
            "perf": "node perf/check.js",
            "prepare": "echo 'ready'",
            "prettier": "prettier",
            "prettier:format": "prettier --write '**/*.{ts,tsx,md}' --no-error-on-unmatched-pattern",
            "pretest": "yarn run lect && yarn run build",
            "test": "yarn run devtest",
            "unit": "uvu test"
        },
        "engines": {
            "node": "^12.20.0 || ^14.13.1 || >=16.0.0"
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
            "hex-color-regex": "^1.1.0",
            "lodash.clonedeep": "^4.5.0",
            "lodash.isplainobject": "^4.0.6"
        },
        "devDependencies": {
            "@types/hex-color-regex": "^1.1.1",
            "@types/lodash.clonedeep": "^4.5.7",
            "@types/lodash.isplainobject": "^4.0.7"
        }
    },
    "csv-sort": {
        "name": "csv-sort",
        "version": "6.1.9",
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
            "url": "https://github.com/codsen/codsen.git",
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
            "build": "node '../../ops/scripts/esbuild.js' && yarn run dts",
            "dev": "DEV=true node '../../ops/scripts/esbuild.js' && yarn run dts",
            "devtest": "c8 yarn run unit && yarn run examples && yarn run lint",
            "dts": "rollup -c && yarn run prettier 'types/index.d.ts' --write",
            "examples": "node '../../ops/scripts/run-examples.js'",
            "lect": "node '../../ops/lect/lect.js' && yarn run prettier 'README.md' '.all-contributorsrc' 'rollup.config.js' --write",
            "letspublish": "yarn publish || :",
            "lint": "eslint . --fix",
            "perf": "node perf/check.js",
            "prepare": "echo 'ready'",
            "prettier": "prettier",
            "prettier:format": "prettier --write '**/*.{ts,tsx,md}' --no-error-on-unmatched-pattern",
            "pretest": "yarn run lect && yarn run build",
            "test": "yarn run devtest",
            "unit": "uvu test"
        },
        "engines": {
            "node": "^12.20.0 || ^14.13.1 || >=16.0.0"
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
            "csv-split-easy": "^6.1.9",
            "currency.js": "^2.0.4",
            "lodash.pull": "^4.1.0"
        },
        "devDependencies": {
            "@types/lodash.pull": "^4.1.7"
        }
    },
    "csv-sort-cli": {
        "name": "csv-sort-cli",
        "version": "2.1.19",
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
            "url": "https://github.com/codsen/codsen.git",
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
            "build": "echo 'no build needed'",
            "dev": "echo 'no build needed'",
            "lect": "node '../../ops/lect/lect.js'",
            "letspublish": "yarn publish || :",
            "lint": "eslint . --fix",
            "prepare": "echo 'ready'",
            "prettier:format": "prettier --write '**/*.{js,md}' --no-error-on-unmatched-pattern",
            "test": "c8 yarn run unit && yarn run lint",
            "unit": "uvu test"
        },
        "engines": {
            "node": "^12.20.0 || ^14.13.1 || >=16.0.0"
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
            "chalk": "^5.1.2",
            "csv-sort": "^6.1.9",
            "globby": "^13.1.2",
            "inquirer": "^9.1.4",
            "lodash.pullall": "^4.2.0",
            "lodash.uniq": "^4.5.0",
            "meow": "^11.0.0",
            "update-notifier": "^6.0.2"
        },
        "devDependencies": {
            "@types/lodash.pullall": "^4.2.7",
            "@types/lodash.uniq": "^4.5.7"
        }
    },
    "csv-split-easy": {
        "name": "csv-split-easy",
        "version": "6.1.9",
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
            "url": "https://github.com/codsen/codsen.git",
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
            "build": "node '../../ops/scripts/esbuild.js' && yarn run dts",
            "dev": "DEV=true node '../../ops/scripts/esbuild.js' && yarn run dts",
            "devtest": "c8 yarn run unit && yarn run examples && yarn run lint",
            "dts": "rollup -c && yarn run prettier 'types/index.d.ts' --write",
            "examples": "node '../../ops/scripts/run-examples.js'",
            "lect": "node '../../ops/lect/lect.js' && yarn run prettier 'README.md' '.all-contributorsrc' 'rollup.config.js' --write",
            "letspublish": "yarn publish || :",
            "lint": "eslint . --fix",
            "perf": "node perf/check.js",
            "prepare": "echo 'ready'",
            "prettier": "prettier",
            "prettier:format": "prettier --write '**/*.{ts,tsx,md}' --no-error-on-unmatched-pattern",
            "pretest": "yarn run lect && yarn run build",
            "test": "yarn run devtest",
            "unit": "uvu test"
        },
        "engines": {
            "node": "^12.20.0 || ^14.13.1 || >=16.0.0"
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
            "string-remove-thousand-separators": "^6.2.9"
        }
    },
    "detect-is-it-html-or-xhtml": {
        "name": "detect-is-it-html-or-xhtml",
        "version": "5.1.3",
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
            "url": "https://github.com/codsen/codsen.git",
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
            "build": "node '../../ops/scripts/esbuild.js' && yarn run dts",
            "dev": "DEV=true node '../../ops/scripts/esbuild.js' && yarn run dts",
            "devtest": "c8 yarn run unit && yarn run examples && yarn run lint",
            "dts": "rollup -c && yarn run prettier 'types/index.d.ts' --write",
            "examples": "node '../../ops/scripts/run-examples.js'",
            "lect": "node '../../ops/lect/lect.js' && yarn run prettier 'README.md' '.all-contributorsrc' 'rollup.config.js' --write",
            "letspublish": "yarn publish || :",
            "lint": "eslint . --fix",
            "perf": "node perf/check.js",
            "prepare": "echo 'ready'",
            "prettier": "prettier",
            "prettier:format": "prettier --write '**/*.{ts,tsx,md}' --no-error-on-unmatched-pattern",
            "pretest": "yarn run lect && yarn run build",
            "test": "yarn run devtest",
            "unit": "uvu test"
        },
        "engines": {
            "node": "^12.20.0 || ^14.13.1 || >=16.0.0"
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
        "version": "3.1.2",
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
            "url": "https://github.com/codsen/codsen.git",
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
            "build": "node '../../ops/scripts/esbuild.js' && yarn run dts",
            "dev": "DEV=true node '../../ops/scripts/esbuild.js' && yarn run dts",
            "devtest": "c8 yarn run unit && yarn run examples && yarn run lint",
            "dts": "rollup -c && yarn run prettier 'types/index.d.ts' --write",
            "examples": "node '../../ops/scripts/run-examples.js'",
            "lect": "node '../../ops/lect/lect.js' && yarn run prettier 'README.md' '.all-contributorsrc' 'rollup.config.js' --write",
            "letspublish": "yarn publish || :",
            "lint": "eslint . --fix",
            "perf": "node perf/check.js",
            "prepare": "echo 'ready'",
            "prettier": "prettier",
            "prettier:format": "prettier --write '**/*.{ts,tsx,md}' --no-error-on-unmatched-pattern",
            "pretest": "yarn run lect && yarn run build",
            "test": "yarn run devtest",
            "unit": "uvu test"
        },
        "engines": {
            "node": "^12.20.0 || ^14.13.1 || >=16.0.0"
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
            "regex-is-jinja-nunjucks": "^3.1.2",
            "regex-is-jsp": "^3.1.2",
            "regex-jinja-specific": "^3.1.2"
        }
    },
    "detergent": {
        "name": "detergent",
        "version": "8.1.22",
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
            "url": "https://github.com/codsen/codsen.git",
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
            "build": "node '../../ops/scripts/esbuild.js' && yarn run dts",
            "dev": "DEV=true node '../../ops/scripts/esbuild.js' && yarn run dts",
            "devtest": "c8 yarn run unit && yarn run examples && yarn run lint",
            "dts": "rollup -c && yarn run prettier 'types/index.d.ts' --write",
            "examples": "node '../../ops/scripts/run-examples.js'",
            "lect": "node '../../ops/lect/lect.js' && yarn run prettier 'README.md' '.all-contributorsrc' 'rollup.config.js' --write",
            "letspublish": "yarn publish || :",
            "lint": "eslint . --fix",
            "perf": "node perf/check.js",
            "prepare": "echo 'ready'",
            "prettier": "prettier",
            "prettier:format": "prettier --write '**/*.{ts,tsx,md}' --no-error-on-unmatched-pattern",
            "pretest": "yarn run lect && yarn run build",
            "test": "yarn run devtest",
            "unit": "uvu test"
        },
        "engines": {
            "node": "^12.20.0 || ^14.13.1 || >=16.0.0"
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
            "all-named-html-entities": "^2.1.13",
            "ansi-regex": "^6.0.1",
            "he": "^1.2.0",
            "html-entities-not-email-friendly": "^0.7.2",
            "ranges-apply": "^6.2.9",
            "ranges-invert": "^5.2.9",
            "ranges-process-outside": "^5.1.9",
            "ranges-push": "^6.2.4",
            "string-apostrophes": "^3.1.9",
            "string-collapse-white-space": "^10.2.9",
            "string-fix-broken-named-entities": "^6.1.13",
            "string-left-right": "^5.1.4",
            "string-range-expander": "^3.1.3",
            "string-remove-widows": "^3.1.22",
            "string-strip-html": "^11.6.17",
            "string-trim-spaces-only": "^4.1.3"
        },
        "devDependencies": {
            "lodash.clonedeep": "^4.5.0",
            "test-mixer": "^3.1.3"
        }
    },
    "easy-replace": {
        "name": "easy-replace",
        "version": "5.1.3",
        "description": "Replace strings with optional lookarounds, but without regexes",
        "keywords": [
            "easy",
            "find",
            "lookahead",
            "lookaround",
            "lookbehind",
            "negative",
            "positive",
            "replace",
            "replacement",
            "search",
            "string"
        ],
        "homepage": "https://codsen.com/os/easy-replace",
        "repository": {
            "type": "git",
            "url": "https://github.com/codsen/codsen.git",
            "directory": "packages/easy-replace"
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
            "script": "./dist/easy-replace.umd.js",
            "default": "./dist/easy-replace.esm.js"
        },
        "types": "types/index.d.ts",
        "scripts": {
            "build": "node '../../ops/scripts/esbuild.js' && yarn run dts",
            "dev": "DEV=true node '../../ops/scripts/esbuild.js' && yarn run dts",
            "devtest": "c8 yarn run unit && yarn run examples && yarn run lint",
            "dts": "rollup -c && yarn run prettier 'types/index.d.ts' --write",
            "examples": "node '../../ops/scripts/run-examples.js'",
            "lect": "node '../../ops/lect/lect.js' && yarn run prettier 'README.md' '.all-contributorsrc' 'rollup.config.js' --write",
            "letspublish": "yarn publish || :",
            "lint": "eslint . --fix",
            "perf": "node perf/check.js",
            "prepare": "echo 'ready'",
            "prettier": "prettier",
            "prettier:format": "prettier --write '**/*.{ts,tsx,md}' --no-error-on-unmatched-pattern",
            "pretest": "yarn run lect && yarn run build",
            "test": "yarn run devtest",
            "unit": "uvu test"
        },
        "engines": {
            "node": "^12.20.0 || ^14.13.1 || >=16.0.0"
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
    "edit-package-json": {
        "name": "edit-package-json",
        "version": "0.7.9",
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
            "url": "https://github.com/codsen/codsen.git",
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
            "build": "node '../../ops/scripts/esbuild.js' && yarn run dts",
            "dev": "DEV=true node '../../ops/scripts/esbuild.js' && yarn run dts",
            "devtest": "c8 yarn run unit && yarn run examples && yarn run lint",
            "dts": "rollup -c && yarn run prettier 'types/index.d.ts' --write",
            "examples": "node '../../ops/scripts/run-examples.js'",
            "lect": "node '../../ops/lect/lect.js' && yarn run prettier 'README.md' '.all-contributorsrc' 'rollup.config.js' --write",
            "letspublish": "yarn publish || :",
            "lint": "eslint . --fix",
            "perf": "node perf/check.js",
            "prepare": "echo 'ready'",
            "prettier": "prettier",
            "prettier:format": "prettier --write '**/*.{ts,tsx,md}' --no-error-on-unmatched-pattern",
            "pretest": "yarn run lect && yarn run build",
            "test": "yarn run devtest",
            "unit": "uvu test"
        },
        "engines": {
            "node": "^12.20.0 || ^14.13.1 || >=16.0.0"
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
            "ranges-apply": "^6.2.9",
            "string-left-right": "^5.1.4"
        },
        "devDependencies": {
            "ast-monkey-traverse": "^3.1.3",
            "globby": "^13.1.2",
            "lodash.clonedeep": "^4.5.0",
            "p-map": "^5.5.0"
        }
    },
    "email-all-chars-within-ascii": {
        "name": "email-all-chars-within-ascii",
        "version": "4.1.3",
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
            "url": "https://github.com/codsen/codsen.git",
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
            "build": "node '../../ops/scripts/esbuild.js' && yarn run dts",
            "dev": "DEV=true node '../../ops/scripts/esbuild.js' && yarn run dts",
            "devtest": "c8 yarn run unit && yarn run examples && yarn run lint",
            "dts": "rollup -c && yarn run prettier 'types/index.d.ts' --write",
            "examples": "node '../../ops/scripts/run-examples.js'",
            "lect": "node '../../ops/lect/lect.js' && yarn run prettier 'README.md' '.all-contributorsrc' 'rollup.config.js' --write",
            "letspublish": "yarn publish || :",
            "lint": "eslint . --fix",
            "perf": "node perf/check.js",
            "prepare": "echo 'ready'",
            "prettier": "prettier",
            "prettier:format": "prettier --write '**/*.{ts,tsx,md}' --no-error-on-unmatched-pattern",
            "pretest": "yarn run lect && yarn run build",
            "test": "yarn run devtest",
            "unit": "uvu test"
        },
        "engines": {
            "node": "^12.20.0 || ^14.13.1 || >=16.0.0"
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
            "check-types-mini": "^7.2.3"
        }
    },
    "email-all-chars-within-ascii-cli": {
        "name": "email-all-chars-within-ascii-cli",
        "version": "2.1.19",
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
            "url": "https://github.com/codsen/codsen.git",
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
            "build": "echo 'no build needed'",
            "dev": "echo 'no build needed'",
            "lect": "node '../../ops/lect/lect.js'",
            "letspublish": "yarn publish || :",
            "lint": "eslint . --fix",
            "prepare": "echo 'ready'",
            "prettier:format": "prettier --write '**/*.{js,md}' --no-error-on-unmatched-pattern",
            "test": "c8 yarn run unit && yarn run lint",
            "unit": "uvu test"
        },
        "engines": {
            "node": "^12.20.0 || ^14.13.1 || >=16.0.0"
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
            "chalk": "^5.1.2",
            "email-all-chars-within-ascii": "^4.1.3",
            "globby": "^13.1.2",
            "inquirer": "^9.1.4",
            "lodash.pullall": "^4.2.0",
            "minimist": "^1.2.7",
            "string-left-right": "^5.1.4",
            "update-notifier": "^6.0.2"
        },
        "devDependencies": {
            "@types/lodash.pullall": "^4.2.7",
            "@types/lodash.uniq": "^4.5.7"
        }
    },
    "email-comb": {
        "name": "email-comb",
        "version": "6.3.18",
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
            "url": "https://github.com/codsen/codsen.git",
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
            "build": "node '../../ops/scripts/esbuild.js' && yarn run dts",
            "dev": "DEV=true node '../../ops/scripts/esbuild.js' && yarn run dts",
            "devtest": "c8 yarn run unit && yarn run examples && yarn run lint",
            "dts": "rollup -c && yarn run prettier 'types/index.d.ts' --write",
            "examples": "node '../../ops/scripts/run-examples.js'",
            "lect": "node '../../ops/lect/lect.js' && yarn run prettier 'README.md' '.all-contributorsrc' 'rollup.config.js' --write",
            "letspublish": "yarn publish || :",
            "lint": "eslint . --fix",
            "perf": "node perf/check.js",
            "prepare": "echo 'ready'",
            "prettier": "prettier",
            "prettier:format": "prettier --write '**/*.{ts,tsx,md}' --no-error-on-unmatched-pattern",
            "pretest": "yarn run lect && yarn run build",
            "test": "yarn run devtest",
            "unit": "uvu test"
        },
        "engines": {
            "node": "^12.20.0 || ^14.13.1 || >=16.0.0"
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
            "array-pull-all-with-glob": "^6.2.3",
            "html-crush": "^5.1.19",
            "lodash.intersection": "^4.4.0",
            "lodash.pullall": "^4.2.0",
            "lodash.uniq": "^4.5.0",
            "matcher": "^5.0.0",
            "ranges-apply": "^6.2.9",
            "ranges-push": "^6.2.4",
            "regex-empty-conditional-comments": "^2.1.3",
            "string-extract-class-names": "^7.1.4",
            "string-left-right": "^5.1.4",
            "string-match-left-right": "^8.2.4",
            "string-range-expander": "^3.1.3",
            "string-uglify": "^2.1.3"
        },
        "devDependencies": {
            "@types/lodash.intersection": "^4.4.7",
            "@types/lodash.pullall": "^4.2.7",
            "@types/lodash.uniq": "^4.5.7"
        }
    },
    "email-homey": {
        "name": "email-homey",
        "version": "3.1.8",
        "description": "Generate homepage in the Browsersync root with links/screenshots to all your email templates",
        "keywords": [
            "browsersync",
            "build",
            "email",
            "folder",
            "generate",
            "gulp",
            "gulpplugin",
            "home",
            "homepage",
            "page",
            "root",
            "system",
            "templates"
        ],
        "homepage": "https://codsen.com/os/email-homey",
        "repository": {
            "type": "git",
            "url": "https://github.com/codsen/codsen.git",
            "directory": "packages/email-homey"
        },
        "license": "MIT",
        "author": {
            "name": "Roy Revelt",
            "email": "roy@codsen.com",
            "url": "https://codsen.com"
        },
        "type": "module",
        "bin": {
            "homey": "cli.js"
        },
        "scripts": {
            "build": "echo 'no build needed'",
            "dev": "echo 'no build needed'",
            "lect": "node '../../ops/lect/lect.js'",
            "letspublish": "yarn publish || :",
            "lint": "eslint . --fix",
            "prepare": "echo 'ready'",
            "prettier:format": "prettier --write '**/*.{js,md}' --no-error-on-unmatched-pattern",
            "test": "c8 yarn run unit && yarn run lint",
            "unit": "uvu test"
        },
        "engines": {
            "node": "^12.20.0 || ^14.13.1 || >=16.0.0"
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
            "chalk": "^5.1.2",
            "globby": "^13.1.2",
            "lodash.uniq": "^4.5.0",
            "log-symbols": "^5.1.0",
            "meow": "^11.0.0",
            "string-splice": "^1.3.0",
            "update-notifier": "^6.0.2"
        },
        "devDependencies": {
            "@types/lodash.uniq": "^4.5.7"
        }
    },
    "emlint": {
        "name": "emlint",
        "version": "5.1.19",
        "description": "Pluggable email template code linter",
        "keywords": [
            "analysis",
            "automatic",
            "automatically",
            "broken",
            "check",
            "code",
            "css",
            "development",
            "email",
            "errors",
            "fix",
            "html",
            "lint",
            "linter",
            "linting",
            "static",
            "template",
            "tool",
            "utility",
            "xhtml"
        ],
        "homepage": "https://codsen.com/os/emlint",
        "repository": {
            "type": "git",
            "url": "https://github.com/codsen/codsen.git",
            "directory": "packages/emlint"
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
            "default": "./dist/emlint.esm.js"
        },
        "types": "types/index.d.ts",
        "bin": {
            "emlint": "bin/cli.js"
        },
        "scripts": {
            "build": "node '../../ops/scripts/esbuild.js' && yarn run dts && node './bin/helper.js'",
            "dev": "DEV=true node '../../ops/scripts/esbuild.js' && yarn run dts",
            "devtest": "c8 yarn run unit && yarn run examples && yarn run lint",
            "dts": "rollup -c && yarn run prettier 'types/index.d.ts' --write",
            "examples": "node '../../ops/scripts/run-examples.js'",
            "lect": "node '../../ops/lect/lect.js' && yarn run prettier 'README.md' '.all-contributorsrc' 'rollup.config.js' --write",
            "letspublish": "yarn publish || :",
            "lint": "eslint . --fix",
            "perf": "node perf/check.js",
            "prepare": "echo 'ready'",
            "prettier": "prettier",
            "prettier:format": "prettier --write '**/*.{ts,tsx,md}' --no-error-on-unmatched-pattern",
            "pretest": "yarn run lect && yarn run build",
            "test": "yarn run devtest",
            "unit": "uvu test"
        },
        "engines": {
            "node": "^12.20.0 || ^14.13.1 || >=16.0.0"
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
            "ast-monkey-traverse": "^3.1.3",
            "ast-monkey-util": "^2.1.3",
            "codsen-parser": "^0.13.14",
            "define-lazy-prop": "^3.0.0",
            "globby": "^13.1.2",
            "he": "^1.2.0",
            "html-all-known-attributes": "^5.1.3",
            "html-entities-not-email-friendly": "^0.7.2",
            "is-d": "^1.0.0",
            "is-language-code": "^4.1.17",
            "is-media-descriptor": "^4.2.9",
            "is-relative-uri": "^4.2.9",
            "is-url-superb": "^6.1.0",
            "leven": "^4.0.0",
            "line-column-mini": "^2.1.3",
            "lodash.clonedeep": "^4.5.0",
            "lodash.isregexp": "^4.0.1",
            "matcher": "^5.0.0",
            "meow": "^11.0.0",
            "mime-db": "^1.52.0",
            "object-path": "^0.11.8",
            "p-reduce": "^3.0.0",
            "ranges-merge": "^8.2.4",
            "rgba-regex": "^1.0.0",
            "string-find-malformed": "^3.2.4",
            "string-fix-broken-named-entities": "^6.1.13",
            "string-left-right": "^5.1.4",
            "string-match-left-right": "^8.2.4",
            "string-process-comma-separated": "^3.1.3",
            "tiny-typed-emitter": "^2.1.0",
            "update-notifier": "^6.0.2",
            "url-regex": "^5.0.0"
        },
        "devDependencies": {
            "@types/he": "^1.1.2",
            "@types/lodash.clonedeep": "^4.5.7",
            "@types/lodash.isregexp": "^4.0.7",
            "@types/mime-db": "^1.43.1",
            "ast-deep-contains": "^4.2.3",
            "ranges-apply": "^6.2.9"
        }
    },
    "extract-search-index": {
        "name": "extract-search-index",
        "version": "1.1.22",
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
            "url": "https://github.com/codsen/codsen.git",
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
            "build": "node '../../ops/scripts/esbuild.js' && yarn run dts",
            "dev": "DEV=true node '../../ops/scripts/esbuild.js' && yarn run dts",
            "devtest": "c8 yarn run unit && yarn run examples && yarn run lint",
            "dts": "rollup -c && yarn run prettier 'types/index.d.ts' --write",
            "examples": "node '../../ops/scripts/run-examples.js'",
            "lect": "node '../../ops/lect/lect.js' && yarn run prettier 'README.md' '.all-contributorsrc' 'rollup.config.js' --write",
            "letspublish": "yarn publish || :",
            "lint": "eslint . --fix",
            "perf": "node perf/check.js",
            "prepare": "echo 'ready'",
            "prettier": "prettier",
            "prettier:format": "prettier --write '**/*.{ts,tsx,md}' --no-error-on-unmatched-pattern",
            "pretest": "yarn run lect && yarn run build",
            "test": "yarn run devtest",
            "unit": "uvu test"
        },
        "engines": {
            "node": "^12.20.0 || ^14.13.1 || >=16.0.0"
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
            "string-strip-html": "^11.6.17",
            "string-unfancy": "^5.1.3"
        }
    },
    "generate-atomic-css": {
        "name": "generate-atomic-css",
        "version": "2.2.4",
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
            "url": "https://github.com/codsen/codsen.git",
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
            "build": "node '../../ops/scripts/esbuild.js' && yarn run dts",
            "dev": "DEV=true node '../../ops/scripts/esbuild.js' && yarn run dts",
            "devtest": "c8 yarn run unit && yarn run examples && yarn run lint",
            "dts": "rollup -c && yarn run prettier 'types/index.d.ts' --write",
            "examples": "node '../../ops/scripts/run-examples.js'",
            "lect": "node '../../ops/lect/lect.js' && yarn run prettier 'README.md' '.all-contributorsrc' 'rollup.config.js' --write",
            "letspublish": "yarn publish || :",
            "lint": "eslint . --fix",
            "perf": "node perf/check.js",
            "prepare": "echo 'ready'",
            "prettier": "prettier",
            "prettier:format": "prettier --write '**/*.{ts,tsx,md}' --no-error-on-unmatched-pattern",
            "pretest": "yarn run lect && yarn run build",
            "test": "yarn run devtest",
            "unit": "uvu test"
        },
        "engines": {
            "node": "^12.20.0 || ^14.13.1 || >=16.0.0"
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
            "string-left-right": "^5.1.4"
        }
    },
    "generate-atomic-css-cli": {
        "name": "generate-atomic-css-cli",
        "version": "2.2.9",
        "description": "Generates and updates all HTML templates' atomic CSS",
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
            "url": "https://github.com/codsen/codsen.git",
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
            "build": "echo 'no build needed'",
            "dev": "echo 'no build needed'",
            "lect": "node '../../ops/lect/lect.js'",
            "letspublish": "yarn publish || :",
            "lint": "eslint . --fix",
            "prepare": "echo 'ready'",
            "prettier:format": "prettier --write '**/*.{js,md}' --no-error-on-unmatched-pattern",
            "test": "c8 yarn run unit && yarn run lint",
            "unit": "uvu test"
        },
        "engines": {
            "node": "^12.20.0 || ^14.13.1 || >=16.0.0"
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
            "generate-atomic-css": "^2.2.4",
            "globby": "^13.1.2",
            "is-d": "^1.0.0",
            "meow": "^11.0.0",
            "p-reduce": "^3.0.0",
            "update-notifier": "^6.0.2",
            "write-file-atomic": "^5.0.0"
        }
    },
    "gulp-email-remove-unused-css": {
        "name": "gulp-email-remove-unused-css",
        "version": "4.1.19",
        "description": "Gulp plugin to remove unused CSS classes/id's from styles in HTML HEAD and inline within BODY",
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
            "url": "https://github.com/codsen/codsen.git",
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
            "build": "echo 'no build needed'",
            "dev": "echo 'no build needed'",
            "lect": "node '../../ops/lect/lect.js'",
            "letspublish": "yarn publish || :",
            "lint": "eslint . --fix",
            "prepare": "echo 'ready'",
            "prettier:format": "prettier --write '**/*.{js,md}' --no-error-on-unmatched-pattern",
            "test": "c8 yarn run unit && yarn run lint",
            "unit": "uvu test"
        },
        "engines": {
            "node": "^12.20.0 || ^14.13.1 || >=16.0.0"
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
            "email-comb": "^6.3.18",
            "plugin-error": "^2.0.0"
        },
        "devDependencies": {
            "map-stream": "^0.0.7",
            "vinyl-string": "^1.0.2"
        }
    },
    "helga": {
        "name": "helga",
        "version": "2.2.3",
        "description": "Your next best friend when editing complex nested code",
        "keywords": [
            "api",
            "code",
            "editor",
            "esp",
            "helper",
            "jinja",
            "json",
            "languages",
            "liquid",
            "nested",
            "nunjucks",
            "responsys",
            "string",
            "templating"
        ],
        "homepage": "https://codsen.com/os/helga",
        "repository": {
            "type": "git",
            "url": "https://github.com/codsen/codsen.git",
            "directory": "packages/helga"
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
            "script": "./dist/helga.umd.js",
            "default": "./dist/helga.esm.js"
        },
        "types": "types/index.d.ts",
        "scripts": {
            "build": "node '../../ops/scripts/esbuild.js' && yarn run dts",
            "dev": "DEV=true node '../../ops/scripts/esbuild.js' && yarn run dts",
            "devtest": "c8 yarn run unit && yarn run examples && yarn run lint",
            "dts": "rollup -c && yarn run prettier 'types/index.d.ts' --write",
            "examples": "node '../../ops/scripts/run-examples.js'",
            "lect": "node '../../ops/lect/lect.js' && yarn run prettier 'README.md' '.all-contributorsrc' 'rollup.config.js' --write",
            "letspublish": "yarn publish || :",
            "lint": "eslint . --fix",
            "perf": "node perf/check.js",
            "prepare": "echo 'ready'",
            "prettier": "prettier",
            "prettier:format": "prettier --write '**/*.{ts,tsx,md}' --no-error-on-unmatched-pattern",
            "pretest": "yarn run lect && yarn run build",
            "test": "yarn run devtest",
            "unit": "uvu test"
        },
        "engines": {
            "node": "^12.20.0 || ^14.13.1 || >=16.0.0"
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
    "html-all-known-attributes": {
        "name": "html-all-known-attributes",
        "version": "5.1.3",
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
            "url": "https://github.com/codsen/codsen.git",
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
            "build": "node '../../ops/scripts/esbuild.js' && yarn run dts",
            "dev": "DEV=true node '../../ops/scripts/esbuild.js' && yarn run dts",
            "devtest": "c8 yarn run unit && yarn run examples && yarn run lint",
            "dts": "rollup -c && yarn run prettier 'types/index.d.ts' --write",
            "examples": "node '../../ops/scripts/run-examples.js'",
            "lect": "node '../../ops/lect/lect.js' && yarn run prettier 'README.md' '.all-contributorsrc' 'rollup.config.js' --write",
            "letspublish": "yarn publish || :",
            "lint": "eslint . --fix",
            "perf": "node perf/check.js",
            "prepare": "echo 'ready'",
            "prettier": "prettier",
            "prettier:format": "prettier --write '**/*.{ts,tsx,md}' --no-error-on-unmatched-pattern",
            "pretest": "yarn run lect && yarn run build",
            "test": "yarn run devtest",
            "unit": "uvu test"
        },
        "engines": {
            "node": "^12.20.0 || ^14.13.1 || >=16.0.0"
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
        "version": "5.1.19",
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
            "url": "https://github.com/codsen/codsen.git",
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
            "build": "node '../../ops/scripts/esbuild.js' && yarn run dts",
            "dev": "DEV=true node '../../ops/scripts/esbuild.js' && yarn run dts",
            "devtest": "c8 yarn run unit && yarn run examples && yarn run lint",
            "dts": "rollup -c && yarn run prettier 'types/index.d.ts' --write",
            "examples": "node '../../ops/scripts/run-examples.js'",
            "lect": "node '../../ops/lect/lect.js' && yarn run prettier 'README.md' '.all-contributorsrc' 'rollup.config.js' --write",
            "letspublish": "yarn publish || :",
            "lint": "eslint . --fix",
            "perf": "node perf/check.js",
            "prepare": "echo 'ready'",
            "prettier": "prettier",
            "prettier:format": "prettier --write '**/*.{ts,tsx,md}' --no-error-on-unmatched-pattern",
            "pretest": "yarn run lect && yarn run build",
            "test": "yarn run devtest",
            "unit": "uvu test"
        },
        "engines": {
            "node": "^12.20.0 || ^14.13.1 || >=16.0.0"
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
            "ranges-apply": "^6.2.9",
            "ranges-push": "^6.2.4",
            "string-left-right": "^5.1.4",
            "string-match-left-right": "^8.2.4",
            "string-range-expander": "^3.1.3",
            "test-mixer": "^3.1.3"
        }
    },
    "html-entities-not-email-friendly": {
        "name": "html-entities-not-email-friendly",
        "version": "0.7.2",
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
            "url": "https://github.com/codsen/codsen.git",
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
            "build": "node '../../ops/scripts/esbuild.js' && yarn run dts",
            "dev": "DEV=true node '../../ops/scripts/esbuild.js' && yarn run dts",
            "devtest": "c8 yarn run unit && yarn run examples && yarn run lint",
            "dts": "rollup -c && yarn run prettier 'types/index.d.ts' --write",
            "examples": "node '../../ops/scripts/run-examples.js'",
            "lect": "node '../../ops/lect/lect.js' && yarn run prettier 'README.md' '.all-contributorsrc' 'rollup.config.js' --write",
            "letspublish": "yarn publish || :",
            "lint": "eslint . --fix",
            "perf": "node perf/check.js",
            "prepare": "echo 'ready'",
            "prettier": "prettier",
            "prettier:format": "prettier --write '**/*.{ts,tsx,md}' --no-error-on-unmatched-pattern",
            "pretest": "yarn run lect && yarn run build",
            "test": "yarn run devtest",
            "unit": "uvu test"
        },
        "engines": {
            "node": "^12.20.0 || ^14.13.1 || >=16.0.0"
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
        "version": "3.2.9",
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
            "url": "https://github.com/codsen/codsen.git",
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
            "build": "node '../../ops/scripts/esbuild.js' && yarn run dts",
            "dev": "DEV=true node '../../ops/scripts/esbuild.js' && yarn run dts",
            "devtest": "c8 yarn run unit && yarn run examples && yarn run lint",
            "dts": "rollup -c && yarn run prettier 'types/index.d.ts' --write",
            "examples": "node '../../ops/scripts/run-examples.js'",
            "lect": "node '../../ops/lect/lect.js' && yarn run prettier 'README.md' '.all-contributorsrc' 'rollup.config.js' --write",
            "letspublish": "yarn publish || :",
            "lint": "eslint . --fix",
            "perf": "node perf/check.js",
            "prepare": "echo 'ready'",
            "prettier": "prettier",
            "prettier:format": "prettier --write '**/*.{ts,tsx,md}' --no-error-on-unmatched-pattern",
            "pretest": "yarn run lect && yarn run build",
            "test": "yarn run devtest",
            "unit": "uvu test"
        },
        "engines": {
            "node": "^12.20.0 || ^14.13.1 || >=16.0.0"
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
            "check-types-mini": "^7.2.3",
            "ranges-apply": "^6.2.9",
            "ranges-push": "^6.2.4",
            "string-unfancy": "^5.1.3"
        }
    },
    "html-table-patcher": {
        "name": "html-table-patcher",
        "version": "5.1.14",
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
            "url": "https://github.com/codsen/codsen.git",
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
            "build": "node '../../ops/scripts/esbuild.js' && yarn run dts",
            "dev": "DEV=true node '../../ops/scripts/esbuild.js' && yarn run dts",
            "devtest": "c8 yarn run unit && yarn run examples && yarn run lint",
            "dts": "rollup -c && yarn run prettier 'types/index.d.ts' --write",
            "examples": "node '../../ops/scripts/run-examples.js'",
            "lect": "node '../../ops/lect/lect.js' && yarn run prettier 'README.md' '.all-contributorsrc' 'rollup.config.js' --write",
            "letspublish": "yarn publish || :",
            "lint": "eslint . --fix",
            "perf": "node perf/check.js",
            "prepare": "echo 'ready'",
            "prettier": "prettier",
            "prettier:format": "prettier --write '**/*.{ts,tsx,md}' --no-error-on-unmatched-pattern",
            "pretest": "yarn run lect && yarn run build",
            "test": "yarn run devtest",
            "unit": "uvu test"
        },
        "engines": {
            "node": "^12.20.0 || ^14.13.1 || >=16.0.0"
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
            "ast-monkey-traverse-with-lookahead": "^3.1.3",
            "codsen-parser": "^0.13.14",
            "ranges-apply": "^6.2.9",
            "ranges-push": "^6.2.4"
        }
    },
    "is-char-suitable-for-html-attr-name": {
        "name": "is-char-suitable-for-html-attr-name",
        "version": "3.2.2",
        "description": "Is given character suitable to be in an HTML attribute's name?",
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
            "url": "https://github.com/codsen/codsen.git",
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
            "build": "node '../../ops/scripts/esbuild.js' && yarn run dts",
            "dev": "DEV=true node '../../ops/scripts/esbuild.js' && yarn run dts",
            "devtest": "c8 yarn run unit && yarn run examples && yarn run lint",
            "dts": "rollup -c && yarn run prettier 'types/index.d.ts' --write",
            "examples": "node '../../ops/scripts/run-examples.js'",
            "lect": "node '../../ops/lect/lect.js' && yarn run prettier 'README.md' '.all-contributorsrc' 'rollup.config.js' --write",
            "letspublish": "yarn publish || :",
            "lint": "eslint . --fix",
            "perf": "node perf/check.js",
            "prepare": "echo 'ready'",
            "prettier": "prettier",
            "prettier:format": "prettier --write '**/*.{ts,tsx,md}' --no-error-on-unmatched-pattern",
            "pretest": "yarn run lect && yarn run build",
            "test": "yarn run devtest",
            "unit": "uvu test"
        },
        "engines": {
            "node": "^12.20.0 || ^14.13.1 || >=16.0.0"
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
        "version": "3.1.4",
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
            "url": "https://github.com/codsen/codsen.git",
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
            "build": "node '../../ops/scripts/esbuild.js' && yarn run dts",
            "dev": "DEV=true node '../../ops/scripts/esbuild.js' && yarn run dts",
            "devtest": "c8 yarn run unit && yarn run examples && yarn run lint",
            "dts": "rollup -c && yarn run prettier 'types/index.d.ts' --write",
            "examples": "node '../../ops/scripts/run-examples.js'",
            "lect": "node '../../ops/lect/lect.js' && yarn run prettier 'README.md' '.all-contributorsrc' 'rollup.config.js' --write",
            "letspublish": "yarn publish || :",
            "lint": "eslint . --fix",
            "perf": "node perf/check.js",
            "prepare": "echo 'ready'",
            "prettier": "prettier",
            "prettier:format": "prettier --write '**/*.{ts,tsx,md}' --no-error-on-unmatched-pattern",
            "pretest": "yarn run lect && yarn run build",
            "test": "yarn run devtest",
            "unit": "uvu test"
        },
        "engines": {
            "node": "^12.20.0 || ^14.13.1 || >=16.0.0"
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
            "html-all-known-attributes": "^5.1.3",
            "is-char-suitable-for-html-attr-name": "^3.2.2",
            "string-left-right": "^5.1.4",
            "string-match-left-right": "^8.2.4"
        }
    },
    "is-html-tag-opening": {
        "name": "is-html-tag-opening",
        "version": "3.1.4",
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
            "url": "https://github.com/codsen/codsen.git",
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
            "build": "node '../../ops/scripts/esbuild.js' && yarn run dts",
            "dev": "DEV=true node '../../ops/scripts/esbuild.js' && yarn run dts",
            "devtest": "c8 yarn run unit && yarn run examples && yarn run lint",
            "dts": "rollup -c && yarn run prettier 'types/index.d.ts' --write",
            "examples": "node '../../ops/scripts/run-examples.js'",
            "lect": "node '../../ops/lect/lect.js' && yarn run prettier 'README.md' '.all-contributorsrc' 'rollup.config.js' --write",
            "letspublish": "yarn publish || :",
            "lint": "eslint . --fix",
            "perf": "node perf/check.js",
            "prepare": "echo 'ready'",
            "prettier": "prettier",
            "prettier:format": "prettier --write '**/*.{ts,tsx,md}' --no-error-on-unmatched-pattern",
            "pretest": "yarn run lect && yarn run build",
            "test": "yarn run devtest",
            "unit": "uvu test"
        },
        "engines": {
            "node": "^12.20.0 || ^14.13.1 || >=16.0.0"
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
            "string-left-right": "^5.1.4",
            "string-match-left-right": "^8.2.4"
        },
        "devDependencies": {
            "test-mixer": "^3.1.3"
        }
    },
    "is-language-code": {
        "name": "is-language-code",
        "version": "4.1.17",
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
            "url": "https://github.com/codsen/codsen.git",
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
            "build": "node '../../ops/scripts/esbuild.js' && yarn run dts",
            "dev": "DEV=true node '../../ops/scripts/esbuild.js' && yarn run dts",
            "devtest": "c8 yarn run unit && yarn run examples && yarn run lint",
            "dts": "rollup -c && yarn run prettier 'types/index.d.ts' --write",
            "examples": "node '../../ops/scripts/run-examples.js'",
            "lect": "node '../../ops/lect/lect.js' && yarn run prettier 'README.md' '.all-contributorsrc' 'rollup.config.js' --write",
            "letspublish": "yarn publish || :",
            "lint": "eslint . --fix",
            "perf": "node perf/check.js",
            "prepare": "echo 'ready'",
            "prettier": "prettier",
            "prettier:format": "prettier --write '**/*.{ts,tsx,md}' --no-error-on-unmatched-pattern",
            "pretest": "yarn run lect && yarn run build",
            "test": "yarn run devtest",
            "unit": "uvu test"
        },
        "engines": {
            "node": "^12.20.0 || ^14.13.1 || >=16.0.0"
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
    "is-media-descriptor": {
        "name": "is-media-descriptor",
        "version": "4.2.9",
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
            "url": "https://github.com/codsen/codsen.git",
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
            "build": "node '../../ops/scripts/esbuild.js' && yarn run dts",
            "dev": "DEV=true node '../../ops/scripts/esbuild.js' && yarn run dts",
            "devtest": "c8 yarn run unit && yarn run examples && yarn run lint",
            "dts": "rollup -c && yarn run prettier 'types/index.d.ts' --write",
            "examples": "node '../../ops/scripts/run-examples.js'",
            "lect": "node '../../ops/lect/lect.js' && yarn run prettier 'README.md' '.all-contributorsrc' 'rollup.config.js' --write",
            "letspublish": "yarn publish || :",
            "lint": "eslint . --fix",
            "perf": "node perf/check.js",
            "prepare": "echo 'ready'",
            "prettier": "prettier",
            "prettier:format": "prettier --write '**/*.{ts,tsx,md}' --no-error-on-unmatched-pattern",
            "pretest": "yarn run lect && yarn run build",
            "test": "yarn run devtest",
            "unit": "uvu test"
        },
        "engines": {
            "node": "^12.20.0 || ^14.13.1 || >=16.0.0"
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
            "string-process-comma-separated": "^3.1.3"
        },
        "devDependencies": {
            "ranges-apply": "^6.2.9"
        }
    },
    "is-relative-uri": {
        "name": "is-relative-uri",
        "version": "4.2.9",
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
            "url": "https://github.com/codsen/codsen.git",
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
            "build": "node '../../ops/scripts/esbuild.js' && yarn run dts",
            "dev": "DEV=true node '../../ops/scripts/esbuild.js' && yarn run dts",
            "devtest": "c8 yarn run unit && yarn run examples && yarn run lint",
            "dts": "rollup -c && yarn run prettier 'types/index.d.ts' --write",
            "examples": "node '../../ops/scripts/run-examples.js'",
            "lect": "node '../../ops/lect/lect.js' && yarn run prettier 'README.md' '.all-contributorsrc' 'rollup.config.js' --write",
            "letspublish": "yarn publish || :",
            "lint": "eslint . --fix",
            "perf": "node perf/check.js",
            "prepare": "echo 'ready'",
            "prettier": "prettier",
            "prettier:format": "prettier --write '**/*.{ts,tsx,md}' --no-error-on-unmatched-pattern",
            "pretest": "yarn run lect && yarn run build",
            "test": "yarn run devtest",
            "unit": "uvu test"
        },
        "engines": {
            "node": "^12.20.0 || ^14.13.1 || >=16.0.0"
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
            "ranges-apply": "^6.2.9"
        }
    },
    "js-row-num": {
        "name": "js-row-num",
        "version": "5.2.9",
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
            "url": "https://github.com/codsen/codsen.git",
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
            "build": "node '../../ops/scripts/esbuild.js' && yarn run dts",
            "dev": "DEV=true node '../../ops/scripts/esbuild.js' && yarn run dts",
            "devtest": "c8 yarn run unit && yarn run examples && yarn run lint",
            "dts": "rollup -c && yarn run prettier 'types/index.d.ts' --write",
            "examples": "node '../../ops/scripts/run-examples.js'",
            "lect": "node '../../ops/lect/lect.js' && yarn run prettier 'README.md' '.all-contributorsrc' 'rollup.config.js' --write",
            "letspublish": "yarn publish || :",
            "lint": "eslint . --fix",
            "perf": "node perf/check.js",
            "prepare": "echo 'ready'",
            "prettier": "prettier",
            "prettier:format": "prettier --write '**/*.{ts,tsx,md}' --no-error-on-unmatched-pattern",
            "pretest": "yarn run lect && yarn run build",
            "test": "yarn run devtest",
            "unit": "uvu test"
        },
        "engines": {
            "node": "^12.20.0 || ^14.13.1 || >=16.0.0"
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
            "ranges-apply": "^6.2.9",
            "ranges-push": "^6.2.4"
        }
    },
    "js-row-num-cli": {
        "name": "js-row-num-cli",
        "version": "2.2.9",
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
            "url": "https://github.com/codsen/codsen.git",
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
            "build": "echo 'no build needed'",
            "dev": "echo 'no build needed'",
            "lect": "node '../../ops/lect/lect.js'",
            "letspublish": "yarn publish || :",
            "lint": "eslint . --fix",
            "prepare": "echo 'ready'",
            "prettier:format": "prettier --write '**/*.{js,md}' --no-error-on-unmatched-pattern",
            "test": "c8 yarn run unit && yarn run lint",
            "unit": "uvu test"
        },
        "engines": {
            "node": "^12.20.0 || ^14.13.1 || >=16.0.0"
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
            "arrayiffy-if-string": "^4.1.3",
            "globby": "^13.1.2",
            "is-d": "^1.0.0",
            "js-row-num": "^5.2.9",
            "meow": "^11.0.0",
            "p-reduce": "^3.0.0",
            "update-notifier": "^6.0.2",
            "write-file-atomic": "^5.0.0"
        }
    },
    "json-comb": {
        "name": "json-comb",
        "version": "0.7.10",
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
            "url": "https://github.com/codsen/codsen.git",
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
            "build": "echo 'no build needed'",
            "dev": "echo 'no build needed'",
            "lect": "node '../../ops/lect/lect.js'",
            "letspublish": "yarn publish || :",
            "lint": "eslint . --fix",
            "prepare": "echo 'ready'",
            "prettier:format": "prettier --write '**/*.{js,md}' --no-error-on-unmatched-pattern",
            "test": "c8 yarn run unit && yarn run lint",
            "unit": "uvu test"
        },
        "engines": {
            "node": "^12.20.0 || ^14.13.1 || >=16.0.0"
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
            "fs-extra": "^10.1.0",
            "globby": "^13.1.2",
            "is-d": "^1.0.0",
            "json-comb-core": "^7.1.7",
            "meow": "^11.0.0",
            "p-map": "^5.5.0",
            "p-reduce": "^3.0.0",
            "update-notifier": "^6.0.2"
        }
    },
    "json-comb-core": {
        "name": "json-comb-core",
        "version": "7.1.7",
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
            "url": "https://github.com/codsen/codsen.git",
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
            "build": "node '../../ops/scripts/esbuild.js' && yarn run dts",
            "dev": "DEV=true node '../../ops/scripts/esbuild.js' && yarn run dts",
            "devtest": "c8 yarn run unit && yarn run examples && yarn run lint",
            "dts": "rollup -c && yarn run prettier 'types/index.d.ts' --write",
            "examples": "node '../../ops/scripts/run-examples.js'",
            "lect": "node '../../ops/lect/lect.js' && yarn run prettier 'README.md' '.all-contributorsrc' 'rollup.config.js' --write",
            "letspublish": "yarn publish || :",
            "lint": "eslint . --fix",
            "perf": "node perf/check.js",
            "prepare": "echo 'ready'",
            "prettier": "prettier",
            "prettier:format": "prettier --write '**/*.{ts,tsx,md}' --no-error-on-unmatched-pattern",
            "pretest": "yarn run lect && yarn run build",
            "test": "yarn run devtest",
            "unit": "uvu test"
        },
        "engines": {
            "node": "^12.20.0 || ^14.13.1 || >=16.0.0"
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
            "lodash.clonedeep": "^4.5.0",
            "lodash.includes": "^4.3.0",
            "object-fill-missing-keys": "^10.0.2",
            "object-flatten-all-arrays": "^6.2.3",
            "object-merge-advanced": "^13.2.3",
            "object-no-new-keys": "^4.2.3",
            "object-set-all-values-to": "^5.1.3",
            "p-map": "^5.5.0",
            "p-one": "^2.0.0",
            "p-reduce": "^3.0.0",
            "semver-compare": "^1.0.0",
            "sort-keys": "^5.0.0",
            "type-detect": "^4.0.8"
        },
        "devDependencies": {
            "@types/lodash.clonedeep": "^4.5.7",
            "@types/lodash.includes": "^4.3.7",
            "@types/semver-compare": "^1.0.1"
        }
    },
    "json-sort-cli": {
        "name": "json-sort-cli",
        "version": "2.1.7",
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
            "url": "https://github.com/codsen/codsen.git",
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
            "build": "echo 'no build needed'",
            "dev": "echo 'no build needed'",
            "lect": "node '../../ops/lect/lect.js'",
            "letspublish": "yarn publish || :",
            "lint": "eslint . --fix",
            "prepare": "echo 'ready'",
            "prettier:format": "prettier --write '**/*.{js,md}' --no-error-on-unmatched-pattern",
            "test": "c8 yarn run unit && yarn run lint",
            "unit": "uvu test"
        },
        "engines": {
            "node": "^12.20.0 || ^14.13.1 || >=16.0.0"
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
            "ast-monkey-traverse": "^3.1.3",
            "chalk": "^5.1.2",
            "fs-extra": "^10.1.0",
            "globby": "^13.1.2",
            "is-d": "^1.0.0",
            "lodash.isplainobject": "^4.0.6",
            "meow": "^11.0.0",
            "p-filter": "^3.0.0",
            "p-reduce": "^3.0.0",
            "sort-package-json": "^2.0.0",
            "update-notifier": "^6.0.2"
        },
        "devDependencies": {
            "@types/lodash.isplainobject": "^4.0.7",
            "p-map": "^5.5.0"
        }
    },
    "json-variables": {
        "name": "json-variables",
        "version": "11.1.9",
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
            "url": "https://github.com/codsen/codsen.git",
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
            "build": "node '../../ops/scripts/esbuild.js' && yarn run dts",
            "dev": "DEV=true node '../../ops/scripts/esbuild.js' && yarn run dts",
            "devtest": "c8 yarn run unit && yarn run examples && yarn run lint",
            "dts": "rollup -c && yarn run prettier 'types/index.d.ts' --write",
            "examples": "node '../../ops/scripts/run-examples.js'",
            "lect": "node '../../ops/lect/lect.js' && yarn run prettier 'README.md' '.all-contributorsrc' 'rollup.config.js' --write",
            "letspublish": "yarn publish || :",
            "lint": "eslint . --fix",
            "perf": "node perf/check.js",
            "prepare": "echo 'ready'",
            "prettier": "prettier",
            "prettier:format": "prettier --write '**/*.{ts,tsx,md}' --no-error-on-unmatched-pattern",
            "pretest": "yarn run lect && yarn run build",
            "test": "yarn run devtest",
            "unit": "uvu test"
        },
        "engines": {
            "node": "^12.20.0 || ^14.13.1 || >=16.0.0"
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
            "arrayiffy-if-string": "^4.1.3",
            "ast-get-values-by-key": "^4.1.3",
            "ast-monkey-traverse": "^3.1.3",
            "matcher": "^5.0.0",
            "object-path": "^0.11.8",
            "ranges-apply": "^6.2.9",
            "ranges-push": "^6.2.4",
            "string-find-heads-tails": "^5.1.4",
            "string-match-left-right": "^8.2.4",
            "string-remove-duplicate-heads-tails": "^6.1.9"
        }
    },
    "lerna-clean-changelogs": {
        "name": "lerna-clean-changelogs",
        "version": "4.2.4",
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
            "url": "https://github.com/codsen/codsen.git",
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
            "build": "node '../../ops/scripts/esbuild.js' && yarn run dts",
            "dev": "DEV=true node '../../ops/scripts/esbuild.js' && yarn run dts",
            "devtest": "c8 yarn run unit && yarn run examples && yarn run lint",
            "dts": "rollup -c && yarn run prettier 'types/index.d.ts' --write",
            "examples": "node '../../ops/scripts/run-examples.js'",
            "lect": "node '../../ops/lect/lect.js' && yarn run prettier 'README.md' '.all-contributorsrc' 'rollup.config.js' --write",
            "letspublish": "yarn publish || :",
            "lint": "eslint . --fix",
            "perf": "node perf/check.js",
            "prepare": "echo 'ready'",
            "prettier": "prettier",
            "prettier:format": "prettier --write '**/*.{ts,tsx,md}' --no-error-on-unmatched-pattern",
            "pretest": "yarn run lect && yarn run build",
            "test": "yarn run devtest",
            "unit": "uvu test"
        },
        "engines": {
            "node": "^12.20.0 || ^14.13.1 || >=16.0.0"
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
    "lerna-clean-changelogs-cli": {
        "name": "lerna-clean-changelogs-cli",
        "version": "2.1.9",
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
            "url": "https://github.com/codsen/codsen.git",
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
            "build": "echo 'no build needed'",
            "dev": "echo 'no build needed'",
            "lect": "node '../../ops/lect/lect.js'",
            "letspublish": "yarn publish || :",
            "lint": "eslint . --fix",
            "prepare": "echo 'ready'",
            "prettier:format": "prettier --write '**/*.{js,md}' --no-error-on-unmatched-pattern",
            "test": "c8 yarn run unit && yarn run lint",
            "unit": "uvu test"
        },
        "engines": {
            "node": "^12.20.0 || ^14.13.1 || >=16.0.0"
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
            "chalk": "^5.1.2",
            "fs-extra": "^10.1.0",
            "globby": "^13.1.2",
            "lerna-clean-changelogs": "^4.2.4",
            "meow": "^11.0.0",
            "p-filter": "^3.0.0",
            "p-reduce": "^3.0.0",
            "update-notifier": "^6.0.2",
            "write-file-atomic": "^5.0.0"
        },
        "devDependencies": {
            "p-map": "^5.5.0"
        }
    },
    "lerna-link-dep": {
        "name": "lerna-link-dep",
        "version": "2.1.8",
        "description": "Like lerna add but does just the symlinking, works on CLI bins too",
        "keywords": [
            "add",
            "cli",
            "command-line",
            "dependencies",
            "deps",
            "devdependencies",
            "devdeps",
            "lerna",
            "link",
            "ln",
            "ln -s",
            "monorepo",
            "symlink",
            "tool",
            "utility"
        ],
        "homepage": "https://codsen.com/os/lerna-link-dep",
        "repository": {
            "type": "git",
            "url": "https://github.com/codsen/codsen.git",
            "directory": "packages/lerna-link-dep"
        },
        "license": "MIT",
        "author": {
            "name": "Roy Revelt",
            "email": "roy@codsen.com",
            "url": "https://codsen.com"
        },
        "type": "module",
        "bin": {
            "deplink": "cli.js",
            "johnnydepp": "cli.js",
            "linkdep": "cli.js"
        },
        "scripts": {
            "build": "echo 'no build needed'",
            "dev": "echo 'no build needed'",
            "lect": "node '../../ops/lect/lect.js'",
            "letspublish": "yarn publish || :",
            "lint": "eslint . --fix",
            "prepare": "echo 'ready'",
            "prettier:format": "prettier --write '**/*.{js,md}' --no-error-on-unmatched-pattern",
            "test": "c8 yarn run unit && yarn run lint",
            "unit": "uvu test"
        },
        "engines": {
            "node": "^12.20.0 || ^14.13.1 || >=16.0.0"
        },
        "c8": {
            "check-coverage": false,
            "exclude": [
                "**/test/**/*.*"
            ]
        },
        "lect": {
            "cliSpecialKeyword": "johnnydepp",
            "cliSpecialKeywordInstructions": "remember the actor, DEPP as in _Johnny Dependency_ - just type his full name and surname.",
            "licence": {
                "extras": [
                    ""
                ]
            }
        },
        "dependencies": {
            "execa": "^6.1.0",
            "fs-extra": "^10.1.0",
            "meow": "^11.0.0",
            "update-notifier": "^6.0.2"
        }
    },
    "line-column-mini": {
        "name": "line-column-mini",
        "version": "2.1.3",
        "description": "Convert string index to line-column position",
        "keywords": [
            "string",
            "index",
            "line",
            "column",
            "linecol",
            "position"
        ],
        "homepage": "https://codsen.com/os/line-column-mini",
        "repository": {
            "type": "git",
            "url": "https://github.com/codsen/codsen.git",
            "directory": "packages/line-column-mini"
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
            "script": "./dist/line-column-mini.umd.js",
            "default": "./dist/line-column-mini.esm.js"
        },
        "types": "types/index.d.ts",
        "scripts": {
            "build": "node '../../ops/scripts/esbuild.js' && yarn run dts",
            "dev": "DEV=true node '../../ops/scripts/esbuild.js' && yarn run dts",
            "devtest": "c8 yarn run unit && yarn run examples && yarn run lint",
            "dts": "rollup -c && yarn run prettier 'types/index.d.ts' --write",
            "examples": "node '../../ops/scripts/run-examples.js'",
            "lect": "node '../../ops/lect/lect.js' && yarn run prettier 'README.md' '.all-contributorsrc' 'rollup.config.js' --write",
            "letspublish": "yarn publish || :",
            "lint": "eslint . --fix",
            "perf": "node perf/check.js",
            "prepare": "echo 'ready'",
            "prettier": "prettier",
            "prettier:format": "prettier --write '**/*.{ts,tsx,md}' --no-error-on-unmatched-pattern",
            "pretest": "yarn run lect && yarn run build",
            "test": "yarn run devtest",
            "unit": "uvu test"
        },
        "engines": {
            "node": "^12.20.0 || ^14.13.1 || >=16.0.0"
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
    "object-all-values-equal-to": {
        "name": "object-all-values-equal-to",
        "version": "3.2.3",
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
            "url": "https://github.com/codsen/codsen.git",
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
            "build": "node '../../ops/scripts/esbuild.js' && yarn run dts",
            "dev": "DEV=true node '../../ops/scripts/esbuild.js' && yarn run dts",
            "devtest": "c8 yarn run unit && yarn run examples && yarn run lint",
            "dts": "rollup -c && yarn run prettier 'types/index.d.ts' --write",
            "examples": "node '../../ops/scripts/run-examples.js'",
            "lect": "node '../../ops/lect/lect.js' && yarn run prettier 'README.md' '.all-contributorsrc' 'rollup.config.js' --write",
            "letspublish": "yarn publish || :",
            "lint": "eslint . --fix",
            "perf": "node perf/check.js",
            "prepare": "echo 'ready'",
            "prettier": "prettier",
            "prettier:format": "prettier --write '**/*.{ts,tsx,md}' --no-error-on-unmatched-pattern",
            "pretest": "yarn run lect && yarn run build",
            "test": "yarn run devtest",
            "unit": "uvu test"
        },
        "engines": {
            "node": "^12.20.0 || ^14.13.1 || >=16.0.0"
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
            "lodash.isequal": "^4.5.0",
            "lodash.isplainobject": "^4.0.6"
        },
        "devDependencies": {
            "@types/lodash.isequal": "^4.5.6",
            "@types/lodash.isplainobject": "^4.0.7"
        }
    },
    "object-boolean-combinations": {
        "name": "object-boolean-combinations",
        "version": "5.1.3",
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
            "url": "https://github.com/codsen/codsen.git",
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
            "build": "node '../../ops/scripts/esbuild.js' && yarn run dts",
            "dev": "DEV=true node '../../ops/scripts/esbuild.js' && yarn run dts",
            "devtest": "c8 yarn run unit && yarn run examples && yarn run lint",
            "dts": "rollup -c && yarn run prettier 'types/index.d.ts' --write",
            "examples": "node '../../ops/scripts/run-examples.js'",
            "lect": "node '../../ops/lect/lect.js' && yarn run prettier 'README.md' '.all-contributorsrc' 'rollup.config.js' --write",
            "letspublish": "yarn publish || :",
            "lint": "eslint . --fix",
            "perf": "node perf/check.js",
            "prepare": "echo 'ready'",
            "prettier": "prettier",
            "prettier:format": "prettier --write '**/*.{ts,tsx,md}' --no-error-on-unmatched-pattern",
            "pretest": "yarn run lect && yarn run build",
            "test": "yarn run devtest",
            "unit": "uvu test"
        },
        "engines": {
            "node": "^12.20.0 || ^14.13.1 || >=16.0.0"
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
            "lodash.clonedeep": "^4.5.0",
            "lodash.intersection": "^4.4.0",
            "lodash.isplainobject": "^4.0.6",
            "lodash.pull": "^4.1.0"
        },
        "devDependencies": {
            "@types/lodash.clonedeep": "^4.5.7",
            "@types/lodash.intersection": "^4.4.7",
            "@types/lodash.isplainobject": "^4.0.7",
            "@types/lodash.pull": "^4.1.7"
        }
    },
    "object-delete-key": {
        "name": "object-delete-key",
        "version": "3.2.13",
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
            "url": "https://github.com/codsen/codsen.git",
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
            "build": "node '../../ops/scripts/esbuild.js' && yarn run dts",
            "dev": "DEV=true node '../../ops/scripts/esbuild.js' && yarn run dts",
            "devtest": "c8 yarn run unit && yarn run examples && yarn run lint",
            "dts": "rollup -c && yarn run prettier 'types/index.d.ts' --write",
            "examples": "node '../../ops/scripts/run-examples.js'",
            "lect": "node '../../ops/lect/lect.js' && yarn run prettier 'README.md' '.all-contributorsrc' 'rollup.config.js' --write",
            "letspublish": "yarn publish || :",
            "lint": "eslint . --fix",
            "perf": "node perf/check.js",
            "prepare": "echo 'ready'",
            "prettier": "prettier",
            "prettier:format": "prettier --write '**/*.{ts,tsx,md}' --no-error-on-unmatched-pattern",
            "pretest": "yarn run lect && yarn run build",
            "test": "yarn run devtest",
            "unit": "uvu test"
        },
        "engines": {
            "node": "^12.20.0 || ^14.13.1 || >=16.0.0"
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
            "ast-is-empty": "^3.1.3",
            "ast-monkey": "^8.1.13",
            "lodash.clonedeep": "^4.5.0",
            "util-array-object-or-both": "^4.2.3"
        },
        "devDependencies": {
            "@types/lodash.clonedeep": "^4.5.7"
        }
    },
    "object-fill-missing-keys": {
        "name": "object-fill-missing-keys",
        "version": "10.0.2",
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
            "url": "https://github.com/codsen/codsen.git",
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
            "build": "node '../../ops/scripts/esbuild.js' && yarn run dts",
            "dev": "DEV=true node '../../ops/scripts/esbuild.js' && yarn run dts",
            "devtest": "c8 yarn run unit && yarn run examples && yarn run lint",
            "dts": "rollup -c && yarn run prettier 'types/index.d.ts' --write",
            "examples": "node '../../ops/scripts/run-examples.js'",
            "lect": "node '../../ops/lect/lect.js' && yarn run prettier 'README.md' '.all-contributorsrc' 'rollup.config.js' --write",
            "letspublish": "yarn publish || :",
            "lint": "eslint . --fix",
            "perf": "node perf/check.js",
            "prepare": "echo 'ready'",
            "prettier": "prettier",
            "prettier:format": "prettier --write '**/*.{ts,tsx,md}' --no-error-on-unmatched-pattern",
            "pretest": "yarn run lect && yarn run build",
            "test": "yarn run devtest",
            "unit": "uvu test"
        },
        "engines": {
            "node": "^12.20.0 || ^14.13.1 || >=16.0.0"
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
            "arrayiffy-if-string": "^4.1.3",
            "lodash.clonedeep": "^4.5.0",
            "lodash.isplainobject": "^4.0.6",
            "object-all-values-equal-to": "^3.2.3",
            "object-merge-advanced": "^13.2.3"
        },
        "devDependencies": {
            "@types/lodash.clonedeep": "^4.5.7",
            "@types/lodash.isplainobject": "^4.0.7"
        }
    },
    "object-flatten-all-arrays": {
        "name": "object-flatten-all-arrays",
        "version": "6.2.3",
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
            "url": "https://github.com/codsen/codsen.git",
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
            "build": "node '../../ops/scripts/esbuild.js' && yarn run dts",
            "dev": "DEV=true node '../../ops/scripts/esbuild.js' && yarn run dts",
            "devtest": "c8 yarn run unit && yarn run examples && yarn run lint",
            "dts": "rollup -c && yarn run prettier 'types/index.d.ts' --write",
            "examples": "node '../../ops/scripts/run-examples.js'",
            "lect": "node '../../ops/lect/lect.js' && yarn run prettier 'README.md' '.all-contributorsrc' 'rollup.config.js' --write",
            "letspublish": "yarn publish || :",
            "lint": "eslint . --fix",
            "perf": "node perf/check.js",
            "prepare": "echo 'ready'",
            "prettier": "prettier",
            "prettier:format": "prettier --write '**/*.{ts,tsx,md}' --no-error-on-unmatched-pattern",
            "pretest": "yarn run lect && yarn run build",
            "test": "yarn run devtest",
            "unit": "uvu test"
        },
        "engines": {
            "node": "^12.20.0 || ^14.13.1 || >=16.0.0"
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
            "lodash.clonedeep": "^4.5.0",
            "lodash.isplainobject": "^4.0.6",
            "lodash.merge": "^4.6.2"
        },
        "devDependencies": {
            "@types/lodash.clonedeep": "^4.5.7",
            "@types/lodash.isplainobject": "^4.0.7",
            "@types/lodash.merge": "^4.6.7"
        }
    },
    "object-flatten-referencing": {
        "name": "object-flatten-referencing",
        "version": "6.2.3",
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
            "url": "https://github.com/codsen/codsen.git",
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
            "build": "node '../../ops/scripts/esbuild.js' && yarn run dts",
            "dev": "DEV=true node '../../ops/scripts/esbuild.js' && yarn run dts",
            "devtest": "c8 yarn run unit && yarn run examples && yarn run lint",
            "dts": "rollup -c && yarn run prettier 'types/index.d.ts' --write",
            "examples": "node '../../ops/scripts/run-examples.js'",
            "lect": "node '../../ops/lect/lect.js' && yarn run prettier 'README.md' '.all-contributorsrc' 'rollup.config.js' --write",
            "letspublish": "yarn publish || :",
            "lint": "eslint . --fix",
            "perf": "node perf/check.js",
            "prepare": "echo 'ready'",
            "prettier": "prettier",
            "prettier:format": "prettier --write '**/*.{ts,tsx,md}' --no-error-on-unmatched-pattern",
            "pretest": "yarn run lect && yarn run build",
            "test": "yarn run devtest",
            "unit": "uvu test"
        },
        "engines": {
            "node": "^12.20.0 || ^14.13.1 || >=16.0.0"
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
            "lodash.clonedeep": "^4.5.0",
            "lodash.isplainobject": "^4.0.6",
            "matcher": "^5.0.0",
            "str-indexes-of-plus": "^4.1.3"
        },
        "devDependencies": {
            "@types/lodash.clonedeep": "^4.5.7",
            "@types/lodash.isplainobject": "^4.0.7"
        }
    },
    "object-merge-advanced": {
        "name": "object-merge-advanced",
        "version": "13.2.3",
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
            "url": "https://github.com/codsen/codsen.git",
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
            "build": "node '../../ops/scripts/esbuild.js' && yarn run dts",
            "dev": "DEV=true node '../../ops/scripts/esbuild.js' && yarn run dts",
            "devtest": "c8 yarn run unit && yarn run examples && yarn run lint",
            "dts": "rollup -c && yarn run prettier 'types/index.d.ts' --write",
            "examples": "node '../../ops/scripts/run-examples.js'",
            "lect": "node '../../ops/lect/lect.js' && yarn run prettier 'README.md' '.all-contributorsrc' 'rollup.config.js' --write",
            "letspublish": "yarn publish || :",
            "lint": "eslint . --fix",
            "perf": "node perf/check.js",
            "prepare": "echo 'ready'",
            "prettier": "prettier",
            "prettier:format": "prettier --write '**/*.{ts,tsx,md}' --no-error-on-unmatched-pattern",
            "pretest": "yarn run lect && yarn run build",
            "test": "yarn run devtest",
            "unit": "uvu test"
        },
        "engines": {
            "node": "^12.20.0 || ^14.13.1 || >=16.0.0"
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
            "lodash.clonedeep": "^4.5.0",
            "lodash.includes": "^4.3.0",
            "lodash.isdate": "^4.0.1",
            "lodash.isfinite": "^3.3.2",
            "lodash.isplainobject": "^4.0.6",
            "lodash.uniq": "^4.5.0",
            "matcher": "^5.0.0",
            "util-nonempty": "^4.1.3"
        },
        "devDependencies": {
            "@types/lodash.clonedeep": "^4.5.7",
            "@types/lodash.includes": "^4.3.7",
            "@types/lodash.isdate": "^4.0.7",
            "@types/lodash.isfinite": "^3.3.7",
            "@types/lodash.isplainobject": "^4.0.7",
            "@types/lodash.uniq": "^4.5.7",
            "deep-equal": "^2.0.5"
        }
    },
    "object-no-new-keys": {
        "name": "object-no-new-keys",
        "version": "4.2.3",
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
            "url": "https://github.com/codsen/codsen.git",
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
            "build": "node '../../ops/scripts/esbuild.js' && yarn run dts",
            "dev": "DEV=true node '../../ops/scripts/esbuild.js' && yarn run dts",
            "devtest": "c8 yarn run unit && yarn run examples && yarn run lint",
            "dts": "rollup -c && yarn run prettier 'types/index.d.ts' --write",
            "examples": "node '../../ops/scripts/run-examples.js'",
            "lect": "node '../../ops/lect/lect.js' && yarn run prettier 'README.md' '.all-contributorsrc' 'rollup.config.js' --write",
            "letspublish": "yarn publish || :",
            "lint": "eslint . --fix",
            "perf": "node perf/check.js",
            "prepare": "echo 'ready'",
            "prettier": "prettier",
            "prettier:format": "prettier --write '**/*.{ts,tsx,md}' --no-error-on-unmatched-pattern",
            "pretest": "yarn run lect && yarn run build",
            "test": "yarn run devtest",
            "unit": "uvu test"
        },
        "engines": {
            "node": "^12.20.0 || ^14.13.1 || >=16.0.0"
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
    "object-set-all-values-to": {
        "name": "object-set-all-values-to",
        "version": "5.1.3",
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
            "url": "https://github.com/codsen/codsen.git",
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
            "build": "node '../../ops/scripts/esbuild.js' && yarn run dts",
            "dev": "DEV=true node '../../ops/scripts/esbuild.js' && yarn run dts",
            "devtest": "c8 yarn run unit && yarn run examples && yarn run lint",
            "dts": "rollup -c && yarn run prettier 'types/index.d.ts' --write",
            "examples": "node '../../ops/scripts/run-examples.js'",
            "lect": "node '../../ops/lect/lect.js' && yarn run prettier 'README.md' '.all-contributorsrc' 'rollup.config.js' --write",
            "letspublish": "yarn publish || :",
            "lint": "eslint . --fix",
            "perf": "node perf/check.js",
            "prepare": "echo 'ready'",
            "prettier": "prettier",
            "prettier:format": "prettier --write '**/*.{ts,tsx,md}' --no-error-on-unmatched-pattern",
            "pretest": "yarn run lect && yarn run build",
            "test": "yarn run devtest",
            "unit": "uvu test"
        },
        "engines": {
            "node": "^12.20.0 || ^14.13.1 || >=16.0.0"
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
            "lodash.clonedeep": "^4.5.0",
            "lodash.isplainobject": "^4.0.6"
        },
        "devDependencies": {
            "@types/lodash.clonedeep": "^4.5.7",
            "@types/lodash.isplainobject": "^4.0.7"
        }
    },
    "ranges-apply": {
        "name": "ranges-apply",
        "version": "6.2.9",
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
            "url": "https://github.com/codsen/codsen.git",
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
            "build": "node '../../ops/scripts/esbuild.js' && yarn run dts",
            "dev": "DEV=true node '../../ops/scripts/esbuild.js' && yarn run dts",
            "devtest": "c8 yarn run unit && yarn run examples && yarn run lint",
            "dts": "rollup -c && yarn run prettier 'types/index.d.ts' --write",
            "examples": "node '../../ops/scripts/run-examples.js'",
            "lect": "node '../../ops/lect/lect.js' && yarn run prettier 'README.md' '.all-contributorsrc' 'rollup.config.js' --write",
            "letspublish": "yarn publish || :",
            "lint": "eslint . --fix",
            "perf": "node perf/check.js",
            "prepare": "echo 'ready'",
            "prettier": "prettier",
            "prettier:format": "prettier --write '**/*.{ts,tsx,md}' --no-error-on-unmatched-pattern",
            "pretest": "yarn run lect && yarn run build",
            "test": "yarn run devtest",
            "unit": "uvu test"
        },
        "engines": {
            "node": "^12.20.0 || ^14.13.1 || >=16.0.0"
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
            "ranges-merge": "^8.2.4",
            "tiny-invariant": "^1.3.1"
        }
    },
    "ranges-crop": {
        "name": "ranges-crop",
        "version": "5.2.9",
        "description": "Crop array of ranges when they go beyond the reference string's length",
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
            "url": "https://github.com/codsen/codsen.git",
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
            "build": "node '../../ops/scripts/esbuild.js' && yarn run dts",
            "dev": "DEV=true node '../../ops/scripts/esbuild.js' && yarn run dts",
            "devtest": "c8 yarn run unit && yarn run examples && yarn run lint",
            "dts": "rollup -c && yarn run prettier 'types/index.d.ts' --write",
            "examples": "node '../../ops/scripts/run-examples.js'",
            "lect": "node '../../ops/lect/lect.js' && yarn run prettier 'README.md' '.all-contributorsrc' 'rollup.config.js' --write",
            "letspublish": "yarn publish || :",
            "lint": "eslint . --fix",
            "perf": "node perf/check.js",
            "prepare": "echo 'ready'",
            "prettier": "prettier",
            "prettier:format": "prettier --write '**/*.{ts,tsx,md}' --no-error-on-unmatched-pattern",
            "pretest": "yarn run lect && yarn run build",
            "test": "yarn run devtest",
            "unit": "uvu test"
        },
        "engines": {
            "node": "^12.20.0 || ^14.13.1 || >=16.0.0"
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
            "ranges-merge": "^8.2.4"
        },
        "devDependencies": {
            "lodash.clonedeep": "^4.5.0",
            "ranges-apply": "^6.2.9"
        }
    },
    "ranges-ent-decode": {
        "name": "ranges-ent-decode",
        "version": "5.2.4",
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
            "url": "https://github.com/codsen/codsen.git",
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
            "build": "node '../../ops/scripts/esbuild.js' && yarn run dts",
            "dev": "DEV=true node '../../ops/scripts/esbuild.js' && yarn run dts",
            "devtest": "c8 yarn run unit && yarn run examples && yarn run lint",
            "dts": "rollup -c && yarn run prettier 'types/index.d.ts' --write",
            "examples": "node '../../ops/scripts/run-examples.js'",
            "lect": "node '../../ops/lect/lect.js' && yarn run prettier 'README.md' '.all-contributorsrc' 'rollup.config.js' --write",
            "letspublish": "yarn publish || :",
            "lint": "eslint . --fix",
            "perf": "node perf/check.js",
            "prepare": "echo 'ready'",
            "prettier": "prettier",
            "prettier:format": "prettier --write '**/*.{ts,tsx,md}' --no-error-on-unmatched-pattern",
            "pretest": "yarn run lect && yarn run build",
            "test": "yarn run devtest",
            "unit": "uvu test"
        },
        "engines": {
            "node": "^12.20.0 || ^14.13.1 || >=16.0.0"
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
            "he": "^1.2.0",
            "lodash.isplainobject": "^4.0.6",
            "ranges-merge": "^8.2.4"
        },
        "devDependencies": {
            "@types/he": "^1.1.2",
            "@types/lodash.isplainobject": "^4.0.7"
        }
    },
    "ranges-invert": {
        "name": "ranges-invert",
        "version": "5.2.9",
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
            "url": "https://github.com/codsen/codsen.git",
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
            "build": "node '../../ops/scripts/esbuild.js' && yarn run dts",
            "dev": "DEV=true node '../../ops/scripts/esbuild.js' && yarn run dts",
            "devtest": "c8 yarn run unit && yarn run examples && yarn run lint",
            "dts": "rollup -c && yarn run prettier 'types/index.d.ts' --write",
            "examples": "node '../../ops/scripts/run-examples.js'",
            "lect": "node '../../ops/lect/lect.js' && yarn run prettier 'README.md' '.all-contributorsrc' 'rollup.config.js' --write",
            "letspublish": "yarn publish || :",
            "lint": "eslint . --fix",
            "perf": "node perf/check.js",
            "prepare": "echo 'ready'",
            "prettier": "prettier",
            "prettier:format": "prettier --write '**/*.{ts,tsx,md}' --no-error-on-unmatched-pattern",
            "pretest": "yarn run lect && yarn run build",
            "test": "yarn run devtest",
            "unit": "uvu test"
        },
        "engines": {
            "node": "^12.20.0 || ^14.13.1 || >=16.0.0"
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
            "ranges-crop": "^5.2.9",
            "ranges-merge": "^8.2.4"
        }
    },
    "ranges-is-index-within": {
        "name": "ranges-is-index-within",
        "version": "3.2.3",
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
            "url": "https://github.com/codsen/codsen.git",
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
            "build": "node '../../ops/scripts/esbuild.js' && yarn run dts",
            "dev": "DEV=true node '../../ops/scripts/esbuild.js' && yarn run dts",
            "devtest": "c8 yarn run unit && yarn run examples && yarn run lint",
            "dts": "rollup -c && yarn run prettier 'types/index.d.ts' --write",
            "examples": "node '../../ops/scripts/run-examples.js'",
            "lect": "node '../../ops/lect/lect.js' && yarn run prettier 'README.md' '.all-contributorsrc' 'rollup.config.js' --write",
            "letspublish": "yarn publish || :",
            "lint": "eslint . --fix",
            "perf": "node perf/check.js",
            "prepare": "echo 'ready'",
            "prettier": "prettier",
            "prettier:format": "prettier --write '**/*.{ts,tsx,md}' --no-error-on-unmatched-pattern",
            "pretest": "yarn run lect && yarn run build",
            "test": "yarn run devtest",
            "unit": "uvu test"
        },
        "engines": {
            "node": "^12.20.0 || ^14.13.1 || >=16.0.0"
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
        "version": "3.2.9",
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
            "url": "https://github.com/codsen/codsen.git",
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
            "build": "node '../../ops/scripts/esbuild.js' && yarn run dts",
            "dev": "DEV=true node '../../ops/scripts/esbuild.js' && yarn run dts",
            "devtest": "c8 yarn run unit && yarn run examples && yarn run lint",
            "dts": "rollup -c && yarn run prettier 'types/index.d.ts' --write",
            "examples": "node '../../ops/scripts/run-examples.js'",
            "lect": "node '../../ops/lect/lect.js' && yarn run prettier 'README.md' '.all-contributorsrc' 'rollup.config.js' --write",
            "letspublish": "yarn publish || :",
            "lint": "eslint . --fix",
            "perf": "node perf/check.js",
            "prepare": "echo 'ready'",
            "prettier": "prettier",
            "prettier:format": "prettier --write '**/*.{ts,tsx,md}' --no-error-on-unmatched-pattern",
            "pretest": "yarn run lect && yarn run build",
            "test": "yarn run devtest",
            "unit": "uvu test"
        },
        "engines": {
            "node": "^12.20.0 || ^14.13.1 || >=16.0.0"
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
            "ranges-apply": "^6.2.9",
            "ranges-merge": "^8.2.4"
        }
    },
    "ranges-merge": {
        "name": "ranges-merge",
        "version": "8.2.4",
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
            "url": "https://github.com/codsen/codsen.git",
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
            "build": "node '../../ops/scripts/esbuild.js' && yarn run dts",
            "dev": "DEV=true node '../../ops/scripts/esbuild.js' && yarn run dts",
            "devtest": "c8 yarn run unit && yarn run examples && yarn run lint",
            "dts": "rollup -c && yarn run prettier 'types/index.d.ts' --write",
            "examples": "node '../../ops/scripts/run-examples.js'",
            "lect": "node '../../ops/lect/lect.js' && yarn run prettier 'README.md' '.all-contributorsrc' 'rollup.config.js' --write",
            "letspublish": "yarn publish || :",
            "lint": "eslint . --fix",
            "perf": "node perf/check.js",
            "prepare": "echo 'ready'",
            "prettier": "prettier",
            "prettier:format": "prettier --write '**/*.{ts,tsx,md}' --no-error-on-unmatched-pattern",
            "pretest": "yarn run lect && yarn run build",
            "test": "yarn run devtest",
            "unit": "uvu test"
        },
        "engines": {
            "node": "^12.20.0 || ^14.13.1 || >=16.0.0"
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
            "ranges-push": "^6.2.4",
            "ranges-sort": "^5.1.3"
        },
        "devDependencies": {
            "lodash.clonedeep": "^4.5.0"
        }
    },
    "ranges-offset": {
        "name": "ranges-offset",
        "version": "3.1.3",
        "description": "Increment or decrement each index in every range",
        "keywords": [
            "array",
            "indexes",
            "offset",
            "range",
            "ranges",
            "string"
        ],
        "homepage": "https://codsen.com/os/ranges-offset",
        "repository": {
            "type": "git",
            "url": "https://github.com/codsen/codsen.git",
            "directory": "packages/ranges-offset"
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
            "script": "./dist/ranges-offset.umd.js",
            "default": "./dist/ranges-offset.esm.js"
        },
        "types": "types/index.d.ts",
        "scripts": {
            "build": "node '../../ops/scripts/esbuild.js' && yarn run dts",
            "dev": "DEV=true node '../../ops/scripts/esbuild.js' && yarn run dts",
            "devtest": "c8 yarn run unit && yarn run examples && yarn run lint",
            "dts": "rollup -c && yarn run prettier 'types/index.d.ts' --write",
            "examples": "node '../../ops/scripts/run-examples.js'",
            "lect": "node '../../ops/lect/lect.js' && yarn run prettier 'README.md' '.all-contributorsrc' 'rollup.config.js' --write",
            "letspublish": "yarn publish || :",
            "lint": "eslint . --fix",
            "perf": "node perf/check.js",
            "prepare": "echo 'ready'",
            "prettier": "prettier",
            "prettier:format": "prettier --write '**/*.{ts,tsx,md}' --no-error-on-unmatched-pattern",
            "pretest": "yarn run lect && yarn run build",
            "test": "yarn run devtest",
            "unit": "uvu test"
        },
        "engines": {
            "node": "^12.20.0 || ^14.13.1 || >=16.0.0"
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
    "ranges-process-outside": {
        "name": "ranges-process-outside",
        "version": "5.1.9",
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
            "url": "https://github.com/codsen/codsen.git",
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
            "build": "node '../../ops/scripts/esbuild.js' && yarn run dts",
            "dev": "DEV=true node '../../ops/scripts/esbuild.js' && yarn run dts",
            "devtest": "c8 yarn run unit && yarn run examples && yarn run lint",
            "dts": "rollup -c && yarn run prettier 'types/index.d.ts' --write",
            "examples": "node '../../ops/scripts/run-examples.js'",
            "lect": "node '../../ops/lect/lect.js' && yarn run prettier 'README.md' '.all-contributorsrc' 'rollup.config.js' --write",
            "letspublish": "yarn publish || :",
            "lint": "eslint . --fix",
            "perf": "node perf/check.js",
            "prepare": "echo 'ready'",
            "prettier": "prettier",
            "prettier:format": "prettier --write '**/*.{ts,tsx,md}' --no-error-on-unmatched-pattern",
            "pretest": "yarn run lect && yarn run build",
            "test": "yarn run devtest",
            "unit": "uvu test"
        },
        "engines": {
            "node": "^12.20.0 || ^14.13.1 || >=16.0.0"
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
            "ranges-crop": "^5.2.9",
            "ranges-invert": "^5.2.9",
            "runes": "^0.4.3"
        },
        "devDependencies": {
            "@types/runes": "^0.4.1"
        }
    },
    "ranges-push": {
        "name": "ranges-push",
        "version": "6.2.4",
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
            "url": "https://github.com/codsen/codsen.git",
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
            "build": "node '../../ops/scripts/esbuild.js' && yarn run dts",
            "dev": "DEV=true node '../../ops/scripts/esbuild.js' && yarn run dts",
            "devtest": "c8 yarn run unit && yarn run examples && yarn run lint",
            "dts": "rollup -c && yarn run prettier 'types/index.d.ts' --write",
            "examples": "node '../../ops/scripts/run-examples.js'",
            "lect": "node '../../ops/lect/lect.js' && yarn run prettier 'README.md' '.all-contributorsrc' 'rollup.config.js' --write",
            "letspublish": "yarn publish || :",
            "lint": "eslint . --fix",
            "perf": "node perf/check.js",
            "prepare": "echo 'ready'",
            "prettier": "prettier",
            "prettier:format": "prettier --write '**/*.{ts,tsx,md}' --no-error-on-unmatched-pattern",
            "pretest": "yarn run lect && yarn run build",
            "test": "yarn run devtest",
            "unit": "uvu test"
        },
        "engines": {
            "node": "^12.20.0 || ^14.13.1 || >=16.0.0"
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
            "string-collapse-leading-whitespace": "^6.1.4",
            "string-trim-spaces-only": "^4.1.3"
        }
    },
    "ranges-regex": {
        "name": "ranges-regex",
        "version": "5.2.9",
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
            "url": "https://github.com/codsen/codsen.git",
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
            "build": "node '../../ops/scripts/esbuild.js' && yarn run dts",
            "dev": "DEV=true node '../../ops/scripts/esbuild.js' && yarn run dts",
            "devtest": "c8 yarn run unit && yarn run examples && yarn run lint",
            "dts": "rollup -c && yarn run prettier 'types/index.d.ts' --write",
            "examples": "node '../../ops/scripts/run-examples.js'",
            "lect": "node '../../ops/lect/lect.js' && yarn run prettier 'README.md' '.all-contributorsrc' 'rollup.config.js' --write",
            "letspublish": "yarn publish || :",
            "lint": "eslint . --fix",
            "perf": "node perf/check.js",
            "prepare": "echo 'ready'",
            "prettier": "prettier",
            "prettier:format": "prettier --write '**/*.{ts,tsx,md}' --no-error-on-unmatched-pattern",
            "pretest": "yarn run lect && yarn run build",
            "test": "yarn run devtest",
            "unit": "uvu test"
        },
        "engines": {
            "node": "^12.20.0 || ^14.13.1 || >=16.0.0"
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
            "lodash.isregexp": "^4.0.1",
            "ranges-merge": "^8.2.4"
        },
        "devDependencies": {
            "@types/lodash.isregexp": "^4.0.7",
            "ranges-apply": "^6.2.9"
        }
    },
    "ranges-sort": {
        "name": "ranges-sort",
        "version": "5.1.3",
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
            "url": "https://github.com/codsen/codsen.git",
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
            "build": "node '../../ops/scripts/esbuild.js' && yarn run dts",
            "dev": "DEV=true node '../../ops/scripts/esbuild.js' && yarn run dts",
            "devtest": "c8 yarn run unit && yarn run examples && yarn run lint",
            "dts": "rollup -c && yarn run prettier 'types/index.d.ts' --write",
            "examples": "node '../../ops/scripts/run-examples.js'",
            "lect": "node '../../ops/lect/lect.js' && yarn run prettier 'README.md' '.all-contributorsrc' 'rollup.config.js' --write",
            "letspublish": "yarn publish || :",
            "lint": "eslint . --fix",
            "perf": "node perf/check.js",
            "prepare": "echo 'ready'",
            "prettier": "prettier",
            "prettier:format": "prettier --write '**/*.{ts,tsx,md}' --no-error-on-unmatched-pattern",
            "pretest": "yarn run lect && yarn run build",
            "test": "yarn run devtest",
            "unit": "uvu test"
        },
        "engines": {
            "node": "^12.20.0 || ^14.13.1 || >=16.0.0"
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
        "version": "2.1.3",
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
            "url": "https://github.com/codsen/codsen.git",
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
            "build": "node '../../ops/scripts/esbuild.js' && yarn run dts",
            "dev": "DEV=true node '../../ops/scripts/esbuild.js' && yarn run dts",
            "devtest": "c8 yarn run unit && yarn run examples && yarn run lint",
            "dts": "rollup -c && yarn run prettier 'types/index.d.ts' --write",
            "examples": "node '../../ops/scripts/run-examples.js'",
            "lect": "node '../../ops/lect/lect.js' && yarn run prettier 'README.md' '.all-contributorsrc' 'rollup.config.js' --write",
            "letspublish": "yarn publish || :",
            "lint": "eslint . --fix",
            "perf": "node perf/check.js",
            "prepare": "echo 'ready'",
            "prettier": "prettier",
            "prettier:format": "prettier --write '**/*.{ts,tsx,md}' --no-error-on-unmatched-pattern",
            "pretest": "yarn run lect && yarn run build",
            "test": "yarn run devtest",
            "unit": "uvu test"
        },
        "engines": {
            "node": "^12.20.0 || ^14.13.1 || >=16.0.0"
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
        "version": "3.1.2",
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
            "url": "https://github.com/codsen/codsen.git",
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
            "build": "node '../../ops/scripts/esbuild.js' && yarn run dts",
            "dev": "DEV=true node '../../ops/scripts/esbuild.js' && yarn run dts",
            "devtest": "c8 yarn run unit && yarn run examples && yarn run lint",
            "dts": "rollup -c && yarn run prettier 'types/index.d.ts' --write",
            "examples": "node '../../ops/scripts/run-examples.js'",
            "lect": "node '../../ops/lect/lect.js' && yarn run prettier 'README.md' '.all-contributorsrc' 'rollup.config.js' --write",
            "letspublish": "yarn publish || :",
            "lint": "eslint . --fix",
            "perf": "node perf/check.js",
            "prepare": "echo 'ready'",
            "prettier": "prettier",
            "prettier:format": "prettier --write '**/*.{ts,tsx,md}' --no-error-on-unmatched-pattern",
            "pretest": "yarn run lect && yarn run build",
            "test": "yarn run devtest",
            "unit": "uvu test"
        },
        "engines": {
            "node": "^12.20.0 || ^14.13.1 || >=16.0.0"
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
        "version": "3.1.2",
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
            "url": "https://github.com/codsen/codsen.git",
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
            "build": "node '../../ops/scripts/esbuild.js' && yarn run dts",
            "dev": "DEV=true node '../../ops/scripts/esbuild.js' && yarn run dts",
            "devtest": "c8 yarn run unit && yarn run examples && yarn run lint",
            "dts": "rollup -c && yarn run prettier 'types/index.d.ts' --write",
            "examples": "node '../../ops/scripts/run-examples.js'",
            "lect": "node '../../ops/lect/lect.js' && yarn run prettier 'README.md' '.all-contributorsrc' 'rollup.config.js' --write",
            "letspublish": "yarn publish || :",
            "lint": "eslint . --fix",
            "perf": "node perf/check.js",
            "prepare": "echo 'ready'",
            "prettier": "prettier",
            "prettier:format": "prettier --write '**/*.{ts,tsx,md}' --no-error-on-unmatched-pattern",
            "pretest": "yarn run lect && yarn run build",
            "test": "yarn run devtest",
            "unit": "uvu test"
        },
        "engines": {
            "node": "^12.20.0 || ^14.13.1 || >=16.0.0"
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
        "version": "3.1.2",
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
            "url": "https://github.com/codsen/codsen.git",
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
            "build": "node '../../ops/scripts/esbuild.js' && yarn run dts",
            "dev": "DEV=true node '../../ops/scripts/esbuild.js' && yarn run dts",
            "devtest": "c8 yarn run unit && yarn run examples && yarn run lint",
            "dts": "rollup -c && yarn run prettier 'types/index.d.ts' --write",
            "examples": "node '../../ops/scripts/run-examples.js'",
            "lect": "node '../../ops/lect/lect.js' && yarn run prettier 'README.md' '.all-contributorsrc' 'rollup.config.js' --write",
            "letspublish": "yarn publish || :",
            "lint": "eslint . --fix",
            "perf": "node perf/check.js",
            "prepare": "echo 'ready'",
            "prettier": "prettier",
            "prettier:format": "prettier --write '**/*.{ts,tsx,md}' --no-error-on-unmatched-pattern",
            "pretest": "yarn run lect && yarn run build",
            "test": "yarn run devtest",
            "unit": "uvu test"
        },
        "engines": {
            "node": "^12.20.0 || ^14.13.1 || >=16.0.0"
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
        "version": "1.4.2",
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
            "url": "https://github.com/codsen/codsen.git",
            "directory": "packages/rehype-responsive-tables"
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
            "default": "./dist/rehype-responsive-tables.esm.js"
        },
        "types": "types/index.d.ts",
        "scripts": {
            "build": "node '../../ops/scripts/esbuild.js' && yarn run dts",
            "dev": "DEV=true node '../../ops/scripts/esbuild.js' && yarn run dts",
            "devtest": "c8 yarn run unit && yarn run examples && yarn run lint",
            "dts": "rollup -c && yarn run prettier 'types/index.d.ts' --write",
            "examples": "node '../../ops/scripts/run-examples.js'",
            "lect": "node '../../ops/lect/lect.js' && yarn run prettier 'README.md' '.all-contributorsrc' 'rollup.config.js' --write",
            "letspublish": "yarn publish || :",
            "lint": "eslint . --fix",
            "perf": "echo 'skip perf'",
            "prepare": "echo 'ready'",
            "prettier": "prettier",
            "prettier:format": "prettier --write '**/*.{ts,tsx,md}' --no-error-on-unmatched-pattern",
            "pretest": "yarn run lect && yarn run build",
            "test": "yarn run devtest",
            "unit": "uvu test"
        },
        "engines": {
            "node": "^12.20.0 || ^14.13.1 || >=16.0.0"
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
            "@types/hast": "^2.3.4",
            "@types/lodash.iteratee": "^4.7.7",
            "lodash.iteratee": "^4.7.0",
            "unified": "^10.1.2",
            "unist-util-visit": "^4.1.1"
        },
        "devDependencies": {
            "rehype": "^12.0.1",
            "rehype-format": "^4.0.1",
            "rehype-parse": "^8.0.4",
            "rehype-stringify": "^9.0.3",
            "remark-gfm": "^3.0.1",
            "remark-rehype": "^10.1.0"
        }
    },
    "remark-conventional-commit-changelog-timeline": {
        "name": "remark-conventional-commit-changelog-timeline",
        "version": "2.0.0",
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
            "url": "https://github.com/codsen/codsen.git",
            "directory": "packages/remark-conventional-commit-changelog-timeline"
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
            "default": "./dist/remark-conventional-commit-changelog-timeline.esm.js"
        },
        "types": "types/index.d.ts",
        "scripts": {
            "build": "node '../../ops/scripts/esbuild.js' && yarn run dts",
            "dev": "DEV=true node '../../ops/scripts/esbuild.js' && yarn run dts",
            "devtest": "c8 yarn run unit && yarn run examples && yarn run lint",
            "dts": "rollup -c && yarn run prettier 'types/index.d.ts' --write",
            "examples": "node '../../ops/scripts/run-examples.js'",
            "lect": "node '../../ops/lect/lect.js' && yarn run prettier 'README.md' '.all-contributorsrc' 'rollup.config.js' --write",
            "letspublish": "yarn publish || :",
            "lint": "eslint . --fix",
            "perf": "echo 'skip perf'",
            "prepare": "echo 'ready'",
            "prettier": "prettier",
            "prettier:format": "prettier --write '**/*.{ts,tsx,md}' --no-error-on-unmatched-pattern",
            "pretest": "yarn run lect && yarn run build",
            "test": "yarn run devtest",
            "unit": "uvu test"
        },
        "engines": {
            "node": "^12.20.0 || ^14.13.1 || >=16.0.0"
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
            "@types/hast": "^2.3.4",
            "hast-util-raw": "^7.2.2",
            "semver-regex": "^4.0.5",
            "unified": "^10.1.2",
            "unist-builder": "^3.0.0",
            "unist-util-visit": "^4.1.1"
        },
        "devDependencies": {
            "object-delete-key": "^3.2.13",
            "remark": "^14.0.2"
        }
    },
    "remark-typography": {
        "name": "remark-typography",
        "version": "0.4.5",
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
            "url": "https://github.com/codsen/codsen.git",
            "directory": "packages/remark-typography"
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
            "default": "./dist/remark-typography.esm.js"
        },
        "types": "types/index.d.ts",
        "scripts": {
            "build": "node '../../ops/scripts/esbuild.js' && yarn run dts",
            "dev": "DEV=true node '../../ops/scripts/esbuild.js' && yarn run dts",
            "devtest": "c8 yarn run unit && yarn run examples && yarn run lint",
            "dts": "rollup -c && yarn run prettier 'types/index.d.ts' --write",
            "examples": "node '../../ops/scripts/run-examples.js'",
            "lect": "node '../../ops/lect/lect.js' && yarn run prettier 'README.md' '.all-contributorsrc' 'rollup.config.js' --write",
            "letspublish": "yarn publish || :",
            "lint": "eslint . --fix",
            "perf": "echo 'skip perf'",
            "prepare": "echo 'ready'",
            "prettier": "prettier",
            "prettier:format": "prettier --write '**/*.{ts,tsx,md}' --no-error-on-unmatched-pattern",
            "pretest": "yarn run lect && yarn run build",
            "test": "yarn run devtest",
            "unit": "uvu test"
        },
        "engines": {
            "node": "^12.20.0 || ^14.13.1 || >=16.0.0"
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
            "@types/hast": "^2.3.4",
            "string-apostrophes": "^3.1.9",
            "string-remove-widows": "^3.1.22",
            "unified": "^10.1.2",
            "unist-util-visit": "^4.1.1"
        },
        "devDependencies": {
            "remark": "^14.0.2"
        }
    },
    "seo-editor": {
        "name": "seo-editor",
        "version": "1.4.13",
        "description": "Copywriting keyword to-do list automation",
        "keywords": [
            "seo",
            "keyword",
            "count",
            "counting",
            "tool",
            "web",
            "app",
            "program",
            "long tail",
            "markdown",
            "editor"
        ],
        "homepage": "https://codsen.com/os/seo-editor",
        "repository": {
            "type": "git",
            "url": "https://github.com/codsen/codsen.git",
            "directory": "packages/seo-editor"
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
            "script": "./dist/seo-editor.umd.js",
            "default": "./dist/seo-editor.esm.js"
        },
        "types": "types/index.d.ts",
        "scripts": {
            "build": "node '../../ops/scripts/esbuild.js' && yarn run dts",
            "dev": "DEV=true node '../../ops/scripts/esbuild.js' && yarn run dts",
            "devtest": "c8 yarn run unit && yarn run examples && yarn run lint",
            "dts": "rollup -c && yarn run prettier 'types/index.d.ts' --write",
            "examples": "node '../../ops/scripts/run-examples.js'",
            "lect": "node '../../ops/lect/lect.js' && yarn run prettier 'README.md' '.all-contributorsrc' 'rollup.config.js' --write",
            "letspublish": "yarn publish || :",
            "lint": "eslint . --fix",
            "perf": "node perf/check.js",
            "prepare": "echo 'ready'",
            "prettier": "prettier",
            "prettier:format": "prettier --write '**/*.{ts,tsx,md}' --no-error-on-unmatched-pattern",
            "pretest": "yarn run lect && yarn run build",
            "test": "yarn run devtest",
            "unit": "uvu test"
        },
        "engines": {
            "node": "^12.20.0 || ^14.13.1 || >=16.0.0"
        },
        "c8": {
            "branches": 100,
            "check-coverage": true,
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
        }
    },
    "str-indexes-of-plus": {
        "name": "str-indexes-of-plus",
        "version": "4.1.3",
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
            "url": "https://github.com/codsen/codsen.git",
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
            "build": "node '../../ops/scripts/esbuild.js' && yarn run dts",
            "dev": "DEV=true node '../../ops/scripts/esbuild.js' && yarn run dts",
            "devtest": "c8 yarn run unit && yarn run examples && yarn run lint",
            "dts": "rollup -c && yarn run prettier 'types/index.d.ts' --write",
            "examples": "node '../../ops/scripts/run-examples.js'",
            "lect": "node '../../ops/lect/lect.js' && yarn run prettier 'README.md' '.all-contributorsrc' 'rollup.config.js' --write",
            "letspublish": "yarn publish || :",
            "lint": "eslint . --fix",
            "perf": "node perf/check.js",
            "prepare": "echo 'ready'",
            "prettier": "prettier",
            "prettier:format": "prettier --write '**/*.{ts,tsx,md}' --no-error-on-unmatched-pattern",
            "pretest": "yarn run lect && yarn run build",
            "test": "yarn run devtest",
            "unit": "uvu test"
        },
        "engines": {
            "node": "^12.20.0 || ^14.13.1 || >=16.0.0"
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
        "version": "3.1.9",
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
            "url": "https://github.com/codsen/codsen.git",
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
            "build": "node '../../ops/scripts/esbuild.js' && yarn run dts",
            "dev": "DEV=true node '../../ops/scripts/esbuild.js' && yarn run dts",
            "devtest": "c8 yarn run unit && yarn run examples && yarn run lint",
            "dts": "rollup -c && yarn run prettier 'types/index.d.ts' --write",
            "examples": "node '../../ops/scripts/run-examples.js'",
            "lect": "node '../../ops/lect/lect.js' && yarn run prettier 'README.md' '.all-contributorsrc' 'rollup.config.js' --write",
            "letspublish": "yarn publish || :",
            "lint": "eslint . --fix",
            "perf": "node perf/check.js",
            "prepare": "echo 'ready'",
            "prettier": "prettier",
            "prettier:format": "prettier --write '**/*.{ts,tsx,md}' --no-error-on-unmatched-pattern",
            "pretest": "yarn run lect && yarn run build",
            "test": "yarn run devtest",
            "unit": "uvu test"
        },
        "engines": {
            "node": "^12.20.0 || ^14.13.1 || >=16.0.0"
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
            "ranges-apply": "^6.2.9"
        }
    },
    "string-bionic-split": {
        "name": "string-bionic-split",
        "version": "1.2.2",
        "description": "Calculate a word string split position index for later highlighting",
        "keywords": [
            "string",
            "word",
            "bionic",
            "split",
            "improved",
            "read",
            "reading",
            "experience",
            "readable",
            "text",
            "highlighted",
            "fixation",
            "point"
        ],
        "homepage": "https://codsen.com/os/string-bionic-split",
        "repository": {
            "type": "git",
            "url": "https://github.com/codsen/codsen.git",
            "directory": "packages/string-bionic-split"
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
            "script": "./dist/string-bionic-split.umd.js",
            "default": "./dist/string-bionic-split.esm.js"
        },
        "types": "types/index.d.ts",
        "scripts": {
            "build": "node '../../ops/scripts/esbuild.js' && yarn run dts",
            "dev": "DEV=true node '../../ops/scripts/esbuild.js' && yarn run dts",
            "devtest": "c8 yarn run unit && yarn run examples && yarn run lint",
            "dts": "rollup -c && yarn run prettier 'types/index.d.ts' --write",
            "examples": "node '../../ops/scripts/run-examples.js'",
            "lect": "node '../../ops/lect/lect.js' && yarn run prettier 'README.md' '.all-contributorsrc' 'rollup.config.js' --write",
            "letspublish": "yarn publish || :",
            "lint": "eslint . --fix",
            "perf": "node perf/check.js",
            "prepare": "echo 'ready'",
            "prettier": "prettier",
            "prettier:format": "prettier --write '**/*.{ts,tsx,md}' --no-error-on-unmatched-pattern",
            "pretest": "yarn run lect && yarn run build",
            "test": "yarn run devtest",
            "unit": "uvu test"
        },
        "engines": {
            "node": "^12.20.0 || ^14.13.1 || >=16.0.0"
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
    "string-character-is-astral-surrogate": {
        "name": "string-character-is-astral-surrogate",
        "version": "2.1.3",
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
            "url": "https://github.com/codsen/codsen.git",
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
            "build": "node '../../ops/scripts/esbuild.js' && yarn run dts",
            "dev": "DEV=true node '../../ops/scripts/esbuild.js' && yarn run dts",
            "devtest": "c8 yarn run unit && yarn run examples && yarn run lint",
            "dts": "rollup -c && yarn run prettier 'types/index.d.ts' --write",
            "examples": "node '../../ops/scripts/run-examples.js'",
            "lect": "node '../../ops/lect/lect.js' && yarn run prettier 'README.md' '.all-contributorsrc' 'rollup.config.js' --write",
            "letspublish": "yarn publish || :",
            "lint": "eslint . --fix",
            "perf": "node perf/check.js",
            "prepare": "echo 'ready'",
            "prettier": "prettier",
            "prettier:format": "prettier --write '**/*.{ts,tsx,md}' --no-error-on-unmatched-pattern",
            "pretest": "yarn run lect && yarn run build",
            "test": "yarn run devtest",
            "unit": "uvu test"
        },
        "engines": {
            "node": "^12.20.0 || ^14.13.1 || >=16.0.0"
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
        "version": "6.1.4",
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
            "url": "https://github.com/codsen/codsen.git",
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
            "build": "node '../../ops/scripts/esbuild.js' && yarn run dts",
            "dev": "DEV=true node '../../ops/scripts/esbuild.js' && yarn run dts",
            "devtest": "c8 yarn run unit && yarn run examples && yarn run lint",
            "dts": "rollup -c && yarn run prettier 'types/index.d.ts' --write",
            "examples": "node '../../ops/scripts/run-examples.js'",
            "lect": "node '../../ops/lect/lect.js' && yarn run prettier 'README.md' '.all-contributorsrc' 'rollup.config.js' --write",
            "letspublish": "yarn publish || :",
            "lint": "eslint . --fix",
            "perf": "node perf/check.js",
            "prepare": "echo 'ready'",
            "prettier": "prettier",
            "prettier:format": "prettier --write '**/*.{ts,tsx,md}' --no-error-on-unmatched-pattern",
            "pretest": "yarn run lect && yarn run build",
            "test": "yarn run devtest",
            "unit": "uvu test"
        },
        "engines": {
            "node": "^12.20.0 || ^14.13.1 || >=16.0.0"
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
        "version": "10.2.9",
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
            "url": "https://github.com/codsen/codsen.git",
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
            "build": "node '../../ops/scripts/esbuild.js' && yarn run dts",
            "dev": "DEV=true node '../../ops/scripts/esbuild.js' && yarn run dts",
            "devtest": "c8 yarn run unit && yarn run examples && yarn run lint",
            "dts": "rollup -c && yarn run prettier 'types/index.d.ts' --write",
            "examples": "node '../../ops/scripts/run-examples.js'",
            "lect": "node '../../ops/lect/lect.js' && yarn run prettier 'README.md' '.all-contributorsrc' 'rollup.config.js' --write",
            "letspublish": "yarn publish || :",
            "lint": "eslint . --fix",
            "perf": "node perf/check.js",
            "prepare": "echo 'ready'",
            "prettier": "prettier",
            "prettier:format": "prettier --write '**/*.{ts,tsx,md}' --no-error-on-unmatched-pattern",
            "pretest": "yarn run lect && yarn run build",
            "test": "yarn run devtest",
            "unit": "uvu test"
        },
        "engines": {
            "node": "^12.20.0 || ^14.13.1 || >=16.0.0"
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
            "ranges-apply": "^6.2.9",
            "ranges-push": "^6.2.4",
            "string-left-right": "^5.1.4"
        },
        "devDependencies": {
            "test-mixer": "^3.1.3"
        }
    },
    "string-convert-indexes": {
        "name": "string-convert-indexes",
        "version": "5.1.3",
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
            "url": "https://github.com/codsen/codsen.git",
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
            "build": "node '../../ops/scripts/esbuild.js' && yarn run dts",
            "dev": "DEV=true node '../../ops/scripts/esbuild.js' && yarn run dts",
            "devtest": "c8 yarn run unit && yarn run examples && yarn run lint",
            "dts": "rollup -c && yarn run prettier 'types/index.d.ts' --write",
            "examples": "node '../../ops/scripts/run-examples.js'",
            "lect": "node '../../ops/lect/lect.js' && yarn run prettier 'README.md' '.all-contributorsrc' 'rollup.config.js' --write",
            "letspublish": "yarn publish || :",
            "lint": "eslint . --fix",
            "perf": "node perf/check.js",
            "prepare": "echo 'ready'",
            "prettier": "prettier",
            "prettier:format": "prettier --write '**/*.{ts,tsx,md}' --no-error-on-unmatched-pattern",
            "pretest": "yarn run lect && yarn run build",
            "test": "yarn run devtest",
            "unit": "uvu test"
        },
        "engines": {
            "node": "^12.20.0 || ^14.13.1 || >=16.0.0"
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
            "ast-monkey-traverse": "^3.1.3",
            "grapheme-splitter": "^1.0.4"
        }
    },
    "string-extract-class-names": {
        "name": "string-extract-class-names",
        "version": "7.1.4",
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
            "url": "https://github.com/codsen/codsen.git",
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
            "build": "node '../../ops/scripts/esbuild.js' && yarn run dts",
            "dev": "DEV=true node '../../ops/scripts/esbuild.js' && yarn run dts",
            "devtest": "c8 yarn run unit && yarn run examples && yarn run lint",
            "dts": "rollup -c && yarn run prettier 'types/index.d.ts' --write",
            "examples": "node '../../ops/scripts/run-examples.js'",
            "lect": "node '../../ops/lect/lect.js' && yarn run prettier 'README.md' '.all-contributorsrc' 'rollup.config.js' --write",
            "letspublish": "yarn publish || :",
            "lint": "eslint . --fix",
            "perf": "node perf/check.js",
            "prepare": "echo 'ready'",
            "prettier": "prettier",
            "prettier:format": "prettier --write '**/*.{ts,tsx,md}' --no-error-on-unmatched-pattern",
            "pretest": "yarn run lect && yarn run build",
            "test": "yarn run devtest",
            "unit": "uvu test"
        },
        "engines": {
            "node": "^12.20.0 || ^14.13.1 || >=16.0.0"
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
            "string-left-right": "^5.1.4"
        }
    },
    "string-extract-sass-vars": {
        "name": "string-extract-sass-vars",
        "version": "3.1.3",
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
            "url": "https://github.com/codsen/codsen.git",
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
            "build": "node '../../ops/scripts/esbuild.js' && yarn run dts",
            "dev": "DEV=true node '../../ops/scripts/esbuild.js' && yarn run dts",
            "devtest": "c8 yarn run unit && yarn run examples && yarn run lint",
            "dts": "rollup -c && yarn run prettier 'types/index.d.ts' --write",
            "examples": "node '../../ops/scripts/run-examples.js'",
            "lect": "node '../../ops/lect/lect.js' && yarn run prettier 'README.md' '.all-contributorsrc' 'rollup.config.js' --write",
            "letspublish": "yarn publish || :",
            "lint": "eslint . --fix",
            "perf": "node perf/check.js",
            "prepare": "echo 'ready'",
            "prettier": "prettier",
            "prettier:format": "prettier --write '**/*.{ts,tsx,md}' --no-error-on-unmatched-pattern",
            "pretest": "yarn run lect && yarn run build",
            "test": "yarn run devtest",
            "unit": "uvu test"
        },
        "engines": {
            "node": "^12.20.0 || ^14.13.1 || >=16.0.0"
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
            "color-shorthand-hex-to-six-digit": "^4.1.3"
        }
    },
    "string-find-heads-tails": {
        "name": "string-find-heads-tails",
        "version": "5.1.4",
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
            "url": "https://github.com/codsen/codsen.git",
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
            "build": "node '../../ops/scripts/esbuild.js' && yarn run dts",
            "dev": "DEV=true node '../../ops/scripts/esbuild.js' && yarn run dts",
            "devtest": "c8 yarn run unit && yarn run examples && yarn run lint",
            "dts": "rollup -c && yarn run prettier 'types/index.d.ts' --write",
            "examples": "node '../../ops/scripts/run-examples.js'",
            "lect": "node '../../ops/lect/lect.js' && yarn run prettier 'README.md' '.all-contributorsrc' 'rollup.config.js' --write",
            "letspublish": "yarn publish || :",
            "lint": "eslint . --fix",
            "perf": "node perf/check.js",
            "prepare": "echo 'ready'",
            "prettier": "prettier",
            "prettier:format": "prettier --write '**/*.{ts,tsx,md}' --no-error-on-unmatched-pattern",
            "pretest": "yarn run lect && yarn run build",
            "test": "yarn run devtest",
            "unit": "uvu test"
        },
        "engines": {
            "node": "^12.20.0 || ^14.13.1 || >=16.0.0"
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
            "arrayiffy-if-string": "^4.1.3",
            "string-match-left-right": "^8.2.4"
        }
    },
    "string-find-malformed": {
        "name": "string-find-malformed",
        "version": "3.2.4",
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
            "url": "https://github.com/codsen/codsen.git",
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
            "build": "node '../../ops/scripts/esbuild.js' && yarn run dts",
            "dev": "DEV=true node '../../ops/scripts/esbuild.js' && yarn run dts",
            "devtest": "c8 yarn run unit && yarn run examples && yarn run lint",
            "dts": "rollup -c && yarn run prettier 'types/index.d.ts' --write",
            "examples": "node '../../ops/scripts/run-examples.js'",
            "lect": "node '../../ops/lect/lect.js' && yarn run prettier 'README.md' '.all-contributorsrc' 'rollup.config.js' --write",
            "letspublish": "yarn publish || :",
            "lint": "eslint . --fix",
            "perf": "node perf/check.js",
            "prepare": "echo 'ready'",
            "prettier": "prettier",
            "prettier:format": "prettier --write '**/*.{ts,tsx,md}' --no-error-on-unmatched-pattern",
            "pretest": "yarn run lect && yarn run build",
            "test": "yarn run devtest",
            "unit": "uvu test"
        },
        "engines": {
            "node": "^12.20.0 || ^14.13.1 || >=16.0.0"
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
            "string-left-right": "^5.1.4"
        }
    },
    "string-fix-broken-named-entities": {
        "name": "string-fix-broken-named-entities",
        "version": "6.1.13",
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
            "url": "https://github.com/codsen/codsen.git",
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
            "build": "node '../../ops/scripts/esbuild.js' && yarn run dts",
            "dev": "DEV=true node '../../ops/scripts/esbuild.js' && yarn run dts",
            "devtest": "c8 yarn run unit && yarn run examples && yarn run lint",
            "dts": "rollup -c && yarn run prettier 'types/index.d.ts' --write",
            "examples": "node '../../ops/scripts/run-examples.js'",
            "lect": "node '../../ops/lect/lect.js' && yarn run prettier 'README.md' '.all-contributorsrc' 'rollup.config.js' --write",
            "letspublish": "yarn publish || :",
            "lint": "eslint . --fix",
            "perf": "node perf/check.js",
            "prepare": "echo 'ready'",
            "prettier": "prettier",
            "prettier:format": "prettier --write '**/*.{ts,tsx,md}' --no-error-on-unmatched-pattern",
            "pretest": "yarn run lect && yarn run build",
            "test": "yarn run devtest",
            "unit": "uvu test"
        },
        "engines": {
            "node": "^12.20.0 || ^14.13.1 || >=16.0.0"
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
            "all-named-html-entities": "^2.1.13",
            "leven": "^4.0.0",
            "lodash.clonedeep": "^4.5.0",
            "string-left-right": "^5.1.4"
        },
        "devDependencies": {
            "@types/lodash.clonedeep": "^4.5.7"
        }
    },
    "string-left-right": {
        "name": "string-left-right",
        "version": "5.1.4",
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
            "url": "https://github.com/codsen/codsen.git",
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
            "build": "node '../../ops/scripts/esbuild.js' && yarn run dts",
            "dev": "DEV=true node '../../ops/scripts/esbuild.js' && yarn run dts",
            "devtest": "c8 yarn run unit && yarn run examples && yarn run lint",
            "dts": "rollup -c && yarn run prettier 'types/index.d.ts' --write",
            "examples": "node '../../ops/scripts/run-examples.js'",
            "lect": "node '../../ops/lect/lect.js' && yarn run prettier 'README.md' '.all-contributorsrc' 'rollup.config.js' --write",
            "letspublish": "yarn publish || :",
            "lint": "eslint . --fix",
            "perf": "node perf/check.js",
            "prepare": "echo 'ready'",
            "prettier": "prettier",
            "prettier:format": "prettier --write '**/*.{ts,tsx,md}' --no-error-on-unmatched-pattern",
            "pretest": "yarn run lect && yarn run build",
            "test": "yarn run devtest",
            "unit": "uvu test"
        },
        "engines": {
            "node": "^12.20.0 || ^14.13.1 || >=16.0.0"
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
            "lodash.clonedeep": "^4.5.0",
            "lodash.isplainobject": "^4.0.6"
        },
        "devDependencies": {
            "@types/lodash.clonedeep": "^4.5.7",
            "@types/lodash.isplainobject": "^4.0.7"
        }
    },
    "string-match-left-right": {
        "name": "string-match-left-right",
        "version": "8.2.4",
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
            "url": "https://github.com/codsen/codsen.git",
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
            "build": "node '../../ops/scripts/esbuild.js' && yarn run dts",
            "dev": "DEV=true node '../../ops/scripts/esbuild.js' && yarn run dts",
            "devtest": "c8 yarn run unit && yarn run examples && yarn run lint",
            "dts": "rollup -c && yarn run prettier 'types/index.d.ts' --write",
            "examples": "node '../../ops/scripts/run-examples.js'",
            "lect": "node '../../ops/lect/lect.js' && yarn run prettier 'README.md' '.all-contributorsrc' 'rollup.config.js' --write",
            "letspublish": "yarn publish || :",
            "lint": "eslint . --fix",
            "perf": "node perf/check.js",
            "prepare": "echo 'ready'",
            "prettier": "prettier",
            "prettier:format": "prettier --write '**/*.{ts,tsx,md}' --no-error-on-unmatched-pattern",
            "pretest": "yarn run lect && yarn run build",
            "test": "yarn run devtest",
            "unit": "uvu test"
        },
        "engines": {
            "node": "^12.20.0 || ^14.13.1 || >=16.0.0"
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
            "arrayiffy-if-string": "^4.1.3",
            "lodash.isplainobject": "^4.0.6",
            "string-character-is-astral-surrogate": "^2.1.3"
        },
        "devDependencies": {
            "@types/lodash.isplainobject": "^4.0.7"
        }
    },
    "string-overlap-one-on-another": {
        "name": "string-overlap-one-on-another",
        "version": "3.2.3",
        "description": "Lay one string on top of another, with an optional offset",
        "keywords": [
            "add",
            "another",
            "characters",
            "compose",
            "lay",
            "offset",
            "on",
            "one",
            "over",
            "overlay",
            "string",
            "superimpose",
            "text",
            "top",
            "word",
            "words"
        ],
        "homepage": "https://codsen.com/os/string-overlap-one-on-another",
        "repository": {
            "type": "git",
            "url": "https://github.com/codsen/codsen.git",
            "directory": "packages/string-overlap-one-on-another"
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
            "script": "./dist/string-overlap-one-on-another.umd.js",
            "default": "./dist/string-overlap-one-on-another.esm.js"
        },
        "types": "types/index.d.ts",
        "scripts": {
            "build": "node '../../ops/scripts/esbuild.js' && yarn run dts",
            "dev": "DEV=true node '../../ops/scripts/esbuild.js' && yarn run dts",
            "devtest": "c8 yarn run unit && yarn run examples && yarn run lint",
            "dts": "rollup -c && yarn run prettier 'types/index.d.ts' --write",
            "examples": "node '../../ops/scripts/run-examples.js'",
            "lect": "node '../../ops/lect/lect.js' && yarn run prettier 'README.md' '.all-contributorsrc' 'rollup.config.js' --write",
            "letspublish": "yarn publish || :",
            "lint": "eslint . --fix",
            "perf": "node perf/check.js",
            "prepare": "echo 'ready'",
            "prettier": "prettier",
            "prettier:format": "prettier --write '**/*.{ts,tsx,md}' --no-error-on-unmatched-pattern",
            "pretest": "yarn run lect && yarn run build",
            "test": "yarn run devtest",
            "unit": "uvu test"
        },
        "engines": {
            "node": "^12.20.0 || ^14.13.1 || >=16.0.0"
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
    "string-process-comma-separated": {
        "name": "string-process-comma-separated",
        "version": "3.1.3",
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
            "url": "https://github.com/codsen/codsen.git",
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
            "build": "node '../../ops/scripts/esbuild.js' && yarn run dts",
            "dev": "DEV=true node '../../ops/scripts/esbuild.js' && yarn run dts",
            "devtest": "c8 yarn run unit && yarn run examples && yarn run lint",
            "dts": "rollup -c && yarn run prettier 'types/index.d.ts' --write",
            "examples": "node '../../ops/scripts/run-examples.js'",
            "lect": "node '../../ops/lect/lect.js' && yarn run prettier 'README.md' '.all-contributorsrc' 'rollup.config.js' --write",
            "letspublish": "yarn publish || :",
            "lint": "eslint . --fix",
            "perf": "node perf/check.js",
            "prepare": "echo 'ready'",
            "prettier": "prettier",
            "prettier:format": "prettier --write '**/*.{ts,tsx,md}' --no-error-on-unmatched-pattern",
            "pretest": "yarn run lect && yarn run build",
            "test": "yarn run devtest",
            "unit": "uvu test"
        },
        "engines": {
            "node": "^12.20.0 || ^14.13.1 || >=16.0.0"
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
    "string-range-expander": {
        "name": "string-range-expander",
        "version": "3.1.3",
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
            "url": "https://github.com/codsen/codsen.git",
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
            "build": "node '../../ops/scripts/esbuild.js' && yarn run dts",
            "dev": "DEV=true node '../../ops/scripts/esbuild.js' && yarn run dts",
            "devtest": "c8 yarn run unit && yarn run examples && yarn run lint",
            "dts": "rollup -c && yarn run prettier 'types/index.d.ts' --write",
            "examples": "node '../../ops/scripts/run-examples.js'",
            "lect": "node '../../ops/lect/lect.js' && yarn run prettier 'README.md' '.all-contributorsrc' 'rollup.config.js' --write",
            "letspublish": "yarn publish || :",
            "lint": "eslint . --fix",
            "perf": "node perf/check.js",
            "prepare": "echo 'ready'",
            "prettier": "prettier",
            "prettier:format": "prettier --write '**/*.{ts,tsx,md}' --no-error-on-unmatched-pattern",
            "pretest": "yarn run lect && yarn run build",
            "test": "yarn run devtest",
            "unit": "uvu test"
        },
        "engines": {
            "node": "^12.20.0 || ^14.13.1 || >=16.0.0"
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
    "string-remove-duplicate-heads-tails": {
        "name": "string-remove-duplicate-heads-tails",
        "version": "6.1.9",
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
            "url": "https://github.com/codsen/codsen.git",
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
            "build": "node '../../ops/scripts/esbuild.js' && yarn run dts",
            "dev": "DEV=true node '../../ops/scripts/esbuild.js' && yarn run dts",
            "devtest": "c8 yarn run unit && yarn run examples && yarn run lint",
            "dts": "rollup -c && yarn run prettier 'types/index.d.ts' --write",
            "examples": "node '../../ops/scripts/run-examples.js'",
            "lect": "node '../../ops/lect/lect.js' && yarn run prettier 'README.md' '.all-contributorsrc' 'rollup.config.js' --write",
            "letspublish": "yarn publish || :",
            "lint": "eslint . --fix",
            "perf": "node perf/check.js",
            "prepare": "echo 'ready'",
            "prettier": "prettier",
            "prettier:format": "prettier --write '**/*.{ts,tsx,md}' --no-error-on-unmatched-pattern",
            "pretest": "yarn run lect && yarn run build",
            "test": "yarn run devtest",
            "unit": "uvu test"
        },
        "engines": {
            "node": "^12.20.0 || ^14.13.1 || >=16.0.0"
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
            "arrayiffy-if-string": "^4.1.3",
            "lodash.isplainobject": "^4.0.6",
            "ranges-apply": "^6.2.9",
            "ranges-push": "^6.2.4",
            "string-match-left-right": "^8.2.4",
            "string-trim-spaces-only": "^4.1.3"
        },
        "devDependencies": {
            "@types/lodash.isplainobject": "^4.0.7"
        }
    },
    "string-remove-thousand-separators": {
        "name": "string-remove-thousand-separators",
        "version": "6.2.9",
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
            "url": "https://github.com/codsen/codsen.git",
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
            "build": "node '../../ops/scripts/esbuild.js' && yarn run dts",
            "dev": "DEV=true node '../../ops/scripts/esbuild.js' && yarn run dts",
            "devtest": "c8 yarn run unit && yarn run examples && yarn run lint",
            "dts": "rollup -c && yarn run prettier 'types/index.d.ts' --write",
            "examples": "node '../../ops/scripts/run-examples.js'",
            "lect": "node '../../ops/lect/lect.js' && yarn run prettier 'README.md' '.all-contributorsrc' 'rollup.config.js' --write",
            "letspublish": "yarn publish || :",
            "lint": "eslint . --fix",
            "perf": "node perf/check.js",
            "prepare": "echo 'ready'",
            "prettier": "prettier",
            "prettier:format": "prettier --write '**/*.{ts,tsx,md}' --no-error-on-unmatched-pattern",
            "pretest": "yarn run lect && yarn run build",
            "test": "yarn run devtest",
            "unit": "uvu test"
        },
        "engines": {
            "node": "^12.20.0 || ^14.13.1 || >=16.0.0"
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
            "lodash.trim": "^4.5.1",
            "ranges-apply": "^6.2.9",
            "ranges-push": "^6.2.4"
        },
        "devDependencies": {
            "@types/lodash.trim": "^4.5.7"
        }
    },
    "string-remove-widows": {
        "name": "string-remove-widows",
        "version": "3.1.22",
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
            "url": "https://github.com/codsen/codsen.git",
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
            "build": "node '../../ops/scripts/esbuild.js' && yarn run dts",
            "dev": "DEV=true node '../../ops/scripts/esbuild.js' && yarn run dts",
            "devtest": "c8 yarn run unit && yarn run examples && yarn run lint",
            "dts": "rollup -c && yarn run prettier 'types/index.d.ts' --write",
            "examples": "node '../../ops/scripts/run-examples.js'",
            "lect": "node '../../ops/lect/lect.js' && yarn run prettier 'README.md' '.all-contributorsrc' 'rollup.config.js' --write",
            "letspublish": "yarn publish || :",
            "lint": "eslint . --fix",
            "perf": "node perf/check.js",
            "prepare": "echo 'ready'",
            "prettier": "prettier",
            "prettier:format": "prettier --write '**/*.{ts,tsx,md}' --no-error-on-unmatched-pattern",
            "pretest": "yarn run lect && yarn run build",
            "test": "yarn run devtest",
            "unit": "uvu test"
        },
        "engines": {
            "node": "^12.20.0 || ^14.13.1 || >=16.0.0"
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
            "ranges-apply": "^6.2.9",
            "ranges-push": "^6.2.4",
            "string-left-right": "^5.1.4",
            "string-match-left-right": "^8.2.4"
        },
        "devDependencies": {
            "string-strip-html": "^11.6.17"
        }
    },
    "string-split-by-whitespace": {
        "name": "string-split-by-whitespace",
        "version": "3.2.4",
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
            "url": "https://github.com/codsen/codsen.git",
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
            "build": "node '../../ops/scripts/esbuild.js' && yarn run dts",
            "dev": "DEV=true node '../../ops/scripts/esbuild.js' && yarn run dts",
            "devtest": "c8 yarn run unit && yarn run examples && yarn run lint",
            "dts": "rollup -c && yarn run prettier 'types/index.d.ts' --write",
            "examples": "node '../../ops/scripts/run-examples.js'",
            "lect": "node '../../ops/lect/lect.js' && yarn run prettier 'README.md' '.all-contributorsrc' 'rollup.config.js' --write",
            "letspublish": "yarn publish || :",
            "lint": "eslint . --fix",
            "perf": "node perf/check.js",
            "prepare": "echo 'ready'",
            "prettier": "prettier",
            "prettier:format": "prettier --write '**/*.{ts,tsx,md}' --no-error-on-unmatched-pattern",
            "pretest": "yarn run lect && yarn run build",
            "test": "yarn run devtest",
            "unit": "uvu test"
        },
        "engines": {
            "node": "^12.20.0 || ^14.13.1 || >=16.0.0"
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
            "ranges-is-index-within": "^3.2.3"
        },
        "devDependencies": {
            "string-find-heads-tails": "^5.1.4"
        }
    },
    "string-strip-html": {
        "name": "string-strip-html",
        "version": "11.6.17",
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
            "url": "https://github.com/codsen/codsen.git",
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
            "build": "node '../../ops/scripts/esbuild.js' && yarn run dts",
            "dev": "DEV=true node '../../ops/scripts/esbuild.js' && yarn run dts",
            "devtest": "c8 yarn run unit && yarn run examples && yarn run lint",
            "dts": "rollup -c && yarn run prettier 'types/index.d.ts' --write",
            "examples": "node '../../ops/scripts/run-examples.js'",
            "lect": "node '../../ops/lect/lect.js' && yarn run prettier 'README.md' '.all-contributorsrc' 'rollup.config.js' --write",
            "letspublish": "yarn publish || :",
            "lint": "eslint . --fix",
            "perf": "node perf/check.js",
            "prepare": "echo 'ready'",
            "prettier": "prettier",
            "prettier:format": "prettier --write '**/*.{ts,tsx,md}' --no-error-on-unmatched-pattern",
            "pretest": "yarn run lect && yarn run build",
            "test": "yarn run devtest",
            "unit": "uvu test"
        },
        "engines": {
            "node": "^12.20.0 || ^14.13.1 || >=16.0.0"
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
            "html-entities": "^2.3.3",
            "lodash.isplainobject": "^4.0.6",
            "lodash.trim": "^4.5.1",
            "lodash.without": "^4.4.0",
            "ranges-apply": "^6.2.9",
            "ranges-push": "^6.2.4",
            "string-left-right": "^5.1.4"
        },
        "devDependencies": {
            "@types/lodash.isplainobject": "^4.0.7",
            "@types/lodash.trim": "^4.5.7",
            "@types/lodash.without": "^4.4.7",
            "ast-monkey-traverse": "^3.1.3",
            "ranges-invert": "^5.2.9",
            "title": "^3.5.3"
        }
    },
    "string-trim-spaces-only": {
        "name": "string-trim-spaces-only",
        "version": "4.1.3",
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
            "url": "https://github.com/codsen/codsen.git",
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
            "build": "node '../../ops/scripts/esbuild.js' && yarn run dts",
            "dev": "DEV=true node '../../ops/scripts/esbuild.js' && yarn run dts",
            "devtest": "c8 yarn run unit && yarn run examples && yarn run lint",
            "dts": "rollup -c && yarn run prettier 'types/index.d.ts' --write",
            "examples": "node '../../ops/scripts/run-examples.js'",
            "lect": "node '../../ops/lect/lect.js' && yarn run prettier 'README.md' '.all-contributorsrc' 'rollup.config.js' --write",
            "letspublish": "yarn publish || :",
            "lint": "eslint . --fix",
            "perf": "node perf/check.js",
            "prepare": "echo 'ready'",
            "prettier": "prettier",
            "prettier:format": "prettier --write '**/*.{ts,tsx,md}' --no-error-on-unmatched-pattern",
            "pretest": "yarn run lect && yarn run build",
            "test": "yarn run devtest",
            "unit": "uvu test"
        },
        "engines": {
            "node": "^12.20.0 || ^14.13.1 || >=16.0.0"
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
    "string-truncator": {
        "name": "string-truncator",
        "version": "1.1.4",
        "description": "Over-engineered string truncation for web UI's",
        "keywords": [
            "string",
            "limit",
            "len",
            "length",
            "truncate",
            "truncator"
        ],
        "homepage": "https://codsen.com/os/string-truncator",
        "repository": {
            "type": "git",
            "url": "https://github.com/codsen/codsen.git",
            "directory": "packages/string-truncator"
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
            "script": "./dist/string-truncator.umd.js",
            "default": "./dist/string-truncator.esm.js"
        },
        "types": "types/index.d.ts",
        "scripts": {
            "build": "node '../../ops/scripts/esbuild.js' && yarn run dts",
            "dev": "DEV=true node '../../ops/scripts/esbuild.js' && yarn run dts",
            "devtest": "c8 yarn run unit && yarn run examples && yarn run lint",
            "dts": "rollup -c && yarn run prettier 'types/index.d.ts' --write",
            "examples": "node '../../ops/scripts/run-examples.js'",
            "lect": "node '../../ops/lect/lect.js' && yarn run prettier 'README.md' '.all-contributorsrc' 'rollup.config.js' --write",
            "letspublish": "yarn publish || :",
            "lint": "eslint . --fix",
            "perf": "node perf/check.js",
            "prepare": "echo 'ready'",
            "prettier": "prettier",
            "prettier:format": "prettier --write '**/*.{ts,tsx,md}' --no-error-on-unmatched-pattern",
            "pretest": "yarn run lect && yarn run build",
            "test": "yarn run devtest",
            "unit": "uvu test"
        },
        "engines": {
            "node": "^12.20.0 || ^14.13.1 || >=16.0.0"
        },
        "c8": {
            "branches": 100,
            "check-coverage": true,
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
            "lodash.deburr": "^4.1.0",
            "string-left-right": "^5.1.4"
        },
        "devDependencies": {
            "@types/lodash.deburr": "^4.1.7"
        }
    },
    "string-uglify": {
        "name": "string-uglify",
        "version": "2.1.3",
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
            "url": "https://github.com/codsen/codsen.git",
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
            "build": "node '../../ops/scripts/esbuild.js' && yarn run dts",
            "dev": "DEV=true node '../../ops/scripts/esbuild.js' && yarn run dts",
            "devtest": "c8 yarn run unit && yarn run examples && yarn run lint",
            "dts": "rollup -c && yarn run prettier 'types/index.d.ts' --write",
            "examples": "node '../../ops/scripts/run-examples.js'",
            "lect": "node '../../ops/lect/lect.js' && yarn run prettier 'README.md' '.all-contributorsrc' 'rollup.config.js' --write",
            "letspublish": "yarn publish || :",
            "lint": "eslint . --fix",
            "perf": "node perf/check.js",
            "prepare": "echo 'ready'",
            "prettier": "prettier",
            "prettier:format": "prettier --write '**/*.{ts,tsx,md}' --no-error-on-unmatched-pattern",
            "pretest": "yarn run lect && yarn run build",
            "test": "yarn run devtest",
            "unit": "uvu test"
        },
        "engines": {
            "node": "^12.20.0 || ^14.13.1 || >=16.0.0"
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
        "version": "5.1.3",
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
            "url": "https://github.com/codsen/codsen.git",
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
            "build": "node '../../ops/scripts/esbuild.js' && yarn run dts",
            "dev": "DEV=true node '../../ops/scripts/esbuild.js' && yarn run dts",
            "devtest": "c8 yarn run unit && yarn run examples && yarn run lint",
            "dts": "rollup -c && yarn run prettier 'types/index.d.ts' --write",
            "examples": "node '../../ops/scripts/run-examples.js'",
            "lect": "node '../../ops/lect/lect.js' && yarn run prettier 'README.md' '.all-contributorsrc' 'rollup.config.js' --write",
            "letspublish": "yarn publish || :",
            "lint": "eslint . --fix",
            "perf": "node perf/check.js",
            "prepare": "echo 'ready'",
            "prettier": "prettier",
            "prettier:format": "prettier --write '**/*.{ts,tsx,md}' --no-error-on-unmatched-pattern",
            "pretest": "yarn run lect && yarn run build",
            "test": "yarn run devtest",
            "unit": "uvu test"
        },
        "engines": {
            "node": "^12.20.0 || ^14.13.1 || >=16.0.0"
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
            "he": "^1.2.0"
        },
        "devDependencies": {
            "@types/he": "^1.1.2"
        }
    },
    "stristri": {
        "name": "stristri",
        "version": "4.1.14",
        "description": "Extracts or deletes HTML, CSS, text and/or templating tags from string",
        "keywords": [
            "code",
            "css",
            "extract",
            "html",
            "jinja",
            "jsp",
            "nunjucks",
            "qa",
            "remove",
            "separate",
            "strip",
            "tags",
            "text"
        ],
        "homepage": "https://codsen.com/os/stristri",
        "repository": {
            "type": "git",
            "url": "https://github.com/codsen/codsen.git",
            "directory": "packages/stristri"
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
            "script": "./dist/stristri.umd.js",
            "default": "./dist/stristri.esm.js"
        },
        "types": "types/index.d.ts",
        "scripts": {
            "build": "node '../../ops/scripts/esbuild.js' && yarn run dts",
            "dev": "DEV=true node '../../ops/scripts/esbuild.js' && yarn run dts",
            "devtest": "c8 yarn run unit && yarn run examples && yarn run lint",
            "dts": "rollup -c && yarn run prettier 'types/index.d.ts' --write",
            "examples": "node '../../ops/scripts/run-examples.js'",
            "lect": "node '../../ops/lect/lect.js' && yarn run prettier 'README.md' '.all-contributorsrc' 'rollup.config.js' --write",
            "letspublish": "yarn publish || :",
            "lint": "eslint . --fix",
            "perf": "node perf/check.js",
            "prepare": "echo 'ready'",
            "prettier": "prettier",
            "prettier:format": "prettier --write '**/*.{ts,tsx,md}' --no-error-on-unmatched-pattern",
            "pretest": "yarn run lect && yarn run build",
            "test": "yarn run devtest",
            "unit": "uvu test"
        },
        "engines": {
            "node": "^12.20.0 || ^14.13.1 || >=16.0.0"
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
            "codsen-tokenizer": "^6.1.14",
            "detect-templating-language": "^3.1.2",
            "ranges-apply": "^6.2.9",
            "ranges-merge": "^8.2.4",
            "string-collapse-white-space": "^10.2.9"
        },
        "devDependencies": {
            "lodash.clonedeep": "^4.5.0",
            "test-mixer": "^3.1.3"
        }
    },
    "tap-parse-string-to-object": {
        "name": "tap-parse-string-to-object",
        "version": "3.1.3",
        "description": "Parses raw Tap: string-to-object or stream-to-a-promise-of-an-object",
        "keywords": [
            "contents",
            "file",
            "object",
            "output",
            "parse",
            "parser",
            "raw",
            "saved",
            "string",
            "tap",
            "terminal",
            "test",
            "unit"
        ],
        "homepage": "https://codsen.com/os/tap-parse-string-to-object",
        "repository": {
            "type": "git",
            "url": "https://github.com/codsen/codsen.git",
            "directory": "packages/tap-parse-string-to-object"
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
            "default": "./dist/tap-parse-string-to-object.esm.js"
        },
        "types": "types/index.d.ts",
        "scripts": {
            "build": "node '../../ops/scripts/esbuild.js' && yarn run dts",
            "dev": "DEV=true node '../../ops/scripts/esbuild.js' && yarn run dts",
            "devtest": "c8 yarn run unit && yarn run examples && yarn run lint",
            "dts": "rollup -c && yarn run prettier 'types/index.d.ts' --write",
            "examples": "node '../../ops/scripts/run-examples.js'",
            "lect": "node '../../ops/lect/lect.js' && yarn run prettier 'README.md' '.all-contributorsrc' 'rollup.config.js' --write",
            "letspublish": "yarn publish || :",
            "lint": "eslint . --fix",
            "perf": "node perf/check.js",
            "prepare": "echo 'ready'",
            "prettier": "prettier",
            "prettier:format": "prettier --write '**/*.{ts,tsx,md}' --no-error-on-unmatched-pattern",
            "pretest": "yarn run lect && yarn run build",
            "test": "yarn run devtest",
            "unit": "uvu test"
        },
        "engines": {
            "node": "^12.20.0 || ^14.13.1 || >=16.0.0"
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
            "isstream": "^0.1.2",
            "split2": "^4.1.0",
            "through2": "^4.0.2"
        },
        "devDependencies": {
            "@types/isstream": "^0.1.0",
            "@types/split2": "^3.2.1",
            "@types/through2": "^2.0.36",
            "fs-extra": "^10.1.0"
        }
    },
    "test-mixer": {
        "name": "test-mixer",
        "version": "3.1.3",
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
            "url": "https://github.com/codsen/codsen.git",
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
            "build": "node '../../ops/scripts/esbuild.js' && yarn run dts",
            "dev": "DEV=true node '../../ops/scripts/esbuild.js' && yarn run dts",
            "devtest": "c8 yarn run unit && yarn run examples && yarn run lint",
            "dts": "rollup -c && yarn run prettier 'types/index.d.ts' --write",
            "examples": "node '../../ops/scripts/run-examples.js'",
            "lect": "node '../../ops/lect/lect.js' && yarn run prettier 'README.md' '.all-contributorsrc' 'rollup.config.js' --write",
            "letspublish": "yarn publish || :",
            "lint": "eslint . --fix",
            "perf": "node perf/check.js",
            "prepare": "echo 'ready'",
            "prettier": "prettier",
            "prettier:format": "prettier --write '**/*.{ts,tsx,md}' --no-error-on-unmatched-pattern",
            "pretest": "yarn run lect && yarn run build",
            "test": "yarn run devtest",
            "unit": "uvu test"
        },
        "engines": {
            "node": "^12.20.0 || ^14.13.1 || >=16.0.0"
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
            "lodash.clonedeep": "^4.5.0",
            "object-boolean-combinations": "^5.1.3"
        },
        "devDependencies": {
            "@types/lodash.clonedeep": "^4.5.7"
        }
    },
    "tsd-extract": {
        "name": "tsd-extract",
        "version": "0.7.7",
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
            "url": "https://github.com/codsen/codsen.git",
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
            "build": "node '../../ops/scripts/esbuild.js' && yarn run dts",
            "dev": "DEV=true node '../../ops/scripts/esbuild.js' && yarn run dts",
            "devtest": "c8 yarn run unit && yarn run examples && yarn run lint",
            "dts": "rollup -c && yarn run prettier 'types/index.d.ts' --write",
            "examples": "node '../../ops/scripts/run-examples.js'",
            "lect": "node '../../ops/lect/lect.js' && yarn run prettier 'README.md' '.all-contributorsrc' 'rollup.config.js' --write",
            "letspublish": "yarn publish || :",
            "lint": "eslint . --fix",
            "perf": "node perf/check.js",
            "prepare": "echo 'ready'",
            "prettier": "prettier",
            "prettier:format": "prettier --write '**/*.{ts,tsx,md}' --no-error-on-unmatched-pattern",
            "pretest": "yarn run lect && yarn run build",
            "test": "yarn run devtest",
            "unit": "uvu test"
        },
        "engines": {
            "node": "^12.20.0 || ^14.13.1 || >=16.0.0"
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
            "string-left-right": "^5.1.4"
        }
    },
    "update-versions": {
        "name": "update-versions",
        "version": "5.2.9",
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
            "url": "https://github.com/codsen/codsen.git",
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
            "build": "echo 'no build needed'",
            "dev": "echo 'no build needed'",
            "lect": "node '../../ops/lect/lect.js'",
            "letspublish": "yarn publish || :",
            "lint": "eslint . --fix",
            "prepare": "echo 'ready'",
            "prettier:format": "prettier --write '**/*.{js,md}' --no-error-on-unmatched-pattern",
            "test": "c8 yarn run unit && yarn run lint",
            "unit": "uvu test"
        },
        "engines": {
            "node": "^12.20.0 || ^14.13.1 || >=16.0.0"
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
            "edit-package-json": "^0.7.9",
            "globby": "^13.1.2",
            "is-online": "^10.0.0",
            "lodash.isplainobject": "^4.0.6",
            "log-update": "^5.0.1",
            "meow": "^11.0.0",
            "object-path": "^0.11.8",
            "p-map": "^5.5.0",
            "p-progress": "^0.6.0",
            "p-reduce": "^3.0.0",
            "pacote": "^15.0.3",
            "update-notifier": "^6.0.2",
            "write-file-atomic": "^5.0.0"
        },
        "devDependencies": {
            "@types/lodash.isplainobject": "^4.0.7",
            "fs-extra": "^10.1.0",
            "lodash.clonedeep": "^4.5.0"
        }
    },
    "util-array-object-or-both": {
        "name": "util-array-object-or-both",
        "version": "4.2.3",
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
            "url": "https://github.com/codsen/codsen.git",
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
            "build": "node '../../ops/scripts/esbuild.js' && yarn run dts",
            "dev": "DEV=true node '../../ops/scripts/esbuild.js' && yarn run dts",
            "devtest": "c8 yarn run unit && yarn run examples && yarn run lint",
            "dts": "rollup -c && yarn run prettier 'types/index.d.ts' --write",
            "examples": "node '../../ops/scripts/run-examples.js'",
            "lect": "node '../../ops/lect/lect.js' && yarn run prettier 'README.md' '.all-contributorsrc' 'rollup.config.js' --write",
            "letspublish": "yarn publish || :",
            "lint": "eslint . --fix",
            "perf": "node perf/check.js",
            "prepare": "echo 'ready'",
            "prettier": "prettier",
            "prettier:format": "prettier --write '**/*.{ts,tsx,md}' --no-error-on-unmatched-pattern",
            "pretest": "yarn run lect && yarn run build",
            "test": "yarn run devtest",
            "unit": "uvu test"
        },
        "engines": {
            "node": "^12.20.0 || ^14.13.1 || >=16.0.0"
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
            "lodash.includes": "^4.3.0"
        },
        "devDependencies": {
            "@types/lodash.includes": "^4.3.7"
        }
    },
    "util-nonempty": {
        "name": "util-nonempty",
        "version": "4.1.3",
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
            "url": "https://github.com/codsen/codsen.git",
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
            "build": "node '../../ops/scripts/esbuild.js' && yarn run dts",
            "dev": "DEV=true node '../../ops/scripts/esbuild.js' && yarn run dts",
            "devtest": "c8 yarn run unit && yarn run examples && yarn run lint",
            "dts": "rollup -c && yarn run prettier 'types/index.d.ts' --write",
            "examples": "node '../../ops/scripts/run-examples.js'",
            "lect": "node '../../ops/lect/lect.js' && yarn run prettier 'README.md' '.all-contributorsrc' 'rollup.config.js' --write",
            "letspublish": "yarn publish || :",
            "lint": "eslint . --fix",
            "perf": "node perf/check.js",
            "prepare": "echo 'ready'",
            "prettier": "prettier",
            "prettier:format": "prettier --write '**/*.{ts,tsx,md}' --no-error-on-unmatched-pattern",
            "pretest": "yarn run lect && yarn run build",
            "test": "yarn run devtest",
            "unit": "uvu test"
        },
        "engines": {
            "node": "^12.20.0 || ^14.13.1 || >=16.0.0"
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
            "lodash.isplainobject": "^4.0.6"
        },
        "devDependencies": {
            "@types/lodash.isplainobject": "^4.0.7"
        }
    }
};
