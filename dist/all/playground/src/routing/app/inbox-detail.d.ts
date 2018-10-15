/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { ActivatedRoute } from '@angular/router';
import { DbService } from './inbox-app';
export declare class InboxDetailCmp {
    private record;
    private ready;
    constructor(db: DbService, route: ActivatedRoute);
}
export default class InboxDetailModule {
}
