# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## 6.0.0 (2022-12-01)

### BREAKING CHANGES

- Minimum supported Node version is v14.18; we're dropping v12 support

## 5.0.22 (2022-08-02)

### Fixed

- export Opts and Res types ([a91c313](https://github.com/codsen/codsen/commit/a91c31378be43a93a51893d3383a3b53cb2bc5f0))

## 5.0.16 (2022-04-18)

### Fixed

- tweak types ([104a64a](https://github.com/codsen/codsen/commit/104a64ab783c05af4ae8bd3eb653742eb95d0cd2))

## 5.0.0 (2021-09-09)

### Fixed

- tweaks to the line length calculation ([4ec1fe2](https://github.com/codsen/codsen/commit/4ec1fe224f8e2c32e94c085afb8cf517cc806a8c))

### Features

- avoid two closing curlies in a sequence ([b7293b0](https://github.com/codsen/codsen/commit/b7293b0bd5e132946936d41cfa36d27e61a11522)), closes [#16](https://github.com/codsen/codsen/issues/16)
- migrate to ES Modules ([8c9d95d](https://github.com/codsen/codsen/commit/8c9d95d5dea0b769c2f070397141918a4893d575))

### BREAKING CHANGES

- programs now are in ES Modules and won't work with Common JS `require()`

## 4.2.0 (2021-05-24)

### Features

- config file based major bump blacklisting ([e15f9bb](https://github.com/codsen/codsen/commit/e15f9bba1c4fd5f847ac28b3f38fa6ee633f5dca))

## 4.1.9 (2021-04-11)

### Reverts

- Revert "chore: setup refresh" ([23cf206](https://github.com/codsen/codsen/commit/23cf206970a087ff0fa04e61f94d919f59ab3881))

## 4.1.5 (2021-03-28)

### Fixed

- retain the same type of line endings as the input ([b171628](https://github.com/codsen/codsen/commit/b171628d3fc1c0909af61530c1bcaf970c310159))

## 4.1.0 (2021-02-27)

### Features

- single line break to be replaced with a single space ([020c26b](https://github.com/codsen/codsen/commit/020c26b9af81675f0b9dde097e218381a0ea3ef3)), closes [#3](https://github.com/codsen/codsen/issues/3)

## 4.0.1 (2021-01-28)

### Fixed

- add `testStats` to npmignore ([f3c84e9](https://github.com/codsen/codsen/commit/f3c84e95afc5514214312f913692d85b2e12eb29))
- correct the line length calculation around inline tags ([073f7a5](https://github.com/codsen/codsen/commit/073f7a5a2bb3f8ce0460e674deed9cf1eff63409))

## 4.0.0 (2021-01-23)

### Features

- rewrite in TS ([0ad6b4b](https://github.com/codsen/codsen/commit/0ad6b4bb7f3f883323b63dd26d4b196fa8cd50ed))

### BREAKING CHANGES

- there are no changes to the API, but just for safety, we're bumping _major_

## 2.0.5 (2020-09-15)

### Fixed

- improve CRLF line ending recognition ([ff3e3e7](https://gitlab.com/codsen/codsen/commit/ff3e3e7d7943a52e2339fb78e0cbd4677b72a11a))

## 2.0.0 (2020-07-04)

### Fixed

- fix typo in the output, in `log.timeTakenInMilliseconds` ([48debda](https://gitlab.com/codsen/codsen/commit/48debda98858aa83d6f7df4a3b7f85895756d67e))

### Features

- `opts.removeHTMLComments` ([2e51439](https://gitlab.com/codsen/codsen/commit/2e514393a3d25c9ebcc858435598964a1171f7d0))
- add recognition for outlook conditionals ([61f61c1](https://gitlab.com/codsen/codsen/commit/61f61c1ec5769e27f2ddd9a7d849a3b65c75d5d8))
- crop tighter around conditional comments ([cbc7383](https://gitlab.com/codsen/codsen/commit/cbc7383b702607e0b889d578433d78c838596b9f))
- report `applicableOpts` in the output ([fd3c879](https://gitlab.com/codsen/codsen/commit/fd3c8799d299b65ecdd090d964174fe7bd028f22))

### BREAKING CHANGES

- in output, `log.timeTakenInMiliseconds` is now called `log.timeTakenInMilliseconds`
  (two l's)

## 1.9.35 (2020-05-24)

### Fixed

- fixes the `pre`, `code`, `CDATA` and other code chunk skipping ([ec0408a](https://gitlab.com/codsen/codsen/commit/ec0408afee0b1a09cd711549cab6fefdc55efde8)), closes [#29](https://gitlab.com/codsen/codsen/issues/29)

## 1.9.0 (2019-09-14)

### Features

- don't remove space in front of !important within HTML conditionals ([e997f51](https://gitlab.com/codsen/codsen/commit/e997f51))

Davide Riva reported on emailgeeks slack that space in front of `!important` should not be removed, for example:

```html
<!--[if lte mso 11]>
  <style type="text/css">
    .class {
      width: 100% !important;
    }
  </style>
<![endif]-->
```

That's now implemented.

## 1.8.5 (2019-09-04)

### Fixed

- stop breaking `<!--<![endif]-->` into two parts, in front of `<![endif]` ([af421c7](https://gitlab.com/codsen/codsen/commit/af421c7))

## 1.8.3 (2019-08-24)

### Fixed

- adding one more breaking point for insurance, thanks Mark Robbins ([b21651b](https://gitlab.com/codsen/codsen/commit/b21651b))

## 1.8.0 (2019-08-08)

### Fixed

- previously inner tag whitespace removal was too lax, risking false positives ([ab59492](https://gitlab.com/codsen/codsen/commit/ab59492))
- update the program's name on throw error reports ([abd093a](https://gitlab.com/codsen/codsen/commit/abd093a))

### Features

- don't minify whitespace around brackets if there is a number on either side ([21ea2ff](https://gitlab.com/codsen/codsen/commit/21ea2ff))

## 1.7.0 (2019-07-24)

### Features

- Don't delete whitespace between closing curly brace and opening curly brace ([ef5efaa](https://gitlab.com/codsen/codsen/commit/ef5efaa))

## 1.6.0 (2019-07-15)

### Fixed

- Fix the rare cases where state of being within style tag was not terminated properly ([fefc206](https://gitlab.com/codsen/codsen/commit/fefc206)), closes [#11](https://gitlab.com/codsen/codsen/issues/11)

### Features

- Inline tag recognition and proper spacing ([ad97faf](https://gitlab.com/codsen/codsen/commit/ad97faf))

## 1.5.0 (2019-06-29)

### Features

- Set up perf checks ([c3ff0bf](https://gitlab.com/codsen/codsen/commit/c3ff0bf))

## 1.4.0 (2019-06-21)

### Features

- Break to the right of opening style tag if breaking on the left is turned on ([67ca84a](https://gitlab.com/codsen/codsen/commit/67ca84a))

## 1.3.0 (2019-06-18)

### Features

- `opts.reportProgressFuncFrom` and `opts.reportProgressFuncTo` ([4ebf439](https://gitlab.com/codsen/codsen/commit/4ebf439))
- Re-distribute the ratio of progress reported during main and final tasks ([1e80408](https://gitlab.com/codsen/codsen/commit/1e80408))

## 1.2.0 (2019-06-01)

### Features

- Delete leading whitespace inside inline CSS ([614d11b](https://gitlab.com/codsen/codsen/commit/614d11b))

## 1.1.0 (2019-06-01)

### Features

- Inline CSS minification ([0518f05](https://gitlab.com/codsen/codsen/commit/0518f05))
- Only replace line breaks when result will be smaller in size, not the same ([a431686](https://gitlab.com/codsen/codsen/commit/a431686))

## 1.0.11 (2019-04-06)

### Fixed

- Algorithm improvement not to break in front of `</a>` to prevent accidentally adding new spaces ([8939654](https://gitlab.com/codsen/codsen/commit/8939654))

## 0.8.0 (2019-01-20)

- Various documentation and setup tweaks after we migrated to monorepo
- Setup refresh: updated dependencies and all config files using automated tools

## 0.7.0 (2019-01-11)

- Add one more tag before which there will be a line break ([4f00871](https://gitlab.com/codsen/codsen/tree/master/packages/html-crush/commits/4f00871))

## 0.6.0 (2018-12-26)

- Add licence block at the top of built files in dist/ folder ([cb2c259](https://gitlab.com/codsen/codsen/tree/master/packages/html-crush/commits/cb2c259))
- Add more logging for doNothing state ([25262e5](https://gitlab.com/codsen/codsen/tree/master/packages/html-crush/commits/25262e5))
- Do not touch `CDATA` blocks ([920e9d9](https://gitlab.com/codsen/codsen/tree/master/packages/html-crush/commits/920e9d9))
- Don't minify script tags contents ([557e8fa](https://gitlab.com/codsen/codsen/tree/master/packages/html-crush/commits/557e8fa))
- Don't touch code within pre-code blocks ([d32c092](https://gitlab.com/codsen/codsen/tree/master/packages/html-crush/commits/d32c092))
- Fetch a handful of real websites and minify them for tests ([f7e8153](https://gitlab.com/codsen/codsen/tree/master/packages/html-crush/commits/f7e8153))
- Remove whitespace within `<script>` blocks, in front of `</script>` ([d1efb20](https://gitlab.com/codsen/codsen/tree/master/packages/html-crush/commits/d1efb20))
- Treat the whitespace in front of `<script>` ([75d85dc](https://gitlab.com/codsen/codsen/tree/master/packages/html-crush/commits/75d85dc))

## 0.5.0 (2018-12-14)

- Added licence banner at the top of each built file (all files in `dist/` folder)
- Improved readme file

## 0.4.0 (2018-12-13)

- Delete whitespace within `<script>` tag, before closing `</script>`.
- Added unit tests minifying a handful of real-world websites. If URL fetch succeeds and source HTML is a string and not an empty-one, we minify with couple settings and measure, are results less than or equal to the original sources.

## 0.3.0 (2018-12-12)

- Improvements to whitespace control in front of `<script>` tag when some options are on.

## 0.2.0 (2018-12-11)

- Program will not touch:
  - `CDATA` blocks
  - `<pre><code>...</code></pre>` blocks
  - `<script>` tag contents

## 0.1.0 (2018-12-10)

- First public release
