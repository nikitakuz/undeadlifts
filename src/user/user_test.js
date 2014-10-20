describe('undeadlifts.user', function() {
  beforeEach(module('undeadlifts.user'));

  describe('if there is no user', function() {
    it('user.index state should transition to login state.', inject(function($rootScope, $state) {
        $state.go('user.index');
        $rootScope.$digest();
        expect($state.current.name).toEqual('login');
      }
    ));
  });

  describe('if there is a user', function() {
    it('user.index state should load', inject(function($rootScope, $state, firebase) {
      firebase.authWithPassword({foo: 'bar'}, function() {});
      $state.go('user.index');
      $rootScope.$digest();
      expect($state.current.name).toEqual('user.index');
    }));
  })
});