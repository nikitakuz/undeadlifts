(function() {
  var util = angular.module('undeadlifts.util', []);

  util.service('util',
    [
      function() {
        return {
          arrayFilledWithValues: function(length, value) {
            var a = Array.apply(null, Array(parseInt(length)));
            return a.map(function() { return value; });
          },
          parseYyyyMmDd: function(yyyyMmDd) {
            var yyyy = yyyyMmDd.substr(0, 4);
            var mm = yyyyMmDd.substr(4, 2);
            var dd = yyyyMmDd.substr(6, 2);
            return new Date(yyyy, mm - 1, dd);
          }
        };
      }
    ]
  );

  util.filter('orderObjectBy', function() {
    return function(items, field, reverse) {
      var filtered = [];
      angular.forEach(items, function(item) {
        filtered.push(item);
      });
      filtered.sort(function (a, b) {
        return (a[field] > b[field] ? 1 : -1);
      });
      if(reverse) filtered.reverse();
      return filtered;
    };
  });
})();
