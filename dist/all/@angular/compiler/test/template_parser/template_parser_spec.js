"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
var compiler_1 = require("@angular/compiler");
var compile_metadata_1 = require("@angular/compiler/src/compile_metadata");
var dom_element_schema_registry_1 = require("@angular/compiler/src/schema/dom_element_schema_registry");
var element_schema_registry_1 = require("@angular/compiler/src/schema/element_schema_registry");
var template_ast_1 = require("@angular/compiler/src/template_parser/template_ast");
var template_parser_1 = require("@angular/compiler/src/template_parser/template_parser");
var core_1 = require("@angular/core");
var console_1 = require("@angular/core/src/console");
var testing_1 = require("@angular/core/testing");
var compiler_reflector_1 = require("@angular/platform-browser-dynamic/src/compiler_reflector");
var identifiers_1 = require("../../src/identifiers");
var interpolation_config_1 = require("../../src/ml_parser/interpolation_config");
var util_1 = require("../../src/util");
var testing_2 = require("../../testing");
var unparser_1 = require("../expression_parser/utils/unparser");
var test_bindings_1 = require("../test_bindings");
var someModuleUrl = 'package:someModule';
var MOCK_SCHEMA_REGISTRY = [{
        provide: element_schema_registry_1.ElementSchemaRegistry,
        useValue: new testing_2.MockSchemaRegistry({ 'invalidProp': false }, { 'mappedAttr': 'mappedProp' }, { 'unknown': false, 'un-known': false }, ['onEvent'], ['onEvent']),
    }];
