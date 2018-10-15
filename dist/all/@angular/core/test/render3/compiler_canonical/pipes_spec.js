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
var core_1 = require("../../../src/core");
var $r3$ = require("../../../src/core_render3_private_export");
var render_util_1 = require("../render_util");
/// See: `normative.md`
describe('pipes', function () {
    var myPipeTransformCalls = 0;
    var myPurePipeTransformCalls = 0;
    var MyPipe = /** @class */ (function () {
        function MyPipe() {
            this.numberOfBang = 1;
            // /NORMATIVE
        }
        MyPipe_1 = MyPipe;
        MyPipe.prototype.transform = function (value, size) {
            var result = value.substring(size);
            for (var i = 0; i < this.numberOfBang; i++)
                result += '!';
            this.numberOfBang++;
            myPipeTransformCalls++;
            return result;
        };
        MyPipe.prototype.ngOnDestroy = function () { this.numberOfBang = 1; };
        var MyPipe_1;
        // NORMATIVE
        MyPipe.ngPipeDef = $r3$.ɵdefinePipe({
            name: 'myPipe',
            type: MyPipe_1,
            factory: function MyPipe_Factory() { return new MyPipe_1(); },
            pure: false,
        });
        MyPipe = MyPipe_1 = __decorate([
            core_1.Pipe({
                name: 'myPipe',
                pure: false,
            })
        ], MyPipe);
        return MyPipe;
    }());
    var MyPurePipe = /** @class */ (function () {
        function MyPurePipe() {
        }
        MyPurePipe_1 = MyPurePipe;
        MyPurePipe.prototype.transform = function (value, size) {
            myPurePipeTransformCalls++;
            return value.substring(size);
        };
        var MyPurePipe_1;
        // NORMATIVE
        MyPurePipe.ngPipeDef = $r3$.ɵdefinePipe({
            name: 'myPurePipe',
            type: MyPurePipe_1,
            factory: function MyPurePipe_Factory() { return new MyPurePipe_1(); },
            pure: true,
        });
        MyPurePipe = MyPurePipe_1 = __decorate([
            core_1.Pipe({
                name: 'myPurePipe',
                pure: true,
            })
        ], MyPurePipe);
        return MyPurePipe;
    }());
    it('should render pipes', function () {
        myPipeTransformCalls = 0;
        myPurePipeTransformCalls = 0;
        var MyApp = /** @class */ (function () {
            function MyApp() {
                this.name = '12World';
                this.size = 1;
                // /NORMATIVE
            }
            MyApp_1 = MyApp;
            var MyApp_1;
            // NORMATIVE
            MyApp.ngComponentDef = $r3$.ɵdefineComponent({
                type: MyApp_1,
                selectors: [['my-app']],
                factory: function MyApp_Factory() { return new MyApp_1(); },
                template: function MyApp_Template(rf, ctx) {
                    if (rf & 1) {
                        $r3$.ɵT(0);
                        $r3$.ɵPp(1, 'myPipe');
                        $r3$.ɵPp(2, 'myPurePipe');
                        $r3$.ɵrS(6);
                    }
                    if (rf & 2) {
                        $r3$.ɵt(0, $r3$.ɵi1('', $r3$.ɵpb2(1, 6, $r3$.ɵpb2(2, 3, ctx.name, ctx.size), ctx.size), ''));
                    }
                }
            });
            MyApp = MyApp_1 = __decorate([
                core_1.Component({ template: "{{name | myPipe:size | myPurePipe:size }}" })
            ], MyApp);
            return MyApp;
        }());
        // NON-NORMATIVE
        MyApp.ngComponentDef.pipeDefs =
            function () { return [MyPurePipe.ngPipeDef, MyPipe.ngPipeDef]; };
        // /NON-NORMATIVE
        var myApp = render_util_1.renderComponent(MyApp);
        expect(render_util_1.toHtml(render_util_1.containerEl)).toEqual('World!');
        expect(myPurePipeTransformCalls).toEqual(1);
        expect(myPipeTransformCalls).toEqual(1);
        $r3$.ɵdetectChanges(myApp);
        expect(render_util_1.toHtml(render_util_1.containerEl)).toEqual('World!!');
        expect(myPurePipeTransformCalls).toEqual(1);
        expect(myPipeTransformCalls).toEqual(2);
        myApp.name = '34WORLD';
        $r3$.ɵdetectChanges(myApp);
        expect(render_util_1.toHtml(render_util_1.containerEl)).toEqual('WORLD!!!');
        expect(myPurePipeTransformCalls).toEqual(2);
        expect(myPipeTransformCalls).toEqual(3);
    });
    it('should render many pipes and forward the first instance (pure or impure pipe)', function () {
        myPipeTransformCalls = 0;
        myPurePipeTransformCalls = 0;
        var OneTimeIf = /** @class */ (function () {
            function OneTimeIf(view, template) {
                this.view = view;
                this.template = template;
            }
            OneTimeIf_1 = OneTimeIf;
            OneTimeIf.prototype.ngDoCheck = function () {
                if (this.oneTimeIf) {
                    this.view.createEmbeddedView(this.template);
                }
            };
            var OneTimeIf_1;
            // NORMATIVE
            OneTimeIf.ngDirectiveDef = $r3$.ɵdefineDirective({
                type: OneTimeIf_1,
                selectors: [['', 'oneTimeIf', '']],
                factory: function () { return new OneTimeIf_1($r3$.ɵinjectViewContainerRef(), $r3$.ɵinjectTemplateRef()); },
                inputs: { oneTimeIf: 'oneTimeIf' }
            });
            __decorate([
                core_1.Input(),
                __metadata("design:type", Object)
            ], OneTimeIf.prototype, "oneTimeIf", void 0);
            OneTimeIf = OneTimeIf_1 = __decorate([
                core_1.Directive({
                    selector: '[oneTimeIf]',
                }),
                __metadata("design:paramtypes", [core_1.ViewContainerRef, core_1.TemplateRef])
            ], OneTimeIf);
            return OneTimeIf;
        }());
        var MyApp = /** @class */ (function () {
            function MyApp() {
                this.name = '1World';
                this.size = 1;
                this.more = true;
                // /NORMATIVE
            }
            MyApp_2 = MyApp;
            var MyApp_2;
            // NORMATIVE
            MyApp.ngComponentDef = $r3$.ɵdefineComponent({
                type: MyApp_2,
                selectors: [['my-app']],
                factory: function MyApp_Factory() { return new MyApp_2(); },
                template: function MyApp_Template(rf, ctx) {
                    if (rf & 1) {
                        $r3$.ɵT(0);
                        $r3$.ɵPp(1, 'myPurePipe');
                        $r3$.ɵT(2);
                        $r3$.ɵPp(3, 'myPurePipe');
                        $r3$.ɵC(4, C4, '', ['oneTimeIf', '']);
                        $r3$.ɵrS(6);
                    }
                    if (rf & 2) {
                        $r3$.ɵt(0, $r3$.ɵi1('', $r3$.ɵpb2(1, 3, ctx.name, ctx.size), ''));
                        $r3$.ɵt(2, $r3$.ɵi1('', $r3$.ɵpb2(3, 6, ctx.name, ctx.size), ''));
                        $r3$.ɵp(4, 'oneTimeIf', $r3$.ɵb(ctx.more));
                        $r3$.ɵcR(4);
                        $r3$.ɵcr();
                    }
                    function C4(rf, ctx1) {
                        if (rf & 1) {
                            $r3$.ɵE(0, 'div');
                            $r3$.ɵT(1);
                            $r3$.ɵPp(2, 'myPurePipe');
                            $r3$.ɵe();
                            $r3$.ɵrS(3);
                        }
                        if (rf & 2) {
                            $r3$.ɵt(1, $r3$.ɵi1('', $r3$.ɵpb2(2, 3, ctx.name, ctx.size), ''));
                        }
                    }
                }
            });
            MyApp = MyApp_2 = __decorate([
                core_1.Component({
                    template: "{{name | myPurePipe:size}}{{name | myPurePipe:size}}\n       <div *oneTimeIf=\"more\">{{name | myPurePipe:size}}</div>"
                })
            ], MyApp);
            return MyApp;
        }());
        // NON-NORMATIVE
        MyApp.ngComponentDef.directiveDefs = [OneTimeIf.ngDirectiveDef];
        MyApp.ngComponentDef.pipeDefs = [MyPurePipe.ngPipeDef];
        // /NON-NORMATIVE
        var myApp = render_util_1.renderComponent(MyApp);
        expect(render_util_1.toHtml(render_util_1.containerEl)).toEqual('WorldWorld<div>World</div>');
        expect(myPurePipeTransformCalls).toEqual(3);
        expect(myPipeTransformCalls).toEqual(0);
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGlwZXNfc3BlYy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2NvcmUvdGVzdC9yZW5kZXIzL2NvbXBpbGVyX2Nhbm9uaWNhbC9waXBlc19zcGVjLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7Ozs7Ozs7Ozs7O0FBRUgsMENBQXNUO0FBQ3RULCtEQUFpRTtBQUVqRSw4Q0FBb0U7QUFHcEUsdUJBQXVCO0FBQ3ZCLFFBQVEsQ0FBQyxPQUFPLEVBQUU7SUFJaEIsSUFBSSxvQkFBb0IsR0FBRyxDQUFDLENBQUM7SUFDN0IsSUFBSSx3QkFBd0IsR0FBRyxDQUFDLENBQUM7SUFNakM7UUFKQTtZQU1VLGlCQUFZLEdBQUcsQ0FBQyxDQUFDO1lBbUJ6QixhQUFhO1FBQ2YsQ0FBQzttQkF0QkssTUFBTTtRQUlWLDBCQUFTLEdBQVQsVUFBVSxLQUFhLEVBQUUsSUFBWTtZQUNuQyxJQUFJLE1BQU0sR0FBRyxLQUFLLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxDQUFDO1lBQ25DLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxJQUFJLENBQUMsWUFBWSxFQUFFLENBQUMsRUFBRTtnQkFBRSxNQUFNLElBQUksR0FBRyxDQUFDO1lBQzFELElBQUksQ0FBQyxZQUFZLEVBQUUsQ0FBQztZQUNwQixvQkFBb0IsRUFBRSxDQUFDO1lBQ3ZCLE9BQU8sTUFBTSxDQUFDO1FBQ2hCLENBQUM7UUFFRCw0QkFBVyxHQUFYLGNBQWdCLElBQUksQ0FBQyxZQUFZLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQzs7UUFFeEMsWUFBWTtRQUNMLGdCQUFTLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQztZQUNsQyxJQUFJLEVBQUUsUUFBUTtZQUNkLElBQUksRUFBRSxRQUFNO1lBQ1osT0FBTyxFQUFFLDRCQUE0QixPQUFPLElBQUksUUFBTSxFQUFFLENBQUMsQ0FBQyxDQUFDO1lB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QUFFLHdCQUF3QixFQUFpQixFQUFFLEdBQVk7b0JBQy9ELElBQUksRUFBRSxHQUFHLENBQUMsRUFBRTt3QkFDVixJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO3dCQUNYLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLFlBQVksQ0FBQyxDQUFDO3dCQUMxQixJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO3dCQUNYLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLFlBQVksQ0FBQyxDQUFDO3dCQUMxQixJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLENBQUMsV0FBVyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUM7d0JBQ3RDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7cUJBQ2I7b0JBQ0QsSUFBSSxFQUFFLEdBQUcsQ0FBQyxFQUFFO3dCQUNWLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxFQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxHQUFHLENBQUMsSUFBSSxFQUFFLEdBQUcsQ0FBQyxJQUFJLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDO3dCQUNsRSxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsRUFBRSxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxDQUFDLElBQUksRUFBRSxHQUFHLENBQUMsSUFBSSxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQzt3QkFDbEUsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsV0FBVyxFQUFFLElBQUksQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7d0JBQzNDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7d0JBQ1osSUFBSSxDQUFDLEdBQUcsRUFBRSxDQUFDO3FCQUNaO29CQUVELFlBQVksRUFBaUIsRUFBRSxJQUFXO3dCQUN4QyxJQUFJLEVBQUUsR0FBRyxDQUFDLEVBQUU7NEJBQ1YsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsS0FBSyxDQUFDLENBQUM7NEJBQ2xCLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7NEJBQ1gsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsWUFBWSxDQUFDLENBQUM7NEJBQzFCLElBQUksQ0FBQyxFQUFFLEVBQUUsQ0FBQzs0QkFDVixJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO3lCQUNiO3dCQUNELElBQUksRUFBRSxHQUFHLENBQUMsRUFBRTs0QkFDVixJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsRUFBRSxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxDQUFDLElBQUksRUFBRSxHQUFHLENBQUMsSUFBSSxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQzt5QkFDbkU7b0JBQ0gsQ0FBQztnQkFDSCxDQUFDO2FBQ0YsQ0FBQyxDQUFDO1lBeENDLEtBQUs7Z0JBSlYsZ0JBQVMsQ0FBQztvQkFDVCxRQUFRLEVBQUUsd0hBQytDO2lCQUMxRCxDQUFDO2VBQ0ksS0FBSyxDQTBDVjtZQUFELFlBQUM7U0FBQSxBQTFDRCxJQTBDQztRQUVELGdCQUFnQjtRQUNmLEtBQUssQ0FBQyxjQUE0QyxDQUFDLGFBQWEsR0FBRyxDQUFDLFNBQVMsQ0FBQyxjQUFjLENBQUMsQ0FBQztRQUM5RixLQUFLLENBQUMsY0FBNEMsQ0FBQyxRQUFRLEdBQUcsQ0FBQyxVQUFVLENBQUMsU0FBUyxDQUFDLENBQUM7UUFDdEYsaUJBQWlCO1FBRWpCLElBQUksS0FBSyxHQUFVLDZCQUFlLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDMUMsTUFBTSxDQUFDLG9CQUFNLENBQUMseUJBQVcsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLDRCQUE0QixDQUFDLENBQUM7UUFDbEUsTUFBTSxDQUFDLHdCQUF3QixDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQzVDLE1BQU0sQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUMxQyxDQUFDLENBQUMsQ0FBQztBQUNMLENBQUMsQ0FBQyxDQUFDIn0=