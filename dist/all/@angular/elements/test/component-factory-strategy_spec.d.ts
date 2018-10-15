/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { ComponentFactory, ComponentRef, Injector, NgModuleRef, SimpleChanges, Type } from '@angular/core';
import { Subject } from 'rxjs';
export declare class FakeComponentWithoutNgOnChanges {
    output1: Subject<{}>;
    output2: Subject<{}>;
}
export declare class FakeComponent {
    output1: Subject<{}>;
    output2: Subject<{}>;
    simpleChanges: SimpleChanges[];
    ngOnChanges(simpleChanges: SimpleChanges): void;
}
export declare class FakeComponentFactory extends ComponentFactory<any> {
    componentRef: any;
    constructor();
    readonly selector: string;
    readonly componentType: Type<any>;
    readonly ngContentSelectors: string[];
    readonly inputs: {
        propName: string;
        templateName: string;
    }[];
    readonly outputs: {
        propName: string;
        templateName: string;
    }[];
    create(injector: Injector, projectableNodes?: any[][], rootSelectorOrNode?: string | any, ngModule?: NgModuleRef<any>): ComponentRef<any>;
}
