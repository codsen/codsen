# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# 9.3.0 (2025-10-15)

### Features

- if value to be added is a number, keep it as is, don't stringify ([ce3e1a5](https://github.com/codsen/codsen/commit/ce3e1a525998ca3c0abf0142affef95b14cd1990))

## 9.2.0 (2023-04-16)

### Features

- improvements to windows line endings recognition and support ([4205068](https://github.com/codsen/codsen/commit/4205068d50c24ba087eb715e123cd0a7bcc6ad9b))

## 9.1.0 (2023-01-06)

### Features

- replace dashes fixes with string-dashes ([9a370a7](https://github.com/codsen/codsen/commit/9a370a7634dc27d701b3e2ee142ab62337c6e002))

## 9.0.0 (2022-12-01)

### BREAKING CHANGES

- Minimum supported Node version is v14.18; we're dropping v12 support

## 8.1.0 (2022-08-12)

### Features

- export types ([11b5fb9](https://github.com/codsen/codsen/commit/11b5fb936ce20e0a77c3a09806773e1cd7695c50))

## 8.0.17 (2022-04-18)

### Fixed

- tweak types ([444d3fe](https://github.com/codsen/codsen/commit/444d3feff61a2d5b5b84e362748fadc96785ba5e))

## 8.0.0 (2021-09-09)

### Features

- migrate to ES Modules ([8c9d95d](https://github.com/codsen/codsen/commit/8c9d95d5dea0b769c2f070397141918a4893d575))

### BREAKING CHANGES

- programs now are in ES Modules and won't work with Common JS `require()`

## 7.1.0 (2021-05-24)

### Features

- config file based major bump blacklisting ([e15f9bb](https://github.com/codsen/codsen/commit/e15f9bba1c4fd5f847ac28b3f38fa6ee633f5dca))

## 7.0.15 (2021-04-11)

### Reverts

- Revert "chore: setup refresh" ([23cf206](https://github.com/codsen/codsen/commit/23cf206970a087ff0fa04e61f94d919f59ab3881))

## 7.0.1 (2021-01-28)

### Fixed

- add `testStats` to npmignore ([f3c84e9](https://github.com/codsen/codsen/commit/f3c84e95afc5514214312f913692d85b2e12eb29))

## 7.0.0 (2021-01-23)

### Features

- rewrite in TypeScript ([4a4e304](https://github.com/codsen/codsen/commit/4a4e30437a95480cb9a1d5ec2334f042803f66e7))

### BREAKING CHANGES

- there should not be any, but bumping anyway as the source was rewritten in TypeScript

## 6.1.0 (2020-12-06)

### Features

- separate mixer test util into standalone lib and tap it, some more tweaks ([3021a6f](https://git.sr.ht/~royston/codsen/commit/3021a6f24dbc5b0d0ae910700324fdd06515b763))

## 6.0.0 (2020-11-28)

### BREAKING CHANGES

- when `opts.removeWidows` is off, it's interpreted as explicit request to turn `&nbsp;` and raw non-breaking space characters into normal spaces

## 5.11.0 (2020-08-16)

### Features

- update to the latest string-strip-html v.5 ([230e35b](https://gitlab.com/codsen/codsen/commit/230e35b557f112eeb07c4ee9825da909163fcbbc))

## 5.10.0 (2020-05-06)

### Features

- update to the latest deps ([bfd94e8](https://gitlab.com/codsen/codsen/commit/bfd94e88adbd9c3258c4a8f730f84f5a3ebd4882))

## 5.9.0 (2020-04-26)

### Features

- harden the eslint rules set and rebase a little ([5f5e0a8](https://gitlab.com/codsen/codsen/commit/5f5e0a877cadc370baa8d415fac3174476bb1248))

## 5.8.1 (2019-11-27)

### Fixed

- apostrophes algorithm improvements ([3415b17](https://gitlab.com/codsen/codsen/commit/3415b1704b9b9e1b33d8ec234ba6ea20cd57d1ba))
- characters are index zero were not included in the clause ([6ad8f5f](https://gitlab.com/codsen/codsen/commit/6ad8f5f7e4d84dd8205392c1882e9b007501d81f))
- remove cb from reported applicable opts ([f79c469](https://gitlab.com/codsen/codsen/commit/f79c4694580fbd0020a4013bfe403b459745688f))

## 5.8.0 (2019-11-21)

### Features

- opts.cb ([17f232d](https://gitlab.com/codsen/codsen/commit/17f232df0ed6b05803a4da1da3cfd5278a5e6cab))

## 5.7.1 (2019-11-11)

### Fixed

- fix the html tag skipping during widow removal ([2fd262b](https://gitlab.com/codsen/codsen/commit/2fd262bc8fecdaa376406f42fc750571af8379c8))

## 5.7.0 (2019-11-05)

### Features

- make known html tag ranges to be ignored during the widow removal ([f7992a7](https://gitlab.com/codsen/codsen/commit/f7992a7a86b0420dfbeaae8008df16b3245d3b1a))

## 5.6.0 (2019-11-04)

### Features

- add few previously missing invisible space-like characters ([33ee0ed](https://gitlab.com/codsen/codsen/commit/33ee0ed1dc151cd03e4d52ff1f99037eed3ad82b))

- Besides U+200A HAIR SPACE, now we detect and turn into normal space all other fancy space characters:
  - U+1680 OGHAM SPACE MARK
  - U+2000 EN QUAD
  - U+2001 EM QUAD
  - U+2002 EN SPACE
  - U+2003 EM SPACE
  - U+2004 THREE-PER-EM SPACE
  - U+2005 FOUR-PER-EM SPACE
  - U+2006 SIX-PER-EM SPACE
  - U+2007 FIGURE SPACE
  - U+2008 PUNCTUATION SPACE
  - U+2009 THIN SPACE
  - U+202F NARROW NO-BREAK SPACE
  - U+205F MEDIUM MATHEMATICAL SPACE
  - U+3000 IDEOGRAPHIC SPACE

Reference: <https://www.fileformat.info/info/unicode/category/Zs/list.htm>

## 5.5.0 (2019-10-27)

### Features

- remove few dependencies to reduce the build size, add more unit tests ([5e836c8](https://gitlab.com/codsen/codsen/commit/5e836c85bb7037a96a4f7ebe73c66dae3a462666))

## 5.4.0 (2019-10-26)

### Fixed

- making all tests pass ([e1f332b](https://gitlab.com/codsen/codsen/commit/e1f332bd61714cac672f1ec3cadb32fbadde06bd))

### Features

- algorithm improvements around empty whitespace blocks ([0dcb178](https://gitlab.com/codsen/codsen/commit/0dcb178760e561aa66606bdb304f07d8eab06c73))

## 5.3.0 (2019-10-25)

- converts n-dash found in pattern "space - n-dash - space" into an m-dash
- fixed bug within the ESP templating tag recognition - algorithm exited later than expected
- corrected some dash applicable opts reporting and added many dash-related tests

## 5.2.0 (2019-10-21)

### Features

- opts.eol ([3ee6701](https://gitlab.com/codsen/codsen/commit/3ee670145b0f18b01e798932d33e0e750507fdc9))

## 5.1.0 (2019-10-02)

### Features

- report applicableOpts ([a03644a](https://gitlab.com/codsen/codsen/commit/a03644a))

## 5.0.0 (2019-09-17)

Let's migrate Detergent onto a monorepo, split some of its functionality into standalone packages (`html-entities-not-email-friendly` ([npm](https://www.npmjs.com/package/html-entities-not-email-friendly), [gitlab monorepo](https://gitlab.com/codsen/codsen/tree/master/packages/html-entities-not-email-friendly/)), `string-apostrophes` ([npm](https://www.npmjs.com/package/string-apostrophes), [gitlab monorepo](https://gitlab.com/codsen/codsen/tree/master/packages/string-apostrophes/)) and `string-remove-widows` ([npm](https://www.npmjs.com/package/string-remove-widows), [gitlab monorepo](https://gitlab.com/codsen/codsen/tree/master/packages/string-remove-widows/)), for starters).

### BREAKING CHANGES

We're renaming the main function `detergent` to `det`.

Before:

```js
const { detergent, opts, version } = require("detergent");
```

Now:

```js
const { det, opts, version } = require("detergent");
```

That's necessary because of the UMD build — if you were to tap detergent on a web page, you'd call the script:

```html
<script src="https://cdn.jsdelivr.net/npm/detergent/dist/detergent.umd.js"></script>
```

Then you'd get a global variable "detergent" which you consume like this:

```js
const { det, opts, version } = detergent;
```

Notice the difference between `deterget` global exported object which contains `det`-the-function. Both can't be named "detergent".

Here are other notable features:

### Separating functionality into standalone packages

- **Widow word** removal is now a separate package, `string-remove-widows` ([npm](https://www.npmjs.com/package/string-remove-widows), [gitlab monorepo](https://gitlab.com/codsen/codsen/tree/master/packages/string-remove-widows/))
- Typographically correct **apostrophes** and quotes conversion is now a separate package, `string-apostrophes` ([npm](https://www.npmjs.com/package/string-apostrophes), [gitlab monorepo](https://gitlab.com/codsen/codsen/tree/master/packages/string-apostrophes/))
- **Broken named HTML entity** fixing library is now a separate package, `string-fix-broken-named-entities` ([npm](https://www.npmjs.com/package/string-fix-broken-named-entities), [gitlab monorepo](https://gitlab.com/codsen/codsen/tree/master/packages/string-fix-broken-named-entities/))
- The list of named HTML entities which are not email-friendly is now a separate package, `html-entities-not-email-friendly` ([npm](https://www.npmjs.com/package/html-entities-not-email-friendly), [gitlab monorepo](https://gitlab.com/codsen/codsen/tree/master/packages/html-entities-not-email-friendly/))

### Detergent is now HTML-aware

Now you have full control over HTML-stripping, thanks to `string-strip-html` ([npm](https://www.npmjs.com/package/string-strip-html), [gitlab monorepo](https://gitlab.com/codsen/codsen/tree/master/packages/string-strip-html/)).

It's controlled by a new options keys `opts.stripHtml` and `opts.stripHtmlButIgnoreTags`.

If you give Detergent a piece of HTML and disable HTML stripping, it will detect the tags and process the text between the tags. Furthermore, it should recognise some common templating languages.

### Apostrophes and quotes processing rehaul

All apostrophe and quote processing is done "in-house" now, without relying on 3rd party libraries.

- We removed [curl-quotes](https://www.npmjs.com/package/curl-quotes) from dependencies. Now we do more, pass its unit tests (that it wasn't passing itself) and added even more unit tests regarding quotes and apostrophes.
- Now correctly setting `’tis`, `’twas`, `’t`. Previously, buggy [curl-quotes.js](https://www.npmjs.com/package/curl-quotes) was using left single curly quote even though their own (failing) [unit tests](https://www.npmjs.com/package/straight-to-curly-quotes) were requiring right single curly quote. For the first time, their [unit tests](https://www.npmjs.com/package/straight-to-curly-quotes) are being satisfied by a library (this-one).
- Sets two Hawaiian words with okina's correctly: `Hawai‘i` and `O‘ahu` as left single curly quotes. See <https://practicaltypography.com/apostrophes.html>

### Dashes rehaul

All dashes processing is done "in-house" now, without relying on 3rd party libraries.

- Removed [typographic-en-dashes](https://www.npmjs.com/package/typographic-en-dashes) from dependencies.

### Other changes

- Removing `opts.keepBoldEtc` in favor of more universal `opts.stripHtmlButIgnoreTags` which will have the same default tag set like `opts.keepBoldEtc` had. This also allowed us to put two internal functions, `encryptBoldItalic()` and `decryptBoldItalic()` to pastures. No more mutating the string in order to hide tags from removal algorithm!
- Removing `opts.removeSoftHyphens`, it's now permanently on. We had to do it because each option doubled the automated test count and it was not worth to have it, soft hyphens are very rare and this option was too granular.
- `o.removeLineBreaks` now correctly accounts for `\r\n`-Windows-style line breaks.

## 4.0.0 (2018-05-17)

There are no API changes but I removed `default` from main `export` so bumping _major_ just in case it breaks some code.

### Improvements

- Set up [Prettier](https://prettier.io) on a custom ESLint rule set.
- Removed `package.lock` and `.editorconfig`
- Wired Rollup to remove comments from non-dev builds. This means we can now leave the `console.log`s in the source code — there's no need to comment-out `console.log` statements or care about them not spilling into production. Now it's done automatically.
- Unit tests are pointing at ES modules build, which means that code coverage is correct now, without Babel functions being missed. This is important because now code coverage is real again and now there are no excuses not to perfect it.

## 3.7.0 (2018-04-27)

### Improvements

- Implemented `throw` error pinning on all unit tests.
- Moved `object-boolean-combinations` to devdeps. I don't know how it got into deps but it was not right.

## 3.6.0 (2018-04-23)

### Improvements

- Removed `airbnb-base` ESLint preset and set up Prettier on recommended rules.
- Removed `package-lock.json`
- One unit test.
- Set up two different Rollup builds - dev, which keeps `console.log`s and prod, which strips them.

Practically, this means source code can keep `console.log`s and there's no need to do anything about them when building the production build. `npm test` task which is ran before committing will not call `dev` Rollup build and therefore [rollup-plugin-strip](https://www.npmjs.com/package/rollup-plugin-strip) will kick in and strip all `console.log`s.

This is a huge boost for my productivity.

## 3.5.0 (2018-01-01)

### Features

- Strips [ANSI escape codes](https://en.wikipedia.org/wiki/ANSI_escape_code) from the input, thanks to [strip-ansi](https://github.com/chalk/strip-ansi)

## 3.4.0 (2017-12-31)

### Improvements

- Dependency update
- More unit tests to increase the code coverage on `util.js`
- Setup tweaks and some rebasing

## 3.3.0 (2017-11-27)

### Features

- Switched to custom HTML stripping [library](https://github.com/codsen/string-strip-html) tailored specificly for Detergent. Now legit brackets are recognised and not removed, for example: `Equations: a < b and c > d are important` would not treat `< b and c >` as a tag any more.
- Recognises improvised arrows comprising of 4 and more dashes, like `->`, `-->`, `--->` and so on.
- Contributors list to readme.
- Closes [#19](https://github.com/codsen/detergent/issues/19) - now recognises left-to-right and right-to-left marks.

### Fixed

- Removed dependency `string.js`, it was causing security [alerts](https://snyk.io/test/npm/string/3.3.3).

## 3.2.0 (2017-09-25)

### Features

- The main source now is in ES2015 modules with `import`/`export`.
- Implemented Rollup to generate 3 flavours of this package: CommonJS, UMD and ESM `module` with `import`/`export`.

## 3.1.6 (2017-09-19)

### Changes

- Small rebase - tapped the line trimming function in `string-collapse-white-space` what rendered the current `string.js`-based function redundant. All functionality stays the same, it's a rebase.

## 3.1.0 (2017-09-13)

### Features

- Widow removal now detects Jinja/Nunjucks code. For example, if the input string starts with `{` and ends with `}`, it will automatically deactivate.

## 3.0.0 (2017-09-13)

### Three Things Changed

- Main exports of the module is not the main `detergent()` function, but an object which contains `detergent()` function and default options object as two separate keys:

```js
module.exports = {
  detergent: detergent,
  opts: defaultsObj,
};
```

This means, from now on, import Deterent like this:

```js
const detergent = require("detergent").detergent;
```

I'm building a new front-end for detergent.io and I want to automate the options list, that's why I need the `opts` exported.

- ✨💥✨ The result of the main function `detergent()` is now not a string but an object. Result is now placed under key `res`. This is done so I can place additional info in the future, what was added or removed exactly, what kinds of invisible characters were encountered and so on.
- Removed `JS Standard` and switched to raw `eslint` with `airbnb-base` config preset with 2 overrides: 1. no semicolons. 2. allowing plus-plus in `for` loops. For posterity JS Standard is using half-year old version of ESLint and its config is too relaxed, it's ignoring many good practice rules.

## 2.32.0 (2017-09-07)

The previous algorithm was not aiming for anything specific, which led to a goal of easy to read and develop code. Rest was secondary (correctness aside of course). In this rebase issue, the main aim is efficiency (besides correctness): both when ran by JS engine as well as algorithm's in general.

I implemented JS optimisations like `for` looping backward (optimisation for JS engine) and general ones like cutting down on operations and making them only when it's the best time to do so. I reviewed all locations of all functions and weighed are they necessary at all (or can they be replaced by something more efficient).

I separated all the operations performed on input into three stages: **the first stage** is blanket operations to prepare text, like decoding and broken code patching. **Second stage** is new, we traverse the string character-by-character and perform all the operations that can be performed at such level. **Third stage** is the rest, a set of consecutive functions mutating the result one-after-another until it's done.

This second stage relieved us from roughly half of the blanked functions that previously mutated the string again and again. Now, all deletion/insertion procedures are recorded during (a single) traversal in Step 2; then a string is crunched in one go. It's done using combo of [string-slices-array-push](https://github.com/codsen/string-slices-array-push) and [string-replace-slices-array](https://github.com/codsen/string-replace-slices-array).

### Features

- Horizontal ellipsis is converted only when there are three dots in one lump, not more and setting is on. Gung-ho regex replacements would not do this correctly by the way.
- Horizontal ellipsis switch makes the journey strictly either way: either all kinds of what could be interpreted as ellipsis are converted to fancy &hellip; (or unencoded character if the encoding is turned off) OR those above are converted to dot dot dot. There are no gray cases. Unlike before.
- Script tags are now stripped together with their contents. Solves #15, thanks @nacimgoura
- More tests to thoroughly prove that single quotes in any format (`'`) are not encoded. Ever. They can be converted to fancy single quote, but in a single straight shape, they should always stay the same.

### Fixed

- 💥 `upper-case` dependency. It was buggy, by the way, reporting '1' as uppercase. For those concerned that didn't affect Detergent's correctness.
- 💥 `lower-case` dependency. It was buggy as well. Same thing.

## 2.31.0 (2017-08-28)

### Features

- `opts.convertDotsToEllipsis` - now you can customise, do you want three dots converted to horizontal ellipsis, `&hellip;`, or not.
- Tapped [check-types-mini](https://github.com/codsen/check-types-mini) to enforce peace and order within an options object. Now unrecognised options object's keys will `throw` as well.

### Fixed

- 💥 Dependency `lodash.clonedeep` - the `Object.assign` against an empty object does the same job - it does not mutate the input arguments.

## 2.30.0 (2017-07-20)

### Features

- Bunch of new badges to readme.
- `.npmignore` and added `/media/` to it, along all dotfiles. This will reduce your npm installation footprint.

## 2.29.0 (2017-07-20)

### Features

- Feature for issue [#14](https://github.com/codsen/detergent/issues/14) - Detergent strips all HTML (except bolt/italic/strong/em) code, but in the process, some content might be misformatted. For example, the content in unordered lists would get bunged up together without spaces. Now that's fixed. By default, every `<li>` will be put onto a new line, as well as closing `</ul>`. If you want everything on one line, set `opts.removeLineBreaks` to `true`.

### Fixed

- 💥 Some Lodash dependencies, replacing them with native ES6-ones.

## 2.28.0 (2017-07-08)

### Fixed

- 💥 As the features grew, the "Builds" time on Travis grew too. Currently Travis fails around 50% of the cases because it hits 50 minutes mark while running the end-to-end unit tests. Therefore, I'm removing Travis for good. It makes no sense anyway, as there are no "Builds" for this library, only unit tests, which can be ran locally.

## 2.27.0 (2017-07-08)

### Fixed

- Code refresh: updated all deps, generated up-to-date `package-lock` and did some small code rebasing related to all this.

## 2.26.0 (2017-04-12)

### Features

- Options key `o.addMissingSpaces` now allows you to control, do you want to add missing spaces after full stops/colons/semicolons, or not. This does not break the API as the new default setting matches previously non-customiseable setting.

## 2.25.0 (2017-04-07)

### Improvements

- Tiny rebasing: separated all functions into util.js, added some measures to protect against options object settings in wrong type (values other type than Boolean).

## 2.24.0 (2017-04-05)

### Improvements

- Widows won't be added if there's right closing slash following the space. Also, they won't be added if there's `hr` or `br` preceding the space. This is necessary to cater the cases when Detergent is being ran on a code which has concealed HTML tags where brackets are swapped with custom strings. For example, cases like `aaaaaaaaaaa%%%1br /%%%2aaaaaaaaaaa` should get identified as concealed HTML and widow removal should not be triggered.

### Fixed

- 💥 `strip-bom` library dependency was redundant; '\uFEFF' was already in the invisible character list and removed along all other invisibles.

## 2.23.0 (2017-03-24)

### Improvements

- Swooping in on full stop + letter fixes. I found the file names where extension is mentioned get separated into two parts. I came up with the idea: two errors rarely happen at one place. "string1.string2" is a double error because space after full stop is missing and letter that follows is in capital. This leads to the algorithm:

  If there is no space after full stop, and letter that follows is uppercase, add a full stop. If lowecase letter follows full stop, leave it as it is.

  Additionally, the algorithm is now checking, does any of the known extensions follow the full stop (in any case). If so, space between the full stop and extension is not added. This should cover all false positives where file names are involved.

## 2.22.0 (2017-03-22)

### Improvements

- Now correctly recognises and ignores legitimate minus signs, such as `-20°C` when it comes after a space. If algorithm will detect a number of curency symbol after a dash, it will not add a space after it or turn it into an m-dash. It does not matter now, a space character precedes all that or not.
- Updated Husky to latest.

### Features

- More tests.

### Changes

- 🔧 Now consuming JS Standard linter in normal fashion, not "any latest", but within the current _major_ range.

## 2.21.0 (2017-03-09)

### Features

- Removes [byte order mark](https://en.wikipedia.org/wiki/Byte_order_mark#UTF-8) (BOM).

## 2.20.0 (2017-02-22)

### Features

- Widow removal now identifies UK postcodes and replaces the space with non-breaking space.

## 2.19.0 (2017-01-04)

### Features

- URL recognition — now Detergent won't add spaces within an URL.
- New tests — to maintain the coverage and prove the surrounded text is cleaned correctly as before.

## 2.18.0 (2016-12-23)

### Features

- JS Standard on a precommit hook to enforce an order everywhere
- Tweaks for BitHound to ignore the fact that we are going to use the _latest version_ `AVA`, `Coveralls` and `Standard` no matter what, to reduce maintenance time spent on all my libraries.
- Some tweaks to completely pass JS Standard (there were redundant regex escapes for example)

## 2.17.0 (2016-12-21)

### Features

- Test coverage and a badge
- Changelog
- Tweaked travis and bithound setup files
- Hardened the .gitignore
- Consolidated Readme badge links to svg's and url's in the footer

### Fixed

- 🔧 Renamed some tests to match better what's inside
- 🔧 The latest AVA (\*) is requested with an ignore on the BitHound
