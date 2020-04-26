import { find, get, drop, del } from "ast-monkey";
import isEmpty from "ast-is-empty";
import clone from "lodash.clonedeep";
import validateTheOnly from "util-array-object-or-both";

// ---------------------------------------------------------------------
// MAIN:

function deleteKey(originalInput, originalOpts) {
  function existy(x) {
    return x != null;
  }
  if (!existy(originalInput)) {
    throw new Error(
      "object-delete-key/deleteKey(): [THROW_ID_01] Please provide the first argument, something to work upon."
    );
  }
  const defaults = {
    key: null,
    val: undefined,
    cleanup: true,
    only: "any",
  };
  const opts = { ...defaults, ...originalOpts };
  opts.only = validateTheOnly(opts.only, {
    msg: "object-delete-key/deleteKey(): [THROW_ID_03]",
    optsVarName: "opts.only",
  });
  // after this, opts.only is equal to either: 1) object, 2) array OR 3) any

  if (!existy(opts.key) && !existy(opts.val)) {
    throw new Error(
      "object-delete-key/deleteKey(): [THROW_ID_04] Please provide at least a key or a value."
    );
  }
  let input = clone(originalInput);
  console.log(
    `038 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`input`}\u001b[${39}m`} = ${JSON.stringify(
      input,
      null,
      4
    )}`
  );

  if (opts.cleanup) {
    let findings = find(input, {
      key: opts.key,
      val: opts.val,
      only: opts.only,
    });
    console.log(
      `052 ${`\u001b[${33}m${`findings`}\u001b[${39}m`} = ${JSON.stringify(
        findings,
        null,
        4
      )}`
    );
    let currentIndex;
    let nodeToDelete;
    while (findings) {
      console.log(`061 ███████████████████████████████████████ LOOP`);
      nodeToDelete = findings[0].index;
      for (let i = 1, len = findings[0].path.length; i < len; i++) {
        currentIndex = findings[0].path[len - 1 - i];
        if (
          isEmpty(
            del(get(input, { index: currentIndex }), {
              key: opts.key,
              val: opts.val,
              only: opts.only,
            })
          )
        ) {
          nodeToDelete = currentIndex;
        }
      }
      input = drop(input, { index: nodeToDelete });
      findings = find(input, { key: opts.key, val: opts.val, only: opts.only });
    }
    console.log(`080 ███████████████████████████████████████ END OF A LOOP`);
    console.log(
      `082 ${`\u001b[${32}m${`FINAL`}\u001b[${39}m`} ${`\u001b[${33}m${`input`}\u001b[${39}m`} = ${JSON.stringify(
        input,
        null,
        4
      )}`
    );
    return input;
  }
  return del(input, { key: opts.key, val: opts.val, only: opts.only });
}

export default deleteKey;
