# chlu

<a href="https://standardjs.com" style="float: right; padding: 0 0 20px 20px;"><img src="https://cdn.rawgit.com/feross/standard/master/sticker.svg" alt="Standard JavaScript" width="100" align="right"></a>

> CH-ange-L-og U-pdate — Automatically fix errors in your changelog file

[![Build Status][travis-img]][travis-url]
[![bitHound Score][bithound-img]][bithound-url]
[![bitHound Dependencies][deps-img]][deps-url]
[![bitHound Dev Dependencies][dev-img]][dev-url]
[![Downloads/Month][downloads-img]][downloads-url]

## Table of Contents

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


- [Install](#install)
- [What it does](#what-it-does)
- [Automatically updating changelogs](#automatically-updating-changelogs)
  - [1. Missing diff links in the footer for newly added titles.](#1-missing-diff-links-in-the-footer-for-newly-added-titles)
  - [2. Wrong package](#2-wrong-package)
- [Extras](#extras)
- [Contributing](#contributing)
- [Licence](#licence)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Install

```sh
$ npm i -S chlu
```

## What it does

`chlu` stands for CHangeLog Update. This library is the API for [`chlu-cli`](https://www.npmjs.com/package/chlu-cli). You probably want latter installed globally on your hard drive.

## Automatically updating changelogs

Your changelogs should follow the rules given by http://keepachangelog.com

However, sometimes errors happen and this tool will automatically fix them. Let me go through the most common errors (from my experience) in `changelog.md`:

### 1. Missing diff links in the footer for newly added titles.

This is the primary reason I created `chlu`. Often I clone the previous title and feature description, but forget to clone and edit the **title's link in the footer**. `chlu` will scan all titles and add the missing links in the footer.

For example, the culprit footer link would look like this:

```md
[1.4.0]: https://github.com/code-and-send/wrong-lib/compare/v1.3.0...v1.4.0
```

### 2. Wrong package

This has happened to me before, actually on Detergent's repo even. I copied and edited the changelog from my other library and forgot to edit the package name in the footer diff links. For example, `wrong-lib` is wrong below:

```md
[1.4.0]: https://github.com/code-and-send/wrong-lib/compare/v1.3.0...v1.4.0
```

`chlu` will read your `package.json` (which must be located at the same root folder as `changelog.md`) and fix both your GitHub user and GitHub package name in the links.

## Extras

Since the order of the features is descending, the default order of title markdown links in the footer should also be descending. That's also how example in http://keepachangelog.com is set. I hate that. Personally, I find it difficult to visually scan the list if the order is descending. That's why `chlu` will respect the existing order of your footer links and add the missing link in an order you've already got.

## Contributing

All contributions are welcome. Please stick to [Standard JavaScript](https://standardjs.com) notation.

If you see anything incorrect whatsoever, do [raise an issue](https://github.com/code-and-send/chlu/issues). If you have any comments on the code, including ideas how to improve something, don't hesitate to contact me by email, Twitter or raise a GitHub issue.

## Licence

> MIT License (MIT)

> Copyright (c) 2017 Codsen Ltd, Roy Reveltas

> Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

> The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

> THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

[travis-img]: https://travis-ci.org/code-and-send/chlu.svg?branch=master
[travis-url]: https://travis-ci.org/code-and-send/chlu

[bithound-img]: https://www.bithound.io/github/code-and-send/chlu/badges/score.svg
[bithound-url]: https://www.bithound.io/github/code-and-send/chlu

[deps-img]: https://www.bithound.io/github/code-and-send/chlu/badges/dependencies.svg
[deps-url]: https://www.bithound.io/github/code-and-send/chlu/master/dependencies/npm

[dev-img]: https://www.bithound.io/github/code-and-send/chlu/badges/devDependencies.svg
[dev-url]: https://www.bithound.io/github/code-and-send/chlu/master/dependencies/npm

[downloads-img]: https://img.shields.io/npm/dm/chlu.svg
[downloads-url]: https://www.npmjs.com/package/chlu
