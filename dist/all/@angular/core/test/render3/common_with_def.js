"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
var common_1 = require("@angular/common");
var core_1 = require("@angular/core");
var index_1 = require("../../src/render3/index");
exports.NgForOf = common_1.NgForOf;
exports.NgIf = common_1.NgIf;
exports.NgTemplateOutlet = common_1.NgTemplateOutlet;
exports.NgForOf.ngDirectiveDef = index_1.defineDirective({
    type: common_1.NgForOf,
    selectors: [['', 'ngForOf', '']],
    factory: function () { return new common_1.NgForOf(index_1.injectViewContainerRef(), index_1.injectTemplateRef(), index_1.directiveInject(core_1.IterableDiffers)); },
    inputs: {
        ngForOf: 'ngForOf',
        ngForTrackBy: 'ngForTrackBy',
        ngForTemplate: 'ngForTemplate',
    }
});
exports.NgIf.ngDirectiveDef = index_1.defineDirective({
    type: common_1.NgIf,
    selectors: [['', 'ngIf', '']],
    factory: function () { return new common_1.NgIf(index_1.injectViewContainerRef(), index_1.injectTemplateRef()); },
    inputs: { ngIf: 'ngIf', ngIfThen: 'ngIfThen', ngIfElse: 'ngIfElse' }
});
exports.NgTemplateOutlet.ngDirectiveDef = index_1.defineDirective({
    type: common_1.NgTemplateOutlet,
    selectors: [['', 'ngTemplateOutlet', '']],
    factory: function () { return new common_1.NgTemplateOutlet(index_1.injectViewContainerRef()); },
    features: [index_1.NgOnChangesFeature],
    inputs: { ngTemplateOutlet: 'ngTemplateOutlet', ngTemplateOutletContext: 'ngTemplateOutletContext' }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29tbW9uX3dpdGhfZGVmLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvY29yZS90ZXN0L3JlbmRlcjMvY29tbW9uX3dpdGhfZGVmLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7O0FBRUgsMENBQWdIO0FBQ2hILHNDQUE4QztBQUU5QyxpREFBdUo7QUFFMUksUUFBQSxPQUFPLEdBQW1DLGdCQUFpQixDQUFDO0FBQzVELFFBQUEsSUFBSSxHQUEyQixhQUFjLENBQUM7QUFDOUMsUUFBQSxnQkFBZ0IsR0FBdUMseUJBQTBCLENBQUM7QUFFL0YsZUFBTyxDQUFDLGNBQWMsR0FBRyx1QkFBZSxDQUFDO0lBQ3ZDLElBQUksRUFBRSxnQkFBVTtJQUNoQixTQUFTLEVBQUUsQ0FBQyxDQUFDLEVBQUUsRUFBRSxTQUFTLEVBQUUsRUFBRSxDQUFDLENBQUM7SUFDaEMsT0FBTyxFQUFFLGNBQU0sT0FBQSxJQUFJLGdCQUFVLENBQ2hCLDhCQUFzQixFQUFFLEVBQUUseUJBQWlCLEVBQUUsRUFBRSx1QkFBZSxDQUFDLHNCQUFlLENBQUMsQ0FBQyxFQUQ5RSxDQUM4RTtJQUM3RixNQUFNLEVBQUU7UUFDTixPQUFPLEVBQUUsU0FBUztRQUNsQixZQUFZLEVBQUUsY0FBYztRQUM1QixhQUFhLEVBQUUsZUFBZTtLQUMvQjtDQUNGLENBQUMsQ0FBQztBQUVGLFlBQVksQ0FBQyxjQUFjLEdBQUcsdUJBQWUsQ0FBQztJQUM3QyxJQUFJLEVBQUUsYUFBTztJQUNiLFNBQVMsRUFBRSxDQUFDLENBQUMsRUFBRSxFQUFFLE1BQU0sRUFBRSxFQUFFLENBQUMsQ0FBQztJQUM3QixPQUFPLEVBQUUsY0FBTSxPQUFBLElBQUksYUFBTyxDQUFDLDhCQUFzQixFQUFFLEVBQUUseUJBQWlCLEVBQUUsQ0FBQyxFQUExRCxDQUEwRDtJQUN6RSxNQUFNLEVBQUUsRUFBQyxJQUFJLEVBQUUsTUFBTSxFQUFFLFFBQVEsRUFBRSxVQUFVLEVBQUUsUUFBUSxFQUFFLFVBQVUsRUFBQztDQUNuRSxDQUFDLENBQUM7QUFFRix3QkFBd0IsQ0FBQyxjQUFjLEdBQUcsdUJBQWUsQ0FBQztJQUN6RCxJQUFJLEVBQUUseUJBQW1CO0lBQ3pCLFNBQVMsRUFBRSxDQUFDLENBQUMsRUFBRSxFQUFFLGtCQUFrQixFQUFFLEVBQUUsQ0FBQyxDQUFDO0lBQ3pDLE9BQU8sRUFBRSxjQUFNLE9BQUEsSUFBSSx5QkFBbUIsQ0FBQyw4QkFBc0IsRUFBRSxDQUFDLEVBQWpELENBQWlEO0lBQ2hFLFFBQVEsRUFBRSxDQUFDLDBCQUFrQixDQUFDO0lBQzlCLE1BQU0sRUFDRixFQUFDLGdCQUFnQixFQUFFLGtCQUFrQixFQUFFLHVCQUF1QixFQUFFLHlCQUF5QixFQUFDO0NBQy9GLENBQUMsQ0FBQyJ9