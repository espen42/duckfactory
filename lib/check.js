"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _typeof2 = require("babel-runtime/helpers/typeof");

var _typeof3 = _interopRequireDefault(_typeof2);

var _stringify = require("babel-runtime/core-js/json/stringify");

var _stringify2 = _interopRequireDefault(_stringify);

var _set = require("babel-runtime/core-js/set");

var _set2 = _interopRequireDefault(_set);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

if (window) {
    if (!window.__takenActionNames__) {
        window.__takenActionNames__ = new _set2.default();
    }
}
var takenActionNames = window ? window.__takenActionNames__ : new _set2.default();

var checkActionName = function checkActionName(actionName) {
    if (typeof actionName !== 'string') {
        throw Error("Action name can't be " + (0, _stringify2.default)(actionName) + " (" + (typeof actionName === "undefined" ? "undefined" : (0, _typeof3.default)(actionName)) + "). " + "Only strings allowed.");
    }
    if (takenActionNames.has(actionName)) {
        throw Error("Action name " + (0, _stringify2.default)(actionName) + " is already taken. Action names must be unique. " + "Existing names are: " + (0, _stringify2.default)(takenActionNames));
    }
    takenActionNames.add(actionName);
};

var checkActionArgumentNames = function checkActionArgumentNames(actionArgumentNames, actionType) {
    actionArgumentNames.forEach(function (name) {
        if (name === "type") {
            throw Error("Illegal action argument name for action '" + actionType + "' - an argument can't be called " + "'type', since that's internally reserved.");
        }
    });
};

exports.default = function (func, actionType, actionFields) {
    checkActionName(actionType);

    if (actionFields != null) {
        checkActionArgumentNames(actionFields, actionType);
    }
};