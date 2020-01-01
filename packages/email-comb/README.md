<div align="center">
  <img alt="EmailComb" src="https://cdn.statically.io/gl/codsen/codsen/master/packages/email-comb/media/repo_logo.png" width="480" align="center">
</div>

<div align="center"><p>Remove unused CSS from email templates</p></div>

[![Minimum Node version required][node-img]][node-url]
[![Repository is on GitLab][gitlab-img]][gitlab-url]
[![Coverage][cov-img]][cov-url]
[![View dependencies as 2D chart][deps2d-img]][deps2d-url]
[![Downloads/Month][downloads-img]][downloads-url]
[![Test in browser][runkit-img]][runkit-url]
[![Code style: prettier][prettier-img]][prettier-url]
[![MIT License][license-img]][license-url]

<div align="center"><p>Online web app: <a href="https://EmailComb.com">emailcomb.com</a></p></div>

## Table of Contents

- [Install](#install)
- [Idea](#idea)
- [API](#api)
- [Options - `opts.whitelist`](#options-optswhitelist)
- [Options - `opts.backend`](#options-optsbackend)
- [Tapping the stream in Gulp](#tapping-the-stream-in-gulp)
- [Extreme example of unused CSS](#extreme-example-of-unused-css)
- [Removing unused CSS from web pages](#removing-unused-css-from-web-pages)
- [Why it's important to be able to process HTML with back-end code](#why-its-important-to-be-able-to-process-html-with-back-end-code)
- [Contributing](#contributing)
- [Licence](#licence)

## Install

```bash
npm i email-comb
```

Consume via a `require()`:

```js
const { comb, defaults, version } = require("email-comb");
```

or as an ES Module:

```js
import { comb, defaults, version } from "email-comb";
```

or for web pages, as a production-ready minified script file (so-called "UMD build"), straight from CDN:

```html
<script src="https://cdn.jsdelivr.net/npm/email-comb/dist/email-comb.umd.js"></script>
```

```js
// in which case you get a global variable "emailComb" which you consume like this:
const { comb, defaults, version } = emailComb;
```

This package has three builds in `dist/` folder:

| Type                                                                                                    | Key in `package.json` | Path                     | Size  |
| ------------------------------------------------------------------------------------------------------- | --------------------- | ------------------------ | ----- |
| Main export - **CommonJS version**, transpiled to ES5, contains `require` and `module.exports`          | `main`                | `dist/email-comb.cjs.js` | 59 KB |
| **ES module** build that Webpack/Rollup understands. Untranspiled ES6 code with `import`/`export`.      | `module`              | `dist/email-comb.esm.js` | 60 KB |
| **UMD build** for browsers, transpiled, minified, containing `iife`'s and has all dependencies baked-in | `browser`             | `dist/email-comb.umd.js` | 70 KB |

**[⬆ back to top](#)**

## Idea

**This library removes unused CSS from HTML without parsing it**

STRENGTHS:

- Aimed at Email development but works everywhere where CSS is contained within the same file
- Accepts HTML **mixed** with other templating/programming languages
- Works on broken or incomplete or invalid HTML/XHTML code
- Works on both classes and id's
- Optionally uglifies the class or id names
- The algorithm will cope with style tags inside the `body` tag or multiple style tags
- Can strip CSS and HTML comments; recognises Outlook conditional comments (both "_if-Outlook_" and "_if-not-Outlook_")
- Has email-specific features like [removing](https://www.npmjs.com/package/regex-empty-conditional-comments) empty Outlook conditional comments
- Attempts to fix some code issues, for example, remove space in `< body` (which would otherwise break in Chrome)
- API contains no file I/O operations or anything front-end-related — it's "string-in, string-out"
- All dependencies are either our own or Lodash's or Mr Sindre Sorhus'
- CommonJS, ES Modules and UMD builds available, published to npm and available to consume via CDN's like unpkg.com
- Complete console logging set and retained in the source (which is automatically removed from builds)
- Modern setup: ava pointing at ES Modules build, Rollup bundling the builds, coverage high, prettier and ESLint in place
- It's not opinionated - it won't W3C-validate, enforce `DOCTYPE`'s or add any new code to your code. Some parsers, for example, just can't stand an HTML without a DOCTYPE.

WEAKNESSES:

- If you give a broken input, it will be processed too — usually bad code breaks parsers and that's how you find out that your code is bad. But in theory, linters are solutions for this, so it might be a _strength_.
- **Does not support external stylesheets** or JS injecting more classes (because it's an email development-oriented tool)

COMPETITORS:

We believe EmailComb is superior to all web-development-oriented unused CSS removal tools out there:

- [purgecss](https://github.com/FullHuman/purgecss)
- [purifycss](https://github.com/purifycss/purifycss)
- [uncss](https://github.com/uncss/uncss)

Try yourselves.

**[⬆ back to top](#)**

## API

This package exports a plain object: `{ comb, defaults, version }`.

Its key `comb` has a value which is the main function, you will call it `comb()`.
Its key `defaults` has a value, a plain object, which is defaults of the main function.
Its key `version` is a string, for example, "2.0.12" and mirrors same key `package.json`.

```js
comb(str, [options]);
```

**[⬆ back to top](#)**

### API - Input

| Input argument | Type         | Obligatory? | Description                               |
| -------------- | ------------ | ----------- | ----------------------------------------- |
| str            | String       | yes         | Your HTML file contents, as string        |
| options        | Plain object | no          | Any options, as a plain object, see below |

For example,

```js
// Require it first. You get a function which you can feed with strings:
const { comb } = require("email-comb");
// Let's define a string to work upon:
const html = '<html>zzz</html><body class="class-1">zzz</body>';
// Assign a new string to the output of this library:
const { result } = comb(html, {
  whitelist: [".class-1", "#id-1", ".module-*"]
});
// Log its result:
console.log("result = " + JSON.stringify(result, null, 4));
```

**[⬆ back to top](#)**

### API - Input - Options object

Optionally, you can pass the Optional Options Object as a second argument:

| Options object's key                             | Type                                      | Default             | Example                                                        | Description                                                                                                                                                                                                      |
| ------------------------------------------------ | ----------------------------------------- | ------------------- | -------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `whitelist`                                      | Array                                     | `[]`                | `[".class-1", "#id-1", ".module-*"]`                           | List all classes or id's you want this library to ignore. You can use all [matcher](https://www.npmjs.com/package/matcher) patterns.                                                                             |
| `backend`                                        | Array                                     | `[]`                | `[{ heads: "{{", tails: "}}" }, { heads: "{%", tails: "%}" }]` | If your code has back-end code within clss or id values, for example, `class="{{ red }} main-box"` you can stop `{{`, `red` and `}}` to be treated as class names                                                |
| `uglify`                                         | Boolean                                   | `false`             | n/a                                                            | Will rename all class and id names to be few characters-long. This might reduce your file size by another kilobyte.                                                                                              |
| `removeHTMLComments`                             | Boolean                                   | `true`              | n/a                                                            | When enabled, all HTML comments (`<!--` to `-->`) will be removed                                                                                                                                                |
| `doNotRemoveHTMLCommentsWhoseOpeningTagContains` | Array of zero or more insensitive strings | `["[if", "[endif"]` | n/a                                                            | Email code often contains Outlook or IE conditional comments which you probably don't want to remove. Whatever strings you list here, if comment's opening tag will contain these, that tag will not be removed. |
| `reportProgressFunc`                             | Function or something falsey              | `null`              | n/a                                                            | If supplied, it will ping the function you assign passing current percentage done (natural number) as an input argument                                                                                          |
| `reportProgressFuncFrom`                         | Natural number                            | `0`                 | n/a                                                            | By default, percentages are reported from 0 to 100. This value overrides this starting percentage value.                                                                                                         |
| `reportProgressFuncTo`                           | Natural number                            | `100`               | n/a                                                            | By default, percentages are reported from 0 to 100. This value overrides this ending percentage value.                                                                                                           |

Here are all options in one place in case you need to copy the whole thing:

```json5
{
  whitelist: [], // for example, [".class-1", "#id-1", ".module-*"]
  backend: [], // for example, [{ heads: "{{", tails: "}}" }, { heads: "{%", tails: "%}" }]
  uglify: false,
  removeHTMLComments: true,
  doNotRemoveHTMLCommentsWhoseOpeningTagContains: ["[if", "[endif"],
  reportProgressFunc: null,
  reportProgressFuncFrom: 0,
  reportProgressFuncTo: 100
}
```

**[⬆ back to top](#)**

### API - Output

For example, **output** could look like this:

```json5
{
  log: {
    timeTakenInMiliseconds: 55,
    traversedTotalCharacters: 504,
    traversedTimesInputLength: 4.24,
    originalLength: 118,
    cleanedLength: 87,
    bytesSaved: 32,
    percentageReducedOfOriginal: 27,
    nonIndentationsWhitespaceLength: 9,
    nonIndentationsTakeUpPercentageOfOriginal: 8,
    commentsLength: 10,
    commentsTakeUpPercentageOfOriginal: 1
  },
  result: "<html>...",
  countAfterCleaning: 3,
  countBeforeCleaning: 15,
  allInHead: allClassesAndIdsWithinHead,
  allInBody: allClassesAndIdsWithinBody,
  deletedFromHead: [".unused1", ".unused2"],
  deletedFromBody: [".unused1", ".unused1", "#unused1"]
}
```

So a **plain object** is returned. It will have the following keys:

| Key                   | Its value's type | Description                                                              |
| --------------------- | ---------------- | ------------------------------------------------------------------------ |
| `log`                 | Plain object     | Various information about performed operations                           |
| `result`              | String           | A string containing cleaned HTML                                         |
| `countBeforeCleaning` | Number           | How many unique classes and id's were in total before cleaning           |
| `countAfterCleaning`  | Number           | How many unique classes and id's were in total after cleaning            |
| `allInHead`           | Array            | Deduped and sorted array of all classes and `id`'s between `<head>` tags |
| `allInBody`           | Array            | Deduped and sorted array of all classes and `id`'s between `<body>` tags |
| `deletedFromHead`     | Array            | Array of classes/id's that were deleted inside `<head>` _at least once_^ |
| `deletedFromBody`     | Array            | Array of classes/id's that were deleted inside `<body>` _at least once_^ |

^ To be very precise, if class or id name was deleted at once, it gets in this list. Mind you, some used classes or id's can be sandwiched with unused (`.used.unused`) and end up removed in some instances and get reported here, but it does not mean they were removed completely as species.

**[⬆ back to top](#)**

## Options - `opts.whitelist`

Since the main purpose of this library is to clean **email** HTML, it needs to cater for email code specifics. One of them is that CSS styles will contain fix or hack styles, meant for email software. For example, here are few of them:

```html
#outlook a { padding:0; } .ExternalClass, .ReadMsgBody { width:100%; }
.ExternalClass, .ExternalClass div, .ExternalClass font, .ExternalClass p,
.ExternalClass span, .ExternalClass td { line-height:100%; }
```

You will not be using these classes within the `<body>` of your HTML code, so they would get removed as "unused" because they are present in `<head>` only. To avoid that, pass the classes, and `id`'s in the _whitelist_ key's value, as an array. For example:

```js
var html = "<!DOCTYPE html>...";
comb(html, {
  whitelist: ["#outlook", ".ExternalClass", ".ReadMsgBody"]
});
```

You can also use a _wildcard_, for example in order to whitelist classes `module-1`, `module-2` ... `module-99`, `module-100`, you can simply whitelist them as `module-*`:

```js
var html = "<!DOCTYPE html>...";
comb(html, {
  whitelist: [".module-*"]
});
// => all class names that begin with ".module-" will not be touched by this library.
```

**[⬆ back to top](#)**

## Options - `opts.backend`

This library, differently from competition, is aiming to support code which contains back-end code: other programming languages (Java JSP's), other templating languages (like Nunjucks) and/or proprietary ESP templating languages.

All different languages can be present in the input source, and parser won't care, EXCEPT when they are in class or id names. For example, `<td class="mt10 {{ module.on }} module-box blackbg"`. Notice how `{{ module.on }}` sits in the middle and it's variable value from a different programming language. Eventually, it will be rendered into strings `on` or `off` but at this stage, this is raw, unrendered template and we want to remove all unused CSS from it.

It's possible to clean this too.

If you let this library know how are your back-end language's variables marked, for example, that "heads" are `{{` and "tails" are `}}` (as in `Hi {{data.firstname}}`), the algorithm will ignore all variables within `class` or `id` names.

If you don't put templating variables into classes or id's, don't use the feature because it still costs computing resources to perform those checks.

Here's an example:

```js
// Require it first. You get a function which you can feed with strings.
// Notice you can name it any way you want (because in the source it's using "export default").
const { comb } = require("email-comb");

// Let's define a string equal to some processed HTML:
const res = comb(
  `<!doctype html>
<html>
<head>
<style>
.aaa {
color:  black;
}
</style></head>
<body class="{% var1 %}">
<div class="{{ var2 }}">
</div>
</body>
</html>
`,
  {
    // <------------ Optional Options Object - second input argument of our function, remove()
    backend: [
      {
        heads: "{{", // define heads and tails in pairs
        tails: "}}"
      },
      {
        heads: "{%", // second pair
        tails: "%}"
      }
    ]
  }
).result; // <------ output of this library is a plain object. String result is in a key "result". We grab it here.

// Log the result:
console.log("res =\n" + res);
// res =
// <!doctype html>
// <html>
// <head>
// </head>
// <body class="{% var1 %}">
// <div class="{{ var2 }}">
// </div>
// </body>
// </html>
//
```

In templating languages, it's also possible to have IF-ELSE clauses. For example, in Nunjucks, you can have:

```html
<td class="db{% if module_on || oodles %}on{% else %}off{% endif %} pt10"></td>
```

`db` and `pt10` are normal CSS class names, but everything else between `{%` and `%}` is Nunjucks code.

Now, in those cases, notice that Nunjucks code is only wrapping the variables. Even if you set `heads` to `{%` and tails to `%}`, classes `on` and `off` will not get ignored and theoretically can get removed!!!

The solution is to ensure that all back-end class names are contained within back-end tags. With Nunjucks, it is easily done by performing calculations outside `class=` declarations, then assigning the calculation's result to a variable and using the variable instead.

For example, let's rewrite the same snippet used above:

```html
{% set switch = 'off' %} {% if module_on || oodles %} {% set switch = 'on' %} {%
else %}
<td class="db {{ switch }} pt10"></td>
```

Now, set `heads` to `{{` and tails to `}}` and `switch` will be ignored completely.

**[⬆ back to top](#)**

## Tapping the stream in Gulp

In Gulp, everything flows as vinyl Buffer streams. You could [tap](https://github.com/geejs/gulp-tap) the stream, convert it to `string`, perform the operations (like remove unused CSS), then convert it back to Buffer and place the stream back. I wanted to come up with a visual analogy example using waste pipes but thought I'd rather won't.

Code-wise, here's the idea:

```js
const tap = require("gulp-tap");
const { comb } = require("email-comb");
const util = require("gulp-util");
const whitelist = [
  ".External*",
  ".ReadMsgBody",
  ".yshortcuts",
  ".Mso*",
  "#outlook",
  ".module*"
];

gulp.task("build", () => {
  return gulp.src("emails/*.html").pipe(
    tap(file => {
      const cleanedHtmlResult = comb(file.contents.toString(), {
        whitelist
      });
      util.log(
        util.colors.green(
          `\nremoved ${
            cleanedHtmlResult.deletedFromHead.length
          } from head: ${cleanedHtmlResult.deletedFromHead.join(" ")}`
        )
      );
      util.log(
        util.colors.green(
          `\nremoved ${
            cleanedHtmlResult.deletedFromBody.length
          } from body: ${cleanedHtmlResult.deletedFromBody.join(" ")}`
        )
      );
      file.contents = Buffer.from(cleanedHtmlResult.result);
    })
  );
});
```

**[⬆ back to top](#)**

## Extreme example of unused CSS

This piece of HTML doesn't even have `<head>` and `<style>` CSS is at the very bottom, within `<body>`. Our application still cleans it allright:

```html
<html>
  <body id="unused-1">
    <table class="unused-2 unused-3">
      <tr>
        <td class="unused-4 unused-5">text</td>
      </tr>
    </table>

    <style>
      .unused-6 {
        display: block;
      }
      #unused-7 {
        height: auto;
      }
    </style>
  </body>
</html>
```

Cleaned result:

```html
<html>
  <body>
    <table>
      <tr>
        <td>text</td>
      </tr>
    </table>
  </body>
</html>
```

**[⬆ back to top](#)**

## Removing unused CSS from web pages

This library is meant to be used on any HTML where there are **no external CSS stylesheets**. It's quite rare to find a **web page** that would have no external stylesheets, but 100% of **email newsletters** are like that and this library suits them perfectly. Otherwise, look for a different tool.

**[⬆ back to top](#)**

## Why it's important to be able to process HTML with back-end code

Common unused CSS removal tools on the market ([purgecss](https://github.com/FullHuman/purgecss), [purifycss](https://github.com/purifycss/purifycss) and [uncss](https://github.com/uncss/uncss) for example) work only on valid HTML which does not contain back-end code: ESP templating strings (Oracle Responsys, Adobe Neolane, Exact Target, SalesForce or Mailchimp), different templating languages (Mustache, Jinja or Nunjucks) or different programming languages (PHP or Java JSP's).

But, in email development, it is normal to expect that code will contain templating code (like `Hi {{ data.firstName }}!`).

`email-comb` can process the email template after it has been wired up as a campaign.

Practically, this means, you save lots of time - imagine having to render HTML, so it contains no more ESP back-end templating language bits, then cleaning its CSS, then manually merging that cleaned CSS with your original HTML template. That's a tedious, manual and error-prone job.

On the other hand, you can clean your email campaign's HTML template, along with its Mailchimp, Responsys or other ESP wirings, as it is, using this library.

**[⬆ back to top](#)**

## Contributing

- If you see an error, [raise an issue](<https://gitlab.com/codsen/codsen/issues/new?issue[title]=email-comb%20package%20-%20put%20title%20here&issue[description]=**Which%20package%20is%20this%20issue%20for**%3A%20%0Aemail-comb%0A%0A**Describe%20the%20issue%20(if%20necessary)**%3A%20%0A%0A%0A%2Fassign%20%40revelt>).
- If you want a new feature but can't code it up yourself, also [raise an issue](<https://gitlab.com/codsen/codsen/issues/new?issue[title]=email-comb%20package%20-%20put%20title%20here&issue[description]=**Which%20package%20is%20this%20issue%20for**%3A%20%0Aemail-comb%0A%0A**Describe%20the%20issue%20(if%20necessary)**%3A%20%0A%0A%0A%2Fassign%20%40revelt>). Let's discuss it.
- If you tried to use this package, but something didn't work out, also [raise an issue](<https://gitlab.com/codsen/codsen/issues/new?issue[title]=email-comb%20package%20-%20put%20title%20here&issue[description]=**Which%20package%20is%20this%20issue%20for**%3A%20%0Aemail-comb%0A%0A**Describe%20the%20issue%20(if%20necessary)**%3A%20%0A%0A%0A%2Fassign%20%40revelt>). We'll try to help.
- If you want to contribute some code, fork the [monorepo](https://gitlab.com/codsen/codsen/) via GitLab, then write code, then file a pull request on GitLab. We'll merge it in and release.

In monorepo, npm libraries are located in `packages/` folder. Inside, the source code is located either in `src/` folder (normal npm library) or in the root, `cli.js` (if it's a command-line application).

The npm script "`dev`", the `"dev": "rollup -c --dev"` builds the development version retaining all `console.log`s with row numbers. It's handy to have [js-row-num-cli](https://www.npmjs.com/package/js-row-num-cli) installed globally so you can automatically update the row numbers on all `console.log`s.

**[⬆ back to top](#)**

## Licence

MIT License

Copyright (c) 2015-2020 Roy Revelt and other contributors

[node-img]: https://img.shields.io/node/v/email-comb.svg?style=flat-square&label=works%20on%20node
[node-url]: https://www.npmjs.com/package/email-comb
[gitlab-img]: https://img.shields.io/badge/repo-on%20GitLab-brightgreen.svg?style=flat-square
[gitlab-url]: https://gitlab.com/codsen/codsen/tree/master/packages/email-comb
[cov-img]: https://img.shields.io/badge/coverage-97.84%25-brightgreen.svg?style=flat-square
[cov-url]: https://gitlab.com/codsen/codsen/tree/master/packages/email-comb
[deps2d-img]: https://img.shields.io/badge/deps%20in%202D-see_here-08f0fd.svg?style=flat-square
[deps2d-url]: http://npm.anvaka.com/#/view/2d/email-comb
[downloads-img]: https://img.shields.io/npm/dm/email-comb.svg?style=flat-square
[downloads-url]: https://npmcharts.com/compare/email-comb
[runkit-img]: https://img.shields.io/badge/runkit-test_in_browser-a853ff.svg?style=flat-square
[runkit-url]: https://npm.runkit.com/email-comb
[prettier-img]: https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square
[prettier-url]: https://prettier.io
[license-img]: https://img.shields.io/badge/licence-MIT-51c838.svg?style=flat-square
[license-url]: https://gitlab.com/codsen/codsen/blob/master/LICENSE
