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
var typescript_symbols_1 = require("../../src/diagnostics/typescript_symbols");
var mocks_1 = require("./mocks");
function emptyPipes() {
    return {
        size: 0,
        get: function (key) { return undefined; },
        has: function (key) { return false; },
        values: function () { return []; }
    };
}
describe('symbol query', function () {
    var program;
    var checker;
    var sourceFile;
    var query;
    var context;
    beforeEach(function () {
        var registry = ts.createDocumentRegistry(false, '/src');
        var host = new mocks_1.MockLanguageServiceHost(['/quickstart/app/app.component.ts'], QUICKSTART, '/quickstart');
        var service = ts.createLanguageService(host, registry);
        program = service.getProgram();
        checker = program.getTypeChecker();
        sourceFile = program.getSourceFile('/quickstart/app/app.component.ts');
        var options = Object.create(host.getCompilationSettings());
        options.genDir = '/dist';
        options.basePath = '/quickstart';
        var symbolResolverHost = new reflector_host_1.ReflectorHost(function () { return program; }, host, options);
        context = new mocks_1.DiagnosticContext(service, program, checker, symbolResolverHost);
        query = typescript_symbols_1.getSymbolQuery(program, checker, sourceFile, emptyPipes);
    });
    it('should be able to get undefined for an unknown symbol', function () {
        var unknownType = context.getStaticSymbol('/unkonwn/file.ts', 'UnknownType');
        var symbol = query.getTypeSymbol(unknownType);
        expect(symbol).toBeUndefined();
    });
});
describe('toSymbolTableFactory(tsVersion)', function () {
    it('should return a Map for versions of TypeScript >= 2.2 and a dictionary otherwise', function () {
        var a = { name: 'a' };
        var b = { name: 'b' };
        expect(typescript_symbols_1.toSymbolTableFactory('2.1')([a, b]) instanceof Map).toEqual(false);
        expect(typescript_symbols_1.toSymbolTableFactory('2.4')([a, b]) instanceof Map).toEqual(true);
        // Check that for the lower bound version `2.2`, toSymbolTableFactory('2.2') returns a map
        expect(typescript_symbols_1.toSymbolTableFactory('2.2')([a, b]) instanceof Map).toEqual(true);
    });
});
function appComponentSource(template) {
    return "\n    import {Component} from '@angular/core';\n\n    export interface Person {\n      name: string;\n      address: Address;\n    }\n\n    export interface Address {\n      street: string;\n      city: string;\n      state: string;\n      zip: string;\n    }\n\n    @Component({\n      template: '" + template + "'\n    })\n    export class AppComponent {\n      name = 'Angular';\n      person: Person;\n      people: Person[];\n      maybePerson?: Person;\n\n      getName(): string { return this.name; }\n      getPerson(): Person { return this.person; }\n      getMaybePerson(): Person | undefined { this.maybePerson; }\n    }\n  ";
}
var QUICKSTART = {
    quickstart: {
        app: {
            'app.component.ts': appComponentSource('<h1>Hello {{name}}</h1>'),
            'app.module.ts': "\n        import { NgModule }      from '@angular/core';\n        import { toString }      from './utils';\n\n        import { AppComponent }  from './app.component';\n\n        @NgModule({\n          declarations: [ AppComponent ],\n          bootstrap:    [ AppComponent ]\n        })\n        export class AppModule { }\n      "
        }
    }
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHlwZXNjcmlwdF9zeW1ib2xzX3NwZWMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9jb21waWxlci1jbGkvdGVzdC9kaWFnbm9zdGljcy90eXBlc2NyaXB0X3N5bWJvbHNfc3BlYy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7OztHQU1HOztBQUtILCtFQUEyRTtBQUMzRSwrQkFBaUM7QUFHakMsK0VBQThGO0FBSTlGLGlDQUFtRTtBQUVuRTtJQUNFLE9BQU87UUFDTCxJQUFJLEVBQUUsQ0FBQztRQUNQLEdBQUcsWUFBQyxHQUFXLElBQUksT0FBTyxTQUFTLENBQUMsQ0FBQyxDQUFDO1FBQ3RDLEdBQUcsWUFBQyxHQUFXLElBQUksT0FBTyxLQUFLLENBQUMsQ0FBQyxDQUFDO1FBQ2xDLE1BQU0sRUFBTixjQUFtQixPQUFPLEVBQUUsQ0FBQyxDQUFBLENBQUM7S0FDL0IsQ0FBQztBQUNKLENBQUM7QUFFRCxRQUFRLENBQUMsY0FBYyxFQUFFO0lBQ3ZCLElBQUksT0FBbUIsQ0FBQztJQUN4QixJQUFJLE9BQXVCLENBQUM7SUFDNUIsSUFBSSxVQUF5QixDQUFDO0lBQzlCLElBQUksS0FBa0IsQ0FBQztJQUN2QixJQUFJLE9BQTBCLENBQUM7SUFDL0IsVUFBVSxDQUFDO1FBQ1QsSUFBTSxRQUFRLEdBQUcsRUFBRSxDQUFDLHNCQUFzQixDQUFDLEtBQUssRUFBRSxNQUFNLENBQUMsQ0FBQztRQUMxRCxJQUFNLElBQUksR0FBRyxJQUFJLCtCQUF1QixDQUNwQyxDQUFDLGtDQUFrQyxDQUFDLEVBQUUsVUFBVSxFQUFFLGFBQWEsQ0FBQyxDQUFDO1FBQ3JFLElBQU0sT0FBTyxHQUFHLEVBQUUsQ0FBQyxxQkFBcUIsQ0FBQyxJQUFJLEVBQUUsUUFBUSxDQUFDLENBQUM7UUFDekQsT0FBTyxHQUFHLE9BQU8sQ0FBQyxVQUFVLEVBQUUsQ0FBQztRQUMvQixPQUFPLEdBQUcsT0FBTyxDQUFDLGNBQWMsRUFBRSxDQUFDO1FBQ25DLFVBQVUsR0FBRyxPQUFPLENBQUMsYUFBYSxDQUFDLGtDQUFrQyxDQUFHLENBQUM7UUFDekUsSUFBTSxPQUFPLEdBQW9CLE1BQU0sQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLHNCQUFzQixFQUFFLENBQUMsQ0FBQztRQUM5RSxPQUFPLENBQUMsTUFBTSxHQUFHLE9BQU8sQ0FBQztRQUN6QixPQUFPLENBQUMsUUFBUSxHQUFHLGFBQWEsQ0FBQztRQUNqQyxJQUFNLGtCQUFrQixHQUFHLElBQUksOEJBQWEsQ0FBQyxjQUFNLE9BQUEsT0FBTyxFQUFQLENBQU8sRUFBRSxJQUFJLEVBQUUsT0FBTyxDQUFDLENBQUM7UUFDM0UsT0FBTyxHQUFHLElBQUkseUJBQWlCLENBQUMsT0FBTyxFQUFFLE9BQU8sRUFBRSxPQUFPLEVBQUUsa0JBQWtCLENBQUMsQ0FBQztRQUMvRSxLQUFLLEdBQUcsbUNBQWMsQ0FBQyxPQUFPLEVBQUUsT0FBTyxFQUFFLFVBQVUsRUFBRSxVQUFVLENBQUMsQ0FBQztJQUNuRSxDQUFDLENBQUMsQ0FBQztJQUVILEVBQUUsQ0FBQyx1REFBdUQsRUFBRTtRQUMxRCxJQUFNLFdBQVcsR0FBRyxPQUFPLENBQUMsZUFBZSxDQUFDLGtCQUFrQixFQUFFLGFBQWEsQ0FBQyxDQUFDO1FBQy9FLElBQU0sTUFBTSxHQUFHLEtBQUssQ0FBQyxhQUFhLENBQUMsV0FBVyxDQUFDLENBQUM7UUFDaEQsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLGFBQWEsRUFBRSxDQUFDO0lBQ2pDLENBQUMsQ0FBQyxDQUFDO0FBQ0wsQ0FBQyxDQUFDLENBQUM7QUFFSCxRQUFRLENBQUMsaUNBQWlDLEVBQUU7SUFDMUMsRUFBRSxDQUFDLGtGQUFrRixFQUFFO1FBQ3JGLElBQU0sQ0FBQyxHQUFHLEVBQUUsSUFBSSxFQUFFLEdBQUcsRUFBZSxDQUFDO1FBQ3JDLElBQU0sQ0FBQyxHQUFHLEVBQUUsSUFBSSxFQUFFLEdBQUcsRUFBZSxDQUFDO1FBRXJDLE1BQU0sQ0FBQyx5Q0FBb0IsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxZQUFZLEdBQUcsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUMxRSxNQUFNLENBQUMseUNBQW9CLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsWUFBWSxHQUFHLENBQUMsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUM7UUFFekUsMEZBQTBGO1FBQzFGLE1BQU0sQ0FBQyx5Q0FBb0IsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxZQUFZLEdBQUcsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUMzRSxDQUFDLENBQUMsQ0FBQztBQUNMLENBQUMsQ0FBQyxDQUFDO0FBRUgsNEJBQTRCLFFBQWdCO0lBQzFDLE9BQU8sK1NBZ0JVLFFBQVEsc1VBWXhCLENBQUM7QUFDSixDQUFDO0FBRUQsSUFBTSxVQUFVLEdBQWM7SUFDNUIsVUFBVSxFQUFFO1FBQ1YsR0FBRyxFQUFFO1lBQ0gsa0JBQWtCLEVBQUUsa0JBQWtCLENBQUMseUJBQXlCLENBQUM7WUFDakUsZUFBZSxFQUFFLDRVQVdoQjtTQUNGO0tBQ0Y7Q0FDRixDQUFDIn0=