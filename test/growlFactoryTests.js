describe("growlFactory Spec", function() {
    "use strict";

    var growlFactory,
        growlMessages;

    beforeEach(module('angular-growl'));
    beforeEach(inject(['growl', 'growlMessages', function (gf, gm) {
        growlFactory = gf;
        growlMessages = gm;
    }]));

    /// TESTS
    it('Should be defined', function () {
        expect(growlFactory).toBeDefined();
        expect(growlMessages).toBeDefined();
    });

    it('Should set proper values on default message types', function () {
        var builtinTypes = [
            'info',
            'error',
            'warning',
            'success'
        ];

        var severity;
        var sampleText = 'text';
        for (var i in builtinTypes) {

            severity = builtinTypes[i];
            expect(growlFactory[severity]).toBeDefined();
            var msg = growlFactory.general(sampleText, null, severity);

            expect(msg).toBeDefined();
            expect(msg.text.toString()).toEqual(sampleText);
            expect(msg.referenceId).toEqual(0);
            expect(msg.position).toEqual('top-right');
            expect(msg.severity).toEqual(severity);
        }
    });

    it('Should add and return an info message', function () {
        var msg = growlFactory.info('text');

        expect(growlMessages.getAllMessages().length).toEqual(1);
        msg.destroy();
        expect(growlMessages.getAllMessages().length).toEqual(0);
    });
});