"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
var ts = require("typescript");
var language_service_1 = require("../src/language_service");
var typescript_host_1 = require("../src/typescript_host");
var test_data_1 = require("./test_data");
var test_utils_1 = require("./test_utils");
describe('hover', function () {
    var documentRegistry = ts.createDocumentRegistry();
    var mockHost = new test_utils_1.MockTypescriptHost(['/app/main.ts', '/app/parsing-cases.ts'], test_data_1.toh);
    var service = ts.createLanguageService(mockHost, documentRegistry);
    var ngHost = new typescript_host_1.TypeScriptServiceHost(mockHost, service);
    var ngService = language_service_1.createLanguageService(ngHost);
    ngHost.setSite(ngService);
    it('should be able to find field in an interpolation', function () {
        hover(" @Component({template: '{{\u00ABname\u00BB}}'}) export class MyComponent { name: string; }", 'property name of MyComponent');
    });
    it('should be able to find a field in a attribute reference', function () {
        hover(" @Component({template: '<input [(ngModel)]=\"\u00ABname\u00BB\">'}) export class MyComponent { name: string; }", 'property name of MyComponent');
    });
    it('should be able to find a method from a call', function () {
        hover(" @Component({template: '<div (click)=\"\u00AB\u2206myClick\u2206()\u00BB;\"></div>'}) export class MyComponent { myClick() { }}", 'method myClick of MyComponent');
    });
    it('should be able to find a field reference in an *ngIf', function () {
        hover(" @Component({template: '<div *ngIf=\"\u00ABinclude\u00BB\"></div>'}) export class MyComponent { include = true;}", 'property include of MyComponent');
    });
    it('should be able to find a reference to a component', function () {
        hover(" @Component({template: '\u00AB<\u2206test\u2206-comp></test-comp>\u00BB'}) export class MyComponent { }", 'component TestComponent');
    });
    it('should be able to find an event provider', function () {
        hover(" @Component({template: '<test-comp \u00AB(\u2206test\u2206)=\"myHandler()\"\u00BB></div>'}) export class MyComponent { myHandler() {} }", 'event testEvent of TestComponent');
    });
    it('should be able to find an input provider', function () {
        hover(" @Component({template: '<test-comp \u00AB[\u2206tcName\u2206]=\"name\"\u00BB></div>'}) export class MyComponent { name = 'my name'; }", 'property name of TestComponent');
    });
    it('should be able to ignore a reference declaration', function () {
        addCode(" @Component({template: '<div #\u00ABchart\u00BB></div>'}) export class MyComponent {  }", function (fileName) {
            var markers = mockHost.getReferenceMarkers(fileName);
            var hover = ngService.getHoverAt(fileName, markers.references.chart[0].start);
            expect(hover).toBeUndefined();
        });
    });
    function hover(code, hoverText) {
        addCode(code, function (fileName) {
            var tests = 0;
            var markers = mockHost.getReferenceMarkers(fileName);
            var keys = Object.keys(markers.references).concat(Object.keys(markers.definitions));
            for (var _i = 0, keys_1 = keys; _i < keys_1.length; _i++) {
                var referenceName = keys_1[_i];
                var references = (markers.references[referenceName] ||
                    []).concat(markers.definitions[referenceName] || []);
                for (var _a = 0, references_1 = references; _a < references_1.length; _a++) {
                    var reference = references_1[_a];
                    tests++;
                    var hover_1 = ngService.getHoverAt(fileName, reference.start);
                    if (!hover_1)
                        throw new Error("Expected a hover at location " + reference.start);
                    expect(hover_1.span).toEqual(reference);
                    expect(toText(hover_1)).toEqual(hoverText);
                }
            }
            expect(tests).toBeGreaterThan(0); // If this fails the test is wrong.
        });
    }
    function addCode(code, cb) {
        var fileName = '/app/app.component.ts';
        var originalContent = mockHost.getFileContent(fileName);
        var newContent = originalContent + code;
        mockHost.override(fileName, originalContent + code);
        try {
            cb(fileName, newContent);
        }
        finally {
            mockHost.override(fileName, undefined);
        }
    }
    function toText(hover) { return hover.text.map(function (h) { return h.text; }).join(''); }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaG92ZXJfc3BlYy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2xhbmd1YWdlLXNlcnZpY2UvdGVzdC9ob3Zlcl9zcGVjLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7O0FBRUgsNEJBQTBCO0FBRTFCLCtCQUFpQztBQUVqQyw0REFBOEQ7QUFFOUQsMERBQTZEO0FBRTdELHlDQUFnQztBQUNoQywyQ0FBZ0Q7QUFFaEQsUUFBUSxDQUFDLE9BQU8sRUFBRTtJQUNoQixJQUFJLGdCQUFnQixHQUFHLEVBQUUsQ0FBQyxzQkFBc0IsRUFBRSxDQUFDO0lBQ25ELElBQUksUUFBUSxHQUFHLElBQUksK0JBQWtCLENBQUMsQ0FBQyxjQUFjLEVBQUUsdUJBQXVCLENBQUMsRUFBRSxlQUFHLENBQUMsQ0FBQztJQUN0RixJQUFJLE9BQU8sR0FBRyxFQUFFLENBQUMscUJBQXFCLENBQUMsUUFBUSxFQUFFLGdCQUFnQixDQUFDLENBQUM7SUFDbkUsSUFBSSxNQUFNLEdBQUcsSUFBSSx1Q0FBcUIsQ0FBQyxRQUFRLEVBQUUsT0FBTyxDQUFDLENBQUM7SUFDMUQsSUFBSSxTQUFTLEdBQUcsd0NBQXFCLENBQUMsTUFBTSxDQUFDLENBQUM7SUFDOUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsQ0FBQztJQUcxQixFQUFFLENBQUMsa0RBQWtELEVBQUU7UUFDckQsS0FBSyxDQUNELDRGQUFrRixFQUNsRiw4QkFBOEIsQ0FBQyxDQUFDO0lBQ3RDLENBQUMsQ0FBQyxDQUFDO0lBRUgsRUFBRSxDQUFDLHlEQUF5RCxFQUFFO1FBQzVELEtBQUssQ0FDRCxnSEFBb0csRUFDcEcsOEJBQThCLENBQUMsQ0FBQztJQUN0QyxDQUFDLENBQUMsQ0FBQztJQUVILEVBQUUsQ0FBQyw2Q0FBNkMsRUFBRTtRQUNoRCxLQUFLLENBQ0QsaUlBQTJHLEVBQzNHLCtCQUErQixDQUFDLENBQUM7SUFDdkMsQ0FBQyxD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