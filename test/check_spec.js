import { expect } from 'chai';

import check from '../lib/check';

describe("check", ()=>{

    describe(".reducerDuck checks a reducer duck (creation of a reducer-oriented action)", ()=>{

        it("asserts the actionCreators during the creation", ()=> {
            expect( ()=>{check(
                "ACTION1",
                () => {
                    console.log("Awright");
                }
            )}).to.not.throw(Error);  // But it will log a warning.

            expect(()=>{check(
                "ACTION2",
                (state) => {
                    console.log("Awright");
                }
            )}).to.not.throw(Error); // No problem.

            expect(()=>{check(
                "ACTION3",
                (state, action)=>{ console.log("Awright"); },
            )}).to.not.throw(Error);

            expect(()=>{check(
                "ACTION4",
                (state, {woop, wheee, ohyes}) => { console.log("Awright"); },
            )}).to.not.throw(Error); // No problem, a second destructured object argument is the syntax of choice.

            expect(()=>{check(
                "ACTION5",
                (state, {woop, wheee, type}) => {
                    console.log("Awright");
                },
            )}).to.throw(Error); // Whoa there, can't call an action creator argument 'type'.


            expect(()=>{check(
                "ACTION1",
                (state, {woop, wheee, ohyes}) => { console.log("Awright"); },
            )}).to.throw(Error); // Oh no you don't, there's already been spotted an action called "ACTION1".

        });

    });

});
