# object-boolean-combinations

<a href="https://standardjs.com" style="float: right; padding: 0 0 20px 20px;"><img src="https://cdn.rawgit.com/feross/standard/master/sticker.svg" alt="Standard JavaScript" width="100" align="right"></a>

> Take object, generate an array of its copies, each containing all possible combinations of Boolean true/false

[![Link to npm page][npm-img]][npm-url]
[![Build Status][travis-img]][travis-url]
[![bitHound Overall Score][overall-img]][overall-url]
[![bitHound Dependencies][deps-img]][deps-url]
[![bitHound Dev Dependencies][dev-img]][dev-url]
[![Coverage Status][cov-img]][cov-url]
[![Known Vulnerabilities][vulnerabilities-img]][vulnerabilities-url]
[![Downloads/Month][downloads-img]][downloads-url]
[![View dependencies as 2D chart][deps2d-img]][deps2d-url]
[![Test in browser][runkit-img]][runkit-url]

## Table of Contents

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


- [Install](#install)
- [API](#api)
- [Usage](#usage)
- [Overriding](#overriding)
- [Overriding the combinations — in practice](#overriding-the-combinations--in-practice)
- [Testing](#testing)
- [Contributing](#contributing)
- [Licence](#licence)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Install

```
npm i object-boolean-combinations --save
npm test
```

## API

```javascript
objectBooleanCombinations(inputObject, [overrideObject]);
```

## Usage

INPUT - OBJECT:
```javascript
{
  a : true,
  b : true
}
```

OUTPUT - ARRAY OF OBJECTS:
```javascript
[
  {
    a : true,
    b : true
  },
  {
    a : true,
    b : false
  },
  {
    a : false,
    b : true
  },
  {
    a : false,
    b : false
  }
]
```

That's nice, however we're not done here.

## Overriding

Sometimes you want to override the object keys, for example, in the a settings object, I want to override all `a` keys to be only true. This reduces the object combinations from 2^2 to 2^(2-1):

INPUT - OBJECT:
```javascript
{
  a : true,
  b : true
}
```

OVERRIDE OBJECT:
```javascript
{
  a : true
}
```

RESULT - ARRAY OF OBJECTS:
```javascript
[
  {
     a : true,
     b : true
  },
  {
    a : true,
    b : false
  }
]
```

## Overriding the combinations — in practice

In practice, I use this overriding to perform the specific tests on [Detergent.js](https://github.com/codsen/detergent). For example, let's say, I am testing: does Detergent encode entities correctly. In that case I need two arrays filled with objects:
* first array — `encodeEntities = true` and all possible combinations of the other 9 settings (2^(10-1)=512 objects in array)
* second array — `encodeEntities = false` and all possible combinations of the rest — again 512 objects in array.

Here's an AVA test, which uses `objectBooleanCombinations()` to create a combinations array of settings objects, then uses `forEach()` to iterate through them all, testing each:

```javascript
test('encode entities - pound sign', t => {
  objectBooleanCombinations(sampleObj, {
    convertEntities: true
    })
  .forEach(function (elem){
    t.is(detergent(
      '\u00A3', elem),
      '&pound;',
      'pound char converted into entity'
    )
  })
})
```

## Testing

```bash
$ npm test
```

Unit tests use AVA, Istanbul [CLI](https://www.npmjs.com/package/nyc) and [JS Standard](https://standardjs.com) notation.

## Contributing

All contributions are welcome. Please stick to [Standard JavaScript](https://standardjs.com) notation and supplement the `test.js` with new unit tests covering your feature(s).

If you see anything incorrect whatsoever, do [raise an issue](https://github.com/codsen/object-boolean-combinations/issues). If you file a pull request, I'll do my best to help you to get it merged in a timely manner. If you have any comments on the code, including ideas how to improve things, don't hesitate to contact me by email.

## Licence

> MIT License (MIT)

> Copyright (c) 2017 Codsen Ltd, Roy Revelt

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

[npm-img]: https://img.shields.io/npm/v/object-boolean-combinations.svg
[npm-url]: https://www.npmjs.com/package/object-boolean-combinations

[travis-img]: https://travis-ci.org/codsen/object-boolean-combinations.svg?branch=master
[travis-url]: https://travis-ci.org/codsen/object-boolean-combinations

[cov-img]: https://coveralls.io/repos/github/codsen/object-boolean-combinations/badge.svg?branch=master
[cov-url]: https://coveralls.io/github/codsen/object-boolean-combinations?branch=master

[overall-img]: https://www.bithound.io/github/codsen/object-boolean-combinations/badges/score.svg
[overall-url]: https://www.bithound.io/github/codsen/object-boolean-combinations

[deps-img]: https://www.bithound.io/github/codsen/object-boolean-combinations/badges/dependencies.svg
[deps-url]: https://www.bithound.io/github/codsen/object-boolean-combinations/master/dependencies/npm

[dev-img]: https://www.bithound.io/github/codsen/object-boolean-combinations/badges/devDependencies.svg
[dev-url]: https://www.bithound.io/github/codsen/object-boolean-combinations/master/dependencies/npm

[downloads-img]: https://img.shields.io/npm/dm/object-boolean-combinations.svg
[downloads-url]: https://www.npmjs.com/package/object-boolean-combinations

[vulnerabilities-img]: https://snyk.io/test/github/codsen/object-boolean-combinations/badge.svg
[vulnerabilities-url]: https://snyk.io/test/github/codsen/object-boolean-combinations

[deps2d-img]: https://img.shields.io/badge/deps%20in%202D-see_here-08f0fd.svg
[deps2d-url]: http://npm.anvaka.com/#/view/2d/object-boolean-combinations

[runkit-img]: https://img.shields.io/badge/runkit-test_in_browser-a853ff.svg
[runkit-url]: https://npm.runkit.com/object-boolean-combinations
