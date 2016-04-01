'use strict';

angular.module('nlptabApp').
    service('Sofa', function Sofa($q, Es) {
        var mapSources = function (body) {
            if (body && body.hits && body.hits.hits) {
                return body.hits.hits.map(function (currentValue) {
                    return currentValue._source;
                });
            } else {
                return [];
            }
        };

        this.containingPhraseInText = function (indexName, queryString, from, size) {
            var deferred = $q.defer();
            var search = {
                index: indexName,
                type: 'Document',
                body: {
                    from: from,
                    size: size
                }
            };

            if (queryString && queryString.length > 0) {
                search.body.query = {
                    query_string: {
                        default_field: 'text',
                        query: '"' + queryString + '"'
                    }
                } ;
            } else {
                search.body.query = {
                    match_all : {}
                };
            }

            Es.search(search).then(function (body) {
                var sources = mapSources(body);
                deferred.resolve({total: body && body.hits && body.hits.total || 0, sofas: sources});
            });
            return deferred.promise;
        };

        this.withSofaIdentifier = function (index, sofaIdentifier) {
            return Es.getSource({
                index: index,
                type: 'Document',
                id: sofaIdentifier
            }).then(function (result) {
                return result;
            });
        };
    });
