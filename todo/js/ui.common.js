var model = {
	user:'Adam'
}

var todo = angular.module('todoApp',[]);

todo.filter('checkedItems', function() {
	return function(items, showComplete) {
		var resultArr = [];
		angular.forEach(items, function(item) {
			if (item.done == false || showComplete == true) {
				resultArr.push(item);
			}
		})
		return resultArr;
	}
})

todo.controller('todoCtrl', function($scope, $http) {
	$scope.todo = model;

	$scope.incompleteCount = function() {
		var count = 0;
		angular.forEach($scope.todo.items, function(item) {
			if (item.done == false) { count++ }
		})
		return count;
	}

	$scope.warningLabel = function() {
		return $scope.incompleteCount() < 3 ? 'label-success' : 'label-warning';
	}

	$scope.addNewItem = function(actionText) {
		if ( actionText ) {
			// $scope.todo.items.push({action:actionText, done:false})
			
			$http.post('http://10.202.66.33:5500/todo/',{
				action:actionText, done:false
			})
			.then(function onSuccess(response) {
				$scope.todo.items.push(response.data);
			},function onError(err) {
				console.log(err.message);
			})

			$scope.actionText = '';
		} else {
			alert('제목을 입력하세요');
		}
	}

	$scope.changeCompleted = function(todo) {
		$http.post('http://10.202.66.33:5500/todo/'+todo.id,{
			done:todo.done
		})
		.then(function onSuccess(response) {
		},function onError(err) {
			console.log(err.message);
		})
	}

	$scope.deleteCompleted = function(todo) {
		$http.delete('http://10.202.66.33:5500/todo/'+todo.id)
		.then(function onSuccess(response) {
			var count ;
			angular.forEach($scope.todo.items, function(item,i) {
				if (item.id == todo.id) {
					count = i;
				}
			});
			$scope.todo.items.splice(count,1);
		},function onError(err) {
			console.log(err.message);
		})
	}

	$http.get('http://10.202.66.33:5500/todo/')
	.then(function onSuccess(response) {
		$scope.todo.items = response.data;
	},function onError(err) {
		console.log(err.message);
	})
})