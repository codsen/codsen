import clone from "lodash.clonedeep";
// eslint-disable-next-line n/no-extraneous-import
import objectPath from "object-path";
import { mixer as originalMixer } from "test-mixer";

import { det as det1, opts as defaults } from "../dist/detergent.esm.js";

export const widowRegexTest = /. ./g;
export const latinAndNonNonLatinRanges = [
  [0, 880],
  [887, 890],
  [894, 900],
  [906, 908],
  [908, 910],
  [929, 931],
  [1319, 1329],
  [1366, 1369],
  [1375, 1377],
  [1415, 1417],
  [1418, 1423],
  [1423, 1425],
  [1479, 1488],
  [1514, 1520],
  [1524, 1536],
  [1540, 1542],
  [1563, 1566],
  [1805, 1807],
  [1866, 1869],
  [1969, 1984],
  [2042, 2048],
  [2093, 2096],
  [2110, 2112],
  [2139, 2142],
  [2142, 2208],
  [2208, 2210],
  [2220, 2276],
  [2302, 2304],
  [2423, 2425],
  [2431, 2433],
  [2435, 2437],
  [2444, 2447],
  [2448, 2451],
  [2472, 2474],
  [2480, 2482],
  [2482, 2486],
  [2489, 2492],
  [2500, 2503],
  [2504, 2507],
  [2510, 2519],
  [2519, 2524],
  [2525, 2527],
  [2531, 2534],
  [2555, 2561],
  [2563, 2565],
  [2570, 2575],
  [2576, 2579],
  [2600, 2602],
  [2608, 2610],
  [2611, 2613],
  [2614, 2616],
  [2617, 2620],
  [2620, 2622],
  [2626, 2631],
  [2632, 2635],
  [2637, 2641],
  [2641, 2649],
  [2652, 2654],
  [2654, 2662],
  [2677, 2689],
  [2691, 2693],
  [2701, 2703],
  [2705, 2707],
  [2728, 2730],
  [2736, 2738],
  [2739, 2741],
  [2745, 2748],
  [2757, 2759],
  [2761, 2763],
  [2765, 2768],
  [2768, 2784],
  [2787, 2790],
  [2801, 2817],
  [2819, 2821],
  [2828, 2831],
  [2832, 2835],
  [2856, 2858],
  [2864, 2866],
  [2867, 2869],
  [2873, 2876],
  [2884, 2887],
  [2888, 2891],
  [2893, 2902],
  [2903, 2908],
  [2909, 2911],
  [2915, 2918],
  [2935, 2946],
  [2947, 2949],
  [2954, 2958],
  [2960, 2962],
  [2965, 2969],
  [2970, 2972],
  [2972, 2974],
  [2975, 2979],
  [2980, 2984],
  [2986, 2990],
  [3001, 3006],
  [3010, 3014],
  [3016, 3018],
  [3021, 3024],
  [3024, 3031],
  [3031, 3046],
  [3066, 3073],
  [3075, 3077],
  [3084, 3086],
  [3088, 3090],
  [3112, 3114],
  [3123, 3125],
  [3129, 3133],
  [3140, 3142],
  [3144, 3146],
  [3149, 3157],
  [3158, 3160],
  [3161, 3168],
  [3171, 3174],
  [3183, 3192],
  [3199, 3202],
  [3203, 3205],
  [3212, 3214],
  [3216, 3218],
  [3240, 3242],
  [3251, 3253],
  [3257, 3260],
  [3268, 3270],
  [3272, 3274],
  [3277, 3285],
  [3286, 3294],
  [3294, 3296],
  [3299, 3302],
  [3311, 3313],
  [3314, 3330],
  [3331, 3333],
  [3340, 3342],
  [3344, 3346],
  [3386, 3389],
  [3396, 3398],
  [3400, 3402],
  [3406, 3415],
  [3415, 3424],
  [3427, 3430],
  [3445, 3449],
  [3455, 3458],
  [3459, 3461],
  [3478, 3482],
  [3505, 3507],
  [3515, 3517],
  [3517, 3520],
  [3526, 3530],
  [3530, 3535],
  [3540, 3542],
  [3542, 3544],
  [3551, 3570],
  [3572, 3585],
  [3642, 3647],
  [3675, 3713],
  [3714, 3716],
  [3716, 3719],
  [3720, 3722],
  [3722, 3725],
  [3725, 3732],
  [3735, 3737],
  [3743, 3745],
  [3747, 3749],
  [3749, 3751],
  [3751, 3754],
  [3755, 3757],
  [3769, 3771],
  [3773, 3776],
  [3780, 3782],
  [3782, 3784],
  [3789, 3792],
  [3801, 3804],
  [3807, 3840],
  [3911, 3913],
  [3948, 3953],
  [3991, 3993],
  [4028, 4030],
  [4044, 4046],
  [4058, 4096],
  [4293, 4295],
  [4295, 4301],
  [4301, 4304],
  [4680, 4682],
  [4685, 4688],
  [4694, 4696],
  [4696, 4698],
  [4701, 4704],
  [4744, 4746],
  [4749, 4752],
  [4784, 4786],
  [4789, 4792],
  [4798, 4800],
  [4800, 4802],
  [4805, 4808],
  [4822, 4824],
  [4880, 4882],
  [4885, 4888],
  [4954, 4957],
  [4988, 4992],
  [5017, 5024],
  [5108, 5120],
  [5788, 5792],
  [5872, 5888],
  [5900, 5902],
  [5908, 5920],
  [5942, 5952],
  [5971, 5984],
  [5996, 5998],
  [6000, 6002],
  [6003, 6016],
  [6109, 6112],
  [6121, 6128],
  [6137, 6144],
  [6158, 6160],
  [6169, 6176],
  [6263, 6272],
  [6314, 7936],
  [7957, 7960],
  [7965, 7968],
  [8005, 8008],
  [8013, 8016],
  [8023, 8025],
  [8025, 8027],
  [8027, 8029],
  [8029, 8031],
  [8061, 8064],
  [8116, 8118],
  [8132, 8134],
  [8147, 8150],
  [8155, 8157],
  [8175, 8178],
  [8180, 8182],
  [8190, 11904],
  [11929, 11931],
  [12019, 12032],
  [12245, 12288],
  [12351, 12353],
  [12438, 12441],
  [12543, 12549],
  [12589, 12593],
  [12686, 12688],
  [12730, 12736],
  [12771, 12784],
  [12830, 12832],
  [13054, 13056],
  [13312, 19893],
  [19893, 19904],
  [40869, 40908],
  [40908, 40960],
  [42124, 42128],
  [42182, 42192],
  [42539, 42560],
  [42647, 42655],
  [42743, 42752],
  [42894, 42896],
  [42899, 42912],
  [42922, 43000],
  [43051, 43056],
  [43065, 43072],
  [43127, 43136],
  [43204, 43214],
  [43225, 43232],
  [43259, 43264],
  [43347, 43359],
  [43388, 43392],
  [43469, 43471],
  [43481, 43486],
  [43487, 43520],
  [43574, 43584],
  [43597, 43600],
  [43609, 43612],
  [43643, 43648],
  [43714, 43739],
  [43766, 43777],
  [43782, 43785],
  [43790, 43793],
  [43798, 43808],
  [43814, 43816],
  [43822, 43968],
  [44013, 44016],
  [44025, 44032],
  [55203, 55216],
  [55238, 55243],
  [55291, 63744],
  [64109, 64112],
  [64217, 64256],
  [64262, 64275],
  [64279, 64285],
  [64310, 64312],
  [64316, 64318],
  [64318, 64320],
  [64321, 64323],
  [64324, 64326],
  [64449, 64467],
  [64831, 64848],
  [64911, 64914],
  [64967, 65008],
  [65021, 65136],
  [65140, 65142],
  [65276, 66560],
  [66717, 66720],
  [66729, 67584],
  [67589, 67592],
  [67592, 67594],
  [67637, 67639],
  [67640, 67644],
  [67644, 67647],
  [67669, 67671],
  [67679, 67840],
  [67867, 67871],
  [67897, 67903],
  [67903, 67968],
  [68023, 68030],
  [68031, 68096],
  [68099, 68101],
  [68102, 68108],
  [68115, 68117],
  [68119, 68121],
  [68147, 68152],
  [68154, 68159],
  [68167, 68176],
  [68184, 68192],
  [68223, 68352],
  [68405, 68409],
  [68437, 68440],
  [68466, 68472],
  [68479, 68608],
  [68680, 69216],
  [69246, 69632],
  [69709, 69714],
  [69743, 69760],
  [69825, 69840],
  [69864, 69872],
  [69881, 69888],
  [69940, 69942],
  [69955, 70016],
  [70088, 70096],
  [70105, 71296],
  [71351, 71360],
  [71369, 73728],
  [74606, 74752],
  [74850, 74864],
  [74867, 77824],
  [78894, 92160],
  [92728, 93952],
  [94020, 94032],
  [94078, 94095],
  [94111, 110592],
  [110593, 131072],
  [131072, 173782],
  [173782, 173824],
  [173824, 177972],
  [177972, 177984],
  [177984, 178205],
  [178205, 194560],
];

