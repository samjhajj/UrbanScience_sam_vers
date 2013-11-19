var format = function (state) {
  var originalOption = state.element;
 
  return "<img style='padding-right: 10px; vertical-align: middle;' src='app/img/" + $(originalOption).data('img') + ".png' />" + state.text;
}

var app = angular.module("app", ["ui.select2"])

app.config(function($routeProvider) {

  $routeProvider.when('/login', {
    templateUrl: 'login.html',
    controller: 'LoginController'
  });

  $routeProvider.when('/home', {
    templateUrl: 'home.html',
    controller: 'HomeController'
  });

  $routeProvider.when('/summary', {
    templateUrl: 'summary.html',
    controller: 'SummaryController'
  });

  $routeProvider.when('/Graph', {
    templateUrl: 'Graph.html',
    controller: 'GraphController'
  });

  $routeProvider.when('/Dealership', {
    templateUrl: 'Dealerships.html',
    controller: 'DealershipController'
  });

  $routeProvider.when('/Dealership/Find', {
    templateUrl: 'FindDealerships.html',
    controller: 'DealershipFindController'
  });

  $routeProvider.when('/DealershipDetails/:dealershipId', {
    templateUrl: 'DealershipDetails.html',
    controller: 'DealershipDetailsController'
  });

  $routeProvider.when('/Recommendation/new/:actionId', {
    templateUrl: 'RecommendationNotes.html',
    controller: 'RecommendationNewController'
  });

  $routeProvider.when('/Recommendation/:recommendationId/Notes', {
    templateUrl: 'RecommendationNotes.html',
    controller: 'RecommendationNotesController'
  });

  $routeProvider.when('/Recommendation/:recommendationId', {
    templateUrl: 'Recommendation.html',
    controller: 'RecommendationController'
  });

  $routeProvider.when('/ActionPlan/new/:dealershipId', {
    templateUrl: 'ActionPlan.html',
    controller: 'ActionPlanNewController'
  });

  $routeProvider.when('/ActionPlan/:actionId/Notes', {
    templateUrl: 'ActionPlanNotes.html',
    controller: 'ActionPlanNotesController'
  });

  $routeProvider.when('/ActionPlan/:actionId', {
    templateUrl: 'ActionPlan.html',
    controller: 'ActionPlanController'
  });

  $routeProvider.when('/Table', {
    templateUrl: 'Table.html',
    controller: 'TableController'
  });

  $routeProvider.otherwise({ redirectTo: '/login' });

});

app.factory("AuthenticationService", function($http, $location) {
  return{
    login: function(credentials) {
      if(credentials.username !== "admin" || credentials.password !== "a"){
        alert("Username or Password is incorrect.");
      }
      else{
        $location.path('/Dealership/Find');
      }
    },
    logout: function() {
      $location.path('/login');
    }
  };
});

app.controller('LoginController', function($scope, AuthenticationService){
  $scope.credentials = { username: "", password: "" };

  $scope.login = function() {
    AuthenticationService.login($scope.credentials);
  };
});

app.controller('HomeController', function($scope, AuthenticationService){
  $scope.title = "Home";
  $scope.message = "Mouse over these images to see our directive at work!";

  $scope.logout = function(){
    AuthenticationService.logout($scope.credentials);
  };
});

app.controller('SummaryController', function($scope, AuthenticationService){
 $scope.logout = function(){
    AuthenticationService.logout($scope.credentials);
  };
});

app.controller('GraphController', function($scope, AuthenticationService){
 $scope.logout = function(){
    AuthenticationService.logout($scope.credentials);
  };
});

// The controller for creating new action plans
app.controller('ActionPlanNewController', function($scope, AuthenticationService, $routeParams, ActionPlanService, $location){
  // Create a new action plan object, with dealership parent
  $scope.action = {DealershipId: $routeParams.dealershipId}
 $scope.logout = function(){
    AuthenticationService.logout($scope.credentials);
  };
  // Save button pressed, let's save the action plan
  $scope.update = function(action) {
    // Use angular.copy otherwise the object will be destroyed after this scope is over
    $scope.action = angular.copy(action);
    // Save the action plan
    ActionPlanService.save(action)
    // Redirect back to the dealership details page
    $location.path("/DealershipDetails/"+action.DealershipId)
  };
  $scope.isNew = function(action) {
    return (!action.id);
  }
});

