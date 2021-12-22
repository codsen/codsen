import { test } from "uvu";
// eslint-disable-next-line no-unused-vars
import { equal, is, ok, throws, type, not, match } from "uvu/assert";

import { m } from "./util/util.js";

// regular HTML comments (nothing to do with Outlook)
// <!-- zzz -->
// <!-- <div>zzz</div> -->
// and so on

//
//
//
//
// -----------------------------------------------------------------------------
//
//
//
//

test(`01 - ${`\u001b[${33}m${`html comments`}\u001b[${39}m`} - one html comment only - 0`, () => {
  let source = `<!-- remove this -->`;
  let { result, applicableOpts, ranges } = m(equal, source, {
    removeHTMLComments: 0, // <---
  });

  equal(result, source);
  equal(applicableOpts, {
    removeHTMLComments: true,
    removeCSSComments: false,
  });
  equal(ranges, null);
});

// removeHTMLComments=1 - only text comments
test(`02 - ${`\u001b[${33}m${`html comments`}\u001b[${39}m`} - one html comment only - 1`, () => {
  let source = `<!-- remove this -->`;
  let { result, applicableOpts, ranges } = m(equal, source, {
    removeHTMLComments: 1, // <---
  });

  equal(result, "");
  equal(applicableOpts, {
    removeHTMLComments: true,
    removeCSSComments: false,
  });
  equal(ranges, [[0, 20]]);
});

// removeHTMLComments=2 - includes outlook conditional comments
test(`03 - ${`\u001b[${33}m${`html comments`}\u001b[${39}m`} - one html comment only - 2`, () => {
  let source = `<!-- remove this -->`;
  let { result, applicableOpts, ranges } = m(equal, source, {
    removeHTMLComments: 2, // <---
  });

  equal(result, "");
  equal(applicableOpts, {
    removeHTMLComments: true,
    removeCSSComments: false,
  });
  equal(ranges, [[0, 20]]);
});

//
//
//
//
// -----------------------------------------------------------------------------
//
//
//
//

// removeHTMLComments=0 - off
test(`04 - ${`\u001b[${33}m${`html comments`}\u001b[${39}m`} - one html comment, surrounding whitespace - 0`, () => {
  let source = `  <!-- remove this -->  `;
  let { result, applicableOpts, ranges } = m(equal, source, {
    removeHTMLComments: 0, // <---
  });

  equal(result, source.trim());
  equal(applicableOpts, {
    removeHTMLComments: true,
    removeCSSComments: false,
  });
  equal(ranges, [
    [0, 2],
    [22, 24],
  ]);
});

// removeHTMLComments=1 - only text comments
test(`05 - ${`\u001b[${33}m${`html comments`}\u001b[${39}m`} - one html comment, surrounding whitespace - 1`, () => {
  let source = `  <!-- remove this -->  `;
  let { result, applicableOpts, ranges } = m(equal, source, {
    removeHTMLComments: 1, // <---
  });

  equal(result, "");
  equal(applicableOpts, {
    removeHTMLComments: true,
    removeCSSComments: false,
  });
  equal(ranges, [[0, 24]]);
});

// removeHTMLComments=2 - includes outlook conditional comments
test(`06 - ${`\u001b[${33}m${`html comments`}\u001b[${39}m`} - one html comment, surrounding whitespace - 2`, () => {
  let source = `  <!-- remove this -->  `;
  let { result, applicableOpts, ranges } = m(equal, source, {
    removeHTMLComments: 2, // <---
  });

  equal(result, "");
  equal(applicableOpts, {
    removeHTMLComments: true,
    removeCSSComments: false,
  });
  equal(ranges, [[0, 24]]);
});

//
//
//
//
// -----------------------------------------------------------------------------
//
//
//
//

// removeHTMLComments=0 - off
test(`07 - ${`\u001b[${33}m${`html comments`}\u001b[${39}m`} - commented tag - 0`, () => {
  let source = `<!--<span>-->`;
  let { result, applicableOpts, ranges } = m(equal, source, {
    removeHTMLComments: 0, // <---
  });

  equal(result, source);
  equal(applicableOpts, {
    removeHTMLComments: true,
    removeCSSComments: false,
  });
  equal(ranges, null);
});

// removeHTMLComments=1 - only text comments
test(`08 - ${`\u001b[${33}m${`html comments`}\u001b[${39}m`} - commented tag - 1`, () => {
  let source = `<!--<span>-->`;
  let { result, applicableOpts, ranges } = m(equal, source, {
    removeHTMLComments: 1, // <---
  });

  equal(result, "");
  equal(applicableOpts, {
    removeHTMLComments: true,
    removeCSSComments: false,
  });
  equal(ranges, [[0, 13]]);
});

// removeHTMLComments=2 - includes outlook conditional comments
test(`09 - ${`\u001b[${33}m${`html comments`}\u001b[${39}m`} - commented tag - 2`, () => {
  let source = `<!--<span>-->`;
  let { result, applicableOpts, ranges } = m(equal, source, {
    removeHTMLComments: 2, // <---
  });

  equal(result, "");
  equal(applicableOpts, {
    removeHTMLComments: true,
    removeCSSComments: false,
  });
  equal(ranges, [[0, 13]]);
});

//
//
//
//
// -----------------------------------------------------------------------------
//
//
//
//

// removeHTMLComments=0 - off
test(`10 - ${`\u001b[${33}m${`html comments`}\u001b[${39}m`} - when line length limit is too tight - 0`, () => {
  let source = `<div><!-- remove this --></div>`;
  let { result, applicableOpts, ranges } = m(equal, source, {
    removeLineBreaks: true,
    removeHTMLComments: 0,
    lineLengthLimit: 2,
  });

  equal(
    result,
    `<div>
<!--
remove
this
-->
</div>`
  );
  equal(applicableOpts, {
    removeHTMLComments: true,
    removeCSSComments: false,
  });
  equal(ranges, [
    [5, 5, "\n"],
    [9, 10, "\n"],
    [16, 17, "\n"],
    [21, 22, "\n"],
    [25, 25, "\n"],
  ]);
});

// removeHTMLComments=1 - only text comments
test(`11 - ${`\u001b[${33}m${`html comments`}\u001b[${39}m`} - when line length limit is too tight - 1`, () => {
  let source = `<div><!-- remove this --></div>`;
  let { result, applicableOpts, ranges } = m(equal, source, {
    removeHTMLComments: 1,
    lineLengthLimit: 2,
  });

  equal(result, `<div>\n</div>`);
  equal(applicableOpts, {
    removeHTMLComments: true,
    removeCSSComments: false,
  });
  equal(ranges, [[5, 25, "\n"]]);
});

// removeHTMLComments=2 - includes outlook conditional comments
test(`12 - ${`\u001b[${33}m${`html comments`}\u001b[${39}m`} - when line length limit is too tight - 2`, () => {
  let source = `<div><!-- remove this --></div>`;
  let { result, applicableOpts, ranges } = m(equal, source, {
    removeHTMLComments: 2,
    lineLengthLimit: 2,
  });

  equal(result, `<div>\n</div>`);
  equal(applicableOpts, {
    removeHTMLComments: true,
    removeCSSComments: false,
  });
  equal(ranges, [[5, 25, "\n"]]);
});

//
//
//
//
// -----------------------------------------------------------------------------
//
//
//
//

test.run();
