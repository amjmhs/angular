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
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var web_driver_adapter_1 = require("../web_driver_adapter");
var web_driver_extension_1 = require("../web_driver_extension");
var FirefoxDriverExtension = /** @class */ (function (_super) {
    __extends(FirefoxDriverExtension, _super);
    function FirefoxDriverExtension(_driver) {
        var _this = _super.call(this) || this;
        _this._driver = _driver;
        _this._profilerStarted = false;
        return _this;
    }
    FirefoxDriverExtension_1 = FirefoxDriverExtension;
    FirefoxDriverExtension.prototype.gc = function () { return this._driver.executeScript('window.forceGC()'); };
    FirefoxDriverExtension.prototype.timeBegin = function (name) {
        if (!this._profilerStarted) {
            this._profilerStarted = true;
            this._driver.executeScript('window.startProfiler();');
        }
        return this._driver.executeScript('window.markStart("' + name + '");');
    };
    FirefoxDriverExtension.prototype.timeEnd = function (name, restartName) {
        if (restartName === void 0) { restartName = null; }
        var script = 'window.markEnd("' + name + '");';
        if (restartName != null) {
            script += 'window.markStart("' + restartName + '");';
        }
        return this._driver.executeScript(script);
    };
    FirefoxDriverExtension.prototype.readPerfLog = function () {
        return this._driver.executeAsyncScript('var cb = arguments[0]; window.getProfile(cb);');
    };
    FirefoxDriverExtension.prototype.perfLogFeatures = function () { return new web_driver_extension_1.PerfLogFeatures({ render: true, gc: true }); };
    FirefoxDriverExtension.prototype.supports = function (capabilities) {
        return capabilities['browserName'].toLowerCase() === 'firefox';
    };
    var FirefoxDriverExtension_1;
    FirefoxDriverExtension.PROVIDERS = [{ provide: FirefoxDriverExtension_1, deps: [web_driver_adapter_1.WebDriverAdapter] }];
    FirefoxDriverExtension = FirefoxDriverExtension_1 = __decorate([
        core_1.Injectable(),
        __metadata("design:paramtypes", [web_driver_adapter_1.WebDriverAdapter])
    ], FirefoxDriverExtension);
    return FirefoxDriverExtension;
}(web_driver_extension_1.WebDriverExtension));
exports.FirefoxDriverExtension = FirefoxDriverExtension;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmlyZWZveF9kcml2ZXJfZXh0ZW5zaW9uLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvYmVuY2hwcmVzcy9zcmMvd2ViZHJpdmVyL2ZpcmVmb3hfZHJpdmVyX2V4dGVuc2lvbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7OztHQU1HOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFFSCxzQ0FBeUM7QUFFekMsNERBQXVEO0FBQ3ZELGdFQUEwRjtBQUcxRjtJQUE0QywwQ0FBa0I7SUFLNUQsZ0NBQW9CLE9BQXlCO1FBQTdDLFlBQ0UsaUJBQU8sU0FFUjtRQUhtQixhQUFPLEdBQVAsT0FBTyxDQUFrQjtRQUUzQyxLQUFJLENBQUMsZ0JBQWdCLEdBQUcsS0FBSyxDQUFDOztJQUNoQyxDQUFDOytCQVJVLHNCQUFzQjtJQVVqQyxtQ0FBRSxHQUFGLGNBQU8sT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDLGFBQWEsQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUUvRCwwQ0FBUyxHQUFULFVBQVUsSUFBWTtRQUNwQixJQUFJLENBQUMsSUFBSSxDQUFDLGdCQUFnQixFQUFFO1lBQzFCLElBQUksQ0FBQyxnQkFBZ0IsR0FBRyxJQUFJLENBQUM7WUFDN0IsSUFBSSxDQUFDLE9BQU8sQ0FBQyxhQUFhLENBQUMseUJBQXlCLENBQUMsQ0FBQztTQUN2RDtRQUNELE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxhQUFhLENBQUMsb0JBQW9CLEdBQUcsSUFBSSxHQUFHLEtBQUssQ0FBQyxDQUFDO0lBQ3pFLENBQUM7SUFFRCx3Q0FBTyxHQUFQLFVBQVEsSUFBWSxFQUFFLFdBQStCO1FBQS9CLDRCQUFBLEVBQUEsa0JBQStCO1FBQ25ELElBQUksTUFBTSxHQUFHLGtCQUFrQixHQUFHLElBQUksR0FBRyxLQUFLLENBQUM7UUFDL0MsSUFBSSxXQUFXLElBQUksSUFBSSxFQUFFO1lBQ3ZCLE1BQU0sSUFBSSxvQkFBb0IsR0FBRyxXQUFXLEdBQUcsS0FBSyxDQUFDO1NBQ3REO1FBQ0QsT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDLGFBQWEsQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUM1QyxDQUFDO0lBRUQsNENBQVcsR0FBWDtRQUNFLE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxrQkFBa0IsQ0FBQywrQ0FBK0MsQ0FBQyxDQUFDO0lBQzFGLENBQUM7SUFFRCxnREFBZSxHQUFmLGNBQXFDLE9BQU8sSUFBSSxzQ0FBZSxDQUFDLEVBQUMsTUFBTSxFQUFFLElBQUksRUFBRSxFQUFFLEVBQUUsSUFBSSxFQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFFNUYseUNBQVEsR0FBUixVQUFTLFlBQWtDO1FBQ3pDLE9BQU8sWUFBWSxDQUFDLGFBQWEsQ0FBQyxDQUFDLFdBQVcsRUFBRSxLQUFLLFNBQVMsQ0FBQztJQUNqRSxDQUFDOztJQW5DTSxnQ0FBUyxHQUFHLENBQUMsRUFBQyxPQUFPLEVBQUUsd0JBQXNCLEVBQUUsSUFBSSxFQUFFLENBQUMscUNBQWdCLENBQUMsRUFBQyxDQUFDLENBQUM7SUFEdEUsc0JBQXNCO1FBRGxDLGlCQUFVLEVBQUU7eUNBTWtCLHFDQUFnQjtPQUxsQyxzQkFBc0IsQ0FxQ2xDO0lBQUQsNkJBQUM7Q0FBQSxBQXJDRCxDQUE0Qyx5Q0FBa0IsR0FxQzdEO0FBckNZLHdEQUFzQiJ9