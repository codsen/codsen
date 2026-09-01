import {
  type Callback,
  DELETE,
  type ReadonlyTreeContainer,
  type TreeValue,
  traverse,
} from "ast-monkey-traverse";

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
