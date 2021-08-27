/* eslint no-template-curly-in-string: 0 */

import tap from "tap";
import { jVar } from "../dist/json-variables.esm.js";

tap.test(
  "01 - opts.headsNoWrap & opts.tailsNoWrap work on single level vars",
  (t) => {
    t.strictSame(
      jVar(
        {
          a: "some text %%-var1-%% more text %%_var2_%%",
          b: "something",
          var1: "value1",
          var2: "value2",
        },
        {
          wrapHeadsWith: "{{ ",
          wrapTailsWith: " }}",
        }
      ),
      {
        a: "some text value1 more text {{ value2 }}",
        b: "something",
        var1: "value1",
        var2: "value2",
      },
      "01.01 - defaults"
    );
    t.strictSame(
      jVar(
        {
          a: "some text (( var1 )) more text %%_var2_%%",
          b: "something",
          var1: "value1",
          var2: "value2",
        },
        {
          wrapHeadsWith: "{{ ",
          wrapTailsWith: " }}",
          headsNoWrap: "(( ",
          tailsNoWrap: " ))",
        }
      ),
      {
        a: "some text value1 more text {{ value2 }}",
        b: "something",
        var1: "value1",
        var2: "value2",
      },
      "01.02 - custom opts.headsNoWrap & opts.tailsNoWrap"
    );
    t.strictSame(
      jVar(
        {
          a: "some text (( var1 )) more text %%_var2_%%",
          b: "something",
          var1: "value1",
          var2: "value2",
        },
        {
          wrapHeadsWith: "{{ ",
          wrapTailsWith: " }}",
          headsNoWrap: "(( ",
          tailsNoWrap: " ))",
        }
      ),
      {
        a: "some text value1 more text {{ value2 }}",
        b: "something",
        var1: "value1",
        var2: "value2",
      },
      "01.03 - left side wrapped only, custom opts.headsNoWrap & opts.tailsNoWrap"
    );
    t.strictSame(
      jVar(
        {
          a: "some text (( var1 )) more text %%_var2_%%",
          b: "something",
          var1: "value1",
          var2: "value2",
        },
        {
          wrapHeadsWith: "{{ ",
          wrapTailsWith: " }}",
          headsNoWrap: "(( ",
          tailsNoWrap: " ))",
        }
      ),
      {
        a: "some text value1 more text {{ value2 }}",
        b: "something",
        var1: "value1",
        var2: "value2",
      },
      "01.04 - right side wrapped only, custom opts.headsNoWrap & opts.tailsNoWrap"
    );
    t.end();
  }
);

tap.test(
  "02 - opts.headsNoWrap & opts.tailsNoWrap work on multi-level vars",
  (t) => {
    t.strictSame(
      jVar(
        {
          a: "text %%-b-%% more text %%_c_%% and more %%-b-%% text %%_b_%% more text %%-c-%%",
          b: "%%_c_%%",
          c: "z",
        },
        {
          wrapHeadsWith: "??",
          wrapTailsWith: "!!",
        }
      ),
      {
        a: "text z more text ??z!! and more z text ??z!! more text z",
        b: "??z!!",
        c: "z",
      },
      "02.01 - two level redirects, default opts.headsNoWrap & opts.tailsNoWrap, matching var key lengths"
    );
    t.strictSame(
      jVar(
        {
          a: "text %%-bbb-%% more text %%_c_%% and more %%-bbb-%% text",
          bbb: "%%_c_%%",
          c: "z",
        },
        {
          wrapHeadsWith: "??",
          wrapTailsWith: "!!",
        }
      ),
      {
        a: "text z more text ??z!! and more z text",
        bbb: "??z!!",
        c: "z",
      },
      "02.02 - two level redirects, default opts.headsNoWrap & opts.tailsNoWrap, mismatching var key lengths"
    );
    t.strictSame(
      jVar(
        {
          a: "text -yyy-bbb-zzz- more text -www-c-xxx- and more -yyy-bbb-zzz- text",
          bbb: "-www-c-xxx-",
          c: "z",
        },
        {
          heads: "-www-",
          tails: "-xxx-",
          headsNoWrap: "-yyy-",
          tailsNoWrap: "-zzz-",
          wrapHeadsWith: "??",
          wrapTailsWith: "!!",
        }
      ),
      {
        a: "text z more text ??z!! and more z text",
        bbb: "??z!!",
        c: "z",
      },
      "02.03 - two level redirects, custom everything"
    );
    t.end();
  }
);

