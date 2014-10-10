describe('Logged in user redirect', function() {
  beforeEach(module('undeadlifts'));

  beforeEach(inject(function(firebase) {
    firebase.setAuth({uid: 'foo'});
  }));

  it('if there is a user, login state should transition to user.index state', inject(function($rootScope, $state, firebase) {
      var auth = firebase.getAuth();
      debugger;
      $state.go('user.index');
      $rootScope.$digest();
      expect($state.current.name).toEqual('user.index');
    }
  ));
});