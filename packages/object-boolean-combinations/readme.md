# object-boolean-combinations

<a href="https://github.com/feross/standard" style="float: right; padding: 0 0 20px 20px;"><img src="https://cdn.rawgit.com/feross/standard/master/sticker.svg" alt="Standard JavaScript" width="100" align="right"></a>

> Take object, generate an array of its copies, each containing all possible combinations of Boolean true/false

[![Build Status][travis-img]][travis-url]
[![bitHound Overall Score][overall-img]][overall-url]
[![bitHound Dependencies][deps-img]][deps-url]
[![bitHound Dev Dependencies][dev-img]][dev-url]
[![Downloads/Month][downloads-img]][downloads-url]

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

In practice, I use this overriding to perform the specific tests on [Detergent.js](https://github.com/code-and-send/detergent). For example, let's say, I am testing: does Detergent encode entities correctly. In that case I need two arrays filled with objects:
* first array — `encodeEntities = true` and all possible combinations of the other 9 settings (2^(10-1)=512 objects in array)
* second array — `encodeEntities = false` and all possible combinations of the rest — again 512 objects in array.

Here's a Tape test, which uses `objectBooleanCombinations()` to create a combinations array of settings objects, then uses `forEach()` to iterate through them all, testing each using Tape's `t.equal()`:

```javascript

test('encode entities - pound sign', function (t) {
  objectBooleanCombinations(sampleObj, {
    convertEntities: true
    })
  .forEach(function (elem){
    t.equal(detergent(
      '\u00A3', elem),
      '&pound;',
      'pound char converted into entity'
    );
  });
  t.end();
});
```

## Testing

```bash
$ npm test
```

Unit tests use Tape and [JS Standard](https://github.com/feross/standard) notation.

## Contributing

All contributions are welcome. Please stick to [Standard JavaScript](https://github.com/feross/standard) notation and supplement the `test.js` with new unit tests covering your feature(s).

If you see anything incorrect whatsoever, do [raise an issue](https://github.com/revelt/object-boolean-combinations/issues). If you file a pull request, I'll do my best to help you to get it merged in a timely manner. If you have any comments on the code, including ideas how to improve things, don't hesitate to contact me by email.

## Licence

> MIT License (MIT)

> Copyright (c) 2016 Code and Send Ltd, Roy Reveltas

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

[travis-img]: https://travis-ci.org/revelt/object-boolean-combinations.svg?branch=master
[travis-url]: https://travis-ci.org/revelt/object-boolean-combinations

[overall-img]: https://www.bithound.io/github/revelt/object-boolean-combinations/badges/score.svg
[overall-url]: https://www.bithound.io/github/revelt/object-boolean-combinations

[deps-img]: https://www.bithound.io/github/revelt/object-boolean-combinations/badges/dependencies.svg
[deps-url]: https://www.bithound.io/github/revelt/object-boolean-combinations/master/dependencies/npm

[dev-img]: https://www.bithound.io/github/revelt/object-boolean-combinations/badges/devDependencies.svg
[dev-url]: https://www.bithound.io/github/revelt/object-boolean-combinations/master/dependencies/npm

[downloads-img]: https://img.shields.io/npm/dm/object-boolean-combinations.svg
[downloads-url]: https://www.npmjs.com/package/object-boolean-combinations
