(function() {
  var Benchmark, collection, i, models, queryEngine, suite, _i;

  queryEngine = this.queryEngine || require(__dirname + '/../lib/query-engine');

  Benchmark = require('benchmark');

  console.log('Benchmarking...');

  suite = new Benchmark.Suite();

  models = [];

  for (i = _i = 0; _i <= 1000; i = ++_i) {
    models.push({
      name: "Name " + i,
      description: Math.random(),
      second: !!(i % 2),
      third: !!(i % 3)
    });
  }

  collection = new queryEngine.QueryCollection(models);

  suite.add('$or', function() {
    return collection.findAll({
      $or: [
        {
          second: true
        }, {
          third: true
        }
      ]
    });
  });

  suite.add('$and', function() {
    return collection.findAll({
      second: true,
      third: true
    });
  });

  suite.add('$and - one', function() {
    return collection.findOne({
      second: true,
      third: true
    });
  });

  suite.on('cycle', function(event) {
    return console.log(String(event.target));
  }).on('complete', function() {
    return console.log('Fastest is ' + this.filter('fastest').pluck('name'));
  });

  suite.run();

}).call(this);
