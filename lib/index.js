'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.makeReducer = undefined;

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

var _typeof2 = require('babel-runtime/helpers/typeof');

var _typeof3 = _interopRequireDefault(_typeof2);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _check = require('./check');

var _check2 = _interopRequireDefault(_check);

var _functionArgNames = require('./functionArgNames');

var _functionArgNames2 = _interopRequireDefault(_functionArgNames);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var getReducerArgNames = function getReducerArgNames(reducerFunc, actionType) {
    if (reducerFunc != null) {
        var reducerArgs = _functionArgNames2.default.getArgs(reducerFunc);

        if (reducerArgs.length > 1) {
            var secondArg = reducerArgs[1];
            if (secondArg.substr(0, 4) === "_ref") {
                var refArgs = _functionArgNames2.default.getRefs(reducerFunc, secondArg);
                if (refArgs == null) {
                    console.warn("Possible flaw in duck action '" + actionType + "': the reducer function expects a deconstructed object ( e.g. {name1, name2, name3} ) as its " + "second argument, but this seems empty");
                }
                return refArgs || [];
            } else if (secondArg !== "action") {
                console.warn("Possible flaw in duck action '" + actionType + "': the reducer function expected 'action' as the name of its second argument");
                return [];
            }
        }
    }
};

var makeReducer = exports.makeReducer = function makeReducer(reducerTable, initialState) {
    return function () {
        var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : initialState;
        var action = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

        var reducer = reducerTable[action.type];
        return reducer ? reducer(state, action) : state;
    };
};

/**
 *  Creates an action-actioncreator-reducer unified complex: a redux duck.
 */

var DuckFactory = function () {
    function DuckFactory(actionTypePrefix, initialState, actionAndReducerMapOrMaps) {
        var _this = this;

        var checkAndWarn = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : true;
        (0, _classCallCheck3.default)(this, DuckFactory);

        this._prefix = actionTypePrefix;
        this._initialState = initialState;
        this._actionNum = 0;
        this._reducerTable = {};
        this._checkAndWarn = checkAndWarn;

        this._makeActionCreator = this._makeActionCreator.bind(this);
        this._mutateActionAndReducerMap = this._mutateActionAndReducerMap.bind(this);

        if (actionAndReducerMapOrMaps != null && (typeof actionAndReducerMapOrMaps === 'undefined' ? 'undefined' : (0, _typeof3.default)(actionAndReducerMapOrMaps)) === 'object') {
            if (!Array.isArray(actionAndReducerMapOrMaps)) {
                actionAndReducerMapOrMaps = [actionAndReducerMapOrMaps];
            }
            actionAndReducerMapOrMaps.forEach(function (actionAndReducerMap) {
                _this._mutateActionAndReducerMap(actionAndReducerMap);
            });
        }

        this.createReducer = this.createReducer.bind(this);
    }

    (0, _createClass3.default)(DuckFactory, [{
        key: '_mutateActionAndReducerMap',
        value: function _mutateActionAndReducerMap(actionAndReducerMap) {
            var _this2 = this;

            (0, _keys2.default)(actionAndReducerMap).forEach(function (actionName) {
                var reducerFunction = actionAndReducerMap[actionName];

                var actionArgumentNames = getReducerArgNames(reducerFunction, actionName);

                actionAndReducerMap[actionName] = _this2._makeActionCreator(actionName, actionArgumentNames, reducerFunction);
            });
        }
    }, {
        key: '_makeActionCreator',
        value: function _makeActionCreator(actionName) {
            var actionArgumentNames = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
            var reducerFunction = arguments[2];

            var actionType = this._prefix + "_" + (actionName == null || actionName === "" ? "" + this._actionNum++ : actionName);

            if (this._checkAndWarn) {
                (0, _check2.default)(actionType, actionArgumentNames, reducerFunction);
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

            console.log("\nReducer actionCreator:", actionName + "(" + actionArgumentNames.join(", ") + ")");
            console.log("\tactionType:", actionType);

            this._reducerTable[actionType] = reducerFunction;

            return actionCreator;
        }
    }, {
        key: 'createReducer',
        value: function createReducer() {
            return makeReducer(this._reducerTable, this._initialState);
        }
    }]);
    return DuckFactory;
}();

exports.default = DuckFactory;