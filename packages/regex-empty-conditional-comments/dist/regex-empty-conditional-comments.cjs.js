'use strict';

var main = () => /<!(--)?\[if[^\]]*]>[<>!-\s]*<!\[endif\]\1>/gi;

module.exports = main;
