# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# 4.0.0 (2021-01-23)


### Bug Fixes

* adding one more breaking point for insurance, thanks Mark Robbins ([12235f9](https://github.com/codsen/codsen/commit/12235f93e58e710860ac21d21ce6c1dd9a5c3952))
* Algorithm improvement not to break in front of </a to prevent accidentally adding new spaces ([d70d954](https://github.com/codsen/codsen/commit/d70d954a7d30f561b17d2adf8902e276e36f4708))
* Fix the Create New Issue URLs ([f5a41bf](https://github.com/codsen/codsen/commit/f5a41bf16fd8f43de7f8e7de68da562821ddb960))
* Fix the rare cases where state of being within style tag was not terminated properly ([29bf03a](https://github.com/codsen/codsen/commit/29bf03a4d8885f8baff3d4e9f9f1fa51c601376a)), closes [#11](https://github.com/codsen/codsen/issues/11)
* fix typo in the output, in log.timeTakenInMilliseconds ([6b7db74](https://github.com/codsen/codsen/commit/6b7db745281135cacfea3f0229214d8654c511fd))
* fixes the pre, code, CDATA and other code chunk skipping ([d177c86](https://github.com/codsen/codsen/commit/d177c868a68c84207980b0b7bcbb0190150bd8eb)), closes [#29](https://github.com/codsen/codsen/issues/29)
* improve CRLF line ending recognition ([6fa0efc](https://github.com/codsen/codsen/commit/6fa0efcd3c3191ba028d4296a057e49b2799dc36))
* previously inner tag whitespace removal was too lax, risking false positives ([8e30b2f](https://github.com/codsen/codsen/commit/8e30b2f97a4ceeeff60485eb95418fe7aab764d3))
* stop breaking <!--<![endif]--> into two parts, in front of <![endif] ([0e85cc5](https://github.com/codsen/codsen/commit/0e85cc5dcdaa549f53a9ce99b03d7f8f466721a4))
* update the program's name on throw error reports ([b825828](https://github.com/codsen/codsen/commit/b8258285edb7d435c715f1c0b79244ecb6fe79b2))


### Features

* `opts.removeHTMLComments` ([3f0b32a](https://github.com/codsen/codsen/commit/3f0b32a09bbb1f71834bac1ebc7538ad7e98f794))
* add licence block at the top of built files in dist/ folder ([a255199](https://github.com/codsen/codsen/commit/a255199e3a8e9a1ef3f7076d3a96792680e78ca1))
* add more logging for doNothing state ([8cfceaa](https://github.com/codsen/codsen/commit/8cfceaab36d42c90043ade196ca18ac7a33e1b0b))
* Add one more tag before which there will be a line break ([d178203](https://github.com/codsen/codsen/commit/d1782036b134102fd552d38d2d4f39c93195620b))
* add recognition for outlook conditionals ([7e66a03](https://github.com/codsen/codsen/commit/7e66a0359089271e3761469aafbadf1d05534da4))
* Break to the right of opening style tag if breaking on the left is turned on ([677a35d](https://github.com/codsen/codsen/commit/677a35d1cafa7454eca2307f923199e154e9360e))
* crop tighter around conditional comments ([50a585a](https://github.com/codsen/codsen/commit/50a585ab90eda129c3f6cf38759bd5e591b7c733))
* Delete leading whitespace inside inline CSS ([9d97964](https://github.com/codsen/codsen/commit/9d979648cf21503ee0ea94088cd8c190b8ee496e))
* do not touch CDATA blocks ([749333f](https://github.com/codsen/codsen/commit/749333f5bc0aba4a04208c3f8891d808eed3016a))
* Don't delete whitespace between closing curly brace and opening curly brace ([48d9d72](https://github.com/codsen/codsen/commit/48d9d72333d03548b647414662682c60c0330dc8))
* don't minify script tags contents ([391522e](https://github.com/codsen/codsen/commit/391522ec169005d5c42e3d7d8856fa77a2da97e2))
* don't minify whitespace around brackets if there is a number on either side ([b396029](https://github.com/codsen/codsen/commit/b3960290dd5af72acfc9845a9fb0a5e738237335))
* don't remove space in front of !important within HTML conditionals ([15affbd](https://github.com/codsen/codsen/commit/15affbd11484fb4e572b239362f801cb1ba6ee8e))
* don't touch code within pre-code blocks ([606ad0f](https://github.com/codsen/codsen/commit/606ad0fb0196e102bef245972652643876fe8f49))
* fetch handful of real websites and minify them for tests ([1fa88b6](https://github.com/codsen/codsen/commit/1fa88b69e1aca56cced18e8df6286f21861a2088))
* Initial release ([8db2df9](https://github.com/codsen/codsen/commit/8db2df9fb08d66cf6c7a75a57cdcd15a5ec12c1c))
* Inline CSS minification ([1ddaadc](https://github.com/codsen/codsen/commit/1ddaadc50e112d84e9cc313b16468465bc48e2f5))
* Inline tag recognition and proper spacing ([826ef62](https://github.com/codsen/codsen/commit/826ef626f4aedc81123834fe4ba6846f14d25465))
* Merge modes via opts.mergeType ([2394464](https://github.com/codsen/codsen/commit/2394464976ce1970bcd31b45d9fd9955f4bbcc09))
* Only replace linebreaks when result will be smaller in size, not the same ([439d093](https://github.com/codsen/codsen/commit/439d0932e97a68e73e58111f45e4b69ffe1f33db))
* opts.reportProgressFuncFrom and opts.reportProgressFuncTo ([71a94c7](https://github.com/codsen/codsen/commit/71a94c7ebbdfbf853a5c56062ffc9609335caa15))
* Re-distribute the ratio of progress reported during main and final tasks ([01d6e14](https://github.com/codsen/codsen/commit/01d6e14b52226f25e9e0263fd22791ec608b54ba))
* remove whitespace within <script> blocks, in front of </script> ([79854a8](https://github.com/codsen/codsen/commit/79854a8db6c879859309c93552b006462b1a5ebe))
* report `applicableOpts` in the output ([1b75ecc](https://github.com/codsen/codsen/commit/1b75ecc8b5ae097c439431d3976628d2583ab4c5))
* rewrite in TS ([0ad6b4b](https://github.com/codsen/codsen/commit/0ad6b4bb7f3f883323b63dd26d4b196fa8cd50ed))
* Set up perf checks ([f6b7ce9](https://github.com/codsen/codsen/commit/f6b7ce9ccb4d898c05923adef66be24d9de27610))
* treat the whitespace in front of <script> ([bed5c1b](https://github.com/codsen/codsen/commit/bed5c1b789cd54315eae3d147190d45ea20710f6))
* WIP - only 4 failing - minding the inline tags ([468db13](https://github.com/codsen/codsen/commit/468db13c7ba45bef41a622cf99634b736c0f715b))


### BREAKING CHANGES

* in output, log.timeTakenInMiliseconds is now called log.timeTakenInMilliseconds
(two l's)
* Second input argument, progressFn, was moved into opts.progressFn and opts was
placed into second input argument instead





## 3.0.0 (2020-11-28)

Accidental version bump during migration to sourcehut. Sorry about that.

## 2.0.5 (2020-09-15)

### Bug Fixes

- improve CRLF line ending recognition ([ff3e3e7](https://gitlab.com/codsen/codsen/commit/ff3e3e7d7943a52e2339fb78e0cbd4677b72a11a))

## 2.0.0 (2020-07-04)

### Bug Fixes

- fix typo in the output, in log.timeTakenInMilliseconds ([48debda](https://gitlab.com/codsen/codsen/commit/48debda98858aa83d6f7df4a3b7f85895756d67e))

### Features

- `opts.removeHTMLComments` ([2e51439](https://gitlab.com/codsen/codsen/commit/2e514393a3d25c9ebcc858435598964a1171f7d0))
- add recognition for outlook conditionals ([61f61c1](https://gitlab.com/codsen/codsen/commit/61f61c1ec5769e27f2ddd9a7d849a3b65c75d5d8))
- crop tighter around conditional comments ([cbc7383](https://gitlab.com/codsen/codsen/commit/cbc7383b702607e0b889d578433d78c838596b9f))
- report `applicableOpts` in the output ([fd3c879](https://gitlab.com/codsen/codsen/commit/fd3c8799d299b65ecdd090d964174fe7bd028f22))

### BREAKING CHANGES

- in output, log.timeTakenInMiliseconds is now called log.timeTakenInMilliseconds
  (two l's)

## 2.0.0

- renamed output `log.timeTakenInMiliseconds` to `log.timeTakenInMilliseconds` (was a typo)
- output returns `applicableOpts` - handy in UI's, to show only applicable options. Not all options can be "applicable" or not so this list contains only some of available options, not all.

## 1.9.35 (2020-05-24)

### Bug Fixes

- fixes the pre, code, CDATA and other code chunk skipping ([ec0408a](https://gitlab.com/codsen/codsen/commit/ec0408afee0b1a09cd711549cab6fefdc55efde8)), closes [#29](https://gitlab.com/codsen/codsen/issues/29)

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

### Bug Fixes

- stop breaking `<!--<![endif]-->` into two parts, in front of `<![endif]` ([af421c7](https://gitlab.com/codsen/codsen/commit/af421c7))

## 1.8.3 (2019-08-24)

### Bug Fixes

- adding one more breaking point for insurance, thanks Mark Robbins ([b21651b](https://gitlab.com/codsen/codsen/commit/b21651b))

## 1.8.0 (2019-08-08)

### Bug Fixes

- previously inner tag whitespace removal was too lax, risking false positives ([ab59492](https://gitlab.com/codsen/codsen/commit/ab59492))
- update the program's name on throw error reports ([abd093a](https://gitlab.com/codsen/codsen/commit/abd093a))

### Features

- don't minify whitespace around brackets if there is a number on either side ([21ea2ff](https://gitlab.com/codsen/codsen/commit/21ea2ff))

## 1.7.0 (2019-07-24)

### Features

- Don't delete whitespace between closing curly brace and opening curly brace ([ef5efaa](https://gitlab.com/codsen/codsen/commit/ef5efaa))

## 1.6.0 (2019-07-15)

### Bug Fixes

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

- opts.reportProgressFuncFrom and opts.reportProgressFuncTo ([4ebf439](https://gitlab.com/codsen/codsen/commit/4ebf439))
- Re-distribute the ratio of progress reported during main and final tasks ([1e80408](https://gitlab.com/codsen/codsen/commit/1e80408))

## 1.2.0 (2019-06-01)

### Features

- Delete leading whitespace inside inline CSS ([614d11b](https://gitlab.com/codsen/codsen/commit/614d11b))

## 1.1.0 (2019-06-01)

### Features

- Inline CSS minification ([0518f05](https://gitlab.com/codsen/codsen/commit/0518f05))
- Only replace linebreaks when result will be smaller in size, not the same ([a431686](https://gitlab.com/codsen/codsen/commit/a431686))

## 1.0.11 (2019-04-06)

### Bug Fixes

- Algorithm improvement not to break in front of `</a>` to prevent accidentally adding new spaces ([8939654](https://gitlab.com/codsen/codsen/commit/8939654))

## 0.8.0 (2019-01-20)

- ✨ Various documentation and setup tweaks after we migrated to monorepo
- ✨ Setup refresh: updated dependencies and all config files using automated tools

## 0.7.0 (2019-01-11)

- ✨ Add one more tag before which there will be a line break ([4f00871](https://gitlab.com/codsen/codsen/tree/master/packages/html-crush/commits/4f00871))

## 0.6.0 (2018-12-26)

- ✨ Add licence block at the top of built files in dist/ folder ([cb2c259](https://gitlab.com/codsen/codsen/tree/master/packages/html-crush/commits/cb2c259))
- ✨ Add more logging for doNothing state ([25262e5](https://gitlab.com/codsen/codsen/tree/master/packages/html-crush/commits/25262e5))
- ✨ Do not touch CDATA blocks ([920e9d9](https://gitlab.com/codsen/codsen/tree/master/packages/html-crush/commits/920e9d9))
- ✨ Don't minify script tags contents ([557e8fa](https://gitlab.com/codsen/codsen/tree/master/packages/html-crush/commits/557e8fa))
- ✨ Don't touch code within pre-code blocks ([d32c092](https://gitlab.com/codsen/codsen/tree/master/packages/html-crush/commits/d32c092))
- ✨ Fetch a handful of real websites and minify them for tests ([f7e8153](https://gitlab.com/codsen/codsen/tree/master/packages/html-crush/commits/f7e8153))
- ✨ Remove whitespace within `<script>` blocks, in front of `</script>` ([d1efb20](https://gitlab.com/codsen/codsen/tree/master/packages/html-crush/commits/d1efb20))
- ✨ Treat the whitespace in front of `<script>` ([75d85dc](https://gitlab.com/codsen/codsen/tree/master/packages/html-crush/commits/75d85dc))

## 0.5.0 (2018-12-14)

- ✨ Added licence banner at the top of each built file (all files in `dist/` folder)
- ✨ Improved readme file

## 0.4.0 (2018-12-13)

- ✨ Delete whitespace within `<script>` tag, before closing `</script>`.
- ✨ Added unit tests minifying a handful of real-world websites. If URL fetch succeeds and source HTML is a string and not an empty-one, we minify with couple settings and measure, are results less than or equal to the original sources.

## 0.3.0 (2018-12-12)

- ✨ Improvements to whitespace control in front of `<script>` tag when some options are on.

## 0.2.0 (2018-12-11)

- ✨ Program will not touch:
  - CDATA blocks
  - `<pre><code>...</code></pre>` blocks
  - `<script>` tag contents

## 0.1.0 (2018-12-10)

- ✨ First public release
