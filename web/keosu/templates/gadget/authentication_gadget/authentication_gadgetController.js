app.controller('authentication_gadgetController',function ($scope, $http, usSpinnerService,$location) {

	$http.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded";

	/**************
	 * Routing part
	 **************/
	$scope.routing = function (page) {

		$scope.login = false;
		$scope.register = false;
		$scope.forgotPassword = false;
	
		switch (page) {
			case 'login':
			$scope.login = true;
			break;
		
			case 'register':
			$scope.register = true;
			break;
			
			case 'forgotPassword':
			$scope.forgotPassword = true;
			break;
		}
	}
	
	/**************
	 * Init part
	 **************/
	$scope.init = function(host, param, page, gadget, zone){

		if($scope.param == null)
			$http.get(host+param + 'service/gadget/authentication/' + gadget + '/json/init').success(function(data) {
				$scope.param = {
					'host' :   host+param,
					'page' :   page,
					'gadget' : gadget,
					'zone' :   zone,
					'pageToGoAfterLogin' : data.pageToGoAfterLogin
				}
				$scope.loginInit();
			});
		else
			$scope.loginInit();

	}

	/**************
	 * Login part
	 **************/
	$scope.loginInit = function(message,success) {
	
		usSpinnerService.spin('spinner');
		$scope.loginError = message;
		$scope.loginSuccess = success;
		$http.get($scope.param.host + 'service/gadget/authentication/' + $scope.param.gadget + '/json/login').success(function(data) {
			usSpinnerService.stop('spinner');
			$scope.token = data.csrf_token;
			if(data.allReadyLogged) {
				$location.path('/Page/'+$scope.param.pageToGoAfterLogin);
			} else {
				$scope.routing('login');
			}
		});
	}
	$scope.loginAction = function() {
	
		usSpinnerService.spin('spinner');
		$scope.loginError = null;
		var data = '_csrf_token='+$scope.token+'&_username='+$scope.email+'&_password='+$scope.password+'&ajax=true';
		if($scope.rememberMe) {
			data+='&_remember_me='+$scope.rememberMe;
		}
		$http.post($scope.param.host + 'login_check',data).success(function(data) {
			usSpinnerService.stop('spinner');
			if(data.success) {
				$location.path('/Page/'+$scope.param.pageToGoAfterLogin);
			} else {
				$scope.loginInit(data.message);
			}
		});
	}
	
	/**************
	 * Register part
	 **************/
	$scope.registerInit = function(message) {
		usSpinnerService.spin('spinner');
		$scope.routing('register');
		$scope.registerError = message;
		$http.get($scope.param.host + 'service/gadget/authentication/' + $scope.param.gadget + '/json/register').success(function(data) {
			usSpinnerService.stop('spinner');
			$scope.token = data.csrf_token;
		});
	}

	$scope.registerAction = function() {
		$scope.registerError = null;
		
		var checkEmpty = function() {
			var ret = false;
			$('#register input').each(function(){
				if($(this).val() == "") {
					ret = true;
				}
			});
			return ret;
		}
		
		if(checkEmpty()) {
			$scope.registerError = "All field are required";
			window.scrollTo(0, 0);
		} else if($scope.password.length < 5 ) {
			$scope.registerError = "a password must contain at least 6 letters";
			window.scrollTo(0, 0);
		} else if($scope.password != $scope.password2) {
			$scope.registerError = "passwords don't match";
			window.scrollTo(0, 0);
		} else {
			usSpinnerService.spin('spinner');
			var data = 'csrf_token='+$scope.token+'&password='+$scope.password+'&email='+$scope.email;
			$http.post($scope.param.host + 'service/gadget/authentication/' + $scope.param.gadget + '/json/register',data).success(function(data) {
				usSpinnerService.stop('spinner');
				if(data.success) {
					$scope.loginInit(null,"Registration completed you can now log in");
				} else {
					$scope.registerInit(data.message);
					window.scrollTo(0, 0);
				}
			});
		}
	}
	
	/*************
	 * Forgot password part
	 *************/
	$scope.forgotPasswordInit = function(message) {
		usSpinnerService.spin('spinner');
		$scope.routing('forgotPassword');
		$scope.forgotPasswordError = message;
		usSpinnerService.stop('spinner');
	}
	$scope.forgotPasswordAction = function () {
		$scope.forgotPasswordError = null;
		if(typeof($scope.username) == "undefined" || $scope.username.length == 0) {
			$scope.forgotPasswordError = "All fields are required";
		} else {
			usSpinnerService.spin('spinner');
			var data = 'username='+$scope.username;
			$http.post($scope.param.host + 'service/gadget/authentification/' + $scope.param.gadget + '/json/forgotPassword',data).success(function(data) {
				usSpinnerService.stop('spinner');
				if(data.success) {
					$scope.loginInit(null,"Please check your email account to recover to password");
				} else {
					$scope.forgotPasswordInit(data.message);
				}
			});
		}
	}
});

document.addEventListener('deviceready', function() {
	FB.init({
		appId: '647222965353265',
		nativeInterface: CDV.FB,
		useCachedDialogs: false
	});
	FB.getLoginStatus(handleStatusChange);
});
function handleStatusChange(session) {
	console.log('Got the user\'s session: ' + JSON.stringify(session));
}

FB.Event.subscribe('auth.login', function(response) {
					console.log('login event');
                   console.log(response);
                   });

FB.Event.subscribe('auth.logout', function(response) {
					console.log('logout event');
                   console.log(response);
                   });

function test() {
	console.log("test login");
	FB.login(null, {scope: 'email'});
}
