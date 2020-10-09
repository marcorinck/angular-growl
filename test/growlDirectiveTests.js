describe("growlDirective Spec", function() {
	"use strict";

	var $compile,
		$rootScope;

	beforeEach(module('angular-growl'));

	beforeEach(inject(function (_$compile_, _$rootScope_) {
		$compile = _$compile_;
		$rootScope = _$rootScope_;
	}));

	it('Replaces the element with the appropriate content', function () {

		var growlElement = $compile('<div growl=""></div>')($rootScope);

		$rootScope.$digest();

		expect(growlElement.html()).toContain('<div class="growl-container growl-fixed top-right"');
	});
});