app.controller('ActionPlanNotesController', function($scope, AuthenticationService, $routeParams, ActionPlanService, $location){
  // Retrieve the action plan requested
  $scope.action = ActionPlanService.getActionPlan($routeParams.actionId)
  // $scope.select2Options = {
  //   minimumResultsForSearch: -1,
  //   formatResult: format,
  //   formatSelection: format,
  //   escapeMarkup: function(m) { return m; }
  // };
 $scope.logout = function(){
    AuthenticationService.logout($scope.credentials);
  };
  // Save button pressed, let's update the action plan
  $scope.update = function(action) {
    // Use angular.copy otherwise the object will be destroyed after this scope is over
    $scope.action = angular.copy(action);
    // Save the action plan
    ActionPlanService.save(action)
    // Redirect back to the dealership details page
    $location.path("/ActionPlan/"+action.id)
  }
});

// Controller for viewing action plans (and modifying)
app.controller('ActionPlanController', function($scope, AuthenticationService, $routeParams, ActionPlanService, $location){
  // Retrieve the action plan requested
  $scope.action = ActionPlanService.getActionPlan($routeParams.actionId)
 $scope.logout = function(){
    AuthenticationService.logout($scope.credentials);
  };
  // Save button pressed, let's update the action plan
  $scope.update = function(action) {
    // Use angular.copy otherwise the object will be destroyed after this scope is over
    $scope.action = angular.copy(action);
    // Save the action plan
    ActionPlanService.save(action)
    // Redirect back to the dealership details page
    $location.path("/DealershipDetails/"+action.DealershipId)
  }
});

// Dealership list page
app.controller('DealershipController', function($scope, AuthenticationService, DealershipService){
  // Retrieve the list of dealerships
  $scope.dealerships = DealershipService.list()
 $scope.logout = function(){
    AuthenticationService.logout($scope.credentials);
  };
});

// Controller for finding dealerships
app.controller('DealershipFindController', function($scope, AuthenticationService, DealershipService) {
  // Retrieve the list of dealerships
  $scope.dealerships = DealershipService.list()
  $scope.logout = function(){
    AuthenticationService.logout($scope.credentials);
  };
})

// Dealership details page
app.controller('DealershipDetailsController', function($scope, AuthenticationService, DealershipService, $routeParams){
  // Retrieve the dealership requested
  $scope.dealership = DealershipService.getDealership($routeParams.dealershipId)
 $scope.logout = function(){
    AuthenticationService.logout($scope.credentials);
  };
});

// Controller for creating new recommendation
app.controller('RecommendationNewController', function($scope, AuthenticationService, RecommendationService, $routeParams, ActionPlanService,$location){
  // Create the new recommendation object
  $scope.recommendation = {ActionId: $routeParams.actionId}
  // Retrieve the action this recommendation belongs to
  $scope.action = ActionPlanService.getActionPlan($scope.recommendation.ActionId)
 $scope.logout = function(){
    AuthenticationService.logout($scope.credentials);
  };
  // Save button pressed, let's save the recommendation
  $scope.update = function(recommendation) {
    // Use angular.copy otherwise the object will be destroyed after this scope is over
    $scope.recommendation = angular.copy(recommendation);
    // Save the recommendation
    RecommendationService.save(recommendation)
    // Redirect to the action plan page
    $location.path("/ActionPlan/"+recommendation.ActionId)
  }
});

app.controller('RecommendationNotesController', function($scope, AuthenticationService, RecommendationService, $routeParams, ActionPlanService,$location){
  // Retrieve the recommendation requested
  $scope.recommendation = RecommendationService.getRecommendation($routeParams.recommendationId)
  // Also retrieve the action this recommendation belongs to
  $scope.action = ActionPlanService.getActionPlan($scope.recommendation.ActionId)
 $scope.logout = function(){
    AuthenticationService.logout($scope.credentials);
  };
  // Save button pressed, let's update the recommendation
  $scope.update = function(recommendation) {
    // Use angular.copy otherwise the object will be destroyed after this scope is over
    $scope.recommendation = angular.copy(recommendation);
    // Save the recommendation
    RecommendationService.save(recommendation)
    // Redirect to the action plan page
    $location.path("/ActionPlan/"+recommendation.ActionId)
  }
});

