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
var animations_1 = require("@angular/animations");
var core_1 = require("@angular/core");
var AnimateApp = /** @class */ (function () {
    function AnimateApp() {
        this.items = [];
        this.bgStatus = 'focus';
    }
    AnimateApp.prototype.remove = function (item) {
        var index = this.items.indexOf(item);
        if (index >= 0) {
            this.items.splice(index, 1);
        }
    };
    AnimateApp.prototype.reorderAndRemove = function () {
        this.items = this.items.sort(function (a, b) { return Math.random() - 0.5; });
        this.items.splice(Math.floor(Math.random() * this.items.length), 1);
        this.items.splice(Math.floor(Math.random() * this.items.length), 1);
        this.items[Math.floor(Math.random() * this.items.length)] = 99;
    };
    AnimateApp.prototype.bgStatusChanged = function (data, phase) {
        alert("backgroundAnimation has " + phase + " from " + data['fromState'] + " to " + data['toState']);
    };
    Object.defineProperty(AnimateApp.prototype, "state", {
        get: function () { return this._state; },
        set: function (s) {
            this._state = s;
            if (s == 'void') {
                this.items = [];
            }
            else {
                this.items = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20];
            }
        },
        enumerable: true,
        configurable: true
    });
    AnimateApp = __decorate([
        core_1.Component({
            host: {
                '[@backgroundAnimation]': 'bgStatus',
                '(@backgroundAnimation.start)': 'bgStatusChanged($event, "started")',
                '(@backgroundAnimation.done)': 'bgStatusChanged($event, "completed")'
            },
            selector: 'animate-app',
            styleUrls: ['css/animate-app.css'],
            template: "\n    <button (click)=\"state='start'\">Start State</button>\n    <button (click)=\"state='active'\">Active State</button>\n    |\n    <button (click)=\"state='void'\">Void State</button>\n    <button (click)=\"reorderAndRemove()\">Scramble!</button>\n    <button (click)=\"state='default'\">Unhandled (default) State</button>\n    <button style=\"float:right\" (click)=\"bgStatus='blur'\">Blur Page (Host)</button>\n    <hr />\n    <div *ngFor=\"let item of items; let i=index\" class=\"box\" [@boxAnimation]=\"state\">\n      {{ item }} - {{ i }}\n      <button (click)=\"remove(item)\">x</button>\n    </div>\n  ",
            animations: [
                animations_1.trigger('backgroundAnimation', [
                    animations_1.state('focus', animations_1.style({ 'background-color': 'white' })),
                    animations_1.state('blur', animations_1.style({ 'background-color': 'grey' })),
                    animations_1.transition('* => *', [
                        animations_1.animate(500)
                    ])
                ]),
                animations_1.trigger('boxAnimation', [
                    animations_1.state('*', animations_1.style({ 'height': '*', 'background-color': '#dddddd', 'color': 'black' })),
                    animations_1.state('void, hidden', animations_1.style({ 'height': 0, 'opacity': 0 })),
                    animations_1.state('start', animations_1.style({ 'background-color': 'red', 'height': '*' })),
                    animations_1.state('active', animations_1.style({ 'background-color': 'orange', 'color': 'white', 'font-size': '100px' })),
                    animations_1.transition('active <=> start', [
                        animations_1.animate(500, animations_1.style({ 'transform': 'scale(2)' })),
                        animations_1.animate(500)
                    ]),
                    animations_1.transition('* => *', [
                        animations_1.animate(1000, animations_1.style({ 'opacity': 1, 'height': 300 })),
                        animations_1.animate(1000, animations_1.style({ 'background-color': 'blue' })),
                        animations_1.animate(1000, animations_1.keyframes([
                            animations_1.style({ 'background-color': 'blue', 'color': 'black', 'offset': 0.2 }),
                            animations_1.style({ 'background-color': 'brown', 'color': 'black', 'offset': 0.5 }),
                            animations_1.style({ 'background-color': 'black', 'color': 'white', 'offset': 1 })
                        ])),
                        animations_1.animate(2000)
                    ])
                ])
            ]
        })
    ], AnimateApp);
    return AnimateApp;
}());
exports.AnimateApp = AnimateApp;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYW5pbWF0ZS1hcHAuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9tb2R1bGVzL3BsYXlncm91bmQvc3JjL2FuaW1hdGUvYXBwL2FuaW1hdGUtYXBwLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7Ozs7Ozs7O0FBRUgsa0RBQTBGO0FBQzFGLHNDQUF3QztBQXdEeEM7SUF0REE7UUF1RFMsVUFBSyxHQUFhLEVBQUUsQ0FBQztRQUdyQixhQUFRLEdBQUcsT0FBTyxDQUFDO0lBNkI1QixDQUFDO0lBM0JDLDJCQUFNLEdBQU4sVUFBTyxJQUFZO1FBQ2pCLElBQU0sS0FBSyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ3ZDLElBQUksS0FBSyxJQUFJLENBQUMsRUFBRTtZQUNkLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUMsQ0FBQztTQUM3QjtJQUNILENBQUM7SUFFRCxxQ0FBZ0IsR0FBaEI7UUFDRSxJQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLFVBQUMsQ0FBQyxFQUFFLENBQUMsSUFBSyxPQUFBLElBQUksQ0FBQyxNQUFNLEVBQUUsR0FBRyxHQUFHLEVBQW5CLENBQW1CLENBQUMsQ0FBQztRQUM1RCxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO1FBQ3BFLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7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