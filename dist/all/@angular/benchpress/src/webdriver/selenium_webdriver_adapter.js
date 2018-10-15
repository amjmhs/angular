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
Object.defineProperty(exports, "__esModule", { value: true });
var web_driver_adapter_1 = require("../web_driver_adapter");
/**
 * Adapter for the selenium-webdriver.
 */
var SeleniumWebDriverAdapter = /** @class */ (function (_super) {
    __extends(SeleniumWebDriverAdapter, _super);
    function SeleniumWebDriverAdapter(_driver) {
        var _this = _super.call(this) || this;
        _this._driver = _driver;
        return _this;
    }
    SeleniumWebDriverAdapter.prototype.waitFor = function (callback) { return this._driver.call(callback); };
    SeleniumWebDriverAdapter.prototype.executeScript = function (script) { return this._driver.executeScript(script); };
    SeleniumWebDriverAdapter.prototype.executeAsyncScript = function (script) {
        return this._driver.executeAsyncScript(script);
    };
    SeleniumWebDriverAdapter.prototype.capabilities = function () {
        return this._driver.getCapabilities().then(function (capsObject) {
            var localData = {};
            for (var _i = 0, _a = Array.from(capsObject.keys()); _i < _a.length; _i++) {
                var key = _a[_i];
                localData[key] = capsObject.get(key);
            }
            return localData;
        });
    };
    SeleniumWebDriverAdapter.prototype.logs = function (type) {
        // Needed as selenium-webdriver does not forward
        // performance logs in the correct way via manage().logs
        return this._driver.schedule(new Command('getLog').setParameter('type', type), 'WebDriver.manage().logs().get(' + type + ')');
    };
    SeleniumWebDriverAdapter.PROTRACTOR_PROVIDERS = [{
            provide: web_driver_adapter_1.WebDriverAdapter,
            useFactory: function () { return new SeleniumWebDriverAdapter(global.browser); },
            deps: []
        }];
    return SeleniumWebDriverAdapter;
}(web_driver_adapter_1.WebDriverAdapter));
exports.SeleniumWebDriverAdapter = SeleniumWebDriverAdapter;
/**
 * Copy of the `Command` class of webdriver as
 * it is not exposed via index.js in selenium-webdriver.
 */
