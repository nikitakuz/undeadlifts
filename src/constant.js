(function() {
  var constant = angular.module('undeadlifts.constant', []);

  var FBURL = 'https://undeadlifts.firebaseio.com';
  var FBREF = new Firebase(FBURL);

  constant.constant('FBURL', FBURL);
  constant.constant('FBREF', FBREF);
})();