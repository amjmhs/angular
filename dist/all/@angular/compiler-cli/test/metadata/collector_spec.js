"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
var ts = require("typescript");
var collector_1 = require("../../src/metadata/collector");
var schema_1 = require("../../src/metadata/schema");
var typescript_mocks_1 = require("./typescript.mocks");
describe('Collector', function () {
    var documentRegistry = ts.createDocumentRegistry();
    var host;
    var service;
    var program;
    var collector;
    beforeEach(function () {
        host = new typescript_mocks_1.Host(FILES, [
            '/app/app.component.ts', '/app/cases-data.ts',
            '/app/error-cases.ts', '/promise.ts',
            '/unsupported-1.ts', '/unsupported-2.ts',
            '/unsupported-3.ts', 'class-arity.ts',
            'declarations.d.ts', 'import-star.ts',
            'exported-classes.ts', 'exported-functions.ts',
            'exported-enum.ts', 'exported-type.ts',
            'exported-consts.ts', 'local-symbol-ref.ts',
            'local-function-ref.ts', 'local-symbol-ref-func.ts',
            'private-enum.ts', 're-exports.ts',
            're-exports-2.ts', 'export-as.d.ts',
            'named-module.d.ts', 'static-field-reference.ts',
            'static-method.ts', 'static-method-call.ts',
            'static-method-with-if.ts', 'static-method-with-default.ts',
            'class-inheritance.ts', 'class-inheritance-parent.ts',
            'interface-reference.ts'
        ]);
        service = ts.createLanguageService(host, documentRegistry);
        program = service.getProgram();
        collector = new collector_1.MetadataCollector({ quotedNames: true });
    });
    it('should not have errors in test data', function () { typescript_mocks_1.expectValidSources(service, program); });
    it('should return undefined for modules that have no metadata', function () {
        var sourceFile = program.getSourceFile('app/empty.ts');
        var metadata = collector.getMetadata(sourceFile);
        expect(metadata).toBeUndefined();
    });
    it('should treat all symbols of .d.ts files as exported', function () {
        var sourceFile = program.getSourceFile('declarations.d.ts');
        var metadata = collector.getMetadata(sourceFile);
        expect(metadata).toEqual({
            __symbolic: 'module',
            version: schema_1.METADATA_VERSION,
            metadata: {
                DeclaredClass: { __symbolic: 'class' },
                declaredFn: { __symbolic: 'function' },
            }
        });
    });
    it('should return an interface reference for types', function () {
        var sourceFile = program.getSourceFile('/exported-type.ts');
        var metadata = collector.getMetadata(sourceFile);
        expect(metadata).toEqual({
            __symbolic: 'module',
            version: schema_1.METADATA_VERSION,
            metadata: { SomeType: { __symbolic: 'interface' } }
        });
    });
    it('should return an interface reference for interfaces', function () {
        var sourceFile = program.getSourceFile('app/hero.ts');
        var metadata = collector.getMetadata(sourceFile);
        expect(metadata).toEqual({
            __symbolic: 'module',
            version: schema_1.METADATA_VERSION,
            metadata: { Hero: { __symbolic: 'interface' } }
        });
    });
    it('should preserve module names from TypeScript sources', function () {
        var sourceFile = program.getSourceFile('named-module.d.ts');
        var metadata = collector.getMetadata(sourceFile);
        expect(metadata['importAs']).toEqual('some-named-module');
    });
    it('should be able to collect a simple component\'s metadata', function () {
        var sourceFile = program.getSourceFile('app/hero-detail.component.ts');
        var metadata = collector.getMetadata(sourceFile);
        expect(metadata).toEqual({
            __symbolic: 'module',
            version: schema_1.METADATA_VERSION,
            metadata: {
                HeroDetailComponent: {
                    __symbolic: 'class',
                    decorators: [{
                            __symbolic: 'call',
                            expression: {
                                __symbolic: 'reference',
                                module: 'angular2/core',
                                name: 'Component',
                                line: 4,
                                character: 7
                            },
                            arguments: [{
                                    selector: 'my-hero-detail',
                                    template: "\n        <div *ngIf=\"hero\">\n          <h2>{{hero.name}} details!</h2>\n          <div><label>id: </label>{{hero.id}}</div>\n          <div>\n            <label>name: </label>\n            <input [(ngModel)]=\"hero.name\" placeholder=\"name\"/>\n          </div>\n        </div>\n      "
                                }]
                        }],
                    members: {
                        hero: [{
                                __symbolic: 'property',
                                decorators: [{
                                        __symbolic: 'call',
                                        expression: {
                                            __symbolic: 'reference',
                                            module: 'angular2/core',
                                            name: 'Input',
                                            line: 18,
                                            character: 9
                                        }
                                    }]
                            }]
                    }
                }
            }
        });
    });
    it('should be able to get a more complicated component\'s metadata', function () {
        var sourceFile = program.getSourceFile('/app/app.component.ts');
        var metadata = collector.getMetadata(sourceFile);
        expect(metadata).toEqual({
            __symbolic: 'module',
            version: schema_1.METADATA_VERSION,
            metadata: {
                AppComponent: {
                    __symbolic: 'class',
                    decorators: [{
                            __symbolic: 'call',
                            expression: {
                                __symbolic: 'reference',
                                module: 'angular2/core',
                                name: 'Component',
                                line: 9,
                                character: 7
                            },
                            arguments: [{
                                    selector: 'my-app',
                                    template: "\n        <h2>My Heroes</h2>\n        <ul class=\"heroes\">\n          <li *ngFor=\"#hero of heroes\"\n            (click)=\"onSelect(hero)\"\n            [class.selected]=\"hero === selectedHero\">\n            <span class=\"badge\">{{hero.id | lowercase}}</span> {{hero.name | uppercase}}\n          </li>\n        </ul>\n        <my-hero-detail [hero]=\"selectedHero\"></my-hero-detail>\n        ",
                                    directives: [
                                        {
                                            __symbolic: 'reference',
                                            module: './hero-detail.component',
                                            name: 'HeroDetailComponent',
                                            line: 22,
                                            character: 21
                                        },
                                        {
                                            __symbolic: 'reference',
                                            module: 'angular2/common',
                                            name: 'NgFor',
                                            line: 22,
                                            character: 42
                                        }
                                    ],
                                    providers: [{
                                            __symbolic: 'reference',
                                            module: './hero.service',
                                            default: true,
                                            line: 23,
                                            character: 20
                                        }],
                                    pipes: [
                                        {
                                            __symbolic: 'reference',
                                            module: 'angular2/common',
                                            name: 'LowerCasePipe',
                                            line: 24,
                                            character: 16
                                        },
                                        {
                                            __symbolic: 'reference',
                                            module: 'angular2/common',
                                            name: 'UpperCasePipe',
                                            line: 24,
                                            character: 38
                                        }
                                    ]
                                }]
                        }],
                    members: {
                        __ctor__: [{
                                __symbolic: 'constructor',
                                parameters: [{
                                        __symbolic: 'reference',
                                        module: './hero.service',
                                        default: true,
                                        line: 31,
                                        character: 42
                                    }]
                            }],
                        onSelect: [{ __symbolic: 'method' }],
                        ngOnInit: [{ __symbolic: 'method' }],
                        getHeroes: [{ __symbolic: 'method' }]
                    }
                }
            }
        });
    });
    it('should return the values of exported variables', function () {
        var sourceFile = program.getSourceFile('/app/mock-heroes.ts');
        var metadata = collector.getMetadata(sourceFile);
        expect(metadata).toEqual({
            __symbolic: 'module',
            version: schema_1.METADATA_VERSION,
            metadata: {
                HEROES: [
                    { 'id': 11, 'name': 'Mr. Nice', '$quoted$': ['id', 'name'] },
                    { 'id': 12, 'name': 'Narco', '$quoted$': ['id', 'name'] },
                    { 'id': 13, 'name': 'Bombasto', '$quoted$': ['id', 'name'] },
                    { 'id': 14, 'name': 'Celeritas', '$quoted$': ['id', 'name'] },
                    { 'id': 15, 'name': 'Magneta', '$quoted$': ['id', 'name'] },
                    { 'id': 16, 'name': 'RubberMan', '$quoted$': ['id', 'name'] },
                    { 'id': 17, 'name': 'Dynama', '$quoted$': ['id', 'name'] },
                    { 'id': 18, 'name': 'Dr IQ', '$quoted$': ['id', 'name'] },
                    { 'id': 19, 'name': 'Magma', '$quoted$': ['id', 'name'] },
                    { 'id': 20, 'name': 'Tornado', '$quoted$': ['id', 'name'] }
                ]
            }
        });
    });
    var casesFile;
    var casesMetadata;
    beforeEach(function () {
        casesFile = program.getSourceFile('/app/cases-data.ts');
        casesMetadata = collector.getMetadata(casesFile);
    });
    it('should provide any reference for an any ctor parameter type', function () {
        var casesAny = casesMetadata.metadata['CaseAny'];
        expect(casesAny).toBeTruthy();
        var ctorData = casesAny.members['__ctor__'];
        expect(ctorData).toEqual([{
                __symbolic: 'constructor',
                parameters: [{ __symbolic: 'reference', name: 'any' }]
            }]);
    });
    it('should record annotations on set and get declarations', function () {
        var propertyData = function (line) { return ({
            name: [{
                    __symbolic: 'property',
                    decorators: [{
                            __symbolic: 'call',
                            expression: { __symbolic: 'reference', module: 'angular2/core', name: 'Input', line: line, character: 9 },
                            arguments: ['firstName']
                        }]
                }]
        }); }; // TODO: Review use of `any` here (#19904)
        var caseGetProp = casesMetadata.metadata['GetProp'];
        expect(caseGetProp.members).toEqual(propertyData(11));
        var caseSetProp = casesMetadata.metadata['SetProp'];
        expect(caseSetProp.members).toEqual(propertyData(19));
        var caseFullProp = casesMetadata.metadata['FullProp'];
        expect(caseFullProp.members).toEqual(propertyData(27));
    });
    it('should record references to parameterized types', function () {
        var casesForIn = casesMetadata.metadata['NgFor'];
        expect(casesForIn).toEqual({
            __symbolic: 'class', decorators: [{
                    __symbolic: 'call',
                    expression: {
                        __symbolic: 'reference',
                        module: 'angular2/core',
                        name: 'Injectable',
                        line: 40,
                        character: 7
                    }
                }],
            members: {
                __ctor__: [{
                        __symbolic: 'constructor',
                        parameters: [{
                                __symbolic: 'reference',
                                name: 'ClassReference',
                                arguments: [{ __symbolic: 'reference', name: 'NgForRow' }]
                            }]
                    }]
            }
        }); // TODO: Review use of `any` here (#19904)
    });
    it('should report errors for destructured imports', function () {
        var unsupported1 = program.getSourceFile('/unsupported-1.ts');
        var metadata = collector.getMetadata(unsupported1);
        expect(metadata).toEqual({
            __symbolic: 'module',
            version: schema_1.METADATA_VERSION,
            metadata: {
                a: { __symbolic: 'error', message: 'Destructuring not supported', line: 1, character: 16 },
                b: { __symbolic: 'error', message: 'Destructuring not supported', line: 1, character: 19 },
                c: { __symbolic: 'error', message: 'Destructuring not supported', line: 2, character: 16 },
                d: { __symbolic: 'error', message: 'Destructuring not supported', line: 2, character: 19 },
                e: { __symbolic: 'error', message: 'Variable not initialized', line: 3, character: 15 }
            }
        });
    });
    it('should report an error for references to unexpected types', function () {
        var unsupported1 = program.getSourceFile('/unsupported-2.ts');
        var metadata = collector.getMetadata(unsupported1);
        var barClass = metadata.metadata['Bar'];
        var ctor = barClass.members['__ctor__'][0];
        var parameter = ctor.parameters[0];
        expect(parameter).toEqual({
            __symbolic: 'error',
            message: 'Reference to non-exported class',
            line: 3,
            character: 4,
            context: { className: 'Foo' }
        });
    });
    it('should be able to handle import star type references', function () {
        var importStar = program.getSourceFile('/import-star.ts');
        var metadata = collector.getMetadata(importStar);
        var someClass = metadata.metadata['SomeClass'];
        var ctor = someClass.members['__ctor__'][0];
        var parameters = ctor.parameters;
        expect(parameters).toEqual([{
                __symbolic: 'reference', module: 'angular2/common', name: 'NgFor', line: 6, character: 29
            }]);
    });
    it('should record all exported classes', function () {
        var sourceFile = program.getSourceFile('/exported-classes.ts');
        var metadata = collector.getMetadata(sourceFile);
        expect(metadata).toEqual({
            __symbolic: 'module',
            version: schema_1.METADATA_VERSION,
            metadata: {
                SimpleClass: { __symbolic: 'class' },
                AbstractClass: { __symbolic: 'class' },
                DeclaredClass: { __symbolic: 'class' }
            }
        });
    });
    it('should be able to record functions', function () {
        var exportedFunctions = program.getSourceFile('/exported-functions.ts');
        var metadata = collector.getMetadata(exportedFunctions);
        expect(metadata).toEqual({
            __symbolic: 'module',
            version: schema_1.METADATA_VERSION,
            metadata: {
                one: {
                    __symbolic: 'function',
                    parameters: ['a', 'b', 'c'],
                    value: {
                        a: { __symbolic: 'reference', name: 'a' },
                        b: { __symbolic: 'reference', name: 'b' },
                        c: { __symbolic: 'reference', name: 'c' }
                    }
                },
                two: {
                    __symbolic: 'function',
                    parameters: ['a', 'b', 'c'],
                    value: {
                        a: { __symbolic: 'reference', name: 'a' },
                        b: { __symbolic: 'reference', name: 'b' },
                        c: { __symbolic: 'reference', name: 'c' }
                    }
                },
                three: {
                    __symbolic: 'function',
                    parameters: ['a', 'b', 'c'],
                    value: [
                        { __symbolic: 'reference', name: 'a' }, { __symbolic: 'reference', name: 'b' },
                        { __symbolic: 'reference', name: 'c' }
                    ]
                },
                supportsState: {
                    __symbolic: 'function',
                    parameters: [],
                    value: {
                        __symbolic: 'pre',
                        operator: '!',
                        operand: {
                            __symbolic: 'pre',
                            operator: '!',
                            operand: {
                                __symbolic: 'select',
                                expression: {
                                    __symbolic: 'select',
                                    expression: { __symbolic: 'reference', name: 'window' },
                                    member: 'history'
                                },
                                member: 'pushState'
                            }
                        }
                    }
                },
                complexFn: { __symbolic: 'function' },
                declaredFn: { __symbolic: 'function' }
            }
        });
    });
    it('should be able to handle import star type references', function () {
        var importStar = program.getSourceFile('/import-star.ts');
        var metadata = collector.getMetadata(importStar);
        var someClass = metadata.metadata['SomeClass'];
        var ctor = someClass.members['__ctor__'][0];
        var parameters = ctor.parameters;
        expect(parameters).toEqual([{
                __symbolic: 'reference', module: 'angular2/common', name: 'NgFor', line: 6, character: 29
            }]);
    });
    it('should be able to collect the value of an enum', function () {
        var enumSource = program.getSourceFile('/exported-enum.ts');
        var metadata = collector.getMetadata(enumSource);
        var someEnum = metadata.metadata['SomeEnum'];
        expect(someEnum).toEqual({ A: 0, B: 1, C: 100, D: 101 });
    });
    it('should ignore a non-export enum', function () {
        var enumSource = program.getSourceFile('/private-enum.ts');
        var metadata = collector.getMetadata(enumSource);
        var publicEnum = metadata.metadata['PublicEnum'];
        var privateEnum = metadata.metadata['PrivateEnum'];
        expect(publicEnum).toEqual({ a: 0, b: 1, c: 2 });
        expect(privateEnum).toBeUndefined();
    });
    it('should be able to collect enums initialized from consts', function () {
        var enumSource = program.getSourceFile('/exported-enum.ts');
        var metadata = collector.getMetadata(enumSource);
        var complexEnum = metadata.metadata['ComplexEnum'];
        expect(complexEnum).toEqual({
            A: 0,
            B: 1,
            C: 30,
            D: 40,
            E: {
                __symbolic: 'reference',
                module: './exported-consts',
                name: 'constValue',
                line: 5,
                character: 75
            }
        });
    });
    it('should be able to collect a simple static method', function () {
        var staticSource = program.getSourceFile('/static-method.ts');
        var metadata = collector.getMetadata(staticSource);
        expect(metadata).toBeDefined();
        var classData = metadata.metadata['MyModule'];
        expect(classData).toBeDefined();
        expect(classData.statics).toEqual({
            with: {
                __symbolic: 'function',
                parameters: ['comp'],
                value: [
                    { __symbolic: 'reference', name: 'MyModule' },
                    { provider: 'a', useValue: { __symbolic: 'reference', name: 'comp' } }
                ]
            }
        });
    });
    it('should be able to collect a call to a static method', function () {
        var staticSource = program.getSourceFile('/static-method-call.ts');
        var metadata = collector.getMetadata(staticSource);
        expect(metadata).toBeDefined();
        var classData = metadata.metadata['Foo'];
        expect(classData).toBeDefined();
        expect(classData.decorators).toEqual([{
                __symbolic: 'call',
                expression: {
                    __symbolic: 'reference',
                    module: 'angular2/core',
                    name: 'Component',
                    line: 4,
                    character: 5
                },
                arguments: [{
                        providers: {
                            __symbolic: 'call',
                            expression: {
                                __symbolic: 'select',
                                expression: {
                                    __symbolic: 'reference',
                                    module: './static-method',
                                    name: 'MyModule',
                                    line: 5,
                                    character: 17
                                },
                                member: 'with'
                            },
                            arguments: ['a']
                        }
                    }]
            }]); // TODO: Review use of `any` here (#19904)
    });
    it('should be able to collect a static field', function () {
        var staticSource = program.getSourceFile('/static-field.ts');
        var metadata = collector.getMetadata(staticSource);
        expect(metadata).toBeDefined();
        var classData = metadata.metadata['MyModule'];
        expect(classData).toBeDefined();
        expect(classData.statics).toEqual({ VALUE: 'Some string' });
    });
    it('should be able to collect a reference to a static field', function () {
        var staticSource = program.getSourceFile('/static-field-reference.ts');
        var metadata = collector.getMetadata(staticSource);
        expect(metadata).toBeDefined();
        var classData = metadata.metadata['Foo'];
        expect(classData).toBeDefined();
        expect(classData.decorators).toEqual([{
                __symbolic: 'call',
                expression: {
                    __symbolic: 'reference',
                    module: 'angular2/core',
                    name: 'Component',
                    line: 4,
                    character: 5
                },
                arguments: [{
                        providers: [{
                                provide: 'a',
                                useValue: {
                                    __symbolic: 'select',
                                    expression: {
                                        __symbolic: 'reference',
                                        module: './static-field',
                                        name: 'MyModule',
                                        line: 5,
                                        character: 45
                                    },
                                    member: 'VALUE'
                                }
                            }]
                    }]
            }]); // TODO: Review use of `any` here (#19904)
    });
    it('should be able to collect a method with a conditional expression', function () {
        var source = program.getSourceFile('/static-method-with-if.ts');
        var metadata = collector.getMetadata(source);
        expect(metadata).toBeDefined();
        var classData = metadata.metadata['MyModule'];
        expect(classData).toBeDefined();
        expect(classData.statics).toEqual({
            with: {
                __symbolic: 'function',
                parameters: ['cond'],
                value: [
                    { __symbolic: 'reference', name: 'MyModule' }, {
                        provider: 'a',
                        useValue: {
                            __symbolic: 'if',
                            condition: { __symbolic: 'reference', name: 'cond' },
                            thenExpression: '1',
                            elseExpression: '2'
                        }
                    }
                ]
            }
        });
    });
    it('should be able to collect a method with a default parameter', function () {
        var source = program.getSourceFile('/static-method-with-default.ts');
        var metadata = collector.getMetadata(source);
        expect(metadata).toBeDefined();
        var classData = metadata.metadata['MyModule'];
        expect(classData).toBeDefined();
        expect(classData.statics).toEqual({
            with: {
                __symbolic: 'function',
                parameters: ['comp', 'foo', 'bar'],
                defaults: [undefined, true, false],
                value: [
                    { __symbolic: 'reference', name: 'MyModule' }, {
                        __symbolic: 'if',
                        condition: { __symbolic: 'reference', name: 'foo' },
                        thenExpression: { provider: 'a', useValue: { __symbolic: 'reference', name: 'comp' } },
                        elseExpression: { provider: 'b', useValue: { __symbolic: 'reference', name: 'comp' } }
                    },
                    {
                        __symbolic: 'if',
                        condition: { __symbolic: 'reference', name: 'bar' },
                        thenExpression: { provider: 'c', useValue: { __symbolic: 'reference', name: 'comp' } },
                        elseExpression: { provider: 'd', useValue: { __symbolic: 'reference', name: 'comp' } }
                    }
                ]
            }
        });
    });
    it('should be able to collect re-exported symbols', function () {
        var source = program.getSourceFile('/re-exports.ts');
        var metadata = collector.getMetadata(source);
        expect(metadata.exports).toEqual([
            { from: './static-field', export: ['MyModule'] },
            { from: './static-field-reference', export: [{ name: 'Foo', as: 'OtherModule' }] },
            { from: 'angular2/core' }
        ]);
    });
    it('should be able to collect a export as symbol', function () {
        var source = program.getSourceFile('export-as.d.ts');
        var metadata = collector.getMetadata(source);
        expect(metadata.metadata).toEqual({ SomeFunction: { __symbolic: 'function' } });
    });
    it('should be able to collect exports with no module specifier', function () {
        var source = program.getSourceFile('/re-exports-2.ts');
        var metadata = collector.getMetadata(source);
        expect(metadata.metadata).toEqual({
            MyClass: Object({ __symbolic: 'class' }),
            OtherModule: {
                __symbolic: 'reference',
                module: './static-field-reference',
                name: 'Foo',
                line: 4,
                character: 12
            },
            MyOtherModule: {
                __symbolic: 'reference',
                module: './static-field',
                name: 'MyModule',
                line: 4,
                character: 25
            }
        });
    });
    it('should collect an error symbol if collecting a reference to a non-exported symbol', function () {
        var source = program.getSourceFile('/local-symbol-ref.ts');
        var metadata = collector.getMetadata(source);
        expect(metadata.metadata).toEqual({
            REQUIRED_VALIDATOR: {
                __symbolic: 'error',
                message: 'Reference to a local symbol',
                line: 3,
                character: 8,
                context: { name: 'REQUIRED' }
            },
            SomeComponent: {
                __symbolic: 'class',
                decorators: [{
                        __symbolic: 'call',
                        expression: {
                            __symbolic: 'reference',
                            module: 'angular2/core',
                            name: 'Component',
                            line: 11,
                            character: 5
                        },
                        arguments: [{ providers: [{ __symbolic: 'reference', name: 'REQUIRED_VALIDATOR' }] }]
                    }]
            }
        });
    });
    it('should collect an error symbol if collecting a reference to a non-exported function', function () {
        var source = program.getSourceFile('/local-function-ref.ts');
        var metadata = collector.getMetadata(source);
        expect(metadata.metadata).toEqual({
            REQUIRED_VALIDATOR: {
                __symbolic: 'error',
                message: 'Reference to a non-exported function',
                line: 3,
                character: 13,
                context: { name: 'required' }
            },
            SomeComponent: {
                __symbolic: 'class',
                decorators: [{
                        __symbolic: 'call',
                        expression: {
                            __symbolic: 'reference',
                            module: 'angular2/core',
                            name: 'Component',
                            line: 11,
                            character: 5
                        },
                        arguments: [{ providers: [{ __symbolic: 'reference', name: 'REQUIRED_VALIDATOR' }] }]
                    }]
            }
        });
    });
    it('should collect an error for a simple function that references a local variable', function () {
        var source = program.getSourceFile('/local-symbol-ref-func.ts');
        var metadata = collector.getMetadata(source);
        expect(metadata.metadata).toEqual({
            foo: {
                __symbolic: 'function',
                parameters: ['index'],
                value: {
                    __symbolic: 'error',
                    message: 'Reference to a local symbol',
                    line: 1,
                    character: 8,
                    context: { name: 'localSymbol' }
                }
            }
        });
    });
    it('should collect any for interface parameter reference', function () {
        var source = program.getSourceFile('/interface-reference.ts');
        var metadata = collector.getMetadata(source);
        expect(metadata.metadata['SomeClass'].members).toEqual({
            __ctor__: [{
                    __symbolic: 'constructor',
                    parameterDecorators: [[{
                                __symbolic: 'call',
                                expression: {
                                    __symbolic: 'reference',
                                    module: 'angular2/core',
                                    name: 'Inject',
                                    line: 6,
                                    character: 19
                                },
                                arguments: ['a']
                            }]],
                    parameters: [{ __symbolic: 'reference', name: 'any' }]
                }]
        }); // TODO: Review use of `any` here (#19904)
    });
    describe('with interpolations', function () {
        function e(expr, prefix) {
            var metadata = collectSource((prefix || '') + " export let value = " + expr + ";");
            return expect(metadata.metadata['value']);
        }
        it('should be able to collect a raw interpolated string', function () { e('`simple value`').toBe('simple value'); });
        it('should be able to interpolate a single value', function () { e('`${foo}`', 'const foo = "foo value"').toBe('foo value'); });
        it('should be able to interpolate multiple values', function () {
            e('`foo:${foo}, bar:${bar}, end`', 'const foo = "foo"; const bar = "bar";')
                .toBe('foo:foo, bar:bar, end');
        });
        it('should be able to interpolate with an imported reference', function () {
            e('`external:${external}`', 'import {external} from "./external";').toEqual({
                __symbolic: 'binop',
                operator: '+',
                left: 'external:',
                right: {
                    __symbolic: 'reference',
                    module: './external',
                    name: 'external',
                    line: 0,
                    character: 68,
                }
            });
        });
        it('should simplify a redundant template', function () {
            e('`${external}`', 'import {external} from "./external";').toEqual({
                __symbolic: 'reference',
                module: './external',
                name: 'external',
                line: 0,
                character: 59
            });
        });
        it('should be able to collect complex template with imported references', function () {
            e('`foo:${foo}, bar:${bar}, end`', 'import {foo, bar} from "./external";').toEqual({
                __symbolic: 'binop',
                operator: '+',
                left: {
                    __symbolic: 'binop',
                    operator: '+',
                    left: {
                        __symbolic: 'binop',
                        operator: '+',
                        left: {
                            __symbolic: 'binop',
                            operator: '+',
                            left: 'foo:',
                            right: {
                                __symbolic: 'reference',
                                module: './external',
                                name: 'foo',
                                line: 0,
                                character: 63
                            }
                        },
                        right: ', bar:'
                    },
                    right: { __symbolic: 'reference', module: './external', name: 'bar', line: 0, character: 75 }
                },
                right: ', end'
            });
        });
        it('should reject a tagged literal', function () {
            e('tag`some value`').toEqual({
                __symbolic: 'error',
                message: 'Tagged template expressions are not supported in metadata',
                line: 0,
                character: 20
            });
        });
    });
    it('should ignore |null or |undefined in type expressions', function () {
        var metadata = collectSource("\n      import {Foo} from './foo';\n      export class SomeClass {\n        constructor (a: Foo, b: Foo | null, c: Foo | undefined, d: Foo | undefined | null, e: Foo | undefined | null | Foo) {}\n      }\n    ");
        expect(metadata.metadata['SomeClass'].members).toEqual({
            __ctor__: [{
                    __symbolic: 'constructor',
                    parameters: [
                        { __symbolic: 'reference', module: './foo', name: 'Foo', line: 3, character: 24 },
                        { __symbolic: 'reference', module: './foo', name: 'Foo', line: 3, character: 24 },
                        { __symbolic: 'reference', module: './foo', name: 'Foo', line: 3, character: 24 },
                        { __symbolic: 'reference', module: './foo', name: 'Foo', line: 3, character: 24 },
                        { __symbolic: 'reference', module: './foo', name: 'Foo', line: 3, character: 24 }
                    ]
                }]
        }); // TODO: Review use of `any` here (#19904)
    });
    it('should treat exported class expressions as a class', function () {
        var source = ts.createSourceFile('', "\n    export const InjectionToken: {new<T>(desc: string): InjectionToken<T>;} = class {\n      constructor(protected _desc: string) {}\n\n      toString(): string { return `InjectionToken ${this._desc}`; }\n    } as any;", ts.ScriptTarget.Latest, true);
        var metadata = collector.getMetadata(source);
        expect(metadata.metadata).toEqual({ InjectionToken: { __symbolic: 'class' } });
    });
    describe('in strict mode', function () {
        it('should throw if an error symbol is collecting a reference to a non-exported symbol', function () {
            var source = program.getSourceFile('/local-symbol-ref.ts');
            expect(function () { return collector.getMetadata(source, true); }).toThrowError(/Reference to a local symbol/);
        });
        it('should throw if an error if collecting a reference to a non-exported function', function () {
            var source = program.getSourceFile('/local-function-ref.ts');
            expect(function () { return collector.getMetadata(source, true); })
                .toThrowError(/Reference to a non-exported function/);
        });
        it('should throw for references to unexpected types', function () {
            var unsupported2 = program.getSourceFile('/unsupported-2.ts');
            expect(function () { return collector.getMetadata(unsupported2, true); })
                .toThrowError(/Reference to non-exported class/);
        });
        it('should throw for errors in a static method', function () {
            var unsupported3 = program.getSourceFile('/unsupported-3.ts');
            expect(function () { return collector.getMetadata(unsupported3, true); })
                .toThrowError(/Reference to a non-exported class/);
        });
    });
    describe('with invalid input', function () {
        it('should not throw with a class with no name', function () {
            var fileName = '/invalid-class.ts';
            override(fileName, 'export class');
            var invalidClass = program.getSourceFile(fileName);
            expect(function () { return collector.getMetadata(invalidClass); }).not.toThrow();
        });
        it('should not throw with a function with no name', function () {
            var fileName = '/invalid-function.ts';
            override(fileName, 'export function');
            var invalidFunction = program.getSourceFile(fileName);
            expect(function () { return collector.getMetadata(invalidFunction); }).not.toThrow();
        });
    });
    describe('inheritance', function () {
        it('should record `extends` clauses for declared classes', function () {
            var metadata = collector.getMetadata(program.getSourceFile('/class-inheritance.ts'));
            expect(metadata.metadata['DeclaredChildClass'])
                .toEqual({ __symbolic: 'class', extends: { __symbolic: 'reference', name: 'ParentClass' } });
        });
        it('should record `extends` clauses for classes in the same file', function () {
            var metadata = collector.getMetadata(program.getSourceFile('/class-inheritance.ts'));
            expect(metadata.metadata['ChildClassSameFile'])
                .toEqual({ __symbolic: 'class', extends: { __symbolic: 'reference', name: 'ParentClass' } });
        });
        it('should record `extends` clauses for classes in a different file', function () {
            var metadata = collector.getMetadata(program.getSourceFile('/class-inheritance.ts'));
            expect(metadata.metadata['ChildClassOtherFile']).toEqual({
                __symbolic: 'class',
                extends: {
                    __symbolic: 'reference',
                    module: './class-inheritance-parent',
                    name: 'ParentClassFromOtherFile',
                    line: 9,
                    character: 45,
                }
            });
        });
        function expectClass(entry) {
            var result = schema_1.isClassMetadata(entry);
            expect(result).toBeTruthy();
            return result;
        }
        it('should collect the correct arity for a class', function () {
            var metadata = collector.getMetadata(program.getSourceFile('/class-arity.ts'));
            var zero = metadata.metadata['Zero'];
            if (expectClass(zero))
                expect(zero.arity).toBeUndefined();
            var one = metadata.metadata['One'];
            if (expectClass(one))
                expect(one.arity).toBe(1);
            var two = metadata.metadata['Two'];
            if (expectClass(two))
                expect(two.arity).toBe(2);
            var three = metadata.metadata['Three'];
            if (expectClass(three))
                expect(three.arity).toBe(3);
            var nine = metadata.metadata['Nine'];
            if (expectClass(nine))
                expect(nine.arity).toBe(9);
        });
    });
    describe('regression', function () {
        it('should be able to collect a short-hand property value', function () {
            var metadata = collectSource("\n        const children = { f1: 1 };\n        export const r = [\n          {path: ':locale', children}\n        ];\n      ");
            expect(metadata.metadata).toEqual({ r: [{ path: ':locale', children: { f1: 1 } }] });
        });
        // #17518
        it('should skip a default function', function () {
            var metadata = collectSource("\n        export default function () {\n\n          const mainRoutes = [\n            {name: 'a', abstract: true, component: 'main'},\n\n            {name: 'a.welcome', url: '/welcome', component: 'welcome'}\n          ];\n\n          return mainRoutes;\n\n        }");
            expect(metadata).toBeUndefined();
        });
        it('should skip a named default export', function () {
            var metadata = collectSource("\n        function mainRoutes() {\n\n          const mainRoutes = [\n            {name: 'a', abstract: true, component: 'main'},\n\n            {name: 'a.welcome', url: '/welcome', component: 'welcome'}\n          ];\n\n          return mainRoutes;\n\n        }\n\n        exports = foo;\n        ");
            expect(metadata).toBeUndefined();
        });
        it('should collect type guards', function () {
            var metadata = collectSource("\n        import {Directive, Input, TemplateRef} from '@angular/core';\n\n        @Directive({selector: '[myIf]'})\n        export class MyIf {\n\n          constructor(private templateRef: TemplateRef) {}\n\n          @Input() myIf: any;\n\n          static typeGuard: <T>(v: T | null | undefined): v is T;\n        }\n      ");
            expect(metadata.metadata.MyIf.statics.typeGuard)
                .not.toBeUndefined('typeGuard was not collected');
        });
    });
    describe('references', function () {
        beforeEach(function () { collector = new collector_1.MetadataCollector({ quotedNames: true }); });
        it('should record a reference to an exported field of a useValue', function () {
            var metadata = collectSource("\n        export var someValue = 1;\n        export const v = {\n          useValue: someValue\n        };\n      ");
            expect(metadata.metadata['someValue']).toEqual(1);
            expect(metadata.metadata['v']).toEqual({
                useValue: { __symbolic: 'reference', name: 'someValue' }
            });
        });
        it('should leave external references in place in an object literal', function () {
            var metadata = collectSource("\n        export const myLambda = () => [1, 2, 3];\n        const indirect = [{a: 1, b: 3: c: myLambda}];\n        export const v = {\n          v: {i: indirect}\n        }\n      ");
            expect(metadata.metadata['v']).toEqual({
                v: { i: [{ a: 1, b: 3, c: { __symbolic: 'reference', name: 'myLambda' } }] }
            });
        });
        it('should leave an external reference in place in an array literal', function () {
            var metadata = collectSource("\n        export const myLambda = () => [1, 2, 3];\n        const indirect = [1, 3, myLambda}];\n        export const v = {\n          v: {i: indirect}\n        }\n      ");
            expect(metadata.metadata['v']).toEqual({
                v: { i: [1, 3, { __symbolic: 'reference', name: 'myLambda' }] }
            });
        });
    });
    describe('substitutions', function () {
        var lambdaTemp = 'lambdaTemp';
        it('should be able to substitute a lambda', function () {
            var source = createSource("\n        const b = 1;\n        export const a = () => b;\n      ");
            var metadata = collector.getMetadata(source, /* strict */ false, function (value, node) {
                if (node.kind === ts.SyntaxKind.ArrowFunction) {
                    return { __symbolic: 'reference', name: lambdaTemp };
                }
                return value;
            });
            expect(metadata.metadata['a']).toEqual({ __symbolic: 'reference', name: lambdaTemp });
        });
        it('should compose substitution functions', function () {
            var collector = new collector_1.MetadataCollector({
                substituteExpression: function (value, node) { return schema_1.isMetadataGlobalReferenceExpression(value) &&
                    value.name == lambdaTemp ?
                    { __symbolic: 'reference', name: value.name + '2' } :
                    value; }
            });
            var source = createSource("\n        const b = 1;\n        export const a = () => b;\n      ");
            var metadata = collector.getMetadata(source, /* strict */ false, function (value, node) {
                if (node.kind === ts.SyntaxKind.ArrowFunction) {
                    return { __symbolic: 'reference', name: lambdaTemp };
                }
                return value;
            });
            expect(metadata.metadata['a']).toEqual({ __symbolic: 'reference', name: lambdaTemp + '2' });
        });
    });
    function override(fileName, content) {
        host.overrideFile(fileName, content);
        host.addFile(fileName);
        program = service.getProgram();
    }
    function collectSource(content) {
        var sourceFile = createSource(content);
        return collector.getMetadata(sourceFile);
    }
});
// TODO: Do not use \` in a template literal as it confuses clang-format
var FILES = {
    'app': {
        'app.component.ts': "\n      import {Component as MyComponent, OnInit} from 'angular2/core';\n      import * as common from 'angular2/common';\n      import {Hero} from './hero';\n      import {HeroDetailComponent} from './hero-detail.component';\n      import HeroService from './hero.service';\n      // thrown away\n      import 'angular2/core';\n\n      @MyComponent({\n        selector: 'my-app',\n        template:" +
            '`' +
            "\n        <h2>My Heroes</h2>\n        <ul class=\"heroes\">\n          <li *ngFor=\"#hero of heroes\"\n            (click)=\"onSelect(hero)\"\n            [class.selected]=\"hero === selectedHero\">\n            <span class=\"badge\">{{hero.id | lowercase}}</span> {{hero.name | uppercase}}\n          </li>\n        </ul>\n        <my-hero-detail [hero]=\"selectedHero\"></my-hero-detail>\n        " +
            '`' +
            ",\n        directives: [HeroDetailComponent, common.NgFor],\n        providers: [HeroService],\n        pipes: [common.LowerCasePipe, common.UpperCasePipe]\n      })\n      export class AppComponent implements OnInit {\n        public title = 'Tour of Heroes';\n        public heroes: Hero[];\n        public selectedHero: Hero;\n\n        constructor(private _heroService: HeroService) { }\n\n        onSelect(hero: Hero) { this.selectedHero = hero; }\n\n        ngOnInit() {\n            this.getHeroes()\n        }\n\n        getHeroes() {\n          this._heroService.getHeroesSlowly().then(heroes => this.heroes = heroes);\n        }\n      }",
        'hero.ts': "\n      export interface Hero {\n        id: number;\n        name: string;\n      }",
        'empty.ts': "",
        'hero-detail.component.ts': "\n      import {Component, Input} from 'angular2/core';\n      import {Hero} from './hero';\n\n      @Component({\n        selector: 'my-hero-detail',\n        template: " +
            '`' +
            "\n        <div *ngIf=\"hero\">\n          <h2>{{hero.name}} details!</h2>\n          <div><label>id: </label>{{hero.id}}</div>\n          <div>\n            <label>name: </label>\n            <input [(ngModel)]=\"hero.name\" placeholder=\"name\"/>\n          </div>\n        </div>\n      " +
            '`' +
            ",\n      })\n      export class HeroDetailComponent {\n        @Input() public hero: Hero;\n      }",
        'mock-heroes.ts': "\n      import {Hero as Hero} from './hero';\n\n      export const HEROES: Hero[] = [\n          {\"id\": 11, \"name\": \"Mr. Nice\"},\n          {\"id\": 12, \"name\": \"Narco\"},\n          {\"id\": 13, \"name\": \"Bombasto\"},\n          {\"id\": 14, \"name\": \"Celeritas\"},\n          {\"id\": 15, \"name\": \"Magneta\"},\n          {\"id\": 16, \"name\": \"RubberMan\"},\n          {\"id\": 17, \"name\": \"Dynama\"},\n          {\"id\": 18, \"name\": \"Dr IQ\"},\n          {\"id\": 19, \"name\": \"Magma\"},\n          {\"id\": 20, \"name\": \"Tornado\"}\n      ];",
        'default-exporter.ts': "\n      let a: string;\n      export default a;\n    ",
        'hero.service.ts': "\n      import {Injectable} from 'angular2/core';\n      import {HEROES} from './mock-heroes';\n      import {Hero} from './hero';\n\n      @Injectable()\n      class HeroService {\n          getHeros() {\n              return Promise.resolve(HEROES);\n          }\n\n          getHeroesSlowly() {\n              return new Promise<Hero[]>(resolve =>\n                setTimeout(()=>resolve(HEROES), 2000)); // 2 seconds\n          }\n      }\n      export default HeroService;",
        'cases-data.ts': "\n      import {Injectable, Input} from 'angular2/core';\n\n      @Injectable()\n      export class CaseAny {\n        constructor(param: any) {}\n      }\n\n      @Injectable()\n      export class GetProp {\n        private _name: string;\n        @Input('firstName') get name(): string {\n          return this._name;\n        }\n      }\n\n      @Injectable()\n      export class SetProp {\n        private _name: string;\n        @Input('firstName') set name(value: string) {\n          this._name = value;\n        }\n      }\n\n      @Injectable()\n      export class FullProp {\n        private _name: string;\n        @Input('firstName') get name(): string {\n          return this._name;\n        }\n        set name(value: string) {\n          this._name = value;\n        }\n      }\n\n      export class ClassReference<T> { }\n      export class NgForRow {\n\n      }\n\n      @Injectable()\n      export class NgFor {\n        constructor (public ref: ClassReference<NgForRow>) {}\n      }\n     ",
        'error-cases.ts': "\n      import HeroService from './hero.service';\n\n      export class CaseCtor {\n        constructor(private _heroService: HeroService) { }\n      }\n    "
    },
    'promise.ts': "\n    interface PromiseLike<T> {\n        then<TResult>(onfulfilled?: (value: T) => TResult | PromiseLike<TResult>, onrejected?: (reason: any) => TResult | PromiseLike<TResult>): PromiseLike<TResult>;\n        then<TResult>(onfulfilled?: (value: T) => TResult | PromiseLike<TResult>, onrejected?: (reason: any) => void): PromiseLike<TResult>;\n    }\n\n    interface Promise<T> {\n        then<TResult>(onfulfilled?: (value: T) => TResult | PromiseLike<TResult>, onrejected?: (reason: any) => TResult | PromiseLike<TResult>): Promise<TResult>;\n        then<TResult>(onfulfilled?: (value: T) => TResult | PromiseLike<TResult>, onrejected?: (reason: any) => void): Promise<TResult>;\n        catch(onrejected?: (reason: any) => T | PromiseLike<T>): Promise<T>;\n        catch(onrejected?: (reason: any) => void): Promise<T>;\n    }\n\n    interface PromiseConstructor {\n        prototype: Promise<any>;\n        new <T>(executor: (resolve: (value?: T | PromiseLike<T>) => void, reject: (reason?: any) => void) => void): Promise<T>;\n        reject(reason: any): Promise<void>;\n        reject<T>(reason: any): Promise<T>;\n        resolve<T>(value: T | PromiseLike<T>): Promise<T>;\n        resolve(): Promise<void>;\n    }\n\n    declare var Promise: PromiseConstructor;\n  ",
    'class-arity.ts': "\n    export class Zero {}\n    export class One<T> {}\n    export class Two<T, V> {}\n    export class Three<T1, T2, T3> {}\n    export class Nine<T1, T2, T3, T4, T5, T6, T7, T8, T9> {}\n  ",
    'unsupported-1.ts': "\n    export let {a, b} = {a: 1, b: 2};\n    export let [c, d] = [1, 2];\n    export let e;\n  ",
    'unsupported-2.ts': "\n    import {Injectable} from 'angular2/core';\n\n    class Foo {}\n\n    @Injectable()\n    export class Bar {\n      constructor(private f: Foo) {}\n    }\n  ",
    'unsupported-3.ts': "\n    class Foo {}\n\n    export class SomeClass {\n      static someStatic() {\n        return Foo;\n      }\n    }\n  ",
    'interface-reference.ts': "\n    import {Injectable, Inject} from 'angular2/core';\n    export interface Test {}\n\n    @Injectable()\n    export class SomeClass {\n      constructor(@Inject(\"a\") test: Test) {}\n    }\n  ",
    'import-star.ts': "\n    import {Injectable} from 'angular2/core';\n    import * as common from 'angular2/common';\n\n    @Injectable()\n    export class SomeClass {\n      constructor(private f: common.NgFor) {}\n    }\n  ",
    'declarations.d.ts': "\n    declare class DeclaredClass {}\n    declare function declaredFn();\n  ",
    'exported-classes.ts': "\n    export class SimpleClass {}\n    export abstract class AbstractClass {}\n    export declare class DeclaredClass {}\n  ",
    'class-inheritance-parent.ts': "\n    export class ParentClassFromOtherFile {}\n  ",
    'class-inheritance.ts': "\n    import {ParentClassFromOtherFile} from './class-inheritance-parent';\n\n    export class ParentClass {}\n\n    export declare class DeclaredChildClass extends ParentClass {}\n\n    export class ChildClassSameFile extends ParentClass {}\n\n    export class ChildClassOtherFile extends ParentClassFromOtherFile {}\n  ",
    'exported-functions.ts': "\n    export function one(a: string, b: string, c: string) {\n      return {a: a, b: b, c: c};\n    }\n    export function two(a: string, b: string, c: string) {\n      return {a, b, c};\n    }\n    export function three({a, b, c}: {a: string, b: string, c: string}) {\n      return [a, b, c];\n    }\n    export function supportsState(): boolean {\n     return !!window.history.pushState;\n    }\n    export function complexFn(x: any): boolean {\n      if (x) {\n        return true;\n      } else {\n        return false;\n      }\n    }\n    export declare function declaredFn();\n  ",
    'exported-type.ts': "\n    export type SomeType = 'a' | 'b';\n  ",
    'exported-enum.ts': "\n    import {constValue} from './exported-consts';\n\n    export const someValue = 30;\n    export enum SomeEnum { A, B, C = 100, D };\n    export enum ComplexEnum { A, B, C = someValue, D = someValue + 10, E = constValue };\n  ",
    'exported-consts.ts': "\n    export const constValue = 100;\n  ",
    'static-method.ts': "\n    export class MyModule {\n      static with(comp: any): any[] {\n        return [\n          MyModule,\n          { provider: 'a', useValue: comp }\n        ];\n      }\n    }\n  ",
    'static-method-with-default.ts': "\n    export class MyModule {\n      static with(comp: any, foo: boolean = true, bar: boolean = false): any[] {\n        return [\n          MyModule,\n          foo ? { provider: 'a', useValue: comp } : {provider: 'b', useValue: comp},\n          bar ? { provider: 'c', useValue: comp } : {provider: 'd', useValue: comp}\n        ];\n      }\n    }\n  ",
    'static-method-call.ts': "\n    import {Component} from 'angular2/core';\n    import {MyModule} from './static-method';\n\n    @Component({\n      providers: MyModule.with('a')\n    })\n    export class Foo { }\n  ",
    'static-field.ts': "\n    export class MyModule {\n      static VALUE = 'Some string';\n    }\n  ",
    'static-field-reference.ts': "\n    import {Component} from 'angular2/core';\n    import {MyModule} from './static-field';\n\n    @Component({\n      providers: [ { provide: 'a', useValue: MyModule.VALUE } ]\n    })\n    export class Foo { }\n  ",
    'static-method-with-if.ts': "\n    export class MyModule {\n      static with(cond: boolean): any[] {\n        return [\n          MyModule,\n          { provider: 'a', useValue: cond ? '1' : '2' }\n        ];\n      }\n    }\n  ",
    're-exports.ts': "\n    export {MyModule} from './static-field';\n    export {Foo as OtherModule} from './static-field-reference';\n    export * from 'angular2/core';\n  ",
    're-exports-2.ts': "\n    import {MyModule} from './static-field';\n    import {Foo as OtherModule} from './static-field-reference';\n    class MyClass {}\n    export {OtherModule, MyModule as MyOtherModule, MyClass};\n  ",
    'export-as.d.ts': "\n     declare function someFunction(): void;\n     export { someFunction as SomeFunction };\n ",
    'named-module.d.ts': "\n    /// <amd-module name=\"some-named-module\" />\n    export type SomeType = 'a';\n  ",
    'local-symbol-ref.ts': "\n    import {Component, Validators} from 'angular2/core';\n\n    var REQUIRED;\n\n    export const REQUIRED_VALIDATOR: any = {\n      provide: 'SomeToken',\n      useValue: REQUIRED,\n      multi: true\n    };\n\n    @Component({\n      providers: [REQUIRED_VALIDATOR]\n    })\n    export class SomeComponent {}\n  ",
    'private-enum.ts': "\n    export enum PublicEnum { a, b, c }\n    enum PrivateEnum { e, f, g }\n  ",
    'local-function-ref.ts': "\n    import {Component, Validators} from 'angular2/core';\n\n    function required() {}\n\n    export const REQUIRED_VALIDATOR: any = {\n      provide: 'SomeToken',\n      useValue: required,\n      multi: true\n    };\n\n    @Component({\n      providers: [REQUIRED_VALIDATOR]\n    })\n    export class SomeComponent {}\n  ",
    'local-symbol-ref-func.ts': "\n    var localSymbol: any[];\n\n    export function foo(index: number): string {\n      return localSymbol[index];\n    }\n  ",
    'node_modules': {
        'angular2': {
            'core.d.ts': "\n          export interface Type extends Function { }\n          export interface TypeDecorator {\n              <T extends Type>(type: T): T;\n              (target: Object, propertyKey?: string | symbol, parameterIndex?: number): void;\n              annotations: any[];\n          }\n          export interface ComponentDecorator extends TypeDecorator { }\n          export interface ComponentFactory {\n              (obj: {\n                  selector?: string;\n                  inputs?: string[];\n                  outputs?: string[];\n                  properties?: string[];\n                  events?: string[];\n                  host?: {\n                      [key: string]: string;\n                  };\n                  bindings?: any[];\n                  providers?: any[];\n                  exportAs?: string;\n                  moduleId?: string;\n                  queries?: {\n                      [key: string]: any;\n                  };\n                  viewBindings?: any[];\n                  viewProviders?: any[];\n                  templateUrl?: string;\n                  template?: string;\n                  styleUrls?: string[];\n                  styles?: string[];\n                  directives?: Array<Type | any[]>;\n                  pipes?: Array<Type | any[]>;\n              }): ComponentDecorator;\n          }\n          export declare var Component: ComponentFactory;\n          export interface InputFactory {\n              (bindingPropertyName?: string): any;\n              new (bindingPropertyName?: string): any;\n          }\n          export declare var Input: InputFactory;\n          export interface InjectableFactory {\n              (): any;\n          }\n          export declare var Injectable: InjectableFactory;\n          export interface InjectFactory {\n            (binding?: any): any;\n            new (binding?: any): any;\n          }\n          export declare var Inject: InjectFactory;\n          export interface OnInit {\n              ngOnInit(): any;\n          }\n          export class Validators {\n            static required(): void;\n          }\n      ",
            'common.d.ts': "\n        export declare class NgFor {\n            ngForOf: any;\n            ngForTemplate: any;\n            ngDoCheck(): void;\n        }\n        export declare class LowerCasePipe  {\n          transform(value: string, args?: any[]): string;\n        }\n        export declare class UpperCasePipe {\n            transform(value: string, args?: any[]): string;\n        }\n      "
        }
    }
};
function createSource(text) {
    return ts.createSourceFile('', text, ts.ScriptTarget.Latest, true);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29sbGVjdG9yX3NwZWMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9jb21waWxlci1jbGkvdGVzdC9tZXRhZGF0YS9jb2xsZWN0b3Jfc3BlYy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7OztHQU1HOztBQUVILCtCQUFpQztBQUVqQywwREFBK0Q7QUFDL0Qsb0RBQTZOO0FBRTdOLHVEQUF1RTtBQUV2RSxRQUFRLENBQUMsV0FBVyxFQUFFO0lBQ3BCLElBQU0sZ0JBQWdCLEdBQUcsRUFBRSxDQUFDLHNCQUFzQixFQUFFLENBQUM7SUFDckQsSUFBSSxJQUFVLENBQUM7SUFDZixJQUFJLE9BQTJCLENBQUM7SUFDaEMsSUFBSSxPQUFtQixDQUFDO0lBQ3hCLElBQUksU0FBNEIsQ0FBQztJQUVqQyxVQUFVLENBQUM7UUFDVCxJQUFJLEdBQUcsSUFBSSx1QkFBSSxDQUFDLEtBQUssRUFBRTtZQUNyQix1QkFBdUIsRUFBSyxvQkFBb0I7WUFDaEQscUJBQXFCLEVBQU8sYUFBYTtZQUN6QyxtQkFBbUIsRUFBUyxtQkFBbUI7WUFDL0MsbUJBQW1CLEVBQVMsZ0JBQWdCO1lBQzVDLG1CQUFtQixFQUFTLGdCQUFnQjtZQUM1QyxxQkFBcUIsRUFBTyx1QkFBdUI7WUFDbkQsa0JBQWtCLEVBQVUsa0JBQWtCO1lBQzlDLG9CQUFvQixFQUFRLHFCQUFxQjtZQUNqRCx1QkFBdUIsRUFBSywwQkFBMEI7WUFDdEQsaUJBQWlCLEVBQVcsZUFBZTtZQUMzQyxpQkFBaUIsRUFBVyxnQkFBZ0I7WUFDNUMsbUJBQW1CLEVBQVMsMkJBQTJCO1lBQ3ZELGtCQUFrQixFQUFVLHVCQUF1QjtZQUNuRCwwQkFBMEIsRUFBRSwrQkFBK0I7WUFDM0Qsc0JBQXNCLEVBQU0sNkJBQTZCO1lBQ3pELHdCQUF3QjtTQUN6QixDQUFDLENBQUM7UUFDSCxPQUFPLEdBQUcsRUFBRSxDQUFDLHFCQUFxQixDQUFDLElBQUksRUFBRSxn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