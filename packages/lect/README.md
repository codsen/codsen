<div align="center">
  <img alt="lect" src="https://glcdn.githack.com/codsen/codsen/raw/master/packages/lect/media/repo_logo.png" width="480" align="center">
</div>

<div align="center"><p>Maintenance CLI for internal consumption</p></div>

[![Repository is on GitLab][gitlab-img]][gitlab-url]
[![View dependencies as 2D chart][deps2d-img]][deps2d-url]
[![Downloads/Month][downloads-img]][downloads-url]
[![Code style: prettier][prettier-img]][prettier-url]
[![MIT License][license-img]][license-url]

## Table of Contents

- [TLDR;](#tldr)
- [Great Wisdom or Great Foolishness](#great-wisdom-or-great-foolishness)
- [The Idea](#the-idea)
- [Readme automation](#readme-automation)
- [Config — .lectrc.json](#config--lectrcjson)
- [Installation](#installation)
- [Readme - Badges](#readme-badges)
- [Contributing](#contributing)
- [Licence](#licence)

## TLDR;

Opinionated npm library maintenance CLI app.

- Take readme, replace what can be replaced, programmatically, from config file and package.json.
- Generate and replace `rollup.config.json`
- Generate and replace `.npmignore`
- Create or delete arbitrary files, as per config file, `.lectrc.json` which sits in monorepo package root and controls all packages
- Manage dependencies, maintainers and whatnot in package.json

That's for starters.

**[⬆ back to top](#)**

## Great Wisdom or Great Foolishness

Using somebody else's config/automation files is usually a sign of _great wisdom_ or a _great incompetence_. It is very very unlikely that a _real, serious and capable developer_ would take on _other real, serious and capable developer_'s automation script and plugged many npm libraries into it. Unrealistic. The _other real, serious and capable developer_ will either have his own tool, or will not be capable of operating one. That's the paradox and it's valid on many other areas of life.

But this is an open-source CLI and you can still use it, fork it or take pieces of it.

**[⬆ back to top](#)**

## The Idea

This is an opinionated tool to automate the npm library maintenance.

This is a CLI application which you install globally `npm i -g lect` and then call anywhere typing `lect` in the terminal.

Conceptually, it will try to update as many different files in repository as it can, considering information gathered from files themselves.

**[⬆ back to top](#)**

## Readme automation

There are three different ways to manage a readme.

1. Not properly do it: readme is not taken care of, short, not friendly and so on.
2. **Readme templates**. They are based on template-per readme. Influential people like [Jon Schlinkert](https://www.npmjs.com/~jonschlinkert) choose that approach. But this leads to faceless, brief, often obtuse and even condescending readmes. Plus, the Problem is beyond readme — the whole package maintenance should be automated and readme updating should be viewed from the perspective of npm package maintenance operation. No offsense Jon.
3. **No template-per-readme approach**. Lect uses this. The idea is, readme is its own template. We can recognise and replace chunks inside of it, without the need of a separate template for each readme. This approach gives me both freedom to manually fill in the chapters and also automation/data-refreshing for common chapters (such as "Install").

**[⬆ back to top](#)**

## Config — .lectrc.json

Lect will use a separate config file one level higher than the `package.json` of the package's root.

## Installation

### Step 1

Install globally via npm:

```bash
$ npm i -g lect
```

### Step 2

Assemble the config file - start with reference-one and tweak it according to your needs. It's a dotfile, `.lectrc.json` (with 'json' extension so your code editor's linters can detect errors in it).

Place the config in the root where you keep multiple folders with a library in each. Basically, you'll be calling `lect` inside your libraries' folders but it will look for config one level higher. It's because all your libraries will share the same config.

See the `.lectrc.json` file in `reference` folder located near this very readme file.

**[⬆ back to top](#)**

## Readme - Badges

`lect` will detect badges chunk in readme and replace that with generated-ones, according to `.lectrc.json`.

**Customisation**

You can **turn off** each and any badge by setting a key within `package.json`, for example:

```json
"name": "string-collapse-white-space",
"version": "3.0.10",
"lect": {
  "badges": {
    "cov": 0
  }
}
```

The above would turn off the "coverage" badge.

You can grab my set of badges from example `.lectrc.json`, for example:

```
{
  "node": {
    "alt": "Minimum Node version required",
    "img": "https://img.shields.io/node/v/lect.svg?style=flat-square&label=works%20on%20node",
    "url": "https://www.npmjs.com/package/lect"
  }
}
```

Alternatively, you can create your own badges with different naming schema. Here's how badges are generated. One object-per-badge, place them under `.lectrc.json` key `badges`, within value put as array:

```json
{
  "badges": [
    {
      "node": {
        "alt": "Minimum Node version required",
        "img": "https://img.shields.io/node/v/lect.svg?style=flat-square&label=works%20on%20node",
        "url": "https://www.npmjs.com/package/lect"
      }
    },
    {
      "sparkles": {
        "alt": "Sparkles",
        "img": "https://cdn.sparkles-generated-for-you-API.com",
        "url": "https://api.sparkles-generated-for-you-API/codsen/lect"
      }
    }
  ]
}
```

This would get rendered as markdown code in the :

```

[![Sparkles][sparkles-img]][sparkles-url]
```

**[⬆ back to top](#)**

## Contributing

- If you see an error, [raise an issue](<https://gitlab.com/codsen/codsen/issues/new?issue[title]=lect%20package%20-%20put%20title%20here&issue[description]=**Which%20package%20is%20this%20issue%20for**%3A%20%0Alect%0A%0A**Describe%20the%20issue%20(if%20necessary)**%3A%20%0A%0A%0A%2Fassign%20%40revelt>).
- If you want a new feature but can't code it up yourself, also [raise an issue](<https://gitlab.com/codsen/codsen/issues/new?issue[title]=lect%20package%20-%20put%20title%20here&issue[description]=**Which%20package%20is%20this%20issue%20for**%3A%20%0Alect%0A%0A**Describe%20the%20issue%20(if%20necessary)**%3A%20%0A%0A%0A%2Fassign%20%40revelt>). Let's discuss it.
- If you tried to use this package, but something didn't work out, also [raise an issue](<https://gitlab.com/codsen/codsen/issues/new?issue[title]=lect%20package%20-%20put%20title%20here&issue[description]=**Which%20package%20is%20this%20issue%20for**%3A%20%0Alect%0A%0A**Describe%20the%20issue%20(if%20necessary)**%3A%20%0A%0A%0A%2Fassign%20%40revelt>). We'll try to help.
- If you want to contribute some code, fork the [monorepo](https://gitlab.com/codsen/codsen/) via GitLab, then write code, then file a pull request on GitLab. We'll merge it in and release.

In monorepo, npm libraries are located in `packages/` folder. Inside, the source code is located either in `src/` folder (normal npm library) or in the root, `cli.js` (if it's a command-line application).

The npm script "`dev`", the `"dev": "rollup -c --dev"` builds the development version retaining all `console.log`s with row numbers. It's handy to have [js-row-num-cli](https://www.npmjs.com/package/js-row-num-cli) installed globally so you can automatically update the row numbers on all `console.log`s.

**[⬆ back to top](#)**

## Licence

MIT License

Copyright (c) 2015-2020 Roy Revelt and other contributors


Icons mapping in util.js/`defaultTypes` taken from [all-contributors-cli](https://github.com/jfmengels/all-contributors-cli). MIT Licence.

[gitlab-img]: https://img.shields.io/badge/repo-on%20GitLab-brightgreen.svg?style=flat-square
[gitlab-url]: https://gitlab.com/codsen/codsen/tree/master/packages/lect
[cov-img]: https://img.shields.io/badge/coverage-Unknown%25-red.svg?style=flat-square
[cov-url]: https://gitlab.com/codsen/codsen/tree/master/packages/lect
[deps2d-img]: https://img.shields.io/badge/deps%20in%202D-see_here-08f0fd.svg?style=flat-square
[deps2d-url]: http://npm.anvaka.com/#/view/2d/lect
[downloads-img]: https://img.shields.io/npm/dm/lect.svg?style=flat-square
[downloads-url]: https://npmcharts.com/compare/lect
[prettier-img]: https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square
[prettier-url]: https://prettier.io
[license-img]: https://img.shields.io/badge/licence-MIT-51c838.svg?style=flat-square
[license-url]: https://gitlab.com/codsen/codsen/blob/master/LICENSE
