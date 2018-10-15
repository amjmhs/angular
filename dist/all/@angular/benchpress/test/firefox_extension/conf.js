/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
require('core-js');
require('reflect-metadata');
var testHelper = require('../../src/firefox_extension/lib/test_helper.js');
exports.config = {
    specs: ['spec.js', 'sample_benchmark.js'],
    framework: 'jasmine2',
    jasmineNodeOpts: { showColors: true, defaultTimeoutInterval: 1200000 },
    getMultiCapabilities: function () { return testHelper.getFirefoxProfileWithExtension(); }
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29uZi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2JlbmNocHJlc3MvdGVzdC9maXJlZm94X2V4dGVuc2lvbi9jb25mLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRztBQUVILE9BQU8sQ0FBQyxTQUFTLENBQUMsQ0FBQztBQUNuQixPQUFPLENBQUMsa0JBQWtCLENBQUMsQ0FBQztBQUM1QixJQUFNLFVBQVUsR0FBRyxPQUFPLENBQUMsZ0RBQWdELENBQUMsQ0FBQztBQUU3RSxPQUFPLENBQUMsTUFBTSxHQUFHO0lBQ2YsS0FBSyxFQUFFLENBQUMsU0FBUyxFQUFFLHFCQUFxQixDQUFDO0lBRXpDLFNBQVMsRUFBRSxVQUFVO0lBRXJCLGVBQWUsRUFBRSxFQUFDLFVBQVUsRUFBRSxJQUFJLEVBQUUsc0JBQXNCLEVBQUUsT0FBTyxFQUFDO0lBRXBFLG9CQUFvQixFQUFFLGNBQWEsT0FBTyxVQUFVLENBQUMsOEJBQThCLEVBQUUsQ0FBQyxDQUFDLENBQUM7Q0FDekYsQ0FBQyJ9