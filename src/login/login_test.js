describe('undeadlifts.login', function() {
  beforeEach(module('undeadlifts'));

  describe('if there is no user', function() {
    it('login state should load.', inject(function($rootScope, $state) {
        $state.go('login');
        $rootScope.$digest();
        expect($state.current.name).toEqual('login');
      }
    ));
  });

  describe('if there is a user', function() {
    it('login state should transition to user.index state', inject(function($rootScope, $state, firebase) {
        firebase.authWithPassword({foo: 'bar'}, function() {});
        $state.go('login');
        $rootScope.$digest();
        expect($state.current.name).toEqual('user.index');
      }
    ));
  });
});