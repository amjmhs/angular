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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
var common_1 = require("@angular/common");
var core_1 = require("@angular/core");
var testing_1 = require("@angular/core/testing");
var matchers_1 = require("@angular/platform-browser/testing/src/matchers");
{
    describe('forwardRef integration', function () {
        beforeEach(function () { testing_1.TestBed.configureTestingModule({ imports: [Module], declarations: [App] }); });
        it('should instantiate components which are declared using forwardRef', function () {
            var a = testing_1.TestBed.configureTestingModule({ schemas: [core_1.NO_ERRORS_SCHEMA] }).createComponent(App);
            a.detectChanges();
            matchers_1.expect(core_1.asNativeElements(a.debugElement.children)).toHaveText('frame(lock)');
            matchers_1.expect(testing_1.TestBed.get(ModuleFrame)).toBeDefined();
        });
    });
}
var Module = /** @class */ (function () {
    function Module() {
    }
    Module = __decorate([
        core_1.NgModule({
            imports: [common_1.CommonModule],
            providers: [core_1.forwardRef(function () { return ModuleFrame; })],
            declarations: [core_1.forwardRef(function () { return Door; }), core_1.forwardRef(function () { return Lock; })],
            exports: [core_1.forwardRef(function () { return Door; }), core_1.forwardRef(function () { return Lock; })]
        })
    ], Module);
    return Module;
}());
var App = /** @class */ (function () {
    function App() {
    }
    App = __decorate([
        core_1.Component({
            selector: 'app',
            viewProviders: [core_1.forwardRef(function () { return Frame; })],
            template: "<door><lock></lock></door>",
        })
    ], App);
    return App;
}());
var Door = /** @class */ (function () {
    function Door(frame) {
        this.frame = frame;
    }
    __decorate([
        core_1.ContentChildren(core_1.forwardRef(function () { return Lock; })),
        __metadata("design:type", core_1.QueryList)
    ], Door.prototype, "locks", void 0);
    Door = __decorate([
        core_1.Component({
            selector: 'lock',
            template: "{{frame.name}}(<span *ngFor=\"let  lock of locks\">{{lock.name}}</span>)",
        }),
        __param(0, core_1.Inject(core_1.forwardRef(function () { return Frame; }))),
        __metadata("design:paramtypes", [Frame])
    ], Door);
    return Door;
}());
var Frame = /** @class */ (function () {
    function Frame() {
        this.name = 'frame';
    }
    return Frame;
}());
var ModuleFrame = /** @class */ (function () {
    function ModuleFrame() {
        this.name = 'moduleFram';
    }
    return ModuleFrame;
}());
var Lock = /** @class */ (function () {
    function Lock() {
        this.name = 'lock';
    }
    Lock = __decorate([
        core_1.Directive({ selector: 'lock' })
    ], Lock);
    return Lock;
}());
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZm9yd2FyZF9yZWZfaW50ZWdyYXRpb25fc3BlYy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2NvcmUvdGVzdC9mb3J3YXJkX3JlZl9pbnRlZ3JhdGlvbl9zcGVjLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7Ozs7Ozs7Ozs7Ozs7O0FBRUgsMENBQTZDO0FBQzdDLHNDQUFpSjtBQUNqSixpREFBOEM7QUFDOUMsMkVBQXNFO0FBRXRFO0lBQ0UsUUFBUSxDQUFDLHdCQUF3QixFQUFFO1FBQ2pDLFVBQVUsQ0FBQyxjQUFRLGlCQUFPLENBQUMsc0JBQXNCLENBQUMsRUFBQyxPQUFPLEVBQUUsQ0FBQyxNQUFNLENBQUMsRUFBRSxZQUFZLEVBQUUsQ0FBQyxHQUFHLENBQUMsRUFBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUVoRyxFQUFFLENBQUMsbUVBQW1FLEVBQUU7WUFDdEUsSUFBTSxDQUFDLEdBQUcsaUJBQU8sQ0FBQyxzQkFBc0IsQ0FBQyxFQUFDLE9BQU8sRUFBRSxDQUFDLHVCQUFnQixDQUFDLEVBQUMsQ0FBQyxDQUFDLGVBQWUsQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUM3RixDQUFDLENBQUMsYUFBYSxFQUFFLENBQUM7WUFDbEIsaUJBQU0sQ0FBQyx1QkFBZ0IsQ0FBQyxDQUFDLENBQUMsWUFBWSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDLGFBQWEsQ0FBQyxDQUFDO1lBQzVFLGlCQUFNLENBQUMsaUJBQU8sQ0FBQyxHQUFHLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxXQUFXLEVBQUUsQ0FBQztRQUNqRCxDQUFDLENBQUMsQ0FBQztJQUNMLENBQUMsQ0FBQyxDQUFDO0NBQ0o7QUFRRDtJQUFBO0lBQ0EsQ0FBQztJQURLLE1BQU07UUFOWCxlQUFRLENBQUM7WUFDUixPQUFPLEVBQUUsQ0FBQyxxQkFBWSxDQUFDO1lBQ3ZCLFNBQVMsRUFBRSxDQUFDLGlCQUFVLENBQUMsY0FBTSxPQUFBLFdBQVcsRUFBWCxDQUFXLENBQUMsQ0FBQztZQUMxQyxZQUFZLEVBQUUsQ0FBQyxpQkFBVSxDQUFDLGNBQU0sT0FBQSxJQUFJLEVBQUosQ0FBSSxDQUFDLEVBQUUsaUJBQVUsQ0FBQyxjQUFNLE9BQUEsSUFBSSxFQUFKLENBQUksQ0FBQyxDQUFDO1lBQzlELE9BQU8sRUFBRSxDQUFDLGlCQUFVLENBQUMsY0FBTSxPQUFBLElBQUksRUFBSixDQUFJLENBQUMsRUFBRSxpQkFBVSxDQUFDLGNBQU0sT0FBQSxJQUFJLEVBQUosQ0FBSSxDQUFDLENBQUM7U0FDMUQsQ0FBQztPQUNJLE1BQU0sQ0FDWDtJQUFELGFBQUM7Q0FBQSxBQURELElBQ0M7QUFPRDtJQUFBO0lBQ0EsQ0FBQztJQURLLEdBQUc7UUFMUixnQkFBUyxDQUFDO1lBQ1QsUUFBUSxFQUFFLEtBQUs7WUFDZixhQUFhLEVBQUUsQ0FBQyxpQkFBVSxDQUFDLGNBQU0sT0FBQSxLQUFLLEVBQUwsQ0FBSyxDQUFDLENBQUM7WUFDeEMsUUFBUSxFQUFFLDRCQUE0QjtTQUN2QyxDQUFDO09BQ0ksR0FBRyxDQUNSO0lBQUQsVUFBQztDQUFBLEFBREQsSUFDQztBQU1EO0lBS0UsY0FBNkMsS0FBWTtRQUFJLElBQUksQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDO0lBQUMsQ0FBQztJQUh6QztRQUF4QyxzQkFBZSxDQUFDLGlCQUFVLENBQUMsY0FBTSxPQUFBLElBQUksRUFBSixDQUFJLENBQUMsQ0FBQztrQ0FBVSxnQkFBUzt1Q0FBTztJQUY5RCxJQUFJO1FBSlQsZ0JBQVMsQ0FBQztZQUNULFFBQVEsRUFBRSxNQUFNO1lBQ2hCLFFBQVEsRUFBRSwwRUFBd0U7U0FDbkYsQ0FBQztRQU1hLFdBQUEsYUFBTSxDQUFDLGlCQUFVLENBQUMsY0FBTSxPQUFBLEtBQUssRUFBTCxDQUFLLENBQUMsQ0FBQyxDQUFBO3lDQUFRLEtBQUs7T0FMckQsSUFBSSxDQU1UO0lBQUQsV0FBQztDQUFBLEFBTkQsSUFNQztBQUVEO0lBQUE7UUFDRSxTQUFJLEdBQVcsT0FBTyxDQUFDO0lBQ3pCLENBQUM7SUFBRCxZQUFDO0FBQUQsQ0FBQyxBQUZELElBRUM7QUFFRDtJQUFBO1FBQ0UsU0FBSSxHQUFXLFlBQVksQ0FBQztJQUM5QixDQUFDO0lBQUQsa0JBQUM7QUFBRCxDQUFDLEFBRkQsSUFFQztBQUdEO0lBREE7UUFFRSxTQUFJLEdBQVcsTUFBTSxDQUFDO0lBQ3hCLENBQUM7SUFGSyxJQUFJO1FBRFQsZ0JBQVMsQ0FBQyxFQUFDLFFBQVEsRUFBRSxNQUFNLEVBQUMsQ0FBQztPQUN4QixJQUFJLENBRVQ7SUFBRCxXQUFDO0NBQUEsQUFGRCxJQUVDIn0=