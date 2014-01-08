describe("growlDirective", function() {
	"use strict";

	var ele, scope, growl, $timeout;
	beforeEach(module('angular-growl'));

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

	it("initially messages should be empty", function() {
		expect(ele.scope().messages.length).toEqual(0);
	});

	it("messages can be added", function() {
		growl.addWarnMessage("Warn message");
		growl.addErrorMessage("Error message");
		growl.addInfoMessage("Info message");
		growl.addSuccessMessage("Success message");
		expect(ele.scope().messages.length).toEqual(4);
	});

	it("should generate correct html", function() {
		growl.addWarnMessage("Warn message");
		expect(ele.html()).not.toMatch("Warn message");
		scope.$apply();
		expect(ele.html()).toMatch("Warn message");
	});

	it("message should live limited time", function() {
		growl.addWarnMessage("Some message", {ttl:100});
		expect(ele.scope().messages.length).toEqual(1);
		$timeout.flush(100);
		expect(ele.scope().messages.length).toEqual(0);
	});
});