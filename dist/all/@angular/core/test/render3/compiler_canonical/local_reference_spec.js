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
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("../../../src/core");
var $r3$ = require("../../../src/core_render3_private_export");
var render_util_1 = require("../render_util");
/// See: `normative.md`
describe('local references', function () {
    // TODO(misko): currently disabled until local refs are working
    xit('should translate DOM structure', function () {
        var MyComponent = /** @class */ (function () {
            function MyComponent() {
            }
            MyComponent_1 = MyComponent;
            var MyComponent_1;
            // NORMATIVE
            MyComponent.ngComponentDef = $r3$.ɵdefineComponent({
                type: MyComponent_1,
                selectors: [['my-component']],
                factory: function () { return new MyComponent_1; },
                template: function (rf, ctx) {
                    var l1_user;
                    if (rf & 1) {
                        $r3$.ɵEe(0, 'input', null, ['user', '']);
                        $r3$.ɵT(2);
                    }
                    if (rf & 2) {
                        l1_user = $r3$.ɵld(1);
                        $r3$.ɵt(2, $r3$.ɵi1('Hello ', l1_user.value, '!'));
                    }
                }
            });
            MyComponent = MyComponent_1 = __decorate([
                core_1.Component({ selector: 'my-component', template: "<input #user>Hello {{user.value}}!" })
            ], MyComponent);
            return MyComponent;
        }());
        expect(render_util_1.toHtml(render_util_1.renderComponent(MyComponent)))
            .toEqual('<div class="my-app" title="Hello">Hello <b>World</b>!</div>');
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG9jYWxfcmVmZXJlbmNlX3NwZWMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9jb3JlL3Rlc3QvcmVuZGVyMy9jb21waWxlcl9jYW5vbmljYWwvbG9jYWxfcmVmZXJlbmNlX3NwZWMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRzs7Ozs7Ozs7QUFFSCwwQ0FBc1Q7QUFDdFQsK0RBQWlFO0FBQ2pFLDhDQUF1RDtBQUV2RCx1QkFBdUI7QUFDdkIsUUFBUSxDQUFDLGtCQUFrQixFQUFFO0lBRzNCLCtEQUErRDtJQUMvRCxHQUFHLENBQUMsZ0NBQWdDLEVBQUU7UUFJcEM7WUFBQTtZQW1CQSxDQUFDOzRCQW5CSyxXQUFXOztZQUNmLFlBQVk7WUFDTCwwQkFBYyxHQUFHLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQztnQkFDNUMsSUFBSSxFQUFFLGFBQVc7Z0JBQ2pCLFNBQVMsRUFBRSxDQUFDLENBQUMsY0FBYyxDQUFDLENBQUM7Z0JBQzdCLE9BQU8sRUFBRSxjQUFNLE9BQUEsSUFBSSxhQUFXLEVBQWYsQ0FBZTtnQkFDOUIsUUFBUSxFQUFFLFVBQVMsRUFBaUIsRUFBRSxHQUFrQjtvQkFDdEQsSUFBSSxPQUFZLENBQUM7b0JBQ2pCLElBQUksRUFBRSxHQUFHLENBQUMsRUFBRTt3QkFDVixJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxPQUFPLEVBQUUsSUFBSSxFQUFFLENBQUMsTUFBTSxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUM7d0JBQ3pDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7cUJBQ1o7b0JBQ0QsSUFBSSxFQUFFLEdBQUcsQ0FBQyxFQUFFO3dCQUNWLE9BQU8sR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFNLENBQUMsQ0FBQyxDQUFDO3dCQUMzQixJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsR0FBRyxDQUFDLFFBQVEsRUFBRSxPQUFPLENBQUMsS0FBSyxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUM7cUJBQ3BEO2dCQUNILENBQUM7YUFDRixDQUFDLENBQUM7WUFqQkMsV0FBVztnQkFEaEIsZ0JBQVMsQ0FBQyxFQUFDLFFBQVEsRUFBRSxjQUFjLEVBQUUsUUFBUSxFQUFFLG9DQUFvQyxFQUFDLENBQUM7ZUFDaEYsV0FBVyxDQW1CaEI7WUFBRCxrQkFBQztTQUFBLEFBbkJELElBbUJDO1FBRUQsTUFBTSxDQUFDLG9CQUFNLENBQUMsNkJBQWUsQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDO2FBQ3ZDLE9BQU8sQ0FBQyw2REFBNkQsQ0FBQyxDQUFDO0lBQzlFLENBQUMsQ0FBQyxDQUFDO0FBQ0wsQ0FBQyxDQUFDLENBQUMifQ==