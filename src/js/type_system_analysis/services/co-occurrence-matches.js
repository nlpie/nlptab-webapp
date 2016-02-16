'use strict';

angular.module('nlptabApp')
  .service('CoOccurrenceMatches', function CoOccurrenceMatches($q, Es, nlptabConfig) {
    var index = nlptabConfig.instanceName + 'analysis';
    var tpType = 'TruePositive';
    var fpType = 'FalsePositive';
    var fnType = 'FalseNegative';


    this.withTypeAndId = function (type, analysisId, pagination) {
      return Es.search({
        index: index,
        type: type,
        body: {
          from: pagination.getFrom(),
          size: pagination.getSize(),
          query: {
            bool: {
              must: [
                {
                  match: {
                    analysisId: analysisId
                  }
                }
              ],
              should: [
                {
                  query_string: {
                    default_field: 'firstId',
                    query: '*'
                  }
                },
                {
                  query_string: {
                    default_field: 'secondId',
                    query: '*'
                  }
                }
              ]
            }
          }
        }
      }).then(function (body) {
        return {
          totalItems: body.hits.total,
          coOccurrenceMatches: body.hits.hits.map(function (hit) {
            return hit._source;
          })
        };
      });
    };
  });
