var app = app || angular.module("bowling",[]);

app.directive("focus", function($parse) {
    return {
        link: function(scope, element, attrs) {
            var truth = $parse(attrs.focus);
            scope.$watch(truth, function (value) {
                if(value === true) { element[0].focus(); }
            });
        }
    };
});
