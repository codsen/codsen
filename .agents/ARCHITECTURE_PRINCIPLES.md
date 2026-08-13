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
main JavaScript distribution families for this repository are ESM, CommonJS
(CJS), immediately invoked function expression (IIFE), and Universal Module
Definition (UMD). CJS and UMD are defunct for our purposes.

Ship the maximum useful set: ESM for module consumers and a bundled IIFE for
direct browser use. The IIFE has continuing value because a CDN-hosted script
can be added to almost any HTML page without a package manager or module
loader. Do not add CJS or UMD output.

The current build writes its IIFE to a historically named `*.umd.js` path. This
filename predates the repository's ES Modules era and now forms part of the CDN
contract; the configured build format, not the suffix, determines what the
artifact is. Although `*.iife.js` would describe the artifact more accurately,
never rename these files. Preserving established CDN filename patterns takes
priority over correcting the suffix.

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
