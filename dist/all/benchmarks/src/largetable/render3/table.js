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
var c0 = ['background-color'];
var LargeTableComponent = /** @class */ (function () {
    function LargeTableComponent() {
        this.data = util_1.emptyTable;
    }
    /** @nocollapse */
    LargeTableComponent.ngComponentDef = core_1.ɵdefineComponent({
        type: LargeTableComponent,
        selectors: [['largetable']],
        template: function (rf, ctx) {
            if (rf & 1 /* Create */) {
                core_1.ɵE(0, 'table');
                {
                    core_1.ɵE(1, 'tbody');
                    {
                        core_1.ɵC(2);
                    }
                    core_1.ɵe();
                }
                core_1.ɵe();
            }
            if (rf & 2 /* Update */) {
                core_1.ɵcR(2);
                {
                    for (var _i = 0, _a = ctx.data; _i < _a.length; _i++) {
                        var row = _a[_i];
                        var rf1 = core_1.ɵV(1);
                        {
                            if (rf1 & 1 /* Create */) {
                                core_1.ɵE(0, 'tr');
                                core_1.ɵC(1);
                                core_1.ɵe();
                            }
                            if (rf1 & 2 /* Update */) {
                                core_1.ɵcR(1);
                                {
                                    for (var _b = 0, row_1 = row; _b < row_1.length; _b++) {
                                        var cell = row_1[_b];
                                        var rf2 = core_1.ɵV(2);
                                        {
                                            if (rf2 & 1 /* Create */) {
                                                core_1.ɵE(0, 'td');
                                                core_1.ɵs(null, c0);
                                                {
                                                    core_1.ɵT(1);
                                                }
                                                core_1.ɵe();
                                            }
                                            if (rf2 & 2 /* Update */) {
                                                core_1.ɵsp(0, 0, null, cell.row % 2 ? '' : 'grey');
                                                core_1.ɵt(1, core_1.ɵb(cell.value));
                                            }
                                        }
                                        core_1.ɵv();
                                    }
                                }
                                core_1.ɵcr();
                            }
                        }
                        core_1.ɵv();
                    }
                }
                core_1.ɵcr();
            }
        },
        factory: function () { return new LargeTableComponent(); },
        inputs: { data: 'data' }
    });
    return LargeTableComponent;
}());
exports.LargeTableComponent = LargeTableComponent;
function destroyDom(component) {
    component.data = util_1.emptyTable;
    core_1.ɵdetectChanges(component);
}
exports.destroyDom = destroyDom;
function createDom(component) {
    component.data = util_1.buildTable();
    core_1.ɵdetectChanges(component);
}
exports.createDom = createDom;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGFibGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9tb2R1bGVzL2JlbmNobWFya3Mvc3JjL2xhcmdldGFibGUvcmVuZGVyMy90YWJsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7OztHQU1HOztBQUVILHNDQUE0UjtBQUc1UixnQ0FBMEQ7QUFFMUQsSUFBTSxFQUFFLEdBQUcsQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDO0FBQ2hDO0lBQUE7UUFDRSxTQUFJLEdBQWtCLGlCQUFVLENBQUM7SUEyRG5DLENBQUM7SUF6REMsa0JBQWtCO0lBQ1gsa0NBQWMsR0FBOEMsdUJBQWUsQ0FBQztRQUNqRixJQUFJLEVBQUUsbUJBQW1CO1FBQ3pCLFNBQVMsRUFBRSxDQUFDLENBQUMsWUFBWSxDQUFDLENBQUM7UUFDM0IsUUFBUSxFQUFFLFVBQVMsRUFBZSxFQUFFLEdBQXdCO1lBQzFELElBQUksRUFBRSxpQkFBcUIsRUFBRTtnQkFDM0IsU0FBQyxDQUFDLENBQUMsRUFBRSxPQUFPLENBQUMsQ0FBQztnQkFDZDtvQkFDRSxTQUFDLENBQUMsQ0FBQyxFQUFFLE9BQU8sQ0FBQyxDQUFDO29CQUNkO3dCQUFFLFNBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztxQkFBRTtvQkFDVCxTQUFDLEVBQUUsQ0FBQztpQkFDTDtnQkFDRCxTQUFDLEVBQUUsQ0FBQzthQUNMO1lBQ0QsSUFBSSxFQUFFLGlCQUFxQixFQUFFO2dCQUMzQixVQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ047b0JBQ0UsS0FBZ0IsVUFBUSxFQUFSLEtBQUEsR0FBRyxDQUFDLElBQUksRUFBUixjQUFRLEVBQVIsSUFBUSxFQUFFO3dCQUFyQixJQUFJLEdBQUcsU0FBQTt3QkFDVixJQUFJLEdBQUcsR0FBRyxTQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7d0JBQ2Y7NEJBQ0UsSUFBSSxHQUFHLGlCQUFxQixFQUFFO2dDQUM1QixTQUFDLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDO2dDQUNYLFNBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQ0FDTCxTQUFDLEVBQUUsQ0FBQzs2QkFDTDs0QkFDRCxJQUFJLEdBQUcsaUJBQXFCLEVBQUU7Z0NBQzVCLFVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQ0FDTjtvQ0FDRSxLQUFpQixVQUFHLEVBQUgsV0FBRyxFQUFILGlCQUFHLEVBQUgsSUFBRyxFQUFFO3dDQUFqQixJQUFJLElBQUksWUFBQTt3Q0FDWCxJQUFJLEdBQUcsR0FBRyxTQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7d0NBQ2Y7NENBQ0UsSUFBSSxHQUFHLGlCQUFxQixFQUFFO2dEQUM1QixTQUFDLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDO2dEQUNYLFNBQUMsQ0FBQyxJQUFJLEVBQUUsRUFBRSxDQUFDLENBQUM7Z0RBQ1o7b0RBQUUsU0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO2lEQUFFO2dEQUNULFNBQUMsRUFBRSxDQUFDOzZDQUNMOzRDQUNELElBQUksR0FBRyxpQkFBcUIsRUFBRTtnREFDNUIsVUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsSUFBSSxFQUFFLElBQUksQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDO2dEQUMzQyxTQUFDLENBQUMsQ0FBQyxFQUFFLFNBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQzs2Q0FDckI7eUNBQ0Y7d0NBQ0QsU0FBQyxFQUFFLENBQUM7cUNBQ0w7aUNBQ0Y7Z0NBQ0QsVUFBRSxFQUFFLENBQUM7NkJBQ047eUJBQ0Y7d0JBQ0QsU0FBQyxFQUFFLENBQUM7cUJBQ0w7aUJBQ0Y7Z0JBQ0QsVUFBRSxFQUFFLENBQUM7YUFDTjtRQUNILENBQUM7UUFDRCxPQUFPLEVBQUUsY0FBTSxPQUFBLElBQUksbUJBQW1CLEVBQUUsRUFBekIsQ0FBeUI7UUFDeEMsTUFBTSxFQUFFLEVBQUMsSUFBSSxFQUFFLE1BQU0sRUFBQztLQUN2QixDQUFDLENBQUM7SUFDTCwwQkFBQztDQUFBLEFBNURELElBNERDO0FBNURZLGtEQUFtQjtBQThEaEMsb0JBQTJCLFNBQThCO0lBQ3ZELFNBQVMsQ0FBQyxJQUFJLEdBQUcsaUJBQVUsQ0FBQztJQUM1QixxQkFBYSxDQUFDLFNBQVMsQ0FBQyxDQUFDO0FBQzNCLENBQUM7QUFIRCxnQ0FHQztBQUVELG1CQUEwQixTQUE4QjtJQUN0RCxTQUFTLENBQUMsSUFBSSxHQUFHLGlCQUFVLEVBQUUsQ0FBQztJQUM5QixxQkFBYSxDQUFDLFNBQVMsQ0FBQyxDQUFDO0FBQzNCLENBQUM7QUFIRCw4QkFHQyJ9