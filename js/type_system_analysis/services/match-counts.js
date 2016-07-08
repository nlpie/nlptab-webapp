'use strict';

angular.module('nlptabApp')
  .service('MatchCounts', function MatchCounts($q, Es, nlptabConfig) {
    var index = nlptabConfig.instanceName + 'analysis';
    var type = 'MatchCounts';

    /**
     * Uses an elasticsearch facet to get all tested systems.
     *
     * @returns {Array}
     */
    this.allTested = function () {
      return Es.search({
        index: index,
        type: type,
        body: {
          from: 0,
          size: 0,
          query: {
            match_all: {}
          },
          aggs: {
            tested: {
              terms: {
                field: 'hypothesisUnitOfAnalysis.systemIndex',
                size: 10
              }
            }
          }
        }
      }).then(function (body) {
        if (body && body.aggregations && body.aggregations.tested && body.aggregations.tested.buckets) {
          return body.aggregations.tested.buckets.map(function (item) {
            return item.key;
          });
        } else {
          return $q.reject('Invalid response');
        }
      });
    };

    /**
     * Uses a faceted elasticsearch search to return all gold standards for a specific tested
     *
     * @param {String} tested
     * @returns {Array}
     */
    this.allGoldStandardsForTested = function (tested) {
      return Es.search({
        index: index,
        type: type,
        body: {
          from: 0,
          size: 0,
          query: {
            term: {
              'hypothesisUnitOfAnalysis.systemIndex': tested
            }
          },
          aggs: {
            gold: {
              terms: {
                field: 'referenceUnitOfAnalysis.systemIndex',
                size: 10
              }
            }
          }
        }
      }).then(function (body) {
        if (body && body.aggregations && body.aggregations.gold && body.aggregations.gold.buckets) {
          return body.aggregations.gold.buckets.map(function (item) {
            return item.key;
          });
        } else {
          return $q.reject('Invalid response');
        }
      });
    };

    /**
     * Returns all match counts that have the tested system and the gold standard.
     *
     * @param {String} tested
     * @param {String} goldStandard
     * @param {Object} pagination
     * @returns {Array}
     */
    this.withTestedAndGoldStandard = function (tested, goldStandard, pagination) {
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
                  term: {
                    'hypothesisUnitOfAnalysis.systemIndex': tested
                  }
                },
                {
                  term: {
                    'referenceUnitOfAnalysis.systemIndex': goldStandard
                  }
                }
              ]
            }
          }
        }
      }).then(function (body) {
        if (body && body.hits && body.hits.hits) {
          return {
            matchCounts: body.hits.hits.map(function (hit) {
              return angular.extend(hit._source, {
                _id: hit._id
              });
            }),
            total: body.hits.total
          };
        } else {
          return $q.reject('Invalid response');
        }
      });
    };

    this.withId = function (id) {
      return Es.get({
        index: index,
        type: type,
        id: id
      }).then(function (response) {
        return response._source;
      });
    };

    this.countTested = function (tested) {
      return Es.search({
        index: index,
        type: type,
        body: {
          from: 0,
          size: 0,
          query: {
            term: {
              'hypothesisUnitOfAnalysis.systemIndex': tested
            }
          }
        }
      }).then(function (body) {
        return body.hits.total;
      });
    };

    this.countTestedAndGold = function(tested, goldStandard) {
      return Es.search({
        index: index,
        type: type,
        body: {
          from: 0,
          size: 0,
          query: {
            bool: {
              must: [
                {
                  term: {
                    'hypothesisUnitOfAnalysis.systemIndex': tested
                  }
                },
                {
                  term: {
                    'referenceUnitOfAnalysis.systemIndex': goldStandard
                  }
                }
              ]
            }
          }
        }
      }).then(function (body) {
        if (body && body.hits) {
          return body.hits.total;
        } else {
          return $q.reject('Invalid response');
        }
      });
    }
  });
