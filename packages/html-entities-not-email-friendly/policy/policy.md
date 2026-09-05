# Email entity replacement policy

`names.json` preserves the existing selection and insertion order of 1,841
named references. This is a historical email-client compatibility policy;
the source does not include a versioned client test matrix. Regeneration does
not establish that current email clients fail to render each selected name.

`named-replacements.json` preserves the existing preferred named replacements
where they represent the same Unicode value. Other replacements are generated
as uppercase hexadecimal references from the pinned WHATWG data in
`all-named-html-entities/upstream/`. The generator validates every named alias.

Callers retain the public wrapping contract: prefix the payload with `&` and
append `;`. Multi-code-point payloads contain the intervening delimiters. For
example, `bne` maps to `#x3D;&#x20E5`, producing `&#x3D;&#x20E5;`, which represents
an equals sign followed by U+20E5.

Run `npm run generate --workspace html-entities-not-email-friendly` to regenerate
the imported JSON mapping and Sets. The corresponding `generate:check` command
checks these outputs without writing. Both commands work offline and verify
the upstream snapshot first. Edit the policy inputs instead of generated files.
