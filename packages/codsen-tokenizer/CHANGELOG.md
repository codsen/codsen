# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# 5.0.0 (2021-01-23)


### Bug Fixes

* a donothing skip was missing ([6d24053](https://github.com/codsen/codsen/commit/6d24053c7016e6373eb28dafd8541a93967e2259))
* add all h* tags to recognised list, fix the digit from being skipped ([0bcbd12](https://github.com/codsen/codsen/commit/0bcbd12ae173a496b9fff508a52721d02023ee2e))
* add checks and prevent throwing in certain unfinished code cases ([a4aa237](https://github.com/codsen/codsen/commit/a4aa237d1e26f246537a1cf692b3922702c8c32b))
* add missing value, token.recognised on the broken tags ([162b508](https://github.com/codsen/codsen/commit/162b508c069a9439b73efdb5c4200e66c01c188a))
* correct the incomplete simple opening HTML tag token ([a48237f](https://github.com/codsen/codsen/commit/a48237f55e12f0894418dd0308627b13d7b99d46))
* don't ping last undefined character to charCb ([cff38f9](https://github.com/codsen/codsen/commit/cff38f9fe68a83b7e78af397e1fcb9996571c548))
* false positive - repeated percentage within attribute's value pretending to be an ESP tag ([5d65190](https://github.com/codsen/codsen/commit/5d65190f738ee07f7a72275a18976213f06ee573))
* fix "rule" type node "left" key when it is preceded by at-rule ([be9de1c](https://github.com/codsen/codsen/commit/be9de1cdcac1212a48668703f6c9a1296f6e73d4))
* fix a case of unfinished css style blocks ([c1da29c](https://github.com/codsen/codsen/commit/c1da29cde33e4b9ef986b9f1fec5a42855cdf51b)), closes [#2](https://github.com/codsen/codsen/issues/2)
* fix correct opening simple HTML comment ranges ([8a1bb25](https://github.com/codsen/codsen/commit/8a1bb25e212d9556f0ff6410c515f44b42a02a97))
* fix score calculation ([128a969](https://github.com/codsen/codsen/commit/128a9690aaad12bc11e3db97bf7ce324648f6734))
* html empty attributes logic fix ([9eff0e2](https://github.com/codsen/codsen/commit/9eff0e240c4cc9aabf04c9d7a54976d149134229))
* improve void tag detection by moving calculation to where tag name is calculated ([f151b73](https://github.com/codsen/codsen/commit/f151b730240714b780140d874d2d66cf91083a62))
* make all tests pass ([5858182](https://github.com/codsen/codsen/commit/5858182058f74a9bd09ae5a0aecf36997e8430c8))
* more fixes for `attribs[].attribValue[]` ([b7af8f2](https://github.com/codsen/codsen/commit/b7af8f215c4986a98002c2973b4411bf4eb3984e))
* recognise "only"-kind closing tails with simple comment tails preceding ([089a3cc](https://github.com/codsen/codsen/commit/089a3cc4aa0334ffc6bd1f1ded80ccdb175b1825))
* recognise repeated opening brackets in comment tags ([771254f](https://github.com/codsen/codsen/commit/771254fb5e1aeaac040fffe024fdaa8024273b70))
* recognise rgb() with empty brackets as value of an attr ([869a6a2](https://github.com/codsen/codsen/commit/869a6a22346fbe8b51a68dad3b1bd9b0b15b4e44))
* recognise rule chunks without curly braces (very likely broken) ([694fff2](https://github.com/codsen/codsen/commit/694fff2bc45843fb5f1c1f17fdcc62e6a802c832))
* report doctype as recognised ([dd90574](https://github.com/codsen/codsen/commit/dd905743b471c12eaa87bb20edcbc5266d184c40))
* second part of newly-added layer quotes - removing them ([33453fe](https://github.com/codsen/codsen/commit/33453fe40c36d569d1ebb833d81588a7cab15fe6))
* set tag key `pureHTML` correctly ([9488e73](https://github.com/codsen/codsen/commit/9488e7316785517cbb1114ca260bd4250cb80972))
* set the extracted selector's value to be trimmed in the end too ([6823566](https://github.com/codsen/codsen/commit/6823566424b5219f0c443c8b49b602d20e4a7fc6))
* set XML closing tag kind ([6e8d874](https://github.com/codsen/codsen/commit/6e8d874a3d22536ea266ba5431ae5be2d4f21587))
* turn off styleStarts ([1d771d5](https://github.com/codsen/codsen/commit/1d771d5b78f9324bce50ca038932cbd4a405eafb))
* tweak types ([f5451cf](https://github.com/codsen/codsen/commit/f5451cfa2b3a69c852ffcf371f86a2e8ac8beeaa))
* whole attribute's value can't be an opening or closing ESP lump ([81c9830](https://github.com/codsen/codsen/commit/81c9830484f0da95f3de6cce5cc41bfa13ae74f0))


### Features

* "rule" token type ([df48c2b](https://github.com/codsen/codsen/commit/df48c2bf8dc60d565db6a1610804ca8847eba716))
* `opts.tagCbLookahead` and `opts.charCbLookahead` ([aca457a](https://github.com/codsen/codsen/commit/aca457a17346d699a0bc97cd6878ce94f0101260))
* add another lump blacklist pattern ([ded482c](https://github.com/codsen/codsen/commit/ded482c47fd411d96baa5f2ca12e5942bdca1f5f))
* add attribs[].attribLeft to HTML tokens ([e0d8069](https://github.com/codsen/codsen/commit/e0d8069dc5d53a7225e357a713a2c5d95b4848f0))
* add concept of lefty and righty characters to improve recognition ([8b1e64b](https://github.com/codsen/codsen/commit/8b1e64b9fee289e7b88891093b81293bc100d111))
* add recognised attribute flag, "attribNameRecognised" ([f159bd3](https://github.com/codsen/codsen/commit/f159bd3b2d54a37f003bcb041391afbabb8c844f))
* add token.left key to rule-type tokens ([1e865e0](https://github.com/codsen/codsen/commit/1e865e08dce387f4007a9920f4e5228edc8f2d3e))
* add token.value ([9f1d178](https://github.com/codsen/codsen/commit/9f1d178b1286ce5e2253f66d67b08ce94895e439))
* algorithm improvements and more tests ([c819bd1](https://github.com/codsen/codsen/commit/c819bd15eacc9659ef825954da79f0d209861569))
* algorithm improvements and some housekeeping ([64e9f65](https://github.com/codsen/codsen/commit/64e9f65f4de5ed5ba47968ef7863e5d2b2f6bc93))
* algorithm improvements, especially around esp literals ([05be0e9](https://github.com/codsen/codsen/commit/05be0e999766c83ef4422b03a69f12d805442440))
* allow spaces between comment tokens ([0485953](https://github.com/codsen/codsen/commit/0485953ba53ef5a7a208f6d3e2ac60a27fe98add))
* better inline css recognition ([a3254fa](https://github.com/codsen/codsen/commit/a3254fa66f2ec703279759d4d90ab8491c71bc9a))
* better recognition of rogue characters around inline css rules ([abb57e8](https://github.com/codsen/codsen/commit/abb57e8e4aa5d92ca985fd5bddd7ab3e649380e7))
* better regognition of a sequence of inline styles ([522596e](https://github.com/codsen/codsen/commit/522596eaaa76876114c252659b4e65aa3a256be0))
* broken ESP tag recognition improvements ([a29c51d](https://github.com/codsen/codsen/commit/a29c51db66015bb0cdb13c81079a5bf00b8815c3))
* character callback ([f10d166](https://github.com/codsen/codsen/commit/f10d166ad436bf58bdd0fe801dfd2d79c364f7f2))
* complete the correction for missing closing of an attribute ([ad398cc](https://github.com/codsen/codsen/commit/ad398cc421ff487f2b82ac5a815289b2829dce73))
* css comments in head styles ([675c3c8](https://github.com/codsen/codsen/commit/675c3c8ddf5d1846fdf9b7bf893b11d30f2b618e))
* css token type ([90aad6d](https://github.com/codsen/codsen/commit/90aad6d55fc2962ed1331e9382ed29d4deb4e5ab))
* detect opening "if" kind comments without opening square bracket ([65d15f0](https://github.com/codsen/codsen/commit/65d15f08a0a31528cb433753caf42ce3bf70c886))
* detect when HTML attribute's equal is missing and there's whitespace instead ([47fd115](https://github.com/codsen/codsen/commit/47fd1155587aa98a62b6cb7cca2eb719a0898458))
* doctype and xml recognition ([eb97cef](https://github.com/codsen/codsen/commit/eb97cef31d157a5d103ca923b9ad01b92fd7f81b))
* don't end esp token as easily, ensure it's closed using a character from estimated tails ([717eaaa](https://github.com/codsen/codsen/commit/717eaaa8cd4f7692dd72e6cd2413bcc953a58f81))
* dRY the property pushing, add more tests ([e5cfee4](https://github.com/codsen/codsen/commit/e5cfee4920d6c8aef2008c281b28a1d7aa5e7433))
* eSP tag recognition improvements ([b30a2f4](https://github.com/codsen/codsen/commit/b30a2f497e96774b9d4ffb498a766d4ccf5c456d))
* esp tags can come as attributes or be among attribute value tokens ([b227a13](https://github.com/codsen/codsen/commit/b227a138c1ed9ae5c2932aaf8ff8d96f6cc51d98))
* extend loop range until length + 1 ([142293b](https://github.com/codsen/codsen/commit/142293b6ec0a889d95f4426b768c94fc44b5d1f8))
* extract new packages `is-char-suitable-for-html-attr-name` and `is-html-attribute-closing` ([e07ff80](https://github.com/codsen/codsen/commit/e07ff8058c4d525c1cc37b5127fba2ff04521d8c))
* further improvements to attribute value recognition ([80adc12](https://github.com/codsen/codsen/commit/80adc123104319b1f707ad6c9887e37202455d0e))
* head CSS style properties ([5abea15](https://github.com/codsen/codsen/commit/5abea157d29323dfd3c5d82352471041a9b33ca5))
* heuristic esp tag recognition ([9941619](https://github.com/codsen/codsen/commit/9941619a0a9db55f348ff53d975c28037258ff84))
* html inline css style comments ([15e96ff](https://github.com/codsen/codsen/commit/15e96ffb3ea21efec11f180adbe954298ee88109))
* html tag attribute recognition ([e6ae7e5](https://github.com/codsen/codsen/commit/e6ae7e55263a2e24a2462e5faed5a0dfc4b150c4))
* improve ESP tag recognition, add more tests and make existing ones more precise ([71eb415](https://github.com/codsen/codsen/commit/71eb415d745b180588d916f06c7d333175e8551d))
* improve head CSS parent rule selector recognition ([f737ecb](https://github.com/codsen/codsen/commit/f737ecb2afbaed1f9f7ff58d87a1242191057f19))
* improve inline css and head css recognition ([2d01bfe](https://github.com/codsen/codsen/commit/2d01bfe175ffc496c581a8cfe220979911173eec))
* improve the recognition of equal chars in uri's ([a814f69](https://github.com/codsen/codsen/commit/a814f696b3e69f57637902e508d9449c550ac9bd))
* improve the recognition to "not" kind conditional opening without closing bracket ([b59b3b0](https://github.com/codsen/codsen/commit/b59b3b0444c07c5d6ea157feb67474ea4e718939))
* improve the templating tag detection, exclude double parentheses better ([beb696f](https://github.com/codsen/codsen/commit/beb696f7cf4f495cb34893c986421c1259c12332))
* improved broken cdata and doctype recognition ([2915a9c](https://github.com/codsen/codsen/commit/2915a9c8d9763653b34d6bef8f3337ddc54fa391))
* improved inline css style recognition: comments, whitespace, properties - WIP ([1a117d3](https://github.com/codsen/codsen/commit/1a117d317a2aee36d5c12b7cab87833a3318bc2d))
* improvements to abruptly ended chunk recognition ([d2dfd9c](https://github.com/codsen/codsen/commit/d2dfd9c2edbbf66fc4822d310e5c0836c3993596))
* improvements to cdata tag recognition ([db7ae56](https://github.com/codsen/codsen/commit/db7ae561b47478a257428df58171ef474875ce66))
* improvements to esp tag recognition ([1e66ea7](https://github.com/codsen/codsen/commit/1e66ea73cb0a0de4a73ff45055756f86d706e62b))
* improvements to esp tag recognition + some rebasing around esp tag extraction ([4e641d5](https://github.com/codsen/codsen/commit/4e641d58d30bf7e4b01dd31d4c5008f3f822ed63))
* improvements to ESP tag recognition algorithm ([32f57ba](https://github.com/codsen/codsen/commit/32f57ba82fd0aea2a8f852a61137a458b3c16523))
* improvements to missing semicol between two properties ([5658e4a](https://github.com/codsen/codsen/commit/5658e4aa3aea708fe470e195d56970b4fe42bf18))
* improvements to startsComment detection function from util ([d7a5a2b](https://github.com/codsen/codsen/commit/d7a5a2b098d9a2e7779a72b2bb1eb3be5921df11))
* improvements to the broken attribute recognition algorithm ([b8336ef](https://github.com/codsen/codsen/commit/b8336efb69aa6c0d2074c9d8f754f4d605f183be))
* improvements to the ESP tag recognition ([43c472e](https://github.com/codsen/codsen/commit/43c472ed667fd97262e9d941dd83e5feae8877e0))
* improvements to unclosed tag recognition ([ebb0836](https://github.com/codsen/codsen/commit/ebb08367bc320df7a6670764f83cbed8ebcf5d57))
* include more erroneous comment tag cases to be recognised ([54d1f16](https://github.com/codsen/codsen/commit/54d1f16cee8e379aa9345343ed8915a2c9b16dc7))
* init ([6d210e2](https://github.com/codsen/codsen/commit/6d210e290566570921d1b1a719a58a54602c755f))
* missing HTML closing bracket ([ca86758](https://github.com/codsen/codsen/commit/ca86758f6133325cd01e71eae481bf913a854f05))
* move lookahead contents from baked into node to separate input argument ([9df0f3f](https://github.com/codsen/codsen/commit/9df0f3f80dac0e6622725564088839f65aad9317))
* new comment kind, simplet (`<!-->`) ([5eed737](https://github.com/codsen/codsen/commit/5eed737bb21b98ff358aea32ebf892f1c1a3f686))
* new html tag kind - inline ([508aaae](https://github.com/codsen/codsen/commit/508aaae26bd41a334dba8a04107f4ecb5b5a0d2a))
* opts.reportProgressFunc ([d553598](https://github.com/codsen/codsen/commit/d553598c94f72999e624cfde2e736d2a186a2a32))
* proper "at" and "rule" token nesting ([971eeeb](https://github.com/codsen/codsen/commit/971eeeb8e39470e10c8d9ecf8810bd1437386db9))
* recognise a missing semicol between two properties in css ([ac69d25](https://github.com/codsen/codsen/commit/ac69d250c6a0e53996a9d9d15b8c1be1b305bc10))
* recognise attribute values not wrapped in quotes ([f9df444](https://github.com/codsen/codsen/commit/f9df4442383e4b0befd78cf78304db4d27de3d84))
* recognise attributes with certain curly quotes ([ea6a5da](https://github.com/codsen/codsen/commit/ea6a5da0778a59861be4fe1966d8dd0628f795ba))
* recognise broken pattern "attribute name - equal - attribute name - equal" ([437669a](https://github.com/codsen/codsen/commit/437669a6ee308f2c65f40ec3e0c1ba66ef105963))
* recognise conditional "evewyehere except" comments (type="comment", kind="not") ([84369f8](https://github.com/codsen/codsen/commit/84369f8636c1629e32dc366a33443cbf638ece09))
* recognise conditional comment tags with wrong brackets ([9ae70c3](https://github.com/codsen/codsen/commit/9ae70c3955683d6e21238ef12d975415fbe6306f))
* recognise conditional comments (both kinds) without brackets as long as mso exists ([70cf595](https://github.com/codsen/codsen/commit/70cf595ff224a98e88b8cba81a689d5ae31a8be8))
* recognise content within quotes ([d9079bd](https://github.com/codsen/codsen/commit/d9079bd34838c9b591bcfefaf504bfcb70124a6e))
* recognise double-wrapped attribute values ([cbad701](https://github.com/codsen/codsen/commit/cbad7019df5652aa61f73ca2a281e46aa354e524))
* recognise erroneous inline css comments with slash-slash ([d828775](https://github.com/codsen/codsen/commit/d828775122a3eb2ed8c3b641efcd10b617e5210a))
* recognise expanded notation outlook conditional kind="not" comments ([8aadc19](https://github.com/codsen/codsen/commit/8aadc19d06640703adf5407564b38f8a5c11922c))
* recognise HTML attributes with mismatching quotes and missing equal ([e3d54c0](https://github.com/codsen/codsen/commit/e3d54c0650b1a9869db530fb3e01c56d8b0d4575))
* recognise JSP (Java Server Pages) ([93f1ebd](https://github.com/codsen/codsen/commit/93f1ebd206b9678fd37638160d04bf05764534e5))
* recognise mismatching quotes around HTML attributes ([2d8b1fd](https://github.com/codsen/codsen/commit/2d8b1fd0a8325e5e7f14f51d288e654ef0a944b4))
* recognise missing closing quotes of attribute values ([adfabb0](https://github.com/codsen/codsen/commit/adfabb0390fdee4c8642e03b731dddf5114c48e9))
* recognise missing closing quotes on HTML attibutes ([f646ca6](https://github.com/codsen/codsen/commit/f646ca612b659ee2d5a23ea43a1d711200f79ec5))
* recognise missing opening brackets ([3069efc](https://github.com/codsen/codsen/commit/3069efce3fbf39bab9218c6041c29581aa4efed9))
* recognise missing opening quotes on HTML attributes ([560eef0](https://github.com/codsen/codsen/commit/560eef0addd96a213d8251dff5686540bceb4f29))
* recognise more broken tags and broken comment tags ([9ec0878](https://github.com/codsen/codsen/commit/9ec08781f2769c5fe0b6cb6ba99f323d6faea3f3))
* recognise outlook/ie conditional comments (kind "only", type "comment") ([cf610b2](https://github.com/codsen/codsen/commit/cf610b21da4ad8d674ea1664fbb3a9d57912c181))
* recognise quoteless attribute tag endings ([4a6d652](https://github.com/codsen/codsen/commit/4a6d65204adef8984a225c7b08b0066113c15863))
* recognise repeated opening quotes on HTML attributes ([62bc3f4](https://github.com/codsen/codsen/commit/62bc3f424b7534c58bcc53301687ad739b18d424))
* recognise rogue characters within inline css styles ([066a501](https://github.com/codsen/codsen/commit/066a50196d1e2058dad76c58c738d082b07793df))
* recognise rogue closing quotes in css ([48b46c3](https://github.com/codsen/codsen/commit/48b46c3d13c5f6f2a432f874506d8f00f6ef5f5f))
* recognise rogue extra closing curlies in CSS rules ([bfe5848](https://github.com/codsen/codsen/commit/bfe5848b01304a874f90675f1cd735793e20168f))
* recognise tags abruptly ended after tag name ([801cb76](https://github.com/codsen/codsen/commit/801cb7618da05cffdc486076b7d582b0fb0d1fc8))
* recognise unclosed/terminated ESP tags within tag attributes ([3826ef6](https://github.com/codsen/codsen/commit/3826ef62ea14b6fad8c3fc5aa801fa50d97924eb))
* recognised tags ([f5b8117](https://github.com/codsen/codsen/commit/f5b81179ce43bbffedadad12e7f412aa086bdd32))
* report tagName as lowercased, for consistency, ranges are still available ([a16f929](https://github.com/codsen/codsen/commit/a16f9292f8198d31bd51e9f15d3a8a23d9b9b084))
* report wrong case tag names as recognised (so that we can catch them later in emlint) ([f450a4e](https://github.com/codsen/codsen/commit/f450a4ed25729d84b152943099bfd32714f7df02))
* responsys RPL-like ESP tag recognition ([6bba17b](https://github.com/codsen/codsen/commit/6bba17b5a391b47d1a6df888f88f44c2c18571f9))
* rewrite in TS, start using named exports ([b41c644](https://github.com/codsen/codsen/commit/b41c644d15d3a8afa9021a27cfb1cef3e4fe8773))
* self-closing html tags ([65b62ed](https://github.com/codsen/codsen/commit/65b62ed7f46dbb48248921b3680b5d3823c5c881))
* simple comment tokens recognised both opening and closing ([bcdc12f](https://github.com/codsen/codsen/commit/bcdc12fba3e5d7ce0b609f56b40cc8f57a736007))
* single-layer at rules with nested whitespace (text) tokens ([342ab5a](https://github.com/codsen/codsen/commit/342ab5aa03d3425cf61eeeefe2b0bc930389d24d))
* split test groups into files and report tag name for html tokens ([5c31ae9](https://github.com/codsen/codsen/commit/5c31ae9604d21d92596e75b6087427754c73d175))
* support esp code nested in other types and uneven count of quotes there ([15c2ecd](https://github.com/codsen/codsen/commit/15c2ecd99ac50998e8d9092b14595f884e3c8945))
* support ESP tokens inside HTML tags - nest them among attributes ([e5cee8f](https://github.com/codsen/codsen/commit/e5cee8f03120e821f0a5c36d715fd4d8e011ee82))
* tap "is-html-tag-opening" to make algorithm more resilient ([9ae92a2](https://github.com/codsen/codsen/commit/9ae92a2e43dce5d5cf3728345b731a91a33f0434))
* tighten up opts input check types ([7360e72](https://github.com/codsen/codsen/commit/7360e72efc770ec6df05443f36696287643e9b54))
* void tags are determined evaluating tag's name, not presence of slash ([1104c11](https://github.com/codsen/codsen/commit/1104c1109ae474ee4eb59b268469251db4e401ec))


### BREAKING CHANGES

* previously you'd import a default: "import tokenizer from ..." - now, tap a named
export: "import { tokenizer } from ..."
* better inline css recognition
* options argument is now pushed by one place further





## 4.5.0 (2020-12-13)

### Bug Fixes

- add checks and prevent throwing in certain unfinished code cases ([aa63861](https://git.sr.ht/~royston/codsen/commit/aa6386199014d507725dfc64320ee09ddd708a1e))
- fix a case of unfinished css style blocks ([755ce98](https://git.sr.ht/~royston/codsen/commit/755ce982f0beee5602809840a9a07d093f74c0e3)), closes [#2](https://git.sr.ht/~royston/codsen/issues/2)

### Features

- improvements to abruptly ended chunk recognition ([1728753](https://git.sr.ht/~royston/codsen/commit/17287533a413206d212517912bf60373a58eb83a))

## 4.4.0 (2020-12-11)

### Features

- improve the recognition of equal chars in uri's ([8d041b7](https://git.sr.ht/~royston/codsen/commit/8d041b7a4d017fdc73ad8882d587cebc4714bae4))
- recognise attributes with certain curly quotes ([4e43cc7](https://git.sr.ht/~royston/codsen/commit/4e43cc708b944a8b1cad7416932b73b9a3ea84e2))

## 4.3.0 (2020-12-06)

### Features

- add another lump blacklist pattern ([6b3b87d](https://git.sr.ht/~royston/codsen/commit/6b3b87d631b3ca8b5e3bb97a8ca17585a83b2e46))

## 4.2.0 (2020-12-04)

### Features

- recognise JSP (Java Server Pages) ([68fa3c2](https://git.sr.ht/~royston/codsen/commit/68fa3c25cee47996126af3b6ea4bb0a88f3cb788))

## 4.1.0 (2020-12-03)

### Features

- add concept of lefty and righty characters to improve recognition ([dd4b8cb](https://git.sr.ht/~royston/codsen/commit/dd4b8cb66a1c49a9ceb9236c4f0b15cb175e4a7a))
- improve the templating tag detection, exclude double parentheses better ([724e827](https://git.sr.ht/~royston/codsen/commit/724e827724ff5efb44fe5d8363743e4d32fc2dae))

## 4.0.0 (2020-11-28)

Accidental version bump during migration to sourcehut. Sorry about that.

## 3.2.0 (2020-11-02)

### Features

- improve head CSS parent rule selector recognition ([d9373d8](https://gitlab.com/codsen/codsen/commit/d9373d80838f104b9dea00d27a3e0f2ed0c31923))

## 3.1.0 (2020-10-19)

### Features

- improve inline css and head css recognition ([e7a288c](https://gitlab.com/codsen/codsen/commit/e7a288cc6f67b2e202e8f56a296c28018eca7cca))

## 3.0.0 (2020-10-12)

### Features

- better inline css recognition ([b1b67b3](https://gitlab.com/codsen/codsen/commit/b1b67b371e75f628cf1d8e1d1f9fa8a1294108fc))
- better recognition of rogue characters around inline css rules ([3243b5c](https://gitlab.com/codsen/codsen/commit/3243b5cdfa7d7dd3c860d6e48337ad8ef20a3e32))
- better regognition of a sequence of inline styles ([de9b327](https://gitlab.com/codsen/codsen/commit/de9b3274cc3910ed5b9f56572ef9a710e353b67f))
- css comments in head styles ([a217543](https://gitlab.com/codsen/codsen/commit/a217543dbdb263886d8ac6e9b1d6efdc85598b8b))
- dRY the property pushing, add more tests ([e6ed023](https://gitlab.com/codsen/codsen/commit/e6ed0230e62b1219822a6a891e80d8a9205d67f5))
- head CSS style properties ([9128dcb](https://gitlab.com/codsen/codsen/commit/9128dcb028e0fc6fcedddedf4d09af3c6ebe5eac))
- html inline css style comments ([b2379e4](https://gitlab.com/codsen/codsen/commit/b2379e4699e25ed4397506c4704d32562f471052))
- improvements to missing semicol between two properties ([cdb3423](https://gitlab.com/codsen/codsen/commit/cdb3423430612c6a5a4f647e674e2c3b7a6c4a8c))
- new html tag kind - inline ([a5f8b94](https://gitlab.com/codsen/codsen/commit/a5f8b9480f45e5774d7c528f63f6cb37487e2c44))
- recognise a missing semicol between two properties in css ([a8ef72a](https://gitlab.com/codsen/codsen/commit/a8ef72a9bde83ad21178d6259ec9105514eff658))
- recognise double-wrapped attribute values ([08e8dc6](https://gitlab.com/codsen/codsen/commit/08e8dc64c4b2b297030ebce75e4d12a3fb4fadef))
- recognise erroneous inline css comments with slash-slash ([061e84a](https://gitlab.com/codsen/codsen/commit/061e84a66a5eae911f755f8bec9ee5c30854b8ea))
- recognise rogue characters within inline css styles ([252eb07](https://gitlab.com/codsen/codsen/commit/252eb07215a66c1e15b520019a2435fef12de423))
- recognise rogue extra closing curlies in CSS rules ([9bb1e7a](https://gitlab.com/codsen/codsen/commit/9bb1e7af876455112df8ca090eb3fb4cb299eec6))

### BREAKING CHANGES

- the API surface anywhere within CSS styles, both inline and in head `<style>`, have been improved

## 2.17.0 (2020-05-24)

### Bug Fixes

- fix "rule" type node "left" key when it is preceded by at-rule ([96e3a65](https://gitlab.com/codsen/codsen/commit/96e3a650f9e4da6caa6f9ee5c3a15bcc88370aef))

### Features

- add attribs[].attribLeft to HTML tokens ([44046c1](https://gitlab.com/codsen/codsen/commit/44046c15f5124c447e86b9d2dd43058883b5b30a))
- add token.left key to rule-type tokens ([93564de](https://gitlab.com/codsen/codsen/commit/93564dea0739b67cba7ce083cec225435daaefaf))
- proper "at" and "rule" token nesting ([bd5db56](https://gitlab.com/codsen/codsen/commit/bd5db5619c559806b06f60d019888785613a3476))

## 2.16.0 (2020-05-17)

### Features

- broken ESP tag recognition improvements ([f3741e8](https://gitlab.com/codsen/codsen/commit/f3741e8fd34430e4a0ab5484cb94dc5918c99761))
- improve ESP tag recognition, add more tests and make existing ones more precise ([31e923c](https://gitlab.com/codsen/codsen/commit/31e923c8283001675522525c3ad097747d7df8d8))
- improvements to esp tag recognition ([13740c1](https://gitlab.com/codsen/codsen/commit/13740c171f4b9e4d207d4d1a718193f6715cbf78))
- recognise unclosed/terminated ESP tags within tag attributes ([28015ba](https://gitlab.com/codsen/codsen/commit/28015ba0b2deed5bb181e8064fa683cfb8dafb19))

## 2.15.0 (2020-05-11)

### Features

- improvements to esp tag recognition + some rebasing around esp tag extraction ([2117466](https://gitlab.com/codsen/codsen/commit/21174667c15ce313f788aa1ad641d5070903efe6))
- responsys RPL-like ESP tag recognition ([543214a](https://gitlab.com/codsen/codsen/commit/543214ab0bee9448f99370f395954bd8543b1f11))

## 2.14.0 (2020-04-20)

### Features

- improvements to the ESP tag recognition ([a1f5fe1](https://gitlab.com/codsen/codsen/commit/a1f5fe12269a809c9f17913288fb56f48ce69dab))

## 2.13.0 (2020-04-19)

### Bug Fixes

- more fixes for `attribs[].attribValue[]` ([51f842b](https://gitlab.com/codsen/codsen/commit/51f842b1e78eb6751a3609d924b634ae41ea5dee))
- set tag key `pureHTML` correctly ([90cbb4b](https://gitlab.com/codsen/codsen/commit/90cbb4b694a106445e9632ac4396dc0f8f67b3c6))

### Features

- esp tags can come as attributes or be among attribute value tokens ([28cfd40](https://gitlab.com/codsen/codsen/commit/28cfd407135b23521951d56d69893dd7a0a5d8cc))

## 2.12.0 (2020-04-13)

### Features

- detect when HTML attribute's equal is missing and there's whitespace instead ([cd74106](https://gitlab.com/codsen/codsen/commit/cd74106581699127eada0f47c723c91c9254a64b))
- extract new packages `is-char-suitable-for-html-attr-name` and `is-html-attribute-closing` ([deafd48](https://gitlab.com/codsen/codsen/commit/deafd488e9487ea96a04b51cafa271cd019cfafa))
- recognise HTML attributes with mismatching quotes and missing equal ([7dedba1](https://gitlab.com/codsen/codsen/commit/7dedba18d8b49f4991056635f1cfc481a9069502))

## 2.11.0 (2020-04-04)

### Features

- `opts.tagCbLookahead` and `opts.charCbLookahead` ([4b88c33](https://gitlab.com/codsen/codsen/commit/4b88c3348a84d46377fdcddc39435869042d2817))
- complete the correction for missing closing of an attribute ([34aa959](https://gitlab.com/codsen/codsen/commit/34aa9594bafb6f798c2b51d543b4aef05ffd7908))
- move lookahead contents from baked into node to separate input argument ([be27d8e](https://gitlab.com/codsen/codsen/commit/be27d8ed369e6d840c8cd2f7a752b7bd6ed20e84))
- new comment kind, simplet (`<!-->`) ([0734054](https://gitlab.com/codsen/codsen/commit/07340546b450bb2f16076e14f68b773d93284782))
- recognise broken pattern "attribute name - equal - attribute name - equal" ([9966e6c](https://gitlab.com/codsen/codsen/commit/9966e6cbf8f85fac97f921a049233e3e1aee1d66))
- recognise conditional comments (both kinds) without brackets as long as mso exists ([1afe369](https://gitlab.com/codsen/codsen/commit/1afe369fd23939c5f08872e17e2ad1f5811e5a20))
- recognise expanded notation outlook conditional kind="not" comments ([ffa4a0d](https://gitlab.com/codsen/codsen/commit/ffa4a0dc801371479350dc0b397f2393a0f048f1))
- recognise quoteless attribute tag endings ([1a38f1d](https://gitlab.com/codsen/codsen/commit/1a38f1dbf297b864bbe77003616a0dd5d16d08c8))
- support ESP tokens inside HTML tags - nest them among attributes ([114193c](https://gitlab.com/codsen/codsen/commit/114193c14a79f24caea9b45f8b470cbb096cea09))

## 2.10.0 (2020-03-24)

### Bug Fixes

- recognise "only"-kind closing tails with simple comment tails preceding ([f0d3624](https://gitlab.com/codsen/codsen/commit/f0d3624ca9f441cb6c741bd7da223562f0064517))
- second part of newly-added layer quotes - removing them ([9378cb9](https://gitlab.com/codsen/codsen/commit/9378cb9c76aa38a1ff8c683e1e020e3ef83cbac4))

### Features

- recognise conditional comment tags with wrong brackets ([c399b92](https://gitlab.com/codsen/codsen/commit/c399b92a32ebbbc8e041c8bd88d0f9215425312b))
- recognise mismatching quotes around HTML attributes ([7e2818c](https://gitlab.com/codsen/codsen/commit/7e2818c3ee0b1495343282e644b030d42d704f92))
- recognise missing closing quotes on HTML attibutes ([610e400](https://gitlab.com/codsen/codsen/commit/610e400f561051af7824924e1f9f86afc866532c))
- recognise missing opening quotes on HTML attributes ([41b85f0](https://gitlab.com/codsen/codsen/commit/41b85f0b3feabb15e692065426f4da2cecc7dc60))
- recognise repeated opening quotes on HTML attributes ([55707d5](https://gitlab.com/codsen/codsen/commit/55707d53d14ca8d893ef20a8b2494cdc3c91d5b6))

## 2.9.0 (2020-03-16)

### Bug Fixes

- add missing value, token.recognised on the broken tags ([95fd011](https://gitlab.com/codsen/codsen/commit/95fd011fa0e9d9a17ce6fb9806a152670880e0db))
- correct the incomplete simple opening HTML tag token ([08620a6](https://gitlab.com/codsen/codsen/commit/08620a6bd11309e623d0ecd8bad6f8a3d870310e))
- fix correct opening simple HTML comment ranges ([04b88bc](https://gitlab.com/codsen/codsen/commit/04b88bcc3eed6db8a12ceb8d73088342edac776d))
- recognise repeated opening brackets in comment tags ([6d22f81](https://gitlab.com/codsen/codsen/commit/6d22f81b5a0061aef4c969570ea00379e29fb86d))

### Features

- algorithm improvements and some housekeeping ([c479af9](https://gitlab.com/codsen/codsen/commit/c479af90b5bfb1c81dd5733224ecafa1703bc9b7))
- detect opening "if" kind comments without opening square bracket ([607fc23](https://gitlab.com/codsen/codsen/commit/607fc237d33dff4b1702303fc0b74bcd19f4cace))
- improve the recognition to "not" kind conditional opening without closing bracket ([23d6771](https://gitlab.com/codsen/codsen/commit/23d677141b967c6380fb490b72d88955b3e5634c))
- recognise missing opening brackets ([a182bb1](https://gitlab.com/codsen/codsen/commit/a182bb15b95b3c93d6b6d8ba94eff0807d935311))
- recognise tags abruptly ended after tag name ([6398167](https://gitlab.com/codsen/codsen/commit/639816701b826d126eeb633face549b7ffd995a5))

## 2.8.0 (2020-02-24)

### Bug Fixes

- a donothing skip was missing ([b79dafc](https://gitlab.com/codsen/codsen/commit/b79dafce493277df6f68fa9bd9e067e25468fa9e))
- make all tests pass ([2c48aa1](https://gitlab.com/codsen/codsen/commit/2c48aa10247aa81e3defc750853ee7ba52b247c4))
- recognise rule chunks without curly braces (very likely broken) ([f4245a3](https://gitlab.com/codsen/codsen/commit/f4245a3d5ed91c5e5713f4519ff31645ce841b9f))
- set the extracted selector's value to be trimmed in the end too ([1efc1bd](https://gitlab.com/codsen/codsen/commit/1efc1bd7beae29359deacb49fc01d16c86910d0c))
- set XML closing tag kind ([b1ab96f](https://gitlab.com/codsen/codsen/commit/b1ab96f33140bfd0a358a1d5a0fba5eaa43b02f6))

### Features

- add token.value ([3a85934](https://gitlab.com/codsen/codsen/commit/3a859341ca31845d93fc581223cb89cf4ef73cdd))
- allow spaces between comment tokens ([902e5cc](https://gitlab.com/codsen/codsen/commit/902e5cc77a27ff9cf399568c2454f6c5f2459c2e))
- improvements to `startsComment` detection function from util ([9c0e0c0](https://gitlab.com/codsen/codsen/commit/9c0e0c092fc739dabc4b22c913756191c064f2b6))
- include more erroneous comment tag cases to be recognised ([ea41247](https://gitlab.com/codsen/codsen/commit/ea4124782107e508d94f2dca08492001c1359256))
- recognise conditional "everywhere except" comments (type="comment", kind="not") ([e310798](https://gitlab.com/codsen/codsen/commit/e310798c5e9e10944a9a7f8d72ea838f7cca8501))
- recognise more broken tags and broken comment tags ([72e1e32](https://gitlab.com/codsen/codsen/commit/72e1e3263be167ffa80fdd51a462ed0fa4e6d273))
- recognise outlook/ie conditional comments (kind "only", type "comment") ([5ef68fa](https://gitlab.com/codsen/codsen/commit/5ef68fa793400923e7074f6c62b213b0d6fb361e))
- recognise rogue closing quotes in css ([3be0ec5](https://gitlab.com/codsen/codsen/commit/3be0ec5d70f68b56c104f85adbe6de3ee3ba0ed3))
- simple comment tokens recognised both opening and closing ([bd53904](https://gitlab.com/codsen/codsen/commit/bd5390479e6e38d4b56b48358263e66d0ad42071))

## 2.7.0 (2020-02-09)

### Bug Fixes

- don't ping last undefined character to charCb ([284b50c](https://gitlab.com/codsen/codsen/commit/284b50cdfd968c26b2858a0efd2697a7a7d67d90))
- turn off styleStarts ([def78e0](https://gitlab.com/codsen/codsen/commit/def78e04f960261381c16408bcd19bfe73d77c4c))

### Features

- "rule" token type ([e95c9ab](https://gitlab.com/codsen/codsen/commit/e95c9ab0f9e0fd2d1df629aa13d75d317b310c61))
- extend loop range until length + 1 ([8095bb9](https://gitlab.com/codsen/codsen/commit/8095bb9b5527125c06e61e904c914533f4fff9eb))
- improvements to cdata tag recognition ([b84491b](https://gitlab.com/codsen/codsen/commit/b84491ba6197d75b4614b54f399b3f06621e5e7b))
- single-layer at rules with nested whitespace (text) tokens ([3bc51b5](https://gitlab.com/codsen/codsen/commit/3bc51b5f651fab92985bfe39a7fb7c70ad2425e5))
- tighten up opts input check types ([3b80e1d](https://gitlab.com/codsen/codsen/commit/3b80e1dcccad69c74ca959d7035a8f038baddbb7))

## 2.6.0 (2020-02-01)

### Features

- improvements to unclosed tag recognition ([d861dd4](https://gitlab.com/codsen/codsen/commit/d861dd40fedabb21f922e8ced1bfb45982e407d4))
- missing HTML closing bracket ([c858340](https://gitlab.com/codsen/codsen/commit/c858340f9a95beff746303ca0ac3649f75ab0167))

## 2.5.0 (2020-01-01)

### Bug Fixes

- whole attribute's value can't be an opening or closing ESP lump ([051f2b6](https://gitlab.com/codsen/codsen/commit/051f2b609ea83daab5ba97d3821aac5625b9b9b0))

### Features

- further improvements to attribute value recognition ([313f091](https://gitlab.com/codsen/codsen/commit/313f09175ab393715dcb64ba27d2aa6c09723e1a))

## 2.4.0 (2019-12-27)

### Features

- add recognised attribute flag, "attribNameRecognised" ([71cbe64](https://gitlab.com/codsen/codsen/commit/71cbe6458102263ee5f503d9c288db573f3084e9))
- improvements to the broken attribute recognition algorithm ([408a3c6](https://gitlab.com/codsen/codsen/commit/408a3c6573c8043de2e43aafd4c519bb8973b5fd))
- recognise attribute values not wrapped in quotes ([1b3abcd](https://gitlab.com/codsen/codsen/commit/1b3abcd2ffe5d53eb9dd4f9c7a18b3490f6db1a4))
- recognise missing closing quotes of attribute values ([c39dfde](https://gitlab.com/codsen/codsen/commit/c39dfdec9f86056f463c45bb22e9013603f33cec))
- report tagName as lowercased, for consistency, ranges are still available ([e69efc6](https://gitlab.com/codsen/codsen/commit/e69efc6f9de520584ea808a53de631ec0356cf50))

## 2.3.1 (2019-12-21)

### Bug Fixes

- false positive - repeated percentage within attribute's value pretending to be an ESP tag ([ec36476](https://gitlab.com/codsen/codsen/commit/ec3647690728b99109b2c9ff44407229a283f336))
- html empty attributes logic fix ([a3e507d](https://gitlab.com/codsen/codsen/commit/a3e507d0b29baa3d6d7f92996d97b0c3af076db8))
- recognise rgb() with empty brackets as value of an attr ([69746ec](https://gitlab.com/codsen/codsen/commit/69746ecee702a499c9bdf72d1353a13e812a7504))

## 2.3.0 (2019-12-14)

### Features

- algorithm improvements and more tests ([4d6cf46](https://gitlab.com/codsen/codsen/commit/4d6cf46990a9caf49541767601e6f7ac2a8ab782))

## 2.2.0 (2019-12-09)

### Bug Fixes

- add all h\* tags to recognised list, fix the digit from being skipped ([43cae4f](https://gitlab.com/codsen/codsen/commit/43cae4f95b34f675768b2b2d8b256928a69e8ddc))

### Features

- algorithm improvements, especially around esp literals ([3183d4e](https://gitlab.com/codsen/codsen/commit/3183d4ea3ba32310d4d91e109fcd9cb09c552f55))
- html tag attribute recognition ([5892120](https://gitlab.com/codsen/codsen/commit/5892120458f57c6a8e6442a03f43b8efb58501a2))

## 2.1.0 (2019-11-27)

### Bug Fixes

- fix score calculation ([3601ce2](https://gitlab.com/codsen/codsen/commit/3601ce282fb3f186531198ffb61ad41c1bb3e31b))
- report doctype as recognised ([6967044](https://gitlab.com/codsen/codsen/commit/6967044c5f4649feb6c1194ceb4d8ce4ac4a7741))

### Features

- eSP tag recognition improvements ([5b1c0af](https://gitlab.com/codsen/codsen/commit/5b1c0afe7c2bc9d605e4db1caffc63104a50c995))
- improved broken cdata and doctype recognition ([98880dc](https://gitlab.com/codsen/codsen/commit/98880dc94316681f86d1ef635bbf3212b1dc7936))
- improvements to ESP tag recognition algorithm ([f135f16](https://gitlab.com/codsen/codsen/commit/f135f16984a6383e3efbb9cca8eb9911f0fc67fb))
- report wrong case tag names as recognised (so that we can catch them later in emlint) ([bbd56ec](https://gitlab.com/codsen/codsen/commit/bbd56ecfcbf0d3eabe6f28b1331be0804395fb37))

## 2.0.0 (2019-11-20)

### Features

- character callback ([d8ffbbd](https://gitlab.com/codsen/codsen/commit/d8ffbbde9a07644dbc961f7650f10dd2053b2dfc))
- recognised tags ([f1960f8](https://gitlab.com/codsen/codsen/commit/f1960f8ffa6ebf1f50eb85d6b5b52188d7659d44))

### BREAKING CHANGES

- options argument is now pushed by one place further

## 1.3.0 (2019-11-18)

### Bug Fixes

- improve void tag detection by moving calculation to where tag name is calculated ([5ea548f](https://gitlab.com/codsen/codsen/commit/5ea548f580f6ea6df3e8b72d036781b3bff09d8b))

### Features

- don't end esp token as easily, ensure it's closed using a character from estimated tails ([56d65be](https://gitlab.com/codsen/codsen/commit/56d65be7a46472a914ce8ef3fbb459e6baf706b4))
- void tags are determined evaluating tag's name, not presence of slash ([57d8b4c](https://gitlab.com/codsen/codsen/commit/57d8b4cb81abc4f3dec5cb0dc6d0898bb09806c3))

## 1.2.0 (2019-11-11)

### Features

- self-closing html tags ([afaff20](https://gitlab.com/codsen/codsen/commit/afaff20539623d463e759d1a78a1ba6a45b7f0aa))
- split test groups into files and report tag name for html tokens ([014e792](https://gitlab.com/codsen/codsen/commit/014e792786f69fa09d4771c8e24ea5d90c8a8b75))

## 1.1.0 (2019-11-02)

### Features

- css token type ([d617fb1](https://gitlab.com/codsen/codsen/commit/d617fb1e3d99e5b1b1fdf7a303a86f6af640298d))
- doctype and xml recognition ([3f92f64](https://gitlab.com/codsen/codsen/commit/3f92f646a67d2d458c6323a1b668d415ff9149e8))
- heuristic esp tag recognition ([8ee7df7](https://gitlab.com/codsen/codsen/commit/8ee7df774eed779e6c0abcd4732646fc57138ede))
- opts.reportProgressFunc ([5cc4838](https://gitlab.com/codsen/codsen/commit/5cc4838a7c94428ace4e29defbcfa10188a94867))
- recognise content within quotes ([c6cbc97](https://gitlab.com/codsen/codsen/commit/c6cbc97ad6b021ca90437730f70c43134f761d84))
- support esp code nested in other types and uneven count of quotes there ([399f48b](https://gitlab.com/codsen/codsen/commit/399f48b407845ae0324521ff68b6525c79a10961))
- tap "is-html-tag-opening" to make algorithm more resilient ([1c19b48](https://gitlab.com/codsen/codsen/commit/1c19b48c750b0357bb4d96d7e42099ae7dcb6e2a))
- init ([61e53c3](https://gitlab.com/codsen/codsen/commit/61e53c360cb75326994f6c0664b9d10e14242507))

## 1.0.0 (2019-11-01)

- ✨ First public release.
