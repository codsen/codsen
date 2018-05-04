# email-homey

> Generate homepage in the Browsersync root with links/screenshots to all your email templates

[![Minimum Node version required][node-img]][node-url]
[![Build Status][travis-img]][travis-url]
[![bitHound Overall Score][overall-img]][overall-url]
[![bitHound Dependencies][deps-img]][deps-url]
[![View dependencies as 2D chart][deps2d-img]][deps2d-url]
[![bitHound Dev Dependencies][dev-img]][dev-url]
[![Known Vulnerabilities][vulnerabilities-img]][vulnerabilities-url]
[![Downloads/Month][downloads-img]][downloads-url]
[![Code style: prettier][prettier-img]][prettier-url]
[![MIT License][license-img]][license-url]

## Table of Contents

<!-- prettier-ignore-start -->

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


- [Install](#install)
- [What it does](#what-it-does)
- [Contributing](#contributing)
- [Licence](#licence)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

<!-- prettier-ignore-end -->

## Install

Install globally because this is a CLI app:

```bash
npm i -g email-homey
```

Once installed, call it in the root of your templates projects:

```bash
homey "dist"
```

**[⬆ &nbsp;back to top](#)**

## What it does

`email-homey` helps to generate a homepage with a list of all your email templates.

It will expect that all your email templates will be located within a certain folder.

Specifically, `email-homey` will scan a all subfolder names of the path you give it (like `dist` in the example above) and will go inside that folder, look for `seed.html`, copy it into `index.html` (overwriting if such file already exists) and inside that file, replace word `'magicFoldersList'` with a list of folder names (maintaining correct indentation).

This is all you need to be able to pull off a homepage driven by a [Vue.js](https://vuejs.org/). An HTML file with Vue.js script can't query your hard drive and find the subfolder names. For that we need Node. Once Vue.js _has_ the list of folder names (in an array), it can generate a table of templates.

**[⬆ &nbsp;back to top](#)**

## Contributing

* If you **want a new feature** in this package or you would like us to change some of its functionality, raise an [issue on this repo](https://github.com/codsen/email-homey/issues).

* If you tried to use this library but it misbehaves, or **you need advice setting it up**, and its readme doesn't make sense, just document it and raise an [issue on this repo](https://github.com/codsen/email-homey/issues).

* If you would like to **add or change some features**, just fork it, hack away, and file a pull request. We'll do our best to merge it quickly. _Prettier_ is enabled, so you don't need to worry about the code style.

**[⬆ &nbsp;back to top](#)**

## Licence

MIT License (MIT)

Copyright © 2018 Codsen Ltd, Roy Revelt

[node-img]: https://img.shields.io/node/v/email-homey.svg?style=flat-square&label=works%20on%20node
[node-url]: https://www.npmjs.com/package/email-homey
[travis-img]: https://img.shields.io/travis/codsen/email-homey.svg?style=flat-square
[travis-url]: https://travis-ci.org/codsen/email-homey
[overall-img]: https://img.shields.io/bithound/code/github/codsen/email-homey.svg?style=flat-square
[overall-url]: https://www.bithound.io/github/codsen/email-homey
[deps-img]: https://img.shields.io/bithound/dependencies/github/codsen/email-homey.svg?style=flat-square
[deps-url]: https://www.bithound.io/github/codsen/email-homey/master/dependencies/npm
[deps2d-img]: https://img.shields.io/badge/deps%20in%202D-see_here-08f0fd.svg?style=flat-square
[deps2d-url]: http://npm.anvaka.com/#/view/2d/email-homey
[dev-img]: https://img.shields.io/bithound/devDependencies/github/codsen/email-homey.svg?style=flat-square
[dev-url]: https://www.bithound.io/github/codsen/email-homey/master/dependencies/npm
[vulnerabilities-img]: https://snyk.io/test/github/codsen/email-homey/badge.svg?style=flat-square
[vulnerabilities-url]: https://snyk.io/test/github/codsen/email-homey
[downloads-img]: https://img.shields.io/npm/dm/email-homey.svg?style=flat-square
[downloads-url]: https://npmcharts.com/compare/email-homey
[prettier-img]: https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square
[prettier-url]: https://github.com/prettier/prettier
[license-img]: https://img.shields.io/npm/l/email-homey.svg?style=flat-square
[license-url]: https://github.com/codsen/email-homey/blob/master/license.md
