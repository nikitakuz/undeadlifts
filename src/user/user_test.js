describe('Logged out user redirect', function() {
  beforeEach(module('undeadlifts'));

  it('if there is no user, user.index state should transition to login state', inject(function ($rootScope, $state, firebase) {
      $state.go('user.index');
      $rootScope.$digest();
      expect($state.current.name).toEqual('login');
    }
  ));
});