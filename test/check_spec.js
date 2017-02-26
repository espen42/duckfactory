import { expect } from 'chai';

import check from '../src/check';

describe("check", ()=>{

    describe(".reducerDuck checks a reducer duck (creation of a reducer-oriented action)", ()=>{

        // It returns true iff all these conditions are true:
        // 1. the reducerFunction:
        //      - has a first state argument, AND
        //      - has no second argument OR the second argument is action OR the second argument is a deconstructed object, AND
        // 2. the actionArgumentNames array:
        //      - contains at least the arguments that are in a deconstructed second reducer argument, AND
        //      - contains no duplicate names, AND
        //      - contains only valid argument names, AND
        //      - doesn't contain the argument name 'type', which is reserved
        it("asserts the actionCreators during the creation", ()=> {
            expect(check(
                "ACTION1",
                ["woop", "wheee", "ohyes"],
                (state) => {
                    console.log("Awright");
                }
            )).to.equal(true);

            expect(check(
                "ACTION2",
                ["woop", "wheee", "ohyes"],
                (state, action)=>{ console.log("Awright"); },
            )).to.equal(true);



            expect(check(
                "ACTION3",
                ["woop", "wheee", "ohyes"],
                (state, {woop, wheee, ohyes}) => {
                    console.log("Awright");
                },
            )).to.equal(true);

            // It's happy as long as the reducers's action at least gets the arguments it needs
            expect(check(
                "ACTION4",
                ["woop", "wheee", "ohyes", "excessive", "superfluous", "redundant", "unused"],
                (state, {woop, wheee, ohyes}) => {
                    console.log("Awright");
                },
            )).to.equal(true);
        });

        it("warns (returns false) if the reducer is missing a state argument", ()=>{
            expect(check(
                "ACTION5",
                ["woop", "wheee", "ohyes"],
                ()=>{ console.log("Awright"); },
            )).to.equal(false);
        });

        it("throws an error if the argument name list contains the name 'type', since that's reserved", ()=>{
            expect( ()=>{
                check(
                    "ACTION13",
                    ["woop", "good1", "type"],
                    (state, {woop, good1, type})=>{ console.log("Awright"); },
                );
            } ).to.throw(Error);
        });
    });

});
