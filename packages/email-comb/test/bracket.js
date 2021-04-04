import tap from "tap";
import { comb } from "./util/util";

// bracket notation
// -----------------------------------------------------------------------------

tap.test(
  `01 - ${`\u001b[${34}m${`bracket notation`}\u001b[${39}m`} - classes`,
  (t) => {
    const source = `<head>
<style type="text/css">
  a[class="used"]{x:1;}
  b[class="unused1"]{y:2;}
</style>
</head>
<body class="used"><a class="used unused2">z</a>
</body>
`;

    const intended = `<head>
<style type="text/css">
  a[class="used"]{x:1;}
</style>
</head>
<body class="used"><a class="used">z</a>
</body>
`;

    t.equal(comb(t, source).result, intended, "01");

    t.end();
  }
);

tap.test(
  `02 - ${`\u001b[${34}m${`bracket notation`}\u001b[${39}m`} - bracket notation - id's`,
  (t) => {
    const source = `<head>
<style type="text/css">
  a[id="used"]{x:1;}
  b[id="unused1"]{y:2;}
</style>
</head>
<body id="used"><a id="used unused2">z</a>
</body>
`;

    const intended = `<head>
<style type="text/css">
  a[id="used"]{x:1;}
</style>
</head>
<body id="used"><a id="used">z</a>
</body>
`;

    t.equal(comb(t, source).result, intended, "02");

    t.end();
  }
);
