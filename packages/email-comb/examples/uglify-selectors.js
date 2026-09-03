// Uglify class and ID selectors with the convenience API

import { strict as assert } from "node:assert";
import { uglify } from "../dist/email-comb.esm.js";

const html = `<head>
<style>
  #MessageViewBody .newsletter-title { color: red; }
  .body { color: blue; }
</style>
</head>
<body id="MessageViewBody" class="body">
  <h1 class="newsletter-title">Hello</h1>
</body>`;

const { result } = uglify(html, {
  whitelist: ["#MessageViewBody", ".body"],
});

assert.equal(
  result,
  `<head>
<style>
  #MessageViewBody .w { color: red; }
  .body { color: blue; }
</style>
</head>
<body id="MessageViewBody" class="body">
  <h1 class="w">Hello</h1>
</body>`,
);
