# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## 3.0.0 (2020-11-28)

### Bug Fixes

- Add more false-outcome unit tests and tweak the algorithm edge cases to pass all tests ([3563c3e](https://git.sr.ht/~royston/codsen/commits/3563c3e7dfb98d9e7fa1dd2100896eb484d81512))
- Algorithm tweaks ([a845331](https://git.sr.ht/~royston/codsen/commits/a845331ffa41ec637ae10292548c412aa5655c22))
- Algorithm tweaks ([2825385](https://git.sr.ht/~royston/codsen/commits/2825385c18f946f92b9640ba09010e8ad199fe4c))
- Algorithm tweaks to pass all unit tests ([d576d39](https://git.sr.ht/~royston/codsen/commits/d576d39f4e29f0ca3f2b5aa618a0f48d48565c64))
- All unit tests pass ([084722e](https://git.sr.ht/~royston/codsen/commits/084722e3eec8f3acf48af15ca9e81492b85705e3))
- don't raise alerts on doctype case in rule `tag-name-case` ([4d5c2a7](https://git.sr.ht/~royston/codsen/commits/4d5c2a7fb7e31245e178352bccf83168404a7719))
- fix few premature exiting functions ([f8ad307](https://git.sr.ht/~royston/codsen/commits/f8ad3075e850e8622bd831d3f33c511ac9985f78))
- Fix the Create New Issue URLs ([c5ee4a6](https://git.sr.ht/~royston/codsen/commits/c5ee4a61e9436099b0e20d20bca043c1b2c93f55))
- fix the severity reporting for `character-unspaced-punctuation` rule ([dce4064](https://git.sr.ht/~royston/codsen/commits/dce406414ba5ba53f0417add197a7edee151a5b6))
- make all unit tests pass ([767d78b](https://git.sr.ht/~royston/codsen/commits/767d78b26ef1d4b8e0f5715ad119e79f445a9c37))
- make rule tag-space-after-opening-bracket not applicable for HTML comments ([3fac2f6](https://git.sr.ht/~royston/codsen/commits/3fac2f61934979655fca35b03401c98facd224bb))
- Prepare for ESP tag features ([9c74f3d](https://git.sr.ht/~royston/codsen/commits/9c74f3da9313d053e84d372f71d6303430a32b35))
- stop traversing attribute array and within it ([3e0f966](https://git.sr.ht/~royston/codsen/commits/3e0f9662db5e7d33c883c8db62370742e3492b67))
- stop validateDigitAndUnit() breaking on falsey inputs, thanks to dev UMD build ([ad1fb8f](https://git.sr.ht/~royston/codsen/commits/ad1fb8f2cf684c43e971844298e0e472fb2501b3))
- support `tel:*` for `href` value ([fa9d649](https://git.sr.ht/~royston/codsen/commits/fa9d6497829754a71f8c6837a7c7266b1e82a24b))
- Treats legit quotes of the opposite kind within healthy quotes correctly ([a390e6d](https://git.sr.ht/~royston/codsen/commits/a390e6dbcc344971dcaf64095ae9e80a61180c6d))
- Tweak the detection algorithm of some false cases ([18c368d](https://git.sr.ht/~royston/codsen/commits/18c368db99120012e7f784d0ffa9fae83801b576))
- when bad entity rules are disabled, they do not raise any issues ([6f06ce2](https://git.sr.ht/~royston/codsen/commits/6f06ce2429d7cea4c49bd6523e2b2c9fbd6588a8))

### Features

- "bad-malformed-numeric-character-entity" and "bad-named-html-entity-multiple-encoding" ([d071749](https://git.sr.ht/~royston/codsen/commits/d07174976c1c080b101079286165c52bac8acb35))
- Add all missing whitespace character rules ([00e8aed](https://git.sr.ht/~royston/codsen/commits/00e8aed8e24d42e1ddeeadc88715e63eaef9140b))
- add Apple-specific link types ([5148bf8](https://git.sr.ht/~royston/codsen/commits/5148bf8fdf0ef1a2a4037a4c909af724d6f0b978))
- add few more character rules ([8a14f7c](https://git.sr.ht/~royston/codsen/commits/8a14f7cee7a15891ccfc59b584d4adc99fab4b23))
- add few more character rules ([2f06a84](https://git.sr.ht/~royston/codsen/commits/2f06a84a79b2e265079577ed2576077c8c91ed84))
- add few more character rules ([e80737f](https://git.sr.ht/~royston/codsen/commits/e80737f671a6e9d8a75dbfa83bbd39480c186cf7))
- add more bad character rules ([4b5ae71](https://git.sr.ht/~royston/codsen/commits/4b5ae7117a119db47dae965bd3c3518275891e81))
- add more known link types such as `rel="icon"` ([0756ad0](https://git.sr.ht/~royston/codsen/commits/0756ad0c68dd93139d7c46ba41ccef7c5b65bdbe))
- add new rule, bad-named-html-entity-not-email-friendly ([0a72fdc](https://git.sr.ht/~royston/codsen/commits/0a72fdc451ba051ce114de01e2e3de92da54094b))
- add parent tag validation for attribute-validate-accept ([bc23026](https://git.sr.ht/~royston/codsen/commits/bc230264ec9e4d2a5513d7323c5d6c86239d049f))
- Add rule attribute-space-between-name-and-equals ([11653a9](https://git.sr.ht/~royston/codsen/commits/11653a95af948c66bdeebf562b7384634fe9b084))
- Add rules to identify non-printable low-range ASCII characters ([5471ccc](https://git.sr.ht/~royston/codsen/commits/5471cccdbcedb81a851b7f970280269383153146))
- add safegard type checks on linter.verify() inputs ([fc4f30f](https://git.sr.ht/~royston/codsen/commits/fc4f30f99f13b164e9b3950611866218ce41fd19))
- add xmlns ([7154f5f](https://git.sr.ht/~royston/codsen/commits/7154f5f29f3cdc16a8a561eb5724b537300366d4))
- Algorithm improvements ([634dde7](https://git.sr.ht/~royston/codsen/commits/634dde7333557190e2109050cbe3762b12e2516a))
- Algorithm tweaks to correspond to the latest API's of all deps ([7de00c2](https://git.sr.ht/~royston/codsen/commits/7de00c20f9b41ab2ddb0e74d691adcd8847afe27))
- Allow colons in tag names (allows Mailchimp templating tags) ([a5c42f9](https://git.sr.ht/~royston/codsen/commits/a5c42f94b7a329a16fb1d4dd655d42b0d2bf2385))
- Broken CDATA recognition improvements ([a130abc](https://git.sr.ht/~royston/codsen/commits/a130abcef8937f29a894cd45b013c26af3dae460))
- complete creating rules for all ASCII range invisible characters ([3abb85b](https://git.sr.ht/~royston/codsen/commits/3abb85b7578d73144cebebcadcd8f021de17a297))
- complete the rule `media-malformed` ([cac1c17](https://git.sr.ht/~royston/codsen/commits/cac1c17d93f8ba7ba79755af6eba21aefbea36e3))
- correctly recognise !-- pattern, don't trigger unspaced-punctuation ([d3ae0d8](https://git.sr.ht/~royston/codsen/commits/d3ae0d87da68cba134c9ce804e35308ce4d47d66))
- Correctly recognises brackets within attribute values ([eb09a86](https://git.sr.ht/~royston/codsen/commits/eb09a86e52504565852e9933e03eab1a2a032541))
- Dedupe repeated slash errors, now there's only one reported per tag ([bb53589](https://git.sr.ht/~royston/codsen/commits/bb535897121fd97dd71f04d3e691b725f1b2d644))
- detect backslashes in front of a tag ([eba7347](https://git.sr.ht/~royston/codsen/commits/eba734744dbcd5597180f7353762ed7f9a735e28))
- Detect excessive whitespace in front of ESP tag ([b659586](https://git.sr.ht/~royston/codsen/commits/b6595865a22f10224c78f46cbb31c5777b3e2eee))
- emit token events from the traversed AST (instead of directly from tokenizer) ([ee460c0](https://git.sr.ht/~royston/codsen/commits/ee460c0a114a52b2ab9d78c4f9a0fad9c05af139))
- Ensure that all withinQuotes marking is correct, including in messed up code cases ([b359d35](https://git.sr.ht/~royston/codsen/commits/b359d35c3eae1b2df6afacee6c6e0a4ded3c2ea3))
- Excessive whitespace before missing closing bracket ([38b1f49](https://git.sr.ht/~royston/codsen/commits/38b1f49115340d2cfc2d2c1e159e18d0fa6bd324))
- Excessive whitespace instead of a missing closing quotes ([9caaf86](https://git.sr.ht/~royston/codsen/commits/9caaf863c00b19b735fedcb45986b24a8734efaa))
- Excessive whitespace then slash instead of closing quotes ([a48a61b](https://git.sr.ht/~royston/codsen/commits/a48a61b55653a250d84fdb4c424f5fc066b3aa4e))
- extend "onunload" attribute validation to body tag ([81a9e5a](https://git.sr.ht/~royston/codsen/commits/81a9e5a1f17aa1144b2c23f5a86879ffecd6adfc))
- extend onload attribute validation to body tag ([a6c61f8](https://git.sr.ht/~royston/codsen/commits/a6c61f856e0730ce22a10738fded0114549a5355))
- extend rule `attribute-validate-size` ([72502c6](https://git.sr.ht/~royston/codsen/commits/72502c67f236aa95c3cd7ef4162af24b46542962))
- Extend rule tag-stray-character to both quotes and equal characters ([75fcfbf](https://git.sr.ht/~royston/codsen/commits/75fcfbf03dee904ebf0cdfb4fb5f7c3576ae1f74))
- few more character rules ([e9048ca](https://git.sr.ht/~royston/codsen/commits/e9048ca9056e207cb05cfbe2d05f71a94c542dd6))
- few more rules ([8a347be](https://git.sr.ht/~royston/codsen/commits/8a347beacb3a6a89376216941bf224e1fb12a812))
- first rule with config, tag-space-before-closing-slash, also add string-left-right as a dep ([e6b6adb](https://git.sr.ht/~royston/codsen/commits/e6b6adb4b100c9841514f5034aca04f38acdcf3e))
- flags up characters outside of ASCII and suggests HTML (only, so far) encoding ([3e04e9e](https://git.sr.ht/~royston/codsen/commits/3e04e9ee3ca67ba537346c5387e2cab365ab15e8))
- grouped rules - "tag" and "bad-character" ([6aa5096](https://git.sr.ht/~royston/codsen/commits/6aa5096ff45882b7e59b2afc30af6ac8fa4b1877))
- harden the rule `attribute-malformed`, flag up all non-recognised attrs ([fc949a7](https://git.sr.ht/~royston/codsen/commits/fc949a7c978ef4d4e46864941aba2092f9176b32))
- Heuristical ESP tag recognition ([ef69bf7](https://git.sr.ht/~royston/codsen/commits/ef69bf7f8eb05a87506f6c8e63db658c41bbccab))
- Implement opts for each rule ([f2be977](https://git.sr.ht/~royston/codsen/commits/f2be9772b1948b7ba147a46173bf9d194ece1b7a))
- Improve closing slash error reporting consistency and rule name precision ([a3d7570](https://git.sr.ht/~royston/codsen/commits/a3d7570390d4c18f51f660148001cf6e59ac454b))
- Improve recognition of attribute sequences ([998f718](https://git.sr.ht/~royston/codsen/commits/998f71880394611cf340e9f59b29f75702ef90e0))
- improve whitespace recognition within URI's ([ba3446b](https://git.sr.ht/~royston/codsen/commits/ba3446b53fcab1639315ebb803c2753e8fd42f0d))
- improvements for recognition of ESP tags within attributes ([0c1e42c](https://git.sr.ht/~royston/codsen/commits/0c1e42cf8d43ceb77259bcc0892ec517bbcef47b))
- improvements in malformed entity reporting rules ([d807a45](https://git.sr.ht/~royston/codsen/commits/d807a45eba537a62d0296eae8e3626b615c9c1ac))
- improvements to `attribute-malformed` - detect repeated opening quotes on attributes ([c4db5bf](https://git.sr.ht/~royston/codsen/commits/c4db5bf3613ab8e297a2ddfef38169090cc7c10e))
- improvements to `attribute-malformed` - recognise repeated double quotes instead of equal ([f7d487e](https://git.sr.ht/~royston/codsen/commits/f7d487e2ca160545bb3a0c4b2d30c9adbfe59992))
- improvements to `attribute-validate-width` ([f50e6e7](https://git.sr.ht/~royston/codsen/commits/f50e6e72b8da3fd9088fc934f24b380ecc0afc9b))
- improvements to attribute-validate-archive and others ([f8b35fe](https://git.sr.ht/~royston/codsen/commits/f8b35fe51a22e2014516d521f89b3270c4b35d5d))
- Improvements to CDATA rules and 4 new rules to cater HTML comments ([65e23c9](https://git.sr.ht/~royston/codsen/commits/65e23c93d4e6fc573b9cd5baf2d24c0ce03387ae))
- improvements to ESP tag recognition ([8ac47b1](https://git.sr.ht/~royston/codsen/commits/8ac47b16af23946c86076410d1bddf9f6dc40c49))
- Improvements to malformed CDATA tag recognition algorithm ([8bc571f](https://git.sr.ht/~royston/codsen/commits/8bc571f442f8a3b943fb0a09e951b8a8b61b2306))
- improvements to opening comment tag recognition ([9dfacc4](https://git.sr.ht/~royston/codsen/commits/9dfacc4b28d825641a0149581a4cdceca1a6f290))
- Improvements to rules *-double-quotation-mark ([d6f3307](https://git.sr.ht/~royston/codsen/commits/d6f3307167ad8123e711f0c35e0c52541741783d))
- Initial release ([b6f9427](https://git.sr.ht/~royston/codsen/commits/b6f9427fd0dd43ad92383571e8228996b582d5e5))
- Integrate string-fix-broken-named-entities ([bf26962](https://git.sr.ht/~royston/codsen/commits/bf26962089044856ed41c268510ad8e95774e63b))
- introduce new key in reported messages, `keepSeparateWhenFixing` ([f27a756](https://git.sr.ht/~royston/codsen/commits/f27a756475158b7ff97f7be251c7f0af11ce2611))
- levenshtein distance for attribute names ([3ab2e83](https://git.sr.ht/~royston/codsen/commits/3ab2e83f5c3ed2c43bbccbeea0144f042d10f955))
- make character-encode rule to consume text type nodes, to traverse them ([d5ee8b5](https://git.sr.ht/~royston/codsen/commits/d5ee8b5bb6c2488779a42a1a15facd4745518359))
- make it pluggable - rewrite in observer pattern, separate the tokenizer and tap it ([1c0a0eb](https://git.sr.ht/~royston/codsen/commits/1c0a0ebd7dcb307854c88eeee6049658b1a7c3a6))
- make rules more composable ([7cf3cbf](https://git.sr.ht/~royston/codsen/commits/7cf3cbf81c09635e81f36db8a776a217c2bdd8f0))
- mention attribute's name in `attribute-validate-*` error messages ([6801b6e](https://git.sr.ht/~royston/codsen/commits/6801b6eebf084949c97f5e67517b686a3294bf73))
- Merge modes via opts.mergeType ([7fb1c5f](https://git.sr.ht/~royston/codsen/commits/7fb1c5f319aa41ea54c68eed004ab2dfdc7425bf))
- migrate all URI value type attributes to consume validateUri() ([2ab3631](https://git.sr.ht/~royston/codsen/commits/2ab363118016f847da5e305deee6577bdad1a3c1))
- More improvements to script tag recognition, rudimentary processing inside JS code ([d5056e6](https://git.sr.ht/~royston/codsen/commits/d5056e669b48ef5de8d00cdeaa30a73db7a12a45))
- Nested function-based ESP templating tag support ([ab86a85](https://git.sr.ht/~royston/codsen/commits/ab86a854aad62ba5198f065dc81ceb6d0925a575))
- New rule - tagname-lowercase ([dfead6d](https://git.sr.ht/~royston/codsen/commits/dfead6d29a0ffb32e160cb294c0e9287f72bcd54))
- new rule, `attribute-duplicate` ([1fc32a5](https://git.sr.ht/~royston/codsen/commits/1fc32a590a0f7ff9a0cd6e48650e2321d4b387cd))
- new rule, `attribute-validate-alt` ([6ec507e](https://git.sr.ht/~royston/codsen/commits/6ec507e004b4266f732aa01f280a9e13830a5f13))
- new rule, `attribute-validate-archive` ([7fa39f3](https://git.sr.ht/~royston/codsen/commits/7fa39f34f4ae6e3936828d81184ac58e9bc24871))
- new rule, `attribute-validate-axis` ([9da98c7](https://git.sr.ht/~royston/codsen/commits/9da98c7239dc9af9e82e146873df758f16f00f10))
- new rule, `attribute-validate-background` ([6628374](https://git.sr.ht/~royston/codsen/commits/662837478503547df33b767c4679a6a1c209a7b5))
- new rule, `attribute-validate-bgcolor` ([bfa84e7](https://git.sr.ht/~royston/codsen/commits/bfa84e7684aa087f78ee17964506820d68b414c2))
- new rule, `attribute-validate-cellpadding` ([47a927f](https://git.sr.ht/~royston/codsen/commits/47a927fd8ae1aa661a7079769eec7c94e7c039c6))
- new rule, `attribute-validate-cellspacing` ([273d551](https://git.sr.ht/~royston/codsen/commits/273d551a80fa719d09e23ef756676bed2bb2fab1))
- new rule, `attribute-validate-char` ([d3eef87](https://git.sr.ht/~royston/codsen/commits/d3eef878a8ab4412122d20a2dd93893ab5ac1217))
- new rule, `attribute-validate-charoff` ([4528a17](https://git.sr.ht/~royston/codsen/commits/4528a17a78c82a8320927ee014ebcc3682cffd1b))
- new rule, `attribute-validate-charset` ([c2749c2](https://git.sr.ht/~royston/codsen/commits/c2749c25e6bc8b20054438302ffe4cff79c49af7))
- new rule, `attribute-validate-checked` ([29a7047](https://git.sr.ht/~royston/codsen/commits/29a70472d3a222e7253dfb89dafb5ed753f17513))
- new rule, `attribute-validate-cite` ([ec72be6](https://git.sr.ht/~royston/codsen/commits/ec72be6987b0282633aaebbc65820741aec82bc4))
- new rule, `attribute-validate-class` ([de68974](https://git.sr.ht/~royston/codsen/commits/de6897496bf76c86ff11ca6ee2bff8eab9e197b7))
- new rule, `attribute-validate-classid` ([4de2985](https://git.sr.ht/~royston/codsen/commits/4de2985bb18201f9dff70a93e6db92e175a1580e))
- new rule, `attribute-validate-clear` ([9997520](https://git.sr.ht/~royston/codsen/commits/9997520caf9f22dde8161a80a7888cfc3f6b7b18))
- new rule, `attribute-validate-code` ([60b085b](https://git.sr.ht/~royston/codsen/commits/60b085bd79823327c995324d1900858d22a69b6d))
- new rule, `attribute-validate-codebase` ([08ccf17](https://git.sr.ht/~royston/codsen/commits/08ccf177aa7122d23820dcb596e5fa609752b176))
- new rule, `attribute-validate-codetype` ([228e3bc](https://git.sr.ht/~royston/codsen/commits/228e3bc44f6223c9adbceb744a07f1d7b7d59866))
- new rule, `attribute-validate-color` ([8f174c6](https://git.sr.ht/~royston/codsen/commits/8f174c629802a3205d7394f128687ac971653f4f))
- new rule, `attribute-validate-cols` ([05fb199](https://git.sr.ht/~royston/codsen/commits/05fb19937080f1223278b6381de47db9f884f55b))
- new rule, `attribute-validate-colspan` ([e72fa98](https://git.sr.ht/~royston/codsen/commits/e72fa98594698689cb1b09405c42af1c62d2e9c0))
- new rule, `attribute-validate-compact` ([ec7e4f3](https://git.sr.ht/~royston/codsen/commits/ec7e4f36d016c93c27f15ac73e7ac962057d669b))
- new rule, `attribute-validate-content` ([a076d71](https://git.sr.ht/~royston/codsen/commits/a076d719ae3e4e56416837897ee8a3feb48d48ab))
- new rule, `attribute-validate-coords` ([f3baa58](https://git.sr.ht/~royston/codsen/commits/f3baa58eb4dbf6ffde6130b2afa424ad7f3752ca))
- new rule, `attribute-validate-data` ([3cd016a](https://git.sr.ht/~royston/codsen/commits/3cd016a42b580188badd6a1bff9f6e099dea49a4))
- new rule, `attribute-validate-datetime` ([62b8776](https://git.sr.ht/~royston/codsen/commits/62b8776320880f9d46289897cbc32cc408888a69))
- new rule, `attribute-validate-declare` ([e16fd80](https://git.sr.ht/~royston/codsen/commits/e16fd806242b2e29117b313fabf9fce1c76d59e7))
- new rule, `attribute-validate-defer` ([52d0acd](https://git.sr.ht/~royston/codsen/commits/52d0acdd7b8ab7673973d2baf34d14efa97a7b7a))
- new rule, `attribute-validate-dir` ([086a83d](https://git.sr.ht/~royston/codsen/commits/086a83d2eafcce592bb484e833a676c68ae9fc05))
- new rule, `attribute-validate-disabled` ([45bb607](https://git.sr.ht/~royston/codsen/commits/45bb6070ebbe95a5ebd86b2caf5a9f3dd2c5db08))
- new rule, `attribute-validate-enctype` ([5f1098c](https://git.sr.ht/~royston/codsen/commits/5f1098cffc8d90bf543922c45579416c6ca33277))
- new rule, `attribute-validate-for` ([7a53a41](https://git.sr.ht/~royston/codsen/commits/7a53a41467cc113e35123892c8cb084ecdb922cb))
- new rule, `attribute-validate-frameborder` ([c8e580a](https://git.sr.ht/~royston/codsen/commits/c8e580aea6ed82f8d43f89f90ad3dbfbf6c7e8bd))
- new rule, `attribute-validate-headers` ([d582b8a](https://git.sr.ht/~royston/codsen/commits/d582b8a082e250ee918fc46bb0119661f262b9c6))
- new rule, `attribute-validate-height` ([09732a9](https://git.sr.ht/~royston/codsen/commits/09732a9e0ad8bac100b577f190a705b37bd8bcf3))
- new rule, `attribute-validate-href` ([73148d7](https://git.sr.ht/~royston/codsen/commits/73148d7a3eae821acea2cb8832b35f25d499cb2e))
- new rule, `attribute-validate-hreflang` ([a19c9d2](https://git.sr.ht/~royston/codsen/commits/a19c9d2ab8471c2a9a772cf7b9df88912038d7fe))
- new rule, `attribute-validate-hspace` ([eed294b](https://git.sr.ht/~royston/codsen/commits/eed294b5992b72a1f0aed9d4f504512b25e45cd5))
- new rule, `attribute-validate-http-equiv` ([b6436bc](https://git.sr.ht/~royston/codsen/commits/b6436bc258346f826673c99d003eaa11a2d0b1ef))
- new rule, `attribute-validate-id` ([6cb9ba8](https://git.sr.ht/~royston/codsen/commits/6cb9ba82a7ed5cd2927bd22037622cb012bf716f))
- new rule, `attribute-validate-ismap` ([e5df842](https://git.sr.ht/~royston/codsen/commits/e5df84218d1e128ff3743cfb2ea091cce606bf3e))
- new rule, `attribute-validate-label` ([5409a92](https://git.sr.ht/~royston/codsen/commits/5409a9286d6cd5e2d0895d42d9b6a351f4c13f31))
- new rule, `attribute-validate-lang` ([dd0f9d2](https://git.sr.ht/~royston/codsen/commits/dd0f9d2432be3c32cffdaa3af38473f26e08b434))
- new rule, `attribute-validate-language` ([06d4312](https://git.sr.ht/~royston/codsen/commits/06d4312e4940adcda27c36a39305604e247a9652))
- new rule, `attribute-validate-link` ([e37e2e0](https://git.sr.ht/~royston/codsen/commits/e37e2e0f0b39fe6f59892d79ab34ec6c450601f9))
- new rule, `attribute-validate-longdesc` ([702fbd2](https://git.sr.ht/~royston/codsen/commits/702fbd2773ae2b6ccfd768d756afbe0ab10f4184))
- new rule, `attribute-validate-marginheight` ([e1f024f](https://git.sr.ht/~royston/codsen/commits/e1f024f92f6e96526d2ddc54ad6dc65e9f892ae5))
- new rule, `attribute-validate-marginwidth` ([47860e4](https://git.sr.ht/~royston/codsen/commits/47860e460a68a59612cfe63a38d695fa59e48900))
- new rule, `attribute-validate-maxlength` ([e7401c0](https://git.sr.ht/~royston/codsen/commits/e7401c02e567c9b5713b26ff7cdced10671e63f3))
- new rule, `attribute-validate-media` ([2d77259](https://git.sr.ht/~royston/codsen/commits/2d77259e7249f490bd23468e4c015aad98f3975b))
- new rule, `attribute-validate-method` ([b233e92](https://git.sr.ht/~royston/codsen/commits/b233e92b1e824b49e3bb72cc28a29694cc0e2a33))
- new rule, `attribute-validate-multiple` ([2465441](https://git.sr.ht/~royston/codsen/commits/2465441926917c94ad80946adcc5eb0763310b14))
- new rule, `attribute-validate-name` ([8870abe](https://git.sr.ht/~royston/codsen/commits/8870abe2f6a4d5ca200c885b0cdbcf5b81855ac8))
- new rule, `attribute-validate-nohref` ([dadcb16](https://git.sr.ht/~royston/codsen/commits/dadcb1650c4266eaaf54c4c918a3d44787113a7f))
- new rule, `attribute-validate-noresize` ([73a63a7](https://git.sr.ht/~royston/codsen/commits/73a63a75fe3bdf00b63c27231348da2b39a4218a))
- new rule, `attribute-validate-noshade` ([250f786](https://git.sr.ht/~royston/codsen/commits/250f7867d72fdad637799a15eef62cd01a705faf))
- new rule, `attribute-validate-nowrap` ([cfea63e](https://git.sr.ht/~royston/codsen/commits/cfea63ec5593e19f20550188fc7374a8428774ac))
- new rule, `attribute-validate-object` ([7f1fed3](https://git.sr.ht/~royston/codsen/commits/7f1fed39e53558e0d0d06fdd7056a8ad2e782d8b))
- new rule, `attribute-validate-onblur` ([3b464bc](https://git.sr.ht/~royston/codsen/commits/3b464bc542fd103e1c27a8125d01b1ef54e209e2))
- new rule, `attribute-validate-onchange` ([188d5b6](https://git.sr.ht/~royston/codsen/commits/188d5b6891141d6fbe26839a65ae6ab9bd122339))
- new rule, `attribute-validate-onfocus` ([1db2ebe](https://git.sr.ht/~royston/codsen/commits/1db2ebe44d0bba0750d98fc2ad8566d271328a84))
- new rule, `attribute-validate-onkeydown` ([19c091a](https://git.sr.ht/~royston/codsen/commits/19c091a70905f69ff1192742459d930c51a2488f))
- new rule, `attribute-validate-onkeypress` ([c5d465a](https://git.sr.ht/~royston/codsen/commits/c5d465a3dd43979397aed73fc5f9ba5259dc0107))
- new rule, `attribute-validate-onkeyup` ([9cdb2ed](https://git.sr.ht/~royston/codsen/commits/9cdb2ed8df3c4aa64083c1f2ca0ca7ffa5e02e8b))
- new rule, `attribute-validate-onload` ([f231e11](https://git.sr.ht/~royston/codsen/commits/f231e11ccb72f3b37a6779ce8669c6b53c41ebc6))
- new rule, `attribute-validate-onmousedown` ([d7323a0](https://git.sr.ht/~royston/codsen/commits/d7323a0c3e5d4a9b71ea6f7fa59cdca68a380c6c))
- new rule, `attribute-validate-onmousemove` ([a64c6a0](https://git.sr.ht/~royston/codsen/commits/a64c6a093c2ba26d9f5fd50b471fc3367a7dce77))
- new rule, `attribute-validate-onmouseout` ([64115da](https://git.sr.ht/~royston/codsen/commits/64115dac69088361fea218109ec3c97078a217f6))
- new rule, `attribute-validate-onmouseover` ([9fd7b85](https://git.sr.ht/~royston/codsen/commits/9fd7b85791a06d3d9250f50deecb1f85b9b68220))
- new rule, `attribute-validate-onmouseup` ([9118dbb](https://git.sr.ht/~royston/codsen/commits/9118dbb0264840b72d531e0850d92b1d4563ebd4))
- new rule, `attribute-validate-onreset` ([4cdb742](https://git.sr.ht/~royston/codsen/commits/4cdb7426fc824dc2e4078410057fd8204a3e6701))
- new rule, `attribute-validate-onselect` ([3834290](https://git.sr.ht/~royston/codsen/commits/38342900ae71c2ee87768848f5445c02555070e5))
- new rule, `attribute-validate-onsubmit` ([f23640a](https://git.sr.ht/~royston/codsen/commits/f23640a30ee73084f2ceff8242ca55921f76a408))
- new rule, `attribute-validate-onunload` ([582be1f](https://git.sr.ht/~royston/codsen/commits/582be1f6e561df4bc066b09d2bc7161fc08d1cb8))
- new rule, `attribute-validate-profile` ([c1e8ba1](https://git.sr.ht/~royston/codsen/commits/c1e8ba1c7b376572f5c512cfb083603a97eb7140))
- new rule, `attribute-validate-prompt` ([003c04f](https://git.sr.ht/~royston/codsen/commits/003c04fb7b4637b65454de1ad0821dd5479c979d))
- new rule, `attribute-validate-readonly` ([5b2f921](https://git.sr.ht/~royston/codsen/commits/5b2f92127480d46f085ed9b046a76a00fc25eaad))
- new rule, `attribute-validate-rel` ([4c991d8](https://git.sr.ht/~royston/codsen/commits/4c991d837192a2bdcac6ca7574fffa45a63941cd))
- new rule, `attribute-validate-rev` ([868fdbb](https://git.sr.ht/~royston/codsen/commits/868fdbb7828a56214bac2cd198ab174df22066df))
- new rule, `attribute-validate-rows` ([f3fa9e1](https://git.sr.ht/~royston/codsen/commits/f3fa9e1df1e70ecf3164a334e0f9e36ac33dbe84))
- new rule, `attribute-validate-rowspan` ([a234874](https://git.sr.ht/~royston/codsen/commits/a2348744449cbe7d4c8a1e006fbe59a1bbf2db57))
- new rule, `attribute-validate-scheme` ([2d85432](https://git.sr.ht/~royston/codsen/commits/2d854321cc96d78aebf2ae959de61c23c840cf4a))
- new rule, `attribute-validate-scope` ([666fe2b](https://git.sr.ht/~royston/codsen/commits/666fe2b657576736f518a1e46df3d3cece1b5f7e))
- new rule, `attribute-validate-scrolling` ([e89d60b](https://git.sr.ht/~royston/codsen/commits/e89d60b44c6b19f8e0cb0f517899ae0c950c64d0))
- new rule, `attribute-validate-selected` ([ed3d264](https://git.sr.ht/~royston/codsen/commits/ed3d26474a29aac8036d6f7d293f72ed6241cda4))
- new rule, `attribute-validate-shape` ([6ed0bf4](https://git.sr.ht/~royston/codsen/commits/6ed0bf48fe55b57fc0092dd65514ded4b6cd07e3))
- new rule, `attribute-validate-size` and some rebasing ([b11c805](https://git.sr.ht/~royston/codsen/commits/b11c805ac21ccc9e6c38d67827a42ee7a6dd0784))
- new rule, `attribute-validate-span` ([c03a6bb](https://git.sr.ht/~royston/codsen/commits/c03a6bbb7b8243e3f99d90e407bd0f281fd566d8))
- new rule, `attribute-validate-src` ([38a3154](https://git.sr.ht/~royston/codsen/commits/38a3154041f4cf79ea4232ab2405ad9ab808d5ea))
- new rule, `attribute-validate-start` ([4a9d387](https://git.sr.ht/~royston/codsen/commits/4a9d387473e48b8626401bbfd891a436c051b4c5))
- new rule, `attribute-validate-style` (basic level) ([293fa79](https://git.sr.ht/~royston/codsen/commits/293fa79a028d31bfe6fc6ca7fa069c92925fad56))
- new rule, `attribute-validate-summary` ([a4a0e6e](https://git.sr.ht/~royston/codsen/commits/a4a0e6e80571f9e9d4f889148135ac8294c4bfcb))
- new rule, `attribute-validate-tabindex` ([d9299d8](https://git.sr.ht/~royston/codsen/commits/d9299d832b0a180559de7715015c43ea3253f2c8))
- new rule, `attribute-validate-target` ([d996417](https://git.sr.ht/~royston/codsen/commits/d99641702c7fa2214ede95113ab510b7ef73d3c2))
- new rule, `attribute-validate-text` ([57f7d8e](https://git.sr.ht/~royston/codsen/commits/57f7d8ea02e90b2be03134b276d72f711c50ae5b))
- new rule, `attribute-validate-title` ([251b854](https://git.sr.ht/~royston/codsen/commits/251b8546478da4363856201710fb2b3480820cc3))
- new rule, `attribute-validate-type` ([29ef159](https://git.sr.ht/~royston/codsen/commits/29ef159ed27dfb1e302c88e9c02c75461a1ef478))
- new rule, `attribute-validate-usemap` ([6a33365](https://git.sr.ht/~royston/codsen/commits/6a33365b1aef7e5222fdda8494f7e25b01465df2))
- new rule, `attribute-validate-valign` ([83e80a9](https://git.sr.ht/~royston/codsen/commits/83e80a9a334aed9256b355b4bfdb00516ab5c83b))
- new rule, `attribute-validate-value` ([716f7f6](https://git.sr.ht/~royston/codsen/commits/716f7f61e13d2d0d1389f13ce5394c3dbe5e016f))
- new rule, `attribute-validate-valuetype` ([fd68ed7](https://git.sr.ht/~royston/codsen/commits/fd68ed731778a03dd1e152492dd12ea79cceb420))
- new rule, `attribute-validate-version` ([e524e00](https://git.sr.ht/~royston/codsen/commits/e524e007ebb8232df185fcd6c4670d8b206e08f0))
- new rule, `attribute-validate-vlink` ([55ff0db](https://git.sr.ht/~royston/codsen/commits/55ff0dbe0cee7c86cd1a40932251473e61271b8d))
- new rule, `attribute-validate-vspace` ([e99b727](https://git.sr.ht/~royston/codsen/commits/e99b727185cef17cfa356eecb4f1fbcad007186c))
- new rule, `comment-conditional-nested` ([b5de5b9](https://git.sr.ht/~royston/codsen/commits/b5de5b9c8ffd6ea2ec25edab17600f59ac090cb1))
- new rule, `comment-mismatching-pair` ([72bcb44](https://git.sr.ht/~royston/codsen/commits/72bcb44ae7f1439c80e93e2cb95a5a2900dcb0fe))
- new rule, `media-malformed` ([863878c](https://git.sr.ht/~royston/codsen/commits/863878c4c767020b391d7931c4affb6105bc13e9))
- new rule, `tag-bad-self-closing` ([1d6c1db](https://git.sr.ht/~royston/codsen/commits/1d6c1dbb68f02cc422206746b7c323fd191ac986))
- new rule, `tag-missing-opening` ([1d5d596](https://git.sr.ht/~royston/codsen/commits/1d5d596501cebb289cffad6d5f354148d0c6538c))
- new rule, `tag-space-before-closing-bracket` ([77dc417](https://git.sr.ht/~royston/codsen/commits/77dc417ff9597264791044e6f4a78ef01942269a))
- new rule, `tag-void-frontal-slash`; recognise HTML attr missing quotes (`attribute-malformed`) ([7de6964](https://git.sr.ht/~royston/codsen/commits/7de69647ff2a53ab3ee2ebce63b7d5301cc76b99))
- new rule, all - plus removing all listeners in the end of a program ([d6bc792](https://git.sr.ht/~royston/codsen/commits/d6bc792d091a4281d816aa450195b11179cd3402))
- new rule, attribute-malformed + new emitted event type, "attribute" ([6afac3d](https://git.sr.ht/~royston/codsen/commits/6afac3db43aff939e4b2eb254ab08b9d0c8fe751))
- new rule, attribute-validate-abbr ([168009c](https://git.sr.ht/~royston/codsen/commits/168009c1cbc8067761d84bb5812dbca10573871f))
- new rule, attribute-validate-accept ([4993b5a](https://git.sr.ht/~royston/codsen/commits/4993b5a55a0f7335fceff7d12aeed7fd9973c1bc))
- new rule, attribute-validate-accept-charset ([d5a52cb](https://git.sr.ht/~royston/codsen/commits/d5a52cb4cf2ceaa1660174f049dd4bf279ab9e27))
- new rule, attribute-validate-accesskey ([d83018c](https://git.sr.ht/~royston/codsen/commits/d83018cab02081eae2792424cea83db385880054))
- new rule, attribute-validate-action ([8e18a6f](https://git.sr.ht/~royston/codsen/commits/8e18a6f1a50cbc9957b38b670ee3cd17f78d3548))
- new rule, attribute-validate-align ([632b758](https://git.sr.ht/~royston/codsen/commits/632b75852db4302b1a9f8548a50c6910947a64b8))
- new rule, attribute-validate-alink ([9f9a94b](https://git.sr.ht/~royston/codsen/commits/9f9a94bd4225344997b1755dcfad13d2613aae56))
- new rule, attribute-validate-border + some housekeeping ([d245a14](https://git.sr.ht/~royston/codsen/commits/d245a14d34e4984efeeee24bd97c677069d99e5b))
- new rule, attribute-validate-width ([4929609](https://git.sr.ht/~royston/codsen/commits/4929609f9c55a0d8f5b78258f0b2f94b665f7c26))
- new rule, bad-character-replacement-character ([82b24b8](https://git.sr.ht/~royston/codsen/commits/82b24b8d18fc0be5416f6e72c753589564857aa4))
- new rule, bad-named-html-entity-malformed-nbsp ([75f232f](https://git.sr.ht/~royston/codsen/commits/75f232fd3ca214fe674a4792416bf661512c150f))
- new rule, bad-named-html-entity-unrecognised ([9ea399d](https://git.sr.ht/~royston/codsen/commits/9ea399d9a483dc29bba4c1e3fc83f4b72a35fab9))
- new rule, character-encode ([17c35ad](https://git.sr.ht/~royston/codsen/commits/17c35ad06c480aa18eb4716e4b6813658599ff3a))
- new rule, character-unspaced-punctuation ([e60a806](https://git.sr.ht/~royston/codsen/commits/e60a8063ec870d64867b47f93aea5a7482268b4e))
- new rule, tag-bold ([bb907cd](https://git.sr.ht/~royston/codsen/commits/bb907cd6f350d4d1c8ca0480106a3780342ab3e2))
- new rule, tag-is-present ([e627c14](https://git.sr.ht/~royston/codsen/commits/e627c141c22e338d87e8d70bcc49bc99e9df0727))
- new rule, tag-name-case ([503ac91](https://git.sr.ht/~royston/codsen/commits/503ac912004496343abcb98fb1b241f112d7122c))
- new rules tag-void-slash and tag-closing-backslash ([adce05d](https://git.sr.ht/~royston/codsen/commits/adce05d630def6d775446fc9cda8a61366ff1f92))
- new rules, `attribute-validate-frame` and `attribute-validate-rules` ([1d12ae4](https://git.sr.ht/~royston/codsen/commits/1d12ae40561e66fdbafcfabc5551295b5d945d8f))
- new rules, `attribute-validate-onclick` and `attribute-validate-ondblclick` ([b5d797c](https://git.sr.ht/~royston/codsen/commits/b5d797c8a1a76b2fc1489e4ab78f90669dc031d5))
- new rules, `comment-only-closing-malformed` & `comment-only-opening-malformed` ([84f9319](https://git.sr.ht/~royston/codsen/commits/84f931979c5511e4c94e5e076f437f542ca49e8a))
- parent tag validation for attributes ([788157f](https://git.sr.ht/~royston/codsen/commits/788157fd059b248ec86a9c2775a73a191d64061e))
- put names on the most common entities in error description ([69233df](https://git.sr.ht/~royston/codsen/commits/69233df7210441ace1abd723b8c261ad3e443dc7))
- recognise broken html simple closing comments with missing dashes ([88874b6](https://git.sr.ht/~royston/codsen/commits/88874b60aa2876cb08f566c72434f1f0ae342f14))
- recognise email-unfriendly named HTML entities and suggest fixes ([8b9d2c8](https://git.sr.ht/~royston/codsen/commits/8b9d2c852df99fc06f6543b3100b2a36bb36f2c1))
- recognise errors on the opening "only"-kind comment tag endings ([abf504c](https://git.sr.ht/~royston/codsen/commits/abf504c87e3cb213da1415f220f46b5c5b45730b))
- Recognise escaped quotes within JS code within script tags ([c984050](https://git.sr.ht/~royston/codsen/commits/c9840506f00a03ba6c7d91bf5f645ee3620d7dab))
- Recognise ESP tags within HTML tags ([764ee1d](https://git.sr.ht/~royston/codsen/commits/764ee1d76b1d10ebd43eb2c61e4afe3744da020d))
- recognise IE attribute in `attribute-validate-http-equiv` ([a85496c](https://git.sr.ht/~royston/codsen/commits/a85496cd7ec98537c5631cfd4aae2509ad139704))
- recognise more broken closing comment tag cases ([fe77d70](https://git.sr.ht/~royston/codsen/commits/fe77d70bb7b24c3563c7eea300ce29ce7f87e345))
- Recognise script tags ([de006d0](https://git.sr.ht/~royston/codsen/commits/de006d0c9e7ff488585149b0577e2119ea152028))
- Recognise single character ESP closing tag endings ([ee4fe96](https://git.sr.ht/~royston/codsen/commits/ee4fe96799547b9b8318020f1f86cee89a06343d))
- recognise tags with no attributes and with missing closing bracket ([08fe678](https://git.sr.ht/~royston/codsen/commits/08fe678749aeb997ba5ad0b6e0bcb83b0f3c2ad1))
- recognise wrong brackets in comment tags (both closing and opening) ([e97dccb](https://git.sr.ht/~royston/codsen/commits/e97dccb0131159e44b6f5f2208fc36d2f246f1ad))
- rename and beef up rule: bad-character-tabulation ([cd4d0a0](https://git.sr.ht/~royston/codsen/commits/cd4d0a0f9ce5c36e69113d544f6c68516f94de77))
- res.applicableRules - reports what rules could be applicable for given input ([d5fb5a0](https://git.sr.ht/~royston/codsen/commits/d5fb5a05defe00cb5dee489a2e0e66a9cb565188))
- Rudimentary protection against CSS false positive display:block ([8c14b90](https://git.sr.ht/~royston/codsen/commits/8c14b90fe69999d266f6465a90a656cf33028272))
- Rule bad-character-grave-accent ([03cd767](https://git.sr.ht/~royston/codsen/commits/03cd7674ce558610b027699c95f3bdd21bbe378e))
- Rule bad-character-unencoded-non-breaking-space ([289396c](https://git.sr.ht/~royston/codsen/commits/289396cdb6b36b3ff0872ebecd42258b32c47ded))
- Rule bad-character-zero-width-space and some whitespace control tweaks ([c4b582c](https://git.sr.ht/~royston/codsen/commits/c4b582c447873f2ad4e7c1153bcaef4c48483f2a))
- Rule esp-line-break-within-templating-tag ([b3cc442](https://git.sr.ht/~royston/codsen/commits/b3cc442a2e1c20b53cac7f3154eff5263e7b605d))
- Rule tag-attribute-closing-quotation-mark-missing ([f3ef429](https://git.sr.ht/~royston/codsen/commits/f3ef42916185daf7d5d0652cb614f568177edb95))
- Rule tag-attribute-missing-equal ([06c5992](https://git.sr.ht/~royston/codsen/commits/06c5992890d12ccc4a23d6239063512d16d3f8c4))
- Rule tag-attribute-repeated-equal ([e4009c6](https://git.sr.ht/~royston/codsen/commits/e4009c6c0155be16d57b0fc14feda709f3c82f2d))
- Rule tag-duplicate-closing-slash ([8887552](https://git.sr.ht/~royston/codsen/commits/8887552dc1a0f3bf57d5fd3a328483b50453c33a))
- Rule tag-generic-error ([70dd628](https://git.sr.ht/~royston/codsen/commits/70dd6284accce4f82f2c81acd735a87855249ac0))
- Rule tag-missing-closing-bracket ([213d1a6](https://git.sr.ht/~royston/codsen/commits/213d1a6fdfe8400523a2f864f08442c5e708be00))
- rule tag-name-case - doctype and cdata wrong case (being not uppercase) ([da9f68a](https://git.sr.ht/~royston/codsen/commits/da9f68a5a2af4b5c8dab8b0ae00c8d153456630f))
- Rule tag-whitespace-tags-closing-slash-and-bracket ([b65ee11](https://git.sr.ht/~royston/codsen/commits/b65ee111684ed235fed7bba456793c69e0516228))
- Rules *-double-quotation-mark ([e744a27](https://git.sr.ht/~royston/codsen/commits/e744a27ed88266f14d9e8989bcc8d123fe974f42))
- rules `attribute-validate-class`/`id`, detect duplicate `class`/`id` names ([dfe570d](https://git.sr.ht/~royston/codsen/commits/dfe570d0f0638cb4915bf8c8110e10aa3c5c9761))
- Rules bad-cdata-whitespace and bad-cdata-tag-character-case ([b8982e9](https://git.sr.ht/~royston/codsen/commits/b8982e9f26e9a47deefead1d4f8270b022cd7445))
- Rules bad-character-line-separator, bad-character-unencoded-non-breaking-space and bad-character-zero-width-space ([555f6eb](https://git.sr.ht/~royston/codsen/commits/555f6eb02014c76307ea25d243b20d2abfc2f21f))
- Rules combo: missing closing quotes and whitespace between slash and bracket ([9217d46](https://git.sr.ht/~royston/codsen/commits/9217d4664ade7bd154606d3d7804d6a14b298935))
- Rules esp-more-closing-parentheses-than-opening & esp-more-opening-parentheses-than-closing ([5235b15](https://git.sr.ht/~royston/codsen/commits/5235b15139c6da0d9cc3babcd3b965455aa63e87))
- Rules file-mixed-line-endings-file-is-*-mainly to cater mixed EOL files with no opts for EOL ([25e21ef](https://git.sr.ht/~royston/codsen/commits/25e21eff5d61d47de08ef853c0c5e72de83bbe04))
- Rules tag-attribute-*-single-quotation-mark ([7ec9b49](https://git.sr.ht/~royston/codsen/commits/7ec9b4917403eb21a2afe4b01ea898af12294fa3))
- Rules tag-attribute-mismatching-quotes-is-* ([1f8ca9e](https://git.sr.ht/~royston/codsen/commits/1f8ca9ea8bc80291abbca5c2829e559641ece482))
- Rules tag-attribute-missing-equal and tag-attribute-opening-quotation-mark-missing ([5f2f0d4](https://git.sr.ht/~royston/codsen/commits/5f2f0d405ba7ee09c5b550974f1ec1adc747852a))
- Rules tag-attribute-quote-and-onwards-missing and tag-generic-error ([5182c0f](https://git.sr.ht/~royston/codsen/commits/5182c0f4b8488fb65a311e6af3a5ec2a361fbd70))
- Rules tag-missing-space-before-attribute and tag-stray-quotes ([fe7c5af](https://git.sr.ht/~royston/codsen/commits/fe7c5af08ce153c0485517ec47a715cd4a13df5e))
- Rules to flag up and delete all Unicode C1 group control characters ([c4b02c9](https://git.sr.ht/~royston/codsen/commits/c4b02c911178b323f1001af8e35ea1c9bde11914))
- Rules: attribute-space-between-equals-and-opening-quotes and tag-excessive-whitespace-inside-tag ([1da021b](https://git.sr.ht/~royston/codsen/commits/1da021b8ba0c6359a1a24a11d988bd95805d7449))
- separate relative URI checking into a standalone package and then tap it ([c48a622](https://git.sr.ht/~royston/codsen/commits/c48a622ecc5469d589d119f893860b87b172f402))
- set up broken named html entity rules ([a490e90](https://git.sr.ht/~royston/codsen/commits/a490e9079ca449589f5178adb200701f4c71ecde))
- set up the tag-level processing, add the first character-level rule ([fc9a89f](https://git.sr.ht/~royston/codsen/commits/fc9a89f5a5dbd3a9ee7fe6d14e2cefd21b5a59e0))
- show all permitted values in error messages instead of complaining about wrong value ([a5ee245](https://git.sr.ht/~royston/codsen/commits/a5ee24596b1bce7bc2f800a425bd4a5b4c0ea0d2))
- Split off character-based rules because there are too many ([0411fa2](https://git.sr.ht/~royston/codsen/commits/0411fa26cc1ce9f0ea0ef6e341695b19f055c8e9))
- switch to codsen-parser ([e9d7080](https://git.sr.ht/~royston/codsen/commits/e9d7080a50967e582aa73948d7d0cd80fcc5d20c))
- tap `string-find-malformed` and implement the broken simple opening comment search ([53807d0](https://git.sr.ht/~royston/codsen/commits/53807d09e4b1909c81978e2720b3d45ac2cfeef7))
- tap the new codsen-tokenizer's API where it pings the characters, remove character emits here ([9f4a2c5](https://git.sr.ht/~royston/codsen/commits/9f4a2c5902f78b52580e1ea782483ade24862b62))
- tweaks to `comment-mismatching-pair` to mind malformed closing tags to prevent fixes clashes ([5f389b5](https://git.sr.ht/~royston/codsen/commits/5f389b5c3e69ebaf211d4096477fcc4b0aad3920))
- two more character rules ([3e7516f](https://git.sr.ht/~royston/codsen/commits/3e7516fee7c54a58d1da35cc8b12d8b83707c97d))
- update config on tap to consume all grouped rules ([98d6af4](https://git.sr.ht/~royston/codsen/commits/98d6af42a9453376c15f0717ca70cd64c732f8a2))
- update the deps ([01ac915](https://git.sr.ht/~royston/codsen/commits/01ac915b0e703c59f502a4ffffcffb7ff969001f))
- update to the latest tokenizer, improve attribute-* rules ([deea2ce](https://git.sr.ht/~royston/codsen/commits/deea2ce963c253a9d0ba8aa55c8e62a7f2eb9c63))
- when character outside ASCII is encoded, email-pattern encoding is considered ([80f516c](https://git.sr.ht/~royston/codsen/commits/80f516cadea3335d63cf3e981dafb632543a54bc))
- Wired up basic unit test cases for rule file-mixed-line-endings ([46a549e](https://git.sr.ht/~royston/codsen/commits/46a549e8e56630af15b5fa49385c15714e41a5b1))

### BREAKING CHANGES

- rewrite in observer pattern
- Second input argument, progressFn, was moved into opts.progressFn and opts was
placed into second input argument instead

## 2.19.0 (2020-10-12)

### Features

- update to the latest tokenizer, improve attribute-\* rules ([deea2ce](https://gitlab.com/codsen/codsen/commit/deea2ce963c253a9d0ba8aa55c8e62a7f2eb9c63))

## 2.18.0 (2020-05-06)

### Features

- update the deps ([01ac915](https://gitlab.com/codsen/codsen/commit/01ac915b0e703c59f502a4ffffcffb7ff969001f))

## 2.17.0 (2020-04-13)

### Features

- new rule, `tag-space-before-closing-bracket` ([77dc417](https://gitlab.com/codsen/codsen/commit/77dc417ff9597264791044e6f4a78ef01942269a))

## 2.16.0 (2020-04-04)

### Bug Fixes

- don't raise alerts on doctype case in rule `tag-name-case` ([4d5c2a7](https://gitlab.com/codsen/codsen/commit/4d5c2a7fb7e31245e178352bccf83168404a7719))
- fix a few premature exiting functions ([f8ad307](https://gitlab.com/codsen/codsen/commit/f8ad3075e850e8622bd831d3f33c511ac9985f78))
- stop validateDigitAndUnit() breaking on falsey inputs, thanks to dev UMD build ([ad1fb8f](https://gitlab.com/codsen/codsen/commit/ad1fb8f2cf684c43e971844298e0e472fb2501b3))
- support `tel:*` for `href` value ([fa9d649](https://gitlab.com/codsen/codsen/commit/fa9d6497829754a71f8c6837a7c7266b1e82a24b))

### Features

- add Apple-specific link types ([5148bf8](https://gitlab.com/codsen/codsen/commit/5148bf8fdf0ef1a2a4037a4c909af724d6f0b978))
- add more known link types such as `rel="icon"` ([0756ad0](https://gitlab.com/codsen/codsen/commit/0756ad0c68dd93139d7c46ba41ccef7c5b65bdbe))
- introduce new key in reported messages, `keepSeparateWhenFixing` ([f27a756](https://gitlab.com/codsen/codsen/commit/f27a756475158b7ff97f7be251c7f0af11ce2611))
- mention attribute's name in `attribute-validate-*` error messages ([6801b6e](https://gitlab.com/codsen/codsen/commit/6801b6eebf084949c97f5e67517b686a3294bf73))
- recognise IE attribute in `attribute-validate-http-equiv` ([a85496c](https://gitlab.com/codsen/codsen/commit/a85496cd7ec98537c5631cfd4aae2509ad139704))

## 2.15.0 (2020-03-24)

### Features

- improvements to `attribute-malformed` - detect repeated opening quotes on attributes ([c4db5bf](https://gitlab.com/codsen/codsen/commit/c4db5bf3613ab8e297a2ddfef38169090cc7c10e))
- improvements to `attribute-malformed` - recognise repeated double quotes instead of equal ([f7d487e](https://gitlab.com/codsen/codsen/commit/f7d487e2ca160545bb3a0c4b2d30c9adbfe59992))
- new rule, `comment-conditional-nested` ([b5de5b9](https://gitlab.com/codsen/codsen/commit/b5de5b9c8ffd6ea2ec25edab17600f59ac090cb1))
- new rule, `tag-bad-self-closing` ([1d6c1db](https://gitlab.com/codsen/codsen/commit/1d6c1dbb68f02cc422206746b7c323fd191ac986))
- new rule, `tag-void-frontal-slash`; recognise HTML attr missing quotes (`attribute-malformed`) ([7de6964](https://gitlab.com/codsen/codsen/commit/7de69647ff2a53ab3ee2ebce63b7d5301cc76b99))
- recognise errors on the opening "only"-kind comment tag endings ([abf504c](https://gitlab.com/codsen/codsen/commit/abf504c87e3cb213da1415f220f46b5c5b45730b))
- recognise wrong brackets in comment tags (both closing and opening) ([e97dccb](https://gitlab.com/codsen/codsen/commit/e97dccb0131159e44b6f5f2208fc36d2f246f1ad))
- tweaks to `comment-mismatching-pair` to mind malformed closing tags to prevent fixes clashes ([5f389b5](https://gitlab.com/codsen/codsen/commit/5f389b5c3e69ebaf211d4096477fcc4b0aad3920))

## 2.14.0 (2020-03-16)

### Bug Fixes

- fix the severity reporting for `character-unspaced-punctuation` rule ([dce4064](https://gitlab.com/codsen/codsen/commit/dce406414ba5ba53f0417add197a7edee151a5b6))

### Features

- correctly recognise `!--` pattern, don't trigger unspaced-punctuation ([d3ae0d8](https://gitlab.com/codsen/codsen/commit/d3ae0d87da68cba134c9ce804e35308ce4d47d66))
- emit token events from the traversed AST (instead of directly from tokenizer) ([ee460c0](https://gitlab.com/codsen/codsen/commit/ee460c0a114a52b2ab9d78c4f9a0fad9c05af139))
- improvements to opening comment tag recognition ([9dfacc4](https://gitlab.com/codsen/codsen/commit/9dfacc4b28d825641a0149581a4cdceca1a6f290))
- make `character-encode` rule to consume text type nodes, to traverse them ([d5ee8b5](https://gitlab.com/codsen/codsen/commit/d5ee8b5bb6c2488779a42a1a15facd4745518359))
- new rule, `comment-mismatching-pair` ([72bcb44](https://gitlab.com/codsen/codsen/commit/72bcb44ae7f1439c80e93e2cb95a5a2900dcb0fe))
- tap `string-find-malformed` and implement the broken simple opening comment search ([53807d0](https://gitlab.com/codsen/codsen/commit/53807d09e4b1909c81978e2720b3d45ac2cfeef7))

## 2.13.0 (2020-02-24)

### Features

- new rule `media-malformed` ([cac1c17](https://gitlab.com/codsen/codsen/commit/cac1c17d93f8ba7ba79755af6eba21aefbea36e3))
- new rules, `comment-only-closing-malformed` & `comment-only-opening-malformed` ([84f9319](https://gitlab.com/codsen/codsen/commit/84f931979c5511e4c94e5e076f437f542ca49e8a))
- recognise broken html simple closing comments with missing dashes ([88874b6](https://gitlab.com/codsen/codsen/commit/88874b60aa2876cb08f566c72434f1f0ae342f14))
- recognise more broken closing comment tag cases ([fe77d70](https://gitlab.com/codsen/codsen/commit/fe77d70bb7b24c3563c7eea300ce29ce7f87e345))

## 2.12.0 (2020-02-09)

### Features

- new rule, `tag-missing-opening` ([1d5d596](https://gitlab.com/codsen/codsen/commit/1d5d596501cebb289cffad6d5f354148d0c6538c))
- switch to codsen-parser ([e9d7080](https://gitlab.com/codsen/codsen/commit/e9d7080a50967e582aa73948d7d0cd80fcc5d20c))

## 2.11.0 (2020-01-26)

### Features

- improve whitespace recognition within URI's ([ba3446b](https://gitlab.com/codsen/codsen/commit/ba3446b53fcab1639315ebb803c2753e8fd42f0d))

## 2.10.0 (2020-01-11)

### Features

- extend "onunload" attribute validation to body tag ([81a9e5a](https://gitlab.com/codsen/codsen/commit/81a9e5a1f17aa1144b2c23f5a86879ffecd6adfc))
- extend onload attribute validation to body tag ([a6c61f8](https://gitlab.com/codsen/codsen/commit/a6c61f856e0730ce22a10738fded0114549a5355))
- extend rule `attribute-validate-size` ([72502c6](https://gitlab.com/codsen/codsen/commit/72502c67f236aa95c3cd7ef4162af24b46542962))
- improvements to `attribute-validate-width` ([f50e6e7](https://gitlab.com/codsen/codsen/commit/f50e6e72b8da3fd9088fc934f24b380ecc0afc9b))
- migrate all URI value type attributes to consume validateUri() ([2ab3631](https://gitlab.com/codsen/codsen/commit/2ab363118016f847da5e305deee6577bdad1a3c1))
- new rule, `attribute-validate-method` ([b233e92](https://gitlab.com/codsen/codsen/commit/b233e92b1e824b49e3bb72cc28a29694cc0e2a33))
- new rule, `attribute-validate-multiple` ([2465441](https://gitlab.com/codsen/codsen/commit/2465441926917c94ad80946adcc5eb0763310b14))
- new rule, `attribute-validate-name` ([8870abe](https://gitlab.com/codsen/codsen/commit/8870abe2f6a4d5ca200c885b0cdbcf5b81855ac8))
- new rule, `attribute-validate-nohref` ([dadcb16](https://gitlab.com/codsen/codsen/commit/dadcb1650c4266eaaf54c4c918a3d44787113a7f))
- new rule, `attribute-validate-noresize` ([73a63a7](https://gitlab.com/codsen/codsen/commit/73a63a75fe3bdf00b63c27231348da2b39a4218a))
- new rule, `attribute-validate-noshade` ([250f786](https://gitlab.com/codsen/codsen/commit/250f7867d72fdad637799a15eef62cd01a705faf))
- new rule, `attribute-validate-nowrap` ([cfea63e](https://gitlab.com/codsen/codsen/commit/cfea63ec5593e19f20550188fc7374a8428774ac))
- new rule, `attribute-validate-object` ([7f1fed3](https://gitlab.com/codsen/codsen/commit/7f1fed39e53558e0d0d06fdd7056a8ad2e782d8b))
- new rule, `attribute-validate-onblur` ([3b464bc](https://gitlab.com/codsen/codsen/commit/3b464bc542fd103e1c27a8125d01b1ef54e209e2))
- new rule, `attribute-validate-onchange` ([188d5b6](https://gitlab.com/codsen/codsen/commit/188d5b6891141d6fbe26839a65ae6ab9bd122339))
- new rule, `attribute-validate-onfocus` ([1db2ebe](https://gitlab.com/codsen/codsen/commit/1db2ebe44d0bba0750d98fc2ad8566d271328a84))
- new rule, `attribute-validate-onkeydown` ([19c091a](https://gitlab.com/codsen/codsen/commit/19c091a70905f69ff1192742459d930c51a2488f))
- new rule, `attribute-validate-onkeypress` ([c5d465a](https://gitlab.com/codsen/codsen/commit/c5d465a3dd43979397aed73fc5f9ba5259dc0107))
- new rule, `attribute-validate-onkeyup` ([9cdb2ed](https://gitlab.com/codsen/codsen/commit/9cdb2ed8df3c4aa64083c1f2ca0ca7ffa5e02e8b))
- new rule, `attribute-validate-onload` ([f231e11](https://gitlab.com/codsen/codsen/commit/f231e11ccb72f3b37a6779ce8669c6b53c41ebc6))
- new rule, `attribute-validate-onmousedown` ([d7323a0](https://gitlab.com/codsen/codsen/commit/d7323a0c3e5d4a9b71ea6f7fa59cdca68a380c6c))
- new rule, `attribute-validate-onmousemove` ([a64c6a0](https://gitlab.com/codsen/codsen/commit/a64c6a093c2ba26d9f5fd50b471fc3367a7dce77))
- new rule, `attribute-validate-onmouseout` ([64115da](https://gitlab.com/codsen/codsen/commit/64115dac69088361fea218109ec3c97078a217f6))
- new rule, `attribute-validate-onmouseover` ([9fd7b85](https://gitlab.com/codsen/codsen/commit/9fd7b85791a06d3d9250f50deecb1f85b9b68220))
- new rule, `attribute-validate-onmouseup` ([9118dbb](https://gitlab.com/codsen/codsen/commit/9118dbb0264840b72d531e0850d92b1d4563ebd4))
- new rule, `attribute-validate-onreset` ([4cdb742](https://gitlab.com/codsen/codsen/commit/4cdb7426fc824dc2e4078410057fd8204a3e6701))
- new rule, `attribute-validate-onselect` ([3834290](https://gitlab.com/codsen/codsen/commit/38342900ae71c2ee87768848f5445c02555070e5))
- new rule, `attribute-validate-onsubmit` ([f23640a](https://gitlab.com/codsen/codsen/commit/f23640a30ee73084f2ceff8242ca55921f76a408))
- new rule, `attribute-validate-onunload` ([582be1f](https://gitlab.com/codsen/codsen/commit/582be1f6e561df4bc066b09d2bc7161fc08d1cb8))
- new rule, `attribute-validate-profile` ([c1e8ba1](https://gitlab.com/codsen/codsen/commit/c1e8ba1c7b376572f5c512cfb083603a97eb7140))
- new rule, `attribute-validate-prompt` ([003c04f](https://gitlab.com/codsen/codsen/commit/003c04fb7b4637b65454de1ad0821dd5479c979d))
- new rule, `attribute-validate-readonly` ([5b2f921](https://gitlab.com/codsen/codsen/commit/5b2f92127480d46f085ed9b046a76a00fc25eaad))
- new rule, `attribute-validate-rel` ([4c991d8](https://gitlab.com/codsen/codsen/commit/4c991d837192a2bdcac6ca7574fffa45a63941cd))
- new rule, `attribute-validate-rev` ([868fdbb](https://gitlab.com/codsen/codsen/commit/868fdbb7828a56214bac2cd198ab174df22066df))
- new rule, `attribute-validate-rows` ([f3fa9e1](https://gitlab.com/codsen/codsen/commit/f3fa9e1df1e70ecf3164a334e0f9e36ac33dbe84))
- new rule, `attribute-validate-scheme` ([2d85432](https://gitlab.com/codsen/codsen/commit/2d854321cc96d78aebf2ae959de61c23c840cf4a))
- new rule, `attribute-validate-scope` ([666fe2b](https://gitlab.com/codsen/codsen/commit/666fe2b657576736f518a1e46df3d3cece1b5f7e))
- new rule, `attribute-validate-scrolling` ([e89d60b](https://gitlab.com/codsen/codsen/commit/e89d60b44c6b19f8e0cb0f517899ae0c950c64d0))
- new rule, `attribute-validate-selected` ([ed3d264](https://gitlab.com/codsen/codsen/commit/ed3d26474a29aac8036d6f7d293f72ed6241cda4))
- new rule, `attribute-validate-shape` ([6ed0bf4](https://gitlab.com/codsen/codsen/commit/6ed0bf48fe55b57fc0092dd65514ded4b6cd07e3))
- new rule, `attribute-validate-size` and some rebasing ([b11c805](https://gitlab.com/codsen/codsen/commit/b11c805ac21ccc9e6c38d67827a42ee7a6dd0784))
- new rule, `attribute-validate-span` ([c03a6bb](https://gitlab.com/codsen/codsen/commit/c03a6bbb7b8243e3f99d90e407bd0f281fd566d8))
- new rule, `attribute-validate-src` ([38a3154](https://gitlab.com/codsen/codsen/commit/38a3154041f4cf79ea4232ab2405ad9ab808d5ea))
- new rule, `attribute-validate-start` ([4a9d387](https://gitlab.com/codsen/codsen/commit/4a9d387473e48b8626401bbfd891a436c051b4c5))
- new rule, `attribute-validate-style` (basic level) ([293fa79](https://gitlab.com/codsen/codsen/commit/293fa79a028d31bfe6fc6ca7fa069c92925fad56))
- new rule, `attribute-validate-summary` ([a4a0e6e](https://gitlab.com/codsen/codsen/commit/a4a0e6e80571f9e9d4f889148135ac8294c4bfcb))
- new rule, `attribute-validate-tabindex` ([d9299d8](https://gitlab.com/codsen/codsen/commit/d9299d832b0a180559de7715015c43ea3253f2c8))
- new rule, `attribute-validate-target` ([d996417](https://gitlab.com/codsen/codsen/commit/d99641702c7fa2214ede95113ab510b7ef73d3c2))
- new rule, `attribute-validate-title` ([251b854](https://gitlab.com/codsen/codsen/commit/251b8546478da4363856201710fb2b3480820cc3))
- new rule, `attribute-validate-type` ([29ef159](https://gitlab.com/codsen/codsen/commit/29ef159ed27dfb1e302c88e9c02c75461a1ef478))
- new rule, `attribute-validate-usemap` ([6a33365](https://gitlab.com/codsen/codsen/commit/6a33365b1aef7e5222fdda8494f7e25b01465df2))
- new rule, `attribute-validate-valign` ([83e80a9](https://gitlab.com/codsen/codsen/commit/83e80a9a334aed9256b355b4bfdb00516ab5c83b))
- new rule, `attribute-validate-value` ([716f7f6](https://gitlab.com/codsen/codsen/commit/716f7f61e13d2d0d1389f13ce5394c3dbe5e016f))
- new rule, `attribute-validate-valuetype` ([fd68ed7](https://gitlab.com/codsen/codsen/commit/fd68ed731778a03dd1e152492dd12ea79cceb420))
- new rule, `attribute-validate-version` ([e524e00](https://gitlab.com/codsen/codsen/commit/e524e007ebb8232df185fcd6c4670d8b206e08f0))
- new rule, `attribute-validate-vspace` ([e99b727](https://gitlab.com/codsen/codsen/commit/e99b727185cef17cfa356eecb4f1fbcad007186c))
- new rules, `attribute-validate-onclick` and `attribute-validate-ondblclick` ([b5d797c](https://gitlab.com/codsen/codsen/commit/b5d797c8a1a76b2fc1489e4ab78f90669dc031d5))
- separate relative URI checking into a standalone package and then tap it ([c48a622](https://gitlab.com/codsen/codsen/commit/c48a622ecc5469d589d119f893860b87b172f402))

## 2.9.0 (2020-01-05)

### Features

- add xmlns ([7154f5f](https://gitlab.com/codsen/codsen/commit/7154f5f29f3cdc16a8a561eb5724b537300366d4))
- new rule, `attribute-validate-alt` ([6ec507e](https://gitlab.com/codsen/codsen/commit/6ec507e004b4266f732aa01f280a9e13830a5f13))
- new rule, `attribute-validate-frameborder` ([c8e580a](https://gitlab.com/codsen/codsen/commit/c8e580aea6ed82f8d43f89f90ad3dbfbf6c7e8bd))
- new rule, `attribute-validate-headers` ([d582b8a](https://gitlab.com/codsen/codsen/commit/d582b8a082e250ee918fc46bb0119661f262b9c6))
- new rule, `attribute-validate-height` ([09732a9](https://gitlab.com/codsen/codsen/commit/09732a9e0ad8bac100b577f190a705b37bd8bcf3))
- new rule, `attribute-validate-href` ([73148d7](https://gitlab.com/codsen/codsen/commit/73148d7a3eae821acea2cb8832b35f25d499cb2e))
- new rule, `attribute-validate-hreflang` ([a19c9d2](https://gitlab.com/codsen/codsen/commit/a19c9d2ab8471c2a9a772cf7b9df88912038d7fe))
- new rule, `attribute-validate-hspace` ([eed294b](https://gitlab.com/codsen/codsen/commit/eed294b5992b72a1f0aed9d4f504512b25e45cd5))
- new rule, `attribute-validate-http-equiv` ([b6436bc](https://gitlab.com/codsen/codsen/commit/b6436bc258346f826673c99d003eaa11a2d0b1ef))
- new rule, `attribute-validate-ismap` ([e5df842](https://gitlab.com/codsen/codsen/commit/e5df84218d1e128ff3743cfb2ea091cce606bf3e))
- new rule, `attribute-validate-label` ([5409a92](https://gitlab.com/codsen/codsen/commit/5409a9286d6cd5e2d0895d42d9b6a351f4c13f31))
- new rule, `attribute-validate-lang` ([dd0f9d2](https://gitlab.com/codsen/codsen/commit/dd0f9d2432be3c32cffdaa3af38473f26e08b434))
- new rule, `attribute-validate-language` ([06d4312](https://gitlab.com/codsen/codsen/commit/06d4312e4940adcda27c36a39305604e247a9652))
- new rule, `attribute-validate-link` ([e37e2e0](https://gitlab.com/codsen/codsen/commit/e37e2e0f0b39fe6f59892d79ab34ec6c450601f9))
- new rule, `attribute-validate-longdesc` ([702fbd2](https://gitlab.com/codsen/codsen/commit/702fbd2773ae2b6ccfd768d756afbe0ab10f4184))
- new rule, `attribute-validate-marginheight` ([e1f024f](https://gitlab.com/codsen/codsen/commit/e1f024f92f6e96526d2ddc54ad6dc65e9f892ae5))
- new rule, `attribute-validate-marginwidth` ([47860e4](https://gitlab.com/codsen/codsen/commit/47860e460a68a59612cfe63a38d695fa59e48900))
- new rule, `attribute-validate-maxlength` ([e7401c0](https://gitlab.com/codsen/codsen/commit/e7401c02e567c9b5713b26ff7cdced10671e63f3))
- new rule, `attribute-validate-media` ([2d77259](https://gitlab.com/codsen/codsen/commit/2d77259e7249f490bd23468e4c015aad98f3975b))
- new rule, `attribute-validate-text` ([57f7d8e](https://gitlab.com/codsen/codsen/commit/57f7d8ea02e90b2be03134b276d72f711c50ae5b))
- new rule, `attribute-validate-vlink` ([55ff0db](https://gitlab.com/codsen/codsen/commit/55ff0dbe0cee7c86cd1a40932251473e61271b8d))
- new rules, `attribute-validate-frame` and `attribute-validate-rules` ([1d12ae4](https://gitlab.com/codsen/codsen/commit/1d12ae40561e66fdbafcfabc5551295b5d945d8f))

## 2.8.0 (2020-01-01)

### Features

- harden the rule `attribute-malformed`, flag up all non-recognised attrs ([fc949a7](https://gitlab.com/codsen/codsen/commit/fc949a7c978ef4d4e46864941aba2092f9176b32))
- improvements to attribute-validate-archive and others ([f8b35fe](https://gitlab.com/codsen/codsen/commit/f8b35fe51a22e2014516d521f89b3270c4b35d5d))
- new rule, `attribute-validate-cols` ([05fb199](https://gitlab.com/codsen/codsen/commit/05fb19937080f1223278b6381de47db9f884f55b))
- new rule, `attribute-validate-colspan` ([e72fa98](https://gitlab.com/codsen/codsen/commit/e72fa98594698689cb1b09405c42af1c62d2e9c0))
- new rule, `attribute-validate-compact` ([ec7e4f3](https://gitlab.com/codsen/codsen/commit/ec7e4f36d016c93c27f15ac73e7ac962057d669b))
- new rule, `attribute-validate-content` ([a076d71](https://gitlab.com/codsen/codsen/commit/a076d719ae3e4e56416837897ee8a3feb48d48ab))
- new rule, `attribute-validate-coords` ([f3baa58](https://gitlab.com/codsen/codsen/commit/f3baa58eb4dbf6ffde6130b2afa424ad7f3752ca))
- new rule, `attribute-validate-data` ([3cd016a](https://gitlab.com/codsen/codsen/commit/3cd016a42b580188badd6a1bff9f6e099dea49a4))
- new rule, `attribute-validate-datetime` ([62b8776](https://gitlab.com/codsen/codsen/commit/62b8776320880f9d46289897cbc32cc408888a69))
- new rule, `attribute-validate-declare` ([e16fd80](https://gitlab.com/codsen/codsen/commit/e16fd806242b2e29117b313fabf9fce1c76d59e7))
- new rule, `attribute-validate-defer` ([52d0acd](https://gitlab.com/codsen/codsen/commit/52d0acdd7b8ab7673973d2baf34d14efa97a7b7a))
- new rule, `attribute-validate-dir` ([086a83d](https://gitlab.com/codsen/codsen/commit/086a83d2eafcce592bb484e833a676c68ae9fc05))
- new rule, `attribute-validate-disabled` ([45bb607](https://gitlab.com/codsen/codsen/commit/45bb6070ebbe95a5ebd86b2caf5a9f3dd2c5db08))
- new rule, `attribute-validate-enctype` ([5f1098c](https://gitlab.com/codsen/codsen/commit/5f1098cffc8d90bf543922c45579416c6ca33277))
- new rule, `attribute-validate-for` ([7a53a41](https://gitlab.com/codsen/codsen/commit/7a53a41467cc113e35123892c8cb084ecdb922cb))
- new rule, `attribute-validate-rowspan` ([a234874](https://gitlab.com/codsen/codsen/commit/a2348744449cbe7d4c8a1e006fbe59a1bbf2db57))
- show all permitted values in error messages instead of complaining about wrong value ([a5ee245](https://gitlab.com/codsen/codsen/commit/a5ee24596b1bce7bc2f800a425bd4a5b4c0ea0d2))

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
