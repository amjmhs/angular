"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
var animations_1 = require("@angular/animations");
var core_1 = require("@angular/core");
var shared_1 = require("./shared");
/**
 * @experimental
 */
var NoopAnimationDriver = /** @class */ (function () {
    function NoopAnimationDriver() {
    }
    NoopAnimationDriver.prototype.validateStyleProperty = function (prop) { return shared_1.validateStyleProperty(prop); };
    NoopAnimationDriver.prototype.matchesElement = function (element, selector) {
        return shared_1.matchesElement(element, selector);
    };
    NoopAnimationDriver.prototype.containsElement = function (elm1, elm2) { return shared_1.containsElement(elm1, elm2); };
    NoopAnimationDriver.prototype.query = function (element, selector, multi) {
        return shared_1.invokeQuery(element, selector, multi);
    };
    NoopAnimationDriver.prototype.computeStyle = function (element, prop, defaultValue) {
        return defaultValue || '';
    };
    NoopAnimationDriver.prototype.animate = function (element, keyframes, duration, delay, easing, previousPlayers, scrubberAccessRequested) {
        if (previousPlayers === void 0) { previousPlayers = []; }
        return new animations_1.NoopAnimationPlayer(duration, delay);
    };
    NoopAnimationDriver = __decorate([
        core_1.Injectable()
    ], NoopAnimationDriver);
    return NoopAnimationDriver;
}());
exports.NoopAnimationDriver = NoopAnimationDriver;
/**
 * @experimental
 */
var AnimationDriver = /** @class */ (function () {
    function AnimationDriver() {
    }
    AnimationDriver.NOOP = new NoopAnimationDriver();
    return AnimationDriver;
}());
exports.AnimationDriver = AnimationDriver;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYW5pbWF0aW9uX2RyaXZlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2FuaW1hdGlvbnMvYnJvd3Nlci9zcmMvcmVuZGVyL2FuaW1hdGlvbl9kcml2ZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7QUFBQTs7Ozs7O0dBTUc7QUFDSCxrREFBeUU7QUFDekUsc0NBQXlDO0FBRXpDLG1DQUE2RjtBQUU3Rjs7R0FFRztBQUVIO0lBQUE7SUF1QkEsQ0FBQztJQXRCQyxtREFBcUIsR0FBckIsVUFBc0IsSUFBWSxJQUFhLE9BQU8sOEJBQXFCLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBRXBGLDRDQUFjLEdBQWQsVUFBZSxPQUFZLEVBQUUsUUFBZ0I7UUFDM0MsT0FBTyx1QkFBYyxDQUFDLE9BQU8sRUFBRSxRQUFRLENBQUMsQ0FBQztJQUMzQyxDQUFDO0lBRUQsNkNBQWUsR0FBZixVQUFnQixJQUFTLEVBQUUsSUFBUyxJQUFhLE9BQU8sd0JBQWUsQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBRXRGLG1DQUFLLEdBQUwsVUFBTSxPQUFZLEVBQUUsUUFBZ0IsRUFBRSxLQUFjO1FBQ2xELE9BQU8sb0JBQVcsQ0FBQyxPQUFPLEVBQUUsUUFBUSxFQUFFLEtBQUssQ0FBQyxDQUFDO0lBQy9DLENBQUM7SUFFRCwwQ0FBWSxHQUFaLFVBQWEsT0FBWSxFQUFFLElBQVksRUFBRSxZQUFxQjtRQUM1RCxPQUFPLFlBQVksSUFBSSxFQUFFLENBQUM7SUFDNUIsQ0FBQztJQUVELHFDQUFPLEdBQVAsVUFDSSxPQUFZLEVBQUUsU0FBNkMsRUFBRSxRQUFnQixFQUFFLEtBQWEsRUFDNUYsTUFBYyxFQUFFLGVBQTJCLEVBQzNDLHVCQUFpQztRQURqQixnQ0FBQSxFQUFBLG9CQUEyQjtRQUU3QyxPQUFPLElBQUksZ0NBQW1CLENBQUMsUUFBUSxFQUFFLEtBQUssQ0FBQyxDQUFDO0lBQ2xELENBQUM7SUF0QlUsbUJBQW1CO1FBRC9CLGlCQUFVLEVBQUU7T0FDQSxtQkFBbUIsQ0F1Qi9CO0lBQUQsMEJBQUM7Q0FBQSxBQXZCRCxJQXVCQztBQXZCWSxrREFBbUI7QUF5QmhDOztHQUVHO0FBQ0g7SUFBQTtJQWdCQSxDQUFDO0lBZlEsb0JBQUksR0FBb0IsSUFBSSxtQkFBbUIsRUFBRSxDQUFDO0lBZTNELHNCQUFDO0NBQUEsQUFoQkQsSUFnQkM7QUFoQnFCLDBDQUFlIn0=