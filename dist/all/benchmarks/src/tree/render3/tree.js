"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var util_1 = require("../util");
function destroyDom(component) {
    component.data = util_1.emptyTree;
    core_1.ɵdetectChanges(component);
}
exports.destroyDom = destroyDom;
function createDom(component) {
    component.data = util_1.buildTree();
    core_1.ɵdetectChanges(component);
}
exports.createDom = createDom;
var numberOfChecksEl = document.getElementById('numberOfChecks');
var detectChangesRuns = 0;
function detectChanges(component) {
    for (var i = 0; i < 10; i++) {
        core_1.ɵdetectChanges(component);
    }
    detectChangesRuns += 10;
    numberOfChecksEl.textContent = "" + detectChangesRuns;
}
exports.detectChanges = detectChanges;
var c0 = ['background-color'];
var TreeComponent = /** @class */ (function () {
    function TreeComponent() {
        this.data = util_1.emptyTree;
    }
    /** @nocollapse */
    TreeComponent.ngComponentDef = core_1.ɵdefineComponent({
        type: TreeComponent,
        selectors: [['tree']],
        template: function (rf, ctx) {
            if (rf & 1 /* Create */) {
                core_1.ɵE(0, 'span');
                core_1.ɵs(null, c0);
                {
                    core_1.ɵT(1);
                }
                core_1.ɵe();
                core_1.ɵC(2);
                core_1.ɵC(3);
            }
            if (rf & 2 /* Update */) {
                core_1.ɵsp(0, 0, ctx.data.depth % 2 ? '' : 'grey');
                core_1.ɵt(1, core_1.ɵi1(' ', ctx.data.value, ' '));
                core_1.ɵcR(2);
                {
                    if (ctx.data.left != null) {
                        var rf0 = core_1.ɵV(0);
                        {
                            if (rf0 & 1 /* Create */) {
                                core_1.ɵE(0, 'tree');
                                core_1.ɵe();
                            }
                            if (rf0 & 2 /* Update */) {
                                core_1.ɵp(0, 'data', core_1.ɵb(ctx.data.left));
                            }
                        }
                        core_1.ɵv();
                    }
                }
                core_1.ɵcr();
                core_1.ɵcR(3);
                {
                    if (ctx.data.right != null) {
                        var rf0 = core_1.ɵV(0);
                        {
                            if (rf0 & 1 /* Create */) {
                                core_1.ɵE(0, 'tree');
                                core_1.ɵe();
                            }
                            if (rf0 & 2 /* Update */) {
                                core_1.ɵp(0, 'data', core_1.ɵb(ctx.data.right));
                            }
                        }
                        core_1.ɵv();
                    }
                }
                core_1.ɵcr();
            }
        },
        factory: function () { return new TreeComponent; },
        inputs: { data: 'data' },
        directives: function () { return [TreeComponent]; }
    });
    return TreeComponent;
}());
exports.TreeComponent = TreeComponent;
var TreeFunction = /** @class */ (function () {
    function TreeFunction() {
        this.data = util_1.emptyTree;
    }
    /** @nocollapse */
    TreeFunction.ngComponentDef = core_1.ɵdefineComponent({
        type: TreeFunction,
        selectors: [['tree']],
        template: function (rf, ctx) {
            // bit of a hack
            TreeTpl(rf, ctx.data);
        },
        factory: function () { return new TreeFunction; },
        inputs: { data: 'data' }
    });
    return TreeFunction;
}());
exports.TreeFunction = TreeFunction;
var c1 = ['background-color'];
function TreeTpl(rf, ctx) {
    if (rf & 1 /* Create */) {
        core_1.ɵE(0, 'tree');
        {
            core_1.ɵE(1, 'span');
            core_1.ɵs(null, c1);
            {
                core_1.ɵT(2);
            }
            core_1.ɵe();
            core_1.ɵC(3);
            core_1.ɵC(4);
        }
        core_1.ɵe();
    }
    if (rf & 2 /* Update */) {
        core_1.ɵsp(1, 0, ctx.depth % 2 ? '' : 'grey');
        core_1.ɵt(2, core_1.ɵi1(' ', ctx.value, ' '));
        core_1.ɵcR(3);
        {
            if (ctx.left != null) {
                var rf0 = core_1.ɵV(0);
                {
                    TreeTpl(rf0, ctx.left);
                }
                core_1.ɵv();
            }
        }
        core_1.ɵcr();
        core_1.ɵcR(4);
        {
            if (ctx.right != null) {
                var rf0 = core_1.ɵV(0);
                {
                    TreeTpl(rf0, ctx.right);
                }
                core_1.ɵv();
            }
        }
        core_1.ɵcr();
    }
}
exports.TreeTpl = TreeTpl;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHJlZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL21vZHVsZXMvYmVuY2htYXJrcy9zcmMvdHJlZS9yZW5kZXIzL3RyZWUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRzs7QUFFSCxzQ0FBNlI7QUFFN1IsZ0NBQXVEO0FBRXZELG9CQUEyQixTQUF3QjtJQUNqRCxTQUFTLENBQUMsSUFBSSxHQUFHLGdCQUFTLENBQUM7SUFDM0IscUJBQWMsQ0FBQyxTQUFTLENBQUMsQ0FBQztBQUM1QixDQUFDO0FBSEQsZ0NBR0M7QUFFRCxtQkFBMEIsU0FBd0I7SUFDaEQsU0FBUyxDQUFDLElBQUksR0FBRyxnQkFBUyxFQUFFLENBQUM7SUFDN0IscUJBQWMsQ0FBQyxTQUFTLENBQUMsQ0FBQztBQUM1QixDQUFDO0FBSEQsOEJBR0M7QUFFRCxJQUFNLGdCQUFnQixHQUFHLFFBQVEsQ0FBQyxjQUFjLENBQUMsZ0JBQWdCLENBQUcsQ0FBQztBQUNyRSxJQUFJLGlCQUFpQixHQUFHLENBQUMsQ0FBQztBQUMxQix1QkFBOEIsU0FBd0I7SUFDcEQsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRTtRQUMzQixxQkFBYyxDQUFDLFNBQVMsQ0FBQyxDQUFDO0tBQzNCO0lBQ0QsaUJBQWlCLElBQUksRUFBRSxDQUFDO0lBQ3hCLGdCQUFnQixDQUFDLFdBQVcsR0FBRyxLQUFHLGlCQUFtQixDQUFDO0FBQ3hELENBQUM7QUFORCxzQ0FNQztBQUVELElBQU0sRUFBRSxHQUFHLENBQUMsa0JBQWtCLENBQUMsQ0FBQztBQUNoQztJQUFBO1FBQ0UsU0FBSSxHQUFhLGdCQUFTLENBQUM7SUEwRDdCLENBQUM7SUF4REMsa0JBQWtCO0lBQ1gsNEJBQWMsR0FBRyx1QkFBZSxDQUFDO1FBQ3RDLElBQUksRUFBRSxhQUFhO1FBQ25CLFNBQVMsRUFBRSxDQUFDLENB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