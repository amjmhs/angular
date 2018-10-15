"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
var dom_adapter_1 = require("../../dom/dom_adapter");
/**
 * Predicates for use with {@link DebugElement}'s query functions.
 *
 * @experimental All debugging apis are currently experimental.
 */
var By = /** @class */ (function () {
    function By() {
    }
    /**
     * Match all elements.
     *
     * @usageNotes
     * ### Example
     *
     * {@example platform-browser/dom/debug/ts/by/by.ts region='by_all'}
     */
    By.all = function () { return function (debugElement) { return true; }; };
    /**
     * Match elements by the given CSS selector.
     *
     * @usageNotes
     * ### Example
     *
     * {@example platform-browser/dom/debug/ts/by/by.ts region='by_css'}
     */
    By.css = function (selector) {
        return function (debugElement) {
            return debugElement.nativeElement != null ?
                dom_adapter_1.getDOM().elementMatches(debugElement.nativeElement, selector) :
                false;
        };
    };
    /**
     * Match elements that have the given directive present.
     *
     * @usageNotes
     * ### Example
     *
     * {@example platform-browser/dom/debug/ts/by/by.ts region='by_directive'}
     */
    By.directive = function (type) {
        return function (debugElement) { return debugElement.providerTokens.indexOf(type) !== -1; };
    };
    return By;
}());
exports.By = By;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnkuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9wbGF0Zm9ybS1icm93c2VyL3NyYy9kb20vZGVidWcvYnkudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRzs7QUFHSCxxREFBNkM7QUFJN0M7Ozs7R0FJRztBQUNIO0lBQUE7SUFzQ0EsQ0FBQztJQXJDQzs7Ozs7OztPQU9HO0lBQ0ksTUFBRyxHQUFWLGNBQXdDLE9BQU8sVUFBQyxZQUFZLElBQUssT0FBQSxJQUFJLEVBQUosQ0FBSSxDQUFDLENBQUMsQ0FBQztJQUV4RTs7Ozs7OztPQU9HO0lBQ0ksTUFBRyxHQUFWLFVBQVcsUUFBZ0I7UUFDekIsT0FBTyxVQUFDLFlBQVk7WUFDbEIsT0FBTyxZQUFZLENBQUMsYUFBYSxJQUFJLElBQUksQ0FBQyxDQUFDO2dCQUN2QyxvQkFBTSxFQUFFLENBQUMsY0FBYyxDQUFDLFlBQVksQ0FBQyxhQUFhLEVBQUUsUUFBUSxDQUFDLENBQUMsQ0FBQztnQkFDL0QsS0FBSyxDQUFDO1FBQ1osQ0FBQyxDQUFDO0lBQ0osQ0FBQztJQUVEOzs7Ozs7O09BT0c7SUFDSSxZQUFTLEdBQWhCLFVBQWlCLElBQWU7UUFDOUIsT0FBTyxVQUFDLFlBQVksSUFBSyxPQUFBLFlBQVksQ0FBQyxjQUFnQixDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBbEQsQ0FBa0QsQ0FBQztJQUM5RSxDQUFDO0lBQ0gsU0FBQztBQUFELENBQUMsQUF0Q0QsSUFzQ0M7QUF0Q1ksZ0JBQUUifQ==