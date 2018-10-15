"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
var compiler_1 = require("@angular/compiler");
var testing_1 = require("@angular/compiler/testing");
var core_1 = require("@angular/core");
var metadata_overrider_1 = require("./metadata_overrider");
exports.COMPILER_PROVIDERS = [
    { provide: testing_1.MockPipeResolver, deps: [compiler_1.CompileReflector] },
    { provide: compiler_1.PipeResolver, useExisting: testing_1.MockPipeResolver },
    { provide: testing_1.MockDirectiveResolver, deps: [compiler_1.CompileReflector] },
    { provide: compiler_1.DirectiveResolver, useExisting: testing_1.MockDirectiveResolver },
    { provide: testing_1.MockNgModuleResolver, deps: [compiler_1.CompileReflector] },
    { provide: compiler_1.NgModuleResolver, useExisting: testing_1.MockNgModuleResolver },
];
var TestingCompilerFactoryImpl = /** @class */ (function () {
    function TestingCompilerFactoryImpl(_injector, _compilerFactory) {
        this._injector = _injector;
        this._compilerFactory = _compilerFactory;
    }
    TestingCompilerFactoryImpl.prototype.createTestingCompiler = function (options) {
        var compiler = this._compilerFactory.createCompiler(options);
        return new TestingCompilerImpl(compiler, compiler.injector.get(testing_1.MockDirectiveResolver), compiler.injector.get(testing_1.MockPipeResolver), compiler.injector.get(testing_1.MockNgModuleResolver));
    };
    return TestingCompilerFactoryImpl;
}());
exports.TestingCompilerFactoryImpl = TestingCompilerFactoryImpl;
var TestingCompilerImpl = /** @class */ (function () {
    function TestingCompilerImpl(_compiler, _directiveResolver, _pipeResolver, _moduleResolver) {
        this._compiler = _compiler;
        this._directiveResolver = _directiveResolver;
        this._pipeResolver = _pipeResolver;
        this._moduleResolver = _moduleResolver;
        this._overrider = new metadata_overrider_1.MetadataOverrider();
    }
    Object.defineProperty(TestingCompilerImpl.prototype, "injector", {
        get: function () { return this._compiler.injector; },
        enumerable: true,
        configurable: true
    });
    TestingCompilerImpl.prototype.compileModuleSync = function (moduleType) {
        return this._compiler.compileModuleSync(moduleType);
    };
    TestingCompilerImpl.prototype.compileModuleAsync = function (moduleType) {
        return this._compiler.compileModuleAsync(moduleType);
    };
    TestingCompilerImpl.prototype.compileModuleAndAllComponentsSync = function (moduleType) {
        return this._compiler.compileModuleAndAllComponentsSync(moduleType);
    };
    TestingCompilerImpl.prototype.compileModuleAndAllComponentsAsync = function (moduleType) {
        return this._compiler.compileModuleAndAllComponentsAsync(moduleType);
    };
    TestingCompilerImpl.prototype.getComponentFactory = function (component) {
        return this._compiler.getComponentFactory(component);
    };
    TestingCompilerImpl.prototype.checkOverrideAllowed = function (type) {
        if (this._compiler.hasAotSummary(type)) {
            throw new Error(core_1.ɵstringify(type) + " was AOT compiled, so its metadata cannot be changed.");
        }
    };
    TestingCompilerImpl.prototype.overrideModule = function (ngModule, override) {
        this.checkOverrideAllowed(ngModule);
        var oldMetadata = this._moduleResolver.resolve(ngModule, false);
        this._moduleResolver.setNgModule(ngModule, this._overrider.overrideMetadata(core_1.NgModule, oldMetadata, override));
        this.clearCacheFor(ngModule);
    };
    TestingCompilerImpl.prototype.overrideDirective = function (directive, override) {
        this.checkOverrideAllowed(directive);
        var oldMetadata = this._directiveResolver.resolve(directive, false);
        this._directiveResolver.setDirective(directive, this._overrider.overrideMetadata(core_1.Directive, oldMetadata, override));
        this.clearCacheFor(directive);
    };
    TestingCompilerImpl.prototype.overrideComponent = function (component, override) {
        this.checkOverrideAllowed(component);
        var oldMetadata = this._directiveResolver.resolve(component, false);
        this._directiveResolver.setDirective(component, this._overrider.overrideMetadata(core_1.Component, oldMetadata, override));
        this.clearCacheFor(component);
    };
    TestingCompilerImpl.prototype.overridePipe = function (pipe, override) {
        this.checkOverrideAllowed(pipe);
        var oldMetadata = this._pipeResolver.resolve(pipe, false);
        this._pipeResolver.setPipe(pipe, this._overrider.overrideMetadata(core_1.Pipe, oldMetadata, override));
        this.clearCacheFor(pipe);
    };
    TestingCompilerImpl.prototype.loadAotSummaries = function (summaries) { this._compiler.loadAotSummaries(summaries); };
    TestingCompilerImpl.prototype.clearCache = function () { this._compiler.clearCache(); };
    TestingCompilerImpl.prototype.clearCacheFor = function (type) { this._compiler.clearCacheFor(type); };
    TestingCompilerImpl.prototype.getComponentFromError = function (error) { return error[compiler_1.ERROR_COMPONENT_TYPE] || null; };
    TestingCompilerImpl.prototype.getModuleId = function (moduleType) {
        return this._moduleResolver.resolve(moduleType, true).id;
    };
    return TestingCompilerImpl;
}());
exports.TestingCompilerImpl = TestingCompilerImpl;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29tcGlsZXJfZmFjdG9yeS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL3BsYXRmb3JtLWJyb3dzZXItZHluYW1pYy90ZXN0aW5nL3NyYy9jb21waWxlcl9mYWN0b3J5LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7O0FBRUgsOENBQTRIO0FBQzVILHFEQUF3RztBQUN4RyxzQ0FBNFE7QUFJNVEsMkRBQXVEO0FBRTFDLFFBQUEsa0JBQWtCLEdBQXFCO0lBQ2xELEVBQUMsT0FBTyxFQUFFLDBCQUFnQixFQUFFLElBQUksRUFBRSxDQUFDLDJCQUFnQixDQUFDLEVBQUM7SUFDckQsRUFBQyxPQUFPLEVBQUUsdUJBQVksRUFBRSxXQUFXLEVBQUUsMEJBQWdCLEVBQUM7SUFDdEQsRUFBQyxPQUFPLEVBQUUsK0JBQXFCLEVBQUUsSUFBSSxFQUFFLENBQUMsMkJBQWdCLENBQUMsRUFBQztJQUMxRCxFQUFDLE9BQU8sRUFBRSw0QkFBaUIsRUFBRSxXQUFXLEVBQUUsK0JBQXFCLEVBQUM7SUFDaEUsRUFBQyxPQUFPLEVBQUUsOEJBQW9CLEVBQUUsSUFBSSxFQUFFLENBQUMsMkJBQWdCLENBQUMsRUFBQztJQUN6RCxFQUFDLE9BQU8sRUFBRSwyQkFBZ0IsRUFBRSxXQUFXLEVBQUUsOEJBQW9CLEVBQUM7Q0FDL0QsQ0FBQztBQUVGO0lBQ0Usb0NBQW9CLFNBQW1CLEVBQVUsZ0JBQWlDO1FBQTlELGNBQVMsR0FBVCxTQUFTLENBQVU7UUFBVSxxQkFBZ0IsR0FBaEIsZ0JBQWdCLENBQWlCO0lBQUcsQ0FBQztJQUV0RiwwREFBcUIsR0FBckIsVUFBc0IsT0FBMEI7UUFDOUMsSUFBTSxRQUFRLEdBQWlCLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxjQUFjLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDN0UsT0FBTyxJQUFJLG1CQUFtQixDQUMxQixRQUFRLEVBQUUsUUFBUSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsK0JBQXFCLENBQUMsRUFDdEQsUUFBUSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsMEJBQWdCLENBQUMsRUFBRSxRQUFRLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyw4QkFBb0IsQ0FBQyxDQUFDLENBQUM7SUFDNUYsQ0FBQztJQUNILGlDQUFDO0FBQUQsQ0FBQyxBQVRELElBU0M7QUFUWSxnRUFBMEI7QUFXdkM7SUFFRSw2QkFDWSxTQUF1QixFQUFVLGtCQUF5QyxFQUMxRSxhQUErQixFQUFVLGVBQXFDO1FBRDlFLGNBQVMsR0FBVCxTQUFTLENBQWM7UUFBVSx1QkFBa0IsR0FBbEIsa0JBQWtCLENBQXVCO1FBQzFFLGtCQUFhLEdBQWIsYUFBYSxDQUFrQjtRQUFVLG9CQUFlLEdBQWYsZUFBZSxDQUFzQjtRQUhsRixlQUFVLEdBQUcsSUFBSSxzQ0FBaUIsRUFBRSxDQUFDO0lBR2dELENBQUM7SUFDOUYsc0JBQUkseUNBQVE7YUFBWixjQUEyQixPQUFPLElBQUksQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQzs7O09BQUE7SUFFNUQsK0NBQWlCLEdBQWpCLFVBQXFCLFVBQW1CO1FBQ3RDLE9BQU8sSUFBSSxDQUFDLFNBQVMsQ0FBQyxpQkFBaUIsQ0FBQyxVQUFVLENBQUMsQ0FBQztJQUN0RCxDQUFDO0lBRUQsZ0RBQWtCLEdBQWxCLFVBQXNCLFVBQW1CO1FBQ3ZDLE9BQU8sSUFBSSxDQUFDLFNBQVMsQ0FBQyxrQkFBa0IsQ0FBQyxVQUFVLENBQUMsQ0FBQztJQUN2RCxDQUFDO0lBQ0QsK0RBQWlDLEdBQWpDLFVBQXFDLFVBQW1CO1FBQ3RELE9BQU8sSUFBSSxDQUFDLFNBQVMsQ0FBQyxpQ0FBaUMsQ0FBQyxVQUFVLENBQUMsQ0FBQztJQUN0RSxDQUFDO0lBRUQsZ0VBQWtDLEdBQWxDLFVBQXNDLFVBQW1CO1FBRXZELE9BQU8sSUFBSSxDQUFDLFNBQVMsQ0FBQyxrQ0FBa0MsQ0FBQyxVQUFVLENBQUMsQ0FBQztJQUN2RSxDQUFDO0lBRUQsaURBQW1CLEdBQW5CLFVBQXVCLFNBQWtCO1FBQ3ZDLE9BQU8sSUFBSSxDQUFDLFNBQVMsQ0FBQyxtQkFBbUIsQ0FBQyxTQUFTLENBQUMsQ0FBQztJQUN2RCxDQUFDO0lBRUQsa0RBQW9CLEdBQXBCLFVBQXFCLElBQWU7UUFDbEMsSUFBSSxJQUFJLENBQUMsU0FBUyxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsRUFBRTtZQUN0QyxNQUFNLElBQUksS0FBSyxDQUFJLGlCQUFVLENBQUMsSUFBSSxDQUFDLDBEQUF1RCxDQUFDLENBQUM7U0FDN0Y7SUFDSCxDQUFDO0lBRUQsNENBQWMsR0FBZCxVQUFlLFFBQW1CLEVBQUUsUUFBb0M7UUFDdEUsSUFBSSxDQUFDLG9CQUFvQixDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQ3BDLElBQU0sV0FBVyxHQUFHLElBQUksQ0FBQyxlQUFlLENBQUMsT0FBTyxDQUFDLFFBQVEsRUFBRSxLQUFLLENBQUMsQ0FBQztRQUNsRSxJQUFJLENBQUMsZUFBZSxDQUFDLFdBQVcsQ0FDNUIsUUFBUSxFQUFFLElBQUksQ0FBQyxVQUFVLENBQUMsZ0JBQWdCLENBQUMsZUFBUSxFQUFFLFdBQVcsRUFBRSxRQUFRLENBQUMsQ0FBQyxDQUFDO1FBQ2pGLElBQUksQ0FBQyxhQUFhLENBQUMsUUFBUSxDQUFDLENBQUM7SUFDL0IsQ0FBQztJQUNELCtDQUFpQixHQUFqQixVQUFrQixTQUFvQixFQUFFLFFBQXFDO1FBQzNFLElBQUksQ0FBQyxvQkFBb0IsQ0FBQyxTQUFTLENBQUMsQ0FBQztRQUNyQyxJQUFNLFdBQVcsR0FBRyxJQUFJLENBQUMsa0JBQWtCLENBQUMsT0FBTyxDQUFDLFNBQVMsRUFBRSxLQUFLLENBQUMsQ0FBQztRQUN0RSxJQUFJLENBQUMsa0JBQWtCLENBQUMsWUFBWSxDQUNoQyxTQUFTLEVBQUUsSUFBSSxDQUFDLFVBQVUsQ0FBQyxnQkFBZ0IsQ0FBQyxnQkFBUyxFQUFFLFdBQWEsRUFBRSxRQUFRLENBQUMsQ0FBQyxDQUFDO1FBQ3JGLElBQUksQ0FBQyxhQUFhLENBQUMsU0FBUyxDQUFDLENBQUM7SUFDaEMsQ0FBQztJQUNELCtDQUFpQixHQUFqQixVQUFrQixTQUFvQixFQUFFLFFBQXFDO1FBQzNFLElBQUksQ0FBQyxvQkFBb0IsQ0FBQyxTQUFTLENBQUMsQ0FBQztRQUNyQyxJQUFNLFdBQVcsR0FBRyxJQUFJLENBQUMsa0JBQWtCLENBQUMsT0FBTyxDQUFDLFNBQVMsRUFBRSxLQUFLLENBQUMsQ0FBQztRQUN0RSxJQUFJLENBQUMsa0JBQWtCLENBQUMsWUFBWSxDQUNoQyxTQUFTLEVBQUUsSUFBSSxDQUFDLFVBQVUsQ0FBQyxnQkFBZ0IsQ0FBQyxnQkFBUyxFQUFFLFdBQWEsRUFBRSxRQUFRLENBQUMsQ0FBQyxDQUFDO1FBQ3JGLElBQUksQ0FBQyxhQUFhLENBQUMsU0FBUyxDQUFDLENBQUM7SUFDaEMsQ0FBQztJQUNELDBDQUFZLEdBQVosVUFBYSxJQUFlLEVBQUUsUUFBZ0M7UUFDNUQsSUFBSSxDQUFDLG9CQUFvQixDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ2hDLElBQU0sV0FBVyxHQUFHLElBQUksQ0FBQyxhQUFhLENBQUMsT0FBTyxDQUFDLElBQUksRUFBRSxLQUFLLENBQUMsQ0FBQztRQUM1RCxJQUFJLENBQUMsYUFBYSxDQUFDLE9BQU8sQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLFVBQVUsQ0FBQyxnQkFBZ0IsQ0FBQyxXQUFJLEVBQUUsV0FBVyxFQUFFLFFBQVEsQ0FBQyxDQUFDLENBQUM7UUFDaEcsSUFBSSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUMzQixDQUFDO0lBQ0QsOENBQWdCLEdBQWhCLFVBQWlCLFNBQXNCLElBQUksSUFBSSxDQUFDLFNBQVMsQ0FBQyxnQkFBZ0IsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDeEYsd0NBQVUsR0FBVixjQUFxQixJQUFJLENBQUMsU0FBUyxDQUFDLFVBQVUsRUFBRSxDQUFDLENBQUMsQ0FBQztJQUNuRCwyQ0FBYSxHQUFiLFVBQWMsSUFBZSxJQUFJLElBQUksQ0FBQyxTQUFTLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUV0RSxtREFBcUIsR0FBckIsVUFBc0IsS0FBWSxJQUFJLE9BQVEsS0FBYSxDQUFDLCtCQUFvQixDQUFDLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQztJQUU1Rix5Q0FBVyxHQUFYLFVBQVksVUFBcUI7UUFDL0IsT0FBTyxJQUFJLENBQUMsZUFBZSxDQUFDLE9BQU8sQ0FBQyxVQUFVLEVBQUUsSUFBSSxDQUFDLENBQUMsRUFBRSxDQUFDO0lBQzNELENBQUM7SUFDSCwwQkFBQztBQUFELENBQUMsQUFyRUQsSUFxRUM7QUFyRVksa0RBQW1CIn0=