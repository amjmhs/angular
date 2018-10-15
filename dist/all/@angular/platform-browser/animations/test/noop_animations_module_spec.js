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
var browser_1 = require("@angular/animations/browser");
var core_1 = require("@angular/core");
var testing_1 = require("@angular/core/testing");
var module_1 = require("../src/module");
{
    describe('NoopAnimationsModule', function () {
        beforeEach(function () { testing_1.TestBed.configureTestingModule({ imports: [module_1.NoopAnimationsModule] }); });
        it('should flush and fire callbacks when the zone becomes stable', function (async) {
            var Cmp = /** @class */ (function () {
                function Cmp() {
                }
                Cmp.prototype.onStart = function (event) { this.startEvent = event; };
                Cmp.prototype.onDone = function (event) { this.doneEvent = event; };
                Cmp = __decorate([
                    core_1.Component({
                        selector: 'my-cmp',
                        template: '<div [@myAnimation]="exp" (@myAnimation.start)="onStart($event)" (@myAnimation.done)="onDone($event)"></div>',
                        animations: [animations_1.trigger('myAnimation', [animations_1.transition('* => state', [animations_1.style({ 'opacity': '0' }), animations_1.animate(500, animations_1.style({ 'opacity': '1' }))])])],
                    })
                ], Cmp);
                return Cmp;
            }());
            testing_1.TestBed.configureTestingModule({ declarations: [Cmp] });
            var fixture = testing_1.TestBed.createComponent(Cmp);
            var cmp = fixture.componentInstance;
            cmp.exp = 'state';
            fixture.detectChanges();
            fixture.whenStable().then(function () {
                expect(cmp.startEvent.triggerName).toEqual('myAnimation');
                expect(cmp.startEvent.phaseName).toEqual('start');
                expect(cmp.doneEvent.triggerName).toEqual('myAnimation');
                expect(cmp.doneEvent.phaseName).toEqual('done');
                async();
            });
        });
        it('should handle leave animation callbacks even if the element is destroyed in the process', function (async) {
            var Cmp = /** @class */ (function () {
                function Cmp() {
                }
                Cmp.prototype.onStart = function (event) { this.startEvent = event; };
                Cmp.prototype.onDone = function (event) { this.doneEvent = event; };
                Cmp = __decorate([
                    core_1.Component({
                        selector: 'my-cmp',
                        template: '<div *ngIf="exp" @myAnimation (@myAnimation.start)="onStart($event)" (@myAnimation.done)="onDone($event)"></div>',
                        animations: [animations_1.trigger('myAnimation', [animations_1.transition(':leave', [animations_1.style({ 'opacity': '0' }), animations_1.animate(500, animations_1.style({ 'opacity': '1' }))])])],
                    })
                ], Cmp);
                return Cmp;
            }());
            testing_1.TestBed.configureTestingModule({ declarations: [Cmp] });
            var engine = testing_1.TestBed.get(browser_1.ɵAnimationEngine);
            var fixture = testing_1.TestBed.createComponent(Cmp);
            var cmp = fixture.componentInstance;
            cmp.exp = true;
            fixture.detectChanges();
            fixture.whenStable().then(function () {
                cmp.startEvent = null;
                cmp.doneEvent = null;
                cmp.exp = false;
                fixture.detectChanges();
                fixture.whenStable().then(function () {
                    expect(cmp.startEvent.triggerName).toEqual('myAnimation');
                    expect(cmp.startEvent.phaseName).toEqual('start');
                    expect(cmp.startEvent.toState).toEqual('void');
                    expect(cmp.doneEvent.triggerName).toEqual('myAnimation');
                    expect(cmp.doneEvent.phaseName).toEqual('done');
                    expect(cmp.doneEvent.toState).toEqual('void');
                    async();
                });
            });
        });
    });
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibm9vcF9hbmltYXRpb25zX21vZHVsZV9zcGVjLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvcGxhdGZvcm0tYnJvd3Nlci9hbmltYXRpb25zL3Rlc3Qvbm9vcF9hbmltYXRpb25zX21vZHVsZV9zcGVjLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7O0FBQUE7Ozs7OztHQU1HO0FBQ0gsa0RBQXdFO0FBQ3hFLHVEQUE2RDtBQUM3RCxzQ0FBd0M7QUFDeEMsaURBQThDO0FBRTlDLHdDQUFtRDtBQUVuRDtJQUNFLFFBQVEsQ0FBQyxzQkFBc0IsRUFBRTtRQUMvQixVQUFVLENBQUMsY0FBUSxpQkFBTyxDQUFDLHNCQUFzQixDQUFDLEVBQUMsT0FBTyxFQUFFLENBQUMsNkJBQW9CLENBQUMsRUFBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUV6RixFQUFFLENBQUMsOERBQThELEVBQUUsVUFBQyxLQUFLO1lBVXZFO2dCQUFBO2dCQU1BLENBQUM7Z0JBRkMscUJBQU8sR0FBUCxVQUFRLEtBQVUsSUFBSSxJQUFJLENBQUMsVUFBVSxHQUFHLEtBQUssQ0FBQyxDQUFDLENBQUM7Z0JBQ2hELG9CQUFNLEdBQU4sVUFBTyxLQUFVLElBQUksSUFBSSxDQUFDLFNBQVMsR0FBRyxLQUFLLENBQUMsQ0FBQyxDQUFDO2dCQUwxQyxHQUFHO29CQVRSLGdCQUFTLENBQUM7d0JBQ1QsUUFBUSxFQUFFLFFBQVE7d0JBQ2xCLFFBQVEsRUFDSiw4R0FBOEc7d0JBQ2xILFVBQVUsRUFBRSxDQUFDLG9CQUFPLENBQ2hCLGFBQWEsRUFDYixDQUFDLHVCQUFVLENBQ1AsWUFBWSxFQUFFLENBQUMsa0JBQUssQ0FBQyxFQUFDLFNBQVMsRUFBRSxHQUFHLEVBQUMsQ0FBQyxFQUFFLG9CQUFPLENBQUMsR0FBRyxFQUFFLGtCQUFLLENBQUMsRUFBQyxTQUFTLEVBQUUsR0FBRyxFQUFDLENBQUMsQ0FBQyxDQUFD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