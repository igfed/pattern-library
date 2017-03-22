"use strict";
(function() {
	var temp = angular.module('templates', []);
	var app = angular.module('quizApp', ['ngRoute', 'ui.router', 'ngAnimate', 'quiz', 'quiz-data', 'quiz-tips', 'quiz-directives', 'templates']);
	app.config(function($stateProvider, $urlRouterProvider, $locationProvider) {
		// For any unmatched url, redirect to /state1
		$urlRouterProvider.otherwise("/");
		// Now set up the states
		$stateProvider
			.state('quiz', {
<<<<<<< HEAD
				templateUrl: "/content/dam/investorsgroup/app/quiz/quiz.html",
=======
				templateUrl: "../templates/quiz.html",
>>>>>>> develop
				controller: 'QuizController',
				resolve: {
					myData: ["$rootScope", function($rootScope){
						return $rootScope.lang = $rootScope.lang;						
					}]
				}
			})
			.state('report', {
<<<<<<< HEAD
				templateUrl: 'report.html',
=======
				templateUrl: '../templates/report.html',
>>>>>>> develop
				controller: 'TipController',
				resolve: {
					myData: ["$rootScope", function($rootScope){
						return $rootScope.lang = $rootScope.lang;						
					}]
				}
			})
			.state('start', {
				url: "/",
<<<<<<< HEAD
				templateUrl: '/content/dam/investorsgroup/app/quiz/start.html',
=======
				templateUrl: '../templates/start.html',
>>>>>>> develop
				controller: 'QuizController',
				resolve: {
					myData: ["$rootScope", function($rootScope){
						return $rootScope.lang = $rootScope.lang;						
					}]
				}
			})
	});
})();
(function(){
    var app = angular.module('quiz-data', []);
    app.factory('dataService',['$http','$rootScope', function ($http,$rootScope) {
        return {
            data: function(callback){
                //Make our $http request and assign response to service
                console.log('getting data from', '../data/QuizData-'+$rootScope.lang+'.json');
                $http.get('../data/QuizData-'+$rootScope.lang+'.json').success(callback);
            },
            getQuizLogic: function(callback){
            	$http.get('../data/QuizLogic.json').success(callback);
            }
        };
    }]);
})();
(function(){
  var app = angular.module('quiz-directives', []);

  app.directive("navigation", function() {
    return {
      restrict: 'E',
<<<<<<< HEAD
      templateUrl: "nav.html"
=======
      templateUrl: "../templates/nav.html"
>>>>>>> develop
    };
  });
  
  app.directive("quizProgress", function() {
    return {
      restrict: 'E',
<<<<<<< HEAD
      templateUrl: "quiz-progress.html"
=======
      templateUrl: "../templates/quiz-progress.html"
>>>>>>> develop
    };
  });

  app.directive("quizQuestion", function() {
    return {
      restrict: 'E',
<<<<<<< HEAD
      templateUrl: "quiz-question.html"
=======
      templateUrl: "../templates/quiz-question.html"
>>>>>>> develop
    };
  });

  app.directive("quizAnswers", function() {
    return {
      restrict: 'E',
<<<<<<< HEAD
      templateUrl: "quiz-answers.html"
=======
      templateUrl: "../templates/quiz-answers.html"
>>>>>>> develop
    };
  });

  app.directive("quizReport", function() {
    return {
      restrict: 'E',
<<<<<<< HEAD
      templateUrl: "quiz-report.html"
=======
      templateUrl: "../templates/quiz-report.html"
>>>>>>> develop
    };
  });

})();

