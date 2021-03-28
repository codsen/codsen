/**
 * ast-monkey
 * Traverse and edit AST
 * Version: 7.13.11
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://codsen.com/os/ast-monkey/
 */

import { arrObjOrBoth } from 'util-array-object-or-both';
import { checkTypesMini } from 'check-types-mini';
import { compare } from 'ast-compare';
import { traverse } from 'ast-monkey-traverse';
export { traverse } from 'ast-monkey-traverse';

var version$1 = "7.13.11";

const version = version$1;
function existy(x) {
  return x != null;
}
function notUndef(x) {
  return x !== undefined;
}
function compareIsEqual(a, b) {
  if (typeof a !== typeof b) {
    return false;
  }
  return !!compare(a, b, {
    matchStrictly: true,
    useWildcards: true
  });
}
function isObj(something) {
  return something && typeof something === "object" && !Array.isArray(something);
}
function monkey(originalInput, originalOpts) {
  if (!existy(originalInput)) {
    throw new Error("ast-monkey/main.js/monkey(): [THROW_ID_01] Please provide an input");
  }
  const opts = { ...originalOpts
  };
  const data = {
    count: 0,
    gatherPath: [],
    finding: null
  };
  const findings = [];
  let ko = false;
  let vo = false;
  if (existy(opts.key) && !notUndef(opts.val)) {
    ko = true;
  }
  if (!existy(opts.key) && notUndef(opts.val)) {
    vo = true;
  }
  let input = originalInput;
  if (opts.mode === "arrayFirstOnly" && Array.isArray(input) && input.length > 0) {
    input = [input[0]];
  }
  input = traverse(input, (key, val, innerObj) => {
    let temp;
    data.count += 1;
    data.gatherPath.length = innerObj.depth;
    data.gatherPath.push(data.count);
    if (opts.mode === "get") {
      if (data.count === opts.index) {
        if (notUndef(val)) {
          data.finding = {};
          data.finding[key] = val;
        } else {
          data.finding = key;
        }
      }
    } else if (opts.mode === "find" || opts.mode === "del") {
      if (
      (opts.only === "any" || opts.only === "array" && val === undefined || opts.only === "object" && val !== undefined) && (
      ko && compareIsEqual(key, opts.key) || vo && compareIsEqual(val, opts.val) || !ko && !vo && compareIsEqual(key, opts.key) && compareIsEqual(val, opts.val))) {
        if (opts.mode === "find") {
          temp = {
            index: data.count,
            key,
            val,
            path: [...data.gatherPath]
          };
          findings.push(temp);
        } else {
          return NaN;
        }
      } else {
        return val !== undefined ? val : key;
      }
    }
    if (opts.mode === "set" && data.count === opts.index) {
      return opts.val;
    }
    if (opts.mode === "drop" && data.count === opts.index) {
      return NaN;
    }
    if (opts.mode === "arrayFirstOnly") {
      if (notUndef(val) && Array.isArray(val)) {
        return [val[0]];
      }
      if (existy(key) && Array.isArray(key)) {
        return [key[0]];
      }
      return val !== undefined ? val : key;
    }
    return val !== undefined ? val : key;
  });
  if (opts.mode === "get") {
    return data.finding;
  }
  if (opts.mode === "find") {
    return findings;
  }
  return input;
}
function find(input, originalOpts) {
  if (!existy(input)) {
    throw new Error("ast-monkey/main.js/find(): [THROW_ID_02] Please provide the input");
  }
  if (!isObj(originalOpts) || originalOpts.key === undefined && originalOpts.val === undefined) {
    throw new Error("ast-monkey/main.js/find(): [THROW_ID_03] Please provide opts.key or opts.val");
  }
  const opts = { ...originalOpts
  };
  checkTypesMini(opts, null, {
    schema: {
      key: ["null", "string"],
      val: "any",
      only: ["undefined", "null", "string"]
    },
    msg: "ast-monkey/get(): [THROW_ID_04*]"
  });
  if (typeof opts.only === "string" && opts.only.length > 0) {
    opts.only = arrObjOrBoth(opts.only, {
      optsVarName: "opts.only",
      msg: "ast-monkey/find(): [THROW_ID_05*]"
    });
  } else {
    opts.only = "any";
  }
  return monkey(input, { ...opts,
    mode: "find"
  });
}
function get(input, originalOpts) {
  if (!existy(input)) {
    throw new Error("ast-monkey/main.js/get(): [THROW_ID_06] Please provide the input");
  }
  if (!isObj(originalOpts)) {
    throw new Error("ast-monkey/main.js/get(): [THROW_ID_07] Please provide the opts");
  }
  if (!existy(originalOpts.index)) {
    throw new Error("ast-monkey/main.js/get(): [THROW_ID_08] Please provide opts.index");
  }
  const opts = { ...originalOpts
  };
  if (typeof opts.index === "string" && /^\d*$/.test(opts.index)) {
    opts.index = +opts.index;
  } else if (!Number.isInteger(opts.index)) {
    throw new Error(`ast-monkey/main.js/get(): [THROW_ID_11] opts.index must be a natural number. It was given as: ${opts.index} (type ${typeof opts.index})`);
  }
  return monkey(input, { ...opts,
    mode: "get"
  });
}
function set(input, originalOpts) {
  if (!existy(input)) {
    throw new Error("ast-monkey/main.js/set(): [THROW_ID_12] Please provide the input");
  }
  if (!isObj(originalOpts)) {
    throw new Error("ast-monkey/main.js/set(): [THROW_ID_13] Please provide the input");
  }
  if (!existy(originalOpts.key) && !notUndef(originalOpts.val)) {
    throw new Error("ast-monkey/main.js/set(): [THROW_ID_14] Please provide opts.val");
  }
  if (!existy(originalOpts.index)) {
    throw new Error("ast-monkey/main.js/set(): [THROW_ID_15] Please provide opts.index");
  }
  const opts = { ...originalOpts
  };
  if (typeof opts.index === "string" && /^\d*$/.test(opts.index)) {
    opts.index = +opts.index;
  } else if (!Number.isInteger(opts.index)) {
    throw new Error(`ast-monkey/main.js/set(): [THROW_ID_17] opts.index must be a natural number. It was given as: ${opts.index}`);
  }
  if (existy(opts.key) && !notUndef(opts.val)) {
    opts.val = opts.key;
  }
  checkTypesMini(opts, null, {
    schema: {
      key: [null, "string"],
      val: "any",
      index: "number"
    },
    msg: "ast-monkey/set(): [THROW_ID_18*]"
  });
  return monkey(input, { ...opts,
    mode: "set"
  });
}
function drop(input, originalOpts) {
  if (!existy(input)) {
    throw new Error("ast-monkey/main.js/drop(): [THROW_ID_19] Please provide the input");
  }
  if (!isObj(originalOpts)) {
    throw new Error("ast-monkey/main.js/drop(): [THROW_ID_20] Please provide the input");
  }
  if (!existy(originalOpts.index)) {
    throw new Error("ast-monkey/main.js/drop(): [THROW_ID_21] Please provide opts.index");
  }
  const opts = { ...originalOpts
  };
  if (typeof opts.index === "string" && /^\d*$/.test(opts.index)) {
    opts.index = +opts.index;
  } else if (!Number.isInteger(opts.index)) {
    throw new Error(`ast-monkey/main.js/drop(): [THROW_ID_23] opts.index must be a natural number. It was given as: ${opts.index}`);
  }
  return monkey(input, { ...opts,
    mode: "drop"
  });
}
function del(input, originalOpts) {
  if (!existy(input)) {
    throw new Error("ast-monkey/main.js/del(): [THROW_ID_26] Please provide the input");
  }
  if (!isObj(originalOpts)) {
    throw new Error("ast-monkey/main.js/del(): [THROW_ID_27] Please provide the opts object");
  }
  if (!existy(originalOpts.key) && !notUndef(originalOpts.val)) {
    throw new Error("ast-monkey/main.js/del(): [THROW_ID_28] Please provide opts.key or opts.val");
  }
  const opts = { ...originalOpts
  };
  checkTypesMini(opts, null, {
    schema: {
      key: [null, "string"],
      val: "any",
      only: ["undefined", "null", "string"]
    },
    msg: "ast-monkey/drop(): [THROW_ID_29*]"
  });
  if (typeof opts.only === "string" && opts.only.length > 0) {
    opts.only = arrObjOrBoth(opts.only, {
      msg: "ast-monkey/del(): [THROW_ID_30*]",
      optsVarName: "opts.only"
    });
  } else {
    opts.only = "any";
  }
  return monkey(input, { ...opts,
    mode: "del"
  });
}
function arrayFirstOnly(input) {
  if (!existy(input)) {
    throw new Error("ast-monkey/main.js/arrayFirstOnly(): [THROW_ID_31] Please provide the input");
  }
  return monkey(input, {
    mode: "arrayFirstOnly"
  });
}

export { arrayFirstOnly, del, drop, find, get, set, version };
