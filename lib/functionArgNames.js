'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
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
    var pattern = new RegExp(ref + "\\.([a-zA-Z0-9_]+)[\\,\\;]", 'g');
    var args = func.toString().match(pattern);
    return args && args.map(function (arg) {
        return arg.slice(ref.length + 1, arg.length - 1);
    });
};

exports.default = {
    getArgs: getFunctionArgNames,
    getRefs: getFunctionRefsNames
};