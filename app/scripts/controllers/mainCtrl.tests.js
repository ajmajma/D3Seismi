describe('Unit: MainCtrl', function() {
  // Load the module with MainCtrl
  beforeEach(module('dataRobot'));

  var ctrl, scope;
  // inject the $controller and $rootScope services
  // in the beforeEach block
  beforeEach(inject(function($controller, $rootScope) {
    // Create a new scope that's a child of the $rootScope
    scope = $rootScope.$new();
    // Create the controller
    ctrl = $controller('MainCtrl', {
      $scope: scope
    });

  }));

  it('expect emptyMessage to be empty at first', 
    function() {
      expect(scope.emptyMessage).toEqual("");
  });

  


})