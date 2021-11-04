# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [6.0.4](https://github.com/codsen/codsen/compare/object-flatten-referencing@6.0.3...object-flatten-referencing@6.0.4) (2021-11-04)

**Note:** Version bump only for package object-flatten-referencing





## 6.0.3 (2021-11-02)

### Bug Fixes

- bump TS and separate ESLint plugins away from this monorepo ([b1ebce1](https://github.com/codsen/codsen/commit/b1ebce1637d8c41c2d848fc24b0ba4058865bd5d))

### Features

- migrate to ES Modules ([c579dff](https://github.com/codsen/codsen/commit/c579dff3b23205e383035ca10ddcec671e35d0fe))

### BREAKING CHANGES

- programs now are in ES Modules and won't work with Common JS require()

## 6.0.1 (2021-09-13)

### Bug Fixes

- bump TS and separate ESLint plugins away from this monorepo ([2e07d42](https://github.com/codsen/codsen/commit/2e07d424222b6ffedf5fb45c83ad453627ec2904))

## 6.0.0 (2021-09-09)

### Features

- migrate to ES Modules ([8c9d95d](https://github.com/codsen/codsen/commit/8c9d95d5dea0b769c2f070397141918a4893d575))

### BREAKING CHANGES

- programs now are in ES Modules and won't work with Common JS require()

## 5.1.0 (2021-05-24)

### Features

- config file based major bump blacklisting ([e15f9bb](https://github.com/codsen/codsen/commit/e15f9bba1c4fd5f847ac28b3f38fa6ee633f5dca))

## 5.0.15 (2021-04-11)

### Reverts

- Revert "chore: setup refresh" ([23cf206](https://github.com/codsen/codsen/commit/23cf206970a087ff0fa04e61f94d919f59ab3881))

## 5.0.1 (2021-01-28)

### Bug Fixes

- add testStats to npmignore ([f3c84e9](https://github.com/codsen/codsen/commit/f3c84e95afc5514214312f913692d85b2e12eb29))

## 5.0.0 (2021-01-23)

### Features

- rewrite in TS, start using named exports, rebase to be faster ([6dbc295](https://github.com/codsen/codsen/commit/6dbc2952f0320e52813fb2eaae0276a4137e1638))

### BREAKING CHANGES

- previously you'd consume: `import flattenReferencing from ...` - now: `import { flattenReferencing } from ...`

## 4.12.0 (2020-11-28)

Accidental version bump during migration to sourcehut. Sorry about that.

## 4.11.0 (2019-10-02)

### Features

- remove check-types-mini options validation to make operation 148 times faster ([adbfa37](https://gitlab.com/codsen/codsen/commit/adbfa37))

## 4.10.0 (2019-01-20)

- ✨ Various documentation and setup tweaks after we migrated to monorepo
- ✨ Setup refresh: updated dependencies and all config files using automated tools

## 4.6.0 (2018-10-24)

- ✨ Updated all dependencies
- ✨ Restored coveralls.io reporting
- ✨ Restored unit test linting

## 4.5.0 (2018-06-16)

GitHub sold us out. In the meantime, we:

- ✨ Migrated to Bitbucket (to host repo + perform CI) and Codacy (for code quality audit)
- ✨ Dropped BitHound (RIP) and Travis

## 4.4.0 (2018-05-25)

- ✨ Set up [Prettier](https://prettier.io) on a custom ESLint rule set.
- ✨ Removed `package.lock` and `.editorconfig`
- ✨ Wired Rollup to remove comments from non-dev builds. This means we can now leave the `console.log`s in the source code — there's no need to comment-out `console.log` statements or care about them not spilling into production. Now it's done automatically.
- ✨ Unit tests are pointing at ES modules build, which means that code coverage is correct now, without Babel functions being missed. This is important because now code coverage is real again and now there are no excuses not to perfect it.

## 4.3.0 (2018-02-11)

- ✨ `opts.dontWrapKeys` wildcard matching is now key-sensitive. Thanks to [matcher](https://github.com/sindresorhus/matcher) release today.

## 4.2.0 (2017-10-05)

- ✨ `opts.enforceStrictKeyset`. Default is `true`, but if it is set to `false`, you are allowed to pass in unrecognised keys within an options object. It's handy when reusing options objects across multiple libraries, where API is similar but not exactly the same. As a drawback, you won't be alerted if you guess the API wrongly, pass in an option that doesn't exist in particular library (but you think it does) and `check-types-mini` ([npm](https://www.npmjs.com/package/check-types-mini), [GitLab](https://gitlab.com/codsen/codsen/tree/master/packages/check-types-mini)) detects it and throws an error.

## 4.1.0 (2017-10-05)

- ✨ `opts.preventWrappingIfContains`. It lets you extend functionality of `opts.wrapHeadsWith` - more variable patterns can be added to be ignored.

## 4.0.0 (2017-10-04)

New: `opts.mergeWithoutTrailingBrIfLineContainsBr` - affects default behaviour
Changed: `opts.mergeArraysWithoutLineBreaks` renamed to `opts.mergeArraysWithLineBreaks`

---

- ✨ `opts.mergeWithoutTrailingBrIfLineContainsBr` - then we have an array (of strings, for example), but the reference is string we need to flatten that array. Now the default would be separate each line's content by `<br />`. However, sometimes, rows contain conditional content, which is wrapped with IF statements. In those cases, BR is "moved" inside those IF statements, so that when there's nothing to show, BR is not shown either. This option checks the row's content for BR's and if finds any, doesn't add trailing BR.

```JSON
[
  ...
  "row1_line": "\n{%- if %%-row1_var-%% -%}%%_row1_var_%%<br />{%- endif -%}",
  "row2_line": "\n{%- if %%-row2_var-%% -%}%%_row2_var_%%<br />{%- endif -%}",
  ...
]
```

Notice how in the example above, `<br />`'s are inside IF conditionals. We wouldn't want the above flattened to:

```
\n{%- if %%-row1_var-%% -%}%%_row1_var_%%<br />{%- endif -%}<br />
\n{%- if %%-row2_var-%% -%}%%_row2_var_%%<br />{%- endif -%}
```

instead, we want:

```
\n{%- if %%-row1_var-%% -%}%%_row1_var_%%<br />{%- endif -%}
\n{%- if %%-row2_var-%% -%}%%_row2_var_%%<br />{%- endif -%}
```

That's what this feature is about. Also,

- ✨ `opts.mergeArraysWithoutLineBreaks` renamed to `opts.mergeArraysWithLineBreaks`. I don't know what happend in back then in the summer but this setting is named opposite it should have been named.

## 3.6.0 (2017-10-02)

- ✨ The main source now is in ES2015 modules with `import`/`export`.
- ✨ Implemented Rollup to generate 3 flavours of this package: CommonJS, UMD and ESM `module` with `import`/`export`. As a bonus, the Babel setup does not ignore `node_modules` where all dependencies sit, what means no matter were they transpiled or not (I'm looking at you, Sindre), this library will not cause problems in `create-react-app` and the likes.

## 3.5.0 (2017-10-02)

- ✨ `opts.dontWrapPaths` - let's you ignore the paths precisely, for example, you can put an exact path leading to the key like: `modules[0].part2[1].ccc[0].kkk`.

## 3.4.0 (2017-10-02)

- ✨ Now serving a transpiled version.
- ✨ Raw ESLint, removed JS Standard.

## 3.3.0 (2017-08-21)

- ✨ `opts.mergeArraysWithoutLineBreaks` to skip adding the `<br />`'s when merging arrays. The problem was that we do need the `br`'s but when rows are wrapped with conditional statements, those `br`'s end up _inside_ the conditional statements, so we need to turn off automatic addition of `br`'s because otherwise we would always see them.

Observe this data structure of an imaginary email template, in JSON:

```json
...
"text_field": [
  "%%_row1_line_%%",
  "%%_row2_line_%%",
  "%%_row3_line_%%"
],
"text_field_data": {
  "row1_line": "\n{% if %%-row1_var-%% %}%%_row1_var_%%<br />{% endif %}",
  "row2_line": "\n{% if %%-row2_var-%% %}%%_row2_var_%%<br />{% endif %}",
  "row3_line": "\n{% if %%-row3_var-%% %}%%_row3_var_%%<br />{% endif %}",
  "row1_var": "addressLine1",
  "row2_var": "addressLine2",
  "row3_var": "addressLine3"
},
...
```

With `opts.mergeArraysWithoutLineBreaks` off, the flatten function of this library would add line breaks to after `%%_row1_line_%%` and `%%_row2_line_%%`, but that's wrong, because they would end up outside of conditional statements. Actually, those `br`'s would even be redundant anyway, notice how `row1_line`, `row2_line` and `row3_line` already have `br`'s inside conditional Nunjucks statements...

## 3.2.0 (2017-07-21)

- ✨ More improvements to the array-within-array flattening scenarios.

## 3.1.0 (2017-07-21)

- ✨ When deeper level array is flattened referencing a string, result is the sum of all strings within the array, joined with a space, and each string wrapped according to wrapping settings.

For example, `['aaa', 'bbb', 'ccc']` referencing string 'zzz' would yield string `%%_aaa_%% %%_bbb_%% %%_ccc_%%` (that's default wrapping settings, which can be customised).

## 3.0.0 (2017-04-27)

- 🔧 `opts.wrapHeads` is now `opts.wrapHeadsWith`
- 🔧 `opts.wrapTails` is now `opts.wrapTailsWith`

## 2.0.0 (2017-04-25)

- 🔧 Major API change and major semver bump: `opts.dontWrapKeysStartingWith` and `opts.dontWrapKeysEndingWith` are now one key, `opts.dontWrapKeys` and the same (and better) result is achieved using wildcards (`*` symbols). Now you can have as many wildcards as you like, not only at the beginning or the ending of a string (or arrays of strings), but also anywhere in the middle too. Also you can set multiple wildcards in the same string.

## 1.2.0 (2017-04-24)

- ✨ Made the algorithm to be even more smarter: when the value has no spaces around already existing `heads` and `tails`, for example `{{value}}`, but you want, in general, to have a space around your wrappings, you set `heads` for for example: `{{` with a trailing space. Previously, this would have caused double wrapping. Now, `heads` and `tails` are trimmed before search, so go crazy with the white space!

## 1.1.0 (2017-04-20)

- ✨ New options setting `opts.ignore` which lets you skip flattening on an array (or a single string) of keys.
- ✨ New options setting `opts.whatToDoWhenReferenceIsMissing` which allows you to specify exactly what do you want to happen when the equivalent value in the reference (object/array/string/whatever) is falsey.
- 🔧 Done some rebasing, for example, `util.arrayiffyString` now DRY'ies the code a bit.

## 1.0.0 (2017-04-03)

- ✨ First public release
