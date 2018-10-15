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
Object.defineProperty(exports, "__esModule", { value: true });
var compiler_1 = require("@angular/compiler");
var core_1 = require("@angular/core");
var testing_1 = require("@angular/core/testing");
var matchers_1 = require("@angular/platform-browser/testing/src/matchers");
var resource_loader_cache_1 = require("../../src/resource_loader/resource_loader_cache");
var resource_loader_cache_setter_1 = require("./resource_loader_cache_setter");
{
    describe('CachedResourceLoader', function () {
        var resourceLoader;
        function createCachedResourceLoader() {
            resource_loader_cache_setter_1.setTemplateCache({ 'test.html': '<div>Hello</div>' });
            return new resource_loader_cache_1.CachedResourceLoader();
        }
        beforeEach(testing_1.fakeAsync(function () {
            testing_1.TestBed.configureCompiler({
                providers: [
                    { provide: compiler_1.UrlResolver, useClass: TestUrlResolver, deps: [] },
                    { provide: compiler_1.ResourceLoader, useFactory: createCachedResourceLoader, deps: [] }
                ]
            });
            testing_1.TestBed.configureTestingModule({ declarations: [TestComponent] });
            testing_1.TestBed.compileComponents();
        }));
        it('should throw exception if $templateCache is not found', function () {
            resource_loader_cache_setter_1.setTemplateCache(null);
            matchers_1.expect(function () {
                resourceLoader = new resource_loader_cache_1.CachedResourceLoader();
            }).toThrowError('CachedResourceLoader: Template cache was not found in $templateCache.');
        });
        it('should resolve the Promise with the cached file content on success', testing_1.async(function () {
            resource_loader_cache_setter_1.setTemplateCache({ 'test.html': '<div>Hello</div>' });
            resourceLoader = new resource_loader_cache_1.CachedResourceLoader();
            resourceLoader.get('test.html').then(function (text) { matchers_1.expect(text).toBe('<div>Hello</div>'); });
        }));
        it('should reject the Promise on failure', testing_1.async(function () {
            resourceLoader = new resource_loader_cache_1.CachedResourceLoader();
            resourceLoader.get('unknown.html')
                .then(function (text) { throw new Error('Not expected to succeed.'); })
                .catch(function (error) { });
        }));
        it('should allow fakeAsync Tests to load components with templateUrl synchronously', testing_1.fakeAsync(function () {
            testing_1.TestBed.configureTestingModule({ declarations: [TestComponent] });
            testing_1.TestBed.compileComponents();
            testing_1.tick();
            var fixture = testing_1.TestBed.createComponent(TestComponent);
            // This should initialize the fixture.
            testing_1.tick();
            matchers_1.expect(fixture.debugElement.children[0].nativeElement).toHaveText('Hello');
        }));
    });
}
var TestComponent = /** @class */ (function () {
    function TestComponent() {
    }
    TestComponent = __decorate([
        core_1.Component({ selector: 'test-cmp', templateUrl: 'test.html' })
    ], TestComponent);
    return TestComponent;
}());
var TestUrlResolver = /** @class */ (function (_super) {
    __extends(TestUrlResolver, _super);
    function TestUrlResolver() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    TestUrlResolver.prototype.resolve = function (baseUrl, url) {
        // Don't use baseUrl to get the same URL as templateUrl.
        // This is to remove any difference between Dart and TS tests.
        return url;
    };
    return TestUrlResolver;
}(compiler_1.UrlResolver));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVzb3VyY2VfbG9hZGVyX2NhY2hlX3NwZWMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9wbGF0Zm9ybS1icm93c2VyLWR5bmFtaWMvdGVzdC9yZXNvdXJjZV9sb2FkZXIvcmVzb3VyY2VfbG9hZGVyX2NhY2hlX3NwZWMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRzs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBRUgsOENBQThEO0FBQzlELHNDQUF3QztBQUN4QyxpREFBc0U7QUFDdEUsMkVBQXNFO0FBRXRFLHlGQUFxRjtBQUVyRiwrRUFBZ0U7QUFFaEU7SUFDRSxRQUFRLENBQUMsc0JBQXNCLEVBQUU7UUFDL0IsSUFBSSxjQUFvQyxDQUFDO1FBRXpDO1lBQ0UsK0NBQWdCLENBQUMsRUFBQyxXQUFXLEVBQUUsa0JBQWtCLEVBQUMsQ0FBQyxDQUFDO1lBQ3BELE9BQU8sSUFBSSw0Q0FBb0IsRUFBRSxDQUFDO1FBQ3BDLENBQUM7UUFDRCxVQUFVLENBQUMsbUJBQVMsQ0FBQztZQUNuQixpQkFBTyxDQUFDLGlCQUFpQixDQUFDO2dCQUN4QixTQUFTLEVBQUU7b0JBQ1QsRUFBQyxPQUFPLEVBQUUsc0JBQVcsRUFBRSxRQUFRLEVBQUUsZUFBZSxFQUFFLElBQUksRUFBRSxFQUFFLEVBQUM7b0JBQzNELEVBQUMsT0FBTyxFQUFFLHlCQUFjLEVBQUUsVUFBVSxFQUFFLDBCQUEwQixFQUFFLElBQUksRUFBRSxFQUFFLEVBQUM7aUJBQzVFO2FBQ0YsQ0FBQyxDQUFDO1lBRUgsaUJBQU8sQ0FBQyxzQkFBc0IsQ0FBQyxFQUFDLFlBQVksRUFBRSxDQUFDLGFBQWEsQ0FBQyxFQUFDLENBQUMsQ0FBQztZQUNoRSxpQkFBTyxDQUFDLGlCQUFpQixFQUFFLENBQUM7UUFDOUIsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUVKLEVBQUUsQ0FBQyx1REFBdUQsRUFBRTtZQUMxRCwrQ0FBZ0IsQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUN2QixpQkFBTSxDQUFDO2dCQUNMLGNBQWMsR0FBRyxJQUFJLDRDQUFvQixFQUFFLENBQUM7WUFDOUMsQ0FBQyxDQUFDLENBQUMsWUFBWSxDQUFDLHVFQUF1RSxDQUFDLENBQUM7UUFDM0YsQ0FBQyxDQUFDLENBQUM7UUFFSCxFQUFFLENBQUMsb0VBQW9FLEVBQUUsZUFBSyxDQUFDO1lBQzFFLCtDQUFnQixDQUFDLEVBQUMsV0FBVyxFQUFFLGtCQUFrQixFQUFDLENBQUMsQ0FBQztZQUNwRCxjQUFjLEdBQUcsSUFBSSw0Q0FBb0IsRUFBRSxDQUFDO1lBQzVDLGNBQWMsQ0FBQyxHQUFHLENBQUMsV0FBVyxDQUFDLENBQUMsSUFBSSxDQUFDLFVBQUMsSUFBSSxJQUFPLGlCQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLGtCQUFrQixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUM3RixDQUFDLENBQUMsQ0FBQyxDQUFDO1FBRVAsRUFBRSxDQUFDLHNDQUFzQyxFQUFFLGVBQUssQ0FBQztZQUM1QyxjQUFjLEdBQUcsSUFBSSw0Q0FBb0IsRUFBRSxDQUFDO1lBQzVDLGNBQWMsQ0FBQyxHQUFHLENBQUMsY0FBYyxDQUFDO2lCQUM3QixJQUFJLENBQUMsVUFBQyxJQUFJLElBQU8sTUFBTSxJQUFJLEtBQUssQ0FBQywwQkFBMEIsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO2lCQUNoRSxLQUFLLENBQUMsVUFBQyxLQUFLLElBQW9CLENBQUMsQ0FBQyxDQUFDO1FBQzFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFFUCxFQUFFLENBQUMsZ0ZBQWdGLEVBQ2hGLG1CQUFTLENBQUM7WUFDUixpQkFBTyxDQUFDLHNCQUFzQixDQUFDLEVBQUMsWUFBWSxFQUFFLENBQUMsYUFBYSxDQUFDLEVBQUMsQ0FBQyxDQUFDO1lBQ2hFLGlCQUFPLENBQUMsaUJBQWlCLEVBQUUsQ0FBQztZQUM1QixjQUFJLEVBQUUsQ0FBQztZQUVQLElBQU0sT0FBTyxHQUFHLGlCQUFPLENBQUMsZUFBZSxDQUFDLGFBQWEsQ0FBQyxDQUFDO1lBRXZELHNDQUFzQztZQUN0QyxjQUFJLEVBQUUsQ0FBQztZQUVQLGlCQUFNLENBQUMsT0FBTyxDQUFDLFlBQVksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsYUFBYSxDQUFDLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQzdFLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDVCxDQUFDLENBQUMsQ0FBQztDQUNKO0FBR0Q7SUFBQTtJQUNBLENBQUM7SUFESyxhQUFhO1FBRGxCLGdCQUFTLENBQUMsRUFBQyxRQUFRLEVBQUUsVUFBVSxFQUFFLFdBQVcsRUFBRSxXQUFXLEVBQUMsQ0FBQztPQUN0RCxhQUFhLENBQ2xCO0lBQUQsb0JBQUM7Q0FBQSxBQURELElBQ0M7QUFFRDtJQUE4QixtQ0FBVztJQUF6Qzs7SUFNQSxDQUFDO0lBTEMsaUNBQU8sR0FBUCxVQUFRLE9BQWUsRUFBRSxHQUFXO1FBQ2xDLHdEQUF3RDtRQUN4RCw4REFBOEQ7UUFDOUQsT0FBTyxHQUFHLENBQUM7SUFDYixDQUFDO0lBQ0gsc0JBQUM7QUFBRCxDQUFDLEFBTkQsQ0FBOEIsc0JBQVcsR0FNeEMifQ==