'use strict';

angular.module('nlptabApp')
    .filter('startAt', function () {
        return function(input, index) {
            index = +index;
            return input && input.slice(index);
        };
    });
