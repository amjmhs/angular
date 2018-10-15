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
var compiler_1 = require("@angular/compiler");
var core_1 = require("@angular/core");
var testing_1 = require("@angular/core/testing");
var resource_loader_impl_1 = require("../src/resource_loader/resource_loader_impl");
// Components for the tests.
var FancyService = /** @class */ (function () {
    function FancyService() {
        this.value = 'real value';
    }
    FancyService.prototype.getAsyncValue = function () { return Promise.resolve('async value'); };
    FancyService.prototype.getTimeoutValue = function () {
        return new Promise(function (resolve, reject) { setTimeout(function () { resolve('timeout value'); }, 10); });
    };
    return FancyService;
}());
var ExternalTemplateComp = /** @class */ (function () {
    function ExternalTemplateComp() {
    }
    ExternalTemplateComp = __decorate([
        core_1.Component({
            selector: 'external-template-comp',
            templateUrl: '/base/angular/packages/platform-browser/test/static_assets/test.html'
        })
    ], ExternalTemplateComp);
    return ExternalTemplateComp;
}());
var BadTemplateUrl = /** @class */ (function () {
    function BadTemplateUrl() {
    }
    BadTemplateUrl = __decorate([
        core_1.Component({ selector: 'bad-template-comp', templateUrl: 'non-existent.html' })
    ], BadTemplateUrl);
    return BadTemplateUrl;
}());
// Tests for angular/testing bundle specific to the browser environment.
// For general tests, see test/testing/testing_public_spec.ts.
{
    describe('test APIs for the browser', function () {
        describe('using the async helper', function () {
            var actuallyDone;
            beforeEach(function () { actuallyDone = false; });
            afterEach(function () { expect(actuallyDone).toEqual(true); });
            it('should run async tests with ResourceLoaders', testing_1.async(function () {
                var resourceLoader = new resource_loader_impl_1.ResourceLoaderImpl();
                resourceLoader
                    .get('/base/angular/packages/platform-browser/test/static_assets/test.html')
                    .then(function () { actuallyDone = true; });
            }), 10000); // Long timeout here because this test makes an actual ResourceLoader.
        });
        describe('using the test injector with the inject helper', function () {
            describe('setting up Providers', function () {
                beforeEach(function () {
                    testing_1.TestBed.configureTestingModule({ providers: [{ provide: FancyService, useValue: new FancyService() }] });
                });
                it('provides a real ResourceLoader instance', testing_1.inject([compiler_1.ResourceLoader], function (resourceLoader) {
                    expect(resourceLoader instanceof resource_loader_impl_1.ResourceLoaderImpl).toBeTruthy();
                }));
                it('should allow the use of fakeAsync', testing_1.fakeAsync(testing_1.inject([FancyService], function (service /** TODO #9100 */) {
                    var value /** TODO #9100 */;
                    service.getAsyncValue().then(function (val /** TODO #9100 */) { value = val; });
                    testing_1.tick();
                    expect(value).toEqual('async value');
                })));
            });
        });
        describe('Compiler', function () {
            it('should return NgModule id when asked', function () {
                var TestModule = /** @class */ (function () {
                    function TestModule() {
                    }
                    TestModule = __decorate([
                        core_1.NgModule({
                            id: 'test-module',
                        })
                    ], TestModule);
                    return TestModule;
                }());
                testing_1.TestBed.configureTestingModule({
                    imports: [TestModule],
                });
                var compiler = testing_1.TestBed.get(core_1.Compiler);
                expect(compiler.getModuleId(TestModule)).toBe('test-module');
            });
        });
        describe('errors', function () {
            var originalJasmineIt;
            var patchJasmineIt = function () {
                var resolve;
                var reject;
                var promise = new Promise(function (res, rej) {
                    resolve = res;
                    reject = rej;
                });
                originalJasmineIt = jasmine.getEnv().it;
                jasmine.getEnv().it = function (description, fn) {
                    var done = (function () { return resolve(null); });
                    done.fail = reject;
                    fn(done);
                    return null;
                };
                return promise;
            };
            var restoreJasmineIt = function () { jasmine.getEnv().it = originalJasmineIt; };
            it('should fail when an ResourceLoader fails', function (done) {
                var itPromise = patchJasmineIt();
                it('should fail with an error from a promise', testing_1.async(function () {
                    testing_1.TestBed.configureTestingModule({ declarations: [BadTemplateUrl] });
                    testing_1.TestBed.compileComponents();
                }));
                itPromise.then(function () { done.fail('Expected test to fail, but it did not'); }, function (err) {
                    expect(err.message)
                        .toEqual('Uncaught (in promise): Failed to load non-existent.html');
                    done();
                });
                restoreJasmineIt();
            }, 10000);
        });
        describe('TestBed createComponent', function () {
            it('should allow an external templateUrl', testing_1.async(function () {
                testing_1.TestBed.configureTestingModule({ declarations: [ExternalTemplateComp] });
                testing_1.TestBed.compileComponents().then(function () {
                    var componentFixture = testing_1.TestBed.createComponent(ExternalTemplateComp);
                    componentFixture.detectChanges();
                    expect(componentFixture.nativeElement.textContent).toEqual('from external template');
                });
            }), 10000); // Long timeout here because this test makes an actual ResourceLoader request, and
            // is slow
            // on Edge.
        });
    });
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGVzdGluZ19wdWJsaWNfYnJvd3Nlcl9zcGVjLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvcGxhdGZvcm0tYnJvd3Nlci1keW5hbWljL3Rlc3QvdGVzdGluZ19wdWJsaWNfYnJvd3Nlcl9zcGVjLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7Ozs7Ozs7O0FBRUgsOENBQWlEO0FBQ2pELHNDQUE0RDtBQUM1RCxpREFBOEU7QUFFOUUsb0ZBQStFO0FBSS9FLDRCQUE0QjtBQUM1QjtJQUFBO1FBQ0UsVUFBSyxHQUFXLFlBQVksQ0FBQztJQU0vQixDQUFDO0lBTEMsb0NBQWEsR0FBYixjQUFrQixPQUFPLE9BQU8sQ0FBQyxPQUFPLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQzFELHNDQUFlLEdBQWY7UUFDRSxPQUFPLElBQUksT0FBTyxDQUNkLFVBQUMsT0FBTyxFQUFFLE1BQU0sSUFBTyxVQUFVLENBQUMsY0FBUSxPQUFPLENBQUMsZUFBZSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUNyRixDQUFDO0lBQ0gsbUJBQUM7QUFBRCxDQUFDLEFBUEQsSUFPQztBQU1EO0lBQUE7SUFDQSxDQUFDO0lBREssb0JBQW9CO1FBSnpCLGdCQUFTLENBQUM7WUFDVCxRQUFRLEVBQUUsd0JBQXdCO1lBQ2xDLFdBQVcsRUFBRSxzRUFBc0U7U0FDcEYsQ0FBQztPQUNJLG9CQUFvQixDQUN6QjtJQUFELDJCQUFDO0NBQUEsQUFERCxJQUNDO0FBR0Q7SUFBQTtJQUNBLENBQUM7SUFESyxjQUFjO1FBRG5CLGdCQUFTLENBQUMsRUFBQyxRQUFRLEVBQUUsbUJBQW1CLEVBQUUsV0FBVyxFQUFFLG1CQUFtQixFQUFDLENBQUM7T0FDdkUsY0FBYyxDQUNuQjtJQUFELHFCQUFDO0NBQUEsQUFERCxJQUNDO0FBRUQsd0VBQXdF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