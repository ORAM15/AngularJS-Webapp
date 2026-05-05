/**
 * AuthService.js
 * Handles login, logout, and token management using localStorage
 */
app.service("AuthService", function($http, $window) {
  
  // Login method: Sends credentials to the backend
  this.login = function(credentials) {
    return $http.post("/api/login", credentials);
  };

  // Store token in localStorage
  this.saveToken = function(token) {
    $window.localStorage.setItem("token", token);
  };

  // Remove token and logout
  this.logout = function() {
    $window.localStorage.removeItem("token");
  };

  // Check if user is logged in
  this.isAuthenticated = function() {
    var token = $window.localStorage.getItem("token");
    return token !== null;
  };
});
