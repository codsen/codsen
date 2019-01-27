# Documentation

Welcome to our documentation pages! The `lect` processes quite a few files so we split everything into separate files:

## Basics for dummies

#### CLI

**CLI** stands for "command line interface". It is an application which has an interface. "regular" npm libraries are programs which are meant to be consumed by other programs (to be _dependencies_). All packages whose names end with `-cli` are CLI's. In practice, all you need to do to turn a "normal" package into a CLI is to stick a line of code at the top, `#!/usr/bin/env node` and point the `bin` key in `package.json` to that JavaScript file.

#### Library === Package

**Library** or **package** is interchangeable and means an npm package. Npm packages are meant to be applications: single functions exported as default (for example, [util-nonempty](https://www.npmjs.com/package/util-nonempty)), sets of functions (for example [json-comb-core](https://www.npmjs.com/package/json-comb-core)) or CLI apps (for example, this very CLI, `lect` or [json-sort-cli](https://www.npmjs.com/package/json-sort-cli)). But people can and sometimes do publish various crap (including nothing) as an npm package.

#### Paths

* If you see a path starting with dot `./`, it means "root level", _a starting folder_.
* If you see dollar sign on some instructions never type it. It just means it's a command meant to be typed in a terminal (as opposed to typed in a _file_ somehere).

#### Hidden and dot files

If you see files that have names with dot in front, for example `.eslintrc.json` it's not a mistake. They are so-called dot-files. As a techie, you should set MacOS to [show all files](https://stackoverflow.com/questions/11197249/show-system-files-show-git-ignore-in-osx/11197286) of all kinds, including dot-files and learn to live surrounded by them.

## Purpose of `lect`

## [Installation instructions](setup-instructions)

Install globally via `npm`:

```bash
npm i -g lect
```

## [Setup instructions](setup-instructions)

Once installed, you must place a `.lectrc.json` one level above the `package.json`s of your libraries:

```
•
└── packages/
    ├── lib1/
    │   └── package.json
    ├── lib2/
    │   └── package.json
    ├── lib3/
    │   └── package.json
    └── .lectrc.json  <--------  place config file here
```

## Operations by file name

* [readme.md](readme-processing)
* [.travis.yml](travis-yml)
