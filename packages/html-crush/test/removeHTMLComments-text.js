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

  equal(result, source, "01.01");
  equal(
    applicableOpts,
    {
      removeHTMLComments: true,
      removeCSSComments: false,
    },
    "01.02"
  );
  equal(ranges, null, "01.03");
});

// removeHTMLComments=1 - only text comments
test(`02 - ${`\u001b[${33}m${`html comments`}\u001b[${39}m`} - one html comment only - 1`, () => {
  let source = `<!-- remove this -->`;
  let { result, applicableOpts, ranges } = m(equal, source, {
    removeHTMLComments: 1, // <---
  });

  equal(result, "", "02.01");
  equal(
    applicableOpts,
    {
      removeHTMLComments: true,
      removeCSSComments: false,
    },
    "02.02"
  );
  equal(ranges, [[0, 20]], "02.03");
});

// removeHTMLComments=2 - includes outlook conditional comments
test(`03 - ${`\u001b[${33}m${`html comments`}\u001b[${39}m`} - one html comment only - 2`, () => {
  let source = `<!-- remove this -->`;
  let { result, applicableOpts, ranges } = m(equal, source, {
    removeHTMLComments: 2, // <---
  });

  equal(result, "", "03.01");
  equal(
    applicableOpts,
    {
      removeHTMLComments: true,
      removeCSSComments: false,
    },
    "03.02"
  );
  equal(ranges, [[0, 20]], "03.03");
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

  equal(result, source.trim(), "04.01");
  equal(
    applicableOpts,
    {
      removeHTMLComments: true,
      removeCSSComments: false,
    },
    "04.02"
  );
  equal(
    ranges,
    [
      [0, 2],
      [22, 24],
    ],
    "04.03"
  );
});

// removeHTMLComments=1 - only text comments
test(`05 - ${`\u001b[${33}m${`html comments`}\u001b[${39}m`} - one html comment, surrounding whitespace - 1`, () => {
  let source = `  <!-- remove this -->  `;
  let { result, applicableOpts, ranges } = m(equal, source, {
    removeHTMLComments: 1, // <---
  });

  equal(result, "", "05.01");
  equal(
    applicableOpts,
    {
      removeHTMLComments: true,
      removeCSSComments: false,
    },
    "05.02"
  );
  equal(ranges, [[0, 24]], "05.03");
});

// removeHTMLComments=2 - includes outlook conditional comments
test(`06 - ${`\u001b[${33}m${`html comments`}\u001b[${39}m`} - one html comment, surrounding whitespace - 2`, () => {
  let source = `  <!-- remove this -->  `;
  let { result, applicableOpts, ranges } = m(equal, source, {
    removeHTMLComments: 2, // <---
  });

  equal(result, "", "06.01");
  equal(
    applicableOpts,
    {
      removeHTMLComments: true,
      removeCSSComments: false,
    },
    "06.02"
  );
  equal(ranges, [[0, 24]], "06.03");
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

  equal(result, source, "07.01");
  equal(
    applicableOpts,
    {
      removeHTMLComments: true,
      removeCSSComments: false,
    },
    "07.02"
  );
  equal(ranges, null, "07.03");
});

// removeHTMLComments=1 - only text comments
test(`08 - ${`\u001b[${33}m${`html comments`}\u001b[${39}m`} - commented tag - 1`, () => {
  let source = `<!--<span>-->`;
  let { result, applicableOpts, ranges } = m(equal, source, {
    removeHTMLComments: 1, // <---
  });

  equal(result, "", "08.01");
  equal(
    applicableOpts,
    {
      removeHTMLComments: true,
      removeCSSComments: false,
    },
    "08.02"
  );
  equal(ranges, [[0, 13]], "08.03");
});

// removeHTMLComments=2 - includes outlook conditional comments
test(`09 - ${`\u001b[${33}m${`html comments`}\u001b[${39}m`} - commented tag - 2`, () => {
  let source = `<!--<span>-->`;
  let { result, applicableOpts, ranges } = m(equal, source, {
    removeHTMLComments: 2, // <---
  });

  equal(result, "", "09.01");
  equal(
    applicableOpts,
    {
      removeHTMLComments: true,
      removeCSSComments: false,
    },
    "09.02"
  );
  equal(ranges, [[0, 13]], "09.03");
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
</div>`,
    "10.01"
  );
  equal(
    applicableOpts,
    {
      removeHTMLComments: true,
      removeCSSComments: false,
    },
    "10.02"
  );
  equal(
    ranges,
    [
      [5, 5, "\n"],
      [9, 10, "\n"],
      [16, 17, "\n"],
      [21, 22, "\n"],
      [25, 25, "\n"],
    ],
    "10.03"
  );
});

// removeHTMLComments=1 - only text comments
test(`11 - ${`\u001b[${33}m${`html comments`}\u001b[${39}m`} - when line length limit is too tight - 1`, () => {
  let source = `<div><!-- remove this --></div>`;
  let { result, applicableOpts, ranges } = m(equal, source, {
    removeHTMLComments: 1,
    lineLengthLimit: 2,
  });

  equal(result, `<div>\n</div>`, "11.01");
  equal(
    applicableOpts,
    {
      removeHTMLComments: true,
      removeCSSComments: false,
    },
    "11.02"
  );
  equal(ranges, [[5, 25, "\n"]], "11.03");
});

// removeHTMLComments=2 - includes outlook conditional comments
test(`12 - ${`\u001b[${33}m${`html comments`}\u001b[${39}m`} - when line length limit is too tight - 2`, () => {
  let source = `<div><!-- remove this --></div>`;
  let { result, applicableOpts, ranges } = m(equal, source, {
    removeHTMLComments: 2,
    lineLengthLimit: 2,
  });

  equal(result, `<div>\n</div>`, "12.01");
  equal(
    applicableOpts,
    {
      removeHTMLComments: true,
      removeCSSComments: false,
    },
    "12.02"
  );
  equal(ranges, [[5, 25, "\n"]], "12.03");
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
