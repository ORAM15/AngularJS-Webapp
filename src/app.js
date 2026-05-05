/**
 * app.js
 * Main module configuration for AngularJS
 */
var app = angular.module("authApp", ["ngRoute"]);

// 1. ROUTING CONFIGURATION
app.config(function($routeProvider) {
  $routeProvider
    .when("/login", {
      templateUrl: "src/views/login.html",
      controller: "LoginController"
    })
    .when("/dashboard", {
      templateUrl: "src/views/dashboard.html",
      controller: "DashboardController",
      resolve: {
        // Protected Route Logic: Check if authenticated before entering dashboard
        check: function($location, AuthService) {
          if (!AuthService.isAuthenticated()) {
            $location.path("/login");
          }
        }
      }
    })
    .otherwise({
      redirectTo: "/login"
    });
});

// 2. HTTP INTERCEPTOR
// This attaches the JWT token to every outgoing request to /api
app.factory("AuthInterceptor", function($window, $q) {
  return {
    request: function(config) {
      config.headers = config.headers || {};
      var token = $window.localStorage.getItem("token");
      
      // If the request is for our API, add the token
      if (config.url.indexOf("/api") !== -1 && token) {
        config.headers.Authorization = "Bearer " + token;
      }
      return config;
    },
    responseError: function(rejection) {
      // If the server returns 401 Unauthorized, it means the token is invalid or expired
      if (rejection.status === 401) {
        console.log("Authentication failed or session expired.");
      }
      return $q.reject(rejection);
    }
  };
});

// Register the interceptor
app.config(function($httpProvider) {
  $httpProvider.interceptors.push("AuthInterceptor");
});

console.log("AngularJS App Initialized");
