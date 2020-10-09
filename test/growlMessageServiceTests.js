describe("growlMessageService Spec", function() {
    "use strict";

    var growlMessages;

    beforeEach(module('angular-growl'));
    beforeEach(inject(['growlMessages', function (gm) {
        growlMessages = gm;
    }]));

    /// TESTS
    it('Should be defined', function () {
        expect(growlMessages).toBeDefined();
    });
});