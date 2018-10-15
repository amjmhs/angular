"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
var reflector_host_1 = require("@angular/language-service/src/reflector_host");
var ts = require("typescript");
var expression_diagnostics_1 = require("../../src/diagnostics/expression_diagnostics");
var mocks_1 = require("./mocks");
describe('expression diagnostics', function () {
    var registry;
    var host;
    var service;
    var context;
    var type;
    beforeAll(function () {
        registry = ts.createDocumentRegistry(false, '/src');
        host = new mocks_1.MockLanguageServiceHost(['app/app.component.ts'], FILES, '/src');
        service = ts.createLanguageService(host, registry);
        var program = service.getProgram();
        var checker = program.getTypeChecker();
        var options = Object.create(host.getCompilationSettings());
        options.genDir = '/dist';
        options.basePath = '/src';
        var symbolResolverHost = new reflector_host_1.ReflectorHost(function () { return program; }, host, options);
        context = new mocks_1.DiagnosticContext(service, program, checker, symbolResolverHost);
        type = context.getStaticSymbol('app/app.component.ts', 'AppComponent');
    });
    it('should have no diagnostics in default app', function () {
        function messageToString(messageText) {
            if (typeof messageText == 'string') {
                return messageText;
            }
            else {
                if (messageText.next)
                    return messageText.messageText + messageToString(messageText.next);
                return messageText.messageText;
            }
        }
        function expectNoDiagnostics(diagnostics) {
            if (diagnostics && diagnostics.length) {
                var message = 'messages: ' + diagnostics.map(function (d) { return messageToString(d.messageText); }).join('\n');
                expect(message).toEqual('');
            }
        }
        expectNoDiagnostics(service.getCompilerOptionsDiagnostics());
        expectNoDiagnostics(service.getSyntacticDiagnostics('app/app.component.ts'));
        expectNoDiagnostics(service.getSemanticDiagnostics('app/app.component.ts'));
    });
    function accept(template) {
        var info = mocks_1.getDiagnosticTemplateInfo(context, type, 'app/app.component.html', template);
        if (info) {
            var diagnostics = expression_diagnostics_1.getTemplateExpressionDiagnostics(info);
            if (diagnostics && diagnostics.length) {
                var message = diagnostics.map(function (d) { return d.message; }).join('\n  ');
                throw new Error("Unexpected diagnostics: " + message);
            }
        }
        else {
            expect(info).toBeDefined();
        }
    }
    function reject(template, expected) {
        var info = mocks_1.getDiagnosticTemplateInfo(context, type, 'app/app.component.html', template);
        if (info) {
            var diagnostics = expression_diagnostics_1.getTemplateExpressionDiagnostics(info);
            if (diagnostics && diagnostics.length) {
                var messages = diagnostics.map(function (d) { return d.message; }).join('\n  ');
                expect(messages).toContain(expected);
            }
            else {
                throw new Error("Expected an error containing \"" + expected + " in template \"" + template + "\"");
            }
        }
        else {
            expect(info).toBeDefined();
        }
    }
    it('should accept a simple template', function () { return accept('App works!'); });
    it('should accept an interpolation', function () { return accept('App works: {{person.name.first}}'); });
    it('should reject misspelled access', function () { return reject('{{persson}}', 'Identifier \'persson\' is not defined'); });
    it('should reject access to private', function () {
        return reject('{{private_person}}', 'Identifier \'private_person\' refers to a private member');
    });
    it('should accept an *ngIf', function () { return accept('<div *ngIf="person">{{person.name.first}}</div>'); });
    it('should reject *ngIf of misspelled identifier', function () { return reject('<div *ngIf="persson">{{person.name.first}}</div>', 'Identifier \'persson\' is not defined'); });
    it('should accept an *ngFor', function () { return accept("\n      <div *ngFor=\"let p of people\">\n        {{p.name.first}} {{p.name.last}}\n      </div>\n    "); });
    it('should reject misspelled field in *ngFor', function () { return reject("\n      <div *ngFor=\"let p of people\">\n        {{p.names.first}} {{p.name.last}}\n      </div>\n    ", 'Identifier \'names\' is not defined'); });
    it('should accept an async expression', function () { return accept('{{(promised_person | async)?.name.first || ""}}'); });
    it('should reject an async misspelled field', function () { return reject('{{(promised_person | async)?.nume.first || ""}}', 'Identifier \'nume\' is not defined'); });
    it('should accept an async *ngFor', function () { return accept("\n      <div *ngFor=\"let p of promised_people | async\">\n        {{p.name.first}} {{p.name.last}}\n      </div>\n    "); });
    it('should reject misspelled field an async *ngFor', function () { return reject("\n      <div *ngFor=\"let p of promised_people | async\">\n        {{p.name.first}} {{p.nume.last}}\n      </div>\n    ", 'Identifier \'nume\' is not defined'); });
    it('should reject access to potentially undefined field', function () { return reject("<div>{{maybe_person.name.first}}", 'The expression might be null'); });
    it('should accept a safe accss to an undefined field', function () { return accept("<div>{{maybe_person?.name.first}}</div>"); });
    it('should accept a type assert to an undefined field', function () { return accept("<div>{{maybe_person!.name.first}}</div>"); });
    it('should accept a # reference', function () { return accept("\n          <form #f=\"ngForm\" novalidate>\n            <input name=\"first\" ngModel required #first=\"ngModel\">\n            <input name=\"last\" ngModel>\n            <button>Submit</button>\n          </form>\n          <p>First name value: {{ first.value }}</p>\n          <p>First name valid: {{ first.valid }}</p>\n          <p>Form value: {{ f.value | json }}</p>\n          <p>Form valid: {{ f.valid }}</p>\n    "); });
    it('should reject a misspelled field of a # reference', function () { return reject("\n          <form #f=\"ngForm\" novalidate>\n            <input name=\"first\" ngModel required #first=\"ngModel\">\n            <input name=\"last\" ngModel>\n            <button>Submit</button>\n          </form>\n          <p>First name value: {{ first.valwe }}</p>\n          <p>First name valid: {{ first.valid }}</p>\n          <p>Form value: {{ f.value | json }}</p>\n          <p>Form valid: {{ f.valid }}</p>\n    ", 'Identifier \'valwe\' is not defined'); });
    it('should accept a call to a method', function () { return accept('{{getPerson().name.first}}'); });
    it('should reject a misspelled field of a method result', function () { return reject('{{getPerson().nume.first}}', 'Identifier \'nume\' is not defined'); });
    it('should reject calling a uncallable member', function () { return reject('{{person().name.first}}', 'Member \'person\' is not callable'); });
    it('should accept an event handler', function () { return accept('<div (click)="click($event)">{{person.name.first}}</div>'); });
    it('should reject a misspelled event handler', function () { return reject('<div (click)="clack($event)">{{person.name.first}}</div>', 'Unknown method \'clack\''); });
    it('should reject an uncalled event handler', function () { return reject('<div (click)="click">{{person.name.first}}</div>', 'Unexpected callable expression'); });
    describe('with comparisons between nullable and non-nullable', function () {
        it('should accept ==', function () { return accept("<div>{{e == 1 ? 'a' : 'b'}}</div>"); });
        it('should accept ===', function () { return accept("<div>{{e === 1 ? 'a' : 'b'}}</div>"); });
        it('should accept !=', function () { return accept("<div>{{e != 1 ? 'a' : 'b'}}</div>"); });
        it('should accept !==', function () { return accept("<div>{{e !== 1 ? 'a' : 'b'}}</div>"); });
        it('should accept &&', function () { return accept("<div>{{e && 1 ? 'a' : 'b'}}</div>"); });
        it('should accept ||', function () { return accept("<div>{{e || 1 ? 'a' : 'b'}}</div>"); });
        it('should reject >', function () { return reject("<div>{{e > 1 ? 'a' : 'b'}}</div>", 'The expression might be null'); });
    });
});
var FILES = {
    'src': {
        'app': {
            'app.component.ts': "\n        import { Component, NgModule } from '@angular/core';\n        import { CommonModule } from '@angular/common';\n        import { FormsModule } from '@angular/forms';\n\n        export interface Person {\n          name: Name;\n          address: Address;\n        }\n\n        export interface Name {\n          first: string;\n          middle: string;\n          last: string;\n        }\n\n        export interface Address {\n          street: string;\n          city: string;\n          state: string;\n          zip: string;\n        }\n\n        @Component({\n          selector: 'my-app',\n          templateUrl: './app.component.html'\n        })\n        export class AppComponent {\n          person: Person;\n          people: Person[];\n          maybe_person?: Person;\n          promised_person: Promise<Person>;\n          promised_people: Promise<Person[]>;\n          private private_person: Person;\n          private private_people: Person[];\n          e?: number;\n\n          getPerson(): Person { return this.person; }\n          click() {}\n        }\n\n        @NgModule({\n          imports: [CommonModule, FormsModule],\n          declarations: [AppComponent]\n        })\n        export class AppModule {}\n      "
        }
    }
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXhwcmVzc2lvbl9kaWFnbm9zdGljc19zcGVjLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvY29tcGlsZXItY2xpL3Rlc3QvZGlhZ25vc3RpY3MvZXhwcmVzc2lvbl9kaWFnbm9zdGljc19zcGVjLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7O0FBSUgsK0VBQTJFO0FBQzNFLCtCQUFpQztBQUVqQyx1RkFBd0g7QUFJeEgsaUNBQThGO0FBRTlGLFFBQVEsQ0FBQyx3QkFBd0IsRUFBRTtJQUNqQyxJQUFJLFFBQTZCLENBQUM7SUFFbEMsSUFBSSxJQUE2QixDQUFDO0lBQ2xDLElBQUksT0FBMkIsQ0FBQztJQUNoQyxJQUFJLE9BQTBCLENBQUM7SUFDL0IsSUFBSSxJQUFrQixDQUFDO0lBRXZCLFNBQVMsQ0FBQztRQUNSLFFBQVEsR0FBRyxFQUFFLENBQUMsc0JBQXNCLENBQUMsS0FBSyxFQUFFLE1BQU0sQ0FBQyxDQUFDO1FBQ3BELElBQUksR0FBRyxJQUFJLCtCQUF1QixDQUFDLENBQUMsc0JBQXNCLENBQUMsRUFBRSxLQUFLLEVBQUUsTUFBTSxDQUFDLENBQUM7UUFDNUUsT0FBTyxHQUFHLEVBQUUsQ0FBQyxxQkFBcUIsQ0FBQyxJQUFJLEVBQUUsUUFBUSxDQUFDLENBQUM7UUFDbkQsSUFBTSxPQUFPLEdBQUcsT0FBTyxDQUFDLFVBQVUsRUFBRSxDQUFDO1FBQ3JDLElBQU0sT0FBTyxHQUFHLE9BQU8sQ0FBQyxjQUFjLEVBQUUsQ0FBQztRQUN6QyxJQUFNLE9BQU8sR0FBb0IsTUFBTSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsc0JBQXNCLEVBQUUsQ0FBQyxDQUFDO1FBQzlFLE9BQU8sQ0FBQyxNQUFNLEdBQUcsT0FBTyxDQUFDO1FBQ3pCLE9BQU8sQ0FBQyxRQUFRLEdBQUcsTUFBTSxDQUFDO1FBQzFCLElBQU0sa0JBQWtCLEdBQUcsSUFBSSw4QkFBYSxDQUFDLGNB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