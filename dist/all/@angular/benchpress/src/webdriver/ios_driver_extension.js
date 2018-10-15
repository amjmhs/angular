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
var IOsDriverExtension = /** @class */ (function (_super) {
    __extends(IOsDriverExtension, _super);
    function IOsDriverExtension(_driver) {
        var _this = _super.call(this) || this;
        _this._driver = _driver;
        return _this;
    }
    IOsDriverExtension_1 = IOsDriverExtension;
    IOsDriverExtension.prototype.gc = function () { throw new Error('Force GC is not supported on iOS'); };
    IOsDriverExtension.prototype.timeBegin = function (name) {
        return this._driver.executeScript("console.time('" + name + "');");
    };
    IOsDriverExtension.prototype.timeEnd = function (name, restartName) {
        if (restartName === void 0) { restartName = null; }
        var script = "console.timeEnd('" + name + "');";
        if (restartName != null) {
            script += "console.time('" + restartName + "');";
        }
        return this._driver.executeScript(script);
    };
    // See https://github.com/WebKit/webkit/tree/master/Source/WebInspectorUI/Versions
    IOsDriverExtension.prototype.readPerfLog = function () {
        var _this = this;
        // TODO(tbosch): Bug in IOsDriver: Need to execute at least one command
        // so that the browser logs can be read out!
        return this._driver.executeScript('1+1')
            .then(function (_) { return _this._driver.logs('performance'); })
            .then(function (entries) {
            var records = [];
            entries.forEach(function (entry) {
                var message = JSON.parse(entry['message'])['message'];
                if (message['method'] === 'Timeline.eventRecorded') {
                    records.push(message['params']['record']);
                }
            });
            return _this._convertPerfRecordsToEvents(records);
        });
    };
    /** @internal */
    IOsDriverExtension.prototype._convertPerfRecordsToEvents = function (records, events) {
        var _this = this;
        if (events === void 0) { events = null; }
        if (!events) {
            events = [];
        }
        records.forEach(function (record) {
            var endEvent = null;
            var type = record['type'];
            var data = record['data'];
            var startTime = record['startTime'];
            var endTime = record['endTime'];
            if (type === 'FunctionCall' && (data == null || data['scriptName'] !== 'InjectedScript')) {
                events.push(createStartEvent('script', startTime));
                endEvent = createEndEvent('script', endTime);
            }
            else if (type === 'Time') {
                events.push(createMarkStartEvent(data['message'], startTime));
            }
            else if (type === 'TimeEnd') {
                events.push(createMarkEndEvent(data['message'], startTime));
            }
            else if (type === 'RecalculateStyles' || type === 'Layout' || type === 'UpdateLayerTree' ||
                type === 'Paint' || type === 'Rasterize' || type === 'CompositeLayers') {
                events.push(createStartEvent('render', startTime));
                endEvent = createEndEvent('render', endTime);
            }
            // Note: ios used to support GCEvent up until iOS 6 :-(
            if (record['children'] != null) {
                _this._convertPerfRecordsToEvents(record['children'], events);
            }
            if (endEvent != null) {
                events.push(endEvent);
            }
        });
        return events;
    };
    IOsDriverExtension.prototype.perfLogFeatures = function () { return new web_driver_extension_1.PerfLogFeatures({ render: true }); };
    IOsDriverExtension.prototype.supports = function (capabilities) {
        return capabilities['browserName'].toLowerCase() === 'safari';
    };
    var IOsDriverExtension_1;
    IOsDriverExtension.PROVIDERS = [{ provide: IOsDriverExtension_1, deps: [web_driver_adapter_1.WebDriverAdapter] }];
    IOsDriverExtension = IOsDriverExtension_1 = __decorate([
        core_1.Injectable(),
        __metadata("design:paramtypes", [web_driver_adapter_1.WebDriverAdapter])
    ], IOsDriverExtension);
    return IOsDriverExtension;
}(web_driver_extension_1.WebDriverExtension));
exports.IOsDriverExtension = IOsDriverExtension;
function createEvent(ph, name, time, args) {
    if (args === void 0) { args = null; }
    var result = {
        'cat': 'timeline',
        'name': name,
        'ts': time,
        'ph': ph,
        // The ios protocol does not support the notions of multiple processes in
        // the perflog...
        'pid': 'pid0'
    };
    if (args != null) {
        result['args'] = args;
    }
    return result;
}
function createStartEvent(name, time, args) {
    if (args === void 0) { args = null; }
    return createEvent('B', name, time, args);
}
function createEndEvent(name, time, args) {
    if (args === void 0) { args = null; }
    return createEvent('E', name, time, args);
}
function createMarkStartEvent(name, time) {
    return createEvent('B', name, time);
}
function createMarkEndEvent(name, time) {
    return createEvent('E', name, time);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW9zX2RyaXZlcl9leHRlbnNpb24uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9iZW5jaHByZXNzL3NyYy93ZWJkcml2ZXIvaW9zX2RyaXZlcl9leHRlbnNpb24udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBRUgsc0NBQXlDO0FBRXpDLDREQUF1RDtBQUN2RCxnRUFBMEY7QUFHMUY7SUFBd0Msc0NBQWtCO0lBR3hELDRCQUFvQixPQUF5QjtRQUE3QyxZQUFpRCxpQkFBTyxTQUFHO1FBQXZDLGFBQU8sR0FBUCxPQUFPLENBQWtCOztJQUFhLENBQUM7MkJBSGhELGtCQUFrQjtJQUs3QiwrQkFBRSxHQUFGLGNBQXFCLE1BQU0sSUFBSSxLQUFLLENBQUMsa0NBQWtDLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFFM0Usc0NBQVMsR0FBVCxVQUFVLElBQVk7UUFDcEIsT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDLGFBQWEsQ0FBQyxtQkFBaUIsSUFBSSxRQUFLLENBQUMsQ0FBQztJQUNoRSxDQUFDO0lBRUQsb0NBQU8sR0FBUCxVQUFRLElBQVksRUFBRSxXQUErQjtRQUEvQiw0QkFBQSxFQUFBLGtCQUErQjtRQUNuRCxJQUFJLE1BQU0sR0FBRyxzQkFBb0IsSUFBSSxRQUFLLENBQUM7UUFDM0MsSUFBSSxXQUFXLElBQUksSUFBSSxFQUFFO1lBQ3ZCLE1BQU0sSUFBSSxtQkFBaUIsV0FBVyxRQUFLLENBQUM7U0FDN0M7UUFDRCxPQUFPLElBQUksQ0FBQyxPQUFPLENBQUMsYUFBYSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBQzVDLENBQUM7SUFFRCxrRkFBa0Y7SUFDbEYsd0NBQVcsR0FBWDtRQUFBLGlCQWVDO1FBZEMsdUVBQXVFO1FBQ3ZFLDRDQUE0QztRQUM1QyxPQUFPLElBQUksQ0FBQyxPQUFPLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQzth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