// Recommendation page
app.controller('RecommendationController', function($scope, AuthenticationService, RecommendationService, $routeParams, ActionPlanService,$location){
  // Retrieve the recommendation requested
  $scope.recommendation = RecommendationService.getRecommendation($routeParams.recommendationId)
  // Also retrieve the action this recommendation belongs to
  $scope.action = ActionPlanService.getActionPlan($scope.recommendation.ActionId)
 $scope.logout = function(){
    AuthenticationService.logout($scope.credentials);
  };
  // Save button pressed, let's update the recommendation
  $scope.update = function(recommendation) {
    // Use angular.copy otherwise the object will be destroyed after this scope is over
    $scope.recommendation = angular.copy(recommendation);
    // Save the recommendation
    RecommendationService.save(recommendation)
    // Redirect to the action plan page
    $location.path("/ActionPlan/"+recommendation.ActionId)
  }
});

app.controller('TableController', function($scope, AuthenticationService){
 $scope.logout = function(){
    AuthenticationService.logout($scope.credentials);
  };
});

app.directive('showsMessageWhenHovered', function(){
  return{
    restrict: "A", //A = Attribute, C = Class Name, E = Element, M = HTML Comment
    link: function(scope, element, attributes){
      var originalMessage = scope.message;
      element.bind("mouseover", function() {
        scope.message = attributes.message;
        scope.$apply();
      });
      element.bind("mouseout", function(){
        scope.message = originalMessage;
        scope.$apply();
      });
    }
  };
});

// Dealership model, contains functions and data for interacting with dealership
app.factory('DealershipService', function(ActionPlanService) {
  var DealershipService = {};
  // Data for the dealerhip list
  var dealerships = [
  {
    id: 1,
    Name: 'Dealership 1',
    Contact: 'John Doe',
    Address: '5555 Fake Address',
    PhoneNum: '867-5309',
    ActionPlans: {Completed: [], Active: [], Upcoming: []}
  },
  {
    id: 2,
    Name: 'Dealership 2',
    Contact: 'John Doe',
    Address: '5555 Fake Address',
    PhoneNum: '867-5309',
    ActionPlans: {Completed: [], Active: [], Upcoming: []}
  },
  {
    id: 3,
    Name: 'Dealership 3',
    Contact: 'John Doe',
    Address: '5555 Fake Address',
    PhoneNum: '867-5309',
    ActionPlans: {Completed: [], Active: [], Upcoming: []}
  },
  {
    id: 4,
    Name: 'Dealership 4',
    Contact: 'John Doe',
    Address: '5555 Fake Address',
    PhoneNum: '867-5309',
    ActionPlans: {Completed: [], Active: [], Upcoming: []}
  },
  {
    id: 5,
    Name: 'Dealership 5',
    Contact: 'John Doe',
    Address: '5555 Fake Address',
    PhoneNum: '867-5309',
    ActionPlans: {Completed: [], Active: [], Upcoming: []}
  }
  ];
  // Retrieve dealership by index
  DealershipService.getDealership = function(index) {
    // Find the dealership
    for (var i in dealerships) {
      if (dealerships[i].id == index) {
        // Also retrieve the action plans that belongs to this dealership
        dealerships[i].ActionPlans.Completed = ActionPlanService.getByDealer(index, 'Completed');
        dealerships[i].ActionPlans.Active = ActionPlanService.getByDealer(index, 'Active');
        dealerships[i].ActionPlans.Upcoming = ActionPlanService.getByDealer(index, 'Upcoming');
        return dealerships[i];
      }
    }
  }
  // List all dealerships
  DealershipService.list = function() {
    return dealerships;
  }
  return DealershipService;
});

