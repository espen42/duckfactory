import check from './check';


export const makeReducer = (reducerTable, initialState) =>
    (state = initialState, action = {}) => {
        const reducer = reducerTable[action.type];
        return (reducer) ? reducer(state, action) : state;
    };


/**
 *  Creates a action-actioncreator-reducer unified complex: a duck.
 */
class DuckFactory {
    constructor(actionPrefix, initialState, checkAndWarn) {
        this._prefix = actionPrefix;
        this._initialState = initialState;
        this._actionNum = 0;
        this._reducerTable = {};
        this._checkAndWarn = checkAndWarn;

        this.makeActionCreator = this.makeActionCreator.bind(this);
        this.createReducer = this.createReducer.bind(this);
    }

    makeActionCreator(actionName, actionArgumentNames, reducerFunction) {
        const actionType = this._prefix + "_" + ((actionName == null || actionName === "") ?
            "" + (this._actionNum++) :
            actionName);

        if (this._checkAndWarn) {
            check.reducerDuck(actionType, actionArgumentNames, reducerFunction);
        }

        const actionCreator = (...args) => {
            const action = {type: actionType};
            actionArgumentNames.forEach( (key, idx) => { action[key] = args[idx]; } );
            console.log("New reducer action:", action);
            return action;
        };

        this._reducerTable[actionType] = reducerFunction;

        return actionCreator;
    }

    createReducer() {
        return makeReducer(this._reducerTable, this._initialState);
    }
}
export default DuckFactory;
