/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { Type } from '@angular/core';
import { Data, ResolveData, Route } from '../src/config';
import { ActivatedRouteSnapshot } from '../src/router_state';
import { Params } from '../src/shared';
import { UrlSegment, UrlSegmentGroup } from '../src/url_tree';
export declare class Logger {
    logs: string[];
    add(thing: string): void;
    empty(): void;
}
export declare function provideTokenLogger(token: string, returnValue?: boolean): {
    provide: string;
    useFactory: (logger: Logger) => () => boolean;
    deps: (typeof Logger)[];
};
export declare type ARSArgs = {
    url?: UrlSegment[];
    params?: Params;
    queryParams?: Params;
    fragment?: string;
    data?: Data;
    outlet?: string;
    component: Type<any> | string | null;
    routeConfig?: Route | null;
    urlSegment?: UrlSegmentGroup;
    lastPathIndex?: number;
    resolve?: ResolveData;
};
export declare function createActivatedRouteSnapshot(args: ARSArgs): ActivatedRouteSnapshot;
