cleanlifts.service('util',
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