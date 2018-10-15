"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var common_options_1 = require("../common_options");
var reporter_1 = require("../reporter");
var sample_description_1 = require("../sample_description");
var util_1 = require("./util");
/**
 * A reporter that writes results into a json file.
 */
var JsonFileReporter = /** @class */ (function (_super) {
    __extends(JsonFileReporter, _super);
    function JsonFileReporter(_description, _path, _writeFile, _now) {
        var _this = _super.call(this) || this;
        _this._description = _description;
        _this._path = _path;
        _this._writeFile = _writeFile;
        _this._now = _now;
        return _this;
    }
    JsonFileReporter_1 = JsonFileReporter;
    JsonFileReporter.prototype.reportMeasureValues = function (measureValues) { return Promise.resolve(null); };
    JsonFileReporter.prototype.reportSample = function (completeSample, validSample) {
        var stats = {};
        util_1.sortedProps(this._description.metrics).forEach(function (metricName) {
            stats[metricName] = util_1.formatStats(validSample, metricName);
        });
        var content = JSON.stringify({
            'description': this._description,
            'stats': stats,
            'completeSample': completeSample,
            'validSample': validSample,
        }, null, 2);
        var filePath = this._path + "/" + this._description.id + "_" + this._now().getTime() + ".json";
        return this._writeFile(filePath, content);
    };
    var JsonFileReporter_1;
    JsonFileReporter.PATH = new core_1.InjectionToken('JsonFileReporter.path');
    JsonFileReporter.PROVIDERS = [
        {
            provide: JsonFileReporter_1,
            deps: [sample_description_1.SampleDescription, JsonFileReporter_1.PATH, common_options_1.Options.WRITE_FILE, common_options_1.Options.NOW]
        },
        { provide: JsonFileReporter_1.PATH, useValue: '.' }
    ];
    JsonFileReporter = JsonFileReporter_1 = __decorate([
        core_1.Injectable(),
        __param(1, core_1.Inject(JsonFileReporter_1.PATH)),
        __param(2, core_1.Inject(common_options_1.Options.WRITE_FILE)),
        __param(3, core_1.Inject(common_options_1.Options.NOW)),
        __metadata("design:paramtypes", [sample_description_1.SampleDescription, String, Function,
            Function])
    ], JsonFileReporter);
    return JsonFileReporter;
}(reporter_1.Reporter));
exports.JsonFileReporter = JsonFileReporter;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoianNvbl9maWxlX3JlcG9ydGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvYmVuY2hwcmVzcy9zcmMvcmVwb3J0ZXIvanNvbl9maWxlX3JlcG9ydGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUVILHNDQUFpRTtBQUVqRSxvREFBMEM7QUFFMUMsd0NBQXFDO0FBQ3JDLDREQUF3RDtBQUV4RCwrQkFBZ0Q7QUFHaEQ7O0dBRUc7QUFFSDtJQUFzQyxvQ0FBUTtJQVU1QywwQkFDWSxZQUErQixFQUF5QyxLQUFhLEVBQ3pELFVBQW9CLEVBQzNCLElBQWM7UUFIL0MsWUFJRSxpQkFBTyxTQUNSO1FBSlcsa0JBQVksR0FBWixZQUFZLENBQW1CO1FBQXlDLFdBQUssR0FBTCxLQUFLLENBQVE7UUFDekQsZ0JBQVUsR0FBVixVQUFVLENBQVU7UUFDM0IsVUFBSSxHQUFKLElBQUksQ0FBVTs7SUFFL0MsQ0FBQzt5QkFmVSxnQkFBZ0I7SUFpQjNCLDhDQUFtQixHQUFuQixVQUFvQixhQUE0QixJQUFrQixPQUFPLE9BQU8sQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBRWpHLHVDQUFZLEdBQVosVUFBYSxjQUErQixFQUFFLFdBQTRCO1FBQ3hFLElBQU0sS0FBSyxHQUE0QixFQUFFLENBQUM7UUFDMUMsa0JBQVcsQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLE9BQU8sQ0FBQyxDQUFDLE9BQU8sQ0FBQyxVQUFDLFVBQVU7WUFDeEQsS0FBSyxDQUFDLFVBQVUsQ0FBQyxHQUFHLGtCQUFXLENBQUMsV0FBVyxFQUFFLFVBQVUsQ0FBQyxDQUFDO1FBQzNELENBQUMsQ0FBQyxDQUFDO1FBQ0gsSUFBTSxPQUFPLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FDMUI7WUFDRSxhQUFhLEVBQUUsSUFBSSxDQUFDLFlBQVk7WUFDaEMsT0FBTyxFQUFFLEtBQUs7WUFDZCxnQkFBZ0IsRUFBRSxjQUFjO1lBQ2hDLGFBQWEsRUFBRSxXQUFXO1NBQzNCLEVBQ0QsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDO1FBQ2IsSUFBTSxRQUFRLEdBQU0sSUFBSSxDQUFDLEtBQUssU0FBSSxJQUFJLENBQUMsWUFBWSxDQUFDLEVBQUUsU0FBSSxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUMsT0FBTyxFQUFFLFVBQU8sQ0FBQztRQUN2RixPQUFPLElBQUksQ0FBQyxVQUFVLENBQUMsUUFBUSxFQUFFLE9BQU8sQ0FBQyxDQUFDO0lBQzVDLENBQUM7O0lBakNNLHFCQUFJLEdBQUcsSUFBSSxxQkFBYyxDQUFDLHVCQUF1QixDQUFDLENBQUM7SUFDbkQsMEJBQVMsR0FBRztRQUNqQjtZQUNFLE9BQU8sRUFBRSxrQkFBZ0I7WUFDekIsSUFBSSxFQUFFLENBQUMsc0NBQWlCLEVBQUUsa0JBQWdCLENBQUMsSUFBSSxFQUFFLHdCQUFPLENBQUMsVUFBVSxFQUFFLHdCQUFPLENBQUMsR0FBRyxDQUFDO1NBQ2xGO1FBQ0QsRUFBQyxPQUFPLEVBQUUsa0JBQWdCLENBQUMsSUFBSSxFQUFFLFFBQVEsRUFBRSxHQUFHLEVBQUM7S0FDaEQsQ0FBQztJQVJTLGdCQUFnQjtRQUQ1QixpQkFBVSxFQUFFO1FBWW1DLFdBQUEsYUFBTSxDQUFDLGtCQUFnQixDQUFDLElBQUksQ0FBQyxDQUFBO1FBQ3RFLFdBQUEsYUFBTSxDQUFDLHdCQUFPLENBQUMsVUFBVSxDQUFDLENBQUE7UUFDMUIsV0FBQSxhQUFNLENBQUMsd0JBQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQTt5Q0FGRSxzQ0FBaUIsVUFDUyxRQUFRO1lBQ3JCLFFBQVE7T0FicEMsZ0JBQWdCLENBbUM1QjtJQUFELHVCQUFDO0NBQUEsQUFuQ0QsQ0FBc0MsbUJBQVEsR0FtQzdDO0FBbkNZLDRDQUFnQiJ9