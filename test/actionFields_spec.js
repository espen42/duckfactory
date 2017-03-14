/* eslint-disable */
import { expect } from 'chai';

import getActionFields from '../lib/actionFields';

describe("functionArgNames", ()=>{
    describe("getActionFields", ()=>{
        it("returns an array of string with the names of the INDIRECT arguments destructured from the second " +
            "argument of the input function", ()=>{

            const testFunc0 = () => { console.log("Not even an argument here"); };
            const testFunc1 = (state) => { console.log("Not even an action here"); };
            const testFunc2 = (state, two) => { console.log("Nothing much here"); };

            const testFunc2ok = (state, {two}) => { console.log("This is good syntax though"); };
            const testFunc4 = (state, {two, three, four}) => { console.log("This is also a fine syntax"); };
            const testFunc5 = (state, action) => {
                console.log("This is also fine, since the use of action arguments such as " + action.name + " will " +
                    "isolate the names"+action.anyway);
                const b = action.worksFine;

                // TODO: Work out a pattern that avoids including these three instances. Assignments are difficult,
                // since '==' and '===' should be included, while '=' shouldn't.

                action.aPureAssignmentActuallyShouldntCount = 5;
                // const c = action.neitherShouldAComment
                /* Neither this one: const f = action.nopeThisOneShouldntEither */

                return action.too*3;
            };

            const testFuncNone = (state, {}) => { console.log("But again, nothing"); };

            expect(getActionFields(testFunc0, "testFunc0")).to.deep.equal(null);
            expect(getActionFields(testFunc1, "testFunc1")).to.deep.equal(null);
            expect(getActionFields(testFunc2, "testFunc2")).to.deep.equal(null);

            expect(getActionFields(testFunc2ok, "testFunc2ok")).to.deep.equal(["two"]);
            expect(getActionFields(testFunc4, "testFunc4")).to.deep.equal(["two", "three", "four"]);
            expect(getActionFields(testFunc5, "testFunc5")).to.deep.equal(
                [
                    "name", "anyway", "worksFine",
                    "aPureAssignmentActuallyShouldntCount", "neitherShouldAComment", "nopeThisOneShouldntEither",
                    "too"
                ]);

            expect(getActionFields(testFuncNone, "testFuncNone")).to.deep.equal(null);
        });
    });
});