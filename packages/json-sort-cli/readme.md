# json-sort-cli

<a href="https://github.com/revelt/eslint-on-airbnb-base-badge" style="float: right; padding-bottom: 30px;"><img src="https://cdn.rawgit.com/revelt/eslint-on-airbnb-base-badge/0c3e46c9/lint-badge.svg" alt="ESLint on airbnb-base with caveats" width="110" align="right"></a>

> Command line app to deep sort JSON files. Accepts globs, works fully async.

[![Minimum Node version required][node-img]][node-url]
[![Link to npm page][npm-img]][npm-url]
[![Build Status][travis-img]][travis-url]
[![bitHound Overall Score][overall-img]][overall-url]
[![bitHound Dependencies][deps-img]][deps-url]
[![View dependencies as 2D chart][deps2d-img]][deps2d-url]
[![bitHound Dev Dependencies][dev-img]][dev-url]
[![Known Vulnerabilities][vulnerabilities-img]][vulnerabilities-url]
[![Downloads/Month][downloads-img]][downloads-url]
[![MIT License][license-badge]][license]

## Table of Contents

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


- [Install globally, call anywhere](#install-globally-call-anywhere)
- [API - flags](#api---flags)
- [What it does exactly](#what-it-does-exactly)
  - [Some behaviour peculiarities](#some-behaviour-peculiarities)
- [Updating it](#updating-it)
- [Contributing](#contributing)
- [Licence](#licence)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

**[⬆ &nbsp;back to top](#)**

## Install globally, call anywhere

```bash
$ npm i -g json-sort-cli
```

- then, either call `jsonsort` or `sortjson` with file name, folder name or a list thereof, with or without globs:

```bash
$ jsonsort file1.csv 'folder1/folder2/**/*.*' folder3
$ jsonsort * -t -n
$ jsonsort yourspecialfolder -d

$ jsonsort -v
$ jsonsort --version
$ jsonsort -h
$ jsonsort --help
```

or `sortjson`, same thing. I wired up both. See the [API section](#api---flags) (of call for help via CLI, `jsonsort -h`).

**[⬆ &nbsp;back to top](#)**

## API - flags

short | long            | description
------|-----------------|-----------------------
`-n`  | `--nodemodules` | Don't ignore any **n**ode_modules folders and package-lock.json's
`-t`  | `--tabs`        | Use **t**abs for JSON file indentation
`-d`  | `--dry`         | **d**ry run - only list the found JSON files, don't sort or write
`-h`  | `--help`        | shows (similar to this) **h**elp
`-v`  | `--version`     | shows the installed **v**ersion of your `json-sort-cli`

## What it does exactly

It **sorts JSON files deeply**. That is, algorithm will traverse the input if it's an array or a plain object and will sort _every encountered plain object_.

As a by-product, since this is a parsing-type application, the written files are also **prettified** - tabulations and whitespace is fixed to an (arbitrary) order. If you leave the default setting, it will indent using two spaces. If you call it with a flag `-t`, one tab will be used. If you want a different indentation, raise an [issue](https://github.com/codsen/json-sort-cli/issues), we can discuss that.

Under bonnet this application uses [globby](https://github.com/sindresorhus/globby), so refer to its glob patterns.

**[⬆ &nbsp;back to top](#)**

### Some behaviour peculiarities

If you pass a folder name, for example, `jsonsort templates/`, it will catch all JSON files in there. Sometimes, config files can be in JSON format but have a different extension, yet you want to sort them. For example, ESLint config can be in JSON but be [dot files](https://en.wikipedia.org/wiki/Dot-file) `.eslintrc`.

If you want to sort JSON files without a JSON extension, you'll need to target each file separately. For example, you'd query: `jsonsort .eslintrc` as opposed to lazy glob `jsonsort *`.

**[⬆ &nbsp;back to top](#)**

## Updating it

When you install it globally, it will check occasionally, are there newer versions available, and if so, will show a message nagging you to update. It's the [same update notifier](https://www.npmjs.com/package/update-notifier) that AVA and [npm](https://www.npmjs.com/package/npm) themselves use!

**[⬆ &nbsp;back to top](#)**

## Contributing

This library uses `airbnb-base` rules preset of `eslint` with few exceptions^ and follows the Semver rules.

If you see anything incorrect whatsoever, do [raise an issue](https://github.com/codsen/json-sort-cli/issues). If you have any comments on the code, including ideas how to improve something, don't hesitate to contact me by email, Twitter or raise an issue on an aforementioned issue link.

I also gladly accept feature requests and try to help people using my libraries. Like a rudimentary Customer Support, except on Monday mornings. On Monday mornings I'm very grumpy.

<small>^ 1. No semicolons. 2. Allow plus-plus in `for` loops. See `./eslintrc`</small>

**[⬆ &nbsp;back to top](#)**

## Licence

MIT License (MIT)

Copyright (c) 2017 Codsen Ltd, Roy Revelt

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

[node-img]: https://img.shields.io/node/v/json-sort-cli.svg?style=flat-square&label=works%20on%20node
[node-url]: https://www.npmjs.com/package/json-sort-cli

[npm-img]: https://img.shields.io/npm/v/json-sort-cli.svg?style=flat-square&label=release
[npm-url]: https://www.npmjs.com/package/json-sort-cli

[travis-img]: https://img.shields.io/travis/codsen/json-sort-cli.svg?style=flat-square
[travis-url]: https://travis-ci.org/codsen/json-sort-cli

[overall-img]: https://img.shields.io/bithound/code/github/codsen/json-sort-cli.svg?style=flat-square
[overall-url]: https://www.bithound.io/github/codsen/json-sort-cli

[deps-img]: https://img.shields.io/bithound/dependencies/github/codsen/json-sort-cli.svg?style=flat-square
[deps-url]: https://www.bithound.io/github/codsen/json-sort-cli/master/dependencies/npm

[deps2d-img]: https://img.shields.io/badge/deps%20in%202D-see_here-08f0fd.svg?style=flat-square
[deps2d-url]: http://npm.anvaka.com/#/view/2d/json-sort-cli

[dev-img]: https://img.shields.io/bithound/devDependencies/github/codsen/json-sort-cli.svg?style=flat-square
[dev-url]: https://www.bithound.io/github/codsen/json-sort-cli/master/dependencies/npm

[downloads-img]: https://img.shields.io/npm/dm/json-sort-cli.svg?style=flat-square
[downloads-url]: https://npmcharts.com/compare/json-sort-cli

[vulnerabilities-img]: https://snyk.io/test/github/codsen/json-sort-cli/badge.svg?style=flat-square
[vulnerabilities-url]: https://snyk.io/test/github/codsen/json-sort-cli

[license-badge]: https://img.shields.io/npm/l/json-sort-cli.svg?style=flat-square
[license]: https://github.com/codsen/json-sort-cli/blob/master/license.md
