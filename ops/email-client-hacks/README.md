# Email-client targeting regression tests

This fixed catalogue adapts every post in
[How to Target Email Clients at commit 32b959d](https://github.com/customerio/howtotarget/tree/32b959d15863bec691e6b3bb32126559152dbf1b/hacks/_posts)
into offline unit tests for `html-crush`, `email-comb`, and `string-strip-html`.
It contains 80 source posts and 113 input variants, exercised by 80 named tests
in each package. Every variant has a reviewed, package-owned expected result.

These tests check transformations of historical targeting syntax. They do not
verify rendering in email clients or assert that a technique still works.
The original statuses remain recorded: 59 Working, 18 Deprecated, and 3 Unknown.
This is a frozen regression corpus, with no automatic upstream refresh.

## Provenance

[provenance.json](provenance.json) records each source filename, pinned URL,
SHA-256 of its original bytes, client metadata, historical status, and associated
variants. The extensionless Apple Mail iOS 17 post is included. Duplicate
techniques remain separate when described in separate posts.
The hashes identify the inspected source bytes; ordinary checks do not fetch
upstream files to revalidate those hashes.

The fixtures use original message text, markup, and declarations to
exercise the functional targeting techniques. The necessary selector syntax,
conditional-comment delimiters, and client-specific markers remain intact.

## What the tests assert

| Package | Contract exercised |
| --- | --- |
| `html-crush` | Minify line breaks and indentation while retaining targeting syntax, conditional comments, and deliberately preserved CSS comments. |
| `email-comb` | Retain targeted rules and their live HTML classes with specific whitelist entries, while removing the unrelated `.discard` rule and `orphan` class. |
| `string-strip-html` | Extract message text, remove styles and hidden comments, retain revealed conditional content, and reproduce the result by applying the returned ranges. |

The package suites import their own built public ESM entrypoints. Their local
`test/fixtures/email-client-hacks/expected.json` files own the expectations;
projection never generates those expectations from library output.

Preservation is configuration-sensitive. Yahoo's declaration-in-comment hack
needs `removeCSSComments: false`. `email-comb` needs specific whitelist entries
for client-injected wrappers and client-transformed class names that do not
exist in the authored HTML. The tests neither insert those future wrappers
into the input nor whitelist everything. They also exercise selector
uglification where the chosen identities can be renamed safely.

`string-strip-html` has a different purpose: preserving a targeting stylesheet
would violate its default text-extraction contract. Conditional comments that
hide content are removed with that content, while revealed content remains.
Its existing line-break policy can retain a blank line between a document's
title and message text.

## Adaptation choices

[cases.json](cases.json) owns the common inputs and per-variant notes. Variants
cover every fenced technique and the concrete alternatives described in prose:

- Split the three T-online conditional forms and eleven Outlook HTML techniques
  into individual inputs. Pair the complementary CSS and HTML in the 2025
  Outlook chained-class example.
- Include alternative Yahoo element and wrapper selectors, Outlook bodyless
  and exact-attribute selectors, dark-mode background targeting, Thunderbird
  wrappers, Superhuman wrapper classes, and QQ class and compound selectors.
- Preserve both spellings of the Yahoo media query. Its prose requires a space
  before `{`, although its fenced example omits it.
- Retain the malformed doubled quotes in the Outlook PWA snippet as a robustness
  case, alongside a separately repaired form.
- Treat Yahoo's star-prefixed ID example as an HTML attribute despite its CSS
  fence label. Give the Gmail iOS `@supports` placeholder a nested style rule.
- Include the doctype/body prerequisites for Gmail, head elements for sibling
  selectors, body-placed styles for Mailspring and Outlook, and a colored
  wrapper for Outlook dark-mode targeting.
- Add the escaped Yahoo marker produced by Tailwind/Maizzle, which exposed
  [email-comb issue 141](https://github.com/codsen/codsen/issues/141).

## Run and maintain

From the repository root:

```sh
npm run email-client-hacks:check
npm test --workspace=html-crush
npm test --workspace=email-comb
npm test --workspace=string-strip-html
```

The catalogue check also runs in root `npm run verify`. It verifies the pinned
post inventory, variant mappings, package-local fixture parity, expectation
coverage, and numbered tests that call the appropriate package API for each
post. Package unit suites establish actual pass/fail; catalogue checks alone
are not behavioral evidence.

When an input adaptation needs correction, edit the shared case and its note,
then project the package-local copies:

```sh
npm run email-client-hacks:project
```

Review each affected package expectation independently, run its ordinary unit
suite, and rerun the catalogue check. Tests use only local files, so they also
run in the repository's isolated consumer and exact-Node compatibility lanes.
Keep historical cases even if a current client no longer supports the technique.

This corpus is separate from [the standards catalogue](../standards/README.md):
email-client quirks are empirical compatibility techniques, not normative HTML
or CSS requirements.
