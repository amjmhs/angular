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
const testing_1 = require("@angular/core/testing");
(function () {
    describe('lifecycle hooks examples', () => {
        it('should work with ngOnInit', () => {
            // #docregion OnInit
            let MyComponent = class MyComponent {
                ngOnInit() {
                    // ...
                }
            };
            MyComponent = __decorate([
                core_1.Component({ selector: 'my-cmp', template: `...` })
            ], MyComponent);
            // #enddocregion
            expect(createAndLogComponent(MyComponent)).toEqual([['ngOnInit', []]]);
        });
        it('should work with ngDoCheck', () => {
            // #docregion DoCheck
            let MyComponent = class MyComponent {
                ngDoCheck() {
                    // ...
                }
            };
            MyComponent = __decorate([
                core_1.Component({ selector: 'my-cmp', template: `...` })
            ], MyComponent);
            // #enddocregion
            expect(createAndLogComponent(MyComponent)).toEqual([['ngDoCheck', []]]);
        });
        it('should work with ngAfterContentChecked', () => {
            // #docregion AfterContentChecked
            let MyComponent = class MyComponent {
                ngAfterContentChecked() {
                    // ...
                }
            };
            MyComponent = __decorate([
                core_1.Component({ selector: 'my-cmp', template: `...` })
            ], MyComponent);
            // #enddocregion
            expect(createAndLogComponent(MyComponent)).toEqual([['ngAfterContentChecked', []]]);
        });
        it('should work with ngAfterContentInit', () => {
            // #docregion AfterContentInit
            let MyComponent = class MyComponent {
                ngAfterContentInit() {
                    // ...
                }
            };
            MyComponent = __decorate([
                core_1.Component({ selector: 'my-cmp', template: `...` })
            ], MyComponent);
            // #enddocregion
            expect(createAndLogComponent(MyComponent)).toEqual([['ngAfterContentInit', []]]);
        });
        it('should work with ngAfterViewChecked', () => {
            // #docregion AfterViewChecked
            let MyComponent = class MyComponent {
                ngAfterViewChecked() {
                    // ...
                }
            };
            MyComponent = __decorate([
                core_1.Component({ selector: 'my-cmp', template: `...` })
            ], MyComponent);
            // #enddocregion
            expect(createAndLogComponent(MyComponent)).toEqual([['ngAfterViewChecked', []]]);
        });
        it('should work with ngAfterViewInit', () => {
            // #docregion AfterViewInit
            let MyComponent = class MyComponent {
                ngAfterViewInit() {
                    // ...
                }
            };
            MyComponent = __decorate([
                core_1.Component({ selector: 'my-cmp', template: `...` })
            ], MyComponent);
            // #enddocregion
            expect(createAndLogComponent(MyComponent)).toEqual([['ngAfterViewInit', []]]);
        });
        it('should work with ngOnDestroy', () => {
            // #docregion OnDestroy
            let MyComponent = class MyComponent {
                ngOnDestroy() {
                    // ...
                }
            };
            MyComponent = __decorate([
                core_1.Component({ selector: 'my-cmp', template: `...` })
            ], MyComponent);
            // #enddocregion
            expect(createAndLogComponent(MyComponent)).toEqual([['ngOnDestroy', []]]);
        });
        it('should work with ngOnChanges', () => {
            // #docregion OnChanges
            let MyComponent = class MyComponent {
                ngOnChanges(changes) {
                    // changes.prop contains the old and the new value...
                }
            };
            __decorate([
                core_1.Input(),
                __metadata("design:type", Number)
            ], MyComponent.prototype, "prop", void 0);
            MyComponent = __decorate([
                core_1.Component({ selector: 'my-cmp', template: `...` })
            ], MyComponent);
            // #enddocregion
            const log = createAndLogComponent(MyComponent, ['prop']);
            expect(log.length).toBe(1);
            expect(log[0][0]).toBe('ngOnChanges');
            const changes = log[0][1][0];
            expect(changes['prop'].currentValue).toBe(true);
        });
    });
    function createAndLogComponent(clazz, inputs = []) {
        const log = [];
        createLoggingSpiesFromProto(clazz, log);
        const inputBindings = inputs.map(input => `[${input}] = true`).join(' ');
        let ParentComponent = class ParentComponent {
        };
        ParentComponent = __decorate([
            core_1.Component({ template: `<my-cmp ${inputBindings}></my-cmp>` })
        ], ParentComponent);
        const fixture = testing_1.TestBed.configureTestingModule({ declarations: [ParentComponent, clazz] })
            .createComponent(ParentComponent);
        fixture.detectChanges();
        fixture.destroy();
        return log;
    }
    function createLoggingSpiesFromProto(clazz, log) {
        const proto = clazz.prototype;
        Object.keys(proto).forEach((method) => {
            proto[method] = (...args) => { log.push([method, args]); };
        });
    }
})();
//# sourceMappingURL=lifecycle_hooks_spec.js.map