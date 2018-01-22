# object-flatten-referencing

<a href="https://github.com/revelt/eslint-on-airbnb-base-badge" style="float: right; padding: 0 0 20px 20px;"><img src="https://cdn.rawgit.com/revelt/eslint-on-airbnb-base-badge/0c3e46c9/lint-badge.svg" alt="ESLint on airbnb-base with caveats" width="100" align="right"></a>

> Flatten complex nested objects according to a reference objects

[![Minimum Node version required][node-img]][node-url]
[![Link to npm page][npm-img]][npm-url]
[![Build Status][travis-img]][travis-url]
[![Coverage][cov-img]][cov-url]
[![bitHound Overall Score][overall-img]][overall-url]
[![bitHound Dependencies][deps-img]][deps-url]
[![View dependencies as 2D chart][deps2d-img]][deps2d-url]
[![bitHound Dev Dependencies][dev-img]][dev-url]
[![Known Vulnerabilities][vulnerabilities-img]][vulnerabilities-url]
[![Downloads/Month][downloads-img]][downloads-url]
[![Test in browser][runkit-img]][runkit-url]
[![MIT License][license-img]][license-url]

## Table of Contents

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


- [Install](#install)
- [Idea](#idea)
- [API](#api)
- [The algorithm](#the-algorithm)
- [In practice](#in-practice)
- [Contributing](#contributing)
- [Licence](#licence)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Install

```bash
npm i object-flatten-referencing
```

```js
// consume via CommonJS require():
const ofr = require('object-flatten-referencing')
// or as an ES Module:
import ofr from 'object-flatten-referencing'
```

Here's what you'll get:

Type            | Key in `package.json` | Path  | Size
----------------|-----------------------|-------|--------
Main export - **CommonJS version**, transpiled to ES5, contains `require` and `module.exports` | `main`                | `dist/object-flatten-referencing.cjs.js` | 14&nbsp;KB
**ES module** build that Webpack/Rollup understands. Untranspiled ES6 code with `import`/`export`. | `module`              | `dist/object-flatten-referencing.esm.js` | 13&nbsp;KB
**UMD build** for browsers, transpiled, minified, containing `iife`'s and has all dependencies baked-in | `browser`            | `dist/object-flatten-referencing.umd.js` | 37&nbsp;KB

**[⬆ &nbsp;back to top](#)**

## Idea

Sometimes you need to make one nested object to look like another, type-wise.

For example, you've got a key `a`, whose value is array of object(s):

```js
{
  a: [
    {
      b: 'c',
      d: 'e'
    }
  ]
}
```

but, you need the key to have its value as string:

```js
{
  a: 'b.c<br />d.e'
}
```

This library does such object "flattening".

**[⬆ &nbsp;back to top](#)**

## API

**ofr(plainObject, referenceObject\[, options])**

Returns a new plain object, flattened according to your supplied reference object.

```js
const ofr = require('object-flatten-referencing')
const res = ofr(plainObject, referenceObject, options)
console.log('res = ' + JSON.stringify(res, null, 4))
```

**[⬆ &nbsp;back to top](#)**

#### 1st argument - `plainObject`

Type: `object` (plain object)
Obligatory: `yes`

First input argument — the object which you want to flatten.

#### 2nd argument - `searchValue`

Type: `object` (plain object)
Obligatory: `yes`

A reference object — according to what you want to flatten the `plainObject`.

#### 3rd argument (optional) - `options`

Type: `object` (plain object)
Obligatory: `no`

Third argument - an Optional Options Object.

`options` object's key         | Type     | Obligatory? | Default           | Description
-------------------------------|----------|-------------|-------------------|----------------------
{                              |          |             |                   |
`wrapHeadsWith`                | String   | no          | `%%_`             | Prepend this to each value, each result of flattening or simply other encountered value.
`wrapTailsWith`                | String   | no          | `_%%`             | Append this to each value, each result of flattening or simply other encountered value.
`dontWrapKeys`                 | Array of strings or String | no | empty array | We won't append or prepend anything to the keys that match value(s) given here (applies to child nodes as well). Also, we won't flatten them (or their child nodes). This is used to prevent mangling of keys containing your [data storage](https://github.com/codsen/json-variables#data-containers), for example. You can put wildcards (*) to match zero or more characters.
`dontWrapPaths`                | Array of strings or String | no | empty array | This is a more-precise cousin of `dontWrapKeys`. Put the exact path(s) to the key you want to ignore. Remember to append `[number]` after keys that have values as arrays. For example, here's a path to ignore: `modules[0].part2[1].ccc[0].kkk` - key `modules` in root, equal to array. Take zero'th element from that array, it's an object. Take that object's key `part2`, it's equal to an array. Take that array's second element (index `1`)... and so on. This path would be ignored, for example.
`xhtml`                        | Boolean  | no          | `true`            | When flattening, arrays or plain objects are converted into strings. Each value is separated by a line break, and this controls which type to use: HTML (`<br>`) or XHTML (`<br />`)
`preventDoubleWrapping`        | Boolean  | no          | `true`            | If the current value already contains a string from `wrapHeadsWith` or `wrapTailsWith`, don't wrap to prevent double wrapping.
`preventWrappingIfContains`    | Array of strings or String | no          | empty array       | Sometimes variables you set in mapping can have various notations, for example in Nunjucks default `wrapHeadsWith` would be `{{` but also some variables are marked with `{%`. Obviously they would not get recognised and whole string containing them would get wrapped with let's say `{{` and `}}`. But no more. State your system variable heads and tails here, put them as string array.
`objectKeyAndValueJoinChar`    | String   | no          | `.`               | When an object is turned into a string, its key is joined with its value, with another string in-between. This controls what that in-between string is.
`wrapGlobalFlipSwitch`         | Boolean  | no          | `true`            | You can turn off the wrapping function completely using this.
`ignore`                       | Array or String | no   | empty array       | Don't apply any flattening to any of these keys. Naturally, don't wrap them with anything either.
`whatToDoWhenReferenceIsMissing` | Integer or Integer as String | no | `0`  | 0 = skip, 1 = throw, 2 = flatten to string
`mergeArraysWithLineBreaks`    | Boolean  | no          | `true`            | Should we merge arrays using `<br />`'s? It's handy to turn it off when mapping variables on email templates where values in data arrays are IF statements, and `<br />`'s are hardcoded inside of them.
`mergeWithoutTrailingBrIfLineContainsBr` | Boolean | no | `true`            | When merging arrays to produce a string, each row's contents will be checked do they contain `<br`, and if so, line break in front of it will not be added. Added in `v4`.
`enforceStrictKeyset`          | Boolean  | no          | `true`            | Are you allowed to pass in an unrecognised keys in the options object?
}                              |          |             |                   |

Here are all the defaults, compiled in one place just in case you want to copy and tweak:

```js
{
  wrapHeadsWith: '%%_',
  wrapTailsWith: '_%%',
  dontWrapKeys: [],
  xhtml: true,
  preventDoubleWrapping: true,
  preventWrappingIfContains: [],
  objectKeyAndValueJoinChar: '.',
  wrapGlobalFlipSwitch: true,
  ignore: [],
  whatToDoWhenReferenceIsMissing: 0,
  mergeArraysWithLineBreaks: true,
  mergeWithoutTrailingBrIfLineContainsBr: true,
  enforceStrictKeyset: true,
}
```

**[⬆ &nbsp;back to top](#)**

## The algorithm

In its core, this library uses two functions:

- one which flattens objects
- another which flattens arrays

**Objects** are flattened into arrays (yes, not strings) in the following fashion:

```js
// from:
{
  a: 'b',
  c: 'd'
}
// to:
['%%_a.b_%%', '%%_c.d_%%']
```

Arrays are flattened into strings:

```js
// from:
['a', 'b', 'c']
// to:
'%%_a_%%<br />%%_b_%%<br />%%_c_%%'
```

This library recursively traverses both inputs, compares their types and if one type is lesser in the food chain (object vs. string), it uses the above functions to flatten all mismatching elements into strings.

**[⬆ &nbsp;back to top](#)**

## In practice

In practice, you will need this library when you need to map the variables in email templates.

For example, your _data content file_ in JSON (development version) that controls your template is:

```js
// data file:
{
  "title": "Welcome",
  "name": "John"
}
```

but you need to turn it into the following when generating PROD version:

```js
// you want your data file to look like this after processing:
{
  "title": "Welcome",
  "name": "${object.name}"
}
```

To achieve that, you use another JSON _mapping file_,

```js
// mapping file:
{
  "name": {
    "object": "name"
  }
}
```

It's easy to [merge](https://github.com/codsen/object-merge-advanced) the _mapping file_ onto the _data file_, but you get:

```js
// intermediate data file after merging the mapping file over data file
{
  "title": "Welcome",
  "name": {
    "object": "name"
  }
}
```

Now you need to **flatten** the above object, so that the key called `name` has a value of `string` type, not `object`. This library helps to achieve that:

```js
const mergedDataFile = {
  "title": "Welcome",
  "name": {
    "object": "name"
  }
}
const reference = {
  "title": "Welcome",
  "name": "John"
}
mergedDataFile = ofr(
  mergedDataFile,
  reference,
  {
    wrapHeadsWith: '${',
    wrapTailsWith: '}'
  }
)
console.log(JSON.stringify(mergedDataFile, null, 4))
// => {
//      "title": "Welcome",
//      "name": "${object.name}"
//    }
```

Voilà!

**[⬆ &nbsp;back to top](#)**

## Contributing

* If you **want a new feature** in this package or you would like us to change some of its functionality, raise an [issue on this repo](https://github.com/codsen/object-flatten-referencing/issues).

* If you tried to use this library but it misbehaves, or **you need an advice setting it up**, and its readme doesn't make sense, just document it and raise an [issue on this repo](https://github.com/codsen/object-flatten-referencing/issues).

* If you would like to **add or change some features**, just fork it, hack away, and file a pull request. We'll do our best to merge it quickly. Code style is `airbnb-base`, only without semicolons. If you use a good code editor, it will pick up the established ESLint setup.

**[⬆ &nbsp;back to top](#)**

## Licence

MIT License (MIT)

Copyright © 2018 Codsen Ltd, Roy Revelt

[node-img]: https://img.shields.io/node/v/object-flatten-referencing.svg?style=flat-square&label=works%20on%20node
[node-url]: https://www.npmjs.com/package/object-flatten-referencing

[npm-img]: https://img.shields.io/npm/v/object-flatten-referencing.svg?style=flat-square&label=release
[npm-url]: https://www.npmjs.com/package/object-flatten-referencing

[travis-img]: https://img.shields.io/travis/codsen/object-flatten-referencing.svg?style=flat-square
[travis-url]: https://travis-ci.org/codsen/object-flatten-referencing

[cov-img]: https://coveralls.io/repos/github/codsen/object-flatten-referencing/badge.svg?style=flat-square?branch=master
[cov-url]: https://coveralls.io/github/codsen/object-flatten-referencing?branch=master

[overall-img]: https://img.shields.io/bithound/code/github/codsen/object-flatten-referencing.svg?style=flat-square
[overall-url]: https://www.bithound.io/github/codsen/object-flatten-referencing

[deps-img]: https://img.shields.io/bithound/dependencies/github/codsen/object-flatten-referencing.svg?style=flat-square
[deps-url]: https://www.bithound.io/github/codsen/object-flatten-referencing/master/dependencies/npm

[deps2d-img]: https://img.shields.io/badge/deps%20in%202D-see_here-08f0fd.svg?style=flat-square
[deps2d-url]: http://npm.anvaka.com/#/view/2d/object-flatten-referencing

[dev-img]: https://img.shields.io/bithound/devDependencies/github/codsen/object-flatten-referencing.svg?style=flat-square
[dev-url]: https://www.bithound.io/github/codsen/object-flatten-referencing/master/dependencies/npm

[vulnerabilities-img]: https://snyk.io/test/github/codsen/object-flatten-referencing/badge.svg?style=flat-square
[vulnerabilities-url]: https://snyk.io/test/github/codsen/object-flatten-referencing

[downloads-img]: https://img.shields.io/npm/dm/object-flatten-referencing.svg?style=flat-square
[downloads-url]: https://npmcharts.com/compare/object-flatten-referencing

[runkit-img]: https://img.shields.io/badge/runkit-test_in_browser-a853ff.svg?style=flat-square
[runkit-url]: https://npm.runkit.com/object-flatten-referencing

[license-img]: https://img.shields.io/npm/l/object-flatten-referencing.svg?style=flat-square
[license-url]: https://github.com/codsen/object-flatten-referencing/blob/master/license.md

[all-contributors]: https://github.com/kentcdodds/all-contributors
