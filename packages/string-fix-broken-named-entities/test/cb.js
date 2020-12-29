import tap from "tap";
import { fixEnt as fix } from "../dist/string-fix-broken-named-entities.esm";

// -----------------------------------------------------------------------------
// helper functions
// -----------------------------------------------------------------------------

function cb(obj) {
  return obj.rangeValEncoded
    ? [obj.rangeFrom, obj.rangeTo, obj.rangeValEncoded]
    : [obj.rangeFrom, obj.rangeTo];
}

// -----------------------------------------------------------------------------
// 06. opts.cb
// -----------------------------------------------------------------------------

tap.test(
  `01 - ${`\u001b[${31}m${`opts.cb`}\u001b[${39}m`} - \u001b[${33}m${`default callback`}\u001b[${39}m mimicking non-cb result`,
  (t) => {
    t.strictSame(
      fix("zzznbsp;zzznbsp;", {
        cb,
      }),
      [
        [3, 8, "&nbsp;"],
        [11, 16, "&nbsp;"],
      ],
      "01 - letter + nbsp"
    );
    t.end();
  }
);

tap.test(
  `02 - ${`\u001b[${31}m${`opts.cb`}\u001b[${39}m`} - \u001b[${33}m${`emlint issue spec`}\u001b[${39}m callback`,
  (t) => {
    t.strictSame(
      fix("zzznbsp;zzznbsp;", {
        cb: (oodles) => {
          // {
          //   ruleName: "missing semicolon on &pi; (don't confuse with &piv;)",
          //   entityName: "pi",
          //   rangeFrom: i,
          //   rangeTo: i + 3,
          //   rangeValEncoded: "&pi;",
          //   rangeValDecoded: "\u03C0"
          // }
          return {
            name: oodles.ruleName,
            position:
              oodles.rangeValEncoded != null
                ? [oodles.rangeFrom, oodles.rangeTo, oodles.rangeValEncoded]
                : [oodles.rangeFrom, oodles.rangeTo],
          };
        },
      }),
      [
        {
          name: "bad-named-html-entity-malformed-nbsp",
          position: [3, 8, "&nbsp;"],
        },
        {
          name: "bad-named-html-entity-malformed-nbsp",
          position: [11, 16, "&nbsp;"],
        },
      ],
      "02"
    );
    t.end();
  }
);
