const varNameRegex = "[a-zA-Z_$][0-9a-zA-Z_$]*";
const prePattern = new RegExp("function .*? ?\\(.*?\\)\\s*\\{\\s*", 'g');

/** Returns an array with the names of the direct names of a function (e.g. for the function a = (b, c) => {}
 *  getFunctionArgNames(a) will return ["b", "c"]).
 *
 *  Credit: https://davidwalsh.name/javascript-arguments
 */
const getFunctionArgNames = (funcStr) => {
    const args = funcStr.match(/function\s.*?\(([^)]*)\)/)[1];
    return args
        .split(',')
        .map(function (arg) {
            return arg.replace(/\/\*.*\*\//, '').trim();
        })
        .filter(function (arg) {
            return arg;
        });
};

/** Assumes the second argument of the function is an object, and parses the function body for fields used from it.
  * Returns an array of those fields, for use as action creator arguments.
  */
const getActionFields = (func, actionType) => {
    const funcStr = func.toString();

    const funcArgNames = getFunctionArgNames(funcStr);
    if (!funcArgNames || funcArgNames.length < 1) {
        console.warn("The action '" + actionType + "' triggers a nullary reducer function. Without a first " +
            "argument to receive state, note that this reducer will always erase any previous state instead of modifying it");

    } else if (funcArgNames.length > 1) {
        const action = funcArgNames[1];

        // Isolates and removes the intro, expecting "function <name>(<variables>) { var" or returning null
        const chuckedIntro = funcStr.match(prePattern);
        if (chuckedIntro == null || chuckedIntro.length === 0) {
            return null;
        }
        const keptBody = funcStr.substr(chuckedIntro[0].length);

        // Keeps all instances of "X = <ref>.X", and makes and returns a list of all X'es.
        const pattern = new RegExp("\\b" + action + "\\." + varNameRegex, 'g');
        const matches = keptBody.match(pattern);
        return matches && matches.map( arg => arg.trim().split('.')[1]);

        // "[\\s\\(\\{\\+]" + // + "[\\s\\,\\;\\)\\}]?
    }

    return null;
};

export default getActionFields;
