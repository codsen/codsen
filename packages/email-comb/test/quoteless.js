import tap from "tap";
import { comb } from "../dist/email-comb.esm";

// web-dev style-minified templates - quoteless attributes
// -----------------------------------------------------------------------------

tap.test(
  `01 - ${`\u001b[${35}m${`quoteless attr`}\u001b[${39}m`} - class - retained, quoteless attr is the last`,
  (t) => {
    const actual = comb(`<head>
<style>
  .aa {z:1;}
</style>
</head>
<body><a class=aa>z</a>
</body>
`).result;

    const intended = `<head>
<style>
  .aa {z:1;}
</style>
</head>
<body><a class="aa">z</a>
</body>
`;

    t.equal(actual, intended, "01");

    t.end();
  }
);

tap.test(
  `02 - ${`\u001b[${35}m${`quoteless attr`}\u001b[${39}m`} - class - retained, just patches up`,
  (t) => {
    const actual = comb(`<head>
<style>
  .aa {z:1;}
</style>
</head>
<body><a class=aa href=zzz>z</a>
</body>
`).result;

    const intended = `<head>
<style>
  .aa {z:1;}
</style>
</head>
<body><a class="aa" href=zzz>z</a>
</body>
`;

    t.equal(actual, intended, "02");

    t.end();
  }
);

tap.test(
  `03 - ${`\u001b[${35}m${`quoteless attr`}\u001b[${39}m`} - class - removed`,
  (t) => {
    const actual = comb(`<head>
<style>
  .aa-1 {z:2;}
</style>
</head>
<body class="aa-1"><a class=bb-2 >z</a>
</body>
`).result;

    const intended = `<head>
<style>
  .aa-1 {z:2;}
</style>
</head>
<body class="aa-1"><a>z</a>
</body>
`;

    t.equal(actual, intended, "03");

    t.end();
  }
);

tap.test(
  `04 - ${`\u001b[${35}m${`quoteless attr`}\u001b[${39}m`} - id - retained, quoteless attr is the last`,
  (t) => {
    const actual = comb(`<head>
<style>
  #aa {z:1;}
</style>
</head>
<body><a id=aa>z</a>
</body>
`).result;

    const intended = `<head>
<style>
  #aa {z:1;}
</style>
</head>
<body><a id="aa">z</a>
</body>
`;

    t.equal(actual, intended, "04");

    t.end();
  }
);

tap.test(
  `05 - ${`\u001b[${35}m${`quoteless attr`}\u001b[${39}m`} - id - retained, just patches up`,
  (t) => {
    const actual = comb(`<head>
<style>
  #aa {z:1;}
</style>
</head>
<body><a id=aa href=zzz>z</a>
</body>
`).result;

    const intended = `<head>
<style>
  #aa {z:1;}
</style>
</head>
<body><a id="aa" href=zzz>z</a>
</body>
`;

    t.equal(actual, intended, "05");

    t.end();
  }
);

tap.test(
  `06 - ${`\u001b[${35}m${`quoteless attr`}\u001b[${39}m`} - id - removed`,
  (t) => {
    const actual = comb(`<head>
<style>
  #aa-1 {z:2;}
</style>
</head>
<body id="aa-1"><a id="bb-2">z</a>
</body>
`).result;

    const intended = `<head>
<style>
  #aa-1 {z:2;}
</style>
</head>
<body id="aa-1"><a>z</a>
</body>
`;

    t.equal(actual, intended, "06");

    t.end();
  }
);

tap.test(
  `07 - ${`\u001b[${35}m${`quoteless attr`}\u001b[${39}m`} - class - one removed, one retainer quoteless neighbour - dashes`,
  (t) => {
    const actual = comb(`<head>
<style>
  .aa-1 {z:2;}
</style>
</head>
<body class=aa-1><a class=bb-2 >z</a>
</body>
`).result;

    const intended = `<head>
<style>
  .aa-1 {z:2;}
</style>
</head>
<body class="aa-1"><a>z</a>
</body>
`;
    t.equal(actual, intended, "07");

    t.end();
  }
);

tap.test(
  `08 - ${`\u001b[${35}m${`quoteless attr`}\u001b[${39}m`} - class - one removed, one retainer quoteless neighbour - dashes`,
  (t) => {
    const actual = comb(`<head>
<style>
  #aa-1 {z:2;}
</style>
</head>
<body id=aa-1><a id=bb-2 >z</a>
</body>
`).result;

    const intended = `<head>
<style>
  #aa-1 {z:2;}
</style>
</head>
<body id="aa-1"><a>z</a>
</body>
`;
    t.equal(actual, intended, "08");

    t.end();
  }
);

tap.test(
  `09 - ${`\u001b[${35}m${`quoteless attr`}\u001b[${39}m`} - class - one removed, one retainer quoteless neighbour - underscores`,
  (t) => {
    const actual = comb(`<head>
<style>
  .aa_1 {z:2;}
</style>
</head>
<body class=aa_1><a class=bb_2 >z</a>
</body>
`).result;

    const intended = `<head>
<style>
  .aa_1 {z:2;}
</style>
</head>
<body class="aa_1"><a>z</a>
</body>
`;
    t.equal(actual, intended, "09");

    t.end();
  }
);

tap.test(
  `10 - ${`\u001b[${35}m${`quoteless attr`}\u001b[${39}m`} - id - one removed, one retainer quoteless neighbour - underscores`,
  (t) => {
    const actual = comb(`<head>
<style>
  #aa_1 {z:2;}
</style>
</head>
<body id=aa_1><a id=bb_2 >z</a>
</body>
`).result;

    const intended = `<head>
<style>
  #aa_1 {z:2;}
</style>
</head>
<body id="aa_1"><a>z</a>
</body>
`;
    t.equal(actual, intended, "10");

    t.end();
  }
);

tap.test(
  `11 - ${`\u001b[${35}m${`quoteless attr`}\u001b[${39}m`} - trailing whitespace control`,
  (t) => {
    const actual = comb(`<html>
<head>
</head>
<body id=unused-1 align="center">
<table class=unused-2 align="center">
`).result;

    const intended = `<html>
<head>
</head>
<body align="center">
<table align="center">
`;
    t.equal(actual, intended, "11");

    t.end();
  }
);
