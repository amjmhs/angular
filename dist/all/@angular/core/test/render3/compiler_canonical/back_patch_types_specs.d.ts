/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { NgModuleFactory } from '../../../src/core';
export declare type $ComponentDef$ = any;
export declare class LibAComponent {
}
export declare class LibAModule {
}
export declare class LibBComponent {
    static ngComponentDef: $ComponentDef$;
}
export declare class LibBModule {
    static ngInjectorDef: never;
}
export declare class AppComponent {
    static ngComponentDef: $ComponentDef$;
}
export declare class AppModule {
    static ngInjectorDef: never;
}
export declare const AppModuleFactory: NgModuleFactory<AppModule> & {
    patchedDeps: boolean;
};
