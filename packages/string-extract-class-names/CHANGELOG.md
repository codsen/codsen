# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [8.0.17](https://github.com/codsen/codsen/compare/string-extract-class-names@8.0.16...string-extract-class-names@8.0.17) (2024-01-05)

**Note:** Version bump only for package string-extract-class-names

## 8.0.0 (2022-12-01)

### BREAKING CHANGES

- Minimum supported Node version is v14.18; we're dropping v12 support

## 7.1.0 (2022-08-12)

### Features

- export types ([87f1b65](https://github.com/codsen/codsen/commit/87f1b65d7d650fe137958a882c984303ff2f25af))
- export types ([11b5fb9](https://github.com/codsen/codsen/commit/11b5fb936ce20e0a77c3a09806773e1cd7695c50))

## 7.0.0 (2021-09-09)

### Features

- migrate to ES Modules ([8c9d95d](https://github.com/codsen/codsen/commit/8c9d95d5dea0b769c2f070397141918a4893d575))

### BREAKING CHANGES

- programs now are in ES Modules and won't work with Common JS `require()`

## 6.1.0 (2021-05-24)

### Features

- config file based major bump blacklisting ([e15f9bb](https://github.com/codsen/codsen/commit/e15f9bba1c4fd5f847ac28b3f38fa6ee633f5dca))

## 6.0.15 (2021-04-11)

### Reverts

- Revert "chore: setup refresh" ([23cf206](https://github.com/codsen/codsen/commit/23cf206970a087ff0fa04e61f94d919f59ab3881))

## 6.0.1 (2021-01-28)

### Fixed

- add `testStats` to npmignore ([f3c84e9](https://github.com/codsen/codsen/commit/f3c84e95afc5514214312f913692d85b2e12eb29))

## 6.0.0 (2021-01-23)

Rewrote in TypeScript and simplified the API.

BREAKING CHANGES:

1. Default is not exported any more. Consume destructured:

`import { extract } from "string-extract-class-names"`

2. Result now returns both string and index ranges:

```js
import { extract, version } from "string-extract-class-names";
const res = extract("div.first-class.second-class");
console.log(res);
// => {
//      res: [".first-class", ".second-class"],
//      ranges: [
//        [3, 15],
//        [15, 28],
//      ],
//    }
```

What was the default output is now under plain object's key `res`.

When program exports a plain object, more goodies can be bundled, like current version or defaults.

Equally, when a plain object is exported, different flavours of output can be included. Also, there's headroom for various stats and logs under different keys, in the same output's plain object.

## 5.10.0 (2020-11-28)

Accidental version bump during migration to SourceHut. Sorry about that.

## 5.9.0 (2019-09-04)

### Features

- extract class and id names from bracket notation ([11032db](https://gitlab.com/codsen/codsen/commit/11032db))

## 5.8.0 (2019-01-20)

- Various documentation and setup tweaks after we migrated to monorepo
- Setup refresh: updated dependencies and all config files using automated tools

## 5.2.0 (2018-12-26)

- Complete rewrite, now allowing to request array of ranges as well. Removed all deps. ([4d888dc](https://gitlab.com/codsen/codsen/tree/master/packages/string-extract-class-names/commits/4d888dc))

## 5.1.0 (2018-10-25)

- Updated all dependencies
- Restored coveralls.io reporting
- Restored unit test linting

## 5.0.0 (2018-07-04)

- Complete rewrite. Now instead of using regexes and string `replace`, we traverse the input string once and compile the array of selectors
- Second argument as `true` will force the application to return arrays of ranges for each selector instead of values as strings
- Removed all dependencies (all of them `lodash`)
- Doubled the unit tests count - one unit test for a regular result (array of strings) and one unit test for result serving ranges
- Unit test code coverage stays at 100%

## 4.3.0 (2018-06-29)

- Set up Rollup to remove comments from the code

## 4.2.0 (2018-06-16)

GitHub sold us out. In the meantime, we:

- Migrated to BitBucket (to host repo + perform CI) and Codacy (for code quality audit)
- Dropped BitHound (RIP) and Travis

## 4.1.0 (2018-05-26)

- Set up [Prettier](https://prettier.io) on a custom ESLint rule set.
- Removed `package.lock` and `.editorconfig`
- Wired Rollup to remove comments from non-dev builds. This means we can now leave the `console.log`s in the source code — there's no need to comment-out `console.log` statements or care about them not spilling into production. Now it's done automatically.
- Unit tests are pointing at ES modules build, which means that code coverage is correct now, without Babel functions being missed. This is important because now code coverage is real again and now there are no excuses not to perfect it.

## 4.0.0 (2017-12-13)

- Rebased in ES Modules
- Now using Rollup to serve three builds: CommonJS, UMD and ES Modules

No API changes, but bumping major just in case.

## 3.4.0 (2017-08-28)

- Relaxed the requirements and made single character selector names to pass.

## 3.3.0 (2017-01-01)

- Recognises `\n`, `\t` and other escaped JS characters
- Doesn't extract empty classes and id's (`.` and `#`)
- Doesn't extract any classes or id's that are one character long

## 3.2.0 (2016-12-27)

- Readme updates

## 3.1.0 (2016-12-23)

- Standard JS precommit hooks to enforce code style

## 3.0.0 (2016-11-19)

Algorithm change.

## v.2.0.0 - 2016-11-09

### Change 1.

Breaking changes — instead of giving the first class or id as string, now we're outputting the array of them:

Previously:

```js
extract("div.class-one.class-two a[target=_blank]", "#");
// => '.class-one'
extract("div#id.class a[target=_blank]", "#");
// => '#id'
```

Now:

```js
extract("div#id.class a[target=_blank]", "#");
// => ['#id', '.class']
```

Once the space is encountered, there won't be any more additions to the array.

### Change 2.

There is no second argument any more, to choose between id's or classes. Since array can contain a mix of classes and id's, it's unpractical to impose any other restrictions upon user any more.

This library will detect the first clump of class(es)/array(s), will put each into an array, discarding everything else around.
