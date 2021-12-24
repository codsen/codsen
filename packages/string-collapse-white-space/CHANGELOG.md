# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## 10.0.0 (2021-09-09)

### Features

- migrate to ES Modules ([8c9d95d](https://github.com/codsen/codsen/commit/8c9d95d5dea0b769c2f070397141918a4893d575))

### BREAKING CHANGES

- programs now are in ES Modules and won't work with Common JS require()

## 9.1.0 (2021-05-24)

### Features

- config file based major bump blacklisting ([e15f9bb](https://github.com/codsen/codsen/commit/e15f9bba1c4fd5f847ac28b3f38fa6ee633f5dca))

## 9.0.15 (2021-04-11)

### Reverts

- Revert "chore: setup refresh" ([23cf206](https://github.com/codsen/codsen/commit/23cf206970a087ff0fa04e61f94d919f59ab3881))

## 9.0.1 (2021-01-28)

### Bug Fixes

- add testStats to npmignore ([f3c84e9](https://github.com/codsen/codsen/commit/f3c84e95afc5514214312f913692d85b2e12eb29))

## 9.0.0 (2021-01-23)

### Features

- rewrite in TS, start using named exports ([70f7388](https://github.com/codsen/codsen/commit/70f7388781b040cc47b628f270e21eacbbe99aa6))

### BREAKING CHANGES

- previously you'd consume like: `import collapse from ...` - now: `import { collapse } from ...`

## 7.0.0 (2020-11-06)

**A major rewrite.**

- complete rewrite ([0040bc5](https://gitlab.com/codsen/codsen/commit/0040bc502a7714010cc0ef3aef978e326998482e))

Each whitespace chunk is needed is passed through a callback (even when there is no action needed). This allows you to granularly control the collapsing. For example, you can delete the single spaces between two characters under certain circumstances (a thing not available by existing options' settings) - for example, minify css selectors:

```css
div > span {
  color: red;
}
```

Imagine you are minifying the code above and parser extracted the `div > span` part. Now you want to collapse excessive whitespace like `div \t > \t span` (spaces with tabs), but also remove even single spaces, to turn it into `div>span`.

Easy!

```js
import { strict as assert } from "assert";
import collapse from "../dist/string-collapse-white-space.esm.js";
assert.equal(
  collapse(`div > span`, {
    cb: ({ suggested, whiteSpaceStartsAt, whiteSpaceEndsAt, str }) => {
      if (str[whiteSpaceStartsAt - 1] === ">") {
        return [whiteSpaceStartsAt, whiteSpaceEndsAt];
      }
      if (str[whiteSpaceEndsAt] === ">") {
        return [whiteSpaceStartsAt, whiteSpaceEndsAt];
      }
      return suggested;
    },
  }).result,
  "div>span"
);
```

### Features

- `opts.cb`

### BREAKING CHANGES

- removed `opts.recogniseHTML`
- removed `opts.rangesOffset` (use [`ranges-offset`](/os/ranges-offset/))

Also, properly tested and fixed `opts.enforceSpacesOnly`. It now works as intended, considering all edge cases and interaction with other options.

## 6.1.0 (2020-10-26)

### Features

- `opts.enforceSpacesOnly` ([154de62](https://gitlab.com/codsen/codsen/commit/154de623241cdced9d418f2815ae3befe9684534))

## 6.0.0 (2020-10-12)

### Features

- returns a plain object with both string and ranges ([275b940](https://gitlab.com/codsen/codsen/commit/275b940178b35f20c421c5461e5379961b95d4f3))

### BREAKING CHANGES

- returns a plain object with both string and ranges

## 5.2.0 (2019-10-26)

### Features

- proper support for all possible kinds of line end symbols ([5a49049](https://gitlab.com/codsen/codsen/commit/5a49049212afe0d9585f9592701e1d88a89c88e1))

## 5.2.0

- full support for all kinds of linebreaks: LF, CR or CRLF
- basic unit tests for UMD and CJS builds, to check their integrity (rather than functionality, which is covered properly by ES Modules build tests)

## 5.1.2 (2019-10-02)

### Bug Fixes

- string boundary won't throw now, sorry about that ([94639dd](https://gitlab.com/codsen/codsen/commit/94639dd))

## 5.1.0 (2019-09-11)

### Features

- opts.limitConsecutiveEmptyLinesTo ([ece9334](https://gitlab.com/codsen/codsen/commit/ece9334))

## 4.5.0 (2019-01-20)

- ✨ Various documentation and setup tweaks after we migrated to monorepo
- ✨ Setup refresh: updated dependencies and all config files using automated tools

## 4.3.0 (2018-12-26)

- ✨ Add dynamically generated tests - 10000 random strings are checked to catch any false-positives ([43d7dc4](https://gitlab.com/codsen/codsen/tree/master/packages/string-collapse-white-space/commits/43d7dc4))
- ✨ Add `opts.removeEmptyLines` ([75e0671](https://gitlab.com/codsen/codsen/tree/master/packages/string-collapse-white-space/commits/75e0671))

## 4.2.0 (2018-10-25)

- ✨ Updated all dependencies
- ✨ Restored coveralls.io reporting
- ✨ Restored unit test linting

## 4.1.0 (2018-07-24)

- ✨ Fixed a strange false-positive bug which was happening around the encountered first bracket when there was no whitespace to remove, but with only a single line break. Sorry about that.
- ✨ To iron-out all false-positive cases, I created an 8th group unit test where `10,000` randomly generated strings that don't contain anything to collapse are checked. Various pieces are assembled in random order and length: `<br>`, `<br/>`, `<zzz class="yyy">`, `zzz`, `1`, `_`, `a`, `&`, `#`, `.`. Plus, there are single spaces in-between, added with 25% probability.

Here are ten examples of randomly-generated text which should not be changed by string-collapse function (notice there are maximum one space everywhere):

```html
& 1 _<br/>#<br/><br><br> <br>_a1

a&1_.zzz<br/>.#zzz<br>&.<zzz class="yyy"> <zzz class="yyy">a zzz<br/>_<br><br/> <zzz class="yyy"><br/><zzz class="yyy">zzz1<br>_ <br><br><br>_# <zzz class="yyy">_.<br/>a1zzz 1.zzz<br/><zzz class="yyy">&<zzz class="yyy">.<br>.

aaa1<br>1a &a1<br/>1<br/> <br>..#_1zzz _<br><br/> <zzz class="yyy">1 <br/>zzz azzz&<br>a& &<br/> _a &<zzz class="yyy">#

<zzz class="yyy">__aa..#

_<zzz class="yyy"> <br>. _<br/>zzz... <br/>zzz<br/> 1.<br/> & zzz& 1zzza <br> <br/> <br><br><br>&<zzz class="yyy">zzz1.zzz._& _ ##<br>a#<br>.<br/>

.a<br>zzz _& 1_ 1zzz<zzz class="yyy"> <br/>#<br/>zzz & #<br/><br/> &<br>&<zzz class="yyy">_<br/><zzz class="yyy">.&a<br> &_#_

_azzz 11##

a.<br/>.<br/><br><br/><br/><br/><br/> # _1 1<zzz class="yyy"> .<br/>1<br>&# <br/><br/> <br>_aa <br/>

## zzz& .# .a&1&_aa 1 zzz<zzz class="yyy">zzz.zzz_zzz_##_## <br><br/><br/>1

<zzz class="yyy"> zzz 1<zzz class="yyy">_1<br>zzz.&<zzz class="yyy"> #___zzz<zzz class="yyy">.a a_<br/>1_. <br/> <br/><br> . _1 <br/>
```

Hopefully bugs like the one we just fixed should not happen any more 🤞

## 4.0.0 (2018-07-23)

- ✨ When `opts.returnRangesOnly` is on and there are no results, instead of `null` (_a falsey thing_) now we return empty array (_a truthy thing_). It's better now because while you can't easily check for its existence (a la `if result`), actually you don't have to any more. Just map over its result. It will always be array, albeit sometimes empty.

## 3.7.0 (2018-06-20)

- ✨ Set up Rollup to remove comments from the code

## 3.6.0 (2018-06-20)

- ✨ Two `range-` dependencies have been renamed, namely [ranges-push](https://www.npmjs.com/package/ranges-push) and [ranges-apply](https://www.npmjs.com/package/ranges-apply). We tapped them.

## 3.5.0 (2018-06-11)

GitHub sold us out. In the meantime, we:

- ✨ Migrated to BitBucket (to host repo + perform CI) and Codacy (for code quality audit)
- ✨ Dropped BitHound (RIP) and Travis
- ✨ Removed `package-lock`
- ✨ Added new feature — `opts.returnRangesOnly`

## 3.4.0 (2018-05-26)

- ✨ Set up [Prettier](https://prettier.io) on a custom ESLint rule set.
- ✨ Removed `package.lock` and `.editorconfig`
- ✨ Wired Rollup to remove comments from non-dev builds. This means we can now leave the `console.log`s in the source code — there's no need to comment-out `console.log` statements or care about them not spilling into production. Now it's done automatically.
- ✨ Unit tests are pointing at ES modules build, which means that code coverage is correct now, without Babel functions being missed. This is important because now code coverage is real again and now there are no excuses not to perfect it.

## 3.3.0 (2018-04-30)

### Added

- ✨ `opts.removeEmptyLines`
- ✨ Set up Prettier to run automatically on all relevant files. Dropping `airbnb-base` ESLint preset.
- ✨ Stopping to commit (and generate at all) `package-lock` files
- ✨ Beefed up unit tests, filled all missing rows. Obviously, unit tests will be ran against the transpiled code (as well as nyc/coveralls reporting) and I can't unit-test some of the functions that Babel adds. Hence not perfect coverage score.

## 3.2.0 (2017-10-29)

### Added

- ✨ Removed the look left-right matching function into a separate library, [string-match-left-right](https://github.com/codsen/string-match-left-right) and tapped it. Also did some tiny code rebasing.

## 3.1.0 (2017-10-27)

### Added

- ✨ AVA unit test linting via ESLint plugin

## 3.0.0 (2017-09-30)

### Added

- ✨ The main source now is in ES2015 modules with `import`/`export`.
- ✨ Implemented Rollup to generate 3 flavours of this package: CommonJS, UMD and ESM `module` with `import`/`export`.
- ✨ `opts.recogniseHTML` (default true) - if string contains HTML, whitespace around brackets will be collapsed completely, for example: `< img` => `<img`, not `< img` => `< img` as before. The "before" result _now_ would yield only with this new setting turned off. Total 118 opening HTML tags are recognised (with or without attributes).

## 2.2.0 (2017-09-16)

### Added

- ✨ `opts.trimLines` - activates trim per-line basis
- ✨ `opts.trimnbsp` - non-breaking spaces are trimmed too
- ✨ switched to ESLint on `airbnb-base` config, with 3 exceptions: 1. no semicolons; 2. plus-plus allowed in loops;

## 2.1.0 (2017-09-03)

### Added

- ✨ Correctly treats non-breaking spaces - they are not considered _collapsable_ or _trimmable_ now.

## 2.0.0 (2017-09-03)

### Changed

- ✨ This morning I didn't like yesterday's v.1 API at all, personally I think it was stupid. So, I simplified it and basically, recoded the whole thing.

## 1.0.0 (2017-09-02)

- ✨ First public release
