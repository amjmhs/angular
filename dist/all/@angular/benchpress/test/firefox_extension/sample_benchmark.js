"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
var protractor_1 = require("protractor");
var benchpress = require('../../index.js');
var runner = new benchpress.Runner([
    // use protractor as Webdriver client
    benchpress.SeleniumWebDriverAdapter.PROTRACTOR_PROVIDERS,
    // use RegressionSlopeValidator to validate samples
    benchpress.Validator.bindTo(benchpress.RegressionSlopeValidator),
    // use 10 samples to calculate slope regression
    benchpress.bind(benchpress.RegressionSlopeValidator.SAMPLE_SIZE).toValue(20),
    // use the script metric to calculate slope regression
    benchpress.bind(benchpress.RegressionSlopeValidator.METRIC).toValue('scriptTime'),
    benchpress.bind(benchpress.Options.FORCE_GC).toValue(true)
]);
describe('deep tree baseline', function () {
    it('should be fast!', function (done) {
        protractor_1.browser.ignoreSynchronization = true;
        protractor_1.browser.get('http://localhost:8001/playground/src/benchpress/');
        /*
         * Tell benchpress to click the buttons to destroy and re-create the tree for each sample.
         * Benchpress will log the collected metrics after each sample is collected, and will stop
         * sampling as soon as the calculated regression slope for last 20 samples is stable.
         */
        runner
            .sample({
            id: 'baseline',
            execute: function () { protractor_1.$('button').click(); },
            providers: [benchpress.bind(benchpress.Options.SAMPLE_DESCRIPTION).toValue({ depth: 9 })]
        })
            .then(done, done.fail);
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2FtcGxlX2JlbmNobWFyay5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2JlbmNocHJlc3MvdGVzdC9maXJlZm94X2V4dGVuc2lvbi9zYW1wbGVfYmVuY2htYXJrLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7O0FBRUgseUNBQXNDO0FBRXRDLElBQU0sVUFBVSxHQUFHLE9BQU8sQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO0FBQzdDLElBQU0sTUFBTSxHQUFHLElBQUksVUFBVSxDQUFDLE1BQU0sQ0FBQztJQUNuQyxxQ0FBcUM7SUFDckMsVUFBVSxDQUFDLHdCQUF3QixDQUFDLG9CQUFvQjtJQUN4RCxtREFBbUQ7SUFDbkQsVUFBVSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsVUFBVSxDQUFDLHdCQUF3QixDQUFDO0lBQ2hFLCtDQUErQztJQUMvQyxVQUFVLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyx3QkFBd0IsQ0FBQyxXQUFXLENBQUMsQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDO0lBQzVFLHNEQUFzRDtJQUN0RCxVQUFVLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyx3QkFBd0IsQ0FBQyxNQUFNLENBQUMsQ0FBQyxPQUFPLENBQUMsWUFBWSxDQUFDO0lBQ2pGLFVBQVUsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDO0NBQzNELENBQUMsQ0FBQztBQUVILFFBQVEsQ0FBQyxvQkFBb0IsRUFBRTtJQUM3QixFQUFFLENBQUMsaUJBQWlCLEVBQUUsVUFBUyxJQUFJO1FBQ2pDLG9CQUFPLENBQUMscUJBQXFCLEdBQUcsSUFBSSxDQUFDO1FBQ3JDLG9CQUFPLENBQUMsR0FBRyxDQUFDLGtEQUFrRCxDQUFDLENBQUM7UUFFaEU7Ozs7V0FJRztRQUNILE1BQU07YUFDRCxNQUFNLENBQUM7WUFDTixFQUFFLEVBQUUsVUFBVTtZQUNkLE9BQU8sRUFBRSxjQUFhLGNBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDLENBQUM7WUFDNUMsU0FBUyxFQUFFLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDLGtCQUFrQixDQUFDLENBQUMsT0FBTyxDQUFDLEVBQUMsS0FBSyxFQUFFLENBQUMsRUFBQyxDQUFDLENBQUM7U0FDeEYsQ0FBQzthQUNELElBQUksQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQzdCLENBQUMsQ0FBQyxDQUFDO0FBQ0wsQ0FBQyxDQUFDLENBQUMifQ==