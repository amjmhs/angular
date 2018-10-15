"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
var common_options_1 = require("./common_options");
var metric_1 = require("./metric");
var validator_1 = require("./validator");
/**
 * SampleDescription merges all available descriptions about a sample
 */
var SampleDescription = /** @class */ (function () {
    function SampleDescription(id, descriptions, metrics) {
        var _this = this;
        this.id = id;
        this.metrics = metrics;
        this.description = {};
        descriptions.forEach(function (description) {
            Object.keys(description).forEach(function (prop) { _this.description[prop] = description[prop]; });
        });
    }
    SampleDescription.prototype.toJson = function () { return { 'id': this.id, 'description': this.description, 'metrics': this.metrics }; };
    SampleDescription.PROVIDERS = [{
            provide: SampleDescription,
            useFactory: function (metric, id, forceGc, userAgent, validator, defaultDesc, userDesc) {
                return new SampleDescription(id, [
                    { 'forceGc': forceGc, 'userAgent': userAgent }, validator.describe(), defaultDesc,
                    userDesc
                ], metric.describe());
            },
            deps: [
                metric_1.Metric, common_options_1.Options.SAMPLE_ID, common_options_1.Options.FORCE_GC, common_options_1.Options.USER_AGENT, validator_1.Validator,
                common_options_1.Options.DEFAULT_DESCRIPTION, common_options_1.Options.SAMPLE_DESCRIPTION
            ]
        }];
    return SampleDescription;
}());
exports.SampleDescription = SampleDescription;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2FtcGxlX2Rlc2NyaXB0aW9uLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvYmVuY2hwcmVzcy9zcmMvc2FtcGxlX2Rlc2NyaXB0aW9uLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7O0FBSUgsbURBQXlDO0FBQ3pDLG1DQUFnQztBQUNoQyx5Q0FBc0M7QUFHdEM7O0dBRUc7QUFDSDtJQW9CRSwyQkFDVyxFQUFVLEVBQUUsWUFBeUMsRUFDckQsT0FBNkI7UUFGeEMsaUJBT0M7UUFOVSxPQUFFLEdBQUYsRUFBRSxDQUFRO1FBQ1YsWUFBTyxHQUFQLE9BQU8sQ0FBc0I7UUFDdEMsSUFBSSxDQUFDLFdBQVcsR0FBRyxFQUFFLENBQUM7UUFDdEIsWUFBWSxDQUFDLE9BQU8sQ0FBQyxVQUFBLFdBQVc7WUFDOUIsTUFBTSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQyxPQUFPLENBQUMsVUFBQSxJQUFJLElBQU0sS0FBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsR0FBRyxXQUFXLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUM1RixDQUFDLENBQUMsQ0FBQztJQUNMLENBQUM7SUFFRCxrQ0FBTSxHQUFOLGNBQVcsT0FBTyxFQUFDLElBQUksRUFBRSxJQUFJLENBQUMsRUFBRSxFQUFFLGFBQWEsRUFBRSxJQUFJLENBQUMsV0FBVyxFQUFFLFNBQVMsRUFBRSxJQUFJLENBQUMsT0FBTyxFQUFDLENBQUMsQ0FBQyxDQUFDO0lBNUJ2RiwyQkFBUyxHQUFHLENBQUM7WUFDbEIsT0FBTyxFQUFFLGlCQUFpQjtZQUMxQixVQUFVLEVBQ04sVUFBQyxNQUFjLEVBQUUsRUFBVSxFQUFFLE9BQWdCLEVBQUUsU0FBaUIsRUFBRSxTQUFvQixFQUNyRixXQUFvQyxFQUFFLFFBQWlDO2dCQUNwRSxPQUFBLElBQUksaUJBQWlCLENBQ2pCLEVBQUUsRUFDRjtvQkFDRSxFQUFDLFNBQVMsRUFBRSxPQUFPLEVBQUUsV0FBVyxFQUFFLFNBQVMsRUFBQyxFQUFFLFNBQVMsQ0FBQyxRQUFRLEVBQUUsRUFBRSxXQUFXO29CQUMvRSxRQUFRO2lCQUNULEVBQ0QsTUFBTSxDQUFDLFFBQVEsRUFBRSxDQUFDO1lBTnRCLENBTXNCO1lBQzlCLElBQUksRUFBRTtnQkFDSixlQUFNLEVBQUUsd0JBQU8sQ0FBQyxTQUFTLEVBQUUsd0JBQU8sQ0FBQyxRQUFRLEVBQUUsd0JBQU8sQ0FBQyxVQUFVLEVBQUUscUJBQVM7Z0JBQzFFLHdCQUFPLENBQUMsbUJBQW1CLEVBQUUsd0JBQU8sQ0FBQyxrQkFBa0I7YUFDeEQ7U0FDRixDQUFDLENBQUM7SUFhTCx3QkFBQztDQUFBLEFBOUJELElBOEJDO0FBOUJZLDhDQUFpQiJ9