describe("growlProvider", function() {
	"use strict";

	var ele, scope, growl, $timeout;
	var provider;
	beforeEach(module('angular-growl', function(growlProvider) {
		provider = growlProvider;
	}));

	beforeEach(inject(function($compile, $rootScope, _growl_, _$timeout_) {
		scope = $rootScope;
		$timeout = _$timeout_;
		growl = _growl_;
		ele = angular.element(
			'<div growl></div>'
		);
		$compile(ele)(scope);
		scope.$apply();
	}));
	
	it('should let you configure CSS classes', function() {
		provider.messageClasses({
			'warn' : 'custom-warn-class'
		});
		growl.addWarnMessage("Warn message");
		scope.$apply();
		expect(ele.html()).toMatch("custom-warn-class");
	});
});