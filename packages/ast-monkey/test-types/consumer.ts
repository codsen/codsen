import {
  arrayFirstOnly,
  type Callback,
  DELETE,
  del,
  drop,
  type Finding,
  find,
  get,
  type JsonValue,
  type LookaheadCallback,
  type LookaheadInnerObj,
  type LookaheadNextToken,
  type ReadonlyTreeContainer,
  set,
  type TreeValue,
  traverse,
  traverseWithLookahead,
} from "ast-monkey";
import {
  traverseWithLookahead as observeSubpath,
  type LookaheadCallback as SubpathLookaheadCallback,
} from "ast-monkey/lookahead";
import {
  DELETE as SUBPATH_DELETE,
  type Callback as SubpathCallback,
  traverse as traverseSubpath,
} from "ast-monkey/traverse";

const rootDeleteFromSubpath: typeof DELETE = SUBPATH_DELETE;
const subpathDeleteFromRoot: typeof SUBPATH_DELETE = DELETE;
const deleteFromRoot: SubpathCallback = () => DELETE;
const deleteFromSubpath: Callback = () => SUBPATH_DELETE;
const sameObserver: SubpathLookaheadCallback = (_key, _value, metadata) => {
  const rootMetadata: LookaheadInnerObj = metadata;
  void rootMetadata;
};
traverseSubpath([1], deleteFromSubpath);
traverse([1], deleteFromRoot);
observeSubpath([1], sameObserver, 1);
void rootDeleteFromSubpath;
void subpathDeleteFromRoot;

const input: JsonValue = { a: [undefined, "x"], b: null };

const byKey: Finding[] = find(input, { key: "a" });
const byValue: Finding[] = find(input, { val: null });
const explicitUndefined: Finding[] = find(input, {
  criteria: { kind: "value", value: undefined },
});
const legacyUndefined: Finding[] = find(input, { val: undefined });
const explicitEntry: Finding[] = find(input, {
  criteria: { kind: "entry", key: "a", value: undefined },
  only: "objects",
});
const foundByStringIndex: JsonValue = get(input, {
  index: "2",
  only: "arrays",
});
const setByValue: JsonValue = set(input, { index: 1, val: undefined });
const setByLegacyKey: JsonValue = set(input, { index: "1", key: "renamed" });
const dropped: JsonValue = drop(input, { index: "1" });
const deleted: JsonValue = del(input, {
  criteria: { kind: "key", key: null },
});
const firstOnly: JsonValue = arrayFirstOnly(input);
const traversed: JsonValue = traverse(input, (key, value, innerObj) => {
  const current = innerObj.parentType === "object" ? value : key;
  return current === "x" ? DELETE : current;
});

void byKey;
void byValue;
void explicitUndefined;
void legacyUndefined;
void explicitEntry;
void foundByStringIndex;
void setByValue;
void setByLegacyKey;
void dropped;
void deleted;
void firstOnly;
void traversed;

// @ts-expect-error A find selector is required.
find(input, {});
// @ts-expect-error Criteria cannot be mixed with legacy selectors.
find(input, { criteria: { kind: "key", key: "a" }, key: "a" });
// @ts-expect-error Entry criteria require both fields.
find(input, { criteria: { kind: "entry", key: "a" } });
// @ts-expect-error A replacement value or legacy key is required.
set(input, { index: 1 });
// @ts-expect-error Only supported aliases are accepted.
get(input, { index: 1, only: "records" });

const transformed: TreeValue = traverse(
  { count: 1 },
  (key, value, innerObj) => {
    const exactPath: readonly string[] = innerObj.pathSegments;
    const parent: ReadonlyTreeContainer = innerObj.parent;
    const parentKind: "array" | "object" = innerObj.parentType;

    void exactPath;
    void parent;
    void parentKind;

    if (value === 1) {
      return "one";
    }
    return innerObj.parentType === "object" ? value : key;
  },
);

void transformed;

const deleteNumbers: Callback = (key, value) => {
  const current = value !== undefined ? value : key;
  return typeof current === "number" ? DELETE : current;
};

traverse([1, 2, 3], deleteNumbers);

const numbersRemainData: TreeValue = traverse([Number.NaN], (key) => key);
void numbersRemainData;

traverse({ nested: { value: 1 } }, (key, value, innerObj) => {
  // @ts-expect-error Parent snapshots are deeply readonly.
  innerObj.parent.changed = true;
  // @ts-expect-error Exact metadata paths are readonly.
  innerObj.pathSegments.push("changed");
  return innerObj.parentType === "object" ? value : key;
});

// @ts-expect-error Traversal can replace or delete nodes, so the result is not the input shape.
const unsoundIdentity: { count: number } = traverse(
  { count: 1 },
  (key, value) => (value !== undefined ? "changed" : key),
);

void unsoundIdentity;

// @ts-expect-error The supported tree model excludes Date instances.
traverse(new Date(), (key, value) => (value !== undefined ? value : key));

// @ts-expect-error Callback results must remain in the supported tree model.
const invalidResult: Callback = () => Symbol("unsupported");

void invalidResult;

const observe: LookaheadCallback = (key, value, metadata, stop) => {
  const details: LookaheadInnerObj = metadata;
  const upcoming: LookaheadNextToken[] | undefined = details.next;
  stop.now = false;
  void upcoming;
  return value === undefined ? key : value;
};
// biome-ignore lint/suspicious/noConfusingVoidType: verifies the observer's declared return type
const observed: void = traverseWithLookahead(input, observe, 2);
void observed;