var Command = /** @class */ (function () {
    function Command(name_) {
        this.name_ = name_;
        this.parameters_ = {};
    }
    Command.prototype.getName = function () { return this.name_; };
    Command.prototype.setParameter = function (name, value) {
        this.parameters_[name] = value;
        return this;
    };
    Command.prototype.setParameters = function (parameters) {
        this.parameters_ = parameters;
        return this;
    };
    Command.prototype.getParameter = function (key) { return this.parameters_[key]; };
    Command.prototype.getParameters = function () { return this.parameters_; };
    return Command;
}());
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VsZW5pdW1fd2ViZHJpdmVyX2FkYXB0ZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9iZW5jaHByZXNzL3NyYy93ZWJkcml2ZXIvc2VsZW5pdW1fd2ViZHJpdmVyX2FkYXB0ZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRzs7Ozs7Ozs7Ozs7O0FBSUgsNERBQXVEO0FBR3ZEOztHQUVHO0FBQ0g7SUFBOEMsNENBQWdCO0lBTzVELGtDQUFvQixPQUFZO1FBQWhDLFlBQW9DLGlCQUFPLFNBQUc7UUFBMUIsYUFBTyxHQUFQLE9BQU8sQ0FBSzs7SUFBYSxDQUFDO0lBRTlDLDBDQUFPLEdBQVAsVUFBUSxRQUFtQixJQUFrQixPQUFPLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUVsRixnREFBYSxHQUFiLFVBQWMsTUFBYyxJQUFrQixPQUFPLElBQUksQ0FBQyxPQUFPLENBQUMsYUFBYSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUUxRixxREFBa0IsR0FBbEIsVUFBbUIsTUFBYztRQUMvQixPQUFPLElBQUksQ0FBQyxPQUFPLENBQUMsa0JBQWtCLENBQUMsTUFBTSxDQUFDLENBQUM7SUFDakQsQ0FBQztJQUVELCtDQUFZLEdBQVo7UUFDRSxPQUFPLElBQUksQ0FBQyxPQUFPLENBQUMsZUFBZSxFQUFFLENBQUMsSUFBSSxDQUFDLFVBQUMsVUFBZTtZQUN6RCxJQUFNLFNBQVMsR0FBeUIsRUFBRSxDQUFDO1lBQzNDLEtBQWtCLFVBQWlELEVBQWpELEtBQUEsS0FBSyxDQUFDLElBQUksQ0FBb0IsVUFBVyxDQUFDLElBQUksRUFBRSxDQUFDLEVBQWpELGNBQWlELEVBQWpELElBQWlELEVBQUU7Z0JBQWhFLElBQU0sR0FBRyxTQUFBO2dCQUNaLFNBQVMsQ0FBQyxHQUFHLENBQUMsR0FBRyxVQUFVLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDO2FBQ3RDO1lBQ0QsT0FBTyxTQUFTLENBQUM7UUFDbkIsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDO0lBRUQsdUNBQUksR0FBSixVQUFLLElBQVk7UUFDZixnREFBZ0Q7UUFDaEQsd0RBQXdEO1FBQ3hELE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQ3hCLElBQUksT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDLFlBQVksQ0FBQyxNQUFNLEVBQUUsSUFBSSxDQUFDLEVBQ2hELGdDQUFnQyxHQUFHLElBQUksR0FBRyxHQUFHLENBQUMsQ0FBQztJQUNyRCxDQUFDO0lBaENNLDZDQUFvQixHQUFxQixDQUFDO1lBQy9DLE9BQU8sRUFBRSxxQ0FBZ0I7WUFDekIsVUFBVSxFQUFFLGNBQU0sT0FBQSxJQUFJLHdCQUF3QixDQUFPLE1BQU8sQ0FBQyxPQUFPLENBQUMsRUFBbkQsQ0FBbUQ7WUFDckUsSUFBSSxFQUFFLEVBQUU7U0FDVCxDQUFDLENBQUM7SUE2QkwsK0JBQUM7Q0FBQSxBQWxDRCxDQUE4QyxxQ0FBZ0IsR0FrQzdEO0FBbENZLDREQUF3QjtBQW9DckM7OztHQUdHO0FBQ0g7SUFFRSxpQkFBb0IsS0FBYTtRQUFiLFVBQUssR0FBTCxLQUFLLENBQVE7UUFEekIsZ0JBQVcsR0FBeUIsRUFBRSxDQUFDO0lBQ1gsQ0FBQztJQUVyQyx5QkFBTyxHQUFQLGNBQVksT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztJQUVoQyw4QkFBWSxHQUFaLFVBQWEsSUFBWSxFQUFFLEtBQVU7UUFDbkMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsR0FBRyxLQUFLLENBQUM7UUFDL0IsT0FBTyxJQUFJLENBQUM7SUFDZCxDQUFDO0lBRUQsK0JBQWEsR0FBYixVQUFjLFVBQWdDO1FBQzVDLElBQUksQ0FBQyxXQUFXLEdBQUcsVUFBVSxDQUFDO1FBQzlCLE9BQU8sSUFBSSxDQUFDO0lBQ2QsQ0FBQztJQUVELDhCQUFZLEdBQVosVUFBYSxHQUFXLElBQUksT0FBTyxJQUFJLENBQUMsV0FBVyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUUzRCwrQkFBYSxHQUFiLGNBQWtCLE9BQU8sSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUM7SUFDOUMsY0FBQztBQUFELENBQUMsQUFuQkQsSUFtQkMifQ==