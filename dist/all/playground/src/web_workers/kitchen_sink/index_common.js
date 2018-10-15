"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
// A service available to the Injector, used by the HelloCmp component.
var GreetingService = /** @class */ (function () {
    function GreetingService() {
        this.greeting = 'hello';
    }
    GreetingService = __decorate([
        core_1.Injectable()
    ], GreetingService);
    return GreetingService;
}());
exports.GreetingService = GreetingService;
// Directives are light-weight. They don't allow new
// expression contexts (use @Component for those needs).
var RedDec = /** @class */ (function () {
    // ElementRef is always injectable and it wraps the element on which the
    // directive was found by the compiler.
    function RedDec(el, renderer) {
        renderer.setElementStyle(el.nativeElement, 'color', 'red');
    }
    RedDec = __decorate([
        core_1.Directive({ selector: '[red]' }),
        __metadata("design:paramtypes", [core_1.ElementRef, core_1.Renderer])
    ], RedDec);
    return RedDec;
}());
exports.RedDec = RedDec;
// Angular supports 2 basic types of directives:
// - Component - the basic building blocks of Angular apps. Backed by
//   ShadowDom.(http://www.html5rocks.com/en/tutorials/webcomponents/shadowdom/)
// - Directive - add behavior to existing elements.
var HelloCmp = /** @class */ (function () {
    function HelloCmp(service) {
        this.lastKey = '(none)';
        this.greeting = service.greeting;
    }
    HelloCmp.prototype.changeGreeting = function () { this.greeting = 'howdy'; };
    HelloCmp.prototype.onKeyDown = function (event) { this.lastKey = String.fromCharCode(event.keyCode); };
    HelloCmp = __decorate([
        core_1.Component({
            // The Selector prop tells Angular on which elements to instantiate this
            // class. The syntax supported is a basic subset of CSS selectors, for example
            // 'element', '[attr]', [attr=foo]', etc.
            selector: 'hello-app',
            // These are services that would be created if a class in the component's
            // template tries to inject them.
            viewProviders: [GreetingService],
            // The template for the component.
            // Expressions in the template (like {{greeting}}) are evaluated in the
            // context of the HelloCmp class below.
            template: "<div class=\"greeting\">{{greeting}} <span red>world</span>!</div>\n           <button class=\"changeButton\" (click)=\"changeGreeting()\">change greeting</button>\n           <div (keydown)=\"onKeyDown($event)\" class=\"sample-area\" tabindex=\"0\">{{lastKey}}</div><br>"
        }),
        __metadata("design:paramtypes", [GreetingService])
    ], HelloCmp);
    return HelloCmp;
}());
exports.HelloCmp = HelloCmp;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXhfY29tbW9uLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vbW9kdWxlcy9wbGF5Z3JvdW5kL3NyYy93ZWJfd29ya2Vycy9raXRjaGVuX3NpbmsvaW5kZXhfY29tbW9uLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7Ozs7Ozs7Ozs7O0FBRUgsc0NBQXFGO0FBRXJGLHVFQUF1RTtBQUV2RTtJQURBO1FBRUUsYUFBUSxHQUFXLE9BQU8sQ0FBQztJQUM3QixDQUFDO0lBRlksZUFBZTtRQUQzQixpQkFBVSxFQUFFO09BQ0EsZUFBZSxDQUUzQjtJQUFELHNCQUFDO0NBQUEsQUFGRCxJQUVDO0FBRlksMENBQWU7QUFJNUIsb0RBQW9EO0FBQ3BELHdEQUF3RDtBQUV4RDtJQUNFLHdFQUF3RTtJQUN4RSx1Q0FBdUM7SUFDdkMsZ0JBQVksRUFBYyxFQUFFLFFBQWtCO1FBQzVDLFFBQVEsQ0FBQyxlQUFlLENBQUMsRUFBRSxDQUFDLGFBQWEsRUFBRSxPQUFPLEVBQUUsS0FBSyxDQUFDLENBQUM7SUFDN0QsQ0FBQztJQUxVLE1BQU07UUFEbEIsZ0JBQVMsQ0FBQyxFQUFDLFFBQVEsRUFBRSxPQUFPLEVBQUMsQ0FBQzt5Q0FJYixpQkFBVSxFQUFZLGVBQVE7T0FIbkMsTUFBTSxDQU1sQjtJQUFELGFBQUM7Q0FBQSxBQU5ELElBTUM7QUFOWSx3QkFBTTtBQVFuQixnREFBZ0Q7QUFDaEQscUVBQXFFO0FBQ3JFLGdGQUFnRjtBQUNoRixtREFBbUQ7QUFpQm5EO0lBSUUsa0JBQVksT0FBd0I7UUFGcEMsWUFBTyxHQUFXLFFBQVEsQ0FBQztRQUVhLElBQUksQ0FBQyxRQUFRLEdBQUcsT0FBTyxDQUFDLFFBQVEsQ0FBQztJQUFDLENBQUM7SUFFM0UsaUNBQWMsR0FBZCxjQUF5QixJQUFJLENBQUMsUUFBUSxHQUFHLE9BQU8sQ0FBQyxDQUFDLENBQUM7SUFFbkQsNEJBQVMsR0FBVCxVQUFVLEtBQW9CLElBQVUsSUFBSSxDQUFDLE9BQU8sR0FBRyxNQUFNLENBQUMsWUFBWSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFSakYsUUFBUTtRQWZwQixnQkFBUyxDQUFDO1lBQ1Qsd0VBQXdFO1lBQ3hFLDhFQUE4RTtZQUM5RSx5Q0FBeUM7WUFDekMsUUFBUSxFQUFFLFdBQVc7WUFDckIseUVBQXlFO1lBQ3pFLGlDQUFpQztZQUNqQyxhQUFhLEVBQUUsQ0FBQyxlQUFlLENBQUM7WUFDaEMsa0NBQWtDO1lBQ2xDLHVFQUF1RTtZQUN2RSx1Q0FBdUM7WUFDdkMsUUFBUSxFQUFFLGlSQUV5RjtTQUNwRyxDQUFDO3lDQUtxQixlQUFlO09BSnpCLFFBQVEsQ0FTcEI7SUFBRCxlQUFDO0NBQUEsQUFURCxJQVNDO0FBVFksNEJBQVEifQ==