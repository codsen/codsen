# object-merge-advanced

> Recursive, deep merge of anything (objects, arrays, strings or nested thereof), which weighs contents by type hierarchy to ensure the maximum content is retained

[![Minimum Node version required][node-img]][node-url]
[![Repository is on GitLab][gitlab-img]][gitlab-url]
[![View dependencies as 2D chart][deps2d-img]][deps2d-url]
[![Downloads/Month][downloads-img]][downloads-url]
[![Test in browser][runkit-img]][runkit-url]
[![Code style: prettier][prettier-img]][prettier-url]
[![MIT License][license-img]][license-url]

## Table of Contents

- [Install](#install)
- [Purpose](#purpose)
- [In practice](#in-practice)
- [API](#api)
- [`opts.cb`](#optscb)
- [Difference from Lodash `_.merge`](#difference-from-lodash-_merge)
- [Difference from `Object.assign()`](#difference-from-objectassign)
- [Contributing](#contributing)
- [Licence](#licence)

## Install

```bash
npm i object-merge-advanced
```

The [_default_](https://exploringjs.com/es6/ch_modules.html#_default-exports-one-per-module) is exported, so instead of "`mergeAdvanced`" below, you can name the consumed function however you want.

Consume via a `require()`:

```js
const mergeAdvanced = require("object-merge-advanced");
```

or as an ES Module:

```js
import mergeAdvanced from "object-merge-advanced";
```

or for web pages, as a production-ready minified script file (so-called "UMD build"), straight from CDN:

```html
<script src="https://cdn.jsdelivr.net/npm/object-merge-advanced/dist/object-merge-advanced.umd.js"></script>
```

```js
// in which case you get a global variable "objectMergeAdvanced" which you consume like this:
const mergeAdvanced = objectMergeAdvanced;
```

This package has three builds in `dist/` folder:

| Type                                                                                                    | Key in `package.json` | Path                                | Size  |
| ------------------------------------------------------------------------------------------------------- | --------------------- | ----------------------------------- | ----- |
| Main export - **CommonJS version**, transpiled to ES5, contains `require` and `module.exports`          | `main`                | `dist/object-merge-advanced.cjs.js` | 14 KB |
| **ES module** build that Webpack/Rollup understands. Untranspiled ES6 code with `import`/`export`.      | `module`              | `dist/object-merge-advanced.esm.js` | 14 KB |
| **UMD build** for browsers, transpiled, minified, containing `iife`'s and has all dependencies baked-in | `browser`             | `dist/object-merge-advanced.umd.js` | 24 KB |

**[⬆ back to top](#)**

## Purpose

It's like Lodash `_.merge`, but it correctly merges different-type things and behaves well when it encounters _nested things_ like parsed HTML (lots of nested arrays, objects and strings).

---

Imagine, if we merged the identical keys of two objects judging their values by the hierarchy instead:

- non-empty array trumps all below
- non-empty plain object trumps all below
- non-empty string ...
- empty plain object ...
- empty array
- empty string
- number
- boolean
- `null`
- `undefined` doesn't trump anything

The idea is, we strive to retain **as much datum** as possible after merging. For example, you'd be better off with a non-empty string than with an empty array or boolean.

There are plenty of settings (mainly aimed at templating needs) but you can tap the callback and [override the result](#markdown-header-optscb) in any way you like.

**That's what this library does**

When `object-merge-advanced` merges two _objects_, it will recursively traverse each key and compare:

- If a key exists only in one of the objects, it goes straight into the result object.
- If a key exists on both, we got a clash. Key's value will be chosen judging by its value's type:
  - Arrays trump objects which trump strings which trump numbers which trump Booleans
  - Non-empty array as value trumps any object or string as value
  - Anything empty won't trump anything not empty
  - If both keys have plain object values, they'll get recursively fed back into the library again
  - Booleans will be merged using logical "OR"
  - Arrays will be merged, and if there are objects within, those objects will be merged smartly, depending if their keysets are similar. If not, objects will be merged as separate array elements.

There are ten possible combinations: 10 types of first input (object #1) and ten types of second input (object #2): non-empty (full) object, empty object, non-empty array, empty array, non-empty string, empty string, number, boolean, undefined and null.

![matching algorithm](https://glcdn.githack.com/codsen/codsen/raw/master/packages/object-merge-advanced/media/object-merge-advanced_algorithm.png)

A large number in the centre of a square shows which value prevails.

In the diagram above, the squares show **which value gets assigned to the merge result** — the first object's (marked `1`, pink fields) or second one's (marked `2`, sky blue fields).

In some cases, we perform a custom actions:

1.  passing value objects back into the main function _recursively_ (when both values are plain objects),
2.  when merging arrays, we pay extra attention to the options object (if present) and the contents of both arrays (taking special measures for objects within),
3.  Logical "OR" composition (when both values are Boolean).
4.  Not to mention, all the custom overrides you put in the [callback](#optscb) when overriding the result.

Check `test.js` unit tests to see this library in action.

**[⬆ back to top](#)**

## In practice

I use this library to merge humongous JSON files that house my templates' data. Booleans must be overwritten by strings/objects/arrays, but only non-empty-ones. This library can do such merging.

Also, I use it in small cases where `Object.assign` is not suitable, for example, when filling missing keys in a plain object or doing other operations on objects coming from JSON files.

**[⬆ back to top](#)**

## API

```js
mergeAdvanced(input1, input2 [, { options }])
```

### API - Input

| Input argument | Type         | Obligatory? | Description                                                                                           |
| -------------- | ------------ | ----------- | ----------------------------------------------------------------------------------------------------- |
| `input1`       | Anything     | yes         | Normally an object literal, but array or string or whatever else will work too. Can be deeply nested. |
| `input2`       | Anything     | yes         | Second thing to merge with first-one, normally an object, but can be an array or something else.      |
| `options`      | Plain object | no          | Optionally, pass all settings in a plain object, as a third argument                                  |

| Options object's key                    | Value                     | Default | Description                                                                                                                                                                                                                                                                                                                                                                                                                      |
| --------------------------------------- | ------------------------- | ------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `{`                                     |                           |         |
| `cb`                                    | Function                  | `null`  | Allows you to intervene on each of merging actions, right before the values are returned. It gives you both values and suggested return result in a callback arguments. See [below](#optscb).                                                                                                                                                                                                                                    |
| `mergeObjectsOnlyWhenKeysetMatches`     | Boolean                   | `true`  | Controls the merging of the objects within arrays. See dedicated chapter below.                                                                                                                                                                                                                                                                                                                                                  |
| `ignoreKeys`                            | String / Array of strings | n/a     | These keys, if present on `input1`, will be kept and not merged, that is, changed. You can use wildcards.                                                                                                                                                                                                                                                                                                                        |
| `hardMergeKeys`                         | String / Array of strings | n/a     | These keys, if present on `input2`, will overwrite their counterparts on `input1` (if present) no matter what. You can use wildcards.                                                                                                                                                                                                                                                                                            |
| `mergeArraysContainingStringsToBeEmpty` | Boolean                   | `false` | If any arrays contain strings, resulting merged array will be empty IF this setting is set to `true`.                                                                                                                                                                                                                                                                                                                            |
| `oneToManyArrayObjectMerge`             | Boolean                   | `false` | If one array has one object, but another array has many objects, when `oneToManyArrayObjectMerge` is `true`, each object from "many-objects" array will be merged with that one object from "one-object" array. Handy when setting defaults on JSON data structures.                                                                                                                                                             |
| `hardMergeEverything`                   | Boolean                   | `false` | If there's a clash of anywhere, second argument's value will always overwrite first one's. That's a unidirectional merge.                                                                                                                                                                                                                                                                                                        |
| `ignoreEverything`                      | Boolean                   | `false` | If there's a clash of anywhere, first argument's value will always overwrite the second one's. That's a unidirectional merge.                                                                                                                                                                                                                                                                                                    |
| `concatInsteadOfMerging`                | Boolean                   | `true`  | If it's `true` (default), when object keys clash and their values are arrays, when merging, [concatenate](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/concat) those arrays. If it's `false`, array contents from the first argument object's key will go intact into final result, but second array's contents will be added into result only if they don't exist in the first array. |
| `dedupeStringsInArrayValues`            | Boolean                   | `false` | When we merge two values and they are arrays, full of strings and only strings, this option allows to dedupe the resulting array of strings. Setting should be used in conjunction with `concatInsteadOfMerging` to really ensure than resulting string array contains only unique strings.                                                                                                                                      |
| `mergeBoolsUsingOrNotAnd`               | Boolean                   | `true`  | When two values are Booleans, by default, result will be calculated using logical `OR` on them. If you switch this to `false`, merging will use logical `AND`. Former setting is handy when dealing with JSON content driving email templates, latter is handy when merging [settings](https://github.com/codsen/csv-sort-cli/blob/master/cli.js) ("off", `false` overrides default "on", `true`).                               |
| `useNullAsExplicitFalse`                | Boolean                   | `false` | When set to `true`, `null` vs. anything (argument order doesn't matter) will yield `null`. This is used in data structures as an explicit "false" to "turn off" incoming defaults for good without the need of extra values or wrapping with conditionals in templates.                                                                                                                                                          |
| `hardArrayConcat`                       | Boolean                   | `false` | When set to `true`, an array vs. array merge will always result from a concat operation from the `input1` parameter with `input2`, no matter which items are contained on those arrays.                                                                                                                                                                                                                                          |
| `hardArrayConcatKeys`                   | String / Array of strings | n/a     | These keys, if present on `input1` will force hardArrayConcat option on those values. You can use wildcards.                                                                                                                                                                                                                                                                                                                     |
| `}`                                     |                           |         |

Here are all defaults in one place:

```js
{
  cb: null,
  mergeObjectsOnlyWhenKeysetMatches: true,
  ignoreKeys: undefined,
  hardMergeKeys: undefined,
  mergeArraysContainingStringsToBeEmpty: false,
  oneToManyArrayObjectMerge: false,
  hardMergeEverything: false,
  ignoreEverything: false,
  concatInsteadOfMerging: true,
  dedupeStringsInArrayValues: false,
  mergeBoolsUsingOrNotAnd: true,
  useNullAsExplicitFalse: false,
  hardArrayConcat: false,
  hardArrayConcatKeys: undefined,
}
```

**[⬆ back to top](#)**

### API - Output

A merged thing is returned. It's probably the same type as your inputs.

Objects or arrays in the inputs are **not mutated**. This is very important.

## `opts.cb`

You can name the arguments of your callback function any way you like, only _the order_ matters.

| Argument | Name                                                                                                           | Purpose                                                                                                                                                                    |
| -------- | -------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `1st`    | `inputArg1` (call it anyway you like; for example, same as in `Array.forEach`, name the variables as you wish) | It's the _value_ of the key that's clashing; comes from **first** main input argument (named `input1` above)                                                               |
| `2nd`    | `inputArg2` (call it anyway you like — only its position in a row matters)                                     | It's the _value_ of the key that's clashing; comes from **second** main input argument (named `input2` above)                                                              |
| `3rd`    | `resultAboutToBeReturned` (call it anyway you like)                                                            | Algorithm already decided what the result would normally be, if you were not using the callback. It's that result here.                                                    |
| `4th`    | `infoObj` (same — variable's name is arbitrary)                                                                | This plain object contains the location info about the keys: key names and full paths, plus, the type of the parent (array or object). See the details in the table below. |

**Remember always to return either 3rd arg. `resultAboutToBeReturned` or something else because otherwise `undefined` will be written as a result of the particular merge.**

Fourth argument, `infoObj` is a plain object and will contain keys:

| `infoObj` key | Type                                                                | Purpose                                                                                                                                                                |
| ------------- | ------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `path`        | String                                                              | By definition keys clash when two objects have them both at the same path. Therefore, callback will contain only one path value, which applies to both clashing sides. |
| `key`         | String                                                              | If it's an object, that's the name of the keys whose values are clashing and being merged                                                                              |
| `type`        | Array of two strings, usually each being either "object" or "array" | Sometimes you might want to be able to distinguish values of arrays from values that belong to plain objects that are being merged.                                    |

Callback allows you to intervene on each of merging actions, right before the values are returned. It gives you both values (first two arguments), suggested return result (3rd argument) and info object (4th argument) in a callback arguments. Whatever you return from your callback function is then written as a final value. If you don't want to do anything, just return that third argument. But you can return something different.

Callback is very powerful — you could pretty much use it instead of all the options listed higher.

For example, `opts.ignoreEverything` would be the same as returning the first argument in the callback instead of third. You can name arguments (`inputArg1` and others) any way you like, only _their order_ matters.

```js
mergeAdvanced(
  {
    ...
  },
  {
    ...
  },
  {
    cb: (inputArg1, inputArg2, resultAboutToBeReturned, infoObj) => {
      // whatever you return here gets written as the value of clashing keys:
      return inputArg1
    },
  },
)
```

Also, `opts.hardMergeEverything` setting would be the same as returning callback's second argument in every case:

```js
mergeAdvanced(
  {
    ...
  },
  {
    ...
  },
  {
    cb: (inputArg1, inputArg2, resultAboutToBeReturned, infoObj) => {
      // whatever you return here gets written as the value of clashing keys:
      return inputArg2
    },
  },
)
```

**[⬆ back to top](#)**

### `opts.cb` bigger example, number one

For example, we want to hard-merge (meaning, when values clash, second argument's value always prevails) only the Boolean values, keeping the normal merging algorithm the same for the rest of the types.

We use the _callback_, passing it in the options. Inside, we check the types and instead of suggested result (third argument), we return the second argument - value from the second argument:

```js
const res = mergeAdvanced(
  {
    // input #1
    a: {
      b: true,
      c: false,
      d: true,
      e: false
    },
    b: "test"
  },
  {
    // input #2
    a: {
      b: false,
      c: true,
      d: true,
      e: false
    },
    b: "" // <---- checking to make sure this empty string will not be hard-merged over "b" from input #1
  },
  {
    cb: (inputArg1, inputArg2, resultAboutToBeReturned, infoObj) => {
      if (typeof inputArg1 === "boolean" && typeof inputArg2 === "boolean") {
        return inputArg2;
      }
      return resultAboutToBeReturned;
    }
  }
);
console.log(`res = ${JSON.stringify(res, null, 4)}`);
// result:
// {
//   a: {
//     b: false,
//     c: true,
//     d: true,
//     e: false,
//   },
//   b: 'test', // <---- notice how hard merging on Bools didn't affect string
// }
```

**[⬆ back to top](#)**

### `opts.cb` bigger example, number two

Another example, we want to **wrap** the values of what was merged with double curly braces (`{{` and `}}`), but **only if they are strings**. Kindof logical, if you consider Booleans, null or plain objects will be clashing when the algorithm traverses each and every nested value.

Easy:

```js
const res = mergeAdvanced(
  {
    a: {
      b: "old value for b",
      c: "old value for c",
      d: "old value for c",
      e: "old value for d"
    },
    b: false
  },
  {
    a: {
      b: "var1", // <--- in this case, it will be non-empty-string vs. non-empty-string
      c: "var2", //      clashes, where second input's string goes to the result.
      d: "var3",
      e: "var4"
    },
    b: null
  },
  {
    cb: (inputArg1, inputArg2, resultAboutToBeReturned, infoObj) => {
      if (typeof resultAboutToBeReturned === "string") {
        return `{{ ${resultAboutToBeReturned} }}`; // <--- use template literals
      }
      return resultAboutToBeReturned;
    }
  }
);
console.log(`res = ${JSON.stringify(res, null, 4)}`);
// => {
//      a: {
//        b: '{{ var1 }}',
//        c: '{{ var2 }}',
//        d: '{{ var3 }}',
//        e: '{{ var4 }}',
//      },
//      b: false, // <-- notice Boolean was not touched
//    }
```

Whatever you return from the _callback_ will be written as a result of a clash, so make sure you return either `resultAboutToBeReturned` (third argument in the callback), or something to substitute it. Otherwise, `undefined` will be written.

**[⬆ back to top](#)**

### `opts.cb` another example, using paths of the keys to override the merge

Let's say you want to perform a regular merge on two objects, except a certain key merges need to be concatenated.

```js
let obj1 = {
  key: "a",
  x: "z"
};

let obj2 = {
  key: "b",
  x: "y"
};
```

You are fine with `y` from `obj2` overwriting `x` BUT you want values `a` and `b` concatenated (into `ab`).

To illustrate the case, I'll put the key deeper to show you how the paths work:

```js
const res = mergeAdvanced(
  {
    x: {
      key: "a", // <------- concatenate this
      c: "c val 1",
      d: "d val 1",
      e: "e val 1"
    },
    z: {
      key: "z.key val 1"
    }
  },
  {
    x: {
      key: "b", // <------- with this, but only this path
      c: "c val 2",
      d: "d val 2",
      e: "e val 2"
    },
    z: {
      key: "z.key val 2" // <---- even though this key is also same-named
    }
  },
  {
    cb: (inputArg1, inputArg2, resultAboutToBeReturned, infoObj) => {
      if (infoObj.path === "x.key") {
        // here are all the contents of the "infoObj":
        console.log(
          `${`\u001b[${33}m${`infoObj`}\u001b[${39}m`} = ${JSON.stringify(
            infoObj,
            null,
            4
          )}`
        );
        return (
          `${
            typeof inputArg1 === "string" && inputArg1.length > 0
              ? inputArg1
              : ""
          }` +
          `${
            typeof inputArg2 === "string" && inputArg2.length > 0
              ? inputArg2
              : ""
          }`
        );
      }
      return resultAboutToBeReturned;
    }
  }
);
// ==> {
//       x: {
//         key: "ab",   // <---------------- concatenated
//         c: "c val 2",
//         d: "d val 2",
//         e: "e val 2"
//       },
//       z: {
//         key: "z.key val 2"
//       }
//     }
```

**[⬆ back to top](#)**

### `opts.mergeObjectsOnlyWhenKeysetMatches` use cases

`mergeObjectsOnlyWhenKeysetMatches` is an extra insurance from accidental merging two objects within arrays, where key sets are too different (both have at least one unique key).

For example:

Let's merge these two objects. Notice that each has a unique key (`yyyy` and `xxxx` in the object that sits within the first position of each array).

```js
// #1
const obj1 = {
  a: [
    {
      a: "a",
      b: "b",
      yyyy: "yyyy"
    }
  ]
};

const obj2 = {
  a: [
    {
      xxxx: "xxxx",
      b: "b",
      c: "c"
    }
  ]
};

const res1 = mergeAdvanced(object1, object2);

console.log("res1 = " + JSON.stringify(res1, null, 4));
// => {
//      a: [
//        {
//          a: 'a',
//          b: 'b',
//          yyyy: 'yyyy'
//        },
//        {
//          xxxx: 'xxxx',
//          b: 'b',
//          c: 'c'
//        }
//      ]
//    }
```

but if you turn off the safeguard, `{ mergeObjectsOnlyWhenKeysetMatches: false }` each object within an array is merged no matter their differences in the keysets:

```js
const res2 = mergeAdvanced(object1, object2, {
  mergeObjectsOnlyWhenKeysetMatches: false
});
console.log("res2 = " + JSON.stringify(res2, null, 4));
// => {
//      a: [
//        {
//          a: 'a',
//          b: 'b',
//          yyyy: 'yyyy',
//          xxxx: 'xxxx',
//          c: 'c'
//        }
//      ]
//    }
```

**[⬆ back to top](#)**

## Difference from Lodash `_.merge`

Lodash [\_.merge](https://lodash.com/docs/#merge) gets stuck when encounters a mismatching type values within plain objects. It's neither suitable for merging AST's, nor for deep recursive merging.

## Difference from `Object.assign()`

`Object.assign()` is just a hard overwrite of all existing keys, from one object to another. It does not weigh the types of the input values and will happily overwrite the string value with a boolean placeholder.

`Object.assign()` is not for merging data objects, it's for _setting defaults_ in the options objects.

For example, in my email template builds, I import SCSS variables file as an object. I also import variables for each template, and template variables object overwrites anything existing in SCSS variables object.

That's because I want to be able to overwrite global colours per-template when needed.

Now imagine, we're merging those two objects, and SCSS variables object has a key `"mainbgcolor": "#ffffff"`. Now, a vast majority of templates don't need any customisation for the main background, therefore in their content JSON files the key is set to default, Boolean `false`: `"mainbgcolor": false`.

If merging were done using `object-assign`, placeholder `false` would overwrite real string value `"#ffffff`. That means, HTML would receive "false" as a CSS value, which is pink!

If merging were done using `object-merge-advanced`, all would be fine, because String trumps Boolean — placeholder `false`s would not overwrite the default SCSS string values.

**[⬆ back to top](#)**

## Contributing

- If you see an error, [raise an issue](<https://gitlab.com/codsen/codsen/issues/new?issue[title]=object-merge-advanced%20package%20-%20put%20title%20here&issue[description]=**Which%20package%20is%20this%20issue%20for**%3A%20%0Aobject-merge-advanced%0A%0A**Describe%20the%20issue%20(if%20necessary)**%3A%20%0A%0A%0A%2Fassign%20%40revelt>).
- If you want a new feature but can't code it up yourself, also [raise an issue](<https://gitlab.com/codsen/codsen/issues/new?issue[title]=object-merge-advanced%20package%20-%20put%20title%20here&issue[description]=**Which%20package%20is%20this%20issue%20for**%3A%20%0Aobject-merge-advanced%0A%0A**Describe%20the%20issue%20(if%20necessary)**%3A%20%0A%0A%0A%2Fassign%20%40revelt>). Let's discuss it.
- If you tried to use this package, but something didn't work out, also [raise an issue](<https://gitlab.com/codsen/codsen/issues/new?issue[title]=object-merge-advanced%20package%20-%20put%20title%20here&issue[description]=**Which%20package%20is%20this%20issue%20for**%3A%20%0Aobject-merge-advanced%0A%0A**Describe%20the%20issue%20(if%20necessary)**%3A%20%0A%0A%0A%2Fassign%20%40revelt>). We'll try to help.
- If you want to contribute some code, fork the [monorepo](https://gitlab.com/codsen/codsen/) via GitLab, then write code, then file a pull request on GitLab. We'll merge it in and release.

In monorepo, npm libraries are located in `packages/` folder. Inside, the source code is located either in `src/` folder (normal npm library) or in the root, `cli.js` (if it's a command-line application).

The npm script "`dev`", the `"dev": "rollup -c --dev --silent"` builds the development version retaining all `console.log`s with row numbers. It's handy to have [js-row-num-cli](https://www.npmjs.com/package/js-row-num-cli) installed globally so you can automatically update the row numbers on all `console.log`s.

**[⬆ back to top](#)**

## Licence

MIT License

Copyright (c) 2015-2019 Roy Revelt and other contributors

[node-img]: https://img.shields.io/node/v/object-merge-advanced.svg?style=flat-square&label=works%20on%20node
[node-url]: https://www.npmjs.com/package/object-merge-advanced
[gitlab-img]: https://img.shields.io/badge/repo-on%20GitLab-brightgreen.svg?style=flat-square
[gitlab-url]: https://gitlab.com/codsen/codsen/tree/master/packages/object-merge-advanced
[deps2d-img]: https://img.shields.io/badge/deps%20in%202D-see_here-08f0fd.svg?style=flat-square
[deps2d-url]: http://npm.anvaka.com/#/view/2d/object-merge-advanced
[downloads-img]: https://img.shields.io/npm/dm/object-merge-advanced.svg?style=flat-square
[downloads-url]: https://npmcharts.com/compare/object-merge-advanced
[runkit-img]: https://img.shields.io/badge/runkit-test_in_browser-a853ff.svg?style=flat-square
[runkit-url]: https://npm.runkit.com/object-merge-advanced
[prettier-img]: https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square
[prettier-url]: https://prettier.io
[license-img]: https://img.shields.io/badge/licence-MIT-51c838.svg?style=flat-square
[license-url]: https://gitlab.com/codsen/codsen/blob/master/LICENSE