// Action plan model, contains functions and data for interacting with action plans
app.factory('ActionPlanService', function(RecommendationService) {
  var ActionPlanService = {};
  // Data for action plans
  var actionPlans = [
  {
    id: 1,
    DealershipId: 1,
    Name: "Action Plan 1",
    Atmosphere: "Positive",
    Duration: "30",
    OnTime: "Yes",
    Notes: "",
    Recommendations: [],
    Date: "04/15/2013",
    Status: "Completed"
  },
  {
    id: 2,
    DealershipId: 1,
    Name: "Action Plan 2",
    Atmosphere: "Positive",
    Duration: "30",
    OnTime: "Yes",
    Notes: "",
    Recommendations: [],
    Date: "11/15/2013",
    Status: "Upcoming"
  },
  {
    id: 2,
    DealershipId: 1,
    Name: "Action Plan 3",
    Atmosphere: "Negative",
    Duration: "15",
    OnTime: "Yes",
    Notes: "",
    Recommendations: [],
    Date: "10/15/2013",
    Status: "Active"
  }
  ];
  // Retrieve action plans that belongs to a specific dealership
  ActionPlanService.getByDealer = function (dealershipId, status) {
    // Prepare the variable to hold action plans that are requested
    result = [];
    for (var i in actionPlans) {
      if (actionPlans[i].DealershipId == dealershipId && actionPlans[i].Status == status) {
        // This is the action plan that belongs to the dealership, let's add it to result
        result.push(actionPlans[i]);
      }
    }
    // Return the result
    return result;
  }
  // Retrieve the action plan by index
  ActionPlanService.getActionPlan = function (index) {
    // Search for the action plan
    for (var i in actionPlans) {
      if (actionPlans[i].id == index) {
        // Also retrieve recommendations that belongs to this action plan
        actionPlans[i].Recommendations = RecommendationService.getByAction(actionPlans[i].id);
        return actionPlans[i];
      }
    }
  }
  // Save/Update the action plan
  ActionPlanService.save = function(action) {
    if (action.id) {
      // If the id is set, it means that the action plan already exists,
      // thus we should update it instead
      for (var i in actionPlans) {
        // Search for the action plan in the data
        if (actionPlans[i].id == action.id) {
          // Update it with the new action plan
          actionPlans[i] = action
          return;
        }
      }
    } else {
      // Id is not set, this means that this is a new action plan
      maxId = 0
      for (var i in actionPlans) {
        // Determine the id of the new action plan by looking for the largest id currently in the data
        maxId = Math.max(actionPlans[i].id, maxId)
      }
      // Increment the current largest id by 1
      action.id = maxId+1
      // Add it to the data
      actionPlans.push(action);
    }
  }

  return ActionPlanService;
});

// Recommendation model, contains functions and data for interacting with recommendations
app.factory('RecommendationService', function() {
  var RecommendationService = {};
  // Data for recommendaitons
  var recommendations = [
  {
    id: 1,
    ActionId: 1,
    Name: "Recommendation 1",
    Reception: "Positive",
    Notes: ""
  },
  {
    id: 2,
    ActionId: 1,
    Name: "Recommendation 2",
    Reception: "Positive",
    Notes: ""
  },
  {
    id: 3,
    ActionId: 1,
    Name: "Recommendation 3",
    Reception: "Positive",
    Notes: ""
  }
  ];
  // Retrieve recommendations that belong to a specific action plan
  RecommendationService.getByAction = function(actionId) {
    // Prepare the variable to hold recommendations that are requested
    result = [];
    for (var i in recommendations) {
      if (recommendations[i].ActionId == actionId) {
        // This is the recommendation that belongs to the action plan, let's add it to result
        result.push(recommendations[i]);
      }
    }
    // Return the result
    return result;
  }
  // Retrieve the recommendation by index
  RecommendationService.getRecommendation = function(index) {
    // Search for the recommendation
    for (var i in recommendations) {
      if (recommendations[i].id == index) {
        // Found
        return recommendations[i];
      }
    }
  }
  // Save/Update the recommendation
  RecommendationService.save = function(recommendation) {
    if (recommendation.id) {
      // If the id is set, it means that the recommendation already exists,
      // thus we should update it instead
      for (var i in recommendations) {
        // Search for the recommendation in the data
        if (recommendations[i].id == recommendation.id) {
          // Update it with the new recommendation
          recommendations[i] = recommendation
          return;
        }
      }
    } else {
      // Id is not set, this means that this is a new action plan
      maxId = 0
      for (var i in recommendations) {
        // Determine the id of the new action plan by looking for the largest id currently in the data
        maxId = Math.max(recommendations[i].id, maxId)
      }
      // Increment the current largest id by 1
      recommendation.id = maxId+1
      // Add it to the data
      recommendations.push(recommendation);
    }
  }
  return RecommendationService;
})

// This is the function behind the search dealership page
app.filter('searchFor', function() {
  // arr will be the list of dealerships, with searchString being the query
  return function(arr, searchString) {
    if (!searchString) {
      // If query is empty, return the whole list
      return arr;
    }
    // Prepare our results
    var result = [];

    // Let's ignore UPPER CASE and lower case
    searchString = searchString.toLowerCase();
    // Loop through each dealership
    angular.forEach(arr, function(item) {
      // Check if the dealership's name contains a word in the query string
      if (item.Name.toLowerCase().indexOf(searchString) !== -1) {
        // If yes, add it to our result
        result.push(item);
      }
    })
    // Return the result
    return result;
  }
})