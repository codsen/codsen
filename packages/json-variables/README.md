# json-variables

> Preprocessor for JSON to allow keys referencing keys

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
- [Idea - updated for v.7 - full rewrite](#markdown-header-idea-updated-for-v7-full-rewrite)
- [API](#markdown-header-api)
- [Use examples](#markdown-header-use-examples)
- [Contributing](#markdown-header-contributing)
- [Licence](#markdown-header-licence)

## Install

```bash
npm i json-variables
```

```js
// consume via a CommonJS require():
const jsonVariables = require("json-variables");
// or as an ES Module:
import jsonVariables from "json-variables";
```

Here's what you'll get:

| Type                                                                                                    | Key in `package.json` | Path                         | Size  |
| ------------------------------------------------------------------------------------------------------- | --------------------- | ---------------------------- | ----- |
| Main export - **CommonJS version**, transpiled to ES5, contains `require` and `module.exports`          | `main`                | `dist/json-variables.cjs.js` | 19 KB |
| **ES module** build that Webpack/Rollup understands. Untranspiled ES6 code with `import`/`export`.      | `module`              | `dist/json-variables.esm.js` | 20 KB |
| **UMD build** for browsers, transpiled, minified, containing `iife`'s and has all dependencies baked-in | `browser`             | `dist/json-variables.umd.js` | 95 KB |

**[⬆ back to top](#markdown-header-json-variables)**

## Idea - updated for v.7 - full rewrite

This library allows JSON keys to reference other keys. It is aimed at JSON files which are used as means to store the _data_ part, separate from the template code.

- `<=v6.x` was resolving variables from the root to the branch tip. This was apparently a bad idea and `v7.x` fixes that. Now resolving is done from the tips down to the root.
- `<=v6.x` had data stores but it referenced only the same level as the variable AND root level when checking for values when resolving. This was not good. The `v7.x` now looks every single level upward, from the current to the root, plus data stores on each level. This, combined with tips-to-root resolving means now, for the first time, you have true freedom to cross-reference the variables any way you like (as long as there are no loop in the resolved variable chain). Previously, on `<=v6.x`, the scope of second-level variable references was lost and since resolving started from the root, it instantly received a variable with a lost scope (for data store lookup, for example). Not any more.
- Using `<=v6.x` in production I also found out how unhelpful the error messages were (not to mention in 90% of the error cases, errors were not real, only resolving algorithm shortcomings). I went extra mile in this rewrite to provide not only the path of the variables being resolved, but also the piece of the _whole source object_.
- In `v7.x`, I also switched to strictly [`object-path`](https://www.npmjs.com/package/object-path) notation.
- Additionally, `v7.x` uses the latest tools I created since coding the original core of `json-variables`. For example, variable extraction is now done using a separate library, [string-find-heads-tails](https://github.com/codsen/string-find-heads-tails).

I know, these architectural mistakes look no-brainers _now_ but trust me, they were not so apparent when the original `json-variables` idea was conceived. Also, I didn't anticipate this amount of variable-cross-referencing happening in real production, which was beyond anything that unit tests could imitate.

**[⬆ back to top](#markdown-header-json-variables)**

## API

**jsonVariables (inputObj, \[options])**

Returns a plain object with all variables resolved.

#### inputObj

Type: `object` - a plain object. Usually, a parsed JSON file.

#### options

Type: `object` - an optional options object. (PS. Nice accidental rhyming)

| `options` object's key                 | Type                       | Obligatory? | Default | Description                                                                                                                                                                                                                                                                                                                                                                                                                  |
| -------------------------------------- | -------------------------- | ----------- | ------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| {                                      |                            |             |         |
| `heads`                                | String                     | no          | `%%_`   | How do you want to mark the beginning of a variable?                                                                                                                                                                                                                                                                                                                                                                         |
| `tails`                                | String                     | no          | `_%%`   | How do you want to mark the ending of a variable?                                                                                                                                                                                                                                                                                                                                                                            |
| `headsNoWrap`                          | String                     | no          | `%%-`   | How do you want to mark the beginning of a variable, which you definitely don't want to be wrapped?                                                                                                                                                                                                                                                                                                                          |
| `tailsNoWrap`                          | String                     | no          | `-%%`   | How do you want to mark the ending of a variable, which you definitely don't want to be wrapped?                                                                                                                                                                                                                                                                                                                             |
| `lookForDataContainers`                | Boolean                    | no          | `true`  | You can put a separate dedicated key, named similarly, where the values for variables are placed.                                                                                                                                                                                                                                                                                                                            |
| `dataContainerIdentifierTails`         | String                     | no          | `_data` | If you do put your variables in dedicated keys besides, those keys will have to be different somehow. We suggest appending a string to the key's name — tell here what string.                                                                                                                                                                                                                                               |
| `wrapHeadsWith`                        | String                     | no          | n/a     | We can optionally wrap each resolved string with a string. One to the left is called "heads", please tell what string to use.                                                                                                                                                                                                                                                                                                |
| `wrapTailsWith`                        | String                     | no          | n/a     | We can optionally wrap each resolved string with a string. One to the right is called "tails", please tell what string to use.                                                                                                                                                                                                                                                                                               |
| `dontWrapVars`                         | Array of strings OR String | no          | n/a     | If any of the variables (surrounded by `heads` and `tails`) can be matched by string(s) given here, it won't be wrapped with `wrapHeadsWith` and `wrapTailsWith`. You can put **wildcards** (\*) to note zero or more characters.                                                                                                                                                                                            |
| `preventDoubleWrapping`                | Boolean                    | no          | `true`  | If you use `wrapHeadsWith` and `wrapTailsWith`, we can make sure the existing string does not contain these already. It's to prevent double/triple/multiple wrapping.                                                                                                                                                                                                                                                        |
| `wrapGlobalFlipSwitch`                 | Boolean                    | no          | `true`  | Global flip switch to turn off the variable wrapping function completely, everywhere.                                                                                                                                                                                                                                                                                                                                        |
| `noSingleMarkers`                      | Boolean                    | no          | `false` | If any value in the source object has only and exactly heads or tails: a) do throw mismatched marker error (`true`) or b) don't (`false`)                                                                                                                                                                                                                                                                                    |
| `resolveToBoolIfAnyValuesContainBool`  | Boolean                    | no          | `true`  | The very first moment Boolean is merged into a string value, it turns the whole value to its value. Permanently. Nothing else matters. When `false` and there's a mix of Strings and Booleans, Boolean is resolved into empty string. When the value is just a reference marker, upon resolving it will be intact Boolean. This setting is relevant when there's mixing of strings and Booleans - what to do in those cases. |
| `resolveToFalseIfAnyValuesContainBool` | Boolean                    | no          | `true`  | When there's a mix of string and Boolean, resolve to `false`, no matter if the first encountered value is `true`. When there's no mix with strings, the value is retained as it was.                                                                                                                                                                                                                                         |
| `throwWhenNonStringInsertedInString`   | Boolean                    | no          | `false` | By default, if you want you can put objects as values into a string, you'll get `text text ... [object Object] text text ...`. If you want the renderer to `throw` an error instead when this happens, set this setting's key to `true`.                                                                                                                                                                                     |
| }                                      |                            |             |         |

**Defaults**:

```js
{
  heads: '%%_',
  tails: '_%%',
  headsNoWrap: '%%-',
  tailsNoWrap: '-%%',
  lookForDataContainers: true,
  dataContainerIdentifierTails: '_data',
  wrapHeadsWith: '',
  wrapTailsWith: '',
  dontWrapVars: [],
  preventDoubleWrapping: true,
  wrapGlobalFlipSwitch: true,
  noSingleMarkers: false,
  resolveToBoolIfAnyValuesContainBool: true,
  resolveToFalseIfAnyValuesContainBool: true,
  throwWhenNonStringInsertedInString: false
}
```

**[⬆ back to top](#markdown-header-json-variables)**

## Use examples

If you don't care how to mark the variables, use my notation, `%%_`, to mark a beginning of a variable (further called _heads_) and `_%%` to mark ending (further called _tails_).

Check this:

```js
const jv = require("json-variables");
var res = jv({
  a: "some text %%_var1_%% more text %%_var2_%%",
  b: "something",
  var1: "value1",
  var2: "value2"
});
console.log("res = " + JSON.stringify(res, null, 4));
// ==> {
//       a: 'some text value1 more text value2',
//       b: 'something',
//       var1: 'value1',
//       var2: 'value2'
//     }
```

You can declare your way to mark variables, your own _heads_ and _tails_. For example, `{` and `}`:

```js
const jv = require("json-variables");
var res = jv(
  {
    a: "some text {var1} more text {var2}",
    b: "something",
    var1: "value1",
    var2: "value2"
  },
  {
    heads: "{",
    tails: "}"
  }
);
console.log("res = " + JSON.stringify(res, null, 4));
// => {
//      a: 'some text value1 more text value2',
//      b: 'something',
//      var1: 'value1',
//      var2: 'value2'
//    }
```

You can also wrap all resolved variables with strings, a new pair of _heads_ and _tails_, using `opts.wrapHeadsWith` and `opts.wrapTailsWith`. For example, bake some Java, wrap your variables with `${` and `}`:

```js
const jv = require("json-variables");
var res = jv(
  {
    a: "some text %%_var1_%% more text %%_var2_%%",
    b: "something",
    var1: "value1",
    var2: "value2"
  },
  {
    wrapHeadsWith: "${",
    wrapTailsWith: "}",
    dontWrapVars: ["*zzz", "*3", "*6"]
  }
);
console.log("res = " + JSON.stringify(res, null, 4));
// => {
//      a: 'some text ${value1} more text ${value2}',
//      b: 'something',
//      var1: 'value1',
//      var2: 'value2'
//    }
```

If variables reference keys which have values that reference other keys, that's fine. Just ensure there's _no closed loop_. Otherwise, renderer will `throw` and error.

```js
const jv = require("json-variables");
var res = jv({
  a: "%%_b_%%",
  b: "%%_c_%%",
  c: "%%_d_%%",
  d: "%%_e_%%",
  e: "%%_b_%%"
});
console.log("res = " + JSON.stringify(res, null, 4));
// THROWS because "e" loops to "b" forming an infinite loop.
```

This one's OK:

```js
const jv = require("json-variables");
var res = jv({
  a: "%%_b_%%",
  b: "%%_c_%%",
  c: "%%_d_%%",
  d: "%%_e_%%",
  e: "zzz"
});
console.log("res = " + JSON.stringify(res, null, 4));
// => {
//      a: 'zzz',
//      b: 'zzz',
//      c: 'zzz',
//      d: 'zzz',
//      e: 'zzz'
//    }
```

Variables can also reference deeper levels within objects and arrays — just put dot like `variable.key.subkey`:

```js
const jv = require("json-variables");
var res = jv(
  {
    a: "some text %%_var1.key1_%% more text %%_var2.key2_%%",
    b: "something",
    var1: { key1: "value1" },
    var2: { key2: "value2" }
  },
  {
    wrapHeadsWith: "%%=",
    wrapTailsWith: "=%%",
    dontWrapVars: ["*zzz", "*3", "*6"]
  }
);
console.log("res = " + JSON.stringify(res, null, 4));
// => {
//      a: 'some text %%=value1=%% more text %%=value2=%%',
//      b: 'something',
//      var1: {key1: 'value1'},
//      var2: {key2: 'value2'}
//    }
```

**[⬆ back to top](#markdown-header-json-variables)**

### Data containers

Data-wise, if you looked at a higher level, it might appear clunky to put values as _separate values_, like in examples above. Saving you time scrolling up, check this out:

```js
{
  a: 'some text %%_var1_%% more text %%_var2_%%',
  b: 'something',
  var1: 'value1',
  var2: 'value2'
}
```

Does this look like clean data arrangement? Hell no. It's convoluted and nasty. The keys `var1` and `var2` are not of the same status as an `a` and `b`, therefore can't be mashed together at the same level, can it?

What if we placed all key's `a` variables within a separate key, `a_data` — it starts with the same letter, so it will end up being nearby the `a` after sorting. Observe:

```js
{
  a: 'some text %%_var1_%% more text %%_var2_%%',
  a_data: {
    var1: 'value1',
    var2: 'value2'
  },
  b: 'something'
}
```

That's better, isn't it? I think so too.

To set this up, you can rely on my default way of naming data keys (appending `_data`) or you can customise how to call data keys using `opts.dataContainerIdentifierTails`. On the other hand, you can also turn off this function completely via `opts.lookForDataContainers` and force all values to be the keys at the same level as the current variable's key.

```js
const jv = require("json-variables");
var res = jv({
  a: "some text %%_var1_%% more text %%_var3_%%.",
  a_data: {
    var1: "value1",
    var3: "333333"
  },
  b: "something"
});
console.log("res = " + JSON.stringify(res, null, 4));
// => {
//      a: 'some text value1 more text 333333.',
//      b: 'something',
//      a_data: {
//        var1: 'value1',
//        var3: '333333'
//      }
//    }
```

Data container keys can also contain objects or arrays. Just query the whole path:

```js
const jv = require("json-variables");
var res = jv({
  a: "some text %%_var1.key1.key2.key3_%% more text %%_var3_%%.",
  a_data: {
    var1: { key1: { key2: { key3: "value1" } } },
    var3: "333333"
  },
  b: "something"
});
console.log("res = " + JSON.stringify(res, null, 4));
// => {
//      a: 'some text value1 more text 333333.',
//      b: 'something',
//      a_data: {
//        var1: {key1: {key2: {key3: 'value1'}}},
//        var3: '333333'
//      }
//    }
```

**[⬆ back to top](#markdown-header-json-variables)**

### Ignores with wildcards

You can ignore the wrapping on any keys by supplying their name patterns in the options array, `dontWrapVars` value. It can be array or string and also it can contain wildcards:

```js
const jv = require("json-variables");
var res = jv(
  {
    a: "%%_b_%%",
    b: "%%_c_%%",
    c: "val"
  },
  {
    wrapHeadsWith: "{",
    wrapTailsWith: "}",
    dontWrapVars: ["b*", "c*"]
  }
);
console.log("res = " + JSON.stringify(res, null, 4));
// => {
//      a: 'val', <<< didn't get wrapped
//      b: 'val', <<< also didn't get wrapped
//      c: 'val'
//    }
```

**[⬆ back to top](#markdown-header-json-variables)**

### Wrapping

**Challenge:**

> How do you wrap one instance of a variable, but not another, when both are in the same string?

**Solution**: Alternative `heads` and `tails`, which are always non-wrapping: `opts.headsNoWrap` and `opts.tailsNoWrap`. Default values are: `%%-` and `-%%`. You can customise them to anything you want.

For example:

```json
{
  "key": "%%-firstName-%% will not get wrapped but this one will: %%_firstName_%%",
  "firstName": "John"
}
```

When processed with options `{ wrapHeadsWith: '{{ ', wrapTailsWith: ' }}' }`, it will be:

```json
{
  "key": "John will not get wrapped but this one will: {{ John }}",
  "firstName": "John"
}
```

**[⬆ back to top](#markdown-header-json-variables)**

#### In practice:

Wrapping of the variables is an essential feature when working with data structures that need to be adapted for both back-end and front-end. For the development, preview build you might want `John` as a first name, but for back-end build, you might want `{{ user.firstName }}`.

The following example shows how to "bake" HTML sprinkled with [Nunjucks](https://mozilla.github.io/nunjucks/templating.html) notation (or any members of Jinja-like templating languages that use double curly braces):

HTML template:

```html
<div>{{ hero_title_wrapper }}</div>
```

JSON for DEV build (a preview build to check how everything looks):

```json
{
  "hero_title_wrapper": "%%_hero_title_%%",
  "hero_title": "Hi %%_first_name_%%, check out our seasonal offers!",
  "hero_title_alt": "Hi, check out our seasonal offers!",
  "first_name": "John"
}
```

In the above, `hero_title_wrapper` basically redirects to `hero_title`, which pulls `John` as a first name. The alternative title's text is used when `first_name` is missing.

JSON for PROD version is minimal, only overwriting what's different/new (to keep it DRY):

```json
{
  "first_name": "user.firstName"
}
```

We'll process the [merged](https://www.npmjs.com/package/object-merge-advanced) object of DEV and PROD JSON contents using `{ wrapHeadsWith: '{{ ', wrapTailsWith: ' }}' }`, which instructs to wrap any resolved variables with `{{` and `}}`.

In the end, our baked HTML template, ready to be put on the back-end will look like:

```html
<div>{{ user.firstName }}, check out our seasonal offers!</div>
```

So far so good, but what happens if we want to add a check, does `first_name` exist? Again in a Nunjucks templating language, it would be something like:

content JSON for PROD build:

```json
{
  "hero_title_wrapper": "{% if %%_first_name_%% %}%%_hero_title_%%{% else %}%%_hero_title_alt_%%{% endif %}",
  "first_name": "user.firstName"
}
```

with intention to bake the following HTML:

HTML template:

```html
<div>{% if user.firstName %}Hi {{ user.firstName }}, check out our seasonal offers!{% else %}Hi, check out our seasonal offers!{% endif %}</div>
```

Now notice that in the example above, the first `first_name` does not need to be wrapped with `{{` and `}}` because it's already in a Nunjucks statement, but the second one _does need to be wrapped_.

You solve this by using non-wrapping `heads` and `tails`. Keeping default values `opts.wrapHeadsWith` and `opts.wrapTailsWith` it would look like:

content JSON for PROD build:

```json
{
  "hero_title_wrapper": "{% if %%-first_name-%% %}%%_hero_title_%%{% else %}%%_hero_title_alt_%%{% endif %}",
  "first_name": "user.firstName"
}
```

Notice `%%-first_name-%%` above. The non-wrapping heads and tails instruct the program to **skip wrapping, no matter what**.

**[⬆ back to top](#markdown-header-json-variables)**

### Mixing Booleans and strings

Very often, in email templating, the inactive modules are marked with Boolean `false`. When modules have content, they are marked with strings. There are cases when you want to resolve the whole variable to Boolean if upon resolving you end up with a mix of strings and Booleans.

When `opts.resolveToBoolIfAnyValuesContainBool` is set to `true` (default), it will always resolve to the value of the first encountered Boolean value. When set to `false`, it will resolve Booleans to empty strings.

When `opts.resolveToFalseIfAnyValuesContainBool` and `opts.resolveToBoolIfAnyValuesContainBool` are set to `true` (both defaults), every mix of string(s) and Boolean(s) will resolve to Boolean `false`. If `opts.resolveToBoolIfAnyValuesContainBool` is set to false, but `opts.resolveToFalseIfAnyValuesContainBool` to true, the mixes of strings and Booleans will resolve to the value of the first encountered Boolean variable's value.

Observe:

```js
var res = jv({
  a: "zzz %%_b_%% zzz",
  b: true
});
console.log("res = " + JSON.stringify(res, null, 4));
// => {
//      a: false, // <<< It's because opts.resolveToFalseIfAnyValuesContainBool is default, true
//      b: true
//    }
```

```js
var res = jv(
  {
    a: "zzz %%_b_%% zzz",
    b: true
  },
  {
    resolveToFalseIfAnyValuesContainBool: false
  }
);
console.log("res = " + JSON.stringify(res, null, 4));
// => {
//      a: true, <<< It's because we have a mix of string and Boolean, and first encountered Boolean value is `true`
//      b: true
//    }
```

**[⬆ back to top](#markdown-header-json-variables)**

## Contributing

- If you **want a new feature** in this package or you would like us to change some of its functionality, raise an [issue on this repo](https://bitbucket.org/codsen/json-variables/issues/new).

- If you tried to use this library but it misbehaves, or **you need advice setting it up**, and its readme doesn't make sense, just document it and raise an [issue on this repo](https://bitbucket.org/codsen/json-variables/issues/new).

- If you would like to **add or change some features**, just fork it, hack away, and file a pull request. We'll do our best to merge it quickly. _Prettier_ is enabled, so you don't need to worry about the code style.

**[⬆ back to top](#markdown-header-json-variables)**

## Licence

MIT License (MIT)

Copyright © 2018 Codsen Ltd, Roy Revelt

[node-img]: https://img.shields.io/node/v/json-variables.svg?style=flat-square&label=works%20on%20node
[node-url]: https://www.npmjs.com/package/json-variables
[bitbucket-img]: https://img.shields.io/badge/repo-on%20BitBucket-brightgreen.svg?style=flat-square
[bitbucket-url]: https://bitbucket.org/codsen/json-variables
[cov-img]: https://coveralls.io/repos/bitbucket/codsen/json-variables/badge.svg?style=flat-square&branch=master
[cov-url]: https://coveralls.io/bitbucket/codsen/json-variables?branch=master
[deps2d-img]: https://img.shields.io/badge/deps%20in%202D-see_here-08f0fd.svg?style=flat-square
[deps2d-url]: http://npm.anvaka.com/#/view/2d/json-variables
[downloads-img]: https://img.shields.io/npm/dm/json-variables.svg?style=flat-square
[downloads-url]: https://npmcharts.com/compare/json-variables
[runkit-img]: https://img.shields.io/badge/runkit-test_in_browser-a853ff.svg?style=flat-square
[runkit-url]: https://npm.runkit.com/json-variables
[prettier-img]: https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square
[prettier-url]: https://prettier.io
[license-img]: https://img.shields.io/badge/licence-MIT-51c838.svg?style=flat-square
[license-url]: https://bitbucket.org/codsen/json-variables
