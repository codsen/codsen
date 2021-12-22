import { find, get, drop, del } from "ast-monkey";
import { isEmpty } from "ast-is-empty";
import clone from "lodash.clonedeep";
import { arrObjOrBoth } from "util-array-object-or-both";

import { version as v } from "../package.json";

const version: string = v;

// ---------------------------------------------------------------------
// MAIN:

interface Obj {
  [key: string]: any;
}

type Only = "array" | "object" | "any";

interface Opts {
  key: null | string;
  val: any;
  cleanup: boolean;
  only: Only;
}

function deleteKey(originalInput: Obj, originalOpts?: Partial<Opts>): Obj {
  function existy(x: any): boolean {
    return x != null;
  }
  if (!existy(originalInput)) {
    throw new Error(
      "object-delete-key/deleteKey(): [THROW_ID_01] Please provide the first argument, something to work upon."
    );
  }
  let defaults = {
    key: null,
    val: undefined,
    cleanup: true,
    only: "any" as Only,
  };
  let opts: Opts = { ...defaults, ...originalOpts };
  opts.only = arrObjOrBoth(opts.only, {
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
    `055 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`input`}\u001b[${39}m`} = ${JSON.stringify(
      input,
      null,
      4
    )}; keys = ${Object.keys(input)}`
  );

  if (opts.cleanup) {
    let findings = find(input, {
      key: opts.key,
      val: opts.val,
      only: opts.only,
    });
    console.log(
      `069 ${`\u001b[${33}m${`findings`}\u001b[${39}m`} = ${JSON.stringify(
        findings,
        null,
        4
      )}`
    );
    let currentIndex: number;
    let nodeToDelete: number;
    while (Array.isArray(findings) && findings.length) {
      console.log(`078 ███████████████████████████████████████ LOOP`);
      nodeToDelete = findings[0].index;
      console.log(
        `081 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`nodeToDelete`}\u001b[${39}m`} = ${JSON.stringify(
          nodeToDelete,
          null,
          4
        )}`
      );
      for (let i = 1, len = findings[0].path.length; i < len; i++) {
        currentIndex = findings[0].path[len - 1 - i];
        if (
          isEmpty(
            del(get(input, { index: currentIndex }) as Obj, {
              key: opts.key,
              val: opts.val,
              only: opts.only,
            })
          )
        ) {
          nodeToDelete = currentIndex;
        }
      }
      input = drop(input, { index: nodeToDelete }) as Obj;
      findings = find(input, { key: opts.key, val: opts.val, only: opts.only });
    }
    console.log(`104 ███████████████████████████████████████ END OF A LOOP`);
    console.log(
      `106 ${`\u001b[${32}m${`FINAL`}\u001b[${39}m`} ${`\u001b[${33}m${`input`}\u001b[${39}m`} = ${JSON.stringify(
        input,
        null,
        4
      )}`
    );
    return input;
  }
  console.log(`114 ${`\u001b[${32}m${`CALL`}\u001b[${39}m`} del();`);
  console.log(
    `116 ${`\u001b[${33}m${`input`}\u001b[${39}m`} = ${JSON.stringify(
      input,
      null,
      4
    )}; opts = ${JSON.stringify(
      { key: opts.key, val: opts.val, only: opts.only },
      null,
      4
    )}`
  );
  return del(input, { key: opts.key, val: opts.val, only: opts.only }) as Obj;
}

export { deleteKey, version };
