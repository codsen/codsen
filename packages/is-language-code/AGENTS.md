# is-language-code maintenance

## IANA registry data

`reference/language-subtag-registry.txt` is the checked-in source for the
`src/tag_*.json` files. `reference/runme.js` reads this local snapshot; it does
not download a newer registry. Treat the generated JSON files as generated
artifacts and do not edit them manually.

The authoritative registry is:

<https://www.iana.org/assignments/language-subtag-registry/language-subtag-registry>

After installing the monorepo root dependencies, regenerate from the repository
root with:

```sh
node packages/is-language-code/reference/runme.js
```

The generator overwrites the seven type-specific JSON files and
`tag_prefixes.json`, `tag_ranged.json`, and `tag_types.json`, then formats them
using the root Biome installation. Inspect every generated diff. A second run
without changing the registry or generator should produce no further diff.

Validate changes with:

```sh
npm test --workspace=is-language-code
npm pack --dry-run --json --workspace=is-language-code --ignore-scripts
```

The npm pack output must not contain `reference/`, `src/`, `test/`, `examples/`,
`perf/`, `AGENTS.md`, or any `*.tsbuildinfo` file. Publication exclusions belong
in the repository-root `.npmignore`; do not create a package-local `.npmignore`
or add `package.json#files`, because `lect` removes them.
