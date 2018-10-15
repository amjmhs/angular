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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var _this = this;
Object.defineProperty(exports, "__esModule", { value: true });
var common_1 = require("@angular/common");
var core_1 = require("@angular/core");
var testing_1 = require("@angular/private/testing");
var r3 = require("../../../src/render3/index");
var AppState = /** @class */ (function () {
    function AppState() {
        this.todos = [
            { text: 'Demonstrate Components', done: false },
            { text: 'Demonstrate Structural Directives', done: false },
            { text: 'Demonstrate NgModules', done: false },
            { text: 'Demonstrate zoneless changed detection', done: false },
            { text: 'Demonstrate internationalization', done: false },
        ];
        // /NORMATIVE
    }
    AppState_1 = AppState;
    var AppState_1;
    // NORMATIVE
    AppState.ngInjectableDef = core_1.defineInjectable({ factory: function () { return new AppState_1(); } });
    AppState = AppState_1 = __decorate([
        core_1.Injectable()
    ], AppState);
    return AppState;
}());
var ToDoAppComponent = /** @class */ (function () {
    function ToDoAppComponent(appState) {
        this.appState = appState;
    }
    ToDoAppComponent_1 = ToDoAppComponent;
    ToDoAppComponent.prototype.onArchive = function (item) {
        var todos = this.appState.todos;
        todos.splice(todos.indexOf(item));
        r3.markDirty(this);
    };
    var ToDoAppComponent_1;
    // NORMATIVE
    ToDoAppComponent.ngComponentDef = r3.defineComponent({
        type: ToDoAppComponent_1,
        selectors: [['todo-app']],
        factory: function ToDoAppComponent_Factory() {
            return new ToDoAppComponent_1(r3.directiveInject(AppState));
        },
        template: function ToDoAppComponent_Template(rf, ctx) {
            if (rf & 1) {
                var ToDoAppComponent_NgForOf_Template = function ToDoAppComponent_NgForOf_Template(rf, ctx1) {
                    if (rf & 1) {
                        r3.E(0, 'todo');
                        r3.L('archive', ctx.onArchive.bind(ctx));
                        r3.e();
                    }
                    if (rf & 2) {
                        r3.p(0, 'todo', r3.b(ctx1.$implicit));
                    }
                };
                r3.E(0, 'h1');
                r3.T(1, 'ToDo Application');
                r3.e();
                r3.E(2, 'div');
                r3.C(3, ToDoAppComponent_NgForOf_Template, '', ['ngForOf', '']);
                r3.e();
                r3.E(4, 'span');
                r3.T(5);
                r3.e();
            }
            if (rf & 2) {
                r3.t(5, r3.i1('count: ', ctx.appState.todos.length, ''));
            }
        }
    });
    ToDoAppComponent = ToDoAppComponent_1 = __decorate([
        core_1.Component({
            selector: 'todo-app',
            template: "\n  <h1>ToDo Application</h1>\n  <div>\n    <todo *ngFor=\"let todo of appState.todos\" [todo]=\"todo\" (archive)=\"onArchive($event)\"></todo>\n  </div>\n  <span>count: {{appState.todos.length}}.</span>\n  "
        }),
        __metadata("design:paramtypes", [AppState])
    ], ToDoAppComponent);
    return ToDoAppComponent;
}());
// NON-NORMATIVE
ToDoAppComponent.ngComponentDef.directiveDefs = function () {
    return [ToDoItemComponent.ngComponentDef, common_1.NgForOf.ngDirectiveDef];
};
// /NON-NORMATIVE
var ToDoItemComponent = /** @class */ (function () {
    function ToDoItemComponent() {
        this.todo = ToDoItemComponent_1.DEFAULT_TODO;
        this.archive = new core_1.EventEmitter();
        // /NORMATIVE
    }
    ToDoItemComponent_1 = ToDoItemComponent;
    ToDoItemComponent.prototype.onCheckboxClick = function () {
        this.todo.done = !this.todo.done;
        r3.markDirty(this);
    };
    ToDoItemComponent.prototype.onArchiveClick = function () { this.archive.emit(this.todo); };
    var ToDoItemComponent_1;
    ToDoItemComponent.DEFAULT_TODO = { text: '', done: false };
    // NORMATIVE
    ToDoItemComponent.ngComponentDef = r3.defineComponent({
        type: ToDoItemComponent_1,
        selectors: [['todo']],
        factory: function ToDoItemComponent_Factory() { return new ToDoItemComponent_1(); },
        template: function ToDoItemComponent_Template(rf, ctx) {
            if (rf & 1) {
                r3.E(0, 'div');
                r3.E(1, 'input', e1_attrs);
                r3.L('click', ctx.onCheckboxClick.bind(ctx));
                r3.e();
                r3.E(2, 'span');
                r3.T(3);
                r3.e();
                r3.E(4, 'button');
                r3.L('click', ctx.onArchiveClick.bind(ctx));
                r3.T(5, 'archive');
                r3.e();
                r3.e();
            }
            if (rf & 2) {
                r3.p(1, 'value', r3.b(ctx.todo.done));
                r3.t(3, r3.b(ctx.todo.text));
            }
        },
        inputs: { todo: 'todo' },
    });
    __decorate([
        core_1.Input(),
        __metadata("design:type", Object)
    ], ToDoItemComponent.prototype, "todo", void 0);
    __decorate([
        core_1.Output(),
        __metadata("design:type", Object)
    ], ToDoItemComponent.prototype, "archive", void 0);
    ToDoItemComponent = ToDoItemComponent_1 = __decorate([
        core_1.Component({
            selector: 'todo',
            template: "\n    <div [class.done]=\"todo.done\">\n      <input type=\"checkbox\" [value]=\"todo.done\" (click)=\"onCheckboxClick()\"></input>\n      <span>{{todo.text}}</span>\n      <button (click)=\"onArchiveClick()\">archive</button>\n    </div>\n  "
        })
    ], ToDoItemComponent);
    return ToDoItemComponent;
}());
// NORMATIVE
var e1_attrs = ['type', 'checkbox'];
// /NORMATIVE
var ToDoAppModule = /** @class */ (function () {
    function ToDoAppModule() {
    }
    ToDoAppModule_1 = ToDoAppModule;
    var ToDoAppModule_1;
    // NORMATIVE
    ToDoAppModule.ngInjectorDef = core_1.defineInjector({
        factory: function () { return new ToDoAppModule_1(); },
        providers: [AppState],
    });
    ToDoAppModule = ToDoAppModule_1 = __decorate([
        core_1.NgModule({
            declarations: [ToDoAppComponent, ToDoItemComponent],
            providers: [AppState],
        })
    ], ToDoAppModule);
    return ToDoAppModule;
}());
describe('small_app', function () {
    xit('should render', function () { return testing_1.withBody('<todo-app></todo-app>', function () { return __awaiter(_this, void 0, void 0, function () {
        var todoApp, firstCheckBox, firstArchive;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    todoApp = r3.renderComponent(ToDoAppComponent);
                    return [4 /*yield*/, r3.whenRendered(todoApp)];
                case 1:
                    _a.sent();
                    expect(r3.getRenderedText(todoApp)).toEqual('...');
                    firstCheckBox = r3.getHostElement(todoApp).querySelector('input[type=checkbox]');
                    firstCheckBox.click();
                    return [4 /*yield*/, r3.whenRendered(todoApp)];
                case 2:
                    _a.sent();
                    expect(r3.getRenderedText(todoApp)).toEqual('...');
                    firstArchive = r3.getHostElement(todoApp).querySelector('button');
                    firstArchive.click;
                    return [4 /*yield*/, r3.whenRendered(todoApp)];
                case 3:
                    _a.sent();
                    expect(r3.getRenderedText(todoApp)).toEqual('...');
                    return [2 /*return*/];
            }
        });
    }); }); });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic21hbGxfYXBwX3NwZWMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9jb3JlL3Rlc3QvcmVuZGVyMy9jb21waWxlcl9jYW5vbmljYWwvc21hbGxfYXBwX3NwZWMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBRUgsaUJBMkxBOztBQTNMQSwwQ0FBd0Q7QUFDeEQsc0NBQTBRO0FBQzFRLG9EQUFrRDtBQUVsRCwrQ0FBaUQ7QUFjakQ7SUFEQTtRQUVFLFVBQUssR0FBVztZQUNkLEVBQUMsSUFBSSxFQUFFLHdCQUF3QixFQUFFLElBQUksRUFBRSxLQUFLLEVBQUM7WUFDN0MsRUFBQyxJQUFJLEVBQUUsbUNBQW1DLEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBQztZQUN4RCxFQUFDLElBQUksRUFBRSx1QkFBdUIsRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFDO1lBQzVDLEVBQUMsSUFBSSxFQUFFLHdDQUF3QyxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUM7WUFDN0QsRUFBQyxJQUFJLEVBQUUsa0NBQWtDLEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBQztTQUN4RCxDQUFDO1FBSUYsYUFBYTtJQUNmLENBQUM7aUJBWkssUUFBUTs7SUFTWixZQUFZO0lBQ0wsd0JBQWUsR0FBRyx1QkFBZ0IsQ0FBQyxFQUFDLE9BQU8sRUFBRSxjQUFNLE9BQUEsSUFBSSxVQUFRLEVBQUUsRUFBZCxDQUFjLEVBQUMsQ0FBQyxDQUFDO0lBVnZFLFFBQVE7UUFEYixpQkFBVSxFQUFFO09BQ1AsUUFBUSxDQVliO0lBQUQsZUFBQztDQUFBLEFBWkQsSUFZQztBQVlEO0lBQ0UsMEJBQW1CLFFBQWtCO1FBQWxCLGFBQVEsR0FBUixRQUFRLENBQVU7SUFBRyxDQUFDO3lCQURyQyxnQkFBZ0I7SUFHcEIsb0NBQVMsR0FBVCxVQUFVLElBQVU7UUFDbEIsSUFBTSxLQUFLLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUM7UUFDbEMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7UUFDbEMsRUFBRSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUNyQixDQUFDOztJQUVELFlBQVk7SUFDTCwrQkFBYyxHQUFHLEVBQUUsQ0FBQyxlQUFlLENBQUM7UUFDekMsSUFBSSxFQUFFLGtCQUFnQjtRQUN0QixTQUFTLEVBQUUsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDO1FBQ3pCLE9BQU8sRUFBRTtZQUNQLE9BQU8sSUFBSSxrQkFBZ0IsQ0FBQyxFQUFFLENBQUMsZUFBZSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUM7UUFDNUQsQ0FBQztRQUNELFFBQVEsRUFBRSxtQ0FBbUMsRUFBaUIsRUFBRSxHQUFxQjtZQUNuRixJQUFJLEVBQUUsR0FBRyxDQUFDLEVBQUU7Z0JBQ1YsSUFBTSxpQ0FBaUMsR0FBRywyQ0FDdEMsRUFBaUIsRUFBRSxJQUEwQjtvQkFDL0MsSUFBSSxFQUFFLEdBQUcsQ0FBQyxFQUFFO3dCQUNWLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLE1BQU0sQ0FBQyxDQUFDO3dCQUNoQixFQUFFLENBQUMsQ0FBQyxDQUFDLFNBQVMsRUFBRSxHQUFHLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO3dCQUN6QyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUM7cUJBQ1I7b0JBQ0QsSUFBSSxFQUFFLEdBQUcsQ0FBQyxFQUFFO3dCQUNWLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLE1BQU0sRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDO3FCQUN2QztnQkFDSCxDQUFDLENBQUM7Z0JBQ0YsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUM7Z0JBQ2QsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsa0JBQWtCLENBQUMsQ0FBQztnQkFDNUIsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDO2dCQUNQLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLEtBQUssQ0FBQyxDQUFDO2dCQUNmLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLGlDQUFpQyxFQUFFLEVBQUUsRUFBRSxDQUFDLFNBQVMsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDO2dCQUNoRSxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUM7Z0JBQ1AsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsTUFBTSxDQUFDLENBQUM7Z0JBQ2hCLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ1IsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDO2FBQ1I7WUFDRCxJQUFJLEVBQUUsR0FBRyxDQUFDLEVBQUU7Z0JBQ1YsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLEVBQUUsQ0FBQyxTQUFTLEVBQUUsR0FBRyxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsTUFBTSxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUM7YUFDMUQ7UUFDSCxDQUFDO0tBQ0YsQ0FBQyxDQUFDO0lBM0NDLGdCQUFnQjtRQVZyQixnQkFBUyxDQUFDO1lBQ1QsUUFBUSxFQUFFLFVBQVU7WUFDcEIsUUFBUSxFQUFFLGlOQU1UO1NBQ0YsQ0FBQzt5Q0FFNkIsUUFBUTtPQURqQyxnQkFBZ0IsQ0E2Q3JCO0lBQUQsdUJBQUM7Q0FBQSxBQTdDRCxJQTZDQztBQUVELGdCQUFnQjtBQUNmLGdCQUFnQixDQUFDLGNBQStDLENBQUMsYUFBYSxHQUFHO0lBQzlFLE9BQUEsQ0FBQyxpQkFBaUIsQ0FBQyxjQUFjLEVBQUcsZ0JBQTBDLENBQUMsY0FBYyxDQUFDO0FBQTlGLENBQThGLENBQUM7QUFDbkcsaUJBQWlCO0FBWWpCO0lBVkE7UUFjRSxTQUFJLEdBQVMsbUJBQWlCLENBQUMsWUFBWSxDQUFDO1FBRzVDLFlBQU8sR0FBRyxJQUFJLG1CQUFZLEVBQUUsQ0FBQztRQW9DN0IsYUFBYTtJQUNmLENBQUM7MEJBNUNLLGlCQUFpQjtJQVNyQiwyQ0FBZSxHQUFmO1FBQ0UsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLEdBQUcsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQztRQUNqQyxFQUFFLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQ3JCLENBQUM7SUFFRCwwQ0FBYyxHQUFkLGNBQW1CLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7O0lBYjNDLDhCQUFZLEdBQVMsRUFBQyxJQUFJLEVBQUUsRUFBRSxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUMsQ0FBQztJQWVwRCxZQUFZO0lBQ0wsZ0NBQWMsR0FBRyxFQUFFLENBQUMsZUFBZSxDQUFDO1FBQ3pDLElBQUksRUFBRSxtQkFBaUI7UUFDdkIsU0FBUyxFQUFFLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUNyQixPQUFPLEVBQUUsdUNBQXVDLE9BQU8sSUFBSSxtQkFBaUIsRUFBRSxDQUFDLENBQUMsQ0FBQztRQUNqRixRQUFRLEVBQUUsb0NBQW9DLEVBQWlCLEVBQUUsR0FBc0I7WUFDckYsSUFBSSxFQUFFLEdBQUcsQ0FBQyxFQUFFO2dCQUNWLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLEtBQUssQ0FBQyxDQUFDO2dCQUNmLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLE9BQU8sRUFBRSxRQUFRLENBQUMsQ0FBQztnQkFDM0IsRUFBRSxDQUFDLENBQUMsQ0FBQyxPQUFPLEVBQUUsR0FBRyxDQUFDLGVBQWUsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztnQkFDN0MsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDO2dCQUNQLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLE1BQU0sQ0FBQyxDQUFDO2dCQUNoQixFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUNSLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQztnQkFDUCxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxRQUFRLENBQUMsQ0FBQztnQkFDbEIsRUFBRSxDQUFDLENBQUMsQ0FBQyxPQUFPLEVBQUUsR0FBRyxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztnQkFDNUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsU0FBUyxDQUFDLENBQUM7Z0JBQ25CLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQztnQkFDUCxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUM7YUFDUjtZQUNELElBQUksRUFBRSxHQUFHLENBQUMsRUFBRTtnQkFDVixFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxPQUFPLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7Z0JBQ3RDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO2FBQzlCO1FBQ0gsQ0FBQztRQUNELE1BQU0sRUFBRSxFQUFDLElBQUksRUFBRSxNQUFNLEVBQUM7S0FDdkIsQ0FBQyxDQUFDO0lBdENIO1FBREMsWUFBSyxFQUFFOzttREFDb0M7SUFHNUM7UUFEQyxhQUFNLEVBQUU7O3NEQUNvQjtJQVB6QixpQkFBaUI7UUFWdEIsZ0JBQVMsQ0FBQztZQUNULFFBQVEsRUFBRSxNQUFNO1lBQ2hCLFFBQVEsRUFBRSxvUEFNVDtTQUNGLENBQUM7T0FDSSxpQkFBaUIsQ0E0Q3RCO0lBQUQsd0JBQUM7Q0FBQSxBQTVDRCxJQTRDQztBQUNELFlBQVk7QUFDWixJQUFNLFFBQVEsR0FBRyxDQUFDLE1BQU0sRUFBRSxVQUFVLENBQUMsQ0FBQztBQUN0QyxhQUFhO0FBT2I7SUFBQTtJQU9BLENBQUM7c0JBUEssYUFBYTs7SUFDakIsWUFBWTtJQUNMLDJCQUFhLEdBQUcscUJBQWMsQ0FBQztRQUNwQyxPQUFPLEVBQUUsY0FBTSxPQUFBLElBQUksZUFBYSxFQUFFLEVBQW5CLENBQW1CO1FBQ2xDLFNBQVMsRUFBRSxDQUFDLFFBQVEsQ0FBQztLQUN0QixDQUFDLENBQUM7SUFMQyxhQUFhO1FBSmxCLGVBQVEsQ0FBQztZQUNSLFlBQVksRUFBRSxDQUFDLGdCQUFnQixFQUFFLGlCQUFpQixDQUFDO1lBQ25ELFNBQVMsRUFBRSxDQUFDLFFBQVEsQ0FBQztTQUN0QixDQUFDO09BQ0ksYUFBYSxDQU9sQjtJQUFELG9CQUFDO0NBQUEsQUFQRCxJQU9DO0FBR0QsUUFBUSxDQUFDLFdBQVcsRUFBRTtJQUNwQixHQUFHLENBQUMsZUFBZSxFQUNmLGNBQU0sT0FBQSxrQkFBUSxDQUFDLHVCQUF1QixFQUFFOzs7OztvQkFHaEMsT0FBTyxHQUFHLEVBQUUsQ0FBQyxlQUFlLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztvQkFDckQscUJBQU0sRUFBRSxDQUFDLFlBQVksQ0FBQyxPQUFPLENBQUMsRUFBQTs7b0JBQTlCLFNBQThCLENBQUM7b0JBQy9CLE1BQU0sQ0FBQyxFQUFFLENBQUMsZUFBZSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDO29CQUM3QyxhQUFhLEdBQ2YsRUFBRSxDQUFDLGNBQWMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxhQUFhLENBQUMsc0JBQXNCLENBQWdCLENBQUM7b0JBQ3BGLGFBQWEsQ0FBQyxLQUFLLEVBQUUsQ0FBQztvQkFDdEIscUJBQU0sRUFBRSxDQUFDLFlBQVksQ0FBQyxPQUFPLENBQUMsRUFBQTs7b0JBQTlCLFNBQThCLENBQUM7b0JBQy9CLE1BQU0sQ0FBQyxFQUFFLENBQUMsZUFBZSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDO29CQUM3QyxZQUFZLEdBQUcsRUFBRSxDQUFDLGNBQWMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxhQUFhLENBQUMsUUFBUSxDQUFnQixDQUFDO29CQUN2RixZQUFZLENBQUMsS0FBSyxDQUFDO29CQUNuQixxQkFBTSxFQUFFLENBQUMsWUFBWSxDQUFDLE9BQU8sQ0FBQyxFQUFBOztvQkFBOUIsU0FBOEIsQ0FBQztvQkFDL0IsTUFBTSxDQUFDLEVBQUUsQ0FBQyxlQUFlLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUM7Ozs7U0FDcEQsQ0FBQyxFQWZJLENBZUosQ0FBQyxDQUFDO0FBQ1YsQ0FBQyxDQUFDLENBQUMifQ==