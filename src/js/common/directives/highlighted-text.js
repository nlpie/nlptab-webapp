'use strict';
angular.module('nlptabApp')
    .directive('highlightedText', function () {
        return {
            restrict: 'E',
            scope: {
                range: '=range',
                text: '=text'
            },
            link: function (scope) {
                var redraw = function (text) {
                    if (text) {
                        scope.pre = text.substring(0, scope.range.outer.begin);
                        scope.preOuter = text.substring(scope.range.outer.begin, scope.range.inner.begin);
                        scope.highlighted = text.substring(scope.range.inner.begin, scope.range.inner.end);
                        scope.postOuter = text.substring(scope.range.inner.end, scope.range.outer.end);
                        scope.post = text.substring(scope.range.outer.end, scope.text.length);
                    }
                };

                scope.$watch('text', function (text) {
                    redraw(text);
                });

                scope.$watch('range.outer', function () {
                    redraw(scope.text);
                });

                scope.$watch('range.inner', function () {
                    redraw(scope.text);
                });
            },
            template: '<p class="document-text">{{pre}}<span class="annotation">{{preOuter}}</span>' +
                '<span class="annotationInset">{{highlighted}}</span>' +
                '<span class="annotation">{{postOuter}}</span>{{post}}</p>'
        };
    });
