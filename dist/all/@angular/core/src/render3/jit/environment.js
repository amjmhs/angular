"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
var defs_1 = require("../../di/defs");
var injector_1 = require("../../di/injector");
var r3 = require("../index");
var sanitization = require("../../sanitization/sanitization");
/**
 * A mapping of the @angular/core API surface used in generated expressions to the actual symbols.
 *
 * This should be kept up to date with the public exports of @angular/core.
 */
exports.angularCoreEnv = {
    'ɵdefineComponent': r3.defineComponent,
    'ɵdefineDirective': r3.defineDirective,
    'defineInjectable': defs_1.defineInjectable,
    'defineInjector': defs_1.defineInjector,
    'ɵdefineNgModule': r3.defineNgModule,
    'ɵdefinePipe': r3.definePipe,
    'ɵdirectiveInject': r3.directiveInject,
    'inject': injector_1.inject,
    'ɵinjectAttribute': r3.injectAttribute,
    'ɵinjectChangeDetectorRef': r3.injectChangeDetectorRef,
    'ɵinjectElementRef': r3.injectElementRef,
    'ɵinjectTemplateRef': r3.injectTemplateRef,
    'ɵinjectViewContainerRef': r3.injectViewContainerRef,
    'ɵNgOnChangesFeature': r3.NgOnChangesFeature,
    'ɵInheritDefinitionFeature': r3.InheritDefinitionFeature,
    'ɵa': r3.a,
    'ɵb': r3.b,
    'ɵC': r3.C,
    'ɵcR': r3.cR,
    'ɵcr': r3.cr,
    'ɵd': r3.d,
    'ɵql': r3.ql,
    'ɵNH': r3.NH,
    'ɵNM': r3.NM,
    'ɵNS': r3.NS,
    'ɵE': r3.E,
    'ɵe': r3.e,
    'ɵEe': r3.Ee,
    'ɵf0': r3.f0,
    'ɵf1': r3.f1,
    'ɵf2': r3.f2,
    'ɵf3': r3.f3,
    'ɵf4': r3.f4,
    'ɵf5': r3.f5,
    'ɵf6': r3.f6,
    'ɵf7': r3.f7,
    'ɵf8': r3.f8,
    'ɵfV': r3.fV,
    'ɵi1': r3.i1,
    'ɵi2': r3.i2,
    'ɵi3': r3.i3,
    'ɵi4': r3.i4,
    'ɵi5': r3.i5,
    'ɵi6': r3.i6,
    'ɵi7': r3.i7,
    'ɵi8': r3.i8,
    'ɵiV': r3.iV,
    'ɵcp': r3.cp,
    'ɵL': r3.L,
    'ɵld': r3.ld,
    'ɵP': r3.P,
    'ɵp': r3.p,
    'ɵpb1': r3.pb1,
    'ɵpb2': r3.pb2,
    'ɵpb3': r3.pb3,
    'ɵpb4': r3.pb4,
    'ɵpbV': r3.pbV,
    'ɵpD': r3.pD,
    'ɵPp': r3.Pp,
    'ɵQ': r3.Q,
    'ɵqR': r3.qR,
    'ɵQr': r3.Qr,
    'ɵrS': r3.rS,
    'ɵs': r3.s,
    'ɵsm': r3.sm,
    'ɵsp': r3.sp,
    'ɵsa': r3.sa,
    'ɵT': r3.T,
    'ɵt': r3.t,
    'ɵV': r3.V,
    'ɵv': r3.v,
    'ɵzh': sanitization.sanitizeHtml,
    'ɵzs': sanitization.sanitizeStyle,
    'ɵzss': sanitization.defaultStyleSanitizer,
    'ɵzr': sanitization.sanitizeResourceUrl,
    'ɵzc': sanitization.sanitizeScript,
    'ɵzu': sanitization.sanitizeUrl
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZW52aXJvbm1lbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9jb3JlL3NyYy9yZW5kZXIzL2ppdC9lbnZpcm9ubWVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7OztHQU1HOztBQUVILHNDQUFnRTtBQUNoRSw4Q0FBeUM7QUFDekMsNkJBQStCO0FBQy9CLDhEQUFnRTtBQUdoRTs7OztHQUlHO0FBQ1UsUUFBQSxjQUFjLEdBQStCO0lBQ3hELGtCQUFrQixFQUFFLEVBQUUsQ0FBQyxlQUFlO0lBQ3RDLGtCQUFrQixFQUFFLEVBQUUsQ0FBQyxlQUFlO0lBQ3RDLGtCQUFrQixFQUFFLHVCQUFnQjtJQUNwQyxnQkFBZ0IsRUFBRSxxQkFBYztJQUNoQyxpQkFBaUIsRUFBRSxFQUFFLENBQUMsY0FBYztJQUNwQyxhQUFhLEVBQUUsRUFBRSxDQUFDLFVBQVU7SUFDNUIsa0JBQWtCLEVBQUUsRUFBRSxDQUFDLGVBQWU7SUFDdEMsUUFBUSxFQUFFLGlCQUFNO0lBQ2hCLGtCQUFrQixFQUFFLEVBQUUsQ0FBQyxlQUFlO0lBQ3RDLDBCQUEwQixFQUFFLEVBQUUsQ0FBQyx1QkFBdUI7SUFDdEQsbUJBQW1CLEVBQUUsRUFBRSxDQUFDLGdCQUFnQjtJQUN4QyxvQkFBb0IsRUFBRSxFQUFFLENBQUMsaUJBQWlCO0lBQzFDLHlCQUF5QixFQUFFLEVBQUUsQ0FBQyxzQkFBc0I7SUFDcEQscUJBQXFCLEVBQUUsRUFBRSxDQUFDLGtCQUFrQjtJQUM1QywyQkFBMkIsRUFBRSxFQUFFLENBQUMsd0JBQXdCO0lBQ3hELElBQUksRUFBRSxFQUFFLENBQUMsQ0FBQztJQUNWLElBQUksRUFBRSxFQUFFLENBQUMsQ0FBQztJQUNWLElBQUksRUFBRSxFQUFFLENBQUMsQ0FBQztJQUNWLEtBQUssRUFBRSxFQUFFLENBQUMsRUFBRTtJQUNaLEtBQUssRUFBRSxFQUFFLENBQUMsRUFBRTtJQUNaLElBQUksRUFBRSxFQUFFLENBQUMsQ0FBQztJQUNWLEtBQUssRUFBRSxFQUFFLENBQUMsRUFBRTtJQUNaLEtBQUssRUFBRSxFQUFFLENBQUMsRUFBRTtJQUNaLEtBQUssRUFBRSxFQUFFLENBQUMsRUFBRTtJQUNaLEtBQUssRUFBRSxFQUFFLENBQUMsRUFBRTtJQUNaLElBQUksRUFBRSxFQUFFLENBQUMsQ0FBQztJQUNWLElBQUksRUFBRSxFQUFFLENBQUMsQ0FBQztJQUNWLEtBQUssRUFBRSxFQUFFLENBQUMsRUFBRTtJQUNaLEtBQUssRUFBRSxFQUFFLENBQUMsRUFBRTtJQUNaLEtBQUssRUFBRSxFQUFFLENBQUMsRUFBRTtJQUNaLEtBQUssRUFBRSxFQUFFLENBQUMsRUFBRTtJQUNaLEtBQUssRUFBRSxFQUFFLENBQUMsRUFBRTtJQUNaLEtBQUssRUFBRSxFQUFFLENBQUMsRUFBRTtJQUNaLEtBQUssRUFBRSxFQUFFLENBQUMsRUFBRTtJQUNaLEtBQUssRUFBRSxFQUFFLENBQUMsRUFBRTtJQUNaLEtBQUssRUFBRSxFQUFFLENBQUMsRUFBRTtJQUNaLEtBQUssRUFBRSxFQUFFLENBQUMsRUFBRTtJQUNaLEtBQUssRUFBRSxFQUFFLENBQUMsRUFBRTtJQUNaLEtBQUssRUFBRSxFQUFFLENBQUMsRUFBRTtJQUNaLEtBQUssRUFBRSxFQUFFLENBQUMsRUFBRTtJQUNaLEtBQUssRUFBRSxFQUFFLENBQUMsRUFBRTtJQUNaLEtBQUssRUFBRSxFQUFFLENBQUMsRUFBRTtJQUNaLEtBQUssRUFBRSxFQUFFLENBQUMsRUFBRTtJQUNaLEtBQUssRUFBRSxFQUFFLENBQUMsRUFBRTtJQUNaLEtBQUssRUFBRSxFQUFFLENBQUMsRUFBRTtJQUNaLEtBQUssRUFBRSxFQUFFLENBQUMsRUFBRTtJQUNaLEtBQUssRUFBRSxFQUFFLENBQUMsRUFBRTtJQUNaLEtBQUssRUFBRSxFQUFFLENBQUMsRUFBRTtJQUNaLElBQUksRUFBRSxFQUFFLENBQUMsQ0FBQztJQUNWLEtBQUssRUFBRSxFQUFFLENBQUMsRUFBRTtJQUNaLElBQUksRUFBRSxFQUFFLENBQUMsQ0FBQztJQUNWLElBQUksRUFBRSxFQUFFLENBQUMsQ0FBQztJQUNWLE1BQU0sRUFBRSxFQUFFLENBQUMsR0FBRztJQUNkLE1BQU0sRUFBRSxFQUFFLENBQUMsR0FBRztJQUNkLE1BQU0sRUFBRSxFQUFFLENBQUMsR0FBRztJQUNkLE1BQU0sRUFBRSxFQUFFLENBQUMsR0FBRztJQUNkLE1BQU0sRUFBRSxFQUFFLENBQUMsR0FBRztJQUNkLEtBQUssRUFBRSxFQUFFLENBQUMsRUFBRTtJQUNaLEtBQUssRUFBRSxFQUFFLENBQUMsRUFBRTtJQUNaLElBQUksRUFBRSxFQUFFLENBQUMsQ0FBQztJQUNWLEtBQUssRUFBRSxFQUFFLENBQUMsRUFBRTtJQUNaLEtBQUssRUFBRSxFQUFFLENBQUMsRUFBRTtJQUNaLEtBQUssRUFBRSxFQUFFLENBQUMsRUFBRTtJQUNaLElBQUksRUFBRSxFQUFFLENBQUMsQ0FBQztJQUNWLEtBQUssRUFBRSxFQUFFLENBQUMsRUFBRTtJQUNaLEtBQUssRUFBRSxFQUFFLENBQUMsRUFBRTtJQUNaLEtBQUssRUFBRSxFQUFFLENBQUMsRUFBRTtJQUNaLElBQUksRUFBRSxFQUFFLENBQUMsQ0FBQztJQUNWLElBQUksRUFBRSxFQUFFLENBQUMsQ0FBQztJQUNWLElBQUksRUFBRSxFQUFFLENBQUMsQ0FBQztJQUNWLElBQUksRUFBRSxFQUFFLENBQUMsQ0FBQztJQUVWLEtBQUssRUFBRSxZQUFZLENBQUMsWUFBWTtJQUNoQyxLQUFLLEVBQUUsWUFBWSxDQUFDLGFBQWE7SUFDakMsTUFBTSxFQUFFLFlBQVksQ0FBQyxxQkFBcUI7SUFDMUMsS0FBSyxFQUFFLFlBQVksQ0FBQyxtQkFBbUI7SUFDdkMsS0FBSyxFQUFFLFlBQVksQ0FBQyxjQUFjO0lBQ2xDLEtBQUssRUFBRSxZQUFZLENBQUMsV0FBVztDQUNoQyxDQUFDIn0=