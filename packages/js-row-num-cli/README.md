<div align="center">
  <h1>js-row-num-cli</h1>
</div>

<div align="center">
  <p><img alt="js-row-num-cli" src="https://glcdn.githack.com/codsen/codsen/raw/master/packages/js-row-num-cli/media/update-console-log-row-number.gif" width="864" align="center"></p>
</div>

<div align="center"><p>Update all row numbers in all console.logs in JS code</p></div>

[![Minimum Node version required][node-img]][node-url]
[![Repository is on GitLab][gitlab-img]][gitlab-url]
[![View dependencies as 2D chart][deps2d-img]][deps2d-url]
[![Downloads/Month][downloads-img]][downloads-url]
[![Code style: prettier][prettier-img]][prettier-url]
[![MIT License][license-img]][license-url]

Other siblings of this package:

- API for it: `js-row-num` [on npm](https://www.npmjs.com/package/js-row-num), [on GitLab](https://gitlab.com/codsen/codsen/tree/master/packages/js-row-num)

## Table of Contents

- [Install](#install)
- [Use it](#use-it)
- [TLDR](#tldr)
- [What it does](#what-it-does)
- [Using multiple flags](#using-multiple-flags)
- [Escaping](#escaping)
- [A nifty setup idea](#a-nifty-setup-idea)
- [Updating it](#updating-it)
- [Contributing](#contributing)
- [Licence](#licence)

## Install

```bash
npm i -g js-row-num-cli
```

Then, call it from the command line using one of the following keywords:

```bash
jrn
jsrownum
```

## Use it

Once installed, call it typing `jsrownum` or `jrn` in your terminal, like this:

```bash
jsrownum
# or
jrn
```

or specify a glob pointing to some `js` files:

```bash
jsrownum "folder/*.js"
# or
jrn "folder/*.js"
```

If `jsrownum` is too long, you can also type `jrn`; we wired up that as an alternative.

**[⬆ back to top](#)**

## TLDR

It updates each `console.log` in your `.js` files...

from:

```js
// something on row 1
// something on row 2
console.log('000 var = ' + var); // row 3
//           ^^^
```

to:

```js
// ...
console.log('003 var = ' + var);
//           ^^^
```

Because it's on row 3. If you're not using `console.log`, and are using for example `log()`, put that under "-t" flag:

```bash
jrn -t "log"
```

or if specifying paths,

```bash
jrn "folder/*.js" -t "log"
```

⚡️⚡️⚡️⚡️🔥🔥🔥🍻🍻🍻🍻🤩🤩💪🏼💪🏼💪🏼💪🏼💪🏼👊🏼👊🏼👊🏼👊🏼💥💥💥💥⚡️⚡️🌟🌟🌟🌟⚡️🍺🍺💪🏼💪🏼

**[⬆ back to top](#)**

## What it does

First, it depends, did you specify a path or not.

- If you did, for example, `jsrownum "folder/*.js"` it will process that file (or expand glob into a list of files).
- If you didn't, just typed `jsrownum`, it will use the current folder where it was called from and look for files in this order:

1.  ./src/main.js
2.  ./main.js
3.  ./cli.js
4.  ./index.js
5.  ./src/index.js

**Once it picks the file**, it will look for `console.log` statements, and replace the first chunk of an uninterrupted sequence of numbers with a number of a row it sits.

For exampe, on row number 55 there's a `console.log("045 var = " + var)`.
It will replace `045` with `055`.

🌟⚡️🍺🍺💪🏼💪🏼🍺

The default padding is three characters, but you can override it, see the optional flags table below.

`console.log`s help to troubleshoot the code. These days Rollup builds are standard — having a source in ES Modules (and pointing unit tests to it) and using that source to build three types of applications: 1. ESM (same as source); 2. UMD (minified, for browsers and unpkg.com); 3. Common JS — transpiled to ES5, suitable for older platforms.

Now, you can use Rollup to remove comments and `console.log`s automatically when producing _production_ builds. During _development_ builds, you can use CLI flags to skip `console.log` removal. This way, you get all the goodness of `console.log`s in the terminal, and there's no risk that they will spill into production.

**[⬆ back to top](#)**

### API

Once installed globally, type in your terminal: `jsrownum` OR type `jrn`.

If you **won't pass** any glob file/folder pattern or patterns, for example, just type `jrn`, it will look for the following files in this priority order:

1.  ./src/main.js
2.  ./main.js
3.  ./cli.js
4.  ./index.js
5.  ./src/index.js

If you **will pass** some globs, for example:

```bash
jrn "src/*.js"
jsrownum --pad="4" "dist/**/*.js test/ index.js"
jrn "test1.js test2.js" -p 2
```

...it will expand the globs and catch all `.js` files in the folders you specified and process them.

Optionally, you can pass the options, which match the [API](https://www.npmjs.com/package/js-row-num):

| CLI flag            | For example,                       | What it does                                                                                                                                                                   |
| ------------------- | ---------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `-p` or `--pad`     | `jsrownum -p 3` or `jrn --pad="4"` | Lets you set the row number padding. For example, `console.log` statement on row 3 with padding set to 4 would get `0003` added. Row 99 with padding of 1 would be still `99`. |
| `-t` or `--trigger` | `jrn -t "log"`                     | Lets you change from "console.log" to any function's name, for example update "001" in `log(\`001 z = \${z}\`);`                                                               |

**[⬆ back to top](#)**

## Using multiple flags

Command line applications have few rules. First, if you want to pass multiple values to a certain flag, put `-*` or `--*****` for each value:

GOOD:

```bash
jrn -f "log" -f "yo"
```

BAD:

```bash
jrn -f "log" "yo"
```

**[⬆ back to top](#)**

## Escaping

If you want to put double quotes, escape it like using left slash:

```bash
jrn -f "zzz\"yyy"
```

## A nifty setup idea

I set up an alias for `jsrownum`, to piggyback on some common command I run often. For example, `git add .` - this way all row numbers are processed automatically without any hassle.

## Updating it

When you install it globally, it will check occasionally, are there newer versions available, and if so, will show a message nagging you to update. [Same tech](https://www.npmjs.com/package/update-notifier) that AVA or npm uses!

**[⬆ back to top](#)**

## Contributing

- If you see an error, [raise an issue](<https://gitlab.com/codsen/codsen/issues/new?issue[title]=js-row-num-cli%20package%20-%20put%20title%20here&issue[description]=**Which%20package%20is%20this%20issue%20for**%3A%20%0Ajs-row-num-cli%0A%0A**Describe%20the%20issue%20(if%20necessary)**%3A%20%0A%0A%0A%2Fassign%20%40revelt>).
- If you want a new feature but can't code it up yourself, also [raise an issue](<https://gitlab.com/codsen/codsen/issues/new?issue[title]=js-row-num-cli%20package%20-%20put%20title%20here&issue[description]=**Which%20package%20is%20this%20issue%20for**%3A%20%0Ajs-row-num-cli%0A%0A**Describe%20the%20issue%20(if%20necessary)**%3A%20%0A%0A%0A%2Fassign%20%40revelt>). Let's discuss it.
- If you tried to use this package, but something didn't work out, also [raise an issue](<https://gitlab.com/codsen/codsen/issues/new?issue[title]=js-row-num-cli%20package%20-%20put%20title%20here&issue[description]=**Which%20package%20is%20this%20issue%20for**%3A%20%0Ajs-row-num-cli%0A%0A**Describe%20the%20issue%20(if%20necessary)**%3A%20%0A%0A%0A%2Fassign%20%40revelt>). We'll try to help.
- If you want to contribute some code, fork the [monorepo](https://gitlab.com/codsen/codsen/) via GitLab, then write code, then file a pull request on GitLab. We'll merge it in and release.

In monorepo, npm libraries are located in `packages/` folder. Inside, the source code is located either in `src/` folder (normal npm library) or in the root, `cli.js` (if it's a command-line application).

The npm script "`dev`", the `"dev": "rollup -c --dev"` builds the development version retaining all `console.log`s with row numbers. It's handy to have [js-row-num-cli](https://www.npmjs.com/package/js-row-num-cli) installed globally so you can automatically update the row numbers on all `console.log`s.

**[⬆ back to top](#)**

## Licence

MIT License

Copyright (c) 2015-2020 Roy Revelt and other contributors

[node-img]: https://img.shields.io/node/v/js-row-num-cli.svg?style=flat-square&label=works%20on%20node
[node-url]: https://www.npmjs.com/package/js-row-num-cli
[gitlab-img]: https://img.shields.io/badge/repo-on%20GitLab-brightgreen.svg?style=flat-square
[gitlab-url]: https://gitlab.com/codsen/codsen/tree/master/packages/js-row-num-cli
[deps2d-img]: https://img.shields.io/badge/deps%20in%202D-see_here-08f0fd.svg?style=flat-square
[deps2d-url]: http://npm.anvaka.com/#/view/2d/js-row-num-cli
[downloads-img]: https://img.shields.io/npm/dm/js-row-num-cli.svg?style=flat-square
[downloads-url]: https://npmcharts.com/compare/js-row-num-cli
[prettier-img]: https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square
[prettier-url]: https://prettier.io
[license-img]: https://img.shields.io/badge/licence-MIT-51c838.svg?style=flat-square
[license-url]: https://gitlab.com/codsen/codsen/blob/master/LICENSE
