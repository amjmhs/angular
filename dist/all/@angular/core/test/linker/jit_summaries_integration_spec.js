"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
var compiler_1 = require("@angular/compiler");
var metadata_resolver_1 = require("@angular/compiler/src/metadata_resolver");
var resource_loader_mock_1 = require("@angular/compiler/testing/src/resource_loader_mock");
var core_1 = require("@angular/core");
var testing_1 = require("@angular/core/testing");
var matchers_1 = require("@angular/platform-browser/testing/src/matchers");
{
    describe('Jit Summaries', function () {
        var instances;
        var summaries;
        var SomeDep = /** @class */ (function () {
            function SomeDep() {
            }
            return SomeDep;
        }());
        var Base = /** @class */ (function () {
            function Base(dep) {
                this.dep = dep;
                instances.set(Object.getPrototypeOf(this).constructor, this);
            }
            return Base;
        }());
        function expectInstanceCreated(type) {
            var instance = instances.get(type);
            matchers_1.expect(instance).toBeDefined();
            matchers_1.expect(instance.dep instanceof SomeDep).toBe(true);
        }
        var SomeModule = /** @class */ (function (_super) {
            __extends(SomeModule, _super);
            function SomeModule() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            return SomeModule;
        }(Base));
        var SomePrivateComponent = /** @class */ (function (_super) {
            __extends(SomePrivateComponent, _super);
            function SomePrivateComponent() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            return SomePrivateComponent;
        }(Base));
        var SomePublicComponent = /** @class */ (function (_super) {
            __extends(SomePublicComponent, _super);
            function SomePublicComponent() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            return SomePublicComponent;
        }(Base));
        var SomeDirective = /** @class */ (function (_super) {
            __extends(SomeDirective, _super);
            function SomeDirective() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            return SomeDirective;
        }(Base));
        var SomePipe = /** @class */ (function (_super) {
            __extends(SomePipe, _super);
            function SomePipe() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            SomePipe.prototype.transform = function (value) { return value; };
            return SomePipe;
        }(Base));
        var SomeService = /** @class */ (function (_super) {
            __extends(SomeService, _super);
            function SomeService() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            return SomeService;
        }(Base));
        // Move back into the it which needs it after https://github.com/angular/tsickle/issues/547 is
        // fixed.
        var TestComp3 = /** @class */ (function () {
            function TestComp3(service) {
            }
            TestComp3 = __decorate([
                core_1.Component({ template: '<div someDir>{{1 | somePipe}}</div>' }),
                __metadata("design:paramtypes", [SomeService])
            ], TestComp3);
            return TestComp3;
        }());
        var TestCompErrorOnDestroy = /** @class */ (function () {
            function TestCompErrorOnDestroy() {
            }
            TestCompErrorOnDestroy.prototype.ngOnDestroy = function () { };
            TestCompErrorOnDestroy = __decorate([
                core_1.Component({ template: '' })
            ], TestCompErrorOnDestroy);
            return TestCompErrorOnDestroy;
        }());
        function resetTestEnvironmentWithSummaries(summaries) {
            var _a = testing_1.getTestBed(), platform = _a.platform, ngModule = _a.ngModule;
            testing_1.TestBed.resetTestEnvironment();
            testing_1.TestBed.initTestEnvironment(ngModule, platform, summaries);
        }
        function createSummaries() {
            var resourceLoader = new resource_loader_mock_1.MockResourceLoader();
            setMetadata(resourceLoader);
            testing_1.TestBed.configureCompiler({ providers: [{ provide: compiler_1.ResourceLoader, useValue: resourceLoader }] });
            testing_1.TestBed.configureTestingModule({ imports: [SomeModule], providers: [SomeDep] });
            var summariesPromise = testing_1.TestBed.compileComponents().then(function () {
                var metadataResolver = testing_1.TestBed.get(metadata_resolver_1.CompileMetadataResolver);
                var summaries = [
                    metadataResolver.getNgModuleSummary(SomeModule),
                    // test nesting via closures, as we use this in the generated code too.
                    function () {
                        return [metadataResolver.getDirectiveSummary(SomePublicComponent),
                            metadataResolver.getDirectiveSummary(SomePrivateComponent),
                        ];
                    },
                    metadataResolver.getDirectiveSummary(SomeDirective),
                    metadataResolver.getPipeSummary(SomePipe),
                    metadataResolver.getInjectableSummary(SomeService)
                ];
                clearMetadata();
                testing_1.TestBed.resetTestingModule();
                return function () { return summaries; };
            });
            resourceLoader.flush();
            return summariesPromise;
        }
        function setMetadata(resourceLoader) {
            Base.parameters = [[SomeDep]];
            SomeModule.annotations = [new core_1.NgModule({
                    declarations: [SomePublicComponent, SomePrivateComponent, SomeDirective, SomePipe],
                    exports: [SomeDirective, SomePipe, SomePublicComponent],
                    providers: [SomeService]
                })];
            SomePublicComponent.annotations = [new core_1.Component({ templateUrl: 'somePublicUrl.html' })];
            resourceLoader.expect('somePublicUrl.html', "Hello public world!");
            SomePrivateComponent.annotations = [new core_1.Component({ templateUrl: 'somePrivateUrl.html' })];
            resourceLoader.expect('somePrivateUrl.html', "Hello private world!");
            SomeDirective.annotations = [new core_1.Directive({ selector: '[someDir]' })];
            SomePipe.annotations = [new core_1.Pipe({ name: 'somePipe' })];
            SomeService.annotations = [new core_1.Injectable()];
        }
        function clearMetadata() {
            Base.parameters = [];
            SomeModule.annotations = [];
            SomePublicComponent.annotations = [];
            SomePrivateComponent.annotations = [];
            SomeDirective.annotations = [];
            SomePipe.annotations = [];
            SomeService.annotations = [];
        }
        beforeEach(testing_1.async(function () {
            instances = new Map();
            createSummaries().then(function (s) { return summaries = s; });
        }));
        afterEach(function () { resetTestEnvironmentWithSummaries(); });
        it('should use directive metadata from summaries', function () {
            resetTestEnvironmentWithSummaries(summaries);
            var TestComp = /** @class */ (function () {
                function TestComp() {
                }
                TestComp = __decorate([
                    core_1.Component({ template: '<div someDir></div>' })
                ], TestComp);
                return TestComp;
            }());
            testing_1.TestBed
                .configureTestingModule({ providers: [SomeDep], declarations: [TestComp, SomeDirective] })
                .createComponent(TestComp);
            expectInstanceCreated(SomeDirective);
        });
        it('should use pipe metadata from summaries', function () {
            resetTestEnvironmentWithSummaries(summaries);
            var TestComp = /** @class */ (function () {
                function TestComp() {
                }
                TestComp = __decorate([
                    core_1.Component({ template: '{{1 | somePipe}}' })
                ], TestComp);
                return TestComp;
            }());
            testing_1.TestBed.configureTestingModule({ providers: [SomeDep], declarations: [TestComp, SomePipe] })
                .createComponent(TestComp);
            expectInstanceCreated(SomePipe);
        });
        it('should use Service metadata from summaries', function () {
            resetTestEnvironmentWithSummaries(summaries);
            testing_1.TestBed.configureTestingModule({
                providers: [SomeService, SomeDep],
            });
            testing_1.TestBed.get(SomeService);
            expectInstanceCreated(SomeService);
        });
        it('should use NgModule metadata from summaries', function () {
            resetTestEnvironmentWithSummaries(summaries);
            testing_1.TestBed
                .configureTestingModule({ providers: [SomeDep], declarations: [TestComp3], imports: [SomeModule] })
                .createComponent(TestComp3);
            expectInstanceCreated(SomeModule);
            expectInstanceCreated(SomeDirective);
            expectInstanceCreated(SomePipe);
            expectInstanceCreated(SomeService);
        });
        it('should allow to create private components from imported NgModule summaries', function () {
            resetTestEnvironmentWithSummaries(summaries);
            testing_1.TestBed.configureTestingModule({ providers: [SomeDep], imports: [SomeModule] })
                .createComponent(SomePrivateComponent);
            expectInstanceCreated(SomePrivateComponent);
        });
        it('should throw when trying to mock a type with a summary', function () {
            resetTestEnvironmentWithSummaries(summaries);
            testing_1.TestBed.resetTestingModule();
            matchers_1.expect(function () { return testing_1.TestBed.overrideComponent(SomePrivateComponent, { add: {} }).compileComponents(); })
                .toThrowError('SomePrivateComponent was AOT compiled, so its metadata cannot be changed.');
            testing_1.TestBed.resetTestingModule();
            matchers_1.expect(function () { return testing_1.TestBed.overrideDirective(SomeDirective, { add: {} }).compileComponents(); })
                .toThrowError('SomeDirective was AOT compiled, so its metadata cannot be changed.');
            testing_1.TestBed.resetTestingModule();
            matchers_1.expect(function () { return testing_1.TestBed.overridePipe(SomePipe, { add: { name: 'test' } }).compileComponents(); })
                .toThrowError('SomePipe was AOT compiled, so its metadata cannot be changed.');
            testing_1.TestBed.resetTestingModule();
            matchers_1.expect(function () { return testing_1.TestBed.overrideModule(SomeModule, { add: {} }).compileComponents(); })
                .toThrowError('SomeModule was AOT compiled, so its metadata cannot be changed.');
        });
        it('should return stack trace and component data on resetTestingModule when error is thrown', function () {
            resetTestEnvironmentWithSummaries();
            var fixture = testing_1.TestBed.configureTestingModule({ declarations: [TestCompErrorOnDestroy] })
                .createComponent(TestCompErrorOnDestroy);
            var expectedError = 'Error from ngOnDestroy';
            var component = fixture.componentInstance;
            spyOn(console, 'error');
            spyOn(component, 'ngOnDestroy').and.throwError(expectedError);
            var expectedObject = {
                stacktrace: new Error(expectedError),
                component: component,
            };
            testing_1.TestBed.resetTestingModule();
            matchers_1.expect(console.error)
                .toHaveBeenCalledWith('Error during cleanup of component', expectedObject);
        });
        it('should allow to add summaries via configureTestingModule', function () {
            resetTestEnvironmentWithSummaries();
            var TestComp = /** @class */ (function () {
                function TestComp() {
                }
                TestComp = __decorate([
                    core_1.Component({ template: '<div someDir></div>' })
                ], TestComp);
                return TestComp;
            }());
            testing_1.TestBed
                .configureTestingModule({
                providers: [SomeDep],
                declarations: [TestComp, SomeDirective],
                aotSummaries: summaries
            })
                .createComponent(TestComp);
            expectInstanceCreated(SomeDirective);
        });
        it('should allow to override a provider', function () {
            resetTestEnvironmentWithSummaries(summaries);
            var overwrittenValue = {};
            var fixture = testing_1.TestBed.overrideProvider(SomeDep, { useFactory: function () { return overwrittenValue; }, deps: [] })
                .configureTestingModule({ providers: [SomeDep], imports: [SomeModule] })
                .createComponent(SomePublicComponent);
            matchers_1.expect(fixture.componentInstance.dep).toBe(overwrittenValue);
        });
        it('should allow to override a template', function () {
            resetTestEnvironmentWithSummaries(summaries);
            testing_1.TestBed.overrideTemplateUsingTestingModule(SomePublicComponent, 'overwritten');
            var fixture = testing_1.TestBed.configureTestingModule({ providers: [SomeDep], imports: [SomeModule] })
                .createComponent(SomePublicComponent);
            expectInstanceCreated(SomePublicComponent);
            matchers_1.expect(fixture.nativeElement).toHaveText('overwritten');
        });
    });
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaml0X3N1bW1hcmllc19pbnRlZ3JhdGlvbl9zcGVjLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvY29yZS90ZXN0L2xpbmtlci9qaXRfc3VtbWFyaWVzX2ludGVncmF0aW9uX3NwZWMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBRUgsOENBQWlEO0FBQ2pELDZFQUFnRjtBQUNoRiwyRkFBc0Y7QUFDdEYsc0NBQWdHO0FBQ2hHLGlEQUFpRTtBQUNqRSwyRUFBc0U7QUFFdEU7SUFDRSxRQUFRLENBQUMsZUFBZSxFQUFFO1FBQ3hCLElBQUksU0FBeUIsQ0FBQztRQUM5QixJQUFJLFNBQXNCLENBQUM7UUFFM0I7WUFBQTtZQUFlLENBQUM7WUFBRCxjQUFDO1FBQUQsQ0FBQyxBQUFoQixJQUFnQjtRQUVoQjtZQUlFLGNBQW1CLEdBQVk7Z0JBQVosUUFBRyxHQUFILEdBQUcsQ0FBUztnQkFDN0IsU0FBUyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxDQUFDLFdBQVcsRUFBRSxJQUFJLENBQUMsQ0FBQztZQUMvRCxDQUFDO1lBQ0gsV0FBQztRQUFELENBQUMsQUFQRCxJQU9DO1FBRUQsK0JBQStCLElBQVM7WUFDdEMsSUFBTSxRQUFRLEdBQUcsU0FBUyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUcsQ0FBQztZQUN2QyxpQkFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDLFdBQVcsRUFBRSxDQUFDO1lBQy9CLGlCQUFNLENBQUMsUUFBUSxDQUFDLEdBQUcsWUFBWSxPQUFPLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDckQsQ0FBQztRQUVEO1lBQXlCLDhCQUFJO1lBQTdCOztZQUErQixDQUFDO1lBQUQsaUJBQUM7UUFBRCxDQUFDLEFBQWhDLENBQXlCLElBQUksR0FBRztRQUVoQztZQUFt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