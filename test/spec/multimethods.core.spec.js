describe("multimethods.core", function() {
    describe("multimethods.core.multimethod", function() {
        it("should take a dispatch function and a dispatch table.", function() {
            var mymethod = multimethods.core.multimethod(function(args){

            },
            {});
        });

        it("should be available from the window object.", function() {
            var mymethod = multimethod(function(args) {

            },{});
        });

        it("should create an executable method.",function() {
            var mymethod = multimethod(function(args) {
                return typeof args[0];
            },{
                "number": function(addend) {
                    return 5+addend;
                },
                "string": function(append) {
                    return "hello, "+append;
                }
            });

            expect(mymethod(5)).toEqual(10);
            expect(mymethod("world")).toEqual("hello, world");
        });
    });
});
