# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# [2.8.0](https://gitlab.com/codsen/codsen/compare/emlint@2.7.0...emlint@2.8.0) (2020-01-01)


### Features

* harden the rule `attribute-malformed`, flag up all non-recognised attrs ([fc949a7](https://gitlab.com/codsen/codsen/commit/fc949a7c978ef4d4e46864941aba2092f9176b32))
* improvements to attribute-validate-archive and others ([f8b35fe](https://gitlab.com/codsen/codsen/commit/f8b35fe51a22e2014516d521f89b3270c4b35d5d))
* new rule, `attribute-validate-cols` ([05fb199](https://gitlab.com/codsen/codsen/commit/05fb19937080f1223278b6381de47db9f884f55b))
* new rule, `attribute-validate-colspan` ([e72fa98](https://gitlab.com/codsen/codsen/commit/e72fa98594698689cb1b09405c42af1c62d2e9c0))
* new rule, `attribute-validate-compact` ([ec7e4f3](https://gitlab.com/codsen/codsen/commit/ec7e4f36d016c93c27f15ac73e7ac962057d669b))
* new rule, `attribute-validate-content` ([a076d71](https://gitlab.com/codsen/codsen/commit/a076d719ae3e4e56416837897ee8a3feb48d48ab))
* new rule, `attribute-validate-coords` ([f3baa58](https://gitlab.com/codsen/codsen/commit/f3baa58eb4dbf6ffde6130b2afa424ad7f3752ca))
* new rule, `attribute-validate-data` ([3cd016a](https://gitlab.com/codsen/codsen/commit/3cd016a42b580188badd6a1bff9f6e099dea49a4))
* new rule, `attribute-validate-datetime` ([62b8776](https://gitlab.com/codsen/codsen/commit/62b8776320880f9d46289897cbc32cc408888a69))
* new rule, `attribute-validate-declare` ([e16fd80](https://gitlab.com/codsen/codsen/commit/e16fd806242b2e29117b313fabf9fce1c76d59e7))
* new rule, `attribute-validate-defer` ([52d0acd](https://gitlab.com/codsen/codsen/commit/52d0acdd7b8ab7673973d2baf34d14efa97a7b7a))
* new rule, `attribute-validate-dir` ([086a83d](https://gitlab.com/codsen/codsen/commit/086a83d2eafcce592bb484e833a676c68ae9fc05))
* new rule, `attribute-validate-disabled` ([45bb607](https://gitlab.com/codsen/codsen/commit/45bb6070ebbe95a5ebd86b2caf5a9f3dd2c5db08))
* new rule, `attribute-validate-enctype` ([5f1098c](https://gitlab.com/codsen/codsen/commit/5f1098cffc8d90bf543922c45579416c6ca33277))
* new rule, `attribute-validate-for` ([7a53a41](https://gitlab.com/codsen/codsen/commit/7a53a41467cc113e35123892c8cb084ecdb922cb))
* new rule, `attribute-validate-rowspan` ([a234874](https://gitlab.com/codsen/codsen/commit/a2348744449cbe7d4c8a1e006fbe59a1bbf2db57))
* show all permitted values in error messages instead of complaining about wrong value ([a5ee245](https://gitlab.com/codsen/codsen/commit/a5ee24596b1bce7bc2f800a425bd4a5b4c0ea0d2))





## 2.7.0 (2019-12-27)

### Features

- levenshtein distance for attribute names ([3ab2e83](https://gitlab.com/codsen/codsen/commit/3ab2e83f5c3ed2c43bbccbeea0144f042d10f955))
- new rule, `attribute-duplicate` ([1fc32a5](https://gitlab.com/codsen/codsen/commit/1fc32a590a0f7ff9a0cd6e48650e2321d4b387cd))
- new rule, `attribute-validate-axis` ([9da98c7](https://gitlab.com/codsen/codsen/commit/9da98c7239dc9af9e82e146873df758f16f00f10))
- new rule, `attribute-validate-background` ([6628374](https://gitlab.com/codsen/codsen/commit/662837478503547df33b767c4679a6a1c209a7b5))
- new rule, `attribute-validate-bgcolor` ([bfa84e7](https://gitlab.com/codsen/codsen/commit/bfa84e7684aa087f78ee17964506820d68b414c2))
- new rule, `attribute-validate-cellpadding` ([47a927f](https://gitlab.com/codsen/codsen/commit/47a927fd8ae1aa661a7079769eec7c94e7c039c6))
- new rule, `attribute-validate-cellspacing` ([273d551](https://gitlab.com/codsen/codsen/commit/273d551a80fa719d09e23ef756676bed2bb2fab1))
- new rule, `attribute-validate-char` ([d3eef87](https://gitlab.com/codsen/codsen/commit/d3eef878a8ab4412122d20a2dd93893ab5ac1217))
- new rule, `attribute-validate-charoff` ([4528a17](https://gitlab.com/codsen/codsen/commit/4528a17a78c82a8320927ee014ebcc3682cffd1b))
- new rule, `attribute-validate-charset` ([c2749c2](https://gitlab.com/codsen/codsen/commit/c2749c25e6bc8b20054438302ffe4cff79c49af7))
- new rule, `attribute-validate-checked` ([29a7047](https://gitlab.com/codsen/codsen/commit/29a70472d3a222e7253dfb89dafb5ed753f17513))
- new rule, `attribute-validate-cite` ([ec72be6](https://gitlab.com/codsen/codsen/commit/ec72be6987b0282633aaebbc65820741aec82bc4))
- new rule, `attribute-validate-class` ([de68974](https://gitlab.com/codsen/codsen/commit/de6897496bf76c86ff11ca6ee2bff8eab9e197b7))
- new rule, `attribute-validate-classid` ([4de2985](https://gitlab.com/codsen/codsen/commit/4de2985bb18201f9dff70a93e6db92e175a1580e))
- new rule, `attribute-validate-clear` ([9997520](https://gitlab.com/codsen/codsen/commit/9997520caf9f22dde8161a80a7888cfc3f6b7b18))
- new rule, `attribute-validate-code` ([60b085b](https://gitlab.com/codsen/codsen/commit/60b085bd79823327c995324d1900858d22a69b6d))
- new rule, `attribute-validate-codebase` ([08ccf17](https://gitlab.com/codsen/codsen/commit/08ccf177aa7122d23820dcb596e5fa609752b176))
- new rule, `attribute-validate-codetype` ([228e3bc](https://gitlab.com/codsen/codsen/commit/228e3bc44f6223c9adbceb744a07f1d7b7d59866))
- new rule, `attribute-validate-color` ([8f174c6](https://gitlab.com/codsen/codsen/commit/8f174c629802a3205d7394f128687ac971653f4f))
- new rule, `attribute-validate-id` ([6cb9ba8](https://gitlab.com/codsen/codsen/commit/6cb9ba82a7ed5cd2927bd22037622cb012bf716f))
- rules `attribute-validate-class`/`id`, detect duplicate `class`/`id` names ([dfe570d](https://gitlab.com/codsen/codsen/commit/dfe570d0f0638cb4915bf8c8110e10aa3c5c9761))

## 2.6.0 (2019-12-21)

### Features

- add parent tag validation for `attribute-validate-accept` ([bc23026](https://gitlab.com/codsen/codsen/commit/bc230264ec9e4d2a5513d7323c5d6c86239d049f))
- new rule, `attribute-validate-archive` ([7fa39f3](https://gitlab.com/codsen/codsen/commit/7fa39f34f4ae6e3936828d81184ac58e9bc24871))
- new rule, `attribute-validate-abbr` ([168009c](https://gitlab.com/codsen/codsen/commit/168009c1cbc8067761d84bb5812dbca10573871f))
- new rule, `attribute-validate-accept` ([4993b5a](https://gitlab.com/codsen/codsen/commit/4993b5a55a0f7335fceff7d12aeed7fd9973c1bc))
- new rule, `attribute-validate-accept-charset` ([d5a52cb](https://gitlab.com/codsen/codsen/commit/d5a52cb4cf2ceaa1660174f049dd4bf279ab9e27))
- new rule, `attribute-validate-accesskey` ([d83018c](https://gitlab.com/codsen/codsen/commit/d83018cab02081eae2792424cea83db385880054))
- new rule, `attribute-validate-action` ([8e18a6f](https://gitlab.com/codsen/codsen/commit/8e18a6f1a50cbc9957b38b670ee3cd17f78d3548))
- new rule, `attribute-validate-align` ([632b758](https://gitlab.com/codsen/codsen/commit/632b75852db4302b1a9f8548a50c6910947a64b8))
- new rule, `attribute-validate-alink` ([9f9a94b](https://gitlab.com/codsen/codsen/commit/9f9a94bd4225344997b1755dcfad13d2613aae56))
- new rule, `attribute-validate-border` + some housekeeping ([d245a14](https://gitlab.com/codsen/codsen/commit/d245a14d34e4984efeeee24bd97c677069d99e5b))
- new rule, `attribute-validate-width` ([4929609](https://gitlab.com/codsen/codsen/commit/4929609f9c55a0d8f5b78258f0b2f94b665f7c26))
- parent tag validation for attributes ([788157f](https://gitlab.com/codsen/codsen/commit/788157fd059b248ec86a9c2775a73a191d64061e))

## 2.5.0 (2019-12-09)

### Features

- new rule, `attribute-malformed` + new emitted event type, "`attribute`" ([6afac3d](https://gitlab.com/codsen/codsen/commit/6afac3db43aff939e4b2eb254ab08b9d0c8fe751))
- new rule, `bad-character-replacement-character` ([82b24b8](https://gitlab.com/codsen/codsen/commit/82b24b8d18fc0be5416f6e72c753589564857aa4))
- new rule, `character-unspaced-punctuation` ([e60a806](https://gitlab.com/codsen/codsen/commit/e60a8063ec870d64867b47f93aea5a7482268b4e))
- new rule, `tag-bold` ([bb907cd](https://gitlab.com/codsen/codsen/commit/bb907cd6f350d4d1c8ca0480106a3780342ab3e2))
- new rule, `tag-is-present` ([e627c14](https://gitlab.com/codsen/codsen/commit/e627c141c22e338d87e8d70bcc49bc99e9df0727))
- rename and beef up rule: `bad-character-tabulation` ([cd4d0a0](https://gitlab.com/codsen/codsen/commit/cd4d0a0f9ce5c36e69113d544f6c68516f94de77))

## 2.4.0 (2019-11-27)

### Features

- improvements to ESP tag recognition ([8ac47b1](https://gitlab.com/codsen/codsen/commit/8ac47b16af23946c86076410d1bddf9f6dc40c49))
- make rules more composable ([7cf3cbf](https://gitlab.com/codsen/codsen/commit/7cf3cbf81c09635e81f36db8a776a217c2bdd8f0))
- new rule, all - plus removing all listeners in the end of a program ([d6bc792](https://gitlab.com/codsen/codsen/commit/d6bc792d091a4281d816aa450195b11179cd3402))
- new rule, `character-encode` ([17c35ad](https://gitlab.com/codsen/codsen/commit/17c35ad06c480aa18eb4716e4b6813658599ff3a))
- new rule, `tag-name-case` ([503ac91](https://gitlab.com/codsen/codsen/commit/503ac912004496343abcb98fb1b241f112d7122c))
- put names on the most common entities in error description ([69233df](https://gitlab.com/codsen/codsen/commit/69233df7210441ace1abd723b8c261ad3e443dc7))
- rule tag-name-case - doctype and cdata wrong case (being not uppercase) ([da9f68a](https://gitlab.com/codsen/codsen/commit/da9f68a5a2af4b5c8dab8b0ae00c8d153456630f))

## 2.3.0 (2019-11-21)

### Bug Fixes

- when bad entity rules are disabled, they do not raise any issues ([6f06ce2](https://gitlab.com/codsen/codsen/commit/6f06ce2429d7cea4c49bd6523e2b2c9fbd6588a8))

### Features

- new rules, `bad-malformed-numeric-character-entity` and `bad-named-html-entity-multiple-encoding` ([d071749](https://gitlab.com/codsen/codsen/commit/d07174976c1c080b101079286165c52bac8acb35))
- new rule, `bad-named-html-entity-not-email-friendly` ([0a72fdc](https://gitlab.com/codsen/codsen/commit/0a72fdc451ba051ce114de01e2e3de92da54094b))
- improvements in malformed entity reporting rules ([d807a45](https://gitlab.com/codsen/codsen/commit/d807a45eba537a62d0296eae8e3626b615c9c1ac))

## 2.2.0 (2019-11-20)

### Features

- add safegard type checks on `linter.verify()` inputs ([fc4f30f](https://gitlab.com/codsen/codsen/commit/fc4f30f99f13b164e9b3950611866218ce41fd19))
- detect backslashes in front of a tag ([eba7347](https://gitlab.com/codsen/codsen/commit/eba734744dbcd5597180f7353762ed7f9a735e28))
- new rule, `bad-named-html-entity-malformed-nbsp` ([75f232f](https://gitlab.com/codsen/codsen/commit/75f232fd3ca214fe674a4792416bf661512c150f))
- new rule, `bad-named-html-entity-unrecognised` ([9ea399d](https://gitlab.com/codsen/codsen/commit/9ea399d9a483dc29bba4c1e3fc83f4b72a35fab9))
- set up broken named html entity rules ([a490e90](https://gitlab.com/codsen/codsen/commit/a490e9079ca449589f5178adb200701f4c71ecde))
- tap the new codsen-tokenizer's API where it pings the characters, remove character emits here ([9f4a2c5](https://gitlab.com/codsen/codsen/commit/9f4a2c5902f78b52580e1ea782483ade24862b62))

## 2.1.0 (2019-11-18)

### Features

- add few more character rules ([8a14f7c](https://gitlab.com/codsen/codsen/commit/8a14f7cee7a15891ccfc59b584d4adc99fab4b23))
- add few more character rules ([2f06a84](https://gitlab.com/codsen/codsen/commit/2f06a84a79b2e265079577ed2576077c8c91ed84))
- add few more character rules ([e80737f](https://gitlab.com/codsen/codsen/commit/e80737f671a6e9d8a75dbfa83bbd39480c186cf7))
- complete creating rules for all ASCII range invisible characters ([3abb85b](https://gitlab.com/codsen/codsen/commit/3abb85b7578d73144cebebcadcd8f021de17a297))
- few more character rules ([e9048ca](https://gitlab.com/codsen/codsen/commit/e9048ca9056e207cb05cfbe2d05f71a94c542dd6))
- few more rules ([8a347be](https://gitlab.com/codsen/codsen/commit/8a347beacb3a6a89376216941bf224e1fb12a812))
- first rule with config, `tag-space-before-closing-slash`, also add `string-left-right` as a dep ([e6b6adb](https://gitlab.com/codsen/codsen/commit/e6b6adb4b100c9841514f5034aca04f38acdcf3e))
- grouped rules - `tag` and `bad-character` ([6aa5096](https://gitlab.com/codsen/codsen/commit/6aa5096ff45882b7e59b2afc30af6ac8fa4b1877))
- new rules `tag-void-slash` and `tag-closing-backslash` ([adce05d](https://gitlab.com/codsen/codsen/commit/adce05d630def6d775446fc9cda8a61366ff1f92))
- two more character rules ([3e7516f](https://gitlab.com/codsen/codsen/commit/3e7516fee7c54a58d1da35cc8b12d8b83707c97d))
- update config on tap to consume all grouped rules ([98d6af4](https://gitlab.com/codsen/codsen/commit/98d6af42a9453376c15f0717ca70cd64c732f8a2))

## 2.0.0 (2019-11-11)

### Features

- add more bad character rules ([4b5ae71](https://gitlab.com/codsen/codsen/commit/4b5ae7117a119db47dae965bd3c3518275891e81))
- make it pluggable - rewrite in observer pattern, separate the tokenizer and tap it ([1c0a0eb](https://gitlab.com/codsen/codsen/commit/1c0a0ebd7dcb307854c88eeee6049658b1a7c3a6))
- set up the tag-level processing, add the first character-level rule ([fc9a89f](https://gitlab.com/codsen/codsen/commit/fc9a89f5a5dbd3a9ee7fe6d14e2cefd21b5a59e0))

### BREAKING CHANGES

- rewrite in observer pattern

## 1.8.0 (2019-10-09)

### Bug Fixes

- make rule tag-space-after-opening-bracket not applicable for HTML comments ([3fac2f6](https://gitlab.com/codsen/codsen/commit/3fac2f61934979655fca35b03401c98facd224bb))

### Features

- improvements for recognition of ESP tags within attributes ([0c1e42c](https://gitlab.com/codsen/codsen/commit/0c1e42cf8d43ceb77259bcc0892ec517bbcef47b))

## 1.7.0 (2019-08-24)

### Features

- flags up characters outside of ASCII and suggests HTML (only, so far) encoding ([3e04e9e](https://gitlab.com/codsen/codsen/commit/3e04e9e))
- recognise email-unfriendly named HTML entities and suggest fixes ([8b9d2c8](https://gitlab.com/codsen/codsen/commit/8b9d2c8))
- when character outside ASCII is encoded, email-pattern encoding is considered ([80f516c](https://gitlab.com/codsen/codsen/commit/80f516c))

## 1.6.0 (2019-08-15)

### Features

- recognise tags with no attributes and with missing closing bracket ([08fe678](https://gitlab.com/codsen/codsen/commit/08fe678))

## 1.5.0 (2019-06-01)

### Features

- Algorithm tweaks to correspond to the latest API's of all deps ([7de00c2](https://gitlab.com/codsen/codsen/commit/7de00c2))

## 1.4.0 (2019-04-10)

### Features

- Algorithm improvements ([634dde7](https://gitlab.com/codsen/codsen/commit/634dde7))
- Dedupe repeated slash errors, now there's only one reported per tag ([bb53589](https://gitlab.com/codsen/codsen/commit/bb53589))
- Improve closing slash error reporting consistency and rule name precision ([a3d7570](https://gitlab.com/codsen/codsen/commit/a3d7570))
- Rule tag-duplicate-closing-slash ([8887552](https://gitlab.com/codsen/codsen/commit/8887552))

## 1.3.0 (2019-04-06)

### Features

- Broken CDATA recognition improvements ([a130abc](https://gitlab.com/codsen/codsen/commit/a130abc))
- Detect excessive whitespace in front of ESP tag ([b659586](https://gitlab.com/codsen/codsen/commit/b659586))
- Heuristical ESP tag recognition ([ef69bf7](https://gitlab.com/codsen/codsen/commit/ef69bf7))
- Improvements to CDATA rules and 4 new rules to cater HTML comments ([65e23c9](https://gitlab.com/codsen/codsen/commit/65e23c9))
- Improvements to malformed CDATA tag recognition algorithm ([8bc571f](https://gitlab.com/codsen/codsen/commit/8bc571f))
- Nested function-based ESP templating tag support ([ab86a85](https://gitlab.com/codsen/codsen/commit/ab86a85))
- Recognise ESP tags within HTML tags ([764ee1d](https://gitlab.com/codsen/codsen/commit/764ee1d))
- Recognise single character ESP closing tag endings ([ee4fe96](https://gitlab.com/codsen/codsen/commit/ee4fe96))
- Rudimentary protection against CSS false positive display:block ([8c14b90](https://gitlab.com/codsen/codsen/commit/8c14b90))
- Rule esp-line-break-within-templating-tag ([b3cc442](https://gitlab.com/codsen/codsen/commit/b3cc442))
- Rules esp-more-closing-parentheses-than-opening & esp-more-opening-parentheses-than-closing ([5235b15](https://gitlab.com/codsen/codsen/commit/5235b15))

## 1.2.0 (2019-03-17)

### Features

- Implement opts for each rule ([f2be977](https://gitlab.com/codsen/codsen/commit/f2be977))
- res.applicableRules - reports what rules could be applicable for given input ([d5fb5a0](https://gitlab.com/codsen/codsen/commit/d5fb5a0))

## 1.0.0 (2019-03-04)

### Features

- Integrate package `string-fix-broken-named-entities` ([bf26962](https://gitlab.com/codsen/codsen/commit/bf26962))
- Rule `tag-generic-error` ([70dd628](https://gitlab.com/codsen/codsen/commit/70dd628))
- Rules `tag-missing-space-before-attribute` and `tag-stray-quotes` ([fe7c5af](https://gitlab.com/codsen/codsen/commit/fe7c5af))

## 0.8.0 (2019-02-26)

### Bug Fixes

- Algorithm tweaks ([b5875ff](https://gitlab.com/codsen/codsen/commit/b5875ff))
- Algorithm tweaks ([2c4e4c5](https://gitlab.com/codsen/codsen/commit/2c4e4c5))
- All unit tests pass ([b7aee54](https://gitlab.com/codsen/codsen/commit/b7aee54))

### Features

- Rule `tag-attribute-repeated-equal` ([cdcbe09](https://gitlab.com/codsen/codsen/commit/cdcbe09))
- Rule `tag-missing-closing-bracket` ([6f495c5](https://gitlab.com/codsen/codsen/commit/6f495c5))
- Rules combo: missing closing quotes and whitespace between slash and bracket ([960a0f2](https://gitlab.com/codsen/codsen/commit/960a0f2))
- Correctly recognises brackets within attribute values ([836bfe2](https://gitlab.com/codsen/codsen/commit/836bfe2))
- Excessive whitespace before missing closing bracket ([b7ecdc9](https://gitlab.com/codsen/codsen/commit/b7ecdc9))
- Excessive whitespace instead of a missing closing quotes ([0bf97ed](https://gitlab.com/codsen/codsen/commit/0bf97ed))
- Excessive whitespace then slash instead of closing quotes ([68da8b5](https://gitlab.com/codsen/codsen/commit/68da8b5))

## 0.7.0 (2019-02-10)

### Features

- Improve recognition of attribute sequences ([998f718](https://gitlab.com/codsen/codsen/commit/998f718))
- Rule `tag-attribute-missing-equal` tweaks ([06c5992](https://gitlab.com/codsen/codsen/commit/06c5992))
- Rules `tag-attribute-missing-equal` and `tag-attribute-opening-quotation-mark-missing` ([5f2f0d4](https://gitlab.com/codsen/codsen/commit/5f2f0d4))

### Bug Fixes

- Add more false-outcome unit tests and tweak the algorithm edge cases to pass all tests ([3563c3e](https://gitlab.com/codsen/codsen/commit/3563c3e))
- Algorithm tweaks to pass all unit tests ([d576d39](https://gitlab.com/codsen/codsen/commit/d576d39))
- Fix the Create New Issue URLs ([c5ee4a6](https://gitlab.com/codsen/codsen/commit/c5ee4a6))
- Treats legit quotes of the opposite kind within healthy quotes correctly ([a390e6d](https://gitlab.com/codsen/codsen/commit/a390e6d))
- Tweak the detection algorithm of some false cases ([18c368d](https://gitlab.com/codsen/codsen/commit/18c368d))

## 0.6.0 (2019-02-05)

### Features

- Rule `tag-attribute-space-between-name-and-equals` ([11653a9](https://gitlab.com/codsen/codsen/commit/11653a9))
- Improvements to rules `*-double-quotation-mark` ([d6f3307](https://gitlab.com/codsen/codsen/commit/d6f3307))
- Rule `tag-attribute-closing-quotation-mark-missing` ([f3ef429](https://gitlab.com/codsen/codsen/commit/f3ef429))
- Rule `tag-whitespace-tags-closing-slash-and-bracket` ([b65ee11](https://gitlab.com/codsen/codsen/commit/b65ee11))
- Rules `*-double-quotation-mark` ([e744a27](https://gitlab.com/codsen/codsen/commit/e744a27))
- Rules `tag-attribute-*-single-quotation-mark` ([7ec9b49](https://gitlab.com/codsen/codsen/commit/7ec9b49))
- Rules `tag-attribute-mismatching-quotes-is-*` ([1f8ca9e](https://gitlab.com/codsen/codsen/commit/1f8ca9e))
- Rules `tag-attribute-quote-and-onwards-missing` and `tag-generic-error` ([5182c0f](https://gitlab.com/codsen/codsen/commit/5182c0f))
- Rules: `tag-attribute-space-between-equals-and-opening-quotes` and `tag-excessive-whitespace-inside-tag` ([1da021b](https://gitlab.com/codsen/codsen/commit/1da021b))

## 0.5.0 (2019-01-31)

### Features

- New rule - `tag-name-lowercase` ([dfead6d](https://gitlab.com/codsen/codsen/commit/dfead6d))
- New rules `file-mixed-line-endings-file-is-\*-mainly` to cater mixed EOL files with no opts for EOL ([25e21ef](https://gitlab.com/codsen/codsen/commit/25e21ef))
- Wired up basic unit test cases for rule `file-mixed-line-endings-file-is-\*-mainly` ([46a549e](https://gitlab.com/codsen/codsen/commit/46a549e))

## 0.4.0 (2019-01-27)

### Features

- Add rules to identify non-printable low-range ASCII characters ([5471ccc](https://gitlab.com/codsen/codsen/tree/master/packages/emlint/commits/5471ccc))

## 0.1.0 (2018-08-27)

- ✨ First public release
