# Architecture principles

These principles define the intended direction of the Codsen monorepo. They
apply when changing package architecture, source languages, build and test
infrastructure, generated artifacts, or distribution formats. A current
implementation can fall short of a principle; do not turn an accidental or
legacy implementation detail into policy merely because it already exists.

## TypeScript source is the source of truth

Write library source as actual TypeScript, with types as first-class parts of
the program. Do not use JavaScript plus JSDoc or other argument annotations as
an indirect way to produce TypeScript declarations. The compiler or runtime can
change, whether that means Microsoft's TypeScript toolchain, Deno, or native
TypeScript support, but the invariant remains typed source rather than types
reconstructed from comments.

Never hand-author a `.d.ts` file. Manual declarations duplicate the source API,
drift easily, and introduce avoidable errors. Generate declarations from the
typed source. When a generated declaration is wrong, fix the source types or
the declaration pipeline instead of patching the generated file.

Treat any existing hand-authored `.d.ts` file as migration debt, not as a
precedent. Do not add another one or expand an existing one. Replace it only
through an explicitly scoped migration that generates declarations from owned
TypeScript source or obtains authoritative declarations from the dependency
that owns the API.

## Scale the monorepo through infrastructure

Keep the libraries together and scale their maintenance through shared
infrastructure. Do not adopt a repository-per-library strategy whose success
depends on finding a separate external co-maintainer for every package. External
contributions remain welcome, but federated ownership is not the scaling model.

Invest engineering effort in automation, orchestration, observability, and
repeatable maintenance. Google's monorepo tooling, including Bazel, is the
reference model: centralisation works when infrastructure absorbs the repeated
work. This investment primarily means time and design effort, although it has
indirect financial value.

Sophisticated infrastructure is not inherently over-engineered. An F1 car has
many gears because each gear has a defined job. Build infrastructure can also
have many stages, but every stage must have an explicit purpose, visible inputs
and outputs, and deterministic ordering. Many gears are acceptable; hidden
gears are not.

## Build the useful JavaScript targets

When the build infrastructure is sound, producing another target is a build
configuration concern rather than a parallel source-maintenance burden. The
supported distributions are ESM for module consumers and a bundled script for
direct browser use. A CDN-hosted browser script can be added to almost any HTML
page without a package manager or module loader, so this distribution remains
a product feature. Do not add CommonJS (CJS) output.

The repository and its users have historically called the browser distribution
Universal Module Definition (UMD), and its public filename is `*.umd.js`. The
current bundler emits an immediately invoked function expression (IIFE), not a
formal UMD wrapper. When product discussion says “UMD,” interpret it as this
supported direct-browser script unless the wrapper format itself is relevant.

The current build writes its IIFE to a historically named `*.umd.js` path. This
filename predates the repository's ES Modules era and now forms part of the CDN
contract; the configured build format, not the suffix, determines what the
artifact is. Although `*.iife.js` would describe the artifact more accurately,
never rename these files. Preserving established CDN filename patterns takes
priority over correcting the suffix.

### Browser IIFE runtime contract

Every package that declares `package.json#exports.script` supports Chromium 58
and later runtimes with an equivalent JavaScript API surface. The repository
keeps the esbuild target, expected global-name rule, and exact Chromium test
snapshot in `ops/helpers/browserCompatibility.js`. Build and test code must read
that policy instead of repeating a browser target.

An esbuild target controls emitted syntax. It does not add runtime APIs. Code
bundled into an IIFE must therefore use APIs available at the declared floor or
feature-detect newer APIs and provide a behaviorally equivalent fallback. Keep
a newer native implementation as the fast path when it provides the same
observable behavior as the fallback.

Test the artifacts that browsers receive. `npm run ci:verify:browser-iifes`
checks every current `exports.script` file, loads each bundle in an isolated
legacy API realm, verifies its global, and runs representative public-API
smokes. CI repeats those checks in the exact SHA-verified Chromium 58 snapshot.
Do not raise the floor for one package or dependency in isolation. A floor
change requires a complete IIFE inventory audit, an updated central policy, and
successful tests for every browser bundle.

## Keep pure computation separate from effects

Only pure code can provide fully deterministic test guarantees. Impure code can
and must be integration-tested, but filesystem, process, network, clock, global
state, and scheduling effects add conditions that a unit test cannot completely
control.

Keep npm library cores pure wherever their domain permits it. For a CLI, put the
core behaviour in a pure library or pure internal module whenever possible, and
keep argument parsing, input/output, process control, and other effects in a
thin outer layer.

Treat accidental mixing of computation and orchestration as a primary source of
architectural degeneration. Race conditions involving build infrastructure,
`@codsen/data`, and `lect`, together with opaque build ordering, are examples of
this failure mode. The repository grew organically through small changes over a
long period, so expect this coupling to emerge naturally unless boundaries are
actively restored.

When improving such code:

- separate transformations from effects;
- make dependencies and ordering explicit;
- pass effectful capabilities into the code that needs them;
- make repeated operations deterministic and, where appropriate, idempotent;
- test pure cores directly and cover effectful boundaries with focused
  integration tests.

