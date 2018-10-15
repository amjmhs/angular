"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
var compiler_1 = require("@angular/compiler");
var source_map_util_1 = require("@angular/compiler/testing/src/output/source_map_util");
var resource_loader_mock_1 = require("@angular/compiler/testing/src/resource_loader_mock");
var core_1 = require("@angular/core");
var errors_1 = require("@angular/core/src/errors");
var testing_1 = require("@angular/core/testing");
{
    describe('jit source mapping', function () {
        var jitSpy;
        var resourceLoader;
        beforeEach(function () {
            // Jasmine relies on methods on `Function.prototype`, so restore the prototype on the spy.
            // Work around for: https://github.com/jasmine/jasmine/issues/1573
            // TODO: Figure out a better way to retrieve the JIT sources, without spying on `Function`.
            var originalProto = core_1.ɵglobal.Function.prototype;
            jitSpy = spyOn(core_1.ɵglobal, 'Function').and.callThrough();
            core_1.ɵglobal.Function.prototype = originalProto;
            resourceLoader = new resource_loader_mock_1.MockResourceLoader();
            testing_1.TestBed.configureCompiler({ providers: [{ provide: compiler_1.ResourceLoader, useValue: resourceLoader }] });
        });
        function getErrorLoggerStack(e) {
            var logStack = undefined;
            errors_1.getErrorLogger(e)({ error: function () { return logStack = new Error().stack; } }, e.message);
            return logStack;
        }
        function getSourceMap(genFile) {
            var jitSources = jitSpy.calls.all().map(function (call) { return call.args[call.args.length - 1]; });
            return jitSources.map(function (source) { return source_map_util_1.extractSourceMap(source); })
                .find(function (map) { return !!(map && map.file === genFile); });
        }
        function getSourcePositionForStack(stack) {
            var ngFactoryLocations = stack
                .split('\n')
                // e.g. at View_MyComp_0 (ng:///DynamicTestModule/MyComp.ngfactory.js:153:40)
                .map(function (line) { return /\((.*\.ngfactory\.js):(\d+):(\d+)/.exec(line); })
                .filter(function (match) { return !!match; })
                .map(function (match) { return ({
                file: match[1],
                line: parseInt(match[2], 10),
                column: parseInt(match[3], 10)
            }); });
            var ngFactoryLocation = ngFactoryLocations[0];
            var sourceMap = getSourceMap(ngFactoryLocation.file);
            return source_map_util_1.originalPositionFor(sourceMap, { line: ngFactoryLocation.line, column: ngFactoryLocation.column });
        }
        function compileAndCreateComponent(comType) {
            testing_1.TestBed.configureTestingModule({ declarations: [comType] });
            var error;
            testing_1.TestBed.compileComponents().catch(function (e) { return error = e; });
            if (resourceLoader.hasPendingRequests()) {
                resourceLoader.flush();
            }
            testing_1.tick();
            if (error) {
                throw error;
            }
            return testing_1.TestBed.createComponent(comType);
        }
        describe('inline templates', function () {
            var ngUrl = 'ng:///DynamicTestModule/MyComp.html';
            function templateDecorator(template) { return { template: template }; }
            declareTests({ ngUrl: ngUrl, templateDecorator: templateDecorator });
        });
        describe('external templates', function () {
            var ngUrl = 'ng:///some/url.html';
            var templateUrl = 'http://localhost:1234/some/url.html';
            function templateDecorator(template) {
                resourceLoader.expect(templateUrl, template);
                return { templateUrl: templateUrl };
            }
            declareTests({ ngUrl: ngUrl, templateDecorator: templateDecorator });
        });
        function declareTests(_a) {
            var ngUrl = _a.ngUrl, templateDecorator = _a.templateDecorator;
            it('should use the right source url in html parse errors', testing_1.fakeAsync(function () {
                var MyComp = /** @class */ (function () {
                    function MyComp() {
                    }
                    MyComp = __decorate([
                        core_1.Component(__assign({}, templateDecorator('<div>\n  </error>')))
                    ], MyComp);
                    return MyComp;
                }());
                expect(function () { return compileAndCreateComponent(MyComp); })
                    .toThrowError(new RegExp("Template parse errors[\\s\\S]*" + ngUrl.replace('$', '\\$') + "@1:2"));
            }));
            it('should use the right source url in template parse errors', testing_1.fakeAsync(function () {
                var MyComp = /** @class */ (function () {
                    function MyComp() {
                    }
                    MyComp = __decorate([
                        core_1.Component(__assign({}, templateDecorator('<div>\n  <div unknown="{{ctxProp}}"></div>')))
                    ], MyComp);
                    return MyComp;
                }());
                expect(function () { return compileAndCreateComponent(MyComp); })
                    .toThrowError(new RegExp("Template parse errors[\\s\\S]*" + ngUrl.replace('$', '\\$') + "@1:7"));
            }));
            it('should create a sourceMap for templates', testing_1.fakeAsync(function () {
                var template = "Hello World!";
                var MyComp = /** @class */ (function () {
                    function MyComp() {
                    }
                    MyComp = __decorate([
                        core_1.Component(__assign({}, templateDecorator(template)))
                    ], MyComp);
                    return MyComp;
                }());
                compileAndCreateComponent(MyComp);
                var sourceMap = getSourceMap('ng:///DynamicTestModule/MyComp.ngfactory.js');
                expect(sourceMap.sources).toEqual([
                    'ng:///DynamicTestModule/MyComp.ngfactory.js', ngUrl
                ]);
                expect(sourceMap.sourcesContent).toEqual([' ', template]);
            }));
            it('should report source location for di errors', testing_1.fakeAsync(function () {
                var template = "<div>\n    <div   someDir></div></div>";
                var MyComp = /** @class */ (function () {
                    function MyComp() {
                    }
                    MyComp = __decorate([
                        core_1.Component(__assign({}, templateDecorator(template)))
                    ], MyComp);
                    return MyComp;
                }());
                var SomeDir = /** @class */ (function () {
                    function SomeDir() {
                        throw new Error('Test');
                    }
                    SomeDir = __decorate([
                        core_1.Directive({ selector: '[someDir]' }),
                        __metadata("design:paramtypes", [])
                    ], SomeDir);
                    return SomeDir;
                }());
                testing_1.TestBed.configureTestingModule({ declarations: [SomeDir] });
                var error;
                try {
                    compileAndCreateComponent(MyComp);
                }
                catch (e) {
                    error = e;
                }
                // The error should be logged from the element
                expect(getSourcePositionForStack(getErrorLoggerStack(error))).toEqual({
                    line: 2,
                    column: 4,
                    source: ngUrl,
                });
            }));
            it('should report di errors with multiple elements and directives', testing_1.fakeAsync(function () {
                var template = "<div someDir></div><div someDir=\"throw\"></div>";
                var MyComp = /** @class */ (function () {
                    function MyComp() {
                    }
                    MyComp = __decorate([
                        core_1.Component(__assign({}, templateDecorator(template)))
                    ], MyComp);
                    return MyComp;
                }());
                var SomeDir = /** @class */ (function () {
                    function SomeDir(someDir) {
                        if (someDir === 'throw') {
                            throw new Error('Test');
                        }
                    }
                    SomeDir = __decorate([
                        core_1.Directive({ selector: '[someDir]' }),
                        __param(0, core_1.Attribute('someDir')),
                        __metadata("design:paramtypes", [String])
                    ], SomeDir);
                    return SomeDir;
                }());
                testing_1.TestBed.configureTestingModule({ declarations: [SomeDir] });
                var error;
                try {
                    compileAndCreateComponent(MyComp);
                }
                catch (e) {
                    error = e;
                }
                // The error should be logged from the 2nd-element
                expect(getSourcePositionForStack(getErrorLoggerStack(error))).toEqual({
                    line: 1,
                    column: 19,
                    source: ngUrl,
                });
            }));
            it('should report source location for binding errors', testing_1.fakeAsync(function () {
                var template = "<div>\n    <span   [title]=\"createError()\"></span></div>";
                var MyComp = /** @class */ (function () {
                    function MyComp() {
                    }
                    MyComp.prototype.createError = function () { throw new Error('Test'); };
                    MyComp = __decorate([
                        core_1.Component(__assign({}, templateDecorator(template)))
                    ], MyComp);
                    return MyComp;
                }());
                var comp = compileAndCreateComponent(MyComp);
                var error;
                try {
                    comp.detectChanges();
                }
                catch (e) {
                    error = e;
                }
                // the stack should point to the binding
                expect(getSourcePositionForStack(error.stack)).toEqual({
                    line: 2,
                    column: 12,
                    source: ngUrl,
                });
                // The error should be logged from the element
                expect(getSourcePositionForStack(getErrorLoggerStack(error))).toEqual({
                    line: 2,
                    column: 4,
                    source: ngUrl,
                });
            }));
            it('should report source location for event errors', testing_1.fakeAsync(function () {
                var template = "<div>\n    <span   (click)=\"createError()\"></span></div>";
                var MyComp = /** @class */ (function () {
                    function MyComp() {
                    }
                    MyComp.prototype.createError = function () { throw new Error('Test'); };
                    MyComp = __decorate([
                        core_1.Component(__assign({}, templateDecorator(template)))
                    ], MyComp);
                    return MyComp;
                }());
                var comp = compileAndCreateComponent(MyComp);
                var error;
                var errorHandler = testing_1.TestBed.get(core_1.ErrorHandler);
                spyOn(errorHandler, 'handleError').and.callFake(function (e) { return error = e; });
                comp.debugElement.children[0].children[0].triggerEventHandler('click', 'EVENT');
                expect(error).toBeTruthy();
                // the stack should point to the binding
                expect(getSourcePositionForStack(error.stack)).toEqual({
                    line: 2,
                    column: 12,
                    source: ngUrl,
                });
                // The error should be logged from the element
                expect(getSourcePositionForStack(getErrorLoggerStack(error))).toEqual({
                    line: 2,
                    column: 4,
                    source: ngUrl,
                });
            }));
        }
    });
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic291cmNlX21hcF9pbnRlZ3JhdGlvbl9ub2RlX29ubHlfc3BlYy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2NvcmUvdGVzdC9saW5rZXIvc291cmNlX21hcF9pbnRlZ3JhdGlvbl9ub2RlX29ubHlfc3BlYy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7OztHQU1HOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBRUgsOENBQWlEO0FBRWpELHdGQUEyRztBQUMzRywyRkFBc0Y7QUFDdEYsc0NBQXFGO0FBQ3JGLG1EQUF3RDtBQUN4RCxpREFBaUY7QUFFakY7SUFDRSxRQUFRLENBQUMsb0JBQW9CLEVBQUU7UUFDN0IsSUFBSSxNQUFtQixDQUFDO1FBQ3hCLElBQUksY0FBa0MsQ0FBQztRQUV2QyxVQUFVLENBQUM7WUFDVCwwRkFBMEY7WUFDMUYsa0VBQWtFO1lBQ2xFLDJGQUEyRjtZQUMzRixJQUFNLGFBQWEsR0FBRyxjQUFPLENBQUMsUUFBUSxDQUFDLFNBQVMsQ0FBQztZQUNqRCxNQUFNLEdBQUcsS0FBSyxDQUFDLGNBQU8sRUFBRSxVQUFVLENBQUMsQ0FBQyxHQUFHLENBQUMsV0FBVyxFQUFFLENBQUM7WUFDdEQsY0FBTyxDQUFDLFFBQVEsQ0FBQyxTQUFTLEdBQUcsYUFBYSxDQUFDO1lBRTNDLGNBQWMsR0FBRyxJQUFJLHlDQUFrQixFQUFFLENBQUM7WUFDMUMsaUJBQU8sQ0FBQyxpQkFBaUIsQ0FBQyxFQUFDLFNBQVMsRUFBRSxDQUFDLEVBQUMsT0FBTyxFQUFFLHlCQUFjLEVBQUUsUUFBUSxFQUFFLGNBQWMsRUFBQyxDQUFDLEVBQUMsQ0FBQyxDQUFDO1FBQ2hHLENBQUMsQ0FBQyxDQUFDO1FBRUgsNkJBQTZCLENBQVE7WUFDbkMsSUFBSSxRQUFRLEdBQVcsU0FBVyxDQUFDO1lBQ25DLHVCQUFjLENBQUMsQ0FBQyxDQUFDLENBQU0sRUFBQyxLQUFLLEVBQUUsY0FBTSxPQUFBLFFB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