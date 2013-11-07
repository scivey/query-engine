(function() {
  var Backbone, assert, describe, generateTestSuite, joe, key, modelsObject, queryEngine, queryTests, stores, today, tomorrow, value, yesterday,
    __hasProp = {}.hasOwnProperty;

  queryEngine = this.queryEngine || require(__dirname + '/../lib/query-engine');

  assert = this.assert || require('assert');

  Backbone = this.Backbone || ((function() {
    try {
      return typeof require === "function" ? require('backbone') : void 0;
    } catch (_error) {}
  })()) || ((function() {
    try {
      return typeof require === "function" ? require('exoskeleton') : void 0;
    } catch (_error) {}
  })()) || ((function() {
    throw 'Need Backbone or Exoskeleton';
  })());

  joe = this.joe || require('joe');

  describe = joe.describe;

  today = new Date();

  today.setHours(0);

  today.setMinutes(0);

  today.setSeconds(0);

  tomorrow = new Date();

  tomorrow.setDate(today.getDate() + 1);

  yesterday = new Date();

  yesterday.setDate(today.getDate() - 1);

  modelsObject = {
    'index': {
      id: 'index',
      title: 'Index Page',
      content: 'this is the index page',
      tags: [],
      position: 1,
      positionNullable: null,
      category: 1,
      date: today,
      good: true,
      obj: {
        a: 1,
        b: 2
      }
    },
    'jquery': {
      id: 'jquery',
      title: 'jQuery',
      content: 'this is about jQuery',
      tags: ['jquery'],
      position: 2,
      positionNullable: 2,
      category: 1,
      date: yesterday,
      good: false
    },
    'history': {
      id: 'history',
      title: 'History.js',
      content: 'this is about History.js',
      tags: ['jquery', 'html5', 'history'],
      position: 3,
      positionNullable: 3,
      category: 1,
      date: tomorrow
    }
  };

  stores = {
    modelsAsObject: modelsObject,
    modelsAsArray: (function() {
      var _results;
      _results = [];
      for (key in modelsObject) {
        if (!__hasProp.call(modelsObject, key)) continue;
        value = modelsObject[key];
        _results.push(value);
      }
      return _results;
    })(),
    modelsAsParsedObject: queryEngine.createCollection(modelsObject),
    modelsAsCollection: queryEngine.createCollection({
      'index': new Backbone.Model(modelsObject.index),
      'jquery': new Backbone.Model(modelsObject.jquery),
      'history': new Backbone.Model(modelsObject.history)
    })
  };

  queryTests = {
    'beginsWith': {
      query: {
        title: {
          $beginsWith: 'Index'
        }
      },
      expected: ['index']
    },
    'endsWidth': {
      query: {
        title: {
          $endsWith: '.js'
        }
      },
      expected: ['history']
    },
    'string': {
      query: {
        id: 'index'
      },
      expected: ['index']
    },
    'number': {
      query: {
        position: 3
      },
      expected: ['history']
    },
    'date': {
      query: {
        date: today
      },
      expected: ['index']
    },
    'regex': {
      query: {
        id: /^[hj]/
      },
      expected: ['jquery', 'history']
    },
    'joint': {
      query: {
        id: 'index',
        category: 1
      },
      expected: ['index']
    },
    'boolean-true': {
      query: {
        good: true
      },
      expected: ['index']
    },
    'boolean-false': {
      query: {
        good: false
      },
      expected: ['jquery']
    },
    '$and': {
      query: {
        $and: [
          {
            id: 'index'
          }, {
            position: 1
          }
        ]
      },
      expected: ['index']
    },
    '$and-none': {
      query: {
        $and: [
          {
            random: Math.random()
          }
        ]
      },
      expected: []
    },
    '$not': {
      query: {
        $not: [
          {
            id: 'index'
          }, {
            position: 1
          }
        ]
      },
      expected: ['jquery', 'history']
    },
    '$or': {
      query: {
        $or: [
          {
            id: 'index'
          }, {
            position: 2
          }
        ]
      },
      expected: ['index', 'jquery']
    },
    '$or-object': {
      query: {
        $or: {
          id: 'index',
          position: 2
        }
      },
      expected: ['index', 'jquery']
    },
    '$or-none': {
      query: {
        $or: [
          {
            random: Math.random()
          }
        ]
      },
      expected: []
    },
    '$nor': {
      query: {
        $nor: [
          {
            id: 'index'
          }, {
            position: 2
          }
        ]
      },
      expected: ['history']
    },
    '$nor-none': {
      query: {
        $nor: [
          {
            random: Math.random()
          }
        ]
      },
      expected: ['index', 'jquery', 'history']
    },
    '$ne': {
      query: {
        id: {
          $ne: 'index'
        }
      },
      expected: ['jquery', 'history']
    },
    '$all': {
      query: {
        tags: {
          $all: ['jquery']
        }
      },
      expected: ['jquery']
    },
    '$in': {
      query: {
        tags: {
          $in: 'jquery'
        }
      },
      expected: ['jquery', 'history']
    },
    '$in-array': {
      query: {
        position: {
          $in: [1, 2]
        }
      },
      expected: ['index', 'jquery']
    },
    '$nin': {
      query: {
        tags: {
          $nin: ['history']
        }
      },
      expected: ['index', 'jquery']
    },
    '$size': {
      query: {
        tags: {
          $size: 3
        }
      },
      expected: ['history']
    },
    '$like': {
      query: {
        content: {
          $like: 'INDEX'
        }
      },
      expected: ['index']
    },
    '$likeSensitive - one': {
      query: {
        content: {
          $likeSensitive: 'INDEX'
        }
      },
      expected: []
    },
    '$likeSensitive - two': {
      query: {
        content: {
          $likeSensitive: 'index'
        }
      },
      expected: ['index']
    },
    '$mod': {
      query: {
        position: {
          $mod: [2, 0]
        }
      },
      expected: ['jquery']
    },
    '$eq': {
      query: {
        obj: {
          $eq: {
            a: 1,
            b: 2
          }
        }
      },
      expected: ['index']
    },
    '$bt': {
      query: {
        position: {
          $bt: [1, 3]
        }
      },
      expected: ['jquery']
    },
    '$bte': {
      query: {
        position: {
          $bte: [2, 3]
        }
      },
      expected: ['jquery', 'history']
    },
    '$gt': {
      query: {
        position: {
          $gt: 2
        }
      },
      expected: ['history']
    },
    '$gt-date': {
      query: {
        date: {
          $gt: today
        }
      },
      expected: ['history']
    },
    '$gte': {
      query: {
        position: {
          $gte: 2
        }
      },
      expected: ['jquery', 'history']
    },
    '$lt': {
      query: {
        position: {
          $lt: 2
        }
      },
      expected: ['index']
    },
    '$lt-date': {
      query: {
        date: {
          $lt: today
        }
      },
      expected: ['jquery']
    },
    '$lte': {
      query: {
        position: {
          $lte: 2
        }
      },
      expected: ['index', 'jquery']
    },
    '$lte-date': {
      query: {
        date: {
          $lte: today
        }
      },
      expected: ['index', 'jquery']
    },
    '$has': {
      query: {
        tags: {
          $has: 'jquery'
        }
      },
      expected: ['jquery', 'history']
    },
    '$in-null': {
      query: {
        positionNullable: {
          $in: [null]
        }
      },
      expected: ['index']
    },
    '$in-null-array': {
      query: {
        positionNullable: {
          $in: [null, 2]
        }
      },
      expected: ['index', 'jquery']
    },
    '$in-false': {
      query: {
        good: {
          $in: false
        }
      },
      expected: ['jquery']
    },
    "null values should show up when searching for them": {
      query: {
        positionNullable: null
      },
      expected: ['index']
    },
    "null values shouldn't show up in greater than or equal to comparisons": {
      query: {
        positionNullable: {
          $gte: 0
        }
      },
      expected: ['jquery', 'history']
    },
    "null values shouldn't show up in less than comparisons": {
      query: {
        positionNullable: {
          $lte: 3
        }
      },
      expected: ['jquery', 'history']
    }
  };

  generateTestSuite = function(describe, it, storeName, store) {
    return describe(storeName, function(describe, it) {
      if (!(store instanceof queryEngine.QueryCollection)) {
        return describe('queries', function(describe, it) {
          var queryTest, queryTestName, _results;
          _results = [];
          for (queryTestName in queryTests) {
            if (!__hasProp.call(queryTests, queryTestName)) continue;
            queryTest = queryTests[queryTestName];
            _results.push(it(queryTestName, function() {
              var actual, criteriaOptions, expected, expectedModelId, _i, _len, _ref;
              if (queryTest.debug) {
                debugger;
              }
              criteriaOptions = {
                queries: {
                  find: queryTest.query
                }
              };
              actual = queryEngine.testModels(store, criteriaOptions);
              expected = [];
              _ref = queryTest.expected;
              for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                expectedModelId = _ref[_i];
                expected.push(stores.modelsAsObject[expectedModelId]);
              }
              if (queryTest.debug) {
                console.log({
                  actual: actual,
                  expected: expected
                });
              }
              return assert.deepEqual(actual, expected);
            }));
          }
          return _results;
        });
      } else {
        describe('queries', function(describe, it) {
          var queryTest, queryTestName, _results;
          _results = [];
          for (queryTestName in queryTests) {
            if (!__hasProp.call(queryTests, queryTestName)) continue;
            queryTest = queryTests[queryTestName];
            _results.push(it(queryTestName, function() {
              var actual, expected, expectedModelId, expectedModels, _i, _len, _ref;
              if (queryTest.debug) {
                debugger;
              }
              actual = store.findAll(queryTest.query);
              expectedModels = {};
              _ref = queryTest.expected;
              for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                expectedModelId = _ref[_i];
                expectedModels[expectedModelId] = store.get(expectedModelId);
              }
              expected = queryEngine.createCollection(expectedModels);
              if (queryTest.debug) {
                console.log({
                  actual: actual,
                  expected: expected
                });
              }
              return assert.deepEqual(actual.toJSON(), expected.toJSON());
            }));
          }
          return _results;
        });
        describe('special', function(describe, it) {
          it('all', function() {
            var actual, expected;
            actual = store;
            expected = store;
            return assert.deepEqual(actual.toJSON(), expected.toJSON());
          });
          return it('findOne', function() {
            var actual, expected;
            actual = store.findOne({
              tags: {
                $has: 'jquery'
              }
            });
            return expected = store.get('jquery');
          });
        });
        return describe('paging', function(describe, it) {
          it('limit', function() {
            var actual, expected;
            actual = store.createChildCollection().query({
              limit: 1
            });
            expected = queryEngine.createCollection({
              'index': store.get('index')
            });
            return assert.deepEqual(actual.toJSON(), expected.toJSON());
          });
          it('limit+page', function() {
            var actual, expected;
            actual = store.createChildCollection().query({
              limit: 1,
              page: 2
            });
            expected = queryEngine.createCollection({
              'jquery': store.get('jquery')
            });
            return assert.deepEqual(actual.toJSON(), expected.toJSON());
          });
          it('limit+offset', function() {
            var actual, expected;
            actual = store.createChildCollection().query({
              limit: 1,
              offset: 1
            });
            expected = queryEngine.createCollection({
              'jquery': store.get('jquery')
            });
            return assert.deepEqual(actual.toJSON(), expected.toJSON());
          });
          it('limit+offset+page', function() {
            var actual, expected;
            actual = store.createChildCollection().query({
              limit: 1,
              offset: 1,
              page: 2
            });
            expected = queryEngine.createCollection({
              'history': store.get('history')
            });
            return assert.deepEqual(actual.toJSON(), expected.toJSON());
          });
          it('limit+offset+page (via findAll)', function() {
            debugger;
            var actual, expected;
            actual = store.findAll({
              id: {
                $exists: true
              }
            }, null, {
              limit: 1,
              offset: 1,
              page: 2
            });
            expected = queryEngine.createCollection({
              'history': store.get('history')
            });
            return assert.deepEqual(actual.toJSON(), expected.toJSON());
          });
          return it('offset', function() {
            var actual, expected;
            actual = store.createChildCollection().query({
              offset: 1
            });
            expected = queryEngine.createCollection({
              'jquery': store.get('jquery'),
              'history': store.get('history')
            });
            return assert.deepEqual(actual.toJSON(), expected.toJSON());
          });
        });
      }
    });
  };

  describe('queries', function(describe, it) {
    var store, storeName, _results;
    _results = [];
    for (storeName in stores) {
      if (!__hasProp.call(stores, storeName)) continue;
      store = stores[storeName];
      _results.push(generateTestSuite(describe, it, storeName, store));
    }
    return _results;
  });

  null;

}).call(this);
