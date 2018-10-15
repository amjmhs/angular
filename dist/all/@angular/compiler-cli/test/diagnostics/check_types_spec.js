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
var ng = require("@angular/compiler-cli");
var fs = require("fs");
var os = require("os");
var path = require("path");
var test_support_1 = require("../test_support");
describe('ng type checker', function () {
    var errorSpy;
    var testSupport;
    function compileAndCheck(mockDirs, overrideOptions) {
        if (overrideOptions === void 0) { overrideOptions = {}; }
        testSupport.writeFiles.apply(testSupport, mockDirs);
        var fileNames = [];
        mockDirs.forEach(function (dir) {
            Object.keys(dir).forEach(function (fileName) {
                if (fileName.endsWith('.ts')) {
                    fileNames.push(path.resolve(testSupport.basePath, fileName));
                }
            });
        });
        var options = testSupport.createCompilerOptions(overrideOptions);
        var diagnostics = ng.performCompilation({ rootNames: fileNames, options: options }).diagnostics;
        return diagnostics;
    }
    beforeEach(function () {
        errorSpy = jasmine.createSpy('consoleError').and.callFake(console.error);
        testSupport = test_support_1.setup();
    });
    function accept(files, overrideOptions) {
        if (files === void 0) { files = {}; }
        if (overrideOptions === void 0) { overrideOptions = {}; }
        test_support_1.expectNoDiagnostics({}, compileAndCheck([QUICKSTART, files], overrideOptions));
    }
    function reject(message, location, files, overrideOptions) {
        if (overrideOptions === void 0) { overrideOptions = {}; }
        var diagnostics = compileAndCheck([QUICKSTART, files], overrideOptions);
        if (!diagnostics || !diagnostics.length) {
            throw new Error('Expected a diagnostic error message');
        }
        else {
            var matches = typeof message === 'string' ?
                function (d) { return ng.isNgDiagnostic(d) && d.messageText == message; } :
                function (d) { return ng.isNgDiagnostic(d) && message.test(d.messageText); };
            var matchingDiagnostics = diagnostics.filter(matches);
            if (!matchingDiagnostics || !matchingDiagnostics.length) {
                throw new Error("Expected a diagnostics matching " + message + ", received\n  " + diagnostics.map(function (d) { return d.messageText; }).join('\n  '));
            }
            if (location) {
                var span = matchingDiagnostics[0].span;
                if (!span) {
                    throw new Error('Expected a sourceSpan');
                }
                expect(span.start.file.url + "@" + span.start.line + ":" + span.start.offset).toMatch(location);
            }
        }
    }
    it('should accept unmodified QuickStart', function () { accept(); });
    it('should accept unmodified QuickStart with tests for unused variables', function () {
        accept({}, {
            strict: true,
            noUnusedLocals: true,
            noUnusedParameters: true,
        });
    });
    describe('type narrowing', function () {
        var a = function (files, options) {
            if (options === void 0) { options = {}; }
            accept(files, __assign({ fullTemplateTypeCheck: true }, options));
        };
        it('should narrow an *ngIf like directive', function () {
            a({
                'src/app.component.ts': '',
                'src/lib.ts': '',
                'src/app.module.ts': "\n        import {NgModule, Component, Directive, HostListener, TemplateRef, Input} from '@angular/core';\n\n        export interface Person {\n          name: string;\n        }\n\n        @Component({\n          selector: 'comp',\n          template: '<div *myIf=\"person\"> {{person.name}} </div>'\n        })\n        export class MainComp {\n          person?: Person;\n        }\n\n        export class MyIfContext {\n          public $implicit: any = null;\n          public myIf: any = null;\n        }\n\n        @Directive({selector: '[myIf]'})\n        export class MyIf {\n          constructor(templateRef: TemplateRef<MyIfContext>) {}\n\n          @Input()\n          set myIf(condition: any) {}\n\n          static myIfTypeGuard: <T>(v: T | null | undefined | false) => v is T;\n        }\n\n        @NgModule({\n          declarations: [MainComp, MyIf],\n        })\n        export class MainModule {}"
            });
        });
        it('should narrow a renamed *ngIf like directive', function () {
            a({
                'src/app.component.ts': '',
                'src/lib.ts': '',
                'src/app.module.ts': "\n        import {NgModule, Component, Directive, HostListener, TemplateRef, Input} from '@angular/core';\n\n        export interface Person {\n          name: string;\n        }\n\n        @Component({\n          selector: 'comp',\n          template: '<div *my-if=\"person\"> {{person.name}} </div>'\n        })\n        export class MainComp {\n          person?: Person;\n        }\n\n        export class MyIfContext {\n          public $implicit: any = null;\n          public myIf: any = null;\n        }\n\n        @Directive({selector: '[my-if]'})\n        export class MyIf {\n          constructor(templateRef: TemplateRef<MyIfContext>) {}\n\n          @Input('my-if')\n          set myIf(condition: any) {}\n\n          static myIfTypeGuard: <T>(v: T | null | undefined | false) => v is T;\n        }\n\n        @NgModule({\n          declarations: [MainComp, MyIf],\n        })\n        export class MainModule {}"
            });
        });
        it('should narrow a type in a nested *ngIf like directive', function () {
            a({
                'src/app.component.ts': '',
                'src/lib.ts': '',
                'src/app.module.ts': "\n        import {NgModule, Component, Directive, HostListener, TemplateRef, Input} from '@angular/core';\n\n        export interface Address {\n          street: string;\n        }\n\n        export interface Person {\n          name: string;\n          address?: Address;\n        }\n\n\n        @Component({\n          selector: 'comp',\n          template: '<div *myIf=\"person\"> {{person.name}} <span *myIf=\"person.address\">{{person.address.street}}</span></div>'\n        })\n        export class MainComp {\n          person?: Person;\n        }\n\n        export class MyIfContext {\n          public $implicit: any = null;\n          public myIf: any = null;\n        }\n\n        @Directive({selector: '[myIf]'})\n        export class MyIf {\n          constructor(templateRef: TemplateRef<MyIfContext>) {}\n\n          @Input()\n          set myIf(condition: any) {}\n\n          static myIfTypeGuard: <T>(v: T | null | undefined | false) => v is T;\n        }\n\n        @NgModule({\n          declarations: [MainComp, MyIf],\n        })\n        export class MainModule {}"
            });
        });
        it('should narrow an *ngIf like directive with UseIf', function () {
            a({
                'src/app.component.ts': '',
                'src/lib.ts': '',
                'src/app.module.ts': "\n        import {NgModule, Component, Directive, HostListener, TemplateRef, Input} from '@angular/core';\n\n        export interface Person {\n          name: string;\n        }\n\n        @Component({\n          selector: 'comp',\n          template: '<div *myIf=\"person\"> {{person.name}} </div>'\n        })\n        export class MainComp {\n          person?: Person;\n        }\n\n        export class MyIfContext {\n          public $implicit: any = null;\n          public myIf: any = null;\n        }\n\n        @Directive({selector: '[myIf]'})\n        export class MyIf {\n          constructor(templateRef: TemplateRef<MyIfContext>) {}\n\n          @Input()\n          set myIf(condition: any) {}\n\n          static myIfUseIfTypeGuard: void;\n        }\n\n        @NgModule({\n          declarations: [MainComp, MyIf],\n        })\n        export class MainModule {}"
            });
        });
        it('should narrow a renamed *ngIf like directive with UseIf', function () {
            a({
                'src/app.component.ts': '',
                'src/lib.ts': '',
                'src/app.module.ts': "\n        import {NgModule, Component, Directive, HostListener, TemplateRef, Input} from '@angular/core';\n\n        export interface Person {\n          name: string;\n        }\n\n        @Component({\n          selector: 'comp',\n          template: '<div *my-if=\"person\"> {{person.name}} </div>'\n        })\n        export class MainComp {\n          person?: Person;\n        }\n\n        export class MyIfContext {\n          public $implicit: any = null;\n          public myIf: any = null;\n        }\n\n        @Directive({selector: '[my-if]'})\n        export class MyIf {\n          constructor(templateRef: TemplateRef<MyIfContext>) {}\n\n          @Input('my-if')\n          set myIf(condition: any) {}\n\n          static myIfUseIfTypeGuard: void;\n        }\n\n        @NgModule({\n          declarations: [MainComp, MyIf],\n        })\n        export class MainModule {}"
            });
        });
        it('should narrow a type in a nested *ngIf like directive with UseIf', function () {
            a({
                'src/app.component.ts': '',
                'src/lib.ts': '',
                'src/app.module.ts': "\n        import {NgModule, Component, Directive, HostListener, TemplateRef, Input} from '@angular/core';\n\n        export interface Address {\n          street: string;\n        }\n\n        export interface Person {\n          name: string;\n          address?: Address;\n        }\n\n\n        @Component({\n          selector: 'comp',\n          template: '<div *myIf=\"person\"> {{person.name}} <span *myIf=\"person.address\">{{person.address.street}}</span></div>'\n        })\n        export class MainComp {\n          person?: Person;\n        }\n\n        export class MyIfContext {\n          public $implicit: any = null;\n          public myIf: any = null;\n        }\n\n        @Directive({selector: '[myIf]'})\n        export class MyIf {\n          constructor(templateRef: TemplateRef<MyIfContext>) {}\n\n          @Input()\n          set myIf(condition: any) {}\n\n          static myIfUseIfTypeGuard: void;\n        }\n\n        @NgModule({\n          declarations: [MainComp, MyIf],\n        })\n        export class MainModule {}"
            });
        });
        it('should narrow an *ngIf like directive with UseIf and &&', function () {
            a({
                'src/app.component.ts': '',
                'src/lib.ts': '',
                'src/app.module.ts': "\n        import {NgModule, Component, Directive, HostListener, TemplateRef, Input} from '@angular/core';\n\n        export interface Address {\n          street: string;\n        }\n\n        export interface Person {\n          name: string;\n        }\n\n        @Component({\n          selector: 'comp',\n          template: '<div *myIf=\"person && address\"> {{person.name}} lives at {{address.street}} </div>'\n        })\n        export class MainComp {\n          person?: Person;\n          address?: Address;\n        }\n\n        export class MyIfContext {\n          public $implicit: any = null;\n          public myIf: any = null;\n        }\n\n        @Directive({selector: '[myIf]'})\n        export class MyIf {\n          constructor(templateRef: TemplateRef<MyIfContext>) {}\n\n          @Input()\n          set myIf(condition: any) {}\n\n          static myIfUseIfTypeGuard: void;\n        }\n\n        @NgModule({\n          declarations: [MainComp, MyIf],\n        })\n        export class MainModule {}"
            });
        });
        it('should narrow an *ngIf like directive with UseIf and !!', function () {
            a({
                'src/app.component.ts': '',
                'src/lib.ts': '',
                'src/app.module.ts': "\n        import {NgModule, Component, Directive, HostListener, TemplateRef, Input} from '@angular/core';\n\n        export interface Person {\n          name: string;\n        }\n\n        @Component({\n          selector: 'comp',\n          template: '<div *myIf=\"!!person\"> {{person.name}} </div>'\n        })\n        export class MainComp {\n          person?: Person;\n        }\n\n        export class MyIfContext {\n          public $implicit: any = null;\n          public myIf: any = null;\n        }\n\n        @Directive({selector: '[myIf]'})\n        export class MyIf {\n          constructor(templateRef: TemplateRef<MyIfContext>) {}\n\n          @Input()\n          set myIf(condition: any) {}\n\n          static myIfUseIfTypeGuard: void;\n        }\n\n        @NgModule({\n          declarations: [MainComp, MyIf],\n        })\n        export class MainModule {}"
            });
        });
        it('should narrow an *ngIf like directive with UseIf and != null', function () {
            a({
                'src/app.component.ts': '',
                'src/lib.ts': '',
                'src/app.module.ts': "\n        import {NgModule, Component, Directive, HostListener, TemplateRef, Input} from '@angular/core';\n\n        export interface Person {\n          name: string;\n        }\n\n        @Component({\n          selector: 'comp',\n          template: '<div *myIf=\"person != null\"> {{person.name}} </div>'\n        })\n        export class MainComp {\n          person: Person | null = null;\n        }\n\n        export class MyIfContext {\n          public $implicit: any = null;\n          public myIf: any = null;\n        }\n\n        @Directive({selector: '[myIf]'})\n        export class MyIf {\n          constructor(templateRef: TemplateRef<MyIfContext>) {}\n\n          @Input()\n          set myIf(condition: any) {}\n\n          static myIfUseIfTypeGuard: void;\n        }\n\n        @NgModule({\n          declarations: [MainComp, MyIf],\n        })\n        export class MainModule {}"
            });
        });
        it('should narrow an *ngIf like directive with UseIf and != undefined', function () {
            a({
                'src/app.component.ts': '',
                'src/lib.ts': '',
                'src/app.module.ts': "\n        import {NgModule, Component, Directive, HostListener, TemplateRef, Input} from '@angular/core';\n\n        export interface Person {\n          name: string;\n        }\n\n        @Component({\n          selector: 'comp',\n          template: '<div *myIf=\"person != undefined\"> {{person.name}} </div>'\n        })\n        export class MainComp {\n          person?: Person;\n        }\n\n        export class MyIfContext {\n          public $implicit: any = null;\n          public myIf: any = null;\n        }\n\n        @Directive({selector: '[myIf]'})\n        export class MyIf {\n          constructor(templateRef: TemplateRef<MyIfContext>) {}\n\n          @Input()\n          set myIf(condition: any) {}\n\n          static myIfUseIfTypeGuard: void;\n        }\n\n        @NgModule({\n          declarations: [MainComp, MyIf],\n        })\n        export class MainModule {}"
            });
        });
    });
    describe('casting $any', function () {
        var a = function (files, options) {
            if (options === void 0) { options = {}; }
            accept(__assign({ 'src/app.component.ts': '', 'src/lib.ts': '' }, files), __assign({ fullTemplateTypeCheck: true }, options));
        };
        var r = function (message, location, files, options) {
            if (options === void 0) { options = {}; }
            reject(message, location, __assign({ 'src/app.component.ts': '', 'src/lib.ts': '' }, files), __assign({ fullTemplateTypeCheck: true }, options));
        };
        it('should allow member access of an expression', function () {
            a({
                'src/app.module.ts': "\n        import {NgModule, Component} from '@angular/core';\n\n        export interface Person {\n          name: string;\n        }\n\n        @Component({\n          selector: 'comp',\n          template: ' {{$any(person).address}}'\n        })\n        export class MainComp {\n          person: Person;\n        }\n\n        @NgModule({\n          declarations: [MainComp],\n        })\n        export class MainModule {\n        }"
            });
        });
        it('should allow invalid this.member access', function () {
            a({
                'src/app.module.ts': "\n        import {NgModule, Component} from '@angular/core';\n\n        @Component({\n          selector: 'comp',\n          template: ' {{$any(this).missing}}'\n        })\n        export class MainComp { }\n\n        @NgModule({\n          declarations: [MainComp],\n        })\n        export class MainModule {\n        }"
            });
        });
        it('should reject too few parameters to $any', function () {
            r(/Invalid call to \$any, expected 1 argument but received none/, null, {
                'src/app.module.ts': "\n        import {NgModule, Component} from '@angular/core';\n\n        @Component({\n          selector: 'comp',\n          template: ' {{$any().missing}}'\n        })\n        export class MainComp { }\n\n        @NgModule({\n          declarations: [MainComp],\n        })\n        export class MainModule {\n        }"
            });
        });
        it('should reject too many parameters to $any', function () {
            r(/Invalid call to \$any, expected 1 argument but received 2/, null, {
                'src/app.module.ts': "\n        import {NgModule, Component} from '@angular/core';\n\n        export interface Person {\n          name: string;\n        }\n\n        @Component({\n          selector: 'comp',\n          template: ' {{$any(person, 12).missing}}'\n        })\n        export class MainComp {\n          person: Person;\n        }\n\n        @NgModule({\n          declarations: [MainComp],\n        })\n        export class MainModule {\n        }"
            });
        });
    });
    describe('core', function () {
        var a = function (files, options) {
            if (options === void 0) { options = {}; }
            accept(files, __assign({ fullTemplateTypeCheck: true }, options));
        };
        // Regression #19905
        it('should accept an event binding', function () {
            a({
                'src/app.component.ts': '',
                'src/lib.ts': '',
                'src/app.module.ts': "\n        import {NgModule, Component, Directive, HostListener} from '@angular/core';\n\n        @Component({\n          selector: 'comp',\n          template: '<div someDir></div>'\n        })\n        export class MainComp {}\n\n        @Directive({\n          selector: '[someDir]'\n        })\n        export class SomeDirective {\n          @HostListener('click', ['$event'])\n          onClick(event: any) {}\n        }\n\n        @NgModule({\n          declarations: [MainComp, SomeDirective],\n        })\n        export class MainModule {}"
            });
        });
    });
    describe('common', function () {
        var a = function (files, options) {
            if (options === void 0) { options = {}; }
            accept(files, __assign({ fullTemplateTypeCheck: true }, options));
        };
        // Regression #19905
        it('should accept a |undefined or |null parameter for async_pipe', function () {
            a({
                'src/app.component.ts': '',
                'src/lib.ts': '',
                'src/app.module.ts': "\n        import {NgModule, Component} from '@angular/core';\n        import {CommonModule} from '@angular/common';\n\n        @Component({\n          selector: 'comp',\n          template: '<div>{{ name | async}}</div>'\n        })\n        export class MainComp {\n          name: Promise<string>|undefined;\n        }\n\n\n        @NgModule({\n          declarations: [MainComp],\n          imports: [CommonModule]\n        })\n        export class MainModule {}"
            });
        });
    });
    describe('with modified quickstart (fullTemplateTypeCheck: false)', function () {
        addTests({ fullTemplateTypeCheck: false });
    });
    describe('with modified quickstart (fullTemplateTypeCheck: true)', function () {
        addTests({ fullTemplateTypeCheck: true });
    });
    describe('regressions', function () {
        // #19485
        it('should accept if else (TemplateRef)', function () {
            accept({
                'src/app.component.html': "\n              <div class=\"text-center\" *ngIf=\"!person; else e\">\n                No person supplied.\n              </div>\n              <ng-template #e>\n                Welcome {{person.name}}!\n              <ng-template>"
            }, { fullTemplateTypeCheck: true });
        });
    });
    function addTests(config) {
        function a(template) { accept({ 'src/app.component.html': template }, config); }
        function r(template, message, location) {
            reject(message, new RegExp("app.component.html@" + location + "$"), { 'src/app.component.html': template }, config);
        }
        function rejectOnlyWithFullTemplateTypeCheck(template, message, location) {
            if (config.fullTemplateTypeCheck) {
                r(template, message, location);
            }
            else {
                a(template);
            }
        }
        it('should report an invalid field access', function () {
            r('<div>{{fame}}<div>', "Property 'fame' does not exist on type 'AppComponent'.", '0:5');
        });
        it('should reject a reference to a field of a nullable', function () { r('<div>{{maybePerson.name}}</div>', "Object is possibly 'undefined'.", '0:5'); });
        it('should accept a reference to a field of a nullable using using non-null-assert', function () { a('{{maybePerson!.name}}'); });
        it('should accept a safe property access of a nullable person', function () { a('{{maybePerson?.name}}'); });
        it('should accept using a library pipe', function () { a('{{1 | libPipe}}'); });
        it('should accept using a library directive', function () { a('<div libDir #libDir="libDir">{{libDir.name}}</div>'); });
        it('should accept a function call', function () { a('{{getName()}}'); });
        it('should reject an invalid method', function () {
            r('<div>{{getFame()}}</div>', "Property 'getFame' does not exist on type 'AppComponent'. Did you mean 'getName'?", '0:5');
        });
        it('should accept a field access of a method result', function () { a('{{getPerson().name}}'); });
        it('should reject an invalid field reference of a method result', function () {
            r('<div>{{getPerson().fame}}</div>', "Property 'fame' does not exist on type 'Person'.", '0:5');
        });
        it('should reject an access to a nullable field of a method result', function () {
            r('<div>{{getMaybePerson().name}}</div>', "Object is possibly 'undefined'.", '0:5');
        });
        it('should accept a nullable assert of a nullable field references of a method result', function () { a('{{getMaybePerson()!.name}}'); });
        it('should accept a safe property access of a nullable field reference of a method result', function () { a('{{getMaybePerson()?.name}}'); });
        it('should report an invalid field access inside of an ng-template', function () {
            rejectOnlyWithFullTemplateTypeCheck('<ng-template>{{fame}}</ng-template>', "Property 'fame' does not exist on type 'AppComponent'.", '0:13');
        });
        it('should report an invalid call to a pipe', function () {
            rejectOnlyWithFullTemplateTypeCheck('<div>{{"hello" | aPipe}}</div>', "Argument of type '\"hello\"' is not assignable to parameter of type 'number'.", '0:5');
        });
        it('should report an index into a map expression', function () {
            rejectOnlyWithFullTemplateTypeCheck('<div>{{ {a: 1}[name] }}</div>', "Element implicitly has an 'any' type because type '{ a: number; }' has no index signature.", '0:5');
        });
        it('should report an invalid property on an exportAs directive', function () {
            rejectOnlyWithFullTemplateTypeCheck('<div aDir #aDir="aDir">{{aDir.fname}}</div>', "Property 'fname' does not exist on type 'ADirective'. Did you mean 'name'?", '0:23');
        });
    }
    describe('with lowered expressions', function () {
        it('should not report lowered expressions as errors', function () { test_support_1.expectNoDiagnostics({}, compileAndCheck([LOWERING_QUICKSTART])); });
    });
});
function appComponentSource() {
    return "\n    import {Component, Pipe, Directive} from '@angular/core';\n\n    export interface Person {\n      name: string;\n      address: Address;\n    }\n\n    export interface Address {\n      street: string;\n      city: string;\n      state: string;\n      zip: string;\n    }\n\n    @Component({\n      templateUrl: './app.component.html'\n    })\n    export class AppComponent {\n      name = 'Angular';\n      person: Person;\n      people: Person[];\n      maybePerson?: Person;\n\n      getName(): string { return this.name; }\n      getPerson(): Person { return this.person; }\n      getMaybePerson(): Person | undefined { return this.maybePerson; }\n    }\n\n    @Pipe({\n      name: 'aPipe',\n    })\n    export class APipe {\n      transform(n: number): number { return n + 1; }\n    }\n\n    @Directive({\n      selector: '[aDir]',\n      exportAs: 'aDir'\n    })\n    export class ADirective {\n      name = 'ADirective';\n    }\n  ";
}
var QUICKSTART = {
    'src/app.component.ts': appComponentSource(),
    'src/app.component.html': '<h1>Hello {{name}}</h1>',
    'src/lib.ts': "\n    import {Pipe, Directive} from '@angular/core';\n\n    @Pipe({ name: 'libPipe' })\n    export class LibPipe {\n      transform(n: number): number { return n + 1; }\n    }\n\n    @Directive({\n      selector: '[libDir]',\n      exportAs: 'libDir'\n    })\n    export class LibDirective {\n      name: string;\n    }\n  ",
    'src/app.module.ts': "\n    import { NgModule }      from '@angular/core';\n    import { CommonModule }  from '@angular/common';\n    import { AppComponent, APipe, ADirective }  from './app.component';\n    import { LibDirective, LibPipe } from './lib';\n\n    @NgModule({\n      declarations: [ LibPipe, LibDirective ],\n      exports: [ LibPipe, LibDirective ],\n    })\n    export class LibModule { }\n\n    @NgModule({\n      declarations: [ AppComponent, APipe, ADirective ],\n      bootstrap:    [ AppComponent ],\n      imports:      [ LibModule, CommonModule ]\n    })\n    export class AppModule { }\n  "
};
var LOWERING_QUICKSTART = {
    'src/app.component.ts': appComponentSource(),
    'src/app.component.html': '<h1>Hello {{name}}</h1>',
    'src/app.module.ts': "\n    import { NgModule, Component }      from '@angular/core';\n\n    import { AppComponent, APipe, ADirective }  from './app.component';\n\n    class Foo {}\n\n    @Component({\n      template: '',\n      providers: [\n        {provide: 'someToken', useFactory: () => new Foo()}\n      ]\n    })\n    export class Bar {}\n\n    @NgModule({\n      declarations: [ AppComponent, APipe, ADirective, Bar ],\n      bootstrap:    [ AppComponent ]\n    })\n    export class AppModule { }\n  "
};
var tmpdir = process.env.TEST_TMPDIR || os.tmpdir();
function makeTempDir() {
    var id = (Math.random() * 1000000).toFixed(0);
    var dir = path.join(tmpdir, "tmp." + id);
    fs.mkdirSync(dir);
    return dir;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2hlY2tfdHlwZXNfc3BlYy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2NvbXBpbGVyLWNsaS90ZXN0L2RpYWdub3N0aWNzL2NoZWNrX3R5cGVzX3NwZWMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRzs7Ozs7Ozs7OztBQUVILDBDQUE0QztBQUM1Qyx1QkFBeUI7QUFDekIsdUJBQXlCO0FBQ3pCLDJCQUE2QjtBQUc3QixnREFBd0U7QUFNeEUsUUFBUSxDQUFDLGlCQUFpQixFQUFFO0lBQzFCLElBQUksUUFBMkMsQ0FBQztJQUNoRCxJQUFJLFdBQXdCLENBQUM7SUFFN0IseUJBQ0ksUUFBcUIsRUFBRSxlQUF3QztRQUF4QyxnQ0FBQSxFQUFBLG9CQUF3QztRQUNqRSxXQUFXLENBQUMsVUFBVSxPQUF0QixXQUFXLEVBQWUsUUFBUSxFQUFFO1FBQ3BDLElBQU0sU0FBUyxHQUFhLEVBQUUsQ0FBQztRQUMvQixRQUFRLENBQUMsT0FBTyxDQUFDLFVBQUMsR0FBRztZQUNuQixNQUFNLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxVQUFDLFFBQVE7Z0JBQ2hDLElBQUksUUFBUSxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsRUFBRTtvQkFDNUIsU0FBUyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLFdBQVcsQ0FBQyxRQUFRLEVBQUUsUUFBUSxDQUFDLENBQUMsQ0FBQztpQkFDOUQ7WUFDSCxDQUFDLENBQUMsQ0FBQztRQUNMLENBQUMsQ0FBQyxDQUFDO1FBQ0gsSUFBTSxPQUFPLEdBQUcsV0FBVyxDQUFDLHFCQUFxQixDQUFDLGVBQWUsQ0FBQyxDQUFDO1FBQzVELElBQUEsMkZBQVcsQ0FBMkQ7UUFDN0UsT0FBTyxXQUFXLENBQUM7SUFDckIsQ0FBQztJQUVELFVBQVUsQ0FBQztRQUNULFFBQVEsR0FBRyxPQUFPLENBQUMsU0FBUyxD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