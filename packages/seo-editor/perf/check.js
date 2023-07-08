#!/usr/bin/env node

// deps
import path from "path";

import { runPerf } from "../../../ops/scripts/perf.js";
import { editor } from "../dist/seo-editor.esm.js";

const callerDir = path.resolve(".");

const testme = () =>
  editor(
    `## Remove

- remove
- delete
- erase
- get rid of
- take out
- discard
- eliminate

## Unused

- unused
- not used
- unneeded
- redundant
- unnecessary
- extra

## CSS

- css
- style
- styles
- class
- classes
- id
- id's
- styling
- declarations

## From

- from

## Email

- email
- email-comb
- emailcomb
- comb
- development
- email geeks

## Templates

- template
- templates
- html
- xhtml
`,
    `
## Chunk #1: Tagline/description

Remove unused CSS from email templates

---

## Chunk #2: Multi-paragraph block

Use \`email-comb\` to delete unused CSS from an HTML email template to reduce the template's file size.

By erasing the unneeded and unnecessary CSS classes and IDs, you make the code more readable and reduce your mail server's bandwidth.

Unlike web page-oriented competitor tools, we tailored \`email-comb\` to cater to email development specifics: limit the line length to 500 characters (best practice), retain Outlook conditional if comment tags and minify and uglify class and id selector names.
`,
  );

// action
runPerf(testme, callerDir);
