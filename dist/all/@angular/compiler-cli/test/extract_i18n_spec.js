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
var extract_i18n_1 = require("../src/extract_i18n");
var test_support_1 = require("./test_support");
function getNgRootDir() {
    var moduleFilename = module.filename.replace(/\\/g, '/');
    var distIndex = moduleFilename.indexOf('/dist/all');
    return moduleFilename.substr(0, distIndex);
}
var EXPECTED_XMB = "<?xml version=\"1.0\" encoding=\"UTF-8\" ?>\n<!DOCTYPE messagebundle [\n<!ELEMENT messagebundle (msg)*>\n<!ATTLIST messagebundle class CDATA #IMPLIED>\n\n<!ELEMENT msg (#PCDATA|ph|source)*>\n<!ATTLIST msg id CDATA #IMPLIED>\n<!ATTLIST msg seq CDATA #IMPLIED>\n<!ATTLIST msg name CDATA #IMPLIED>\n<!ATTLIST msg desc CDATA #IMPLIED>\n<!ATTLIST msg meaning CDATA #IMPLIED>\n<!ATTLIST msg obsolete (obsolete) #IMPLIED>\n<!ATTLIST msg xml:space (default|preserve) \"default\">\n<!ATTLIST msg is_hidden CDATA #IMPLIED>\n\n<!ELEMENT source (#PCDATA)>\n\n<!ELEMENT ph (#PCDATA|ex)*>\n<!ATTLIST ph name CDATA #REQUIRED>\n\n<!ELEMENT ex (#PCDATA)>\n]>\n<messagebundle>\n  <msg id=\"8136548302122759730\" desc=\"desc\" meaning=\"meaning\"><source>src/basic.html:1</source><source>src/comp2.ts:1</source><source>src/basic.html:1</source>translate me</msg>\n  <msg id=\"9038505069473852515\"><source>src/basic.html:3,4</source><source>src/comp2.ts:3,4</source><source>src/comp2.ts:2,3</source><source>src/basic.html:3,4</source>\n    Welcome</msg>\n</messagebundle>\n";
var EXPECTED_XLIFF = "<?xml version=\"1.0\" encoding=\"UTF-8\" ?>\n<xliff version=\"1.2\" xmlns=\"urn:oasis:names:tc:xliff:document:1.2\">\n  <file source-language=\"fr\" datatype=\"plaintext\" original=\"ng2.template\">\n    <body>\n      <trans-unit id=\"76e1eccb1b772fa9f294ef9c146ea6d0efa8a2d4\" datatype=\"html\">\n        <source>translate me</source>\n        <context-group purpose=\"location\">\n          <context context-type=\"sourcefile\">src/basic.html</context>\n          <context context-type=\"linenumber\">1</context>\n        </context-group>\n        <context-group purpose=\"location\">\n          <context context-type=\"sourcefile\">src/comp2.ts</context>\n          <context context-type=\"linenumber\">1</context>\n        </context-group>\n        <context-group purpose=\"location\">\n          <context context-type=\"sourcefile\">src/basic.html</context>\n          <context context-type=\"linenumber\">1</context>\n        </context-group>\n        <note priority=\"1\" from=\"description\">desc</note>\n        <note priority=\"1\" from=\"meaning\">meaning</note>\n      </trans-unit>\n      <trans-unit id=\"085a5ecc40cc87451d216725b2befd50866de18a\" datatype=\"html\">\n        <source>\n    Welcome</source>\n        <context-group purpose=\"location\">\n          <context context-type=\"sourcefile\">src/basic.html</context>\n          <context context-type=\"linenumber\">3</context>\n        </context-group>\n        <context-group purpose=\"location\">\n          <context context-type=\"sourcefile\">src/comp2.ts</context>\n          <context context-type=\"linenumber\">3</context>\n        </context-group>\n        <context-group purpose=\"location\">\n          <context context-type=\"sourcefile\">src/comp2.ts</context>\n          <context context-type=\"linenumber\">2</context>\n        </context-group>\n        <context-group purpose=\"location\">\n          <context context-type=\"sourcefile\">src/basic.html</context>\n          <context context-type=\"linenumber\">3</context>\n        </context-group>\n      </trans-unit>\n    </body>\n  </file>\n</xliff>\n";
var EXPECTED_XLIFF2 = "<?xml version=\"1.0\" encoding=\"UTF-8\" ?>\n<xliff version=\"2.0\" xmlns=\"urn:oasis:names:tc:xliff:document:2.0\" srcLang=\"en\">\n  <file original=\"ng.template\" id=\"ngi18n\">\n    <unit id=\"8136548302122759730\">\n      <notes>\n        <note category=\"description\">desc</note>\n        <note category=\"meaning\">meaning</note>\n        <note category=\"location\">src/basic.html:1</note>\n        <note category=\"location\">src/comp2.ts:1</note>\n        <note category=\"location\">src/basic.html:1</note>\n      </notes>\n      <segment>\n        <source>translate me</source>\n      </segment>\n    </unit>\n    <unit id=\"9038505069473852515\">\n      <notes>\n        <note category=\"location\">src/basic.html:3,4</note>\n        <note category=\"location\">src/comp2.ts:3,4</note>\n        <note category=\"location\">src/comp2.ts:2,3</note>\n        <note category=\"location\">src/basic.html:3,4</note>\n      </notes>\n      <segment>\n        <source>\n    Welcome</source>\n      </segment>\n    </unit>\n  </file>\n</xliff>\n";
describe('extract_i18n command line', function () {
    var basePath;
    var outDir;
    var write;
    var errorSpy;
    function writeConfig(tsconfig) {
        if (tsconfig === void 0) { tsconfig = '{"extends": "./tsconfig-base.json"}'; }
        write('tsconfig.json', tsconfig);
    }
    beforeEach(function () {
        errorSpy = jasmine.createSpy('consoleError').and.callFake(console.error);
        if (test_support_1.isInBazel()) {
            var support_1 = test_support_1.setup();
            write = function (fileName, content) { support_1.write(fileName, content); };
            basePath = support_1.basePath;
            outDir = path.join(basePath, 'built');
        }
        else {
            basePath = test_support_1.makeTempDir();
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
    function writeSources() {
        var welcomeMessage = "\n    <!--i18n-->\n    Welcome<!--/i18n-->\n    ";
        write('src/basic.html', "<div title=\"translate me\" i18n-title=\"meaning|desc\"></div>\n         <p id=\"welcomeMessage\">" + welcomeMessage + "</p>");
        write('src/comp1.ts', "\n    import {Component} from '@angular/core';\n\n    @Component({\n      selector: 'basic',\n      templateUrl: './basic.html',\n    })\n    export class BasicCmp1 {}");
        write('src/comp2.ts', "\n    import {Component} from '@angular/core';\n\n    @Component({\n      selector: 'basic2',\n      template: `<div title=\"translate me\" i18n-title=\"meaning|desc\"></div>\n      <p id=\"welcomeMessage\">" + welcomeMessage + "</p>`,\n    })\n    export class BasicCmp2 {}\n    @Component({\n      selector: 'basic4',\n      template: `<p id=\"welcomeMessage\">" + welcomeMessage + "</p>`,\n    })\n    export class BasicCmp4 {}");
        write('src/comp3.ts', "\n    import {Component} from '@angular/core';\n\n    @Component({\n      selector: 'basic3',\n      templateUrl: './basic.html',\n    })\n    export class BasicCmp3 {}");
        write('src/module.ts', "\n    import {NgModule} from '@angular/core';\n    import {BasicCmp1} from './comp1';\n    import {BasicCmp2, BasicCmp4} from './comp2';\n    import {BasicCmp3} from './comp3';\n\n    @NgModule({\n      declarations: [BasicCmp1, BasicCmp2, BasicCmp3, BasicCmp4]\n    })\n    export class I18nModule {}\n    ");
    }
    it('should extract xmb', function () {
        writeConfig();
        writeSources();
        var exitCode = extract_i18n_1.mainXi18n(['-p', basePath, '--i18nFormat=xmb', '--outFile=custom_file.xmb'], errorSpy);
        expect(errorSpy).not.toHaveBeenCalled();
        expect(exitCode).toBe(0);
        var xmbOutput = path.join(outDir, 'custom_file.xmb');
        expect(fs.existsSync(xmbOutput)).toBeTruthy();
        var xmb = fs.readFileSync(xmbOutput, { encoding: 'utf-8' });
        expect(xmb).toEqual(EXPECTED_XMB);
    });
    it('should extract xlf', function () {
        writeConfig();
        writeSources();
        var exitCode = extract_i18n_1.mainXi18n(['-p', basePath, '--i18nFormat=xlf', '--locale=fr'], errorSpy);
        expect(errorSpy).not.toHaveBeenCalled();
        expect(exitCode).toBe(0);
        var xlfOutput = path.join(outDir, 'messages.xlf');
        expect(fs.existsSync(xlfOutput)).toBeTruthy();
        var xlf = fs.readFileSync(xlfOutput, { encoding: 'utf-8' });
        expect(xlf).toEqual(EXPECTED_XLIFF);
    });
    it('should extract xlf2', function () {
        writeConfig();
        writeSources();
        var exitCode = extract_i18n_1.mainXi18n(['-p', basePath, '--i18nFormat=xlf2', '--outFile=messages.xliff2.xlf'], errorSpy);
        expect(errorSpy).not.toHaveBeenCalled();
        expect(exitCode).toBe(0);
        var xlfOutput = path.join(outDir, 'messages.xliff2.xlf');
        expect(fs.existsSync(xlfOutput)).toBeTruthy();
        var xlf = fs.readFileSync(xlfOutput, { encoding: 'utf-8' });
        expect(xlf).toEqual(EXPECTED_XLIFF2);
    });
    it('should not emit js', function () {
        writeConfig();
        writeSources();
        var exitCode = extract_i18n_1.mainXi18n(['-p', basePath, '--i18nFormat=xlf2', '--outFile=messages.xliff2.xlf'], errorSpy);
        expect(errorSpy).not.toHaveBeenCalled();
        expect(exitCode).toBe(0);
        var moduleOutput = path.join(outDir, 'src', 'module.js');
        expect(fs.existsSync(moduleOutput)).toBeFalsy();
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXh0cmFjdF9pMThuX3NwZWMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9jb21waWxlci1jbGkvdGVzdC9leHRyYWN0X2kxOG5fc3BlYy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7OztHQU1HOztBQUVILHVCQUF5QjtBQUN6QiwyQkFBNkI7QUFHN0Isb0RBQThDO0FBRTlDLCtDQUE2RDtBQUU3RDtJQUNFLElBQU0sY0FBYyxHQUFHLE1BQU0sQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLEtBQUssRUFBRSxHQUFHLENBQUMsQ0FBQztJQUMzRCxJQUFNLFNBQVMsR0FBRyxjQUFjLENBQUMsT0FBTyxDQUFDLFdBQVcsQ0FBQyxDQUFDO0lBQ3RELE9BQU8sY0FBYyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsU0FBUyxDQUFDLENBQUM7QUFDN0MsQ0FBQztBQUVELElBQU0sWUFBWSxHQUFHLGdpQ0EyQnBCLENBQUM7QUFFRixJQUFNLGNBQWMsR0FBRywraUVBNEN0QixDQUFDO0FBRUYsSUFBTSxlQUFlLEdBQUcsNGhDQTZCdkIsQ0FBQztBQUVGLFFBQVEsQ0FBQywyQkFBMkIsRUFBRTtJQUNwQyxJQUFJLFFBQWdCLENBQUM7SUFDckIsSUFBSSxNQUFjLENBQUM7SUFDbkIsSUFBSSxLQUFrRCxDQUFDO0lBQ3ZELElBQUksUUFBMkMsQ0FBQztJQUVoRCxxQkFBcUIsUUFBd0Q7UUFBeEQseUJBQUEsRUFBQSxnREFBd0Q7UUFDM0UsS0FBSyxDQUFDLGVBQWUsRUFBRSxRQUFRLENBQUMsQ0FBQztJQUNuQyxDQUFDO0lBRUQsVUFBVSxDQUFDO1FBQ1QsUUFBUSxHQUFHLE9BQU8sQ0FBQyxTQUFTLENBQUMsY0FBYyxDQUFDLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDekUsSUFBSSx3QkFBUyxFQUFFLEVBQUU7WUFDZixJQUFNLFNBQU8sR0FBRyxv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