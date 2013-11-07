var multimethods = (function (window, undefined) {

    var core = (function (window, undefined) {

        var multimethod = function(dispatcher, table) {
            return function() {
                var dispatched = dispatcher(arguments) || "default";
                return table[dispatched].apply(null, arguments);
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
