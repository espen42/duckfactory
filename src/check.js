if (window) {
    if (!window.__takenActionNames__) {
        window.__takenActionNames__ = new Set();
    }
}
const takenActionNames = (window) ? window.__takenActionNames__ : new Set();

const checkActionName = actionName => {
    if ((typeof actionName) !== 'string') {
        throw Error("Action name can't be " + JSON.stringify(actionName) + " (" + typeof actionName + "). " +
            "Only strings allowed.");
    }
    if (takenActionNames.has(actionName)) {
        console.warn("Action name " + JSON.stringify(actionName) + " is already taken. " +
            "Action names must be unique (this may just be a case of a double initialization of Duckfactory). " +
            "Existing names are: " + JSON.stringify(takenActionNames));

    } else {
        takenActionNames.add(actionName);
    }
};

const checkActionArgumentNames = (actionArgumentNames, actionType) => {
    actionArgumentNames.forEach( name => {
        if (name === "type") {
            throw Error("Illegal action argument name for action '" + actionType + "' - an argument can't be called " +
                "'type', since that's internally reserved.");
        }
    });
};

export default (func, actionType, actionFields) => {
    checkActionName(actionType);

    if (actionFields != null) {
        checkActionArgumentNames(actionFields, actionType);
    }
};

