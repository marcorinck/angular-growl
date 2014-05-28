angular.module("angular-growl").provider("growl", function() {
	"use strict";

	var _ttl = null,
        _enableHtml = false,
		_messagesKey = 'messages',
		_messageTextKey = 'text',
		_messageSeverityKey = 'severity',
		_onlyUniqueMessages = true;

	/**
	 * set a global timeout (time to live) after which messages will be automatically closed
	 *
	 * @param ttl in seconds
	 */
	this.globalTimeToLive = function(ttl) {
		_ttl = ttl;
	};

	/**
	 * set whether HTML in message content should be escaped (default) or binded as-is
	 *
	 * @param {bool} enableHtml true to make all messages not escapes
	 */
	this.globalEnableHtml = function(enableHtml) {
		_enableHtml = enableHtml;
	};

	/**
	 * sets the key in $http response the serverMessagesInterecptor is looking for server-sent messages, value of key
	 * needs to be an array of objects
	 *
	 * @param {string} messagesKey default: messages
	 */
	this.messagesKey = function(messagesKey) {
		_messagesKey = messagesKey;
	};

	/**
	 * sets the key in server sent messages the serverMessagesInterecptor is looking for text of message
	 *
	 * @param {string} messageTextKey default: text
	 */
	this.messageTextKey = function(messageTextKey) {
		_messageTextKey = messageTextKey;
	};

	/**
	 * sets the key in server sent messages the serverMessagesInterecptor is looking for severity of message
	 *
	 * @param {string} messageSeverityKey default: severity
	 */
	this.messageSeverityKey = function(messageSeverityKey) {
		_messageSeverityKey = messageSeverityKey;
	};

	this.onlyUniqueMessages = function(onlyUniqueMessages) {
		_onlyUniqueMessages = onlyUniqueMessages;
	};

	/**
	 * $http interceptor that can be added to array of $http interceptors during config phase of application
	 * via $httpProvider.responseInterceptors.push(...)
	 *
	 */
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
				message.text = translate(message.text);
			}
			$rootScope.$broadcast("growlMessage", message);
		}

		function sendMessage(text, config, severity) {
			var _config = config || {}, message;

			message = {
				classes: _config.classes,
				text: text,
				severity: severity,
				ttl: _config.ttl || _ttl,
				enableHtml: _config.enableHtml || _enableHtml
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
			sendMessage(text, config, "warn");
		}

		/**
		 * add one error message with bootstrap classes: alert, alert-error
		 *
		 * @param {string} text
		 * @param {{ttl: number}} config
		 */
		function addErrorMessage(text, config) {
			sendMessage(text, config, "error");
		}

		/**
		 * add one info message with bootstrap classes: alert, alert-info
		 *
		 * @param {string} text
		 * @param {{ttl: number}} config
		 */
		function addInfoMessage(text, config) {
			sendMessage(text, config, "info");
		}

		/**
		 * add one success message with bootstrap classes: alert, alert-success
		 *
		 * @param {string} text
		 * @param {{ttl: number}} config
		 */
		function addSuccessMessage(text, config) {
			sendMessage(text, config, "success");
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
							severity = "warn";
							break;
						case "success":
							severity = "success";
							break;
						case "info":
							severity = "info";
							break;
						case "error":
							severity = "error";
							break;
					}
					sendMessage(message[_messageTextKey], undefined, severity);
				}
			}
		}

		function onlyUnique() {
			return _onlyUniqueMessages;
		}

		return {
			addWarnMessage: addWarnMessage,
			addErrorMessage: addErrorMessage,
			addInfoMessage: addInfoMessage,
			addSuccessMessage: addSuccessMessage,
			addServerMessages: addServerMessages,
			onlyUnique: onlyUnique
		};
	}];
});
