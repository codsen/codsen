# object-fill-missing-keys

> Add missing keys into plain objects, according to a reference object

[![Minimum Node version required][node-img]][node-url]
[![Repository is on BitBucket][bitbucket-img]][bitbucket-url]
[![Coverage][cov-img]][cov-url]
[![View dependencies as 2D chart][deps2d-img]][deps2d-url]
[![Downloads/Month][downloads-img]][downloads-url]
[![Test in browser][runkit-img]][runkit-url]
[![Code style: prettier][prettier-img]][prettier-url]
[![MIT License][license-img]][license-url]

## Table of Contents

- [Install](#markdown-header-install)
- [Purpose](#markdown-header-purpose)
- [How this works](#markdown-header-how-this-works)
- [Example](#markdown-header-example)
- [API](#markdown-header-api)
- [Contributing](#markdown-header-contributing)
- [Licence](#markdown-header-licence)

## Install

```sh
npm i object-fill-missing-keys
```

```js
// consume as a CommonJS require:
const fillMissingKeys = require("object-fill-missing-keys");
// or as an ES Module:
import fillMissingKeys from "object-fill-missing-keys";
```

Here's what you'll get:

| Type                                                                                                    | Key in `package.json` | Path                                   | Size  |
| ------------------------------------------------------------------------------------------------------- | --------------------- | -------------------------------------- | ----- |
| Main export - **CommonJS version**, transpiled to ES5, contains `require` and `module.exports`          | `main`                | `dist/object-fill-missing-keys.cjs.js` | 6 KB  |
| **ES module** build that Webpack/Rollup understands. Untranspiled ES6 code with `import`/`export`.      | `module`              | `dist/object-fill-missing-keys.esm.js` | 6 KB  |
| **UMD build** for browsers, transpiled, minified, containing `iife`'s and has all dependencies baked-in | `browser`             | `dist/object-fill-missing-keys.umd.js` | 49 KB |

**[⬆ back to top](#markdown-header-object-fill-missing-keys)**

## Purpose

This library fills missing keys in a plain object according to a supplied reference object. It is driving the [json-comb-core](https://bitbucket.org/codsen/json-comb-core#enforcekeyset) method `enforceKeyset()`.

**[⬆ back to top](#markdown-header-object-fill-missing-keys)**

## How this works

This library performs the key creation part in the JSON files' _normalisation_ operation. JSON file normalisation is making a set of JSON files to have the same key set.

**Here's how it slots in the normalisation process:**

First, you take two or more plain objects, normally originating from JSON files' contents.

Then, you [calculate](https://bitbucket.org/codsen/json-comb-core#getkeyset) the _schema reference_ out of them. It's a superset object of all possible keys used across the objects (your JSON files).

Finally, you go through your plain objects second time, one-by-one and [fill missing keys](https://bitbucket.org/codsen/json-comb-core#enforcekeyset) using **this library**. It takes the plain object and your generated _schema reference_ (and optionally a custom placeholder if you don't like Boolean `false`) and creates missing keys/arrays in that plain object.

---

Alternatively, you can use this library just to add missing keys. Mind you, for performance reasons; schema is expected to have all key _values_ equal to placeholders. This way, when creation happens, it can be merged over, and those placeholder values come into right places as placeholders. This means, if you provide a schema with some keys having values as non-placeholder, you'll get those values written onto your objects.

Previously I kept "insurance" function which took a schema reference object and overwrote all its values to the `opts.placeholder`, but then I understood that "normal" reference schemas will always come with right key values anyway, and such operation would waste resources.

**[⬆ back to top](#markdown-header-object-fill-missing-keys)**

## Example

```js
const fillMissingKeys = require("object-fill-missing-keys");
const result = fillMissingKeys(
  {
    b: "b" // <---- input plain object that could have come from JSON
  },
  {
    // <---- schema reference object
    a: false,
    b: false,
    c: false
  }
);
console.log("result = " + JSON.stringify(result, null, 4));
// result = {
//   a: false,
//   b: 'b',
//   c: false
// }
```

**[⬆ back to top](#markdown-header-object-fill-missing-keys)**

## API

```js
fillMissingKeys(incompleteObj, schemaObj, [opts]);
```

Input arguments are not mutated, inputs are cloned before being used. That's important.

### API - Input

| Input argument  | Type         | Obligatory? | Description                                                                                   |
| --------------- | ------------ | ----------- | --------------------------------------------------------------------------------------------- |
| `incompleteObj` | Plain object | yes         | Plain object. Can have nested values.                                                         |
| `schemaObj`     | Plain object | yes         | Schema object which contains a desired set of values. Can be nested or hold arrays of things. |
| `opts`          | Plain object | no          | Optional Options Object, see below for its API                                                |

**[⬆ back to top](#markdown-header-object-fill-missing-keys)**

### An Optional Options Object

| options object's key                           | Type of its value             | Default         | Description                                                                                                                                                                                                                                                                                                                                                                                                                              |
| ---------------------------------------------- | ----------------------------- | --------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| {                                              |                               |                 |
| `placeholder`                                  | Anything                      | Boolean `false` | Used only in combination with `doNotFillThesePathsIfTheyContainPlaceholders` as a means to compare do all children keys contain placeholder values. It won't patch up your reference schema objects (for performance reasons). Always make sure your reference schema object has all values [set](https://bitbucket.org/codsen/object-set-all-values-to) to be a desired `placeholder` (default placeholder is usually Boolean `false`). |
| `doNotFillThesePathsIfTheyContainPlaceholders` | Array of zero or more strings | `[]`            | Handy to activate this for ad-hoc keys in data structures to limit the data bloat.                                                                                                                                                                                                                                                                                                                                                       |
| `useNullAsExplicitFalse`                       | Boolean                       | `true`          | When filling the keys, when this setting is on if there is existing key with `null` value it won't get the value assigned to anything, even if the reference object would otherwise set it to a nested something. Under bonnet it's setting same-named options key for [object-merge-advanced](https://bitbucket.org/codsen/object-merge-advanced).                                                                                      |
| }                                              |                               |                 |

**[⬆ back to top](#markdown-header-object-fill-missing-keys)**

### `opts.doNotFillThesePathsIfTheyContainPlaceholders`

This setting is handy to limit the lengths of your JSON files. Sometimes, you have some ad-hoc keys that are either very large nested trees of values AND/OR they are rarely used. In those cases, you want to manually trigger the normalisation of that key.

It's done this way.

Find out the path of the key you want to limit normalising on. Path notation is following the one used in [object-path](https://www.npmjs.com/package/object-path): if it's object, put the key name, if it's array, put that element's ID. For example: `orders.latest.0.first_name` would be:

```
{
  orders: {
    latest: [ // <---- notice it's a nested array within a plain object
      {
        first_name: "Bob", // <------ this key is `orders.latest.0.first_name`
        last_name: "Smith"
      },
      {
        first_name: "John",
        last_name: "Doe"
      }
    ]
  }
}
```

Put the path you want to skip normalising into `opts.doNotFillThesePathsIfTheyContainPlaceholders` array. For example:

```js
const res = fillMissingKeys(
  {
    // <---- input
    a: {
      b: false, // <---- we don't want to automatically normalise this key
      x: "x"
    },
    z: "z"
  },
  {
    // <---- reference schema object
    a: {
      b: {
        c: false,
        d: false
      },
      x: false
    },
    z: false
  },
  {
    doNotFillThesePathsIfTheyContainPlaceholders: ["a.b"]
  }
);
console.log(`res = ${JSON.stringify(res, null, 4)}`);
// res = {
//   a: {
//     b: false, // <---------------- observe, the keys were not added because it had a placeholder
//     x: 'x',
//   },
//   z: 'z',
// }
```

To trigger normalisation on an ignored path, you have to set the value on that path to be _falsey_, but not a placeholder. If you are using default placeholder, `false`, just set the value in the path as `true`. If you're using a custom placeholder, different as `false`, set it to `false`. The normalisation will see not a placeholder and will start by comparing/filling in missing branches in your object.

For example, we want to fill the value for `a.b.c`, but we are not sure what's the data structure. We _want_ a placeholder to be set during normalisation under path `a.b`. We set `a.b` to `true`:

```js
const res = fillMissingKeys(
  {
    a: {
      b: true, // <-- not placeholder but lower in data hierarchy (boolean)
      x: "x"
    },
    z: "z"
  },
  {
    a: {
      b: {
        c: false,
        d: false
      },
      x: false
    },
    z: false
  },
  {
    doNotFillThesePathsIfTheyContainPlaceholders: ["a.b"]
  }
);
console.log(`res = ${JSON.stringify(res, null, 4)}`);
// res = {
//   a: {
//     b: {
//       c: false, // <---- values added!
//       d: false, // <---- values added!
//     },
//     x: 'x',
//   },
//   z: 'z',
// }
```

If any of the branches in given `doNotFillThesePathsIfTheyContainPlaceholders` paths contain only placeholders **and are normalised**, they will be **truncated** (set to a placeholder you provide in the opts, or if you don't supply one, set to a default `false`):

```js
const res = fillMissingKeys(
  {
    // <--- input object
    a: {
      b: {
        // <--- this object in "b"'s value will be removed and set to placeholder "false"
        c: false,
        d: false
      },
      x: {
        // <--- this too
        y: false
      }
    },
    z: "z"
  },
  {
    // <--- schema object
    a: {
      b: {
        c: false,
        d: false
      },
      x: false
    },
    z: false
  },
  {
    // <--- settings
    doNotFillThesePathsIfTheyContainPlaceholders: ["lalala", "a.b", "a.x"]
  }
);
console.log(`res = ${JSON.stringify(res, null, 4)}`);
// res = {
//   a: {
//     b: false,
//     x: false,
//   },
//   z: 'z',
// }
```

**[⬆ back to top](#markdown-header-object-fill-missing-keys)**

### `opts.useNullAsExplicitFalse`

By default, if a value is `null`, this means it's an explicit `false`, which is used to completely diffuse any incoming "truthy" values. It's an ultimate "falsey" value.

For example:

```js
const res2 = fillMissingKeys(
  {
    // <--- object we're working on
    a: null
  },
  {
    // <--- reference schema
    a: ["z"]
  },
  {
    // <--- options
    useNullAsExplicitFalse: true
  }
);
console.log(
  `${`\u001b[${33}m${`res2`}\u001b[${39}m`} = ${JSON.stringify(res2, null, 4)}`
);
// => {
//      a: null,
//    }
```

But if you turn it off, usual [rules of merging](https://bitbucket.org/codsen/object-merge-advanced#purpose) apply and null, being towards the bottom of the value priority scale, gets trumped by nearly every other type of value (not to mention a non-empty array `['z']` in an example below):

```js
const res1 = fillMissingKeys(
  {
    // <--- object we're working on
    a: null
  },
  {
    // <--- reference schema
    a: ["z"]
  },
  {
    // <--- options
    useNullAsExplicitFalse: false
  }
);
console.log(
  `${`\u001b[${33}m${`res1`}\u001b[${39}m`} = ${JSON.stringify(res1, null, 4)}`
);
// => {
//      a: ['z'],
//    }
```

**[⬆ back to top](#markdown-header-object-fill-missing-keys)**

## Contributing

- If you **want a new feature** in this package or you would like us to change some of its functionality, raise an [issue on this repo](https://bitbucket.org/codsen/object-fill-missing-keys/issues/new).

- If you tried to use this library but it misbehaves, or **you need advice setting it up**, and its readme doesn't make sense, just document it and raise an [issue on this repo](https://bitbucket.org/codsen/object-fill-missing-keys/issues/new).

- If you would like to **add or change some features**, just fork it, hack away, and file a pull request. We'll do our best to merge it quickly. _Prettier_ is enabled, so you don't need to worry about the code style.

**[⬆ back to top](#markdown-header-object-fill-missing-keys)**

## Licence

MIT License (MIT)

Copyright © 2018 Codsen Ltd, Roy Revelt

[node-img]: https://img.shields.io/node/v/object-fill-missing-keys.svg?style=flat-square&label=works%20on%20node
[node-url]: https://www.npmjs.com/package/object-fill-missing-keys
[bitbucket-img]: https://img.shields.io/badge/repo-on%20BitBucket-brightgreen.svg?style=flat-square
[bitbucket-url]: https://bitbucket.org/codsen/object-fill-missing-keys
[cov-img]: https://coveralls.io/repos/bitbucket/codsen/object-fill-missing-keys/badge.svg?style=flat-square&branch=master
[cov-url]: https://coveralls.io/bitbucket/codsen/object-fill-missing-keys?branch=master
[deps2d-img]: https://img.shields.io/badge/deps%20in%202D-see_here-08f0fd.svg?style=flat-square
[deps2d-url]: http://npm.anvaka.com/#/view/2d/object-fill-missing-keys
[downloads-img]: https://img.shields.io/npm/dm/object-fill-missing-keys.svg?style=flat-square
[downloads-url]: https://npmcharts.com/compare/object-fill-missing-keys
[runkit-img]: https://img.shields.io/badge/runkit-test_in_browser-a853ff.svg?style=flat-square
[runkit-url]: https://npm.runkit.com/object-fill-missing-keys
[prettier-img]: https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square
[prettier-url]: https://prettier.io
[license-img]: https://img.shields.io/badge/licence-MIT-51c838.svg?style=flat-square
[license-url]: https://bitbucket.org/codsen/object-fill-missing-keys
