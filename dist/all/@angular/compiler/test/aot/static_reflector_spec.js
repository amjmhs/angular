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
Object.defineProperty(exports, "__esModule", { value: true });
var compiler_1 = require("@angular/compiler");
var compiler_cli_1 = require("@angular/compiler-cli");
var static_symbol_resolver_spec_1 = require("./static_symbol_resolver_spec");
describe('StaticReflector', function () {
    var noContext;
    var host;
    var symbolResolver;
    var reflector;
    function init(testData, decorators, errorRecorder, collectorOptions) {
        if (testData === void 0) { testData = DEFAULT_TEST_DATA; }
        if (decorators === void 0) { decorators = []; }
        var symbolCache = new compiler_1.StaticSymbolCache();
        host = new static_symbol_resolver_spec_1.MockStaticSymbolResolverHost(testData, collectorOptions);
        var summaryResolver = new static_symbol_resolver_spec_1.MockSummaryResolver([]);
        spyOn(summaryResolver, 'isLibraryFile').and.returnValue(false);
        symbolResolver = new compiler_1.StaticSymbolResolver(host, symbolCache, summaryResolver, errorRecorder);
        reflector = new compiler_1.StaticReflector(summaryResolver, symbolResolver, decorators, [], errorRecorder);
        noContext = reflector.getStaticSymbol('', '');
    }
    beforeEach(function () { return init(); });
    function simplify(context, value) {
        return reflector.simplify(context, value);
    }
    it('should get annotations for NgFor', function () {
        var NgFor = reflector.findDeclaration('@angular/common/src/directives/ng_for', 'NgFor');
        var annotations = reflector.annotations(NgFor);
        expect(annotations.length).toEqual(1);
        var annotation = annotations[0];
        expect(annotation.selector).toEqual('[ngFor][ngForOf]');
        expect(annotation.inputs).toEqual(['ngForTrackBy', 'ngForOf', 'ngForTemplate']);
    });
    it('should get constructor for NgFor', function () {
        var NgFor = reflector.findDeclaration('@angular/common/src/directives/ng_for', 'NgFor');
        var ViewContainerRef = reflector.findDeclaration('@angular/core', 'ViewContainerRef');
        var TemplateRef = reflector.findDeclaration('@angular/core', 'TemplateRef');
        var IterableDiffers = reflector.findDeclaration('@angular/core', 'IterableDiffers');
        var ChangeDetectorRef = reflector.findDeclaration('@angular/core', 'ChangeDetectorRef');
        var parameters = reflector.parameters(NgFor);
        expect(parameters).toEqual([
            [ViewContainerRef], [TemplateRef], [IterableDiffers], [ChangeDetectorRef]
        ]);
    });
    it('should get annotations for HeroDetailComponent', function () {
        var HeroDetailComponent = reflector.findDeclaration('src/app/hero-detail.component', 'HeroDetailComponent');
        var annotations = reflector.annotations(HeroDetailComponent);
        expect(annotations.length).toEqual(1);
        var annotation = annotations[0];
        expect(annotation.selector).toEqual('my-hero-detail');
    });
    it('should get and empty annotation list for an unknown class', function () {
        var UnknownClass = reflector.findDeclaration('src/app/app.component', 'UnknownClass');
        var annotations = reflector.annotations(UnknownClass);
        expect(annotations).toEqual([]);
    });
    it('should get and empty annotation list for a symbol with null value', function () {
        init({
            '/tmp/test.ts': "\n        export var x = null;\n      "
        });
        var annotations = reflector.annotations(reflector.getStaticSymbol('/tmp/test.ts', 'x'));
        expect(annotations).toEqual([]);
    });
    it('should get propMetadata for HeroDetailComponent', function () {
        var HeroDetailComponent = reflector.findDeclaration('src/app/hero-detail.component', 'HeroDetailComponent');
        var props = reflector.propMetadata(HeroDetailComponent);
        expect(props['hero']).toBeTruthy();
        expect(props['onMouseOver']).toEqual([compiler_1.core.createHostListener('mouseover', ['$event'])]);
    });
    it('should get an empty object from propMetadata for an unknown class', function () {
        var UnknownClass = reflector.findDeclaration('src/app/app.component', 'UnknownClass');
        var properties = reflector.propMetadata(UnknownClass);
        expect(properties).toEqual({});
    });
    it('should get empty parameters list for an unknown class ', function () {
        var UnknownClass = reflector.findDeclaration('src/app/app.component', 'UnknownClass');
        var parameters = reflector.parameters(UnknownClass);
        expect(parameters).toEqual([]);
    });
    it('should provide context for errors reported by the collector', function () {
        var SomeClass = reflector.findDeclaration('src/error-reporting', 'SomeClass');
        expect(function () { return reflector.annotations(SomeClass); })
            .toThrow(new Error("Error during template compile of 'SomeClass'\n  A reasonable error message in 'Link1'\n    'Link1' references 'Link2'\n      'Link2' references 'ErrorSym'\n        'ErrorSym' contains the error at /tmp/src/error-references.ts(13,34)."));
    });
    it('should simplify primitive into itself', function () {
        expect(simplify(noContext, 1)).toBe(1);
        expect(simplify(noContext, true)).toBe(true);
        expect(simplify(noContext, 'some value')).toBe('some value');
    });
    it('should simplify a static symbol into itself', function () {
        var staticSymbol = reflector.getStaticSymbol('', '');
        expect(simplify(noContext, staticSymbol)).toBe(staticSymbol);
    });
    it('should simplify an array into a copy of the array', function () {
        expect(simplify(noContext, [1, 2, 3])).toEqual([1, 2, 3]);
    });
    it('should simplify an object to a copy of the object', function () {
        var expr = { a: 1, b: 2, c: 3 };
        expect(simplify(noContext, expr)).toEqual(expr);
    });
    it('should simplify &&', function () {
        expect(simplify(noContext, ({ __symbolic: 'binop', operator: '&&', left: true, right: true })))
            .toBe(true);
        expect(simplify(noContext, ({ __symbolic: 'binop', operator: '&&', left: true, right: false })))
            .toBe(false);
        expect(simplify(noContext, ({ __symbolic: 'binop', operator: '&&', left: false, right: true })))
            .toBe(false);
        expect(simplify(noContext, ({ __symbolic: 'binop', operator: '&&', left: false, right: false })))
            .toBe(false);
    });
    it('should simplify ||', function () {
        expect(simplify(noContext, ({ __symbolic: 'binop', operator: '||', left: true, right: true })))
            .toBe(true);
        expect(simplify(noContext, ({ __symbolic: 'binop', operator: '||', left: true, right: false })))
            .toBe(true);
        expect(simplify(noContext, ({ __symbolic: 'binop', operator: '||', left: false, right: true })))
            .toBe(true);
        expect(simplify(noContext, ({ __symbolic: 'binop', operator: '||', left: false, right: false })))
            .toBe(false);
    });
    it('should simplify &', function () {
        expect(simplify(noContext, ({ __symbolic: 'binop', operator: '&', left: 0x22, right: 0x0F })))
            .toBe(0x22 & 0x0F);
        expect(simplify(noContext, ({ __symbolic: 'binop', operator: '&', left: 0x22, right: 0xF0 })))
            .toBe(0x22 & 0xF0);
    });
    it('should simplify |', function () {
        expect(simplify(noContext, ({ __symbolic: 'binop', operator: '|', left: 0x22, right: 0x0F })))
            .toBe(0x22 | 0x0F);
        expect(simplify(noContext, ({ __symbolic: 'binop', operator: '|', left: 0x22, right: 0xF0 })))
            .toBe(0x22 | 0xF0);
    });
    it('should simplify ^', function () {
        expect(simplify(noContext, ({ __symbolic: 'binop', operator: '|', left: 0x22, right: 0x0F })))
            .toBe(0x22 | 0x0F);
        expect(simplify(noContext, ({ __symbolic: 'binop', operator: '|', left: 0x22, right: 0xF0 })))
            .toBe(0x22 | 0xF0);
    });
    it('should simplify ==', function () {
        expect(simplify(noContext, ({ __symbolic: 'binop', operator: '==', left: 0x22, right: 0x22 })))
            .toBe(0x22 == 0x22);
        expect(simplify(noContext, ({ __symbolic: 'binop', operator: '==', left: 0x22, right: 0xF0 })))
            .toBe(0x22 == 0xF0);
    });
    it('should simplify !=', function () {
        expect(simplify(noContext, ({ __symbolic: 'binop', operator: '!=', left: 0x22, right: 0x22 })))
            .toBe(0x22 != 0x22);
        expect(simplify(noContext, ({ __symbolic: 'binop', operator: '!=', left: 0x22, right: 0xF0 })))
            .toBe(0x22 != 0xF0);
    });
    it('should simplify ===', function () {
        expect(simplify(noContext, ({ __symbolic: 'binop', operator: '===', left: 0x22, right: 0x22 })))
            .toBe(0x22 === 0x22);
        expect(simplify(noContext, ({ __symbolic: 'binop', operator: '===', left: 0x22, right: 0xF0 })))
            .toBe(0x22 === 0xF0);
    });
    it('should simplify !==', function () {
        expect(simplify(noContext, ({ __symbolic: 'binop', operator: '!==', left: 0x22, right: 0x22 })))
            .toBe(0x22 !== 0x22);
        expect(simplify(noContext, ({ __symbolic: 'binop', operator: '!==', left: 0x22, right: 0xF0 })))
            .toBe(0x22 !== 0xF0);
    });
    it('should simplify >', function () {
        expect(simplify(noContext, ({ __symbolic: 'binop', operator: '>', left: 1, right: 1 })))
            .toBe(1 > 1);
        expect(simplify(noContext, ({ __symbolic: 'binop', operator: '>', left: 1, right: 0 })))
            .toBe(1 > 0);
        expect(simplify(noContext, ({ __symbolic: 'binop', operator: '>', left: 0, right: 1 })))
            .toBe(0 > 1);
    });
    it('should simplify >=', function () {
        expect(simplify(noContext, ({ __symbolic: 'binop', operator: '>=', left: 1, right: 1 })))
            .toBe(1 >= 1);
        expect(simplify(noContext, ({ __symbolic: 'binop', operator: '>=', left: 1, right: 0 })))
            .toBe(1 >= 0);
        expect(simplify(noContext, ({ __symbolic: 'binop', operator: '>=', left: 0, right: 1 })))
            .toBe(0 >= 1);
    });
    it('should simplify <=', function () {
        expect(simplify(noContext, ({ __symbolic: 'binop', operator: '<=', left: 1, right: 1 })))
            .toBe(1 <= 1);
        expect(simplify(noContext, ({ __symbolic: 'binop', operator: '<=', left: 1, right: 0 })))
            .toBe(1 <= 0);
        expect(simplify(noContext, ({ __symbolic: 'binop', operator: '<=', left: 0, right: 1 })))
            .toBe(0 <= 1);
    });
    it('should simplify <', function () {
        expect(simplify(noContext, ({ __symbolic: 'binop', operator: '<', left: 1, right: 1 })))
            .toBe(1 < 1);
        expect(simplify(noContext, ({ __symbolic: 'binop', operator: '<', left: 1, right: 0 })))
            .toBe(1 < 0);
        expect(simplify(noContext, ({ __symbolic: 'binop', operator: '<', left: 0, right: 1 })))
            .toBe(0 < 1);
    });
    it('should simplify <<', function () {
        expect(simplify(noContext, ({ __symbolic: 'binop', operator: '<<', left: 0x55, right: 2 })))
            .toBe(0x55 << 2);
    });
    it('should simplify >>', function () {
        expect(simplify(noContext, ({ __symbolic: 'binop', operator: '>>', left: 0x55, right: 2 })))
            .toBe(0x55 >> 2);
    });
    it('should simplify +', function () {
        expect(simplify(noContext, ({ __symbolic: 'binop', operator: '+', left: 0x55, right: 2 })))
            .toBe(0x55 + 2);
    });
    it('should simplify -', function () {
        expect(simplify(noContext, ({ __symbolic: 'binop', operator: '-', left: 0x55, right: 2 })))
            .toBe(0x55 - 2);
    });
    it('should simplify *', function () {
        expect(simplify(noContext, ({ __symbolic: 'binop', operator: '*', left: 0x55, right: 2 })))
            .toBe(0x55 * 2);
    });
    it('should simplify /', function () {
        expect(simplify(noContext, ({ __symbolic: 'binop', operator: '/', left: 0x55, right: 2 })))
            .toBe(0x55 / 2);
    });
    it('should simplify %', function () {
        expect(simplify(noContext, ({ __symbolic: 'binop', operator: '%', left: 0x55, right: 2 })))
            .toBe(0x55 % 2);
    });
    it('should simplify prefix -', function () {
        expect(simplify(noContext, ({ __symbolic: 'pre', operator: '-', operand: 2 }))).toBe(-2);
    });
    it('should simplify prefix ~', function () {
        expect(simplify(noContext, ({ __symbolic: 'pre', operator: '~', operand: 2 }))).toBe(~2);
    });
    it('should simplify prefix !', function () {
        expect(simplify(noContext, ({ __symbolic: 'pre', operator: '!', operand: true }))).toBe(!true);
        expect(simplify(noContext, ({ __symbolic: 'pre', operator: '!', operand: false }))).toBe(!false);
    });
    it('should simplify an array index', function () {
        expect(simplify(noContext, ({ __symbolic: 'index', expression: [1, 2, 3], index: 2 }))).toBe(3);
    });
    it('should simplify an object index', function () {
        var expr = { __symbolic: 'select', expression: { a: 1, b: 2, c: 3 }, member: 'b' };
        expect(simplify(noContext, expr)).toBe(2);
    });
    it('should simplify a file reference', function () {
        expect(simplify(reflector.getStaticSymbol('/src/cases', ''), reflector.getStaticSymbol('/src/extern.d.ts', 's')))
            .toEqual('s');
    });
    it('should simplify a non existing reference as a static symbol', function () {
        expect(simplify(reflector.getStaticSymbol('/src/cases', ''), reflector.getStaticSymbol('/src/extern.d.ts', 'nonExisting')))
            .toEqual(reflector.getStaticSymbol('/src/extern.d.ts', 'nonExisting'));
    });
    it('should simplify a function reference as a static symbol', function () {
        expect(simplify(reflector.getStaticSymbol('/src/cases', 'myFunction'), ({ __symbolic: 'function', parameters: ['a'], value: [] })))
            .toEqual(reflector.getStaticSymbol('/src/cases', 'myFunction'));
    });
    it('should simplify values initialized with a function call', function () {
        expect(simplify(reflector.getStaticSymbol('/tmp/src/function-reference.ts', ''), reflector.getStaticSymbol('/tmp/src/function-reference.ts', 'one')))
            .toEqual(['some-value']);
        expect(simplify(reflector.getStaticSymbol('/tmp/src/function-reference.ts', ''), reflector.getStaticSymbol('/tmp/src/function-reference.ts', 'three')))
            .toEqual(3);
    });
    it('should error on direct recursive calls', function () {
        expect(function () { return simplify(reflector.getStaticSymbol('/tmp/src/function-reference.ts', 'MyComp'), reflector.getStaticSymbol('/tmp/src/function-reference.ts', 'recursion')); })
            .toThrow(new Error("Error during template compile of 'MyComp'\n  Recursion is not supported in 'recursion'\n    'recursion' references 'recursive'\n      'recursive' called 'recursive' recursively."));
    });
    it('should throw a SyntaxError without stack trace when the required resource cannot be resolved', function () {
        expect(function () { return simplify(reflector.getStaticSymbol('/tmp/src/function-reference.ts', 'AppModule'), ({
            __symbolic: 'error',
            message: 'Could not resolve ./does-not-exist.component relative to /tmp/src/function-reference.ts'
        })); })
            .toThrowError("Error during template compile of 'AppModule'\n  Could not resolve ./does-not-exist.component relative to /tmp/src/function-reference.ts.");
    });
    it('should record data about the error in the exception', function () {
        var threw = false;
        try {
            var metadata = host.getMetadataFor('/tmp/src/invalid-metadata.ts');
            expect(metadata).toBeDefined();
            var moduleMetadata = metadata[0]['metadata'];
            expect(moduleMetadata).toBeDefined();
            var classData = moduleMetadata['InvalidMetadata'];
            expect(classData).toBeDefined();
            simplify(reflector.getStaticSymbol('/tmp/src/invalid-metadata.ts', ''), classData.decorators[0].arguments);
        }
        catch (e) {
            expect(e.position).toBeDefined();
            threw = true;
        }
        expect(threw).toBe(true);
    });
    it('should error on indirect recursive calls', function () {
        expect(function () { return simplify(reflector.getStaticSymbol('/tmp/src/function-reference.ts', 'MyComp'), reflector.getStaticSymbol('/tmp/src/function-reference.ts', 'indirectRecursion')); })
            .toThrow(new Error("Error during template compile of 'MyComp'\n  Recursion is not supported in 'indirectRecursion'\n    'indirectRecursion' references 'indirectRecursion1'\n      'indirectRecursion1' references 'indirectRecursion2'\n        'indirectRecursion2' called 'indirectRecursion1' recursively."));
    });
    it('should simplify a spread expression', function () {
        expect(simplify(reflector.getStaticSymbol('/tmp/src/spread.ts', ''), reflector.getStaticSymbol('/tmp/src/spread.ts', 'spread')))
            .toEqual([0, 1, 2, 3, 4, 5]);
    });
    it('should be able to get metadata for a class containing a custom decorator', function () {
        var props = reflector.propMetadata(reflector.getStaticSymbol('/tmp/src/custom-decorator-reference.ts', 'Foo'));
        expect(props).toEqual({ foo: [] });
    });
    it('should read ctor parameters with forwardRef', function () {
        var src = '/tmp/src/forward-ref.ts';
        var dep = reflector.getStaticSymbol(src, 'Dep');
        var props = reflector.parameters(reflector.getStaticSymbol(src, 'Forward'));
        expect(props).toEqual([[dep, compiler_1.core.createInject(dep)]]);
    });
    it('should report an error for invalid function calls', function () {
        expect(function () { return reflector.annotations(reflector.getStaticSymbol('/tmp/src/invalid-calls.ts', 'MyComponent')); })
            .toThrow(new Error("/tmp/src/invalid-calls.ts(8,29): Error during template compile of 'MyComponent'\n  Function calls are not supported in decorators but 'someFunction' was called."));
    });
    it('should be able to get metadata for a class containing a static method call', function () {
        var annotations = reflector.annotations(reflector.getStaticSymbol('/tmp/src/static-method-call.ts', 'MyComponent'));
        expect(annotations.length).toBe(1);
        expect(annotations[0].providers).toEqual({ provider: 'a', useValue: 100 });
    });
    it('should be able to get metadata for a class containing a static field reference', function () {
        var annotations = reflector.annotations(reflector.getStaticSymbol('/tmp/src/static-field-reference.ts', 'Foo'));
        expect(annotations.length).toBe(1);
        expect(annotations[0].providers).toEqual([{ provider: 'a', useValue: 'Some string' }]);
    });
    it('should be able to get the metadata for a class calling a method with a conditional expression', function () {
        var annotations = reflector.annotations(reflector.getStaticSymbol('/tmp/src/static-method-call.ts', 'MyCondComponent'));
        expect(annotations.length).toBe(1);
        expect(annotations[0].providers).toEqual([
            [{ provider: 'a', useValue: '1' }], [{ provider: 'a', useValue: '2' }]
        ]);
    });
    it('should be able to get metadata for a class with nested method calls', function () {
        var annotations = reflector.annotations(reflector.getStaticSymbol('/tmp/src/static-method-call.ts', 'MyFactoryComponent'));
        expect(annotations.length).toBe(1);
        expect(annotations[0].providers).toEqual({
            provide: 'c',
            useFactory: reflector.getStaticSymbol('/tmp/src/static-method.ts', 'AnotherModule', ['someFactory'])
        });
    });
    it('should be able to get the metadata for a class calling a method with default parameters', function () {
        var annotations = reflector.annotations(reflector.getStaticSymbol('/tmp/src/static-method-call.ts', 'MyDefaultsComponent'));
        expect(annotations.length).toBe(1);
        expect(annotations[0].providers).toEqual([['a', true, false]]);
    });
    it('should be able to get metadata with a reference to a static method', function () {
        var annotations = reflector.annotations(reflector.getStaticSymbol('/tmp/src/static-method-ref.ts', 'MethodReference'));
        expect(annotations.length).toBe(1);
        expect(annotations[0].providers[0].useValue.members[0]).toEqual('staticMethod');
    });
    it('should be able to get metadata for a class calling a macro function', function () {
        var annotations = reflector.annotations(reflector.getStaticSymbol('/tmp/src/call-macro-function.ts', 'MyComponent'));
        expect(annotations.length).toBe(1);
        expect(annotations[0].providers.useValue).toBe(100);
    });
    it('should be able to get metadata for a class calling a nested macro function', function () {
        var annotations = reflector.annotations(reflector.getStaticSymbol('/tmp/src/call-macro-function.ts', 'MyComponentNested'));
        expect(annotations.length).toBe(1);
        expect(annotations[0].providers.useValue.useValue).toBe(100);
    });
    // #13605
    it('should not throw on unknown decorators', function () {
        var data = Object.create(DEFAULT_TEST_DATA);
        var file = '/tmp/src/app.component.ts';
        data[file] = "\n      import { Component } from '@angular/core';\n\n      export const enum TypeEnum {\n        type\n      }\n\n      export function MyValidationDecorator(p1: any, p2: any): any {\n        return null;\n      }\n\n      export function ValidationFunction(a1: any): any {\n        return null;\n      }\n\n      @Component({\n        selector: 'my-app',\n        template: \"<h1>Hello {{name}}</h1>\",\n      })\n      export class AppComponent  {\n        name = 'Angular';\n\n        @MyValidationDecorator( TypeEnum.type, ValidationFunction({option: 'value'}))\n        myClassProp: number;\n    }";
        init(data);
        var appComponent = reflector.getStaticSymbol(file, 'AppComponent');
        expect(function () { return reflector.propMetadata(appComponent); }).not.toThrow();
    });
    it('should not throw with an invalid extends', function () {
        var data = Object.create(DEFAULT_TEST_DATA);
        var file = '/tmp/src/invalid-component.ts';
        data[file] = "\n        import {Component} from '@angular/core';\n\n        function InvalidParent() {\n          return InvalidParent;\n        }\n\n        @Component({\n          selector: 'tmp',\n          template: '',\n        })\n        export class BadComponent extends InvalidParent() {\n\n        }\n      ";
        init(data);
        var badComponent = reflector.getStaticSymbol(file, 'BadComponent');
        expect(reflector.propMetadata(badComponent)).toEqual({});
        expect(reflector.parameters(badComponent)).toEqual([]);
        expect(reflector.hasLifecycleHook(badComponent, 'onDestroy')).toEqual(false);
    });
    it('should produce a annotation even if it contains errors', function () {
        var data = Object.create(DEFAULT_TEST_DATA);
        var file = '/tmp/src/invalid-component.ts';
        data[file] = "\n        import {Component} from '@angular/core';\n\n        @Component({\n          selector: 'tmp',\n          template: () => {},\n          providers: [1, 2, (() => {}), 3, !(() => {}), 4, 5, (() => {}) + (() => {}), 6, 7]\n        })\n        export class BadComponent {\n\n        }\n      ";
        init(data, [], function () { }, { verboseInvalidExpression: true });
        var badComponent = reflector.getStaticSymbol(file, 'BadComponent');
        var annotations = reflector.annotations(badComponent);
        var annotation = annotations[0];
        expect(annotation.selector).toEqual('tmp');
        expect(annotation.template).toBeUndefined();
        expect(annotation.providers).toEqual([1, 2, 3, 4, 5, 6, 7]);
    });
    it('should ignore unresolved calls', function () {
        var data = Object.create(DEFAULT_TEST_DATA);
        var file = '/tmp/src/invalid-component.ts';
        data[file] = "\n        import {Component} from '@angular/core';\n        import {unknown} from 'unresolved';\n\n        @Component({\n          selector: 'tmp',\n          template: () => {},\n          providers: [triggers()]\n        })\n        export class BadComponent {\n\n        }\n      ";
        init(data, [], function () { }, { verboseInvalidExpression: true });
        var badComponent = reflector.getStaticSymbol(file, 'BadComponent');
        var annotations = reflector.annotations(badComponent);
        var annotation = annotations[0];
        expect(annotation.providers).toEqual([]);
    });
    // #15424
    it('should be able to inject a ctor parameter with a @Inject and a type expression', function () {
        var data = Object.create(DEFAULT_TEST_DATA);
        var file = '/tmp/src/invalid-component.ts';
        data[file] = "\n        import {Injectable, Inject} from '@angular/core';\n\n        @Injectable()\n        export class SomeClass {\n          constructor (@Inject('some-token') a: {a: string, b: string}) {}\n        }\n      ";
        init(data);
        var someClass = reflector.getStaticSymbol(file, 'SomeClass');
        var parameters = reflector.parameters(someClass);
        expect(compiler_1.core.createInject.isTypeOf(parameters[0][0])).toBe(true);
    });
    it('should reject a ctor parameter without a @Inject and a type exprssion', function () {
        var data = Object.create(DEFAULT_TEST_DATA);
        var file = '/tmp/src/invalid-component.ts';
        data[file] = "\n        import {Injectable} from '@angular/core';\n\n        @Injectable()\n        export class SomeClass {\n          constructor (a: {a: string, b: string}) {}\n        }\n      ";
        var error = undefined;
        init(data, [], function (err, filePath) {
            expect(error).toBeUndefined();
            error = err;
        });
        var someClass = reflector.getStaticSymbol(file, 'SomeClass');
        expect(reflector.parameters(someClass)).toEqual([[]]);
        expect(error).toBeUndefined();
    });
    describe('inheritance', function () {
        var ClassDecorator = /** @class */ (function () {
            function ClassDecorator(value) {
                this.value = value;
            }
            return ClassDecorator;
        }());
        var ParamDecorator = /** @class */ (function () {
            function ParamDecorator(value) {
                this.value = value;
            }
            return ParamDecorator;
        }());
        var PropDecorator = /** @class */ (function () {
            function PropDecorator(value) {
                this.value = value;
            }
            return PropDecorator;
        }());
        function initWithDecorator(testData) {
            testData['/tmp/src/decorator.ts'] = "\n            export function ClassDecorator(): any {}\n            export function ParamDecorator(): any {}\n            export function PropDecorator(): any {}\n      ";
            init(testData, [
                { filePath: '/tmp/src/decorator.ts', name: 'ClassDecorator', ctor: ClassDecorator },
                { filePath: '/tmp/src/decorator.ts', name: 'ParamDecorator', ctor: ParamDecorator },
                { filePath: '/tmp/src/decorator.ts', name: 'PropDecorator', ctor: PropDecorator }
            ]);
        }
        it('should inherit annotations', function () {
            initWithDecorator({
                '/tmp/src/main.ts': "\n            import {ClassDecorator} from './decorator';\n\n            @ClassDecorator('parent')\n            export class Parent {}\n\n            @ClassDecorator('child')\n            export class Child extends Parent {}\n\n            export class ChildNoDecorators extends Parent {}\n\n            export class ChildInvalidParent extends a.InvalidParent {}\n          "
            });
            // Check that metadata for Parent was not changed!
            expect(reflector.annotations(reflector.getStaticSymbol('/tmp/src/main.ts', 'Parent')))
                .toEqual([new ClassDecorator('parent')]);
            expect(reflector.annotations(reflector.getStaticSymbol('/tmp/src/main.ts', 'Child')))
                .toEqual([new ClassDecorator('parent'), new ClassDecorator('child')]);
            expect(reflector.annotations(reflector.getStaticSymbol('/tmp/src/main.ts', 'ChildNoDecorators')))
                .toEqual([new ClassDecorator('parent')]);
            expect(reflector.annotations(reflector.getStaticSymbol('/tmp/src/main.ts', 'ChildInvalidParent')))
                .toEqual([]);
        });
        it('should inherit parameters', function () {
            initWithDecorator({
                '/tmp/src/main.ts': "\n            import {ParamDecorator} from './decorator';\n\n            export class A {}\n            export class B {}\n            export class C {}\n\n            export class Parent {\n              constructor(@ParamDecorator('a') a: A, @ParamDecorator('b') b: B) {}\n            }\n\n            export class Child extends Parent {}\n\n            export class ChildWithCtor extends Parent {\n              constructor(@ParamDecorator('c') c: C) {}\n            }\n\n            export class ChildInvalidParent extends a.InvalidParent {}\n          "
            });
            // Check that metadata for Parent was not changed!
            expect(reflector.parameters(reflector.getStaticSymbol('/tmp/src/main.ts', 'Parent')))
                .toEqual([
                [reflector.getStaticSymbol('/tmp/src/main.ts', 'A'), new ParamDecorator('a')],
                [reflector.getStaticSymbol('/tmp/src/main.ts', 'B'), new ParamDecorator('b')]
            ]);
            expect(reflector.parameters(reflector.getStaticSymbol('/tmp/src/main.ts', 'Child'))).toEqual([
                [reflector.getStaticSymbol('/tmp/src/main.ts', 'A'), new ParamDecorator('a')],
                [reflector.getStaticSymbol('/tmp/src/main.ts', 'B'), new ParamDecorator('b')]
            ]);
            expect(reflector.parameters(reflector.getStaticSymbol('/tmp/src/main.ts', 'ChildWithCtor')))
                .toEqual([[reflector.getStaticSymbol('/tmp/src/main.ts', 'C'), new ParamDecorator('c')]]);
            expect(reflector.parameters(reflector.getStaticSymbol('/tmp/src/main.ts', 'ChildInvalidParent')))
                .toEqual([]);
        });
        it('should inherit property metadata', function () {
            initWithDecorator({
                '/tmp/src/main.ts': "\n            import {PropDecorator} from './decorator';\n\n            export class A {}\n            export class B {}\n            export class C {}\n\n            export class Parent {\n              @PropDecorator('a')\n              a: A;\n              @PropDecorator('b1')\n              b: B;\n            }\n\n            export class Child extends Parent {\n              @PropDecorator('b2')\n              b: B;\n              @PropDecorator('c')\n              c: C;\n            }\n\n            export class ChildInvalidParent extends a.InvalidParent {}\n          "
            });
            // Check that metadata for Parent was not changed!
            expect(reflector.propMetadata(reflector.getStaticSymbol('/tmp/src/main.ts', 'Parent')))
                .toEqual({
                'a': [new PropDecorator('a')],
                'b': [new PropDecorator('b1')],
            });
            expect(reflector.propMetadata(reflector.getStaticSymbol('/tmp/src/main.ts', 'Child')))
                .toEqual({
                'a': [new PropDecorator('a')],
                'b': [new PropDecorator('b1'), new PropDecorator('b2')],
                'c': [new PropDecorator('c')]
            });
            expect(reflector.propMetadata(reflector.getStaticSymbol('/tmp/src/main.ts', 'ChildInvalidParent')))
                .toEqual({});
        });
        it('should inherit lifecycle hooks', function () {
            initWithDecorator({
                '/tmp/src/main.ts': "\n            export class Parent {\n              hook1() {}\n              hook2() {}\n            }\n\n            export class Child extends Parent {\n              hook2() {}\n              hook3() {}\n            }\n\n            export class ChildInvalidParent extends a.InvalidParent {}\n          "
            });
            function hooks(symbol, names) {
                return names.map(function (name) { return reflector.hasLifecycleHook(symbol, name); });
            }
            // Check that metadata for Parent was not changed!
            expect(hooks(reflector.getStaticSymbol('/tmp/src/main.ts', 'Parent'), [
                'hook1', 'hook2', 'hook3'
            ])).toEqual([true, true, false]);
            expect(hooks(reflector.getStaticSymbol('/tmp/src/main.ts', 'Child'), [
                'hook1', 'hook2', 'hook3'
            ])).toEqual([true, true, true]);
            expect(hooks(reflector.getStaticSymbol('/tmp/src/main.ts', 'ChildInvalidParent'), [
                'hook1', 'hook2', 'hook3'
            ])).toEqual([false, false, false]);
        });
        it('should allow inheritance from expressions', function () {
            initWithDecorator({
                '/tmp/src/main.ts': "\n            export function metaClass() { return null; };\n            export class Child extends metaClass() {}\n          "
            });
            expect(reflector.annotations(reflector.getStaticSymbol('/tmp/src/main.ts', 'Child')))
                .toEqual([]);
        });
        it('should allow inheritance from functions', function () {
            initWithDecorator({
                '/tmp/src/main.ts': "\n            export let ctor: {new(): T} = function() { return null; }\n            export class Child extends ctor {}\n          "
            });
            expect(reflector.annotations(reflector.getStaticSymbol('/tmp/src/main.ts', 'Child')))
                .toEqual([]);
        });
        it('should support constructor parameters with @Inject and an interface type', function () {
            var data = Object.create(DEFAULT_TEST_DATA);
            var file = '/tmp/src/inject_interface.ts';
            data[file] = "\n        import {Injectable, Inject} from '@angular/core';\n        import {F} from './f';\n\n        export interface InjectedInterface {\n\n        }\n\n        export class Token {}\n\n        @Injectable()\n        export class SomeClass {\n          constructor (@Inject(Token) injected: InjectedInterface, t: Token, @Inject(Token) f: F) {}\n        }\n      ";
            init(data);
            expect(reflector.parameters(reflector.getStaticSymbol(file, 'SomeClass'))[0].length)
                .toEqual(1);
        });
    });
    describe('expression lowering', function () {
        it('should be able to accept a lambda in a reference location', function () {
            var data = Object.create(DEFAULT_TEST_DATA);
            var file = '/tmp/src/my_component.ts';
            data[file] = "\n        import {Component, InjectionToken} from '@angular/core';\n\n        export const myLambda = () => [1, 2, 3];\n        export const NUMBERS = new InjectionToken<number[]>();\n\n        @Component({\n          template: '<div>{{name}}</div>',\n          providers: [{provide: NUMBERS, useFactory: myLambda}]\n        })\n        export class MyComponent {\n          name = 'Some name';\n        }\n      ";
            init(data);
            expect(reflector.annotations(reflector.getStaticSymbol(file, 'MyComponent'))[0]
                .providers[0]
                .useFactory)
                .toBe(reflector.getStaticSymbol(file, 'myLambda'));
        });
    });
    // Regression #18170
    it('should continue to aggresively evaluate enum member accessors', function () {
        var data = Object.create(DEFAULT_TEST_DATA);
        var file = '/tmp/src/my_component.ts';
        data[file] = "\n      import {Component} from '@angular/core';\n      import {intermediate} from './index';\n\n      @Component({\n        template: '<div></div>',\n        providers: [{provide: 'foo', useValue: [...intermediate]}]\n      })\n      export class MyComponent { }\n    ";
        data['/tmp/src/intermediate.ts'] = "\n      import {MyEnum} from './indirect';\n      export const intermediate = [{\n        data: {\n          c: [MyEnum.Value]\n        }\n      }];";
        data['/tmp/src/index.ts'] = "export * from './intermediate';";
        data['/tmp/src/indirect.ts'] = "export * from './consts';";
        data['/tmp/src/consts.ts'] = "\n      export enum MyEnum {\n        Value = 3\n      }\n    ";
        init(data);
        expect(reflector.annotations(reflector.getStaticSymbol(file, 'MyComponent'))[0]
            .providers[0]
            .useValue)
            .toEqual([{ data: { c: [3] } }]);
    });
    // Regression #18170
    it('should evaluate enums and statics that are 0', function () {
        var data = Object.create(DEFAULT_TEST_DATA);
        var file = '/tmp/src/my_component.ts';
        data[file] = "\n      import {Component} from '@angular/core';\n      import {provideRoutes} from './macro';\n      import {MyEnum, MyClass} from './consts';\n\n      @Component({\n        template: '<div></div>',\n        providers: [provideRoutes({\n          path: 'foo',\n          data: {\n            e: MyEnum.Value\n          }\n        })]\n      })\n      export class MyComponent { }\n    ";
        data['/tmp/src/macro.ts'] = "\n      import {ANALYZE_FOR_ENTRY_COMPONENTS, ROUTES} from '@angular/core';\n\n      export interface Route {\n        path?: string;\n        data?: any;\n      }\n      export type Routes = Route[];\n      export function provideRoutes(routes: Routes): any {\n        return [\n          {provide: ANALYZE_FOR_ENTRY_COMPONENTS, multi: true, useValue: routes},\n          {provide: ROUTES, multi: true, useValue: routes},\n        ];\n      }\n    ";
        data['/tmp/src/consts.ts'] = "\n      export enum MyEnum {\n        Value = 0,\n      }\n    ";
        init(data);
        expect(reflector.annotations(reflector.getStaticSymbol(file, 'MyComponent'))[0]
            .providers[0][0]
            .useValue)
            .toEqual({ path: 'foo', data: { e: 0 } });
    });
    // Regression #18170
    it('should eagerly evaluate enums selects', function () {
        var data = Object.create(DEFAULT_TEST_DATA);
        var file = '/tmp/src/my_component.ts';
        data[file] = "\n      import {Component} from '@angular/core';\n      import {provideRoutes} from './macro';\n      import {E} from './indirect';\n\n      @Component({\n        template: '<div></div>',\n        providers: [provideRoutes({\n          path: 'foo',\n          data: {\n            e: E.Value,\n          }\n        })]\n      })\n      export class MyComponent { }\n    ";
        data['/tmp/src/macro.ts'] = "\n      import {ANALYZE_FOR_ENTRY_COMPONENTS, ROUTES} from '@angular/core';\n\n      export interface Route {\n        path?: string;\n        data?: any;\n      }\n      export type Routes = Route[];\n      export function provideRoutes(routes: Routes): any {\n        return [\n          {provide: ANALYZE_FOR_ENTRY_COMPONENTS, multi: true, useValue: routes},\n          {provide: ROUTES, multi: true, useValue: routes},\n        ];\n      }\n    ";
        data['/tmp/src/indirect.ts'] = "\n      import {MyEnum} from './consts';\n\n      export const E = MyEnum;\n    ",
            data['/tmp/src/consts.ts'] = "\n      export enum MyEnum {\n        Value = 1,\n      }\n    ";
        init(data);
        expect(reflector.annotations(reflector.getStaticSymbol(file, 'MyComponent'))[0]
            .providers[0][0]
            .useValue)
            .toEqual({ path: 'foo', data: { e: 1 } });
    });
    // Regression #18170
    it('should aggressively evaluate array indexes', function () {
        var data = Object.create(DEFAULT_TEST_DATA);
        var file = '/tmp/src/my_component.ts';
        data[file] = "\n      import {Component} from '@angular/core';\n      import {provideRoutes} from './macro';\n      import {E} from './indirect';\n\n      @Component({\n        template: '<div></div>',\n        providers: [provideRoutes({\n          path: 'foo',\n          data: {\n            e: E[E[E[1]]],\n          }\n        })]\n      })\n      export class MyComponent { }\n    ";
        data['/tmp/src/macro.ts'] = "\n      import {ANALYZE_FOR_ENTRY_COMPONENTS, ROUTES} from '@angular/core';\n\n      export interface Route {\n        path?: string;\n        data?: any;\n      }\n      export type Routes = Route[];\n      export function provideRoutes(routes: Routes): any {\n        return [\n          {provide: ANALYZE_FOR_ENTRY_COMPONENTS, multi: true, useValue: routes},\n          {provide: ROUTES, multi: true, useValue: routes},\n        ];\n      }\n    ";
        data['/tmp/src/indirect.ts'] = "\n      import {A} from './consts';\n\n      export const E = A;\n    ",
            data['/tmp/src/consts.ts'] = "\n      export const A = [0, 1];\n    ";
        init(data);
        expect(reflector.annotations(reflector.getStaticSymbol(file, 'MyComponent'))[0]
            .providers[0][0]
            .useValue)
            .toEqual({ path: 'foo', data: { e: 1 } });
    });
    describe('resolveExternalReference', function () {
        it('should register modules names in the StaticSymbolResolver if no containingFile is given', function () {
            init({
                '/tmp/root.ts': "",
                '/tmp/a.ts': "export const x = 1;",
            });
            var symbol = reflector.resolveExternalReference({ moduleName: './a', name: 'x', runtime: null }, '/tmp/root.ts');
            expect(symbolResolver.getKnownModuleName(symbol.filePath)).toBeFalsy();
            symbol = reflector.resolveExternalReference({ moduleName: 'a', name: 'x', runtime: null });
            expect(symbolResolver.getKnownModuleName(symbol.filePath)).toBe('a');
        });
    });
    describe('formatted error reporting', function () {
        describe('function calls', function () {
            var fileName = '/tmp/src/invalid/components.ts';
            beforeEach(function () {
                var localData = {
                    '/tmp/src/invalid/function-call.ts': "\n        import {functionToCall} from 'some-module';\n        export const CALL_FUNCTION = functionToCall();\n    ",
                    '/tmp/src/invalid/indirect.ts': "\n        import {CALL_FUNCTION} from './function-call';\n\n        export const INDIRECT_CALL_FUNCTION = CALL_FUNCTION + 1;\n    ",
                    '/tmp/src/invalid/two-levels-indirect.ts': "\n        import {INDIRECT_CALL_FUNCTION} from './indirect';\n\n        export const TWO_LEVELS_INDIRECT_CALL_FUNCTION = INDIRECT_CALL_FUNCTION + 1;\n    ",
                    '/tmp/src/invalid/components.ts': "\n        import {functionToCall} from 'some-module';\n        import {Component} from '@angular/core';\n        import {CALL_FUNCTION} from './function-call';\n        import {INDIRECT_CALL_FUNCTION} from './indirect';\n        import {TWO_LEVELS_INDIRECT_CALL_FUNCTION} from './two-levels-indirect';\n\n        @Component({\n          value: functionToCall()\n        })\n        export class CallImportedFunction {}\n\n        @Component({\n          value: CALL_FUNCTION\n        })\n        export class ReferenceCalledFunction {}\n\n        @Component({\n          value: INDIRECT_CALL_FUNCTION\n        })\n        export class IndirectReferenceCalledFunction {}\n\n        @Component({\n          value: TWO_LEVELS_INDIRECT_CALL_FUNCTION\n        })\n        export class TwoLevelsIndirectReferenceCalledFunction {}\n    "
                };
                init(__assign({}, DEFAULT_TEST_DATA, localData));
            });
            it('should report a formatted error for a direct function call', function () {
                expect(function () {
                    return reflector.annotations(reflector.getStaticSymbol(fileName, 'CallImportedFunction'));
                })
                    .toThrowError("/tmp/src/invalid/components.ts(9,18): Error during template compile of 'CallImportedFunction'\n  Function calls are not supported in decorators but 'functionToCall' was called.");
            });
            it('should report a formatted error for a reference to a function call', function () {
                expect(function () {
                    return reflector.annotations(reflector.getStaticSymbol(fileName, 'ReferenceCalledFunction'));
                })
                    .toThrowError("/tmp/src/invalid/components.ts(14,18): Error during template compile of 'ReferenceCalledFunction'\n  Function calls are not supported in decorators but 'functionToCall' was called in 'CALL_FUNCTION'\n    'CALL_FUNCTION' calls 'functionToCall' at /tmp/src/invalid/function-call.ts(3,38).");
            });
            it('should report a formatted error for an indirect reference to a function call', function () {
                expect(function () {
                    return reflector.annotations(reflector.getStaticSymbol(fileName, 'IndirectReferenceCalledFunction'));
                })
                    .toThrowError("/tmp/src/invalid/components.ts(19,18): Error during template compile of 'IndirectReferenceCalledFunction'\n  Function calls are not supported in decorators but 'functionToCall' was called in 'INDIRECT_CALL_FUNCTION'\n    'INDIRECT_CALL_FUNCTION' references 'CALL_FUNCTION' at /tmp/src/invalid/indirect.ts(4,47)\n      'CALL_FUNCTION' calls 'functionToCall' at /tmp/src/invalid/function-call.ts(3,38).");
            });
            it('should report a formatted error for a double-indirect reference to a function call', function () {
                expect(function () {
                    return reflector.annotations(reflector.getStaticSymbol(fileName, 'TwoLevelsIndirectReferenceCalledFunction'));
                })
                    .toThrowError("/tmp/src/invalid/components.ts(24,18): Error during template compile of 'TwoLevelsIndirectReferenceCalledFunction'\n  Function calls are not supported in decorators but 'functionToCall' was called in 'TWO_LEVELS_INDIRECT_CALL_FUNCTION'\n    'TWO_LEVELS_INDIRECT_CALL_FUNCTION' references 'INDIRECT_CALL_FUNCTION' at /tmp/src/invalid/two-levels-indirect.ts(4,58)\n      'INDIRECT_CALL_FUNCTION' references 'CALL_FUNCTION' at /tmp/src/invalid/indirect.ts(4,47)\n        'CALL_FUNCTION' calls 'functionToCall' at /tmp/src/invalid/function-call.ts(3,38).");
            });
        });
        describe('macro functions', function () {
            var fileName = '/tmp/src/invalid/components.ts';
            beforeEach(function () {
                var localData = {
                    '/tmp/src/invalid/function-call.ts': "\n        import {functionToCall} from 'some-module';\n        export const CALL_FUNCTION = functionToCall();\n    ",
                    '/tmp/src/invalid/indirect.ts': "\n        import {CALL_FUNCTION} from './function-call';\n\n        export const INDIRECT_CALL_FUNCTION = CALL_FUNCTION + 1;\n    ",
                    '/tmp/src/invalid/macros.ts': "\n        export function someMacro(value: any) {\n          return [ { provide: 'key', value: value } ];\n        }\n    ",
                    '/tmp/src/invalid/components.ts': "\n        import {Component} from '@angular/core';\n        import {functionToCall} from 'some-module';\n        import {someMacro} from './macros';\n        import {CALL_FUNCTION} from './function-call';\n        import {INDIRECT_CALL_FUNCTION} from './indirect';\n\n        @Component({\n          template: someMacro(functionToCall())\n        })\n        export class DirectCall {}\n\n        @Component({\n          template: someMacro(CALL_FUNCTION)\n        })\n        export class IndirectCall {}\n\n        @Component({\n          template: someMacro(INDIRECT_CALL_FUNCTION)\n        })\n        export class DoubleIndirectCall {}\n    "
                };
                init(__assign({}, DEFAULT_TEST_DATA, localData));
            });
            it('should report a formatted error for a direct function call', function () {
                expect(function () {
                    return reflector.annotations(reflector.getStaticSymbol(fileName, 'DirectCall'));
                })
                    .toThrowError("/tmp/src/invalid/components.ts(9,31): Error during template compile of 'DirectCall'\n  Function calls are not supported in decorators but 'functionToCall' was called.");
            });
            it('should report a formatted error for a reference to a function call', function () {
                expect(function () {
                    return reflector.annotations(reflector.getStaticSymbol(fileName, 'IndirectCall'));
                })
                    .toThrowError("/tmp/src/invalid/components.ts(14,31): Error during template compile of 'IndirectCall'\n  Function calls are not supported in decorators but 'functionToCall' was called in 'CALL_FUNCTION'\n    'CALL_FUNCTION' calls 'functionToCall' at /tmp/src/invalid/function-call.ts(3,38).");
            });
            it('should report a formatted error for an indirect refernece to a function call', function () {
                expect(function () {
                    return reflector.annotations(reflector.getStaticSymbol(fileName, 'DoubleIndirectCall'));
                })
                    .toThrowError("/tmp/src/invalid/components.ts(19,31): Error during template compile of 'DoubleIndirectCall'\n  Function calls are not supported in decorators but 'functionToCall' was called in 'INDIRECT_CALL_FUNCTION'\n    'INDIRECT_CALL_FUNCTION' references 'CALL_FUNCTION' at /tmp/src/invalid/indirect.ts(4,47)\n      'CALL_FUNCTION' calls 'functionToCall' at /tmp/src/invalid/function-call.ts(3,38).");
            });
        });
        describe('and give advice', function () {
            // If in a reference expression, advice the user to replace with a reference.
            var fileName = '/tmp/src/invalid/components.ts';
            function collectError(symbol) {
                try {
                    reflector.annotations(reflector.getStaticSymbol(fileName, symbol));
                }
                catch (e) {
                    return e.message;
                }
                fail('Expected an exception to be thrown');
                return '';
            }
            function initWith(content) {
                var _a;
                init(__assign({}, DEFAULT_TEST_DATA, (_a = {}, _a[fileName] = "import {Component} from '@angular/core';\n" + content, _a)));
            }
            it('should advise exorting a local', function () {
                initWith("const f: string; @Component({value: f}) export class MyComp {}");
                expect(collectError('MyComp')).toContain("Consider exporting 'f'");
            });
            it('should advise export a class', function () {
                initWith('class Foo {} @Component({value: Foo}) export class MyComp {}');
                expect(collectError('MyComp')).toContain("Consider exporting 'Foo'");
            });
            it('should advise avoiding destructuring', function () {
                initWith('export const {foo, bar} = {foo: 1, bar: 2}; @Component({value: foo}) export class MyComp {}');
                expect(collectError('MyComp')).toContain("Consider simplifying to avoid destructuring");
            });
            it('should advise converting an arrow function into an exported function', function () {
                initWith('@Component({value: () => true}) export class MyComp {}');
                expect(collectError('MyComp'))
                    .toContain("Consider changing the function expression into an exported function");
            });
            it('should advise converting a function expression into an exported function', function () {
                initWith('@Component({value: function () { return true; }}) export class MyComp {}');
                expect(collectError('MyComp'))
                    .toContain("Consider changing the function expression into an exported function");
            });
        });
    });
});
var DEFAULT_TEST_DATA = {
    '/tmp/@angular/common/src/forms-deprecated/directives.d.ts': [{
            '__symbolic': 'module',
            'version': compiler_cli_1.METADATA_VERSION,
            'metadata': {
                'FORM_DIRECTIVES': [{
                        '__symbolic': 'reference',
                        'name': 'NgFor',
                        'module': '@angular/common/src/directives/ng_for'
                    }]
            }
        }],
    '/tmp/@angular/common/src/directives/ng_for.d.ts': {
        '__symbolic': 'module',
        'version': compiler_cli_1.METADATA_VERSION,
        'metadata': {
            'NgFor': {
                '__symbolic': 'class',
                'decorators': [{
                        '__symbolic': 'call',
                        'expression': { '__symbolic': 'reference', 'name': 'Directive', 'module': '@angular/core' },
                        'arguments': [{
                                'selector': '[ngFor][ngForOf]',
                                'inputs': ['ngForTrackBy', 'ngForOf', 'ngForTemplate']
                            }]
                    }],
                'members': {
                    '__ctor__': [{
                            '__symbolic': 'constructor',
                            'parameters': [
                                { '__symbolic': 'reference', 'module': '@angular/core', 'name': 'ViewContainerRef' },
                                { '__symbolic': 'reference', 'module': '@angular/core', 'name': 'TemplateRef' },
                                { '__symbolic': 'reference', 'module': '@angular/core', 'name': 'IterableDiffers' }, {
                                    '__symbolic': 'reference',
                                    'module': '@angular/core',
                                    'name': 'ChangeDetectorRef'
                                }
                            ]
                        }]
                }
            }
        }
    },
    '/tmp/@angular/core/src/linker/view_container_ref.d.ts': { version: compiler_cli_1.METADATA_VERSION, 'metadata': { 'ViewContainerRef': { '__symbolic': 'class' } } },
    '/tmp/@angular/core/src/linker/template_ref.d.ts': {
        version: compiler_cli_1.METADATA_VERSION,
        'module': './template_ref',
        'metadata': { 'TemplateRef': { '__symbolic': 'class' } }
    },
    '/tmp/@angular/core/src/change_detection/differs/iterable_differs.d.ts': { version: compiler_cli_1.METADATA_VERSION, 'metadata': { 'IterableDiffers': { '__symbolic': 'class' } } },
    '/tmp/@angular/core/src/change_detection/change_detector_ref.d.ts': { version: compiler_cli_1.METADATA_VERSION, 'metadata': { 'ChangeDetectorRef': { '__symbolic': 'class' } } },
    '/tmp/src/app/hero-detail.component.d.ts': {
        '__symbolic': 'module',
        'version': compiler_cli_1.METADATA_VERSION,
        'metadata': {
            'HeroDetailComponent': {
                '__symbolic': 'class',
                'decorators': [{
                        '__symbolic': 'call',
                        'expression': { '__symbolic': 'reference', 'name': 'Component', 'module': '@angular/core' },
                        'arguments': [{
                                'selector': 'my-hero-detail',
                                'template': '\n  <div *ngIf="hero">\n    <h2>{{hero.name}} details!</h2>\n    <div><label>id: </label>{{hero.id}}</div>\n    <div>\n      <label>name: </label>\n      <input [(ngModel)]="hero.name" placeholder="name"/>\n    </div>\n  </div>\n',
                            }]
                    }],
                'members': {
                    'hero': [{
                            '__symbolic': 'property',
                            'decorators': [{
                                    '__symbolic': 'call',
                                    'expression': { '__symbolic': 'reference', 'name': 'Input', 'module': '@angular/core' }
                                }]
                        }],
                    'onMouseOver': [{
                            '__symbolic': 'method',
                            'decorators': [{
                                    '__symbolic': 'call',
                                    'expression': { '__symbolic': 'reference', 'module': '@angular/core', 'name': 'HostListener' },
                                    'arguments': ['mouseover', ['$event']]
                                }]
                        }]
                }
            }
        }
    },
    '/src/extern.d.ts': { '__symbolic': 'module', 'version': compiler_cli_1.METADATA_VERSION, metadata: { s: 's' } },
    '/tmp/src/error-reporting.d.ts': {
        __symbolic: 'module',
        version: compiler_cli_1.METADATA_VERSION,
        metadata: {
            SomeClass: {
                __symbolic: 'class',
                decorators: [{
                        __symbolic: 'call',
                        expression: { __symbolic: 'reference', name: 'Component', module: '@angular/core' },
                        arguments: [{
                                entryComponents: [{
                                        __symbolic: 'reference',
                                        module: 'src/error-references',
                                        name: 'Link1',
                                    }]
                            }]
                    }],
            }
        }
    },
    '/tmp/src/error-references.d.ts': {
        __symbolic: 'module',
        version: compiler_cli_1.METADATA_VERSION,
        metadata: {
            Link1: { __symbolic: 'reference', module: 'src/error-references', name: 'Link2' },
            Link2: { __symbolic: 'reference', module: 'src/error-references', name: 'ErrorSym' },
            ErrorSym: { __symbolic: 'error', message: 'A reasonable error message', line: 12, character: 33 }
        }
    },
    '/tmp/src/function-declaration.d.ts': {
        __symbolic: 'module',
        version: compiler_cli_1.METADATA_VERSION,
        metadata: {
            one: {
                __symbolic: 'function',
                parameters: ['a'],
                value: [{ __symbolic: 'reference', name: 'a' }]
            },
            add: {
                __symbolic: 'function',
                parameters: ['a', 'b'],
                value: {
                    __symbolic: 'binop',
                    operator: '+',
                    left: { __symbolic: 'reference', name: 'a' },
                    right: {
                        __symbolic: 'binop',
                        operator: '+',
                        left: { __symbolic: 'reference', name: 'b' },
                        right: { __symbolic: 'reference', name: 'oneLiteral' }
                    }
                }
            },
            oneLiteral: 1
        }
    },
    '/tmp/src/function-reference.ts': {
        __symbolic: 'module',
        version: compiler_cli_1.METADATA_VERSION,
        metadata: {
            one: {
                __symbolic: 'call',
                expression: { __symbolic: 'reference', module: './function-declaration', name: 'one' },
                arguments: ['some-value']
            },
            three: {
                __symbolic: 'call',
                expression: { __symbolic: 'reference', module: './function-declaration', name: 'add' },
                arguments: [1, 1]
            },
            recursion: {
                __symbolic: 'call',
                expression: { __symbolic: 'reference', module: './function-recursive', name: 'recursive' },
                arguments: [1]
            },
            indirectRecursion: {
                __symbolic: 'call',
                expression: { __symbolic: 'reference', module: './function-recursive', name: 'indirectRecursion1' },
                arguments: [1]
            }
        }
    },
    '/tmp/src/function-recursive.d.ts': {
        __symbolic: 'modules',
        version: compiler_cli_1.METADATA_VERSION,
        metadata: {
            recursive: {
                __symbolic: 'function',
                parameters: ['a'],
                value: {
                    __symbolic: 'call',
                    expression: {
                        __symbolic: 'reference',
                        module: './function-recursive',
                        name: 'recursive',
                    },
                    arguments: [{ __symbolic: 'reference', name: 'a' }]
                }
            },
            indirectRecursion1: {
                __symbolic: 'function',
                parameters: ['a'],
                value: {
                    __symbolic: 'call',
                    expression: {
                        __symbolic: 'reference',
                        module: './function-recursive',
                        name: 'indirectRecursion2',
                    },
                    arguments: [{ __symbolic: 'reference', name: 'a' }]
                }
            },
            indirectRecursion2: {
                __symbolic: 'function',
                parameters: ['a'],
                value: {
                    __symbolic: 'call',
                    expression: {
                        __symbolic: 'reference',
                        module: './function-recursive',
                        name: 'indirectRecursion1',
                    },
                    arguments: [{ __symbolic: 'reference', name: 'a' }]
                }
            }
        },
    },
    '/tmp/src/spread.ts': {
        __symbolic: 'module',
        version: compiler_cli_1.METADATA_VERSION,
        metadata: { spread: [0, { __symbolic: 'spread', expression: [1, 2, 3, 4] }, 5] }
    },
    '/tmp/src/custom-decorator.ts': "\n        export function CustomDecorator(): any {\n          return () => {};\n        }\n      ",
    '/tmp/src/custom-decorator-reference.ts': "\n        import {CustomDecorator} from './custom-decorator';\n\n        @CustomDecorator()\n        export class Foo {\n          @CustomDecorator() get foo(): string { return ''; }\n        }\n      ",
    '/tmp/src/invalid-call-definitions.ts': "\n        export function someFunction(a: any) {\n          if (Array.isArray(a)) {\n            return a;\n          }\n          return undefined;\n        }\n      ",
    '/tmp/src/invalid-calls.ts': "\n        import {someFunction} from './nvalid-call-definitions.ts';\n        import {Component} from '@angular/core';\n        import {NgIf} from '@angular/common';\n\n        @Component({\n          selector: 'my-component',\n          entryComponents: [someFunction([NgIf])]\n        })\n        export class MyComponent {}\n\n        @someFunction()\n        @Component({\n          selector: 'my-component',\n          entryComponents: [NgIf]\n        })\n        export class MyOtherComponent { }\n      ",
    '/tmp/src/static-method.ts': "\n        import {Component} from '@angular/core/src/metadata';\n\n        @Component({\n          selector: 'stub'\n        })\n        export class MyModule {\n          static with(data: any) {\n            return { provider: 'a', useValue: data }\n          }\n          static condMethod(cond: boolean) {\n            return [{ provider: 'a', useValue: cond ? '1' : '2'}];\n          }\n          static defaultsMethod(a, b = true, c = false) {\n            return [a, b, c];\n          }\n          static withFactory() {\n            return { provide: 'c', useFactory: AnotherModule.someFactory };\n          }\n        }\n\n        export class AnotherModule {\n          static someFactory() {\n            return 'e';\n          }\n        }\n      ",
    '/tmp/src/static-method-call.ts': "\n        import {Component} from '@angular/core';\n        import {MyModule} from './static-method';\n\n        @Component({\n          providers: MyModule.with(100)\n        })\n        export class MyComponent { }\n\n        @Component({\n          providers: [MyModule.condMethod(true), MyModule.condMethod(false)]\n        })\n        export class MyCondComponent { }\n\n        @Component({\n          providers: [MyModule.defaultsMethod('a')]\n        })\n        export class MyDefaultsComponent { }\n\n        @Component({\n          providers: MyModule.withFactory()\n        })\n        export class MyFactoryComponent { }\n      ",
    '/tmp/src/static-field.ts': "\n        import {Injectable} from '@angular/core';\n\n        @Injectable()\n        export class MyModule {\n          static VALUE = 'Some string';\n        }\n      ",
    '/tmp/src/macro-function.ts': "\n        export function v(value: any) {\n          return { provide: 'a', useValue: value };\n        }\n      ",
    '/tmp/src/call-macro-function.ts': "\n        import {Component} from '@angular/core';\n        import {v} from './macro-function';\n\n        @Component({\n          providers: v(100)\n        })\n        export class MyComponent { }\n\n        @Component({\n          providers: v(v(100))\n        })\n        export class MyComponentNested { }\n      ",
    '/tmp/src/static-field-reference.ts': "\n        import {Component} from '@angular/core';\n        import {MyModule} from './static-field';\n\n        @Component({\n          providers: [ { provider: 'a', useValue: MyModule.VALUE } ]\n        })\n        export class Foo { }\n      ",
    '/tmp/src/static-method-def.ts': "\n        export class ClassWithStatics {\n          static staticMethod() {}\n        }\n      ",
    '/tmp/src/static-method-ref.ts': "\n        import {Component} from '@angular/core';\n        import {ClassWithStatics} from './static-method-def';\n\n        @Component({\n          providers: [ { provider: 'a', useValue: ClassWithStatics.staticMethod}]\n        })\n        export class MethodReference {\n\n        }\n      ",
    '/tmp/src/invalid-metadata.ts': "\n        import {Component} from '@angular/core';\n\n        @Component({\n          providers: [ { provider: 'a', useValue: (() => 1)() }]\n        })\n        export class InvalidMetadata {}\n      ",
    '/tmp/src/forward-ref.ts': "\n        import {forwardRef} from '@angular/core';\n        import {Component} from '@angular/core';\n        import {Inject} from '@angular/core';\n        @Component({})\n        export class Forward {\n          constructor(@Inject(forwardRef(() => Dep)) d: Dep) {}\n        }\n        export class Dep {\n          @Input f: Forward;\n        }\n      ",
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RhdGljX3JlZmxlY3Rvcl9zcGVjLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvY29tcGlsZXIvdGVzdC9hb3Qvc3RhdGljX3JlZmxlY3Rvcl9zcGVjLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7Ozs7Ozs7Ozs7QUFFSCw4Q0FBeUo7QUFDekosc0RBQXlFO0FBRXpFLDZFQUFnRztBQUVoRyxRQUFRLENBQUMsaUJBQWlCLEVBQUU7SUFDMUIsSUFBSSxTQUF1QixDQUFDO0lBQzVCLElBQUksSUFBOEIsQ0FBQztJQUNuQyxJQUFJLGNBQW9DLENBQUM7SUFDekMsSUFBSSxTQUEwQixDQUFDO0lBRS9CLGNBQ0ksUUFBa0QsRUFDbEQsVUFBOEQsRUFDOUQsYUFBc0QsRUFBRSxnQkFBbUM7UUFGM0YseUJBQUEsRUFBQSw0QkFBa0Q7UUFDbEQsMkJBQUEsRUFBQSxlQUE4RDtRQUVoRSxJQUFNLFdBQVcsR0FBRyxJQUFJLDRCQUFpQixFQUFFLENBQUM7UUFDNUMsSUFBSSxHQUFHLElBQUksMERBQTRCLENBQUMsUUFBUSxFQUFFLGdCQUFnQixDQUFDLENBQUM7UUFDcEUsSUFBTSxlQUFlLEdBQUcsSUFBSSxpREFBbUIsQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUNwRCxLQUFLLENBQUMsZUFBZSxFQUFFLGVBQWUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDL0QsY0FBYyxHQUFHLElBQUksK0JBQW9CLENBQUMsSUFBSSxFQUFFLFdBQVcsRUFBRSxlQUFlLEVBQUUsYUFBYSxDQUFDLENBQUM7UUFDN0YsU0FBUyxHQUFHLElBQUksMEJBQWUsQ0FBQyxlQUFlLEVBQUUsY0FBYyxFQUFFLFVBQVUsRUFBRSxFQUFFLEVBQUUsYUFBYSxDQUFDLENBQUM7UUFDaEcsU0FBUyxHQUFHLFNBQVMsQ0FBQyxlQUFlLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FB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