tap.test(
  "03 - triple linking with resolving arrays and trailing new lines",
  (t) => {
    t.strictSame(
      jVar(
        {
          aaa: "%%-bbb-%%",
          bbb: "ccc\n",
        },
        {
          wrapHeadsWith: "{{ ",
          wrapTailsWith: " }}",
        }
      ),
      {
        aaa: "ccc\n",
        bbb: "ccc\n",
      },
      "03.01 - basic, checking are trailing line breaks retained"
    );

    t.strictSame(
      jVar(
        {
          aaa: "%%-bbb-%%",
          bbb: ["%%-kkk-%%", "%%-lll-%%"],
          bbb_data: {
            kkk: "zzz\n",
            lll: "yyy\n",
          },
        },
        {
          wrapHeadsWith: "{{ ",
          wrapTailsWith: " }}",
        }
      ),
      {
        aaa: "zzz\nyyy\n",
        bbb: ["zzz\n", "yyy\n"],
        bbb_data: {
          kkk: "zzz\n",
          lll: "yyy\n",
        },
      },
      "03.02 - line breaks on the values coming into array"
    );

    t.strictSame(
      jVar(
        {
          aaa: "%%-bbb-%%",
          bbb: ["%%-kkk-%%\n", "%%-lll-%%\n"],
          bbb_data: {
            kkk: "zzz",
            lll: "yyy",
          },
        },
        {
          wrapHeadsWith: "{{ ",
          wrapTailsWith: " }}",
        }
      ),
      {
        aaa: "zzz\nyyy\n",
        bbb: ["zzz\n", "yyy\n"],
        bbb_data: {
          kkk: "zzz",
          lll: "yyy",
        },
      },
      "03.03 - line breaks at array-level"
    );

    t.strictSame(
      jVar(
        {
          aaa: "%%_bbb_%%", // <----- regular heads/tails
          bbb: ["%%_kkk_%%", "%%_lll_%%"],
          bbb_data: {
            kkk: "zzz",
            lll: "yyy",
          },
        },
        {
          wrapHeadsWith: "{{ ",
          wrapTailsWith: " }}",
        }
      ),
      {
        aaa: "{{ zzz }}{{ yyy }}",
        bbb: ["{{ zzz }}", "{{ yyy }}"],
        bbb_data: {
          kkk: "zzz",
          lll: "yyy",
        },
      },
      "03.04 - like #02 but with wrapping"
    );

    t.strictSame(
      jVar(
        {
          aaa: "%%-bbb-%%", // <-----  notice no-wrap heads/tails
          bbb: ["%%_kkk_%%", "%%_lll_%%"],
          bbb_data: {
            kkk: "zzz",
            lll: "yyy",
          },
        },
        {
          wrapHeadsWith: "{{ ",
          wrapTailsWith: " }}",
        }
      ),
      {
        aaa: "{{ zzz }}{{ yyy }}",
        bbb: ["{{ zzz }}", "{{ yyy }}"],
        bbb_data: {
          kkk: "zzz",
          lll: "yyy",
        },
      },
      "03.05"
    );

    t.strictSame(
      jVar(
        {
          aaa: "%%-bbb-%%",
          bbb: ["%%-kkk-%%", "%%-lll-%%"],
          bbb_data: {
            kkk: "{%- if %%-zzz-%% -%}%%_zzz_%%<br />{%- endif -%}\n",
            zzz: "zzz_val",
            lll: "{%- if %%-yyy-%% -%}%%_yyy_%%<br />{%- endif -%}\n",
            yyy: "yyy_val",
          },
        },
        {
          wrapHeadsWith: "{{ ",
          wrapTailsWith: " }}",
        }
      ),
      {
        aaa: "{%- if zzz_val -%}{{ zzz_val }}<br />{%- endif -%}\n{%- if yyy_val -%}{{ yyy_val }}<br />{%- endif -%}\n",
        bbb: [
          "{%- if zzz_val -%}{{ zzz_val }}<br />{%- endif -%}\n",
          "{%- if yyy_val -%}{{ yyy_val }}<br />{%- endif -%}\n",
        ],
        bbb_data: {
          kkk: "{%- if zzz_val -%}{{ zzz_val }}<br />{%- endif -%}\n",
          zzz: "zzz_val",
          lll: "{%- if yyy_val -%}{{ yyy_val }}<br />{%- endif -%}\n",
          yyy: "yyy_val",
        },
      },
      "03.06 - simple version"
    );

    t.strictSame(
      jVar(
        {
          shop_info_text: "%%-shop_info_global-%%",
          shop_info_global: [
            "%%-row0_line-%%",
            "%%_row1_line_%%",
            "%%_row2_line_%%",
            "%%_row3_line_%%",
            "%%_row4_line_%%",
            "%%_row5_line_%%",
            "%%_row6_line_%%",
            "%%_row7_line_%%",
            "%%_row8_line_%%",
          ],
          shop_info_global_data: {
            row0_line:
              "{%- if %%-row0_var-%% -%}%%_row0_var_%%<br />{%- endif -%}\n",
            row0_var: "order.shopInfo.name",
            row1_line:
              "{%- if %%-row1_var-%% -%}%%_row1_var_%%<br />{%- endif -%}\n",
            row1_var: "order.shopInfo.addressLine1",
            row2_line:
              "{%- if %%-row2_var-%% -%}%%_row2_var_%%<br />{%- endif -%}\n",
            row2_var: "order.shopInfo.addressLine2",
            row3_line:
              "{%- if %%-row3_var-%% -%}%%_row3_var_%%<br />{%- endif -%}\n",
            row3_var: "order.shopInfo.addressLine3",
            row4_line:
              "{%- if %%-row4_var-%% -%}%%_row4_var_%%<br />{%- endif -%}\n",
            row4_var: "order.shopInfo.addressLine4",
            row5_line:
              "{%- if %%-row5_var-%% -%}%%_row5_var_%%<br />{%- endif -%}\n",
            row5_var: "order.shopInfo.addressLine5",
            row6_line:
              "{%- if %%-row6_var-%% -%}%%_row6_var_%%<br />{%- endif -%}\n",
            row6_var: "order.shopInfo.addressLine6",
            row7_line:
              "{%- if %%-row7_var-%% -%}%%_row7_var_%%<br />{%- endif -%}\n",
            row7_var: "order.shopInfo.city",
            row8_line: "{%- if %%-row8_var-%% -%}%%_row8_var_%%{%- endif -%}",
            row8_var: "order.shopInfo.zipCode",
          },
        },
        {
          wrapHeadsWith: "{{ ",
          wrapTailsWith: " }}",
        }
      ),
      {
        shop_info_text:
          "{%- if order.shopInfo.name -%}{{ order.shopInfo.name }}<br />{%- endif -%}\n{%- if order.shopInfo.addressLine1 -%}{{ order.shopInfo.addressLine1 }}<br />{%- endif -%}\n{%- if order.shopInfo.addressLine2 -%}{{ order.shopInfo.addressLine2 }}<br />{%- endif -%}\n{%- if order.shopInfo.addressLine3 -%}{{ order.shopInfo.addressLine3 }}<br />{%- endif -%}\n{%- if order.shopInfo.addressLine4 -%}{{ order.shopInfo.addressLine4 }}<br />{%- endif -%}\n{%- if order.shopInfo.addressLine5 -%}{{ order.shopInfo.addressLine5 }}<br />{%- endif -%}\n{%- if order.shopInfo.addressLine6 -%}{{ order.shopInfo.addressLine6 }}<br />{%- endif -%}\n{%- if order.shopInfo.city -%}{{ order.shopInfo.city }}<br />{%- endif -%}\n{%- if order.shopInfo.zipCode -%}{{ order.shopInfo.zipCode }}{%- endif -%}",
        shop_info_global: [
          "{%- if order.shopInfo.name -%}{{ order.shopInfo.name }}<br />{%- endif -%}\n",
          "{%- if order.shopInfo.addressLine1 -%}{{ order.shopInfo.addressLine1 }}<br />{%- endif -%}\n",
          "{%- if order.shopInfo.addressLine2 -%}{{ order.shopInfo.addressLine2 }}<br />{%- endif -%}\n",
          "{%- if order.shopInfo.addressLine3 -%}{{ order.shopInfo.addressLine3 }}<br />{%- endif -%}\n",
          "{%- if order.shopInfo.addressLine4 -%}{{ order.shopInfo.addressLine4 }}<br />{%- endif -%}\n",
          "{%- if order.shopInfo.addressLine5 -%}{{ order.shopInfo.addressLine5 }}<br />{%- endif -%}\n",
          "{%- if order.shopInfo.addressLine6 -%}{{ order.shopInfo.addressLine6 }}<br />{%- endif -%}\n",
          "{%- if order.shopInfo.city -%}{{ order.shopInfo.city }}<br />{%- endif -%}\n",
          "{%- if order.shopInfo.zipCode -%}{{ order.shopInfo.zipCode }}{%- endif -%}",
        ],
        shop_info_global_data: {
          row0_line:
            "{%- if order.shopInfo.name -%}{{ order.shopInfo.name }}<br />{%- endif -%}\n",
          row0_var: "order.shopInfo.name",
          row1_line:
            "{%- if order.shopInfo.addressLine1 -%}{{ order.shopInfo.addressLine1 }}<br />{%- endif -%}\n",
          row1_var: "order.shopInfo.addressLine1",
          row2_line:
            "{%- if order.shopInfo.addressLine2 -%}{{ order.shopInfo.addressLine2 }}<br />{%- endif -%}\n",
          row2_var: "order.shopInfo.addressLine2",
          row3_line:
            "{%- if order.shopInfo.addressLine3 -%}{{ order.shopInfo.addressLine3 }}<br />{%- endif -%}\n",
          row3_var: "order.shopInfo.addressLine3",
          row4_line:
            "{%- if order.shopInfo.addressLine4 -%}{{ order.shopInfo.addressLine4 }}<br />{%- endif -%}\n",
          row4_var: "order.shopInfo.addressLine4",
          row5_line:
            "{%- if order.shopInfo.addressLine5 -%}{{ order.shopInfo.addressLine5 }}<br />{%- endif -%}\n",
          row5_var: "order.shopInfo.addressLine5",
          row6_line:
            "{%- if order.shopInfo.addressLine6 -%}{{ order.shopInfo.addressLine6 }}<br />{%- endif -%}\n",
          row6_var: "order.shopInfo.addressLine6",
          row7_line:
            "{%- if order.shopInfo.city -%}{{ order.shopInfo.city }}<br />{%- endif -%}\n",
          row7_var: "order.shopInfo.city",
          row8_line:
            "{%- if order.shopInfo.zipCode -%}{{ order.shopInfo.zipCode }}{%- endif -%}",
          row8_var: "order.shopInfo.zipCode",
        },
      },
      "03.07 - real-life version"
    );
    t.end();
  }
);
