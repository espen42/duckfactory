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
    console.log("func:", func.toString);
    console.log("ref:", (0, _stringify2.default)(ref));
    var pattern = new RegExp(ref + "\\.([a-zA-Z0-9_]+)[\\,\\;]", 'g');
    var args = func.toString().match(pattern);
    console.log("args:", (0, _stringify2.default)(args));
    return args && args.map(function (arg) {
        return arg.slice(ref.length + 1, arg.length - 1);
    });
};

exports.default = {
    getArgs: getFunctionArgNames,
    getRefs: getFunctionRefsNames
};