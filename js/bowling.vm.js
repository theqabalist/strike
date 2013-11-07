var bowling = _.merge(bowling || {}, (function (window, _, undefined) {
    "use strict";

    var vm = (function (window, _, undefined) {

        var generateEmptyFrameSet = function () {
            var frames = [];
            _.each(_.range(10), function(){
                frames.push({});
            });
            return frames;
        };

        var frameSetToThrows = function (frameset) {
            var nestedScores = framesToScoreGroups(frameset),
                flattenedScores = _.flatten(nestedScores),
                scoresAsStrings = _.take(flattenedScores, _.indexOf(flattenedScores, undefined)),
                scores = specialCharactersToNumbers(scoresAsStrings);
                return scores;
        };

        var framesToScoreGroups = function (frameset) {
            return _.map(frameset, function (frame) {
                if(frame.first !== "x" && frame.first !== "X") {
                    frame.first = parseInt(frame.first, 10) || undefined;
                } else {
                    return [frame.first];
                }
                if(frame.second !== "/") {
                    frame.second = parseInt(frame.second, 10) || undefined;
                }

                return [frame.first, frame.second];
            });
        };

        var specialCharactersToNumbers = function (scoreStrings) {
            return _.map(scoreStrings, function (score, index) {
                if(score === "/") { score = 10 - parseInt(scoreStrings[index-1], 10); }
                if(score === "x" || score === "X") { score = 10; }
                return parseInt(score, 10);
            });
        };

        var recombineFramesWithNewTotals = function (frameSet, totals) {
            return _.map(frameSet, function (frame, index) {
                return {
                    first: frame.first,
                    second: frame.second,
                    total: totals[index]
                };
            });
        };

        var currentFrameInFrameSet = function (frameSet) {
            return _.indexOf(_.map(frameSet, function (frame, index) {
                return frameIsFull(frameSet[index]);
            }), false);
        };

        var frameIsFull = function (frame) {
            var frameIsNotMissingAThrow = !(_.isUndefined(frame.first) || _.isUndefined(frame.second));

            return frameIsAStrike(frame) || frameIsNotMissingAThrow;
        };

        var frameIsAStrike = function (frame) {
            frame = frame || {};
            return frame.first === "x" || frame.first === "X";
        };

        return {
            currentFrameInFrameSet: currentFrameInFrameSet,
            frameIsAStrike: frameIsAStrike,
            frameSetToThrows: frameSetToThrows,
            generateEmptyFrameSet: generateEmptyFrameSet,
            recombineFramesWithNewTotals: recombineFramesWithNewTotals
        };

    })(window, _);

    return {
        vm: vm
    };

})(window, _));
