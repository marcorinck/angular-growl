angular.module("angular-growl").factory("growl", ["$rootScope", "$filter", function ($rootScope, $filter) {
	var translate;

	try {
		translate = $filter("translate");
	} catch (e){
		//
	}

	function broadcastMessage(message) {
		if (translate) {
			message = translate(message);
		}
		$rootScope.$broadcast("growlMessage", message);
	}

	function sendMessage(text, severity) {
		var message = {
			text: text,
			isWarn: severity.isWarn,
			isError: severity.isError,
			isInfo: severity.isInfo,
			isSuccess: severity.isSuccess
		};

		broadcastMessage(message);
	}

	function addWarnMessage(text) {
		sendMessage(text, {isWarn: true});
	}

	function addErrorMessage(text) {
		sendMessage(text, {isError: true});
	}

	function addInfoMessage(text) {
		sendMessage(text, {isInfo: true});
	}

	function addSuccessMessage(text) {
		sendMessage(text, {isSuccess: true});
	}

	function addServerMessages(messages) {
		if (messages && messages.length > 0) {
			broadcastMessage(messages);
		}
	}

	return {
		addWarnMessage: addWarnMessage,
		addErrorMessage: addErrorMessage,
		addInfoMessage: addInfoMessage,
		addSuccessMessage: addSuccessMessage,
		addServerMessages: addServerMessages

	};
}]);
