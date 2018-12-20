(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	global.regexEmptyConditionalComments = factory();
}(typeof self !== 'undefined' ? self : this, function () { 'use strict';

	var main = () => /<!(--)?\[if[^\]]*]>[<>!-\s]*<!\[endif\]\1>/gi;

	return main;

}));
