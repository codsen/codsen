# Codsen monorepo

> A lerna monorepo for all our npm libraries

We have three types of libraries:

1) **Flagship libraries** — our main projects — the largest libraries which comprise of an npm library as an API and a front-end website (driven by library's UMD build, consumed straight from npm).
  For example, [email-comb](https://bitbucket.org/codsen/codsen/src/master/packages/email-comb/) the npm library (its UMD build to be exact) drives the [emailcomb.com](https://emailcomb.com)
2) **Small libraries** — npm libraries that might even be large but they perform programming tasks. For example, to add keys onto given plain objects or extract pieces of strings or delete some elements from an array.

## Flagship libraries

| Name      | Purpose | Web app | Library on npm | Source code in monorepo |
| --------- | ------- | ------- | -------------- | --------------- |
| Detergent | Prepare text to be placed in the HTML: clean invisible characters, encode entities, improve style | [https://detergent.io](https://detergent.io) | [![detergent on npm](https://img.shields.io/npm/v/detergent.svg?style=flat-square)](https://www.npmjs.com/package/detergent) | [packages/detergent/](https://bitbucket.org/codsen/codsen/src/master/packages/detergent/) |
| EmailComb | Remove unused CSS from email templates | [https://emailcomb.com](https://detergent.io) | [![email-comb on npm](https://img.shields.io/npm/v/email-comb.svg?style=flat-square)](https://www.npmjs.com/package/email-comb) | [packages/email-comb/](https://bitbucket.org/codsen/codsen/src/master/packages/email-comb/) |
| HTMLCrush | Minify HTML+CSS | [https://htmlcrush.com](https://htmlcrush.com) | [![html-crush on npm](https://img.shields.io/npm/v/html-crush.svg?style=flat-square)](https://www.npmjs.com/package/html-crush) | [packages/html-crush/](https://bitbucket.org/codsen/codsen/src/master/packages/html-crush/) |
