#!/usr/bin/env node

const fs = require('fs');

const template = `# Codsen monorepo

> A main monorepo for all our npm libraries

We have three types of libraries:

1) **Flagship libraries** - largest libraries which comprise of an npm library (as an API) and a front-end website. For example, [email-comb](https://bitbucket.org/codsen/codsen/src/master/packages/email-comb/) as an npm library also drives the [emailcomb.com](https://emailcomb.com)
2) **Small libraries** — npm libraries that might even be large but they perform programming tasks. For example, to add keys onto given plain objects or extract pieces of strings or delete some elements from an array.

## Flagship libraries

| Name      | npm link |
| --------- | -------- |
| Detergent | a        |
`

fs.writeFile('readme.md', template, (err) => {
  if (err) throw err;
  console.log(`\u001b[${32}m${`monorepo readme OK`}\u001b[${39}m`);
});
