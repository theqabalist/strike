var multimethods = (function (window, undefined) {
    "use strict";
    var core = (function (window, undefined) {

        var possibleJoin = function (signal) {
            return typeof signal === "object" ? signal.join("_") : signal;
        };

        var multimethod = function(dispatcher, table) {
            return function() {
                var signal = possibleJoin(dispatcher.apply(null, arguments)) || "default",
                    slot = table[signal] || function() {
                        throw "No slot available for signal: "+signal;
                    };
                return slot.apply(null, arguments);
            };
        };

        window.multimethod = multimethod;

        return {
            multimethod: multimethod
        };

    })(window);

    return {
        core: core
    };

})(window);
