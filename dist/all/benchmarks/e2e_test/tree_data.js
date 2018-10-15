"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateBtn = '#createDom';
exports.DestroyBtn = '#destroyDom';
exports.DetectChangesBtn = '#detectChanges';
exports.RootEl = '#root';
exports.NumberOfChecksEl = '#numberOfChecks';
var CreateDestroyButtons = [exports.CreateBtn, exports.DestroyBtn];
var CreateDestroyDetectChangesButtons = CreateDestroyButtons.concat([exports.DetectChangesBtn]);
exports.Benchmarks = [
    {
        id: "deepTree.ng2",
        url: 'all/benchmarks/src/tree/ng2/index.html',
        buttons: CreateDestroyDetectChangesButtons,
    },
    {
        id: "deepTree.ng2.next",
        url: 'all/benchmarks/src/tree/ng2_next/index.html',
        buttons: CreateDestroyDetectChangesButtons,
        ignoreBrowserSynchronization: true,
        // Can't use bundles as we use non exported code
        extraParams: [{ name: 'bundles', value: false }]
    },
    {
        id: "deepTree.ng2.static",
        url: 'all/benchmarks/src/tree/ng2_static/index.html',
        buttons: CreateDestroyButtons,
    },
    {
        id: "deepTree.ng2_switch",
        url: 'all/benchmarks/src/tree/ng2_switch/index.html',
        buttons: CreateDestroyButtons,
    },
    {
        id: "deepTree.ng2.render3",
        url: 'all/benchmarks/src/tree/render3/index.html',
        buttons: CreateDestroyDetectChangesButtons,
        ignoreBrowserSynchronization: true,
    },
    {
        id: "deepTree.ng2.render3_function",
        url: 'all/benchmarks/src/tree/render3_function/index.html',
        buttons: CreateDestroyDetectChangesButtons,
        ignoreBrowserSynchronization: true,
    },
    {
        id: "deepTree.iv",
        url: 'all/benchmarks/src/tree/iv/index.html',
        buttons: CreateDestroyDetectChangesButtons,
        ignoreBrowserSynchronization: true,
    },
    {
        id: "deepTree.baseline",
        url: 'all/benchmarks/src/tree/baseline/index.html',
        buttons: CreateDestroyButtons,
        ignoreBrowserSynchronization: true,
    },
    {
        id: "deepTree.incremental_dom",
        url: 'all/benchmarks/src/tree/incremental_dom/index.html',
        buttons: CreateDestroyButtons,
        ignoreBrowserSynchronization: true,
    },
    {
        id: "deepTree.polymer",
        url: 'all/benchmarks/src/tree/polymer/index.html',
        buttons: CreateDestroyButtons,
        ignoreBrowserSynchronization: true,
    },
    {
        id: "deepTree.polymer_leaves",
        url: 'all/benchmarks/src/tree/polymer_leaves/index.html',
        buttons: CreateDestroyButtons,
        ignoreBrowserSynchronization: true,
    },
    {
        id: "deepTree.ng1",
        url: 'all/benchmarks/src/tree/ng1/index.html',
        buttons: CreateDestroyDetectChangesButtons,
    }
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHJlZV9kYXRhLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vbW9kdWxlcy9iZW5jaG1hcmtzL2UyZV90ZXN0L3RyZWVfZGF0YS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7OztHQU1HOztBQUlVLFFBQUEsU0FBUyxHQUFHLFlBQVksQ0FBQztBQUN6QixRQUFBLFVBQVUsR0FBRyxhQUFhLENBQUM7QUFDM0IsUUFBQSxnQkFBZ0IsR0FBRyxnQkFBZ0IsQ0FBQztBQUNwQyxRQUFBLE1BQU0sR0FBRyxPQUFPLENBQUM7QUFDakIsUUFBQSxnQkFBZ0IsR0FBRyxpQkFBaUIsQ0FBQztBQVVsRCxJQUFNLG9CQUFvQixHQUFhLENBQUMsaUJBQVMsRUFBRSxrQkFBVSxDQUFDLENBQUM7QUFDL0QsSUFBTSxpQ0FBaUMsR0FBaUIsb0JBQW9CLFNBQUUsd0JBQWdCLEVBQUMsQ0FBQztBQUVuRixRQUFBLFVBQVUsR0FBZ0I7SUFDckM7UUFDRSxFQUFFLEVBQUUsY0FBYztRQUNsQixHQUFHLEVBQUUsd0NBQXdDO1FBQzdDLE9BQU8sRUFBRSxpQ0FBaUM7S0FDM0M7SUFDRDtRQUNFLEVBQUUsRUFBRSxtQkFBbUI7UUFDdkIsR0FBRyxFQUFFLDZDQUE2QztRQUNsRCxPQUFPLEVBQUUsaUNBQWlDO1FBQzFDLDRCQUE0QixFQUFFLElBQUk7UUFDbEMsZ0RBQWdEO1FBQ2hELFdBQVcsRUFBRSxDQUFDLEVBQUMsSUFBSSxFQUFFLFNBQVMsRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFDLENBQUM7S0FDL0M7SUFDRDtRQUNFLEVBQUUsRUFBRSxxQkFBcUI7UUFDekIsR0FBRyxFQUFFLCtDQUErQztRQUNwRCxPQUFPLEVBQUUsb0JBQW9CO0tBQzlCO0lBQ0Q7UUFDRSxFQUFFLEVBQUUscUJBQXFCO1FBQ3pCLEdBQUcsRUFBRSwrQ0FBK0M7UUFDcEQsT0FBTyxFQUFFLG9CQUFvQjtLQUM5QjtJQUNEO1FBQ0UsRUFBRSxFQUFFLHNCQUFzQjtRQUMxQixHQUFHLEVBQUUsNENBQTRDO1FBQ2pELE9BQU8sRUFBRSxpQ0FBaUM7UUFDMUMsNEJBQTRCLEVBQUUsSUFBSTtLQUNuQztJQUNEO1FBQ0UsRUFBRSxFQUFFLCtCQUErQjtRQUNuQyxHQUFHLEVBQUUscURBQXFEO1FBQzFELE9BQU8sRUFBRSxpQ0FBaUM7UUFDMUMsNEJBQTRCLEVBQUUsSUFBSTtLQUNuQztJQUNEO1FBQ0UsRUFBRSxFQUFFLGFBQWE7UUFDakIsR0FBRyxFQUFFLHVDQUF1QztRQUM1QyxPQUFPLEVBQUUsaUNBQWlDO1FBQzFDLDRCQUE0QixFQUFFLElBQUk7S0FDbkM7SUFDRDtRQUNFLEVBQUUsRUFBRSxtQkFBbUI7UUFDdkIsR0FBRyxFQUFFLDZDQUE2QztRQUNsRCxPQUFPLEVBQUUsb0JBQW9CO1FBQzdCLDRCQUE0QixFQUFFLElBQUk7S0FDbkM7SUFDRDtRQUNFLEVBQUUsRUFBRSwwQkFBMEI7UUFDOUIsR0FBRyxFQUFFLG9EQUFvRDtRQUN6RCxPQUFPLEVBQUUsb0JBQW9CO1FBQzdCLDRCQUE0QixFQUFFLElBQUk7S0FDbkM7SUFDRDtRQUNFLEVBQUUsRUFBRSxrQkFBa0I7UUFDdEIsR0FBRyxFQUFFLDRDQUE0QztRQUNqRCxPQUFPLEVBQUUsb0JBQW9CO1FBQzdCLDRCQUE0QixFQUFFLElBQUk7S0FDbkM7SUFDRDtRQUNFLEVBQUUsRUFBRSx5QkFBeUI7UUFDN0IsR0FBRyxFQUFFLG1EQUFtRDtRQUN4RCxPQUFPLEVBQUUsb0JBQW9CO1FBQzdCLDRCQUE0QixFQUFFLElBQUk7S0FDbkM7SUFDRDtRQUNFLEVBQUUsRUFBRSxjQUFjO1FBQ2xCLEdBQUcsRUFBRSx3Q0FBd0M7UUFDN0MsT0FBTyxFQUFFLGlDQUFpQztLQUMzQztDQUNGLENBQUMifQ==