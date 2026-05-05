/**
 * DashboardController.js
 * Fetches secure data from the protected API endpoint
 */
app.controller("DashboardController", function($scope, $http, $location, AuthService) {
  $scope.dashboardData = null;
  $scope.loading = true;

  // Initialize: Fetch data from the protected route
  $scope.init = function() {
    $http.get("http://localhost:3000/api/dashboard").then(
      function(response) {
        $scope.dashboardData = response.data;
        $scope.loading = false;
      },
      function(error) {
        // If error (e.g. invalid token), redirect to login
        console.error("Access denied:", error);
        AuthService.logout();
        $location.path("/login");
      }
    );
  };

  $scope.logout = function() {
    AuthService.logout();
    $location.path("/login");
  };

  $scope.init();
});
