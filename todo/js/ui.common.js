var model = {
	user:'Adam'
	/* items:[
		{action:'Buy Flowers',done:false},
		{action:'Get Shoes',done:false},
		{action:'Collect Tickets',done:true},
		{action:'Call Joe',done:false}
	] */
};

var todo = angular.module('todoApp', []);

todo.filter("checkedItems", function() {
	return function(items, showComplete) {
		var resultArr = [];
		angular.forEach(items, function(item) {
			if ( item.done == false || showComplete == true )  {
				resultArr.push(item);
			}
		});
		return resultArr;
	}
});

todo.controller('todoCtrl',function($scope, $http, $location) {
	$scope.todo = {
		user:model.user
	}

	$scope.incompleteCount = function() {
		var count = 0;
		angular.forEach($scope.todo.items, function(item) {
			if ( !item.done ) { count++ };
		})
		return count;
	}

	$scope.warningLabel = function() {
		return $scope.incompleteCount() < 3 ? 'label-success' : 'label-warning';
	}

	$scope.addNewItem = function(actionText) {
		if ( actionText ) {
			//$scope.todo.items.push({action:actionText,done:false});
			$http.post("http://10.202.66.33:5500/todo/", {
				action: actionText,
				done: false
			})
			.then(function onSuccess(response) {
				// 데이터 추가가 성공한 경우
				$scope.todo.items.push(response.data);
			},function onError(err) {
				// 데이터 추가가 실패한 경우
				return alert(err.message || (err.errors && err.errors.completed) || "an error occurred");
			})
			$scope.actionText = '';
		} else {
			alert('제목을 입력해 주세요');
		}
	}

	$scope.changeCompleted = function(todo) {
		$http.put('http://10.202.66.33:5500/todo/' + todo.id, {
			done: todo.done
		})
		.then(function onSuccess(response) {
			// 업데이트가 성공한 경우
		},function onError(err) {
			// 업데이트가 실패한 경우
			return alert(err.message || (err.errors && err.errors.completed) || "an error occurred");
		});
	};

	$http.get("http://10.202.66.33:5500/todo/")
	.then(function onSuccess(response) {
		// 읽어오기가 성공한 경우
		$scope.todo.items = response.data;
	},function onError(err){
		// 읽어오기가 실패한 경우
		return alert(err.message || (err.errors && err.errors.completed) || "an error occurred");
	});
});