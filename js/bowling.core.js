var bowling = _.merge(bowling || {}, (function (window, _, undefined) {
    "use strict";

    var core = (function (window, _, undefined) {


        var isStrikeFrame = function (acc, item) {
            return item.length === 1 && sum(item) === 10;
        };

        var scoreThusFar = function (acc) {
            return acc.frameTotals[acc.frameTotals.length-1] || 0;
        };

        var processPendingStrikes = function (acc, item) {

            if(acc.strikes.length === 2)
            {
                acc.frameTotals.push(scoreThusFar(acc, item) + item[0] + sum(acc.strikes));
                acc.strikes = _.rest(acc.strikes);
            } else if(acc.strikes.length === 1) {
                if(!isStrikeFrame(acc, item))
                {
                    acc.frameTotals.push(scoreThusFar(acc, item) + sum(item) + sum(acc.strikes));
                    acc.strikes = _.rest(acc.strikes);
                }
            }
            return acc;
        };

        var processPendingSpare = function (acc, item) {
            if(acc.spare) {
                acc.frameTotals.push(scoreThusFar(acc,item) + item[0] + acc.spare);
                acc.spare = 0;
            }

            return acc;
        };

        var processPendingThrows = function (acc, item) {
            acc = processPendingStrikes(acc, item);
            acc = processPendingSpare(acc, item);
            return acc;
        };

        var throwTotaler = multimethod(function (args) {
            var acc = args[0],
                item = args[1],
                currentItemTotal = sum(item),
                spareFrame = item.length === 2 && currentItemTotal === 10;

            if(isStrikeFrame(acc, item)) { return "strike"; }
            if(spareFrame) { return "spare"; }

        },{
            strike: function(acc, item) {
                acc = processPendingThrows(acc, item);
                acc.strikes.push(10);
                return acc;
            },
            spare: function(acc, item) {
                acc = processPendingThrows(acc, item);
                acc.spare = 10;
                return acc;
            },
            default: function(acc, item) {
                acc = processPendingThrows(acc, item);
                acc.frameTotals.push(scoreThusFar(acc, item) + sum(item));
                return acc;
            }
        });

        var sum = function(array) {
            return _.reduce(array, function(acc, item) {
                return acc + item;
            }, 0);
        };

        var convertThrowsToTotals = function (incoming) {
            var initialAccumulator = {
                frameTotals: [],
                spare: 0,
                strikes: []
            };

            incoming = groupThrows(incoming);

            return _.reduce(incoming, throwTotaler, initialAccumulator).frameTotals;
        };

        var groupThrows = function(incoming) {
            var initialAccumulator = {
                grouped: [],
                partial: []
            },
            acc = _.reduce(incoming, function(acc, item, index) {
                acc.partial.push(item);
                if(acc.partial.length === 2) {
                    acc.grouped.push(acc.partial);
                    acc.partial = [];
                } else if(acc.partial.length === 1 && (acc.partial[0] === 10 || index === incoming.length - 1)) {
                    acc.grouped.push(acc.partial);
                    acc.partial = [];
                }
                return acc;
            }, initialAccumulator);

            return acc.grouped;
        };

        return {
            convertThrowsToTotals: convertThrowsToTotals,
            groupThrows: groupThrows
        };

    })(window, _);

    return { core: core };

})(window, _));
