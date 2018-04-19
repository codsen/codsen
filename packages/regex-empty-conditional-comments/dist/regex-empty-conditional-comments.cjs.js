'use strict';

var main = (function () {
  return (/<!(--)?\[if[^\]]*]>[<>!-\s]*<!\[endif\]\1>/gi
  );
});

module.exports = main;
