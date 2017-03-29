var todo = angular.module('todoApp',[]);

todo.filter('checkedItems',function() {
	return function(items, showComplete) {
		var resultArr = [];
		angular.forEach(items, function(item) {
			if ( item.done == false || showComplete == true ) {
				resultArr.push(item);
			}
		});
		return resultArr;
	}
})
todo.constant('dataUrl','http://localhost:5500/todo/')
todo.controller('todoCtrl', function($scope, $http, dataUrl) {
	$scope.todo = {
		user:'Adam'
	};

	$scope.incompleteCount = function() {
		var count = 0;
		angular.forEach($scope.todo.items, function(item) {
			if ( item.done == false ) { count++ }
		});
		return count;
	}

	$scope.warningLabel = function() {
		return $scope.incompleteCount() < 3 ? 'label-success' : 'label-warning';
	}

	$scope.addNewItem = function(actionText) {
		if ( actionText ) {
			// $scope.todo.items.push({action:actionText, done:false});
			$http.post(dataUrl, {
				action:actionText, done:false
			})
			.then(function onSuccess(response) {
				$scope.todo.items.push(response.data);
				$scope.actionText = '';
			},function onSuccess(err) {
				console.log(err.statusText);
			});
		} else {
			alert('할일 제목을 적어 주세요');
		}
	}

	$scope.changeCompleted = function(todo){
		$http.post(dataUrl + todo.id, {
			done:todo.done
		})
		.then(function onSuccess(response) {
		},function onSuccess(err) {
			console.log(err.statusText);
		});
	}

	$scope.deleteCompleted = function(todo) {
		$http.delete(dataUrl + todo.id)
		.then(function onSuccess(response) {
			var count;
			angular.forEach($scope.todo.items, function(item,i) {
				if ( item.id == todo.id ) { count = i }
			});
			$scope.todo.items.splice(count,1);
		},function onSuccess(err) {
			console.log(err.statusText);
		});
		event.preventDefault();
	}

	$http.get(dataUrl)
	.then(function onSuccess(response) {
		$scope.todo.items = response.data;
	},function onSuccess(err) {
		console.log(err.statusText);
	});
});