const t = require("tap");
const vs = require("vinyl-string");
// Lets us write in-line functions in our pipe:
const map = require("map-stream");
const geruc = require("../index");

// https://snugug.com/musings/unit-testing-gulp-tasks/
// * @param {string} input - String contents of the "file"
// * @param {string} path  - The "path" of the "file"
// * @param {function} func - The lazypipe that will be used to transform the input
function fromString(input, path, func) {
  return new Promise((res, rej) => {
    let contents = false; // So we can grab the content later

    const vFile = vs(input, { path }); // Equivalent to path: path. ES6 Object Literal Shorthand Syntax

    vFile
      .pipe(func()) // Call the function we're going to pass in
      .pipe(
        map((file, cb) => {
          contents = file;
          cb(null, file);
        })
      )
      .on("error", (e) => {
        rej(e);
      })
      .on("end", () => {
        res(contents);
      });
  });
}

t.test("removes unused CSS", async (t) => {
  const source = `
<!DOCTYPE html>
<head>
<title>Dummy HTML</title>
<style type="text/css">
  .real-class-1:active, #head-only-id1[whatnot], whatever[lang|en]{width:100% !important;}
  #real-id-1:hover{width:100% !important;}
</style>
</head>
< body>
<table id="     real-id-1    body-only-id-1    " class="     body-only-class-1 " width="100%" cellspacing="0">
  <tr>
    <td>
      <table width="100%" cellspacing="0">
        <tr id="      body-only-id-4     ">
          <td id="     body-only-id-2     body-only-id-3   " class="     real-class-1      body-only-class-2     body-only-class-3 ">
            Dummy content.
          </td>
        </tr>
      </table>
    </td>
  </tr>
</table>
</body>
</html>
`;

  const intended = `<!DOCTYPE html>
<head>
<title>Dummy HTML</title>
<style type="text/css">
  .real-class-1:active, whatever[lang|en]{width:100% !important;}
  #real-id-1:hover{width:100% !important;}
</style>
</head>
<body>
<table id="real-id-1" width="100%" cellspacing="0">
  <tr>
    <td>
      <table width="100%" cellspacing="0">
        <tr>
          <td class="real-class-1">
            Dummy content.
          </td>
        </tr>
      </table>
    </td>
  </tr>
</table>
</body>
</html>
`;

  const contents = await fromString(
    source,
    "test/source.html",
    geruc
  ).then((output) => output.contents.toString());
  t.equal(contents, intended, "Sass compiled as expected");
  t.end();
});
