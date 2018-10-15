"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
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
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var ng_module_resolver_1 = require("@angular/compiler/src/ng_module_resolver");
var core_1 = require("@angular/core");
var metadata_1 = require("@angular/core/src/metadata");
var compiler_reflector_1 = require("@angular/platform-browser-dynamic/src/compiler_reflector");
var SomeClass1 = /** @class */ (function () {
    function SomeClass1() {
    }
    return SomeClass1;
}());
var SomeClass2 = /** @class */ (function () {
    function SomeClass2() {
    }
    return SomeClass2;
}());
var SomeClass3 = /** @class */ (function () {
    function SomeClass3() {
    }
    return SomeClass3;
}());
var SomeClass4 = /** @class */ (function () {
    function SomeClass4() {
    }
    return SomeClass4;
}());
var SomeClass5 = /** @class */ (function () {
    function SomeClass5() {
    }
    return SomeClass5;
}());
var SomeModule = /** @class */ (function () {
    function SomeModule() {
    }
    SomeModule = __decorate([
        metadata_1.NgModule({
            declarations: [SomeClass1],
            imports: [SomeClass2],
            exports: [SomeClass3],
            providers: [SomeClass4],
            entryComponents: [SomeClass5]
        })
    ], SomeModule);
    return SomeModule;
}());
var SimpleClass = /** @class */ (function () {
    function SimpleClass() {
    }
    return SimpleClass;
}());
{
    describe('NgModuleResolver', function () {
        var resolver;
        beforeEach(function () { resolver = new ng_module_resolver_1.NgModuleResolver(new compiler_reflector_1.JitReflector()); });
        it('should read out the metadata from the class', function () {
            var moduleMetadata = resolver.resolve(SomeModule);
            expect(moduleMetadata).toEqual(new metadata_1.NgModule({
                declarations: [SomeClass1],
                imports: [SomeClass2],
                exports: [SomeClass3],
                providers: [SomeClass4],
                entryComponents: [SomeClass5]
            }));
        });
        it('should throw when simple class has no NgModule decorator', function () {
            expect(function () { return resolver.resolve(SimpleClass); })
                .toThrowError("No NgModule metadata found for '" + core_1.ɵstringify(SimpleClass) + "'.");
        });
        it('should support inheriting the metadata', function () {
            var Parent = /** @class */ (function () {
                function Parent() {
                }
                Parent = __decorate([
                    metadata_1.NgModule({ id: 'p' })
                ], Parent);
                return Parent;
            }());
            var ChildNoDecorator = /** @class */ (function (_super) {
                __extends(ChildNoDecorator, _super);
                function ChildNoDecorator() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                return ChildNoDecorator;
            }(Parent));
            var ChildWithDecorator = /** @class */ (function (_super) {
                __extends(ChildWithDecorator, _super);
                function ChildWithDecorator() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                ChildWithDecorator = __decorate([
                    metadata_1.NgModule({ id: 'c' })
                ], ChildWithDecorator);
                return ChildWithDecorator;
            }(Parent));
            expect(resolver.resolve(ChildNoDecorator)).toEqual(new metadata_1.NgModule({ id: 'p' }));
            expect(resolver.resolve(ChildWithDecorator)).toEqual(new metadata_1.NgModule({ id: 'c' }));
        });
    });
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmdfbW9kdWxlX3Jlc29sdmVyX3NwZWMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9jb21waWxlci90ZXN0L25nX21vZHVsZV9yZXNvbHZlcl9zcGVjLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUVILCtFQUEwRTtBQUMxRSxzQ0FBc0Q7QUFDdEQsdURBQW9EO0FBQ3BELCtGQUFzRjtBQUV0RjtJQUFBO0lBQWtCLENBQUM7SUFBRCxpQkFBQztBQUFELENBQUMsQUFBbkIsSUFBbUI7QUFDbkI7SUFBQTtJQUFrQixDQUFDO0lBQUQsaUJBQUM7QUFBRCxDQUFDLEFBQW5CLElBQW1CO0FBQ25CO0lBQUE7SUFBa0IsQ0FBQztJQUFELGlCQUFDO0FBQUQsQ0FBQyxBQUFuQixJQUFtQjtBQUNuQjtJQUFBO0lBQWtCLENBQUM7SUFBRCxpQkFBQztBQUFELENBQUMsQUFBbkIsSUFBbUI7QUFDbkI7SUFBQTtJQUFrQixDQUFDO0lBQUQsaUJBQUM7QUFBRCxDQUFDLEFBQW5CLElBQW1CO0FBU25CO0lBQUE7SUFDQSxDQUFDO0lBREssVUFBVTtRQVBmLG1CQUFRLENBQUM7WUFDUixZQUFZLEVBQUUsQ0FBQyxVQUFVLENBQUM7WUFDMUIsT0FBTyxFQUFFLENBQUMsVUFBVSxDQUFDO1lBQ3JCLE9BQU8sRUFBRSxDQUFDLFVBQVUsQ0FBQztZQUNyQixTQUFTLEVBQUUsQ0FBQyxVQUFVLENBQUM7WUFDdkIsZUFBZSxFQUFFLENBQUMsVUFBVSxDQUFDO1NBQzlCLENBQUM7T0FDSSxVQUFVLENBQ2Y7SUFBRCxpQkFBQztDQUFBLEFBREQsSUFDQztBQUVEO0lBQUE7SUFBbUIsQ0FBQztJQUFELGtCQUFDO0FBQUQsQ0FBQyxBQUFwQixJQUFvQjtBQUVwQjtJQUNFLFFBQVEsQ0FBQyxrQkFBa0IsRUFBRTtRQUMzQixJQUFJLFFBQTBCLENBQUM7UUFFL0IsVUFBVSxDQUFDLGNBQVEsUUFBUSxHQUFHLElBQUkscUNBQWdCLENBQUMsSUFBSSxpQ0FBWSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBRTNFLEVBQUUsQ0FBQyw2Q0FBNkMsRUFBRTtZQUNoRCxJQUFNLGNBQWMsR0FBRyxRQUFRLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxDQUFDO1lBQ3BELE1BQU0sQ0FBQyxjQUFjLENBQUMsQ0FBQyxPQUFPLENBQUMsSUFBSSxtQkFBUSxDQUFDO2dCQUMxQyxZQUFZLEVBQUUsQ0FBQyxVQUFVLENBQUM7Z0JBQzFCLE9BQU8sRUFBRSxDQUFDLFVBQVUsQ0FBQztnQkFDckIsT0FBTyxFQUFFLENBQUMsVUFBVSxDQUFDO2dCQUNyQixTQUFTLEVBQUUsQ0FBQyxVQUFVLENBQUM7Z0JBQ3ZCLGVBQWUsRUFBRSxDQUFDLFVBQVUsQ0FBQzthQUM5QixDQUFDLENBQUMsQ0FBQztRQUNOLENBQUMsQ0FBQyxDQUFDO1FBRUgsRUFBRSxDQUFDLDBEQUEwRCxFQUFFO1lBQzdELE1BQU0sQ0FBQyxjQUFNLE9BQUEsUUFBUSxDQUFDLE9BQU8sQ0FBQyxXQUFXLENBQUMsRUFBN0IsQ0FBNkIsQ0FBQztpQkFDdEMsWUFBWSxDQUFDLHFDQUFtQyxpQkFBUyxDQUFDLFdBQVcsQ0FBQyxPQUFJLENBQUMsQ0FBQztRQUNuRixDQUFDLENBQUMsQ0FBQztRQUVILEVBQUUsQ0FBQyx3Q0FBd0MsRUFBRTtZQUUzQztnQkFBQTtnQkFDQSxDQUFDO2dCQURLLE1BQU07b0JBRFgsbUJBQVEsQ0FBQyxFQUFDLEVBQUUsRUFBRSxHQUFHLEVBQUMsQ0FBQzttQkFDZCxNQUFNLENBQ1g7Z0JBQUQsYUFBQzthQUFBLEFBREQsSUFDQztZQUVEO2dCQUErQixvQ0FBTTtnQkFBckM7O2dCQUF1QyxDQUFDO2dCQUFELHVCQUFDO1lBQUQsQ0FBQyxBQUF4QyxDQUErQixNQUFNLEdBQUc7WUFHeEM7Z0JBQWlDLHNDQUFNO2dCQUF2Qzs7Z0JBQ0EsQ0FBQztnQkFESyxrQkFBa0I7b0JBRHZCLG1CQUFRLENBQUMsRUFBQyxFQUFFLEVBQUUsR0FBRyxFQUFDLENBQUM7bUJBQ2Qsa0JBQWtCLENBQ3ZCO2dCQUFELHlCQUFDO2FBQUEsQUFERCxDQUFpQyxNQUFNLEdBQ3RDO1lBRUQsTUFBTSxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxJQUFJLG1CQUFRLENBQUMsRUFBQyxFQUFFLEVBQUUsR0FBRyxFQUFDLENBQUMsQ0FBQyxDQUFDO1lBRTVFLE1BQU0sQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLGtCQUFrQixDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsSUFBSSxtQkFBUSxDQUFDLEVBQUMsRUFBRSxFQUFFLEdBQUcsRUFBQyxDQUFDLENBQUMsQ0FBQztRQUNoRixDQUFDLENBQUMsQ0FBQztJQUVMLENBQUMsQ0FBQyxDQUFDO0NBQ0oifQ==