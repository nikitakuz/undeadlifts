describe('undeadlifts.login', function() {
  beforeEach(module('undeadlifts'));

  describe('if there is a user', function() {
    it('login state should transition to user.index state', inject(function($rootScope, $state, firebase) {
        var loggedIn = false;
        runs(function() {
          var credentials = {email: 'test@test.com', password: 'test'};
          firebase.authWithPassword(credentials, function(error, user) {
            if (error) {
              console.log('Failed to authenticate.');
            } else if (user) {
              loggedIn = true;
            }
          })
        });
        waitsFor(function() {
          return loggedIn;
        }, 1000);
        runs(function() {
          $state.go('login');
          $rootScope.$digest();
          expect($state.current.name).toEqual('user.index');
        });
      }
    ));
  });
});