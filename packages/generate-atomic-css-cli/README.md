# generate-atomic-css-cli

> Generates and updates all HTML templates' atomic CSS

[![Repository is on GitLab][gitlab-img]][gitlab-url]
[![View dependencies as 2D chart][deps2d-img]][deps2d-url]
[![Downloads/Month][downloads-img]][downloads-url]
[![Code style: prettier][prettier-img]][prettier-url]
[![MIT License][license-img]][license-url]

Other siblings of this package:

- API for it: `generate-atomic-css` [on npm](https://www.npmjs.com/package/generate-atomic-css), [on GitLab](https://gitlab.com/codsen/codsen/tree/master/packages/generate-atomic-css)

## Table of Contents

- [Install](#install)
- [Use it](#use-it)
- [How it works](#how-it-works)
- [Updating it](#updating-it)
- [Contributing](#contributing)
- [Licence](#licence)

## Install

```bash
npm i -g generate-atomic-css-cli
```

Then, call it from the command line using keyword:

```bash
gac
```

## Use it

Once installed, call it typing `gac` in your terminal, like this:

```bash
gac "index.html"
# or with wildcards:
gac "modules/css/*/*.scss"
```

## How it works

You place special placeholders for config ("config heads" and "config tails"), then also placeholders for content ("content heads" and "content tails").

Config will be read from between config heads and tails, expanded into multiple lines as you requested and result will be placed instead of existing content between content heads and content tails.

In config, `$$$` means dynamic value, default 0-500 but you can customise the range appending pipes at the end of the line:

```
a

/* GENERATE-ATOMIC-CSS-CONFIG-STARTS
.pb$$$ { padding-bottom: $$$px !important; } | 5 | 10

.mt$$$ { margin-top: $$$px !important; } | 1
GENERATE-ATOMIC-CSS-CONFIG-ENDS
GENERATE-ATOMIC-CSS-CONTENT-STARTS */

this will get wiped

/* GENERATE-ATOMIC-CSS-CONTENT-ENDS */

z
```

yields:

```
a

/* GENERATE-ATOMIC-CSS-CONFIG-STARTS
.pb$$$ { padding-bottom: $$$px !important; } | 5 | 10

.mt$$$ { margin-top: $$$px !important; } | 1
GENERATE-ATOMIC-CSS-CONFIG-ENDS
GENERATE-ATOMIC-CSS-CONTENT-STARTS */
.pb5  { padding-bottom:  5px !important; }
.pb6  { padding-bottom:  6px !important; }
.pb7  { padding-bottom:  7px !important; }
.pb8  { padding-bottom:  8px !important; }
.pb9  { padding-bottom:  9px !important; }
.pb10 { padding-bottom: 10px !important; }

.mt0 { margin-top:   0 !important; }
.mt1 { margin-top: 1px !important; }
/* GENERATE-ATOMIC-CSS-CONTENT-ENDS */

z
```

As you see, pipes are inclusive values, one value means "upto", two values mean "from" and "upto".

You can use this CLI to generate/update any file: HTML, CSS or SCSS or whatever. Just put the placeholders and job will be done.

Usually config is within CSS comments block.

⚡️⚡️⚡️⚡️🔥🔥🔥🍻🍻🍻🍻🤩🤩💪🏼💪🏼💪🏼💪🏼💪🏼👊🏼👊🏼👊🏼👊🏼💥💥💥💥⚡️⚡️🌟🌟🌟🌟⚡️🍺🍺💪🏼💪🏼

**[⬆ back to top](#)**

## Updating it

When you install it globally, it will check occasionally, are there newer versions available, and if so, will show a message nagging you to update. [Same tech](https://www.npmjs.com/package/update-notifier) that AVA or npm uses!

**[⬆ back to top](#)**

## Contributing

- If you see an error, [raise an issue](<https://gitlab.com/codsen/codsen/issues/new?issue[title]=generate-atomic-css-cli%20package%20-%20put%20title%20here&issue[description]=**Which%20package%20is%20this%20issue%20for**%3A%20%0Agenerate-atomic-css-cli%0A%0A**Describe%20the%20issue%20(if%20necessary)**%3A%20%0A%0A%0A%2Fassign%20%40revelt>).
- If you want a new feature but can't code it up yourself, also [raise an issue](<https://gitlab.com/codsen/codsen/issues/new?issue[title]=generate-atomic-css-cli%20package%20-%20put%20title%20here&issue[description]=**Which%20package%20is%20this%20issue%20for**%3A%20%0Agenerate-atomic-css-cli%0A%0A**Describe%20the%20issue%20(if%20necessary)**%3A%20%0A%0A%0A%2Fassign%20%40revelt>). Let's discuss it.
- If you tried to use this package, but something didn't work out, also [raise an issue](<https://gitlab.com/codsen/codsen/issues/new?issue[title]=generate-atomic-css-cli%20package%20-%20put%20title%20here&issue[description]=**Which%20package%20is%20this%20issue%20for**%3A%20%0Agenerate-atomic-css-cli%0A%0A**Describe%20the%20issue%20(if%20necessary)**%3A%20%0A%0A%0A%2Fassign%20%40revelt>). We'll try to help.
- If you want to contribute some code, fork the [monorepo](https://gitlab.com/codsen/codsen/) via GitLab, then write code, then file a pull request on GitLab. We'll merge it in and release.

In monorepo, npm libraries are located in `packages/` folder. Inside, the source code is located either in `src/` folder (normal npm library) or in the root, `cli.js` (if it's a command-line application).

The npm script "`dev`", the `"dev": "rollup -c --dev"` builds the development version retaining all `console.log`s with row numbers. It's handy to have [js-row-num-cli](https://www.npmjs.com/package/js-row-num-cli) installed globally so you can automatically update the row numbers on all `console.log`s.

**[⬆ back to top](#)**

## Licence

MIT License

Copyright (c) 2015-2020 Roy Revelt and other contributors

[gitlab-img]: https://img.shields.io/badge/repo-on%20GitLab-brightgreen.svg?style=flat-square
[gitlab-url]: https://gitlab.com/codsen/codsen/tree/master/packages/generate-atomic-css-cli
[deps2d-img]: https://img.shields.io/badge/deps%20in%202D-see_here-08f0fd.svg?style=flat-square
[deps2d-url]: http://npm.anvaka.com/#/view/2d/generate-atomic-css-cli
[downloads-img]: https://img.shields.io/npm/dm/generate-atomic-css-cli.svg?style=flat-square
[downloads-url]: https://npmcharts.com/compare/generate-atomic-css-cli
[prettier-img]: https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square
[prettier-url]: https://prettier.io
[license-img]: https://img.shields.io/badge/licence-MIT-51c838.svg?style=flat-square
[license-url]: https://gitlab.com/codsen/codsen/blob/master/LICENSE
