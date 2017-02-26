import check from './check';

import functionArgNames from './functionArgNames';

const getReducerArgNames = (reducerFunc, actionType) => {
    if (reducerFunc != null) {
        const reducerArgs = functionArgNames.getArgs(reducerFunc);

        if (reducerArgs.length > 1) {
            const secondArg = reducerArgs[1];
            if (secondArg.substr(0, 4) === "_ref") {
                const refArgs = functionArgNames.getRefs(reducerFunc, secondArg);
                if (refArgs == null) {
                    console.warn("Possible flaw in duck action '" + actionType +
                        "': the reducer function expects a deconstructed object ( e.g. {name1, name2, name3} ) as its " +
                        "second argument, but this seems empty");

                }
                return refArgs || [];

            } else if (secondArg !== "action") {
                console.warn("Possible flaw in duck action '" + actionType +
                    "': the reducer function expected 'action' as the name of its second argument");
                return [];
            }
        }
    }
};


export const makeReducer = (reducerTable, initialState) =>
    (state = initialState, action = {}) => {
        const reducer = reducerTable[action.type];
        return (reducer) ? reducer(state, action) : state;
    };


/**
 *  Creates an action-actioncreator-reducer unified complex: a redux duck.
 */
class DuckFactory {
    constructor(actionTypePrefix, initialState, actionAndReducerMapOrMaps, checkAndWarn = true) {
        this._prefix = actionTypePrefix;
        this._initialState = initialState;
        this._actionNum = 0;
        this._reducerTable = {};
        this._checkAndWarn = checkAndWarn;

        this._makeActionCreator = this._makeActionCreator.bind(this);
        this._mutateActionAndReducerMap = this._mutateActionAndReducerMap.bind(this);


        if (actionAndReducerMapOrMaps != null && (typeof actionAndReducerMapOrMaps === 'object')) {
            if (!Array.isArray(actionAndReducerMapOrMaps)) {
                actionAndReducerMapOrMaps = [actionAndReducerMapOrMaps];
            }
            actionAndReducerMapOrMaps.forEach(actionAndReducerMap => {
                this._mutateActionAndReducerMap(actionAndReducerMap);
            });
        }

        this.createReducer = this.createReducer.bind(this);
    }


    _mutateActionAndReducerMap(actionAndReducerMap) {
        Object.keys(actionAndReducerMap).forEach( actionName => {
            let reducerFunction = actionAndReducerMap[actionName];

            const actionArgumentNames = getReducerArgNames(reducerFunction, actionName);

            actionAndReducerMap[actionName] = this._makeActionCreator(
                actionName, actionArgumentNames, reducerFunction);
        });
    }


    _makeActionCreator(actionName, actionArgumentNames = [], reducerFunction) {
        const actionType = this._prefix + "_" + ((actionName == null || actionName === "") ?
            "" + (this._actionNum++) :
            actionName);

        if (this._checkAndWarn) {
            check(actionType, actionArgumentNames, reducerFunction);
        }

        const actionCreator = (...args) => {
            const action = {type: actionType};
            actionArgumentNames.forEach( (key, idx) => { action[key] = args[idx]; } );
            console.log("New reducer action:", action);
            return action;
        };

        console.log("\nReducer actionCreator:", actionName + "(" + actionArgumentNames.join(", ") + ")");
        console.log("\tactionType:", actionType);

        this._reducerTable[actionType] = reducerFunction;

        return actionCreator;
    }


    createReducer() {
        return makeReducer(this._reducerTable, this._initialState);
    }


}
export default DuckFactory;
