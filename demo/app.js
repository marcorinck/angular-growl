(function () {
    'use strict';

    angular.module('GrowlSample', ['angular-growl'])
        .controller('SampleController', GrowlSampleController);


    //// Sample controller here.
    GrowlSampleController.$inject = ['growl'];
    function GrowlSampleController (growl) {
        var vm = this;
        vm.message = {type: 'success', ttl: -1};
        vm.showMessage = showMessage;


        //////// Functions
        function showMessage () {
            var config = angular.copy(vm.message);
            delete config.title;
            delete config.type;
            growl.general(vm.message.title, config, vm.message.type);
        }
    }

})();