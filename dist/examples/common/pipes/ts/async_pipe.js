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
const core_1 = require("@angular/core");
const rxjs_1 = require("rxjs");
// #docregion AsyncPipePromise
let AsyncPromisePipeComponent = class AsyncPromisePipeComponent {
    constructor() {
        this.greeting = null;
        this.arrived = false;
        this.resolve = null;
        this.reset();
    }
    reset() {
        this.arrived = false;
        this.greeting = new Promise((resolve, reject) => { this.resolve = resolve; });
    }
    clicked() {
        if (this.arrived) {
            this.reset();
        }
        else {
            this.resolve('hi there!');
            this.arrived = true;
        }
    }
};
AsyncPromisePipeComponent = __decorate([
    core_1.Component({
        selector: 'async-promise-pipe',
        template: `<div>
    <code>promise|async</code>: 
    <button (click)="clicked()">{{ arrived ? 'Reset' : 'Resolve' }}</button>
    <span>Wait for it... {{ greeting | async }}</span>
  </div>`
    }),
    __metadata("design:paramtypes", [])
], AsyncPromisePipeComponent);
exports.AsyncPromisePipeComponent = AsyncPromisePipeComponent;
// #enddocregion
// #docregion AsyncPipeObservable
let AsyncObservablePipeComponent = class AsyncObservablePipeComponent {
    // #enddocregion
    // #docregion AsyncPipeObservable
    constructor() {
        this.time = new rxjs_1.Observable((observer) => {
            setInterval(() => observer.next(new Date().toString()), 1000);
        });
    }
};
AsyncObservablePipeComponent = __decorate([
    core_1.Component({
        selector: 'async-observable-pipe',
        template: '<div><code>observable|async</code>: Time: {{ time | async }}</div>'
    })
], AsyncObservablePipeComponent);
exports.AsyncObservablePipeComponent = AsyncObservablePipeComponent;
// #enddocregion
// For some reason protractor hangs on setInterval. So we will run outside of angular zone so that
// protractor will not see us. Also we want to have this outside the docregion so as not to confuse
// the reader.
function setInterval(fn, delay) {
    const zone = Zone.current;
    let rootZone = zone;
    while (rootZone.parent) {
        rootZone = rootZone.parent;
    }
    rootZone.run(() => { window.setInterval(function () { zone.run(fn, this, arguments); }, delay); });
}
//# sourceMappingURL=async_pipe.js.map