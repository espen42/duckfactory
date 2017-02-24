"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.makeReducer = undefined;

var _classCallCheck2 = require("babel-runtime/helpers/classCallCheck");

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require("babel-runtime/helpers/createClass");

var _createClass3 = _interopRequireDefault(_createClass2);

var _check = require("./check");

var _check2 = _interopRequireDefault(_check);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var makeReducer = exports.makeReducer = function makeReducer(reducerTable, initialState) {
    return function () {
        var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : initialState;
        var action = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

        var reducer = reducerTable[action.type];
        return reducer ? reducer(state, action) : state;
    };
};

/**
 *  Creates a action-actioncreator-reducer unified complex: a duck.
 */

var DuckFactory = function () {
    function DuckFactory(actionPrefix, initialState, checkAndWarn) {
        (0, _classCallCheck3.default)(this, DuckFactory);

        this._prefix = actionPrefix;
        this._initialState = initialState;
        this._actionNum = 0;
        this._reducerTable = {};
        this._checkAndWarn = checkAndWarn;

        this.makeActionCreator = this.makeActionCreator.bind(this);
        this.createReducer = this.createReducer.bind(this);
    }

    (0, _createClass3.default)(DuckFactory, [{
        key: "makeActionCreator",
        value: function makeActionCreator(actionName, actionArgumentNames, reducerFunction) {
            var actionType = this._prefix + "_" + (actionName == null || actionName === "" ? "" + this._actionNum++ : actionName);

            if (this._checkAndWarn) {
                _check2.default.reducerDuck(actionType, actionArgumentNames, reducerFunction);
            }

            var actionCreator = function actionCreator() {
                for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
                    args[_key] = arguments[_key];
                }

                var action = { type: actionType };
                actionArgumentNames.forEach(function (key, idx) {
                    action[key] = args[idx];
                });
                console.log("New reducer action:", action);
                return action;
            };

            this._reducerTable[actionType] = reducerFunction;

            return actionCreator;
        }
    }, {
        key: "createReducer",
        value: function createReducer() {
            return makeReducer(this._reducerTable, this._initialState);
        }
    }]);
    return DuckFactory;
}();

exports.default = DuckFactory;