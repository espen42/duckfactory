'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _stringify = require('babel-runtime/core-js/json/stringify');

var _stringify2 = _interopRequireDefault(_stringify);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/** Returns an array with the names of the direct names of a function (e.g. for the function a = (b, c) => {}
 *  getFunctionArgNames(a) will return ["b", "c"]).
 *
 *  Credit: https://davidwalsh.name/javascript-arguments
 */
var getFunctionArgNames = function getFunctionArgNames(func) {
    var args = func.toString().match(/function\s.*?\(([^)]*)\)/)[1];
    return args.split(',').map(function (arg) {
        return arg.replace(/\/\*.*\*\//, '').trim();
    }).filter(function (arg) {
        return arg;
    });
};

/** Returns an array with the names of the INDIRECT names of the fields of a function's argument object
 *  (e.g. for the function a = (b, c) => {}
  */
var getFunctionRefsNames = function getFunctionRefsNames(func, ref) {
    var funcStr = func.toString();
    console.log("func:", funcStr);
    console.log("ref:", (0, _stringify2.default)(ref));

    var prePattern = new RegExp("function .*? ?\\(.*?\\)\\s*\\{\\s*var ", 'g');
    var promisingIntro = funcStr.match(prePattern);
    //console.log("promisingIntro:", JSON.stringify(promisingIntro));
    if (promisingIntro == null || promisingIntro.length === 0) {
        return null;
    }
    //console.log("promisingIntro.length:", promisingIntro[0].length);
    var promisingBody = funcStr.substr(promisingIntro[0].length);
    //console.log("promisingBody:", JSON.stringify(promisingBody));

    var postPattern = new RegExp("[\\s\\S]*?[;\\}]", 'g');
    var singledOutIntro = promisingBody.match(postPattern);
    if (singledOutIntro == null || singledOutIntro.length === 0) {
        return null;
    }
    var singledOutBody = singledOutIntro[0];
    console.log("singled out:", (0, _stringify2.default)(singledOutBody));

    var pattern = new RegExp("([a-zA-Z0-9_]+?) ?= ?" + ref + "\\.\\1", 'g');
    var args = singledOutBody.match(pattern);
    console.log("args:", (0, _stringify2.default)(args));
    return args && args.map(function (arg) {
        return arg.split("=")[0].trim();
    });
};

exports.default = {
    getArgs: getFunctionArgNames,
    getRefs: getFunctionRefsNames
};