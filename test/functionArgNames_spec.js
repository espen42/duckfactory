import { expect } from 'chai';

import fargn from '../lib/functionArgNames';

describe("functionArgNames", ()=>{
    describe("getArgs", ()=> {
        it("returns an array of strings with the names of the direct arguments of an input function", () => {
            const testFunc1 = () => { console.log("Nothing much here"); };
            const testFunc2 = (foo, bar) => { console.log("even less here"); };
            const testFunc3 = (i, know, all, the, best, words) => { console.log("make it go away"); };

            const getArgs = fargn.getArgs;

            expect(getArgs(testFunc3)).to.deep.equal(["i", "know", "all", "the", "best", "words"]);
            expect(getArgs(testFunc2)).to.deep.equal(["foo", "bar"]);
            expect(getArgs(testFunc1)).to.deep.equal([]);
            expect(getArgs(getArgs)).to.deep.equal(["func"]);
        });
    });

    describe("getRefs", ()=>{
        it("returns an array of string with the names of the INDIRECT arguments destructured from the second " +
            "argument of the input function", ()=>{

            const testFunc1 = (one, two) => { console.log("Nothing much here"); };
            const testFunc2 = (one, {two}) => { console.log("even less here"); };
            const testFunc3 = (one, {two, three, four}) => { console.log("even less here"); };
            const testFunc4 = (one) => { console.log("even less here"); };

            const getRefs = fargn.getRefs;

            expect(getRefs(testFunc1, "two")).to.deep.equal(null);
            expect(getRefs(testFunc2, "_ref")).to.deep.equal(["two"]);
            expect(getRefs(testFunc3, "_ref2")).to.deep.equal(["two", "three", "four"]);
            expect(getRefs(testFunc4, "_ref3")).to.deep.equal(null);
        });
    });
});
