# json-sort-cli

<a href="https://github.com/revelt/eslint-on-airbnb-base-badge" style="float: right; padding: 0 0 20px 20px;"><img src="https://cdn.rawgit.com/revelt/eslint-on-airbnb-base-badge/0c3e46c9/lint-badge.svg" alt="ESLint on airbnb-base with caveats" width="100" align="right"></a>

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
[![MIT License][license-img]][license-url]

## Table of Contents

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


- [Install globally, call anywhere](#install-globally-call-anywhere)
- [API - flags](#api---flags)
- [What it does exactly](#what-it-does-exactly)
- [Updating it](#updating-it)
- [Contributing](#contributing)
- [Licence](#licence)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Install globally, call anywhere

```bash
npm i -g json-sort-cli
```

- then, either call `jsonsort` or `sortjson` with file name, folder name or a list thereof, with or without globs:

```bash
$ jsonsort file1.csv 'folder1/folder2/**/*.*' folder3 -s
$ jsonsort * -t -n
$ jsonsort yourspecialfolder -d

$ jsonsort -v
$ jsonsort --version
$ jsonsort -h
$ jsonsort --help
```

or `sortjson`, same thing. I wired up both. See the [API section](#api---flags) (of call for help via CLI, `jsonsort -h`). Transpiled code is served, so requirements for your Node install are `v.4` and above.

**[⬆ &nbsp;back to top](#)**

## API - flags

short | long            | description
------|-----------------|-----------------------
`-n`  | `--nodemodules` | Don't ignore any **n**ode_modules folders and package-lock.json's
`-t`  | `--tabs`        | Use **t**abs for JSON file indentation
`-d`  | `--dry`         | **d**ry run - only list the found JSON files, don't sort or write
`-h`  | `--help`        | Shows (similar to this) **h**elp
`-v`  | `--version`     | Shows the installed **v**ersion of your `json-sort-cli`
`-s`  | `--silent`      | Shows only one line of output in the terminal. Handy when processing many files.

**[⬆ &nbsp;back to top](#)**

## What it does exactly

It **sorts JSON files deeply**. That is, the algorithm will traverse the input if it's an array or a plain object and will sort _every encountered plain object_.

As a by-product, since this is a parsing-type application, the written files are also **prettified** - tabulations and whitespace are fixed to an (arbitrary) order. If you leave the default setting, it will indent using two spaces. If you call it with a flag `-t`, one tab will be used. If you want a different indentation, raise an [issue](https://github.com/codsen/json-sort-cli/issues), we can discuss that.

Under the bonnet, this application uses [globby](https://github.com/sindresorhus/globby), so refer to its glob patterns.

**[⬆ &nbsp;back to top](#)**

### Some behaviour peculiarities

If you pass a folder name, for example, `jsonsort templates/`, it will catch all JSON files in there. Sometimes, config files can be in JSON format but have a different extension, yet you want to sort them. For example, ESLint config can be in JSON but be [dot files](https://en.wikipedia.org/wiki/Dot-file) `.eslintrc`.

If you want to sort JSON files that don't have `.json` extensions, you'll need to target each file separately. For example, you should query: `jsonsort .eslintrc` as opposed to lazy glob `jsonsort *`.

**[⬆ &nbsp;back to top](#)**

## Updating it

When you install it globally, it will check occasionally, are there newer versions available, and if so, will show a message nagging you to update. It's the [same update notifier](https://www.npmjs.com/package/update-notifier) that AVA and [npm](https://www.npmjs.com/package/npm) themselves use!

**[⬆ &nbsp;back to top](#)**

## Contributing

* If you **want a new feature** in this package or you would like us to change some of its functionality, raise an [issue on this repo](https://github.com/codsen/json-sort-cli/issues).

* If you tried to use this library but it misbehaves, or **you need an advice setting it up**, and its readme doesn't make sense, just document it and raise an [issue on this repo](https://github.com/codsen/json-sort-cli/issues).

* If you would like to **add or change some features**, just fork it, hack away, and file a pull request. We'll do our best to merge it quickly. Code style is `airbnb-base`, only without semicolons. If you use a good code editor, it will pick up the established ESLint setup.

**[⬆ &nbsp;back to top](#)**

## Licence

MIT License (MIT)

Copyright © 2018 Codsen Ltd, Roy Revelt


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

[vulnerabilities-img]: https://snyk.io/test/github/codsen/json-sort-cli/badge.svg?style=flat-square
[vulnerabilities-url]: https://snyk.io/test/github/codsen/json-sort-cli

[downloads-img]: https://img.shields.io/npm/dm/json-sort-cli.svg?style=flat-square
[downloads-url]: https://npmcharts.com/compare/json-sort-cli

[license-img]: https://img.shields.io/npm/l/json-sort-cli.svg?style=flat-square
[license-url]: https://github.com/codsen/json-sort-cli/blob/master/license.md
