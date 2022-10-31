import { test } from "uvu";
// eslint-disable-next-line no-unused-vars
import { equal, is, ok, throws, type, not, match } from "uvu/assert";

import { comb } from "./util/util.js";

// bracket notation
// -----------------------------------------------------------------------------

test(`01 - ${`\u001b[${34}m${`bracket notation`}\u001b[${39}m`} - classes`, () => {
  let source = `<head>
<style type="text/css">
  a[class="used"]{x:1;}
  b[class="unused1"]{y:2;}
</style>
</head>
<body class="used"><a class="used unused2">z</a>
</body>
`;

  let intended = `<head>
<style type="text/css">
  a[class="used"]{x:1;}
</style>
</head>
<body class="used"><a class="used">z</a>
</body>
`;

  equal(comb(source).result, intended, "01.01");
});

test(`02 - ${`\u001b[${34}m${`bracket notation`}\u001b[${39}m`} - bracket notation - id's`, () => {
  let source = `<head>
<style type="text/css">
  a[id="used"]{x:1;}
  b[id="unused1"]{y:2;}
</style>
</head>
<body id="used"><a id="used unused2">z</a>
</body>
`;

  let intended = `<head>
<style type="text/css">
  a[id="used"]{x:1;}
</style>
</head>
<body id="used"><a id="used">z</a>
</body>
`;

  equal(comb(source).result, intended, "02.01");
});

test.run();
