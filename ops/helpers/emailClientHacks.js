import path from "node:path";
import ts from "typescript";

const EMAIL_CLIENT_HACK_COMMIT = "32b959d15863bec691e6b3bb32126559152dbf1b";
const EMAIL_CLIENT_HACK_REPOSITORY =
  "https://github.com/customerio/howtotarget";
const EMAIL_CLIENT_HACK_POST_COUNT = 80;
const EMAIL_CLIENT_HACK_TARGETS = [
  { package: "html-crush", entrypoint: "crush" },
  { package: "email-comb", entrypoint: "comb" },
  { package: "string-strip-html", entrypoint: "stripHtml" },
];
const EMAIL_CLIENT_HACK_FIXTURE = "test/fixtures/email-client-hacks/cases.json";
const EMAIL_CLIENT_HACK_EXPECTATIONS =
  "test/fixtures/email-client-hacks/expected.json";
const EMAIL_CLIENT_HACK_TESTS = "test/email-client-hacks.js";

function requireValue(condition, message) {
  if (!condition) throw new Error(message);
}

function validateEmailClientHacks(provenance, cases) {
  requireValue(
    provenance?.schemaVersion === 1 &&
      provenance.repository === EMAIL_CLIENT_HACK_REPOSITORY &&
      provenance.commit === EMAIL_CLIENT_HACK_COMMIT,
    "Email-client hacks must identify the fixed upstream snapshot",
  );
  requireValue(
    Array.isArray(provenance.posts) &&
      provenance.posts.length === EMAIL_CLIENT_HACK_POST_COUNT,
    `Expected ${EMAIL_CLIENT_HACK_POST_COUNT} pinned email-client hack posts`,
  );
  requireValue(
    cases && typeof cases === "object" && !Array.isArray(cases),
    "Email-client hack cases must be an object keyed by post ID",
  );
  const postIds = new Set();
  const allVariantIds = new Set();
  for (const post of provenance.posts) {
    requireValue(
      typeof post?.path === "string" &&
        /^hacks\/_posts\/\d{4}-\d{2}-\d{2}-[A-Za-z0-9][A-Za-z0-9.-]*$/u.test(
          post.path,
        ) &&
        post.id ===
          path.posix.basename(post.path).replace(/\.md$/u, "").toLowerCase(),
      `Invalid email-client hack post identity: ${post?.id}`,
    );
    requireValue(
      !postIds.has(post.id),
      `Duplicate email-client hack post: ${post.id}`,
    );
    postIds.add(post.id);
    requireValue(
      typeof post.sha256 === "string" && /^[a-f0-9]{64}$/u.test(post.sha256),
      `Invalid upstream post SHA-256: ${post.id}`,
    );
    for (const field of ["client", "status"])
      requireValue(
        typeof post[field] === "string" && post[field].trim().length > 0,
        `Missing upstream ${field}: ${post.id}`,
      );
    requireValue(
      Array.isArray(post.variants) && post.variants.length > 0,
      `Missing pinned variants: ${post.id}`,
    );
    const variants = cases[post.id];
    requireValue(
      Array.isArray(variants) && variants.length > 0,
      `Missing email-client hack cases: ${post.id}`,
    );
    for (const variant of variants) {
      requireValue(
        typeof variant?.id === "string" &&
          /^[a-z0-9][a-z0-9.-]*$/u.test(variant.id) &&
          !allVariantIds.has(variant.id),
        `Invalid or duplicate email-client hack variant: ${post.id}/${variant?.id}`,
      );
      allVariantIds.add(variant.id);
      requireValue(
        typeof variant.input === "string" &&
          variant.input.length > 0 &&
          typeof variant.note === "string" &&
          variant.note.trim().length > 0,
        `Missing input or adaptation note: ${post.id}/${variant.id}`,
      );
    }
    requireValue(
      JSON.stringify(post.variants) ===
        JSON.stringify(variants.map(({ id }) => id)),
      `Pinned variant mapping differs from cases: ${post.id}`,
    );
  }
  requireValue(
    Object.keys(cases).length === postIds.size &&
      Object.keys(cases).every((id) => postIds.has(id)),
    "Email-client hack case inventory differs from pinned posts",
  );
  return { posts: postIds.size, variants: allVariantIds.size };
}

function emailClientHackFixture(cases) {
  return `${JSON.stringify(cases, null, 2)}\n`;
}

function validateEmailClientHackExpectations(cases, expected, target) {
  const ids = new Set(
    Object.values(cases)
      .flat()
      .map(({ id }) => id),
  );
  requireValue(
    expected &&
      typeof expected === "object" &&
      !Array.isArray(expected) &&
      Object.keys(expected).length === ids.size &&
      Object.keys(expected).every((id) => ids.has(id) && expected[id] !== null),
    `Package expectations differ from email-client hack variants: ${target}`,
  );
  return ids.size;
}

