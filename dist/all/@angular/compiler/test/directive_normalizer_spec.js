"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
var compile_metadata_1 = require("@angular/compiler/src/compile_metadata");
var config_1 = require("@angular/compiler/src/config");
var directive_normalizer_1 = require("@angular/compiler/src/directive_normalizer");
var resource_loader_1 = require("@angular/compiler/src/resource_loader");
var view_1 = require("@angular/core/src/metadata/view");
var testing_1 = require("@angular/core/testing");
var util_1 = require("../src/util");
var test_bindings_1 = require("./test_bindings");
var SOME_MODULE_URL = 'package:some/module/a.js';
var SOME_HTTP_MODULE_URL = 'http://some/module/a.js';
function normalizeTemplate(normalizer, o) {
    return normalizer.normalizeTemplate({
        ngModuleType: null,
        componentType: SomeComp,
        moduleUrl: util_1.noUndefined(o.moduleUrl || SOME_MODULE_URL),
        template: util_1.noUndefined(o.template),
        templateUrl: util_1.noUndefined(o.templateUrl),
        styles: util_1.noUndefined(o.styles),
        styleUrls: util_1.noUndefined(o.styleUrls),
        interpolation: util_1.noUndefined(o.interpolation),
        encapsulation: util_1.noUndefined(o.encapsulation),
        animations: util_1.noUndefined(o.animations),
        preserveWhitespaces: util_1.noUndefined(o.preserveWhitespaces),
    });
}
{
    describe('DirectiveNormalizer', function () {
        var resourceLoaderSpy;
        beforeEach(function () {
            resourceLoaderSpy =
                jasmine.createSpy('get').and.callFake(function (url) { return "resource(" + url + ")"; });
            var resourceLoader = { get: resourceLoaderSpy };
            testing_1.TestBed.configureCompiler({
                providers: test_bindings_1.TEST_COMPILER_PROVIDERS.concat([{ provide: resource_loader_1.ResourceLoader, useValue: resourceLoader }])
            });
        });
        describe('normalizeTemplate', function () {
            it('should throw if no template was specified', testing_1.inject([directive_normalizer_1.DirectiveNormalizer], function (normalizer) {
                expect(function () { return normalizeTemplate(normalizer, {}); })
                    .toThrowError('No template specified for component SomeComp');
            }));
            it('should throw if template is not a string', testing_1.inject([directive_normalizer_1.DirectiveNormalizer], function (normalizer) {
                expect(function () { return normalizeTemplate(normalizer, { template: {} }); })
                    .toThrowError('The template specified for component SomeComp is not a string');
            }));
            it('should throw if templateUrl is not a string', testing_1.inject([directive_normalizer_1.DirectiveNormalizer], function (normalizer) {
                expect(function () { return normalizeTemplate(normalizer, { templateUrl: {} }); })
                    .toThrowError('The templateUrl specified for component SomeComp is not a string');
            }));
            it('should throw if both template and templateUrl are defined', testing_1.inject([directive_normalizer_1.DirectiveNormalizer], function (normalizer) {
                expect(function () { return normalizeTemplate(normalizer, {
                    template: '',
                    templateUrl: '',
                }); })
                    .toThrowError("'SomeComp' component cannot define both template and templateUrl");
            }));
            it('should throw if preserveWhitespaces is not a boolean', testing_1.inject([directive_normalizer_1.DirectiveNormalizer], function (normalizer) {
                expect(function () { return normalizeTemplate(normalizer, {
                    template: '',
                    preserveWhitespaces: 'WRONG',
                }); })
                    .toThrowError('The preserveWhitespaces option for component SomeComp must be a boolean');
            }));
        });
        describe('inline template', function () {
            it('should store the template', testing_1.inject([directive_normalizer_1.DirectiveNormalizer], function (normalizer) {
                var template = normalizeTemplate(normalizer, {
                    template: 'a',
                });
                expect(template.template).toEqual('a');
                expect(template.templateUrl).toEqual('package:some/module/a.js');
                expect(template.isInline).toBe(true);
            }));
            it('should resolve styles on the annotation against the moduleUrl', testing_1.inject([directive_normalizer_1.DirectiveNormalizer], function (normalizer) {
                var template = normalizeTemplate(normalizer, { template: '', styleUrls: ['test.css'] });
                expect(template.styleUrls).toEqual(['package:some/module/test.css']);
            }));
            it('should resolve styles in the template against the moduleUrl and add them to the styles', testing_1.inject([directive_normalizer_1.DirectiveNormalizer], function (normalizer) {
                var template = normalizeTemplate(normalizer, {
                    template: '<style>template @import test.css</style>',
                    styles: ['direct'],
                });
                expect(template.styles).toEqual([
                    'direct', 'template ', 'resource(package:some/module/test.css)'
                ]);
            }));
            it('should use ViewEncapsulation.Emulated by default', testing_1.inject([directive_normalizer_1.DirectiveNormalizer], function (normalizer) {
                var template = normalizeTemplate(normalizer, { template: '', styleUrls: ['test.css'] });
                expect(template.encapsulation).toEqual(view_1.ViewEncapsulation.Emulated);
            }));
            it('should use default encapsulation provided by CompilerConfig', testing_1.inject([config_1.CompilerConfig, directive_normalizer_1.DirectiveNormalizer], function (config, normalizer) {
                config.defaultEncapsulation = view_1.ViewEncapsulation.None;
                var template = normalizeTemplate(normalizer, { template: '', styleUrls: ['test.css'] });
                expect(template.encapsulation).toEqual(view_1.ViewEncapsulation.None);
            }));
        });
        it('should load a template from a url that is resolved against moduleUrl', testing_1.inject([directive_normalizer_1.DirectiveNormalizer], function (normalizer) {
            var template = normalizeTemplate(normalizer, { templateUrl: 'sometplurl.html', styleUrls: ['test.css'] });
            expect(template.template).toEqual('resource(package:some/module/sometplurl.html)');
            expect(template.templateUrl).toEqual('package:some/module/sometplurl.html');
            expect(template.isInline).toBe(false);
        }));
        it('should resolve styles on the annotation against the moduleUrl', testing_1.inject([directive_normalizer_1.DirectiveNormalizer], function (normalizer) {
            var template = normalizeTemplate(normalizer, { templateUrl: 'tpl/sometplurl.html', styleUrls: ['test.css'] });
            expect(template.styleUrls).toEqual(['package:some/module/test.css']);
        }));
        it('should resolve styles in the template against the templateUrl and add them to the styles', testing_1.inject([directive_normalizer_1.DirectiveNormalizer], function (normalizer) {
            resourceLoaderSpy.and.callFake(function (url) {
                switch (url) {
                    case 'package:some/module/tpl/sometplurl.html':
                        return '<style>template @import test.css</style>';
                    default:
                        return "resource(" + url + ")";
                }
            });
            var template = normalizeTemplate(normalizer, { templateUrl: 'tpl/sometplurl.html', styles: ['direct'] });
            expect(template.styles).toEqual([
                'direct', 'template ', 'resource(package:some/module/tpl/test.css)'
            ]);
        }));
        describe('externalStylesheets', function () {
            it('should load an external stylesheet', testing_1.inject([directive_normalizer_1.DirectiveNormalizer], function (normalizer) {
                var template = normalizeTemplate(normalizer, { template: '', styleUrls: ['package:some/module/test.css'] });
                expect(template.externalStylesheets.length).toBe(1);
                expect(template.externalStylesheets[0]).toEqual(new compile_metadata_1.CompileStylesheetMetadata({
                    moduleUrl: 'package:some/module/test.css',
                    styles: ['resource(package:some/module/test.css)'],
                }));
            }));
            it('should load stylesheets referenced by external stylesheets and inline them', testing_1.inject([directive_normalizer_1.DirectiveNormalizer], function (normalizer) {
                resourceLoaderSpy.and.callFake(function (url) {
                    switch (url) {
                        case 'package:some/module/test.css':
                            return 'a@import "test2.css"';
                        case 'package:some/module/test2.css':
                            return 'b';
                        default:
                            throw new Error("Unexpected url " + url);
                    }
                });
                var template = normalizeTemplate(normalizer, {
                    template: '',
                    styleUrls: ['package:some/module/test.css'],
                });
                expect(template.externalStylesheets.length).toBe(1);
                expect(template.externalStylesheets[0])
                    .toEqual(new compile_metadata_1.CompileStylesheetMetadata({ moduleUrl: 'package:some/module/test.css', styles: ['a', 'b'], styleUrls: [] }));
            }));
        });
        describe('caching', function () {
            it('should work for templateUrl', testing_1.inject([directive_normalizer_1.DirectiveNormalizer], function (normalizer) {
                var prenormMeta = {
                    templateUrl: 'cmp.html',
                };
                var template1 = normalizeTemplate(normalizer, prenormMeta);
                var template2 = normalizeTemplate(normalizer, prenormMeta);
                expect(template1.template).toEqual('resource(package:some/module/cmp.html)');
                expect(template2.template).toEqual('resource(package:some/module/cmp.html)');
                expect(resourceLoaderSpy).toHaveBeenCalledTimes(1);
            }));
        });
        describe('normalizeLoadedTemplate', function () {
            it('should store the viewEncapsulation in the result', testing_1.inject([directive_normalizer_1.DirectiveNormalizer], function (normalizer) {
                var viewEncapsulation = view_1.ViewEncapsulation.Native;
                var template = normalizeTemplate(normalizer, {
                    encapsulation: viewEncapsulation,
                    template: '',
                });
                expect(template.encapsulation).toBe(viewEncapsulation);
            }));
            it('should use preserveWhitespaces setting from compiler config if none provided', testing_1.inject([directive_normalizer_1.DirectiveNormalizer, config_1.CompilerConfig], function (normalizer, config) {
                var template = normalizeTemplate(normalizer, { template: '' });
                expect(template.preserveWhitespaces).toBe(config.preserveWhitespaces);
            }));
            it('should store the preserveWhitespaces=false in the result', testing_1.inject([directive_normalizer_1.DirectiveNormalizer], function (normalizer) {
                var template = normalizeTemplate(normalizer, { preserveWhitespaces: false, template: '' });
                expect(template.preserveWhitespaces).toBe(false);
            }));
            it('should store the preserveWhitespaces=true in the result', testing_1.inject([directive_normalizer_1.DirectiveNormalizer], function (normalizer) {
                var template = normalizeTemplate(normalizer, { preserveWhitespaces: true, template: '' });
                expect(template.preserveWhitespaces).toBe(true);
            }));
            it('should keep the template as html', testing_1.inject([directive_normalizer_1.DirectiveNormalizer], function (normalizer) {
                var template = normalizeTemplate(normalizer, {
                    template: 'a',
                });
                expect(template.template).toEqual('a');
            }));
            it('should collect ngContent', testing_1.inject([directive_normalizer_1.DirectiveNormalizer], function (normalizer) {
                var template = normalizeTemplate(normalizer, {
                    template: '<ng-content select="a"></ng-content>',
                });
                expect(template.ngContentSelectors).toEqual(['a']);
            }));
            it('should normalize ngContent wildcard selector', testing_1.inject([directive_normalizer_1.DirectiveNormalizer], function (normalizer) {
                var template = normalizeTemplate(normalizer, {
                    template: '<ng-content></ng-content><ng-content select></ng-content><ng-content select="*"></ng-content>',
                });
                expect(template.ngContentSelectors).toEqual(['*', '*', '*']);
            }));
            it('should collect top level styles in the template', testing_1.inject([directive_normalizer_1.DirectiveNormalizer], function (normalizer) {
                var template = normalizeTemplate(normalizer, {
                    template: '<style>a</style>',
                });
                expect(template.styles).toEqual(['a']);
            }));
            it('should collect styles inside elements', testing_1.inject([directive_normalizer_1.DirectiveNormalizer], function (normalizer) {
                var template = normalizeTemplate(normalizer, {
                    template: '<div><style>a</style></div>',
                });
                expect(template.styles).toEqual(['a']);
            }));
            it('should collect styleUrls in the template and add them to the styles', testing_1.inject([directive_normalizer_1.DirectiveNormalizer], function (normalizer) {
                var template = normalizeTemplate(normalizer, {
                    template: '<link rel="stylesheet" href="aUrl">',
                });
                expect(template.styles).toEqual(['resource(package:some/module/aUrl)']);
                expect(template.styleUrls).toEqual([]);
            }));
            it('should collect styleUrls in elements and add them to the styles', testing_1.inject([directive_normalizer_1.DirectiveNormalizer], function (normalizer) {
                var template = normalizeTemplate(normalizer, {
                    template: '<div><link rel="stylesheet" href="aUrl"></div>',
                });
                expect(template.styles).toEqual(['resource(package:some/module/aUrl)']);
                expect(template.styleUrls).toEqual([]);
            }));
            it('should ignore link elements with non stylesheet rel attribute', testing_1.inject([directive_normalizer_1.DirectiveNormalizer], function (normalizer) {
                var template = normalizeTemplate(normalizer, {
                    template: '<link href="b" rel="a">',
                });
                expect(template.styleUrls).toEqual([]);
            }));
            it('should ignore link elements with absolute urls but non package: scheme', testing_1.inject([directive_normalizer_1.DirectiveNormalizer], function (normalizer) {
                var template = normalizeTemplate(normalizer, {
                    template: '<link href="http://some/external.css" rel="stylesheet">',
                });
                expect(template.styleUrls).toEqual([]);
            }));
            it('should extract @import style urls and add them to the styles', testing_1.inject([directive_normalizer_1.DirectiveNormalizer], function (normalizer) {
                var template = normalizeTemplate(normalizer, {
                    styles: ['@import "test.css";'],
                    template: '',
                });
                expect(template.styles).toEqual(['', 'resource(package:some/module/test.css)']);
                expect(template.styleUrls).toEqual([]);
            }));
            it('should not resolve relative urls in inline styles', testing_1.inject([directive_normalizer_1.DirectiveNormalizer], function (normalizer) {
                var template = normalizeTemplate(normalizer, {
                    styles: ['.foo{background-image: url(\'double.jpg\');'],
                    template: '',
                });
                expect(template.styles).toEqual(['.foo{background-image: url(\'double.jpg\');']);
            }));
            it('should resolve relative style urls in styleUrls', testing_1.inject([directive_normalizer_1.DirectiveNormalizer], function (normalizer) {
                var template = normalizeTemplate(normalizer, {
                    styleUrls: ['test.css'],
                    template: '',
                });
                expect(template.styles).toEqual([]);
                expect(template.styleUrls).toEqual(['package:some/module/test.css']);
            }));
            it('should resolve relative style urls in styleUrls with http directive url', testing_1.inject([directive_normalizer_1.DirectiveNormalizer], function (normalizer) {
                var template = normalizeTemplate(normalizer, {
                    moduleUrl: SOME_HTTP_MODULE_URL,
                    styleUrls: ['test.css'],
                    template: '',
                });
                expect(template.styles).toEqual([]);
                expect(template.styleUrls).toEqual(['http://some/module/test.css']);
            }));
            it('should normalize ViewEncapsulation.Emulated to ViewEncapsulation.None if there are no styles nor stylesheets', testing_1.inject([directive_normalizer_1.DirectiveNormalizer], function (normalizer) {
                var template = normalizeTemplate(normalizer, {
                    encapsulation: view_1.ViewEncapsulation.Emulated,
                    template: '',
                });
                expect(template.encapsulation).toEqual(view_1.ViewEncapsulation.None);
            }));
            it('should ignore ng-content in elements with ngNonBindable', testing_1.inject([directive_normalizer_1.DirectiveNormalizer], function (normalizer) {
                var template = normalizeTemplate(normalizer, {
                    template: '<div ngNonBindable><ng-content select="a"></ng-content></div>',
                });
                expect(template.ngContentSelectors).toEqual([]);
            }));
            it('should still collect <style> in elements with ngNonBindable', testing_1.inject([directive_normalizer_1.DirectiveNormalizer], function (normalizer) {
                var template = normalizeTemplate(normalizer, {
                    template: '<div ngNonBindable><style>div {color:red}</style></div>',
                });
                expect(template.styles).toEqual(['div {color:red}']);
            }));
        });
    });
}
var SomeComp = /** @class */ (function () {
    function SomeComp() {
    }
    return SomeComp;
}());
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGlyZWN0aXZlX25vcm1hbGl6ZXJfc3BlYy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2NvbXBpbGVyL3Rlc3QvZGlyZWN0aXZlX25vcm1hbGl6ZXJfc3BlYy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBOzs7Ozs7R0FNRztBQUNILDJFQUEwRztBQUMxRyx1REFBd0Y7QUFDeEYsbUZBQStFO0FBQy9FLHlFQUFxRTtBQUNyRSx3REFBa0U7QUFDbEUsaURBQXNEO0FBRXRELG9DQUF3QztBQUV4QyxpREFBd0Q7QUFFeEQsSUFBTSxlQUFlLEdBQUcsMEJBQTBCLENBQUM7QUFDbkQsSUFBTSxvQkFBb0IsR0FBRyx5QkFBeUIsQ0FBQztBQUV2RCwyQkFBMkIsVUFBK0IsRUFBRSxDQU8zRDtJQUNDLE9BQU8sVUFBVSxDQUFDLGlCQUFpQixDQUFDO1FBQ2xDLFlBQVksRUFBRSxJQUFJO1FBQ2xCLGFBQWEsRUFBRSxRQUFRO1FBQ3ZCLFNBQVMsRUFBRSxrQkFBVyxDQUFDLENBQUMsQ0FBQyxTQUFTLElBQUksZUFBZSxDQUFDO1FBQ3RELFFBQVEsRUFBRSxrQkFBVyxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUM7UUFDakMsV0FBVyxFQUFFLGtCQUFXLENBQUMsQ0FBQyxDQUFDLFdBQVcsQ0FBQztRQUN2QyxNQUFNLEVBQUUsa0JBQVcsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDO1FBQzdCLFNBQVMsRUFBRSxrQkFBVyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUM7UUFDbkMsYUFBYSxFQUFFLGtCQUFXLENBQUMsQ0FBQyxDQUFDLGFBQWEsQ0FBQztRQUMzQyxhQUFhLEVBQUUsa0JBQVcsQ0FBQyxDQUFDLENBQUMsYUFBYSxDQUFDO1FBQzNDLFVBQVUsRUFBRSxrQkFBVyxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUM7UUFDckMsbUJBQW1CLEVBQUUsa0JBQVcsQ0FBQyxDQUFDLENBQUMsbUJBQW1CLENBQUM7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