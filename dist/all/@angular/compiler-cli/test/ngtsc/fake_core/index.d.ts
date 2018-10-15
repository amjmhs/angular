/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
interface FnWithArg<T> {
    (...args: any[]): T;
    new (...args: any[]): T;
}
export declare const Component: FnWithArg<(clazz: any) => any>;
export declare const Directive: FnWithArg<(clazz: any) => any>;
export declare const Injectable: FnWithArg<(clazz: any) => any>;
export declare const NgModule: FnWithArg<(clazz: any) => any>;
export declare const Pipe: FnWithArg<(clazz: any) => any>;
export declare const Attribute: FnWithArg<(a: any, b: any, c: any) => void>;
export declare const Inject: FnWithArg<(a: any, b: any, c: any) => void>;
export declare const Self: FnWithArg<(a: any, b: any, c: any) => void>;
export declare const SkipSelf: FnWithArg<(a: any, b: any, c: any) => void>;
export declare const Optional: FnWithArg<(a: any, b: any, c: any) => void>;
export declare const ContentChild: FnWithArg<(a: any, b: any) => any>;
export declare const ContentChildren: FnWithArg<(a: any, b: any) => any>;
export declare const HostBinding: FnWithArg<(a: any, b: any) => any>;
export declare const HostListener: FnWithArg<(a: any, b: any) => any>;
export declare const ViewChild: FnWithArg<(a: any, b: any) => any>;
export declare const ViewChildren: FnWithArg<(a: any, b: any) => any>;
export declare type ModuleWithProviders<T> = any;
export declare class ChangeDetectorRef {
}
export declare class ElementRef {
}
export declare class Injector {
}
export declare class TemplateRef {
}
export declare class ViewContainerRef {
}
export {};
