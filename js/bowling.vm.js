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
                numericGroups = specialCharactersToNumbers(nestedScores),
                correctedGroups = correctExcessiveGroups(numericGroups),
                flattenedScores = _.flatten(correctedGroups),
                scores = _.take(flattenedScores, _.findIndex(flattenedScores, function (item) {
                    return _.isNaN(item) || _.isUndefined(item); }));
                return scores;
        };

        var framesToScoreGroups = function (frameset) {
            return _.map(frameset, function (frame) {
                var frameGroup = [];
                frameGroup.push(frame.first);
                if(isStrikeChar(frame.first)) {
                    return frameGroup;
                }
                frameGroup.push(frame.second);
                return frameGroup;
            });
        };

        var isStrikeChar = function (string) {
            return string === "x" ||
                   string === "X";
        };

        var specialCharactersToNumbers = function (frameGroups) {
            return _.map(frameGroups, function (group) {
                var firstNum = parseInt(group[0], 10),
                    secondNum = parseInt(group[1], 10);

                if(isStrikeChar(group[0])) {
                    return [10];
                }
                if(isSpareChar(group[1])) {
                    return [firstNum, 10-firstNum];
                }
                return [firstNum, secondNum];
            });
        };

        var isSpareChar = function (string) { return string === "/"; };

        var correctExcessiveGroups = function (frameGroups) {
            return _.map(frameGroups, function (group) {
                var first = group[0],
                    second = group[1];

                if(first + second > 10) {
                    return [first, 10 - first];
                } else {
                    return group;
                }
            });
        };

        var recombineFramesWithNewTotals = function (frameSet, totals) {
            return _.map(frameSet, function (frame, index) {
                var first = parseInt(frame.first, 10),
                    second = parseInt(frame.second, 10);

                if (first + second >= 10 && !isStrikeChar(first)){
                    second = "/";
                }
                return {
                    first: first || disallowAllButSpecialChars(frame.first),
                    second: second || disallowAllButSpecialChars(frame.second),
                    total: totals[index]
                };
            });
        };

        var disallowAllButSpecialChars = function (string) {
            if(isStrikeChar(string) || isSpareChar(string) || !_.isNaN(parseInt(string, 10))) {
                return string;
            }
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
