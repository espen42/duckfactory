import { expect } from 'chai';

import check from '../lib/check';

describe("check", ()=>{

    describe(".reducerDuck checks a reducer duck (creation of a reducer-oriented action)", ()=>{

        it("asserts the actionCreators during the creation", ()=> {
            expect( ()=>{ check(
                () => {
                    console.log("Awright");
                },
                "ACTION1",
                [],
            ); }).to.not.throw(Error);  // But it will log a warning.

            expect(()=>{check(
                (state) => {
                    console.log("Awright");
                },
                "ACTION2",
                [],
            ); }).to.not.throw(Error); // No problem.

            expect(()=>{check(
                (state, action)=>{ console.log("Awright"); },
                "ACTION3",
                []
            ); }).to.not.throw(Error);

            expect(()=>{check(
                (state, {woop, wheee, ohyes}) => { console.log("Awright"); },
                "ACTION4",
                ["woop", "wheee", "ohyes"],
            ); }).to.not.throw(Error); // No problem, a second destructured object argument is the syntax of choice.

            expect(()=>{check(
                (state, {woop, wheee, type}) => {
                    console.log("Awright");
                },
                "ACTION5",
                ["woop", "wheee", "type"],
            ); }).to.throw(Error); // Whoa there, can't call an action creator argument 'type'.


            expect(()=>{check(
                (state, {woop, wheee, ohyes}) => { console.log("Awright"); },
                "ACTION1",
                ["woop", "wheee", "ohyes"],
            ); }).to.throw(Error); // Oh no you don't, there's already been spotted an action called "ACTION1".

        });

    });

});
