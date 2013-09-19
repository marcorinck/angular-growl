angular.module("angular-growl").factory("growl", ["$rootScope", "$filter", function ($rootScope, $filter) {
	"use strict";

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

	function sendMessage(text, severity, ttl) {
		var message = {
			text: text,
			isWarn: severity.isWarn,
			isError: severity.isError,
			isInfo: severity.isInfo,
			isSuccess: severity.isSuccess
		};
		if (ttl) {
			message.ttl = ttl;
		}
		
		broadcastMessage(message);
	}

	function addWarnMessage(text, ttl) {
		sendMessage(text, {isWarn: true}, ttl);
	}

	function addErrorMessage(text, ttl) {
		sendMessage(text, {isError: true}, ttl);
	}

	function addInfoMessage(text, ttl) {
		sendMessage(text, {isInfo: true}, ttl);
	}

	function addSuccessMessage(text, ttl) {
		sendMessage(text, {isSuccess: true}, ttl);
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