export function mixer(ref) {
  return originalMixer(ref, defaults);
}

// set a different eol, cycle the list of eol's from "settledObj1Eol":
// const allEols = ["crlf", "cr", "lf"];
// const obj1Idx = allEols.indexOf(settledObj1Eol);
// objectPath.set(obj2, "eol", allEols[(obj1Idx + 1) % 3]);

// t is passed node-tap test instance
// n is index number of a test - we need to run the resource-heavy applicable
// test calculations only for the n === 0
export function det(ok, not, n, src, opts = {}) {
  if (!n) {
    let resolvedOpts = { ...defaults, ...opts };
    let tempObj = {};
    Object.keys(resolvedOpts).forEach((key) => {
      if (
        !["stripHtmlButIgnoreTags", "stripHtmlAddNewLine", "cb"].includes(key)
      ) {
        tempObj[key] = !!resolvedOpts[key];
      }
    });

    Object.keys(tempObj).forEach((key) => {
      if (key === "eol") {
        //
        //
        //                         IT'S opts.eol
        //
        //
        //
        // 1. prepare opts to ask for LF ending:
        let obj1 = clone(tempObj);
        objectPath.set(obj1, "eol", "lf");
        // add stripHtmlButIgnoreTags and stripHtmlAddNewLine
        objectPath.set(
          obj1,
          "stripHtmlButIgnoreTags",
          objectPath.has(opts, "stripHtmlButIgnoreTags")
            ? opts.stripHtmlButIgnoreTags
            : defaults.stripHtmlButIgnoreTags
        );
        objectPath.set(
          obj1,
          "stripHtmlAddNewLine",
          objectPath.has(opts, "stripHtmlAddNewLine")
            ? opts.stripHtmlAddNewLine
            : defaults.stripHtmlAddNewLine
        );

        //
        // 2. prepare opts to ask for CR ending:
        let obj2 = clone(tempObj);
        objectPath.set(obj2, "eol", "cr");
        // add stripHtmlButIgnoreTags and stripHtmlAddNewLine
        objectPath.set(
          obj2,
          "stripHtmlButIgnoreTags",
          objectPath.has(opts, "stripHtmlButIgnoreTags")
            ? opts.stripHtmlButIgnoreTags
            : defaults.stripHtmlButIgnoreTags
        );
        objectPath.set(
          obj2,
          "stripHtmlAddNewLine",
          objectPath.has(opts, "stripHtmlAddNewLine")
            ? opts.stripHtmlAddNewLine
            : defaults.stripHtmlAddNewLine
        );

        //
        // 3. prepare opts to ask for CRLF ending:
        let obj3 = clone(tempObj);
        objectPath.set(obj3, "eol", "crlf");
        // add stripHtmlButIgnoreTags and stripHtmlAddNewLine
        objectPath.set(
          obj3,
          "stripHtmlButIgnoreTags",
          objectPath.has(opts, "stripHtmlButIgnoreTags")
            ? opts.stripHtmlButIgnoreTags
            : defaults.stripHtmlButIgnoreTags
        );
        objectPath.set(
          obj3,
          "stripHtmlAddNewLine",
          objectPath.has(opts, "stripHtmlAddNewLine")
            ? opts.stripHtmlAddNewLine
            : defaults.stripHtmlAddNewLine
        );

        //
        // 4. assertions - there are three settings so we compare like a triangle
        if (
          det1(src, obj1).res !== det1(src, obj2).res ||
          det1(src, obj2).res !== det1(src, obj3).res ||
          det1(src, obj1).res !== det1(src, obj3).res
        ) {
          ok(
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
          not.ok(
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
        //
        //
        //
        // If toggling any of the options makes a difference,
        // that option must be reported as "applicable". And on the opposite.

        // incoming object might be with digits instead of boolean values,
        // so we convert whatever value is to a boolean
        let obj1 = clone(tempObj);
        objectPath.set(obj1, key, true);
        // add stripHtmlButIgnoreTags and stripHtmlAddNewLine
        objectPath.set(
          obj1,
          "stripHtmlButIgnoreTags",
          objectPath.has(opts, "stripHtmlButIgnoreTags")
            ? opts.stripHtmlButIgnoreTags
            : defaults.stripHtmlButIgnoreTags
        );
        objectPath.set(
          obj1,
          "stripHtmlAddNewLine",
          objectPath.has(opts, "stripHtmlAddNewLine")
            ? opts.stripHtmlAddNewLine
            : defaults.stripHtmlAddNewLine
        );
        let settledObj1Eol = objectPath.has(opts, "eol")
          ? opts.eol
          : defaults.eol;
        objectPath.set(obj1, "eol", settledObj1Eol);
        // console.log(
        //   `${`\u001b[${33}m${`obj1`}\u001b[${39}m`} = ${JSON.stringify(
        //     obj1,
        //     null,
        //     4
        //   )}`
        // );

        let obj2 = clone(tempObj);
        objectPath.set(obj2, key, false);
        // add stripHtmlButIgnoreTags and stripHtmlAddNewLine
        objectPath.set(
          obj2,
          "stripHtmlButIgnoreTags",
          objectPath.has(opts, "stripHtmlButIgnoreTags")
            ? opts.stripHtmlButIgnoreTags
            : defaults.stripHtmlButIgnoreTags
        );
        objectPath.set(
          obj2,
          "stripHtmlAddNewLine",
          objectPath.has(opts, "stripHtmlAddNewLine")
            ? opts.stripHtmlAddNewLine
            : defaults.stripHtmlAddNewLine
        );
        let settledObj2Eol = objectPath.has(opts, "eol")
          ? opts.eol
          : defaults.eol;
        objectPath.set(obj2, "eol", settledObj2Eol);

        // console.log(
        //   `${`\u001b[${33}m${`obj2`}\u001b[${39}m`} = ${JSON.stringify(
        //     obj2,
        //     null,
        //     4
        //   )}`
        // );

        if (det1(src, obj1).res !== det1(src, obj2).res) {
          ok(
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
          not.ok(
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
