# object-boolean-combinations [![Build Status](https://travis-ci.org/revelt/object-boolean-combinations.svg?branch=master)](https://travis-ci.org/revelt/object-boolean-combinations)

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

## Licence

MIT © Roy Reveltas
