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
var pipe_resolver_1 = require("@angular/compiler/src/pipe_resolver");
var core_1 = require("@angular/core");
var metadata_1 = require("@angular/core/src/metadata");
var compiler_reflector_1 = require("@angular/platform-browser-dynamic/src/compiler_reflector");
var SomePipe = /** @class */ (function () {
    function SomePipe() {
    }
    SomePipe = __decorate([
        metadata_1.Pipe({ name: 'somePipe', pure: true })
    ], SomePipe);
    return SomePipe;
}());
var SimpleClass = /** @class */ (function () {
    function SimpleClass() {
    }
    return SimpleClass;
}());
{
    describe('PipeResolver', function () {
        var resolver;
        beforeEach(function () { resolver = new pipe_resolver_1.PipeResolver(new compiler_reflector_1.JitReflector()); });
        it('should read out the metadata from the class', function () {
            var moduleMetadata = resolver.resolve(SomePipe);
            expect(moduleMetadata).toEqual(new metadata_1.Pipe({ name: 'somePipe', pure: true }));
        });
        it('should throw when simple class has no pipe decorator', function () {
            expect(function () { return resolver.resolve(SimpleClass); })
                .toThrowError("No Pipe decorator found on " + core_1.ɵstringify(SimpleClass));
        });
        it('should support inheriting the metadata', function () {
            var Parent = /** @class */ (function () {
                function Parent() {
                }
                Parent = __decorate([
                    metadata_1.Pipe({ name: 'p' })
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
                    metadata_1.Pipe({ name: 'c' })
                ], ChildWithDecorator);
                return ChildWithDecorator;
            }(Parent));
            expect(resolver.resolve(ChildNoDecorator)).toEqual(new metadata_1.Pipe({ name: 'p' }));
            expect(resolver.resolve(ChildWithDecorator)).toEqual(new metadata_1.Pipe({ name: 'c' }));
        });
    });
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGlwZV9yZXNvbHZlcl9zcGVjLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvY29tcGlsZXIvdGVzdC9waXBlX3Jlc29sdmVyX3NwZWMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRzs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBRUgscUVBQWlFO0FBQ2pFLHNDQUFzRDtBQUN0RCx1REFBZ0Q7QUFDaEQsK0ZBQXNGO0FBR3RGO0lBQUE7SUFDQSxDQUFDO0lBREssUUFBUTtRQURiLGVBQUksQ0FBQyxFQUFDLElBQUksRUFBRSxVQUFVLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBQyxDQUFDO09BQy9CLFFBQVEsQ0FDYjtJQUFELGVBQUM7Q0FBQSxBQURELElBQ0M7QUFFRDtJQUFBO0lBQW1CLENBQUM7SUFBRCxrQkFBQztBQUFELENBQUMsQUFBcEIsSUFBb0I7QUFFcEI7SUFDRSxRQUFRLENBQUMsY0FBYyxFQUFFO1FBQ3ZCLElBQUksUUFBc0IsQ0FBQztRQUUzQixVQUFVLENBQUMsY0FBUSxRQUFRLEdBQUcsSUFBSSw0QkFBWSxDQUFDLElBQUksaUNBQVksRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUV2RSxFQUFFLENBQUMsNkNBQTZDLEVBQUU7WUFDaEQsSUFBTSxjQUFjLEdBQUcsUUFBUSxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQztZQUNsRCxNQUFNLENBQUMsY0FBYyxDQUFDLENBQUMsT0FBTyxDQUFDLElBQUksZUFBSSxDQUFDLEVBQUMsSUFBSSxFQUFFLFVBQVUsRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFDLENBQUMsQ0FBQyxDQUFDO1FBQzNFLENBQUMsQ0FBQyxDQUFDO1FBRUgsRUFBRSxDQUFDLHNEQUFzRCxFQUFFO1lBQ3pELE1BQU0sQ0FBQyxjQUFNLE9BQUEsUUFBUSxDQUFDLE9BQU8sQ0FBQyxXQUFXLENBQUMsRUFBN0IsQ0FBNkIsQ0FBQztpQkFDdEMsWUFBWSxDQUFDLGdDQUE4QixpQkFBUyxDQUFDLFdBQVcsQ0FBRyxDQUFDLENBQUM7UUFDNUUsQ0FBQyxDQUFDLENBQUM7UUFFSCxFQUFFLENBQUMsd0NBQXdDLEVBQUU7WUFFM0M7Z0JBQUE7Z0JBQ0EsQ0FBQztnQkFESyxNQUFNO29CQURYLGVBQUksQ0FBQyxFQUFDLElBQUksRUFBRSxHQUFHLEVBQUMsQ0FBQzttQkFDWixNQUFNLENBQ1g7Z0JBQUQsYUFBQzthQUFBLEFBREQsSUFDQztZQUVEO2dCQUErQixvQ0FBTTtnQkFBckM7O2dCQUF1QyxDQUFDO2dCQUFELHVCQUFDO1lBQUQsQ0FBQyxBQUF4QyxDQUErQixNQUFNLEdBQUc7WUFHeEM7Z0JBQWlDLHNDQUFNO2dCQUF2Qzs7Z0JBQ0EsQ0FBQztnQkFESyxrQkFBa0I7b0JBRHZCLGVBQUksQ0FBQyxFQUFDLElBQUksRUFBRSxHQUFHLEVBQUMsQ0FBQzttQkFDWixrQkFBa0IsQ0FDdkI7Z0JBQUQseUJBQUM7YUFBQSxBQURELENBQWlDLE1BQU0sR0FDdEM7WUFFRCxNQUFNLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLElBQUksZUFBSSxDQUFDLEVBQUMsSUFBSSxFQUFFLEdBQUcsRUFBQyxDQUFDLENBQUMsQ0FBQztZQUUxRSxNQUFNLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLElBQUksZUFBSSxDQUFDLEVBQUMsSUFBSSxFQUFFLEdBQUcsRUFBQyxDQUFDLENBQUMsQ0FBQztRQUM5RSxDQUFDLENBQUMsQ0FBQztJQUVMLENBQUMsQ0FBQyxDQUFDO0NBQ0oifQ==