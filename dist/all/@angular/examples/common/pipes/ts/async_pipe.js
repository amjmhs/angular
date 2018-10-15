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
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var rxjs_1 = require("rxjs");
// #docregion AsyncPipePromise
var AsyncPromisePipeComponent = /** @class */ (function () {
    function AsyncPromisePipeComponent() {
        this.greeting = null;
        this.arrived = false;
        this.resolve = null;
        this.reset();
    }
    AsyncPromisePipeComponent.prototype.reset = function () {
        var _this = this;
        this.arrived = false;
        this.greeting = new Promise(function (resolve, reject) { _this.resolve = resolve; });
    };
    AsyncPromisePipeComponent.prototype.clicked = function () {
        if (this.arrived) {
            this.reset();
        }
        else {
            this.resolve('hi there!');
            this.arrived = true;
        }
    };
    AsyncPromisePipeComponent = __decorate([
        core_1.Component({
            selector: 'async-promise-pipe',
            template: "<div>\n    <code>promise|async</code>: \n    <button (click)=\"clicked()\">{{ arrived ? 'Reset' : 'Resolve' }}</button>\n    <span>Wait for it... {{ greeting | async }}</span>\n  </div>"
        }),
        __metadata("design:paramtypes", [])
    ], AsyncPromisePipeComponent);
    return AsyncPromisePipeComponent;
}());
exports.AsyncPromisePipeComponent = AsyncPromisePipeComponent;
// #enddocregion
// #docregion AsyncPipeObservable
var AsyncObservablePipeComponent = /** @class */ (function () {
    function AsyncObservablePipeComponent() {
        this.time = new rxjs_1.Observable(function (observer) {
            setInterval(function () { return observer.next(new Date().toString()); }, 1000);
        });
    }
    AsyncObservablePipeComponent = __decorate([
        core_1.Component({
            selector: 'async-observable-pipe',
            template: '<div><code>observable|async</code>: Time: {{ time | async }}</div>'
        })
    ], AsyncObservablePipeComponent);
    return AsyncObservablePipeComponent;
}());
exports.AsyncObservablePipeComponent = AsyncObservablePipeComponent;
// #enddocregion
// For some reason protractor hangs on setInterval. So we will run outside of angular zone so that
// protractor will not see us. Also we want to have this outside the docregion so as not to confuse
// the reader.
function setInterval(fn, delay) {
    var zone = Zone.current;
    var rootZone = zone;
    while (rootZone.parent) {
        rootZone = rootZone.parent;
    }
    rootZone.run(function () { window.setInterval(function () { zone.run(fn, this, arguments); }, delay); });
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXN5bmNfcGlwZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2V4YW1wbGVzL2NvbW1vbi9waXBlcy90cy9hc3luY19waXBlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7Ozs7Ozs7Ozs7O0FBRUgsc0NBQXdDO0FBQ3hDLDZCQUEwQztBQUUxQyw4QkFBOEI7QUFTOUI7SUFNRTtRQUxBLGFBQVEsR0FBeUIsSUFBSSxDQUFDO1FBQ3RDLFlBQU8sR0FBWSxLQUFLLENBQUM7UUFFakIsWUFBTyxHQUFrQixJQUFJLENBQUM7UUFFdEIsSUFBSSxDQUFDLEtBQUssRUFBRSxDQUFDO0lBQUMsQ0FBQztJQUUvQix5Q0FBSyxHQUFMO1FBQUEsaUJBR0M7UUFGQyxJQUFJLENBQUMsT0FBTyxHQUFHLEtBQUssQ0FBQztRQUNyQixJQUFJLENBQUMsUUFBUSxHQUFHLElBQUksT0FBTyxDQUFTLFVBQUMsT0FBTyxFQUFFLE1BQU0sSUFBTyxLQUFJLENBQUMsT0FBTyxHQUFHLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ3hGLENBQUM7SUFFRCwyQ0FBTyxHQUFQO1FBQ0UsSUFBSSxJQUFJLENBQUMsT0FBTyxFQUFFO1lBQ2hCLElBQUksQ0FBQyxLQUFLLEVBQUUsQ0FBQztTQUNkO2FBQU07WUFDTCxJQUFJLENBQUMsT0FBUyxDQUFDLFdBQVcsQ0FBQyxDQUFDO1lBQzVCLElBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDO1NBQ3JCO0lBQ0gsQ0FBQztJQXBCVSx5QkFBeUI7UUFSckMsZ0JBQVMsQ0FBQztZQUNULFFBQVEsRUFBRSxvQkFBb0I7WUFDOUIsUUFBUSxFQUFFLDJMQUlIO1NBQ1IsQ0FBQzs7T0FDVyx5QkFBeUIsQ0FxQnJDO0lBQUQsZ0NBQUM7Q0FBQSxBQXJCRCxJQXFCQztBQXJCWSw4REFBeUI7QUFzQnRDLGdCQUFnQjtBQUVoQixpQ0FBaUM7QUFLakM7SUFKQTtRQUtFLFNBQUksR0FBRyxJQUFJLGlCQUFVLENBQVMsVUFBQyxRQUEwQjtZQUN2RCxXQUFXLENBQUMsY0FBTSxPQUFBLFFBQVEsQ0FBQyxJQUFJLENBQUMsSUFBSSxJQUFJLEVBQUUsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxFQUFwQyxDQUFvQyxFQUFFLElBQUksQ0FBQyxDQUFDO1FBQ2hFLENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztJQUpZLDRCQUE0QjtRQUp4QyxnQkFBUyxDQUFDO1lBQ1QsUUFBUSxFQUFFLHVCQUF1QjtZQUNqQyxRQUFRLEVBQUUsb0VBQW9FO1NBQy9FLENBQUM7T0FDVyw0QkFBNEIsQ0FJeEM7SUFBRCxtQ0FBQztDQUFBLEFBSkQsSUFJQztBQUpZLG9FQUE0QjtBQUt6QyxnQkFBZ0I7QUFFaEIsa0dBQWtHO0FBQ2xHLG1HQUFtRztBQUNuRyxjQUFjO0FBQ2QscUJBQXFCLEVBQVksRUFBRSxLQUFhO0lBQzlDLElBQU0sSUFBSSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUM7SUFDMUIsSUFBSSxRQUFRLEdBQUcsSUFBSSxDQUFDO0lBQ3BCLE9BQU8sUUFBUSxDQUFDLE1BQU0sRUFBRTtRQUN0QixRQUFRLEdBQUcsUUFBUSxDQUFDLE1BQU0sQ0FBQztLQUM1QjtJQUNELFFBQVEsQ0FBQyxHQUFHLENBQ1IsY0FBUSxNQUFNLENBQUMsV0FBVyxDQUFDLGNBQWEsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLEVBQUUsSUFBSSxFQUFFLFNBQWdCLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ2xHLENBQUMifQ==