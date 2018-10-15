"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var platform_browser_1 = require("@angular/platform-browser");
var platform_browser_dynamic_1 = require("@angular/platform-browser-dynamic");
var KeyEventsApp = /** @class */ (function () {
    function KeyEventsApp() {
        this.lastKey = '(none)';
        this.shiftEnter = false;
    }
    KeyEventsApp_1 = KeyEventsApp;
    KeyEventsApp.prototype.onKeyDown = function (event) {
        this.lastKey = KeyEventsApp_1._getEventFullKey(event);
        event.preventDefault();
    };
    KeyEventsApp.prototype.onShiftEnter = function (event) {
        this.shiftEnter = true;
        event.preventDefault();
    };
    KeyEventsApp.prototype.resetShiftEnter = function () { this.shiftEnter = false; };
    /**
     * Get a more readable version of current pressed keys.
     * @see KeyEventsPlugin.getEventFullKey
     */
    KeyEventsApp._getEventFullKey = function (event) {
        var modifierKeys = ['alt', 'control', 'meta', 'shift'];
        var modifierKeyGetters = {
            'alt': function (event) { return event.altKey; },
            'control': function (event) { return event.ctrlKey; },
            'meta': function (event) { return event.metaKey; },
            'shift': function (event) { return event.shiftKey; }
        };
        var fullKey = '';
        var key = event.key.toLowerCase();
        if (key === ' ') {
            key = 'space'; // for readability
        }
        else if (key === '.') {
            key = 'dot'; // because '.' is used as a separator in event names
        }
        modifierKeys.forEach(function (modifierName) {
            if (modifierName != key) {
                var modifierGetter = modifierKeyGetters[modifierName];
                if (modifierGetter(event)) {
                    fullKey += modifierName + '.';
                }
            }
        });
        return fullKey + key;
    };
    var KeyEventsApp_1;
    KeyEventsApp = KeyEventsApp_1 = __decorate([
        core_1.Component({
            selector: 'key-events-app',
            template: "Click in the following area and press a key to display its name:<br>\n  <div (keydown)=\"onKeyDown($event)\" class=\"sample-area\" tabindex=\"0\">{{lastKey}}</div><br>\n  Click in the following area and press shift.enter:<br>\n  <div\n    (keydown.shift.enter)=\"onShiftEnter($event)\"\n    (click)=\"resetShiftEnter()\"\n    class=\"sample-area\"\n    tabindex=\"0\"\n  >{{shiftEnter ? 'You pressed shift.enter!' : ''}}</div>"
        })
    ], KeyEventsApp);
    return KeyEventsApp;
}());
var ExampleModule = /** @class */ (function () {
    function ExampleModule() {
    }
    ExampleModule = __decorate([
        core_1.NgModule({ declarations: [KeyEventsApp], bootstrap: [KeyEventsApp], imports: [platform_browser_1.BrowserModule] })
    ], ExampleModule);
    return ExampleModule;
}());
function main() {
    platform_browser_dynamic_1.platformBrowserDynamic().bootstrapModule(ExampleModule);
}
exports.main = main;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9tb2R1bGVzL3BsYXlncm91bmQvc3JjL2tleV9ldmVudHMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRzs7Ozs7Ozs7QUFFSCxzQ0FBa0Q7QUFDbEQsOERBQXdEO0FBQ3hELDhFQUF5RTtBQWN6RTtJQVpBO1FBYUUsWUFBTyxHQUFXLFFBQVEsQ0FBQztRQUMzQixlQUFVLEdBQVksS0FBSyxDQUFDO0lBNEM5QixDQUFDO3FCQTlDSyxZQUFZO0lBSWhCLGdDQUFTLEdBQVQsVUFBVSxLQUFvQjtRQUM1QixJQUFJLENBQUMsT0FBTyxHQUFHLGNBQVksQ0FBQyxnQkFBZ0IsQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUNwRCxLQUFLLENBQUMsY0FBYyxFQUFFLENBQUM7SUFDekIsQ0FBQztJQUVELG1DQUFZLEdBQVosVUFBYSxLQUFvQjtRQUMvQixJQUFJLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQztRQUN2QixLQUFLLENBQUMsY0FBYyxFQUFFLENBQUM7SUFDekIsQ0FBQztJQUVELHNDQUFlLEdBQWYsY0FBMEIsSUFBSSxDQUFDLFVBQVUsR0FBRyxLQUFLLENBQUMsQ0FBQyxDQUFDO0lBRXBEOzs7T0FHRztJQUNZLDZCQUFnQixHQUEvQixVQUFnQyxLQUFvQjtRQUNsRCxJQUFNLFlBQVksR0FBRyxDQUFDLEtBQUssRUFBRSxTQUFTLEVBQUUsTUFBTSxFQUFFLE9BQU8sQ0FBQyxDQUFDO1FBQ3pELElBQU0sa0JBQWtCLEdBQXVEO1lBQzdFLEtBQUssRUFBRSxVQUFDLEtBQW9CLElBQUssT0FBQSxLQUFLLENBQUMsTUFBTSxFQUFaLENBQVk7WUFDN0MsU0FBUyxFQUFFLFVBQUMsS0FBb0IsSUFBSyxPQUFBLEtBQUssQ0FBQyxPQUFPLEVBQWIsQ0FBYTtZQUNsRCxNQUFNLEVBQUUsVUFBQyxLQUFvQixJQUFLLE9BQUEsS0FBSyxDQUFDLE9BQU8sRUFBYixDQUFhO1lBQy9DLE9BQU8sRUFBRSxVQUFDLEtBQW9CLElBQUssT0FBQSxLQUFLLENBQUMsUUFBUSxFQUFkLENBQWM7U0FDbEQsQ0FBQztRQUVGLElBQUksT0FBTyxHQUFHLEVBQUUsQ0FBQztRQUNqQixJQUFJLEdBQUcsR0FBRyxLQUFLLENBQUMsR0FBRyxDQUFDLFdBQVcsRUFBRSxDQUFDO1FBQ2xDLElBQUksR0FBRyxLQUFLLEdBQUcsRUFBRTtZQUNmLEdBQUcsR0FBRyxPQUFPLENBQUMsQ0FBRSxrQkFBa0I7U0FDbkM7YUFBTSxJQUFJLEdBQUcsS0FBSyxHQUFHLEVBQUU7WUFDdEIsR0FBRyxHQUFHLEtBQUssQ0FBQyxDQUFFLG9EQUFvRDtTQUNuRTtRQUNELFlBQVksQ0FBQyxPQUFPLENBQUMsVUFBQSxZQUFZO1lBQy9CLElBQUksWUFBWSxJQUFJLEdBQUcsRUFBRTtnQkFDdkIsSUFBTSxjQUFjLEdBQUcsa0JBQWtCLENBQUMsWUFBWSxDQUFDLENBQUM7Z0JBQ3hELElBQUksY0FBYyxDQUFDLEtBQUssQ0FBQyxFQUFFO29CQUN6QixPQUFPLElBQUksWUFBWSxHQUFHLEdBQUcsQ0FBQztpQkFDL0I7YUFDRjtRQUNILENBQUMsQ0FBQyxDQUFDO1FBQ0gsT0FBTyxPQUFPLEdBQUcsR0FBRyxDQUFDO0lBQ3ZCLENBQUM7O0lBN0NHLFlBQVk7UUFaakIsZ0JBQVMsQ0FBQztZQUNULFFBQVEsRUFBRSxnQkFBZ0I7WUFDMUIsUUFBUSxFQUFFLDRhQVE4QztTQUN6RCxDQUFDO09BQ0ksWUFBWSxDQThDakI7SUFBRCxtQkFBQztDQUFBLEFBOUNELElBOENDO0FBR0Q7SUFBQTtJQUNBLENBQUM7SUFESyxhQUFhO1FBRGxCLGVBQVEsQ0FBQyxFQUFDLFlBQVksRUFBRSxDQUFDLFlBQVksQ0FBQyxFQUFFLFNBQVMsRUFBRSxDQUFDLFlBQVksQ0FBQyxFQUFFLE9BQU8sRUFBRSxDQUFDLGdDQUFhLENBQUMsRUFBQyxDQUFDO09BQ3hGLGFBQWEsQ0FDbEI7SUFBRCxvQkFBQztDQUFBLEFBREQsSUFDQztBQUVEO0lBQ0UsaURBQXNCLEVBQUUsQ0FBQyxlQUFlLENBQUMsYUFBYSxDQUFDLENBQUM7QUFDMUQsQ0FBQztBQUZELG9CQUVDIn0=