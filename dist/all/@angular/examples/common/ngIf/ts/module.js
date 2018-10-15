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
var platform_browser_1 = require("@angular/platform-browser");
var rxjs_1 = require("rxjs");
// #docregion NgIfSimple
var NgIfSimple = /** @class */ (function () {
    function NgIfSimple() {
        this.show = true;
    }
    NgIfSimple = __decorate([
        core_1.Component({
            selector: 'ng-if-simple',
            template: "\n    <button (click)=\"show = !show\">{{show ? 'hide' : 'show'}}</button>\n    show = {{show}}\n    <br>\n    <div *ngIf=\"show\">Text to show</div>\n"
        })
    ], NgIfSimple);
    return NgIfSimple;
}());
// #enddocregion
// #docregion NgIfElse
var NgIfElse = /** @class */ (function () {
    function NgIfElse() {
        this.show = true;
    }
    NgIfElse = __decorate([
        core_1.Component({
            selector: 'ng-if-else',
            template: "\n    <button (click)=\"show = !show\">{{show ? 'hide' : 'show'}}</button>\n    show = {{show}}\n    <br>\n    <div *ngIf=\"show; else elseBlock\">Text to show</div>\n    <ng-template #elseBlock>Alternate text while primary text is hidden</ng-template>\n"
        })
    ], NgIfElse);
    return NgIfElse;
}());
// #enddocregion
// #docregion NgIfThenElse
var NgIfThenElse = /** @class */ (function () {
    function NgIfThenElse() {
        this.thenBlock = null;
        this.show = true;
        this.primaryBlock = null;
        this.secondaryBlock = null;
    }
    NgIfThenElse.prototype.switchPrimary = function () {
        this.thenBlock = this.thenBlock === this.primaryBlock ? this.secondaryBlock : this.primaryBlock;
    };
    NgIfThenElse.prototype.ngOnInit = function () { this.thenBlock = this.primaryBlock; };
    __decorate([
        core_1.ViewChild('primaryBlock'),
        __metadata("design:type", Object)
    ], NgIfThenElse.prototype, "primaryBlock", void 0);
    __decorate([
        core_1.ViewChild('secondaryBlock'),
        __metadata("design:type", Object)
    ], NgIfThenElse.prototype, "secondaryBlock", void 0);
    NgIfThenElse = __decorate([
        core_1.Component({
            selector: 'ng-if-then-else',
            template: "\n    <button (click)=\"show = !show\">{{show ? 'hide' : 'show'}}</button>\n    <button (click)=\"switchPrimary()\">Switch Primary</button>\n    show = {{show}}\n    <br>\n    <div *ngIf=\"show; then thenBlock; else elseBlock\">this is ignored</div>\n    <ng-template #primaryBlock>Primary text to show</ng-template>\n    <ng-template #secondaryBlock>Secondary text to show</ng-template>\n    <ng-template #elseBlock>Alternate text while primary text is hidden</ng-template>\n"
        })
    ], NgIfThenElse);
    return NgIfThenElse;
}());
// #enddocregion
// #docregion NgIfAs
var NgIfAs = /** @class */ (function () {
    function NgIfAs() {
        this.userObservable = new rxjs_1.Subject();
        this.first = ['John', 'Mike', 'Mary', 'Bob'];
        this.firstIndex = 0;
        this.last = ['Smith', 'Novotny', 'Angular'];
        this.lastIndex = 0;
    }
    NgIfAs.prototype.nextUser = function () {
        var first = this.first[this.firstIndex++];
        if (this.firstIndex >= this.first.length)
            this.firstIndex = 0;
        var last = this.last[this.lastIndex++];
        if (this.lastIndex >= this.last.length)
            this.lastIndex = 0;
        this.userObservable.next({ first: first, last: last });
    };
    NgIfAs = __decorate([
        core_1.Component({
            selector: 'ng-if-let',
            template: "\n    <button (click)=\"nextUser()\">Next User</button>\n    <br>\n    <div *ngIf=\"userObservable | async as user; else loading\">\n      Hello {{user.last}}, {{user.first}}!\n    </div>\n    <ng-template #loading let-user>Waiting... (user is {{user|json}})</ng-template>\n"
        })
    ], NgIfAs);
    return NgIfAs;
}());
// #enddocregion
var ExampleApp = /** @class */ (function () {
    function ExampleApp() {
    }
    ExampleApp = __decorate([
        core_1.Component({
            selector: 'example-app',
            template: "\n    <ng-if-simple></ng-if-simple>\n    <hr>\n    <ng-if-else></ng-if-else>\n    <hr>\n    <ng-if-then-else></ng-if-then-else>\n    <hr>\n    <ng-if-let></ng-if-let>\n    <hr>\n"
        })
    ], ExampleApp);
    return ExampleApp;
}());
var AppModule = /** @class */ (function () {
    function AppModule() {
    }
    AppModule = __decorate([
        core_1.NgModule({
            imports: [platform_browser_1.BrowserModule],
            declarations: [ExampleApp, NgIfSimple, NgIfElse, NgIfThenElse, NgIfAs],
            bootstrap: [ExampleApp]
        })
    ], AppModule);
    return AppModule;
}());
exports.AppModule = AppModule;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibW9kdWxlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvZXhhbXBsZXMvY29tbW9uL25nSWYvdHMvbW9kdWxlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7Ozs7Ozs7Ozs7O0FBRUgsc0NBQWtGO0FBQ2xGLDhEQUF3RDtBQUN4RCw2QkFBNkI7QUFHN0Isd0JBQXdCO0FBVXhCO0lBVEE7UUFVRSxTQUFJLEdBQVksSUFBSSxDQUFDO0lBQ3ZCLENBQUM7SUFGSyxVQUFVO1FBVGYsZ0JBQVMsQ0FBQztZQUNULFFBQVEsRUFBRSxjQUFjO1lBQ3hCLFFBQVEsRUFBRSx5SkFLWDtTQUNBLENBQUM7T0FDSSxVQUFVLENBRWY7SUFBRCxpQkFBQztDQUFBLEFBRkQsSUFFQztBQUNELGdCQUFnQjtBQUVoQixzQkFBc0I7QUFXdEI7SUFWQTtRQVdFLFNBQUksR0FBWSxJQUFJLENBQUM7SUFDdkIsQ0FBQztJQUZLLFFBQVE7UUFWYixnQkFBUyxDQUFDO1lBQ1QsUUFBUSxFQUFFLFlBQVk7WUFDdEIsUUFBUSxFQUFFLGdRQU1YO1NBQ0EsQ0FBQztPQUNJLFFBQVEsQ0FFYjtJQUFELGVBQUM7Q0FBQSxBQUZELElBRUM7QUFDRCxnQkFBZ0I7QUFFaEIsMEJBQTBCO0FBYzFCO0lBYkE7UUFjRSxjQUFTLEdBQTBCLElBQUksQ0FBQztRQUN4QyxTQUFJLEdBQVksSUFBSSxDQUFDO1FBR3JCLGlCQUFZLEdBQTBCLElBQUksQ0FBQztRQUUzQyxtQkFBYyxHQUEwQixJQUFJLENBQUM7SUFPL0MsQ0FBQztJQUxDLG9DQUFhLEdBQWI7UUFDRSxJQUFJLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQyxTQUFTLEtBQUssSUFBSSxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQztJQUNsRyxDQUFDO0lBRUQsK0JBQVEsR0FBUixjQUFhLElBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUM7SUFSbEQ7UUFEQyxnQkFBUyxDQUFDLGNBQWMsQ0FBQzs7c0RBQ2lCO0lBRTNDO1FBREMsZ0JBQVMsQ0FBQyxnQkFBZ0IsQ0FBQzs7d0RBQ2lCO0lBUHpDLFlBQVk7UUFiakIsZ0JBQVMsQ0FBQztZQUNULFFBQVEsRUFBRSxpQkFBaUI7WUFDM0IsUUFBUSxFQUFFLDhkQVNYO1NBQ0EsQ0FBQztPQUNJLFlBQVksQ0FjakI7SUFBRCxtQkFBQztDQUFBLEFBZEQsSUFjQztBQUNELGdCQUFnQjtBQUVoQixvQkFBb0I7QUFZcEI7SUFYQTtRQVlFLG1CQUFjLEdBQUcsSUFBSSxjQUFPLEVBQWlDLENBQUM7UUFDOUQsVUFBSyxHQUFHLENBQUMsTUFBTSxFQUFFLE1BQU0sRUFBRSxNQUFNLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFDeEMsZUFBVSxHQUFHLENBQUMsQ0FBQztRQUNmLFNBQUksR0FBRyxDQUFDLE9BQU8sRUFBRSxTQUFTLEVBQUUsU0FBUyxDQUFDLENBQUM7UUFDdkMsY0FBUyxHQUFHLENBQUMsQ0FBQztJQVNoQixDQUFDO0lBUEMseUJBQVEsR0FBUjtRQUNFLElBQUksS0FBSyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLFVBQVUsRUFBRSxDQUFDLENBQUM7UUFDMUMsSUFBSSxJQUFJLENBQUMsVUFBVSxJQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTTtZQUFFLElBQUksQ0FBQyxVQUFVLEdBQUcsQ0FBQyxDQUFDO1FBQzlELElBQUksSUFBSSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxDQUFDLENBQUM7UUFDdkMsSUFBSSxJQUFJLENBQUMsU0FBUyxJQUFJLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTTtZQUFFLElBQUksQ0FBQyxTQUFTLEdBQUcsQ0FBQyxDQUFDO1FBQzNELElBQUksQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLEVBQUMsS0FBSyxPQUFBLEVBQUUsSUFBSSxNQUFBLEVBQUMsQ0FBQyxDQUFDO0lBQzFDLENBQUM7SUFiRyxNQUFNO1FBWFgsZ0JBQVMsQ0FBQztZQUNULFFBQVEsRUFBRSxXQUFXO1lBQ3JCLFFBQVEsRUFBRSxvUkFPWDtTQUNBLENBQUM7T0FDSSxNQUFNLENBY1g7SUFBRCxhQUFDO0NBQUEsQUFkRCxJQWNDO0FBQ0QsZ0JBQWdCO0FBZ0JoQjtJQUFBO0lBQ0EsQ0FBQztJQURLLFVBQVU7UUFiZixnQkFBUyxDQUFDO1lBQ1QsUUFBUSxFQUFFLGFBQWE7WUFDdkIsUUFBUSxFQUFFLG9MQVNYO1NBQ0EsQ0FBQztPQUNJLFVBQVUsQ0FDZjtJQUFELGlCQUFDO0NBQUEsQUFERCxJQUNDO0FBT0Q7SUFBQTtJQUNBLENBQUM7SUFEWSxTQUFTO1FBTHJCLGVBQVEsQ0FBQztZQUNSLE9BQU8sRUFBRSxDQUFDLGdDQUFhLENBQUM7WUFDeEIsWUFBWSxFQUFFLENBQUMsVUFBVSxFQUFFLFVBQVUsRUFBRSxRQUFRLEVBQUUsWUFBWSxFQUFFLE1BQU0sQ0FBQztZQUN0RSxTQUFTLEVBQUUsQ0FBQyxVQUFVLENBQUM7U0FDeEIsQ0FBQztPQUNXLFNBQVMsQ0FDckI7SUFBRCxnQkFBQztDQUFBLEFBREQsSUFDQztBQURZLDhCQUFTIn0=