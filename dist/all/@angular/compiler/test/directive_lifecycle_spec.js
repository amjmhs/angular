"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
var lifecycle_reflector_1 = require("@angular/compiler/src/lifecycle_reflector");
var compiler_reflector_1 = require("@angular/platform-browser-dynamic/src/compiler_reflector");
function hasLifecycleHook(hook, directive) {
    return lifecycle_reflector_1.hasLifecycleHook(new compiler_reflector_1.JitReflector(), hook, directive);
}
{
    describe('Create Directive', function () {
        describe('lifecycle', function () {
            describe('ngOnChanges', function () {
                it('should be true when the directive has the ngOnChanges method', function () {
                    expect(hasLifecycleHook(lifecycle_reflector_1.LifecycleHooks.OnChanges, DirectiveWithOnChangesMethod)).toBe(true);
                });
                it('should be false otherwise', function () { expect(hasLifecycleHook(lifecycle_reflector_1.LifecycleHooks.OnChanges, DirectiveNoHooks)).toBe(false); });
            });
            describe('ngOnDestroy', function () {
                it('should be true when the directive has the ngOnDestroy method', function () {
                    expect(hasLifecycleHook(lifecycle_reflector_1.LifecycleHooks.OnDestroy, DirectiveWithOnDestroyMethod)).toBe(true);
                });
                it('should be false otherwise', function () { expect(hasLifecycleHook(lifecycle_reflector_1.LifecycleHooks.OnDestroy, DirectiveNoHooks)).toBe(false); });
            });
            describe('ngOnInit', function () {
                it('should be true when the directive has the ngOnInit method', function () { expect(hasLifecycleHook(lifecycle_reflector_1.LifecycleHooks.OnInit, DirectiveWithOnInitMethod)).toBe(true); });
                it('should be false otherwise', function () { expect(hasLifecycleHook(lifecycle_reflector_1.LifecycleHooks.OnInit, DirectiveNoHooks)).toBe(false); });
            });
            describe('ngDoCheck', function () {
                it('should be true when the directive has the ngDoCheck method', function () {
                    expect(hasLifecycleHook(lifecycle_reflector_1.LifecycleHooks.DoCheck, DirectiveWithOnCheckMethod)).toBe(true);
                });
                it('should be false otherwise', function () { expect(hasLifecycleHook(lifecycle_reflector_1.LifecycleHooks.DoCheck, DirectiveNoHooks)).toBe(false); });
            });
            describe('ngAfterContentInit', function () {
                it('should be true when the directive has the ngAfterContentInit method', function () {
                    expect(hasLifecycleHook(lifecycle_reflector_1.LifecycleHooks.AfterContentInit, DirectiveWithAfterContentInitMethod))
                        .toBe(true);
                });
                it('should be false otherwise', function () {
                    expect(hasLifecycleHook(lifecycle_reflector_1.LifecycleHooks.AfterContentInit, DirectiveNoHooks)).toBe(false);
                });
            });
            describe('ngAfterContentChecked', function () {
                it('should be true when the directive has the ngAfterContentChecked method', function () {
                    expect(hasLifecycleHook(lifecycle_reflector_1.LifecycleHooks.AfterContentChecked, DirectiveWithAfterContentCheckedMethod))
                        .toBe(true);
                });
                it('should be false otherwise', function () {
                    expect(hasLifecycleHook(lifecycle_reflector_1.LifecycleHooks.AfterContentChecked, DirectiveNoHooks)).toBe(false);
                });
            });
            describe('ngAfterViewInit', function () {
                it('should be true when the directive has the ngAfterViewInit method', function () {
                    expect(hasLifecycleHook(lifecycle_reflector_1.LifecycleHooks.AfterViewInit, DirectiveWithAfterViewInitMethod))
                        .toBe(true);
                });
                it('should be false otherwise', function () { expect(hasLifecycleHook(lifecycle_reflector_1.LifecycleHooks.AfterViewInit, DirectiveNoHooks)).toBe(false); });
            });
            describe('ngAfterViewChecked', function () {
                it('should be true when the directive has the ngAfterViewChecked method', function () {
                    expect(hasLifecycleHook(lifecycle_reflector_1.LifecycleHooks.AfterViewChecked, DirectiveWithAfterViewCheckedMethod))
                        .toBe(true);
                });
                it('should be false otherwise', function () {
                    expect(hasLifecycleHook(lifecycle_reflector_1.LifecycleHooks.AfterViewChecked, DirectiveNoHooks)).toBe(false);
                });
            });
        });
    });
}
var DirectiveNoHooks = /** @class */ (function () {
    function DirectiveNoHooks() {
    }
    return DirectiveNoHooks;
}());
var DirectiveWithOnChangesMethod = /** @class */ (function () {
    function DirectiveWithOnChangesMethod() {
    }
    DirectiveWithOnChangesMethod.prototype.ngOnChanges = function (_) { };
    return DirectiveWithOnChangesMethod;
}());
var DirectiveWithOnInitMethod = /** @class */ (function () {
    function DirectiveWithOnInitMethod() {
    }
    DirectiveWithOnInitMethod.prototype.ngOnInit = function () { };
    return DirectiveWithOnInitMethod;
}());
var DirectiveWithOnCheckMethod = /** @class */ (function () {
    function DirectiveWithOnCheckMethod() {
    }
    DirectiveWithOnCheckMethod.prototype.ngDoCheck = function () { };
    return DirectiveWithOnCheckMethod;
}());
var DirectiveWithOnDestroyMethod = /** @class */ (function () {
    function DirectiveWithOnDestroyMethod() {
    }
    DirectiveWithOnDestroyMethod.prototype.ngOnDestroy = function () { };
    return DirectiveWithOnDestroyMethod;
}());
var DirectiveWithAfterContentInitMethod = /** @class */ (function () {
    function DirectiveWithAfterContentInitMethod() {
    }
    DirectiveWithAfterContentInitMethod.prototype.ngAfterContentInit = function () { };
    return DirectiveWithAfterContentInitMethod;
}());
var DirectiveWithAfterContentCheckedMethod = /** @class */ (function () {
    function DirectiveWithAfterContentCheckedMethod() {
    }
    DirectiveWithAfterContentCheckedMethod.prototype.ngAfterContentChecked = function () { };
    return DirectiveWithAfterContentCheckedMethod;
}());
var DirectiveWithAfterViewInitMethod = /** @class */ (function () {
    function DirectiveWithAfterViewInitMethod() {
    }
    DirectiveWithAfterViewInitMethod.prototype.ngAfterViewInit = function () { };
    return DirectiveWithAfterViewInitMethod;
}());
var DirectiveWithAfterViewCheckedMethod = /** @class */ (function () {
    function DirectiveWithAfterViewCheckedMethod() {
    }
    DirectiveWithAfterViewCheckedMethod.prototype.ngAfterViewChecked = function () { };
    return DirectiveWithAfterViewCheckedMethod;
}());
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGlyZWN0aXZlX2xpZmVjeWNsZV9zcGVjLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvY29tcGlsZXIvdGVzdC9kaXJlY3RpdmVfbGlmZWN5Y2xlX3NwZWMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRzs7QUFFSCxpRkFBNEg7QUFFNUgsK0ZBQXNGO0FBRXRGLDBCQUEwQixJQUFXLEVBQUUsU0FBYztJQUNuRCxPQUFPLHNDQUFvQixDQUFDLElBQUksaUNBQVksRUFBRSxFQUFFLElBQUksRUFBRSxTQUFTLENBQUMsQ0FBQztBQUNuRSxDQUFDO0FBRUQ7SUFDRSxRQUFRLENBQUMsa0JBQWtCLEVBQUU7UUFDM0IsUUFBUSxDQUFDLFdBQVcsRUFBRTtZQUVwQixRQUFRLENBQUMsYUFBYSxFQUFFO2dCQUN0QixFQUFFLENBQUMsOERBQThELEVBQUU7b0JBQ2pFLE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxvQ0FBSyxDQUFDLFNBQVMsRUFBRSw0QkFBNEIsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO2dCQUNyRixDQUFDLENBQUMsQ0FBQztnQkFFSCxFQUFFLENBQUMsMkJBQTJCLEVBQzNCLGNBQVEsTUFBTSxDQUFDLGdCQUFnQixDQUFDLG9DQUFLLENBQUMsU0FBUyxFQUFFLGdCQUFnQixDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUN6RixDQUFDLENBQUMsQ0FBQztZQUVILFFBQVEsQ0FBQyxhQUFhLEVBQUU7Z0JBQ3RCLEVBQUUsQ0FBQyw4REFBOEQsRUFBRTtvQkFDakUsTUFBTSxDQUFDLGdCQUFnQixDQUFDLG9DQUFLLENBQUMsU0FBUyxFQUFFLDRCQUE0QixDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7Z0JBQ3JGLENBQUMsQ0FBQyxDQUFDO2dCQUVILEVBQUUs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