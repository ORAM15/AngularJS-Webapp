/**
 * LoginController.js
 * Manages the login form submission and error handling
 */
app.controller("LoginController", function($scope, $location, AuthService) {
  $scope.user = {
    username: "",
    password: ""
  };
  $scope.errorMessage = "";

  $scope.submitLogin = function() {
    $scope.errorMessage = "";
    
    AuthService.login($scope.user).then(
      function(response) {
        if (response.data.success) {
          // 1. Save the token
          AuthService.saveToken(response.data.token);
          // 2. Redirect to dashboard
          $location.path("/dashboard");
        }
      },
      function(error) {
        // Handle invalid login (e.g. 401 Unauthorized)
        $scope.errorMessage = error.data.message || "Login failed. Please try again.";
      }
    );
  };
});