function createTypeMeta(_a) {
    var reference = _a.reference, diDeps = _a.diDeps;
    return { reference: reference, diDeps: diDeps || [], lifecycleHooks: [] };
}
function compileDirectiveMetadataCreate(_a) {
    var isHost = _a.isHost, type = _a.type, isComponent = _a.isComponent, selector = _a.selector, exportAs = _a.exportAs, changeDetection = _a.changeDetection, inputs = _a.inputs, outputs = _a.outputs, host = _a.host, providers = _a.providers, viewProviders = _a.viewProviders, queries = _a.queries, guards = _a.guards, viewQueries = _a.viewQueries, entryComponents = _a.entryComponents, template = _a.template, componentViewType = _a.componentViewType, rendererType = _a.rendererType;
    return compile_metadata_1.CompileDirectiveMetadata.create({
        isHost: !!isHost,
        type: util_1.noUndefined(type),
        isComponent: !!isComponent,
        selector: util_1.noUndefined(selector),
        exportAs: util_1.noUndefined(exportAs),
        changeDetection: null,
        inputs: inputs || [],
        outputs: outputs || [],
        host: host || {},
        providers: providers || [],
        viewProviders: viewProviders || [],
        queries: queries || [],
        guards: guards || {},
        viewQueries: viewQueries || [],
        entryComponents: entryComponents || [],
        template: util_1.noUndefined(template),
        componentViewType: util_1.noUndefined(componentViewType),
        rendererType: util_1.noUndefined(rendererType),
        componentFactory: null,
    });
}
function compileTemplateMetadata(_a) {
    var encapsulation = _a.encapsulation, template = _a.template, templateUrl = _a.templateUrl, styles = _a.styles, styleUrls = _a.styleUrls, externalStylesheets = _a.externalStylesheets, animations = _a.animations, ngContentSelectors = _a.ngContentSelectors, interpolation = _a.interpolation, isInline = _a.isInline, preserveWhitespaces = _a.preserveWhitespaces;
    return new compile_metadata_1.CompileTemplateMetadata({
        encapsulation: util_1.noUndefined(encapsulation),
        template: util_1.noUndefined(template),
        templateUrl: util_1.noUndefined(templateUrl),
        htmlAst: null,
        styles: styles || [],
        styleUrls: styleUrls || [],
        externalStylesheets: externalStylesheets || [],
        animations: animations || [],
        ngContentSelectors: ngContentSelectors || [],
        interpolation: util_1.noUndefined(interpolation),
        isInline: !!isInline,
        preserveWhitespaces: compiler_1.preserveWhitespacesDefault(util_1.noUndefined(preserveWhitespaces)),
    });
}
function humanizeTplAst(templateAsts, interpolationConfig) {
    var humanizer = new TemplateHumanizer(false, interpolationConfig);
    template_ast_1.templateVisitAll(humanizer, templateAsts);
    return humanizer.result;
}
function humanizeTplAstSourceSpans(templateAsts, interpolationConfig) {
    var humanizer = new TemplateHumanizer(true, interpolationConfig);
    template_ast_1.templateVisitAll(humanizer, templateAsts);
    return humanizer.result;
}
var TemplateHumanizer = /** @class */ (function () {
    function TemplateHumanizer(includeSourceSpan, interpolationConfig) {
        if (interpolationConfig === void 0) { interpolationConfig = interpolation_config_1.DEFAULT_INTERPOLATION_CONFIG; }
        this.includeSourceSpan = includeSourceSpan;
        this.interpolationConfig = interpolationConfig;
        this.result = [];
    }
    TemplateHumanizer.prototype.visitNgContent = function (ast, context) {
        var res = [template_ast_1.NgContentAst];
        this.result.push(this._appendSourceSpan(ast, res));
        return null;
    };
    TemplateHumanizer.prototype.visitEmbeddedTemplate = function (ast, context) {
        var res = [template_ast_1.EmbeddedTemplateAst];
        this.result.push(this._appendSourceSpan(ast, res));
        template_ast_1.templateVisitAll(this, ast.attrs);
        template_ast_1.templateVisitAll(this, ast.outputs);
        template_ast_1.templateVisitAll(this, ast.references);
        template_ast_1.templateVisitAll(this, ast.variables);
        template_ast_1.templateVisitAll(this, ast.directives);
        template_ast_1.templateVisitAll(this, ast.children);
        return null;
    };
    TemplateHumanizer.prototype.visitElement = function (ast, context) {
        var res = [template_ast_1.ElementAst, ast.name];
        this.result.push(this._appendSourceSpan(ast, res));
        template_ast_1.templateVisitAll(this, ast.attrs);
        template_ast_1.templateVisitAll(this, ast.inputs);
        template_ast_1.templateVisitAll(this, ast.outputs);
        template_ast_1.templateVisitAll(this, ast.references);
        template_ast_1.templateVisitAll(this, ast.directives);
        template_ast_1.templateVisitAll(this, ast.children);
        return null;
    };
    TemplateHumanizer.prototype.visitReference = function (ast, context) {
        var res = [template_ast_1.ReferenceAst, ast.name, ast.value];
        this.result.push(this._appendSourceSpan(ast, res));
        return null;
    };
    TemplateHumanizer.prototype.visitVariable = function (ast, context) {
        var res = [template_ast_1.VariableAst, ast.name, ast.value];
        this.result.push(this._appendSourceSpan(ast, res));
        return null;
    };
    TemplateHumanizer.prototype.visitEvent = function (ast, context) {
        var res = [template_ast_1.BoundEventAst, ast.name, ast.target, unparser_1.unparse(ast.handler, this.interpolationConfig)];
        this.result.push(this._appendSourceSpan(ast, res));
        return null;
    };
    TemplateHumanizer.prototype.visitElementProperty = function (ast, context) {
        var res = [
            template_ast_1.BoundElementPropertyAst, ast.type, ast.name, unparser_1.unparse(ast.value, this.interpolationConfig),
            ast.unit
        ];
        this.result.push(this._appendSourceSpan(ast, res));
        return null;
    };
    TemplateHumanizer.prototype.visitAttr = function (ast, context) {
        var res = [template_ast_1.AttrAst, ast.name, ast.value];
        this.result.push(this._appendSourceSpan(ast, res));
        return null;
    };
    TemplateHumanizer.prototype.visitBoundText = function (ast, context) {
        var res = [template_ast_1.BoundTextAst, unparser_1.unparse(ast.value, this.interpolationConfig)];
        this.result.push(this._appendSourceSpan(ast, res));
        return null;
    };
    TemplateHumanizer.prototype.visitText = function (ast, context) {
        var res = [template_ast_1.TextAst, ast.value];
        this.result.push(this._appendSourceSpan(ast, res));
        return null;
    };
    TemplateHumanizer.prototype.visitDirective = function (ast, context) {
        var res = [template_ast_1.DirectiveAst, ast.directive];
        this.result.push(this._appendSourceSpan(ast, res));
        template_ast_1.templateVisitAll(this, ast.inputs);
        template_ast_1.templateVisitAll(this, ast.hostProperties);
        template_ast_1.templateVisitAll(this, ast.hostEvents);
        return null;
    };
    TemplateHumanizer.prototype.visitDirectiveProperty = function (ast, context) {
        var res = [
            template_ast_1.BoundDirectivePropertyAst, ast.directiveName, unparser_1.unparse(ast.value, this.interpolationConfig)
        ];
        this.result.push(this._appendSourceSpan(ast, res));
        return null;
    };
    TemplateHumanizer.prototype._appendSourceSpan = function (ast, input) {
        if (!this.includeSourceSpan)
            return input;
        input.push(ast.sourceSpan.toString());
        return input;
    };
    return TemplateHumanizer;
}());
function humanizeContentProjection(templateAsts) {
    var humanizer = new TemplateContentProjectionHumanizer();
    template_ast_1.templateVisitAll(humanizer, templateAsts);
    return humanizer.result;
}
var TemplateContentProjectionHumanizer = /** @class */ (function () {
    function TemplateContentProjectionHumanizer() {
        this.result = [];
    }
    TemplateContentProjectionHumanizer.prototype.visitNgContent = function (ast, context) {
        this.result.push(['ng-content', ast.ngContentIndex]);
        return null;
    };
    TemplateContentProjectionHumanizer.prototype.visitEmbeddedTemplate = function (ast, context) {
        this.result.push(['template', ast.ngContentIndex]);
        template_ast_1.templateVisitAll(this, ast.children);
        return null;
    };
    TemplateContentProjectionHumanizer.prototype.visitElement = function (ast, context) {
        this.result.push([ast.name, ast.ngContentIndex]);
        template_ast_1.templateVisitAll(this, ast.children);
        return null;
    };
    TemplateContentProjectionHumanizer.prototype.visitReference = function (ast, context) { return null; };
    TemplateContentProjectionHumanizer.prototype.visitVariable = function (ast, context) { return null; };
    TemplateContentProjectionHumanizer.prototype.visitEvent = function (ast, context) { return null; };
    TemplateContentProjectionHumanizer.prototype.visitElementProperty = function (ast, context) { return null; };
    TemplateContentProjectionHumanizer.prototype.visitAttr = function (ast, context) { return null; };
    TemplateContentProjectionHumanizer.prototype.visitBoundText = function (ast, context) {
        this.result.push(["#text(" + unparser_1.unparse(ast.value) + ")", ast.ngContentIndex]);
        return null;
    };
    TemplateContentProjectionHumanizer.prototype.visitText = function (ast, context) {
        this.result.push(["#text(" + ast.value + ")", ast.ngContentIndex]);
        return null;
    };
    TemplateContentProjectionHumanizer.prototype.visitDirective = function (ast, context) { return null; };
    TemplateContentProjectionHumanizer.prototype.visitDirectiveProperty = function (ast, context) { return null; };
    return TemplateContentProjectionHumanizer;
}());
var ThrowingVisitor = /** @class */ (function () {
    function ThrowingVisitor() {
    }
    ThrowingVisitor.prototype.visitNgContent = function (ast, context) { throw 'not implemented'; };
    ThrowingVisitor.prototype.visitEmbeddedTemplate = function (ast, context) { throw 'not implemented'; };
    ThrowingVisitor.prototype.visitElement = function (ast, context) { throw 'not implemented'; };
    ThrowingVisitor.prototype.visitReference = function (ast, context) { throw 'not implemented'; };
    ThrowingVisitor.prototype.visitVariable = function (ast, context) { throw 'not implemented'; };
    ThrowingVisitor.prototype.visitEvent = function (ast, context) { throw 'not implemented'; };
    ThrowingVisitor.prototype.visitElementProperty = function (ast, context) { throw 'not implemented'; };
    ThrowingVisitor.prototype.visitAttr = function (ast, context) { throw 'not implemented'; };
    ThrowingVisitor.prototype.visitBoundText = function (ast, context) { throw 'not implemented'; };
    ThrowingVisitor.prototype.visitText = function (ast, context) { throw 'not implemented'; };
    ThrowingVisitor.prototype.visitDirective = function (ast, context) { throw 'not implemented'; };
    ThrowingVisitor.prototype.visitDirectiveProperty = function (ast, context) {
        throw 'not implemented';
    };
    return ThrowingVisitor;
}());
var FooAstTransformer = /** @class */ (function (_super) {
    __extends(FooAstTransformer, _super);
    function FooAstTransformer() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    FooAstTransformer.prototype.visitElement = function (ast, context) {
        if (ast.name != 'div')
            return ast;
        return new template_ast_1.ElementAst('foo', [], [], [], [], [], [], false, [], [], ast.ngContentIndex, ast.sourceSpan, ast.endSourceSpan);
    };
    return FooAstTransformer;
}(ThrowingVisitor));
var BarAstTransformer = /** @class */ (function (_super) {
    __extends(BarAstTransformer, _super);
    function BarAstTransformer() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    BarAstTransformer.prototype.visitElement = function (ast, context) {
        if (ast.name != 'foo')
            return ast;
        return new template_ast_1.ElementAst('bar', [], [], [], [], [], [], false, [], [], ast.ngContentIndex, ast.sourceSpan, ast.endSourceSpan);
    };
    return BarAstTransformer;
}(FooAstTransformer));
var NullVisitor = /** @class */ (function () {
    function NullVisitor() {
    }
    NullVisitor.prototype.visitNgContent = function (ast, context) { };
    NullVisitor.prototype.visitEmbeddedTemplate = function (ast, context) { };
    NullVisitor.prototype.visitElement = function (ast, context) { };
    NullVisitor.prototype.visitReference = function (ast, context) { };
    NullVisitor.prototype.visitVariable = function (ast, context) { };
    NullVisitor.prototype.visitEvent = function (ast, context) { };
    NullVisitor.prototype.visitElementProperty = function (ast, context) { };
    NullVisitor.prototype.visitAttr = function (ast, context) { };
    NullVisitor.prototype.visitBoundText = function (ast, context) { };
    NullVisitor.prototype.visitText = function (ast, context) { };
    NullVisitor.prototype.visitDirective = function (ast, context) { };
    NullVisitor.prototype.visitDirectiveProperty = function (ast, context) { };
    return NullVisitor;
}());
var ArrayConsole = /** @class */ (function () {
    function ArrayConsole() {
        this.logs = [];
        this.warnings = [];
    }
    ArrayConsole.prototype.log = function (msg) { this.logs.push(msg); };
    ArrayConsole.prototype.warn = function (msg) { this.warnings.push(msg); };
    return ArrayConsole;
}());
(function () {
    var ngIf;
    var parse;
    var console;
    function configureCompiler() {
        console = new ArrayConsole();
        beforeEach(function () {
            testing_1.TestBed.configureCompiler({
                providers: [
                    { provide: console_1.Console, useValue: console },
                ],
            });
        });
    }
    function commonBeforeEach() {
        beforeEach(testing_1.inject([template_parser_1.TemplateParser], function (parser) {
            var someAnimation = ['someAnimation'];
            var someTemplate = compileTemplateMetadata({ animations: [someAnimation] });
            var component = compileDirectiveMetadataCreate({
                isHost: false,
                selector: 'root',
                template: someTemplate,
                type: createTypeMeta({ reference: { filePath: someModuleUrl, name: 'Root' } }),
                isComponent: true
            });
            ngIf = compileDirectiveMetadataCreate({
                selector: '[ngIf]',
                template: someTemplate,
                type: createTypeMeta({ reference: { filePath: someModuleUrl, name: 'NgIf' } }),
                inputs: ['ngIf']
            }).toSummary();
            parse =
                function (template, directives, pipes, schemas, preserveWhitespaces) {
                    if (pipes === void 0) { pipes = null; }
                    if (schemas === void 0) { schemas = []; }
                    if (preserveWhitespaces === void 0) { preserveWhitespaces = true; }
                    if (pipes === null) {
                        pipes = [];
                    }
                    return parser
                        .parse(component, template, directives, pipes, schemas, 'TestComp', preserveWhitespaces)
                        .template;
                };
        }));
    }
    describe('TemplateAstVisitor', function () {
        function expectVisitedNode(visitor, node) {
            expect(node.visit(visitor, null)).toEqual(node);
        }
        it('should visit NgContentAst', function () {
            expectVisitedNode(new /** @class */ (function (_super) {
                __extends(class_1, _super);
                function class_1() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                class_1.prototype.visitNgContent = function (ast, context) { return ast; };
                return class_1;
            }(NullVisitor)), new template_ast_1.NgContentAst(0, 0, null));
        });
        it('should visit EmbeddedTemplateAst', function () {
            expectVisitedNode(new /** @class */ (function (_super) {
                __extends(class_2, _super);
                function class_2() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                class_2.prototype.visitEmbeddedTemplate = function (ast, context) { return ast; };
                return class_2;
            }(NullVisitor)), new template_ast_1.EmbeddedTemplateAst([], [], [], [], [], [], false, [], [], 0, null));
        });
        it('should visit ElementAst', function () {
            expectVisitedNode(new /** @class */ (function (_super) {
                __extends(class_3, _super);
                function class_3() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                class_3.prototype.visitElement = function (ast, context) { return ast; };
                return class_3;
            }(NullVisitor)), new template_ast_1.ElementAst('foo', [], [], [], [], [], [], false, [], [], 0, null, null));
        });
        it('should visit RefererenceAst', function () {
            expectVisitedNode(new /** @class */ (function (_super) {
                __extends(class_4, _super);
                function class_4() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                class_4.prototype.visitReference = function (ast, context) { return ast; };
                return class_4;
            }(NullVisitor)), new template_ast_1.ReferenceAst('foo', null, null, null));
        });
        it('should visit VariableAst', function () {
            expectVisitedNode(new /** @class */ (function (_super) {
                __extends(class_5, _super);
                function class_5() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                class_5.prototype.visitVariable = function (ast, context) { return ast; };
                return class_5;
            }(NullVisitor)), new template_ast_1.VariableAst('foo', 'bar', null));
        });
        it('should visit BoundEventAst', function () {
            expectVisitedNode(new /** @class */ (function (_super) {
                __extends(class_6, _super);
                function class_6() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                class_6.prototype.visitEvent = function (ast, context) { return ast; };
                return class_6;
            }(NullVisitor)), new template_ast_1.BoundEventAst('foo', 'bar', 'goo', null, null));
        });
        it('should visit BoundElementPropertyAst', function () {
            expectVisitedNode(new /** @class */ (function (_super) {
                __extends(class_7, _super);
                function class_7() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                class_7.prototype.visitElementProperty = function (ast, context) { return ast; };
                return class_7;
            }(NullVisitor)), new template_ast_1.BoundElementPropertyAst('foo', null, null, null, 'bar', null));
        });
        it('should visit AttrAst', function () {
            expectVisitedNode(new /** @class */ (function (_super) {
                __extends(class_8, _super);
                function class_8() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                class_8.prototype.visitAttr = function (ast, context) { return ast; };
                return class_8;
            }(NullVisitor)), new template_ast_1.AttrAst('foo', 'bar', null));
        });
        it('should visit BoundTextAst', function () {
            expectVisitedNode(new /** @class */ (function (_super) {
                __extends(class_9, _super);
                function class_9() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                class_9.prototype.visitBoundText = function (ast, context) { return ast; };
                return class_9;
            }(NullVisitor)), new template_ast_1.BoundTextAst(null, 0, null));
        });
        it('should visit TextAst', function () {
            expectVisitedNode(new /** @class */ (function (_super) {
                __extends(class_10, _super);
                function class_10() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                class_10.prototype.visitText = function (ast, context) { return ast; };
                return class_10;
            }(NullVisitor)), new template_ast_1.TextAst('foo', 0, null));
        });
        it('should visit DirectiveAst', function () {
            expectVisitedNode(new /** @class */ (function (_super) {
                __extends(class_11, _super);
                function class_11() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                class_11.prototype.visitDirective = function (ast, context) { return ast; };
                return class_11;
            }(NullVisitor)), new template_ast_1.DirectiveAst(null, [], [], [], 0, null));
        });
        it('should visit DirectiveAst', function () {
            expectVisitedNode(new /** @class */ (function (_super) {
                __extends(class_12, _super);
                function class_12() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                class_12.prototype.visitDirectiveProperty = function (ast, context) { return ast; };
                return class_12;
            }(NullVisitor)), new template_ast_1.BoundDirectivePropertyAst('foo', 'bar', null, null));
        });
        it('should skip the typed call of a visitor if visit() returns a truthy value', function () {
            var visitor = new /** @class */ (function (_super) {
                __extends(class_13, _super);
                function class_13() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                class_13.prototype.visit = function (ast, context) { return true; };
                return class_13;
            }(ThrowingVisitor));
            var nodes = [
                new template_ast_1.NgContentAst(0, 0, null),
                new template_ast_1.EmbeddedTemplateAst([], [], [], [], [], [], false, [], [], 0, null),
                new template_ast_1.ElementAst('foo', [], [], [], [], [], [], false, [], [], 0, null, null),
                new template_ast_1.ReferenceAst('foo', null, 'bar', null), new template_ast_1.VariableAst('foo', 'bar', null),
                new template_ast_1.BoundEventAst('foo', 'bar', 'goo', null, null),
                new template_ast_1.BoundElementPropertyAst('foo', null, null, null, 'bar', null),
                new template_ast_1.AttrAst('foo', 'bar', null), new template_ast_1.BoundTextAst(null, 0, null),
                new template_ast_1.TextAst('foo', 0, null), new template_ast_1.DirectiveAst(null, [], [], [], 0, null),
                new template_ast_1.BoundDirectivePropertyAst('foo', 'bar', null, null)
            ];
            var result = template_ast_1.templateVisitAll(visitor, nodes, null);
            expect(result).toEqual(new Array(nodes.length).fill(true));
        });
    });
    describe('TemplateParser Security', function () {
        // Semi-integration test to make sure TemplateParser properly sets the security context.
        // Uses the actual DomElementSchemaRegistry.
        beforeEach(function () {
            testing_1.TestBed.configureCompiler({
                providers: [
                    test_bindings_1.TEST_COMPILER_PROVIDERS,
                    { provide: element_schema_registry_1.ElementSchemaRegistry, useClass: dom_element_schema_registry_1.DomElementSchemaRegistry, deps: [] }
                ]
            });
        });
        configureCompiler();
        commonBeforeEach();
        describe('security context', function () {
            function secContext(tpl) {
                var ast = parse(tpl, []);
                var propBinding = ast[0].inputs[0];
                return propBinding.securityContext;
            }
            it('should set for properties', function () {
                expect(secContext('<div [title]="v">')).toBe(core_1.SecurityContext.NONE);
                expect(secContext('<div [innerHTML]="v">')).toBe(core_1.SecurityContext.HTML);
            });
            it('should set for property value bindings', function () { expect(secContext('<div innerHTML="{{v}}">')).toBe(core_1.SecurityContext.HTML); });
            it('should set for attributes', function () {
                expect(secContext('<a [attr.href]="v">')).toBe(core_1.SecurityContext.URL);
                // NB: attributes below need to change case.
                expect(secContext('<a [attr.innerHtml]="v">')).toBe(core_1.SecurityContext.HTML);
                expect(secContext('<a [attr.formaction]="v">')).toBe(core_1.SecurityContext.URL);
            });
            it('should set for style', function () {
                expect(secContext('<a [style.backgroundColor]="v">')).toBe(core_1.SecurityContext.STYLE);
            });
        });
    });
    describe('TemplateParser', function () {
        beforeEach(function () {
            testing_1.TestBed.configureCompiler({ providers: [test_bindings_1.TEST_COMPILER_PROVIDERS, MOCK_SCHEMA_REGISTRY] });
        });
        configureCompiler();
        commonBeforeEach();
        describe('parse', function () {
            describe('nodes without bindings', function () {
                it('should parse text nodes', function () {
                    expect(humanizeTplAst(parse('a', []))).toEqual([[template_ast_1.TextAst, 'a']]);
                });
                it('should parse elements with attributes', function () {
                    expect(humanizeTplAst(parse('<div a=b>', []))).toEqual([[template_ast_1.ElementAst, 'div'], [template_ast_1.AttrAst, 'a', 'b']]);
                });
            });
            it('should parse ngContent', function () {
                var parsed = parse('<ng-content select="a"></ng-content>', []);
                expect(humanizeTplAst(parsed)).toEqual([[template_ast_1.NgContentAst]]);
            });
            it('should parse ngContent when it contains WS only', function () {
                var parsed = parse('<ng-content select="a">    \n   </ng-content>', []);
                expect(humanizeTplAst(parsed)).toEqual([[template_ast_1.NgContentAst]]);
            });
            it('should parse ngContent regardless the namespace', function () {
                var parsed = parse('<svg><ng-content></ng-content></svg>', []);
                expect(humanizeTplAst(parsed)).toEqual([
                    [template_ast_1.ElementAst, ':svg:svg'],
                    [template_ast_1.NgContentAst],
                ]);
            });
            it('should parse bound text nodes', function () {
                expect(humanizeTplAst(parse('{{a}}', []))).toEqual([[template_ast_1.BoundTextAst, '{{ a }}']]);
            });
            it('should parse with custom interpolation config', testing_1.inject([template_parser_1.TemplateParser], function (parser) {
                var component = compile_metadata_1.CompileDirectiveMetadata.create({
                    selector: 'test',
                    type: createTypeMeta({ reference: { filePath: someModuleUrl, name: 'Test' } }),
                    isComponent: true,
                    template: new compile_metadata_1.CompileTemplateMetadata({
                        interpolation: ['{%', '%}'],
                        isInline: false,
                        animations: [],
                        template: null,
                        templateUrl: null,
                        htmlAst: null,
                        ngContentSelectors: [],
                        externalStylesheets: [],
                        styleUrls: [],
                        styles: [],
                        encapsulation: null,
                        preserveWhitespaces: compiler_1.preserveWhitespacesDefault(null),
                    }),
                    isHost: false,
                    exportAs: null,
                    changeDetection: null,
                    inputs: [],
                    outputs: [],
                    host: {},
                    providers: [],
                    viewProviders: [],
                    queries: [],
                    guards: {},
                    viewQueries: [],
                    entryComponents: [],
                    componentViewType: null,
                    rendererType: null,
                    componentFactory: null
                });
                expect(humanizeTplAst(parser.parse(component, '{%a%}', [], [], [], 'TestComp', true).template, { start: '{%', end: '%}' }))
                    .toEqual([[template_ast_1.BoundTextAst, '{% a %}']]);
            }));
            describe('bound properties', function () {
                it('should parse mixed case bound properties', function () {
                    expect(humanizeTplAst(parse('<div [someProp]="v">', []))).toEqual([
                        [template_ast_1.ElementAst, 'div'],
                        [template_ast_1.BoundElementPropertyAst, 0 /* Property */, 'someProp', 'v', null]
                    ]);
                });
                it('should parse dash case bound properties', function () {
                    expect(humanizeTplAst(parse('<div [some-prop]="v">', []))).toEqual([
                        [template_ast_1.ElementAst, 'div'],
                        [template_ast_1.BoundElementPropertyAst, 0 /* Property */, 'some-prop', 'v', null]
                    ]);
                });
                it('should parse dotted name bound properties', function () {
                    expect(humanizeTplAst(parse('<div [dot.name]="v">', []))).toEqual([
                        [template_ast_1.ElementAst, 'div'],
                        [template_ast_1.BoundElementPropertyAst, 0 /* Property */, 'dot.name', 'v', null]
                    ]);
                });
                it('should normalize property names via the element schema', function () {
                    expect(humanizeTplAst(parse('<div [mappedAttr]="v">', []))).toEqual([
                        [template_ast_1.ElementAst, 'div'],
                        [template_ast_1.BoundElementPropertyAst, 0 /* Property */, 'mappedProp', 'v', null]
                    ]);
                });
                it('should parse mixed case bound attributes', function () {
                    expect(humanizeTplAst(parse('<div [attr.someAttr]="v">', []))).toEqual([
                        [template_ast_1.ElementAst, 'div'],
                        [template_ast_1.BoundElementPropertyAst, 1 /* Attribute */, 'someAttr', 'v', null]
                    ]);
                });
                it('should parse and dash case bound classes', function () {
                    expect(humanizeTplAst(parse('<div [class.some-class]="v">', []))).toEqual([
                        [template_ast_1.ElementAst, 'div'],
                        [template_ast_1.BoundElementPropertyAst, 2 /* Class */, 'some-class', 'v', null]
                    ]);
                });
                it('should parse mixed case bound classes', function () {
                    expect(humanizeTplAst(parse('<div [class.someClass]="v">', []))).toEqual([
                        [template_ast_1.ElementAst, 'div'],
                        [template_ast_1.BoundElementPropertyAst, 2 /* Class */, 'someClass', 'v', null]
                    ]);
                });
                it('should parse mixed case bound styles', function () {
                    expect(humanizeTplAst(parse('<div [style.someStyle]="v">', []))).toEqual([
                        [template_ast_1.ElementAst, 'div'],
                        [template_ast_1.BoundElementPropertyAst, 3 /* Style */, 'someStyle', 'v', null]
                    ]);
                });
                describe('errors', function () {
                    it('should throw error when binding to an unknown property', function () {
                        expect(function () { return parse('<my-component [invalidProp]="bar"></my-component>', []); })
                            .toThrowError("Template parse errors:\nCan't bind to 'invalidProp' since it isn't a known property of 'my-component'.\n1. If 'my-component' is an Angular component and it has 'invalidProp' input, then verify that it is part of this module.\n2. If 'my-component' is a Web Component then add 'CUSTOM_ELEMENTS_SCHEMA' to the '@NgModule.schemas' of this component to suppress this message.\n3. To allow any property add 'NO_ERRORS_SCHEMA' to the '@NgModule.schemas' of this component. (\"<my-component [ERROR ->][invalidProp]=\"bar\"></my-component>\"): TestComp@0:14");
                    });
                    it('should throw error when binding to an unknown property of ng-container', function () {
                        expect(function () { return parse('<ng-container [invalidProp]="bar"></ng-container>', []); })
                            .toThrowError("Template parse errors:\nCan't bind to 'invalidProp' since it isn't a known property of 'ng-container'.\n1. If 'invalidProp' is an Angular directive, then add 'CommonModule' to the '@NgModule.imports' of this component.\n2. To allow any property add 'NO_ERRORS_SCHEMA' to the '@NgModule.schemas' of this component." +
                            " (\"<ng-container [ERROR ->][invalidProp]=\"bar\"></ng-container>\"): TestComp@0:14");
                    });
                    it('should throw error when binding to an unknown element w/o bindings', function () {
                        expect(function () { return parse('<unknown></unknown>', []); }).toThrowError("Template parse errors:\n'unknown' is not a known element:\n1. If 'unknown' is an Angular component, then verify that it is part of this module.\n2. To allow any element add 'NO_ERRORS_SCHEMA' to the '@NgModule.schemas' of this component. (\"[ERROR ->]<unknown></unknown>\"): TestComp@0:0");
                    });
                    it('should throw error when binding to an unknown custom element w/o bindings', function () {
                        expect(function () { return parse('<un-known></un-known>', []); }).toThrowError("Template parse errors:\n'un-known' is not a known element:\n1. If 'un-known' is an Angular component, then verify that it is part of this module.\n2. If 'un-known' is a Web Component then add 'CUSTOM_ELEMENTS_SCHEMA' to the '@NgModule.schemas' of this component to suppress this message. (\"[ERROR ->]<un-known></un-known>\"): TestComp@0:0");
                    });
                    it('should throw error when binding to an invalid property', function () {
                        expect(function () { return parse('<my-component [onEvent]="bar"></my-component>', []); })
                            .toThrowError("Template parse errors:\nBinding to property 'onEvent' is disallowed for security reasons (\"<my-component [ERROR ->][onEvent]=\"bar\"></my-component>\"): TestComp@0:14");
                    });
                    it('should throw error when binding to an invalid attribute', function () {
                        expect(function () { return parse('<my-component [attr.onEvent]="bar"></my-component>', []); })
                            .toThrowError("Template parse errors:\nBinding to attribute 'onEvent' is disallowed for security reasons (\"<my-component [ERROR ->][attr.onEvent]=\"bar\"></my-component>\"): TestComp@0:14");
                    });
                });
                it('should parse bound properties via [...] and not report them as attributes', function () {
                    expect(humanizeTplAst(parse('<div [prop]="v">', []))).toEqual([
                        [template_ast_1.ElementAst, 'div'],
                        [template_ast_1.BoundElementPropertyAst, 0 /* Property */, 'prop', 'v', null]
                    ]);
                });
                it('should parse bound properties via bind- and not report them as attributes', function () {
                    expect(humanizeTplAst(parse('<div bind-prop="v">', []))).toEqual([
                        [template_ast_1.ElementAst, 'div'],
                        [template_ast_1.BoundElementPropertyAst, 0 /* Property */, 'prop', 'v', null]
                    ]);
                });
                it('should parse bound properties via {{...}} and not report them as attributes', function () {
                    expect(humanizeTplAst(parse('<div prop="{{v}}">', []))).toEqual([
                        [template_ast_1.ElementAst, 'div'],
                        [template_ast_1.BoundElementPropertyAst, 0 /* Property */, 'prop', '{{ v }}', null]
                    ]);
                });
                it('should parse bound properties via bind-animate- and not report them as attributes', function () {
                    expect(humanizeTplAst(parse('<div bind-animate-someAnimation="value2">', [], [], [])))
                        .toEqual([
                        [template_ast_1.ElementAst, 'div'],
                        [
                            template_ast_1.BoundElementPropertyAst, 4 /* Animation */, 'someAnimation',
                            'value2', null
                        ]
                    ]);
                });
                it('should throw an error when parsing detects non-bound properties via @ that contain a value', function () {
                    expect(function () { parse('<div @someAnimation="value2">', [], [], []); })
                        .toThrowError(/Assigning animation triggers via @prop="exp" attributes with an expression is invalid. Use property bindings \(e.g. \[@prop\]="exp"\) or use an attribute without a value \(e.g. @prop\) instead. \("<div \[ERROR ->\]@someAnimation="value2">"\): TestComp@0:5/);
                });
                it('should not issue a warning when host attributes contain a valid property-bound animation trigger', function () {
                    var animationEntries = ['prop'];
                    var dirA = compileDirectiveMetadataCreate({
                        selector: 'div',
                        template: compileTemplateMetadata({ animations: animationEntries }),
                        type: createTypeMeta({
                            reference: { filePath: someModuleUrl, name: 'DirA' },
                        }),
                        host: { '[@prop]': 'expr' }
                    }).toSummary();
                    humanizeTplAst(parse('<div></div>', [dirA]));
                    expect(console.warnings.length).toEqual(0);
                });
                it('should throw descriptive error when a host binding is not a string expression', function () {
                    var dirA = compileDirectiveMetadataCreate({
                        selector: 'broken',
                        type: createTypeMeta({ reference: { filePath: someModuleUrl, name: 'DirA' } }),
                        host: { '[class.foo]': null }
                    }).toSummary();
                    expect(function () { parse('<broken></broken>', [dirA]); })
                        .toThrowError("Template parse errors:\nValue of the host property binding \"class.foo\" needs to be a string representing an expression but got \"null\" (object) (\"[ERROR ->]<broken></broken>\"): TestComp@0:0, Directive DirA");
                });
                it('should throw descriptive error when a host event is not a string expression', function () {
                    var dirA = compileDirectiveMetadataCreate({
                        selector: 'broken',
                        type: createTypeMeta({ reference: { filePath: someModuleUrl, name: 'DirA' } }),
                        host: { '(click)': null }
                    }).toSummary();
                    expect(function () { parse('<broken></broken>', [dirA]); })
                        .toThrowError("Template parse errors:\nValue of the host listener \"click\" needs to be a string representing an expression but got \"null\" (object) (\"[ERROR ->]<broken></broken>\"): TestComp@0:0, Directive DirA");
                });
                it('should not issue a warning when an animation property is bound without an expression', function () {
                    humanizeTplAst(parse('<div @someAnimation>', [], [], []));
                    expect(console.warnings.length).toEqual(0);
                });
                it('should parse bound properties via [@] and not report them as attributes', function () {
                    expect(humanizeTplAst(parse('<div [@someAnimation]="value2">', [], [], []))).toEqual([
                        [template_ast_1.ElementAst, 'div'],
                        [
                            template_ast_1.BoundElementPropertyAst, 4 /* Animation */, 'someAnimation', 'value2',
                            null
                        ]
                    ]);
                });
                it('should support * directives', function () {
                    expect(humanizeTplAst(parse('<div *ngIf>', [ngIf]))).toEqual([
                        [template_ast_1.EmbeddedTemplateAst],
                        [template_ast_1.DirectiveAst, ngIf],
                        [template_ast_1.BoundDirectivePropertyAst, 'ngIf', 'null'],
                        [template_ast_1.ElementAst, 'div'],
                    ]);
                });
                it('should support <ng-template>', function () {
                    expect(humanizeTplAst(parse('<ng-template>', []))).toEqual([
                        [template_ast_1.EmbeddedTemplateAst],
                    ]);
                });
                it('should treat <template> as a regular tag', function () {
                    expect(humanizeTplAst(parse('<template>', []))).toEqual([
                        [template_ast_1.ElementAst, 'template'],
                    ]);
                });
                it('should not special case the template attribute', function () {
                    expect(humanizeTplAst(parse('<p template="ngFor">', []))).toEqual([
                        [template_ast_1.ElementAst, 'p'],
                        [template_ast_1.AttrAst, 'template', 'ngFor'],
                    ]);
                });
            });
            describe('events', function () {
                it('should parse bound events with a target', function () {
                    expect(humanizeTplAst(parse('<div (window:event)="v">', []))).toEqual([
                        [template_ast_1.ElementAst, 'div'],
                        [template_ast_1.BoundEventAst, 'event', 'window', 'v'],
                    ]);
                });
                it('should report an error on empty expression', function () {
                    expect(function () { return parse('<div (event)="">', []); })
                        .toThrowError(/Empty expressions are not allowed/);
                    expect(function () { return parse('<div (event)="  ">', []); })
                        .toThrowError(/Empty expressions are not allowed/);
                });
                it('should parse bound events via (...) and not report them as attributes', function () {
                    expect(humanizeTplAst(parse('<div (event)="v">', []))).toEqual([[template_ast_1.ElementAst, 'div'], [template_ast_1.BoundEventAst, 'event', null, 'v']]);
                });
                it('should parse event names case sensitive', function () {
                    expect(humanizeTplAst(parse('<div (some-event)="v">', []))).toEqual([[template_ast_1.ElementAst, 'div'], [template_ast_1.BoundEventAst, 'some-event', null, 'v']]);
                    expect(humanizeTplAst(parse('<div (someEvent)="v">', []))).toEqual([[template_ast_1.ElementAst, 'div'], [template_ast_1.BoundEventAst, 'someEvent', null, 'v']]);
                });
                it('should parse bound events via on- and not report them as attributes', function () {
                    expect(humanizeTplAst(parse('<div on-event="v">', []))).toEqual([[template_ast_1.ElementAst, 'div'], [template_ast_1.BoundEventAst, 'event', null, 'v']]);
                });
                it('should allow events on explicit embedded templates that are emitted by a directive', function () {
                    var dirA = compileDirectiveMetadataCreate({
                        selector: 'ng-template',
                        outputs: ['e'],
                        type: createTypeMeta({ reference: { filePath: someModuleUrl, name: 'DirA' } })
                    }).toSummary();
                    expect(humanizeTplAst(parse('<ng-template (e)="f"></ng-template>', [dirA]))).toEqual([
                        [template_ast_1.EmbeddedTemplateAst],
                        [template_ast_1.BoundEventAst, 'e', null, 'f'],
                        [template_ast_1.DirectiveAst, dirA],
                    ]);
                });
            });
            describe('bindon', function () {
                it('should parse bound events and properties via [(...)] and not report them as attributes', function () {
                    expect(humanizeTplAst(parse('<div [(prop)]="v">', []))).toEqual([
                        [template_ast_1.ElementAst, 'div'],
                        [template_ast_1.BoundElementPropertyAst, 0 /* Property */, 'prop', 'v', null],
                        [template_ast_1.BoundEventAst, 'propChange', null, 'v = $event']
                    ]);
                });
                it('should parse bound events and properties via bindon- and not report them as attributes', function () {
                    expect(humanizeTplAst(parse('<div bindon-prop="v">', []))).toEqual([
                        [template_ast_1.ElementAst, 'div'],
                        [template_ast_1.BoundElementPropertyAst, 0 /* Property */, 'prop', 'v', null],
                        [template_ast_1.BoundEventAst, 'propChange', null, 'v = $event']
                    ]);
                });
            });
            describe('directives', function () {
                it('should order directives by the directives array in the View and match them only once', function () {
                    var dirA = compileDirectiveMetadataCreate({
                        selector: '[a]',
                        type: createTypeMeta({ reference: { filePath: someModuleUrl, name: 'DirA' } })
                    }).toSummary();
                    var dirB = compileDirectiveMetadataCreate({
                        selector: '[b]',
                        type: createTypeMeta({ reference: { filePath: someModuleUrl, name: 'DirB' } })
                    }).toSummary();
                    var dirC = compileDirectiveMetadataCreate({
                        selector: '[c]',
                        type: createTypeMeta({ reference: { filePath: someModuleUrl, name: 'DirC' } })
                    }).toSummary();
                    expect(humanizeTplAst(parse('<div a c b a b>', [dirA, dirB, dirC]))).toEqual([
                        [template_ast_1.ElementAst, 'div'], [template_ast_1.AttrAst, 'a', ''], [template_ast_1.AttrAst, 'c', ''], [template_ast_1.AttrAst, 'b', ''],
                        [template_ast_1.AttrAst, 'a', ''], [template_ast_1.AttrAst, 'b', ''], [template_ast_1.DirectiveAst, dirA], [template_ast_1.DirectiveAst, dirB],
                        [template_ast_1.DirectiveAst, dirC]
                    ]);
                });
                it('should parse directive dotted properties', function () {
                    var dirA = compileDirectiveMetadataCreate({
                        selector: '[dot.name]',
                        type: createTypeMeta({ reference: { filePath: someModuleUrl, name: 'DirA' } }),
                        inputs: ['localName: dot.name'],
                    }).toSummary();
                    expect(humanizeTplAst(parse('<div [dot.name]="expr"></div>', [dirA]))).toEqual([
                        [template_ast_1.ElementAst, 'div'],
                        [template_ast_1.DirectiveAst, dirA],
                        [template_ast_1.BoundDirectivePropertyAst, 'localName', 'expr'],
                    ]);
                });
                it('should locate directives in property bindings', function () {
                    var dirA = compileDirectiveMetadataCreate({
                        selector: '[a=b]',
                        type: createTypeMeta({ reference: { filePath: someModuleUrl, name: 'DirA' } })
                    }).toSummary();
                    var dirB = compileDirectiveMetadataCreate({
                        selector: '[b]',
                        type: createTypeMeta({ reference: { filePath: someModuleUrl, name: 'DirB' } })
                    }).toSummary();
                    expect(humanizeTplAst(parse('<div [a]="b">', [dirA, dirB]))).toEqual([
                        [template_ast_1.ElementAst, 'div'],
                        [template_ast_1.BoundElementPropertyAst, 0 /* Property */, 'a', 'b', null],
                        [template_ast_1.DirectiveAst, dirA]
                    ]);
                });
                it('should locate directives in inline templates', function () {
                    var dirTemplate = compileDirectiveMetadataCreate({
                        selector: 'ng-template',
                        type: createTypeMeta({ reference: { filePath: someModuleUrl, name: 'onTemplate' } })
                    }).toSummary();
                    expect(humanizeTplAst(parse('<div *ngIf="cond">', [ngIf, dirTemplate]))).toEqual([
                        [template_ast_1.EmbeddedTemplateAst],
                        [template_ast_1.DirectiveAst, ngIf],
                        [template_ast_1.BoundDirectivePropertyAst, 'ngIf', 'cond'],
                        [template_ast_1.DirectiveAst, dirTemplate],
                        [template_ast_1.ElementAst, 'div'],
                    ]);
                });
                it('should locate directives in event bindings', function () {
                    var dirA = compileDirectiveMetadataCreate({
                        selector: '[a]',
                        type: createTypeMeta({ reference: { filePath: someModuleUrl, name: 'DirB' } })
                    }).toSummary();
                    expect(humanizeTplAst(parse('<div (a)="b">', [dirA]))).toEqual([
                        [template_ast_1.ElementAst, 'div'], [template_ast_1.BoundEventAst, 'a', null, 'b'], [template_ast_1.DirectiveAst, dirA]
                    ]);
                });
                it('should parse directive host properties', function () {
                    var dirA = compileDirectiveMetadataCreate({
                        selector: 'div',
                        type: createTypeMeta({ reference: { filePath: someModuleUrl, name: 'DirA' } }),
                        host: { '[a]': 'expr' }
                    }).toSummary();
                    expect(humanizeTplAst(parse('<div></div>', [dirA]))).toEqual([
                        [template_ast_1.ElementAst, 'div'], [template_ast_1.DirectiveAst, dirA],
                        [template_ast_1.BoundElementPropertyAst, 0 /* Property */, 'a', 'expr', null]
                    ]);
                });
                it('should parse directive host listeners', function () {
                    var dirA = compileDirectiveMetadataCreate({
                        selector: 'div',
                        type: createTypeMeta({ reference: { filePath: someModuleUrl, name: 'DirA' } }),
                        host: { '(a)': 'expr' }
                    }).toSummary();
                    expect(humanizeTplAst(parse('<div></div>', [dirA]))).toEqual([
                        [template_ast_1.ElementAst, 'div'], [template_ast_1.DirectiveAst, dirA], [template_ast_1.BoundEventAst, 'a', null, 'expr']
                    ]);
                });
                it('should parse directive properties', function () {
                    var dirA = compileDirectiveMetadataCreate({
                        selector: 'div',
                        type: createTypeMeta({ reference: { filePath: someModuleUrl, name: 'DirA' } }),
                        inputs: ['aProp']
                    }).toSummary();
                    expect(humanizeTplAst(parse('<div [aProp]="expr"></div>', [dirA]))).toEqual([
                        [template_ast_1.ElementAst, 'div'], [template_ast_1.DirectiveAst, dirA],
                        [template_ast_1.BoundDirectivePropertyAst, 'aProp', 'expr']
                    ]);
                });
                it('should parse renamed directive properties', function () {
                    var dirA = compileDirectiveMetadataCreate({
                        selector: 'div',
                        type: createTypeMeta({ reference: { filePath: someModuleUrl, name: 'DirA' } }),
                        inputs: ['b:a']
                    }).toSummary();
                    expect(humanizeTplAst(parse('<div [a]="expr"></div>', [dirA]))).toEqual([
                        [template_ast_1.ElementAst, 'div'], [template_ast_1.DirectiveAst, dirA], [template_ast_1.BoundDirectivePropertyAst, 'b', 'expr']
                    ]);
                });
                it('should parse literal directive properties', function () {
                    var dirA = compileDirectiveMetadataCreate({
                        selector: 'div',
                        type: createTypeMeta({ reference: { filePath: someModuleUrl, name: 'DirA' } }),
                        inputs: ['a']
                    }).toSummary();
                    expect(humanizeTplAst(parse('<div a="literal"></div>', [dirA]))).toEqual([
                        [template_ast_1.ElementAst, 'div'], [template_ast_1.AttrAst, 'a', 'literal'], [template_ast_1.DirectiveAst, dirA],
                        [template_ast_1.BoundDirectivePropertyAst, 'a', '"literal"']
                    ]);
                });
                it('should favor explicit bound properties over literal properties', function () {
                    var dirA = compileDirectiveMetadataCreate({
                        selector: 'div',
                        type: createTypeMeta({ reference: { filePath: someModuleUrl, name: 'DirA' } }),
                        inputs: ['a']
                    }).toSummary();
                    expect(humanizeTplAst(parse('<div a="literal" [a]="\'literal2\'"></div>', [dirA])))
                        .toEqual([
                        [template_ast_1.ElementAst, 'div'], [template_ast_1.AttrAst, 'a', 'literal'], [template_ast_1.DirectiveAst, dirA],
                        [template_ast_1.BoundDirectivePropertyAst, 'a', '"literal2"']
                    ]);
                });
                it('should support optional directive properties', function () {
                    var dirA = compileDirectiveMetadataCreate({
                        selector: 'div',
                        type: createTypeMeta({ reference: { filePath: someModuleUrl, name: 'DirA' } }),
                        inputs: ['a']
                    }).toSummary();
                    expect(humanizeTplAst(parse('<div></div>', [dirA]))).toEqual([
                        [template_ast_1.ElementAst, 'div'], [template_ast_1.DirectiveAst, dirA]
                    ]);
                });
            });
            describe('providers', function () {
                var nextProviderId;
                function createToken(value) {
                    var token;
                    if (value.startsWith('type:')) {
                        var name_1 = value.substring(5);
                        token = { identifier: createTypeMeta({ reference: name_1 }) };
                    }
                    else {
                        token = { value: value };
                    }
                    return token;
                }
                function createDep(value) {
                    var isOptional = false;
                    if (value.startsWith('optional:')) {
                        isOptional = true;
                        value = value.substring(9);
                    }
                    var isSelf = false;
                    if (value.startsWith('self:')) {
                        isSelf = true;
                        value = value.substring(5);
                    }
                    var isHost = false;
                    if (value.startsWith('host:')) {
                        isHost = true;
                        value = value.substring(5);
                    }
                    return {
                        token: createToken(value),
                        isOptional: isOptional,
                        isSelf: isSelf,
                        isHost: isHost
                    };
                }
                function createProvider(token, _a) {
                    var _b = _a === void 0 ? {} : _a, _c = _b.multi, multi = _c === void 0 ? false : _c, _d = _b.deps, deps = _d === void 0 ? [] : _d;
                    var compileToken = createToken(token);
                    return {
                        token: compileToken,
                        multi: multi,
                        useClass: createTypeMeta({ reference: compile_metadata_1.tokenReference(compileToken) }),
                        deps: deps.map(createDep),
                        useExisting: undefined,
                        useFactory: undefined,
                        useValue: undefined
                    };
                }
                function createDir(selector, _a) {
                    var _b = _a === void 0 ? {} : _a, _c = _b.providers, providers = _c === void 0 ? null : _c, _d = _b.viewProviders, viewProviders = _d === void 0 ? null : _d, _e = _b.deps, deps = _e === void 0 ? [] : _e, _f = _b.queries, queries = _f === void 0 ? [] : _f;
                    var isComponent = !selector.startsWith('[');
                    return compileDirectiveMetadataCreate({
                        selector: selector,
                        type: createTypeMeta({
                            reference: selector,
                            diDeps: deps.map(createDep),
                        }),
                        isComponent: isComponent,
                        template: compileTemplateMetadata({ ngContentSelectors: [] }),
                        providers: providers,
                        viewProviders: viewProviders,
                        queries: queries.map(function (value) {
                            return {
                                selectors: [createToken(value)],
                                descendants: false,
                                first: false,
                                propertyName: 'test',
                                read: undefined
                            };
                        })
                    })
                        .toSummary();
                }
                beforeEach(function () { nextProviderId = 0; });
                it('should provide a component', function () {
                    var comp = createDir('my-comp');
                    var elAst = parse('<my-comp>', [comp])[0];
                    expect(elAst.providers.length).toBe(1);
                    expect(elAst.providers[0].providerType).toBe(template_ast_1.ProviderAstType.Component);
                    expect(elAst.providers[0].providers[0].useClass).toBe(comp.type);
                });
                it('should provide a directive', function () {
                    var dirA = createDir('[dirA]');
                    var elAst = parse('<div dirA>', [dirA])[0];
                    expect(elAst.providers.length).toBe(1);
                    expect(elAst.providers[0].providerType).toBe(template_ast_1.ProviderAstType.Directive);
                    expect(elAst.providers[0].providers[0].useClass).toBe(dirA.type);
                });
                it('should use the public providers of a directive', function () {
                    var provider = createProvider('service');
                    var dirA = createDir('[dirA]', { providers: [provider] });
                    var elAst = parse('<div dirA>', [dirA])[0];
                    expect(elAst.providers.length).toBe(2);
                    expect(elAst.providers[0].providerType).toBe(template_ast_1.ProviderAstType.PublicService);
                    expect(elAst.providers[0].providers).toEqual([provider]);
                });
                it('should use the private providers of a component', function () {
                    var provider = createProvider('service');
                    var comp = createDir('my-comp', { viewProviders: [provider] });
                    var elAst = parse('<my-comp>', [comp])[0];
                    expect(elAst.providers.length).toBe(2);
                    expect(elAst.providers[0].providerType).toBe(template_ast_1.ProviderAstType.PrivateService);
                    expect(elAst.providers[0].providers).toEqual([provider]);
                });
                it('should support multi providers', function () {
                    var provider0 = createProvider('service0', { multi: true });
                    var provider1 = createProvider('service1', { multi: true });
                    var provider2 = createProvider('service0', { multi: true });
                    var dirA = createDir('[dirA]', { providers: [provider0, provider1] });
                    var dirB = createDir('[dirB]', { providers: [provider2] });
                    var elAst = parse('<div dirA dirB>', [dirA, dirB])[0];
                    expect(elAst.providers.length).toBe(4);
                    expect(elAst.providers[0].providers).toEqual([provider0, provider2]);
                    expect(elAst.providers[1].providers).toEqual([provider1]);
                });
                it('should overwrite non multi providers', function () {
                    var provider1 = createProvider('service0');
                    var provider2 = createProvider('service1');
                    var provider3 = createProvider('service0');
                    var dirA = createDir('[dirA]', { providers: [provider1, provider2] });
                    var dirB = createDir('[dirB]', { providers: [provider3] });
                    var elAst = parse('<div dirA dirB>', [dirA, dirB])[0];
                    expect(elAst.providers.length).toBe(4);
                    expect(elAst.providers[0].providers).toEqual([provider3]);
                    expect(elAst.providers[1].providers).toEqual([provider2]);
                });
                it('should overwrite component providers by directive providers', function () {
                    var compProvider = createProvider('service0');
                    var dirProvider = createProvider('service0');
                    var comp = createDir('my-comp', { providers: [compProvider] });
                    var dirA = createDir('[dirA]', { providers: [dirProvider] });
                    var elAst = parse('<my-comp dirA>', [dirA, comp])[0];
                    expect(elAst.providers.length).toBe(3);
                    expect(elAst.providers[0].providers).toEqual([dirProvider]);
                });
                it('should overwrite view providers by directive providers', function () {
                    var viewProvider = createProvider('service0');
                    var dirProvider = createProvider('service0');
                    var comp = createDir('my-comp', { viewProviders: [viewProvider] });
                    var dirA = createDir('[dirA]', { providers: [dirProvider] });
                    var elAst = parse('<my-comp dirA>', [dirA, comp])[0];
                    expect(elAst.providers.length).toBe(3);
                    expect(elAst.providers[0].providers).toEqual([dirProvider]);
                });
                it('should overwrite directives by providers', function () {
                    var dirProvider = createProvider('type:my-comp');
                    var comp = createDir('my-comp', { providers: [dirProvider] });
                    var elAst = parse('<my-comp>', [comp])[0];
                    expect(elAst.providers.length).toBe(1);
                    expect(elAst.providers[0].providers).toEqual([dirProvider]);
                });
                it('if mixing multi and non multi providers', function () {
                    var provider0 = createProvider('service0');
                    var provider1 = createProvider('service0', { multi: true });
                    var dirA = createDir('[dirA]', { providers: [provider0] });
                    var dirB = createDir('[dirB]', { providers: [provider1] });
                    expect(function () { return parse('<div dirA dirB>', [dirA, dirB]); })
                        .toThrowError("Template parse errors:\n" +
                        "Mixing multi and non multi provider is not possible for token service0 (\"[ERROR ->]<div dirA dirB>\"): TestComp@0:0");
                });
                it('should sort providers by their DI order, lazy providers first', function () {
                    var provider0 = createProvider('service0', { deps: ['type:[dir2]'] });
                    var provider1 = createProvider('service1');
                    var dir2 = createDir('[dir2]', { deps: ['service1'] });
                    var comp = createDir('my-comp', { providers: [provider0, provider1] });
                    var elAst = parse('<my-comp dir2>', [comp, dir2])[0];
                    expect(elAst.providers.length).toBe(4);
                    expect(elAst.providers[1].providers[0].useClass).toEqual(comp.type);
                    expect(elAst.providers[2].providers).toEqual([provider1]);
                    expect(elAst.providers[3].providers[0].useClass).toEqual(dir2.type);
                    expect(elAst.providers[0].providers).toEqual([provider0]);
                });
                it('should sort directives by their DI order', function () {
                    var dir0 = createDir('[dir0]', { deps: ['type:my-comp'] });
                    var dir1 = createDir('[dir1]', { deps: ['type:[dir0]'] });
                    var dir2 = createDir('[dir2]', { deps: ['type:[dir1]'] });
                    var comp = createDir('my-comp');
                    var elAst = parse('<my-comp dir2 dir0 dir1>', [comp, dir2, dir0, dir1])[0];
                    expect(elAst.providers.length).toBe(4);
                    expect(elAst.directives[0].directive).toBe(comp);
                    expect(elAst.directives[1].directive).toBe(dir0);
                    expect(elAst.directives[2].directive).toBe(dir1);
                    expect(elAst.directives[3].directive).toBe(dir2);
                });
                it('should mark directives and dependencies of directives as eager', function () {
                    var provider0 = createProvider('service0');
                    var provider1 = createProvider('service1');
                    var dirA = createDir('[dirA]', { providers: [provider0, provider1], deps: ['service0'] });
                    var elAst = parse('<div dirA>', [dirA])[0];
                    expect(elAst.providers.length).toBe(3);
                    expect(elAst.providers[1].providers).toEqual([provider0]);
                    expect(elAst.providers[1].eager).toBe(true);
                    expect(elAst.providers[2].providers[0].useClass).toEqual(dirA.type);
                    expect(elAst.providers[2].eager).toBe(true);
                    expect(elAst.providers[0].providers).toEqual([provider1]);
                    expect(elAst.providers[0].eager).toBe(false);
                });
                it('should mark dependencies on parent elements as eager', function () {
                    var provider0 = createProvider('service0');
                    var provider1 = createProvider('service1');
                    var dirA = createDir('[dirA]', { providers: [provider0, provider1] });
                    var dirB = createDir('[dirB]', { deps: ['service0'] });
                    var elAst = parse('<div dirA><div dirB></div></div>', [dirA, dirB])[0];
                    expect(elAst.providers.length).toBe(3);
                    expect(elAst.providers[1].providers[0].useClass).toEqual(dirA.type);
                    expect(elAst.providers[1].eager).toBe(true);
                    expect(elAst.providers[2].providers).toEqual([provider0]);
                    expect(elAst.providers[2].eager).toBe(true);
                    expect(elAst.providers[0].providers).toEqual([provider1]);
                    expect(elAst.providers[0].eager).toBe(false);
                });
                it('should mark queried providers as eager', function () {
                    var provider0 = createProvider('service0');
                    var provider1 = createProvider('service1');
                    var dirA = createDir('[dirA]', { providers: [provider0, provider1], queries: ['service0'] });
                    var elAst = parse('<div dirA></div>', [dirA])[0];
                    expect(elAst.providers.length).toBe(3);
                    expect(elAst.providers[1].providers[0].useClass).toEqual(dirA.type);
                    expect(elAst.providers[1].eager).toBe(true);
                    expect(elAst.providers[2].providers).toEqual([provider0]);
                    expect(elAst.providers[2].eager).toBe(true);
                    expect(elAst.providers[0].providers).toEqual([provider1]);
                    expect(elAst.providers[0].eager).toBe(false);
                });
                it('should not mark dependencies across embedded views as eager', function () {
                    var provider0 = createProvider('service0');
                    var dirA = createDir('[dirA]', { providers: [provider0] });
                    var dirB = createDir('[dirB]', { deps: ['service0'] });
                    var elAst = parse('<div dirA><div *ngIf dirB></div></div>', [dirA, dirB])[0];
                    expect(elAst.providers.length).toBe(2);
                    expect(elAst.providers[1].providers[0].useClass).toEqual(dirA.type);
                    expect(elAst.providers[1].eager).toBe(true);
                    expect(elAst.providers[0].providers).toEqual([provider0]);
                    expect(elAst.providers[0].eager).toBe(false);
                });
                it('should report missing @Self() deps as errors', function () {
                    var dirA = createDir('[dirA]', { deps: ['self:provider0'] });
                    expect(function () { return parse('<div dirA></div>', [dirA]); })
                        .toThrowError('Template parse errors:\nNo provider for provider0 ("[ERROR ->]<div dirA></div>"): TestComp@0:0');
                });
                it('should change missing @Self() that are optional to nulls', function () {
                    var dirA = createDir('[dirA]', { deps: ['optional:self:provider0'] });
                    var elAst = parse('<div dirA></div>', [dirA])[0];
                    expect(elAst.providers[0].providers[0].deps[0].isValue).toBe(true);
                    expect(elAst.providers[0].providers[0].deps[0].value).toBe(null);
                });
                it('should report missing @Host() deps as errors', function () {
                    var dirA = createDir('[dirA]', { deps: ['host:provider0'] });
                    expect(function () { return parse('<div dirA></div>', [dirA]); })
                        .toThrowError('Template parse errors:\nNo provider for provider0 ("[ERROR ->]<div dirA></div>"): TestComp@0:0');
                });
                it('should change missing @Host() that are optional to nulls', function () {
                    var dirA = createDir('[dirA]', { deps: ['optional:host:provider0'] });
                    var elAst = parse('<div dirA></div>', [dirA])[0];
                    expect(elAst.providers[0].providers[0].deps[0].isValue).toBe(true);
                    expect(elAst.providers[0].providers[0].deps[0].value).toBe(null);
                });
            });
            describe('references', function () {
                it('should parse references via #... and not report them as attributes', function () {
                    expect(humanizeTplAst(parse('<div #a>', []))).toEqual([[template_ast_1.ElementAst, 'div'], [template_ast_1.ReferenceAst, 'a', null]]);
                });
                it('should parse references via ref-... and not report them as attributes', function () {
                    expect(humanizeTplAst(parse('<div ref-a>', []))).toEqual([[template_ast_1.ElementAst, 'div'], [template_ast_1.ReferenceAst, 'a', null]]);
                });
                it('should parse camel case references', function () {
                    expect(humanizeTplAst(parse('<div ref-someA>', []))).toEqual([[template_ast_1.ElementAst, 'div'], [template_ast_1.ReferenceAst, 'someA', null]]);
                });
                it('should assign references with empty value to the element', function () {
                    expect(humanizeTplAst(parse('<div #a></div>', []))).toEqual([[template_ast_1.ElementAst, 'div'], [template_ast_1.ReferenceAst, 'a', null]]);
                });
                it('should assign references to directives via exportAs', function () {
                    var dirA = compileDirectiveMetadataCreate({
                        selector: '[a]',
                        type: createTypeMeta({ reference: { filePath: someModuleUrl, name: 'DirA' } }),
                        exportAs: 'dirA'
                    }).toSummary();
                    expect(humanizeTplAst(parse('<div a #a="dirA"></div>', [dirA]))).toEqual([
                        [template_ast_1.ElementAst, 'div'],
                        [template_ast_1.AttrAst, 'a', ''],
                        [template_ast_1.ReferenceAst, 'a', identifiers_1.createTokenForReference(dirA.type.reference)],
                        [template_ast_1.DirectiveAst, dirA],
                    ]);
                });
                it('should assign references to directives via exportAs with multiple names', function () {
                    var pizzaTestDirective = compileDirectiveMetadataCreate({
                        selector: 'pizza-test',
                        type: createTypeMeta({ reference: { filePath: someModuleUrl, name: 'Pizza' } }),
                        exportAs: 'pizza, cheeseSauceBread'
                    }).toSummary();
                    var template = '<pizza-test #food="pizza" #yum="cheeseSauceBread"></pizza-test>';
                    expect(humanizeTplAst(parse(template, [pizzaTestDirective]))).toEqual([
                        [template_ast_1.ElementAst, 'pizza-test'],
                        [template_ast_1.ReferenceAst, 'food', identifiers_1.createTokenForReference(pizzaTestDirective.type.reference)],
                        [template_ast_1.ReferenceAst, 'yum', identifiers_1.createTokenForReference(pizzaTestDirective.type.reference)],
                        [template_ast_1.DirectiveAst, pizzaTestDirective],
                    ]);
                });
                it('should report references with values that don\'t match a directive as errors', function () {
                    expect(function () { return parse('<div #a="dirA"></div>', []); }).toThrowError("Template parse errors:\nThere is no directive with \"exportAs\" set to \"dirA\" (\"<div [ERROR ->]#a=\"dirA\"></div>\"): TestComp@0:5");
                });
                it('should report invalid reference names', function () {
                    expect(function () { return parse('<div #a-b></div>', []); }).toThrowError("Template parse errors:\n\"-\" is not allowed in reference names (\"<div [ERROR ->]#a-b></div>\"): TestComp@0:5");
                });
                it('should report variables as errors', function () {
                    expect(function () { return parse('<div let-a></div>', []); }).toThrowError("Template parse errors:\n\"let-\" is only supported on ng-template elements. (\"<div [ERROR ->]let-a></div>\"): TestComp@0:5");
                });
                it('should report duplicate reference names', function () {
                    expect(function () { return parse('<div #a></div><div #a></div>', []); })
                        .toThrowError("Template parse errors:\nReference \"#a\" is defined several times (\"<div #a></div><div [ERROR ->]#a></div>\"): TestComp@0:19");
                });
                it('should report duplicate reference names when using multiple exportAs names', function () {
                    var pizzaDirective = compileDirectiveMetadataCreate({
                        selector: '[dessert-pizza]',
                        type: createTypeMeta({ reference: { filePath: someModuleUrl, name: 'Pizza' } }),
                        exportAs: 'dessertPizza, chocolate'
                    }).toSummary();
                    var chocolateDirective = compileDirectiveMetadataCreate({
                        selector: '[chocolate]',
                        type: createTypeMeta({ reference: { filePath: someModuleUrl, name: 'Chocolate' } }),
                        exportAs: 'chocolate'
                    }).toSummary();
                    var template = '<div dessert-pizza chocolate #snack="chocolate"></div>';
                    var compileTemplate = function () { return parse(template, [pizzaDirective, chocolateDirective]); };
                    var duplicateReferenceError = 'Template parse errors:\n' +
                        'Reference "#snack" is defined several times ' +
                        '("<div dessert-pizza chocolate [ERROR ->]#snack="chocolate"></div>")' +
                        ': TestComp@0:29';
                    expect(compileTemplate).toThrowError(duplicateReferenceError);
                });
                it('should not throw error when there is same reference name in different templates', function () {
                    expect(function () { return parse('<div #a><ng-template #a><span>OK</span></ng-template></div>', []); })
                        .not.toThrowError();
                });
                it('should assign references with empty value to components', function () {
                    var dirA = compileDirectiveMetadataCreate({
                        selector: '[a]',
                        isComponent: true,
                        type: createTypeMeta({ reference: { filePath: someModuleUrl, name: 'DirA' } }),
                        exportAs: 'dirA',
                        template: compileTemplateMetadata({ ngContentSelectors: [] })
                    }).toSummary();
                    expect(humanizeTplAst(parse('<div a #a></div>', [dirA]))).toEqual([
                        [template_ast_1.ElementAst, 'div'],
                        [template_ast_1.AttrAst, 'a', ''],
                        [template_ast_1.ReferenceAst, 'a', identifiers_1.createTokenForReference(dirA.type.reference)],
                        [template_ast_1.DirectiveAst, dirA],
                    ]);
                });
                it('should not locate directives in references', function () {
                    var dirA = compileDirectiveMetadataCreate({
                        selector: '[a]',
                        type: createTypeMeta({ reference: { filePath: someModuleUrl, name: 'DirA' } })
                    }).toSummary();
                    expect(humanizeTplAst(parse('<div ref-a>', [dirA]))).toEqual([
                        [template_ast_1.ElementAst, 'div'], [template_ast_1.ReferenceAst, 'a', null]
                    ]);
                });
            });
            describe('explicit templates', function () {
                var reflector;
                beforeEach(function () { reflector = new compiler_reflector_1.JitReflector(); });
                it('should create embedded templates for <ng-template> elements', function () {
                    expect(humanizeTplAst(parse('<ng-template></ng-template>', []))).toEqual([[template_ast_1.EmbeddedTemplateAst]]);
                });
                it('should create embedded templates for <ng-template> elements regardless the namespace', function () {
                    expect(humanizeTplAst(parse('<svg><ng-template></ng-template></svg>', []))).toEqual([
                        [template_ast_1.ElementAst, ':svg:svg'],
                        [template_ast_1.EmbeddedTemplateAst],
                    ]);
                });
                it('should support references via #...', function () {
                    expect(humanizeTplAst(parse('<ng-template #a>', []))).toEqual([
                        [template_ast_1.EmbeddedTemplateAst],
                        [
                            template_ast_1.ReferenceAst, 'a', identifiers_1.createTokenForExternalReference(reflector, identifiers_1.Identifiers.TemplateRef)
                        ],
                    ]);
                });
                it('should support references via ref-...', function () {
                    expect(humanizeTplAst(parse('<ng-template ref-a>', []))).toEqual([
                        [template_ast_1.EmbeddedTemplateAst],
                        [
                            template_ast_1.ReferenceAst, 'a', identifiers_1.createTokenForExternalReference(reflector, identifiers_1.Identifiers.TemplateRef)
                        ]
                    ]);
                });
                it('should parse variables via let-...', function () {
                    expect(humanizeTplAst(parse('<ng-template let-a="b">', []))).toEqual([
                        [template_ast_1.EmbeddedTemplateAst],
                        [template_ast_1.VariableAst, 'a', 'b'],
                    ]);
                });
                it('should not locate directives in variables', function () {
                    var dirA = compileDirectiveMetadataCreate({
                        selector: '[a]',
                        type: createTypeMeta({ reference: { filePath: someModuleUrl, name: 'DirA' } })
                    }).toSummary();
                    expect(humanizeTplAst(parse('<ng-template let-a="b"></ng-template>', [dirA]))).toEqual([
                        [template_ast_1.EmbeddedTemplateAst],
                        [template_ast_1.VariableAst, 'a', 'b'],
                    ]);
                });
            });
            describe('inline templates', function () {
                it('should report an error on variables declared with #', function () {
                    expect(function () { return humanizeTplAst(parse('<div *ngIf="#a=b">', [])); })
                        .toThrowError(/Parser Error: Unexpected token # at column 1/);
                });
                it('should parse variables via let ...', function () {
                    var targetAst = [
                        [template_ast_1.EmbeddedTemplateAst],
                        [template_ast_1.VariableAst, 'a', 'b'],
                        [template_ast_1.ElementAst, 'div'],
                    ];
                    expect(humanizeTplAst(parse('<div *ngIf="let a=b">', []))).toEqual(targetAst);
                    expect(humanizeTplAst(parse('<div data-*ngIf="let a=b">', []))).toEqual(targetAst);
                });
                it('should parse variables via as ...', function () {
                    var targetAst = [
                        [template_ast_1.EmbeddedTemplateAst],
                        [template_ast_1.VariableAst, 'local', 'ngIf'],
                        [template_ast_1.DirectiveAst, ngIf],
                        [template_ast_1.BoundDirectivePropertyAst, 'ngIf', 'expr'],
                        [template_ast_1.ElementAst, 'div'],
                    ];
                    expect(humanizeTplAst(parse('<div *ngIf="expr as local">', [ngIf]))).toEqual(targetAst);
                });
                describe('directives', function () {
                    it('should locate directives in property bindings', function () {
                        var dirA = compileDirectiveMetadataCreate({
                            selector: '[a=b]',
                            type: createTypeMeta({ reference: { filePath: someModuleUrl, name: 'DirA' } }),
                            inputs: ['a']
                        }).toSummary();
                        var dirB = compileDirectiveMetadataCreate({
                            selector: '[b]',
                            type: createTypeMeta({ reference: { filePath: someModuleUrl, name: 'DirB' } })
                        }).toSummary();
                        expect(humanizeTplAst(parse('<div *a="b" b>', [dirA, dirB]))).toEqual([
                            [template_ast_1.EmbeddedTemplateAst], [template_ast_1.DirectiveAst, dirA], [template_ast_1.BoundDirectivePropertyAst, 'a', 'b'],
                            [template_ast_1.ElementAst, 'div'], [template_ast_1.AttrAst, 'b', ''], [template_ast_1.DirectiveAst, dirB]
                        ]);
                    });
                    it('should not locate directives in variables', function () {
                        var dirA = compileDirectiveMetadataCreate({
                            selector: '[a]',
                            type: createTypeMeta({ reference: { filePath: someModuleUrl, name: 'DirA' } })
                        }).toSummary();
                        expect(humanizeTplAst(parse('<ng-template let-a="b"><div></div></ng-template>', [dirA])))
                            .toEqual([
                            [template_ast_1.EmbeddedTemplateAst],
                            [template_ast_1.VariableAst, 'a', 'b'],
                            [template_ast_1.ElementAst, 'div'],
                        ]);
                    });
                    it('should not locate directives in references', function () {
                        var dirA = compileDirectiveMetadataCreate({
                            selector: '[a]',
                            type: createTypeMeta({ reference: { filePath: someModuleUrl, name: 'DirA' } })
                        }).toSummary();
                        expect(humanizeTplAst(parse('<div ref-a>', [dirA]))).toEqual([
                            [template_ast_1.ElementAst, 'div'], [template_ast_1.ReferenceAst, 'a', null]
                        ]);
                    });
                });
                it('should work with *... and use the attribute name as property binding name', function () {
                    expect(humanizeTplAst(parse('<div *ngIf="test">', [ngIf]))).toEqual([
                        [template_ast_1.EmbeddedTemplateAst],
                        [template_ast_1.DirectiveAst, ngIf],
                        [template_ast_1.BoundDirectivePropertyAst, 'ngIf', 'test'],
                        [template_ast_1.ElementAst, 'div'],
                    ]);
                    // https://github.com/angular/angular/issues/13800
                    expect(humanizeTplAst(parse('<div *ngIf="-1">', [ngIf]))).toEqual([
                        [template_ast_1.EmbeddedTemplateAst],
                        [template_ast_1.DirectiveAst, ngIf],
                        [template_ast_1.BoundDirectivePropertyAst, 'ngIf', '0 - 1'],
                        [template_ast_1.ElementAst, 'div'],
                    ]);
                });
                it('should work with *... and empty value', function () {
                    expect(humanizeTplAst(parse('<div *ngIf>', [ngIf]))).toEqual([
                        [template_ast_1.EmbeddedTemplateAst],
                        [template_ast_1.DirectiveAst, ngIf],
                        [template_ast_1.BoundDirectivePropertyAst, 'ngIf', 'null'],
                        [template_ast_1.ElementAst, 'div'],
                    ]);
                });
            });
        });
        describe('content projection', function () {
            var compCounter;
            beforeEach(function () { compCounter = 0; });
            function createComp(selector, ngContentSelectors) {
                return compileDirectiveMetadataCreate({
                    selector: selector,
                    isComponent: true,
                    type: createTypeMeta({ reference: { filePath: someModuleUrl, name: "SomeComp" + compCounter++ } }),
                    template: compileTemplateMetadata({ ngContentSelectors: ngContentSelectors })
                })
                    .toSummary();
            }
            function createDir(selector) {
                return compileDirectiveMetadataCreate({
                    selector: selector,
                    type: createTypeMeta({ reference: { filePath: someModuleUrl, name: "SomeDir" + compCounter++ } })
                })
                    .toSummary();
            }
            describe('project text nodes', function () {
                it('should project text nodes with wildcard selector', function () {
                    expect(humanizeContentProjection(parse('<div>hello</div>', [createComp('div', ['*'])])))
                        .toEqual([
                        ['div', null],
                        ['#text(hello)', 0],
                    ]);
                });
            });
            describe('project elements', function () {
                it('should project elements with wildcard selector', function () {
                    expect(humanizeContentProjection(parse('<div><span></span></div>', [
                        createComp('div', ['*'])
                    ]))).toEqual([['div', null], ['span', 0]]);
                });
                it('should project elements with css selector', function () {
                    expect(humanizeContentProjection(parse('<div><a x></a><b></b></div>', [createComp('div', ['a[x]'])])))
                        .toEqual([
                        ['div', null],
                        ['a', 0],
                        ['b', null],
                    ]);
                });
            });
            describe('embedded templates', function () {
                it('should project embedded templates with wildcard selector', function () {
                    expect(humanizeContentProjection(parse('<div><ng-template></ng-template></div>', [createComp('div', ['*'])])))
                        .toEqual([
                        ['div', null],
                        ['template', 0],
                    ]);
                });
                it('should project embedded templates with css selector', function () {
                    expect(humanizeContentProjection(parse('<div><ng-template x></ng-template><ng-template></ng-template></div>', [createComp('div', ['ng-template[x]'])])))
                        .toEqual([
                        ['div', null],
                        ['template', 0],
                        ['template', null],
                    ]);
                });
            });
            describe('ng-content', function () {
                it('should project ng-content with wildcard selector', function () {
                    expect(humanizeContentProjection(parse('<div><ng-content></ng-content></div>', [
                        createComp('div', ['*'])
                    ]))).toEqual([['div', null], ['ng-content', 0]]);
                });
                it('should project ng-content with css selector', function () {
                    expect(humanizeContentProjection(parse('<div><ng-content x></ng-content><ng-content></ng-content></div>', [createComp('div', ['ng-content[x]'])])))
                        .toEqual([['div', null], ['ng-content', 0], ['ng-content', null]]);
                });
            });
            it('should project into the first matching ng-content', function () {
                expect(humanizeContentProjection(parse('<div>hello<b></b><a></a></div>', [
                    createComp('div', ['a', 'b', '*'])
                ]))).toEqual([['div', null], ['#text(hello)', 2], ['b', 1], ['a', 0]]);
            });
            it('should project into wildcard ng-content last', function () {
                expect(humanizeContentProjection(parse('<div>hello<a></a></div>', [
                    createComp('div', ['*', 'a'])
                ]))).toEqual([['div', null], ['#text(hello)', 0], ['a', 1]]);
            });
            it('should only project direct child nodes', function () {
                expect(humanizeContentProjection(parse('<div><span><a></a></span><a></a></div>', [
                    createComp('div', ['a'])
                ]))).toEqual([['div', null], ['span', null], ['a', null], ['a', 0]]);
            });
            it('should project nodes of nested components', function () {
                expect(humanizeContentProjection(parse('<a><b>hello</b></a>', [
                    createComp('a', ['*']), createComp('b', ['*'])
                ]))).toEqual([['a', null], ['b', 0], ['#text(hello)', 0]]);
            });
            it('should project children of components with ngNonBindable', function () {
                expect(humanizeContentProjection(parse('<div ngNonBindable>{{hello}}<span></span></div>', [
                    createComp('div', ['*'])
                ]))).toEqual([['div', null], ['#text({{hello}})', 0], ['span', 0]]);
            });
            it('should match the element when there is an inline template', function () {
                expect(humanizeContentProjection(parse('<div><b *ngIf="cond"></b></div>', [
                    createComp('div', ['a', 'b']), ngIf
                ]))).toEqual([['div', null], ['template', 1], ['b', null]]);
            });
            describe('ngProjectAs', function () {
                it('should override elements', function () {
                    expect(humanizeContentProjection(parse('<div><a ngProjectAs="b"></a></div>', [
                        createComp('div', ['a', 'b'])
                    ]))).toEqual([['div', null], ['a', 1]]);
                });
                it('should override <ng-content>', function () {
                    expect(humanizeContentProjection(parse('<div><ng-content ngProjectAs="b"></ng-content></div>', [createComp('div', ['ng-content', 'b'])])))
                        .toEqual([['div', null], ['ng-content', 1]]);
                });
                it('should override <ng-template>', function () {
                    expect(humanizeContentProjection(parse('<div><ng-template ngProjectAs="b"></ng-template></div>', [createComp('div', ['template', 'b'])])))
                        .toEqual([
                        ['div', null],
                        ['template', 1],
                    ]);
                });
                it('should override inline templates', function () {
                    expect(humanizeContentProjection(parse('<div><a *ngIf="cond" ngProjectAs="b"></a></div>', [createComp('div', ['a', 'b']), ngIf])))
                        .toEqual([
                        ['div', null],
                        ['template', 1],
                        ['a', null],
                    ]);
                });
            });
            it('should support other directives before the component', function () {
                expect(humanizeContentProjection(parse('<div>hello</div>', [
                    createDir('div'), createComp('div', ['*'])
                ]))).toEqual([['div', null], ['#text(hello)', 0]]);
            });
        });
        describe('splitClasses', function () {
            it('should keep an empty class', function () { expect(template_parser_1.splitClasses('a')).toEqual(['a']); });
            it('should split 2 classes', function () { expect(template_parser_1.splitClasses('a b')).toEqual(['a', 'b']); });
            it('should trim classes', function () { expect(template_parser_1.splitClasses(' a  b ')).toEqual(['a', 'b']); });
        });
        describe('error cases', function () {
            it('should report when ng-content has non WS content', function () {
                expect(function () { return parse('<ng-content>content</ng-content>', []); })
                    .toThrowError("Template parse errors:\n" +
                    "<ng-content> element cannot have content. (\"[ERROR ->]<ng-content>content</ng-content>\"): TestComp@0:0");
            });
            it('should treat *attr on a template element as valid', function () { expect(function () { return parse('<ng-template *ngIf>', []); }).not.toThrowError(); });
            it('should report when multiple *attrs are used on the same element', function () {
                expect(function () { return parse('<div *ngIf *ngFor>', []); }).toThrowError("Template parse errors:\nCan't have multiple template bindings on one element. Use only one attribute prefixed with * (\"<div *ngIf [ERROR ->]*ngFor>\"): TestComp@0:11");
            });
            it('should report invalid property names', function () {
                expect(function () { return parse('<div [invalidProp]></div>', []); }).toThrowError("Template parse errors:\nCan't bind to 'invalidProp' since it isn't a known property of 'div'. (\"<div [ERROR ->][invalidProp]></div>\"): TestComp@0:5");
            });
            it('should report invalid host property names', function () {
                var dirA = compileDirectiveMetadataCreate({
                    selector: 'div',
                    type: createTypeMeta({ reference: { filePath: someModuleUrl, name: 'DirA' } }),
                    host: { '[invalidProp]': 'someProp' }
                }).toSummary();
                expect(function () { return parse('<div></div>', [dirA]); }).toThrowError("Template parse errors:\nCan't bind to 'invalidProp' since it isn't a known property of 'div'. (\"[ERROR ->]<div></div>\"): TestComp@0:0, Directive DirA");
            });
            it('should report errors in expressions', function () {
                expect(function () { return parse('<div [prop]="a b"></div>', []); }).toThrowError("Template parse errors:\nParser Error: Unexpected token 'b' at column 3 in [a b] in TestComp@0:5 (\"<div [ERROR ->][prop]=\"a b\"></div>\"): TestComp@0:5");
            });
            it('should not throw on invalid property names if the property is used by a directive', function () {
                var dirA = compileDirectiveMetadataCreate({
                    selector: 'div',
                    type: createTypeMeta({ reference: { filePath: someModuleUrl, name: 'DirA' } }),
                    inputs: ['invalidProp']
                }).toSummary();
                expect(function () { return parse('<div [invalid-prop]></div>', [dirA]); }).not.toThrow();
            });
            it('should not allow more than 1 component per element', function () {
                var dirA = compileDirectiveMetadataCreate({
                    selector: 'div',
                    isComponent: true,
                    type: createTypeMeta({ reference: { filePath: someModuleUrl, name: 'DirA' } }),
                    template: compileTemplateMetadata({ ngContentSelectors: [] })
                }).toSummary();
                var dirB = compileDirectiveMetadataCreate({
                    selector: 'div',
                    isComponent: true,
                    type: createTypeMeta({ reference: { filePath: someModuleUrl, name: 'DirB' } }),
                    template: compileTemplateMetadata({ ngContentSelectors: [] })
                }).toSummary();
                expect(function () { return parse('<div>', [dirB, dirA]); })
                    .toThrowError("Template parse errors:\n" +
                    "More than one component matched on this element.\n" +
                    "Make sure that only one component's selector can match a given element.\n" +
                    "Conflicting components: DirB,DirA (\"[ERROR ->]<div>\"): TestComp@0:0");
            });
            it('should not allow components or element bindings nor dom events on explicit embedded templates', function () {
                var dirA = compileDirectiveMetadataCreate({
                    selector: '[a]',
                    isComponent: true,
                    type: createTypeMeta({ reference: { filePath: someModuleUrl, name: 'DirA' } }),
                    template: compileTemplateMetadata({ ngContentSelectors: [] })
                }).toSummary();
                expect(function () { return parse('<ng-template [a]="b" (e)="f"></ng-template>', [dirA]); })
                    .toThrowError("Template parse errors:\nEvent binding e not emitted by any directive on an embedded template. Make sure that the event name is spelled correctly and all directives are listed in the \"@NgModule.declarations\". (\"<ng-template [a]=\"b\" [ERROR ->](e)=\"f\"></ng-template>\"): TestComp@0:21\nComponents on an embedded template: DirA (\"[ERROR ->]<ng-template [a]=\"b\" (e)=\"f\"></ng-template>\"): TestComp@0:0\nProperty binding a not used by any directive on an embedded template. Make sure that the property name is spelled correctly and all directives are listed in the \"@NgModule.declarations\". (\"[ERROR ->]<ng-template [a]=\"b\" (e)=\"f\"></ng-template>\"): TestComp@0:0");
            });
            it('should not allow components or element bindings on inline embedded templates', function () {
                var dirA = compileDirectiveMetadataCreate({
                    selector: '[a]',
                    isComponent: true,
                    type: createTypeMeta({ reference: { filePath: someModuleUrl, name: 'DirA' } }),
                    template: compileTemplateMetadata({ ngContentSelectors: [] })
                }).toSummary();
                expect(function () { return parse('<div *a="b"></div>', [dirA]); }).toThrowError("Template parse errors:\nComponents on an embedded template: DirA (\"[ERROR ->]<div *a=\"b\"></div>\"): TestComp@0:0\nProperty binding a not used by any directive on an embedded template. Make sure that the property name is spelled correctly and all directives are listed in the \"@NgModule.declarations\". (\"[ERROR ->]<div *a=\"b\"></div>\"): TestComp@0:0");
            });
        });
        describe('ignore elements', function () {
            it('should ignore <script> elements', function () {
                expect(humanizeTplAst(parse('<script></script>a', []))).toEqual([[template_ast_1.TextAst, 'a']]);
            });
            it('should ignore <style> elements', function () {
                expect(humanizeTplAst(parse('<style></style>a', []))).toEqual([[template_ast_1.TextAst, 'a']]);
            });
            describe('<link rel="stylesheet">', function () {
                it('should keep <link rel="stylesheet"> elements if they have an absolute url', function () {
                    expect(humanizeTplAst(parse('<link rel="stylesheet" href="http://someurl">a', [])))
                        .toEqual([
                        [template_ast_1.ElementAst, 'link'], [template_ast_1.AttrAst, 'rel', 'stylesheet'],
                        [template_ast_1.AttrAst, 'href', 'http://someurl'], [template_ast_1.TextAst, 'a']
                    ]);
                });
                it('should keep <link rel="stylesheet"> elements if they have no uri', function () {
                    expect(humanizeTplAst(parse('<link rel="stylesheet">a', []))).toEqual([[template_ast_1.ElementAst, 'link'], [template_ast_1.AttrAst, 'rel', 'stylesheet'], [template_ast_1.TextAst, 'a']]);
                    expect(humanizeTplAst(parse('<link REL="stylesheet">a', []))).toEqual([[template_ast_1.ElementAst, 'link'], [template_ast_1.AttrAst, 'REL', 'stylesheet'], [template_ast_1.TextAst, 'a']]);
                });
                it('should ignore <link rel="stylesheet"> elements if they have a relative uri', function () {
                    expect(humanizeTplAst(parse('<link rel="stylesheet" href="./other.css">a', []))).toEqual([[template_ast_1.TextAst, 'a']]);
                    expect(humanizeTplAst(parse('<link rel="stylesheet" HREF="./other.css">a', []))).toEqual([[template_ast_1.TextAst, 'a']]);
                });
                it('should ignore <link rel="stylesheet"> elements if they have a package: uri', function () {
                    expect(humanizeTplAst(parse('<link rel="stylesheet" href="package:somePackage">a', []))).toEqual([[template_ast_1.TextAst, 'a']]);
                });
            });
            it('should ignore bindings on children of elements with ngNonBindable', function () {
                expect(humanizeTplAst(parse('<div ngNonBindable>{{b}}</div>', []))).toEqual([[template_ast_1.ElementAst, 'div'], [template_ast_1.AttrAst, 'ngNonBindable', ''], [template_ast_1.TextAst, '{{b}}']]);
            });
            it('should keep nested children of elements with ngNonBindable', function () {
                expect(humanizeTplAst(parse('<div ngNonBindable><span>{{b}}</span></div>', []))).toEqual([
                    [template_ast_1.ElementAst, 'div'], [template_ast_1.AttrAst, 'ngNonBindable', ''], [template_ast_1.ElementAst, 'span'],
                    [template_ast_1.TextAst, '{{b}}']
                ]);
            });
            it('should ignore <script> elements inside of elements with ngNonBindable', function () {
                expect(humanizeTplAst(parse('<div ngNonBindable><script></script>a</div>', []))).toEqual([[template_ast_1.ElementAst, 'div'], [template_ast_1.AttrAst, 'ngNonBindable', ''], [template_ast_1.TextAst, 'a']]);
            });
            it('should ignore <style> elements inside of elements with ngNonBindable', function () {
                expect(humanizeTplAst(parse('<div ngNonBindable><style></style>a</div>', []))).toEqual([[template_ast_1.ElementAst, 'div'], [template_ast_1.AttrAst, 'ngNonBindable', ''], [template_ast_1.TextAst, 'a']]);
            });
            it('should ignore <link rel="stylesheet"> elements inside of elements with ngNonBindable', function () {
                expect(humanizeTplAst(parse('<div ngNonBindable><link rel="stylesheet">a</div>', []))).toEqual([[template_ast_1.ElementAst, 'div'], [template_ast_1.AttrAst, 'ngNonBindable', ''], [template_ast_1.TextAst, 'a']]);
            });
            it('should convert <ng-content> elements into regular elements inside of elements with ngNonBindable', function () {
                expect(humanizeTplAst(parse('<div ngNonBindable><ng-content></ng-content>a</div>', [])))
                    .toEqual([
                    [template_ast_1.ElementAst, 'div'], [template_ast_1.AttrAst, 'ngNonBindable', ''], [template_ast_1.ElementAst, 'ng-content'],
                    [template_ast_1.TextAst, 'a']
                ]);
            });
        });
        describe('source spans', function () {
            it('should support ng-content', function () {
                var parsed = parse('<ng-content select="a">', []);
                expect(humanizeTplAstSourceSpans(parsed)).toEqual([
                    [template_ast_1.NgContentAst, '<ng-content select="a">']
                ]);
            });
            it('should support embedded template', function () {
                expect(humanizeTplAstSourceSpans(parse('<ng-template></ng-template>', []))).toEqual([[template_ast_1.EmbeddedTemplateAst, '<ng-template>']]);
            });
            it('should support element and attributes', function () {
                expect(humanizeTplAstSourceSpans(parse('<div key=value>', []))).toEqual([
                    [template_ast_1.ElementAst, 'div', '<div key=value>'], [template_ast_1.AttrAst, 'key', 'value', 'key=value']
                ]);
            });
            it('should support references', function () {
                expect(humanizeTplAstSourceSpans(parse('<div #a></div>', []))).toEqual([[template_ast_1.ElementAst, 'div', '<div #a>'], [template_ast_1.ReferenceAst, 'a', null, '#a']]);
            });
            it('should support variables', function () {
                expect(humanizeTplAstSourceSpans(parse('<ng-template let-a="b"></ng-template>', [])))
                    .toEqual([
                    [template_ast_1.EmbeddedTemplateAst, '<ng-template let-a="b">'],
                    [template_ast_1.VariableAst, 'a', 'b', 'let-a="b"'],
                ]);
            });
            it('should support events', function () {
                expect(humanizeTplAstSourceSpans(parse('<div (window:event)="v">', []))).toEqual([
                    [template_ast_1.ElementAst, 'div', '<div (window:event)="v">'],
                    [template_ast_1.BoundEventAst, 'event', 'window', 'v', '(window:event)="v"']
                ]);
            });
            it('should support element property', function () {
                expect(humanizeTplAstSourceSpans(parse('<div [someProp]="v">', []))).toEqual([
                    [template_ast_1.ElementAst, 'div', '<div [someProp]="v">'],
                    [
                        template_ast_1.BoundElementPropertyAst, 0 /* Property */, 'someProp', 'v', null,
                        '[someProp]="v"'
                    ]
                ]);
            });
            it('should support bound text', function () {
                expect(humanizeTplAstSourceSpans(parse('{{a}}', []))).toEqual([[template_ast_1.BoundTextAst, '{{ a }}', '{{a}}']]);
            });
            it('should support text nodes', function () {
                expect(humanizeTplAstSourceSpans(parse('a', []))).toEqual([[template_ast_1.TextAst, 'a', 'a']]);
            });
            it('should support directive', function () {
                var dirA = compileDirectiveMetadataCreate({
                    selector: '[a]',
                    type: createTypeMeta({ reference: { filePath: someModuleUrl, name: 'DirA' } })
                }).toSummary();
                var comp = compileDirectiveMetadataCreate({
                    selector: 'div',
                    isComponent: true,
                    type: createTypeMeta({ reference: { filePath: someModuleUrl, name: 'ZComp' } }),
                    template: compileTemplateMetadata({ ngContentSelectors: [] })
                }).toSummary();
                expect(humanizeTplAstSourceSpans(parse('<div a>', [dirA, comp]))).toEqual([
                    [template_ast_1.ElementAst, 'div', '<div a>'], [template_ast_1.AttrAst, 'a', '', 'a'], [template_ast_1.DirectiveAst, dirA, '<div a>'],
                    [template_ast_1.DirectiveAst, comp, '<div a>']
                ]);
            });
            it('should support directive in namespace', function () {
                var tagSel = compileDirectiveMetadataCreate({
                    selector: 'circle',
                    type: createTypeMeta({ reference: { filePath: someModuleUrl, name: 'elDir' } })
                }).toSummary();
                var attrSel = compileDirectiveMetadataCreate({
                    selector: '[href]',
                    type: createTypeMeta({ reference: { filePath: someModuleUrl, name: 'attrDir' } })
                }).toSummary();
                expect(humanizeTplAstSourceSpans(parse('<svg><circle /><use xlink:href="Port" /></svg>', [tagSel, attrSel])))
                    .toEqual([
                    [template_ast_1.ElementAst, ':svg:svg', '<svg>'],
                    [template_ast_1.ElementAst, ':svg:circle', '<circle />'],
                    [template_ast_1.DirectiveAst, tagSel, '<circle />'],
                    [template_ast_1.ElementAst, ':svg:use', '<use xlink:href="Port" />'],
                    [template_ast_1.AttrAst, ':xlink:href', 'Port', 'xlink:href="Port"'],
                    [template_ast_1.DirectiveAst, attrSel, '<use xlink:href="Port" />'],
                ]);
            });
            it('should support directive property', function () {
                var dirA = compileDirectiveMetadataCreate({
                    selector: 'div',
                    type: createTypeMeta({ reference: { filePath: someModuleUrl, name: 'DirA' } }),
                    inputs: ['aProp']
                }).toSummary();
                expect(humanizeTplAstSourceSpans(parse('<div [aProp]="foo"></div>', [dirA]))).toEqual([
                    [template_ast_1.ElementAst, 'div', '<div [aProp]="foo">'], [template_ast_1.DirectiveAst, dirA, '<div [aProp]="foo">'],
                    [template_ast_1.BoundDirectivePropertyAst, 'aProp', 'foo', '[aProp]="foo"']
                ]);
            });
            it('should support endSourceSpan for elements', function () {
                var tagSel = compileDirectiveMetadataCreate({
                    selector: 'circle',
                    type: createTypeMeta({ reference: { filePath: someModuleUrl, name: 'elDir' } })
                }).toSummary();
                var result = parse('<circle></circle>', [tagSel]);
                var circle = result[0];
                expect(circle.endSourceSpan).toBeDefined();
                expect(circle.endSourceSpan.start.offset).toBe(8);
                expect(circle.endSourceSpan.end.offset).toBe(17);
            });
            it('should report undefined for endSourceSpan for elements without an end-tag', function () {
                var ulSel = compileDirectiveMetadataCreate({
                    selector: 'ul',
                    type: createTypeMeta({ reference: { filePath: someModuleUrl, name: 'ulDir' } })
                }).toSummary();
                var liSel = compileDirectiveMetadataCreate({
                    selector: 'li',
                    type: createTypeMeta({ reference: { filePath: someModuleUrl, name: 'liDir' } })
                }).toSummary();
                var result = parse('<ul><li><li></ul>', [ulSel, liSel]);
                var ul = result[0];
                var li = ul.children[0];
                expect(li.endSourceSpan).toBe(null);
            });
        });
        describe('pipes', function () {
            it('should allow pipes that have been defined as dependencies', function () {
                var testPipe = new compile_metadata_1.CompilePipeMetadata({
                    name: 'test',
                    type: createTypeMeta({ reference: { filePath: someModuleUrl, name: 'DirA' } }),
                    pure: false
                }).toSummary();
                expect(function () { return parse('{{a | test}}', [], [testPipe]); }).not.toThrow();
            });
            it('should report pipes as error that have not been defined as dependencies', function () {
                expect(function () { return parse('{{a | test}}', []); }).toThrowError("Template parse errors:\nThe pipe 'test' could not be found (\"{{[ERROR ->]a | test}}\"): TestComp@0:2");
            });
        });
        describe('ICU messages', function () {
            it('should expand plural messages', function () {
                var shortForm = '{ count, plural, =0 {small} many {big} }';
                var expandedForm = '<ng-container [ngPlural]="count">' +
                    '<ng-template ngPluralCase="=0">small</ng-template>' +
                    '<ng-template ngPluralCase="many">big</ng-template>' +
                    '</ng-container>';
                expect(humanizeTplAst(parse(shortForm, []))).toEqual(humanizeTplAst(parse(expandedForm, [])));
            });
            it('should expand select messages', function () {
                var shortForm = '{ sex, select, female {foo} other {bar} }';
                var expandedForm = '<ng-container [ngSwitch]="sex">' +
                    '<ng-template ngSwitchCase="female">foo</ng-template>' +
                    '<ng-template ngSwitchDefault>bar</ng-template>' +
                    '</ng-container>';
                expect(humanizeTplAst(parse(shortForm, []))).toEqual(humanizeTplAst(parse(expandedForm, [])));
            });
            it('should be possible to escape ICU messages', function () {
                var escapedForm = 'escaped {{ "{" }}  }';
                expect(humanizeTplAst(parse(escapedForm, []))).toEqual([
                    [template_ast_1.BoundTextAst, 'escaped {{ "{" }}  }'],
                ]);
            });
        });
    });
    describe('whitespaces removal', function () {
        beforeEach(function () {
            testing_1.TestBed.configureCompiler({ providers: [test_bindings_1.TEST_COMPILER_PROVIDERS, MOCK_SCHEMA_REGISTRY] });
        });
        commonBeforeEach();
        it('should not remove whitespaces by default', function () {
            expect(humanizeTplAst(parse(' <br>  <br>\t<br>\n<br> ', []))).toEqual([
                [template_ast_1.TextAst, ' '],
                [template_ast_1.ElementAst, 'br'],
                [template_ast_1.TextAst, '  '],
                [template_ast_1.ElementAst, 'br'],
                [template_ast_1.TextAst, '\t'],
                [template_ast_1.ElementAst, 'br'],
                [template_ast_1.TextAst, '\n'],
                [template_ast_1.ElementAst, 'br'],
                [template_ast_1.TextAst, ' '],
            ]);
        });
        it('should replace each &ngsp; with a space when preserveWhitespaces is true', function () {
            expect(humanizeTplAst(parse('foo&ngsp;&ngsp;&ngsp;bar', [], [], [], true))).toEqual([
                [template_ast_1.TextAst, 'foo   bar'],
            ]);
        });
        it('should replace every &ngsp; with a single space when preserveWhitespaces is false', function () {
            expect(humanizeTplAst(parse('foo&ngsp;&ngsp;&ngsp;bar', [], [], [], false))).toEqual([
                [template_ast_1.TextAst, 'foo bar'],
            ]);
        });
        it('should remove whitespaces when explicitly requested', function () {
            expect(humanizeTplAst(parse(' <br>  <br>\t<br>\n<br> ', [], [], [], false))).toEqual([
                [template_ast_1.ElementAst, 'br'],
                [template_ast_1.ElementAst, 'br'],
                [template_ast_1.ElementAst, 'br'],
                [template_ast_1.ElementAst, 'br'],
            ]);
        });
        it('should remove whitespace between ICU expansions when not preserving whitespaces', function () {
            var shortForm = '{ count, plural, =0 {small} many {big} }';
            var expandedForm = '<ng-container [ngPlural]="count">' +
                '<ng-template ngPluralCase="=0">small</ng-template>' +
                '<ng-template ngPluralCase="many">big</ng-template>' +
                '</ng-container>';
            var humanizedExpandedForm = humanizeTplAst(parse(expandedForm, []));
            // ICU expansions are converted to `<ng-container>` tags and all blank text nodes are reomved
            // so any whitespace between ICU exansions are removed as well
            expect(humanizeTplAst(parse(shortForm + " " + shortForm, [], [], [], false))).toEqual(humanizedExpandedForm.concat(humanizedExpandedForm));
        });
    });
})();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGVtcGxhdGVfcGFyc2VyX3NwZWMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9jb21waWxlci90ZXN0L3RlbXBsYXRlX3BhcnNlci90ZW1wbGF0ZV9wYXJzZXJfc3BlYy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7QUFBQTs7Ozs7O0dBTUc7QUFDSCw4Q0FBNkg7QUFDN0gsMkVBQTRSO0FBQzVSLHdHQUFrRztBQUNsRyxnR0FBMkY7QUFDM0YsbUZBQXNWO0FBQ3RWLHlGQUFtRztBQUNuRyxzQ0FBMkk7QUFDM0kscURBQWtEO0FBQ2xELGlEQUFzRDtBQUN0RCwrRkFBc0Y7QUFHdEYscURBQTRHO0FBQzVHLGlGQUEyRztBQUMzRyx1Q0FBMkM7QUFDM0MseUNBQWlEO0FBQ2pELGdFQUE0RDtBQUM1RCxrREFBeUQ7QUFFekQsSUFBTSxhQUFhLEdBQUcsb0JBQW9CLENBQUM7QUFFM0MsSUFBTSxvQkFBb0IsR0FBRyxDQUFDO1FBQzVCLE9BQU8sRUFBRSwrQ0FBcUI7UUFDOUIsUUFBUSxFQUFFLElBQUksNEJBQWtCLENBQzVCLEVBQUMsYUFBYSxFQUFFLEtBQUssRUFBQyxFQUFFLEVBQUMsWUFBWSxFQUFFLFlBQVksRUFBQyxFQUFFLEVBQUMsU0FBUyxFQUFFLEtBQUssRUFBRSxVQUFVLEVBQUUsS0FBSyxFQUFDLEVBQzNGLENBQUMsU0FBUyxDQUFDLEVBQUUsQ0FBQyxTQUFTLENBQUMsQ0FBQztLQUM5QixDQUFDLENBQUM7QUFFSCx3QkFBd0IsRUFBcUQ7UUFBcEQsd0JBQVMsRUFBRSxrQkFBTTtJQUV4QyxPQUFPLEVBQUMsU0FBUyxFQUFFLFNBQVMsRUFBRSxNQUFNLEVBQUUsTUFBTSxJQUFJLEVBQUUsRUFBRSxjQUFjLEVBQUUsRUFBRSxFQUFDLENBQUM7QUFDMUUsQ0FBQztBQUVELHdDQUNJLEVBcUJDO1FBckJBLGtCQUFNLEVBQUUsY0FBSSxFQUFFLDRCQUFXLEVBQUUsc0JB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QUFDO29CQUMvRSxNQUFNLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7b0JBQ3ZDLE1BQU0sQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO29CQUNwRSxNQUFNLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDO29CQUMxRCxNQUFNLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztvQkFDcEUsTUFBTSxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQztnQkFDNUQsQ0FBQyxDQUFDLENBQUM7Z0JBRUgsRUFBRSxDQUFDLDBDQUEwQyxFQUFFO29CQUM3QyxJQUFNLElBQUksR0FBRyxTQUFTLENBQUMsUUFBUSxFQUFFLEVBQUMsSUFBSSxFQUFFLENBQUMsY0FBYyxDQUFDLEVBQUMsQ0FBQyxDQUFDO29CQUMzRCxJQUFNLElBQUksR0FBRyxTQUFTLENBQUMsUUFBUSxFQUFFLEVBQUMsSUFBSSxFQUFFLENBQUMsYUFBYSxDQUFDLEVBQUMsQ0FBQyxDQUFDO29CQUMxRCxJQUFNLElBQUksR0FBRyxTQUFTLENBQUMsUUFBUSxFQUFFLEVBQUMsSUFBSSxFQUFFLENBQUMsYUFBYSxDQUFDLEVBQUMsQ0FBQyxDQUFDO29CQUMxRCxJQUFNLElBQUksR0FBRyxTQUFTLENBQUMsU0FBUyxDQUFDLENBQUM7b0JB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U0FBUyxFQUFFLFNBQVMsQ0FBQyxFQUFDLENBQUMsQ0FBQztvQkFDdEUsSUFBTSxJQUFJLEdBQUcsU0FBUyxDQUFDLFFBQVEsRUFBRSxFQUFDLElBQUksRUFBRSxDQUFDLFVBQVUsQ0FBQyxFQUFDLENBQUMsQ0FBQztvQkFDdkQsSUFBTSxLQUFLLEdBQ0ssS0FBSyxDQUFDLGtDQUFrQyxFQUFFLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7b0JBQzNFLE1BQU0sQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztvQkFDdkMsTUFBTSxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7b0JBQ3BFLE1BQU0sQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztvQkFDNUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQztvQkFDMUQsTUFBTSxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO29CQUM1QyxNQUFNLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDO29CQUMxRCxNQUFNLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7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