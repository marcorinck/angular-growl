angular.module("angular-growl").service("growlMessages", ['$sce', '$interval', function ($sce, $interval) {
  "use strict";

  var self = this;
  this.directives = {};
  var preloadDirectives = {};

  /**
   * Allows for preloading a directive before the directives
   * controller is initialized
   * @param referenceId
   * @returns {*}
   */
  function preLoad(referenceId) {
    var directive;
    if (preloadDirectives[referenceId]) {
      directive =  preloadDirectives[referenceId];
    } else {
      directive = preloadDirectives[referenceId] = {
        messages: []
      };
    }
    return directive;
  }

  function directiveForRefId(referenceId) {
    var refId = referenceId || 0;
    return (self.directives[refId] || preloadDirectives[refId]);
  }

  /**
   * Initialize a directive
   * We look at the preloaded directive and use this else we
   * create a new blank object
   * @param referenceId
   * @param limitMessages
   */
  this.initDirective = function (referenceId, limitMessages) {
    // If we already have a directive preloaded use this version
    // so our growl notifications are shown.
    if (preloadDirectives[referenceId]) {
      this.directives[referenceId] = preloadDirectives[referenceId];
      this.directives[referenceId].limitMessages = limitMessages;
    } else {
      this.directives[referenceId] = {
        messages: [],
        limitMessages: limitMessages
      };
    }
    return this.directives[referenceId];
  };

  this.getAllMessages = function (referenceId) {
    referenceId = referenceId || 0;
    var messages;
    if (directiveForRefId(referenceId)) {
      messages = directiveForRefId(referenceId).messages;
    } else {
      messages = [];
    }
    return messages;
  };

  this.destroyAllMessages = function (referenceId) {
    var messages = this.getAllMessages(referenceId);
    for (var i = messages.length - 1; i >= 0; i--) {
      messages[i].destroy();
    }

    var directive = directiveForRefId(referenceId);
    if (directive) {
      directive.messages = [];
    }
  };

  this.addMessage = function (message) {
    var directive, messages, found, msgText;

    // If we dont found our directive preload it!
    if (this.directives[message.referenceId]) {
      directive = this.directives[message.referenceId];
    } else {
      directive = preLoad(message.referenceId);
    }

    messages = directive.messages;

    if (this.onlyUnique) {
      angular.forEach(messages, function (msg) {
        msgText = $sce.getTrustedHtml(msg.text);
        if (message.text === msgText && message.severity === msg.severity && message.title === msg.title) {
          found = true;
        }
      });

      if (found) {
        return;
      }
    }

    message.text = $sce.trustAsHtml(String(message.text));

    /**If message closes on timeout, add's promises array for
     timeouts to stop close. Also sets message.closeoutTimer to ttl / 1000
     **/
    if (message.ttl && message.ttl !== -1) {
      message.countdown = message.ttl / 1000;
      message.promises = [];
      message.close = false;
      message.countdownFunction = function () {
        if (message.countdown > 1) {
          message.countdown--;
          message.promises.push($interval(message.countdownFunction, 1000, 1,1));
        } else {
          message.countdown--;
        }
      };
    }

    /** Limit the amount of messages in the container **/
    if (angular.isDefined(directive.limitMessages)) {
      var diff = messages.length - (directive.limitMessages - 1);
      if (diff > 0) {
        messages.splice(directive.limitMessages - 1, diff);
      }
    }

    /** abillity to reverse order (newest first ) **/
    if (this.reverseOrder) {
      messages.unshift(message);
    } else {
      messages.push(message);
    }

    if (typeof (message.onopen) === 'function') {
      message.onopen();
    }

    if (message.ttl && message.ttl !== -1) {
      //adds message timeout to promises and starts messages countdown function.
      var self = this;
      message.promises.push($interval(angular.bind(this, function () {
        self.deleteMessage(message);
      }), message.ttl, 1,1));
      message.promises.push($interval(message.countdownFunction, 1000, 1,1));
    }

    return message;
  };

  this.deleteMessage = function (message) {
    var messages = this.getAllMessages(message.referenceId),
      index = -1;

    for (var i in messages) {
      if (messages.hasOwnProperty(i)) {
        index = messages[i] === message ? i : index;
      }
    }
	
    if (index > -1) {
      messages[index].close = true;
      messages.splice(index, 1);
    }

    if (typeof (message.onclose) === 'function') {
      message.onclose();
    }
  };
}]);