### Preserve progress and completion observability

Purity applies to the transformation semantics, not to the absence of useful
observability. Nontrivial libraries can receive large inputs or perform enough
work that a browser page appears unresponsive. A user who submits a multi-
megabyte HTML document needs progress feedback while the library works and
completion statistics when it finishes. Without that feedback, a successful
operation can look like a stalled application.

Treat progress reporting and completion statistics (including elapsed-time
“bean-counting”) as an intentional exception to fully deterministic return
objects. Preserve and invest in both capabilities for every nontrivial library:

- Provide progress callbacks for work that can take perceptible time. Preserve
  range-composition options such as `reportProgressFuncFrom` and
  `reportProgressFuncTo` when a library already supports them.
- Return useful completion statistics. When a result exposes
  `log.timeTakenInMilliseconds`, keep it as a best-effort elapsed duration for
  user-facing feedback.
- Do not treat elapsed time as a precision, performance-benchmark, or stable
  equality contract. Clock resolution, scheduling, runtime, and hardware can
  change the value.
- Keep observational values out of transformation decisions. The transformed
  result, ranges, deterministic counters, and other semantic data must not
  change because of the clock or a progress callback.
- Test deterministic output independently from observational fields. Test
  progress and elapsed-time plumbing with controlled callbacks or clocks
  instead of removing those fields to make whole-object equality deterministic.
- Preserve the same observability API in ESM and the direct-browser script,
  subject to the browser runtime contract.

This exception does not permit unrelated filesystem, process, network, or
global-state effects in a library core. It permits the narrow effects needed to
tell a caller that substantial work is advancing and how long it took.

### Treat codsen.com as a first-party API consumer

The Codsen website is a downstream application for this monorepo, not only a
place that copies package prose. Its package pages and playgrounds turn parts of
the published API into documentation, controls, progress indicators, result
summaries, and diagnostic views. A package change can therefore break a
first-party user interface even when ordinary imports and unit tests still
work.

The integration has two related surfaces:

- Package pages consume generated `@codsen/data` exports, including manifests,
  declarations, defaults, and examples. Their explanatory MDX can also name
  options and result fields directly.
- Playgrounds compile against installed ESM types and defaults, while
  CPU-bound transformations run in Web Workers that load the bundled
  direct-browser `*.umd.js` files from CDN paths. The current worker URLs do not
  contain a package version. The website's build-time package and its
  worker-time browser artifact are therefore separate resolution paths that
  must remain compatible.

Treat the following as website-facing integration contracts when a package
exposes them:

- the browser artifact path, global name, and named exports;
- the main function's inputs, option keys, default values, and result shape;
- progress callbacks whose numeric updates can cross a worker boundary and
  drive a progress indicator;
- completion statistics that explain elapsed time, input/output size, or work
  performed;
- input-sensitive applicability metadata that tells a GUI which options could
  affect the supplied input, independently of whether those options are
  currently enabled;
- diagnostic or customization callbacks whose reports can be displayed as an
  execution trace; and
- plain, structured-cloneable and JSON-representable results suitable for
  `postMessage()` and a raw-output panel.

This list identifies categories, not a promise that every present field name is
immutable. Before removing, renaming, or changing the meaning, type, units, or
serialization of one of these surfaces, inspect the current website consumer.
Prefer an additive transition or compatibility period. Coordinate an
intentional breaking change with the website and its worker before publishing
the package; a later website deployment is not sufficient protection when an
unversioned CDN URL can resolve the new browser artifact first.

For nontrivial configurable transformations, design observability for both API
users and GUI consumers. Progress values need useful monotonic movement, not a
fixed callback count or timing guarantee. Completion statistics are
best-effort. Applicability reports answer a different question from the chosen
settings: whether changing a setting could make a difference for this input.
Keep all three independent from the transformed result.

## Treat the JavaScript/TypeScript seam as a core risk

JavaScript and TypeScript form a useful but structurally awkward pair. For
TypeScript libraries, we author TypeScript in `src/`, transpile it to JavaScript
in `dist/`, run unit tests against `dist/`, and still need coverage lines to map
back to `src/`. Every transformation introduces another version or target that
can change the result:

- the JavaScript language target;
- the TypeScript language and compiler version;
- the format into which a test runner transforms TypeScript tests, if it does;
- the bundler version and output target;
- the local runtime;
- every CI runtime in the compatibility matrix;
- deployment runtimes such as a Cloudflare Worker, container, or host Node.js
  release.

Treat this matrix as a central build-system concern, not incidental tooling.
Centralise target selection, make transformations and execution order visible,
test the artifacts that users receive, and preserve trustworthy attribution
from coverage results back to typed source lines. A toolchain change is
incomplete until its source, output, tests, coverage, and supported runtimes
agree.

Rust provides the useful contrast: a project can be authored and tested in the
same typed language, then shipped as a compiled artifact without maintaining a
JavaScript/TypeScript boundary. The JavaScript ecosystem does not give us that
coherence automatically, so our infrastructure must supply it.
