"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs");
var path = require("path");
var ts = require("typescript");
var main_1 = require("../src/main");
var test_support_1 = require("./test_support");
function getNgRootDir() {
    var moduleFilename = module.filename.replace(/\\/g, '/');
    var distIndex = moduleFilename.indexOf('/dist/all');
    return moduleFilename.substr(0, distIndex);
}
describe('ngc transformer command-line', function () {
    var basePath;
    var outDir;
    var write;
    var errorSpy;
    function shouldExist(fileName) {
        if (!fs.existsSync(path.resolve(outDir, fileName))) {
            throw new Error("Expected " + fileName + " to be emitted (outDir: " + outDir + ")");
        }
    }
    function shouldNotExist(fileName) {
        if (fs.existsSync(path.resolve(outDir, fileName))) {
            throw new Error("Did not expect " + fileName + " to be emitted (outDir: " + outDir + ")");
        }
    }
    function writeConfig(tsconfig) {
        if (tsconfig === void 0) { tsconfig = '{"extends": "./tsconfig-base.json"}'; }
        write('tsconfig.json', tsconfig);
    }
    beforeEach(function () {
        errorSpy = jasmine.createSpy('consoleError').and.callFake(console.error);
        if (test_support_1.isInBazel) {
            var support_1 = test_support_1.setup();
            basePath = support_1.basePath;
            outDir = path.join(basePath, 'built');
            process.chdir(basePath);
            write = function (fileName, content) { support_1.write(fileName, content); };
        }
        else {
            basePath = test_support_1.makeTempDir();
            process.chdir(basePath);
            write = function (fileName, content) {
                var dir = path.dirname(fileName);
                if (dir != '.') {
                    var newDir = path.join(basePath, dir);
                    if (!fs.existsSync(newDir))
                        fs.mkdirSync(newDir);
                }
                fs.writeFileSync(path.join(basePath, fileName), content, { encoding: 'utf-8' });
            };
            outDir = path.resolve(basePath, 'built');
            var ngRootDir = getNgRootDir();
            var nodeModulesPath = path.resolve(basePath, 'node_modules');
            fs.mkdirSync(nodeModulesPath);
            fs.symlinkSync(path.resolve(ngRootDir, 'dist', 'all', '@angular'), path.resolve(nodeModulesPath, '@angular'));
            fs.symlinkSync(path.resolve(ngRootDir, 'node_modules', 'rxjs'), path.resolve(nodeModulesPath, 'rxjs'));
        }
        write('tsconfig-base.json', "{\n      \"compilerOptions\": {\n        \"experimentalDecorators\": true,\n        \"skipLibCheck\": true,\n        \"noImplicitAny\": true,\n        \"types\": [],\n        \"outDir\": \"built\",\n        \"rootDir\": \".\",\n        \"baseUrl\": \".\",\n        \"declaration\": true,\n        \"target\": \"es5\",\n        \"module\": \"es2015\",\n        \"moduleResolution\": \"node\",\n        \"lib\": [\"es6\", \"dom\"],\n        \"typeRoots\": [\"node_modules/@types\"]\n      }\n    }");
    });
    it('should compile without errors', function () {
        writeConfig();
        write('test.ts', 'export const A = 1;');
        var exitCode = main_1.main(['-p', basePath], errorSpy);
        expect(errorSpy).not.toHaveBeenCalled();
        expect(exitCode).toBe(0);
    });
    describe('errors', function () {
        beforeEach(function () { errorSpy.and.stub(); });
        it('should not print the stack trace if user input file does not exist', function () {
            writeConfig("{\n        \"extends\": \"./tsconfig-base.json\",\n        \"files\": [\"test.ts\"]\n      }");
            var exitCode = main_1.main(['-p', basePath], errorSpy);
            expect(errorSpy).toHaveBeenCalledWith("error TS6053: File '" + path.join(basePath, 'test.ts') + "' not found." +
                '\n');
            expect(exitCode).toEqual(1);
        });
        it('should not print the stack trace if user input file is malformed', function () {
            writeConfig();
            write('test.ts', 'foo;');
            var exitCode = main_1.main(['-p', basePath], errorSpy);
            expect(errorSpy).toHaveBeenCalledWith("test.ts(1,1): error TS2304: Cannot find name 'foo'." +
                '\n');
            expect(exitCode).toEqual(1);
        });
        it('should not print the stack trace if cannot find the imported module', function () {
            writeConfig();
            write('test.ts', "import {MyClass} from './not-exist-deps';");
            var exitCode = main_1.main(['-p', basePath], errorSpy);
            expect(errorSpy).toHaveBeenCalledWith("test.ts(1,23): error TS2307: Cannot find module './not-exist-deps'." +
                '\n');
            expect(exitCode).toEqual(1);
        });
        it('should not print the stack trace if cannot import', function () {
            writeConfig();
            write('empty-deps.ts', 'export const A = 1;');
            write('test.ts', "import {MyClass} from './empty-deps';");
            var exitCode = main_1.main(['-p', basePath], errorSpy);
            expect(errorSpy).toHaveBeenCalledWith("test.ts(1,9): error TS2305: Module '\"" + path.join(basePath, 'empty-deps') +
                "\"' has no exported member 'MyClass'." +
                '\n');
            expect(exitCode).toEqual(1);
        });
        it('should not print the stack trace if type mismatches', function () {
            writeConfig();
            write('empty-deps.ts', 'export const A = "abc";');
            write('test.ts', "\n        import {A} from './empty-deps';\n        A();\n      ");
            var exitCode = main_1.main(['-p', basePath], errorSpy);
            expect(errorSpy).toHaveBeenCalledWith('test.ts(3,9): error TS2349: Cannot invoke an expression whose type lacks a call signature. ' +
                'Type \'String\' has no compatible call signatures.\n');
            expect(exitCode).toEqual(1);
        });
        it('should print the stack trace on compiler internal errors', function () {
            write('test.ts', 'export const A = 1;');
            var exitCode = main_1.main(['-p', 'not-exist'], errorSpy);
            expect(errorSpy).toHaveBeenCalledTimes(1);
            expect(errorSpy.calls.mostRecent().args[0]).toContain('no such file or directory');
            expect(errorSpy.calls.mostRecent().args[0]).toMatch(/at Object\.(fs\.)?lstatSync/);
            expect(exitCode).toEqual(2);
        });
        it('should report errors for ngfactory files that are not referenced by root files', function () {
            writeConfig("{\n          \"extends\": \"./tsconfig-base.json\",\n          \"files\": [\"mymodule.ts\"]\n        }");
            write('mymodule.ts', "\n        import {NgModule, Component} from '@angular/core';\n\n        @Component({template: '{{unknownProp}}'})\n        export class MyComp {}\n\n        @NgModule({declarations: [MyComp]})\n        export class MyModule {}\n      ");
            var exitCode = main_1.main(['-p', basePath], errorSpy);
            expect(errorSpy).toHaveBeenCalledTimes(1);
            expect(errorSpy.calls.mostRecent().args[0]).toContain('mymodule.ts.MyComp.html');
            expect(errorSpy.calls.mostRecent().args[0])
                .toContain("Property 'unknownProp' does not exist on type 'MyComp'");
            expect(exitCode).toEqual(1);
        });
        it('should report errors as coming from the html file, not the factory', function () {
            writeConfig("{\n          \"extends\": \"./tsconfig-base.json\",\n          \"files\": [\"mymodule.ts\"]\n        }");
            write('my.component.ts', "\n        import {Component} from '@angular/core';\n        @Component({templateUrl: './my.component.html'})\n        export class MyComp {}\n      ");
            write('my.component.html', "<h1>\n        {{unknownProp}}\n       </h1>");
            write('mymodule.ts', "\n        import {NgModule} from '@angular/core';\n        import {MyComp} from './my.component';\n\n        @NgModule({declarations: [MyComp]})\n        export class MyModule {}\n      ");
            var exitCode = main_1.main(['-p', basePath], errorSpy);
            expect(errorSpy).toHaveBeenCalledTimes(1);
            expect(errorSpy.calls.mostRecent().args[0]).toContain('my.component.html(1,5):');
            expect(errorSpy.calls.mostRecent().args[0])
                .toContain("Property 'unknownProp' does not exist on type 'MyComp'");
            expect(exitCode).toEqual(1);
        });
    });
    describe('compile ngfactory files', function () {
        it('should compile ngfactory files that are not referenced by root files', function () {
            writeConfig("{\n          \"extends\": \"./tsconfig-base.json\",\n          \"files\": [\"mymodule.ts\"]\n        }");
            write('mymodule.ts', "\n        import {CommonModule} from '@angular/common';\n        import {NgModule} from '@angular/core';\n\n        @NgModule({\n          imports: [CommonModule]\n        })\n        export class MyModule {}\n      ");
            var exitCode = main_1.main(['-p', basePath], errorSpy);
            expect(exitCode).toEqual(0);
            expect(fs.existsSync(path.resolve(outDir, 'mymodule.ngfactory.js'))).toBe(true);
            if (test_support_1.isInBazel()) {
                // In bazel we use the packaged version so the factory is at the root and we
                // get the flattened factory.
                expect(fs.existsSync(path.resolve(outDir, 'node_modules', '@angular', 'core', 'core.ngfactory.js')))
                    .toBe(true);
            }
            else {
                expect(fs.existsSync(path.resolve(outDir, 'node_modules', '@angular', 'core', 'src', 'application_module.ngfactory.js')))
                    .toBe(true);
            }
        });
        describe('comments', function () {
            function compileAndRead(contents) {
                writeConfig("{\n          \"extends\": \"./tsconfig-base.json\",\n          \"files\": [\"mymodule.ts\"],\n          \"angularCompilerOptions\": {\"allowEmptyCodegenFiles\": true}\n        }");
                write('mymodule.ts', contents);
                var exitCode = main_1.main(['-p', basePath], errorSpy);
                expect(exitCode).toEqual(0);
                var modPath = path.resolve(outDir, 'mymodule.ngfactory.js');
                expect(fs.existsSync(modPath)).toBe(true);
                return fs.readFileSync(modPath, { encoding: 'UTF-8' });
            }
            it('should be added', function () {
                var contents = compileAndRead("\n        import {CommonModule} from '@angular/common';\n        import {NgModule} from '@angular/core';\n\n        @NgModule({\n          imports: [CommonModule]\n        })\n        export class MyModule {}\n      ");
                expect(contents).toContain('@fileoverview');
                expect(contents).toContain('generated by the Angular template compiler');
                expect(contents).toContain('@suppress {suspiciousCode');
            });
            it('should be merged with existing fileoverview comments', function () {
                var contents = compileAndRead("/** Hello world. */\n\n        import {CommonModule} from '@angular/common';\n        import {NgModule} from '@angular/core';\n\n        @NgModule({\n          imports: [CommonModule]\n        })\n        export class MyModule {}\n      ");
                expect(contents).toContain('Hello world.');
            });
            it('should only pick file comments', function () {
                var contents = compileAndRead("\n          /** Comment on class. */\n          class MyClass {\n\n          }\n        ");
                expect(contents).toContain('@fileoverview');
                expect(contents).not.toContain('Comment on class.');
            });
            it('should not be merged with @license comments', function () {
                var contents = compileAndRead("/** @license Some license. */\n\n        import {CommonModule} from '@angular/common';\n        import {NgModule} from '@angular/core';\n\n        @NgModule({\n          imports: [CommonModule]\n        })\n        export class MyModule {}\n      ");
                expect(contents).toContain('@fileoverview');
                expect(contents).not.toContain('@license');
            });
            it('should be included in empty files', function () {
                var contents = compileAndRead("/** My comment. */\n\n        import {Inject, Injectable, Optional} from '@angular/core';\n\n        @Injectable()\n        export class NotAnAngularComponent {}\n      ");
                expect(contents).toContain('My comment');
            });
        });
        it('should compile with an explicit tsconfig reference', function () {
            writeConfig("{\n          \"extends\": \"./tsconfig-base.json\",\n          \"files\": [\"mymodule.ts\"]\n        }");
            write('mymodule.ts', "\n        import {CommonModule} from '@angular/common';\n        import {NgModule} from '@angular/core';\n\n        @NgModule({\n          imports: [CommonModule]\n        })\n        export class MyModule {}\n      ");
            var exitCode = main_1.main(['-p', path.join(basePath, 'tsconfig.json')], errorSpy);
            expect(exitCode).toEqual(0);
            expect(fs.existsSync(path.resolve(outDir, 'mymodule.ngfactory.js'))).toBe(true);
            if (test_support_1.isInBazel()) {
                // In bazel we use the packaged version so the factory is at the root and we
                // get the flattened factory.
                expect(fs.existsSync(path.resolve(outDir, 'node_modules', '@angular', 'core', 'core.ngfactory.js')))
                    .toBe(true);
            }
            else {
                expect(fs.existsSync(path.resolve(outDir, 'node_modules', '@angular', 'core', 'src', 'application_module.ngfactory.js')))
                    .toBe(true);
            }
        });
        describe("emit generated files depending on the source file", function () {
            var modules = ['comp', 'directive', 'module'];
            beforeEach(function () {
                write('src/comp.ts', "\n              import {Component, ViewEncapsulation} from '@angular/core';\n\n              @Component({\n                selector: 'comp-a',\n                template: 'A',\n                styleUrls: ['plain.css'],\n                encapsulation: ViewEncapsulation.None\n              })\n              export class CompA {\n              }\n\n              @Component({\n                selector: 'comp-b',\n                template: 'B',\n                styleUrls: ['emulated.css']\n              })\n              export class CompB {\n              }");
                write('src/plain.css', 'div {}');
                write('src/emulated.css', 'div {}');
                write('src/directive.ts', "\n              import {Directive, Input} from '@angular/core';\n\n              @Directive({\n                selector: '[someDir]',\n                host: {'[title]': 'someProp'},\n              })\n              export class SomeDirective {\n                @Input() someProp: string;\n              }");
                write('src/module.ts', "\n              import {NgModule} from '@angular/core';\n\n              import {CompA, CompB} from './comp';\n              import {SomeDirective} from './directive';\n\n              @NgModule({\n                declarations: [\n                  CompA, CompB,\n                  SomeDirective,\n                ],\n                exports: [\n                  CompA, CompB,\n                  SomeDirective,\n                ],\n              })\n              export class SomeModule {\n              }");
            });
            function expectJsDtsMetadataJsonToExist() {
                modules.forEach(function (moduleName) {
                    shouldExist(moduleName + '.js');
                    shouldExist(moduleName + '.d.ts');
                    shouldExist(moduleName + '.metadata.json');
                });
            }
            function expectAllGeneratedFilesToExist(enableSummariesForJit) {
                if (enableSummariesForJit === void 0) { enableSummariesForJit = true; }
                modules.forEach(function (moduleName) {
                    if (/module|comp/.test(moduleName)) {
                        shouldExist(moduleName + '.ngfactory.js');
                        shouldExist(moduleName + '.ngfactory.d.ts');
                    }
                    else {
                        shouldNotExist(moduleName + '.ngfactory.js');
                        shouldNotExist(moduleName + '.ngfactory.d.ts');
                    }
                    if (enableSummariesForJit) {
                        shouldExist(moduleName + '.ngsummary.js');
                        shouldExist(moduleName + '.ngsummary.d.ts');
                    }
                    else {
                        shouldNotExist(moduleName + '.ngsummary.js');
                        shouldNotExist(moduleName + '.ngsummary.d.ts');
                    }
                    shouldExist(moduleName + '.ngsummary.json');
                    shouldNotExist(moduleName + '.ngfactory.metadata.json');
                    shouldNotExist(moduleName + '.ngsummary.metadata.json');
                });
                shouldExist('plain.css.ngstyle.js');
                shouldExist('plain.css.ngstyle.d.ts');
                shouldExist('emulated.css.shim.ngstyle.js');
                shouldExist('emulated.css.shim.ngstyle.d.ts');
            }
            it('should emit generated files from sources with summariesForJit', function () {
                writeConfig("{\n            \"extends\": \"./tsconfig-base.json\",\n            \"angularCompilerOptions\": {\n              \"enableSummariesForJit\": true\n            },\n            \"include\": [\"src/**/*.ts\"]\n          }");
                var exitCode = main_1.main(['-p', path.join(basePath, 'tsconfig.json')], errorSpy);
                expect(exitCode).toEqual(0);
                outDir = path.resolve(basePath, 'built', 'src');
                expectJsDtsMetadataJsonToExist();
                expectAllGeneratedFilesToExist(true);
            });
            it('should not emit generated files from sources without summariesForJit', function () {
                writeConfig("{\n            \"extends\": \"./tsconfig-base.json\",\n            \"angularCompilerOptions\": {\n              \"enableSummariesForJit\": false\n            },\n            \"include\": [\"src/**/*.ts\"]\n          }");
                var exitCode = main_1.main(['-p', path.join(basePath, 'tsconfig.json')], errorSpy);
                expect(exitCode).toEqual(0);
                outDir = path.resolve(basePath, 'built', 'src');
                expectJsDtsMetadataJsonToExist();
                expectAllGeneratedFilesToExist(false);
            });
            it('should emit generated files from libraries', function () {
                // first only generate .d.ts / .js / .metadata.json files
                writeConfig("{\n            \"extends\": \"./tsconfig-base.json\",\n            \"angularCompilerOptions\": {\n              \"skipTemplateCodegen\": true\n            },\n            \"compilerOptions\": {\n              \"outDir\": \"lib\"\n            },\n            \"include\": [\"src/**/*.ts\"]\n          }");
                var exitCode = main_1.main(['-p', path.join(basePath, 'tsconfig.json')], errorSpy);
                expect(exitCode).toEqual(0);
                outDir = path.resolve(basePath, 'lib', 'src');
                modules.forEach(function (moduleName) {
                    shouldExist(moduleName + '.js');
                    shouldExist(moduleName + '.d.ts');
                    shouldExist(moduleName + '.metadata.json');
                    shouldNotExist(moduleName + '.ngfactory.js');
                    shouldNotExist(moduleName + '.ngfactory.d.ts');
                    shouldNotExist(moduleName + '.ngsummary.js');
                    shouldNotExist(moduleName + '.ngsummary.d.ts');
                    shouldNotExist(moduleName + '.ngsummary.json');
                    shouldNotExist(moduleName + '.ngfactory.metadata.json');
                    shouldNotExist(moduleName + '.ngsummary.metadata.json');
                });
                shouldNotExist('src/plain.css.ngstyle.js');
                shouldNotExist('src/plain.css.ngstyle.d.ts');
                shouldNotExist('src/emulated.css.shim.ngstyle.js');
                shouldNotExist('src/emulated.css.shim.ngstyle.d.ts');
                // Then compile again, using the previous .metadata.json as input.
                writeConfig("{\n            \"extends\": \"./tsconfig-base.json\",\n            \"angularCompilerOptions\": {\n              \"skipTemplateCodegen\": false,\n              \"enableSummariesForJit\": true\n            },\n            \"compilerOptions\": {\n              \"outDir\": \"built\"\n            },\n            \"include\": [\"lib/**/*.d.ts\"]\n          }");
                write('lib/src/plain.css', 'div {}');
                write('lib/src/emulated.css', 'div {}');
                exitCode = main_1.main(['-p', path.join(basePath, 'tsconfig.json')], errorSpy);
                expect(exitCode).toEqual(0);
                outDir = path.resolve(basePath, 'built', 'lib', 'src');
                expectAllGeneratedFilesToExist();
            });
        });
        describe('closure', function () {
            it('should not generate closure specific code by default', function () {
                writeConfig("{\n          \"extends\": \"./tsconfig-base.json\",\n          \"files\": [\"mymodule.ts\"]\n        }");
                write('mymodule.ts', "\n        import {NgModule, Component} from '@angular/core';\n\n        @Component({template: ''})\n        export class MyComp {}\n\n        @NgModule({declarations: [MyComp]})\n        export class MyModule {}\n      ");
                var exitCode = main_1.main(['-p', basePath], errorSpy);
                expect(exitCode).toEqual(0);
                var mymodulejs = path.resolve(outDir, 'mymodule.js');
                var mymoduleSource = fs.readFileSync(mymodulejs, 'utf8');
                expect(mymoduleSource).not.toContain('@fileoverview added by tsickle');
                expect(mymoduleSource).toContain('MyComp.decorators = [');
            });
            it('should add closure annotations', function () {
                writeConfig("{\n          \"extends\": \"./tsconfig-base.json\",\n          \"angularCompilerOptions\": {\n            \"annotateForClosureCompiler\": true\n          },\n          \"files\": [\"mymodule.ts\"]\n        }");
                write('mymodule.ts', "\n        import {NgModule, Component} from '@angular/core';\n\n        @Component({template: ''})\n        export class MyComp {\n          fn(p: any) {}\n        }\n\n        @NgModule({declarations: [MyComp]})\n        export class MyModule {}\n      ");
                var exitCode = main_1.main(['-p', basePath], errorSpy);
                expect(exitCode).toEqual(0);
                var mymodulejs = path.resolve(outDir, 'mymodule.js');
                var mymoduleSource = fs.readFileSync(mymodulejs, 'utf8');
                expect(mymoduleSource).toContain('@fileoverview added by tsickle');
                expect(mymoduleSource).toContain('@param {?} p');
            });
            it('should add metadata as decorators', function () {
                writeConfig("{\n          \"extends\": \"./tsconfig-base.json\",\n          \"compilerOptions\": {\n            \"emitDecoratorMetadata\": true\n          },\n          \"angularCompilerOptions\": {\n            \"annotationsAs\": \"decorators\"\n          },\n          \"files\": [\"mymodule.ts\"]\n        }");
                write('aclass.ts', "export class AClass {}");
                write('mymodule.ts', "\n          import {NgModule} from '@angular/core';\n          import {AClass} from './aclass';\n\n          @NgModule({declarations: []})\n          export class MyModule {\n            constructor(importedClass: AClass) {}\n          }\n        ");
                var exitCode = main_1.main(['-p', basePath], errorSpy);
                expect(exitCode).toEqual(0);
                var mymodulejs = path.resolve(outDir, 'mymodule.js');
                var mymoduleSource = fs.readFileSync(mymodulejs, 'utf8');
                expect(mymoduleSource).toContain('MyModule = __decorate([');
                expect(mymoduleSource).toContain("import { AClass } from './aclass';");
                expect(mymoduleSource).toContain("__metadata(\"design:paramtypes\", [AClass])");
            });
            it('should add metadata as static fields', function () {
                // Note: Don't specify emitDecoratorMetadata here on purpose,
                // as regression test for https://github.com/angular/angular/issues/19916.
                writeConfig("{\n          \"extends\": \"./tsconfig-base.json\",\n          \"compilerOptions\": {\n            \"emitDecoratorMetadata\": false\n          },\n          \"angularCompilerOptions\": {\n            \"annotationsAs\": \"static fields\"\n          },\n          \"files\": [\"mymodule.ts\"]\n        }");
                write('aclass.ts', "export class AClass {}");
                write('mymodule.ts', "\n          import {NgModule} from '@angular/core';\n          import {AClass} from './aclass';\n\n          @NgModule({declarations: []})\n          export class MyModule {\n            constructor(importedClass: AClass) {}\n          }\n        ");
                var exitCode = main_1.main(['-p', basePath], errorSpy);
                expect(exitCode).toEqual(0);
                var mymodulejs = path.resolve(outDir, 'mymodule.js');
                var mymoduleSource = fs.readFileSync(mymodulejs, 'utf8');
                expect(mymoduleSource).not.toContain('__decorate');
                expect(mymoduleSource).toContain('args: [{ declarations: [] },] }');
                expect(mymoduleSource).not.toContain("__metadata");
                expect(mymoduleSource).toContain("import { AClass } from './aclass';");
                expect(mymoduleSource).toContain("{ type: AClass }");
            });
        });
        it('should not rewrite imports when annotating with closure', function () {
            writeConfig("{\n        \"extends\": \"./tsconfig-base.json\",\n        \"compilerOptions\": {\n          \"paths\": {\n            \"submodule\": [\"./src/submodule/public_api.ts\"]\n          }\n        },\n        \"angularCompilerOptions\": {\n          \"annotateForClosureCompiler\": true\n        },\n        \"files\": [\"mymodule.ts\"]\n      }");
            write('src/test.txt', ' ');
            write('src/submodule/public_api.ts', "\n        export const A = 1;\n      ");
            write('mymodule.ts', "\n        import {NgModule, Component} from '@angular/core';\n        import {A} from 'submodule';\n\n        @Component({template: ''})\n        export class MyComp {\n          fn(p: any) { return A; }\n        }\n\n        @NgModule({declarations: [MyComp]})\n        export class MyModule {}\n    ");
            var exitCode = main_1.main(['-p', basePath], errorSpy);
            expect(exitCode).toEqual(0);
            var mymodulejs = path.resolve(outDir, 'mymodule.js');
            var mymoduleSource = fs.readFileSync(mymodulejs, 'utf8');
            expect(mymoduleSource).toContain("import { A } from 'submodule'");
        });
        describe('expression lowering', function () {
            beforeEach(function () {
                writeConfig("{\n            \"extends\": \"./tsconfig-base.json\",\n            \"files\": [\"mymodule.ts\"]\n          }");
            });
            function compile() {
                errorSpy.calls.reset();
                var result = main_1.main(['-p', path.join(basePath, 'tsconfig.json')], errorSpy);
                expect(errorSpy).not.toHaveBeenCalled();
                return result;
            }
            it('should be able to lower a lambda expression in a provider', function () {
                write('mymodule.ts', "\n          import {CommonModule} from '@angular/common';\n          import {NgModule} from '@angular/core';\n\n          class Foo {}\n\n          @NgModule({\n            imports: [CommonModule],\n            providers: [{provide: 'someToken', useFactory: () => new Foo()}]\n          })\n          export class MyModule {}\n        ");
                expect(compile()).toEqual(0);
                var mymodulejs = path.resolve(outDir, 'mymodule.js');
                var mymoduleSource = fs.readFileSync(mymodulejs, 'utf8');
                expect(mymoduleSource).toContain('var ɵ0 = function () { return new Foo(); }');
                expect(mymoduleSource).toContain('export { ɵ0');
                var mymodulefactory = path.resolve(outDir, 'mymodule.ngfactory.js');
                var mymodulefactorySource = fs.readFileSync(mymodulefactory, 'utf8');
                expect(mymodulefactorySource).toContain('"someToken", i1.ɵ0');
            });
            it('should be able to lower a function expression in a provider', function () {
                write('mymodule.ts', "\n          import {CommonModule} from '@angular/common';\n          import {NgModule} from '@angular/core';\n\n          class Foo {}\n\n          @NgModule({\n            imports: [CommonModule],\n            providers: [{provide: 'someToken', useFactory: function() {return new Foo();}}]\n          })\n          export class MyModule {}\n        ");
                expect(compile()).toEqual(0);
                var mymodulejs = path.resolve(outDir, 'mymodule.js');
                var mymoduleSource = fs.readFileSync(mymodulejs, 'utf8');
                expect(mymoduleSource).toContain('var ɵ0 = function () { return new Foo(); }');
                expect(mymoduleSource).toContain('export { ɵ0');
                var mymodulefactory = path.resolve(outDir, 'mymodule.ngfactory.js');
                var mymodulefactorySource = fs.readFileSync(mymodulefactory, 'utf8');
                expect(mymodulefactorySource).toContain('"someToken", i1.ɵ0');
            });
            it('should able to lower multiple expressions', function () {
                write('mymodule.ts', "\n          import {CommonModule} from '@angular/common';\n          import {NgModule} from '@angular/core';\n\n          class Foo {}\n\n          @NgModule({\n            imports: [CommonModule],\n            providers: [\n              {provide: 'someToken', useFactory: () => new Foo()},\n              {provide: 'someToken', useFactory: () => new Foo()},\n              {provide: 'someToken', useFactory: () => new Foo()},\n              {provide: 'someToken', useFactory: () => new Foo()}\n            ]\n          })\n          export class MyModule {}\n        ");
                expect(compile()).toEqual(0);
                var mymodulejs = path.resolve(outDir, 'mymodule.js');
                var mymoduleSource = fs.readFileSync(mymodulejs, 'utf8');
                expect(mymoduleSource).toContain('ɵ0 = function () { return new Foo(); }');
                expect(mymoduleSource).toContain('ɵ1 = function () { return new Foo(); }');
                expect(mymoduleSource).toContain('ɵ2 = function () { return new Foo(); }');
                expect(mymoduleSource).toContain('ɵ3 = function () { return new Foo(); }');
                expect(mymoduleSource).toContain('export { ɵ0, ɵ1, ɵ2, ɵ3');
            });
            it('should be able to lower an indirect expression', function () {
                write('mymodule.ts', "\n          import {CommonModule} from '@angular/common';\n          import {NgModule} from '@angular/core';\n\n          class Foo {}\n\n          const factory = () => new Foo();\n\n          @NgModule({\n            imports: [CommonModule],\n            providers: [{provide: 'someToken', useFactory: factory}]\n          })\n          export class MyModule {}\n        ");
                expect(compile()).toEqual(0, 'Compile failed');
                var mymodulejs = path.resolve(outDir, 'mymodule.js');
                var mymoduleSource = fs.readFileSync(mymodulejs, 'utf8');
                expect(mymoduleSource).toContain('var factory = function () { return new Foo(); }');
                expect(mymoduleSource).toContain('var ɵ0 = factory;');
                expect(mymoduleSource).toContain('export { ɵ0 };');
            });
            it('should not lower a lambda that is already exported', function () {
                write('mymodule.ts', "\n          import {CommonModule} from '@angular/common';\n          import {NgModule} from '@angular/core';\n\n          export class Foo {}\n\n          export const factory = () => new Foo();\n\n          @NgModule({\n            imports: [CommonModule],\n            providers: [{provide: 'someToken', useFactory: factory}]\n          })\n          export class MyModule {}\n        ");
                expect(compile()).toEqual(0);
                var mymodulejs = path.resolve(outDir, 'mymodule.js');
                var mymoduleSource = fs.readFileSync(mymodulejs, 'utf8');
                expect(mymoduleSource).not.toContain('ɵ0');
            });
            it('should lower an NgModule id', function () {
                write('mymodule.ts', "\n          import {NgModule} from '@angular/core';\n\n          @NgModule({\n            id: (() => 'test')(),\n          })\n          export class MyModule {}\n        ");
                expect(compile()).toEqual(0);
                var mymodulejs = path.resolve(outDir, 'mymodule.js');
                var mymoduleSource = fs.readFileSync(mymodulejs, 'utf8');
                expect(mymoduleSource).toContain('id: ɵ0');
                expect(mymoduleSource).toMatch(/ɵ0 = .*'test'/);
            });
            it('should lower loadChildren', function () {
                write('mymodule.ts', "\n          import {Component, NgModule} from '@angular/core';\n          import {RouterModule} from '@angular/router';\n          \n          export function foo(): string {\n            console.log('side-effect');\n            return 'test';\n          }\n\n          @Component({\n            selector: 'route',\n            template: 'route',\n          })\n          export class Route {}\n\n          @NgModule({\n            declarations: [Route],\n            imports: [\n              RouterModule.forRoot([\n                {path: '', pathMatch: 'full', component: Route, loadChildren: foo()}\n              ]),\n            ]\n          })\n          export class MyModule {}\n        ");
                expect(compile()).toEqual(0);
                var mymodulejs = path.resolve(outDir, 'mymodule.js');
                var mymoduleSource = fs.readFileSync(mymodulejs, 'utf8');
                expect(mymoduleSource).toContain('loadChildren: ɵ0');
                expect(mymoduleSource).toMatch(/ɵ0 = .*foo\(\)/);
            });
            it('should be able to lower supported expressions', function () {
                writeConfig("{\n          \"extends\": \"./tsconfig-base.json\",\n          \"files\": [\"module.ts\"]\n        }");
                write('module.ts', "\n          import {NgModule, InjectionToken} from '@angular/core';\n          import {AppComponent} from './app';\n\n          export interface Info {\n            route: string;\n            data: string;\n          }\n\n          export const T1 = new InjectionToken<string>('t1');\n          export const T2 = new InjectionToken<string>('t2');\n          export const T3 = new InjectionToken<number>('t3');\n          export const T4 = new InjectionToken<Info[]>('t4');\n\n          enum SomeEnum {\n            OK,\n            Cancel\n          }\n\n          function calculateString() {\n            return 'someValue';\n          }\n\n          const routeLikeData = [{\n             route: '/home',\n             data: calculateString()\n          }];\n\n          @NgModule({\n            declarations: [AppComponent],\n            providers: [\n              { provide: T1, useValue: calculateString() },\n              { provide: T2, useFactory: () => 'someValue' },\n              { provide: T3, useValue: SomeEnum.OK },\n              { provide: T4, useValue: routeLikeData }\n            ]\n          })\n          export class MyModule {}\n        ");
                write('app.ts', "\n          import {Component, Inject} from '@angular/core';\n          import * as m from './module';\n\n          @Component({\n            selector: 'my-app',\n            template: ''\n          })\n          export class AppComponent {\n            constructor(\n              @Inject(m.T1) private t1: string,\n              @Inject(m.T2) private t2: string,\n              @Inject(m.T3) private t3: number,\n              @Inject(m.T4) private t4: m.Info[],\n            ) {}\n          }\n        ");
                expect(main_1.main(['-p', basePath], errorSpy)).toBe(0);
                shouldExist('module.js');
            });
            it('should allow to use lowering with export *', function () {
                write('mymodule.ts', "\n          import {NgModule} from '@angular/core';\n\n          export * from './util';\n\n          // Note: the lambda will be lowered into an exported expression\n          @NgModule({providers: [{provide: 'aToken', useValue: () => 2}]})\n          export class MyModule {}\n        ");
                write('util.ts', "\n          // Note: The lambda will be lowered into an exported expression\n          const x = () => 2;\n\n          export const y = x;\n        ");
                expect(compile()).toEqual(0);
                var mymoduleSource = fs.readFileSync(path.resolve(outDir, 'mymodule.js'), 'utf8');
                expect(mymoduleSource).toContain('ɵ0');
                var utilSource = fs.readFileSync(path.resolve(outDir, 'util.js'), 'utf8');
                expect(utilSource).toContain('ɵ0');
                var mymoduleNgFactoryJs = fs.readFileSync(path.resolve(outDir, 'mymodule.ngfactory.js'), 'utf8');
                // check that the generated code refers to ɵ0 from mymodule, and not from util!
                expect(mymoduleNgFactoryJs).toContain("import * as i1 from \"./mymodule\"");
                expect(mymoduleNgFactoryJs).toContain("\"aToken\", i1.\u02750");
            });
        });
        function writeFlatModule(outFile) {
            writeConfig("\n      {\n        \"extends\": \"./tsconfig-base.json\",\n        \"angularCompilerOptions\": {\n          \"flatModuleId\": \"flat_module\",\n          \"flatModuleOutFile\": \"" + outFile + "\",\n          \"skipTemplateCodegen\": true,\n          \"enableResourceInlining\": true\n        },\n        \"files\": [\"public-api.ts\"]\n      }\n      ");
            write('public-api.ts', "\n        export * from './src/flat.component';\n        export * from './src/flat.module';");
            write('src/flat.component.html', '<div>flat module component</div>');
            write('src/flat.component.ts', "\n        import {Component} from '@angular/core';\n\n        @Component({\n          selector: 'flat-comp',\n          templateUrl: 'flat.component.html',\n        })\n        export class FlatComponent {\n        }");
            write('src/flat.module.ts', "\n        import {NgModule} from '@angular/core';\n\n        import {FlatComponent} from './flat.component';\n\n        @NgModule({\n          declarations: [\n            FlatComponent,\n          ],\n          exports: [\n            FlatComponent,\n          ],\n        })\n        export class FlatModule {\n        }");
        }
        it('should be able to generate a flat module library', function () {
            writeFlatModule('index.js');
            var exitCode = main_1.main(['-p', path.join(basePath, 'tsconfig.json')], errorSpy);
            expect(exitCode).toEqual(0);
            shouldExist('index.js');
            shouldExist('index.metadata.json');
        });
        it('should downlevel templates in flat module metadata', function () {
            writeFlatModule('index.js');
            var exitCode = main_1.main(['-p', path.join(basePath, 'tsconfig.json')], errorSpy);
            expect(exitCode).toEqual(0);
            shouldExist('index.js');
            shouldExist('index.metadata.json');
            var metadataPath = path.resolve(outDir, 'index.metadata.json');
            var metadataSource = fs.readFileSync(metadataPath, 'utf8');
            expect(metadataSource).not.toContain('templateUrl');
            expect(metadataSource).toContain('<div>flat module component</div>');
        });
        describe('with tree example', function () {
            beforeEach(function () {
                writeConfig();
                write('index_aot.ts', "\n          import {enableProdMode} from '@angular/core';\n          import {platformBrowser} from '@angular/platform-browser';\n\n          import {AppModuleNgFactory} from './tree.ngfactory';\n\n          enableProdMode();\n          platformBrowser().bootstrapModuleFactory(AppModuleNgFactory);");
                write('tree.ts', "\n          import {Component, NgModule} from '@angular/core';\n          import {CommonModule} from '@angular/common';\n\n          @Component({\n            selector: 'tree',\n            inputs: ['data'],\n            template:\n                `<span [style.backgroundColor]=\"bgColor\"> {{data.value}} </span><tree *ngIf='data.right != null' [data]='data.right'></tree><tree *ngIf='data.left != null' [data]='data.left'></tree>`\n          })\n          export class TreeComponent {\n            data: any;\n            bgColor = 0;\n          }\n\n          @NgModule({imports: [CommonModule], bootstrap: [TreeComponent], declarations: [TreeComponent]})\n          export class AppModule {}\n        ");
            });
            it('should compile without error', function () {
                expect(main_1.main(['-p', path.join(basePath, 'tsconfig.json')], errorSpy)).toBe(0);
            });
        });
        it('should be able to compile multiple libraries with summaries', function () {
            // Note: we need to emit the generated code for the libraries
            // into the node_modules, as that is the only way that we
            // currently support when using summaries.
            // TODO(tbosch): add support for `paths` to our CompilerHost.fileNameToModuleName
            // and then use `paths` here instead of writing to node_modules.
            // Angular
            write('tsconfig-ng.json', "{\n          \"extends\": \"./tsconfig-base.json\",\n          \"angularCompilerOptions\": {\n            \"generateCodeForLibraries\": true,\n            \"enableSummariesForJit\": true\n          },\n          \"compilerOptions\": {\n            \"outDir\": \".\"\n          },\n          \"include\": [\"node_modules/@angular/core/**/*\"],\n          \"exclude\": [\n            \"node_modules/@angular/core/test/**\",\n            \"node_modules/@angular/core/testing/**\"\n          ]\n        }");
            // Lib 1
            write('lib1/tsconfig-lib1.json', "{\n          \"extends\": \"../tsconfig-base.json\",\n          \"angularCompilerOptions\": {\n            \"generateCodeForLibraries\": false,\n            \"enableSummariesForJit\": true\n          },\n          \"compilerOptions\": {\n            \"rootDir\": \".\",\n            \"outDir\": \"../node_modules/lib1_built\"\n          }\n        }");
            write('lib1/module.ts', "\n          import {NgModule} from '@angular/core';\n\n          export function someFactory(): any { return null; }\n\n          @NgModule({\n            providers: [{provide: 'foo', useFactory: someFactory}]\n          })\n          export class Module {}\n        ");
            write('lib1/class1.ts', "export class Class1 {}");
            // Lib 2
            write('lib2/tsconfig-lib2.json', "{\n          \"extends\": \"../tsconfig-base.json\",\n          \"angularCompilerOptions\": {\n            \"generateCodeForLibraries\": false,\n            \"enableSummariesForJit\": true\n          },\n          \"compilerOptions\": {\n            \"rootDir\": \".\",\n            \"outDir\": \"../node_modules/lib2_built\"\n          }\n        }");
            write('lib2/module.ts', "\n          export {Module} from 'lib1_built/module';\n        ");
            write('lib2/class2.ts', "\n        import {Class1} from 'lib1_built/class1';\n\n        export class Class2 {\n          constructor(class1: Class1) {}\n        }\n      ");
            // Application
            write('app/tsconfig-app.json', "{\n          \"extends\": \"../tsconfig-base.json\",\n          \"angularCompilerOptions\": {\n            \"generateCodeForLibraries\": false,\n            \"enableSummariesForJit\": true\n          },\n          \"compilerOptions\": {\n            \"rootDir\": \".\",\n            \"outDir\": \"../built/app\"\n          }\n        }");
            write('app/main.ts', "\n          import {NgModule, Inject} from '@angular/core';\n          import {Module} from 'lib2_built/module';\n\n          @NgModule({\n            imports: [Module]\n          })\n          export class AppModule {\n            constructor(@Inject('foo') public foo: any) {}\n          }\n        ");
            if (!test_support_1.isInBazel()) {
                // This is not necessary in bazel as it uses the npm_package
                expect(main_1.main(['-p', path.join(basePath, 'tsconfig-ng.json')], errorSpy)).toBe(0);
            }
            expect(main_1.main(['-p', path.join(basePath, 'lib1', 'tsconfig-lib1.json')], errorSpy)).toBe(0);
            expect(main_1.main(['-p', path.join(basePath, 'lib2', 'tsconfig-lib2.json')], errorSpy)).toBe(0);
            expect(main_1.main(['-p', path.join(basePath, 'app', 'tsconfig-app.json')], errorSpy)).toBe(0);
            // library 1
            // make `shouldExist` / `shouldNotExist` relative to `node_modules`
            outDir = path.resolve(basePath, 'node_modules');
            shouldExist('lib1_built/module.js');
            shouldExist('lib1_built/module.ngsummary.json');
            shouldExist('lib1_built/module.ngsummary.js');
            shouldExist('lib1_built/module.ngsummary.d.ts');
            shouldExist('lib1_built/module.ngfactory.js');
            shouldExist('lib1_built/module.ngfactory.d.ts');
            // library 2
            // make `shouldExist` / `shouldNotExist` relative to `node_modules`
            outDir = path.resolve(basePath, 'node_modules');
            shouldExist('lib2_built/module.js');
            shouldExist('lib2_built/module.ngsummary.json');
            shouldExist('lib2_built/module.ngsummary.js');
            shouldExist('lib2_built/module.ngsummary.d.ts');
            shouldExist('lib2_built/module.ngfactory.js');
            shouldExist('lib2_built/module.ngfactory.d.ts');
            shouldExist('lib2_built/class2.ngsummary.json');
            shouldNotExist('lib2_built/class2.ngsummary.js');
            shouldNotExist('lib2_built/class2.ngsummary.d.ts');
            shouldExist('lib2_built/class2.ngfactory.js');
            shouldExist('lib2_built/class2.ngfactory.d.ts');
            // app
            // make `shouldExist` / `shouldNotExist` relative to `built`
            outDir = path.resolve(basePath, 'built');
            shouldExist('app/main.js');
        });
        if (!test_support_1.isInBazel()) {
            // This is an unnecessary test bazel as it always uses flat modules
            it('should be able to compile libraries with summaries and flat modules', function () {
                writeFiles();
                compile();
                // libraries
                // make `shouldExist` / `shouldNotExist` relative to `node_modules`
                outDir = path.resolve(basePath, 'node_modules');
                shouldExist('flat_module/index.ngfactory.js');
                shouldExist('flat_module/index.ngsummary.json');
                // app
                // make `shouldExist` / `shouldNotExist` relative to `built`
                outDir = path.resolve(basePath, 'built');
                shouldExist('app/main.ngfactory.js');
                var factory = fs.readFileSync(path.resolve(outDir, 'app/main.ngfactory.js')).toString();
                // reference to the module itself
                expect(factory).toMatch(/from "flat_module"/);
                // no reference to a deep file
                expect(factory).not.toMatch(/from "flat_module\//);
                function writeFiles() {
                    createFlatModuleInNodeModules();
                    // Angular + flat module
                    write('tsconfig-lib.json', "{\n            \"extends\": \"./tsconfig-base.json\",\n            \"angularCompilerOptions\": {\n              \"generateCodeForLibraries\": true\n            },\n            \"compilerOptions\": {\n              \"outDir\": \".\"\n            },\n            \"include\": [\"node_modules/@angular/core/**/*\", \"node_modules/flat_module/**/*\"],\n            \"exclude\": [\n              \"node_modules/@angular/core/test/**\",\n              \"node_modules/@angular/core/testing/**\"\n            ]\n          }");
                    // Application
                    write('app/tsconfig-app.json', "{\n            \"extends\": \"../tsconfig-base.json\",\n            \"angularCompilerOptions\": {\n              \"generateCodeForLibraries\": false\n            },\n            \"compilerOptions\": {\n              \"rootDir\": \".\",\n              \"outDir\": \"../built/app\"\n            }\n          }");
                    write('app/main.ts', "\n            import {NgModule} from '@angular/core';\n            import {FlatModule} from 'flat_module';\n\n            @NgModule({\n              imports: [FlatModule]\n            })\n            export class AppModule {}\n          ");
                }
                function createFlatModuleInNodeModules() {
                    // compile the flat module
                    writeFlatModule('index.js');
                    expect(main_1.main(['-p', basePath], errorSpy)).toBe(0);
                    // move the flat module output into node_modules
                    var flatModuleNodeModulesPath = path.resolve(basePath, 'node_modules', 'flat_module');
                    fs.renameSync(outDir, flatModuleNodeModulesPath);
                    fs.renameSync(path.resolve(basePath, 'src/flat.component.html'), path.resolve(flatModuleNodeModulesPath, 'src/flat.component.html'));
                    // and remove the sources.
                    fs.renameSync(path.resolve(basePath, 'src'), path.resolve(basePath, 'flat_module_src'));
                    fs.unlinkSync(path.resolve(basePath, 'public-api.ts'));
                    // add a flatModuleIndexRedirect
                    write('node_modules/flat_module/redirect.metadata.json', "{\n            \"__symbolic\": \"module\",\n            \"version\": 3,\n            \"metadata\": {},\n            \"exports\": [\n              {\n                \"from\": \"./index\"\n              }\n            ],\n            \"flatModuleIndexRedirect\": true,\n            \"importAs\": \"flat_module\"\n          }");
                    write('node_modules/flat_module/redirect.d.ts', "export * from './index';");
                    // add a package.json to use the redirect
                    write('node_modules/flat_module/package.json', "{\"typings\": \"./redirect.d.ts\"}");
                }
                function compile() {
                    expect(main_1.main(['-p', path.join(basePath, 'tsconfig-lib.json')], errorSpy)).toBe(0);
                    expect(main_1.main(['-p', path.join(basePath, 'app', 'tsconfig-app.json')], errorSpy)).toBe(0);
                }
            });
        }
        describe('enableResourceInlining', function () {
            it('should inline templateUrl and styleUrl in JS and metadata', function () {
                writeConfig("{\n          \"extends\": \"./tsconfig-base.json\",\n          \"files\": [\"mymodule.ts\"],\n          \"angularCompilerOptions\": {\n            \"enableResourceInlining\": true\n          }\n        }");
                write('my.component.ts', "\n        import {Component} from '@angular/core';\n        @Component({\n          templateUrl: './my.component.html',\n          styleUrls: ['./my.component.css'],\n        })\n        export class MyComp {}\n      ");
                write('my.component.html', "<h1>Some template content</h1>");
                write('my.component.css', "h1 {color: blue}");
                write('mymodule.ts', "\n        import {NgModule} from '@angular/core';\n        import {MyComp} from './my.component';\n\n        @NgModule({declarations: [MyComp]})\n        export class MyModule {}\n      ");
                var exitCode = main_1.main(['-p', basePath]);
                expect(exitCode).toEqual(0);
                outDir = path.resolve(basePath, 'built');
                var outputJs = fs.readFileSync(path.join(outDir, 'my.component.js'), { encoding: 'utf-8' });
                expect(outputJs).not.toContain('templateUrl');
                expect(outputJs).not.toContain('styleUrls');
                expect(outputJs).toContain('Some template content');
                expect(outputJs).toContain('color: blue');
                var outputMetadata = fs.readFileSync(path.join(outDir, 'my.component.metadata.json'), { encoding: 'utf-8' });
                expect(outputMetadata).not.toContain('templateUrl');
                expect(outputMetadata).not.toContain('styleUrls');
                expect(outputMetadata).toContain('Some template content');
                expect(outputMetadata).toContain('color: blue');
            });
        });
    });
    describe('expression lowering', function () {
        var shouldExist = function (fileName) {
            if (!fs.existsSync(path.resolve(basePath, fileName))) {
                throw new Error("Expected " + fileName + " to be emitted (basePath: " + basePath + ")");
            }
        };
        it('should be able to lower supported expressions', function () {
            writeConfig("{\n        \"extends\": \"./tsconfig-base.json\",\n        \"files\": [\"module.ts\"]\n      }");
            write('module.ts', "\n        import {NgModule, InjectionToken} from '@angular/core';\n        import {AppComponent} from './app';\n\n        export interface Info {\n          route: string;\n          data: string;\n        }\n\n        export const T1 = new InjectionToken<string>('t1');\n        export const T2 = new InjectionToken<string>('t2');\n        export const T3 = new InjectionToken<number>('t3');\n        export const T4 = new InjectionToken<Info[]>('t4');\n\n        enum SomeEnum {\n          OK,\n          Cancel\n        }\n\n        function calculateString() {\n          return 'someValue';\n        }\n\n        const routeLikeData = [{\n           route: '/home',\n           data: calculateString()\n        }];\n\n        @NgModule({\n          declarations: [AppComponent],\n          providers: [\n            { provide: T1, useValue: calculateString() },\n            { provide: T2, useFactory: () => 'someValue' },\n            { provide: T3, useValue: SomeEnum.OK },\n            { provide: T4, useValue: routeLikeData }\n          ]\n        })\n        export class MyModule {}\n      ");
            write('app.ts', "\n        import {Component, Inject} from '@angular/core';\n        import * as m from './module';\n\n        @Component({\n          selector: 'my-app',\n          template: ''\n        })\n        export class AppComponent {\n          constructor(\n            @Inject(m.T1) private t1: string,\n            @Inject(m.T2) private t2: string,\n            @Inject(m.T3) private t3: number,\n            @Inject(m.T4) private t4: m.Info[],\n          ) {}\n        }\n      ");
            expect(main_1.main(['-p', basePath], function (s) { })).toBe(0);
            shouldExist('built/module.js');
        });
    });
    describe('watch mode', function () {
        var timer = undefined;
        var results = undefined;
        var originalTimeout;
        function trigger() {
            var delay = 1000;
            setTimeout(function () {
                var t = timer;
                timer = undefined;
                if (!t) {
                    fail('Unexpected state. Timer was not set.');
                }
                else {
                    t();
                }
            }, delay);
        }
        function whenResults() {
            return new Promise(function (resolve) {
                results = function (message) {
                    resolve(message);
                    results = undefined;
                };
            });
        }
        function errorSpy(message) {
            if (results)
                results(message);
        }
        beforeEach(function () {
            originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            var timerToken = 100;
            spyOn(ts.sys, 'setTimeout').and.callFake(function (callback) {
                timer = callback;
                return timerToken;
            });
            spyOn(ts.sys, 'clearTimeout').and.callFake(function (token) {
                if (token == timerToken) {
                    timer = undefined;
                }
            });
            write('greet.html', "<p class=\"greeting\"> Hello {{name}}!</p>");
            write('greet.css', "p.greeting { color: #eee }");
            write('greet.ts', "\n        import {Component, Input} from '@angular/core';\n\n        @Component({\n          selector: 'greet',\n          templateUrl: 'greet.html',\n          styleUrls: ['greet.css']\n        })\n        export class Greet {\n          @Input()\n          name: string;\n        }\n      ");
            write('app.ts', "\n        import {Component} from '@angular/core'\n\n        @Component({\n          selector: 'my-app',\n          template: `\n            <div>\n              <greet [name]='name'></greet>\n            </div>\n          `,\n        })\n        export class App {\n          name:string;\n          constructor() {\n            this.name = `Angular!`\n          }\n        }");
            write('module.ts', "\n        import {NgModule} from '@angular/core';\n        import {Greet} from './greet';\n        import {App} from './app';\n\n        @NgModule({\n          declarations: [Greet, App]\n        })\n        export class MyModule {}\n      ");
        });
        afterEach(function () { jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout; });
        function writeAppConfig(location) {
            writeConfig("{\n            \"extends\": \"./tsconfig-base.json\",\n            \"compilerOptions\": {\n              \"outDir\": \"" + location + "\"\n            }\n          }");
        }
        function expectRecompile(cb) {
            return function (done) {
                writeAppConfig('dist');
                var config = main_1.readCommandLineAndConfiguration(['-p', basePath]);
                var compile = main_1.watchMode(config.project, config.options, errorSpy);
                return new Promise(function (resolve) {
                    compile.ready(function () {
                        cb();
                        // Allow the watch callbacks to occur and trigger the timer.
                        trigger();
                        // Expect the file to trigger a result.
                        whenResults().then(function (message) {
                            expect(message).toMatch(/File change detected/);
                            compile.close();
                            done();
                            resolve();
                        });
                    });
                });
            };
        }
        it('should recompile when config file changes', expectRecompile(function () { return writeAppConfig('dist2'); }));
        it('should recompile when a ts file changes', expectRecompile(function () {
            write('greet.ts', "\n          import {Component, Input} from '@angular/core';\n\n          @Component({\n            selector: 'greet',\n            templateUrl: 'greet.html',\n            styleUrls: ['greet.css'],\n          })\n          export class Greet {\n            @Input()\n            name: string;\n            age: number;\n          }\n        ");
        }));
        it('should recompile when the html file changes', expectRecompile(function () { write('greet.html', '<p> Hello {{name}} again!</p>'); }));
        it('should recompile when the css file changes', expectRecompile(function () { write('greet.css', "p.greeting { color: blue }"); }));
    });
    describe('regressions', function () {
        //#20479
        it('should not generate an invalid metadata file', function () {
            write('src/tsconfig.json', "{\n        \"extends\": \"../tsconfig-base.json\",\n        \"files\": [\"lib.ts\"],\n        \"angularCompilerOptions\": {\n          \"skipTemplateCodegen\": true\n        }\n      }");
            write('src/lib.ts', "\n        export namespace A{\n          export class C1 {\n          }\n          export interface I1{\n          }\n        }");
            expect(main_1.main(['-p', path.join(basePath, 'src/tsconfig.json')])).toBe(0);
            shouldNotExist('src/lib.metadata.json');
        });
        //#19544
        it('should recognize @NgModule() directive with a redundant @Injectable()', function () {
            write('src/tsconfig.json', "{\n        \"extends\": \"../tsconfig-base.json\",\n        \"compilerOptions\": {\n          \"outDir\": \"../dist\",\n          \"rootDir\": \".\",\n          \"rootDirs\": [\n            \".\",\n            \"../dist\"\n          ]\n        },\n        \"files\": [\"test-module.ts\"]\n      }");
            write('src/test.component.ts', "\n        import {Component} from '@angular/core';\n\n        @Component({\n          template: '<p>hello</p>',\n        })\n        export class TestComponent {}\n      ");
            write('src/test-module.ts', "\n        import {Injectable, NgModule} from '@angular/core';\n        import {TestComponent} from './test.component';\n\n        @NgModule({declarations: [TestComponent]})\n        @Injectable()\n        export class TestModule {}\n      ");
            var messages = [];
            var exitCode = main_1.main(['-p', path.join(basePath, 'src/tsconfig.json')], function (message) { return messages.push(message); });
            expect(exitCode).toBe(0, 'Compile failed unexpectedly.\n  ' + messages.join('\n  '));
        });
        // #19765
        it('should not report an error when the resolved .css file is in outside rootDir', function () {
            write('src/tsconfig.json', "{\n        \"extends\": \"../tsconfig-base.json\",\n        \"compilerOptions\": {\n          \"outDir\": \"../dist\",\n          \"rootDir\": \".\",\n          \"rootDirs\": [\n            \".\",\n            \"../dist\"\n          ]\n        },\n        \"files\": [\"test-module.ts\"]\n      }");
            write('src/lib/test.component.ts', "\n        import {Component} from '@angular/core';\n\n        @Component({\n          template: '<p>hello</p>',\n          styleUrls: ['./test.component.css']\n        })\n        export class TestComponent {}\n      ");
            write('dist/dummy.txt', ''); // Force dist to be created
            write('dist/lib/test.component.css', "\n        p { color: blue }\n      ");
            write('src/test-module.ts', "\n        import {NgModule} from '@angular/core';\n        import {TestComponent} from './lib/test.component';\n\n        @NgModule({declarations: [TestComponent]})\n        export class TestModule {}\n      ");
            var messages = [];
            var exitCode = main_1.main(['-p', path.join(basePath, 'src/tsconfig.json')], function (message) { return messages.push(message); });
            expect(exitCode).toBe(0, 'Compile failed unexpectedly.\n  ' + messages.join('\n  '));
        });
        it('should emit all structural errors', function () {
            write('src/tsconfig.json', "{\n        \"extends\": \"../tsconfig-base.json\",\n        \"files\": [\"test-module.ts\"]\n      }");
            write('src/lib/indirect2.ts', "\n        declare var f: any;\n        export const t2 = f`<p>hello</p>`;\n      ");
            write('src/lib/indirect1.ts', "\n        import {t2} from './indirect2';\n        export const t1 = t2 + ' ';\n      ");
            write('src/lib/test.component.ts', "\n        import {Component} from '@angular/core';\n        import {t1} from './indirect1';\n\n        @Component({\n          template: t1\n        })\n        export class TestComponent {}\n      ");
            write('src/test-module.ts', "\n        import {NgModule} from '@angular/core';\n        import {TestComponent} from './lib/test.component';\n\n        @NgModule({declarations: [TestComponent]})\n        export class TestModule {}\n      ");
            var messages = [];
            var exitCode = main_1.main(['-p', path.join(basePath, 'src/tsconfig.json')], function (message) { return messages.push(message); });
            expect(exitCode).toBe(1, 'Compile was expected to fail');
            expect(messages[0]).toContain('Tagged template expressions are not supported in metadata');
        });
        // Regression: #20076
        it('should report template error messages', function () {
            write('src/tsconfig.json', "{\n        \"extends\": \"../tsconfig-base.json\",\n        \"files\": [\"test-module.ts\"]\n      }");
            write('src/lib/test.component.ts', "\n        import {Component} from '@angular/core';\n\n        @Component({\n          template: '{{thing.?stuff}}'\n        })\n        export class TestComponent {\n          thing: string;\n        }\n      ");
            write('src/test-module.ts', "\n        import {NgModule} from '@angular/core';\n        import {TestComponent} from './lib/test.component';\n\n        @NgModule({declarations: [TestComponent]})\n        export class TestModule {}\n      ");
            var messages = [];
            var exitCode = main_1.main(['-p', path.join(basePath, 'src/tsconfig.json')], function (message) { return messages.push(message); });
            expect(exitCode).toBe(1, 'Compile was expected to fail');
            expect(messages[0]).toContain('Parser Error: Unexpected token');
        });
        // Regression test for #19979
        it('should not stack overflow on a recursive module export', function () {
            write('src/tsconfig.json', "{\n        \"extends\": \"../tsconfig-base.json\",\n        \"files\": [\"test-module.ts\"]\n      }");
            write('src/test-module.ts', "\n        import {Component, NgModule} from '@angular/core';\n\n        @Component({\n          template: 'Hello'\n        })\n        export class MyFaultyComponent {}\n\n        @NgModule({\n          exports: [MyFaultyModule],\n          declarations: [MyFaultyComponent],\n          providers: [],\n        })\n        export class MyFaultyModule { }\n      ");
            var messages = [];
            expect(main_1.main(['-p', path.join(basePath, 'src/tsconfig.json')], function (message) { return messages.push(message); }))
                .toBe(1, 'Compile was expected to fail');
            expect(messages[0]).toContain("module 'MyFaultyModule' is exported recursively");
        });
        // Regression test for #19979
        it('should not stack overflow on a recursive module import', function () {
            write('src/tsconfig.json', "{\n        \"extends\": \"../tsconfig-base.json\",\n        \"files\": [\"test-module.ts\"]\n      }");
            write('src/test-module.ts', "\n        import {Component, NgModule, forwardRef} from '@angular/core';\n\n        @Component({\n          template: 'Hello'\n        })\n        export class MyFaultyComponent {}\n\n        @NgModule({\n          imports: [forwardRef(() => MyFaultyModule)]\n        })\n        export class MyFaultyImport {}\n\n        @NgModule({\n          imports: [MyFaultyImport],\n          declarations: [MyFaultyComponent]\n        })\n        export class MyFaultyModule { }\n      ");
            var messages = [];
            expect(main_1.main(['-p', path.join(basePath, 'src/tsconfig.json')], function (message) { return messages.push(message); }))
                .toBe(1, 'Compile was expected to fail');
            expect(messages[0]).toContain("is imported recursively by the module 'MyFaultyImport");
        });
        // Regression test for #21273
        it('should not report errors for unknown property annotations', function () {
            write('src/tsconfig.json', "{\n        \"extends\": \"../tsconfig-base.json\",\n        \"files\": [\"test-module.ts\"]\n      }");
            write('src/test-decorator.ts', "\n        export function Convert(p: any): any {\n          // Make sur this doesn't look like a macro function\n          var r = p;\n          return r;\n        }\n      ");
            write('src/test-module.ts', "\n        import {Component, Input, NgModule} from '@angular/core';\n        import {Convert} from './test-decorator';\n\n        @Component({template: '{{name}}'})\n        export class TestComponent {\n          @Input() @Convert(convert) name: string;\n        }\n\n        function convert(n: any) { return n; }\n\n        @NgModule({declarations: [TestComponent]})\n        export class TestModule {}\n      ");
            var messages = [];
            expect(main_1.main(['-p', path.join(basePath, 'src/tsconfig.json')], function (message) { return messages.push(message); }))
                .toBe(0, "Compile failed:\n " + messages.join('\n    '));
        });
        it('should allow using 2 classes with the same name in declarations with noEmitOnError=true', function () {
            write('src/tsconfig.json', "{\n        \"extends\": \"../tsconfig-base.json\",\n        \"compilerOptions\": {\n          \"noEmitOnError\": true\n        },\n        \"files\": [\"test-module.ts\"]\n      }");
            function writeComp(fileName) {
                write(fileName, "\n        import {Component} from '@angular/core';\n\n        @Component({selector: 'comp', template: ''})\n        export class TestComponent {}\n      ");
            }
            writeComp('src/comp1.ts');
            writeComp('src/comp2.ts');
            write('src/test-module.ts', "\n        import {NgModule} from '@angular/core';\n        import {TestComponent as Comp1} from './comp1';\n        import {TestComponent as Comp2} from './comp2';\n\n        @NgModule({\n          declarations: [Comp1, Comp2],\n        })\n        export class MyModule {}\n      ");
            expect(main_1.main(['-p', path.join(basePath, 'src/tsconfig.json')])).toBe(0);
        });
        it('should not type check a .js files from node_modules with allowJs', function () {
            write('src/tsconfig.json', "{\n        \"extends\": \"../tsconfig-base.json\",\n        \"compilerOptions\": {\n          \"noEmitOnError\": true,\n          \"allowJs\": true,\n          \"declaration\": false\n        },\n        \"files\": [\"test-module.ts\"]\n      }");
            write('src/test-module.ts', "\n        import {Component, NgModule} from '@angular/core';\n        import 'my-library';\n\n        @Component({\n          template: 'hello'\n        })\n        export class HelloCmp {}\n\n        @NgModule({\n          declarations: [HelloCmp],\n        })\n        export class MyModule {}\n      ");
            write('src/node_modules/t.txt', "");
            write('src/node_modules/my-library/index.js', "\n        export someVar = 1;\n        export someOtherVar = undefined + 1;\n      ");
            expect(main_1.main(['-p', path.join(basePath, 'src/tsconfig.json')])).toBe(0);
        });
    });
    describe('formatted messages', function () {
        it('should emit a formatted error message for a structural error', function () {
            write('src/tsconfig.json', "{\n        \"extends\": \"../tsconfig-base.json\",\n        \"files\": [\"test-module.ts\"]\n      }");
            write('src/lib/indirect2.ts', "\n        declare var f: any;\n\n        export const t2 = f`<p>hello</p>`;\n      ");
            write('src/lib/indirect1.ts', "\n        import {t2} from './indirect2';\n        export const t1 = t2 + ' ';\n      ");
            write('src/lib/test.component.ts', "\n        import {Component} from '@angular/core';\n        import {t1} from './indirect1';\n\n        @Component({\n          template: t1,\n          styleUrls: ['./test.component.css']\n        })\n        export class TestComponent {}\n      ");
            write('src/test-module.ts', "\n        import {NgModule} from '@angular/core';\n        import {TestComponent} from './lib/test.component';\n\n        @NgModule({declarations: [TestComponent]})\n        export class TestModule {}\n      ");
            var messages = [];
            var exitCode = main_1.main(['-p', path.join(basePath, 'src/tsconfig.json')], function (message) { return messages.push(message); });
            expect(exitCode).toBe(1, 'Compile was expected to fail');
            expect(messages[0])
                .toEqual("lib/test.component.ts(6,21): Error during template compile of 'TestComponent'\n  Tagged template expressions are not supported in metadata in 't1'\n    't1' references 't2' at lib/indirect1.ts(3,27)\n      't2' contains the error at lib/indirect2.ts(4,27).\n");
        });
    });
    describe('ivy', function () {
        function emittedFile(name) {
            var outputName = path.resolve(outDir, name);
            expect(fs.existsSync(outputName)).toBe(true);
            return fs.readFileSync(outputName, { encoding: 'UTF-8' });
        }
        it('should emit the hello world example', function () {
            write('tsconfig.json', "{\n        \"extends\": \"./tsconfig-base.json\",\n        \"files\": [\"hello-world.ts\"],\n        \"angularCompilerOptions\": {\n          \"enableIvy\": true\n        }\n      }");
            write('hello-world.ts', "\n        import {Component, NgModule} from '@angular/core';\n\n        @Component({\n          selector: 'hello-world',\n          template: 'Hello, world!'\n        })\n        export class HelloWorldComponent {\n\n        }\n\n        @NgModule({\n          declarations: [HelloWorldComponent]\n        })\n        export class HelloWorldModule {}\n      ");
            var exitCode = main_1.main(['-p', path.join(basePath, 'tsconfig.json')]);
            expect(exitCode).toBe(0, 'Compile failed');
            expect(emittedFile('hello-world.js')).toContain('ngComponentDef');
            expect(emittedFile('hello-world.js')).toContain('HelloWorldComponent_Factory');
        });
        it('should emit an injection of a string token', function () {
            write('tsconfig.json', "{\n        \"extends\": \"./tsconfig-base.json\",\n        \"files\": [\"hello-world.ts\"],\n        \"angularCompilerOptions\": {\n          \"enableIvy\": true\n        }\n      }");
            write('hello-world.ts', "\n        import {Component, Inject, NgModule} from '@angular/core';\n\n        @Component({\n          selector: 'hello-world',\n          template: 'Hello, world!'\n        })\n        export class HelloWorldComponent {\n          constructor (@Inject('test') private test: string) {}\n        }\n\n        @NgModule({\n          declarations: [HelloWorldComponent],\n          providers: [\n            {provide: 'test', useValue: 'test'}\n          ]\n        })\n        export class HelloWorldModule {}\n      ");
            var errors = [];
            var exitCode = main_1.main(['-p', path.join(basePath, 'tsconfig.json')], function (msg) { return errors.push(msg); });
            expect(exitCode).toBe(0, "Compile failed:\n" + errors.join('\n  '));
            expect(emittedFile('hello-world.js')).toContain('ngComponentDef');
        });
        it('should emit an example that uses the E() instruction', function () {
            write('tsconfig.json', "{\n        \"extends\": \"./tsconfig-base.json\",\n        \"files\": [\"hello-world.ts\"],\n        \"angularCompilerOptions\": {\n          \"enableIvy\": true\n        }\n      }");
            write('hello-world.ts', "\n        import {Component, NgModule} from '@angular/core';\n\n        @Component({\n          selector: 'hello-world',\n          template: '<h1><div style=\"text-align:center\"> Hello, {{name}}! </div></h1> '\n        })\n        export class HelloWorldComponent {\n          name = 'World';\n        }\n\n        @NgModule({declarations: [HelloWorldComponent]})\n        export class HelloWorldModule {}\n      ");
            var errors = [];
            var exitCode = main_1.main(['-p', path.join(basePath, 'tsconfig.json')], function (msg) { return errors.push(msg); });
            expect(exitCode).toBe(0, "Compile failed:\n" + errors.join('\n  '));
            expect(emittedFile('hello-world.js')).toContain('ngComponentDef');
        });
    });
    describe('tree shakeable services', function () {
        function compileService(source) {
            write('service.ts', source);
            var exitCode = main_1.main(['-p', path.join(basePath, 'tsconfig.json')], errorSpy);
            expect(exitCode).toEqual(0);
            var servicePath = path.resolve(outDir, 'service.js');
            return fs.readFileSync(servicePath, 'utf8');
        }
        beforeEach(function () {
            writeConfig("{\n        \"extends\": \"./tsconfig-base.json\",\n        \"files\": [\"service.ts\"]\n      }");
            write('module.ts', "\n        import {NgModule} from '@angular/core';\n\n        @NgModule({})\n        export class Module {}\n      ");
        });
        describe("doesn't break existing injectables", function () {
            it('on simple services', function () {
                var source = compileService("\n        import {Injectable, NgModule} from '@angular/core';\n\n        @Injectable()\n        export class Service {\n          constructor(public param: string) {}\n        }\n\n        @NgModule({\n          providers: [{provide: Service, useValue: new Service('test')}],\n        })\n        export class ServiceModule {}\n        ");
                expect(source).not.toMatch(/ngInjectableDef/);
            });
            it('on a service with a base class service', function () {
                var source = compileService("\n        import {Injectable, NgModule} from '@angular/core';\n\n        @Injectable()\n        export class Dep {}\n\n        export class Base {\n          constructor(private dep: Dep) {}\n        }\n        @Injectable()\n        export class Service extends Base {}\n\n        @NgModule({\n          providers: [Service],\n        })\n        export class ServiceModule {}\n        ");
                expect(source).not.toMatch(/ngInjectableDef/);
            });
        });
        it('compiles a basic InjectableDef', function () {
            var source = compileService("\n        import {Injectable} from '@angular/core';\n        import {Module} from './module';\n\n        @Injectable({\n          providedIn: Module,\n        })\n        export class Service {}\n      ");
            expect(source).toMatch(/ngInjectableDef = .+\.defineInjectable\(/);
            expect(source).toMatch(/ngInjectableDef.*token: Service/);
            expect(source).toMatch(/ngInjectableDef.*providedIn: .+\.Module/);
        });
        it('ngInjectableDef in es5 mode is annotated @nocollapse when closure options are enabled', function () {
            writeConfig("{\n        \"extends\": \"./tsconfig-base.json\",\n        \"angularCompilerOptions\": {\n          \"annotateForClosureCompiler\": true\n        },\n        \"files\": [\"service.ts\"]\n      }");
            var source = compileService("\n        import {Injectable} from '@angular/core';\n        import {Module} from './module';\n\n        @Injectable({\n          providedIn: Module,\n        })\n        export class Service {}\n      ");
            expect(source).toMatch(/\/\*\* @nocollapse \*\/ Service\.ngInjectableDef =/);
        });
        it('compiles a useValue InjectableDef', function () {
            var source = compileService("\n        import {Injectable} from '@angular/core';\n        import {Module} from './module';\n\n        export const CONST_SERVICE: Service = null;\n\n        @Injectable({\n          providedIn: Module,\n          useValue: CONST_SERVICE\n        })\n        export class Service {}\n      ");
            expect(source).toMatch(/ngInjectableDef.*return CONST_SERVICE/);
        });
        it('compiles a useExisting InjectableDef', function () {
            var source = compileService("\n        import {Injectable} from '@angular/core';\n        import {Module} from './module';\n\n        @Injectable()\n        export class Existing {}\n\n        @Injectable({\n          providedIn: Module,\n          useExisting: Existing,\n        })\n        export class Service {}\n      ");
            expect(source).toMatch(/ngInjectableDef.*return ..\.inject\(Existing\)/);
        });
        it('compiles a useFactory InjectableDef with optional dep', function () {
            var source = compileService("\n        import {Injectable, Optional} from '@angular/core';\n        import {Module} from './module';\n\n        @Injectable()\n        export class Existing {}\n\n        @Injectable({\n          providedIn: Module,\n          useFactory: (existing: Existing|null) => new Service(existing),\n          deps: [[new Optional(), Existing]],\n        })\n        export class Service {\n          constructor(e: Existing|null) {}\n        }\n      ");
            expect(source).toMatch(/ngInjectableDef.*return ..\(..\.inject\(Existing, 8\)/);
        });
        it('compiles a useFactory InjectableDef with skip-self dep', function () {
            var source = compileService("\n        import {Injectable, SkipSelf} from '@angular/core';\n        import {Module} from './module';\n\n        @Injectable()\n        export class Existing {}\n\n        @Injectable({\n          providedIn: Module,\n          useFactory: (existing: Existing) => new Service(existing),\n          deps: [[new SkipSelf(), Existing]],\n        })\n        export class Service {\n          constructor(e: Existing) {}\n        }\n      ");
            expect(source).toMatch(/ngInjectableDef.*return ..\(..\.inject\(Existing, 4\)/);
        });
        it('compiles a service that depends on a token', function () {
            var source = compileService("\n        import {Inject, Injectable, InjectionToken} from '@angular/core';\n        import {Module} from './module';\n\n        export const TOKEN = new InjectionToken('desc', {providedIn: Module, factory: () => true});\n\n        @Injectable({\n          providedIn: Module,\n        })\n        export class Service {\n          constructor(@Inject(TOKEN) value: boolean) {}\n        }\n      ");
            expect(source).toMatch(/ngInjectableDef = .+\.defineInjectable\(/);
            expect(source).toMatch(/ngInjectableDef.*token: Service/);
            expect(source).toMatch(/ngInjectableDef.*providedIn: .+\.Module/);
        });
        it('generates exports.* references when outputting commonjs', function () {
            writeConfig("{\n        \"extends\": \"./tsconfig-base.json\",\n        \"compilerOptions\": {\n          \"module\": \"commonjs\"\n        },\n        \"files\": [\"service.ts\"]\n      }");
            var source = compileService("\n        import {Inject, Injectable, InjectionToken} from '@angular/core';\n        import {Module} from './module';\n\n        export const TOKEN = new InjectionToken<string>('test token', {\n          providedIn: 'root',\n          factory: () => 'this is a test',\n        });\n\n        @Injectable({providedIn: 'root'})\n        export class Service {\n          constructor(@Inject(TOKEN) token: any) {}\n        }\n      ");
            expect(source).toMatch(/new Service\(i0\.inject\(exports\.TOKEN\)\);/);
        });
    });
    describe('ngInjectorDef', function () {
        it('is applied with lowered metadata', function () {
            writeConfig("{\n        \"extends\": \"./tsconfig-base.json\",\n        \"files\": [\"module.ts\"],\n        \"angularCompilerOptions\": {\n          \"enableIvy\": true,\n          \"skipTemplateCodegen\": true\n        }\n      }");
            write('module.ts', "\n        import {Injectable, NgModule} from '@angular/core';\n\n        @Injectable()\n        export class ServiceA {}\n\n        @Injectable()\n        export class ServiceB {}\n\n        @NgModule()\n        export class Exported {}\n\n        @NgModule({\n          providers: [ServiceA]\n        })\n        export class Imported {\n          static forRoot() {\n           console.log('not statically analyzable');\n            return {\n              ngModule: Imported,\n              providers: [] as any,\n            };\n          }\n        }\n\n        @NgModule({\n          providers: [ServiceA, ServiceB],\n          imports: [Imported.forRoot()],\n          exports: [Exported],\n        })\n        export class Module {}\n      ");
            var exitCode = main_1.main(['-p', path.join(basePath, 'tsconfig.json')], errorSpy);
            expect(exitCode).toEqual(0);
            var modulePath = path.resolve(outDir, 'module.js');
            var moduleSource = fs.readFileSync(modulePath, 'utf8');
            expect(moduleSource)
                .toContain('var ɵ1 = [ServiceA, ServiceB], ɵ2 = [Imported.forRoot()], ɵ3 = [Exported];');
            expect(moduleSource)
                .toContain('Imported.ngInjectorDef = i0.defineInjector({ factory: function Imported_Factory() { return new Imported(); }, providers: ɵ0, imports: [] });');
            expect(moduleSource)
                .toContain('Module.ngInjectorDef = i0.defineInjector({ factory: function Module_Factory() { return new Module(); }, providers: ɵ1, imports: [ɵ2, ɵ3] });');
        });
        it('strips decorator in ivy mode', function () {
            writeConfig("{\n        \"extends\": \"./tsconfig-base.json\",\n        \"files\": [\"service.ts\"],\n        \"angularCompilerOptions\": {\n          \"enableIvy\": true\n        }\n      }");
            write('service.ts', "\n        import {Injectable, Self} from '@angular/core';  \n\n        @Injectable()\n        export class ServiceA {}\n\n        @Injectable()\n        @Self()\n        export class ServiceB {}\n      ");
            var exitCode = main_1.main(['-p', path.join(basePath, 'tsconfig.json')], errorSpy);
            expect(exitCode).toEqual(0);
            var modulePath = path.resolve(outDir, 'service.js');
            var moduleSource = fs.readFileSync(modulePath, 'utf8');
            expect(moduleSource).not.toMatch(/ServiceA\.decorators =/);
            expect(moduleSource).toMatch(/ServiceB\.decorators =/);
            expect(moduleSource).toMatch(/type: Self/);
            expect(moduleSource).not.toMatch(/type: Injectable/);
        });
        it('rewrites Injector to INJECTOR in Ivy factory functions ', function () {
            writeConfig("{\n        \"extends\": \"./tsconfig-base.json\",\n        \"files\": [\"service.ts\"],\n        \"angularCompilerOptions\": {\n          \"enableIvy\": true\n        }\n      }");
            write('service.ts', "\n        import {Injectable, Injector} from '@angular/core';\n\n        @Injectable()\n        export class Service {\n          constructor(private injector: Injector) {}\n        }\n      ");
            var exitCode = main_1.main(['-p', path.join(basePath, 'tsconfig.json')], errorSpy);
            expect(exitCode).toEqual(0);
            var modulePath = path.resolve(outDir, 'service.js');
            var moduleSource = fs.readFileSync(modulePath, 'utf8');
            expect(moduleSource).not.toMatch(/inject\(i0\.Injector/);
            expect(moduleSource).toMatch(/inject\(i0\.INJECTOR/);
        });
    });
    it('libraries should not break strictMetadataEmit', function () {
        // first only generate .d.ts / .js / .metadata.json files
        writeConfig("{\n        \"extends\": \"./tsconfig-base.json\",\n        \"angularCompilerOptions\": {\n          \"skipTemplateCodegen\": true,\n          \"strictMetadataEmit\": true,\n          \"fullTemplateTypeCheck\": true\n        },\n        \"compilerOptions\": {\n          \"outDir\": \"lib\"\n        },\n        \"files\": [\"main.ts\", \"test.d.ts\"]\n      }");
        write('main.ts', "\n        import {Test} from './test';\n        export const bar = Test.bar;\n    ");
        write('test.d.ts', "\n        declare export class Test {\n          static bar: string;\n        }\n    ");
        var exitCode = main_1.main(['-p', path.join(basePath, 'tsconfig.json')], errorSpy);
        expect(exitCode).toEqual(0);
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmdjX3NwZWMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9jb21waWxlci1jbGkvdGVzdC9uZ2Nfc3BlYy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7OztHQU1HOztBQUVILHVCQUF5QjtBQUN6QiwyQkFBNkI7QUFDN0IsK0JBQWlDO0FBRWpDLG9DQUE2RTtBQUU3RSwrQ0FBNkQ7QUFFN0Q7SUFDRSxJQUFNLGNBQWMsR0FBRyxNQUFNLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxLQUFLLEVBQUUsR0FBRyxDQUFDLENBQUM7SUFDM0QsSUFBTSxTQUFTLEdBQUcsY0FBYyxDQUFDLE9BQU8sQ0FBQyxXQUFXLENBQUMsQ0FBQztJQUN0RCxPQUFPLGNBQWMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLFNBQVMsQ0FBQyxDQUFDO0FBQzdDLENBQUM7QUFFRCxRQUFRLENBQUMsOEJBQThCLEVBQUU7SUFDdkMsSUFBSSxRQUFnQixDQUFDO0lBQ3JCLElBQUksTUFBYyxDQUFDO0lBQ25CLElBQUksS0FBa0QsQ0FBQztJQUN2RCxJQUFJLFFBQTJDLENBQUM7SUFFaEQscUJBQXFCLFFBQWdCO1FBQ25DLElBQUksQ0FBQyxFQUFFLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxFQUFFLFFBQVEsQ0FBQyxDQUFDLEVBQUU7WUFDbEQsTUFBTSxJQUFJLEtBQUssQ0FBQyxjQUFZLFFBQVEsZ0NBQTJCLE1BQU0sTUFBRyxDQUFDLENBQUM7U0FDM0U7SUFDSCxDQUFDO0lBRUQsd0JBQXdCLFFBQWdCO1FBQ3RDLElBQUksRUFBRSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sRUFBRSxRQUFRLENBQUMsQ0FBQyxFQUFFO1lBQ2pELE1BQU0sSUFBSSxLQUFLLENBQUMsb0JBQWtCLFFBQVEsZ0NBQTJCLE1BQU0sTUFBRyxDQUFDLENBQUM7U0FDakY7SUFDSCxD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