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
var index_1 = require("../../../src/render3/index");
var render_util_1 = require("../render_util");
/**
 * NORMATIVE => /NORMATIVE: Designates what the compiler is expected to generate.
 *
 * All local variable names are considered non-normative (informative). They should be
 * wrapped in $ on each end to simplify testing on the compiler side.
 */
describe('compiler sanitization', function () {
    it('should translate DOM structure', function () {
        var MyComponent = /** @class */ (function () {
            function MyComponent() {
                this.innerHTML = '<frame></frame>';
                this.hidden = true;
                this.style = "url(\"http://evil\")";
                this.url = 'javascript:evil()';
                // /NORMATIVE
            }
            MyComponent_1 = MyComponent;
            var MyComponent_1;
            // NORMATIVE
            MyComponent.ngComponentDef = $r3$.ɵdefineComponent({
                type: MyComponent_1,
                selectors: [['my-component']],
                factory: function MyComponent_Factory() { return new MyComponent_1(); },
                template: function MyComponent_Template(rf, ctx) {
                    if (rf & 1) {
                        $r3$.ɵE(0, 'div');
                        $r3$.ɵs(['background-image']);
                        $r3$.ɵe();
                        $r3$.ɵEe(1, 'img');
                    }
                    if (rf & 2) {
                        $r3$.ɵp(0, 'innerHTML', $r3$.ɵb(ctx.innerHTML), $r3$.ɵsanitizeHtml);
                        $r3$.ɵp(0, 'hidden', $r3$.ɵb(ctx.hidden));
                        $r3$.ɵsp(0, 0, ctx.style);
                        $r3$.ɵsa(0);
                        $r3$.ɵp(1, 'src', $r3$.ɵb(ctx.url), $r3$.ɵsanitizeUrl);
                        $r3$.ɵa(1, 'srcset', $r3$.ɵb(ctx.url), $r3$.ɵsanitizeUrl);
                    }
                }
            });
            MyComponent = MyComponent_1 = __decorate([
                core_1.Component({
                    selector: 'my-component',
                    template: "<div [innerHTML]=\"innerHTML\" [hidden]=\"hidden\"></div>" +
                        "<img [style.background-image]=\"style\" [src]=\"src\">" +
                        "<script [attr.src]=src></script>"
                })
            ], MyComponent);
            return MyComponent;
        }());
        var myComponent = render_util_1.renderComponent(MyComponent);
        var div = index_1.getHostElement(myComponent).querySelector('div');
        // because sanitizer removed it is working.
        expect(div.innerHTML).toEqual('');
        expect(div.hidden).toEqual(true);
        var img = index_1.getHostElement(myComponent).querySelector('img');
        // because sanitizer removed it is working.
        expect(img.getAttribute('src')).toEqual('unsafe:javascript:evil()');
        // because sanitizer removed it is working.
        expect(img.style.getPropertyValue('background-image')).toEqual('');
        // because sanitizer removed it is working.
        expect(img.getAttribute('srcset')).toEqual('unsafe:javascript:evil()');
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2FuaXRpemVfc3BlYy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2NvcmUvdGVzdC9yZW5kZXIzL2NvbXBpbGVyX2Nhbm9uaWNhbC9zYW5pdGl6ZV9zcGVjLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7Ozs7Ozs7O0FBRUgsMENBQXNUO0FBQ3RULCtEQUFpRTtBQUNqRSxvREFBMEQ7QUFDMUQsOENBQXVEO0FBRXZEOzs7OztHQUtHO0FBRUgsUUFBUSxDQUFDLHVCQUF1QixFQUFFO0lBR2hDLEVBQUUsQ0FBQyxnQ0FBZ0MsRUFBRTtRQVNuQztZQU5BO2dCQU9FLGNBQVMsR0FBVyxpQkFBaUIsQ0FBQztnQkFDdEMsV0FBTSxHQUFZLElBQUksQ0FBQztnQkFDdkIsVUFBSyxHQUFXLHNCQUFvQixDQUFDO2dCQUNyQyxRQUFHLEdBQVcsbUJBQW1CLENBQUM7Z0JBd0JsQyxhQUFhO1lBQ2YsQ0FBQzs0QkE3QkssV0FBVzs7WUFNZixZQUFZO1lBQ0wsMEJBQWMsR0FBRyxJQUFJLENBQUMsZ0JBQWdCLENBQUM7Z0JBQzVDLElBQUksRUFBRSxhQUFXO2dCQUNqQixTQUFTLEVBQUUsQ0FBQyxDQUFDLGNBQWMsQ0FBQyxDQUFDO2dCQUM3QixPQUFPLEVBQUUsaUNBQWlDLE9BQU8sSUFBSSxhQUFXLEVBQUUsQ0FBQyxDQUFDLENBQUM7Z0JBQ3JFLFFBQVEsRUFBRSw4QkFBOEIsRUFBaUIsRUFBRSxHQUFrQjtvQkFDM0UsSUFBSSxFQUFFLEdBQUcsQ0FBQyxFQUFFO3dCQUNWLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLEtBQUssQ0FBQyxDQUFDO3dCQUNsQixJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsa0JBQWtCLENBQUMsQ0FBQyxDQUFDO3dCQUM5QixJQUFJLENBQUMsRUFBRSxFQUFFLENBQUM7d0JBQ1YsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsS0FBSyxDQUFDLENBQUM7cUJBQ3BCO29CQUNELElBQUksRUFBRSxHQUFHLENBQUMsRUFBRTt3QkFDVixJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxXQUFXLEVBQUUsSUFBSSxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLEVBQUUsSUFBSSxDQUFDLGFBQWEsQ0FBQyxDQUFDO3dCQUNwRSxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxRQUFRLEVBQUUsSUFBSSxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQzt3QkFDMUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQzt3QkFDMUIsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQzt3QkFDWixJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxLQUFLLEVBQUUsSUFBSSxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEVBQUUsSUFBSSxDQUFDLFlBQVksQ0FBQyxDQUFDO3dCQUN2RCxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxRQUFRLEVBQUUsSUFBSSxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEVBQUUsSUFBSSxDQUFDLFlBQVksQ0FBQyxDQUFDO3FCQUMzRDtnQkFDSCxDQUFDO2FBQ0YsQ0FBQyxDQUFDO1lBM0JDLFdBQVc7Z0JBTmhCLGdCQUFTLENBQUM7b0JBQ1QsUUFBUSxFQUFFLGNBQWM7b0JBQ3hCLFFBQVEsRUFBRSwyREFBdUQ7d0JBQzdELHdEQUFvRDt3QkFDcEQsa0NBQWtDO2lCQUN2QyxDQUFDO2VBQ0ksV0FBVyxDQTZCaEI7WUFBRCxrQkFBQztTQUFBLEFBN0JELElBNkJDO1FBRUQsSUFBTSxXQUFXLEdBQUcsNkJBQWUsQ0FBQyxXQUFXLENBQUMsQ0FBQztRQUNqRCxJQUFNLEdBQUcsR0FBRyxzQkFBYyxDQUFDLFdBQVcsQ0FBQyxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUcsQ0FBQztRQUMvRCwyQ0FBMkM7UUFDM0MsTUFBTSxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLENBQUM7UUFDbEMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUM7UUFFakMsSUFBTSxHQUFHLEdBQUcsc0JBQWMsQ0FBQyxXQUFXLENBQUMsQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFHLENBQUM7UUFDL0QsMkNBQTJDO1FBQzNDLE1BQU0sQ0FBQyxHQUFHLENBQUMsWUFBWSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLDBCQUEwQixDQUFDLENBQUM7UUFDcEUsMkNBQTJDO1FBQzNDLE1BQU0sQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLGdCQUFnQixDQUFDLGtCQUFrQixDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLENBQUM7UUFDbkUsMkNBQTJDO1FBQzNDLE1BQU0sQ0FBQyxHQUFHLENBQUMsWUFBWSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLDBCQUEwQixDQUFDLENBQUM7SUFDekUsQ0FBQyxDQUFDLENBQUM7QUFFTCxDQUFDLENBQUMsQ0FBQyJ9