(function(){
    var app = angular.module('quiz', []);
    app.controller('QuizController', function($scope, $rootScope, $state, $location, dataService, $routeParams, $timeout, $templateCache){
		$scope.clearCache = function() { 
			$templateCache.removeAll();
		};
		
		// Animate 
		$scope.enterAnimation = true;
		$scope.leaveAnimation = false;

		$scope.disableInputs = false;

		// setup rootScope store for the answers to the questions
		$rootScope.user = $rootScope.user || 
		{
			persona: null,
			answers: [],
			tips: {}
		};

		dataService.data(function(dataService){
			$scope.copy = dataService.copy.start;
			// console.log('got questions...');
			$scope.questions = dataService.questions;
			// console.log('Questions', $scope.questions); 
				
			$scope.currentPage = 0;
			$scope.pageSize = 1;
			
			$scope.numberOfPages=function(){
				return Math.ceil($scope.questions.length/$scope.pageSize);                
			}
		});
	
		$scope.selectAnswer = function(choice){
			console.log('Choice', choice);
			
			if (typeof choice !== 'undefined'){
				var question = choice.q;
				var answer = choice.a;

				$rootScope.user.answers[question] = answer;
				console.log($rootScope.user.answers);
			}


			$scope.selected = '0';
			$scope.disabled = '0';

			$scope.select= function(index) {
				$scope.selected = index; 
			};
			$scope.disable= function(index) {
				$scope.disabled = index; 
			};

			$scope.select(answer);
			// $scope.disable(answer);

			// iPad hover fix
			var isTouch =  !!("ontouchstart" in window) || window.navigator.msMaxTouchPoints > 0;
			if( isTouch ){
				// $scope.isTouch = true;
			}
			$scope.hover = false;

			// Animate
			$scope.enterAnimation = false;
			$scope.leaveAnimation = true;

			$scope.disableInputs = true;

			if ($scope.currentPage < $scope.questions.length-1){

				var clickTimeout;
				clickTimeout = $timeout(function() {
					
					$scope.selected = 'disabled';
					$scope.currentPage = $scope.currentPage+1;
					$scope.disableInputs = false;

					// Animate
					$scope.enterAnimation = true;
					$scope.leaveAnimation = false;

				}, 550); // delay 
				
			}else{
				
				var gotoReportTimeout;
				gotoReportTimeout = $timeout(function() {

					$state.go('report');

					// Animate
					$scope.enterAnimation = true;
					$scope.leaveAnimation = false;

				}, 500); // delay
			}
		};

	});

	//startFrom filter
	app.filter('startFrom', function() {
			return function(input, start) {
				if (!input || !input.length) { return; }
				start = +start; //parse to int
				return input.slice(start);
			}
	});
	
})();
// (function(){
//     var app = angular.module("templates").run([$templateCache,
//         function($templateCache) {
//             $templateCache.put("./templates/nav.html",
//             // template1.html content (escaped)
//             );
//             $templateCache.put("./templates/foot.html",
//             // template2.html content (escaped)
//             );
//             // etc.
//         }
//     ]);
// })();
(function(){
    var app = angular.module('quiz-tips', []);
	app.controller('TipController', function($scope, $rootScope, dataService, $routeParams, $templateCache){
		$scope.clearCache = function() { 
			$templateCache.removeAll();
		};
		
		var tips, logic;
		console.log('Language is: ', $scope.lang);
		$rootScope.user = $rootScope.user || 
		{
			persona: null,
			answers: [5,1,3,2,0],
			tips: []
		};

		$scope.user = $rootScope.user;
		console.log('user is', $scope.user);

		dataService.data(function(dataService){
			$scope.copy = dataService.copy.report;
			tips = dataService.tips;

			console.log('>>>got tips!', tips);
			getQuizLogic();
		});

		function getQuizLogic(){
			dataService.getQuizLogic(function gotQuizLogic(data){
				logic = data;
				
				computePersona();
			});

		}

		function computePersona(){
			if (typeof $rootScope.user === "undefined"){
				console.error("the user is not defined");
				return;
			}

			// add up the scores for each persona, figure out persona
			addUpUserScore();

			// do tiebreaking functions
			// add tips to user object based on persona
			// backtrack through answers to modify tips in selected categories 
		}

		function addUpUserScore(){

			// var testData = [
			// 	[5, 5, 5, 5, 5],
			// 	[5, 5, 5, 5, 5],
			// 	[5, 5, 5, 5, 4],
			// 	[5, 0, 1, 2, 5],
			// 	[4, 0, 1, 2, 5],
			// ]

			console.log($rootScope.user);
			console.log(logic);
			var userAnswers = $rootScope.user.answers;

			var scoring = [];
			var scoringLog = [];
			console.log('====scoring====');
			for (var i = 0; i < userAnswers.length; i++){

				var question = i;

				var answer = userAnswers[i];

				// use the logic table to look up the points for each user object
				var userAnswer = logic.questions[question].answers[answer];
				//userAnswer.val = testData[i]; // JUST FOR TESTING...REMOVE
				var userAnswerPersonaScore = userAnswer.val; // the scores as array e.g. [0,1,10,3, 0]
				console.log('+', userAnswerPersonaScore);
				//console.log('+',userAnswerPersonaScore, 'from q:', question, ', a:', answer);
				// add the scores for this question to the user's score table
				for (var k = 0; k < userAnswerPersonaScore.length; k++){
					scoring[k] = (scoring[k] || 0) + userAnswerPersonaScore[k];

					if (!scoringLog[k])
						scoringLog[k] = [];

					// the switch for k with i is subtle here...but it ensures the scores of each persona belong only to that array (scored as columns instead of as rows)
					scoringLog[k][i] = userAnswerPersonaScore[k];
				}
				
			}

			console.log('=', scoring);

			// determine top score
			var topScore = _.max(scoring);

			// determine which personas have this score
			var personasWithTopScore = [];

			var topScoringLog = [];

			_.each(scoring, function(value, index){
				if (value == topScore){
					personasWithTopScore.push(index);
					topScoringLog.push(scoringLog[index]);
				}
			});
			//console.log('score log', scoringLog);

			var chosenPersona = 5; // variable to store the final persona


			// we are in a tiebreaking situation here as we have multiple personas with this score
			if (personasWithTopScore.length > 1){

				//console.log('looks like we need a tiebreaker!');
				chosenPersona = doTieBreaking(personasWithTopScore, topScoringLog);

			}else {

				chosenPersona = personasWithTopScore[0];
			}

			//console.log('persona with top score has been determined', chosenPersona);


			if (chosenPersona == null){
				// return default tips
				$scope.tips = tips[5]; // the '6th' persona is the default one
			}else{
				// return tips based on the winning persona
				console.log('the tips', tips);
				$scope.tips = tips[chosenPersona]; 
			}

			// uncomment the one you want to test
			// $scope.tips = tips[0]; // angela 
			// $scope.tips = tips[1]; // rami
			// $scope.tips = tips[2]; // howard 
			// $scope.tips = tips[3]; // doug
			// $scope.tips = tips[4]; // marie 
			// $scope.tips = tips[5]; // default

			console.log('persona name:', $scope.tips.persona);
			console.log('persona tips:', $scope.tips.tips);

			for (var i = 0; i < $scope.tips.tips.length; i++){
				var thisTip = $scope.tips.tips[i];
				var dashedName = thisTip.src.toLowerCase().replace(" ", "-").trim();

				thisTip.imageURL = '../images/icons/'+dashedName+'.png';
			}

		}

		// assumes scores don't exceed 10
		function doTieBreaking(personaLookupTable, personaScores){
			var lookupTable = angular.copy(personaLookupTable);
			// the personaList is basically a list of indexes that relate to the personas outlined by investors group
			
			// personaScores is a 2D array

			// step 1: find max element of all these tables
			var maxElement = 0;

			for (var i = 0; i < personaScores.length; i++){
				var thisPersonaScore = personaScores[i]; // still dealing with an array here
				var thisMax = _.max(thisPersonaScore);
				maxElement = thisMax > maxElement? thisMax: maxElement; // set the new score if its greater than our max element
			}
			
			// step 2: using this max element...iterate towards 0...at each point checking which elements have the greatest number of this iteration
			// if more than 2 have it...we continue
			 
			var personaTieBreakerArray; // (deep copy?) the array to be used to break ties .. it will hold the running contenders for the tiebreak			
			var personaContenders = angular.copy(personaScores);

			var winningPersona = null;

			for (var i = maxElement; i > 0; i--){
				//console.log('iterating..', i);
				// tiebreaking logic g
				
				// count the largest number of i we have in these arrays. 
				var largestCountOfThisElement = 0;

				for (var k = 0; k < personaContenders.length; k++){
					var thisPersonaScore = personaContenders[k];
					var numberOfThisElementInPersona = countInArray(thisPersonaScore, i);
					largestCountOfThisElement = numberOfThisElementInPersona > largestCountOfThisElement? numberOfThisElementInPersona: largestCountOfThisElement;
				}
				if (largestCountOfThisElement == 0)	continue; // the element wasn't found....let's try again
				
				// loop again through the arrays...creating a new array that has the surviving pair
				for (var k = 0; k < personaContenders.length; k++){

					var thisPersonaScore = personaContenders[k];
					var numberOfThisElementInPersona = countInArray(thisPersonaScore, i);

					// if this isn't a score with the highest number then it obviously is no longer a contender for the tiebreak
					if (numberOfThisElementInPersona !== largestCountOfThisElement){
						// splice out the score and the lookupTable index
						personaContenders.splice(k, 1); 
						lookupTable.splice(k, 1);
					}
				}

				// if the surviving array has a length of 1 exit the loop and the tie is broken!

				if (personaContenders.length == 1){
					winningPersona = lookupTable[0];
					break;
				}
			}

			return winningPersona;
		}

		function countInArray(array, element){
			return _.filter(array, function(num) {return num == element}).length
		}

		$scope.inTips = function(tipToCheck){
			if (typeof $scope.tips === 'undefined')
				return;

			var tips = $scope.tips.tips;
			return _.filter(tips, function(tip) {return tip.type == tipToCheck}).length > 0;

		};

		$scope.getTipImage = function(tip){

			if (typeof tip == 'undefined')
				return;

			var dashedName = tip.toLowerCase().replace(" ", "-");
			console.log('>>>',dashedName);

			return '../images/icons/'+dashedName+'.png';
		}
		/**
		 * Takes a string like INV1-3 and breaks it up into [INV1, INV2, INV3]
		 * @param  {[type]} listString [description]
		 * @return {[type]}            [description]
		 */
		function shorthandListExpand(listString){

			// check for - character
			var dashIndex = listString.indexOf('-');
			
			if (dashIndex == -1){
				return [listString];
			}

			// walk through the string until we get an ~isNaN
			var leftIndexStart = 0;
			for (var i = 0; i < listString.length; i++){
				var thisChar = listString.charAt(i);
				if (!isNaN(thisChar)){
					leftIndexStart = i;
					break;
				}
			}

			// get the start index INV_1_-3
			var leftIndex = parseInt(listString.substring(leftIndexStart, dashIndex));
			var rightIndex = parseInt(listString.substring(dashIndex +1, listString.length));

			console.log(leftIndex, rightIndex)
		}
	});

})();