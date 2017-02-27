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




let actionNum = 0;
const getActionType = (prefix, actionName) =>
    (prefix != null ? prefix : "") +
    ((actionName == null || actionName === "") ?
        "" + (actionNum++) :
        actionName);


const makeActionCreator = (actionType, actionArgumentNames = []) => (...args) => {
    const action = {type: actionType};
    actionArgumentNames.forEach( (key, idx) => { action[key] = args[idx]; } );
    console.log("New reducer action:", action);
    return action;
};



const buildActionCreatorAndReducerMap = (prefix, actionAndReducerMap, checkAndWarn, logProduced) => {
    const actionCreatorMap = {};
    const reducerMap = {};
    const typeMap = {};

    Object.keys(actionAndReducerMap).forEach( actionName => {

        const actionType = getActionType(prefix, actionName);
        let reducerFunction = actionAndReducerMap[actionName];
        const actionArgumentNames = getReducerArgNames(reducerFunction, actionName) || [];

        if (checkAndWarn) {
            check(actionType, actionArgumentNames, reducerFunction);
        }

        actionCreatorMap[actionName] = makeActionCreator(actionType, actionArgumentNames);
        reducerMap[actionName] = reducerFunction;
        typeMap[actionName] = actionType;

        if (logProduced) {
            console.log("\nActionCreator: getActionCreators()." + actionName + "(" + actionArgumentNames.join(", ") + ")");
            console.log("\tType: getTypes()." + actionName + " = '" + actionType + "'");
        }
    });

    return [actionCreatorMap, reducerMap, typeMap];
};


/**
 *  Creates an action-actioncreator-reducer unified complex: a redux duck.
 */
class DuckFactory {
    constructor(actionTypePrefix, initialState, actionAndReducerMap, checkAndWarn = true, logProduced = false) {
        if (actionAndReducerMap == null || (typeof actionAndReducerMap !== 'object')) {
            throw Error("Can't create a duck without actionAndReducerMap: action creator name --> reducer function");
        }

        const [actionCreatorMap, reducerMap, typeMap] = buildActionCreatorAndReducerMap(
            actionTypePrefix, actionAndReducerMap, checkAndWarn, logProduced);

        this._actionCreators = actionCreatorMap;
        this._reducer = makeReducer(reducerMap, initialState);
        this._types = typeMap;

        this.getReducer = this.getReducer.bind(this);
        this.getActionCreators = this.getActionCreators.bind(this);
        this.getTypes = this.getTypes.bind(this);
    }

    getReducer() { return this._reducer; }
    getActionCreators() { return this._actionCreators; }
    getTypes() { return this._types; }

}
export default DuckFactory;
