# email-homey

<a href="https://github.com/revelt/eslint-on-airbnb-base-badge" style="float: right; padding-bottom: 30px;"><img src="https://cdn.rawgit.com/revelt/eslint-on-airbnb-base-badge/0c3e46c9/lint-badge.svg" alt="ESLint on airbnb-base with caveats" width="110" align="right"></a>

> Generate homepage in the root containing all your templates, by folder

[![Minimum Node version required][node-img]][node-url]
[![Link to npm page][npm-img]][npm-url]
[![Build Status][travis-img]][travis-url]
[![bitHound Overall Score][overall-img]][overall-url]
[![bitHound Dependencies][deps-img]][deps-url]
[![View dependencies as 2D chart][deps2d-img]][deps2d-url]
[![bitHound Dev Dependencies][dev-img]][dev-url]
[![Known Vulnerabilities][vulnerabilities-img]][vulnerabilities-url]
[![Downloads/Month][downloads-img]][downloads-url]
[![Test in browser][runkit-img]][runkit-url]
[![MIT License][license-badge]][license]

## Table of Contents

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


- [Install](#install)
- [Purpose](#purpose)
- [Getting the screenshots of the templates](#getting-the-screenshots-of-the-templates)
- [API](#api)
- [Use](#use)
- [Contributing & testing](#contributing--testing)
- [Licence](#licence)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Install

```sh
$ npm i -D email-homey
```

## Purpose

`email-homey` generates a homepage containing the screenshots of all your templates, each linked to a template. Here's how it works.

When you use a Build System for generate email marketing templates, in the root directory, you have something like:

```
root
│
├─ (folder: "modules", "node_modules", "images" and so on)
│
├─ dist
│  │
│  └─ template_1_folder
│  │  └─ screenshot.png
│  │  └─ index.html
│  │
│  └─ template_2_folder
│     └─ screenshot.png
│     └─ index.html
│
└─ templates
   │
   └─ template_1_folder
   │  └─ index.json
   │  └─ index.njk
   │
   └─ template_2_folder
      └─ index.html
      └─ index.njk
```

When you use [BrowerSync](https://www.npmjs.com/package/browser-sync) in Gulp and set BrowserSync root as `/dist/` folder, you can access each email template (`index.html` above) by calling folder's name (`template_1_folder` in the URL, for example:

```
http://localhost:3000/template_1_folder
or
http://192.168.0.1:3000/template_1_folder
```

Now the problem is you have to type the folder name manually and also, without homepage you can't choose your templates visually. On desktop you can copy-paste (_slightly_ tedious), but on mobile you have to type manually (_very_ tedious), unless, of course, it's iPhone and _global clipboard_ is on, but it's still _tedious_.

How nice would it be if a script could generate a homepage containing the list of all the folders (`template_1_folder`, `template_2_folder` etc) from the chosen root's subfolder (`dist`), link them and even accept screenshot images?

`email-homey` does that.

## Getting the screenshots of the templates

I recommend using [pageres](https://www.npmjs.com/package/pageres) in Gulp to generate screenshots. I tried [gulp-webshot](https://www.npmjs.com/package/gulp-webshot) but it failed on certain HTML's, timing out. `pageres` captured screenshots fine, so it's my current favourite.

## API

Input argument   | Type                  | Obligatory? | Default val      | Description
-----------------|-----------------------|-------------|------------------|-------------
`folderName`     | String                | yes         |                  | Folder name within root. Can be `folder/subfolder/`.
`imgName`        | String                | no          | 'screenshot.png' | Name of a thumbnail image within each location `folderName`

## Use

Call `email-homey` from Gulp, as a step in your email template build system.

**Step 1.** Install:

```sh
$ npm install --save-dev email-homey
```

**Step 2.** Require `email-homey` in your `gulpfile.js`:

```js
const homey = require('email-homey')
```

**Step 3.** Create a Gulp task that calls it:

```js
gulp.task('homey', () => {
  homey('dist', 'screenshot.png')
})
```

**Step 4**. Gulp <=4 runs asynchronously, so if you're not on v4 yet, you'll need to enforce the sequence of the tasks.
First, install `run-sequence`:

```sh
$ npm install --save-dev run-sequence
```
Then, require it in your `gulpfile.js`:

```js
const runSequence = require('run-sequence')
```

Then, you'll be able to enforce the order of tasks:

```js
gulp.task('default', (callback) => {
  runSequence('build', 'homey', 'browser-sync', 'watch', callback)
})
```

The homepage will be assembled from two parts: 1) main template (`template.html` in the root folder of this package) and 2) template for a single thumbnail (`loop-me.html` in the root folder of this package) which will be loop'ed many times and contain each of your thumbnails/templates.

Both files must be placed in the root of your template folder. Feel free to customise them, just keep the classes on the tags because that's how the JS selects the tags to place the content inside of them.

## Contributing & testing

```sh
$ npm test
```

If you see anything incorrect whatsoever, [raise an issue](https://github.com/codsen/email-homey/issues). Pull requests are welcome — fork, hack and pull-request. I'll do my best to merge as soon as possible.

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

[node-img]: https://img.shields.io/node/v/email-homey.svg?style=flat-square&label=works%20on%20node
[node-url]: https://www.npmjs.com/package/email-homey

[npm-img]: https://img.shields.io/npm/v/email-homey.svg?style=flat-square&label=release
[npm-url]: https://www.npmjs.com/package/email-homey

[overall-img]: https://img.shields.io/bithound/code/github/codsen/email-homey.svg?style=flat-square
[overall-url]: https://www.bithound.io/github/codsen/email-homey

[deps-img]: https://img.shields.io/bithound/dependencies/github/codsen/email-homey.svg?style=flat-square
[deps-url]: https://www.bithound.io/github/codsen/email-homey/master/dependencies/npm

[deps2d-img]: https://img.shields.io/badge/deps%20in%202D-see_here-08f0fd.svg?style=flat-square
[deps2d-url]: http://npm.anvaka.com/#/view/2d/email-homey

[dev-img]: https://img.shields.io/bithound/devDependencies/github/codsen/email-homey.svg?style=flat-square
[dev-url]: https://www.bithound.io/github/codsen/email-homey/master/dependencies/npm

[downloads-img]: https://img.shields.io/npm/dm/email-homey.svg?style=flat-square
[downloads-url]: https://npmcharts.com/compare/email-homey

[vulnerabilities-img]: https://snyk.io/test/github/codsen/email-homey/badge.svg?style=flat-square
[vulnerabilities-url]: https://snyk.io/test/github/codsen/email-homey

[license-badge]: https://img.shields.io/npm/l/email-homey.svg?style=flat-square
[license]: https://github.com/codsen/email-homey/blob/master/license.md
