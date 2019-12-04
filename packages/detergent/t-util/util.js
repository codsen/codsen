const obc = require("object-boolean-combinations");
const clone = require("lodash.clonedeep");
const { defaultOpts } = require("../dist/util.cjs");
const detergent = require("../dist/detergent.cjs");
const det1 = detergent.det;
const exportedOptsObj = detergent.opts;
const isCI = require("is-ci");
const objectPath = require("object-path");

function mixer(ref) {
  // for quick testing, you can short-wire to test only one set of options, instead
  // of 512, 2024, or whatever count mixer produced.
  const quickie = false;

  if (!isCI && quickie) {
    if (ref) {
      return [ref];
    }
    return [defaultOpts];
  }

  // clone and delete defaultOptsWithoutStripHtmlButIgnoreTags
  // key from the defaults obj
  const preppedDefaults = clone(defaultOpts);
  delete preppedDefaults.stripHtmlButIgnoreTags;
  delete preppedDefaults.stripHtmlAddNewLine;
  delete preppedDefaults.eol;
  delete preppedDefaults.cb;

  const res = obc(preppedDefaults, ref);
  // restore keys in stripHtmlButIgnoreTags:
  if (
    ref &&
    ref.stripHtmlButIgnoreTags &&
    Array.isArray(ref.stripHtmlButIgnoreTags) &&
    ref.stripHtmlButIgnoreTags.length
  ) {
    res.forEach(obj => {
      obj.stripHtmlButIgnoreTags = clone(ref.stripHtmlButIgnoreTags);
    });
  } else {
    res.forEach(obj => {
      obj.stripHtmlButIgnoreTags = clone(defaultOpts.stripHtmlButIgnoreTags);
    });
  }
  // restore keys in stripHtmlAddNewLine:
  if (
    ref &&
    ref.stripHtmlAddNewLine &&
    Array.isArray(ref.stripHtmlAddNewLine) &&
    ref.stripHtmlAddNewLine.length
  ) {
    res.forEach(obj => {
      obj.stripHtmlAddNewLine = clone(ref.stripHtmlAddNewLine);
    });
  } else {
    res.forEach(obj => {
      obj.stripHtmlAddNewLine = clone(defaultOpts.stripHtmlAddNewLine);
    });
  }
  // restore keys in eol:
  if (ref && ref.eol) {
    res.forEach(obj => {
      obj.eol = ref.eol;
    });
  } else {
    res.forEach(obj => {
      obj.eol = defaultOpts.eol;
    });
  }
  // restore keys in cb:
  if (ref && ref.cb) {
    res.forEach(obj => {
      obj.cb = ref.cb;
    });
  } else {
    res.forEach(obj => {
      obj.cb = defaultOpts.cb;
    });
  }
  return res;
}

// // set a different eol, cycle the list of eol's from "settledObj1Eol":
// const allEols = ["crlf", "cr", "lf"];
// const obj1Idx = allEols.indexOf(settledObj1Eol);
// objectPath.set(obj2, "eol", allEols[(obj1Idx + 1) % 3]);

