import typeDetect from "type-detect";
import objectPath from "object-path";
import traverse from "ast-monkey-traverse";
const isArr = Array.isArray;
function isObj(something) {
  return typeDetect(something) === "Object";
}

/**
 * deepContains - description
 *
 * @param  {type} tree1 AST, superset or equal
 * @param  {type} tree2 AST, subset or equal
 * @param  {type} cb    each AST node pair is passed to this function,
 * think "t.is" of AVA
 * @param  {type} errCb each AST node type discrepancy (incl. missing node)
 * error is passed to this function, think "t.fail" of AVA
 * @return {type}       undefined - it's a callback-style function
 */
function deepContains(tree1, tree2, cb, errCb, originalOpts) {
  const defaults = {
    skipContainers: true
  };
  const opts = Object.assign({}, defaults, originalOpts);

  if (typeDetect(tree1) !== typeDetect(tree2)) {
    errCb(
      `1st input arg is of a type ${typeDetect(
        tree1
      ).toLowerCase()} but second is ${typeDetect(tree2).toLowerCase()}`
    );
  } else {
    // release AST monkey to traverse tree2, check each node's presence in tree1
    console.log(`028 traversal starts`);
    traverse(tree2, (key, val, innerObj) => {
      const current = val !== undefined ? val : key;
      // retrieve the path of the current node from the monkey
      const { path } = innerObj;
      console.log(
        `034 =========\n${`\u001b[${36}m${`path`}\u001b[${39}m`}: ${path}; ${`\u001b[${36}m${`val`}\u001b[${39}m`} = ${JSON.stringify(
          current,
          null,
          4
        )}`
      );
      // mind you, value on the path might be falsey such as null, so we check
      // its existence not by evaluating, is it truthy, but by path existence:
      if (objectPath.has(tree1, path)) {
        // if tree1 has that path on tree2, call the callback
        const retrieved = objectPath.get(tree1, path);
        if ((!isObj(retrieved) && !isArr(retrieved)) || !opts.skipContainers) {
          cb(objectPath.get(tree1, path), current);
        }
      } else {
        errCb(`first input does not have the path "${path}"`);
      }
      return current;
    });
  }
}

// -----------------------------------------------------------------------------

export default deepContains;
