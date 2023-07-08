import { find, get, drop, del } from "ast-monkey";
import { isEmpty } from "ast-is-empty";
import rfdc from "rfdc";
import { arrObjOrBoth } from "util-array-object-or-both";

import { version as v } from "../package.json";

const clone = rfdc();
const version: string = v;

declare let DEV: boolean;

// ---------------------------------------------------------------------
// MAIN:

export interface Obj {
  [key: string]: any;
}

type Only = "array" | "object" | "any";

export interface Opts {
  key: null | string;
  val: any;
  cleanup: boolean;
  only: Only;
}
const defaults: Opts = {
  key: null,
  val: undefined,
  cleanup: true,
  only: "any",
};

function deleteKey(input: Obj, opts?: Partial<Opts>): Obj {
  function existy(x: any): boolean {
    return x != null;
  }
  if (!existy(input)) {
    throw new Error(
      "object-delete-key/deleteKey(): [THROW_ID_01] Please provide the first argument, something to work upon.",
    );
  }
  let resolvedOpts: Opts = { ...defaults, ...opts };
  resolvedOpts.only = arrObjOrBoth(resolvedOpts.only, {
    msg: "object-delete-key/deleteKey(): [THROW_ID_03]",
    optsVarName: "resolvedOpts.only",
  });
  // after this, resolvedOpts.only is equal to either: 1) object, 2) array OR 3) any

  if (!existy(resolvedOpts.key) && !existy(resolvedOpts.val)) {
    throw new Error(
      "object-delete-key/deleteKey(): [THROW_ID_04] Please provide at least a key or a value.",
    );
  }
  let resolvedInput = clone(input);
  DEV &&
    console.log(
      `059 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`resolvedInput`}\u001b[${39}m`} = ${JSON.stringify(
        resolvedInput,
        null,
        4,
      )}; keys = ${Object.keys(resolvedInput)}`,
    );

  if (resolvedOpts.cleanup) {
    let findings = find(resolvedInput, {
      key: resolvedOpts.key,
      val: resolvedOpts.val,
      only: resolvedOpts.only,
    });
    DEV &&
      console.log(
        `074 ${`\u001b[${33}m${`findings`}\u001b[${39}m`} = ${JSON.stringify(
          findings,
          null,
          4,
        )}`,
      );
    let currentIndex: number;
    let nodeToDelete: number;
    while (Array.isArray(findings) && findings.length) {
      DEV && console.log(`083 ███████████████████████████████████████ LOOP`);
      nodeToDelete = findings[0].index;
      DEV &&
        console.log(
          `087 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`nodeToDelete`}\u001b[${39}m`} = ${JSON.stringify(
            nodeToDelete,
            null,
            4,
          )}`,
        );
      for (let i = 1, len = findings[0].path.length; i < len; i++) {
        currentIndex = findings[0].path[len - 1 - i];
        if (
          isEmpty(
            del(get(resolvedInput, { index: currentIndex }) as Obj, {
              key: resolvedOpts.key,
              val: resolvedOpts.val,
              only: resolvedOpts.only,
            }),
          )
        ) {
          nodeToDelete = currentIndex;
        }
      }
      resolvedInput = drop(resolvedInput, { index: nodeToDelete }) as Obj;
      findings = find(resolvedInput, {
        key: resolvedOpts.key,
        val: resolvedOpts.val,
        only: resolvedOpts.only,
      });
    }
    DEV &&
      console.log(`115 ███████████████████████████████████████ END OF A LOOP`);
    DEV &&
      console.log(
        `118 ${`\u001b[${32}m${`FINAL`}\u001b[${39}m`} ${`\u001b[${33}m${`resolvedInput`}\u001b[${39}m`} = ${JSON.stringify(
          resolvedInput,
          null,
          4,
        )}`,
      );
    return resolvedInput;
  }
  DEV && console.log(`126 ${`\u001b[${32}m${`CALL`}\u001b[${39}m`} del();`);
  DEV &&
    console.log(
      `129 ${`\u001b[${33}m${`resolvedInput`}\u001b[${39}m`} = ${JSON.stringify(
        resolvedInput,
        null,
        4,
      )}; resolvedOpts = ${JSON.stringify(
        {
          key: resolvedOpts.key,
          val: resolvedOpts.val,
          only: resolvedOpts.only,
        },
        null,
        4,
      )}`,
    );
  return del(resolvedInput, {
    key: resolvedOpts.key,
    val: resolvedOpts.val,
    only: resolvedOpts.only,
  }) as Obj;
}

export { deleteKey, defaults, version };
