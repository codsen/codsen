import {
  arrayFirstOnly,
  DELETE,
  del,
  drop,
  type Finding,
  find,
  get,
  type JsonValue,
  set,
  traverse,
} from "ast-monkey";

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
