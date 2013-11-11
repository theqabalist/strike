describe("multimethods.core", function() {
    "use strict";

    describe("multimethods.core.multimethod", function() {
        it("should take a dispatch function and a dispatch table.", function() {
            var mymethod = multimethods.core.multimethod(function () {

            },
            {});
            expect(mymethod).not.toBeUndefined();
        });

        it("should be available from the window object.", function() {
            var mymethod = multimethod(function () {

            },{});
            expect(mymethod).not.toBeUndefined();
        });

        it("should create an executable method.",function() {
            var mymethod = multimethod(function (incoming) {
                return typeof incoming;
            },{
                number: function(addend) {
                    return 5+addend;
                },
                string : function(append) {
                    return "hello, "+append;
                }
            });

            expect(mymethod(5)).toEqual(10);
            expect(mymethod("world")).toEqual("hello, world");
        });

        it("should be able to throw meaningful errors.",function () {
            var mymethod = multimethod(function () {
               }, {}),
                mymethod2 = multimethod(function () {
                }, {
                    default: function () {}
                }),
                mymethod3 = multimethod(function () {
                    return "not_default";
                }, {});

            expect(mymethod).toThrow("No slot available for signal: default");
            expect(mymethod2).not.toThrow();
            expect(mymethod3).toThrow("No slot available for signal: not_default");
        });

        it("should be able to build multidimensional dispatch.",function () {
            var mymethod = multimethod(function () {
                return ["a","b","c"];
            }, {
                a_b_c: function () { return "hi"; }
            });

            expect(mymethod()).toEqual("hi");
        });
    });
});
