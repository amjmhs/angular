/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { PipeResolver } from '@angular/compiler';
export class MockPipeResolver extends PipeResolver {
    /**
     * @param {?} refector
     */
    constructor(refector) {
        super(refector);
        this._pipes = new Map();
    }
    /**
     * Overrides the {\@link Pipe} for a pipe.
     * @param {?} type
     * @param {?} metadata
     * @return {?}
     */
    setPipe(type, metadata) { this._pipes.set(type, metadata); }
    /**
     * Returns the {\@link Pipe} for a pipe:
     * - Set the {\@link Pipe} to the overridden view when it exists or fallback to the
     * default
     * `PipeResolver`, see `setPipe`.
     * @param {?} type
     * @param {?=} throwIfNotFound
     * @return {?}
     */
    resolve(type, throwIfNotFound = true) {
        /** @type {?} */
        let metadata = this._pipes.get(type);
        if (!metadata) {
            metadata = /** @type {?} */ ((super.resolve(type, throwIfNotFound)));
        }
        return metadata;
    }
}
if (false) {
    /** @type {?} */
    MockPipeResolver.prototype._pipes;
}
//# sourceMappingURL=pipe_resolver_mock.js.map