---
name: lint-repository-markdown
description: Keep the repository's linted Markdown passing `npm run lint:markdown`. Use when editing AGENTS.md, any file under .agents/ or .github/, or a package AGENTS.md, and whenever remark-lint reports a warning such as no-literal-urls, no-undefined-references, or list-item-indent.
---

# Lint Repository Markdown

`npm run lint:markdown` runs remark over a fixed set of documentation files.
It passes `--frail`, so **every warning is a CI failure**. The `Verify the
repository` step runs it early, and each later verification step is skipped
once it fails, which hides unrelated problems until the warning is fixed.

## Check before you push

```sh
npm run lint:markdown
```

`npm run check` (Biome) does **not** cover Markdown. Biome reports
`These paths were provided but ignored` for a `.md` argument, which reads like
success but means the file was never inspected. Markdown is only ever validated
by the command above.

## What is linted

Four globs, from the `lint:markdown` script in the root `package.json`:

- `AGENTS.md`
- `.agents/**/*.md`, which includes every `SKILL.md`, this one included
- `.github/**/*.md`
- `packages/*/AGENTS.md`

Package `README.md` files are **not** linted here. `lect` generates them, so
fix their content at the generator or the source fields instead.

## Configuration

`.remarkrc.json` loads `remark-frontmatter`, `remark-gfm`, and
`remark-preset-lint-recommended`. GFM is enabled, so tables, strikethrough, and
autolink literals all parse, and YAML frontmatter is understood. The preset
supplies these rules:

`final-newline`, `list-item-bullet-indent`, `list-item-indent` (`one`),
`no-blockquote-without-marker`, `no-literal-urls`, `ordered-list-marker-style`
(`.`), `hard-break-spaces`, `no-duplicate-definitions`,
`no-heading-content-indent`, `no-shortcut-reference-image`,
`no-shortcut-reference-link`, `no-undefined-references`, and
`no-unused-definitions`.

## The warnings that actually bite

**`no-literal-urls`** — a bare URL in prose. GFM turns it into an autolink
literal and the rule rejects it. This repository's house style wraps URLs in
backticks, which also stops a documentation URL becoming a live link:

```md
See `https://codsen.com/os/examples` for the rendered list.
```

Angle brackets satisfy the rule too, but only use them when the link is meant
to be clickable.

**`no-undefined-references`** — square brackets that look like a reference
link but define nothing. Prose such as `the [old] behaviour` or a footnote
marker such as `[1]` triggers it. Escape the brackets as `\[old\]`, or use
backticks.

**`no-shortcut-reference-link`** and **`no-shortcut-reference-image`** — the
`[label]` form, even when the definition exists. Write the full inline link.

**`list-item-indent`** — exactly one space after the bullet or number.

**`ordered-list-marker-style`** — `1.` and never `1)`.

**`final-newline`** — end the file with a newline.

## Reading the output

remark prints `line:column-line:column`, the severity, the message, and the
rule name:

```text
AGENTS.md
488:10-488:40 warning Unexpected GFM autolink literal … no-literal-urls
```

Fix the reported span, then re-run the command until every file reports
`no issues found`. Never silence a rule in `.remarkrc.json` to get a document
through; change the prose.
