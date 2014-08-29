cleanlifts.service('util',
  [
    function() {
      return {
        arrayFilledWithValues: function(length, value) {
          var a = Array.apply(null, Array(parseInt(length)));
          return a.map(function() { return value; });
        }
      };
    }
  ]
);