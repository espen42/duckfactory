import { expect } from 'chai';

import check from '../src/check';

const always = true;

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
            expect(check.reducerDuck(
                "PERKELE1",
                ["woop", "wheee", "satanperkele"],
                (state) => {
                    console.log("Awright");
                }
            )).to.equal(true);



            expect(check.reducerDuck(
                "PERKELE2",
                ["woop", "wheee", "satanperkele"],
                (state, action)=>{ console.log("Awright"); },
            )).to.equal(true);



            expect(check.reducerDuck(
                "PERKELE3",
                ["woop", "wheee", "satanperkele"],
                (state, {woop, wheee, satanperkele}) => {
                    console.log("Awright");
                },
            )).to.equal(true);

            // It's happy as long as the reducers's action at least gets the arguments it needs
            expect(check.reducerDuck(
                "PERKELE4",
                ["woop", "wheee", "satanperkele", "excessive", "superfluous", "redundant", "unused"],
                (state, {woop, wheee, satanperkele}) => {
                    console.log("Awright");
                },
            )).to.equal(true);
        });

        it("warns (returns false) if the reducer is missing a state argument", ()=>{
            expect(check.reducerDuck(
                "PERKELE5",
                ["woop", "wheee", "satanperkele"],
                ()=>{ console.log("Awright"); },
            )).to.equal(false);
        });

        it("warns (returns false) if the reducer's second argument is not 'action' or a deconstructed object", ()=>{
            expect(check.reducerDuck(
                "PERKELE6",
                ["woop", "wheee", "satanperkele"],
                (state, ohnoes)=>{ console.log("Awright"); },
            )).to.equal(false);
        });


        it("throws an error if the argument name list doesn't contain all the arguments in " +
            "the reducer's deconstructed action object", ()=>{
            expect( ()=>{
                check.reducerDuck(
                    "PERKELE7",
                    ["woop", "wheee", "satanperkele"],
                    (state, {woop, wheee, nothere})=>{ console.log("Awright"); },
                );
            } ).to.throw(Error);
        });


        it("throws an error if the argument name list contains duplicate names", ()=>{
            expect( ()=>{
                check.reducerDuck(
                    "PERKELE8",
                    ["woop", "wheee", "wheee"],
                    (state, {woop, whee})=>{ console.log("Awright"); },
                );
            } ).to.throw(Error);
        });

        it("throws an error if the argument name list contains invalid variable names" +
            "(for simplicity: ONLY a-z, A-Z, 0-9 and underscore _ )", ()=>{
            // Bad characters
            expect( ()=>{
                check.reducerDuck(
                    "PERKELE9",
                    ["woop", "good1", "pære"],
                    (state, {woop, good1})=>{ console.log("Awright"); },
                );
            } ).to.throw(Error);

            // Starting with a number
            expect( ()=>{
                check.reducerDuck(
                    "PERKELE10",
                    ["woop", "good1", "1bad"],
                    (state, {woop, good1})=>{ console.log("Awright"); },
                );
            } ).to.throw(Error);

            // Reserved word in JS
            expect( ()=>{
                check.reducerDuck(
                    "PERKELE11",
                    ["woop", "good1", "catch"],
                    (state, {woop, good1})=>{ console.log("Awright"); },
                );
            } ).to.throw(Error);

            // Empty string
            expect( ()=>{
                check.reducerDuck(
                    "PERKELE12",
                    ["woop", "good1", ""],
                    (state, {woop, good1})=>{ console.log("Awright"); },
                );
            } ).to.throw(Error);
        });

        it("throws an error if the argument name list contains the name 'type', since that's reserved", ()=>{
            expect( ()=>{
                check.reducerDuck(
                    "PERKELE13",
                    ["woop", "good1", "type"],
                    (state, {woop, good1, type})=>{ console.log("Awright"); },
                );
            } ).to.throw(Error);
        });
    });



    describe(".sagaGoose checks a saga duck (a 'goose'? The creation of a saga-oriented action)", ()=>{

        // It returns true iff all these conditions are true:
        // 1. the sagaGenerator:
        //      - has no argument OR the first argument is action OR the first argument is a deconstructed object, AND
        // 2. the actionArgumentNames array:
        //      - contains at least the arguments that are in a deconstructed sagaGenerator object argument, AND
        //      - contains no duplicate names, AND
        //      - contains only valid argument names, AND
        //      - doesn't contain the argument name 'type', which is reserved
        it("asserts the actionCreators during the creation", ()=> {
            expect(check.sagaGoose(
                "T_PERKELE1",
                ["woop", "wheee", "satanperkele"],
                function*() { while(always) { yield "Awright"; } }
            )).to.equal(true);



            expect(check.sagaGoose(
                "T_PERKELE2",
                ["woop", "wheee", "satanperkele"],
                function* (action){ while(always) { yield "Awright"; } }
            )).to.equal(true);



            expect(check.sagaGoose(
                "T_PERKELE3",
                ["woop", "wheee", "satanperkele"],
                function* ({woop, wheee, satanperkele}) { while(always) { yield "Awright"; } },
            )).to.equal(true);

            // It's happy as long as the reducers's action at least gets the arguments it needs
            expect(check.sagaGoose(
                "T_PERKELE4",
                ["woop", "wheee", "satanperkele", "excessive", "superfluous", "redundant", "unused"],
                function* ({woop, wheee, satanperkele}) { while(always) { yield "Awright"; } },
            )).to.equal(true);
        });

        it("warns (returns false) if the reducer's second argument is not 'action' or a deconstructed object", ()=>{
            expect(check.sagaGoose(
                "T_PERKELE6",
                ["woop", "wheee", "satanperkele"],
                function* (ohnoes){ while(always) { yield "Awright"; } }
            )).to.equal(false);
        });


        it("throws an error if the argument name list doesn't contain all the arguments in " +
            "the reducer's deconstructed action object", ()=>{
            expect( ()=>{
                check.sagaGoose(
                    "T_PERKELE7",
                    ["woop", "wheee", "satanperkele"],
                    function* ({woop, wheee, nothere}){ while(always) { yield "Awright"; } }
                );
            } ).to.throw(Error);
        });


        it("throws an error if the argument name list contains duplicate names", ()=>{
            expect( ()=>{
                check.sagaGoose(
                    "T_PERKELE8",
                    ["woop", "wheee", "wheee"],
                    function* ({woop, whee}){ while(always) { yield "Awright"; } }
                );
            } ).to.throw(Error);
        });

        it("throws an error if the argument name list contains invalid variable names" +
            "(for simplicity: ONLY a-z, A-Z, 0-9 and underscore _ )", ()=>{
            // Bad characters
            expect( ()=>{
                check.sagaGoose(
                    "T_PERKELE9",
                    ["woop", "good1", "pære"],
                    function* ({woop, good1}){ while(always) { yield "Awright"; } }
                );
            } ).to.throw(Error);

            // Starting with a number
            expect( ()=>{
                check.sagaGoose(
                    "T_PERKELE10",
                    ["woop", "good1", "1bad"],
                    function* ({woop, good1}){ while(always) { yield "Awright"; } }
                );
            } ).to.throw(Error);

            // Reserved word in JS
            expect( ()=>{
                check.sagaGoose(
                    "T_PERKELE11",
                    ["woop", "good1", "catch"],
                    function* ({woop, good1}){ while(always) { yield "Awright"; } }
                );
            } ).to.throw(Error);

            // Empty string
            expect( ()=>{
                check.sagaGoose(
                    "T_PERKELE12",
                    ["woop", "good1", ""],
                    function* ({woop, good1}){ while(always) { yield "Awright"; } }
                );
            } ).to.throw(Error);
        });

        it("throws an error if the argument name list contains the name 'type', since that's reserved", ()=>{
            expect( ()=>{
                check.sagaGoose(
                    "T_PERKELE13",
                    ["woop", "good1", "type"],
                    function* ({woop, good1, type}){ while(always) { yield "Awright"; } }
                );
            } ).to.throw(Error);
        });

        it("requires the actionType to be a string or a number", ()=> {

            // String type checked in all previous tests. Not bothering with testing it here.
            expect( ()=>{
                check.sagaGoose(
                    42,
                    ["woop", "good1"],
                    function* ({woop, good1}){ while(always) { yield "Awright"; } }
                );
            } ).to.not.throw(Error);
        });

        it("throws an error if the actionType is not a string or a number", ()=> {
            expect( ()=>{
                check.sagaGoose(
                    null,
                    ["woop", "good1"],
                    function* ({woop, good1}){ while(always) { yield "Awright"; } }
                );
            } ).to.throw(Error);

            expect( ()=>{
                check.sagaGoose(
                    undefined,
                    ["woop", "good1"],
                    function* ({woop, good1}){ while(always) { yield "Awright"; } }
                );
            } ).to.throw(Error);

            expect( ()=>{
                check.sagaGoose(
                    ["hey"],
                    ["woop", "good1"],
                    function* ({woop, good1}){ while(always) { yield "Awright"; } }
                );
            } ).to.throw(Error);


            expect( ()=>{
                check.sagaGoose(
                    {aww: "no"},
                    ["woop", "good1"],
                    function* ({woop, good1}){ while(always) { yield "Awright"; } }
                );
            } ).to.throw(Error);
        });

        it("throws an error on duplicate actionTypes between this duck/goose or any other", ()=> {
            expect( ()=>check.sagaGoose(
                "T_PERKELE14",
                ["woop", "wheee", "satanperkele"],
                function*() { while(always) { yield "Awright"; } }
            )).to.not.throw(Error);

            expect( ()=>check.sagaGoose(
                "WHOOPSIE",
                ["woop", "wheee", "satanperkele"],
                function*() { while(always) { yield "Awright"; } }
            )).to.not.throw(Error);

            expect( ()=>check.sagaGoose(
                "T_PERKELE15",
                ["woop", "wheee", "satanperkele"],
                function*() { while(always) { yield "Awright"; } }
            )).to.not.throw(Error);

            expect( ()=>check.sagaGoose(
                "WHOOPSIE",
                ["woop", "wheee", "satanperkele"],
                function*() { while(always) { yield "Awright"; } }
            )).to.throw(Error);

            expect( ()=>check.sagaGoose(
                "T_PERKELE16",
                ["woop", "wheee", "satanperkele"],
                function*() { while(always) { yield "Awright"; } }
            )).to.not.throw(Error);

            expect( ()=>check.sagaGoose(
                "T_PERKELE16",
                ["woop", "wheee", "satanperkele"],
                function*() { while(always) { yield "Awright"; } }
            )).to.throw(Error);
        });
    });
});
