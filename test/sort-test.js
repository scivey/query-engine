(function() {
  var Backbone, assert, describe, generateTestSuite, joe, queryEngine, store, today, tomorrow, yesterday,
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

  store = {
    associatedStandard: queryEngine.createCollection({
      'index': {
        id: 'index',
        title: 'Index Page',
        content: 'this is the index page',
        tags: [],
        position: 2,
        category: 1,
        date: today,
        good: true,
        order: 1
      },
      'jquery': {
        id: 'jquery',
        title: 'jQuery',
        content: 'this is about jQuery',
        tags: ['jquery'],
        position: 3,
        category: 1,
        date: yesterday,
        good: false,
        order: 2
      },
      'history': {
        id: 'history',
        title: 'History.js',
        content: 'this is about History.js',
        tags: ['jquery', 'html5', 'history'],
        position: 4,
        category: 1,
        date: tomorrow,
        order: 3
      }
    }),
    associatedModels: queryEngine.createCollection({
      'index': new Backbone.Model({
        id: 'index',
        title: 'Index Page',
        content: 'this is the index page',
        tags: [],
        position: 2,
        category: 1,
        date: today,
        good: true,
        order: 1
      }),
      'jquery': new Backbone.Model({
        id: 'jquery',
        title: 'jQuery',
        content: 'this is about jQuery',
        tags: ['jquery'],
        position: 3,
        category: 1,
        date: yesterday,
        good: false,
        order: 2
      }),
      'history': new Backbone.Model({
        id: 'history',
        title: 'History.js',
        content: 'this is about History.js',
        tags: ['jquery', 'html5', 'history'],
        position: 4,
        category: 1,
        date: tomorrow,
        order: 3
      })
    })
  };

  generateTestSuite = function(describe, it, collectionName, docs) {
    return describe(collectionName, function(describe, it) {
      describe('sortArray', function(describe, it) {
        it('string-object', function() {
          var actual, expected;
          actual = queryEngine.createCollection(docs.models).sortArray({
            title: 1
          });
          expected = queryEngine.createCollection([docs.get('history'), docs.get('index'), docs.get('jquery')]);
          return assert.deepEqual(actual, expected.toJSON());
        });
        it('numeric-function', function() {
          var actual, expected;
          actual = queryEngine.createCollection(docs.models).sortArray(function(a, b) {
            return b.position - a.position;
          });
          expected = queryEngine.createCollection([docs.get('history'), docs.get('jquery'), docs.get('index')]);
          return assert.deepEqual(actual, expected.toJSON());
        });
        it('numeric-object', function() {
          var actual, expected;
          actual = queryEngine.createCollection(docs.models).sortArray({
            position: -1
          });
          expected = queryEngine.createCollection([docs.get('history'), docs.get('jquery'), docs.get('index')]);
          return assert.deepEqual(actual, expected.toJSON());
        });
        it('date-function', function() {
          var actual, expected;
          actual = queryEngine.createCollection(docs.models).sortArray(function(a, b) {
            return b.date - a.date;
          });
          expected = queryEngine.createCollection([docs.get('history'), docs.get('index'), docs.get('jquery')]);
          return assert.deepEqual(actual, expected.toJSON());
        });
        return it('date-object', function() {
          var actual, expected;
          actual = queryEngine.createCollection(docs.models).sortArray({
            date: -1
          });
          expected = queryEngine.createCollection([docs.get('history'), docs.get('index'), docs.get('jquery')]);
          return assert.deepEqual(actual, expected.toJSON());
        });
      });
      describe('sortCollection', function(describe, it) {
        it('numeric-function', function() {
          var actual, expected;
          actual = queryEngine.createCollection(docs.models).sortCollection(function(a, b) {
            return b.get('position') - a.get('position');
          });
          expected = queryEngine.createCollection([docs.get('history'), docs.get('jquery'), docs.get('index')]);
          return assert.deepEqual(actual.toJSON(), expected.toJSON());
        });
        it('numeric-object', function() {
          var actual, expected;
          actual = queryEngine.createCollection(docs.models).sortCollection({
            position: -1
          });
          expected = queryEngine.createCollection([docs.get('history'), docs.get('jquery'), docs.get('index')]);
          return assert.deepEqual(actual.toJSON(), expected.toJSON());
        });
        it('date-function', function() {
          var actual, expected;
          actual = queryEngine.createCollection(docs.models).sortCollection(function(a, b) {
            return b.get('date') - a.get('date');
          });
          expected = queryEngine.createCollection([docs.get('history'), docs.get('index'), docs.get('jquery')]);
          return assert.deepEqual(actual.toJSON(), expected.toJSON());
        });
        return it('date-object', function() {
          var actual, expected;
          actual = queryEngine.createCollection(docs.models).sortCollection({
            date: -1
          });
          expected = queryEngine.createCollection([docs.get('history'), docs.get('index'), docs.get('jquery')]);
          return assert.deepEqual(actual.toJSON(), expected.toJSON());
        });
      });
      describe('queryArray', function(describe, it) {
        it('queryArray', function() {
          var actual, expected;
          actual = queryEngine.createCollection(docs.models).queryArray({
            tags: {
              $has: 'jquery'
            }
          }, {
            position: -1
          });
          expected = queryEngine.createCollection([docs.get('history'), docs.get('jquery')]).toJSON();
          return assert.deepEqual(actual, expected);
        });
        return it('queryArray-paging', function() {
          var actual, expected;
          actual = queryEngine.createCollection(docs.models).queryArray({
            tags: {
              $has: 'jquery'
            }
          }, {
            position: -1
          }, {
            limit: 1
          });
          expected = queryEngine.createCollection([docs.get('history')]).toJSON();
          return assert.deepEqual(actual, expected);
        });
      });
      describe('findAll', function(describe, it) {
        it('findAll', function() {
          var actual, expected;
          actual = queryEngine.createCollection(docs.models).findAll({
            tags: {
              $has: 'jquery'
            }
          }, {
            position: -1
          });
          expected = queryEngine.createCollection([docs.get('history'), docs.get('jquery')]);
          return assert.deepEqual(actual.toJSON(), expected.toJSON());
        });
        return it('findAll-paging', function() {
          var actual, expected;
          actual = queryEngine.createCollection(docs.models).findAll({
            tags: {
              $has: 'jquery'
            }
          }, {
            position: -1
          }, {
            limit: 1
          });
          expected = queryEngine.createCollection([docs.get('history')]);
          return assert.deepEqual(actual.toJSON(), expected.toJSON());
        });
      });
      describe('findAllLive', function(describe, it) {
        it('findAllLive', function() {
          var actual, expected, parent;
          actual = (parent = queryEngine.createCollection()).findAllLive({
            tags: {
              $has: 'jquery'
            }
          }, {
            position: -1
          });
          parent.add(docs.models);
          expected = queryEngine.createCollection([docs.get('history'), docs.get('jquery')]);
          return assert.deepEqual(actual.toJSON(), expected.toJSON());
        });
        return it('findAllLive-paging', function() {
          var actual, expected, parent;
          actual = (parent = queryEngine.createCollection()).findAllLive({
            tags: {
              $has: 'jquery'
            }
          }, {
            position: -1
          }, {
            limit: 1
          });
          parent.add(docs.models);
          expected = queryEngine.createCollection([docs.get('history')]);
          return assert.deepEqual(actual.toJSON(), expected.toJSON());
        });
      });
      return describe('comparator', function(describe, it) {
        it('live-onadd', function() {
          var actual, expected;
          actual = queryEngine.createLiveCollection().setComparator({
            position: -1
          }).add(docs.models);
          expected = queryEngine.createCollection([docs.get('history'), docs.get('jquery'), docs.get('index')]);
          return assert.deepEqual(actual.toJSON(), expected.toJSON());
        });
        return it('live-onchange', function() {
          var actual, expected;
          actual = queryEngine.createLiveCollection().setComparator({
            position: -1
          }).add(docs.models);
          actual.at(0).set({
            'position': 0
          });
          expected = queryEngine.createCollection([docs.get('jquery'), docs.get('index'), docs.get('history')]);
          return assert.deepEqual(actual.toJSON(), expected.toJSON());
        });
      });
    });
  };

  describe('sort', function(describe, it) {
    var collectionName, docs, _results;
    _results = [];
    for (collectionName in store) {
      if (!__hasProp.call(store, collectionName)) continue;
      docs = store[collectionName];
      _results.push(generateTestSuite(describe, it, collectionName, docs));
    }
    return _results;
  });

  null;

}).call(this);
