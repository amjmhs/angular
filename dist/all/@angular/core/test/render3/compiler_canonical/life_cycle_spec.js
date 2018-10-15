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
describe('lifecycle hooks', function () {
    var events = [];
    var simpleLayout;
    beforeEach(function () { events = []; });
    var LifecycleComp = /** @class */ (function () {
        function LifecycleComp() {
        }
        LifecycleComp_1 = LifecycleComp;
        LifecycleComp.prototype.ngOnChanges = function () { events.push('changes' + this.nameMin); };
        LifecycleComp.prototype.ngOnInit = function () { events.push('init' + this.nameMin); };
        LifecycleComp.prototype.ngDoCheck = function () { events.push('check' + this.nameMin); };
        LifecycleComp.prototype.ngAfterContentInit = function () { events.push('content init' + this.nameMin); };
        LifecycleComp.prototype.ngAfterContentChecked = function () { events.push('content check' + this.nameMin); };
        LifecycleComp.prototype.ngAfterViewInit = function () { events.push('view init' + this.nameMin); };
        LifecycleComp.prototype.ngAfterViewChecked = function () { events.push('view check' + this.nameMin); };
        LifecycleComp.prototype.ngOnDestroy = function () { events.push(this.nameMin); };
        var LifecycleComp_1;
        // NORMATIVE
        LifecycleComp.ngComponentDef = $r3$.ɵdefineComponent({
            type: LifecycleComp_1,
            selectors: [['lifecycle-comp']],
            factory: function LifecycleComp_Factory() { return new LifecycleComp_1(); },
            template: function LifecycleComp_Template(rf, ctx) { },
            inputs: { nameMin: ['name', 'nameMin'] },
            features: [$r3$.ɵNgOnChangesFeature]
        });
        __decorate([
            core_1.Input('name'),
            __metadata("design:type", String)
        ], LifecycleComp.prototype, "nameMin", void 0);
        LifecycleComp = LifecycleComp_1 = __decorate([
            core_1.Component({ selector: 'lifecycle-comp', template: "" })
        ], LifecycleComp);
        return LifecycleComp;
    }());
    var SimpleLayout = /** @class */ (function () {
        function SimpleLayout() {
            this.name1 = '1';
            this.name2 = '2';
            // /NORMATIVE
        }
        SimpleLayout_1 = SimpleLayout;
        var SimpleLayout_1;
        // NORMATIVE
        SimpleLayout.ngComponentDef = $r3$.ɵdefineComponent({
            type: SimpleLayout_1,
            selectors: [['simple-layout']],
            factory: function SimpleLayout_Factory() { return simpleLayout = new SimpleLayout_1(); },
            template: function SimpleLayout_Template(rf, ctx) {
                if (rf & 1) {
                    $r3$.ɵEe(0, 'lifecycle-comp');
                    $r3$.ɵEe(1, 'lifecycle-comp');
                }
                if (rf & 2) {
                    $r3$.ɵp(0, 'name', $r3$.ɵb(ctx.name1));
                    $r3$.ɵp(1, 'name', $r3$.ɵb(ctx.name2));
                }
            }
        });
        SimpleLayout = SimpleLayout_1 = __decorate([
            core_1.Component({
                selector: 'simple-layout',
                template: "\n      <lifecycle-comp [name]=\"name1\"></lifecycle-comp>\n      <lifecycle-comp [name]=\"name2\"></lifecycle-comp>\n    "
            })
        ], SimpleLayout);
        return SimpleLayout;
    }());
    // NON-NORMATIVE
    SimpleLayout.ngComponentDef.directiveDefs =
        [LifecycleComp.ngComponentDef];
    // /NON-NORMATIVE
    it('should gen hooks with a few simple components', function () {
        expect(render_util_1.toHtml(render_util_1.renderComponent(SimpleLayout)))
            .toEqual("<lifecycle-comp></lifecycle-comp><lifecycle-comp></lifecycle-comp>");
        expect(events).toEqual([
            'changes1', 'init1', 'check1', 'changes2', 'init2', 'check2', 'content init1',
            'content check1', 'content init2', 'content check2', 'view init1', 'view check1',
            'view init2', 'view check2'
        ]);
        events = [];
        simpleLayout.name1 = '-one';
        simpleLayout.name2 = '-two';
        $r3$.ɵdetectChanges(simpleLayout);
        expect(events).toEqual([
            'changes-one', 'check-one', 'changes-two', 'check-two', 'content check-one',
            'content check-two', 'view check-one', 'view check-two'
        ]);
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGlmZV9jeWNsZV9zcGVjLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvY29yZS90ZXN0L3JlbmRlcjMvY29tcGlsZXJfY2Fub25pY2FsL2xpZmVfY3ljbGVfc3BlYy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7OztHQU1HOzs7Ozs7Ozs7OztBQUVILDBDQUFzVDtBQUN0VCwrREFBaUU7QUFFakUsOENBQXVEO0FBR3ZELHVCQUF1QjtBQUN2QixRQUFRLENBQUMsaUJBQWlCLEVBQUU7SUFDMUIsSUFBSSxNQUFNLEdBQWEsRUFBRSxDQUFDO0lBQzFCLElBQUksWUFBMEIsQ0FBQztJQU0vQixVQUFVLENBQUMsY0FBUSxNQUFNLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFHbkM7UUFBQTtRQTJCQSxDQUFDOzBCQTNCSyxhQUFhO1FBSWpCLG1DQUFXLEdBQVgsY0FBZ0IsTUFBTSxDQUFDLElBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUV4RCxnQ0FBUSxHQUFSLGNBQWEsTUFBTSxDQUFDLElBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNsRCxpQ0FBUyxHQUFULGNBQWMsTUFBTSxDQUFDLElBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUVwRCwwQ0FBa0IsR0FBbEIsY0FBdUIsTUFBTSxDQUFDLElBQUksQ0FBQyxjQUFjLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNwRSw2Q0FBcUIsR0FBckIsY0FBMEIsTUFBTSxDQUFDLElBQUksQ0FBQyxlQUFlLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUV4RSx1Q0FBZSxHQUFmLGNBQW9CLE1B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