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
var $core$ = require("../../../index");
var core_1 = require("../../../src/core");
var $r3$ = require("../../../src/core_render3_private_export");
/// See: `normative.md`
xdescribe('NgModule', function () {
    function defineInjectable(opts) {
        // This class should be imported from https://github.com/angular/angular/pull/20850
        return opts;
    }
    function defineInjector(opts) {
        // This class should be imported from https://github.com/angular/angular/pull/20850
        return opts;
    }
    it('should convert module', function () {
        var Toast = /** @class */ (function () {
            function Toast(name) {
            }
            Toast_1 = Toast;
            var Toast_1;
            // NORMATIVE
            Toast.ngInjectableDef = defineInjectable({
                factory: function () { return new Toast_1($r3$.ɵdirectiveInject(String)); },
            });
            Toast = Toast_1 = __decorate([
                core_1.Injectable(),
                __metadata("design:paramtypes", [String])
            ], Toast);
            return Toast;
        }());
        var CommonModule = /** @class */ (function () {
            function CommonModule() {
            }
            // NORMATIVE
            CommonModule.ngInjectorDef = defineInjector({});
            return CommonModule;
        }());
        var MyModule = /** @class */ (function () {
            function MyModule(toast) {
            }
            MyModule_1 = MyModule;
            var MyModule_1;
            // NORMATIVE
            MyModule.ngInjectorDef = defineInjector({
                factory: function () { return new MyModule_1($r3$.ɵdirectiveInject(Toast)); },
                provider: [
                    { provide: Toast, deps: [String] },
                    Toast,
                    { provide: String, useValue: 'Hello' }
                ],
                imports: [CommonModule]
            });
            MyModule = MyModule_1 = __decorate([
                core_1.NgModule({
                    providers: [Toast, { provide: String, useValue: 'Hello' }],
                    imports: [CommonModule],
                }),
                __metadata("design:paramtypes", [Toast])
            ], MyModule);
            return MyModule;
        }());
        var BurntToast = /** @class */ (function () {
            function BurntToast(toast, name) {
            }
            BurntToast_1 = BurntToast;
            var BurntToast_1;
            // NORMATIVE
            BurntToast.ngInjectableDef = defineInjectable({
                providedIn: MyModule,
                factory: function () { return new BurntToast_1($r3$.ɵdirectiveInject(Toast, 8 /* Optional */), $r3$.ɵdirectiveInject(String)); },
            });
            BurntToast = BurntToast_1 = __decorate([
                core_1.Injectable( /*{MyModule}*/),
                __param(0, core_1.Optional()),
                __metadata("design:paramtypes", [Object, String])
            ], BurntToast);
            return BurntToast;
        }());
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmdfbW9kdWxlX3NwZWMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9jb3JlL3Rlc3QvcmVuZGVyMy9jb21waWxlcl9jYW5vbmljYWwvbmdfbW9kdWxlX3NwZWMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRzs7Ozs7Ozs7Ozs7Ozs7QUFFSCx1Q0FBeUM7QUFDekMsMENBQXNUO0FBQ3RULCtEQUFpRTtBQUlqRSx1QkFBdUI7QUFDdkIsU0FBUyxDQUFDLFVBQVUsRUFBRTtJQU9wQiwwQkFBMEIsSUFBZ0I7UUFDeEMsbUZBQW1GO1FBQ25GLE9BQU8sSUFBSSxDQUFDO0lBQ2QsQ0FBQztJQUNELHdCQUF3QixJQUFTO1FBQy9CLG1GQUFtRjtRQUNuRixPQUFPLElBQUksQ0FBQztJQUNkLENBQUM7SUFDRCxFQUFFLENBQUMsdUJBQXVCLEVBQUU7UUFFMUI7WUFDRSxlQUFZLElBQVk7WUFBRyxDQUFDO3NCQUR4QixLQUFLOztZQUVULFlBQVk7WUFDTCxxQkFBZSxHQUFHLGdCQUFnQixDQUFDO2dCQUN4QyxPQUFPLEVBQUUsY0FBTSxPQUFBLElBQUksT0FBSyxDQUFDLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUF4QyxDQUF3QzthQUN4RCxDQUFDLENBQUM7WUFMQyxLQUFLO2dCQURWLGlCQUFVLEVBQUU7aURBRU8sTUFBTTtlQURwQixLQUFLLENBT1Y7WUFBRCxZQUFDO1NBQUEsQUFQRCxJQU9DO1FBRUQ7WUFBQTtZQUlBLENBQUM7WUFIQyxZQUFZO1lBQ0wsMEJBQWEsR0FBRyxjQUFjLENBQUMsRUFBRSxDQUFDLENBQUM7WUFFNUMsbUJBQUM7U0FBQSxBQUpELElBSUM7UUFNRDtZQUNFLGtCQUFZLEtBQVk7WUFBRyxDQUFDO3lCQUR4QixRQUFROztZQUVaLFlBQVk7WUFDTCxzQkFBYSxHQUFHLGNBQWMsQ0FBQztnQkFDcEMsT0FBTyxFQUFFLGNBQU0sT0FBQSxJQUFJLFVBQVEsQ0FBQyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBMUMsQ0FBMEM7Z0JBQ3pELFFBQVEsRUFBRTtvQkFDUixFQUFDLE9BQU8sRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFLENBQUMsTUFBTSxDQUFDLEVBQUM7b0JBQ2hDLEtBQUs7b0JBQ0wsRUFBQyxPQUFPLEVBQUUsTUFBTSxFQUFFLFFBQVEsRUFBRSxPQUFPLEVBQUM7aUJBQ3JDO2dCQUNELE9BQU8sRUFBRSxDQUFDLFlBQVksQ0FBQzthQUN4QixDQUFDLENBQUM7WUFYQyxRQUFRO2dCQUpiLGVBQVEsQ0FBQztvQkFDUixTQUFTLEVBQUUsQ0FBQyxLQUFLLEVBQUUsRUFBQyxPQUFPLEVBQUUsTUFBTSxFQUFFLFFBQVEsRUFBRSxPQUFPLEVBQUMsQ0FBQztvQkFDeEQsT0FBTyxFQUFFLENBQUMsWUFBWSxDQUFDO2lCQUN4QixDQUFDO2lEQUVtQixLQUFLO2VBRHBCLFFBQVEsQ0FhYjtZQUFELGVBQUM7U0FBQSxBQWJELElBYUM7UUFHRDtZQUNFLG9CQUF3QixLQUFpQixFQUFFLElBQVk7WUFBRyxDQUFDOzJCQUR2RCxVQUFVOztZQUVkLFlBQVk7WUFDTCwwQkFBZSxHQUFHLGdCQUFnQixDQUFDO2dCQUN4QyxVQUFVLEVBQUUsUUFBUTtnQkFDcEIsT0FBTyxFQUFFLGNBQU0sT0FBQSxJQUFJLFlBQVUsQ0FDaEIsSUFBSSxDQUFDLGdCQUFnQixDQUFDLEtBQUssbUJBQThCLEVBQ3pELElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUY1QixDQUU0QjthQUM1QyxDQUFDLENBQUM7WUFSQyxVQUFVO2dCQURmLGlCQUFVLEVBQUMsY0FBYyxDQUFDO2dCQUVaLFdBQUEsZUFBUSxFQUFFLENBQUE7eURBQTBCLE1BQU07ZUFEbkQsVUFBVSxDQVVmO1lBQUQsaUJBQUM7U0FBQSxBQVZELElBVUM7SUFFSCxDQUFDLENBQUMsQ0FBQztBQUNMLENBQUMsQ0FBQyxDQUFDIn0=