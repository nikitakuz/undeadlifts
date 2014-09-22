cleanlifts.config(
  [         '$stateProvider',
    function($stateProvider) {
      $stateProvider.state('user.history',
        {
          abstract: true,
          url: '/history',
          template: '<div ui-view=""></div>',
          controller: 'AbstractHistoryController'
        }
      );
    }
  ]
);
cleanlifts.constant('MONTH_NAMES', {
    1: 'January', 2: 'February', 3: 'March',      4: 'April',    5: 'May',       6: 'June',
    7: 'July',    8: 'August',   9: 'September', 10: 'October', 11: 'November', 12: 'December'
});
cleanlifts.filter('setsCompleted', function() {
  return function(sets) {
    sets = sets.map(function(set) {
      return set.completed || 0;
    });
    var str = sets.join('/').replace(/-1/g, '0');
    if (str === '5/5/5/5/5') {
      return '5x5';
    } else if (str === '8/8/8') {
      return '3X8';
    } else {
      return str;
    }
  };
});
cleanlifts.filter('shortenLiftName', function() {
  return function(name) {
    if (name === 'Overhead Press') {
      return 'OH Press';
    } else if (name === 'Bench Press') {
      return 'Bench';
    } else if (name === 'Barbell Row') {
      return 'Row';
    } else {
      return name;
    }
  };
});
cleanlifts.controller('AbstractHistoryController',
  [         '$scope', 'user',
    function($scope,   user) {
      $scope.history = user.history;

/*
      for (var i = 0; i < history.length; i++) {
        var $id = history[i].$id;
        history[i].date = new Date($id.substr(0, 4), $id.substr(4, 2), $id.substr(6, 2));
      }
*/
    }
  ]
);

