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
var testing_1 = require("@angular/core/testing");
var browser_util_1 = require("@angular/platform-browser/testing/src/browser_util");
var matchers_1 = require("@angular/platform-browser/testing/src/matchers");
var SimpleComp = /** @class */ (function () {
    function SimpleComp() {
        this.simpleBinding = 'Simple';
    }
    SimpleComp = __decorate([
        core_1.Component({ selector: 'simple-comp', template: "<span>Original {{simpleBinding}}</span>" }),
        core_1.Injectable(),
        __metadata("design:paramtypes", [])
    ], SimpleComp);
    return SimpleComp;
}());
var MyIfComp = /** @class */ (function () {
    function MyIfComp() {
        this.showMore = false;
    }
    MyIfComp = __decorate([
        core_1.Component({
            selector: 'my-if-comp',
            template: "MyIf(<span *ngIf=\"showMore\">More</span>)",
        }),
        core_1.Injectable()
    ], MyIfComp);
    return MyIfComp;
}());
var AutoDetectComp = /** @class */ (function () {
    function AutoDetectComp() {
        this.text = '1';
    }
    AutoDetectComp.prototype.click = function () { this.text += '1'; };
    AutoDetectComp = __decorate([
        core_1.Component({ selector: 'autodetect-comp', template: "<span (click)='click()'>{{text}}</span>" })
    ], AutoDetectComp);
    return AutoDetectComp;
}());
var AsyncComp = /** @class */ (function () {
    function AsyncComp() {
        this.text = '1';
    }
    AsyncComp.prototype.click = function () {
        var _this = this;
        Promise.resolve(null).then(function (_) { _this.text += '1'; });
    };
    AsyncComp = __decorate([
        core_1.Component({ selector: 'async-comp', template: "<span (click)='click()'>{{text}}</span>" })
    ], AsyncComp);
    return AsyncComp;
}());
var AsyncChildComp = /** @class */ (function () {
    function AsyncChildComp() {
        this.localText = '';
    }
    Object.defineProperty(AsyncChildComp.prototype, "text", {
        set: function (value) {
            var _this = this;
            Promise.resolve(null).then(function (_) { _this.localText = value; });
        },
        enumerable: true,
        configurable: true
    });
    __decorate([
        core_1.Input(),
        __metadata("design:type", String),
        __metadata("design:paramtypes", [String])
    ], AsyncChildComp.prototype, "text", null);
    AsyncChildComp = __decorate([
        core_1.Component({ selector: 'async-child-comp', template: '<span>{{localText}}</span>' })
    ], AsyncChildComp);
    return AsyncChildComp;
}());
var AsyncChangeComp = /** @class */ (function () {
    function AsyncChangeComp() {
        this.text = '1';
    }
    AsyncChangeComp.prototype.click = function () { this.text += '1'; };
    AsyncChangeComp = __decorate([
        core_1.Component({
            selector: 'async-change-comp',
            template: "<async-child-comp (click)='click()' [text]=\"text\"></async-child-comp>"
        })
    ], AsyncChangeComp);
    return AsyncChangeComp;
}());
var AsyncTimeoutComp = /** @class */ (function () {
    function AsyncTimeoutComp() {
        this.text = '1';
    }
    AsyncTimeoutComp.prototype.click = function () {
        var _this = this;
        setTimeout(function () { _this.text += '1'; }, 10);
    };
    AsyncTimeoutComp = __decorate([
        core_1.Component({ selector: 'async-timeout-comp', template: "<span (click)='click()'>{{text}}</span>" })
    ], AsyncTimeoutComp);
    return AsyncTimeoutComp;
}());
var NestedAsyncTimeoutComp = /** @class */ (function () {
    function NestedAsyncTimeoutComp() {
        this.text = '1';
    }
    NestedAsyncTimeoutComp.prototype.click = function () {
        var _this = this;
        setTimeout(function () { setTimeout(function () { _this.text += '1'; }, 10); }, 10);
    };
    NestedAsyncTimeoutComp = __decorate([
        core_1.Component({ selector: 'nested-async-timeout-comp', template: "<span (click)='click()'>{{text}}</span>" })
    ], NestedAsyncTimeoutComp);
    return NestedAsyncTimeoutComp;
}());
{
    describe('ComponentFixture', function () {
        beforeEach(testing_1.async(function () {
            testing_1.TestBed.configureTestingModule({
                declarations: [
                    AutoDetectComp, AsyncComp, AsyncTimeoutComp, NestedAsyncTimeoutComp, AsyncChangeComp,
                    MyIfComp, SimpleComp, AsyncChildComp
                ]
            });
        }));
        it('should auto detect changes if autoDetectChanges is called', function () {
            var componentFixture = testing_1.TestBed.createComponent(AutoDetectComp);
            matchers_1.expect(componentFixture.ngZone).not.toBeNull();
            componentFixture.autoDetectChanges();
            matchers_1.expect(componentFixture.nativeElement).toHaveText('1');
            var element = componentFixture.debugElement.children[0];
            browser_util_1.dispatchEvent(element.nativeElement, 'click');
            matchers_1.expect(componentFixture.isStable()).toBe(true);
            matchers_1.expect(componentFixture.nativeElement).toHaveText('11');
        });
        it('should auto detect changes if ComponentFixtureAutoDetect is provided as true', testing_1.withModule({ providers: [{ provide: testing_1.ComponentFixtureAutoDetect, useValue: true }] }, function () {
            var componentFixture = testing_1.TestBed.createComponent(AutoDetectComp);
            matchers_1.expect(componentFixture.nativeElement).toHaveText('1');
            var element = componentFixture.debugElement.children[0];
            browser_util_1.dispatchEvent(element.nativeElement, 'click');
            matchers_1.expect(componentFixture.nativeElement).toHaveText('11');
        }));
        it('should signal through whenStable when the fixture is stable (autoDetectChanges)', testing_1.async(function () {
            var componentFixture = testing_1.TestBed.createComponent(AsyncComp);
            componentFixture.autoDetectChanges();
            matchers_1.expect(componentFixture.nativeElement).toHaveText('1');
            var element = componentFixture.debugElement.children[0];
            browser_util_1.dispatchEvent(element.nativeElement, 'click');
            matchers_1.expect(componentFixture.nativeElement).toHaveText('1');
            // Component is updated asynchronously. Wait for the fixture to become stable
            // before checking for new value.
            matchers_1.expect(componentFixture.isStable()).toBe(false);
            componentFixture.whenStable().then(function (waited) {
                matchers_1.expect(waited).toBe(true);
                matchers_1.expect(componentFixture.nativeElement).toHaveText('11');
            });
        }));
        it('should signal through isStable when the fixture is stable (no autoDetectChanges)', testing_1.async(function () {
            var componentFixture = testing_1.TestBed.createComponent(AsyncComp);
            componentFixture.detectChanges();
            matchers_1.expect(componentFixture.nativeElement).toHaveText('1');
            var element = componentFixture.debugElement.children[0];
            browser_util_1.dispatchEvent(element.nativeElement, 'click');
            matchers_1.expect(componentFixture.nativeElement).toHaveText('1');
            // Component is updated asynchronously. Wait for the fixture to become stable
            // before checking.
            componentFixture.whenStable().then(function (waited) {
                matchers_1.expect(waited).toBe(true);
                componentFixture.detectChanges();
                matchers_1.expect(componentFixture.nativeElement).toHaveText('11');
            });
        }));
        it('should wait for macroTask(setTimeout) while checking for whenStable ' +
            '(autoDetectChanges)', testing_1.async(function () {
            var componentFixture = testing_1.TestBed.createComponent(AsyncTimeoutComp);
            componentFixture.autoDetectChanges();
            matchers_1.expect(componentFixture.nativeElement).toHaveText('1');
            var element = componentFixture.debugElement.children[0];
            browser_util_1.dispatchEvent(element.nativeElement, 'click');
            matchers_1.expect(componentFixture.nativeElement).toHaveText('1');
            // Component is updated asynchronously. Wait for the fixture to become
            // stable before checking for new value.
            matchers_1.expect(componentFixture.isStable()).toBe(false);
            componentFixture.whenStable().then(function (waited) {
                matchers_1.expect(waited).toBe(true);
                matchers_1.expect(componentFixture.nativeElement).toHaveText('11');
            });
        }));
        it('should wait for macroTask(setTimeout) while checking for whenStable ' +
            '(no autoDetectChanges)', testing_1.async(function () {
            var componentFixture = testing_1.TestBed.createComponent(AsyncTimeoutComp);
            componentFixture.detectChanges();
            matchers_1.expect(componentFixture.nativeElement).toHaveText('1');
            var element = componentFixture.debugElement.children[0];
            browser_util_1.dispatchEvent(element.nativeElement, 'click');
            matchers_1.expect(componentFixture.nativeElement).toHaveText('1');
            // Component is updated asynchronously. Wait for the fixture to become
            // stable before checking for new value.
            matchers_1.expect(componentFixture.isStable()).toBe(false);
            componentFixture.whenStable().then(function (waited) {
                matchers_1.expect(waited).toBe(true);
                componentFixture.detectChanges();
                matchers_1.expect(componentFixture.nativeElement).toHaveText('11');
            });
        }));
        it('should wait for nested macroTasks(setTimeout) while checking for whenStable ' +
            '(autoDetectChanges)', testing_1.async(function () {
            var componentFixture = testing_1.TestBed.createComponent(NestedAsyncTimeoutComp);
            componentFixture.autoDetectChanges();
            matchers_1.expect(componentFixture.nativeElement).toHaveText('1');
            var element = componentFixture.debugElement.children[0];
            browser_util_1.dispatchEvent(element.nativeElement, 'click');
            matchers_1.expect(componentFixture.nativeElement).toHaveText('1');
            // Component is updated asynchronously. Wait for the fixture to become
            // stable before checking for new value.
            matchers_1.expect(componentFixture.isStable()).toBe(false);
            componentFixture.whenStable().then(function (waited) {
                matchers_1.expect(waited).toBe(true);
                matchers_1.expect(componentFixture.nativeElement).toHaveText('11');
            });
        }));
        it('should wait for nested macroTasks(setTimeout) while checking for whenStable ' +
            '(no autoDetectChanges)', testing_1.async(function () {
            var componentFixture = testing_1.TestBed.createComponent(NestedAsyncTimeoutComp);
            componentFixture.detectChanges();
            matchers_1.expect(componentFixture.nativeElement).toHaveText('1');
            var element = componentFixture.debugElement.children[0];
            browser_util_1.dispatchEvent(element.nativeElement, 'click');
            matchers_1.expect(componentFixture.nativeElement).toHaveText('1');
            // Component is updated asynchronously. Wait for the fixture to become
            // stable before checking for new value.
            matchers_1.expect(componentFixture.isStable()).toBe(false);
            componentFixture.whenStable().then(function (waited) {
                matchers_1.expect(waited).toBe(true);
                componentFixture.detectChanges();
                matchers_1.expect(componentFixture.nativeElement).toHaveText('11');
            });
        }));
        it('should stabilize after async task in change detection (autoDetectChanges)', testing_1.async(function () {
            var componentFixture = testing_1.TestBed.createComponent(AsyncChangeComp);
            componentFixture.autoDetectChanges();
            componentFixture.whenStable().then(function (_) {
                matchers_1.expect(componentFixture.nativeElement).toHaveText('1');
                var element = componentFixture.debugElement.children[0];
                browser_util_1.dispatchEvent(element.nativeElement, 'click');
                componentFixture.whenStable().then(function (_) { matchers_1.expect(componentFixture.nativeElement).toHaveText('11'); });
            });
        }));
        it('should stabilize after async task in change detection(no autoDetectChanges)', testing_1.async(function () {
            var componentFixture = testing_1.TestBed.createComponent(AsyncChangeComp);
            componentFixture.detectChanges();
            componentFixture.whenStable().then(function (_) {
                // Run detectChanges again so that stabilized value is reflected in the
                // DOM.
                componentFixture.detectChanges();
                matchers_1.expect(componentFixture.nativeElement).toHaveText('1');
                var element = componentFixture.debugElement.children[0];
                browser_util_1.dispatchEvent(element.nativeElement, 'click');
                componentFixture.detectChanges();
                componentFixture.whenStable().then(function (_) {
                    // Run detectChanges again so that stabilized value is reflected in
                    // the DOM.
                    componentFixture.detectChanges();
                    matchers_1.expect(componentFixture.nativeElement).toHaveText('11');
                });
            });
        }));
        describe('No NgZone', function () {
            beforeEach(function () {
                testing_1.TestBed.configureTestingModule({ providers: [{ provide: testing_1.ComponentFixtureNoNgZone, useValue: true }] });
            });
            it('calling autoDetectChanges raises an error', function () {
                var componentFixture = testing_1.TestBed.createComponent(SimpleComp);
                matchers_1.expect(function () {
                    componentFixture.autoDetectChanges();
                }).toThrowError(/Cannot call autoDetectChanges when ComponentFixtureNoNgZone is set/);
            });
            it('should instantiate a component with valid DOM', testing_1.async(function () {
                var componentFixture = testing_1.TestBed.createComponent(SimpleComp);
                matchers_1.expect(componentFixture.ngZone).toBeNull();
                componentFixture.detectChanges();
                matchers_1.expect(componentFixture.nativeElement).toHaveText('Original Simple');
            }));
            it('should allow changing members of the component', testing_1.async(function () {
                var componentFixture = testing_1.TestBed.createComponent(MyIfComp);
                componentFixture.detectChanges();
                matchers_1.expect(componentFixture.nativeElement).toHaveText('MyIf()');
                componentFixture.componentInstance.showMore = true;
                componentFixture.detectChanges();
                matchers_1.expect(componentFixture.nativeElement).toHaveText('MyIf(More)');
            }));
        });
    });
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29tcG9uZW50X2ZpeHR1cmVfc3BlYy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2NvcmUvdGVzdC9jb21wb25lbnRfZml4dHVyZV9zcGVjLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7Ozs7Ozs7Ozs7O0FBRUgsc0NBQTJEO0FBQzNELGlEQUF1SDtBQUN2SCxtRkFBaUY7QUFDakYsMkVBQXNFO0FBSXRFO0lBRUU7UUFBZ0IsSUFBSSxDQUFDLGFBQWEsR0FBRyxRQUFRLENBQUM7SUFBQyxDQUFDO0lBRjVDLFVBQVU7UUFGZixnQkFBUyxDQUFDLEVBQUMsUUFBUSxFQUFFLGFBQWEsRUFBRSxRQUFRLEVBQUUseUNBQXlDLEVBQUMsQ0FBQztRQUN6RixpQkFBVSxFQUFFOztPQUNQLFVBQVUsQ0FHZjtJQUFELGlCQUFDO0NBQUEsQUFIRCxJQUdDO0FBT0Q7SUFMQTtRQU1FLGFBQVEsR0FBWSxLQUFLLENBQUM7SUFDNUIsQ0FBQztJQUZLLFFBQVE7UUFMYixnQkFBUyxDQUFDO1lBQ1QsUUFBUSxFQUFFLFlBQVk7WUFDdEIsUUFBUSxFQUFFLDRDQUEwQztTQUNyRCxDQUFDO1FBQ0QsaUJBQVUsRUFBRTtPQUNQLFFBQVEsQ0FFYjtJQUFELGVBQUM7Q0FBQSxBQUZELElBRUM7QUFHRDtJQURBO1FBRUUsU0FBSSxHQUFXLEdBQUcsQ0FBQztJQUdyQixDQUFDO0lBREMsOEJBQUssR0FBTCxjQUFVLElBQUksQ0FBQyxJQUFJLElBQUksR0FBRyxDQUFDLENBQUMsQ0FBQztJQUh6QixjQUFjO1FBRG5CLGdCQUFTLENBQUMsRUFBQyxRQUFRLEVBQUUsaUJBQWlCLEVBQUUsUUFBUSxFQUFFLHlDQUF5QyxFQUFDLENBQUM7T0FDeEYsY0FBYyxDQUluQjtJQUFELHFCQUFDO0NBQUEsQUFKRCxJQUlDO0FBR0Q7SUFEQTtRQUVFLFNBQUksR0FBVyxHQUFHLENBQUM7SUFLckIsQ0FBQztJQUhDLHlC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