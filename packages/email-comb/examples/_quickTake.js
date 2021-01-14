// Quick Take

import { strict as assert } from "assert";
import { comb, defaults, version } from "../dist/email-comb.esm.js";

// aptly named classes:
const source = `<head>
<style type="text/css">
.unused1[z] {a:1;}
.used[z] {a:2;}
</style>
</head>
<body class="  used  "><a class="used unused3">z</a>
</body>
`;

const intended = `<head>
<style type="text/css">
.used[z] {a:2;}
</style>
</head>
<body class="used"><a class="used">z</a>
</body>
`;

assert.equal(comb(source).result, intended);
