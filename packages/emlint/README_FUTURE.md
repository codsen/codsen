# EMLint

> Pluggable email template code linter

[![Minimum Node version required][node-img]][node-url]
[![Repository is on GitLab][gitlab-img]][gitlab-url]
[![Coverage][cov-img]][cov-url]
[![View dependencies as 2D chart][deps2d-img]][deps2d-url]
[![Downloads/Month][downloads-img]][downloads-url]
[![Test in browser][runkit-img]][runkit-url]
[![Code style: prettier][prettier-img]][prettier-url]
[![MIT License][license-img]][license-url]

## Table of Contents

- [Install](#install)
- [Idea](#idea)
- [Three aims](#three-aims)
- [API](#api)
- [Example](#example)
- [Philosophy](#philosophy)
- [Situation on the market currently](#situation-on-the-market-currently)
- [Challenge of mixed sources in email](#challenge-of-mixed-sources-in-email)
- [Contributing](#contributing)
- [Licence](#licence)

## Install

```bash
npm i -g emlint
```

Then, call it from the command line using keyword:

```bash
emlint
```

**[⬆ back to top](#)**

## Idea

Email template rendering errors should be detected automatically, right in the code editor, while developer is typing, not by manually looking for visual errors in the rendered email in the inbox.

## Three aims

1. To catch errors, caused by bad symbols, for example raw non-breaking spaces (CHARACTER-LEVEL)
2. To catch errors, caused by misformatted HTML and CSS tag, for example missing bracket (TAG-LEVEL)
3. To catch errors, caused by tag patterns (those of HTML, CSS and even templating literals) where the code is perfectly clean and valid, yet the certain arrangement of the tags is causing rendering problems on certain email software. (CODE PATTERN-LEVEL)

Since this linter is pluggable, we'll adapt rules for web page linting as well, at least first two levels.

**[⬆ back to top](#)**

## API

This library exports _a plain object_. The main function `emlint()` and other goodies are placed under **keys** of that plain object, which you should consume by [destructuring what you `import`ed/`require`d](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment). For example:

```js
const { Linter, version } = require("emlint");
// or:
import { Linter, version } from "emlint";
```

Above, the [destructuring](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment) operation grabs all the values from those keys and dumps them in variable constants. Here they are:

| Key       | Type     | Description                                                     |
| --------- | -------- | --------------------------------------------------------------- |
| `Linter`  | Function | Main JS Class; see its API below                                |
| `version` | String   | Taken straight from `package.json`. Should match what's on npm. |

**[⬆ back to top](#)**

## Example

```js
const str = "< a>";
const linter = new Linter();
const messages = linter.verify(str, {
  rules: {
    "tag-space-after-opening-bracket": 2,
  },
});
console.log(JSON.stringify(messages, null, 4));
// =>
// [
//   {
//     ruleId: "tag-space-after-opening-bracket",
//     severity: 2,
//     idxFrom: 1,
//     idxTo: 2,
//     line: 1,
//     column: 2,
//     message: "Bad whitespace.",
//     fix: {
//       ranges: [[1, 2]]
//     }
//   }
// ]
```

**[⬆ back to top](#)**

## Philosophy

We follow ESLint ideas:

- Everything is pluggable - rule API is used both by bundled and custom rules
- Formatter API is used both by bundled and custom formatters
- Additional rules and formatters should be specified at runtime
- Rules and formatters don't have to be bundled to be used

Every rule:

- Is standalone
- Can be turned off or on (nothing can be deemed "too important to be turned off")
- Can be set to a warning or error individually

Additionally:

- Rules are "agenda free" - we don't promote any particular coding style
- We anticipate that all the input will be the worst-possible broken code, and _might_ contain some HTML or CSS.
- Unified heuristical engine to detect all ESP (Email Service Provider) templating languages.
- We'll use strengths of both processing-as-string and processing-as-AST. Former is for CHARACTER-LEVEL and TAG-LEVEL, latter is for CODE PATTERN-LEVEL.
- Linter should be smart and see the context. For example, if we want to lint a single letter `z`, the linter out-of-the-box should not complain about a missing doctype. Unless you explicitly ask for that.
- We will do our best to make it easier to write rules, especially code patterns. AST traversal is notoriously unfriendly to humans and we can do better than ESLint in that aspect.

**[⬆ back to top](#)**

## Situation on the market currently

Currently, email template render testing is a manual, slow and expensive process.

The primary way to look for email template rendering errors currently is to send HTML to test inboxes on various email software and visually inspect it. Companies like [Litmus](https://www.crunchbase.com/organization/litmus) and [Email on Acid](https://www.crunchbase.com/organization/emailonacid) which are equivalent to [Browserstack](https://www.crunchbase.com/organization/browserstack) and [Sauce Labs](https://www.crunchbase.com/organization/sauce-labs) on web development front — they let you send HTML to a single inbox and they make screenshots for you to manually inspect.

Litmus and Email on Acid _do_ have automated code checking but they are accidentally or deliberately _idiotic_ — they simply flag up which CSS styles are not supported in each known email client.

It's equivalent to the following.

Imagine you take: 1) ointment for a rash and 2) paracetamol for throat and you made **a Morning Tablet Checking Tool**. You would expect that once you enable rash- and throat-medicine checking functions in the checker, it would ask you, did you remember to take ointment and paracetamol.

Equivalent to what Email on Acid and Litmus do is they would take the list of your two medicines, then give you 49 alerts for 50 known illnesses where ointment won't work, including throat; then give you another 49 alerts for another 50 known illnesses where paracetamol won't work, including the rash. As a result, we get 49+49 false errors. Except in Email on Acid and Litmus case, there would be thousands.

Web page-oriented HTML linters, such as [html-lint](http://kangax.github.io/html-lint/) are all _parsing_ which means that they can't find any errors which break the parser — that's majority of them. And we're not even talking about supporting mixed source code.

Even ESLint suffers from being AST-only based — that wildly popular linter with enough money to support full-time maintainers and hundreds of rules to this day still can't pinpoint a single, rogue, duplicate curlie bracket. That's because for such kinds of errors they must tackle the source in a non-parsing way, to process it as string. Which is Codsen specialty by the way.

Also, web page-oriented HTML linters are not prepared for mixed sources or email-specific code such as code blocks under conditional HTML comments aimed at Outlook.

**[⬆ back to top](#)**

## Challenge of mixed sources in email

Similar way to how PHP code is sprinkled in Wordpress templates, assembled email campaigns contain templating literals — either proprietary ESP markup (for example, Oracle Responsys has its own markup) or templating languages (such as Jinja/Nunjucks for example) or even programming languages (such as pure Java). There are many kinds of these different templating languages and all break HTML and CSS parsers sooner or later.

For example, bracket can be used as a greater than sign to measure product count (Nunjucks templating language):

```
<span {% if product.count > 1 %} ...>
```

or worse, here a templating language tries to URL-encode, concatenating string from quoted apostrophes:

```
<a href="https://qrs?tuv={{ mn.op | replace(" ", "+") | replace("'", "%27") | replace("&", "%26") | replace("(", "%28") | replace(")", "%29") }}"
```

The part `"'"` will kill all the current web page HTML parsers (and consequently, all the tooling based on those parsers).

**[⬆ back to top](#)**

## Licence

MIT License

Copyright (c) 2010-2021 Roy Revelt and other contributors

<img src="https://codsen.com/images/png-codsen-ok.png" width="98" alt="ok" align="center"> <img src="https://codsen.com/images/png-codsen-1.png" width="148" alt="codsen" align="center"> <img src="https://codsen.com/images/png-codsen-star-small.png" width="32" alt="star" align="center">
