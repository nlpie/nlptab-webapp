'use strict';

angular.module('nlptabApp')
    .directive('activityIndicator', function () {
        return {
            restrict: 'A',
            link: function (scope, elem, attrs) {
                var opts = {
                    lines: attrs.spinnerLines || 9, // The number of lines to draw
                    length: attrs.spinnerLength || 4, // The length of each line
                    width: attrs.spinnerWidth || 2, // The line thickness
                    radius: attrs.spinnerRadius || 4, // The radius of the inner circle
                    corners: attrs.spinnerCorners || 1, // Corner roundness (0..1)
                    rotate: attrs.spinnerRotate || 23, // The rotation offset
                    direction: attrs.spinnerDirection || 1, // 1: clockwise, -1: counterclockwise
                    color: attrs.spinnerColor || '#000', // #rgb or #rrggbb or array of colors
                    speed: attrs.spinnerSpeed || 1, // Rounds per second
                    trail: attrs.spinnerTrail || 60, // Afterglow percentage
                    shadow: false, // Whether to render a shadow
                    hwaccel: false, // Whether to use hardware acceleration
                    className: 'spinner', // The CSS class to assign to the spinner
                    zIndex: 2e9, // The z-index (defaults to 2000000000)
                    top: '50%', // Top position relative to parent
                    left: '50%' // Left position relative to parent
                };
                var spinner = new Spinner(opts).spin();
                var obj = elem.get(0);
                obj.style.width = (opts.length + opts.radius) * 2 + '2px';
                obj.style.height = (opts.length + opts.radius) * 2 + '2px';
                obj.style.position = 'relative';
                obj.appendChild(spinner.el);
            }
        };
    });
