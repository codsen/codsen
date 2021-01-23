# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# 4.0.0 (2021-01-23)


### Bug Fixes

* Add more false-outcome unit tests and tweak the algorithm edge cases to pass all tests ([0f08e34](https://github.com/codsen/codsen/commit/0f08e346c5568214c0288879ebde321364114311))
* Algorithm tweaks ([a454439](https://github.com/codsen/codsen/commit/a4544397ab93e5f4fdcfcaff66dfdd5aa60d712e))
* Algorithm tweaks ([1356361](https://github.com/codsen/codsen/commit/1356361a8162e7ec06ee6615d4c7362b268b5eae))
* Algorithm tweaks to pass all unit tests ([8411e3e](https://github.com/codsen/codsen/commit/8411e3e2876ea7e0202c992213423815109d8e81))
* All unit tests pass ([dd42727](https://github.com/codsen/codsen/commit/dd4272722d3c7722486483734a6c66554bc29f8f))
* don't raise alerts on doctype case in rule `tag-name-case` ([a63eba1](https://github.com/codsen/codsen/commit/a63eba1d07da742a86261d36431aa37c03fd73c7))
* fix few premature exiting functions ([e319074](https://github.com/codsen/codsen/commit/e319074cb4ef24ec2c7f10659b1058db86f4e7e5))
* Fix the Create New Issue URLs ([f5a41bf](https://github.com/codsen/codsen/commit/f5a41bf16fd8f43de7f8e7de68da562821ddb960))
* fix the severity reporting for `character-unspaced-punctuation` rule ([6a48a9a](https://github.com/codsen/codsen/commit/6a48a9aadb82a2f78ff9c80e926fe3ca79e41aa2))
* make all unit tests pass ([de84561](https://github.com/codsen/codsen/commit/de84561405b9ab7151b34368e2a13a0822193048))
* make rule tag-space-after-opening-bracket not applicable for HTML comments ([cdcc2ac](https://github.com/codsen/codsen/commit/cdcc2acf7e8342d9568e14b67727ef91d6782af7))
* Prepare for ESP tag features ([bde7f29](https://github.com/codsen/codsen/commit/bde7f29eddaea21ab3e7ad78a7e71340ff02fcf6))
* stop traversing attribute array and within it ([ef07f43](https://github.com/codsen/codsen/commit/ef07f4356604c153323c82590e93b9eb38c6375b))
* stop validateDigitAndUnit() breaking on falsey inputs, thanks to dev UMD build ([619332a](https://github.com/codsen/codsen/commit/619332a7bba79e00bb1354911d6ce7dca205c2c3))
* support `tel:*` for `href` value ([ff2e9e8](https://github.com/codsen/codsen/commit/ff2e9e805e8cc1cab8473c0c47651290276a9e6d))
* Treats legit quotes of the opposite kind within healthy quotes correctly ([1bf7b02](https://github.com/codsen/codsen/commit/1bf7b02c0a6e8abcb241aec6d2a71e689e419592))
* Tweak the detection algorithm of some false cases ([9ca3821](https://github.com/codsen/codsen/commit/9ca3821be42061c22b180da6195450ba6c953650))
* when bad entity rules are disabled, they do not raise any issues ([055b7a1](https://github.com/codsen/codsen/commit/055b7a11fe2cf35bad1c39a65e8acb9a1a97cf45))
* WIP - Sorting out raw ampersands ([0117ee0](https://github.com/codsen/codsen/commit/0117ee040eebe0be6ff49d102a3e27822c540bc7))


### Features

* "bad-malformed-numeric-character-entity" and "bad-named-html-entity-multiple-encoding" ([d30dc5d](https://github.com/codsen/codsen/commit/d30dc5de8d631648cd78992230f77fef750b5f22))
* Add all missing whitespace character rules ([d3490f6](https://github.com/codsen/codsen/commit/d3490f6391dfe34ffdfe1d4418b9d3faacc701f9))
* add Apple-specific link types ([966d9d4](https://github.com/codsen/codsen/commit/966d9d4c44a5148e848755fa362a4c839b318e30))
* add few more character rules ([8c228ab](https://github.com/codsen/codsen/commit/8c228ab0b70c2140ce5fedddf151562f2e5812e1))
* add few more character rules ([f8604c3](https://github.com/codsen/codsen/commit/f8604c309d8892c075024286d0aa0e4512aac891))
* add few more character rules ([aefd0b4](https://github.com/codsen/codsen/commit/aefd0b47bdbcc820e3c0f1f38ded140d3851a9ef))
* add more bad character rules ([6c6eb03](https://github.com/codsen/codsen/commit/6c6eb03e5ed3c2949dfde69dbf356865576d4aa0))
* add more known link types such as `rel="icon"` ([b6e9591](https://github.com/codsen/codsen/commit/b6e9591761dcf764fdc314d9acbf7fb4a2874458))
* add new rule, bad-named-html-entity-not-email-friendly ([00fd541](https://github.com/codsen/codsen/commit/00fd5415d75c4bf348020915c46b9c295c61789e))
* add parent tag validation for attribute-validate-accept ([2615cc4](https://github.com/codsen/codsen/commit/2615cc4af8a2516627cdd4930f6e84fa1ad09da1))
* Add rule attribute-space-between-name-and-equals ([86bcab1](https://github.com/codsen/codsen/commit/86bcab147a34dfeb68b4ccaa82575e8ade6af3f1))
* Add rules to identify non-printable low-range ASCII characters ([3f54cdd](https://github.com/codsen/codsen/commit/3f54cdd3f2192767b9acf4c16d73d96254d0904b))
* add safegard type checks on linter.verify() inputs ([41b20c1](https://github.com/codsen/codsen/commit/41b20c181fce7a2037a8e64a7c50657656aee849))
* add xmlns ([7f31eb5](https://github.com/codsen/codsen/commit/7f31eb5906179425c172716dd534c12883156672))
* Algorithm improvements ([63e9cd9](https://github.com/codsen/codsen/commit/63e9cd98eceb9daecf45bf5d50f3ce59be40da69))
* Algorithm tweaks to correspond to the latest API's of all deps ([db9e6cf](https://github.com/codsen/codsen/commit/db9e6cfe41eb5e579a791e0ff0d3fa56fa4ace24))
* Allow colons in tag names (allows Mailchimp templating tags) ([c340acf](https://github.com/codsen/codsen/commit/c340acf1920e8f4eedff87dac99a8ddbfdbfb5fb))
* Broken CDATA recognition improvements ([0873503](https://github.com/codsen/codsen/commit/08735038b5a29fa0b3784c094c9e2c51eeb1afb4))
* complete creating rules for all ASCII range invisible characters ([42d300d](https://github.com/codsen/codsen/commit/42d300d634d3b1cc9e939893850855057a96b915))
* complete the rule `media-malformed` ([f0a8690](https://github.com/codsen/codsen/commit/f0a8690f103763e8813556c5cabec4d27ffbdc68))
* correctly recognise !-- pattern, don't trigger unspaced-punctuation ([321f8aa](https://github.com/codsen/codsen/commit/321f8aa8e1df70c84e982e391e52f61ef76663b5))
* Correctly recognises brackets within attribute values ([60563b5](https://github.com/codsen/codsen/commit/60563b56ef54e365998016f11437a0bd51301065))
* Dedupe repeated slash errors, now there's only one reported per tag ([1820493](https://github.com/codsen/codsen/commit/1820493abb604ce7db5320cbe8124e585ed6dfd4))
* detect backslashes in front of a tag ([6734d45](https://github.com/codsen/codsen/commit/6734d45bfaa63e0c057d4664ee63c08cb564f96c))
* Detect excessive whitespace in front of ESP tag ([c8ee077](https://github.com/codsen/codsen/commit/c8ee07761a921df41b5880d9801bb1d4715c446f))
* emit token events from the traversed AST (instead of directly from tokenizer) ([2698f50](https://github.com/codsen/codsen/commit/2698f50f32f65e287015a9a5d5b649d991f2ca15))
* Ensure that all withinQuotes marking is correct, including in messed up code cases ([255e39a](https://github.com/codsen/codsen/commit/255e39a5db959c4d5c129ac26bc1322e1c16fea6))
* Excessive whitespace before missing closing bracket ([f25f0f2](https://github.com/codsen/codsen/commit/f25f0f2acaff9579c15e9980959e1a42c838921d))
* Excessive whitespace instead of a missing closing quotes ([dbff09a](https://github.com/codsen/codsen/commit/dbff09ac6dffad46478f1215688f7200e408441d))
* Excessive whitespace then slash instead of closing quotes ([a5298f8](https://github.com/codsen/codsen/commit/a5298f83d2c872c998de80d60d1e91d4e7080127))
* extend "onunload" attribute validation to body tag ([05c59fd](https://github.com/codsen/codsen/commit/05c59fd106cd0c879f4d44af95f46aea86d82d93))
* extend onload attribute validation to body tag ([c50c88f](https://github.com/codsen/codsen/commit/c50c88f9ebdd79bbb3e723da67230426f57afc8f))
* extend rule `attribute-validate-size` ([4697eaf](https://github.com/codsen/codsen/commit/4697eafd057e518f3bbb73abcda23930215bc3f8))
* Extend rule tag-stray-character to both quotes and equal characters ([3f5154e](https://github.com/codsen/codsen/commit/3f5154e357eb65410478d71279efc5220b3cc1f3))
* few more character rules ([8ca2970](https://github.com/codsen/codsen/commit/8ca297069bc1ac53e8449f9d188373bc9246f48e))
* few more rules ([15a10a7](https://github.com/codsen/codsen/commit/15a10a74a55fb7dec15bbaa9a57d30cc4815160c))
* first rule with config, tag-space-before-closing-slash, also add string-left-right as a dep ([38ba956](https://github.com/codsen/codsen/commit/38ba9563194f5be40d7d2b09f10cf627054a0764))
* flags up characters outside of ASCII and suggests HTML (only, so far) encoding ([b2fbc01](https://github.com/codsen/codsen/commit/b2fbc01cc863b2ba9a534666f1267d1144c38f7f))
* grouped rules - "tag" and "bad-character" ([9a57ee2](https://github.com/codsen/codsen/commit/9a57ee2746cb36c792eba8bf4a17345e293c324a))
* harden the rule `attribute-malformed`, flag up all non-recognised attrs ([caed233](https://github.com/codsen/codsen/commit/caed2337fdbaed9957df8235f6f546872c6481a8))
* Heuristical ESP tag recognition ([6e31ed3](https://github.com/codsen/codsen/commit/6e31ed3ea7ef0bbdef8f44e3edd7c7e8dcd7ab50))
* Implement opts for each rule ([71af846](https://github.com/codsen/codsen/commit/71af84618b620401cbc98064a96e38579d6aa807))
* Improve closing slash error reporting consistency and rule name precision ([640fbc0](https://github.com/codsen/codsen/commit/640fbc011da1fa0c4c098b24902370db346a4165))
* Improve recognition of attribute sequences ([bd03d95](https://github.com/codsen/codsen/commit/bd03d95548c504d4e94e36ab8a98904e2d27a02e))
* improve whitespace recognition within URI's ([0bd331c](https://github.com/codsen/codsen/commit/0bd331c030ee3b2d4895ee45a968164a37fc8e0c))
* improvements for recognition of ESP tags within attributes ([cd84d97](https://github.com/codsen/codsen/commit/cd84d97bdf47cf2878ea1cc7d65c60f37373d6af))
* improvements in malformed entity reporting rules ([9c9837e](https://github.com/codsen/codsen/commit/9c9837e0c54edb33f633a236ad44be8b5b7c8efd))
* improvements to `attribute-malformed` - detect repeated opening quotes on attributes ([cc7a340](https://github.com/codsen/codsen/commit/cc7a3405310d552e38a612e2ec6b3163dc3647b4))
* improvements to `attribute-malformed` - recognise repeated double quotes instead of equal ([29336e1](https://github.com/codsen/codsen/commit/29336e1bd8acd199393212f541dfd0135f1c861a))
* improvements to `attribute-validate-width` ([7b2485e](https://github.com/codsen/codsen/commit/7b2485ecb10124618c62e2645668fad4a35bf27d))
* improvements to attribute-validate-archive and others ([8a9a42d](https://github.com/codsen/codsen/commit/8a9a42d337116c96eed9c23dfcb30decf04f6582))
* Improvements to CDATA rules and 4 new rules to cater HTML comments ([b05024d](https://github.com/codsen/codsen/commit/b05024d1d7226ce1c75b0e8d623cc7b08689bcb2))
* improvements to ESP tag recognition ([9bad597](https://github.com/codsen/codsen/commit/9bad597c56af4161f0ba494e635e882198a16242))
* Improvements to malformed CDATA tag recognition algorithm ([c576d95](https://github.com/codsen/codsen/commit/c576d95a124aefb29ccce8914e0a6ac9418ac9e2))
* improvements to opening comment tag recognition ([4b02382](https://github.com/codsen/codsen/commit/4b023825ecefe574602d761a9001fcf2b857a3a2))
* Improvements to rules *-double-quotation-mark ([52efae3](https://github.com/codsen/codsen/commit/52efae3511b96e7cb34746fd4833058c03905ab7))
* Initial release ([554c757](https://github.com/codsen/codsen/commit/554c757106ed47248d76c8482cb81fb938155465))
* Integrate string-fix-broken-named-entities ([64d863f](https://github.com/codsen/codsen/commit/64d863f49c90593e025fae85c4393dd8d9df1304))
* introduce new key in reported messages, `keepSeparateWhenFixing` ([cf24a02](https://github.com/codsen/codsen/commit/cf24a02646e29411bf474a8f54100fb770d0ae39))
* levenshtein distance for attribute names ([9850384](https://github.com/codsen/codsen/commit/9850384463fcc812fc651c47e9f292f08d5bdce3))
* make character-encode rule to consume text type nodes, to traverse them ([04e5ced](https://github.com/codsen/codsen/commit/04e5ced283e4800c4484bcd39b609910abcfdd36))
* make it pluggable - rewrite in observer pattern, separate the tokenizer and tap it ([6824a68](https://github.com/codsen/codsen/commit/6824a68d259f817f43e4dbbfa7f0d9f09449404d))
* make rules more composable ([01055b4](https://github.com/codsen/codsen/commit/01055b400fd11e4b1624e952eaac3f2c971e1e43))
* mention attribute's name in `attribute-validate-*` error messages ([b83a08b](https://github.com/codsen/codsen/commit/b83a08b02da4b91d05aac77d125fdb066e4348b7))
* Merge modes via opts.mergeType ([2394464](https://github.com/codsen/codsen/commit/2394464976ce1970bcd31b45d9fd9955f4bbcc09))
* migrate all URI value type attributes to consume validateUri() ([a79a843](https://github.com/codsen/codsen/commit/a79a843eada689df164eb3bcf199a6274b147dbd))
* More improvements to script tag recognition, rudimentary processing inside JS code ([42fa8c9](https://github.com/codsen/codsen/commit/42fa8c99421a142aee26b23ca0ce885660fc8214))
* Nested function-based ESP templating tag support ([8c8ca7a](https://github.com/codsen/codsen/commit/8c8ca7a525c06ddc6431b5cfcfbca7c4d2fad7fd))
* New rule - tagname-lowercase ([07dadf7](https://github.com/codsen/codsen/commit/07dadf725d1cfcf1e3a64ce9806b37e1deee50a5))
* new rule, `attribute-duplicate` ([e8de6b1](https://github.com/codsen/codsen/commit/e8de6b1842e53dc3ff2b5542ef2de45bbab17502))
* new rule, `attribute-validate-alt` ([96809d5](https://github.com/codsen/codsen/commit/96809d5bf64354928ca181565a938a90186ad435))
* new rule, `attribute-validate-archive` ([3da47e2](https://github.com/codsen/codsen/commit/3da47e2e3857896e9ebe8f82d2da2a793fbb1de3))
* new rule, `attribute-validate-axis` ([d166035](https://github.com/codsen/codsen/commit/d166035fbf3bee8b572ce7cbe56928249dcbd803))
* new rule, `attribute-validate-background` ([14f716c](https://github.com/codsen/codsen/commit/14f716c590f04561b311e3541077ad16165eaa59))
* new rule, `attribute-validate-bgcolor` ([047629f](https://github.com/codsen/codsen/commit/047629fd7439db17f1f20b61a2d85d6538f1cb83))
* new rule, `attribute-validate-cellpadding` ([be45ac5](https://github.com/codsen/codsen/commit/be45ac59d10e4c343f58aa225da9c0c246e49cce))
* new rule, `attribute-validate-cellspacing` ([674b3af](https://github.com/codsen/codsen/commit/674b3af23bb5615cfe0e8d0f351efe5e455b7994))
* new rule, `attribute-validate-char` ([78044b9](https://github.com/codsen/codsen/commit/78044b9f458baec9cd4c8567416b791d4d11cfe6))
* new rule, `attribute-validate-charoff` ([d35adc4](https://github.com/codsen/codsen/commit/d35adc4a99ff864b0d32a3b7265da90f3fbf4d5e))
* new rule, `attribute-validate-charset` ([9d6fd06](https://github.com/codsen/codsen/commit/9d6fd066bcf063ad59bbf55ebd77414d1644ac08))
* new rule, `attribute-validate-checked` ([8364504](https://github.com/codsen/codsen/commit/83645041e47ae93e1130090486ae2b34ff6b0122))
* new rule, `attribute-validate-cite` ([861b5ec](https://github.com/codsen/codsen/commit/861b5ecc5b464aea7bc77c5ab622d119da2433d3))
* new rule, `attribute-validate-class` ([706f273](https://github.com/codsen/codsen/commit/706f273bd78234af32b040161e057a7d5e7bbd1f))
* new rule, `attribute-validate-classid` ([31b926a](https://github.com/codsen/codsen/commit/31b926affc69644aec20e217f13139ddc6ee2704))
* new rule, `attribute-validate-clear` ([e1b4f45](https://github.com/codsen/codsen/commit/e1b4f4556d57d4f874923b184bd56e9264b1b1aa))
* new rule, `attribute-validate-code` ([6b758cb](https://github.com/codsen/codsen/commit/6b758cb80e76d0c6cf2779c0615afc0c4e3dceef))
* new rule, `attribute-validate-codebase` ([3b3fc89](https://github.com/codsen/codsen/commit/3b3fc89bc8a32652c0f8c5e9dbe7567edc33e128))
* new rule, `attribute-validate-codetype` ([74945f6](https://github.com/codsen/codsen/commit/74945f6d675a1d4ac31d5aac9021a158fa17d006))
* new rule, `attribute-validate-color` ([8057aca](https://github.com/codsen/codsen/commit/8057acaffbbe5781a2f5134eb29d367ff83be476))
* new rule, `attribute-validate-cols` ([9563466](https://github.com/codsen/codsen/commit/956346602dc8cbb014c5d003a5ac54a831a92da0))
* new rule, `attribute-validate-colspan` ([68c4760](https://github.com/codsen/codsen/commit/68c4760a6ac60146c4a63ff31cd0c5d803279a9a))
* new rule, `attribute-validate-compact` ([14a7818](https://github.com/codsen/codsen/commit/14a7818534acba8c625ee412e7dc69dce905071e))
* new rule, `attribute-validate-content` ([792bc23](https://github.com/codsen/codsen/commit/792bc23e08fb0665b2fde756bbc904ee5ff52052))
* new rule, `attribute-validate-coords` ([469bfa5](https://github.com/codsen/codsen/commit/469bfa52e5498496eba9395287ec101e3f419dae))
* new rule, `attribute-validate-data` ([451da24](https://github.com/codsen/codsen/commit/451da240dae3a135d9e58af039bbbdb026a4fb84))
* new rule, `attribute-validate-datetime` ([c0adb6f](https://github.com/codsen/codsen/commit/c0adb6f40992afc03d187b8f6d2b6a5ae48f351e))
* new rule, `attribute-validate-declare` ([4773f99](https://github.com/codsen/codsen/commit/4773f99109825f4bfcee47fa71c0223b60852d4e))
* new rule, `attribute-validate-defer` ([2b2083a](https://github.com/codsen/codsen/commit/2b2083aaef21d89d49bc86b2da0feb38a21fe4b9))
* new rule, `attribute-validate-dir` ([ca5f7bf](https://github.com/codsen/codsen/commit/ca5f7bf7c68554f03c0f049802f44eca4aaec337))
* new rule, `attribute-validate-disabled` ([d173b9f](https://github.com/codsen/codsen/commit/d173b9faf4429d5700abd4260f6745636fd00e58))
* new rule, `attribute-validate-enctype` ([479de19](https://github.com/codsen/codsen/commit/479de19bcbba5f6e0baf6cdae76a03549833662a))
* new rule, `attribute-validate-for` ([75fe52d](https://github.com/codsen/codsen/commit/75fe52dafd945568a6469190df7a3c761f2d518c))
* new rule, `attribute-validate-frameborder` ([6463a22](https://github.com/codsen/codsen/commit/6463a22309ccf16b4861a296d22153517998b39f))
* new rule, `attribute-validate-headers` ([40e98bd](https://github.com/codsen/codsen/commit/40e98bddafefbbe9a313355ab33faeff44be3de8))
* new rule, `attribute-validate-height` ([b30b165](https://github.com/codsen/codsen/commit/b30b1659cc913ccabe4998983d8b8f71c7cae170))
* new rule, `attribute-validate-href` ([52c251f](https://github.com/codsen/codsen/commit/52c251f05576b9534db7e712c9a36d2597ee254f))
* new rule, `attribute-validate-hreflang` ([862e56d](https://github.com/codsen/codsen/commit/862e56dec53bae432fb93e541ab7a3476cc5d704))
* new rule, `attribute-validate-hspace` ([063f63e](https://github.com/codsen/codsen/commit/063f63e3e141a66089603838d5ac99e496557c7a))
* new rule, `attribute-validate-http-equiv` ([6ea7bc2](https://github.com/codsen/codsen/commit/6ea7bc2195965a954abf83d4fe35dc735a1a1101))
* new rule, `attribute-validate-id` ([2278cb5](https://github.com/codsen/codsen/commit/2278cb5f389bd489402743cf05e9d139e1e856b6))
* new rule, `attribute-validate-ismap` ([8b5a2e3](https://github.com/codsen/codsen/commit/8b5a2e3bf7289babb8870b01ca48b3dbf50c5c45))
* new rule, `attribute-validate-label` ([f127d15](https://github.com/codsen/codsen/commit/f127d157bdd949c94077e00c5ba8a15164c61f1f))
* new rule, `attribute-validate-lang` ([23a0032](https://github.com/codsen/codsen/commit/23a00324e12d8b3631193bf5d8140d75d20a2f9a))
* new rule, `attribute-validate-language` ([5e6846a](https://github.com/codsen/codsen/commit/5e6846af7a650e68a036dd1ba8a81dbf143f771a))
* new rule, `attribute-validate-link` ([b0a6b24](https://github.com/codsen/codsen/commit/b0a6b24b8aaf9770a3cfa07a06ae7a3f11f2edf5))
* new rule, `attribute-validate-longdesc` ([e24bd78](https://github.com/codsen/codsen/commit/e24bd78d7bc39453f40960be271fc7ed773ae2f5))
* new rule, `attribute-validate-marginheight` ([812761e](https://github.com/codsen/codsen/commit/812761e06f811b84a87f20d7b37e22b3dedd3743))
* new rule, `attribute-validate-marginwidth` ([e068a45](https://github.com/codsen/codsen/commit/e068a45596e24bae681a17b922593b771bbd6bea))
* new rule, `attribute-validate-maxlength` ([90a7fb7](https://github.com/codsen/codsen/commit/90a7fb7a2636bf4552087ce462b10485eccad79b))
* new rule, `attribute-validate-media` ([0983c9a](https://github.com/codsen/codsen/commit/0983c9a2527d8cab0472264944d0d088eed44983))
* new rule, `attribute-validate-method` ([88cc36e](https://github.com/codsen/codsen/commit/88cc36e4bada5954e344b042ee1dbad781cafde1))
* new rule, `attribute-validate-multiple` ([ec5bd17](https://github.com/codsen/codsen/commit/ec5bd17c50953dbecd143264166887ec4672230d))
* new rule, `attribute-validate-name` ([2ec2b3f](https://github.com/codsen/codsen/commit/2ec2b3f52561c6aa830ba837cea5a29471399232))
* new rule, `attribute-validate-nohref` ([2d1619d](https://github.com/codsen/codsen/commit/2d1619d2ee39aadc0ea8b1fb8e63c1d83570e3cd))
* new rule, `attribute-validate-noresize` ([b41a92f](https://github.com/codsen/codsen/commit/b41a92f4c4aeaf0f101b62dad96777b7e0469ef0))
* new rule, `attribute-validate-noshade` ([5103b64](https://github.com/codsen/codsen/commit/5103b648116cc6a6398b7b6b40c3aba8ec36ae40))
* new rule, `attribute-validate-nowrap` ([851783e](https://github.com/codsen/codsen/commit/851783e7cb065c44637ddcebb3958251fe95ecee))
* new rule, `attribute-validate-object` ([2e68a82](https://github.com/codsen/codsen/commit/2e68a820fb577c97b7819d87cb99ba32ad6f481c))
* new rule, `attribute-validate-onblur` ([8238c9e](https://github.com/codsen/codsen/commit/8238c9ec119a4fea461d027d05518ee803256d63))
* new rule, `attribute-validate-onchange` ([2891d25](https://github.com/codsen/codsen/commit/2891d2520f96cd5658578e8a50421d430a69ef3d))
* new rule, `attribute-validate-onfocus` ([385aa31](https://github.com/codsen/codsen/commit/385aa319382e40e0b527848d2ed061cf812485fe))
* new rule, `attribute-validate-onkeydown` ([04798f2](https://github.com/codsen/codsen/commit/04798f2ff2b2f665460da141eb10c6efecdc5463))
* new rule, `attribute-validate-onkeypress` ([c627991](https://github.com/codsen/codsen/commit/c62799148d5056be6f921fe5efc98e9578a68d9d))
* new rule, `attribute-validate-onkeyup` ([fcd3c4c](https://github.com/codsen/codsen/commit/fcd3c4cb581b5fb3393d9d752df6715cd00ca476))
* new rule, `attribute-validate-onload` ([a74ff6c](https://github.com/codsen/codsen/commit/a74ff6ce568e557aaf2b189e281b866012f3a527))
* new rule, `attribute-validate-onmousedown` ([dccda6d](https://github.com/codsen/codsen/commit/dccda6d247e9d720aae7bdb6c81cc20fb3aa21d8))
* new rule, `attribute-validate-onmousemove` ([0d7cdbc](https://github.com/codsen/codsen/commit/0d7cdbc92cfc1cc70a62db5900336570dbaa24b1))
* new rule, `attribute-validate-onmouseout` ([f6cdbb5](https://github.com/codsen/codsen/commit/f6cdbb5f1037a86f656ddfb28c04edbbd2b08f7c))
* new rule, `attribute-validate-onmouseover` ([22bfc6a](https://github.com/codsen/codsen/commit/22bfc6ae141e920a59988f6f34361485e1af94b5))
* new rule, `attribute-validate-onmouseup` ([74641c3](https://github.com/codsen/codsen/commit/74641c3d205c93c4e62c3bf9c04bc2b595dfd97c))
* new rule, `attribute-validate-onreset` ([7f3436e](https://github.com/codsen/codsen/commit/7f3436e925b11d5d59771650d0e33a7d4e7844f5))
* new rule, `attribute-validate-onselect` ([ab1cf6d](https://github.com/codsen/codsen/commit/ab1cf6ddf525485728ff468647e14f65f5b85951))
* new rule, `attribute-validate-onsubmit` ([0b3e675](https://github.com/codsen/codsen/commit/0b3e675605e20e668e52364cb03bdc513f7f9853))
* new rule, `attribute-validate-onunload` ([fb04b78](https://github.com/codsen/codsen/commit/fb04b7800a9915bfb5e9a9e7dd4ba089f34fa988))
* new rule, `attribute-validate-profile` ([ca305f9](https://github.com/codsen/codsen/commit/ca305f95d72b8004d3eb9435926a51450120e7aa))
* new rule, `attribute-validate-prompt` ([af0e13b](https://github.com/codsen/codsen/commit/af0e13b69bba908bbac9823c9824a4c59293dea3))
* new rule, `attribute-validate-readonly` ([8236df7](https://github.com/codsen/codsen/commit/8236df7e9651265bdd408df55180c09cce147c03))
* new rule, `attribute-validate-rel` ([b6c8535](https://github.com/codsen/codsen/commit/b6c8535fc4789e77b605214ca8f5bf84dea7ee22))
* new rule, `attribute-validate-rev` ([5f65e9e](https://github.com/codsen/codsen/commit/5f65e9e720bd9afb88f10ed205866e426a383472))
* new rule, `attribute-validate-rows` ([b684a0c](https://github.com/codsen/codsen/commit/b684a0cc49e4299489623960549d1bc6bd71a99f))
* new rule, `attribute-validate-rowspan` ([4439516](https://github.com/codsen/codsen/commit/44395164c29b7250fab89ea22283a63aff7fb994))
* new rule, `attribute-validate-scheme` ([d7ac92b](https://github.com/codsen/codsen/commit/d7ac92b33e02ea7f3604607b2aa0879829ac5e06))
* new rule, `attribute-validate-scope` ([6734fc2](https://github.com/codsen/codsen/commit/6734fc2236dc32cac0dbf3946b58c255a2713226))
* new rule, `attribute-validate-scrolling` ([74cda0b](https://github.com/codsen/codsen/commit/74cda0bac73ca9d06b0d886040fdb98704a1f863))
* new rule, `attribute-validate-selected` ([c7158fc](https://github.com/codsen/codsen/commit/c7158fc76ce2be954e70278e85577650be5b79dd))
* new rule, `attribute-validate-shape` ([8698da3](https://github.com/codsen/codsen/commit/8698da37e22765f4f26e7f74519c7312f3bd06f1))
* new rule, `attribute-validate-size` and some rebasing ([8ce2917](https://github.com/codsen/codsen/commit/8ce2917a8141b8ea1418c306871f5111b466c506))
* new rule, `attribute-validate-span` ([ad090aa](https://github.com/codsen/codsen/commit/ad090aa5110850613cca51452ecff289eac6c505))
* new rule, `attribute-validate-src` ([f1fd152](https://github.com/codsen/codsen/commit/f1fd1522d76f156e4eaafdeb16e857db4f83939c))
* new rule, `attribute-validate-start` ([9b6a140](https://github.com/codsen/codsen/commit/9b6a1408ba874844825950e4ded917500c926eb5))
* new rule, `attribute-validate-style` (basic level) ([ee78bf8](https://github.com/codsen/codsen/commit/ee78bf87f3af29f619c2282f1af57c324f19114c))
* new rule, `attribute-validate-summary` ([86e82f6](https://github.com/codsen/codsen/commit/86e82f629536b0d896bc44d24edb929d2e8a6545))
* new rule, `attribute-validate-tabindex` ([329b164](https://github.com/codsen/codsen/commit/329b164fdc199ca6f9e83ae1e70941f0fbe473a7))
* new rule, `attribute-validate-target` ([72598b2](https://github.com/codsen/codsen/commit/72598b2e5855daf304b0ec6fc206317ba48983e1))
* new rule, `attribute-validate-text` ([0f3473b](https://github.com/codsen/codsen/commit/0f3473b9d250886256668688ea13b82f3652cc7a))
* new rule, `attribute-validate-title` ([1641207](https://github.com/codsen/codsen/commit/1641207685adc0985a9e100daa0f36a0be68e36f))
* new rule, `attribute-validate-type` ([5d05924](https://github.com/codsen/codsen/commit/5d059245d98919f4c2267ccab41a18579ea4cd1c))
* new rule, `attribute-validate-usemap` ([631fdc6](https://github.com/codsen/codsen/commit/631fdc635ec57b3b76c30e0c270ca7ed01836f33))
* new rule, `attribute-validate-valign` ([17dde3c](https://github.com/codsen/codsen/commit/17dde3ca5188aa69fbc1f621264bace39d7f06f6))
* new rule, `attribute-validate-value` ([7fbab3c](https://github.com/codsen/codsen/commit/7fbab3c8651943a9d7dfef463f4bb80740eed537))
* new rule, `attribute-validate-valuetype` ([da5ec0c](https://github.com/codsen/codsen/commit/da5ec0c11af3f9f141bdc291e222e09c68ca2bb1))
* new rule, `attribute-validate-version` ([a94b1bb](https://github.com/codsen/codsen/commit/a94b1bbb943d6e425e5a6ab996202dec6e8cdbf5))
* new rule, `attribute-validate-vlink` ([caeb67c](https://github.com/codsen/codsen/commit/caeb67caa24b162d76c55bb1c7471edf15b1d3e4))
* new rule, `attribute-validate-vspace` ([5abff0b](https://github.com/codsen/codsen/commit/5abff0b861d076c9a5a1fa0d69592a770a94ce80))
* new rule, `comment-conditional-nested` ([d44109e](https://github.com/codsen/codsen/commit/d44109e8d8b602f2a124655353043f3e2e42eb04))
* new rule, `comment-mismatching-pair` ([113bfa4](https://github.com/codsen/codsen/commit/113bfa451b3647280ef5541a7e9b8b09a18edaec))
* new rule, `media-malformed` ([e3731d1](https://github.com/codsen/codsen/commit/e3731d14b987d3e2ac9b4bf3f3b5efc8f34c67aa))
* new rule, `tag-bad-self-closing` ([905eae4](https://github.com/codsen/codsen/commit/905eae4f63580214bf6527d126af884a72c09c81))
* new rule, `tag-missing-opening` ([bc428eb](https://github.com/codsen/codsen/commit/bc428eba09d4945781f7d98ee8c96d244930cdc5))
* new rule, `tag-space-before-closing-bracket` ([15b8524](https://github.com/codsen/codsen/commit/15b85242185a07f7e95947c78439d29dc183b4cc))
* new rule, `tag-void-frontal-slash`; recognise HTML attr missing quotes (`attribute-malformed`) ([f232ece](https://github.com/codsen/codsen/commit/f232ece7f6c54873d37e0f47195219b54ea9b778))
* new rule, all - plus removing all listeners in the end of a program ([373656d](https://github.com/codsen/codsen/commit/373656db8b4ee8b65033901d1515bf4b2314ffba))
* new rule, attribute-malformed + new emitted event type, "attribute" ([c2978b9](https://github.com/codsen/codsen/commit/c2978b9ae79286e71c8e4bad8d5da1f486b9b461))
* new rule, attribute-validate-abbr ([5b4df20](https://github.com/codsen/codsen/commit/5b4df20aa1ded57719c72785e90b1f77b4d63cc8))
* new rule, attribute-validate-accept ([34a09ca](https://github.com/codsen/codsen/commit/34a09cae03cfa1306392dec8f27d28bbd7649283))
* new rule, attribute-validate-accept-charset ([90d3ae8](https://github.com/codsen/codsen/commit/90d3ae8f4c8e641ca7cefb554692a8c4e690d35c))
* new rule, attribute-validate-accesskey ([315b3a4](https://github.com/codsen/codsen/commit/315b3a45f274e5adb12ecc8f107e5b1a9ba17390))
* new rule, attribute-validate-action ([c032a14](https://github.com/codsen/codsen/commit/c032a14bf82ce0a374a80298e565af947e01c912))
* new rule, attribute-validate-align ([33807b3](https://github.com/codsen/codsen/commit/33807b32bb7f1ed15fb90dd4f80a073bb4e12736))
* new rule, attribute-validate-alink ([70923b3](https://github.com/codsen/codsen/commit/70923b3a18d731f137103737e27295adf9e51b7a))
* new rule, attribute-validate-border + some housekeeping ([2afe70b](https://github.com/codsen/codsen/commit/2afe70b54f3d0ead412ef2d078c2aa67a393209c))
* new rule, attribute-validate-width ([64b9c43](https://github.com/codsen/codsen/commit/64b9c43ec8c7f53f86bdca2b905ca8065cf7d1a7))
* new rule, bad-character-replacement-character ([877991a](https://github.com/codsen/codsen/commit/877991aa94b1d0edbb39be4cfc50c09416c4b957))
* new rule, bad-named-html-entity-malformed-nbsp ([c54f271](https://github.com/codsen/codsen/commit/c54f27156d80db415a3fadb7eb94ae4dd1516f14))
* new rule, bad-named-html-entity-unrecognised ([d7efa58](https://github.com/codsen/codsen/commit/d7efa58f68f122e1d2481c500fc9a26299f019b1))
* new rule, character-encode ([898a9d1](https://github.com/codsen/codsen/commit/898a9d11788708a17d6e7454a9596773fe9f3297))
* new rule, character-unspaced-punctuation ([ee6c5d6](https://github.com/codsen/codsen/commit/ee6c5d6f7a05c21eb64a84953869f356a6853d63))
* new rule, tag-bold ([3acffd8](https://github.com/codsen/codsen/commit/3acffd8c663903c912cc5cf7e6ab609794232dad))
* new rule, tag-is-present ([d290b4f](https://github.com/codsen/codsen/commit/d290b4f9e04c94c393b03133eeae243391f70ad1))
* new rule, tag-name-case ([2978a8a](https://github.com/codsen/codsen/commit/2978a8a329432ce51598f6a3bcc923fb7de40b23))
* new rules tag-void-slash and tag-closing-backslash ([fcdd912](https://github.com/codsen/codsen/commit/fcdd912dbf3d5901de122985b6975fea89dac78d))
* new rules, `attribute-validate-frame` and `attribute-validate-rules` ([1d6fa58](https://github.com/codsen/codsen/commit/1d6fa585e983a1e64c038664650cf2a91f94f97b))
* new rules, `attribute-validate-onclick` and `attribute-validate-ondblclick` ([a44298a](https://github.com/codsen/codsen/commit/a44298a096990e6fa3a291d979de16bed285f656))
* new rules, `comment-only-closing-malformed` & `comment-only-opening-malformed` ([3b24d99](https://github.com/codsen/codsen/commit/3b24d99f11893842a50a0fed5ddf639d0b9c7199))
* parent tag validation for attributes ([4d58500](https://github.com/codsen/codsen/commit/4d585002e6ae6e5270acc95eca141a6f535f33a3))
* put names on the most common entities in error description ([ece198f](https://github.com/codsen/codsen/commit/ece198ff331f49341bcbd20413baf49769902297))
* recognise broken html simple closing comments with missing dashes ([0bf5c3c](https://github.com/codsen/codsen/commit/0bf5c3cf72129af0b4558e458824cfe8ba322623))
* recognise email-unfriendly named HTML entities and suggest fixes ([55dfe74](https://github.com/codsen/codsen/commit/55dfe7403fc8c8fb9aab641a61618cf0dbf2530e))
* recognise errors on the opening "only"-kind comment tag endings ([88f7864](https://github.com/codsen/codsen/commit/88f7864834139d0f61d48bde5e6cdeccd3fd8dfc))
* Recognise escaped quotes within JS code within script tags ([fcffdfb](https://github.com/codsen/codsen/commit/fcffdfb9ec043116ff08502960da6a74666172ed))
* Recognise ESP tags within HTML tags ([c2554b6](https://github.com/codsen/codsen/commit/c2554b6d2899ca99b8505ec9e74ce82dedbe1d0e))
* recognise IE attribute in `attribute-validate-http-equiv` ([71532d1](https://github.com/codsen/codsen/commit/71532d164cf76403c0e83ac237224e4462bb02bb))
* recognise more broken closing comment tag cases ([44fc6e9](https://github.com/codsen/codsen/commit/44fc6e959ebb0c1e8d8460660e946a77fd98bef7))
* Recognise script tags ([6052b3b](https://github.com/codsen/codsen/commit/6052b3b09241510104d6206d91e801e351fcf3f8))
* Recognise single character ESP closing tag endings ([57277e2](https://github.com/codsen/codsen/commit/57277e2c67426a66fd0f9fb77f30753e28b665ae))
* recognise tags with no attributes and with missing closing bracket ([4cef902](https://github.com/codsen/codsen/commit/4cef9026a37cd60c87e646bb12914dcf44904763))
* recognise wrong brackets in comment tags (both closing and opening) ([d7e1686](https://github.com/codsen/codsen/commit/d7e1686e3de86f8c0a1e95da887c8f6bcd9cbc80))
* rename and beef up rule: bad-character-tabulation ([e9c287d](https://github.com/codsen/codsen/commit/e9c287da88de60c8c88922f2277f08717bd97ede))
* res.applicableRules - reports what rules could be applicable for given input ([0397bef](https://github.com/codsen/codsen/commit/0397bef4bfbe30ff6524be1198ed78790376a484))
* rewrite in TS ([ff28b11](https://github.com/codsen/codsen/commit/ff28b11637f3968c898df58ddab8e68b9ff81a16))
* Rudimentary protection against CSS false positive display:block ([5a43c76](https://github.com/codsen/codsen/commit/5a43c7699c418f250e87e75a90fdc494ca31d816))
* Rule bad-character-grave-accent ([3564a95](https://github.com/codsen/codsen/commit/3564a95bc3c064ee70368d9cd0a463b0b8c29539))
* Rule bad-character-unencoded-non-breaking-space ([240ca35](https://github.com/codsen/codsen/commit/240ca35480d0eefb9400cc3e295e3b28e07585e9))
* Rule bad-character-zero-width-space and some whitespace control tweaks ([2dc5d2a](https://github.com/codsen/codsen/commit/2dc5d2aabc95b94157cafc2b0455650d3fc5c7c5))
* Rule esp-line-break-within-templating-tag ([e2b43b5](https://github.com/codsen/codsen/commit/e2b43b5980c4ffcccd470c2d2825d161bb07e775))
* Rule tag-attribute-closing-quotation-mark-missing ([9d7ff86](https://github.com/codsen/codsen/commit/9d7ff86b84744e502ec9d2da90db80262695a718))
* Rule tag-attribute-missing-equal ([156a190](https://github.com/codsen/codsen/commit/156a190d672c683c106c153ffc58867c916afd91))
* Rule tag-attribute-repeated-equal ([8c675fd](https://github.com/codsen/codsen/commit/8c675fdb6f25a2fdfed03787911bd31166e18f32))
* Rule tag-duplicate-closing-slash ([0433110](https://github.com/codsen/codsen/commit/0433110de28e4d1657ca0661c795ee47471d7c5a))
* Rule tag-generic-error ([9987a03](https://github.com/codsen/codsen/commit/9987a03f7af00a7aacc959ff29475fd507e14225))
* Rule tag-missing-closing-bracket ([903be6f](https://github.com/codsen/codsen/commit/903be6f737983e8abf253b20f3d93159fde89df1))
* rule tag-name-case - doctype and cdata wrong case (being not uppercase) ([71d7aec](https://github.com/codsen/codsen/commit/71d7aec8df1b3dae3daa95eab9ffd522da9db517))
* Rule tag-whitespace-tags-closing-slash-and-bracket ([9cbf0cb](https://github.com/codsen/codsen/commit/9cbf0cb61caa0bd2a246c52bc993ecb092bedc80))
* Rules *-double-quotation-mark ([a11f119](https://github.com/codsen/codsen/commit/a11f119e12debb36f50e4cd07b0dd45fc69b4510))
* rules `attribute-validate-class`/`id`, detect duplicate `class`/`id` names ([4125ac5](https://github.com/codsen/codsen/commit/4125ac51f235c60bcc40fdd1b1c77b544902b9db))
* Rules bad-cdata-whitespace and bad-cdata-tag-character-case ([55bf417](https://github.com/codsen/codsen/commit/55bf41733187c944123218cd9f6fb62b8c1616fc))
* Rules bad-character-line-separator, bad-character-unencoded-non-breaking-space and bad-character-zero-width-space ([17e592d](https://github.com/codsen/codsen/commit/17e592d347bf7855aae1f139b936195443ce8e06))
* Rules combo: missing closing quotes and whitespace between slash and bracket ([c6e816a](https://github.com/codsen/codsen/commit/c6e816a75c11aaacac63618140fcc169b7840ed5))
* Rules esp-more-closing-parentheses-than-opening & esp-more-opening-parentheses-than-closing ([daf1f4b](https://github.com/codsen/codsen/commit/daf1f4bd380a972bb4d0e4bb32dfdd2675288a80))
* Rules file-mixed-line-endings-file-is-*-mainly to cater mixed EOL files with no opts for EOL ([98997d9](https://github.com/codsen/codsen/commit/98997d9ca9e25bb49347fb3c059b3ec69507aae3))
* Rules tag-attribute-*-single-quotation-mark ([e75269f](https://github.com/codsen/codsen/commit/e75269fcedf122a6f9792f881fa610c9c9ef8485))
* Rules tag-attribute-mismatching-quotes-is-* ([78e9ffa](https://github.com/codsen/codsen/commit/78e9ffa673e51b23289579e33d04323737bfcd8e))
* Rules tag-attribute-missing-equal and tag-attribute-opening-quotation-mark-missing ([f787671](https://github.com/codsen/codsen/commit/f78767125849006da9351eab751192c76af4894b))
* Rules tag-attribute-quote-and-onwards-missing and tag-generic-error ([1f11bd5](https://github.com/codsen/codsen/commit/1f11bd543a4bb22ac3f5142f2decd23791e672bd))
* Rules tag-missing-space-before-attribute and tag-stray-quotes ([4c55606](https://github.com/codsen/codsen/commit/4c55606ef5e1977dea94bfc47c0cb086833d850a))
* Rules to flag up and delete all Unicode C1 group control characters ([8209457](https://github.com/codsen/codsen/commit/8209457ec0809dc933745d3f4194970f7670ba9e))
* Rules: attribute-space-between-equals-and-opening-quotes and tag-excessive-whitespace-inside-tag ([347da30](https://github.com/codsen/codsen/commit/347da30c29f07b55264c651a94af1f007621ce2e))
* separate relative URI checking into a standalone package and then tap it ([19acf30](https://github.com/codsen/codsen/commit/19acf30f34d3288bf8a889d439ace94af610225d))
* set up broken named html entity rules ([f1a1478](https://github.com/codsen/codsen/commit/f1a1478e41a7f170904b74e9fa41ecf32485a7e5))
* set up the tag-level processing, add the first character-level rule ([0ed94ce](https://github.com/codsen/codsen/commit/0ed94ce72417744d27f7fad3dbba2734f121f76b))
* show all permitted values in error messages instead of complaining about wrong value ([b2deb48](https://github.com/codsen/codsen/commit/b2deb48ca6ae56aefee65b1dd5e320c1fbeab9d7))
* Split off character-based rules because there are too many ([e0ea950](https://github.com/codsen/codsen/commit/e0ea950a5a82e70e3c8596159aa34cb57591f99e))
* switch to codsen-parser ([228f539](https://github.com/codsen/codsen/commit/228f539d53820734d0dcca8dbc58ec36e0be468e))
* tap `string-find-malformed` and implement the broken simple opening comment search ([ac576f3](https://github.com/codsen/codsen/commit/ac576f346b0c591acc5725fb97e913ecc3c8f6db))
* tap the new codsen-tokenizer's API where it pings the characters, remove character emits here ([f48bc61](https://github.com/codsen/codsen/commit/f48bc61818ecd6ad35c1f76a3fee6beb2a3a7638))
* tweaks to `comment-mismatching-pair` to mind malformed closing tags to prevent fixes clashes ([f820ed3](https://github.com/codsen/codsen/commit/f820ed3b400e99dc8bf4b6e9262b8194327070cd))
* two more character rules ([821ed04](https://github.com/codsen/codsen/commit/821ed04b0a09146173fc87826cfd14ddd731e804))
* update config on tap to consume all grouped rules ([43300d5](https://github.com/codsen/codsen/commit/43300d5481fb6ccc0e626ec5631d75e412a4bb45))
* update the deps ([0780fd2](https://github.com/codsen/codsen/commit/0780fd21e8ddd9838137b17e4e224dfe1701ac01))
* update to the latest tokenizer, improve attribute-* rules ([390a37d](https://github.com/codsen/codsen/commit/390a37d7164677dcca21ae2a392ff020ba812e10))
* when character outside ASCII is encoded, email-pattern encoding is considered ([f8ee392](https://github.com/codsen/codsen/commit/f8ee39221a97b4db4fa5f51881e8b7992df46f7d))
* WIP - 1 failing ([60197e6](https://github.com/codsen/codsen/commit/60197e6f0c8bc12d75cf050594b9e79264101e2b))
* WIP - 10 failing ([109a101](https://github.com/codsen/codsen/commit/109a101b69c1ff47118cfa5faca888b16158ac34))
* WIP - 12 failing ([0be30ff](https://github.com/codsen/codsen/commit/0be30ff241175585839df312e397f97aa3fb7775))
* WIP - 12 failing ([56d6a72](https://github.com/codsen/codsen/commit/56d6a724ce70b0529a8edc18a5661b4f3bd9b742))
* WIP - 14 failing ([3abbdab](https://github.com/codsen/codsen/commit/3abbdabeaa22f8e02abcfb8473d85b2333f4e0d1))
* WIP - 19 failing ([0b9135d](https://github.com/codsen/codsen/commit/0b9135dc2475632504a9efa04fd8b078c8d742cf))
* WIP - 19 failing - before rewriting missing closing attr quotes ([08cb40d](https://github.com/codsen/codsen/commit/08cb40d4350904c50c0f32decc33d8f5c1570ae0))
* WIP - 2 failing ([71c273c](https://github.com/codsen/codsen/commit/71c273ce8ad55b38e902403c252740c1a088e810))
* WIP - 20 failing ([363d77e](https://github.com/codsen/codsen/commit/363d77eb8087b013fea57ee0bae5971c46108bfa))
* WIP - 21 failing ([0ff2277](https://github.com/codsen/codsen/commit/0ff22776618717259c895e2b9e6d8f9dc497a73b))
* WIP - 21 failing ([cd544cf](https://github.com/codsen/codsen/commit/cd544cf5ff85e442b39d429703071df7aedc8347))
* WIP - 22 failing ([93b0149](https://github.com/codsen/codsen/commit/93b01494da9c0522a08fc7f95d38a209f35d33d6))
* WIP - 4 failing ([8294218](https://github.com/codsen/codsen/commit/8294218e06de40bfe5b70a612a7cb862025a384f))
* WIP - 4 failing ([bab1d1a](https://github.com/codsen/codsen/commit/bab1d1ab3a88457d8c34a08e319a784bd176520b))
* WIP - 4 failing ([0c46b21](https://github.com/codsen/codsen/commit/0c46b21369081eda66eb0ce0f772e2193671054c))
* WIP - 45 failing ([baf4a67](https://github.com/codsen/codsen/commit/baf4a67101ddf64e4e98dc111b3db83f0452674a))
* WIP - 5 failing ([b19fce3](https://github.com/codsen/codsen/commit/b19fce369a617a6eb872ddf89d5c5688a308e675))
* WIP - 6 failing ([55057ac](https://github.com/codsen/codsen/commit/55057ac6c4316909b02d5feb4bcff6ded4621d1f))
* WIP - 8 failing ([c83bc6f](https://github.com/codsen/codsen/commit/c83bc6f095d5eedeb27f1ee7f78f1e2cae063d80))
* WIP - 8 failing ([84f3219](https://github.com/codsen/codsen/commit/84f3219991cb78eb0ce33e596c8cff2086edd986))
* WIP - 9 failing - only Both Quotes Missing rules failing ([89ac1e8](https://github.com/codsen/codsen/commit/89ac1e874e916953b48aff4cda7ddc816e7210d4))
* WIP - all rogue CDATA cases done, only  legit, escaped left ([ad4b8ce](https://github.com/codsen/codsen/commit/ad4b8ce744c48edad308c4bbef9ac3abff661a90))
* WIP - CDATA recognition improvements ([dd26710](https://github.com/codsen/codsen/commit/dd267100f59d78cc0176c3a895ea525967d92a34))
* WIP - Fix all CDATA opening tests to pass ([6462b30](https://github.com/codsen/codsen/commit/6462b30ad1b079876851f497e005633e516c2f11))
* WIP - left side of CDATA rogue characters done, right side left ([65b5754](https://github.com/codsen/codsen/commit/65b57544ad8884079c4dc7a532b477029d840d4b))
* WIP - withinTagInnerspace() recoding, R1 & R2 clauses done ([6efc53c](https://github.com/codsen/codsen/commit/6efc53ca23ff473ac8235b3fdd315e83ace65392))
* WIP - withinTagInnerspace() recoding, two tests pass ([141e9f8](https://github.com/codsen/codsen/commit/141e9f81612ba1088936f89b6b63fb25c4f34e35))
* Wired up basic unit test cases for rule file-mixed-line-endings ([191dd48](https://github.com/codsen/codsen/commit/191dd48e4bf90adb2b2852d0955c3473bc1a99dd))


### BREAKING CHANGES

* rewrite in observer pattern
* Second input argument, progressFn, was moved into opts.progressFn and opts was
placed into second input argument instead





## 3.0.0 (2020-11-28)

Accidental version bump during migration to sourcehut. Sorry about that.

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
