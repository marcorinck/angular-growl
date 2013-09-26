angular.module("angular-growl").provider("growl", function() {
	"use strict";

	var _ttl = null,
		_messagesKey = 'messages',
		_messageTextKey = 'text',
		_messageSeverityKey = 'severity';

	this.globalTimeToLive = function(ttl) {
		_ttl = ttl;
	};

	this.messagesKey = function(messagesKey) {
		_messagesKey = messagesKey;
	};

	this.messageTextKey = function(messageTextKey) {
		_messageTextKey = messageTextKey;
	};

	this.messageSeverityKey = function(messageSeverityKey) {
		_messageSeverityKey = messageSeverityKey;
	};

	this.serverMessagesInterceptor = ['$q', 'growl', function ($q, growl) {
		function checkResponse(response) {
			if (response.data[_messagesKey] && response.data[_messagesKey].length > 0) {
				growl.addServerMessages(response.data[_messagesKey]);
			}
		}

		function success(response) {
			checkResponse(response);
			return response;
		}

		function error(response) {
			checkResponse(response);
			return $q.reject(response);
		}

		return function (promise) {
			return promise.then(success, error);
		};
	}];

	this.$get = ["$rootScope", "$filter", function ($rootScope, $filter) {
		var translate;

		try {
			translate = $filter("translate");
		} catch (e) {
			//
		}

		function broadcastMessage(message) {
			if (translate) {
				message = translate(message);
			}
			$rootScope.$broadcast("growlMessage", message);
		}

		function sendMessage(text, config, severity) {
			var _config = config || {}, message;

			message = {
				text: text,
				isWarn: severity.isWarn,
				isError: severity.isError,
				isInfo: severity.isInfo,
				isSuccess: severity.isSuccess,
				ttl: _config.ttl || _ttl
			};

			broadcastMessage(message);
		}

		/**
		 * add one warn message with bootstrap class: alert
		 *
		 * @param {string} text
		 * @param {{ttl: number}} config
		 */
		function addWarnMessage(text, config) {
			sendMessage(text, config, {isWarn: true});
		}

		/**
		 * add one error message with bootstrap classes: alert, alert-error
		 *
		 * @param {string} text
		 * @param {{ttl: number}} config
		 */
		function addErrorMessage(text, config) {
			sendMessage(text, config, {isError: true});
		}

		/**
		 * add one info message with bootstrap classes: alert, alert-info
		 *
		 * @param {string} text
		 * @param {{ttl: number}} config
		 */
		function addInfoMessage(text, config) {
			sendMessage(text, config, {isInfo: true});
		}

		/**
		 * add one success message with bootstrap classes: alert, alert-success
		 *
		 * @param {string} text
		 * @param {{ttl: number}} config
		 */
		function addSuccessMessage(text, config) {
			sendMessage(text, config, {isSuccess: true});
		}

		/**
		 * add a indefinite number of messages that a backend server may have sent as a validation result
		 *
		 * @param {Array.<object>} messages
		 */
		function addServerMessages(messages) {
			var i, message, severity, length;
			length = messages.length;
			for (i = 0; i < length; i++) {
				message = messages[i];

				if (message[_messageTextKey] && message[_messageSeverityKey]) {
					switch (message[_messageSeverityKey]) {
						case "warn":
							severity = {isWarn: true};
							break;
						case "success":
							severity = {isSuccess: true};
							break;
						case "info":
							severity = {isInfo: true};
							break;
						case "error":
							severity = {isError: true};
							break;
					}
					sendMessage(message[_messageTextKey], undefined, severity);
				}
			}
		}

		return {
			addWarnMessage: addWarnMessage,
			addErrorMessage: addErrorMessage,
			addInfoMessage: addInfoMessage,
			addSuccessMessage: addSuccessMessage,
			addServerMessages: addServerMessages
		};
	}];
});