// This verifies a structural link, not execution or correctness. Unit suites own
// the reviewed expectations and establish whether every adaptation passes.
function auditEmailClientHackTests(source, target, postIds) {
  const tree = ts.createSourceFile(
    EMAIL_CLIENT_HACK_TESTS,
    source,
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.JS,
  );
  requireValue(
    tree.parseDiagnostics.length === 0,
    `Cannot parse hack tests: ${target.package}`,
  );
  const entrypoints = new Set();
  for (const statement of tree.statements) {
    if (
      ts.isImportDeclaration(statement) &&
      ts.isStringLiteral(statement.moduleSpecifier) &&
      statement.importClause?.namedBindings &&
      ts.isNamedImports(statement.importClause.namedBindings) &&
      statement.moduleSpecifier.text === `../dist/${target.package}.esm.js`
    )
      for (const element of statement.importClause.namedBindings.elements)
        if ((element.propertyName ?? element.name).text === target.entrypoint)
          entrypoints.add(element.name.text);
  }
  const seen = new Set();
  for (const statement of tree.statements) {
    if (
      !ts.isExpressionStatement(statement) ||
      !ts.isCallExpression(statement.expression)
    )
      continue;
    const node = statement.expression;
    if (!ts.isIdentifier(node.expression) || node.expression.text !== "test")
      continue;
    requireValue(
      node.arguments[0] &&
        ts.isStringLiteralLike(node.arguments[0]) &&
        node.arguments[1],
      `Hack tests must have static titles and callbacks: ${target.package}`,
    );
    const match = /^\d{2,3} - (\S+)(?: |$)/u.exec(node.arguments[0].text);
    const id = match?.[1];
    requireValue(
      postIds.has(id) && !seen.has(id),
      `Unknown or duplicate hack test: ${target.package}/${id}`,
    );
    const loops = [];
    let conditionalSkip = false;
    function inspect(child) {
      if (
        ts.isBreakStatement(child) ||
        ts.isContinueStatement(child) ||
        ts.isReturnStatement(child)
      )
        conditionalSkip = true;
      if (ts.isForOfStatement(child) && child.parent === node.arguments[1].body)
        loops.push(child);
      ts.forEachChild(child, inspect);
    }
    inspect(node.arguments[1]);
    const loop = loops[0];
    const iterable = loop?.expression;
    const binding =
      loop && ts.isVariableDeclarationList(loop.initializer)
        ? loop.initializer.declarations[0]?.name
        : undefined;
    requireValue(
      loops.length === 1 &&
        !conditionalSkip &&
        ts.isElementAccessExpression(iterable) &&
        ts.isIdentifier(iterable.expression) &&
        iterable.expression.text === "cases" &&
        ts.isStringLiteralLike(iterable.argumentExpression) &&
        iterable.argumentExpression.text === id &&
        binding &&
        ts.isObjectBindingPattern(binding) &&
        ["id", "input"].every((name) =>
          binding.elements.some(
            (element) =>
              !element.propertyName &&
              !element.initializer &&
              ts.isIdentifier(element.name) &&
              element.name.text === name,
          ),
        ),
      `Hack test must iterate every local fixture with { id, input } and no conditional skips: ${target.package}/${id}`,
    );
    let apiCall = false;
    let assertion = false;
    let expectation = false;
    function inspectLoop(child) {
      // Extra assertions may be conditional, but the baseline API call,
      // assertion and expectation must cover every iteration unconditionally.
      if (
        ts.isIfStatement(child) ||
        ts.isSwitchStatement(child) ||
        ts.isConditionalExpression(child)
      )
        return;
      if (
        ts.isElementAccessExpression(child) &&
        ts.isIdentifier(child.expression) &&
        child.expression.text === "expected" &&
        ts.isIdentifier(child.argumentExpression) &&
        child.argumentExpression.text === "id"
      )
        expectation = true;
      if (ts.isCallExpression(child) && ts.isIdentifier(child.expression)) {
        if (child.expression.text === "equal") assertion = true;
        if (
          entrypoints.has(child.expression.text) &&
          child.arguments[0] &&
          ts.isIdentifier(child.arguments[0]) &&
          child.arguments[0].text === "input"
        )
          apiCall = true;
      }
      ts.forEachChild(child, inspectLoop);
    }
    inspectLoop(loop.statement);
    requireValue(
      apiCall && assertion && expectation,
      `Hack test must assert the imported package API and read expected[id] within its loop: ${target.package}/${id}`,
    );
    seen.add(id);
  }
  requireValue(
    seen.size === postIds.size,
    `Missing email-client hack tests: ${target.package}`,
  );
  return seen.size;
}

export {
  auditEmailClientHackTests,
  EMAIL_CLIENT_HACK_COMMIT,
  EMAIL_CLIENT_HACK_EXPECTATIONS,
  EMAIL_CLIENT_HACK_FIXTURE,
  EMAIL_CLIENT_HACK_POST_COUNT,
  EMAIL_CLIENT_HACK_REPOSITORY,
  EMAIL_CLIENT_HACK_TARGETS,
  EMAIL_CLIENT_HACK_TESTS,
  emailClientHackFixture,
  validateEmailClientHackExpectations,
  validateEmailClientHacks,
};
