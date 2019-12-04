# eslint-plugin-row-num

updates row numbers in front of each encountered console.log

updates row numbers in front of each encountered console.log

updates row numbers in front of each encountered console.log

updates row numbers in front of each encountered console.log

updates row numbers in front of each encountered console.log

updates row numbers in front of each encountered console.log

updates row numbers in front of each encountered console.log

updates row numbers in front of each encountered console.log

updates row numbers in front of each encountered console.log

updates row numbers in front of each encountered console.log

updates row numbers in front of each encountered console.log

updates row numbers in front of each encountered console.log

updates row numbers in front of each encountered console.log

updates row numbers in front of each encountered console.log

updates row numbers in front of each encountered console.log

updates row numbers in front of each encountered console.log

updates row numbers in front of each encountered console.log

updates row numbers in front of each encountered console.log

updates row numbers in front of each encountered console.log

updates row numbers in front of each encountered console.log

updates row numbers in front of each encountered console.log

There is also a CLI version of this, `js-row-num-cli` ([npm](https://www.npmjs.com/package/js-row-num-cli)/[monorepo](https://gitlab.com/codsen/codsen/tree/master/packages/js-row-num-cli/))
See the API, the npm package, `js-row-num` ([npm](https://www.npmjs.com/package/js-row-num)/[monorepo](https://gitlab.com/codsen/codsen/tree/master/packages/js-row-num/))

## Installation

You'll first need to install [ESLint](http://eslint.org):

```
$ npm i eslint --save-dev
```

Next, install `eslint-plugin-row-num`:

```
$ npm install eslint-plugin-row-num --save-dev
```

**Note:** If you installed ESLint globally (using the `-g` flag) then you must also install `eslint-plugin-row-num` globally.

**[⬆ back to top](#)**

## Usage

Add `row-num` to the plugins section of your `.eslintrc` configuration file. You can omit the `eslint-plugin-` prefix:

```json
{
  "plugins": ["row-num"]
}
```

Then configure the rules you want to use under the rules section.

```json
{
  "rules": {
    "row-num/correct-row-num": 2
  }
}
```

**[⬆ back to top](#)**

## Supported Rules

At the moment there is only one rule, `correct-row-num`. It checks, are row numbers correct on all `console.log`s and if they're not, auto-fixes them.

## Contributing

- If you see an error, [raise an issue](<https://gitlab.com/codsen/codsen/issues/new?issue[title]=eslint-plugin-row-num%20package%20-%20put%20title%20here&issue[description]=**Which%20package%20is%20this%20issue%20for**%3A%20%0Aeslint-plugin-row-num%0A%0A**Describe%20the%20issue%20(if%20necessary)**%3A%20%0A%0A%0A%2Fassign%20%40revelt>).
- If you want a new feature but can't code it up yourself, also [raise an issue](<https://gitlab.com/codsen/codsen/issues/new?issue[title]=eslint-plugin-row-num%20package%20-%20put%20title%20here&issue[description]=**Which%20package%20is%20this%20issue%20for**%3A%20%0Aeslint-plugin-row-num%0A%0A**Describe%20the%20issue%20(if%20necessary)**%3A%20%0A%0A%0A%2Fassign%20%40revelt>). Let's discuss it.
- If you tried to use this package, but something didn't work out, also [raise an issue](<https://gitlab.com/codsen/codsen/issues/new?issue[title]=eslint-plugin-row-num%20package%20-%20put%20title%20here&issue[description]=**Which%20package%20is%20this%20issue%20for**%3A%20%0Aeslint-plugin-row-num%0A%0A**Describe%20the%20issue%20(if%20necessary)**%3A%20%0A%0A%0A%2Fassign%20%40revelt>). We'll try to help.
- If you want to contribute some code, fork the [monorepo](https://gitlab.com/codsen/codsen/) via GitLab, then write code, then file a pull request on GitLab. We'll merge it in and release.

In monorepo, npm libraries are located in `packages/` folder. Inside, the source code is located either in `src/` folder (normal npm library) or in the root, `cli.js` (if it's a command-line application).

The npm script "`dev`", the `"dev": "rollup -c --dev --silent"` builds the development version retaining all `console.log`s with row numbers. It's handy to have [js-row-num-cli](https://www.npmjs.com/package/js-row-num-cli) installed globally so you can automatically update the row numbers on all `console.log`s.

**[⬆ back to top](#)**

## Licence

MIT License

Copyright (c) 2015-2019 Roy Revelt and other contributors