// t is passed AVA test instance
// n is index number of a test - we need to run the resource-heavy applicable
// test calculations only for the n === 0
function det(t, n, src, opts = {}) {
  if (!n) {
    const resolvedOpts = Object.assign({}, exportedOptsObj, opts);
    const tempObj = {};
    Object.keys(resolvedOpts).forEach(key => {
      if (
        !["stripHtmlButIgnoreTags", "stripHtmlAddNewLine", "cb"].includes(key)
      ) {
        tempObj[key] = !!resolvedOpts[key];
      }
    });

    Object.keys(tempObj).forEach(key => {
      if (key === "eol") {
        //
        //
        //                         IT'S opts.eol
        //
        //
        //
        // 1. prepare opts to ask for LF ending:
        const obj1 = clone(tempObj);
        objectPath.set(obj1, "eol", "lf");
        // add stripHtmlButIgnoreTags and stripHtmlAddNewLine
        objectPath.set(
          obj1,
          "stripHtmlButIgnoreTags",
          objectPath.has(opts, "stripHtmlButIgnoreTags")
            ? opts.stripHtmlButIgnoreTags
            : defaultOpts.stripHtmlButIgnoreTags
        );
        objectPath.set(
          obj1,
          "stripHtmlAddNewLine",
          objectPath.has(opts, "stripHtmlAddNewLine")
            ? opts.stripHtmlAddNewLine
            : defaultOpts.stripHtmlAddNewLine
        );

        //
        // 2. prepare opts to ask for CR ending:
        const obj2 = clone(tempObj);
        objectPath.set(obj2, "eol", "cr");
        // add stripHtmlButIgnoreTags and stripHtmlAddNewLine
        objectPath.set(
          obj2,
          "stripHtmlButIgnoreTags",
          objectPath.has(opts, "stripHtmlButIgnoreTags")
            ? opts.stripHtmlButIgnoreTags
            : defaultOpts.stripHtmlButIgnoreTags
        );
        objectPath.set(
          obj2,
          "stripHtmlAddNewLine",
          objectPath.has(opts, "stripHtmlAddNewLine")
            ? opts.stripHtmlAddNewLine
            : defaultOpts.stripHtmlAddNewLine
        );

        //
        // 3. prepare opts to ask for CRLF ending:
        const obj3 = clone(tempObj);
        objectPath.set(obj3, "eol", "crlf");
        // add stripHtmlButIgnoreTags and stripHtmlAddNewLine
        objectPath.set(
          obj3,
          "stripHtmlButIgnoreTags",
          objectPath.has(opts, "stripHtmlButIgnoreTags")
            ? opts.stripHtmlButIgnoreTags
            : defaultOpts.stripHtmlButIgnoreTags
        );
        objectPath.set(
          obj3,
          "stripHtmlAddNewLine",
          objectPath.has(opts, "stripHtmlAddNewLine")
            ? opts.stripHtmlAddNewLine
            : defaultOpts.stripHtmlAddNewLine
        );

        //
        // 4. assertions - there are three settings so we compare like a triangle
        if (
          det1(src, obj1).res !== det1(src, obj2).res ||
          det1(src, obj2).res !== det1(src, obj3).res ||
          det1(src, obj1).res !== det1(src, obj3).res
        ) {
          t.ok(
            det1(src, resolvedOpts).applicableOpts[key],
            `${`\u001b[${35}m${`applicableOpts.${key}`}\u001b[${39}m`} is reported wrongly: detergent yields different results on different opts.${key}:
    "${`\u001b[${33}m${JSON.stringify(
      det1(src, obj1).res,
      null,
      4
    )}\u001b[${39}m`}" (opts.${key}="lf") and "${`\u001b[${33}m${JSON.stringify(
              det1(src, obj2).res,
              null,
              4
            )}\u001b[${39}m`}" (opts.${key}="cr") and "${`\u001b[${33}m${JSON.stringify(
              det1(src, obj3).res,
              null,
              4
            )}\u001b[${39}m`}" (opts.${key}="crlf"). Input was:\n${JSON.stringify(
              src,
              null,
              4
            )}. Opts objects:\n\nobj1:\n${JSON.stringify(
              obj1,
              null,
              4
            )}\nobj2:${JSON.stringify(obj2, null, 4)}\nobj3:${JSON.stringify(
              obj3,
              null,
              4
            )}\n`
          );
        } else {
          t.notOk(
            det1(src, resolvedOpts).applicableOpts[key],
            `${`\u001b[${35}m${`applicableOpts.${key}`}\u001b[${39}m`} is reported wrongly: detergent yields same results on all different opts.${key} settings:
    "${`\u001b[${33}m${JSON.stringify(
      det1(src, obj1).res,
      null,
      4
    )}\u001b[${39}m`}". Input was:\n${JSON.stringify(
              src,
              null,
              4
            )}. Opts objects:\n\nobj1:\n${JSON.stringify(
              obj1,
              null,
              4
            )}\nobj2:${JSON.stringify(obj2, null, 4)}\nobj3:${JSON.stringify(
              obj3,
              null,
              4
            )}\n`
          );
        }
      } else if (key !== "cb") {
        //
        //
        //                      IT'S NOT opts.eol
        //
        //
        //
        // If toggling any of the options makes a difference,
        // that option must be reported as "applicable". And on the opposite.

        // incoming object might be with digits instead of boolean values,
        // so we convert whatever value is to a boolean
        const obj1 = clone(tempObj);
        objectPath.set(obj1, key, true);
        // add stripHtmlButIgnoreTags and stripHtmlAddNewLine
        objectPath.set(
          obj1,
          "stripHtmlButIgnoreTags",
          objectPath.has(opts, "stripHtmlButIgnoreTags")
            ? opts.stripHtmlButIgnoreTags
            : defaultOpts.stripHtmlButIgnoreTags
        );
        objectPath.set(
          obj1,
          "stripHtmlAddNewLine",
          objectPath.has(opts, "stripHtmlAddNewLine")
            ? opts.stripHtmlAddNewLine
            : defaultOpts.stripHtmlAddNewLine
        );
        const settledObj1Eol = objectPath.has(opts, "eol")
          ? opts.eol
          : defaultOpts.eol;
        objectPath.set(obj1, "eol", settledObj1Eol);
        // console.log(
        //   `${`\u001b[${33}m${`obj1`}\u001b[${39}m`} = ${JSON.stringify(
        //     obj1,
        //     null,
        //     4
        //   )}`
        // );

        const obj2 = clone(tempObj);
        objectPath.set(obj2, key, false);
        // add stripHtmlButIgnoreTags and stripHtmlAddNewLine
        objectPath.set(
          obj2,
          "stripHtmlButIgnoreTags",
          objectPath.has(opts, "stripHtmlButIgnoreTags")
            ? opts.stripHtmlButIgnoreTags
            : defaultOpts.stripHtmlButIgnoreTags
        );
        objectPath.set(
          obj2,
          "stripHtmlAddNewLine",
          objectPath.has(opts, "stripHtmlAddNewLine")
            ? opts.stripHtmlAddNewLine
            : defaultOpts.stripHtmlAddNewLine
        );
        const settledObj2Eol = objectPath.has(opts, "eol")
          ? opts.eol
          : defaultOpts.eol;
        objectPath.set(obj2, "eol", settledObj2Eol);

        // console.log(
        //   `${`\u001b[${33}m${`obj2`}\u001b[${39}m`} = ${JSON.stringify(
        //     obj2,
        //     null,
        //     4
        //   )}`
        // );

        if (det1(src, obj1).res !== det1(src, obj2).res) {
          t.ok(
            det1(src, resolvedOpts).applicableOpts[key],
            `${`\u001b[${35}m${`applicableOpts.${key}`}\u001b[${39}m`} is reported wrongly: detergent yields different results on different opts.${key}:
    "${`\u001b[${33}m${JSON.stringify(
      det1(src, obj1).res,
      null,
      4
    )}\u001b[${39}m`}" (opts.${key}=true) and "${`\u001b[${33}m${JSON.stringify(
              det1(src, obj2).res,
              null,
              4
            )}\u001b[${39}m`}" (opts.${key}=false). Input was:\n${JSON.stringify(
              src,
              null,
              4
            )}. Opts objects:\n\nobj1:\n${JSON.stringify(
              obj1,
              null,
              4
            )}\nobj2:${JSON.stringify(obj2, null, 4)}\n`
          );
        } else if (key !== "stripHtml") {
          t.notOk(
            det1(src, resolvedOpts).applicableOpts[key],
            `${`\u001b[${35}m${`applicableOpts.${key}`}\u001b[${39}m`} is reported wrongly: detergent yields same results on different opts.${key}:
    "${`\u001b[${33}m${JSON.stringify(
      det1(src, obj1).res,
      null,
      4
    )}\u001b[${39}m`}". Input was:\n${JSON.stringify(
              src,
              null,
              4
            )}. Opts objects:\n\nobj1:\n${JSON.stringify(
              obj1,
              null,
              4
            )}\nobj2:${JSON.stringify(obj2, null, 4)}\n`
          );
        }
      }
    });
  }
  return det1(src, opts);
}

const allCombinations = clone(mixer());

module.exports = { det, mixer, allCombinations };
