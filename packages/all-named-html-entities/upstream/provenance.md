# WHATWG named character references

`entities.json` is the unmodified [WHATWG JSON table](https://html.spec.whatwg.org/entities.json)
retrieved on 2026-09-05. `provenance.json` records its SHA-256 digest, counts,
source URL, and the digest and URL of the accompanying `WHATWG-LICENSE`.
The source contains 2,125 semicolon-terminated names and 106 legacy spellings
without semicolons. The [HTML Standard](https://html.spec.whatwg.org/multipage/named-characters.html)
defines their values and permitted spellings.

Run `npm run generate --workspace all-named-html-entities` from the repository
root to regenerate the canonical mapping, Sets, affix indexes, and the codec's
private table. `npm run generate:check --workspace all-named-html-entities`
verifies the same outputs without writing. Both commands work offline and
validate the pinned bytes, schema, Unicode scalars, and legacy aliases first.

`public-name-order.json` preserves the data product's existing insertion order.
The repair inputs `src/brokenNamedEntities.json` and `src/uncertain.json` remain
separate Codsen policies. The root `decode()` still accepts one exact named
reference with both delimiters; it does not decode strings or numeric references.

The upstream notice licenses source-code incorporations under BSD-3-Clause.
Generated TypeScript includes that notice and its full conditions so browser
bundles retain attribution. Keep `WHATWG-LICENSE` with the original snapshot.
When deliberately replacing the snapshot, review both upstream files, update
the recorded digests and counts, and regenerate and run the package tests.
